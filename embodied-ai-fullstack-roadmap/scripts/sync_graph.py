"""Sync editable JSON data into no-build, GitHub Pages friendly JavaScript bundles."""
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
courses=json.loads((ROOT/'data/courses.json').read_text(encoding='utf-8'))
topics=json.loads((ROOT/'data/course_topics.json').read_text(encoding='utf-8'))
assert len(courses['majors'])==10
assert sum(len(m['courses']) for m in courses['majors'])==65
assert len(topics['courses'])==65
(ROOT/'docs/data.js').write_text('window.ROADMAP_DATA = '+json.dumps(courses['majors'],ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf-8')
(ROOT/'docs/topics.js').write_text('window.ROADMAP_TOPICS = '+json.dumps(topics['courses'],ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf-8')
print('Updated docs/data.js and docs/topics.js')
