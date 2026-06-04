# 瓶子评价图生成器 Bottle Rating Generator

版本：V0.1  
产品形态：手机优先 H5 网页小工具  
目标：打开即用、滑动填瓶、生成竖版梗图、保存与分享  
建议仓库名：`bottle-rating-generator`

---

## 0. 给 Vibe Coding 工具的总提示词

请开发一个可发布到 GitHub 的手机优先 H5 小工具，项目名称为“瓶子评价图生成器 / Bottle Rating Generator”。

### 产品定位

这是一个轻量化梗图生成工具，不做登录、不做后端、不做社区、不做多人协作。用户选择模板后，可以编辑标题、瓶子标签和瓶子水位，最后生成一张 9:16 竖版 PNG 图片，适合保存并分享到微信、朋友圈、小红书或群聊。

### 技术栈要求

使用：

- Vite
- React
- TypeScript
- Tailwind CSS
- SVG 绘制瓶子
- Pointer Events 实现手机端瓶内上下滑动
- html-to-image 或等价方案导出 PNG
- localStorage 保存本地草稿
- lz-string 或等价方案压缩 URL 分享数据
- ESLint + Prettier
- Vitest + React Testing Library
- GitHub Actions CI

不要引入后端数据库。不要引入登录系统。不要引入复杂 UI 框架。项目要结构清晰、类型完整、便于后续扩展模板、主题和交互方式。

### 核心功能

1. 首页：展示产品说明、示例区域、3 个模板入口。
2. 编辑页：编辑主标题、副标题、36 个瓶子标签、36 个瓶子水位、液体颜色。
3. 结果页：展示最终生成图，支持生成 PNG、长按保存、复制分享链接、返回编辑。

### V0.1 交互重点

水位编辑采用“瓶内上下滑动”的手机交互，而不是普通横向滑杆。

用户在瓶子内部按住并上下拖动：

- 手指越靠近瓶子顶部，水位越高。
- 手指越靠近瓶子底部，水位越低。
- 液面实时跟随手指变化。
- 松手后确认当前水位。
- 数值范围为 0 到 100。
- 接近 0、25、50、75、100 时允许轻微吸附。
- 同时保留 0 / 25 / 50 / 75 / 100 快捷档位。

V0.2 预留“手绘注水”交互接口：用户在瓶子里画线，线条散成水滴，水滴汇总成液面，最终统计百分比。V0.2 不需要实现，但代码结构要便于未来接入。

### 结果图规格

- 导出尺寸：1080 × 1920 px
- 比例：9:16
- 顶部：主标题、副标题
- 中间：6 × 6 瓶子矩阵
- 底部：一句话总结、生成日期、工具名水印
- 导出图片中不能出现网页按钮、编辑控件或调试信息

### 默认模板

V0.1 固定 3 个模板：

1. 让你的女友评价你
2. 让你的朋友评价你
3. 空白自定义模板

“让你的女友评价你”默认标签：

帅、腹肌、身高、胖、手好看、声音好听、狼狗、奶狗、主动、浪漫、会撒娇、有主见、靠谱、细心、脾气好、可爱、闷骚、霸道、忠诚、嘴甜、会哄人、直球、逗比、安全感、控制欲、占有欲、宠溺、体贴、温柔、粘人、稳重、单纯、会拍照、会唱歌、会做饭、爱打游戏。

### 主题色

支持 5 种液体颜色：

- 粉色：#F48FB1
- 蓝色：#64B5F6
- 绿色：#81C784
- 紫色：#BA68C8
- 橙色：#FFB74D

默认粉色。

### 一句话总结规则

根据 36 个瓶子的平均水位生成：

- 0-20：综合评价：瓶子很空，故事很多。
- 21-40：综合评价：有点东西，但不算太多。
- 41-60：综合评价：大体正常，局部离谱。
- 61-80：综合评价：优点不少，缺点也挺有存在感。
- 81-100：综合评价：基本拉满，建议重点观察。

