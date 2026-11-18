(() => {
  'use strict';
  const majors=window.ROADMAP_DATA || [];
  const NS='http://www.w3.org/2000/svg';
  const viewport=document.getElementById('viewport'), svg=document.getElementById('canvas');
  const majorList=document.getElementById('majorList'), detail=document.getElementById('detailInner');
  const query=document.getElementById('search');
  const selected={major:null,course:null};
  let nodes=[],edges=[],pan={x:0,y:0},scale=1,drag=null,expanded=new Set();
  const positions=new Map();
  function elt(t,attrs={},txt){const e=document.createElementNS(NS,t);for(const [k,v] of Object.entries(attrs)) e.setAttribute(k,v);if(txt!==undefined)e.textContent=txt;return e;}
  function safeText(e,t){e.textContent=t;return e;}
  function addText(where,t,cls){const el=document.createElement(cls||'p');el.textContent=t;where.appendChild(el);return el;}
  function addLink(where,url,label){let a=document.createElement('a');a.href=url;a.target='_blank';a.rel='noopener noreferrer';a.textContent=label;where.appendChild(a);return a;}
  function makeSide(){majorList.replaceChildren();majors.forEach(m=>{const b=document.createElement('button');b.className='major'+(expanded.has(m.id)?' active':'');b.textContent=m.name;let c=document.createElement('span');c.className='count';c.textContent=m.courses.length;b.append(c);b.onclick=()=>{if(expanded.has(m.id))expanded.delete(m.id);else expanded.add(m.id);selected.major=m.id;selected.course=null;showMajor(m);render();};majorList.appendChild(b);});}
  function showMajor(m){detail.replaceChildren();addText(detail,m.name,'h2').className='panel-title';let tag=addText(detail,m.courses.length+' 门课程 · 结课项目 + 机器人模块','span');tag.className='tag';addText(detail,'点击图中对应课程节点，查看趣味大项目、验收要求和机器人模块开源参考。').className='note';let s=addText(detail,'课程清单','h3');s.className='section';m.courses.forEach(c=>{let p=addText(detail,c.name);p.style.cursor='pointer';p.onclick=()=>{selected.course=c.id;expanded.add(m.id);showCourse(c);render();};});}
  function section(title,project,extra){const el=document.createElement('div');el.className='section';addText(el,title,'h3');addText(el,project.name,'div').className='project-title';if(extra)addText(el,extra);addLink(el,project.url,project.reference+' · GitHub 开源参考');detail.appendChild(el);}
  function showCourse(c){detail.replaceChildren();addText(detail,c.name,'h2').className='panel-title';let tag=addText(detail,c.major+' · 难度 '+('★'.repeat(c.difficulty)),'span');tag.className='tag';section('🎮 趣味结课大项目',c.capstone,'验收展示：'+c.capstone.acceptance);section('🤖 机器人模块项目',c.robot,'完成后应定义模块输入、输出、接口及集成测试。');let foot=addText(detail,'参考仓库不代表现成完成的作业。请记录你真正独立完成的设计、指标与复现结果。');foot.className='section note';}
  function model(){nodes=[];edges=[];const q=query.value.trim().toLowerCase();const matched=new Set();if(q){for(const m of majors){for(const c of m.courses){if([m.name,c.name,c.capstone.name,c.robot.name,c.capstone.reference,c.robot.reference].some(s=>s.toLowerCase().includes(q))) matched.add(c.id);}}}
    const visible=majors.filter(m=>!q||m.courses.some(c=>matched.has(c.id)));
    visible.forEach((m,i)=>{
      const ang=Math.PI*2*i/visible.length-Math.PI/2;
      const x=650+350*Math.cos(ang),y=540+300*Math.sin(ang);
      nodes.push({id:m.id,x,y,r:51,label:m.name,kind:'major',major:m});
      const cs=q?m.courses.filter(c=>matched.has(c.id)):(expanded.has(m.id)?m.courses:[]);
      cs.forEach((c,j)=>{
        const theta=ang+((j-(cs.length-1)/2)*0.17),radius=175+Math.floor(j/8)*35;
        const node={id:c.id,x:x+radius*Math.cos(theta),y:y+radius*Math.sin(theta),r:23,label:c.name,kind:'course',course:c};
        nodes.push(node);edges.push({a:m.id,b:c.id});
      });
    });
    nodes.forEach(n=>{if(positions.has(n.id)){const p=positions.get(n.id);n.x=p.x;n.y=p.y;}});
    document.getElementById('empty').hidden=!q||matched.size>0;
  }
  function updateTransform(){viewport.setAttribute('transform',`translate(${pan.x} ${pan.y}) scale(${scale})`);}
  function render(){makeSide();model();viewport.replaceChildren();const byId=new Map(nodes.map(n=>[n.id,n]));for(const e of edges){let a=byId.get(e.a),b=byId.get(e.b);viewport.appendChild(elt('line',{class:'edge',x1:a.x,y1:a.y,x2:b.x,y2:b.y}));}
    nodes.forEach(n=>{const g=elt('g',{class:'node '+(n.kind==='major'?'major-node ':'')+(selected.course===n.id||selected.major===n.id?'selected':''),transform:`translate(${n.x} ${n.y})`,'data-id':n.id,tabindex:0,role:'button','aria-label':n.label});g.append(n.kind==='major'?elt('circle',{r:n.r}):elt('rect',{x:-52,y:-17,width:104,height:34,rx:8}));
      const parts=n.kind==='major'?[n.label]:splitLabel(n.label);
      parts.forEach((p,i)=>g.append(elt('text',{'text-anchor':'middle',y:4+(i-(parts.length-1)/2)*14},p)));
      g.addEventListener('pointerdown',ev=>{if(ev.button!==0)return;drag={type:'node',id:n.id,ox:ev.clientX,oy:ev.clientY,wasMove:false};svg.setPointerCapture(ev.pointerId);ev.stopPropagation();});
      g.addEventListener('keydown',ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();activate(n.id);}});
      viewport.appendChild(g);
    });updateTransform();}
  function splitLabel(s){if(s.length<8)return [s];const mid=Math.ceil(s.length/2);return [s.slice(0,mid),s.slice(mid)];}
  function activate(id){const n=nodes.find(n=>n.id===id);if(!n)return;if(n.kind==='major'){if(expanded.has(n.id))expanded.delete(n.id);else expanded.add(n.id);selected.major=n.id;selected.course=null;showMajor(n.major);}else{selected.course=n.id;selected.major=n.course.major_id;expanded.add(n.course.major_id);showCourse(n.course);}render();}
  svg.addEventListener('pointerdown',ev=>{if(ev.target.closest('.node'))return;if(ev.button!==0)return;drag={type:'canvas',ox:ev.clientX,oy:ev.clientY,px:pan.x,py:pan.y};svg.setPointerCapture(ev.pointerId);});
  svg.addEventListener('pointermove',ev=>{if(!drag)return;const dx=ev.clientX-drag.ox,dy=ev.clientY-drag.oy;if(drag.type==='canvas'){pan.x=drag.px+dx;pan.y=drag.py+dy;updateTransform();}else if(Math.abs(dx)+Math.abs(dy)>4){drag.wasMove=true;const n=nodes.find(n=>n.id===drag.id);if(n){n.x+=dx/scale;n.y+=dy/scale;positions.set(n.id,{x:n.x,y:n.y});drag.ox=ev.clientX;drag.oy=ev.clientY;const e=viewport.querySelector(`g[data-id="${n.id}"]`);if(e)e.setAttribute('transform',`translate(${n.x} ${n.y})`);const idMap=new Map(nodes.map(n=>[n.id,n]));viewport.querySelectorAll('.edge').forEach((line,k)=>{const edge=edges[k],a=idMap.get(edge.a),b=idMap.get(edge.b);line.setAttribute('x1',a.x);line.setAttribute('y1',a.y);line.setAttribute('x2',b.x);line.setAttribute('y2',b.y);});}}});
  svg.addEventListener('pointerup',ev=>{if(drag&&drag.type==='node'&&!drag.wasMove)activate(drag.id);drag=null;});
  svg.addEventListener('pointercancel',()=>drag=null);
  svg.addEventListener('wheel',ev=>{ev.preventDefault();const rect=svg.getBoundingClientRect();const sx=ev.clientX-rect.left,sy=ev.clientY-rect.top;const factor=ev.deltaY<0?1.10:1/1.10;const next=Math.min(2.5,Math.max(.27,scale*factor));pan.x=sx-(sx-pan.x)*next/scale;pan.y=sy-(sy-pan.y)*next/scale;scale=next;updateTransform();},{passive:false});
  query.addEventListener('input',()=>{if(query.value.trim())expanded=new Set(majors.map(m=>m.id));render();});
  document.getElementById('reset').onclick=()=>{pan={x:0,y:0};scale=1;query.value='';expanded.clear();positions.clear();selected.major=null;selected.course=null;detail.replaceChildren();addText(detail,'请选择专业或课程','h2');addText(detail,'点击左侧专业或图谱中的课程节点，查看两个项目。');render();fitInitial();};
  function fitInitial(){const w=svg.clientWidth||700,h=svg.clientHeight||650;scale=Math.max(.35,Math.min(.9,w/1320,h/1100));pan.x=w/2-650*scale;pan.y=h/2-540*scale;updateTransform();}
  render();fitInitial();
})();