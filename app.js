let authMode = 'login'; 
let activeUser = ''; 
let isAdminUser = false;
let currentProvider = 'vak';
let selectedCountryCode = 'id';
let selectedCountryName = 'Indonesia';
let selectedCountryIso = 'id';
let selectedOperatorSlug = ''; 
let selectedOperatorLabel = 'ANY';
let liveCountryMap = {};
let curPriceStr = '0.009'; 
let curPriceNum = 0.009;
let activeIds = []; 
let currentPollingId = null; 
let isFetchingStatus = false;
let taskOrders = {}; 
let KURS_IDR = 17889;
let isDropdownOpen = false;
let lastServerBalanceUsd = 0;
let balanceCurrencyMode = 'USD'; // 'USD' atau 'IDR'
let currentTxFilter = 'all';
let currentOrderTab = 'all';
let selectedDepMethod = 'qris';
let currentOpenedOrder = null;

const DIAL_MAP = {
    '1':   { name: 'USA/Canada', iso: 'us' },
    '7':   { name: 'Kazakhstan/Russia', iso: 'ru' },
    '20':  { name: 'Egypt', iso: 'eg' },
    '27':  { name: 'South Africa', iso: 'za' },
    '30':  { name: 'Greece', iso: 'gr' },
    '31':  { name: 'Netherlands', iso: 'nl' },
    '32':  { name: 'Belgium', iso: 'be' },
    '33':  { name: 'France', iso: 'fr' },
    '34':  { name: 'Spain', iso: 'es' },
    '39':  { name: 'Italy', iso: 'it' },
    '40':  { name: 'Romania', iso: 'ro' },
    '44':  { name: 'United Kingdom', iso: 'gb' },
    '48':  { name: 'Poland', iso: 'pl' },
    '49':  { name: 'Germany', iso: 'de' },
    '52':  { name: 'Mexico', iso: 'mx' },
    '55':  { name: 'Brazil', iso: 'br' },
    '57':  { name: 'Colombia', iso: 'co' },
    '60':  { name: 'Malaysia', iso: 'my' },
    '62':  { name: 'Indonesia', iso: 'id' },
    '63':  { name: 'Philippines', iso: 'ph' },
    '65':  { name: 'Singapore', iso: 'sg' },
    '66':  { name: 'Thailand', iso: 'th' },
    '81':  { name: 'Japan', iso: 'jp' },
    '82':  { name: 'South Korea', iso: 'kr' },
    '84':  { name: 'Vietnam', iso: 'vn' },
    '86':  { name: 'China', iso: 'cn' },
    '90':  { name: 'Turkey', iso: 'tr' },
    '91':  { name: 'India', iso: 'in' },
    '92':  { name: 'Pakistan', iso: 'pk' },
    '94':  { name: 'Sri Lanka', iso: 'lk' },
    '95':  { name: 'Myanmar', iso: 'mm' },
    '212': { name: 'Morocco', iso: 'ma' },
    '213': { name: 'Algeria', iso: 'dz' },
    '216': { name: 'Tunisia', iso: 'tn' },
    '220': { name: 'Gambia', iso: 'gm' },
    '221': { name: 'Senegal', iso: 'sn' },
    '222': { name: 'Mauritania', iso: 'mr' },
    '223': { name: 'Mali', iso: 'ml' },
    '224': { name: 'Guinea', iso: 'gn' },
    '225': { name: 'Ivory Coast', iso: 'ci' },
    '226': { name: 'Burkina Faso', iso: 'bf' },
    '227': { name: 'Niger', iso: 'ne' },
    '228': { name: 'Togo', iso: 'tg' },
    '229': { name: 'Benin', iso: 'bj' },
    '231': { name: 'Liberia', iso: 'lr' },
    '232': { name: 'Sierra Leone', iso: 'sl' },
    '233': { name: 'Ghana', iso: 'gh' },
    '234': { name: 'Nigeria', iso: 'ng' },
    '237': { name: 'Cameroon', iso: 'cm' },
    '241': { name: 'Gabon', iso: 'ga' },
    '242': { name: 'Congo', iso: 'cg' },
    '243': { name: 'DR Congo', iso: 'cd' },
    '244': { name: 'Angola', iso: 'ao' },
    '250': { name: 'Rwanda', iso: 'rw' },
    '251': { name: 'Ethiopia', iso: 'et' },
    '252': { name: 'Somalia', iso: 'so' },
    '254': { name: 'Kenya', iso: 'ke' },
    '255': { name: 'Tanzania', iso: 'tz' },
    '256': { name: 'Uganda', iso: 'ug' },
    '257': { name: 'Burundi', iso: 'bi' },
    '258': { name: 'Mozambique', iso: 'mz' },
    '260': { name: 'Zambia', iso: 'zm' },
    '261': { name: 'Madagascar', iso: 'mg' },
    '263': { name: 'Zimbabwe', iso: 'zw' },
    '265': { name: 'Malawi', iso: 'mw' },
    '266': { name: 'Lesotho', iso: 'ls' },
    '267': { name: 'Botswana', iso: 'bw' },
    '374': { name: 'Armenia', iso: 'am' },
    '380': { name: 'Ukraine', iso: 'ua' },
    '382': { name: 'Montenegro', iso: 'me' },
    '855': { name: 'Cambodia', iso: 'kh' },
    '856': { name: 'Laos', iso: 'la' },
    '880': { name: 'Bangladesh', iso: 'bd' },
    '964': { name: 'Iraq', iso: 'iq' },
    '966': { name: 'Saudi Arabia', iso: 'sa' },
    '971': { name: 'UAE', iso: 'ae' },
    '977': { name: 'Nepal', iso: 'np' },
    '998': { name: 'Uzbekistan', iso: 'uz' }
};

const indoOperators = [
    { label: 'Any', slug: '', icon: 'fa-solid fa-chart-simple', type: 'any' },
    { label: 'Indosat', slug: 'indosat', file: 'indosat.png', type: 'logo', initial: 'I', col: 'bg-yellow-600' }
];

function getFlagImgHtml(isoCode, countryName, displayHeight = 20) {
    let iso = (isoCode || 'un').toLowerCase().trim();
    return `<img src="https://flagcdn.com/h20/${iso}.png" srcset="https://flagcdn.com/h40/${iso}.png 2x, https://flagcdn.com/h60/${iso}.png 3x" height="${displayHeight}" style="height:${displayHeight}px; width:auto; border-radius:3px; display:inline-block; vertical-align:middle; flex-shrink:0;" alt="" onerror="this.onerror=null;this.src='https://flagcdn.com/h20/un.png';">`;
}

function getIsoByName(ctry) {
    if (!ctry) return 'un';
    let n = ctry.toLowerCase().trim();
    if (n.includes('indo')) return 'id';
    if (n.includes('ivory') || n.includes('gading') || n.includes('ivoire')) return 'ci';
    if (n.includes('ukrain')) return 'ua';
    if (n.includes('cameroon') || n.includes('kamerun')) return 'cm';
    if (n.includes('madagascar') || n.includes('madagaskar')) return 'mg';
    if (n.includes('togo')) return 'tg';
    if (n.includes('tanzania')) return 'tz';
    if (n.includes('montenegro')) return 'me';
    if (n.includes('armenia')) return 'am';
    if (n.includes('lesotho')) return 'ls';
    if (n.includes('guinea')) return 'gn';
    if (n.includes('burkina')) return 'bf';
    if (n.includes('benin')) return 'bj';
    if (n.includes('liberia')) return 'lr';
    if (n.includes('ghana')) return 'gh';
    if (n.includes('nigeria')) return 'ng';
    if (n.includes('kenya')) return 'ke';
    if (n.includes('uganda')) return 'ug';
    if (n.includes('zambia')) return 'zm';
    if (n.includes('malawi')) return 'mw';
    if (n.includes('united kingdom') || n.includes('uk') || n.includes('inggris')) return 'gb';
    if (n.includes('usa') || n.includes('united states') || n.includes('amerika') || n.includes('canada')) return 'us';
    if (n.includes('russia') || n.includes('rusia')) return 'ru';
    if (n.includes('kazakhstan')) return 'kz';
    if (n.includes('philippine') || n.includes('filipina')) return 'ph';
    if (n.includes('vietnam')) return 'vn';
    if (n.includes('malaysia')) return 'my';
    if (n.includes('thailand')) return 'th';
    if (n.includes('brazil') || n.includes('brasil')) return 'br';
    if (n.includes('mexico') || n.includes('meksiko')) return 'mx';
    if (n.includes('egypt') || n.includes('mesir')) return 'eg';
    if (n.includes('colombia')) return 'co';
    for (let k in DIAL_MAP) {
        if (DIAL_MAP[k].name.toLowerCase() === n) return DIAL_MAP[k].iso;
    }
    return 'un';
}

function getFlagByName(ctry, h = 20) {
    let iso = getIsoByName(ctry);
    return getFlagImgHtml(iso, ctry, h);
}

fetch('https://open.er-api.com/v6/latest/USD').then(res => res.json()).then(data => { 
    if(data && data.rates && data.rates.IDR) {
        KURS_IDR = data.rates.IDR; 
        let dKurs = document.getElementById('dompetKursTxt');
        if(dKurs) dKurs.innerText = '$1.00 ≈ ' + formatRupiahOnly(1);
    }
}).catch(e => {});

setTimeout(() => { 
    initAppTheme();
    balanceCurrencyMode = TaskSmsBridge.getUserPref('balance_currency_mode', 'USD');
    TaskSmsBridge.checkSession(); 
}, 400);

function switchBottomTab(tab) {
    document.querySelectorAll('.view-pane').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.nav-item').forEach(el => {
        el.classList.remove('text-cyan-400');
        el.classList.add('text-slate-400');
    });

    let targetView = document.getElementById('view_' + tab);
    if(targetView) targetView.style.display = 'block';

    let targetNav = document.getElementById('nav_' + tab);
    if(targetNav) {
        targetNav.classList.remove('text-slate-400');
        targetNav.classList.add('text-cyan-400');
    }

    if (tab === 'beranda') {
        checkMemberBalanceState();
    } else if (tab === 'history') {
        renderOrdersTab();
    } else if (tab === 'dompet') {
        renderDompetTab();
    } else if (tab === 'profil') {
        renderProfilTab();
    }
}

// -------------------------------------------------------------
// SISTEM SALDO: MEMBER COINS VS ADMIN SERVER BALANCE
// -------------------------------------------------------------
function getMemberCoinBalance(user) {
    let u = user || activeUser;
    if (!u) return 0;
    let local = localStorage.getItem('member_coins_' + u);
    if (local !== null) return parseInt(local) || 0;
    return parseInt(TaskSmsBridge.getUserPref('my_coins', '0')) || 0;
}

function setMemberCoinBalance(user, amount) {
    let u = user || activeUser;
    if (!u) return;
    localStorage.setItem('member_coins_' + u, amount);
    if (u === activeUser) {
        TaskSmsBridge.saveUserPref('my_coins', String(amount));
    }
}

