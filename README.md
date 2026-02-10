# 🛡️ Cyber Sentinel Dashboard

一款基于 React + Vite 的网络安全态势可视化仪表盘，内含 3D 地球轨迹、趋势分析、资产与安全域排行等模块，适用于演示与快速验证前端可视化能力。

---

## 📋 项目简介
- 展示网络攻击与告警的总体态势，含 3D 地球流动、折线/柱状图、排行列表与指标卡片。
- 当前版本使用静态数据演示，无后端依赖，适合本地快速运行与二次开发。
- 采用 Tailwind CDN 直引样式与 Recharts/Three.js 进行图形渲染。

---

## 🛠️ 技术栈
- 框架：React 19 + TypeScript 5
- 构建：Vite 6
- 三维/可视化：three、@react-three/fiber、@react-three/drei、recharts
- 图标：lucide-react
- 样式：Tailwind CSS（CDN 方式）
- 状态管理：React 内置状态（useState/useEffect），暂未引入全局状态库

---

## 🏗️ 项目架构
- 入口与布局
  - index.html：HTML 模板，注入 Tailwind CDN 与 importmap（浏览器直载模式）
  - index.tsx：React 应用挂载入口
  - App.tsx：页面主容器与三栏布局，时间范围切换、底部指标跑马灯
- 业务组件
  - Header.tsx：顶部导航与六个状态环
  - Globe3D.tsx：Three 场景与地球节点/迁移弧线可视化、光效与装饰
  - StatPanel.tsx：趋势图、预测柱图、资产排行、安全域占比、漏洞与指标卡片等
- 基础设施
  - types.ts：类型定义（AttackData、MetricCardProps 等）
  - constants.tsx：主题色与顶部指标常量
  - vite.config.ts / tsconfig.json：构建与路径别名配置（@ 指向项目根）

---

## 📁 目录结构

```text
Cyber-Sentinel-Dashboard/
├─ index.html
├─ index.tsx
├─ App.tsx
├─ components/
│  ├─ Header.tsx
│  ├─ Globe3D.tsx
│  └─ StatPanel.tsx
├─ constants.tsx
├─ types.ts
├─ package.json
├─ tsconfig.json
├─ vite.config.ts
├─ metadata.json
└─ README.md
```

---

## ⚡ 核心功能模块与工作流程
- Header（顶部态势概览）：以环形卡片展示“全网总览、攻击趋势、资产安全”等指标。
- Globe3D（3D 地球）：加载地球纹理与节点数据，绘制迁移弧线与光晕，支持交互与动效。
- StatPanel（统计与分析）：
  - 趋势图（TrendChart）：展示告警量与攻击日志量的时间序列（面积折线图）。
  - 预测柱图（PredictionBarChart）：基于静态数据演示未来 24H 攻击日志预测。
  - 资产排行（AssetRankList）：受攻击资产 TOP5。
  - 安全域占比（SecurityZoneList）：TOP5 安全域百分比条。
  - 其它 UI：SectionTitle、StatusRow、StatBox、VulnerabilitySection 等。
- 数据流：当前版本均为前端静态数据（常量/组件内部生成），未接入远端接口。

---

## 🔧 环境变量
- 预留变量：`GEMINI_API_KEY`（定义在 Vite 的 define 中，同时映射到 `process.env.API_KEY` 与 `process.env.GEMINI_API_KEY`）
- 现状：业务代码暂无对该变量的读取；如将来接入后端/AI 服务，可在 `import.meta.env` 或 `process.env` 中使用。
- 建议：在根目录创建 `.env.local` 并设置 `GEMINI_API_KEY=xxxx`，同时在代码中接入对应读取逻辑。

---

## 🧑‍💻 开发与运行
1. 前置条件：Node.js（建议 LTS 版本）
2. 安装依赖：
   ```bash
   npm install
   ```
3. 运行开发服务器：
   ```bash
   npm run dev
   ```
4. 构建生产包：
   ```bash
   npm run build
   ```
5. 预览构建产物：
   ```bash
   npm run preview
   ```

---

## ⚙️ 部署指南
- 静态托管：本项目为纯前端产物，可将 `dist/` 上传到任意静态托管（如 Vercel、Netlify、GitHub Pages、Nginx）。
- 注意事项：
  - Tailwind 以 CDN 注入，未进行按需裁剪；如需生产优化，建议改用 PostCSS 集成（tailwind.config.js）并启用 purge。
  - Three 纹理资源默认从外部 URL 加载（threejs.org）；生产环境建议自托管以降低外部依赖与不可用风险。
  - importmap 仅在浏览器直载时必要；在 Vite 构建模式下不需依赖，可移除以简化心智负担。

---

## 📦 API 接口
- 当前版本：未接入后端 API，所有数据为静态演示。
- 扩展建议：
  - 统一在 `src/services/` 新增请求封装（如 `fetch` 或 `axios`），并在组件内通过 hooks 拉取数据。
  - 约定示例：
    - GET `/api/metrics/trend?range=24h` → 返回告警量与攻击日志量时序
    - GET `/api/prediction/attack-logs?hours=24` → 返回 24H 预测柱图数据
    - GET `/api/assets/top?limit=5` → 受攻击资产 TOP N
    - GET `/api/security-zones/top?limit=5` → 安全域 TOP N
  - 环境变量：将后端地址写入 `VITE_API_BASE_URL`，在 `import.meta.env.VITE_API_BASE_URL` 中读取。

---

## 💡 常见问题（FAQ）
- 为什么设置了 `GEMINI_API_KEY` 却没有生效？
  - 当前代码未引用该变量；请在需要调用外部服务时，从 `import.meta.env` 或 `process.env` 中读取并使用。
- Tailwind CDN 会影响生产优化吗？
  - 是。CDN 模式不会进行按需裁剪，产物体积较大；建议改为本地构建集成。
- 浏览器 importmap 与 Vite 构建会冲突吗？
  - 在打包模式中不需要 importmap；建议移除或仅用于纯浏览器直载的原型场景。
- 依赖里有一个 `this` 包是什么？
  - 该包在代码中未被使用，疑似误加；建议移除以避免安全与维护风险。
- 3D 地球纹理加载很慢或失败？
  - 建议将外部纹理资源改为本地/自托管，并开启缓存策略。

---