### GitHub 规范要求

项目必须包含：

- README.md
- LICENSE，默认 MIT
- CHANGELOG.md
- CONTRIBUTING.md
- CODE_OF_CONDUCT.md
- SECURITY.md
- .gitignore
- .editorconfig
- .env.example
- Issue templates
- Pull Request template
- GitHub Actions CI
- 清晰的 package scripts
- TypeScript strict 模式
- 基本单元测试
- 构建成功后可部署到 GitHub Pages / Vercel / Netlify

请直接生成完整项目代码、目录结构、核心组件、类型定义、样式、测试、README 和 GitHub 配置文件。

---

## 1. 产品需求说明 PRD

### 1.1 一句话定义

瓶子评价图生成器是一个手机网页访问的轻量化梗图工具。用户可以选择模板、编辑标签、通过瓶内上下滑动填写水位，并导出一张完整的竖版瓶子评价图。

### 1.2 核心目标

- 30 秒到 2 分钟内生成一张可分享图片。
- 不需要登录。
- 不需要上传图片。
- 不需要学习复杂编辑器。
- 结果图看起来完整、有趣、适合转发。

### 1.3 目标用户

- 情侣之间互相调侃
- 朋友群互评
- 社交平台用户
- 喜欢做轻量梗图的人

### 1.4 核心场景

1. 用户打开网页，选择“让你的女友评价你”模板。
2. 用户修改标签或直接使用默认标签。
3. 用户在每个瓶子上上下滑动，填写水位。
4. 用户点击生成图片。
5. 用户长按保存图片并分享到社交平台。

### 1.5 V0.1 范围

必须实现：

- 模板选择
- 主标题编辑
- 副标题编辑
- 36 个瓶子标签编辑
- 36 个瓶子水位编辑
- 瓶内上下滑动交互
- 快捷档位
- 主题色选择
- 随机生成
- 全部清空
- 全部拉满
- 恢复默认
- 一句话总结
- 结果图预览
- PNG 导出
- 长按保存提示
- 复制分享链接
- 本地草稿保存与恢复
- URL 参数恢复配置

暂不实现：

- 登录
- 后端
- 用户系统
- 模板社区
- 多人评价
- 评论点赞
- 排行榜
- AI 文案
- 复杂图层编辑
- 付费功能

---

## 2. 页面与交互规格

### 2.1 页面结构

采用单页应用，包含 3 个主要页面状态：

1. HomePage：首页
2. EditorPage：编辑页
3. ResultPage：结果页

### 2.2 首页

内容：

- 产品名：瓶子评价图生成器
- 副标题：自由填写属性，生成你的专属评价梗图
- 简单示例预览
- 3 个模板入口
- 开始制作按钮

模板入口：

- 让你的女友评价你
- 让你的朋友评价你
- 空白自定义模板

点击模板后进入编辑页。

### 2.3 编辑页

模块：

- 顶部导航
- 标题编辑区
- 副标题编辑区
- 颜色选择区
- 快捷操作区
- 瓶子矩阵区
- 生成图片按钮

字段限制：

- 主标题最多 18 个中文字符或 36 个英文字符。
- 副标题最多 24 个中文字符或 48 个英文字符。
- 单个瓶子标签最多 5 个中文字符或 10 个英文字符。
- 标签不能为空。
- 瓶子水位范围为 0 到 100。

### 2.4 瓶内上下滑动交互

这是 V0.1 的核心手感。

操作方式：

- 用户在瓶子内部按下。
- 用户上下拖动。
- 根据触点在瓶子内部的相对高度计算水位。
- 液面实时变化。
- 当前百分比以小浮层形式显示。
- 松手后确认数值。
- 如果接近 0、25、50、75、100，自动吸附。

水位计算：

```ts
const rawValue = ((bottomY - touchY) / fillHeight) * 100
const value = clamp(rawValue, 0, 100)
```