function deductMemberBalance(coinAmount) {
    if (isAdminUser) return;
    let cur = getMemberCoinBalance();
    let next = Math.max(0, cur - coinAmount);
    setMemberCoinBalance(activeUser, next);
    updateAllBalanceUI(lastServerBalanceUsd);
    checkMemberBalanceState();
}

function checkMemberBalanceState() {
    if (isAdminUser) return;
    let btn = document.getElementById('btnBuy');
    if (!btn) return;

    let memberCoins = getMemberCoinBalance();
    let orderCostCoins = Math.max(161, Math.round(curPriceNum * KURS_IDR));

    if (memberCoins <= 0 || memberCoins < orderCostCoins) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-wallet text-xs"></i> Saldo Koin Tidak Cukup (Isi Saldo)';
        btn.className = 'w-full py-3 rounded-xl bg-slate-800 text-slate-500 font-bold text-xs uppercase cursor-not-allowed shadow-none';
    } else {
        btn.disabled = false;
        btn.className = 'glow-btn w-full text-white font-black py-3 rounded-xl text-xs tracking-wider uppercase shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2';
        btn.innerHTML = '<i class="fa-solid fa-bolt text-xs"></i> Ambil Nomor Facebook Sekarang';
    }
}

function toggleBalanceCurrency() {
    if (!isAdminUser) {
        alert('Format saldo Anda adalah Koin Saldo (1 Koin = Rp 1).');
        return;
    }
    balanceCurrencyMode = (balanceCurrencyMode === 'USD') ? 'IDR' : 'USD';
    TaskSmsBridge.saveUserPref('balance_currency_mode', balanceCurrencyMode);
    
    updateAllBalanceUI(lastServerBalanceUsd);
    
    let hist = JSON.parse(TaskSmsBridge.getHistory() || '[]');
    renderDompetRecentActivity(hist);
    
    let txView = document.getElementById('subview_transactions');
    if (txView && txView.style.display !== 'none') {
        filterTransactionsView(currentTxFilter);
    }

    try { navigator.vibrate(35); } catch(e) {}
}

function updateAllBalanceUI(val) {
    let dompetBal = document.getElementById('dompetTotalBalanceTxt');
    let dompetSub = document.getElementById('dompetSubBalanceTxt');
    let profCoin = document.getElementById('profilCoinTxt');
    let bTitle = document.getElementById('dompetBalanceTitle');

    if (isAdminUser) {
        if (bTitle) bTitle.innerText = 'Saldo Server (Admin Master)';
        let rpVal = Math.round(val * KURS_IDR);
        let rpStr = 'Rp ' + rpVal.toLocaleString('id-ID');
        let usdStr = '$' + val.toFixed(3);

        if (balanceCurrencyMode === 'IDR') {
            if (dompetBal) dompetBal.innerText = rpStr;
            if (dompetSub) dompetSub.innerText = '~ ' + usdStr + ' (Ketuk Kurs untuk ganti)';
            if (profCoin) profCoin.innerText = rpStr;
        } else {
            if (dompetBal) dompetBal.innerText = usdStr;
            if (dompetSub) dompetSub.innerText = '~ ' + rpStr + ' (Ketuk Kurs untuk ganti)';
            if (profCoin) profCoin.innerText = usdStr;
        }
    } else {
        // MEMBER: SALDO SERVER HILANG TOTAL
        if (bTitle) bTitle.innerText = 'Saldo Koin Saya';
        let memberCoins = getMemberCoinBalance();
        let coinStr = memberCoins.toLocaleString('id-ID');

        if (dompetBal) dompetBal.innerText = coinStr;
        if (dompetSub) dompetSub.innerText = '~ Rp ' + coinStr;
        if (profCoin) profCoin.innerText = coinStr;
    }
}

function onGetMasterBalanceResult(res) {
    try {
        let d = JSON.parse(res);
        let val = parseFloat(d.balance !== undefined ? d.balance : d) || 0;
        lastServerBalanceUsd = val;
        updateAllBalanceUI(val);
        
        let hist = JSON.parse(TaskSmsBridge.getHistory() || '[]');
        renderDompetRecentActivity(hist);
    } catch(e) {}
}

function handleRefreshSaldo() {
    if (isAdminUser) {
        TaskSmsBridge.getMasterServerBalance();
    } else {
        updateAllBalanceUI(lastServerBalanceUsd);
        alert('Saldo koin Anda saat ini: ' + getMemberCoinBalance().toLocaleString('id-ID') + ' koin.');
    }
}

// -------------------------------------------------------------
// ACTION BUTTONS DOMPET (ADMIN = TRANSFER, MEMBER = DEPOSIT)
// -------------------------------------------------------------
function handleMainWalletAction() {
    if (isAdminUser) {
        openAdminTransferModal();
    } else {
        openDepositView();
    }
}

function handleFirstGridAction() {
    if (isAdminUser) {
        openAdminTransferModal();
    } else {
        openDepositView();
    }
}

function openAdminTransferModal() {
    let html = `
        <div class="space-y-3">
            <p class="text-[11px] text-slate-400 leading-relaxed">
                Kirim saldo koin ke akun member. Riwayat transfer akan langsung masuk ke riwayat deposit member:
            </p>
            <div>
                <label class="text-[10px] text-slate-400 font-bold uppercase">Username Member Tujuan</label>
                <input type="text" id="inpTransferUser" class="auth-input mt-1" placeholder="Contoh: member1">
            </div>
            <div>
                <label class="text-[10px] text-slate-400 font-bold uppercase">Jumlah Saldo Koin</label>
                <input type="number" id="inpTransferCoin" class="auth-input mt-1 font-mono" placeholder="Contoh: 10000">
            </div>
            <button onclick="submitAdminTransferAction()" class="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-xs active:scale-95 transition-all shadow-lg shadow-blue-500/20">
                Kirim Saldo Koin Sekarang
            </button>
        </div>
    `;
    showProfModal('<i class="fa-solid fa-paper-plane text-cyan-400"></i> Transfer Saldo Member', html);
}

function submitAdminTransferAction() {
    let target = (document.getElementById('inpTransferUser').value || '').trim();
    let amt = parseInt(document.getElementById('inpTransferCoin').value || '0') || 0;

    if (!target) return alert('Username member tujuan wajib diisi!');
    if (amt <= 0) return alert('Jumlah koin harus lebih dari 0!');

    // 1. Tambah saldo koin member
    let curBal = getMemberCoinBalance(target);
    let nextBal = curBal + amt;
    setMemberCoinBalance(target, nextBal);

    // 2. Catat otomatis ke History Deposit Member
    let targetDepHist = getUserDepositHistory(target);
    let dateObj = new Date();
    let dateStr = dateObj.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + 
                  dateObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    let codeHash = 'TRF-' + Math.random().toString(36).substring(2, 7).toUpperCase();

    targetDepHist.unshift({
        method: 'TRANSFER ADMIN',
        code: codeHash,
        date: dateStr,
        amount: amt
    });
    saveUserDepositHistory(target, targetDepHist);

    TaskSmsBridge.pushGlobalLog('Deposit', 'ID', '+' + amt.toLocaleString('id-ID') + ' Koin -> ' + target, 'ADMIN');
    closeProfModal();
    alert('Sukses! Berhasil transfer ' + amt.toLocaleString('id-ID') + ' koin ke member: ' + target + '. Telah masuk ke riwayat deposit member.');
}

// -------------------------------------------------------------
// HELPER STORAGE DEPOSIT PER USER (MURNI DARI NOL)
// -------------------------------------------------------------
function getUserDepositHistory(u) {
    let userKey = u || activeUser;
    if (!userKey) return [];
    let raw = localStorage.getItem('dep_hist_' + userKey);
    if (!raw) return [];
    try { return JSON.parse(raw); } catch(e) { return []; }
}

function saveUserDepositHistory(u, list) {
    let userKey = u || activeUser;
    if (!userKey) return;
    localStorage.setItem('dep_hist_' + userKey, JSON.stringify(list));
}

// -------------------------------------------------------------
// RENDER ORDERS TAB (MURNI DATA ASLI DARI NOL)
// -------------------------------------------------------------
function renderOrdersTab() {
    closeOrderDetailView();
    filterOrdersTab(currentOrderTab || 'all');
}

function filterOrdersTab(tab) {
    currentOrderTab = tab;
    ['all', 'active', 'completed', 'canceled'].forEach(t => {
        let btn = document.getElementById('orderTab' + t.charAt(0).toUpperCase() + t.slice(1));
        if (btn) {
            if (t === tab) {
                btn.className = 'flex-1 py-2 text-xs font-bold rounded-xl bg-blue-600 text-white shadow';
            } else {
                btn.className = 'flex-1 py-2 text-xs font-bold rounded-xl text-slate-400 hover:text-white';
            }
        }
    });

    let container = document.getElementById('ordersListContainer');
    if (!container) return;

    let allOrders = buildUnifiedOrdersList();

    if (tab === 'active') {
        let activeOrders = allOrders.filter(o => o.status === 'active');
        if (activeOrders.length === 0) {
            container.innerHTML = `
                <div class="text-center py-16 space-y-3">
                    <div class="w-16 h-16 rounded-3xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto text-2xl shadow-inner">
                        <i class="fa-solid fa-bag-shopping"></i>
                    </div>
                    <div class="text-base font-black text-white">No orders yet</div>
                    <div class="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                        Head to Home and pick a platform to get your first virtual number.
                    </div>
                </div>
            `;
            return;
        }
        container.innerHTML = activeOrders.map(o => renderOrderCardHtml(o)).join('');
        return;
    }

    let filtered = allOrders.filter(o => {
        if (tab === 'completed') return o.status === 'completed';
        if (tab === 'canceled') return o.status === 'canceled' || o.status === 'expired';
        return true;
    });

    if (filtered.length === 0) {
        container.innerHTML = '<div class="text-center text-slate-500 py-12 font-bold text-xs">Belum ada riwayat pesanan.</div>';
        return;
    }

    container.innerHTML = filtered.map(o => renderOrderCardHtml(o)).join('');
}

function buildUnifiedOrdersList() {
    let hist = JSON.parse(TaskSmsBridge.getHistory() || '[]');
    let list = [];

    // 1. Order yang sedang aktif di memory
    for (let id in taskOrders) {
        let to = taskOrders[id];
        let p = parseFloat(to.price || 0.009);
        let coinPrice = Math.max(161, Math.round(p * KURS_IDR));
        list.push({
            id: to.id,
            service: to.svc || 'Facebook',
            country: to.ctry || 'Indonesia',
            flag: '🇮🇩',
            carrier: to.opTag || 'ANY',
            phone: '+' + to.num,
            otp: to.otp || '----',
            sms: to.smsText || 'Menunggu SMS masuk...',
            date: to.timeStr ? ('Hari ini, ' + to.timeStr) : 'Baru Saja',
            status: 'active',
            coinPrice: coinPrice,
            usdPrice: p.toFixed(3)
        });
    }

    // 2. Order selesai dari database asli (TANPA MOCK DATA)
    if (hist && hist.length > 0) {
        hist.forEach((h, idx) => {
            let p = parseFloat(h.price || 0.009);
            let coinPrice = Math.max(161, Math.round(p * KURS_IDR));
            list.push({
                id: h.id || (17600000 + idx).toString(),
                service: h.svc || 'Facebook',
                country: h.ctry || 'Indonesia',
                flag: '🇮🇩',
                carrier: h.opTag || 'ANY',
                phone: '+' + h.num,
                otp: h.code || '----',
                sms: (h.svc || 'FB') + '-' + (h.code || '----') + ' adalah kode konfirmasi akun Anda',
                date: h.date || 'Baru Saja',
                status: 'completed',
                coinPrice: coinPrice,
                usdPrice: p.toFixed(3)
            });
        });
    }

    return list;
}

