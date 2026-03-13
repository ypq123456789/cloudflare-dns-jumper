// ==UserScript==
// @name         Cloudflare DNS 直达跳转按钮 V3 终极版
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  智能识别列位置，强行突破隐藏样式，添加跳转按钮
// @author       Gemini
// @match        https://dash.cloudflare.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cloudflare.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 在控制台打印醒目的启动日志，用来确认脚本是否运行
    console.log("%c[CF DNS 插件 V3] 脚本已启动，正在后台巡检中...", "color: white; background: #0051c3; font-size: 14px; padding: 4px 8px; border-radius: 4px;");

    function getZoneName() {
        const match = window.location.pathname.match(/\/([^\/]+)\/dns\/records/);
        return match ? match[1] : '';
    }

    function addJumpButtons() {
        if (!window.location.pathname.includes('/dns/records')) return;

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

            // 智能寻找“类型”列和“名称”列（名称列通常紧挨在类型列后面）
            for (let i = 0; i < cells.length; i++) {
                let text = cells[i].textContent.trim();
                if (['A', 'CNAME', 'Worker'].includes(text)) {
                    typeText = text;
                    nameCell = cells[i + 1]; // 锁定紧跟在后面的名称列
                    break;
                }
            }

            if (!nameCell) return;

            // 提取纯净的域名（防止单元格里有其他空格或标签干扰）
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
            innerContent.style.gap = '8px'; // 给文字和按钮之间留点空隙

            // 创建按钮
            const btn = document.createElement('a');
            btn.className = 'cf-jump-btn';
            btn.href = `http://${fqdn}`;
            btn.target = '_blank';
            btn.title = `点击访问 http://${fqdn}`;
            btn.innerHTML = '🔗';
            btn.style.cssText = `
                text-decoration: none;
                cursor: pointer;
                font-size: 16px;
                color: #0051c3;
                position: relative;
                z-index: 9999;
                font-family: "Segoe UI Emoji", "Apple Color Emoji", sans-serif;
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
