(() => {
  'use strict';
  const majors = window.ROADMAP_DATA || [];
  const seeds = window.ROADMAP_TOPICS || {};
  const courses = majors.flatMap(m => m.courses);
  const courseById = new Map(courses.map(c => [c.id, c]));
  const majorById = new Map(majors.map(m => [m.id, m]));
  const KEY = 'embodied-atlas-v5';
  const OLD_KEY = 'embodied-ai-fullstack-learning-v1';
  const $ = id => document.getElementById(id);
  const main = $('mainPane'), inspector = $('inspector'), nav = $('majorNav');
  const icons = { overview:'grid', course:'book', graph:'graph', project:'spark' };
  const NS='http://www.w3.org/2000/svg';
  let courseId=null, majorId=null, tab='modules', selectedPoint=null, expandedModule=null;
  let expandedMajor=null, graphExpanded=new Set(), searchQuery='', graphTransform={k:.88,x:3,y:24};
  let renderToastTimer, serial=0;
  let state={completed:{},overrides:{},notes:{},theme:'light',lastCourse:null};

  const e=(tag, cls='', text=null)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==null)n.textContent=String(text);return n;};
  function icon(name,cls='icon'){const svg=document.createElementNS(NS,'svg');svg.setAttribute('class',cls);svg.setAttribute('aria-hidden','true');const use=document.createElementNS(NS,'use');use.setAttribute('href','#i-'+name);svg.append(use);return svg;}
  function btn(label,cls,fn){const b=e('button',cls);b.type='button';if(Array.isArray(label))b.append(...label);else if(label)b.append(label);if(fn)b.addEventListener('click',fn);return b;}
  function iconBtn(name,title,fn,cls='icon-btn'){const b=btn(null,cls,fn);b.title=title;b.setAttribute('aria-label',title);b.append(icon(name));return b;}
  function link(label,url,cls=''){if(typeof url!=='string'||!/^https?:\/\//i.test(url))return e('span','small-note','未配置参考链接');const a=e('a',cls,label);a.href=url;a.target='_blank';a.rel='noopener noreferrer';return a;}
  function toast(message){const n=$('toast');n.textContent=message;n.classList.add('show');clearTimeout(renderToastTimer);renderToastTimer=setTimeout(()=>n.classList.remove('show'),2800);}
  function clampName(x){return String(x||'').trim().slice(0,100);}
  const clone = obj => JSON.parse(JSON.stringify(obj));

  // V4 compatibility: converts Chapter -> Section -> Point into Module -> Point.
  function normalizeTree(cid,tree){
    if(!Array.isArray(tree))return clone(seeds[cid]||[]);
    const flat=(node,prefix='')=>{
      const children=Array.isArray(node.children)?node.children:[];
      if(!children.length)return [{id:node.id,title:prefix+node.title,children:[]}];
      return children.flatMap(child=>flat(child,prefix+((child.children||[]).length?child.title+' · ':'')));
    };
    const result=[];
    for(const n of tree){
      if(!n||typeof n.id!=='string'||typeof n.title!=='string')continue;
      if(cid==='01-01'&&(n.title==='微分学'||n.title==='积分学')&&Array.isArray(n.children)){
        for(const group of n.children){result.push({id:group.id,title:group.title,children:flat(group)});}
      }else if(!(n.children||[]).length){
        result.push({id:n.id+'-module',title:n.title,children:[{id:n.id,title:n.title,children:[]}]});
      }else result.push({id:n.id,title:n.title,children:flat(n)});
    }
    return result;
  }
  function notesFromLegacy(root,output){function walk(arr){for(const n of arr||[]){if(n.notes||n.url)output[n.id]={text:n.notes||'',url:n.url||''};walk(n.children||[]);}}walk(root);}
  function readState(){
    try{
      const newer=JSON.parse(localStorage.getItem(KEY)||'null');
      if(newer&&newer.version===5){state={...state,completed:newer.completed||{},overrides:newer.overrides||{},notes:newer.notes||{},theme:newer.theme==='dark'?'dark':'light',lastCourse:newer.lastCourse||null};return;}
      const old=JSON.parse(localStorage.getItem(OLD_KEY)||'null');
      if(old){
        state.completed=Object.fromEntries(Object.entries(old.progress||{}).filter(([k,v])=>v==='done').map(([k])=>[k,true]));
        for(const [cid,tree] of Object.entries(old.customTopics||{}))if(courseById.has(cid)){state.overrides[cid]=normalizeTree(cid,tree);notesFromLegacy(tree,state.notes);}
        save();toast('已自动读取旧版学习记录');
      }
    }catch(err){toast('无法读取浏览器存储，请导入进度备份');}
  }
  function save(){try{localStorage.setItem(KEY,JSON.stringify({version:5,...state}));}catch(err){toast('保存失败，请导出备份以防丢失');}}
  const modulesOf=cid=>state.overrides[cid]||seeds[cid]||[];
  const allPoints=cid=>modulesOf(cid).flatMap(m=>m.children||[]);
  function countPoints(points){let done=0;for(const p of points)if(state.completed[p.id])done++;return {done,total:points.length,pct:points.length?Math.round(done*100/points.length):0};}
  const moduleStats=m=>countPoints(m.children||[]);
  const courseStats=cid=>countPoints(allPoints(cid));
  const majorStats=m=>countPoints(m.courses.flatMap(c=>allPoints(c.id)));
  const overallStats=()=>countPoints(courses.flatMap(c=>allPoints(c.id)));
  function findPoint(id){for(const c of courses)for(const m of modulesOf(c.id))for(const p of m.children||[])if(p.id===id)return {c,m,p};return null;}
  function findModule(cid,id){return modulesOf(cid).find(x=>x.id===id);}
  function freshId(cid){serial++;return `${cid}-custom-${Date.now().toString(36)}-${serial}`;}
  function modifyTree(cid,fn){const next=clone(modulesOf(cid));fn(next);state.overrides[cid]=next;save();render(true);}
  function setComplete(id,value){state.completed[id]=!!value;save();render(true);}
  function toggleComplete(id){setComplete(id,!state.completed[id]);}
  function addModule(){if(!courseId)return;const name=clampName(prompt('新的一级知识模块名称：'));if(!name)return;const id=freshId(courseId);modifyTree(courseId,list=>list.push({id,title:name,children:[]}));expandedModule=id;toast('已添加一级知识模块');render(true);}
  function addPoint(mid){const name=clampName(prompt('新的二级知识点名称：'));if(!name)return;const id=freshId(courseId);modifyTree(courseId,list=>{const m=list.find(x=>x.id===mid);if(m)m.children.push({id,title:name,children:[]});});expandedModule=mid;selectedPoint=id;render(true);toast('已添加二级知识点');}
  function renameModule(mid){const n=findModule(courseId,mid);if(!n)return;const name=clampName(prompt('修改一级知识模块名称：',n.title));if(!name||name===n.title)return;modifyTree(courseId,list=>{list.find(x=>x.id===mid).title=name;});toast('模块名称已更新');}
  function deleteModule(mid){const n=findModule(courseId,mid);if(!n)return;if(!confirm(`确定删除「${n.title}」及其所有知识点？此操作会影响课程进度。`))return;modifyTree(courseId,list=>{const i=list.findIndex(x=>x.id===mid);if(i>=0)list.splice(i,1);});if(expandedModule===mid)expandedModule=null;selectedPoint=null;render(true);toast('模块已删除');}
  function pointAction(pid){const found=findPoint(pid);if(!found)return;const value=prompt(`管理「${found.p.title}」\n输入 1 重命名，输入 2 删除：`,'1');if(value==='1'){
      const name=clampName(prompt('修改二级知识点名称：',found.p.title));if(!name)return;
      modifyTree(found.c.id,list=>{const x=list.find(m=>m.id===found.m.id).children.find(p=>p.id===pid);x.title=name;});toast('知识点名称已更新');
    }else if(value==='2'){
      if(!confirm('确定删除该知识点及其学习记录吗？'))return;
      modifyTree(found.c.id,list=>{const ch=list.find(m=>m.id===found.m.id).children;ch.splice(ch.findIndex(p=>p.id===pid),1);});
      delete state.completed[pid];delete state.notes[pid];save();if(selectedPoint===pid)selectedPoint=null;render(true);toast('知识点已删除');
    }
  }
  function markModule(mid,target){const m=findModule(courseId,mid);if(!m)return;for(const p of m.children||[])state.completed[p.id]=target;save();render(true);toast(target?'当前模块已全部勾选':'当前模块已重新设为未完成');}
  function switchTheme(){state.theme=state.theme==='light'?'dark':'light';document.documentElement.dataset.theme=state.theme;const t=$('themeBtn');t.replaceChildren(icon(state.theme==='light'?'moon':'sun'));save();}
  function openCourse(cid,updateHash=true){if(!courseById.has(cid))return;courseId=cid;majorId=courseById.get(cid).major_id;expandedMajor=majorId;state.lastCourse=cid;save();tab='modules';selectedPoint=null;expandedModule=modulesOf(cid)[0]?.id||null;graphExpanded=new Set();searchQuery='';$('searchInput').value='';closeSidebar();if(updateHash)history.replaceState(null,'','#course='+encodeURIComponent(cid));render();main.scrollTop=0;}
  function openMajor(mid){if(!majorById.has(mid))return;courseId=null;majorId=mid;expandedMajor=mid;tab='modules';selectedPoint=null;searchQuery='';$('searchInput').value='';history.replaceState(null,'','#major='+encodeURIComponent(mid));closeSidebar();render();main.scrollTop=0;}
  function goHome(){courseId=null;majorId=null;selectedPoint=null;searchQuery='';$('searchInput').value='';history.replaceState(null,'',location.pathname+location.search);closeSidebar();render();main.scrollTop=0;}

  function progressBar(s,cls='track'){const track=e('div',cls);const span=e('span');span.style.width=s.pct+'%';track.append(span);return track;}
  function makeTag(text){return e('span','tag',text);}
  function makeSectionHeading(title,sub){const row=e('div','section-heading');const left=e('div');left.append(e('h2','',title),e('p','',sub));row.append(left);return row;}
  function renderNav(){nav.replaceChildren();$('homeNav').classList.toggle('active',!courseId&&!majorId);for(const m of majors){
    const row=btn(null,'major-nav'+(m.id===majorId?' active':''),()=>{
      if(m.id===majorId&&!courseId){expandedMajor=expandedMajor===m.id?null:m.id;renderNav();}
      else openMajor(m.id);
    });row.append(e('span','major-title',m.name),e('span','side-num',majorStats(m).pct+'%'));nav.append(row);
    if(expandedMajor===m.id){for(const c of m.courses){const sub=btn(null,'course-nav'+(courseId===c.id?' active':''),()=>openCourse(c.id));sub.append(e('span','',c.name),e('span','progress-dot',courseStats(c.id).pct+'%'));nav.append(sub);}}
  }}
  function renderTop(){const c=courseById.get(courseId),m=majorById.get(majorId);$('crumb').textContent=c?c.name:m?m.name:'总览';}
  function render(preserve=false){const y=preserve?main.scrollTop:0;renderNav();renderTop();main.replaceChildren();inspector.replaceChildren();if(courseId)renderCourse();else renderOverview();renderInspector();if(preserve)main.scrollTop=y;}

  function renderOverview(){const focus=majorId?majorById.get(majorId):null;const overall=focus?majorStats(focus):overallStats();const hero=e('section','hero');hero.append(e('span','hero-badge','✦  BUILD · LEARN · CREATE'));
    const heading=e('h1','h1');if(focus){heading.append('探索 ',e('span','gradient-text',focus.name));}else heading.append('从知识，走向',e('span','gradient-text','真实机器人。'));
    hero.append(heading,e('p','desc',focus?`系统学习 ${focus.courses.length} 门专业课程，每门课程都拆分为一级模块与可 Check 的二级知识点。`:'以 10 个专业、65 门课程为骨架，用可追踪的知识模块与真实机器人项目，构建从 0 到 1 的具身全栈能力。'));main.append(hero);
    const summary=e('section','overview-stats');for(const [l,v,suffix] of [['专业领域',focus?1:10,''],['专业课程',focus?focus.courses.length:courses.length,''],['知识模块',focus?focus.courses.reduce((n,c)=>n+modulesOf(c.id).length,0):courses.reduce((n,c)=>n+modulesOf(c.id).length,0),''],['学习进度',overall.pct,'%']]){const box=e('div','stat-card');box.append(e('span','label',l));const n=e('strong','',v);if(suffix)n.append(e('span','',suffix));box.append(n);summary.append(box);}main.append(summary);
    const q=searchQuery.toLowerCase();
    if(focus){const head=makeSectionHeading('课程目录',`已掌握 ${overall.done} / ${overall.total} 个知识点`);head.append(btn('返回总览','text-btn',goHome));main.append(head);const grid=e('div','major-grid');let matched=0;for(const c of focus.courses){if(!matchesCourse(c,q))continue;matched++;grid.append(courseTile(c));}main.append(matched?grid:e('div','empty-state','没有找到匹配的课程或知识点'));return;}
    const head=makeSectionHeading('专业领域','选择专业，展开课程与知识模块');main.append(head);
    const grid=e('div','major-grid');let matchCount=0;for(const m of majors){if(q&&!m.name.toLowerCase().includes(q)&&!m.courses.some(c=>matchesCourse(c,q)))continue;matchCount++;const s=majorStats(m);const card=btn(null,'major-card',()=>openMajor(m.id));const top=e('div','major-card-top');const sym=e('span','major-symbol');sym.append(icon(m.id==='04'?'spark':m.id==='05'?'graph':m.id==='03'?'git':'layers'));top.append(sym,e('span','major-card-meta',m.courses.length+' 门课程'));card.append(top,e('strong','',m.name),progressBar(s));const foot=e('div','card-foot');foot.append(e('span','',`${s.done} / ${s.total} 知识点`),e('b','',s.pct+'%'));card.append(foot);grid.append(card);}main.append(matchCount?grid:e('div','empty-state','没有找到匹配的专业或课程'));
    const projectRow=makeSectionHeading('学习主线','从基础理论到自主机器人');main.append(projectRow);
    const flow=e('div','project-card');flow.append(e('span','project-pill','THREE GENERATIONS'),e('h3','','第一代移动机器人 → 第二代移动操作机器人 → 第三代具身学习平台'),e('p','','把课程中的算法、硬件与工程项目逐步组装进同一套机器人，最终形成可展示、可测量、可复现的作品集。'));main.append(flow);
  }
  function matchesCourse(c,q){if(!q)return true;const parts=[c.name,c.capstone?.name||'',c.robot?.name||'',...modulesOf(c.id).flatMap(m=>[m.title,...(m.children||[]).map(p=>p.title)])];return parts.some(x=>x.toLowerCase().includes(q));}
  function courseTile(c){const s=courseStats(c.id);const card=btn(null,'major-card course-tile',()=>openCourse(c.id));const top=e('div','major-card-top');const sym=e('span','major-symbol');sym.append(icon('book'));top.append(sym,e('span','major-card-meta',modulesOf(c.id).length+' 个知识模块'));card.append(top,e('strong','',c.name),progressBar(s));const foot=e('div','card-foot');foot.append(e('span','',`${s.done} / ${s.total} 知识点`),e('b','',s.pct+'%'));card.append(foot);return card;}

  function renderCourse(){const c=courseById.get(courseId),mods=modulesOf(courseId),s=courseStats(courseId);const back=btn(null,'back-btn',()=>openMajor(c.major_id));back.append(icon('left'),' '+c.major);main.append(back);
    const hero=e('section','course-hero');const left=e('div');left.append(e('span','eyebrow','COURSE / '+courseId),e('h1','h1',c.name),e('p','desc','学完每一个知识点，再将理论用于结课作品与机器人模块。'));
    const tags=e('div','course-meta');tags.append(makeTag(mods.length+' 个一级模块'),makeTag(s.total+' 个二级知识点'),makeTag(s.done+' 个已完成'));left.append(tags);hero.append(left);
    const ring=e('div','big-ring');ring.style.setProperty('--v',s.pct);const ringText=e('div','ring-content');ringText.append(e('strong','',s.pct+'%'),e('span','','课程完成度'));ring.append(ringText);hero.append(ring);main.append(hero);
    const bar=e('div','toolbar-row');const seg=e('div','segmented');for(const [id,label,ico] of [['modules','知识模块','layers'],['graph','知识图谱','graph'],['projects','项目实践','spark']]){const b=btn(null,tab===id?'active':'',()=>{tab=id;render(true);});b.append(icon(ico),label);seg.append(b);}bar.append(seg);if(tab==='modules')bar.append(btn([icon('plus'),'新增一级模块'],'solid-btn',addModule));main.append(bar);
    if(tab==='projects'){renderProjects(c);return;}
    if(tab==='graph'){renderGraph(c);return;}
    const q=searchQuery.toLowerCase();const show=mods.filter(m=>!q||c.name.toLowerCase().includes(q)||m.title.toLowerCase().includes(q)||(m.children||[]).some(p=>p.title.toLowerCase().includes(q)));
    const head=makeSectionHeading('学习模块',`每完成一个二级知识点，一级模块与课程进度会自动更新 · ${s.done}/${s.total}`);main.append(head);
    const grid=e('div','modules-grid');for(let i=0;i<mods.length;i++){const m=mods[i];if(!show.includes(m))continue;grid.append(renderModuleCard(m,i,q));}main.append(show.length?grid:e('div','empty-state','没有匹配的知识模块，尝试其他关键词'));
    main.append(e('p','small-note','提示：点选知识点标题可在右侧记录学习笔记和资料链接。进度自动保存在当前浏览器；可通过右上角按钮导出 JSON 备份。'));
  }
  function renderModuleCard(m,i,q){const s=moduleStats(m),expanded=expandedModule===m.id||!!q;const card=e('article','module-card'+(expanded?' expanded':''));const h=btn(null,'module-head',()=>{expandedModule=expandedModule===m.id?null:m.id;selectedPoint=null;render(true);});const top=e('div','module-head-top');top.append(e('span','module-index',`MODULE ${String(i+1).padStart(2,'0')}`),e('span','module-pct',s.pct+'%'));h.append(top,e('h3','',m.title));const hint=e('div','module-hint');hint.append(e('span','',`${s.done} / ${s.total} 已完成`),icon('chevron'));h.append(hint,progressBar(s));card.append(h);
    if(expanded){const body=e('div','module-body');const list=(m.children||[]).filter(p=>!q||m.title.toLowerCase().includes(q)||p.title.toLowerCase().includes(q)||courseById.get(courseId).name.toLowerCase().includes(q));for(const p of list){const row=e('div','knowledge-item'+(state.completed[p.id]?' done':''));const check=btn(icon('check'),'knowledge-check'+(state.completed[p.id]?' checked':''),()=>toggleComplete(p.id));check.setAttribute('aria-label',(state.completed[p.id]?'取消完成：':'标记完成：')+p.title);check.setAttribute('aria-pressed',String(!!state.completed[p.id]));const title=btn(p.title,'knowledge-title',()=>{selectedPoint=p.id;renderInspector();});const more=iconBtn('more','管理知识点',()=>pointAction(p.id),'item-ellipsis');row.append(check,title,more);body.append(row);}
      if(!m.children?.length)body.append(e('p','small-note','这个模块还没有二级知识点，点击下方按钮添加。'));
      const actions=e('div','module-actions');actions.append(btn([icon('plus'),'添加知识点'],'text-btn',()=>addPoint(m.id)));actions.append(btn('改名','text-btn',()=>renameModule(m.id)));actions.append(btn('删除','text-btn',()=>deleteModule(m.id)));
      if(s.total&&s.done!==s.total)actions.append(btn('全部勾选','text-btn',()=>markModule(m.id,true)));if(s.done)actions.append(btn('重置勾选','text-btn',()=>{if(confirm('确定清除当前模块的完成标记？'))markModule(m.id,false);}));body.append(actions);card.append(body);
    }return card;}
  function renderProjects(c){const head=makeSectionHeading('项目实践','用两份实际作品证明对这门课程的掌握');main.append(head);const items=[['01 / CAPSTONE','趣味结课大项目',c.capstone,'结合理论与可视化，独立实现并用实验数据验证。'],['02 / ROBOT MODULE','机器人模块项目',c.robot,'形成可以集成到真实机器人上的功能模块。']];for(const [eyebrow,name,obj,desc] of items){const card=e('article','project-card');card.append(e('span','project-pill',eyebrow),e('h3','',obj.name),e('p','',desc));if(obj.acceptance)card.append(e('p','',`验收建议：${obj.acceptance}`));const external=link((obj.reference||'开源项目')+' · 查看参考仓库 ↗',obj.url);card.append(external);main.append(card);}main.append(e('p','small-note','GitHub 仓库仅作为参考来源；结课作品需要独立实现、提供实验数据和明确的个人贡献。'));}

  function renderInspector(){inspector.replaceChildren();if(courseId)renderCourseInspector();else renderOverviewInspector();}
  function renderOverviewInspector(){const target=majorId?majorById.get(majorId):null;const s=target?majorStats(target):overallStats();const focus=e('div','focus-card');focus.append(e('span','inspector-label','YOUR PROGRESS'),e('h2','',target?target.name:'今天，继续前进。'),e('p','',target?'每个专业的学习进度由所有课程的二级知识点自动计算。':'从一个 Check 开始。每个勾选都代表一个真正掌握的知识点。'));
    const row=e('div','stats-inline');row.append(e('strong','',s.pct+'%'),e('small','',s.done+' / '+s.total+' 已完成'));focus.append(row,progressBar(s));inspector.append(focus);
    inspector.append(e('h3','inspector-h3',target?'该专业课程':'继续学习'));
    let todo=target?target.courses:courses;const inProgress=todo.filter(c=>courseStats(c.id).done>0).sort((a,b)=>courseStats(b.id).pct-courseStats(a.id).pct);const featured=inProgress.length?inProgress.slice(0,4):todo.slice(0,4);
    for(const c of featured){const ss=courseStats(c.id);const item=btn(null,'inspector-course',()=>openCourse(c.id));const row=e('div','row');row.append(e('span','',c.name),e('span','',ss.pct+'%'));item.append(row,progressBar(ss));inspector.append(item);}
    const tip=e('div','inspector-tip');tip.append(e('strong','','一点点积累，也会产生复利。'),e('span','','建议每次集中推进 1–2 门课程，并将所学知识应用到机器人模块中。'));inspector.append(tip);
  }
  function renderCourseInspector(){const c=courseById.get(courseId),s=courseStats(courseId);if(selectedPoint&&findPoint(selectedPoint)?.c.id===courseId){renderPointInspector();return;}
    const focus=e('div','focus-card');focus.append(e('span','inspector-label','COURSE PROGRESS'),e('h2','',c.name),e('p','','按照模块完成学习任务。所有一级模块进度会根据二级知识点的 Check 结果实时更新。'));
    const row=e('div','stats-inline');row.append(e('strong','',s.pct+'%'),e('small','',s.done+' / '+s.total+' 已完成'));focus.append(row,progressBar(s));inspector.append(focus);
    inspector.append(e('h3','inspector-h3','模块进度'));
    for(const m of modulesOf(courseId)){const ss=moduleStats(m);const item=btn(null,'inspector-course',()=>{expandedModule=m.id;tab='modules';render(true);});const r=e('div','row');r.append(e('span','',m.title),e('span','',ss.pct+'%'));item.append(r,progressBar(ss));inspector.append(item);}
    const tip=e('div','inspector-tip');tip.append(e('strong','','把知识变成作品。'),e('span','','完成课程模块后，切换到「项目实践」，挑战趣味结课作品，并将技能接入你的机器人。'));inspector.append(tip);
  }
  function renderPointInspector(){const f=findPoint(selectedPoint);if(!f)return;const {p,m}=f,done=!!state.completed[p.id];const top=btn([icon('left'),'返回课程概览'],'back-btn',()=>{selectedPoint=null;renderInspector();});inspector.append(top);
    const panel=e('div','point-inspector');panel.append(e('span','inspector-label','LEARNING NOTE'),e('h3','',p.title),e('p','small-note',`${m.title} · ${f.c.name}`));
    const status=e('div','point-status');const check=btn(icon('check'),'knowledge-check'+(done?' checked':''),()=>toggleComplete(p.id));check.setAttribute('aria-label',done?'取消完成':'标记完成');check.setAttribute('aria-pressed',String(done));status.append(check,e('span','',done?'已完成':'尚未完成'));panel.append(status);
    const note=state.notes[p.id]||{};const label=e('label','','学习笔记');label.htmlFor='noteText';const textarea=e('textarea');textarea.id='noteText';textarea.placeholder='记录定义、推导、错题、项目应用…';textarea.value=note.text||'';
    const ulabel=e('label','','学习资料链接');ulabel.htmlFor='noteUrl';const url=e('input');url.id='noteUrl';url.type='url';url.placeholder='https://...';url.value=note.url||'';
    const saveBtn=btn('保存笔记与资料','solid-btn inspector-action',()=>{const v=url.value.trim();if(v&&!/^https?:\/\//i.test(v)){toast('学习资料链接须以 http:// 或 https:// 开头');return;}state.notes[p.id]={text:textarea.value.slice(0,15000),url:v.slice(0,1000)};save();toast('知识点笔记已保存');renderInspector();});
    panel.append(label,textarea,ulabel,url,saveBtn);if(/^https?:\/\//i.test(note.url||'')){const l=link('打开已保存的学习资料 ↗',note.url,'resource-link');panel.append(l);}inspector.append(panel);
    const tip=e('div','inspector-tip');tip.append(e('strong','','推荐验收方式'),e('span','','理解概念 → 完成练习 → 用代码验证 → 再勾选完成。这样学习进度更能反映真实掌握程度。'));inspector.append(tip);
  }

  // Dependency-free, pannable and zoomable course graph.
  function svgEl(tag,attrs={},content=null){const n=document.createElementNS(NS,tag);for(const [k,v] of Object.entries(attrs))n.setAttribute(k,String(v));if(content!==null)n.textContent=content;return n;}
  function renderGraph(c){const graph=e('div','graph-card');const bar=e('div','graph-bar');const left=e('div');left.append(e('strong','',c.name+' · 交互知识图谱'),e('div','small-note','点击模块展开；点击知识点右侧的圆圈 Check 完成'));bar.append(left);
    const controls=e('div','graph-controls');for(const [title,txt,fn] of [['放大','＋',()=>zoomGraph(1.18)],['缩小','－',()=>zoomGraph(1/1.18)],['重置','⌖',()=>{graphTransform={k:.88,x:3,y:24};applyGraphTransform();}]]){const b=btn(txt,'',fn);b.title=title;controls.append(b);}bar.append(controls);graph.append(bar);
    const viewport=e('div','graph-canvas');viewport.id='graphViewport';const svg=svgEl('svg',{'aria-label':'课程知识模块交互图谱','role':'img'});const g=svgEl('g',{id:'graphLayer'});svg.append(g);viewport.append(svg);graph.append(viewport);graph.append(e('div','graph-instruction','拖动空白画布平移 · 滚轮缩放 · 点击知识点查看笔记'));main.append(graph);
    const mods=modulesOf(courseId), q=searchQuery.toLowerCase();let y=85;const rendered=[];
    for(const m of mods){if(q&&!m.title.toLowerCase().includes(q)&&!(m.children||[]).some(p=>p.title.toLowerCase().includes(q)))continue;
      const open=graphExpanded.has(m.id);const leaves=open?(m.children||[]).filter(p=>!q||m.title.toLowerCase().includes(q)||p.title.toLowerCase().includes(q)):[];
      const height=Math.max(68,leaves.length*58);const midY=y+height/2;rendered.push({m,midY,leaves,leafStart:y});y+=height+39;}
    if(!rendered.length){viewport.append(e('div','empty-state','没有匹配的知识点'));return;}
    const center=(rendered[0].midY+rendered.at(-1).midY)/2;
    const node=(x,cy,w,h,label,sub,kind,handler)=>{const gg=svgEl('g',{class:'g-node '+kind,transform:`translate(${x} ${cy})`,tabindex:0,role:'button','aria-label':label});gg.append(svgEl('rect',{x:-w/2,y:-h/2,width:w,height:h,rx:13}));const title=label.length>17?label.slice(0,16)+'…':label;gg.append(svgEl('text',{class:'g-title',x:-w/2+16,y:-3},title),svgEl('text',{class:'g-secondary',x:-w/2+16,y:16},sub));gg.addEventListener('click',handler);gg.addEventListener('keydown',ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();handler();}});return gg;};
    for(const item of rendered){const {m,midY,leaves,leafStart}=item;g.append(svgEl('path',{class:'g-edge',d:`M 225 ${center} C 288 ${center},260 ${midY},318 ${midY}`}));for(let i=0;i<leaves.length;i++){const py=leafStart+29+i*58;g.append(svgEl('path',{class:'g-edge',d:`M 495 ${midY} C 559 ${midY},554 ${py},620 ${py}`}));}}
    g.append(node(130,center,190,67,c.name,courseStats(courseId).pct+'% · 课程','root',()=>{}));
    for(const item of rendered){const {m,midY,leaves,leafStart}=item;const s=moduleStats(m);g.append(node(406,midY,177,60,m.title,`${s.done}/${s.total} · ${s.pct}%`,'module'+(s.pct===100?' done':''),()=>{if(graphExpanded.has(m.id))graphExpanded.delete(m.id);else graphExpanded.add(m.id);expandedModule=m.id;render(true);}));
      leaves.forEach((p,i)=>{const cy=leafStart+29+i*58,done=!!state.completed[p.id];const leaf=node(745,cy,250,44,p.title,done?'已完成':'待学习','leaf'+(done?' done':''),()=>{selectedPoint=p.id;renderInspector();});
        const circle=svgEl('circle',{cx:105,cy:0,r:11,class:'g-check-circle'+(done?' is-done':'')});circle.addEventListener('click',ev=>{ev.stopPropagation();toggleComplete(p.id);});leaf.append(circle);if(done)leaf.append(svgEl('path',{d:'M99 0l4 4 7-8',class:'g-check-mark'}));g.append(leaf);});}
    applyGraphTransform();
    let drag=null;svg.addEventListener('pointerdown',ev=>{if(ev.button!==0||ev.target.closest('.g-node'))return;drag={x:ev.clientX,y:ev.clientY,origX:graphTransform.x,origY:graphTransform.y};svg.setPointerCapture(ev.pointerId);});svg.addEventListener('pointermove',ev=>{if(!drag)return;graphTransform.x=drag.origX+ev.clientX-drag.x;graphTransform.y=drag.origY+ev.clientY-drag.y;applyGraphTransform();});svg.addEventListener('pointerup',()=>{drag=null;});svg.addEventListener('pointercancel',()=>{drag=null;});svg.addEventListener('wheel',ev=>{ev.preventDefault();const rect=svg.getBoundingClientRect(),px=ev.clientX-rect.left,py=ev.clientY-rect.top;const nk=Math.max(.35,Math.min(2,graphTransform.k*(ev.deltaY<0?1.12:.89)));graphTransform.x=px-(px-graphTransform.x)*nk/graphTransform.k;graphTransform.y=py-(py-graphTransform.y)*nk/graphTransform.k;graphTransform.k=nk;applyGraphTransform();},{passive:false});
  }
  function zoomGraph(factor){graphTransform.k=Math.min(2,Math.max(.35,graphTransform.k*factor));applyGraphTransform();}
  function applyGraphTransform(){const layer=$('graphLayer');if(layer)layer.setAttribute('transform',`translate(${graphTransform.x},${graphTransform.y}) scale(${graphTransform.k})`);}

  function backup(){const payload={format:'embodied-atlas-backup',version:5,exportedAt:new Date().toISOString(),completed:state.completed,overrides:state.overrides,notes:state.notes};const objectURL=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:'application/json;charset=utf-8'}));const a=e('a');a.href=objectURL;a.download='embodied-atlas-progress-'+new Date().toISOString().slice(0,10)+'.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(objectURL),6000);toast('进度与笔记备份已导出');}
  function validateTree(overrides){if(!overrides||typeof overrides!=='object'||Array.isArray(overrides))return false;let total=0;for(const [cid,mods] of Object.entries(overrides)){if(!courseById.has(cid)||!Array.isArray(mods)||mods.length>250)return false;for(const mod of mods){if(typeof mod.id!=='string'||mod.id.length>170||typeof mod.title!=='string'||mod.title.length>180||!Array.isArray(mod.children)||mod.children.length>300)return false;for(const p of mod.children){total++;if(total>25000||typeof p.id!=='string'||p.id.length>170||typeof p.title!=='string'||p.title.length>180)return false;}}}return true;}
  async function restore(file){if(!file)return;if(file.size>6000000){toast('文件超过 6 MB，无法导入');return;}let obj;try{obj=JSON.parse(await file.text());}catch(err){toast('无法解析 JSON 文件');return;}
    let completed={},overrides={},notes={};
    if(obj?.format==='embodied-atlas-backup'&&obj.version===5){completed=obj.completed;overrides=obj.overrides;notes=obj.notes;}
    else if(obj?.format==='embodied-ai-fullstack-progress'&&obj.version===1){completed=Object.fromEntries(Object.entries(obj.progress||{}).filter(([id,s])=>s==='done').map(([id])=>[id,true]));for(const [cid,tree] of Object.entries(obj.customTopics||{})){if(courseById.has(cid)&&Array.isArray(tree)){overrides[cid]=normalizeTree(cid,tree);notesFromLegacy(tree,notes);}}}
    else{toast('备份格式不受支持：请选择 V4 或 V5 JSON');return;}
    if(!completed||typeof completed!=='object'||!notes||typeof notes!=='object'||!validateTree(overrides)||Object.keys(completed).length>30000||Object.keys(notes).length>30000){toast('备份数据格式或大小不符合要求');return;}
    if(!confirm('导入将覆盖当前浏览器中的学习进度、笔记和自定义目录。建议先导出原有记录。确定导入吗？'))return;
    state.completed=Object.fromEntries(Object.entries(completed).filter(([id,v])=>typeof id==='string'&&id.length<200&&v===true));state.overrides=overrides;state.notes={};for(const [id,n] of Object.entries(notes)){if(typeof id!=='string'||id.length>200||!n||typeof n!=='object')continue;const txt=typeof n.text==='string'?n.text:(typeof n.notes==='string'?n.notes:'');const url=typeof n.url==='string'?n.url:'';state.notes[id]={text:txt.slice(0,15000),url:/^https?:\/\//.test(url)?url.slice(0,1000):''};}
    save();selectedPoint=null;render();toast('学习记录导入成功');
  }
  function closeSidebar(){$('sidebar').classList.remove('open');$('sidebarScrim').classList.remove('show');}
  function initialRoute(){const hash=decodeURIComponent(location.hash||'');if(hash.startsWith('#course=')&&courseById.has(hash.slice(8))){openCourse(hash.slice(8),false);}else if(hash.startsWith('#major=')&&majorById.has(hash.slice(7))){majorId=hash.slice(7);expandedMajor=majorId;render();}else render();}
  $('homeNav').addEventListener('click',goHome);$('themeBtn').addEventListener('click',switchTheme);$('exportBtn').addEventListener('click',backup);$('importBtn').addEventListener('click',()=>$('importFile').click());$('importFile').addEventListener('change',ev=>{restore(ev.target.files[0]);ev.target.value='';});
  $('searchInput').addEventListener('input',ev=>{searchQuery=ev.target.value.trim();render(true);});
  document.addEventListener('keydown',ev=>{if(ev.key==='/'&&!['INPUT','TEXTAREA'].includes(document.activeElement.tagName)){ev.preventDefault();$('searchInput').focus();}});
  $('mobileMenu').addEventListener('click',()=>{$('sidebar').classList.toggle('open');$('sidebarScrim').classList.toggle('show');});$('sidebarScrim').addEventListener('click',closeSidebar);
  window.addEventListener('hashchange',()=>{const hash=decodeURIComponent(location.hash||'');if(hash.startsWith('#course=')&&hash.slice(8)!==courseId){openCourse(hash.slice(8),false);}else if(!hash)goHome();});
  readState();document.documentElement.dataset.theme=state.theme;$('themeBtn').replaceChildren(icon(state.theme==='light'?'moon':'sun'));initialRoute();
})();
