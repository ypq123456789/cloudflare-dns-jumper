// ==UserScript==
// @name         Cloudflare DNS 直达跳转按钮 V3 终极版
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  智能识别列位置，强行突破隐藏样式，添加精美跳转按钮
// @author       ypq123456789
// @match        https://dash.cloudflare.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cloudflare.com
// @updateURL    https://raw.githubusercontent.com/ypq123456789/cloudflare-dns-jumper/main/cloudflare-dns-jumper.user.js
// @downloadURL  https://raw.githubusercontent.com/ypq123456789/cloudflare-dns-jumper/main/cloudflare-dns-jumper.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 在控制台打印醒目的启动日志
    console.log("%c[CF DNS 插件 V3.1] 脚本已启动，正在后台巡检中...", "color: white; background: #f6821f; font-size: 14px; padding: 4px 8px; border-radius: 4px;");

    // 注入精美的自定义 CSS 样式
    function injectStyles() {
        if (document.getElementById('cf-jump-btn-style')) return;
        const style = document.createElement('style');
        style.id = 'cf-jump-btn-style';
        style.textContent = `
            .cf-jump-btn {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                margin-left: 8px;
                padding: 4px 6px;
                color: #ffffff !important;
                background-color: #f6821f; /* 显眼的 Cloudflare 橙色 */
                border-radius: 4px;
                text-decoration: none;
                transition: all 0.2s ease-in-out;
                box-shadow: 0 2px 4px rgba(246, 130, 31, 0.3);
                position: relative;
                z-index: 9999;
            }
            .cf-jump-btn:hover {
                background-color: #ff9838; /* 鼠标悬浮变亮 */
                transform: translateY(-1px); /* 悬浮上移效果 */
                box-shadow: 0 4px 8px rgba(246, 130, 31, 0.4);
            }
            .cf-jump-btn svg {
                width: 14px;
                height: 14px;
            }
        `;
        document.head.appendChild(style);
    }

    function getZoneName() {
        const match = window.location.pathname.match(/\/([^\/]+)\/dns\/records/);
        return match ? match[1] : '';
    }

    function addJumpButtons() {
        if (!window.location.pathname.includes('/dns/records')) return;

        // 确保样式已注入
        injectStyles();

        // 获取所有可能是表格行的元素
        const rows = document.querySelectorAll('tr, div[role="row"]');
        if (rows.length === 0) return;

        const zoneName = getZoneName();

        rows.forEach(row => {
            // 防重复
            if (row.querySelector('.cf-jump-btn') || row.querySelector('th')) return;

            const cells = row.querySelectorAll('td, div[role="cell"]');
            if (cells.length < 4) return;

            let typeText = '';
            let nameCell = null;

            // 智能寻找“类型”列和“名称”列
            for (let i = 0; i < cells.length; i++) {
                let text = cells[i].textContent.trim();
                if (['A', 'CNAME', 'Worker'].includes(text)) {
                    typeText = text;
                    nameCell = cells[i + 1]; // 锁定紧跟在后面的名称列
                    break;
                }
            }

            if (!nameCell) return;

            // 提取纯净的域名
            let rawText = nameCell.textContent.trim();
            let nameText = rawText.split(/\s+/)[0];
            if (!nameText) return;

            // 拼接完整域名
            let fqdn = nameText;
            if (nameText === '@') {
                fqdn = zoneName;
            } else if (zoneName && !nameText.endsWith(zoneName)) {
                fqdn = `${nameText}.${zoneName}`;
            }

            // 破解 Cloudflare 的隐藏截断样式
            nameCell.style.overflow = 'visible';
            let innerContent = nameCell.querySelector('div, span') || nameCell;
            innerContent.style.overflow = 'visible';
            innerContent.style.display = 'inline-flex';
            innerContent.style.alignItems = 'center';

            // 创建按钮
            const btn = document.createElement('a');
            btn.className = 'cf-jump-btn';
            btn.href = `http://${fqdn}`;
            btn.target = '_blank';
            btn.title = `点击访问 http://${fqdn}`;
            
            // 使用精美的外链 SVG 图标
            btn.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
            `;

            // 阻止冒泡
            btn.onclick = (e) => e.stopPropagation();

            // 插入按钮
            innerContent.appendChild(btn);
        });
    }

    // 高频巡检
    setInterval(addJumpButtons, 1000);

})();
