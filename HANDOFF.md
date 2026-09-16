# HANDOFF.md

## 项目: 用演讲串起的美国史

- **站点**: https://www.booknim.com
- **仓库**: `livingfree2023/english-reading`（公开），分支 `main`
- **部署**: Cloudflare Pages，自动从 `main` 执行 `npm run build`，发布 `dist/`
- **本地克隆**: `<workspace>/english-reading/`

## Astro 维护入口

Markdown 是唯一内容源；不要直接编辑 `dist/` 或生成的 HTML。新增或修改文章时编辑 `src/content/speeches/*.md`，然后运行 `npm run check && npm run build`。

生成的根级 `.html` 文件仅用于发布，不应作为内容编辑入口。

### 正文 Markdown 约定

每一段必须使用一个两位数标题、英文正文和中文引用；标题只作为构建时段号，不会在页面上显示为标题。

```md
### 01

English text with [[vicissitudes|n.|/vɪˈsɪsɪtuːdz/|世事变迁]].

> 中文译文。
```

- 词汇格式固定为 `[[词条|词性|IPA|中文释义]]`；在字段内使用 `\|`、`\\` 或 `\]\]` 转义分隔符。
- 诗句或完整引文段落使用 `:::quote` 与 `:::` 包裹；内部仍是英文正文和中文引用。`::: quote`（带空格）不是有效语法。
- 正文不得写入 `<section>`、`<div>`、`<span>`、`<br>` 或 `<p>` 等 HTML。构建器会生成双语布局、词汇浮层和词汇表。

## 内容计划: 28 篇总计

完整清单与每篇的版权依据见 `CONTENT.md`；结构化来源与媒体字段位于 `src/content/speeches/*.md`，总政策见 `RIGHTS.md`。

### 已发布（28 篇）

| 文件 | 年份 | 标题 | 形式 |
|------|------|------|------|
| washington-first-inaugural-1789.html | 1789 | 华盛顿首次就职演说 | 全文 |
| washington-farewell-1796.html | 1796 | 华盛顿告别演说 | 节选 |
| jefferson-first-inaugural-1801.html | 1801 | 杰斐逊首次就职演说 | 全文 |
| webster-liberty-and-union-1830.html | 1830 | 韦伯斯特「Liberty and Union」 | 节选 |
| lincoln-lyceum-1838.html | 1838 | 林肯青年学会演说 | 节选 |
| douglass-fourth-of-july-1852.html | 1852 | 道格拉斯「What to the Slave Is the Fourth of July?」 | 全文 |
| gettysburg-bilingual.html | 1863 | 葛底斯堡演说 (Bliss 抄本) | 全文 |
| washington-atlanta-compromise-1895.html | 1895 | 亚特兰大妥协演说 | 全文 |
| bryan-cross-of-gold-1896.html | 1896 | 黄金十字架 | 全文 |
| roosevelt-muck-rake-1906.html | 1906 | 拿着粪耙的人 | 全文 |
| wilson-fourteen-points-1918.html | 1918 | 十四点和平原则 | 全文 |
| obama-inaugural-bilingual.html | 2009 | 奥巴马首次就职演说 | 全文 |
| churchill-iron-curtain-1946.html | 1946 | 丘吉尔铁幕演说 | 节选 |
| truman-doctrine-1947.html | 1947 | 杜鲁门主义演说 | 全文 |
| marshall-harvard-1947.html | 1947 | 马歇尔哈佛演说 | 全文 |
| fdr-first-inaugural-1933.html | 1933 | 小罗斯福首次就职演说 | 全文 |
| fdr-four-freedoms-1941.html | 1941 | 小罗斯福四大自由 | 全文 |
| fdr-day-of-infamy-1941.html | 1941 | 小罗斯福耻辱之日 | 全文 |
| eisenhower-farewell-1961.html | 1961 | 艾森豪威尔告别演说 | 全文 |
| jfk-inaugural-1961.html | 1961 | 肯尼迪就职演说 | 全文 |
| lincoln-first-inaugural-1861.html | 1861 | 林肯首次就职演说 | 节选 |
| lincoln-second-inaugural-1865.html | 1865 | 林肯第二次就职演说 | 节选 |
| mlk-i-have-a-dream-1963.html | 1963 | 马丁·路德·金我有一个梦想 | 节选 |
| johnson-we-shall-overcome-1965.html | 1965 | 约翰逊 We Shall Overcome | 节选 |
| rfk-indianapolis-1968.html | 1968 | 罗伯特·肯尼迪金遇刺当晚演说 | 节选 |
| reagan-first-inaugural-1981.html | 1981 | 里根首次就职演说 | 节选 |
| reagan-berlin-wall-1987.html | 1987 | 里根推倒这堵墙 | 节选 |
| obama-keynote-2004.html | 2004 | 奥巴马无畏的希望 | 节选 |