function renderOrderCardHtml(o) {
    let priceDisp = (balanceCurrencyMode === 'USD' && isAdminUser) ? `$${o.usdPrice}` : `🪙 ${o.coinPrice.toLocaleString('id-ID')}`;
    let isDana = (o.service.toLowerCase() === 'dana');
    let iconHtml = isDana
        ? `<div class="w-10 h-10 rounded-2xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center font-bold text-xs border border-cyan-500/30 shrink-0">DA</div>`
        : `<div class="w-10 h-10 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center text-lg border border-blue-500/30 shrink-0"><i class="fa-brands fa-facebook"></i></div>`;

    let statusHtml = '';
    if (o.status === 'completed') {
        statusHtml = `<span class="text-[10px] font-bold text-emerald-400 flex items-center gap-1"><i class="fa-solid fa-check text-[9px]"></i> Completed</span>`;
    } else if (o.status === 'expired') {
        statusHtml = `<span class="text-[10px] font-bold text-amber-400 flex items-center gap-1"><i class="fa-solid fa-clock text-[9px]"></i> Expired</span>`;
    } else if (o.status === 'canceled') {
        statusHtml = `<span class="text-[10px] font-bold text-rose-400 flex items-center gap-1"><i class="fa-solid fa-xmark text-[9px]"></i> Canceled</span>`;
    } else {
        statusHtml = `<span class="text-[10px] font-bold text-cyan-400 flex items-center gap-1 animate-pulse"><i class="fa-solid fa-arrows-rotate fa-spin text-[9px]"></i> Active</span>`;
    }

    let encodedObj = encodeURIComponent(JSON.stringify(o));

    return `
        <div onclick="openOrderDetail('${encodedObj}')" class="bg-[#0B101D] border border-slate-800/80 hover:border-slate-700 rounded-2xl p-3.5 shadow-sm space-y-2.5 cursor-pointer active:scale-[0.99] transition-all">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                    ${iconHtml}
                    <div>
                        <div class="text-xs font-bold text-white">${o.service}</div>
                        <div class="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <span>${o.flag}</span>
                            <span>${o.country}</span>
                            <span>•</span>
                            <span class="font-mono text-slate-300 font-medium">${o.phone}</span>
                        </div>
                    </div>
                </div>
                <div class="font-mono font-bold text-xs text-white">
                    ${priceDisp}
                </div>
            </div>
            
            <div class="pt-2 border-t border-slate-800/50 flex items-center justify-between text-[10px] text-slate-400">
                <div class="flex items-center gap-1.5">
                    <i class="fa-regular fa-calendar-days text-[11px]"></i>
                    <span>${o.date}</span>
                </div>
                <div>
                    ${statusHtml}
                </div>
            </div>
        </div>
    `;
}

function openOrderDetail(encodedObj) {
    try {
        let o = JSON.parse(decodeURIComponent(encodedObj));
        currentOpenedOrder = o;

        document.getElementById('detOrderIdHeader').innerText = 'Order #' + o.id;
        document.getElementById('detServiceTitle').innerText = o.service;
        document.getElementById('detCountryFlag').innerText = o.flag;
        document.getElementById('detCountryName').innerText = o.country;
        document.getElementById('detCarrierTag').innerText = o.carrier;
        
        let stBadge = document.getElementById('detStatusBadge');
        if (o.status === 'completed') {
            stBadge.innerText = 'Completed';
            stBadge.className = 'text-[10px] font-black uppercase text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2.5 py-1 rounded-lg';
        } else if (o.status === 'expired') {
            stBadge.innerText = 'Expired';
            stBadge.className = 'text-[10px] font-black uppercase text-amber-400 bg-amber-950/80 border border-amber-500/30 px-2.5 py-1 rounded-lg';
        } else if (o.status === 'canceled') {
            stBadge.innerText = 'Canceled';
            stBadge.className = 'text-[10px] font-black uppercase text-rose-400 bg-rose-950/80 border border-rose-500/30 px-2.5 py-1 rounded-lg';
        } else {
            stBadge.innerText = 'Active';
            stBadge.className = 'text-[10px] font-black uppercase text-cyan-400 bg-cyan-950/80 border border-cyan-500/30 px-2.5 py-1 rounded-lg';
        }

        document.getElementById('detPhoneNumber').innerText = o.phone;
        document.getElementById('detOtpCode').innerText = o.otp;
        document.getElementById('detSmsBody').innerText = o.sms;

        document.getElementById('detMetaService').innerText = o.service;
        document.getElementById('detMetaCountry').innerText = o.flag + ' ' + o.country;
        
        let priceDisp = (balanceCurrencyMode === 'USD' && isAdminUser) ? `$${o.usdPrice}` : `🪙 ${o.coinPrice.toLocaleString('id-ID')}`;
        document.getElementById('detMetaPrice').innerText = priceDisp;
        document.getElementById('detMetaCreated').innerText = o.date;

        let timeOnly = o.date.includes(',') ? o.date.split(',')[1].trim() : '17:55';
        document.getElementById('detMsgTime').innerText = timeOnly;
        document.getElementById('detMsgText').innerText = o.sms;

        document.getElementById('ordersListView').style.display = 'none';
        document.getElementById('orderDetailView').style.display = 'block';
    } catch(e) {}
}

function closeOrderDetailView() {
    let d = document.getElementById('orderDetailView');
    let l = document.getElementById('ordersListView');
    if (d) d.style.display = 'none';
    if (l) l.style.display = 'block';
}

function copyDetPhone() {
    if (currentOpenedOrder && currentOpenedOrder.phone) {
        TaskSmsBridge.copyToClipboard(currentOpenedOrder.phone, 'Nomor HP');
    }
}

function copyDetOtp() {
    if (currentOpenedOrder && currentOpenedOrder.otp) {
        TaskSmsBridge.copyToClipboard(currentOpenedOrder.otp, 'Kode OTP');
    }
}

// -------------------------------------------------------------
// NAVIGASI SUBVIEW DOMPET (TRANSACTIONS & DEPOSIT)
// -------------------------------------------------------------
function openTransactionsView() {
    document.querySelectorAll('.view-pane').forEach(el => el.style.display = 'none');
    let v = document.getElementById('subview_transactions');
    if (v) v.style.display = 'block';
    filterTransactionsView('all');
}

function openDepositView() {
    document.querySelectorAll('.view-pane').forEach(el => el.style.display = 'none');
    let v = document.getElementById('subview_deposit');
    if (v) v.style.display = 'block';
    renderDepositHistory();
}

function backToWalletMain() {
    document.querySelectorAll('.view-pane').forEach(el => el.style.display = 'none');
    let v = document.getElementById('view_dompet');
    if (v) v.style.display = 'block';
    renderDompetTab();
}

function filterTransactionsView(type) {
    currentTxFilter = type;
    ['all', 'credits', 'debits'].forEach(t => {
        let btn = document.getElementById('txFilter' + t.charAt(0).toUpperCase() + t.slice(1));
        if (btn) {
            if (t === type) {
                btn.className = 'flex-1 py-2 text-xs font-bold rounded-xl bg-blue-600 text-white shadow';
            } else {
                btn.className = 'flex-1 py-2 text-xs font-bold rounded-xl text-slate-400 hover:text-white';
            }
        }
    });

    let hist = JSON.parse(TaskSmsBridge.getHistory() || '[]');
    let container = document.getElementById('transactionsFullList');
    if (!container) return;

    let items = buildActualTransactionItems(hist);
    let filtered = items.filter(it => {
        if (type === 'credits') return it.type === 'refund';
        if (type === 'debits') return it.type === 'debit';
        return true;
    });

    if (filtered.length === 0) {
        container.innerHTML = '<div class="text-center text-slate-500 py-10 font-bold text-xs">Tidak ada mutasi transaksi pada kategori ini.</div>';
        return;
    }

    container.innerHTML = filtered.map(it => renderTransactionCardHtml(it)).join('');
}

function selectDepositMethod(method, el) {
    selectedDepMethod = method;
    document.querySelectorAll('.dep-method-item').forEach(item => {
        item.className = 'dep-method-item p-3 rounded-2xl border border-slate-800 bg-slate-900/60 flex items-center justify-between cursor-pointer active:scale-98 transition-all';
    });
    if (el) {
        el.className = 'dep-method-item active p-3 rounded-2xl border border-blue-500 bg-blue-500/10 flex items-center justify-between cursor-pointer active:scale-98 transition-all';
    }
}

function submitDepositAction() {
    let inp = document.getElementById('inpDepositAmount');
    let amt = parseInt(inp ? inp.value : 0) || 0;
    if (amt < 10000) return alert('Minimal deposit adalah Rp 10.000!');
    
    let depHist = getUserDepositHistory(activeUser);
    let dateObj = new Date();
    let dateStr = dateObj.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + 
                  dateObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    let codeHash = Math.random().toString(36).substring(2, 9) + '...';

    depHist.unshift({
        method: selectedDepMethod.toUpperCase(),
        code: codeHash,
        date: dateStr,
        amount: amt
    });

    saveUserDepositHistory(activeUser, depHist);
    if (inp) inp.value = '';

    alert('Deposit ' + selectedDepMethod.toUpperCase() + ' sebesar ' + amt.toLocaleString('id-ID') + ' koin berhasil dibuat! Silakan hubungi admin untuk konfirmasi pembayaran.');
    renderDepositHistory();
}

function renderDepositHistory() {
    let container = document.getElementById('depositHistoryList');
    if (!container) return;

    let depHist = getUserDepositHistory(activeUser);
    if (depHist.length === 0) {
        container.innerHTML = '<div class="text-center text-slate-500 py-8 font-bold text-xs">Belum ada riwayat deposit.</div>';
        return;
    }

    container.innerHTML = depHist.map(it => `
        <div class="bg-[#0B101D] border border-slate-800/80 rounded-2xl p-3.5 flex items-center justify-between">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm">
                    <i class="fa-solid fa-wallet"></i>
                </div>
                <div>
                    <div class="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>${it.method}</span>
                        <span class="text-[9px] text-slate-500 font-mono">${it.code}</span>
                    </div>
                    <div class="text-[10px] text-slate-400 mt-0.5">${it.date}</div>
                </div>
            </div>
            <div class="text-right">
                <div class="text-xs font-mono font-bold text-white">🪙 ${it.amount.toLocaleString('id-ID')}</div>
                <span class="inline-block mt-0.5 text-[9px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded-full">✓ Credited</span>
            </div>
        </div>
    `).join('');
}

