# AuraSnap 官网

[aurasnapapp.com](https://aurasnapapp.com/) 的源码。纯静态页面，部署在 Cloudflare Pages（`.html` 自动去掉扩展名，如 `/pricing`）。

| 文件 | 内容 |
| :--- | :--- |
| `index.html` | 首页：功能介绍、快捷键、价格预览、下载与安装 |
| `pricing.html` | 价格、免费版 / Pro 对比、内嵌收银弹窗 |
| `guide.html` | 使用指南 |
| `privacy.html` / `terms.html` | 隐私政策 / 服务条款与退款 |
| `assets/site.css` | 共享样式（系统字体，浅色 / 深色跟随系统） |
| `assets/site.js` | 导航、最新版本号、进场动画、目录高亮 |
| `assets/icons.svg` | 图标 |
| `assets/shots/` | 真实界面截图（WebP，最宽 1600px）；`assets/og.jpg` 是分享卡片图 |

## 维护要点

- **版本号与下载链接**：页面打开时从 GitHub 取 `AuraSnap-PB` 最新发行版，自动更新所有 `data-version` 文字和 `data-dmg` 链接。取不到时使用 `assets/site.js` 里的 `FALLBACK`，发新版时顺手改一下。
- **功能文案**：以 App 内「功能指南」（`jietu/Sources/UI/Onboarding/OnboardingModels.swift`）和默认快捷键（`ShortcutRegistry.swift`）为准；免费 / Pro 的划分以 `LicenseModels.swift`、`QuotaManager.swift` 为准。首页 Hero 上方的「新功能」一句话需要手动更新。
- **收银弹窗**：`pricing.html` 里的元素 id 与授权后台（`jietu/cloudflare-worker`）的接口约定一致，不要改名。价格需与 Worker 的 `PLAN_CONFIG` 保持一致。
- **旧域名**：`aurasnap.dpdns.org` 仍指向同一站点（老版本客户端要用它的授权接口，不能整站跳转），访问时页面顶部会提示迁移。
- **截图**：换新截图时从原图转 WebP（质量 82 左右），文件名保持不变就不用改页面；避免截到 API Key、App ID、个人路径等信息。
- **本地预览**：任意静态服务器都可以；要模拟去扩展名的地址，可以用一个把 `/x` 映射到 `x.html` 的小服务器。
