// ================= GLOBAL INITIALIZATION =================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons if available
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Initialize Sorting Array if on Informatika page
    if (document.getElementById('sort-container')) {
        resetSortArray();
    }

    // Process Initial Caesar Cipher layout if modal elements exist (for converter/crypto)
    const cryptoInput = document.getElementById('crypto-input');
    if (cryptoInput) {
        processCryptoEncoder();
    }

    // Initialize Floating Media Player
    initMediaPlayer();
});

// ================= MOBILE NAVIGATION MENU TOGGLE =================
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    if (!mobileMenu || !menuIcon) return;

    const isHidden = mobileMenu.classList.contains('hidden');

    if (isHidden) {
        mobileMenu.classList.remove('hidden');
        menuIcon.setAttribute('data-lucide', 'x');
    } else {
        mobileMenu.classList.add('hidden');
        menuIcon.setAttribute('data-lucide', 'menu');
    }
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// ================= LIGHT / DARK MODE TOGGLE =================
function toggleTheme() {
    const htmlEl = document.documentElement;
    if (htmlEl.classList.contains('dark')) {
        htmlEl.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    } else {
        htmlEl.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    }
}

// Apply saved theme state on load immediately (placed here and in inline scripts to prevent flashing)
if (localStorage.getItem('theme') === 'light') {
    document.documentElement.classList.remove('dark');
} else {
    document.documentElement.classList.add('dark');
}

// ================= PROFILE FORM SIMULATOR =================
function submitForm(event) {
    event.preventDefault();
    const nameEl = document.getElementById('contact-name');
    const emailEl = document.getElementById('contact-email');
    const messageEl = document.getElementById('contact-message');
    const successDiv = document.getElementById('contact-success');
    const formEl = document.getElementById('contact-form');

    if (nameEl && emailEl && messageEl && successDiv) {
        const name = nameEl.value;
        const email = emailEl.value;
        const message = messageEl.value;

        if (name && email && message) {
            successDiv.classList.remove('hidden');
            if (formEl) formEl.reset();

            setTimeout(() => {
                successDiv.classList.add('hidden');
            }, 4000);
        }
    }
}

// ================= INFORMATIKA: CALCULATOR CORE =================
let calcVal = '0';
let calcExpr = '';

function calcUpdateScreen() {
    const screen = document.getElementById('calc-screen');
    const expr = document.getElementById('calc-expression');
    if (screen) screen.textContent = calcVal;
    if (expr) expr.textContent = calcExpr;
}

function calcClear() {
    calcVal = '0';
    calcExpr = '';
    calcUpdateScreen();
}

function calcInput(char) {
    const operators = ['+', '-', '*', '/'];

    if (calcVal === '0' && !operators.includes(char) && char !== '.') {
        calcVal = char;
    } else {
        if (operators.includes(char) && operators.includes(calcVal.slice(-1))) {
            return;
        }
        calcVal += char;
    }
    calcExpr = calcVal;
    calcUpdateScreen();
}

function calcCalculate() {
    try {
        const sanitizedExpr = calcVal.replace(/[^0-9+\-*/.]/g, '');
        if (sanitizedExpr === '') return;

        const result = Function(`"use strict"; return (${sanitizedExpr})`)();
        calcExpr = calcVal + ' =';
        calcVal = Number.isInteger(result) ? result.toString() : parseFloat(result.toFixed(4)).toString();
    } catch (err) {
        calcVal = 'Error';
    }
    calcUpdateScreen();
}

// ================= INFORMATIKA: BUBBLE SORT VISUALIZER =================
let sortArray = [];
const numBars = 10;
let isSorting = false;

function resetSortArray() {
    if (isSorting) return;
    sortArray = [];
    for (let i = 0; i < numBars; i++) {
        sortArray.push(Math.floor(Math.random() * 80) + 15);
    }
    renderBars();
    const status = document.getElementById('sort-status');
    if (status) status.textContent = 'Status: Array diacak';
}

function renderBars(comparingIdx = [], sortedIdx = []) {
    const container = document.getElementById('sort-container');
    if (!container) return;
    container.innerHTML = '';

    sortArray.forEach((val, idx) => {
        const bar = document.createElement('div');
        bar.style.height = `${val}%`;
        bar.className = 'w-5 sm:w-6 transition-all duration-150 rounded-t';

        if (sortedIdx.includes(idx)) {
            bar.className += ' bg-zinc-900 dark:bg-white';
        } else if (comparingIdx.includes(idx)) {
            bar.className += ' bg-zinc-400 dark:bg-zinc-500';
        } else {
            bar.className += ' bg-zinc-300 dark:bg-zinc-800 border border-zinc-400/20';
        }
        container.appendChild(bar);
    });
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function startBubbleSort() {
    if (isSorting) return;
    const btnStart = document.getElementById('btn-sort-start');
    const btnReset = document.getElementById('btn-sort-reset');
    const status = document.getElementById('sort-status');

    isSorting = true;
    if (btnStart) btnStart.disabled = true;
    if (btnReset) btnReset.disabled = true;
    if (status) status.textContent = 'Status: Mengurutkan...';

    const len = sortArray.length;
    let sortedIdx = [];

    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len - i - 1; j++) {
            renderBars([j, j + 1], sortedIdx);
            await sleep(350);

            if (sortArray[j] > sortArray[j + 1]) {
                let temp = sortArray[j];
                sortArray[j] = sortArray[j + 1];
                sortArray[j + 1] = temp;

                renderBars([j, j + 1], sortedIdx);
                await sleep(200);
            }
        }
        sortedIdx.push(len - 1 - i);
    }

    renderBars([], [...Array(len).keys()]);
    if (status) status.textContent = 'Status: Selesai diurutkan!';
    isSorting = false;
    if (btnStart) btnStart.disabled = false;
    if (btnReset) btnReset.disabled = false;
}

