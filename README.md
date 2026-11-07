# 大顺的旅行日志 · 导游个人博客

一个中国古代山水画风格的导游个人博客：记录**带团工作日志**，沉淀**景点知识库与讲解词**。

视觉取法古代名迹——王希孟《千里江山图》的青绿设色、黄公望《富春山居图》的墨韵、戴进《春山积翠图》的松意；交互语言参考 CGTN《千年调·宋代山水花鸟》数字特展（单字印章导航、双语题字、云雾与生灵点景、昼日夜月）。

- 站点生成器：[Hugo](https://gohugo.io/)（纯静态，无需数据库）
- 托管：GitHub Pages（GitHub Actions 自动构建发布）
- 字体：[霞鹜文楷 LXGW WenKai](https://github.com/lxgw/LxgwWenKai)（开源，OFL 协议）+ Noto Serif SC
- 日常写作：**只写 Markdown，push 即发布**

---

## 一、30 秒看懂写作流程

```bash
# 1. 写一篇工作日志（自动套用日志模板）
hugo new content logs/2026-10-25-my-tour.md

# 2. 写一篇景点知识（自动套用知识模板）
hugo new content knowledge/aiwan-ting.md

# 3. 本地预览（边写边看）
hugo server

# 4. 写完把文章里的 draft: true 改成 false，然后
git add . && git commit -m "新增日志一篇" && git push
```

push 之后 1~2 分钟，GitHub Actions 自动构建并上线。

---

## 二、环境准备（只需一次）

安装 Hugo（≥ 0.168.0，extended 版本）：

```bash
# Windows（任选其一）
winget install Hugo.Hugo.Extended
scoop install hugo-extended

# macOS
brew install hugo

# Linux: 从 https://github.com/gohugoio/hugo/releases 下载对应版本
```

验证：`hugo version`

---

## 三、文章怎么写

### 工作日志（content/logs/）

```yaml
---
title: "岳麓山看红枫的一天"        # 标题
date: 2026-10-18T20:30:00+08:00   # 时间
location: "湖南·长沙"              # 带团地点（列表页会显示）
days: 1                           # 天数
weather: "晴"                     # 天气
tags: [岳麓山, 一日游]            # 标签（标签内不要有空格）
draft: false                      # true = 草稿不发布
---
```

### 景点知识（content/knowledge/）

```yaml
---
title: "爱晚亭：一座亭子替杜牧背了一千年的诗"
date: 2026-10-15T10:00:00+08:00
region: "湖南"                    # 省/市（知识库「地区」筛选用）
spot: "长沙·岳麓山·爱晚亭"        # 具体景点
era: "唐 / 清"                    # 涉及朝代（可留空）
tags: [园林, 诗词, 讲解素材]
sources: [岳麓书院官网, 《湖湘文化辞典》]   # 文末自动生成「资料来源」区块
draft: false
---
```

### 写作要点

- **`<!--more-->` 是摘要截止线**：首页和列表页只显示这条线之前的内容，务必放在第一段之后。
- **图片**：把图片和文章放同一目录（把文章改名为 `index.md`），用 `![描述](图片名.jpg "图注")` 引用——构建时自动压缩为 webp、自动懒加载、自动生成图注。参考示例：`content/knowledge/fenghuang-tuojiang-stilted-houses/`。
- **建议**：日志结尾写「一点心得」，知识库按「为什么值得讲 / 讲解词参考 / 冷知识」三段式写，长期积累最有价值。
- 文件名建议用英文（如 `yuelu-red-maple.md`），URL 更干净；中文标题写在 front matter 里。

---

## 四、首次部署到 GitHub Pages

1. 在 GitHub 新建仓库。两种选法：
   - 仓库名 `你的用户名.github.io` → 博客上线到 `https://你的用户名.github.io/`
   - 任意名字（如 `blog`）→ 上线到 `https://你的用户名.github.io/blog/`
   （工作流会自动识别，无需改配置）
2. 推送代码：

   ```bash
   git init -b main
   git add .
   git commit -m "第一笔：博客上线"
   git remote add origin https://github.com/你的用户名/仓库名.git
   git push -u origin main
   ```

3. 仓库 **Settings → Pages → Source 选择 `GitHub Actions`**（只需设置一次）。
4. 等 Actions 跑完（约 1 分钟），访问线上地址即可。

---

## 五、改成你自己的信息

编辑 `hugo.toml` 顶部 `params` 区块：

| 字段 | 说明 |
| --- | --- |
| `author` | 落款 / 页脚署名（现为「大顺」） |
| `subtitle` | 副标题（首页「一名导游的山水行记」） |
| `description` | 站点描述（SEO / RSS 用） |
| `heroNote` | 首屏竖排标题下的小字 |
| `footerQuote` | 页脚题字（现为「读万卷书 · 行万里路」） |

另外别忘了：
- `content/about.md` —— 从业资质、服务线路、联系方式（〔待填写〕处）
- 首页与页脚的**印章**文字在 `layouts/partials/header.html`、`footer.html`、`layouts/index.html` 中（现在是「大顺纪行」「大顺之印」）
- **示例文章**（湖南主题的 6 篇）可自行删除替换

---

## 六、可选：开启评论（Giscus，基于 GitHub Discussions）

1. 你的博客仓库开启 Discussions（Settings → General → Features）。
2. 到 <https://giscus.app> 按提示选择仓库，得到 `repo` / `repoId` / `categoryId`。
3. 填入 `hugo.toml` 的 `[params.giscus]`，push 即生效。留空则不显示评论区。

---

## 七、目录结构

```
├── archetypes/          # 新建文章的模板（logs / knowledge）
├── assets/
│   ├── css/main.css     # 水墨主题样式（改配色、字体看这里）
│   └── js/              # 主题切换、视差、筛选、搜索脚本（无外部依赖）
├── content/
│   ├── logs/            # 工作日志
│   ├── knowledge/       # 景点知识
│   ├── about.md         # 关于我
│   ├── search.md        # 搜索页
│   └── archive.md       # 归档页
├── layouts/             # 模板（含文章、时间轴、知识库筛选、404 等）
├── static/favicon.svg   # 站点图标（红印「万」）
├── hugo.toml            # 站点配置
└── .github/workflows/deploy.yml   # 自动部署
```

---

## 八、常见问题

- **字体没加载出来？** 标题字体走 fastly.jsdelivr.net、正文字体走 fonts.loli.net，均为国内可访问 CDN；若加载失败会自动回退系统楷体/宋体，不影响阅读。
- **国内访问 GitHub Pages 慢？** 可绑定自定义域名套 Cloudflare，或同时部署到 Vercel。注意 GitHub 屏蔽百度爬虫，百度收录需另做镜像站。
- **图片太多仓库变大？** GitHub 仓库建议 < 1GB、单文件 < 100MB。照片先压缩（每张 300KB 内）再提交。
- **搜索怎么实现的？** 构建时生成全站 `index.json`，前端零依赖检索，无需任何服务。

---

## 致谢

- [Hugo](https://gohugo.io/) · 静态站点生成
- [霞鹜文楷](https://github.com/lxgw/LxgwWenKai) · 开源中文字体（OFL）
- 视觉取法：王希孟《千里江山图》· 黄公望《富春山居图》· 戴进《春山积翠图》
- 首页背景图为王希孟《千里江山图》扫描段（北宋，公有领域），整理版取自 GitHub `rwanglq-ctrl/omarchy-qianli-jiangshan-theme`，裁切压缩后存放于 `assets/images/hero-jiangshan.jpg`（2560px，约 680KB）
