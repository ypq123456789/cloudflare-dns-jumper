# Cloudflare DNS Jumper (Cloudflare DNS 直达跳转按钮)

一个轻量级的 Tampermonkey（油猴）用户脚本，为 Cloudflare 面板的 DNS 记录列表添加一键访问网页的快捷按钮，省去手动拼接域名和复制粘贴的烦恼。

## ✨ 核心功能

* **智能识别与拼接**：自动获取当前 Zone Name，将 `@` 或子域名精准拼接为完整的 FQDN（完全限定域名）。
* **多记录类型支持**：仅在 `A`、`CNAME` 和 `Worker` 记录旁生成跳转按钮，不干扰 MX 或 TXT 等非 Web 记录。
* **强力兼容 SPA 架构**：针对 Cloudflare 单页面应用（SPA）特性和动态表格渲染进行了深度优化，翻页、搜索时按钮依然稳定显示。
* **突破前端隐藏限制**：强行突破原网页自带的 `overflow: hidden` 文本截断样式，确保 `🔗` 按钮完美呈现。

## 🚀 安装指南

1.  **安装脚本管理器**：确保你的浏览器已安装 [Tampermonkey](https://www.tampermonkey.net/) 扩展。
2.  **安装本脚本**：
    * 方式一：点击此[链接](https://raw.githubusercontent.com/ypq123456789/cloudflare-dns-jumper/main/cloudflare-dns-jumper.user.js)直接安装
    * 方式二：复制本仓库中 `script.js` 的代码，在 Tampermonkey 面板中新建脚本并粘贴保存。

## 📸 效果预览

![效果预览](https://cdn.nodeimage.com/i/yN5B9dyvxeyjPLNZxVRTY0uJmmvEGstb.webp)


## 💡 使用说明

安装完成后，正常登录 [Cloudflare 控制台](https://dash.cloudflare.com/)，进入任意域名的 **DNS -> 记录** 页面。
在列表的“名称”一列右侧，会出现一个 `🔗` 按钮。点击该按钮，即可在新标签页中直接打开对应的网址。

## 🛠️ 技术细节

* **权限**：`@grant none`（纯净无多余权限要求，保障安全）。
* **匹配规则**：`https://dash.cloudflare.com/*`。
* **轮询机制**：采用轻量级的高频巡检机制（`setInterval`），以最暴力的姿态对抗 React 的动态重新渲染。

## 📄 开源协议

本项目基于 [MIT License](LICENSE) 协议开源。欢迎提交 Issue 或 Pull Request！