### 待做（0 篇）

28 篇计划已全部登记并发布；后续可继续补充新的演说或扩充现有节选页。

完整清单见 `CONTENT.md`。

## 首页时代分区

| 时代 | 年份 | 标题 |
|------|------|------|
| 1 | 1789–1830 | 建国与早期共和国 |
| 2 | 1838–1865 | 奴隶制、分裂与内战 |
| 3 | 1895–1918 | 镀金时代与进步时代 |
| 4 | 1933–1945 | 大萧条与第二次世界大战 |
| 5 | 1946–1962 | 冷战初期 |
| 6 | 1963–2009 | 民权与当代 |

空时代用 CSS `.era:not(:has(.tl-item)){display:none}` 隐藏。

## 每篇流程

1. **取原文**：Wikisource / Yale Avalon Project / Library of Congress 等权威来源，逐字核对。
2. **编辑 Markdown**：更新 frontmatter 与英中对照正文；每段使用 `### NN`、英文、中文引用，词汇使用 `[[word|part of speech|/IPA/|释义]]`。
3. **媒体与页脚**：只使用外链，分别记录来源、权利说明和回退链接；没有媒体时不显示整个媒体区。
4. **验证**：运行 `npm run check && npm run build`，确认路由、sitemap、元数据和移动布局。
5. **提交**：单独提交内容变更，并同步更新 `CONTENT.md`。

## 版权规则（硬约束）

- **全文（安全）**：美国联邦官员职务作品（17 U.S.C. §105——总统就职、国情咨文、国会记录）；1930 年前出版作品；明确标注 CC/PD 的文本。
- **只能节选**：私人身份的近现代演讲（马丁·路德·金、乔布斯、TED 等）。判例：*Estate of King v. CBS*, 194 F.3d 1211 (11th Cir. 1999)——「performance」非「general publication」，遗产管理机构持有著作权。
- **FDR 1933 首次就职演说**：当前按联邦职务作品登记；如替换文本来源或媒体，需重新核对官方版本与权利说明。

## 媒体规则（硬约束）

- 音频视频一律外链嵌入，绝不下载进仓库。
- 音频先确认是否本人原声（录音技术 1877 年才出现），不是就注明「现代朗诵，非历史原声」。
- 找不到媒体就把该行隐藏（模板已实现）；整块无内容时 `.media` 不出现。

## 卡片体例

- 卡片写 200–300 字历史政治背景，不写篇幅统计（段数/标注数）。
- `kind` 取值：就职演说 / 国情咨文 / 国会演说 / 卸任文告 / 竞选演说 / 公开演说 / 节选。
- 标签用逗号分隔。

## 透明度方案（本会话商定）

1. **任务列表**：每篇拆 4 个 TaskCreate 节点（验证 → 注册 → 更新状态 → 提交），spinner 实时显示当前步骤。
2. **CONTENT.md 看板**：状态四档——`待做` / `进行中` / `待验证` / `已发布`。每步变更写回并提交，repo 随时可查。
3. **并行 sub-agent**：新页面用后台 agent 并行生成；主线程同时验证已完成文件。agent 返回后立即验证并更新状态。
4. **独立操作合并**：互不依赖的检查放在一条消息里并发调用，减少往返等待。

## 已知问题

- `data-page-node-id`：WorkBuddy 编辑器在每个 HTML 元素上注入此属性。提交前必须清除。快速修复：`git checkout -- <file>`（若只是被重新注入）。
- 仓库 git 历史中仍有 24.6 MB `media/obama-inaugural-2009.mp3` blob（已从工作区删除但历史未重写）。彻底清除需 `git filter-repo` + 强推（破坏性操作，需用户同意）。
- 历史提交仍包含已删除的媒体二进制 blob；清理历史需要明确批准后执行 `git filter-repo` 并强推。

## 快速恢复

```bash
# 克隆或拉取
git clone git@github.com:livingfree2023/english-reading.git
# 或: cd <existing clone> && git pull origin main

# 查看当前状态
cat CONTENT.md           # 状态看板
git log --oneline -5      # 最近提交

# 确认 skill 存在
ls src/content/speeches

# 下一步：维护现有 Markdown，或在 CONTENT.md 中登记并加入新的 Markdown 演说
#
# 流程：编辑 Markdown → 运行 npm run check && npm run build → 提交推送
# 可启动后台 agent 并行生成
```
