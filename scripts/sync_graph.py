#!/usr/bin/env python3
"""把 data/courses.json 更新到静态网站 docs/data.js。标准库，无额外依赖。"""
from pathlib import Path
import json

root = Path(__file__).resolve().parents[1]
source = root / "data" / "courses.json"
target = root / "docs" / "data.js"
data = json.loads(source.read_text(encoding="utf-8"))
majors = data["majors"]
assert len(majors) == 10, "预期应为 10 个一级专业"
assert sum(len(x["courses"]) for x in majors) == 65, "预期应为 65 门课程"
target.write_text(
    "window.ROADMAP_DATA=" + json.dumps(majors, ensure_ascii=False, separators=(",", ":")) + ";\n",
    encoding="utf-8",
)
print(f"已同步：{source.relative_to(root)} → {target.relative_to(root)}")