// -------------------------------------------------------------
// RENDER DOMPET UTAMA (MURNI DATA ASLI DARI NOL)
// -------------------------------------------------------------
function renderDompetTab() {
    let hist = JSON.parse(TaskSmsBridge.getHistory() || '[]');
    balanceCurrencyMode = TaskSmsBridge.getUserPref('balance_currency_mode', 'USD');
    
    let actionBtnLabel = document.getElementById('dompetMainActionLabel');
    let actionBtnIcon = document.getElementById('dompetMainActionIcon');
    let gridActionLabel = document.getElementById('gridFirstActionLabel');
    let gridActionFa = document.getElementById('gridFirstActionFa');

    if (isAdminUser) {
        if (actionBtnLabel) actionBtnLabel.innerText = 'Transfer';
        if (actionBtnIcon) actionBtnIcon.className = 'fa-solid fa-paper-plane text-sm';
        if (gridActionLabel) gridActionLabel.innerText = 'Kirim Saldo';
        if (gridActionFa) gridActionFa.className = 'fa-solid fa-paper-plane';
        TaskSmsBridge.getMasterServerBalance();
    } else {
        if (actionBtnLabel) actionBtnLabel.innerText = 'Top up';
        if (actionBtnIcon) actionBtnIcon.className = 'fa-solid fa-circle-plus text-sm';
        if (gridActionLabel) gridActionLabel.innerText = 'Deposit';
        if (gridActionFa) gridActionFa.className = 'fa-solid fa-circle-plus';
    }

    updateAllBalanceUI(lastServerBalanceUsd);

    let dKurs = document.getElementById('dompetKursTxt');
    if(dKurs) {
        dKurs.innerText = '$1.00 ≈ ' + formatRupiahOnly(1);
    }

    renderDompetRecentActivity(hist);
}

function renderDompetRecentActivity(hist) {
    let container = document.getElementById('dompetRecentActivityList');
    if (!container) return;

    let items = buildActualTransactionItems(hist).slice(0, 8);
    if (items.length === 0) {
        container.innerHTML = '<div class="text-center text-slate-500 py-8 font-bold text-xs">Belum ada riwayat aktivitas transaksi.</div>';
        return;
    }
    container.innerHTML = items.map(it => renderTransactionCardHtml(it)).join('');
}

function buildActualTransactionItems(hist) {
    let items = [];
    let curBal = isAdminUser ? (lastServerBalanceUsd * KURS_IDR) : getMemberCoinBalance();

    if (hist && hist.length > 0) {
        hist.forEach((h) => {
            let p = parseFloat(h.price || 0.009);
            let costCoin = Math.max(161, Math.round(p * KURS_IDR));
            let costUsd = p.toFixed(3);

            items.push({
                type: 'debit',
                title: 'Order debit',
                sub: 'Order payment (' + (h.svc || 'Facebook') + ')',
                date: h.date || 'Baru Saja',
                coinCost: costCoin.toLocaleString('id-ID'),
                usdCost: costUsd,
                coinBalance: curBal.toLocaleString('id-ID'),
                usdBalance: (curBal / KURS_IDR).toFixed(3)
            });
        });
    }

    // Masukkan mutasi deposit transfer jika ada
    let depHist = getUserDepositHistory(activeUser);
    if (depHist && depHist.length > 0) {
        depHist.forEach(dh => {
            items.unshift({
                type: 'refund',
                title: 'Deposit saldo',
                sub: dh.method,
                date: dh.date,
                coinCost: dh.amount.toLocaleString('id-ID'),
                usdCost: (dh.amount / KURS_IDR).toFixed(3),
                coinBalance: curBal.toLocaleString('id-ID'),
                usdBalance: (curBal / KURS_IDR).toFixed(3)
            });
        });
    }

    return items;
}

function renderTransactionCardHtml(it) {
    let isCredit = (it.type === 'refund');
    let iconBox = isCredit 
        ? `<div class="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm shrink-0"><i class="fa-solid fa-check"></i></div>`
        : `<div class="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center text-sm shrink-0"><i class="fa-solid fa-arrow-up-right"></i></div>`;
    
    let amtColor = isCredit ? 'text-emerald-400' : 'text-rose-400';
    let sign = isCredit ? '+' : '-';

    let displayAmount = (balanceCurrencyMode === 'USD' && isAdminUser) 
        ? `${sign}$${it.usdCost}` 
        : `<span class="text-amber-300">🪙</span> ${sign}${it.coinCost}`;
        
    let displayBalance = (balanceCurrencyMode === 'USD' && isAdminUser) 
        ? `$${it.usdBalance}` 
        : `<span class="text-amber-300">🪙</span> ${it.coinBalance}`;

    return `
        <div class="bg-[#0B101D] border border-slate-800/80 rounded-2xl p-3.5 shadow-sm space-y-2.5">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                    ${iconBox}
                    <div>
                        <div class="text-xs font-bold text-white">${it.title}</div>
                        <div class="text-[10px] text-slate-400">${it.sub}</div>
                    </div>
                </div>
                <div class="font-mono font-bold text-xs ${amtColor}">
                    ${displayAmount}
                </div>
            </div>
            
            <div class="pt-2 border-t border-slate-800/50 flex items-center justify-between text-[10px] text-slate-400">
                <div class="flex items-center gap-1.5">
                    <i class="fa-regular fa-calendar-days text-[11px]"></i>
                    <span>${it.date}</span>
                </div>
                <div class="flex items-center gap-1.5 font-mono">
                    <i class="fa-solid fa-wallet text-[10px]"></i>
                    <span>Balance</span>
                    <span class="text-white font-bold">${displayBalance}</span>
                </div>
            </div>
        </div>
    `;
}

function renderProfilTab() {
    let hist = JSON.parse(TaskSmsBridge.getHistory() || '[]');
    let u = activeUser || 'user';
    let emailDisplay = u.includes('@') ? u : (u + '@gmail.com');
    let emailEl = document.getElementById('profilUsernameTxt');
    if (emailEl) emailEl.innerText = emailDisplay;

    let ordEl = document.getElementById('profilTotalOrdersCard');
    if (ordEl) ordEl.innerText = hist.length + ' Total Orders';

    updateAllBalanceUI(lastServerBalanceUsd);

    let pushState = TaskSmsBridge.getUserPref('push_notif_enabled', 'true');
    let sw = document.getElementById('pushNotifSwitch');
    if (sw) sw.checked = (pushState !== 'false');

    let curTheme = TaskSmsBridge.getUserPref('app_theme', 'system');
    let tTxt = document.getElementById('themeCurrentTxt');
    if(tTxt) {
        if(curTheme === 'light') tTxt.innerText = 'Siang (Light)';
        else if(curTheme === 'dark') tTxt.innerText = 'Malam (Dark)';
        else tTxt.innerText = 'System default';
    }
}

function showProfModal(title, htmlContent) {
    document.getElementById('profModalTitle').innerHTML = title;
    document.getElementById('profModalBody').innerHTML = htmlContent;
    document.getElementById('profActionModal').classList.remove('hidden');
}

function closeProfModal() {
    document.getElementById('profActionModal').classList.add('hidden');
}

function openAccountDetailModal() {
    let hist = JSON.parse(TaskSmsBridge.getHistory() || '[]');
    let roleName = isAdminUser ? 'OWNER / MASTER' : 'MEMBER';
    let saldoInfo = isAdminUser 
        ? `$${lastServerBalanceUsd.toFixed(3)} (${formatRupiahOnly(lastServerBalanceUsd)})`
        : `${getMemberCoinBalance().toLocaleString('id-ID')} Koin`;

    let html = `
        <div class="space-y-2.5">
            <div class="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1.5">
                <div class="flex justify-between items-center"><span class="text-slate-400">Username</span> <span class="font-bold text-white">${activeUser}</span></div>
                <div class="flex justify-between items-center"><span class="text-slate-400">Role</span> <span class="font-bold text-cyan-400">${roleName}</span></div>
                <div class="flex justify-between items-center"><span class="text-slate-400">${isAdminUser ? 'Saldo Server' : 'Saldo Koin'}</span> <span class="font-bold text-cyan-300 font-mono">${saldoInfo}</span></div>
                <div class="flex justify-between items-center"><span class="text-slate-400">Total Transaksi</span> <span class="font-bold text-emerald-400">${hist.length} Order</span></div>
            </div>
            <button onclick="TaskSmsBridge.copyToClipboard('${activeUser}', 'Username'); closeProfModal();" class="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl shadow flex items-center justify-center gap-2">
                <i class="fa-regular fa-copy"></i> Salin Username
            </button>
        </div>
    `;
    showProfModal('<i class="fa-solid fa-id-card text-blue-400"></i> Detail Akun Saya', html);
}

function openThemeModal() {
    let curTheme = TaskSmsBridge.getUserPref('app_theme', 'system');
    let html = `
        <div class="space-y-2">
            <p class="text-[11px] text-slate-400 mb-2">Pilih tema antarmuka aplikasi:</p>
            <div onclick="setAppTheme('system')" class="p-3 rounded-xl border ${curTheme === 'system' ? 'border-cyan-500 bg-cyan-500/10' : 'border-slate-800 bg-slate-900/60'} flex items-center justify-between cursor-pointer active:scale-98">
                <div class="flex items-center gap-2.5"><i class="fa-solid fa-circle-half-stroke text-blue-400 text-base"></i><span class="font-bold text-white">System default</span></div>
                ${curTheme === 'system' ? '<i class="fa-solid fa-check text-cyan-400"></i>' : ''}
            </div>
            <div onclick="setAppTheme('dark')" class="p-3 rounded-xl border ${curTheme === 'dark' ? 'border-cyan-500 bg-cyan-500/10' : 'border-slate-800 bg-slate-900/60'} flex items-center justify-between cursor-pointer active:scale-98">
                <div class="flex items-center gap-2.5"><i class="fa-solid fa-moon text-indigo-400 text-base"></i><span class="font-bold text-white">Malam (Dark Mode)</span></div>
                ${curTheme === 'dark' ? '<i class="fa-solid fa-check text-cyan-400"></i>' : ''}
            </div>
            <div onclick="setAppTheme('light')" class="p-3 rounded-xl border ${curTheme === 'light' ? 'border-cyan-500 bg-cyan-500/10' : 'border-slate-800 bg-slate-900/60'} flex items-center justify-between cursor-pointer active:scale-98">
                <div class="flex items-center gap-2.5"><i class="fa-solid fa-sun text-amber-400 text-base"></i><span class="font-bold text-white">Siang (Light Mode)</span></div>
                ${curTheme === 'light' ? '<i class="fa-solid fa-check text-cyan-400"></i>' : ''}
            </div>
        </div>
    `;
    showProfModal('<i class="fa-solid fa-palette text-cyan-400"></i> Pilih Tema Tampilan', html);
}

function setAppTheme(themeName) {
    TaskSmsBridge.saveUserPref('app_theme', themeName);
    applyTheme(themeName);
    closeProfModal();
    renderProfilTab();
}

