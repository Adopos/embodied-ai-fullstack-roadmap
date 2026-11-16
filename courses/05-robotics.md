# 05｜机器人工程

> 结构仅两级：专业 → 课程；每门课程附带结课大项目及机器人模块项目。

| 课程 | 趣味结课项目（参考开源仓库） | 机器人模块项目（参考开源仓库） | 难度 | 状态 |
|---|---|---|---|---|
| 机器人运动学 | 虚拟机械臂涂鸦：拖动末端画图并自动解逆解（[Robotics Toolbox](https://github.com/petercorke/robotics-toolbox-python)） | 麦克纳姆底盘正逆运动学（[PythonRobotics](https://github.com/AtsushiSakai/PythonRobotics)） | ★★ | ⬜ 未开始 |
| 机器人动力学 | 机器人弹跳与负重赛：换质量看姿态如何变化（[Pinocchio](https://github.com/stack-of-tasks/pinocchio)） | 底盘动力学仿真模型（[MuJoCo](https://github.com/google-deepmind/mujoco)） | ★★★ | ⬜ 未开始 |
| 移动机器人技术 | 小车任务挑战：全向移动、绕桩与定点泊车（[NASA Rover](https://github.com/nasa-jpl/open-source-rover)） | 自主导航与目标点执行（[Nav2](https://github.com/ros-navigation/navigation2)） | ★★ | ⬜ 未开始 |
| 机器人定位与 SLAM | 陌生房间探险：边走边画出自己的地图（[ORB-SLAM3](https://github.com/UZ-SLAMLab/ORB_SLAM3)） | 位姿图优化与地图模块（[GTSAM](https://github.com/borglab/gtsam)） | ★★★ | ⬜ 未开始 |
| 多传感器融合 | 虚拟传感器骗局：给传感器加噪声后还原真轨迹（[FilterPy](https://github.com/rlabbe/filterpy)） | 机器人状态估计融合节点（[robot_localization](https://github.com/cra-ros-pkg/robot_localization)） | ★★★ | ⬜ 未开始 |
| 机器人运动规划 | 动态障碍迷宫：边走边发现和绕开障碍（[PythonRobotics](https://github.com/AtsushiSakai/PythonRobotics)） | Nav2 局部避障和重规划（[Nav2](https://github.com/ros-navigation/navigation2)） | ★★★ | ⬜ 未开始 |
| 机器人操作与抓取 | 机械臂桌面整理游戏：随机抓取摆放（[MoveIt 2](https://github.com/moveit/moveit2)） | 机械臂抓取规划与执行（[MoveIt 2](https://github.com/moveit/moveit2)） | ★★★ | ⬜ 未开始 |
| 机器人仿真技术 | 我的机器人宇宙：自建实验室和障碍赛道（[Gazebo Sim](https://github.com/gazebosim/gz-sim)） | 实体机器人数字孪生（[MuJoCo](https://github.com/google-deepmind/mujoco)） | ★★ | ⬜ 未开始 |
| 机器人系统设计 | 从零造机器人：公开机械图、电路、软件和验收报告（[NASA Rover](https://github.com/nasa-jpl/open-source-rover)） | 机电软一体化集成系统（[ROS 2](https://github.com/ros2/ros2)） | ★★★ | ⬜ 未开始 |

## 课程项目详细说明

### 05-01 机器人运动学

- **趣味结课大项目：** 虚拟机械臂涂鸦：拖动末端画图并自动解逆解
- **必须展示的成果：** 展示 IK 成功率、奇异位形与关节轨迹
- **开源参考（不是完整的现成作业）：** [Robotics Toolbox](https://github.com/petercorke/robotics-toolbox-python)
- **机器人模块项目：** 麦克纳姆底盘正逆运动学
- **模块参考：** [PythonRobotics](https://github.com/AtsushiSakai/PythonRobotics)
- **完成标准：** 有可运行代码、说明文档、演示视频/GIF、实验指标、独立改进点。
- **我的进度：** ⬜ 未开始 / 🟡 进行中 / ✅ 已完成

### 05-02 机器人动力学

- **趣味结课大项目：** 机器人弹跳与负重赛：换质量看姿态如何变化
- **必须展示的成果：** 仿真可视化，比较能耗、力矩、接触表现
- **开源参考（不是完整的现成作业）：** [Pinocchio](https://github.com/stack-of-tasks/pinocchio)
- **机器人模块项目：** 底盘动力学仿真模型
- **模块参考：** [MuJoCo](https://github.com/google-deepmind/mujoco)
- **完成标准：** 有可运行代码、说明文档、演示视频/GIF、实验指标、独立改进点。
- **我的进度：** ⬜ 未开始 / 🟡 进行中 / ✅ 已完成

### 05-03 移动机器人技术

- **趣味结课大项目：** 小车任务挑战：全向移动、绕桩与定点泊车
- **必须展示的成果：** 多种运动模式、路径偏差和碰撞统计
- **开源参考（不是完整的现成作业）：** [NASA Rover](https://github.com/nasa-jpl/open-source-rover)
- **机器人模块项目：** 自主导航与目标点执行
- **模块参考：** [Nav2](https://github.com/ros-navigation/navigation2)
- **完成标准：** 有可运行代码、说明文档、演示视频/GIF、实验指标、独立改进点。
- **我的进度：** ⬜ 未开始 / 🟡 进行中 / ✅ 已完成

### 05-04 机器人定位与 SLAM

- **趣味结课大项目：** 陌生房间探险：边走边画出自己的地图
- **必须展示的成果：** 公开数据集位姿评测、轨迹误差与回环可视化
- **开源参考（不是完整的现成作业）：** [ORB-SLAM3](https://github.com/UZ-SLAMLab/ORB_SLAM3)
- **机器人模块项目：** 位姿图优化与地图模块
- **模块参考：** [GTSAM](https://github.com/borglab/gtsam)
- **完成标准：** 有可运行代码、说明文档、演示视频/GIF、实验指标、独立改进点。
- **我的进度：** ⬜ 未开始 / 🟡 进行中 / ✅ 已完成

### 05-05 多传感器融合

- **趣味结课大项目：** 虚拟传感器骗局：给传感器加噪声后还原真轨迹
- **必须展示的成果：** EKF/UKF 与单传感器轨迹误差对比
- **开源参考（不是完整的现成作业）：** [FilterPy](https://github.com/rlabbe/filterpy)
- **机器人模块项目：** 机器人状态估计融合节点
- **模块参考：** [robot_localization](https://github.com/cra-ros-pkg/robot_localization)
- **完成标准：** 有可运行代码、说明文档、演示视频/GIF、实验指标、独立改进点。
- **我的进度：** ⬜ 未开始 / 🟡 进行中 / ✅ 已完成

### 05-06 机器人运动规划

- **趣味结课大项目：** 动态障碍迷宫：边走边发现和绕开障碍
- **必须展示的成果：** A*、RRT*、DWA 等算法复杂环境通关率对比
- **开源参考（不是完整的现成作业）：** [PythonRobotics](https://github.com/AtsushiSakai/PythonRobotics)
- **机器人模块项目：** Nav2 局部避障和重规划
- **模块参考：** [Nav2](https://github.com/ros-navigation/navigation2)
- **完成标准：** 有可运行代码、说明文档、演示视频/GIF、实验指标、独立改进点。
- **我的进度：** ⬜ 未开始 / 🟡 进行中 / ✅ 已完成

### 05-07 机器人操作与抓取

- **趣味结课大项目：** 机械臂桌面整理游戏：随机抓取摆放
- **必须展示的成果：** 机械臂抓取成功率、用时与失败分类
- **开源参考（不是完整的现成作业）：** [MoveIt 2](https://github.com/moveit/moveit2)
- **机器人模块项目：** 机械臂抓取规划与执行
- **模块参考：** [MoveIt 2](https://github.com/moveit/moveit2)
- **完成标准：** 有可运行代码、说明文档、演示视频/GIF、实验指标、独立改进点。
- **我的进度：** ⬜ 未开始 / 🟡 进行中 / ✅ 已完成

### 05-08 机器人仿真技术

- **趣味结课大项目：** 我的机器人宇宙：自建实验室和障碍赛道
- **必须展示的成果：** 场景建模、物理与传感器仿真、运行视频
- **开源参考（不是完整的现成作业）：** [Gazebo Sim](https://github.com/gazebosim/gz-sim)
- **机器人模块项目：** 实体机器人数字孪生
- **模块参考：** [MuJoCo](https://github.com/google-deepmind/mujoco)
- **完成标准：** 有可运行代码、说明文档、演示视频/GIF、实验指标、独立改进点。
- **我的进度：** ⬜ 未开始 / 🟡 进行中 / ✅ 已完成

### 05-09 机器人系统设计

- **趣味结课大项目：** 从零造机器人：公开机械图、电路、软件和验收报告
- **必须展示的成果：** 完整 BOM、接口文档、整机可靠性试验
- **开源参考（不是完整的现成作业）：** [NASA Rover](https://github.com/nasa-jpl/open-source-rover)
- **机器人模块项目：** 机电软一体化集成系统
- **模块参考：** [ROS 2](https://github.com/ros2/ros2)
- **完成标准：** 有可运行代码、说明文档、演示视频/GIF、实验指标、独立改进点。
- **我的进度：** ⬜ 未开始 / 🟡 进行中 / ✅ 已完成
