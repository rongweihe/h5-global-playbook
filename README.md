# 海外 H5 游戏创业决策报告

面向 5–8 人创业团队的中文研究报告，调研日期为 **2026-10-30**。

计划发布地址：**https://rongweihe.github.io/h5-global-playbook/**。此地址只有在仓库启用 Pages 且部署成功后才可访问；请以 Actions 的 `Deploy report to GitHub Pages` 结果为准。

报告包含市场进入策略、10 个重点渠道、8 款代表游戏、成本与广告收益模型、获客漏斗、技术架构、AI 工作流、风险清单和 90 天验证计划，附45条来源索引与各游戏官方页面。

## 本地运行

```sh
python3 -m http.server 8765 --bind 127.0.0.1 --directory dist
```

打开 http://127.0.0.1:8765 。正文为静态 HTML，无构建步骤、无第三方运行依赖、无追踪脚本。收益计算器与产品筛选需要现代浏览器支持 JavaScript。

## 修改与验证

- `dist/index.html`：报告正文和来源。
- `dist/styles.css`：响应式布局与打印样式。
- `dist/model.js`：BigInt 有理数收益模型。
- `dist/app.js`：筛选、情景切换和表单交互。

```sh
node --check dist/model.js
node --check dist/app.js
node --test model.test.cjs
python3 scripts/check_report.py
```

金额输入最多4位小数；中间计算保留有理数，展示四舍五入到分，盈亏平衡人数向上取整。测试覆盖基准、低量、高表现、零值、异常输入与边界。模型不执行支付或交易。

## GitHub Pages

在仓库 **Settings → Pages → Build and deployment → Source** 中选择 **GitHub Actions**。工作流在推送 `main` 或手动执行时，先进行验证，再发布 `dist/`。

GitHub Free 的私有仓库不能启用 Pages；需要公开仓库或支持私有仓库 Pages 的套餐。只改变仓库可见性并不自动启用 Pages。部署作业只申请 `pages: write` 与 `id-token: write`，源代码读取为 `contents: read`。

## 研究口径

公开事实、社区个案、模型假设和顾问判断分别标注。预算、汇率、eCPM、DAU、初始验收线不是行业平均或收益承诺。未开展游戏实机深度评测、用户访谈或法律/税务审计。外部平台规则在签约与上线前需要重新确认。