function initAppTheme() {
    let saved = TaskSmsBridge.getUserPref('app_theme', 'system');
    applyTheme(saved);
}

function applyTheme(themeName) {
    document.body.classList.remove('theme-light');
    if (themeName === 'light') {
        document.body.classList.add('theme-light');
    } else if (themeName === 'system') {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            document.body.classList.add('theme-light');
        }
    }
}

function togglePushNotifSetting(isEnabled) {
    TaskSmsBridge.saveUserPref('push_notif_enabled', isEnabled ? 'true' : 'false');
    TaskSmsBridge.copyToClipboard(isEnabled ? 'ON' : 'OFF', 'Push Notif');
}

function openSupportModal() {
    let html = `
        <div class="space-y-3">
            <p class="text-[11px] text-slate-400 leading-relaxed">Butuh bantuan transaksi nomor Facebook atau isi ulang saldo koin? Hubungi kontak resmi di bawah ini:</p>
            <div class="space-y-2">
                <div onclick="TaskSmsBridge.copyToClipboard('@TaskSmsSupport', 'Telegram Support'); closeProfModal();" class="bg-blue-600/20 border border-blue-500/40 p-3 rounded-xl flex items-center justify-between cursor-pointer active:scale-98">
                    <div class="flex items-center gap-3">
                        <i class="fa-brands fa-telegram text-blue-400 text-xl"></i>
                        <div><div class="font-bold text-white text-xs">Telegram Support</div><div class="text-[10px] text-slate-400">@TaskSmsSupport</div></div>
                    </div>
                    <span class="text-cyan-400 font-bold text-xs"><i class="fa-regular fa-copy"></i></span>
                </div>
            </div>
        </div>
    `;
    showProfModal('<i class="fa-solid fa-headset text-amber-400"></i> Bantuan & Layanan', html);
}

function openNotifModal() {
    let html = `
        <div class="space-y-3">
            <p class="text-[11px] text-slate-400 leading-relaxed">Notifikasi real-time aktif untuk membaca kode OTP Facebook yang masuk ke statusbar Anda.</p>
            <button onclick="testNotificationFire()" class="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 active:scale-95 transition-all">
                <i class="fa-solid fa-bell"></i> Tes Bunyi Notifikasi OTP
            </button>
        </div>
    `;
    showProfModal('<i class="fa-solid fa-bell text-blue-400"></i> Notifikasi Sistem', html);
}

function testNotificationFire() {
    closeProfModal();
    TaskSmsBridge.showOtpNotification("748291", "FB-748291 adalah kode konfirmasi Facebook Anda (Pesan Uji Coba)");
}

function openPasswordModal() {
    let html = `
        <div class="space-y-3">
            <p class="text-[11px] text-slate-400">Masukkan password baru untuk akun <b>${activeUser}</b>:</p>
            <input type="password" id="inpNewPassword" class="auth-input mb-2" placeholder="Password Baru">
            <input type="password" id="inpConfirmPassword" class="auth-input" placeholder="Konfirmasi Password Baru">
            <button onclick="saveNewPasswordAction()" class="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 rounded-xl text-xs active:scale-95 transition-all">
                Perbarui Password
            </button>
        </div>
    `;
    showProfModal('<i class="fa-solid fa-lock text-purple-400"></i> Ganti Password Akun', html);
}

function saveNewPasswordAction() {
    let p1 = document.getElementById('inpNewPassword').value.trim();
    let p2 = document.getElementById('inpConfirmPassword').value.trim();
    if(!p1 || !p2) return alert('Semua kolom wajib diisi!');
    if(p1 !== p2) return alert('Konfirmasi password tidak cocok!');
    if(p1.length < 4) return alert('Password minimal 4 karakter!');
    
    TaskSmsBridge.saveUserPref('custom_pass', p1);
    alert('Password akun berhasil diperbarui secara lokal!');
    closeProfModal();
}

function openWebhookModal() {
    let savedHook = TaskSmsBridge.getUserPref('webhook_url', '');
    let html = `
        <div class="space-y-3">
            <p class="text-[11px] text-slate-400 leading-relaxed">Teruskan otomatis setiap SMS/OTP yang didapat ke URL endpoint Webhook:</p>
            <input type="url" id="inpWebhookUrl" value="${savedHook}" class="auth-input font-mono text-xs" placeholder="https://your-domain.com/webhook">
            <div class="flex gap-2">
                <button onclick="saveWebhookAction()" class="flex-1 bg-teal-600 hover:bg-teal-500 text-white font-bold py-2.5 rounded-xl text-xs active:scale-95 transition-all">
                    Simpan URL
                </button>
            </div>
        </div>
    `;
    showProfModal('<i class="fa-solid fa-link text-teal-400"></i> Webhook Forwarder', html);
}

function saveWebhookAction() {
    let u = document.getElementById('inpWebhookUrl').value.trim();
    TaskSmsBridge.saveUserPref('webhook_url', u);
    alert('URL Webhook berhasil disimpan!');
    closeProfModal();
}

function openApiTokenModal() {
    let fakeToken = 'tk_' + (activeUser || 'user') + '_live_' + Math.abs(activeUser.split('').reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0));
    let html = `
        <div class="space-y-3">
            <p class="text-[11px] text-slate-400">Gunakan API Token ini untuk integrasi via script eksternal atau bot:</p>
            <div class="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                <div class="text-[9px] text-slate-500 uppercase font-bold">API Soft Identifier</div>
                <div class="text-xs font-mono font-bold text-white mt-0.5">TASKSMS_PRO</div>
            </div>
            <div class="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                <div class="text-[9px] text-slate-500 uppercase font-bold">Secret Access Key</div>
                <div class="text-xs font-mono text-cyan-400 mt-0.5 break-all" id="dispSecretToken">${fakeToken}</div>
            </div>
            <button onclick="TaskSmsBridge.copyToClipboard('${fakeToken}', 'API Token'); closeProfModal();" class="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-2.5 rounded-xl text-xs active:scale-95 transition-all flex items-center justify-center gap-2">
                <i class="fa-regular fa-copy"></i> Salin Token API
            </button>
        </div>
    `;
    showProfModal('<i class="fa-solid fa-key text-amber-400"></i> Kunci API Pengembang', html);
}

function openSignoutEverywhereModal() {
    let html = `
        <div class="space-y-3">
            <p class="text-[11px] text-slate-400 leading-relaxed">Tindakan ini akan mencabut seluruh sesi login akun <b>${activeUser}</b> di perangkat lain.</p>
            <button onclick="closeProfModal(); TaskSmsBridge.doLogout();" class="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-2.5 rounded-xl text-xs active:scale-95 transition-all">
                Ya, Keluar Dari Semua Sesi
            </button>
        </div>
    `;
    showProfModal('<i class="fa-solid fa-mobile-screen-button text-rose-400"></i> Sign Out Everywhere', html);
}

function openDeleteAccountModal() {
    let html = `
        <div class="space-y-3">
            <p class="text-[11px] text-rose-300 leading-relaxed font-bold">Peringatan: Penghapusan akun akan membersihkan seluruh data riwayat SMS.</p>
            <p class="text-[10px] text-slate-400">Ketik username Anda (<b>${activeUser}</b>) untuk konfirmasi:</p>
            <input type="text" id="inpConfirmDelete" class="auth-input font-mono text-xs" placeholder="Ketik username Anda">
            <button onclick="processDeleteAccountAction()" class="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-2.5 rounded-xl text-xs active:scale-95 transition-all">
                Hapus Akun Permanen
            </button>
        </div>
    `;
    showProfModal('<i class="fa-regular fa-trash-can text-rose-400"></i> Hapus Akun', html);
}

function processDeleteAccountAction() {
    let val = (document.getElementById('inpConfirmDelete').value || '').trim();
    if(val !== activeUser) return alert('Username yang Anda masukkan tidak cocok!');
    closeProfModal();
    alert('Akun telah dinonaktifkan.');
    TaskSmsBridge.doLogout();
}

function toggleCountryDropdown() {
    let menu = document.getElementById('countryDropdownMenu');
    let chev = document.getElementById('dropdownChevron');
    isDropdownOpen = !isDropdownOpen;
    if (isDropdownOpen) {
        menu.classList.remove('hidden');
        chev.style.transform = 'rotate(180deg)';
        document.getElementById('countrySearchInput').focus();
    } else {
        closeCountryDropdown();
    }
}

function closeCountryDropdown() {
    isDropdownOpen = false;
    let menu = document.getElementById('countryDropdownMenu');
    let chev = document.getElementById('dropdownChevron');
    if (menu) menu.classList.add('hidden');
    if (chev) chev.style.transform = 'rotate(0deg)';
}

function filterCountriesList() {
    let q = (document.getElementById('countrySearchInput').value || '').toLowerCase().trim();
    let items = document.querySelectorAll('.country-option');
    items.forEach(el => {
        let filterStr = el.getAttribute('data-filter') || el.innerText.toLowerCase();
        if (filterStr.includes(q)) {
            el.style.display = 'flex';
        } else {
            el.style.display = 'none';
        }
    });
}

function parseSafeResponse(res) {
    if (typeof res === 'object' && res !== null) return res;
    if (typeof res === 'string') {
        try { return JSON.parse(res); } catch(e) {}
        try { return JSON.parse(decodeURIComponent(escape(atob(res)))); } catch(e) {}
    }
    return {};
}

function extractOtpList(d) {
    if (!d) return [];
    if (Array.isArray(d)) return d;
    if (Array.isArray(d.data)) return d.data;
    if (d.data && typeof d.data === 'object') {
        if (Array.isArray(d.data.otps)) return d.data.otps;
        if (Array.isArray(d.data.list)) return d.data.list;
        if (Array.isArray(d.data.data)) return d.data.data;
        if (Array.isArray(d.data.items)) return d.data.items;
        if (Array.isArray(d.data.records)) return d.data.records;
        if (Array.isArray(d.data.history)) return d.data.history;
        if (Array.isArray(d.data.success)) return d.data.success;
        for (let k in d.data) {
            if (Array.isArray(d.data[k])) return d.data[k];
        }
    }
    for (let k in d) {
        if (Array.isArray(d[k])) return d[k];
    }
    return [];
}

function detectCountryFromRange(r) {
    let num = String(r).replace(/[^0-9]/g, '');
    if (num.length >= 3 && DIAL_MAP[num.substring(0, 3)]) {
        let d = DIAL_MAP[num.substring(0, 3)];
        return { code: num.substring(0, 3), name: d.name, iso: d.iso };
    }
    if (num.length >= 2 && DIAL_MAP[num.substring(0, 2)]) {
        let d = DIAL_MAP[num.substring(0, 2)];
        return { code: num.substring(0, 2), name: d.name, iso: d.iso };
    }
    if (num.length >= 1 && DIAL_MAP[num.substring(0, 1)]) {
        let d = DIAL_MAP[num.substring(0, 1)];
        return { code: num.substring(0, 1), name: d.name, iso: d.iso };
    }
    let fallbackCode = num.substring(0, 3) || '999';
    return { code: fallbackCode, name: 'Country +' + fallbackCode, iso: 'un' };
}

