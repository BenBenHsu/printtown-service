/* =====================================================================
   普印通 系統選單（設備保養系統、計張計價系統、庫存系統三個頁面共用）

   以後要新增、改名或調整上方的系統按鈕，只要改這個檔案，
   再把這一個檔上傳到 GitHub 就好，三個頁面會一起更新。

   每個系統一行：
     id    ：系統代號（不要改）
     name  ：按鈕上的字
     href  ：要開的檔案（和 index.html 放在同一個資料夾）
     show  ：什麼人看得到。每個頁面會傳入登入者的資料：
             staff＝已核准的同仁、admin＝管理者、billing＝計價人員、
             role＝身份（管理者／會計部／行政人員／工程部）
             例：要讓會計部也看得到庫存，改成
             function (c) { return c.admin || c.role === '會計部'; }
             （資料庫那邊也要同步開放，見 inventory-setup SQL 檔的說明）
   ===================================================================== */
(function () {
  'use strict';

  var SYSTEMS = [
    { id: 'service',   name: '設備保養', href: './',             show: function () { return true; } },
    { id: 'billing',   name: '計張計價', href: 'billing.html',   show: function (c) { return !!c.billing; } },
    { id: 'inventory', name: '庫存',     href: 'inventory.html', show: function (c) { return !!c.admin; } }   // 無帳耗材：只給管理者
  ];

  var CSS =
    '.pt-sys{display:inline-flex;flex-wrap:wrap;gap:6px;align-items:center;vertical-align:middle}' +
    '.pt-sys:empty{display:none}' +
    '.pt-sys .pt-sys-btn{display:inline-block;background:rgba(255,255,255,.16);color:#fff;border:1px solid rgba(255,255,255,.6);' +
    'padding:6px 12px;border-radius:6px;font:inherit;font-size:14px;line-height:1.3;text-decoration:none;white-space:nowrap;cursor:pointer}' +
    '.pt-sys .pt-sys-btn:hover{background:rgba(255,255,255,.3)}' +
    '.pt-sys .pt-sys-btn:focus-visible{outline:2px solid #fff;outline-offset:2px}';

  function addCss() {
    if (document.getElementById('pt-sys-css')) return;
    var st = document.createElement('style');
    st.id = 'pt-sys-css';
    st.textContent = CSS;
    document.head.appendChild(st);
  }

  // target：放按鈕的位置；current：目前這一頁是哪個系統（不顯示自己）；ctx：{ staff, admin, billing, role }
  function render(target, current, ctx) {
    var el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) return;
    addCss();
    ctx = ctx || {};
    el.classList.add('pt-sys');
    el.textContent = '';
    SYSTEMS.forEach(function (s) {
      if (s.id === current || !s.show(ctx)) return;
      var a = document.createElement('a');
      a.className = 'pt-sys-btn';
      a.href = s.href;
      a.textContent = s.name;
      a.setAttribute('data-sys', s.id);
      el.appendChild(a);
    });
  }

  window.PT_MENU = { version: 2, systems: SYSTEMS, render: render };
})();