吸附规则：

```ts
const snapPoints = [0, 25, 50, 75, 100]
const threshold = 3
```

如果与吸附点差值小于等于 3，则吸附到该点。

可选增强：

```ts
navigator.vibrate?.(10)
```

仅在浏览器支持时触发，不能影响主流程。

### 2.5 快捷档位

当前选中瓶子提供快捷档位：

- 0%
- 25%
- 50%
- 75%
- 100%

### 2.6 快捷操作

- 随机生成
- 全部清空
- 全部拉满
- 恢复默认

随机生成规则：

- 70% 的瓶子随机值在 30 到 90。
- 15% 的瓶子随机值在 0 到 30。
- 15% 的瓶子随机值在 90 到 100。

### 2.7 结果页

内容：

- 最终图片预览
- 保存图片按钮
- 复制分享链接按钮
- 返回编辑按钮
- 重新制作按钮

保存方式：

- 点击保存图片后生成 PNG。
- 移动端展示图片预览。
- 提示“长按图片保存”。

---

## 3. 结果图视觉规格

### 3.1 画布

- 宽度：1080 px
- 高度：1920 px
- 比例：9:16
- 背景：白色或浅粉色
- 风格：干净、手绘、轻松、梗图感

### 3.2 布局

顶部区域：

- 高度约 220 px
- 主标题
- 副标题

中部区域：

- 高度约 1300 px
- 6 × 6 瓶子矩阵
- 每个瓶子下方显示标签

底部区域：

- 高度约 300 px
- 一句话总结
- 生成日期
- 工具名水印

### 3.3 瓶子绘制

使用 SVG 绘制。每个瓶子包含：

- 黑色外轮廓
- 内部液体
- 液面
- 标签文字
- 可选百分比浮层，导出图默认不显示百分比

V0.1 液面使用水平线。V0.2 可扩展为波浪液面或水滴动画。

---

## 4. 数据结构

### 4.1 Bottle

```ts
export type Bottle = {
  id: string
  label: string
  value: number
}
```

### 4.2 Template

```ts
export type Template = {
  id: string
  name: string
  title: string
  subtitle: string
  themeColor: ThemeColorId
  bottles: Bottle[]
}
```

### 4.3 AppState

```ts
export type AppState = {
  version: 1
  templateId: string
  title: string
  subtitle: string
  themeColor: ThemeColorId
  showPercent: boolean
  bottles: Bottle[]
  updatedAt: number
}
```

### 4.4 ThemeColor

```ts
export type ThemeColorId = 'pink' | 'blue' | 'green' | 'purple' | 'orange'

export type ThemeColor = {
  id: ThemeColorId
  name: string
  hex: string
}
```

---

## 5. 技术架构

### 5.1 推荐技术栈

- Vite
- React
- TypeScript
- Tailwind CSS
- SVG
- html-to-image
- lz-string
- Vitest
- React Testing Library
- ESLint
- Prettier

### 5.2 目录结构

```txt
bottle-rating-generator/
  .github/
    workflows/
      ci.yml
    ISSUE_TEMPLATE/
      bug_report.yml
      feature_request.yml
    pull_request_template.md
  public/
    favicon.svg
    og-image.png
  src/
    app/
      App.tsx
      routes.ts
    components/
      Bottle.tsx
      BottleGrid.tsx
      ColorPicker.tsx
      EditorPanel.tsx
      Header.tsx
      ResultCanvas.tsx
      TemplateSelector.tsx
      Toolbar.tsx
    data/
      templates.ts
      themeColors.ts
    hooks/
      useBottleDrag.ts
      useLocalDraft.ts
      useShareState.ts
    lib/
      clamp.ts
      exportImage.ts
      randomize.ts
      shareCodec.ts
      storage.ts
      summary.ts
      validation.ts
    styles/
      globals.css
    types/
      bottle.ts
      appState.ts
      template.ts
    test/
      setup.ts
    main.tsx
  .editorconfig
  .env.example
  .gitignore
  .prettierrc
  eslint.config.js
  index.html
  LICENSE
  README.md
  CHANGELOG.md
  CODE_OF_CONDUCT.md
  CONTRIBUTING.md
  SECURITY.md
  package.json
  tsconfig.json
  tsconfig.app.json
  tsconfig.node.json
  vite.config.ts
```

