/**
 * AuraSnap Official Documentation & Feature Guide Script (guide.js)
 * High-performance, zero-dependency client logic.
 */

document.addEventListener('DOMContentLoaded', () => {
    initScrollSpy();
    initSearch();
    initCheatsheetFilters();
    initCodeCopyButtons();
    initMobileSidebar();
    initBackToTop();
});

/**
 * 1. ScrollSpy 目录滚动高亮监听
 */
function initScrollSpy() {
    const sections = document.querySelectorAll('.docs-section');
    const navLinks = document.querySelectorAll('.docs-nav-link');

    if (!sections.length || !navLinks.length) return;

    const observerOptions = {
        root: null,
        rootMargin: '-80px 0px -60% 0px',
        threshold: 0.05
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                        // 确保侧边栏当前活动项可见
                        link.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(sec => observer.observe(sec));
}

/**
 * 2. 全文搜索与快捷键 (⌘K / Ctrl+K)
 */
function initSearch() {
    const searchInput = document.getElementById('docsSearchInput');
    if (!searchInput) return;

    // 快捷键 ⌘K / Ctrl+K 聚焦
    window.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
            searchInput.select();
        }
        if (e.key === 'Escape' && document.activeElement === searchInput) {
            searchInput.blur();
        }
    });

    let debounceTimer = null;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            performSearch(e.target.value.trim().toLowerCase());
        }, 150);
    });
}

function performSearch(query) {
    const sections = document.querySelectorAll('.docs-section');
    const navItems = document.querySelectorAll('.docs-nav-item');

    if (!query) {
        sections.forEach(sec => sec.style.display = '');
        navItems.forEach(item => item.style.display = '');
        return;
    }

    let firstMatch = null;

    sections.forEach((sec, idx) => {
        const text = sec.textContent.toLowerCase();
        const navItem = navItems[idx];
        if (text.includes(query)) {
            sec.style.display = '';
            if (navItem) navItem.style.display = '';
            if (!firstMatch) firstMatch = sec;
        } else {
            sec.style.display = 'none';
            if (navItem) navItem.style.display = 'none';
        }
    });

    if (firstMatch) {
        firstMatch.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

/**
 * 3. 第 15 节交互式快捷键速查表过滤与搜索
 */
function initCheatsheetFilters() {
    const tabBtns = document.querySelectorAll('.cheatsheet-tab-btn');
    const searchInput = document.getElementById('cheatsheetSearch');
    const tableRows = document.querySelectorAll('#cheatsheetTable tbody tr');

    if (!tableRows.length) return;

    let currentFilter = 'all';
    let searchQuery = '';

    function applyFilter() {
        tableRows.forEach(row => {
            const scene = row.querySelector('.td-scene')?.textContent.trim() || '';
            const text = row.textContent.toLowerCase();

            let categoryMatch = false;
            if (currentFilter === 'all') {
                categoryMatch = true;
            } else if (currentFilter === 'global' && scene.includes('全局')) {
                categoryMatch = true;
            } else if (currentFilter === 'capture' && (scene.includes('截图') || scene.includes('选区') || scene.includes('批注'))) {
                categoryMatch = true;
            } else if (currentFilter === 'pin' && scene.includes('贴图')) {
                categoryMatch = true;
            } else if (currentFilter === 'ocr' && scene.includes('OCR')) {
                categoryMatch = true;
            } else if (currentFilter === 'record' && (scene.includes('录屏') || scene.includes('长截图'))) {
                categoryMatch = true;
            }

            const searchMatch = !searchQuery || text.includes(searchQuery);

            if (categoryMatch && searchMatch) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.getAttribute('data-filter') || 'all';
            applyFilter();
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.trim().toLowerCase();
            applyFilter();
        });
    }
}

/**
 * 4. 代码块与快捷键一键复制
 */
function initCodeCopyButtons() {
    const codeBlocks = document.querySelectorAll('.docs-code-block');
    codeBlocks.forEach(block => {
        const copyBtn = document.createElement('button');
        copyBtn.className = 'code-copy-btn';
        copyBtn.textContent = '复制';
        
        copyBtn.addEventListener('click', () => {
            const text = block.textContent.replace('复制', '').trim();
            navigator.clipboard.writeText(text).then(() => {
                copyBtn.textContent = '已复制 ✓';
                showToast('已复制内容至剪贴板');
                setTimeout(() => {
                    copyBtn.textContent = '复制';
                }, 2000);
            }).catch(() => {
                showToast('复制失败，请手动选取');
            });
        });

        block.appendChild(copyBtn);
    });
}

/**
 * 5. 移动端侧边栏抽屉开关
 */
function initMobileSidebar() {
    const toggleBtn = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('docsSidebar');
    const navLinks = document.querySelectorAll('.docs-nav-link');

    if (!toggleBtn || !sidebar) return;

    toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });

    // 点击侧边栏任意链接在移动端自动收起
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 1024) {
                sidebar.classList.remove('open');
            }
        });
    });

    // 点击侧边栏外区域关闭
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024 && 
            sidebar.classList.contains('open') && 
            !sidebar.contains(e.target) && 
            !toggleBtn.contains(e.target)) {
            sidebar.classList.remove('open');
        }
    });
}

/**
 * 6. 返回顶部按钮
 */
function initBackToTop() {
    const btn = document.getElementById('backToTopBtn');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/**
 * Toast 提示组件
 */
let toastTimeout = null;
function showToast(message) {
    let toast = document.getElementById('docsToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'docsToast';
        toast.className = 'docs-toast';
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add('show');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 2200);
}
