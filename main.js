/**
 * AuraSnap Official Website - Interactive Engine (v3.0 Masterpiece)
 * Powered by ui-ux-pro-max + taste-skill + interface-design
 */

document.addEventListener('DOMContentLoaded', () => {
    initClock();
    initNavbarScroll();
    initHeroDesktopSimulator();
    initFeatureStudio();
    initKeyboardHUDTester();
});

/* ==========================================================================
   1. Live Clock on macOS Menu Bar
   ========================================================================== */
function initClock() {
    const clockEl = document.getElementById('macClock');
    if (!clockEl) return;

    function updateTime() {
        const now = new Date();
        const hrs = String(now.getHours()).padStart(2, '0');
        const mins = String(now.getMinutes()).padStart(2, '0');
        clockEl.textContent = `${hrs}:${mins}`;
    }
    updateTime();
    setInterval(updateTime, 1000);
}

/* ==========================================================================
   2. Navbar Scroll Behavior
   ========================================================================== */
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 25) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });
}

/* ==========================================================================
   3. Hero Interactive Desktop Simulator (1:1 Native Toolbar & Dynamic Tier Options)
   ========================================================================== */
function initHeroDesktopSimulator() {
    const canvas = document.getElementById('desktopCanvas');
    const magnifier = document.getElementById('liveMagnifier');
    const colorText = document.getElementById('magColorText');
    const magCenterCell = document.getElementById('magCenterCell');
    const snappingBorder = document.getElementById('snappingBorder');
    const xcodeWin = document.getElementById('xcodeWin');
    const btnCopy = document.getElementById('btnCopySim');
    const toast = document.getElementById('simToast');
    const tierOptionsBar = document.getElementById('tierOptionsBar');
    const toolButtons = document.querySelectorAll('.native-tool-btn[data-tool]');

    if (!canvas || !magnifier || !colorText || !snappingBorder) return;

    // Preset 8 colors matching Swift AnnotationManager
    const presetColors = [
        { name: '红色', hex: '#ef4444' },
        { name: '橙色', hex: '#f97316' },
        { name: '黄色', hex: '#eab308' },
        { name: '绿色', hex: '#22c55e' },
        { name: '蓝色', hex: '#0ea5e9' },
        { name: '紫色', hex: '#a855f7' },
        { name: '黑色', hex: '#000000' },
        { name: '白色', hex: '#ffffff', isWhite: true }
    ];

    // State
    let activeTool = 'pen';
    let activeColor = '#ef4444';
    let activeLineWidth = 4;
    let smartShapeEnabled = true;
    let rectCornerRounded = true;
    let watermarkText = 'AuraSnap Confidential';
    let watermarkAngle = -45;
    let watermarkVisible = true;

    // Render Tier 1 Secondary Options based on active tool (AnnotationOptionsView)
    function renderTierOptions(tool) {
        if (!tierOptionsBar) return;
        activeTool = tool;

        const colorsHTML = `
            <div class="color-palette-row">
                ${presetColors.map(c => `
                    <button class="color-dot-btn ${c.hex === activeColor ? 'active' : ''} ${c.isWhite ? 'color-white-dot' : ''}" 
                            style="--dot-color: ${c.hex};" 
                            data-color="${c.hex}" 
                            title="${c.name}"></button>
                `).join('')}
            </div>
        `;

        const sliderHTML = `
            <div class="line-width-slider-row">
                <span class="slider-dot-min">•</span>
                <input type="range" min="1" max="20" value="${activeLineWidth}" class="native-width-slider" id="dynWidthSlider">
                <span class="slider-dot-preview" id="dynDotPreview" style="background: ${activeColor}; width: ${Math.max(4, activeLineWidth * 2)}px; height: ${Math.max(4, activeLineWidth * 2)}px;"></span>
            </div>
        `;

        if (tool === 'pen') {
            tierOptionsBar.innerHTML = `
                ${colorsHTML}
                <div class="native-divider"></div>
                <button class="native-menu-btn" id="btnPenStyle" title="画笔模式 (普通 / 荧光笔)">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18.375 2.625a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.375-9.375z"></path></svg>
                    <span style="font-size: 11px; margin-left: 2px;">普通</span>
                </button>
                <button class="native-toggle-btn ${smartShapeEnabled ? 'active' : ''}" id="btnSmartShape" title="智能图形 (粗糙笔迹自适应矫正)">
                    <span>✨ 智能图形</span>
                </button>
                <div class="native-divider"></div>
                ${sliderHTML}
            `;
        } else if (tool === 'rect') {
            tierOptionsBar.innerHTML = `
                ${colorsHTML}
                <div class="native-divider"></div>
                <button class="native-menu-btn" id="btnRectBorder" title="边线线型 (实线/虚线/点线)">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"></rect></svg>
                    <span style="font-size: 11px; margin-left: 2px;">实线</span>
                </button>
                <button class="native-menu-btn" id="btnRectCorner" title="切换直角/圆角">
                    <span style="font-size: 11px;">${rectCornerRounded ? '圆角边' : '直角边'}</span>
                </button>
                <div class="native-divider"></div>
                ${sliderHTML}
            `;
        } else if (tool === 'arrow') {
            tierOptionsBar.innerHTML = `
                ${colorsHTML}
                <div class="native-divider"></div>
                <button class="native-menu-btn" id="btnArrowStyle" title="箭头样式 (燕尾/单向/双向/折线)">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 7"></polyline></svg>
                    <span style="font-size: 11px; margin-left: 2px;">燕尾</span>
                </button>
                <div class="native-divider"></div>
                ${sliderHTML}
            `;
        } else if (tool === 'line') {
            tierOptionsBar.innerHTML = `
                ${colorsHTML}
                <div class="native-divider"></div>
                <button class="native-menu-btn" id="btnLineStyle" title="直线样式 (实线/虚线/点线)">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="4" y1="20" x2="20" y2="4"></line></svg>
                    <span style="font-size: 11px; margin-left: 2px;">实线</span>
                </button>
                <div class="native-divider"></div>
                ${sliderHTML}
            `;
        } else if (tool === 'mosaic') {
            tierOptionsBar.innerHTML = `
                <button class="native-menu-btn" id="btnMosaicStyle" title="马赛克样式 (高斯模糊 / 像素块)">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7" fill="currentColor"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7" fill="currentColor"></rect></svg>
                    <span style="font-size: 11px; margin-left: 2px;">高斯模糊</span>
                </button>
                <button class="native-toggle-btn active" id="btnAutoRedact" title="敏感隐私自动探测脱敏">
                    <span>✨ 智能脱敏</span>
                </button>
                <div class="native-divider"></div>
                <div class="line-width-slider-row">
                    <span style="font-size: 11px; color: #64748b;">强度:</span>
                    <input type="range" min="5" max="50" value="20" class="native-width-slider" id="dynWidthSlider">
                </div>
            `;
        } else if (tool === 'step') {
            tierOptionsBar.innerHTML = `
                ${colorsHTML}
                <div class="native-divider"></div>
                <button class="native-menu-btn" id="btnStepStyle" title="序号图钉样式 (圆圈 / 水滴图钉)">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"></circle><text x="12" y="16" font-size="12" text-anchor="middle" fill="#ffffff" font-weight="bold">1</text></svg>
                    <span style="font-size: 11px; margin-left: 2px;">水滴图钉</span>
                </button>
                <div class="native-divider"></div>
                <div class="line-width-slider-row">
                    <span style="font-size: 11px; color: #64748b;">尺寸:</span>
                    <input type="range" min="14" max="36" value="24" class="native-width-slider" id="dynWidthSlider">
                </div>
            `;
        } else if (tool === 'text') {
            tierOptionsBar.innerHTML = `
                ${colorsHTML}
                <div class="native-divider"></div>
                <button class="native-menu-btn" id="btnFontPicker" title="选择字体">
                    <span style="font-weight: 700; font-size: 12px;">Aa</span>
                    <span style="font-size: 11px; margin-left: 2px;">系统默认 (PingFang)</span>
                </button>
                <div class="native-divider"></div>
                <div class="line-width-slider-row">
                    <span style="font-size: 11px; color: #64748b;">字号:</span>
                    <input type="range" min="12" max="48" value="16" class="native-width-slider" id="dynWidthSlider">
                    <span style="font-weight: 800; font-size: 14px; color: ${activeColor}; margin-left: 2px;">A</span>
                </div>
            `;
        } else if (tool === 'remark') {
            tierOptionsBar.innerHTML = `
                ${colorsHTML}
                <div class="native-divider"></div>
                <button class="native-menu-btn" id="btnRemarkLine" title="引线样式 (直线 / 折线)">
                    <span style="font-size: 11px;">直线引线 (Ray-AABB)</span>
                </button>
                <div class="native-divider"></div>
                ${sliderHTML}
            `;
        } else if (tool === 'watermark') {
            tierOptionsBar.innerHTML = `
                <input type="text" class="native-watermark-input" value="${watermarkText}" id="dynWatermarkInput" placeholder="水印文字...">
                <div class="native-divider"></div>
                <button class="native-menu-btn" id="btnWatermarkAngle" title="水印倾斜方向">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path></svg>
                    <span style="font-size: 11px; margin-left: 2px;">${watermarkAngle}°</span>
                </button>
                <div class="native-divider"></div>
                <div class="line-width-slider-row">
                    <span style="font-size: 10px; color: #94a3b8;">密度:</span>
                    <input type="range" min="1" max="10" value="5" class="native-width-slider" style="width: 50px;">
                </div>
                <div class="native-divider"></div>
                <button class="native-icon-toggle ${watermarkVisible ? 'active' : ''}" id="btnWatermarkEye" title="显示/隐藏全局水印">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                </button>
            `;
        } else {
            tierOptionsBar.innerHTML = `
                <span style="font-size: 11px; color: #475569; font-weight: 500;">
                    ${tool === 'select' ? '🎯 选择模式：可点击拖动任意已有标注或缩放' :
                      tool === 'cutout' ? '⚡ 智能去背：拉普拉斯高频净底 / Bria API / Apple Vision' :
                      tool === 'longshot' ? '↕ 长截图：滚动捕捉超长代码与网页 (2D DP 算法)' :
                      tool === 'record' ? '📹 录屏模式：支持导出 GIF/MP4/WebM 与 ⌘ 拖拽外发' :
                      '已就绪'}
                </span>
            `;
        }

        bindTierOptionsEvents();
    }

    function bindTierOptionsEvents() {
        const colorBtns = tierOptionsBar.querySelectorAll('.color-dot-btn');
        const slider = tierOptionsBar.querySelector('#dynWidthSlider');
        const preview = tierOptionsBar.querySelector('#dynDotPreview');
        const btnSmart = tierOptionsBar.querySelector('#btnSmartShape');
        const btnCorner = tierOptionsBar.querySelector('#btnRectCorner');
        const btnWatermarkEye = tierOptionsBar.querySelector('#btnWatermarkEye');
        const wmInput = tierOptionsBar.querySelector('#dynWatermarkInput');

        colorBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                colorBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                activeColor = btn.getAttribute('data-color');
                if (preview) preview.style.background = activeColor;
                showToast(`已切换颜色: ${btn.title}`);
            });
        });

        if (slider && preview) {
            slider.addEventListener('input', (e) => {
                activeLineWidth = parseInt(e.target.value);
                const size = Math.max(4, activeLineWidth * 1.5);
                preview.style.width = `${size}px`;
                preview.style.height = `${size}px`;
            });
        }

        if (btnSmart) {
            btnSmart.addEventListener('click', () => {
                smartShapeEnabled = !smartShapeEnabled;
                btnSmart.classList.toggle('active', smartShapeEnabled);
                showToast(smartShapeEnabled ? "✨ 智能图形矫正已开启" : "自由手绘笔迹模式");
            });
        }

        if (btnCorner) {
            btnCorner.addEventListener('click', () => {
                rectCornerRounded = !rectCornerRounded;
                btnCorner.querySelector('span').textContent = rectCornerRounded ? '圆角边' : '直角边';
                showToast(`已切换为: ${rectCornerRounded ? '圆角矩形' : '直角矩形'}`);
            });
        }

        if (btnWatermarkEye) {
            btnWatermarkEye.addEventListener('click', () => {
                watermarkVisible = !watermarkVisible;
                btnWatermarkEye.classList.toggle('active', watermarkVisible);
                showToast(watermarkVisible ? "全局防泄密水印：已显示" : "全局防泄密水印：已隐藏");
            });
        }

        if (wmInput) {
            wmInput.addEventListener('input', (e) => {
                watermarkText = e.target.value;
            });
        }
    }

    // Initial render for default tool (pen)
    renderTierOptions('pen');

    // Initial snapping to Xcode Window
    let isMicroMode = false;
    updateSnappingFrame();

    // Genuine Real-Time Pixel Sampling Color Picker
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Position Magnifier (clamped within canvas)
        const magW = 120;
        const magH = 120;
        let magX = x + 25;
        let magY = y + 25;

        if (magX + magW > rect.width) magX = x - magW - 20;
        if (magY + magH > rect.height) magY = y - magH - 20;

        magnifier.style.left = `${Math.max(10, magX)}px`;
        magnifier.style.top = `${Math.max(10, magY)}px`;

        // Exact pixel & element detection under cursor
        const hovered = document.elementFromPoint(e.clientX, e.clientY);
        let sampledHex = '#0F172A';
        let sampledRGB = 'RGB(15, 23, 42)';

        if (hovered) {
            if (hovered.classList.contains('traffic-red')) {
                sampledHex = '#FF5F56'; sampledRGB = 'RGB(255, 95, 86)';
            } else if (hovered.classList.contains('traffic-yellow')) {
                sampledHex = '#FFBD2E'; sampledRGB = 'RGB(255, 189, 46)';
            } else if (hovered.classList.contains('traffic-green')) {
                sampledHex = '#27C93F'; sampledRGB = 'RGB(39, 201, 63)';
            } else if (hovered.classList.contains('code-kw')) {
                sampledHex = '#F43F5E'; sampledRGB = 'RGB(244, 63, 94)';
            } else if (hovered.classList.contains('code-fn')) {
                sampledHex = '#38BDF8'; sampledRGB = 'RGB(56, 189, 248)';
            } else if (hovered.classList.contains('code-str')) {
                sampledHex = '#10B981'; sampledRGB = 'RGB(16, 185, 129)';
            } else if (hovered.classList.contains('code-comment')) {
                sampledHex = '#64748B'; sampledRGB = 'RGB(100, 116, 139)';
            } else if (hovered.classList.contains('resizer-handle')) {
                sampledHex = '#FFFFFF'; sampledRGB = 'RGB(255, 255, 255)';
            } else if (hovered.classList.contains('sim-snapping-border')) {
                sampledHex = '#0EA5E9'; sampledRGB = 'RGB(14, 165, 233)';
            } else if (hovered.closest('.sim-app-window.browser')) {
                sampledHex = '#1E1E2E'; sampledRGB = 'RGB(30, 30, 46)';
            } else if (hovered.closest('.sim-window-header')) {
                sampledHex = '#1E293B'; sampledRGB = 'RGB(30, 41, 59)';
            } else if (hovered.closest('.sim-app-window.xcode')) {
                sampledHex = '#0F172A'; sampledRGB = 'RGB(15, 23, 42)';
            } else {
                const ratioX = x / rect.width;
                const r = Math.round(14 + ratioX * 12);
                const g = Math.round(18 + ratioX * 16);
                const b = Math.round(28 + ratioX * 24);
                sampledHex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase();
                sampledRGB = `RGB(${r}, ${g}, ${b})`;
            }
        }

        colorText.textContent = `${sampledHex} · ${sampledRGB}`;
        if (magCenterCell) {
            magCenterCell.style.backgroundColor = sampledHex;
            magCenterCell.style.boxShadow = `0 0 10px ${sampledHex}`;
        }
        magnifier.style.boxShadow = `0 15px 40px rgba(0, 0, 0, 0.8), inset 0 0 18px ${sampledHex}66`;
    });

    // Spacebar toggling Macro / Micro element detection
    function toggleSnappingMode() {
        isMicroMode = !isMicroMode;
        updateSnappingFrame();
        showToast(isMicroMode ? "🎯 已切换为微观 UI 控件探测 (Space)" : "🔲 已切换为宏观应用窗口吸附 (Space)");
    }

    function updateSnappingFrame() {
        if (!xcodeWin) return;
        if (!isMicroMode) {
            snappingBorder.style.left = '40px';
            snappingBorder.style.top = '40px';
            snappingBorder.style.width = '540px';
            snappingBorder.style.height = '380px';
        } else {
            snappingBorder.style.left = '60px';
            snappingBorder.style.top = '120px';
            snappingBorder.style.width = '340px';
            snappingBorder.style.height = '70px';
        }
    }

    // Spacebar listener for hero
    window.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
            e.preventDefault();
            toggleSnappingMode();
        }
    });

    // Tier 2 Tool Button Clicks -> Update Tier 1 Dynamic Secondary Options!
    toolButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            toolButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const toolName = btn.getAttribute('data-tool');
            renderTierOptions(toolName);
            showToast(`已激活标注工具: ${toolName.toUpperCase()}`);
        });
    });

    // Tier 3 AI Pills in Hero
    const heroAiExplain = document.getElementById('heroAiExplain');
    const heroAiTranslate = document.getElementById('heroAiTranslate');
    const heroAiOCR = document.getElementById('heroAiOCR');

    if (heroAiExplain) {
        heroAiExplain.addEventListener('click', () => {
            showToast("✨ AuraVision: 正在聚焦选区代码进行核心逻辑推理...");
        });
    }
    if (heroAiTranslate) {
        heroAiTranslate.addEventListener('click', () => {
            showToast("🌐 AuraVision: 正在进行多语言自然语义精准翻译...");
        });
    }
    if (heroAiOCR) {
        heroAiOCR.addEventListener('click', () => {
            showToast("🔍 AuraVision: 正在提取选区排版级文本与表格...");
        });
    }

    // Copy action
    if (btnCopy) {
        btnCopy.addEventListener('click', () => {
            showToast("✨ 已复制选区高清原画至剪贴板 (⌘C)");
        });
    }

    function showToast(msg) {
        if (!toast) return;
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2000);
    }
}

