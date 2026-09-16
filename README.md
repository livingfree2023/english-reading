# english-reading

中英双语精读材料。

| 文件 | 内容 |
| --- | --- |
| `obama-inaugural-bilingual.html` | 奥巴马 2009 年首次就职演说：34 段英文原文 + 逐段中文对照；高级词汇带金色虚线下划线，悬停或单击弹出浮层显示词性、美式音标与中文释义；页尾附词汇总表。 |

浏览器直接打开 HTML 即可，无依赖。

## 媒体文件

`media/` 存放与文章配套的音频，随仓库一起部署。

| 文件 | 大小 | 来源 / 授权 |
| --- | --- | --- |
| `media/obama-inaugural-2009.mp3` | 24.6 MB，18:58 | Wikimedia Commons「Barack Obama inauguration speech 2009」，公有领域 |

视频不入库，页面用 YouTube 懒加载嵌入（点击后插入 `youtube-nocookie` iframe），来源为 The Obama White House 官方频道 `3PuHGKnboNY`。

## 新增一篇

1. 把做好的 `.html` 放进仓库根目录。
2. 在 `index.html` 的 `<ul class="list">` 里复制一段 `<li>…</li>`，改序号、标题、链接与统计（文件内有注释模板）。
3. 更新页脚「共 N 篇」。

## 部署

静态站点，无构建步骤。Vercel 导入仓库后：Framework Preset 选 **Other**，Build Command 与 Output Directory 留空。
`index.html` 为首页，根路径直接可访问；`vercel.json` 仅开启 `cleanUrls`（访问时可省略 `.html` 后缀）。
