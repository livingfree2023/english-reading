# english-reading

中英双语精读材料：以演讲为线索，按时间轴串起美国历史。

线上地址：https://www.booknim.com

| 文件 | 内容 |
| --- | --- |
| `index.html` | 首页。时间轴目录，每张卡片含日期、场合与 200–300 字历史政治背景。 |
| `obama-inaugural-bilingual.html` | 奥巴马 2009 年首次就职演说：34 段英文原文 + 逐段中文对照；生词带金色虚线下划线，悬停或单击弹出浮层显示词性、美式音标与中文释义；页尾附词汇总表。 |

浏览器直接打开 HTML 即可，无依赖。

## 音频与视频

一律**外链嵌入，不下载进仓库**，并在页面上标注来源与授权。

| 文章 | 媒体 | 来源 / 授权 |
| --- | --- | --- |
| 奥巴马 2009 就职演说 | 音频 18:58 | Wikimedia Commons「Barack Obama inauguration speech 2009」，公有领域 |
| 奥巴马 2009 就职演说 | 视频 | YouTube 懒加载嵌入（点击后插入 `youtube-nocookie` iframe），The Obama White House 官方频道 `3PuHGKnboNY` |

## 新增一篇

1. 先确认**文本版权**（全文页只做公有领域文本；版权受限的改做节选页）。
2. 把做好的 `.html` 放进仓库根目录。
3. 在 `index.html` 的 `<ol class="tl">` 里按年份顺序插入一段 `<li class="tl-item">…</li>`（文件内有注释模板）。
4. 更新页脚「共 N 篇」。

## 部署

静态站点，无构建步骤。部署在 **Cloudflare Pages**，域名 **www.booknim.com**。
构建配置留空（无 build command），输出目录为仓库根目录；`index.html` 即首页。
仓库已删除 `vercel.json`（Cloudflare Pages 不读取它）。