### 5.3 架构原则

- 模板数据配置化，避免写死在组件中。
- 渲染组件和编辑组件分离。
- 导出图区域独立封装为 ResultCanvas。
- 分享编码和解码独立封装。
- 本地存储独立封装。
- 水位交互独立封装为 hook，便于未来替换成手绘水滴模式。
- 使用 TypeScript strict，避免隐式 any。
- 所有工具函数可单元测试。

---

## 6. 核心组件规格

### 6.1 Bottle.tsx

职责：

- 渲染单个 SVG 瓶子。
- 根据 value 渲染液体高度。
- 支持 pointer 事件。
- 显示标签。
- 编辑状态下显示百分比浮层。

Props：

```ts
type BottleProps = {
  bottle: Bottle
  color: string
  editable?: boolean
  showPercent?: boolean
  onValueChange?: (id: string, value: number) => void
  onLabelEdit?: (id: string) => void
}
```

### 6.2 BottleGrid.tsx

职责：

- 渲染 6 × 6 矩阵。
- 控制移动端自适应。
- 将单个瓶子的编辑事件上传。

### 6.3 EditorPanel.tsx

职责：

- 编辑标题、副标题。
- 编辑当前选中瓶子标签。
- 显示快捷档位。
- 控制主题色。

### 6.4 ResultCanvas.tsx

职责：

- 只渲染最终图像内容。
- 不包含任何按钮或编辑控件。
- 作为图片导出的唯一 DOM 节点。

### 6.5 TemplateSelector.tsx

职责：

- 显示模板入口。
- 点击后初始化 AppState。

---

## 7. 工具函数规格

### 7.1 clamp.ts

```ts
export function clamp(value: number, min = 0, max = 100): number
```

### 7.2 randomize.ts

```ts
export function randomBottleValue(): number
export function randomizeBottles(bottles: Bottle[]): Bottle[]
```

### 7.3 summary.ts

```ts
export function getAverageValue(bottles: Bottle[]): number
export function getSummaryText(bottles: Bottle[]): string
```

### 7.4 shareCodec.ts

```ts
export function encodeShareState(state: AppState): string
export function decodeShareState(data: string): AppState | null
```

要求：

- 解码失败返回 null。
- 版本不兼容时返回 null。
- 不抛出未处理异常。

### 7.5 exportImage.ts

```ts
export async function exportNodeToPng(node: HTMLElement): Promise<string>
```

返回 dataURL，用于展示和长按保存。

### 7.6 validation.ts

```ts
export function validateTitle(input: string): string
export function validateSubtitle(input: string): string
export function validateLabel(input: string): string
```

---

## 8. 状态管理

V0.1 不需要 Redux。可以使用 React useState + 自定义 hook。

状态来源优先级：

1. URL data 参数
2. localStorage 草稿
3. 默认模板

打开页面逻辑：

- 如果 URL 有 data 参数，尝试恢复分享内容。
- 如果恢复失败，加载默认模板。
- 如果没有 data 参数但有本地草稿，询问是否继续。
- 如果没有草稿，进入首页选择模板。

---

## 9. 本地存储

localStorage key：

```txt
bottle_rating_draft_v1
```

保存内容：

```ts
AppState
```

触发保存：

- 标题变化
- 副标题变化
- 标签变化
- 水位变化
- 主题色变化

要求：

- 存储失败不阻断主流程。
- Safari 隐私模式下 localStorage 失败时静默降级。

---

## 10. 分享链接

### 10.1 编码

