"""Normalize the V4 nested topic seed into exactly two knowledge levels.
Course -> module -> checkable learning point. Preserve original learning point IDs.
"""
from pathlib import Path
import json
import sys

ROOT=Path(__file__).resolve().parents[1]

def normalize(course_id, tree):
    def leaves(node, prefix=''):
        children=node.get('children') or []
        if not children:
            return [{'id':node['id'],'title':(prefix + node['title']) if prefix else node['title'],'children':[]}]
        items=[]
        for c in children:
            has_nested=bool(c.get('children'))
            items.extend(leaves(c, prefix + (c['title']+' · ' if has_nested else '')))
        return items
    if course_id=='01-01':
        result=[]
        def add(mod, new_title, children, preserve_children=False):
            if preserve_children:
                result.append({'id':mod['id'],'title':new_title,'children':leaves(mod)})
            else:
                result.append({'id':mod['id'],'title':new_title,'children':leaves({'id':mod['id'],'title':new_title,'children':children})})
        for root in tree:
            if root['title']=='微分学':
                for c in root['children']:
                    add(c, c['title'], c['children'])
            elif root['title']=='积分学':
                for c in root['children']:
                    add(c, c['title'], c['children'])
            else:
                add(root, root['title'], root['children'])
        order=['函数、极限与连续','一元函数微分学','一元函数积分学','多元函数微分学','多元函数积分学','无穷级数']
        return sorted(result,key=lambda m:order.index(m['title']) if m['title'] in order else len(order))
    result=[]
    for root in tree:
        children=root.get('children') or []
        if not children:
            # A V4 custom top-level leaf: convert to a module with one checkable leaf.
            result.append({'id':root['id']+'-module','title':root['title'],'children':[{'id':root['id'],'title':root['title'],'children':[]}]})
        else:
            result.append({'id':root['id'],'title':root['title'],'children':leaves(root)})
    return result

def main():
    src=ROOT/'data/course_topics.json'
    doc=json.loads(src.read_text('utf-8'))
    courses=doc['courses']
    oldpath=ROOT/'data/course_topics_v4_original.json'
    if not oldpath.exists(): oldpath.write_text(json.dumps(doc,ensure_ascii=False,indent=2)+'\n','utf-8')
    norm={cid:normalize(cid,ts) for cid,ts in courses.items()}
    out={'version':'5.0','description':'每门课程由一级知识模块及其二级可勾选知识点构成；进度在浏览器本地存储。','courses':norm}
    src.write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n','utf-8')
    (ROOT/'docs/topics.js').write_text('window.ROADMAP_TOPICS = '+json.dumps(norm,ensure_ascii=False,separators=(',',':'))+';\n','utf-8')
    nmodules=sum(len(v) for v in norm.values()); npoints=sum(sum(len(m['children']) for m in v) for v in norm.values())
    print(f'{len(norm)} courses | {nmodules} modules | {npoints} checkable points')
    for c in norm['01-01']:
        print('  ',c['title'],len(c['children']))

if __name__=='__main__':main()