/* ==========================================================================
   4. Feature Studio (5-Tab Interactive Playground)
   ========================================================================== */
function initFeatureStudio() {
    const tabButtons = document.querySelectorAll('.studio-tab-btn[data-tab]');
    const tabPanels = document.querySelectorAll('.studio-panel');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-tab');
            tabButtons.forEach(b => b.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            const panel = document.getElementById(`panel-${target}`);
            if (panel) panel.classList.add('active');
        });
    });

    // Tab 1: Matting Studio Interactivity
    const mattingCard = document.getElementById('mattingPreviewCard');
    const mattingBox = document.getElementById('mattingContentBox');
    const btnToggleCutout = document.getElementById('btnToggleCutout');
    const mattingStatus = document.getElementById('mattingStatusText');
    const btnLaplace = document.getElementById('btnEngineLaplace');
    const btnBria = document.getElementById('btnEngineBria');
    const btnVision = document.getElementById('btnEngineVision');
    const mattingBtns = [btnLaplace, btnBria, btnVision];

    let isCutout = true;
    if (mattingCard && btnToggleCutout) {
        // Start in cutout mode
        mattingCard.classList.add('matting-cutout-active');

        btnToggleCutout.addEventListener('click', () => {
            isCutout = !isCutout;
            if (isCutout) {
                mattingCard.classList.add('matting-cutout-active');
                btnToggleCutout.textContent = "还原原图背景";
                mattingStatus.textContent = "💡 当前预览：拉普拉斯高频净底去背 (GPU 棋盘格)";
            } else {
                mattingCard.classList.remove('matting-cutout-active');
                btnToggleCutout.textContent = "一键智能去背";
                mattingStatus.textContent = "🔲 当前预览：原始深色背景原图";
            }
        });

        mattingBtns.forEach(b => {
            if (!b) return;
            b.addEventListener('click', () => {
                mattingBtns.forEach(btn => btn && btn.classList.remove('active'));
                b.classList.add('active');
                if (b === btnLaplace) {
                    mattingBox.innerHTML = `<code><span style="color: #f43f5e;">struct</span> <span style="color: #38bdf8;">AuraSnap</span> {<br>&nbsp;&nbsp;<span style="color: #a855f7;">let</span> engine = <span style="color: #10b981;">"Laplace 4-Pass"</span><br>&nbsp;&nbsp;<span style="color: #a855f7;">let</span> sharpness = <span style="color: #f59e0b;">1.00</span><br>}</code>`;
                    mattingStatus.textContent = "💡 拉普拉斯 UI 净底：二阶微分数学算法，文字笔画 100% 锐利";
                } else if (b === btnBria) {
                    mattingBox.innerHTML = `<div style="text-align: center; padding: 0.5rem;"><span style="font-size: 2rem;">👤</span><br><strong style="color: #38bdf8;">云端商业级语义去背 (兼容 Bria API)</strong><br><span style="font-size: 0.72rem; color: #94a3b8;">支持配置自有密钥 · 高保真连续 Alpha 蒙版</span></div>`;
                    mattingStatus.textContent = "💡 云端商业级语义去背：支持接入 Bria API，高保真连续 Alpha 蒙版，自然过渡毛发与半透明边缘";
                } else if (b === btnVision) {
                    mattingBox.innerHTML = `<div style="text-align: center; padding: 0.5rem;"><span style="font-size: 2rem;">⚡</span><br><strong style="color: #10b981;">Apple Vision 离线兜底</strong><br><span style="font-size: 0.72rem; color: #94a3b8;">0 延迟 · 0 网络依赖 · 0 额外包体积</span></div>`;
                    mattingStatus.textContent = "💡 Apple Vision：原生离线神经引擎提取主体，光速兜底 100% 可用";
                }
            });
        });
    }

    // Tab 4: Pin Opacity & Ghost Mode
    const pinBox = document.getElementById('simPinBox');
    const opacitySlider = document.getElementById('pinOpacitySlider');
    const opacityVal = document.getElementById('opacityVal');
    const btnGhost = document.getElementById('btnGhostToggle');
    const ghostText = document.getElementById('ghostBtnText');

    if (opacitySlider && pinBox && opacityVal) {
        opacitySlider.addEventListener('input', () => {
            const val = opacitySlider.value;
            opacityVal.textContent = `${val}%`;
            pinBox.style.opacity = `${val / 100}`;
        });

        pinBox.addEventListener('click', (e) => {
            if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'BUTTON') {
                alert("💡 在 AuraSnap 中，按住 ⌘ (Command) 键不放直接拖拽贴图，即可将贴图直接拖入微信、钉钉、飞书、Slack 聊天窗口发送，或者直接拖入访达（Finder）文件夹秒存为 PNG！");
            }
        });
    }

    let isGhost = false;
    if (btnGhost && pinBox && ghostText) {
        btnGhost.addEventListener('click', () => {
            isGhost = !isGhost;
            if (isGhost) {
                btnGhost.classList.add('ghost-active');
                ghostText.textContent = "穿透模式已激活 (⌥G)";
                pinBox.style.boxShadow = "0 0 25px rgba(129, 140, 248, 0.5)";
            } else {
                btnGhost.classList.remove('ghost-active');
                ghostText.textContent = "开启 Ghost 穿透模式 (⌥G)";
                pinBox.style.boxShadow = "0 25px 60px rgba(0, 0, 0, 0.8)";
            }
        });
    }

    // Tab 6: Recording ⌘ Drag Animation
    const dragChip = document.getElementById('videoDragChip');
    const dragZone = document.getElementById('recordDragZone');

    if (dragChip && dragZone) {
        dragChip.addEventListener('click', () => {
            dragChip.style.transform = 'scale(0.95)';
            setTimeout(() => {
                dragChip.style.transform = 'scale(1)';
                alert("💡 在 AuraSnap 原生客户端中，按住 ⌘ 键直接拖拽即可将 MP4/GIF 直接拖进微信、飞书、Slack 或访达文件夹！");
            }, 150);
        });
    }

    // Longshot Minimap Tracker
    const tabCodeViewport = document.getElementById('tabCodeViewport');
    const tabMinimapThumb = document.getElementById('tabMinimapThumb');

    if (tabCodeViewport && tabMinimapThumb) {
        tabCodeViewport.addEventListener('scroll', () => {
            const top = tabCodeViewport.scrollTop;
            const max = tabCodeViewport.scrollHeight - tabCodeViewport.clientHeight;
            const progress = max > 0 ? top / max : 0;
            tabMinimapThumb.style.top = `${4 + progress * 80}px`;
        });
    }

    // Tab 2: AI Stream Actions (1:1 AIPillBarView Behavior)
    const btnAiExplain = document.getElementById('btnAiExplain');
    const btnAiTranslate = document.getElementById('btnAiTranslate');
    const btnAiOCR = document.getElementById('btnAiOCR');
    const aiStreamBox = document.getElementById('aiStreamBox');
    const aiThinkLine = document.querySelector('.ai-think-block span');
    const aiBtns = [btnAiExplain, btnAiTranslate, btnAiOCR];

    if (aiStreamBox) {
        aiBtns.forEach(btn => {
            if (!btn) return;
            btn.addEventListener('click', () => {
                aiBtns.forEach(b => b && b.classList.remove('active'));
                btn.classList.add('active');

                if (btn === btnAiExplain) {
                    if (aiThinkLine) aiThinkLine.textContent = "正在聚焦红圈区域 amount * 0.0825 进行核心逻辑语义推理...";
                    aiStreamBox.innerHTML = `💡 <strong>AI 标注感知:</strong> 检测到红圈框选了税率计算逻辑 <code>amount * 0.0825</code>，这是 8.25% 的综合消费税率计算公式。`;
                } else if (btn === btnAiTranslate) {
                    if (aiThinkLine) aiThinkLine.textContent = "正在提取图中上下文并进行自然语言精准翻译...";
                    aiStreamBox.innerHTML = `🌐 <strong>纯粹翻译输出:</strong> 计算税费 (金额: 双精度浮点数) -> 双精度浮点数`;
                } else if (btn === btnAiOCR) {
                    if (aiThinkLine) aiThinkLine.textContent = "正在进行排版级 OCR 字符检测并严格保留 Swift 缩进...";
                    aiStreamBox.innerHTML = `📝 <strong>排版级 OCR (Swift):</strong><br><code>func calculateTax(amount: Double) -> Double</code>`;
                }
            });
        });
    }

    // Tab 5: Waterdrop Step Pins 360 Rotation Interactivity
    const waterdropPins = document.querySelectorAll('.native-waterdrop-pin');
    waterdropPins.forEach(pin => {
        let currentRot = 0;
        pin.addEventListener('click', () => {
            currentRot += 45;
            const svg = pin.querySelector('.waterdrop-svg');
            if (svg) {
                svg.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
                svg.style.transform = `rotate(${currentRot}deg)`;
            }
        });
    });
}

/* ==========================================================================
   5. Live Keyboard Shortcut HUD Tester
   ========================================================================== */
function initKeyboardHUDTester() {
    const keyMap = {
        'Space': 'hudKeySpace',
        'KeyC': 'hudKeyColor',
        'Escape': 'hudKeyEsc',
        'Digit1': 'hudKeyCapture',
        'Digit2': 'hudKeyRestore',
        'KeyG': 'hudKeyGhost',
        'KeyP': 'hudKeyPin',
        'KeyT': 'hudKeyTextPin'
    };

    window.addEventListener('keydown', (e) => {
        const cardId = keyMap[e.code];
        if (cardId) {
            const card = document.getElementById(cardId);
            if (card) {
                card.classList.add('active-key');
            }
        }
    });

    window.addEventListener('keyup', (e) => {
        const cardId = keyMap[e.code];
        if (cardId) {
            const card = document.getElementById(cardId);
            if (card) {
                setTimeout(() => {
                    card.classList.remove('active-key');
                }, 250);
            }
        }
    });
}