流程：

1. AppState 转 JSON。
2. 压缩。
3. encodeURIComponent。
4. 写入 URL 的 data 参数。

### 10.2 解码

流程：

1. 读取 data 参数。
2. decodeURIComponent。
3. 解压。
4. JSON parse。
5. 校验字段。
6. 恢复 AppState。

### 10.3 隐私提示

因为分享链接包含用户填写的标题、标签和水位，README 和页面说明中应提示：

分享链接会包含当前填写内容。不要在标签中填写敏感个人信息。

---

## 11. 图片导出

### 11.1 导出要求

- 导出 ResultCanvas。
- 导出尺寸 1080 × 1920。
- 导出 PNG。
- 不包含按钮和控件。
- 移动端可长按保存。

### 11.2 失败兜底

提示：

```txt
图片生成失败，请稍后重试，或直接截图保存。
```

### 11.3 微信浏览器说明

微信内置浏览器中自动下载不稳定，因此主路径是：

```txt
生成图片 → 展示图片 → 用户长按保存
```

---

## 12. 可扩展性设计

### 12.1 模板扩展

新增模板只需要修改 `src/data/templates.ts`。

模板必须满足：

- 36 个 bottles
- id 唯一
- label 符合长度限制
- title/subtitle 不超长

### 12.2 主题扩展

新增颜色只需要修改 `src/data/themeColors.ts`。

### 12.3 交互扩展

V0.1 使用 `useBottleDrag`。

未来 V0.2 可新增：

```ts
useBottleDrawFill()
```

并保持 Bottle 组件 props 不变：

```ts
onValueChange(id, value)
```

这样手绘水滴模式只改变交互输入，不改变数据结构、导出逻辑和结果图结构。

### 12.4 渲染扩展

瓶子图形应封装为 SVG path。未来可以扩展：

- 试管
- 奶茶杯
- 胶囊
- 电量格
- 波浪液面

但 V0.1 仅实现瓶子。

---

## 13. 可访问性与移动端要求

### 13.1 移动端

优先适配：

- iPhone Safari
- 微信内置浏览器
- Android Chrome

要求：

- 单手可操作。
- 按钮高度不低于 44 px。
- 触控区域足够大。
- 禁止页面在拖动瓶子时误滚动。
- 使用 `touch-action: none` 控制瓶子拖动区域。

### 13.2 可访问性

- 所有按钮有明确文本。
- SVG 瓶子有 aria-label。
- 颜色选择不能只依赖颜色，也要显示文字。
- 输入框有 label。
- 图片生成失败有文本提示。

---

## 14. GitHub 工程规范

### 14.1 README.md 必须包含

- 项目简介
- Demo 截图位置
- 功能列表
- 技术栈
- 本地开发步骤
- 可用脚本
- 项目结构
- 分享链接隐私说明
- 部署方式
- Roadmap
- License

### 14.2 package scripts

建议：

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "format": "prettier . --write",
    "format:check": "prettier . --check",
    "test": "vitest",
    "test:run": "vitest run",
    "typecheck": "tsc --noEmit"
  }
}
```

### 14.3 GitHub Actions CI

每次 push 和 pull request 执行：

- install
- lint
- format check
- typecheck
- test
- build

### 14.4 Commit 规范

建议使用 Conventional Commits：

- feat: 新功能
- fix: 修复问题
- docs: 文档
- style: 格式调整
- refactor: 重构
- test: 测试
- chore: 工程配置

示例：

```txt
feat: add bottle vertical drag interaction
fix: handle invalid share data
docs: update README usage guide
```

### 14.5 分支建议

- main：稳定分支
- dev：开发分支，可选
- feature/\*：功能分支
- fix/\*：修复分支

### 14.6 版本规范

使用 SemVer：

- 0.1.0：首个 MVP
- 0.2.0：手绘水滴交互
- 0.3.0：更多模板和主题
- 1.0.0：稳定公开版本

---

## 15. 必备仓库文件内容要求

### 15.1 LICENSE

默认使用 MIT License。

### 15.2 CHANGELOG.md

记录版本变化。

初始内容：

```md
# Changelog