// ================= INFORMATIKA: ACCORDION TOGGLE =================
function toggleAccordion(id) {
    const content = document.getElementById(`content-${id}`);
    const icon = document.getElementById(`icon-${id}`);
    if (!content) return;

    const isClosed = content.style.maxHeight === '' || content.style.maxHeight === '0px';

    document.querySelectorAll('[id^="content-acc-"]').forEach(item => {
        item.style.maxHeight = '0px';
    });
    document.querySelectorAll('[id^="icon-acc-"]').forEach(ic => {
        ic.style.transform = 'rotate(0deg)';
    });

    if (isClosed) {
        content.style.maxHeight = content.scrollHeight + 'px';
        if (icon) icon.style.transform = 'rotate(180deg)';
    }
}

// ================= BAHASA INDONESIA: FONT SIZE ADJUST =================
function changeFontSize(direction) {
    const essay = document.getElementById('essay-content');
    if (!essay) return;
    let currentSize = parseInt(window.getComputedStyle(essay).fontSize);

    let newSize = currentSize + (direction * 2);
    if (newSize >= 12 && newSize <= 26) {
        essay.style.fontSize = `${newSize}px`;
    }
}

// ================= BAHASA INDONESIA: LITERARY TABS =================
function switchAnalysisTab(tabName) {
    const content = document.getElementById(`content-tab-${tabName}`);
    if (!content) return;

    document.querySelectorAll('.analysis-tab-content').forEach(el => {
        el.classList.add('hidden');
    });
    content.classList.remove('hidden');

    document.querySelectorAll('.analysis-tab-btn').forEach(btn => {
        btn.classList.remove('bg-white', 'dark:bg-zinc-900', 'text-zinc-900', 'dark:text-white');
        btn.classList.add('text-zinc-500');
    });

    const activeBtn = document.getElementById(`btn-tab-${tabName}`);
    if (activeBtn) {
        activeBtn.classList.remove('text-zinc-500');
        activeBtn.classList.add('bg-white', 'dark:bg-zinc-900', 'text-zinc-900', 'dark:text-white');
    }
}

// ================= BAHASA INDONESIA: POETRY SLIDER =================
let activePoemIdx = 1;
const totalPoemSlides = 2;

function updatePoemSlides() {
    for (let i = 1; i <= totalPoemSlides; i++) {
        const slide = document.getElementById(`poem-slide-${i}`);
        if (!slide) continue;
        if (i === activePoemIdx) {
            slide.classList.remove('hidden');
            slide.style.opacity = '0';
            setTimeout(() => {
                slide.style.opacity = '1';
            }, 50);
        } else {
            slide.classList.add('hidden');
        }
    }
}

function prevPoemSlide() {
    activePoemIdx = activePoemIdx === 1 ? totalPoemSlides : activePoemIdx - 1;
    updatePoemSlides();
}

function nextPoemSlide() {
    activePoemIdx = activePoemIdx === totalPoemSlides ? 1 : activePoemIdx + 1;
    updatePoemSlides();
}

// ================= ARTIKEL INFORMATIKA: INTERACTIVE LOGIC =================
function changeArticleFontSize(direction) {
    const article = document.getElementById('article-detail-content');
    if (!article) return;
    let currentSize = parseInt(window.getComputedStyle(article).fontSize);
    let newSize = currentSize + (direction * 2);
    if (newSize >= 12 && newSize <= 28) {
        article.style.fontSize = `${newSize}px`;
    }
}

function scrollToArticleSection(id) {
    event.preventDefault();
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        updateActiveTOC(id);
    }
}

function updateActiveTOC(activeId) {
    document.querySelectorAll('.toc-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${activeId}`) {
            link.classList.remove('text-zinc-500', 'border-transparent', 'pl-3');
            link.classList.add('text-zinc-950', 'dark:text-white', 'border-zinc-950', 'dark:border-white', 'pl-4');
        } else {
            link.classList.remove('text-zinc-950', 'dark:text-white', 'border-zinc-950', 'dark:border-white', 'pl-4');
            link.classList.add('text-zinc-500', 'border-transparent', 'pl-3');
        }
    });
}

// Scroll listener for reading progress & scrollspy TOC highlight
window.addEventListener('scroll', () => {
    const articleElement = document.getElementById('article-detail-content');
    if (articleElement && !articleElement.closest('.hidden')) {
        // Reading progress
        const rect = articleElement.getBoundingClientRect();
        const articleHeight = rect.height;
        const scrolled = window.scrollY - (articleElement.offsetTop - 100);
        const winHeight = window.innerHeight;

        let progress = 0;
        if (scrolled > 0) {
            progress = (scrolled / (articleHeight - winHeight + 100)) * 100;
        }
        progress = Math.min(Math.max(progress, 0), 100);
        const progressBar = document.getElementById('read-progress');
        if (progressBar) progressBar.style.width = `${progress}%`;

        // Scrollspy for TOC
        const sections = ['art-definisi', 'art-sejarah', 'art-pilar', 'art-ai', 'art-prospek'];
        let currentActive = sections[0];

        for (const secId of sections) {
            const el = document.getElementById(secId);
            if (el) {
                const top = el.getBoundingClientRect().top;
                if (top < 150) {
                    currentActive = secId;
                }
            }
        }
        updateActiveTOC(currentActive);
    }
});

