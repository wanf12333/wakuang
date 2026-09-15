# 两个仓库的协作方式

本目录为独立前端仓库：https://github.com/wanf12333/wakuang 。父目录是 Cocos 仓库。父仓库忽略 frontend-design/，双方不要互相提交对方的代码。不要从 Cocos 仓库执行 git add -f frontend-design。

## 第一次放到远程

1. 在 Git 服务创建私有空仓库并授予同事权限。不要把 Cocos 仓库地址用作前端远程地址。
2. 在本目录检查 `git status`、`npm run check`。检查将提交的文件后执行 `git add .`，再 `git commit -m "Initial UI design workspace"`。
3. 执行 `git remote add origin <前端仓库地址>`，再 `git push -u origin main`。

此工程已指定 origin 为 https://github.com/wanf12333/wakuang.git；已有仓库无需重复执行上述初始化步骤。不要提交 token、密码、node_modules 或截图检查缓存。

## 同事设计

克隆前端仓库 → npm start → 新建设计分支 → 修改原型/素材 → npm run check → 提交 PR。设计范围见 README 和 DESIGN-RULES。主玩法当前为 Cocos 静态效果基准，不验证玩法。

## 你拉取并还原

1. 在 frontend-design 内运行 `git status`；先处理本地改动，再执行 `git pull --ff-only`。不要用强制覆盖来解决冲突。
2. 启动并确认界面。通过后记录前端 `git rev-parse HEAD`。
3. 在 Cocos 根目录运行 `node tools/qa/plan-frontend-sync.cjs` 查看原型差异。该命令只报告，不覆盖或删除任何文件。
4. 按 COCOS-HANDOFF.md 把选定界面还原到 Cocos。不要整目录覆盖 assets，不把前端 Git 拉取等同于完成原生接入。
5. Cocos 的提交说明注明对应前端提交号、已还原页面和未还原页面。前端和 Cocos 分别提交。

现有工具仍使用 art-delivery/interactive-review-v6 作为 Cocos 接入原型快照；它不是第二个给同事编辑的源。前端为设计主源，这个快照只在你确认后更新。源码导出和原生适配仍在 Cocos 端执行。
