本仓库中的插件仅为示例，来源于互联网上的公开接口，并经过筛选，排除了所有VIP/付费/试用歌曲。它们仅供学习和参考之用。请勿将它们用于任何商业目的，并确保其使用合理合法。

# MusicFree 插件订阅聚合器

个人 MusicFree 插件订阅聚合器——通过 Github Actions 每日自动检测并同步更新。

## 懒人订阅链接：

这个聚合的插件接口比较多，一个订阅就够用，记得删除原有订阅和插件以免冲突。

国内用户：

https://musicfreepluginshub.2020818.xyz/plugins.json

国际用户：

https://musicfreepluginshub.pages.dev/plugins.json

## 自行部署

Fork 并启用 Actions 后，请在仓库的 Action 菜单中设置 Workflow 权限为“读取和写入”。Actions 可以手动触发，或自动于 UTC 时间 20:00 执行，生成 plugins.json 文件。

获取您自己可访问的 plugins.json 的直接链接以使用。

懒人链接通过 Cloudflare Pages 部署。您也可以在类似平台如 Vercel、GitHub Pages、Netlify 等部署直接链接，并绑定自定义域名，以便在国内访问。