// ================= INFORMATIKA: FILTER TAB =================
function filterInformatika(category) {
    const cards = document.querySelectorAll('.info-card');
    cards.forEach(card => {
        if (category === 'all' || card.classList.contains(`info-${category}`)) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });

    const filterBtns = document.querySelectorAll('.info-filter-btn');
    filterBtns.forEach(btn => {
        btn.classList.remove('bg-white', 'dark:bg-zinc-800', 'text-zinc-900', 'dark:text-white', 'shadow-sm');
        btn.classList.add('text-zinc-500');
    });
    const activeBtn = document.getElementById(`btn-info-${category}`);
    if (activeBtn) {
        activeBtn.classList.remove('text-zinc-500');
        activeBtn.classList.add('bg-white', 'dark:bg-zinc-800', 'text-zinc-900', 'dark:text-white', 'shadow-sm');
    }
}

// ================= INFORMATIKA: MODAL READER / APP LAUNCHER =================
function openInfoModal(type) {
    const modal = document.getElementById('info-modal');
    const modalTitle = document.getElementById('info-modal-title');
    const modalBadge = document.getElementById('info-modal-badge');
    const modalBody = document.getElementById('info-modal-body');

    if (!modal) return;

    if (type === 'app-converter') {
        modalBadge.textContent = 'Aplikasi • Konversi Sistem Bilangan';
        modalTitle.textContent = 'Kalkulator Konversi Sistem Bilangan';
        modalBody.innerHTML = `
            <div class="space-y-6">
                <p class="text-sm text-zinc-600 dark:text-zinc-400">Masukan angka pada salah satu basis di bawah untuk mengonversi ke basis biner (2), desimal (10), oktal (8), dan heksadesimal (16) secara real-time.</p>
                <div class="space-y-4 font-mono text-sm">
                    <div>
                        <label class="block text-xs font-semibold text-zinc-500 uppercase mb-1">Desimal (Base 10)</label>
                        <input type="number" id="base-dec" oninput="convertBaseInput(this.value, 10)" placeholder="Contoh: 255" class="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg px-4 py-2 text-zinc-900 dark:text-white font-mono">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-zinc-500 uppercase mb-1">Biner (Base 2)</label>
                        <input type="text" id="base-bin" oninput="convertBaseInput(this.value, 2)" placeholder="Contoh: 11111111" class="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg px-4 py-2 text-zinc-900 dark:text-white font-mono">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-zinc-500 uppercase mb-1">Oktal (Base 8)</label>
                        <input type="text" id="base-oct" oninput="convertBaseInput(this.value, 8)" placeholder="Contoh: 377" class="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg px-4 py-2 text-zinc-900 dark:text-white font-mono">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-zinc-500 uppercase mb-1">Heksadesimal (Base 16)</label>
                        <input type="text" id="base-hex" oninput="convertBaseInput(this.value, 16)" placeholder="Contoh: FF" class="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg px-4 py-2 text-zinc-900 dark:text-white font-mono uppercase">
                    </div>
                </div>
            </div>
        `;
    } else if (type === 'app-crypto') {
        modalBadge.textContent = 'Aplikasi • Enkripsi & Keamanan';
        modalTitle.textContent = 'Simulator Enkripsi Caesar Cipher';
        modalBody.innerHTML = `
            <div class="space-y-5 text-sm">
                <p class="text-zinc-600 dark:text-zinc-400">Simulator algoritma kriptografi klasik Caesar Cipher untuk menyandikan teks dengan pergeseran kunci (shift key).</p>
                <div class="space-y-3">
                    <div>
                        <label class="block text-xs font-semibold text-zinc-500 uppercase mb-1">Teks Asli (Plaintext)</label>
                        <input type="text" id="crypto-input" value="BLEACKLEY DIGITALS" oninput="processCryptoEncoder()" class="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg px-4 py-2 text-zinc-900 dark:text-white font-mono">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-zinc-500 uppercase mb-1">Kunci Pergeseran (Shift Key): <span id="crypto-shift-val">3</span></label>
                        <input type="range" id="crypto-shift" min="1" max="25" value="3" oninput="document.getElementById('crypto-shift-val').textContent=this.value; processCryptoEncoder();" class="w-full accent-zinc-900 dark:accent-white cursor-pointer">
                    </div>
                    <div class="pt-3 border-t border-zinc-200 dark:border-zinc-800">
                        <label class="block text-xs font-semibold text-zinc-500 uppercase mb-1">Teks Rahasia (Ciphertext)</label>
                        <div id="crypto-output" class="w-full bg-zinc-900 text-emerald-400 font-mono p-3 rounded-lg text-lg font-bold break-all">EOHDFNOHB GLJLWDOW</div>
                    </div>
                </div>
            </div>
        `;
    } else if (type === 'alg-search') {
        modalBadge.textContent = 'Algoritma • Visualizer Pencarian';
        modalTitle.textContent = 'Simulator Algoritma Binary Search';
        modalBody.innerHTML = `
            <div class="space-y-5 text-sm">
                <p class="text-zinc-600 dark:text-zinc-400">Algoritma Binary Search mencari data pada array terurut dengan membagi ruang pencarian menjadi 2 setiap langkahnya (O(log n)).</p>
                <div class="p-4 bg-zinc-100 dark:bg-zinc-950 rounded-xl space-y-4 border border-zinc-300 dark:border-zinc-800">
                    <div class="flex items-center gap-2">
                        <input type="number" id="bin-search-target" placeholder="Cari angka (1-100)..." value="42" class="bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-sm w-44 font-mono">
                        <button onclick="startBinarySearchDemo()" class="px-4 py-1.5 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-bold text-xs cursor-pointer">Cari Angka</button>
                    </div>
                    <div id="bin-search-steps" class="space-y-2 max-h-56 overflow-y-auto font-mono text-xs text-zinc-700 dark:text-zinc-300 p-2">
                        Tekan "Cari Angka" untuk menjalankan simulasi pencarian biner step-by-step.
                    </div>
                </div>
            </div>
        `;
    } else if (type === 'art-uu-ite') {
        modalBadge.textContent = 'Artikel • Etika & Hukum Siskom';
        modalTitle.textContent = 'Rangkuman Regulasi UU ITE di Indonesia';
        modalBody.innerHTML = `
            <div class="prose dark:prose-invert text-sm leading-relaxed space-y-4">
                <p>Undang-Undang Informasi dan Transaksi Elektronik (UU ITE) mengatur pemanfaatan teknologi dan transaksi elektronik di Indonesia.</p>
                <h4 class="font-bold text-base">Pasal-Pasal Krusial:</h4>
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Pasal 27:</strong> Melarang pencemaran nama baik, kesusilaan, judi online, dan ancaman pemerasan di media sosial.</li>
                    <li><strong>Pasal 28:</strong> Melarang penyebaran berita hoaks dan insitasi kebencian SARA.</li>
                    <li><strong>Pasal 30:</strong> Melarang hacking dan peretasan ilegal terhadap sistem milik orang lain.</li>
                </ul>
            </div>
        `;
    } else if (type === 'art-cisco') {
        modalBadge.textContent = 'Artikel • Simulasi Jaringan';
        modalTitle.textContent = 'Panduan Cisco Packet Tracer';
        modalBody.innerHTML = `
            <div class="prose dark:prose-invert text-sm leading-relaxed space-y-4">
                <p>Cisco Packet Tracer adalah perangkat lunak simulasi jaringan untuk mendesain topologi LAN/WAN dan konfigurasi Router & Switch.</p>
                <h4 class="font-bold text-base">Langkah Dasar Membuat LAN Sederhana:</h4>
                <ol class="list-decimal pl-5 space-y-2">
                    <li>Tambahkan 1 Switch dan 3 Unit PC.</li>
                    <li>Hubungkan dengan kabel Copper Straight-Through.</li>
                    <li>Konfigurasikan IP Statis (192.168.1.X) pada setiap PC.</li>
                    <li>Uji konektivitas dengan perintah <code>ping</code> di Command Prompt.</li>
                </ol>
            </div>
        `;
    }

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
    if (window.lucide) lucide.createIcons();
}

