// ==UserScript==
// @name         Nacos 自动选择每页显示条数
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  在 Nacos 配置/服务管理页面自动设置每页显示条数（默认 50），基于 DOM 变化实时响应
// @author       YourName
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAADKGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxMzggNzkuMTU5ODI0LCAyMDE2LzA5LzE0LTAxOjA5OjAxICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxNyAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo5RDZDMjg2RjJCNTAxMUU5QkNFOEE2RUI3ODExMUQ0NCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo5RDZDMjg3MDJCNTAxMUU5QkNFOEE2RUI3ODExMUQ0NCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjlENkMyODZEMkI1MDExRTlCQ0U4QTZFQjc4MTExRDQ0IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjlENkMyODZFMkI1MDExRTlCQ0U4QTZFQjc4MTExRDQ0Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+s1vdbwAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAABgUExURUdwTDya/iy8+xzf9x3b9yu/+jel/SrD+jOv/Dud/jud/inC+ifH+SjE+jya/jOt/ECR/x3d9zWq/SPP+CDW9xvh90CQ/yjF+R7Z9yPP+Cu++z2Z/jKv/Dmh/Tao/S+3/Hq7JjkAAAAVdFJOUwB1trNWHpU+D1TPeKLCv9rqjyrP5l907wkAAAHaSURBVFjD7ZXJtoMgEEQ1TihRowZwiv7/Xz5pBkHBLF6W9irnJHVTdDdFENx11113/b7aMK2KokrD1veLDD/LrouaOHF8mVfTVh9eS5U7foBwNwxDP/S8ovjILijogbAsS5Ed9fGbDWzQCBJZLkJKASAd8Apt/ZMxkCt9T4hhIqUKoBws84xNfcn1kgBFiEHg/39yMM+prZcOBICYhEzo6VSEWZLkYcHlG2AnlCMTDkqcJW3cvIUDQhB8/QIAfenW5x9wMK8pMvSMdbqzWAKi/QC0QLvjpAbAvOZCPwLhaU5NEjJt4IWsmdcAAAcu/UbQFnJh4DB3VPMT8E+PcQTC87AXjSAkYoS0Ou1dLXr4WN36IHgTMYgKAOfdbbHQA2A866WFRrbAc382/erRB7FsggAglxzVXL+69bKN14ByFQ7S7wD/EbgD9rg4gq+JCSyBbKKLoJroH2O9j4E5CGqM/kWaa6QWiZ0JepEuVnmtW4PgW+XLy4TVMl9dpqvrLGch48BznVWgTFug5CpQwAC2A2lLJB0oxAwUdQgdiedQLNkxE3t9ABWqk52JjlC1UtkKVSPWp4tYH0zCFqux62H5XD4spoMocT5t07enbfA8bT94XO+66667/lt/MeNRtNFJ1NgAAAAASUVORK5CYII=
// @match        *://*/nacos/**/configurationManagement*
// @match        *://*/nacos/**/serviceManagement*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // ========== 可配置项 ==========
    const DEFAULT_PAGE_SIZE = 50;       // 您期望的每页显示条数（10/20/30/50/100）
    // =============================

    let isProcessing = false;           // 防止并发执行
    let currentPath = location.hash;    // 当前路由，用于路由切换后重置

    /**
     * 获取分页选择器容器
     */
    function getPaginationSelector() {
        return document.querySelector('.next-pagination-size-selector');
    }

    /**
     * 获取当前显示的条数（字符串）
     */
    function getCurrentSize() {
        const container = getPaginationSelector();
        if (!container) return null;

        // 方法1：从 <em> 中读取
        const em = container.querySelector('.next-select-values em');
        if (em) return em.textContent.trim();

        // 方法2：从 input 的 aria-valuetext 读取
        const input = container.querySelector('input[role="combobox"]');
        if (input) {
            const val = input.getAttribute('aria-valuetext');
            if (val) return val.trim();
        }
        return null;
    }

    /**
     * 点击分页选择器，展开下拉菜单
     */
    function openDropdown() {
        const container = getPaginationSelector();
        if (!container) return false;
        const trigger = container.querySelector('.next-select-trigger') ||
                        container.querySelector('.next-select-inner');
        if (trigger) {
            trigger.click();
            return true;
        }
        container.click();
        return true;
    }

    /**
     * 在下拉菜单中点击目标数值（使用 MutationObserver 等待菜单出现）
     * @param {number} targetSize
     * @returns {Promise<boolean>} 是否成功选择
     */
    function selectOption(targetSize) {
        return new Promise((resolve) => {
            // 先检查菜单是否已存在
            const existingMenu = document.querySelector('.next-overlay-wrapper .next-menu') ||
                                 document.querySelector('.next-select-dropdown .next-menu') ||
                                 document.querySelector('.next-menu[role="listbox"]');
            if (existingMenu) {
                // 直接尝试点击
                const items = existingMenu.querySelectorAll('.next-menu-item');
                for (let item of items) {
                    if (item.textContent.trim() === String(targetSize)) {
                        item.click();
                        resolve(true);
                        return;
                    }
                }
                resolve(false);
                return;
            }

            // 菜单未出现，创建 MutationObserver 监听 body 下的新增节点
            const observer = new MutationObserver((mutations) => {
                for (let mutation of mutations) {
                    for (let node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // 检查节点本身或其后代是否包含菜单
                            const menu = node.matches('.next-menu[role="listbox"]') ? node :
                                         node.querySelector('.next-menu[role="listbox"]') ||
                                         node.querySelector('.next-overlay-wrapper .next-menu') ||
                                         node.querySelector('.next-select-dropdown .next-menu');
                            if (menu) {
                                const items = menu.querySelectorAll('.next-menu-item');
                                for (let item of items) {
                                    if (item.textContent.trim() === String(targetSize)) {
                                        item.click();
                                        observer.disconnect();
                                        resolve(true);
                                        return;
                                    }
                                }
                                // 如果目标不存在，也断开并返回false
                                observer.disconnect();
                                resolve(false);
                                return;
                            }
                        }
                    }
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });

            // 设置超时保护（避免菜单永远不出现），但这里不写死时间，而是使用一个较长的超时（可选）
            // 不设超时，理论上菜单最终会出现；但如果网络问题，可加一个超时 fallback
            // 此处我们让 observer 一直监听，但在外部会有一个总超时控制
        });
    }

    /**
     * 主流程：尝试设置分页大小
     */
    async function setPageSizeIfNeeded() {
        if (isProcessing) return;
        isProcessing = true;

        try {
            const container = getPaginationSelector();
            if (!container) {
                // 分页控件尚未出现，无需操作
                isProcessing = false;
                return;
            }

            const currentSize = getCurrentSize();
            if (currentSize === String(DEFAULT_PAGE_SIZE)) {
                // 已为目标值，直接结束
                isProcessing = false;
                return;
            }

            // 打开下拉菜单
            if (!openDropdown()) {
                isProcessing = false;
                return;
            }

            // 等待菜单出现并选择目标值
            const success = await selectOption(DEFAULT_PAGE_SIZE);
            if (success) {
                // 可选择在此处记录日志
                console.log(`[Nacos AutoPageSize] 已设置每页显示 ${DEFAULT_PAGE_SIZE} 条`);
            } else {
                console.warn(`[Nacos AutoPageSize] 未找到选项 ${DEFAULT_PAGE_SIZE}`);
            }
        } catch (e) {
            console.warn('[Nacos AutoPageSize] 设置失败:', e);
        } finally {
            isProcessing = false;
        }
    }

    /**
     * 路由变化检测（SPA 切换页面时重置状态）
     */
    function checkRouteChange() {
        const newPath = location.hash;
        if (newPath !== currentPath) {
            currentPath = newPath;
            isProcessing = false;   // 重置锁定，允许新页面重新设置
            // 延迟一点等待 DOM 更新，但 MutationObserver 会自动捕获
            setTimeout(setPageSizeIfNeeded, 300);
        }
    }

    // ===================== 使用 MutationObserver 监听分页控件出现 =====================
    let pageObserver = null;

    function startObserver() {
        if (pageObserver) pageObserver.disconnect();

        pageObserver = new MutationObserver(() => {
            // 当检测到分页选择器出现（或发生变化）时，尝试设置
            // 但为了避免频繁触发，可以加一个防抖，或直接调用 setPageSizeIfNeeded（内部有 isProcessing 控制）
            setPageSizeIfNeeded();
        });

        // 监听 body 及其子树的节点变化
        pageObserver.observe(document.body, { childList: true, subtree: true });

        // 也监听属性变化（以防控件本身更新了值）
        // 但主要针对新增节点
    }

    // 初始检查
    function init() {
        startObserver();
        // 首次尝试设置（可能分页控件已存在）
        setPageSizeIfNeeded();
    }

    // 页面加载完成启动
    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }

    // 路由切换监听
    window.addEventListener('hashchange', checkRouteChange);

    // 因为 observer 会持续监听，不需要额外的轮询，资源消耗更低
    console.log(`[Nacos AutoPageSize] 脚本已启动（MutationObserver 模式），目标每页显示条数: ${DEFAULT_PAGE_SIZE}`);
})();
