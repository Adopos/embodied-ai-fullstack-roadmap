# 06｜控制科学与工程

> 结构仅两级：专业 → 课程；每门课程附带结课大项目及机器人模块项目。

| 课程 | 趣味结课项目（参考开源仓库） | 机器人模块项目（参考开源仓库） | 难度 | 状态 |
|---|---|---|---|---|
| 自动控制原理 | 倒立摆挑战：让快倒的杆子站起来（[python-control](https://github.com/python-control/python-control)） | 轮速 PID 与运动闭环（[ros2_control](https://github.com/ros-controls/ros2_control)） | ★★ | ⬜ 未开始 |
| 现代控制理论 | 无人车自动泊车：LQR 对战朴素控制器（[python-control](https://github.com/python-control/python-control)） | 机器人 LQR 状态反馈控制（[Drake](https://github.com/RobotLocomotion/drake)） | ★★★ | ⬜ 未开始 |
| 数字控制系统 | 实时任务攻防赛：在采样与延迟中保持稳定（[FreeRTOS](https://github.com/FreeRTOS/FreeRTOS-Kernel)） | 实时电机控制及超时保护（[ros2_control](https://github.com/ros-controls/ros2_control)） | ★★ | ⬜ 未开始 |
| 系统辨识 | 黑盒电机侦探：只看输入输出猜电机参数（[SciPy](https://github.com/scipy/scipy)） | 底盘电机参数自动标定（[ODrive](https://github.com/odriverobotics/ODrive)） | ★★ | ⬜ 未开始 |
| 最优控制与模型预测控制 | 障碍物赛车 MPC：预测未来再决定方向（[do-mpc](https://github.com/do-mpc/do-mpc)） | 底盘受约束轨迹跟踪 MPC（[PythonRobotics](https://github.com/AtsushiSakai/PythonRobotics)） | ★★★ | ⬜ 未开始 |
| 非线性与鲁棒控制 | 抗干扰擂台：机器人被推一把能否稳住（[python-control](https://github.com/python-control/python-control)） | 机器人扰动抑制与故障降级（[ArduPilot](https://github.com/ArduPilot/ardupilot)） | ★★★ | ⬜ 未开始 |

## 课程项目详细说明

### 06-01 自动控制原理

- **趣味结课大项目：** 倒立摆挑战：让快倒的杆子站起来
- **必须展示的成果：** PID 参数调节游戏、超调和稳定时间曲线
- **开源参考（不是完整的现成作业）：** [python-control](https://github.com/python-control/python-control)
- **机器人模块项目：** 轮速 PID 与运动闭环
- **模块参考：** [ros2_control](https://github.com/ros-controls/ros2_control)
- **完成标准：** 有可运行代码、说明文档、演示视频/GIF、实验指标、独立改进点。
- **我的进度：** ⬜ 未开始 / 🟡 进行中 / ✅ 已完成

### 06-02 现代控制理论

- **趣味结课大项目：** 无人车自动泊车：LQR 对战朴素控制器
- **必须展示的成果：** 状态空间模型、极点配置和误差/能耗对比
- **开源参考（不是完整的现成作业）：** [python-control](https://github.com/python-control/python-control)
- **机器人模块项目：** 机器人 LQR 状态反馈控制
- **模块参考：** [Drake](https://github.com/RobotLocomotion/drake)
- **完成标准：** 有可运行代码、说明文档、演示视频/GIF、实验指标、独立改进点。
- **我的进度：** ⬜ 未开始 / 🟡 进行中 / ✅ 已完成

### 06-03 数字控制系统

- **趣味结课大项目：** 实时任务攻防赛：在采样与延迟中保持稳定
- **必须展示的成果：** 测量调度抖动、丢帧与采样对控制性能影响
- **开源参考（不是完整的现成作业）：** [FreeRTOS](https://github.com/FreeRTOS/FreeRTOS-Kernel)
- **机器人模块项目：** 实时电机控制及超时保护
- **模块参考：** [ros2_control](https://github.com/ros-controls/ros2_control)
- **完成标准：** 有可运行代码、说明文档、演示视频/GIF、实验指标、独立改进点。
- **我的进度：** ⬜ 未开始 / 🟡 进行中 / ✅ 已完成

### 06-04 系统辨识

- **趣味结课大项目：** 黑盒电机侦探：只看输入输出猜电机参数
- **必须展示的成果：** 实测曲线、拟合参数、预测误差及交叉验证
- **开源参考（不是完整的现成作业）：** [SciPy](https://github.com/scipy/scipy)
- **机器人模块项目：** 底盘电机参数自动标定
- **模块参考：** [ODrive](https://github.com/odriverobotics/ODrive)
- **完成标准：** 有可运行代码、说明文档、演示视频/GIF、实验指标、独立改进点。
- **我的进度：** ⬜ 未开始 / 🟡 进行中 / ✅ 已完成

### 06-05 最优控制与模型预测控制

- **趣味结课大项目：** 障碍物赛车 MPC：预测未来再决定方向
- **必须展示的成果：** MPC 与 PID/LQR 的控制误差、速度和时间对比
- **开源参考（不是完整的现成作业）：** [do-mpc](https://github.com/do-mpc/do-mpc)
- **机器人模块项目：** 底盘受约束轨迹跟踪 MPC
- **模块参考：** [PythonRobotics](https://github.com/AtsushiSakai/PythonRobotics)
- **完成标准：** 有可运行代码、说明文档、演示视频/GIF、实验指标、独立改进点。
- **我的进度：** ⬜ 未开始 / 🟡 进行中 / ✅ 已完成

### 06-06 非线性与鲁棒控制

- **趣味结课大项目：** 抗干扰擂台：机器人被推一把能否稳住
- **必须展示的成果：** 扰动注入、恢复时间与参数偏差敏感性分析
- **开源参考（不是完整的现成作业）：** [python-control](https://github.com/python-control/python-control)
- **机器人模块项目：** 机器人扰动抑制与故障降级
- **模块参考：** [ArduPilot](https://github.com/ArduPilot/ardupilot)
- **完成标准：** 有可运行代码、说明文档、演示视频/GIF、实验指标、独立改进点。
- **我的进度：** ⬜ 未开始 / 🟡 进行中 / ✅ 已完成