function closeInfoModal() {
    const modal = document.getElementById('info-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.style.overflow = '';
    }
}

// Converter helper function
function convertBaseInput(val, fromBase) {
    if (!val || val.trim() === '') {
        const dec = document.getElementById('base-dec');
        const bin = document.getElementById('base-bin');
        const oct = document.getElementById('base-oct');
        const hex = document.getElementById('base-hex');
        if (dec) dec.value = '';
        if (bin) bin.value = '';
        if (oct) oct.value = '';
        if (hex) hex.value = '';
        return;
    }

    try {
        const decVal = parseInt(val, fromBase);
        if (isNaN(decVal)) return;

        const dec = document.getElementById('base-dec');
        const bin = document.getElementById('base-bin');
        const oct = document.getElementById('base-oct');
        const hex = document.getElementById('base-hex');

        if (fromBase !== 10 && dec) dec.value = decVal.toString(10);
        if (fromBase !== 2 && bin) bin.value = decVal.toString(2);
        if (fromBase !== 8 && oct) oct.value = decVal.toString(8);
        if (fromBase !== 16 && hex) hex.value = decVal.toString(16).toUpperCase();
    } catch (e) { }
}

// Caesar Cipher Encoder helper
function processCryptoEncoder() {
    const inputEl = document.getElementById('crypto-input');
    const shiftEl = document.getElementById('crypto-shift');
    if (!inputEl || !shiftEl) return;

    const input = inputEl.value.toUpperCase();
    const shift = parseInt(shiftEl.value) || 3;
    let result = '';

    for (let i = 0; i < input.length; i++) {
        let code = input.charCodeAt(i);
        if (code >= 65 && code <= 90) {
            result += String.fromCharCode(((code - 65 + shift) % 26) + 65);
        } else {
            result += input.charAt(i);
        }
    }
    const outEl = document.getElementById('crypto-output');
    if (outEl) outEl.textContent = result;
}

// Binary Search Visualizer helper
function startBinarySearchDemo() {
    const targetEl = document.getElementById('bin-search-target');
    const stepsDiv = document.getElementById('bin-search-steps');
    if (!targetEl || !stepsDiv) return;

    const target = parseInt(targetEl.value);
    if (isNaN(target)) return;

    const arr = Array.from({ length: 100 }, (_, i) => i + 1);
    let low = 0, high = arr.length - 1;
    let stepCount = 0;
    let html = `<div class="text-zinc-500 italic mb-1">Memulai pencarian angka ${target} pada array terurut [1..100]:</div>`;

    while (low <= high) {
        stepCount++;
        let mid = Math.floor((low + high) / 2);
        let midVal = arr[mid];

        if (midVal === target) {
            html += `<div class="p-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded font-bold">Langkah ${stepCount}: DITEMUKAN pada indeks ${mid} (Nilai = ${midVal})!</div>`;
            stepsDiv.innerHTML = html;
            return;
        } else if (midVal < target) {
            html += `<div class="p-1.5 border-l-2 border-zinc-400 pl-2">Langkah ${stepCount}: mid = ${midVal} (&lt; ${target}) &rarr; Cari ke kanan (range [${mid + 1}..${high}])</div>`;
            low = mid + 1;
        } else {
            html += `<div class="p-1.5 border-l-2 border-zinc-400 pl-2">Langkah ${stepCount}: mid = ${midVal} (&gt; ${target}) &rarr; Cari ke kiri (range [${low}..${mid - 1}])</div>`;
            high = mid - 1;
        }
    }
    html += `<div class="p-2 bg-rose-500/10 border border-rose-500/30 text-rose-500 rounded">Angka ${target} tidak ditemukan dalam array.</div>`;
    stepsDiv.innerHTML = html;
}

