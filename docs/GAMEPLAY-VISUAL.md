# 主玩法视觉基准修正

主玩法不再采用旧网页模拟棋盘。ui/cocos-gameplay-preview.js / .css 在主玩法入口显示真实 Cocos GameScene 的 720×1280 渲染结果，并提供设置、成功、失败和提示的视觉切换。

来源：原工程 outputs/cocos-home/build/preview 中的 GameScene，使用 tools/qa/capture-gameplay-visual-only.cjs 采集。本轮只切换节点可见性并截图，没有执行挖掘、重试、下一关、广告或领奖核验。

显示文字、棋盘格数/布局、材质、HUD、按钮和弹窗均保留原生捕获结果。数据为用于显示的第9关样例，不是关卡功能验收。

该入口明确属于静态效果基准，不把整屏截图冒充可编辑组件。需要更改主玩法设计时使用 native-art 和 reference/GameSceneSkin.ts 作为素材和布局参考；不要恢复旧网页棋盘作为最终画面。其他系统的独立 HTML/CSS 编辑方式不变。
