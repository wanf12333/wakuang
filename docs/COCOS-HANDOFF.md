# 设计与 Cocos 回接约定

设计同事提交修改文件或 Git diff、页面/状态清单、390×844 和 720×1280 截图、新素材原尺寸/透明边距/九宫格边距。动态文字不要烘焙进图片。保留 data-action / data-payload、页面和弹窗 key；新增动作先与程序确认。

以下由 Cocos 负责人在原工程执行，不要求设计同事安装引擎：

| 设计源 | 接入位置 |
| --- | --- |
| ui 下 JS/CSS/图片 | art-delivery/interactive-review-v6 对应文件，审查差异后同步 |
| 系统展示函数 | tools/qa/compile-prototype-presentation.cjs → PrototypePresentation.ts |
| CSS 布局装饰 | tools/qa/export-prototype-native-ui.cjs → assets/resources/prototype-ui |
| 原生字体/框体 | PrototypeNativePresentation.ts、SharedSystemTheme.ts |
| 主玩法 HUD/弹窗 | assets/Script/mining/GameSceneSkin.ts |
| Loading 分层 | assets/Script/systems/DebtStoryBrand.ts、MineBackdrop.ts |
| 原生图片 | assets/resources 对应目录；保留已有 .meta/UUID |

编译和布局导出工具属于 Cocos 端；部分工具输出 apply_patch，需要审查应用，不能把输出当成已完成构建。CSS 不会直接在原生生效，仅复制图片/CSS 不算接入完成。

接入后重新构建并运行原项目的系统截图、业务交互、主玩法弹窗测试。不得覆盖存档、SDK 或 GameScene 玩法；奖励/交易、棋盘布局、矿铲预算与金币入场规则不因设计改变。

静态截图不会随网页自动更新。网页棋盘、部分提示图标与原生存在差异，须以原生棋盘布局为约束；Loading 仅设计预览，不包含真实加载、SDK 和协议处理。
