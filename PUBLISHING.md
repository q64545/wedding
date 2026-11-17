# 发布婚礼请柬

网站已经放在仓库根目录，无需安装依赖或构建。

1. 修改 `wedding-config.js` 中的新人姓名、日期、场地、地址和流程。真实信息填写完毕后，将 `isDemo` 改成 `false`。
2. 完成 GitHub SSH 认证后，提交并推送 `main` 分支。
3. 在 GitHub 仓库的 Settings → Pages 中，选择 Deploy from a branch，分支选择 `main`，目录选择 `/ (root)`，保存。
4. 部署完成后访问 https://q64545.github.io/wedding/ 。默认地址无需购买域名；GitHub Free 使用公开仓库发布 Pages。
5. 在微信里打开链接，检查照片、文字、地址复制及实际加载速度。国内网络体验需实测。

今后以本仓库中的 `wedding-config.js` 和页面文件为修改对象。父目录中的 `dist` 与 ZIP 是此前的独立副本，不会自动同步。

本地预览：在仓库目录运行 `python3 -m http.server 4177 --bind 127.0.0.1`，再打开 http://127.0.0.1:4177/ 。

照片已经压缩为网页尺寸，运行时不依赖外部字体或 CDN。地图和音乐可通过配置启用。
