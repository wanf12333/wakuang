# 主界面分层素材 v1

## 2026-09-08：接入「概念图还原」原画布

- 最新调整：矿洞前的角色暂时隐藏，原画布与独立美术预览保持一致；左上角头像及角色素材保留，方便恢复。
- 右上角现统一使用 `home-status-card.js` / `.css`：五种债务／放贷状态共享蓝白边框、奶油底及黄色九宫格按钮，不再裁切原稿的债务牌，也不分别生成状态底板。
- 原 `../../index.html` 首页已使用 `home-exact.js` / `home-exact.css` 分层实现，嵌入式概念对照同步生效；其他系统保留原界面。
- 保留缩小后的建筑尺寸与固定背景。`index.html?building=2` 可检查二级外观，默认一级；它是美术检查参数，不消耗资源、不绑定财富等级。
- 主画布的金币、体力、债务、财富等级、最深记录与关卡来自 ReviewEngine，动态区域覆盖原稿数字。债务牌沿用原有还款／跑路／到期／进行中／新放贷入口优先级。
- 按钮在当前画布执行，不通过重新加载页面跳转。设置和头像仅作为静态图标，暂未接入业务。
- 独立 `home-layered.html` 仍保留为固定概念数值的美术预览，与原画布的实时评审数值区分。
- 回归检查：`tools/qa/tests/home.spec.cjs` 覆盖首页入口、全额还款刷新、四种放贷状态、建筑层独立、390px/1500px 视口和嵌入画布；共享弹窗检查 `frame.spec.cjs` 同样通过。

## 2026-09-08：概念图 UI 对齐 v2

- 建筑显示宽度由原预览的 640/720 调整为 680/941，缩小约 19%；两级共用位置与尺寸。
- `concept-debt-reference.png` 是用户提供的高分辨率欠债状态参考。头像、金币/体力栏、债务牌、财富面板、五个右侧入口与关卡牌按原图坐标独立裁窗显示，不以整张截图覆盖场景。
- 每个 UI 元素保持独立节点和可访问标签；对应入口跳转原交互画布。设置与头像仅提示“美术预览”，不伪装成完整业务功能。
- UI 数值与锁定状态为该概念图的固定演示内容，不是实时游戏数据；建筑升级只换建筑层。后续生产接入应把数值和文字从美术中分离。
- `home-layered.css` / `home-layered.js` 独立管理布局及交互；本阶段最初未替换原 `index.html`，后续接入见上节。
- 已验证两级切换时背景路径、建筑锚点和所有 UI 坐标不变，390px 视口无横向溢出。

预览入口：`../../home-layered.html`。原交互画布 `../../index.html` 保留。

## 图层与规则

- background-v1.png：固定环境，天空、树林、地面、台阶与水晶；所有建筑等级共用同一文件。
- mine-lv1.png：木架矿洞，独立建筑层。
- mine-lv2.png：加固矿洞，独立建筑层。
- 透明检查：一级为 RGBA；二级生成器连续返回 RGB，因此预览复用一级的真实 alpha 作为 CSS 蒙版。两级共用外轮廓，不会显示黑色矩形背景。二级目前是颜色贴图＋独立透明蒙版，并非可直接导入 Cocos 的独立透明 PNG；生产接入时需保留蒙版渲染或另行输出 RGBA。
- 角色复用 `../visual/mole-full.png`，不烘焙进建筑。
- 金币、债务、导航、关卡、入口均由独立界面元素覆盖。
- 建筑图片使用相同显示矩形和底部锚点。等级按钮只是外部美术预览，不扣金币，不关联财富等级、还款阶段或真实建筑升级功能。

## 生成方式与提示词记录

使用内置 image_gen（非 CLI）。参考用户提供的老鼠巷矿洞主界面图，只取其绘画风格。

背景提示词：
> Generate one portrait 9:16 fixed environment plate in the reference's richly painted cartoon mining game style. Sunny cyan sky, green forest, quiet central earth clearing, rocky grass, blue crystals and wooden stairs toward the foreground. Remove all buildings, mine doors, characters, carts, UI, text and signs. Keep the middle clearing usable for a separately composited mine building, ground contact at 65% of canvas height. No UI or text.

一级建筑提示词：
> Generate one front-facing wooden mine entrance as a genuine transparent RGBA sprite. Patched timber, peaked roof, left warm lantern, blank wooden nameplate, dark opaque tunnel and stone foundation. Square canvas, full roof and base, warm chunky painted contours, no white sticker outline. No ground plane, scenery, characters, UI or text. Transparent exterior, opaque dark doorway.

二级建筑提示词：
> Edit only opaque building pixels of the level-one RGBA sprite and preserve the transparent alpha. Upgrade roof to teal metal and wooden columns to dressed stone reinforced with iron. Preserve canvas, scale, entrance, foundation anchor, blank sign and dark opaque tunnel. No background or checkerboard, output genuine RGBA PNG.

生成素材不等于已接入 Cocos：后续按相同图层关系拆成场景节点，并再确定建筑升级条件和数值。