setInterval(() => {
    let now = Date.now();
    for (let id in taskOrders) {
        let o = taskOrders[id];
        let elapsed = Math.floor((now - o.created) / 1000);
        let rem = Math.max(0, 1200 - elapsed);
        let m = Math.floor(rem / 60).toString().padStart(2, '0');
        let s = (rem % 60).toString().padStart(2, '0');
        let timerEl = document.getElementById('timer_' + id);
        if (timerEl && rem > 0) timerEl.innerText = '(' + m + ':' + s + ')';
    }
}, 1000);

setInterval(() => {
    let orderKeys = Object.keys(taskOrders);
    if (orderKeys.length > 0) {
        TaskSmsBridge.fetchWorkerData();
        let hasWealthOrder = false;
        for(let k in taskOrders) { if(taskOrders[k].provider === 'wealthora') hasWealthOrder = true; }
        if (hasWealthOrder) {
            TaskSmsBridge.getWealthSuccessOtp();
            TaskSmsBridge.getWealthConsole();
        }
        if (activeIds.length > 0 && !isFetchingStatus) {
            currentPollingId = activeIds.shift();
            activeIds.push(currentPollingId);
            if(taskOrders[currentPollingId] && taskOrders[currentPollingId].provider !== 'wealthora') {
                isFetchingStatus = true;
                TaskSmsBridge.getSmsCode(currentPollingId);
            }
        }
    }
}, 2000);

function onWorkerDataResult(res) {
    try {
        let list = JSON.parse(res);
        if (!Array.isArray(list) || list.length === 0) return;
        list.forEach(item => {
            let targetId = String(item.idNum);
            let ord = taskOrders[targetId];
            if (!ord) {
                for (let id in taskOrders) {
                    if (String(item.tel).includes(String(taskOrders[id].num))) { ord = taskOrders[id]; targetId = id; break; }
                }
            }
            if (ord && item.smsCode) {
                applyReceivedSms(targetId, String(item.smsCode).trim(), item.smsText || ('Kode: ' + item.smsCode));
            }
        });
    } catch(e) {}
}

function onGetSmsCodeResult(res) {
    let id = currentPollingId; isFetchingStatus = false; if(!id) return;
    try {
        let d = JSON.parse(res);
        if (d && (d.smsCode || d.code)) {
            let raw = d.smsCode || d.code;
            let code = Array.isArray(raw) ? String(raw[raw.length - 1]).trim() : String(raw).trim();
            let fullText = d.smsText || ('FB-' + code + ' adalah kode konfirmasi Facebook Anda');
            applyReceivedSms(id, code, fullText);
        }
    } catch(e) {}
}

function onWealthSuccessOtpResult(res) {
    try {
        let d = parseSafeResponse(res);
        let list = extractOtpList(d);
        if (list.length === 0) return;

        list.forEach(item => {
            if (!item) return;
            let rawApiNum = String(item.number || item.num || item.full_number || item.national_number || item.tel || item.phone || item.cli || item.msisdn || item.mobile || '').replace(/[^0-9]/g, '');
            let code = String(item.otp || item.code || item.sms_code || item.pin || item.key || item.val || '').trim();
            let text = item.message || item.sms || item.sms_text || item.text || ('Kode Facebook: ' + code);

            if (!code && text) {
                let match = text.match(/\b\d{4,8}\b/);
                if (match) code = match[0];
            }
            if (!code) return;

            for (let id in taskOrders) {
                let localNum = String(taskOrders[id].num).replace(/[^0-9]/g, '');
                if (rawApiNum && localNum) {
                    if (rawApiNum === localNum || rawApiNum.endsWith(localNum) || localNum.endsWith(rawApiNum) || rawApiNum.includes(localNum) || localNum.includes(rawApiNum)) {
                        applyReceivedSms(id, code, text);
                    }
                }
            }
        });
    } catch(e) {}
}