## 0.1.0

- Initial MVP.
- Add template selection.
- Add bottle label editing.
- Add vertical drag fill interaction.
- Add PNG export.
- Add local draft and share link support.
```

### 15.3 CONTRIBUTING.md

说明：

- 如何安装
- 如何开发
- 如何提交 issue
- 如何提交 PR
- Commit 格式
- 测试要求

### 15.4 SECURITY.md

说明：

- 本项目不存储用户数据。
- 分享链接会包含用户填写内容。
- 安全问题通过 GitHub Security Advisory 或 issue 联系维护者。

### 15.5 CODE_OF_CONDUCT.md

使用常规 Contributor Covenant 风格内容即可。

### 15.6 .env.example

当前无必需环境变量，但保留文件：

```txt
# No environment variables are required for V0.1.
```

---

## 16. 测试要求

### 16.1 单元测试

必须覆盖：

- clamp
- snapValue
- summary
- randomize
- validateLabel
- encode/decode share state

### 16.2 组件测试

建议覆盖：

- Bottle 根据 value 正确渲染液体高度。
- BottleGrid 渲染 36 个瓶子。
- 颜色选择能更新主题色。
- 结果图不包含编辑按钮。

### 16.3 手动测试清单

- iPhone Safari 打开正常。
- 微信内置浏览器打开正常。
- Android Chrome 打开正常。
- 拖动瓶子时页面不误滚动。
- 0%、50%、100% 显示正确。
- 随机生成有明显差异。
- 保存图片不包含网页按钮。
- 复制链接后新窗口能恢复内容。
- localStorage 草稿能恢复。
- 无 data 或错误 data 时能降级到默认模板。

---

## 17. 验收标准

### 17.1 功能验收

- 能选择 3 个模板。
- 能编辑主标题、副标题。
- 能编辑 36 个瓶子标签。
- 能通过瓶内上下滑动调整水位。
- 能使用快捷档位。
- 能选择 5 种主题色。
- 能随机生成。
- 能全部清空。
- 能全部拉满。
- 能恢复默认。
- 能生成 PNG。
- 能复制分享链接。
- 分享链接能恢复内容。
- 刷新后能恢复草稿。

### 17.2 视觉验收

- 结果图比例为 9:16。
- 36 个瓶子完整显示。
- 标签不明显重叠。
- 水位显示准确。
- 标题和总结清晰。
- 水印不过度抢眼。
- 导出图无编辑控件。

### 17.3 体验验收

- 首屏 3 秒内可见。
- 新用户 30 秒内能生成第一张图。
- 手机单手可以完成主要操作。
- 无登录阻断。
- 操作路径短。

---

## 18. Roadmap

### 0.1.0

- 竖向滑动填瓶
- 36 个瓶子
- 3 个模板
- PNG 导出
- 分享链接
- GitHub 规范文件

### 0.2.0

- 手绘注水交互
- 画线散成水滴
- 水滴汇总成液面
- 百分比统计

### 0.3.0

- 更多模板
- 更多瓶子样式
- 更多主题色
- 可选显示百分比

### 1.0.0

- 稳定版
- 完整移动端兼容
- 完整测试覆盖
- 可公开传播的 Demo

---

## 19. 设计原则

1. 轻量优先：任何增加操作负担的功能都暂缓。
2. 手机优先：交互必须符合手指操作。
3. 生成优先：最终图片质量比编辑器复杂度更重要。
4. 配置驱动：模板、颜色、文案尽量配置化。
5. 可扩展：交互模式、模板、主题应能平滑扩展。
6. 隐私克制：不主动收集用户数据。
7. GitHub 友好：开源仓库结构清晰，文档完整，CI 可运行。
