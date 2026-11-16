# 🤖 Embodied AI Full-Stack Roadmap

> 从 0 到 1 研究、设计、制造并迭代一台智能机器人：**10 个专业 · 65 门课程 · 每门 1 个趣味结课项目 + 1 个机器人模块项目**。

**[🌐 打开交互式知识图谱](https://YOUR-USERNAME.github.io/embodied-ai-fullstack-roadmap/)**  ｜[学习顺序](roadmap/learning-order.md) ｜[完整结构化数据](data/courses.json) ｜[项目报告模板](projects/PROJECT_TEMPLATE.md)

> 第一次上传时，请把上面的 `YOUR-USERNAME` 改为你的 GitHub 用户名。网页需要在 Settings → Pages 中启用。

## 🎯 核心目标

- **研究深度：** 多模态感知、强化学习、模仿学习、VLA 与自主决策；
- **工程广度：** C++、Linux、ROS 2、控制、嵌入式、电子电气与机械设计；
- **贯穿作品：** 第一代移动机器人 → 第二代移动操作机器人 → 第三代具身学习平台。

## 🧭 两级知识目录

| 一级专业 | 二级专业课程数 | 课程详情 |
|---|---:|---|
| 数学与应用数学 | 7 | [查看课程与双项目](courses/01-math.md) |
| 物理学 | 3 | [查看课程与双项目](courses/02-physics.md) |
| 计算机科学与技术 | 9 | [查看课程与双项目](courses/03-computer-science.md) |
| 人工智能 | 10 | [查看课程与双项目](courses/04-artificial-intelligence.md) |
| 机器人工程 | 9 | [查看课程与双项目](courses/05-robotics.md) |
| 控制科学与工程 | 6 | [查看课程与双项目](courses/06-control.md) |
| 机械工程 | 6 | [查看课程与双项目](courses/07-mechanical.md) |
| 电子信息工程 | 8 | [查看课程与双项目](courses/08-electronics.md) |
| 电气工程及其自动化 | 4 | [查看课程与双项目](courses/09-electrical.md) |
| 认知科学与人机交互 | 3 | [查看课程与双项目](courses/10-cognitive.md) |

## 🎮 趣味结课大项目展示

| 课程 | 趣味作品 | 对机器人真正有帮助的能力 |
|---|---|---|
| 线性代数 | **3D 机械臂变换游乐场** | 坐标变换、运动学、可视化 |
| 数据结构与算法 | **AI 迷宫竞速大赛** | A* / Dijkstra / RRT* 路径搜索 |
| 计算机网络 | **远程遥控赛车直播间** | 低延迟通信、遥测、故障保护 |
| 计算机视觉 | **AI 寻宝猎人** | 实时目标跟踪与视觉感知 |
| 强化学习 | **AI 赛车训练营** | 奖励设计、训练、成功率评估 |
| 三维计算机视觉 | **手机拍照建 3D** | 相机标定、三维重建、点云 |
| 机器人仿真 | **我的机器人宇宙** | 数字孪生、物理模拟、ROS 2 |
| 控制原理 | **倒立摆挑战** | PID、系统辨识、稳定性 |
| CAD | **机器人换装工坊** | 机械结构、工程图、BOM |
| Agent | **AI 密室逃脱指挥官** | 任务规划、工具调用与异常恢复 |

## 📌 工作原则

1. **课程项目是独立作品**：以优秀开源项目为参考，不假装原创整个开源仓库。
2. **机器人模块真实集成**：输入输出接口、物理限制、日志与故障处理必须明确。
3. **每项有可量化指标**：准确率、延迟、误差、耗时、成功率等，至少选择适用的两项。
4. **大项目独立开仓库**：此主仓库只收录知识图谱、计划和项目索引，重点项目单独建仓库并在此链接。
5. **Star 不是唯一标准**：优先项目质量、维护活跃、许可证、兼容性和就业相关性。

## 🧪 当前进度

- [ ] 阶段 A：第一代移动机器人基础驱动和 ROS 2
- [ ] 阶段 B：视觉跟随 / 语音交互 / 自主导航
- [ ] 阶段 C：自研机械、电路与操作臂
- [ ] 阶段 D：模仿学习、强化学习与 VLA 实验

## 🖥️ GitHub Pages

已内置无需构建的静态网页：`docs/index.html`。
上传后在 GitHub 仓库 **Settings → Pages → Build and deployment → Deploy from a branch → main → /docs → Save**。
发布地址通常为 `https://你的用户名.github.io/embodied-ai-fullstack-roadmap/`。

## ✏️ 更新课程与网页

1. 在 `courses/` 中修改对应的课程说明（GitHub 仓库页面所见的 Markdown）；
2. 在 `data/courses.json` 中更新同一门课程的项目名称、链接或进度；
3. 在仓库根目录运行 `python scripts/sync_graph.py`，自动同步生成 `docs/data.js`；
4. `git add . && git commit -m "Update roadmap" && git push`，即可同步线上课程信息与图谱。

`docs/data.js` 是供静态网页运行的生成文件，**不要直接手动编辑它**。

## ⚖️ 开源说明

此仓库是个人学习路线和项目规划。所有外部仓库版权归其各自作者；使用或改造代码前需要查看许可证，记录具体版本和引用。没有自动复制第三方源代码。
