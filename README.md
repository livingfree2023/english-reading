# english-reading

中英双语精读材料：以演讲为线索，按时间轴串起美国历史。

线上地址：https://www.booknim.com

| 文件 | 内容 |
| --- | --- |
| `src/content/speeches/*.md` | 28 篇演说的 Markdown 正文与结构化 frontmatter，作为唯一内容源。 |
| `src/layouts/`、`src/components/` | 统一文章模板、时间轴卡片、媒体面板与词汇浮层。 |
| `src/pages/` | Astro 生成首页、原有 `.html` 文章 URL、sitemap 与 robots.txt。 |
| `RIGHTS.md` | 文本、音视频来源与美国版权状态说明。 |

开发环境需要 Node.js 20+；运行 `npm install` 安装依赖，`npm run dev` 本地预览，`npm run check` 校验内容，`npm run build` 生成 `dist/`。

## 音频与视频

一律**外链嵌入，不下载进仓库**，并在页面上标注来源与授权。

| 文章 | 媒体 | 来源 / 授权 |
| --- | --- | --- |
| 葛底斯堡演说 | 音频 1:50 | Wikimedia Commons「Gettysburg by Britton.ogg」，朗诵 Britton Rea，权利人放弃著作权。林肯本人无录音，此为现代朗诵，不是历史原声 |
| 葛底斯堡演说 | 视频 | YouTube 懒加载嵌入，频道 TimelessReader1 `JtEqTBuigFY` |
| 奥巴马 2009 就职演说 | 音频 18:58 | Wikimedia Commons「Barack Obama inauguration speech 2009」，公有领域 |
| 奥巴马 2009 就职演说 | 视频 | YouTube 懒加载嵌入（点击后插入 `youtube-nocookie` iframe），The Obama White House 官方频道 `3PuHGKnboNY` |

## 新增一篇

1. 先确认**文本版权**（全文页只做已核实的美国公有领域文本；版权受限的改做节选页）。
2. 在 `src/content/speeches/` 新建 Markdown 文件，填写完整 frontmatter 和英中对照正文。
3. 添加词汇标注、来源、版权说明和可用媒体；不要下载外部媒体。
4. 运行 `npm run check && npm run build`，确认 URL、sitemap 和媒体状态。

## 部署

静态站点，无构建步骤。部署在 **Cloudflare Pages**，域名 **www.booknim.com**。
构建命令为 `npm run build`，输出目录为 `dist`；Astro 生成的 `dist/index.html` 为首页。
仓库已删除 `vercel.json`（Cloudflare Pages 不读取它）。
