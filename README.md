# 挖矿还债记 · 独立前端设计工程

## 在线预览（GitHub Pages）

- [设计工作台](https://wanf12333.github.io/wakuang/)
- [挖矿界面原型](https://wanf12333.github.io/wakuang/ui/index.html?mode=journey)

Pages 从 main 分支根目录发布。设计提交合并并推送到 main 后自动更新，通常需等待发布任务完成。`.nojekyll` 保证原生 HTML/CSS/JS 与图片直接发布，无需安装依赖或 Cocos。浏览器预览数据保存在各自设备，不会同步玩家存档。

本目录可单独复制给设计开发同事，也可作为新 Git 仓库使用。无需 Cocos、无需原项目、无需 npm install。未包含 SDK、玩家存档、引擎缓存或发布包。

## 启动

安装 Node.js 18 或以上，在本目录执行 `npm start`，打开 http://127.0.0.1:4173 。也可直接打开 index.html，推荐 HTTP 方式调试。端口被占用时可在 PowerShell 使用 `$env:PORT=4174; npm start`。

`npm run check` 检查页面、样式资源和依赖边界。

## 目录职责

| 目录 | 用途 |
| --- | --- |
| ui/ | 网页交互原型及系统导航，编辑样式和展示模板 |
| ui/assets/、ui/references/ | 素材和视觉参考，尽量保持路径稳定 |
| loading.html、loading.css | 原生分层参数整理的设计预览，模拟进度 |
| story/、generated-images/ | 序章及素材 |
| native-art/ | 原生主玩法与 Loading 图片，不含 .meta |
| reference/ | 实装截图和两份 UI 适配代码参考；TS 不在网页执行 |
| docs/ | 视觉约定和 Cocos 回接说明 |
| tools/ | 独立服务器和检查脚本，仅 Node 内置库 |

## 从哪里修改

- 系统排版：ui/system-design-v3.css、system-layout-polish.css、popup-layout-v2.css。
- 通用皮肤：shared-ui-v1.css / .js、shared-close.css、dialog-themes.css。
- 各系统：对应 *-exact.js / .css，以及 rewards-ui.js、beauty.js、wardrobe.js、progression-ui.js。
- app.js 是组合入口。保留 CSS 加载顺序，后加载的样式可能覆盖前面的修改。
- engine.js、progression.js、rewards-system.js、level-drops.js、beauty-model.js 等为本地预览模型，不负责正式游戏数值。

## 与原工程的边界

这是独立设计源码交接，不是把游戏改成 WebView。网页不调用 Cocos，也不自动改动原项目；Cocos 运行逻辑保留原位。

系统通过展示模板、素材和布局导出接入 Cocos。主玩法入口已改为真实 Cocos 渲染的静态界面基准，可切换棋盘、设置、成功、失败和提示；不再展示旧网页模拟棋盘，不执行玩法验证。图片不是可编辑的分层 DOM；素材在 native-art，原生绘制方式与尺寸在 reference 的 TS 中。系统页面仍可编辑交互，主玩法新增设计需按该基准制作素材，再交由原生适配器接入。

最新规则：无体力系统，保留矿铲预算；取消体力恢复，不改名保留。预览模型可能残留旧兼容字段，不代表需要恢复体力 UI。

此目录为本次拆分快照。此后设计同事在这里工作，Cocos 同事按 docs/COCOS-HANDOFF.md 接入，不要同时在旧原型与这里改同一套 UI。原工程未删除。