function applyReceivedSms(id, code, fullText) {
    if (!code || code === 'null' || code === '----') return;
    let ord = taskOrders[id]; if (!ord) return;
    let otpBox = document.getElementById('otp_' + id);
    let smsTextBox = document.getElementById('smsText_' + id);
    let badge = document.getElementById('badge_' + id);
    let copyBtn = document.getElementById('copy_otp_btn_' + id);

    if (ord.smsCount === 0 || ord.otp !== code) {
        ord.smsCount += 1;
        ord.otp = code;
        ord.smsText = fullText;
        persistOrders();

        if (otpBox) otpBox.innerText = code;
        if (smsTextBox) smsTextBox.innerText = fullText;
        if (badge) { badge.innerText = 'OTP RECEIVED'; badge.className = 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 text-[9px] font-black px-2 py-0.5 rounded'; }
        if (copyBtn) copyBtn.classList.remove('opacity-30');
        let btnF = document.getElementById('btnFinish_' + id); if (btnF) btnF.style.display = 'block';

        TaskSmsBridge.copyToClipboard(code, 'Kode OTP FB');
        try { navigator.vibrate([150, 80, 150]); } catch(e){}
        try { TaskSmsBridge.showOtpNotification(code, fullText); } catch(e){}

        saveToTaskHistory('Facebook', ord.ctry, ord.num, code, ord.price, id, ord.opTag);
        TaskSmsBridge.pushGlobalLog('Facebook', ord.ctry, '+' + ord.num, id);

        if (ord.provider === 'vak' && !ord.autoRequestedSecond) {
            ord.autoRequestedSecond = true;
            persistOrders();
            setTimeout(() => { TaskSmsBridge.setStatus(id, 'send'); }, 1500);
        }
    }
}

function persistOrders() { TaskSmsBridge.saveActiveOrders(JSON.stringify(taskOrders)); }

function restoreOrdersFromStorage() {
    try {
        let raw = TaskSmsBridge.loadActiveOrders();
        let data = JSON.parse(raw || '{}');
        taskOrders = data;
        document.getElementById('activeOrders').innerHTML = '';
        let now = Date.now();
        for (let id in taskOrders) {
            let o = taskOrders[id];
            let elapsed = Math.floor((now - o.created) / 1000);
            if (elapsed < 1200 || o.otp) {
                renderOrderCardUI(o.id, o.num, o.price, o.opTag, o.otp, o.smsText, o.timeStr, false, o.provider);
                if (!activeIds.includes(o.id)) activeIds.push(o.id);
            } else { delete taskOrders[id]; }
        }
        persistOrders();
    } catch(e) {}
}

function formatRupiahOnly(valUsd) {
    let u = parseFloat(valUsd) || 0;
    let rp = Math.round(u * KURS_IDR);
    return 'Rp ' + rp.toLocaleString('id-ID');
}

function onWealthLiveAccessResult(res) {
    try {
        let d = parseSafeResponse(res);
        let servicesList = (d.data && d.data.services) ? d.data.services : (d.services || []);
        if (Array.isArray(servicesList) && servicesList.length > 0) {
            let fbService = servicesList.find(s => String(s.sid || '').toUpperCase() === 'FACEBOOK') || servicesList[0];
            if (fbService && Array.isArray(fbService.ranges) && fbService.ranges.length > 0) {
                parseAndRenderLiveCountries(fbService.ranges);
            }
        }
    } catch(e) {}
}

function parseAndRenderLiveCountries(ranges) {
    liveCountryMap = {};
    ranges.forEach(r => {
        let info = detectCountryFromRange(r);
        if (!liveCountryMap[info.code]) {
            liveCountryMap[info.code] = { name: info.name, iso: info.iso, code: info.code, ranges: [] };
        }
        liveCountryMap[info.code].ranges.push(r);
    });

    let container = document.getElementById('dynamicLiveCountries');
    let codes = Object.keys(liveCountryMap);
    document.getElementById('totalCountriesTxt').innerText = codes.length + 1;
    let html = '';

    codes.forEach(code => {
        let item = liveCountryMap[code];
        let isActive = (selectedCountryCode === code) ? 'active' : '';
        html += `<div class="country-option ${isActive} p-2.5 rounded-xl border border-slate-800/80 bg-slate-900/60 flex items-center justify-between" id="card_ctry_${code}" onclick="selectLiveCountry('${code}')" data-filter="${item.name.toLowerCase()} +${code} ${item.iso}">` +
            `<div class="flex items-center gap-2.5">` +
                getFlagImgHtml(item.iso, item.name, 20) +
                `<div><div class="text-xs font-bold text-slate-200">${item.name} <span class="text-[10px] text-slate-400 font-mono">(+${code})</span></div></div>` +
            `</div>` +
            `<div class="text-right">` +
                `<div class="text-xs font-black text-emerald-400"><i class="fa-solid fa-infinity"></i></div>` +
                `<div class="text-[9px] font-mono text-cyan-400 font-medium">Ready</div>` +
            `</div>` +
        `</div>`;
    });
    container.innerHTML = html;
}

function selectCountryId() {
    selectedCountryCode = 'id';
    selectedCountryName = 'Indonesia';
    selectedCountryIso = 'id';
    currentProvider = 'vak';
    
    document.querySelectorAll('.country-option').forEach(c => c.classList.remove('active'));
    let cardEl = document.getElementById('card_ctry_id');
    if(cardEl) cardEl.classList.add('active');

    document.getElementById('selDropdownFlag').innerHTML = getFlagImgHtml('id', 'Indonesia', 20);
    document.getElementById('selDropdownTitle').innerHTML = 'Indonesia <span class="text-[10px] text-slate-400 font-mono">(+62)</span>';
    document.getElementById('selDropdownSub').innerText = 'VAK-SMS • Fast Active';
    document.getElementById('selDropdownBadge').innerText = 'Ready';
    document.getElementById('selDropdownBadge').className = 'text-[9px] font-mono font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded';

    closeCountryDropdown();

    document.getElementById('operatorSection').style.display = 'block';
    document.getElementById('selPriceLabelTxt').innerText = 'HARGA ($ / RP)';
    document.getElementById('selProviderBadge').innerHTML = '$' + curPriceNum.toFixed(3) + ' <span class="text-[11px] text-slate-300">(' + formatRupiahOnly(curPriceNum) + ')</span>';
    document.getElementById('selTargetTxt').innerHTML = `${getFlagImgHtml('id', 'Indonesia', 18)} <span>Indonesia</span> <span class="text-[10px] bg-slate-800 text-cyan-400 px-1.5 py-0.5 rounded border border-slate-700 uppercase font-mono">${selectedOperatorLabel}</span>`;
    queryRealtimeStockVak();
}

function selectLiveCountry(code) {
    let item = liveCountryMap[code]; if(!item) return;
    selectedCountryCode = code;
    selectedCountryName = item.name;
    selectedCountryIso = item.iso;
    currentProvider = 'wealthora';

    document.querySelectorAll('.country-option').forEach(c => c.classList.remove('active'));
    let cardEl = document.getElementById('card_ctry_' + code);
    if(cardEl) cardEl.classList.add('active');

    document.getElementById('selDropdownFlag').innerHTML = getFlagImgHtml(item.iso, item.name, 20);
    document.getElementById('selDropdownTitle').innerHTML = `${item.name} <span class="text-[10px] text-slate-400 font-mono">(+${code})</span>`;
    document.getElementById('selDropdownSub').innerText = 'StexSMS Pool Active';
    document.getElementById('selDropdownBadge').innerText = 'Free';
    document.getElementById('selDropdownBadge').className = 'text-[9px] font-mono font-bold text-cyan-400 bg-cyan-950/80 border border-cyan-500/30 px-2 py-0.5 rounded';

    closeCountryDropdown();

    document.getElementById('operatorSection').style.display = 'none';
    document.getElementById('selPriceLabelTxt').innerText = 'BIAYA ALOKASI';
    document.getElementById('selProviderBadge').innerHTML = '<span class="text-emerald-400 font-black"><i class="fa-solid fa-infinity text-xs mr-1"></i>Free</span>';
    document.getElementById('selTargetTxt').innerHTML = `${getFlagImgHtml(item.iso, item.name, 18)} <span>${item.name}</span> <span class="text-[10px] bg-slate-800 text-emerald-400 px-1.5 py-0.5 rounded border border-slate-700 uppercase font-mono">+${code}</span>`;
    document.getElementById('selRealtimeStock').innerHTML = `<span class="text-emerald-400 font-bold"><i class="fa-solid fa-circle-check mr-1"></i>Pool Ready</span>`;

    checkMemberBalanceState();
}

function onServiceFbClick() {
    let badge = document.getElementById('fbStatusBadge');
    if (badge) {
        badge.innerHTML = '<i class="fa-solid fa-arrows-rotate fa-spin mr-1"></i>REFRESH';
        badge.className = 'text-[10px] font-black uppercase text-cyan-400 bg-cyan-950/80 border border-cyan-500/30 px-2 py-1 rounded-md transition-all';
        setTimeout(() => {
            badge.innerHTML = 'AKTIF';
            badge.className = 'text-[10px] font-black uppercase text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2 py-1 rounded-md transition-all';
        }, 600);
    }
    queryRealtimeStockVak();
    TaskSmsBridge.getWealthLiveAccess();
}

function renderOperatorButtons() {
    let grid = document.getElementById('operatorGrid');
    let savedOp = TaskSmsBridge.getUserPref('operator_slug', '');
    selectedOperatorSlug = savedOp;
    let html = '';
    indoOperators.forEach(op => {
        let isActive = (savedOp === op.slug) ? 'active' : '';
        if (!savedOp && op.slug === '') isActive = 'active';
        let innerContent = '';
        if (op.type === 'any') {
            innerContent = `<i class="${op.icon} text-slate-300 text-xs"></i><span class="text-xs font-bold text-slate-200">Any</span>`;
        } else if (op.type === 'logo') {
            innerContent = `<img src="${op.file}" class="h-4 max-h-[16px] w-auto max-w-[65px] object-contain" onerror="this.outerHTML='<span class=\\'w-4.5 h-4.5 rounded-full ${op.col} text-white font-black text-[10px] flex items-center justify-center flex-shrink-0\\'>${op.initial}</span><span class=\\'text-xs font-bold text-slate-200\\'>${op.label}</span>'">`;
        }
        html += `<div class="op-pill ${isActive}" onclick="selectOperator('${op.slug}', '${op.label}', this)">${innerContent}</div>`;
    });
    grid.innerHTML = html;
}

function selectOperator(slug, label, el) {
    selectedOperatorSlug = slug;
    selectedOperatorLabel = label;
    TaskSmsBridge.saveUserPref('operator_slug', slug);
    document.querySelectorAll('.op-pill').forEach(p => p.classList.remove('active'));
    if(el) el.classList.add('active');
    if(selectedCountryCode === 'id') {
        document.getElementById('selTargetTxt').innerHTML = `${getFlagImgHtml('id', 'Indonesia', 18)} <span>Indonesia</span> <span class="text-[10px] bg-slate-800 text-cyan-400 px-1.5 py-0.5 rounded border border-slate-700 uppercase font-mono">${label}</span>`;
        queryRealtimeStockVak();
    }
}

function queryRealtimeStockVak() {
    if (selectedCountryCode !== 'id') return;
    TaskSmsBridge.getCountNumber('fb', 'id', selectedOperatorSlug);
}

function onGetCountNumberResult(res) {
    if (selectedCountryCode !== 'id') return;
    let stockTxt = document.getElementById('selRealtimeStock');
    let cardStock = document.getElementById('card_stock_id');
    let btn = document.getElementById('btnBuy');
    try {
        let d = JSON.parse(res);
        let count = 0;
        if (typeof d === 'object') {
            count = (d.count !== undefined) ? d.count : (d['fb'] !== undefined ? d['fb'] : 0);
            if (d.price !== undefined) {
                curPriceNum = parseFloat(d.price);
                curPriceStr = d.price.toString();
                document.getElementById('card_price_id').innerText = formatRupiahOnly(curPriceNum);
                document.getElementById('selProviderBadge').innerHTML = '$' + curPriceNum.toFixed(3) + ' <span class="text-[11px] text-slate-300">(' + formatRupiahOnly(curPriceNum) + ')</span>';
            }
        } else { count = parseInt(d) || 0; }

        if (count > 0) {
            stockTxt.innerHTML = `<span class="text-emerald-400 font-bold"><i class="fa-solid fa-circle-check mr-1"></i>${count.toLocaleString('id-ID')} pcs ready</span>`;
            if(cardStock) cardStock.innerHTML = `<span class="text-emerald-400">${count.toLocaleString('id-ID')} ready</span>`;
            checkMemberBalanceState();
        } else {
            stockTxt.innerHTML = '<span class="text-rose-400 font-bold"><i class="fa-solid fa-circle-xmark mr-1"></i>Stok Habis (0 pcs)</span>';
            if(cardStock) cardStock.innerHTML = '<span class="text-rose-400">0 ready</span>';
            btn.disabled = true;
            btn.innerHTML = '<i class="fa-solid fa-ban text-xs"></i> Stok VAK Habis';
        }
    } catch(e) {
        stockTxt.innerText = 'Stok: Tersedia';
        checkMemberBalanceState();
    }
}

function executeOrderNow() {
    let orderCostCoins = Math.max(161, Math.round(curPriceNum * KURS_IDR));
    if (!isAdminUser && getMemberCoinBalance() < orderCostCoins) {
        return alert('Saldo koin Anda tidak mencukupi (' + getMemberCoinBalance().toLocaleString('id-ID') + ' koin). Silakan isi saldo terlebih dahulu.');
    }

    let btn = document.getElementById('btnBuy');
    btn.disabled = true;
    if (selectedCountryCode !== 'id') {
        let item = liveCountryMap[selectedCountryCode];
        if (!item || !item.ranges || item.ranges.length === 0) return alert('Pool negara ini belum siap.');
        let bestRange = item.ranges[0].replace(/X/gi, '').trim();
        btn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Mengambil Nomor ${item.name}...`;
        TaskSmsBridge.getWealthNum(bestRange);
    } else {
        btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Mengambil Nomor Indonesia...';
        TaskSmsBridge.getNumber('fb', 'id', selectedOperatorSlug, curPriceStr);
    }
}

function onGetNumberResult(res) {
    let btn = document.getElementById('btnBuy');
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-bolt text-xs"></i> Ambil Nomor Sekarang';
    try {
        let d = JSON.parse(res);
        if (d.tel && d.idNum) {
            let dateNow = new Date();
            let timeStr = dateNow.getHours().toString().padStart(2, '0') + ':' + dateNow.getMinutes().toString().padStart(2, '0');
            taskOrders[d.idNum] = {
                id: d.idNum,
                num: d.tel,
                price: curPriceNum,
                svc: 'Facebook',
                ctry: 'Indonesia',
                opTag: selectedOperatorLabel.toUpperCase(),
                created: Date.now(),
                timeStr: timeStr,
                otp: null,
                smsText: 'Menunggu SMS masuk dari server...',
                provider: 'vak',
                autoRequestedSecond: false,
                smsCount: 0
            };
            persistOrders();
            renderOrderCardUI(d.idNum, d.tel, curPriceNum, selectedOperatorLabel.toUpperCase(), null, 'Menunggu SMS masuk dari server...', timeStr, true, 'vak');
            activeIds.push(d.idNum);
            
            // Potong saldo koin member secara otomatis
            let orderCostCoins = Math.max(161, Math.round(curPriceNum * KURS_IDR));
            deductMemberBalance(orderCostCoins);

            if (isAdminUser) {
                TaskSmsBridge.getMasterServerBalance();
            }
        } else if(d.error) {
            if(d.error === 'noNumbers') alert('Nomor habis untuk pilihan ini.');
            else alert('Gagal: ' + d.error);
        } else { alert('Respon Server: ' + res); }
    } catch(e) { alert('Gagal memproses: ' + res); }
}

function onWealthGetNumResult(res) {
    let btn = document.getElementById('btnBuy');
    btn.disabled = false;
    btn.innerHTML = `<i class="fa-solid fa-bolt text-xs"></i> Ambil Nomor ${selectedCountryName}`;
    try {
        let d = parseSafeResponse(res);
        if (d.meta && d.meta.code === 2946) {
            alert('Stok pada pool ' + selectedCountryName + ' saat ini sedang kosong. Silakan coba sesaat lagi.');
            return;
        }
        let numData = d.data || d;
        if (numData && (numData.full_number || numData.national_number || numData.number)) {
            let rawNum = numData.full_number || numData.national_number || numData.number;
            let fullNum = String(rawNum).replace(/[^0-9]/g, '');
            let ordId = numData.national_number || fullNum.slice(-6) || Date.now().toString().slice(-6);
            let dateNow = new Date();
            let timeStr = dateNow.getHours().toString().padStart(2, '0') + ':' + dateNow.getMinutes().toString().padStart(2, '0');
            let cName = numData.country || selectedCountryName;
            let opName = numData.operator || (selectedCountryName + ' LIVE');

            taskOrders[ordId] = {
                id: ordId,
                num: fullNum,
                price: 0,
                svc: 'Facebook',
                ctry: cName,
                opTag: opName,
                created: Date.now(),
                timeStr: timeStr,
                otp: null,
                smsText: 'Menunggu SMS masuk dari server...',
                provider: 'wealthora',
                smsCount: 0
            };
            persistOrders();
            renderOrderCardUI(ordId, fullNum, 0, opName, null, 'Menunggu SMS masuk dari server...', timeStr, true, 'wealthora');
            if (!activeIds.includes(ordId)) activeIds.push(ordId);
            TaskSmsBridge.copyToClipboard('+' + fullNum, 'Nomor HP');
        } else { alert('Respon Server: ' + (d.message || JSON.stringify(d))); }
    } catch(e) {}
}

function renderOrderCardUI(id, num, priceVal, opTag, existingOtp, existingSmsText, timeStr, isNew, prov) {
    let isDone = existingOtp ? true : false;
    let otpDisplay = isDone ? existingOtp : '----';
    let badgeText = isDone ? 'OTP RECEIVED' : 'WAITING OTP';
    let badgeClass = isDone ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 text-[9px] font-black px-2 py-0.5 rounded' : 'bg-amber-950/80 text-amber-300 border border-amber-500/40 text-[9px] font-bold px-2 py-0.5 rounded animate-pulse';
    let fullSms = existingSmsText || 'Menunggu SMS masuk dari server...';
    let timeDisp = timeStr || 'Baru Saja';
    let isVak = (prov === 'vak');
    let banBtnHtml = isVak ? `<button id="ban_btn_${id}" onclick="banOrder('${id}')" class="flex-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold py-2 rounded-xl active:scale-95 transition-all"><i class="fa-solid fa-ban mr-1"></i> Ban (Bekas)</button>` : '';

    let html = `<div id="order_${id}" class="bg-[#0A101D] p-4 rounded-2xl mb-4 border border-slate-800 shadow-2xl relative">
        <div class="flex justify-between items-center mb-4">
            <div class="flex items-center gap-2">
                <span class="text-base font-black text-cyan-400 font-mono tracking-wider">#${id}</span>
                <span id="badge_${id}" class="${badgeClass}">${badgeText}</span>
                <span class="text-[8px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono font-bold uppercase">${isVak ? 'VAK' : 'FREE'}</span>
            </div>
            <div class="flex items-center gap-2">
                <span id="timer_${id}" class="text-[11px] font-mono text-slate-500"></span>
                <span class="text-xs font-mono font-bold text-cyan-400">${timeDisp}</span>
            </div>
        </div>

        <div class="flex items-center justify-between py-2 border-b border-slate-900">
            <div class="w-1/3 text-[11px] font-bold text-slate-400 tracking-wider uppercase font-mono">PHONE</div>
            <div class="w-2/3 flex items-center justify-between">
                <span class="text-sm font-mono font-bold text-white tracking-wider cursor-pointer active:scale-95" onclick="TaskSmsBridge.copyToClipboard('${num}', 'Nomor HP')">+${num}</span>
                <button onclick="TaskSmsBridge.copyToClipboard('${num}', 'Nomor HP')" class="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 flex items-center justify-center active:scale-90 hover:text-cyan-400">
                    <i class="fa-regular fa-copy text-[11px]"></i>
                </button>
            </div>
        </div>

        <div class="flex items-center justify-between py-2.5 border-b border-slate-900">
            <div class="w-1/3 text-[10px] font-bold text-slate-400 tracking-wider uppercase leading-tight font-mono">LAST DETECTED<br>OTP</div>
            <div class="w-2/3 flex items-center justify-between">
                <span id="otp_${id}" class="text-xl font-mono font-black text-cyan-400 tracking-wider cursor-pointer active:scale-95" onclick="TaskSmsBridge.copyToClipboard('${otpDisplay}', 'Kode OTP')">${otpDisplay}</span>
                <button id="copy_otp_btn_${id}" onclick="TaskSmsBridge.copyToClipboard('${otpDisplay}', 'Kode OTP')" class="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 flex items-center justify-center active:scale-90 hover:text-cyan-400 ${isDone ? '' : 'opacity-30'}">
                    <i class="fa-regular fa-copy text-[11px]"></i>
                </button>
            </div>
        </div>

        <div class="flex items-start justify-between pt-2.5 mb-3">
            <div class="w-1/3 text-[11px] font-bold text-slate-400 tracking-wider uppercase font-mono pt-0.5">LATEST SMS</div>
            <div class="w-2/3">
                <div id="smsText_${id}" class="text-xs text-slate-300 font-mono leading-relaxed break-words">${fullSms}</div>
            </div>
        </div>

        <div class="flex gap-2 pt-2 border-t border-slate-900/80">
            <button onclick="cancelOrder('${id}')" class="flex-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold py-2 rounded-xl active:scale-95 transition-all"><i class="fa-solid fa-xmark mr-1"></i> Batal</button>
            ${banBtnHtml}
            <button id="btnFinish_${id}" onclick="finishOrder('${id}')" style="${isDone ? '' : 'display:none;'}" class="flex-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold py-2 rounded-xl active:scale-95 transition-all"><i class="fa-solid fa-check mr-1"></i> Selesai</button>
        </div>
    </div>`;
    document.getElementById('activeOrders').insertAdjacentHTML('afterbegin', html);
    if(isNew === true) { TaskSmsBridge.copyToClipboard('+' + num, 'Nomor HP'); }
}

function cancelOrder(id) {
    let ord = taskOrders[id];
    if (ord && ord.provider === 'vak') {
        TaskSmsBridge.cancelNumberVak(id);
    }
    delete taskOrders[id];
    persistOrders();
    activeIds = activeIds.filter(item => item !== id);
    let el = document.getElementById('order_' + id); if(el) el.remove();
    if (isAdminUser) {
        setTimeout(() => { TaskSmsBridge.getMasterServerBalance(); }, 1200);
    }
}

function banOrder(id) {
    let btn = document.getElementById('ban_btn_' + id);
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin mr-1"></i> Memproses...';
    }
    TaskSmsBridge.banNumberVak(id);
}

function onBanVakResult(id, res) {
    delete taskOrders[id];
    persistOrders();
    activeIds = activeIds.filter(item => item !== id);
    let el = document.getElementById('order_' + id); if(el) el.remove();
    if (isAdminUser) {
        setTimeout(() => { TaskSmsBridge.getMasterServerBalance(); }, 1200);
    }
}

function onCancelVakResult(id, res) {}
function onSetStatusResult(res) {}

function finishOrder(id) {
    let ord = taskOrders[id];
    if (ord && ord.provider === 'vak') { TaskSmsBridge.cancelNumberVak(id); }
    delete taskOrders[id];
    persistOrders();
    activeIds = activeIds.filter(item => item !== id);
    let el = document.getElementById('order_' + id); if(el) el.remove();
}

function saveToTaskHistory(svc, ctry, num, code, price, id, opTag) {
    let hist = JSON.parse(TaskSmsBridge.getHistory() || '[]');
    let dateObj = new Date();
    let dateStr = dateObj.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + 
                  dateObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    let existingIndex = hist.findIndex(h => h.num === num && h.svc === svc);
    if (existingIndex !== -1) {
        let existingEntry = hist[existingIndex];
        if (!existingEntry.code.includes(code)) {
            existingEntry.code = existingEntry.code + ', ' + code;
            hist.splice(existingIndex, 1);
            hist.unshift(existingEntry);
        }
    } else {
        hist.unshift({ svc: svc, ctry: ctry, num: num, code: code, price: price, date: dateStr, id: id, opTag: opTag });
    }
    TaskSmsBridge.saveHistory(JSON.stringify(hist));
}

function showTaskHistory(page) { switchBottomTab('history'); }
function closeTaskHistory() { document.getElementById('taskHistModal').classList.add('hidden'); }

function appendConsoleLog(jsonStr) {
    let container = document.getElementById('liveConsole');
    let emptyTxt = document.getElementById('consoleEmptyText');
    if (emptyTxt) emptyTxt.remove();
    try {
        let obj = JSON.parse(jsonStr);
        let userRoleTag = (obj.user.toLowerCase() === 'admin') ? '<span class="text-amber-400 font-bold ml-1">👑 ADMIN</span>' : '';
        let cFlag = getFlagByName(obj.ctry, 16);
        let itemHtml = `<div class="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 mb-2 shadow-sm text-xs">
            <div class="flex justify-between items-center text-[9px] text-slate-500 mb-1.5">
                <span><i class="fa-regular fa-clock mr-1"></i>${obj.time || 'Baru Saja'}</span>
                <span class="font-mono text-cyan-400">ID: #${obj.id}</span>
            </div>
            <div class="flex justify-between items-center">
                <div class="flex items-center gap-2">
                    <span class="flex items-center">${cFlag}</span>
                    <div>
                        <div class="font-bold text-white text-[11px]">${obj.ctry} <span class="text-blue-400">(${obj.svc})</span></div>
                        <div class="font-mono text-[10px] text-slate-400">${obj.num}</div>
                    </div>
                </div>
                <div class="text-right">
                    <span class="bg-emerald-500/20 text-emerald-300 text-[8px] font-black px-2 py-0.5 rounded border border-emerald-500/30 uppercase">SUKSES</span>
                    <div class="text-[9px] text-slate-400 font-bold mt-1">Oleh: <span class="text-blue-300">${obj.user}</span>${userRoleTag}</div>
                </div>
            </div>
        </div>`;
        container.insertAdjacentHTML('afterbegin', itemHtml);
    } catch(e) {}
}

function switchTab(mode) {
    authMode = mode;
    document.getElementById('inpUser').value = ''; 
    document.getElementById('inpPass').value = '';
    if (mode === 'login') {
        document.getElementById('tabBtnLogin').className = 'flex-1 py-2 text-xs font-bold rounded-lg bg-blue-600 text-white shadow';
        document.getElementById('tabBtnReg').className = 'flex-1 py-2 text-xs font-bold rounded-lg text-slate-400';
        document.getElementById('btnAuthAction').innerText = 'MASUK SEKARANG';
    } else {
        document.getElementById('tabBtnReg').className = 'flex-1 py-2 text-xs font-bold rounded-lg bg-blue-600 text-white shadow';
        document.getElementById('tabBtnLogin').className = 'flex-1 py-2 text-xs font-bold rounded-lg text-slate-400';
        document.getElementById('btnAuthAction').innerText = 'DAFTAR AKUN BARU';
    }
}

function submitAuth() {
    let u = document.getElementById('inpUser').value.trim();
    let p = document.getElementById('inpPass').value.trim();
    if(!u || !p) return alert('Username dan Password wajib diisi!');
    document.getElementById('btnAuthAction').innerText = 'MEMPROSES...';
    if(authMode === 'login') { TaskSmsBridge.doLogin(u, p); } else { TaskSmsBridge.doRegister(u, p); }
}

function resetAuthBtn() { document.getElementById('btnAuthAction').innerText = (authMode === 'login') ? 'MASUK SEKARANG' : 'DAFTAR AKUN BARU'; }

function uiShowAuth() { 
    document.getElementById('mainAppArea').style.display = 'none'; 
    document.getElementById('bottomNavBar').style.display = 'none';
    document.getElementById('authArea').style.display = 'flex'; 
    resetAuthBtn(); 
}

function uiLoginSuccess(username, isAdmin) {
    activeUser = username; 
    isAdminUser = isAdmin;
    document.getElementById('authArea').style.display = 'none';
    document.getElementById('mainAppArea').style.display = 'block';
    document.getElementById('bottomNavBar').style.display = 'flex';

    renderOperatorButtons();
    selectCountryId();
    TaskSmsBridge.getWealthLiveAccess();
    TaskSmsBridge.startGlobalListener();
    restoreOrdersFromStorage();
    
    if (isAdminUser) {
        TaskSmsBridge.getMasterServerBalance();
    }
    
    switchBottomTab('beranda');
}

function confirmLogout() { if(confirm('Yakin ingin keluar?')) TaskSmsBridge.doLogout(); }
