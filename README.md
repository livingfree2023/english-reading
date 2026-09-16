# english-reading

中英双语精读材料。

| 文件 | 内容 |
| --- | --- |
| `obama-inaugural-bilingual.html` | 奥巴马 2009 年首次就职演说：34 段英文原文 + 逐段中文对照；高级词汇带金色虚线下划线，悬停或单击弹出浮层显示词性、美式音标与中文释义；页尾附词汇总表。 |

浏览器直接打开 HTML 即可，无依赖。

## 部署

静态站点，无构建步骤。Vercel 导入仓库后：Framework Preset 选 **Other**，Build Command 与 Output Directory 留空。
`vercel.json` 把 `/` 重写到 `obama-inaugural-bilingual.html`，因此根路径可直接访问。