// ================= GLOBAL FLOATING MEDIA PLAYER =================
function initMediaPlayer() {
    // Check if audio element already exists to prevent duplicate initialization
    if (document.getElementById('global-media-player')) return;

    // Define the playlist
    const playlist = [
        {
            title: "One Call Away",
            artist: "Charlie Puth",
            src: "Charlie Puth - One Call Away [Official Video].mp3",
            cover: "assets/images/one_call_away_cover.png"
        },
        {
            title: "Who Knows",
            artist: "Bleackley Collection",
            src: "Who Knows.mp3",
            cover: "assets/images/who_knows_cover.png"
        },
        {
            title: "Teh Hijau",
            artist: "Bleackley Collection",
            src: "Teh Hijau.mp3",
            cover: "assets/images/teh_hijau_cover.png"
        }
    ];

    // Restore state from LocalStorage
    let currentTrackIndex = parseInt(localStorage.getItem('music_currentTrackIndex')) || 0;
    // Safety check for index out of bounds
    if (currentTrackIndex < 0 || currentTrackIndex >= playlist.length) {
        currentTrackIndex = 0;
    }

    // Create the audio element
    const audio = document.createElement('audio');
    audio.id = 'global-audio';
    audio.src = playlist[currentTrackIndex].src;
    audio.loop = false; // Play through the playlist!
    document.body.appendChild(audio);

    // Create style rules for custom animations and styles
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes cd-rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        .animate-cd-rotate {
            animation: cd-rotate 12s linear infinite;
        }
        .animate-cd-paused {
            animation-play-state: paused;
        }
        @keyframes sound-bar {
            0%, 100% { height: 3px; }
            50% { height: 16px; }
        }
        .sound-bar-1 { animation: sound-bar 0.8s ease-in-out infinite; }
        .sound-bar-2 { animation: sound-bar 0.6s ease-in-out infinite 0.15s; }
        .sound-bar-3 { animation: sound-bar 0.9s ease-in-out infinite 0.3s; }
        .sound-bar-4 { animation: sound-bar 0.7s ease-in-out infinite 0.1s; }
        
        .pulse-glow-playing {
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1), 0 0 20px 2px rgba(16, 185, 129, 0.25);
        }
        .dark .pulse-glow-playing {
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3), 0 0 25px 4px rgba(255, 255, 255, 0.15);
        }
    `;
    document.head.appendChild(style);

    // Create UI Player Widget Container
    const playerWidget = document.createElement('div');
    playerWidget.id = 'global-media-player';
    playerWidget.className = 'fixed bottom-6 right-6 z-[9999] transition-all duration-500 ease-out transform translate-y-0 opacity-100';

    // HTML structure for expanded and collapsed states
    playerWidget.innerHTML = `
        <!-- Main Player Card (Expanded) -->
        <div id="player-expanded" class="w-80 backdrop-blur-xl bg-white/85 dark:bg-zinc-950/85 border border-zinc-200/50 dark:border-zinc-800/50 shadow-2xl rounded-2xl p-4 relative transition-all duration-300 flex flex-col gap-3.5 select-none hover:border-zinc-300 dark:hover:border-zinc-700 overflow-hidden">
            
            <!-- Collapse Button -->
            <button id="player-btn-collapse" title="Ciutkan Pemutar" class="absolute top-3 left-3 w-6 h-6 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200/85 dark:border-zinc-800 shadow flex items-center justify-center hover:scale-110 transition-transform cursor-pointer text-zinc-500 hover:text-zinc-900 dark:hover:text-white z-10">
                <i data-lucide="chevron-down" class="w-4 h-4"></i>
            </button>
            
            <!-- Playlist Toggle Button -->
            <button id="player-btn-playlist" title="Daftar Lagu" class="absolute top-3 right-3 w-6 h-6 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200/85 dark:border-zinc-800 shadow flex items-center justify-center hover:scale-110 transition-transform cursor-pointer text-zinc-500 hover:text-zinc-900 dark:hover:text-white z-10">
                <i data-lucide="list-music" class="w-4 h-4"></i>
            </button>

            <!-- Song Info Area -->
            <div class="flex items-center gap-3.5 pt-4">
                <!-- CD cover disk -->
                <div class="relative w-14 h-14 rounded-full border-2 border-zinc-900/10 dark:border-white/10 shadow-lg overflow-hidden flex-shrink-0 flex items-center justify-center bg-zinc-200 dark:bg-zinc-850">
                    <img id="player-img-cover" src="${playlist[currentTrackIndex].cover}" alt="${playlist[currentTrackIndex].title}" class="w-full h-full object-cover animate-cd-rotate animate-cd-paused">
                    <!-- CD Hole center -->
                    <div class="w-3 h-3 bg-zinc-50 dark:bg-zinc-950 rounded-full absolute border border-zinc-200 dark:border-zinc-800 shadow-inner"></div>
                </div>

                <!-- Song Details -->
                <div class="flex-grow min-w-0 pr-2">
                    <h4 id="player-title" class="font-display font-bold text-sm text-zinc-900 dark:text-white truncate">${playlist[currentTrackIndex].title}</h4>
                    <p id="player-artist" class="text-xs text-zinc-500 dark:text-zinc-400 truncate">${playlist[currentTrackIndex].artist}</p>
                    
                    <!-- Visualizer bars when playing -->
                    <div id="player-visualizer" class="flex items-end gap-[3px] h-4 mt-1.5 opacity-0 transition-opacity duration-300">
                        <div class="w-[3px] bg-zinc-900 dark:bg-white rounded-full sound-bar-1"></div>
                        <div class="w-[3px] bg-zinc-900 dark:bg-white rounded-full sound-bar-2"></div>
                        <div class="w-[3px] bg-zinc-900 dark:bg-white rounded-full sound-bar-3"></div>
                        <div class="w-[3px] bg-zinc-900 dark:bg-white rounded-full sound-bar-4"></div>
                    </div>
                </div>
            </div>

            <!-- Controls (Play, Volume, Progress) -->
            <div class="space-y-2.5">
                <!-- Progress bar row -->
                <div class="space-y-1">
                    <div class="flex items-center justify-between text-[10px] font-mono text-zinc-500">
                        <span id="player-time-current">0:00</span>
                        <span id="player-time-total">0:00</span>
                    </div>
                    <div id="player-progress-container" class="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full relative cursor-pointer group/progress">
                        <div id="player-progress-bar" class="h-full bg-zinc-900 dark:bg-white rounded-full w-0 transition-all duration-75 relative">
                            <!-- Handle slider dot -->
                            <div class="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-zinc-950 dark:bg-white rounded-full shadow border border-white dark:border-zinc-950 scale-0 group-hover/progress:scale-100 transition-transform"></div>
                        </div>
                    </div>
                </div>

                <!-- Play/Pause/Prev/Next and Volume controls -->
                <div class="flex items-center justify-between">
                    <!-- Navigation & Play Button -->
                    <div class="flex items-center gap-1.5">
                        <button id="player-btn-prev" title="Lagu Sebelumnya" class="w-8 h-8 rounded-full border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 text-zinc-500 hover:text-zinc-900 dark:hover:text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-sm cursor-pointer">
                            <i data-lucide="skip-back" class="w-3.5 h-3.5"></i>
                        </button>
                        <button id="player-btn-play" class="w-9 h-9 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer">
                            <i data-lucide="play" class="w-4 h-4 fill-current"></i>
                        </button>
                        <button id="player-btn-next" title="Lagu Berikutnya" class="w-8 h-8 rounded-full border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 text-zinc-500 hover:text-zinc-900 dark:hover:text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-sm cursor-pointer">
                            <i data-lucide="skip-forward" class="w-3.5 h-3.5"></i>
                        </button>
                    </div>

                    <!-- Volume slider row -->
                    <div class="flex items-center gap-1.5 group/volume">
                        <button id="player-btn-volume" class="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer">
                            <i data-lucide="volume-2" class="w-4.5 h-4.5"></i>
                        </button>
                        <input id="player-volume-slider" type="range" min="0" max="1" step="0.05" value="0.8" class="w-14 accent-zinc-900 dark:accent-white h-1 rounded-full cursor-pointer bg-zinc-200 dark:bg-zinc-800 border-none outline-none">
                    </div>
                </div>
            </div>

            <!-- Playlist Drawer -->
            <div id="player-playlist-drawer" class="absolute inset-0 bg-white dark:bg-zinc-950 z-20 translate-y-full transition-transform duration-300 flex flex-col p-4">
                <div class="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2 mb-2">
                    <span class="font-display font-bold text-sm text-zinc-900 dark:text-white flex items-center gap-2">
                        <i data-lucide="list-music" class="w-4 h-4"></i> Daftar Lagu
                    </span>
                    <button id="player-btn-playlist-close" class="text-zinc-500 hover:text-zinc-900 dark:hover:text-white cursor-pointer">
                        <i data-lucide="x" class="w-4 h-4"></i>
                    </button>
                </div>
                <div id="player-playlist-list" class="flex-grow overflow-y-auto space-y-1 pr-1">
                    <!-- Dynamic playlist list will be injected -->
                </div>
            </div>
        </div>

        <!-- Collapsed Badge Button -->
        <button id="player-collapsed" class="hidden w-14 h-14 rounded-full border-2 border-zinc-900/10 dark:border-white/10 shadow-2xl overflow-hidden bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md flex-shrink-0 flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer group">
            <img id="player-img-cover-mini" src="${playlist[currentTrackIndex].cover}" alt="Music" class="w-full h-full object-cover animate-cd-rotate animate-cd-paused">
            <!-- CD Hole center (mini) -->
            <div class="w-3 h-3 bg-zinc-50 dark:bg-zinc-950 rounded-full absolute border border-zinc-200 dark:border-zinc-800 shadow-inner"></div>
            <!-- Play/Pause Overlay indicator -->
            <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-full">
                <i data-lucide="maximize-2" class="w-4 h-4 text-white"></i>
            </div>
        </button>
    `;

    document.body.appendChild(playerWidget);

    // Initialize Lucide Icons inside the player
    if (typeof lucide !== 'undefined') {
        lucide.createIcons({
            attrs: {
                class: 'lucide-icon'
            },
            nameAttr: 'data-lucide',
            node: playerWidget
        });
    }

    // Dom elements cache
    const playBtn = document.getElementById('player-btn-play');
    const prevBtn = document.getElementById('player-btn-prev');
    const nextBtn = document.getElementById('player-btn-next');
    const playlistToggleBtn = document.getElementById('player-btn-playlist');
    const playlistCloseBtn = document.getElementById('player-btn-playlist-close');
    const playlistDrawer = document.getElementById('player-playlist-drawer');
    const playlistList = document.getElementById('player-playlist-list');

    const volumeBtn = document.getElementById('player-btn-volume');
    const volumeSlider = document.getElementById('player-volume-slider');
    const progressContainer = document.getElementById('player-progress-container');
    const progressBar = document.getElementById('player-progress-bar');
    const timeCurrent = document.getElementById('player-time-current');
    const timeTotal = document.getElementById('player-time-total');

    const coverImg = document.getElementById('player-img-cover');
    const coverImgMini = document.getElementById('player-img-cover-mini');
    const visualizer = document.getElementById('player-visualizer');
    const titleEl = document.getElementById('player-title');
    const artistEl = document.getElementById('player-artist');

    const cardExpanded = document.getElementById('player-expanded');
    const cardCollapsed = document.getElementById('player-collapsed');
    const collapseBtn = document.getElementById('player-btn-collapse');

    // Helper: format time in MM:SS
    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // UI State Update
    function updatePlayerUI(isPlaying) {
        if (isPlaying) {
            playBtn.innerHTML = '<i data-lucide="pause" class="w-4 h-4 fill-current"></i>';
            coverImg.classList.remove('animate-cd-paused');
            coverImgMini.classList.remove('animate-cd-paused');
            visualizer.classList.remove('opacity-0');
            visualizer.classList.add('opacity-100');
            cardExpanded.classList.add('pulse-glow-playing');
            cardCollapsed.classList.add('pulse-glow-playing');
        } else {
            playBtn.innerHTML = '<i data-lucide="play" class="w-4 h-4 fill-current"></i>';
            coverImg.classList.add('animate-cd-paused');
            coverImgMini.classList.add('animate-cd-paused');
            visualizer.classList.remove('opacity-100');
            visualizer.classList.add('opacity-0');
            cardExpanded.classList.remove('pulse-glow-playing');
            cardCollapsed.classList.remove('pulse-glow-playing');
        }

        if (typeof lucide !== 'undefined') {
            lucide.createIcons({
                node: playBtn
            });
        }
    }

    // Volume UI update
    function updateVolumeUI() {
        const vol = audio.volume;
        const isMuted = audio.muted;
        let iconName = 'volume-2';

        if (isMuted || vol === 0) {
            iconName = 'volume-x';
        } else if (vol < 0.4) {
            iconName = 'volume';
        } else if (vol < 0.7) {
            iconName = 'volume-1';
        }

        volumeBtn.innerHTML = `<i data-lucide="${iconName}" class="w-4.5 h-4.5"></i>`;
        if (typeof lucide !== 'undefined') {
            lucide.createIcons({
                node: volumeBtn
            });
        }
        volumeSlider.value = isMuted ? 0 : vol;
    }

    // Collapse Toggle
    function setCollapsed(collapsed) {
        if (collapsed) {
            cardExpanded.classList.add('hidden');
            cardCollapsed.classList.remove('hidden');
            localStorage.setItem('music_collapsed', 'true');
        } else {
            cardExpanded.classList.remove('hidden');
            cardCollapsed.classList.add('hidden');
            localStorage.setItem('music_collapsed', 'false');
        }
    }

    // Switch Track function
    function loadTrack(index, playImmediately = false) {
        currentTrackIndex = index;
        localStorage.setItem('music_currentTrackIndex', index.toString());
        localStorage.setItem('music_currentTime', '0');

        audio.src = playlist[currentTrackIndex].src;
        audio.load();

        titleEl.textContent = playlist[currentTrackIndex].title;
        artistEl.textContent = playlist[currentTrackIndex].artist;
        coverImg.src = playlist[currentTrackIndex].cover;
        coverImgMini.src = playlist[currentTrackIndex].cover;
        coverImg.alt = playlist[currentTrackIndex].title;
        coverImgMini.alt = playlist[currentTrackIndex].title;

        progressBar.style.width = '0%';
        timeCurrent.textContent = '0:00';
        timeTotal.textContent = '0:00';

        renderPlaylistItems(); // refresh active highlight

        if (playImmediately) {
            audio.play().then(() => {
                updatePlayerUI(true);
                localStorage.setItem('music_playing', 'true');
            }).catch(e => {
                console.log("Failed to play switched track: ", e);
                updatePlayerUI(false);
            });
        } else {
            updatePlayerUI(false);
        }
    }

    // Next Track
    function nextTrack(playImmediately = true) {
        const nextIdx = (currentTrackIndex + 1) % playlist.length;
        loadTrack(nextIdx, playImmediately);
    }

    // Prev Track
    function prevTrack() {
        if (audio.currentTime > 3) {
            audio.currentTime = 0;
            localStorage.setItem('music_currentTime', '0');
        } else {
            const prevIdx = (currentTrackIndex - 1 + playlist.length) % playlist.length;
            loadTrack(prevIdx, true);
        }
    }

    // Render Playlist Drawer Items
    function renderPlaylistItems() {
        playlistList.innerHTML = '';
        playlist.forEach((track, idx) => {
            const item = document.createElement('div');
            const isActive = idx === currentTrackIndex;
            item.className = `flex items-center gap-2.5 p-2 rounded-xl cursor-pointer transition-all ${isActive ? 'bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800' : 'hover:bg-zinc-50 dark:hover:bg-zinc-900/40'}`;
            item.innerHTML = `
                <img src="${track.cover}" class="w-8 h-8 rounded object-cover shadow-sm ${isActive && !audio.paused ? 'animate-cd-rotate' : ''}">
                <div class="flex-grow min-w-0">
                    <p class="text-xs font-bold truncate ${isActive ? 'text-zinc-900 dark:text-white' : 'text-zinc-700 dark:text-zinc-300'}">${track.title}</p>
                    <p class="text-[10px] text-zinc-500 truncate">${track.artist}</p>
                </div>
                ${isActive && !audio.paused ? `
                    <div class="flex gap-[2px] items-end h-3">
                        <div class="w-[2px] bg-emerald-500 rounded-full sound-bar-1" style="height: 100%"></div>
                        <div class="w-[2px] bg-emerald-500 rounded-full sound-bar-2" style="height: 60%"></div>
                        <div class="w-[2px] bg-emerald-500 rounded-full sound-bar-3" style="height: 80%"></div>
                    </div>
                ` : ''}
            `;
            item.addEventListener('click', () => {
                if (idx === currentTrackIndex) {
                    togglePlay();
                } else {
                    loadTrack(idx, true);
                }
                playlistDrawer.classList.add('translate-y-full');
            });
            playlistList.appendChild(item);
        });
    }

    // LocalStorage State Restore
    const savedTime = parseFloat(localStorage.getItem('music_currentTime')) || 0;
    const savedVolume = localStorage.getItem('music_volume') !== null ? parseFloat(localStorage.getItem('music_volume')) : 0.8;
    const savedMuted = localStorage.getItem('music_muted') === 'true';
    const savedCollapsed = localStorage.getItem('music_collapsed') === 'true';
    const savedPlaying = localStorage.getItem('music_playing') === 'true';

    audio.volume = savedVolume;
    audio.muted = savedMuted;
    audio.currentTime = savedTime;

    updateVolumeUI();
    setCollapsed(savedCollapsed);
    renderPlaylistItems();

    // Metadata loaded (duration)
    audio.addEventListener('loadedmetadata', () => {
        timeTotal.textContent = formatTime(audio.duration);
    });

    // Time update (saves to localstorage and moves seekbar)
    audio.addEventListener('timeupdate', () => {
        if (!isNaN(audio.duration)) {
            const pct = (audio.currentTime / audio.duration) * 100;
            progressBar.style.width = `${pct}%`;
            timeCurrent.textContent = formatTime(audio.currentTime);
            localStorage.setItem('music_currentTime', audio.currentTime.toString());
        }
    });

    // Handle end of playback - autoplay next song!
    audio.addEventListener('ended', () => {
        nextTrack(true);
    });

    // Play/Pause Action
    function togglePlay() {
        if (audio.paused) {
            audio.play().then(() => {
                updatePlayerUI(true);
                localStorage.setItem('music_playing', 'true');
            }).catch(e => {
                console.log("Play failed: ", e);
            });
        } else {
            audio.pause();
            updatePlayerUI(false);
            localStorage.setItem('music_playing', 'false');
        }
    }

    playBtn.addEventListener('click', togglePlay);
    prevBtn.addEventListener('click', prevTrack);
    nextBtn.addEventListener('click', () => nextTrack(true));

    // Collapsed Badge
    cardCollapsed.addEventListener('click', () => setCollapsed(false));
    collapseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        setCollapsed(true);
        playlistDrawer.classList.add('translate-y-full');
    });

    // Playlist Drawer Trigger
    playlistToggleBtn.addEventListener('click', () => {
        renderPlaylistItems();
        playlistDrawer.classList.remove('translate-y-full');
    });
    playlistCloseBtn.addEventListener('click', () => {
        playlistDrawer.classList.add('translate-y-full');
    });

    // Seek Action
    progressContainer.addEventListener('click', (e) => {
        const rect = progressContainer.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        const pct = clickX / width;
        if (!isNaN(audio.duration)) {
            audio.currentTime = pct * audio.duration;
            progressBar.style.width = `${pct * 100}%`;
            timeCurrent.textContent = formatTime(audio.currentTime);
        }
    });

    // Volume Action
    volumeSlider.addEventListener('input', (e) => {
        const vol = parseFloat(e.target.value);
        audio.volume = vol;
        audio.muted = vol === 0;
        localStorage.setItem('music_volume', vol.toString());
        localStorage.setItem('music_muted', audio.muted.toString());
        updateVolumeUI();
    });

    volumeBtn.addEventListener('click', () => {
        audio.muted = !audio.muted;
        localStorage.setItem('music_muted', audio.muted.toString());
        updateVolumeUI();
    });

    // Autoplay handling / Resuming state
    if (savedPlaying) {
        audio.play().then(() => {
            updatePlayerUI(true);
        }).catch(err => {
            console.log("Autoplay blocked by browser. Listening for user gesture to resume.");
            updatePlayerUI(false);

            // Listen for first interaction to resume
            const resumeOnGesture = () => {
                audio.play().then(() => {
                    updatePlayerUI(true);
                    localStorage.setItem('music_playing', 'true');
                }).catch(e => console.log("Play gesture failed: ", e));
                document.removeEventListener('click', resumeOnGesture);
            };
            document.addEventListener('click', resumeOnGesture);
        });
    }

    // Set duration if already loaded immediately
    if (audio.readyState >= 1) {
        timeTotal.textContent = formatTime(audio.duration);
    }
}
