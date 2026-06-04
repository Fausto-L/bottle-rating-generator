# 瓶子评价图生成器 / Bottle Rating Generator

手机优先的 H5 梗图生成器。选择模板，编辑标题和 36 个瓶子标签，用手指在瓶内上下滑动调整水位，生成 1080 x 1920 的竖版 PNG。

## Features

- 3 个内置模板：女友评价、朋友评价、空白自定义
- 36 个 SVG 瓶子，支持瓶内纵向拖动填充
- 0 / 25 / 50 / 75 / 100 快捷档位和吸附
- 5 种液体主题色
- 随机生成、全部清空、全部拉满、恢复默认
- 本地草稿保存与 URL 分享恢复
- 结果图导出 PNG，移动端长按保存

## Demo Screenshot

Demo 截图可放在 `public/` 或项目 README 资产目录中。当前仓库包含 `reference/` 下的原始参考图。

## Tech Stack

Vite, React, TypeScript, Tailwind CSS, SVG, Pointer Events, html-to-image,
lz-string, Vitest, React Testing Library, ESLint, Prettier.

## Local Development

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev` starts Vite.
- `npm run build` runs TypeScript build and Vite build.
- `npm run preview` previews the production build.
- `npm run lint` runs ESLint.
- `npm run format:check` checks Prettier formatting.
- `npm run test:run` runs tests once.
- `npm run typecheck` runs TypeScript without emitting.

## Project Structure

```txt
src/app        App shell and page state
src/components UI and SVG rendering components
src/data       Templates and theme colors
src/hooks      Draft, share, and drag hooks
src/lib        Pure utilities
src/types      Shared TypeScript types
```

## Privacy

Share links contain the current title, subtitle, labels, bottle values, and theme
color. Do not put sensitive personal information in content you plan to share.
Drafts are saved only in the current browser's localStorage.

## Deploy

The app is static and can be deployed to GitHub Pages, Vercel, or Netlify after:

```bash
npm run build
```

## Roadmap

- `0.2.0`: hand-drawn fill interaction and water drop animation.
- `0.3.0`: more templates, bottle styles, and themes.
- `1.0.0`: stable public release with broader mobile compatibility.

## License

MIT
