/* =========================================================
   LZYYY_SYS — desktop.js
   Logica desktop: orologio taskbar, selezione/apertura icone,
   finestre placeholder minime (in attesa di windows.js).
   ========================================================= */

(() => {
  'use strict';

  /* Definizione icone desktop. app = id futuro, glyph = emoji
     placeholder (sostituibile con pixel art). */
  /* file = app standalone aperta via iframe (w/h = dimensioni finestra).
     Senza file → finestra placeholder "non installato". */
  const ICONS = [
    { app: 'file-manager', glyph: '🎵', label: 'FILE_MGR', file: 'apps/file-manager.html', w: 560, h: 380 },
    { app: 'tetris',       glyph: '🧱', label: 'TETRIS'   },
    { app: 'synth-7',      glyph: '🎹', label: 'SYNTH-7'  },
    { app: 'terminal',     glyph: '💻', label: 'TERMINAL' },
    { app: 'about',        glyph: '📄', label: 'ABOUT.EXE'},
    { app: 'sample-bank',  glyph: '🔊', label: 'SAMPLES'  },
    { app: 'sys-error',    glyph: '⚠️', label: 'SYS_ERR'  },
    { app: 'trash',        glyph: '🗑️', label: 'CESTINO'  },
  ];

  let winZ = 100;   // z-index incrementale finestre

  /* -----------------------------------------------------------
     buildIcons(): genera le icone nel layer desktop
     ----------------------------------------------------------- */
  function buildIcons() {
    const layer = document.getElementById('icon-layer');
    ICONS.forEach((ic) => {
      const el = document.createElement('div');
      el.className = 'desk-icon';
      el.dataset.app = ic.app;
      el.innerHTML =
        `<div class="glyph">${ic.glyph}</div>` +
        `<div class="label">${ic.label}</div>`;
      layer.appendChild(el);
    });
    layer.addEventListener('click', onIconSingleClick);
    layer.addEventListener('dblclick', onIconOpen);
  }

  /* -----------------------------------------------------------
     onIconSingleClick(e): selezione visiva singola icona
     ----------------------------------------------------------- */
  function onIconSingleClick(e) {
    const icon = e.target.closest('.desk-icon');
    document.querySelectorAll('.desk-icon.selected')
      .forEach((n) => n.classList.remove('selected'));
    if (icon) icon.classList.add('selected');
  }

  /* -----------------------------------------------------------
     onIconOpen(e): doppio click → apre finestra placeholder
     ----------------------------------------------------------- */
  function onIconOpen(e) {
    const icon = e.target.closest('.desk-icon');
    if (!icon) return;
    const def = ICONS.find((i) => i.app === icon.dataset.app);
    // App con file standalone → finestra con iframe; altrimenti placeholder
    if (def.file) openAppWindow(def);
    else openPlaceholderWindow(def);
  }

  /* -----------------------------------------------------------
     openAppWindow(def): finestra che carica un'app standalone
     in un iframe. Una sola istanza per app (focus se già aperta).
     ----------------------------------------------------------- */
  function openAppWindow(def) {
    // Se già aperta, portala in primo piano
    const existing = document.querySelector(`.win[data-app="${def.app}"]`);
    if (existing) { existing.style.zIndex = ++winZ; return; }

    const win = document.createElement('div');
    win.className = 'win';
    win.dataset.app = def.app;
    win.style.width = (def.w || 520) + 'px';
    win.style.left = (90 + Math.random() * 80) + 'px';
    win.style.top  = (60 + Math.random() * 60) + 'px';
    win.style.zIndex = ++winZ;

    win.innerHTML =
      `<div class="win-title">` +
        `<span>${def.glyph} ${def.label}</span>` +
        `<span class="win-close" title="chiudi">×</span>` +
      `</div>` +
      `<div class="win-body win-app">` +
        `<iframe src="${def.file}" title="${def.label}"></iframe>` +
      `</div>`;

    const body = win.querySelector('.win-app');
    body.style.height = (def.h || 360) + 'px';

    document.getElementById('desktop').appendChild(win);

    win.addEventListener('mousedown', () => { win.style.zIndex = ++winZ; });
    win.querySelector('.win-close').addEventListener('click', () => win.remove());
    makeDraggable(win, win.querySelector('.win-title'));
  }

  /* -----------------------------------------------------------
     openPlaceholderWindow(def): finestra minima trascinabile.
     Verrà sostituita dal sistema completo in windows.js.
     ----------------------------------------------------------- */
  function openPlaceholderWindow(def) {
    const win = document.createElement('div');
    win.className = 'win';
    win.style.left = (60 + Math.random() * 120) + 'px';
    win.style.top  = (70 + Math.random() * 90) + 'px';
    win.style.zIndex = ++winZ;

    win.innerHTML =
      `<div class="win-title">` +
        `<span>${def.glyph} ${def.label}</span>` +
        `<span class="win-close" title="chiudi">×</span>` +
      `</div>` +
      `<div class="win-body">` +
        `<span class="am">[${def.app}]</span> non ancora installato.<br>` +
        `Modulo in arrivo nelle prossime build di LZYYY_SYS.` +
      `</div>`;

    document.getElementById('desktop').appendChild(win);

    // Porta in primo piano al click
    win.addEventListener('mousedown', () => { win.style.zIndex = ++winZ; });
    // Chiusura
    win.querySelector('.win-close').addEventListener('click', () => win.remove());
    // Drag dalla titlebar
    makeDraggable(win, win.querySelector('.win-title'));
  }

  /* -----------------------------------------------------------
     makeDraggable(win, handle): trascinamento finestra dalla
     barra del titolo (versione minima).
     ----------------------------------------------------------- */
  function makeDraggable(win, handle) {
    let ox = 0, oy = 0, dragging = false;

    handle.addEventListener('mousedown', (e) => {
      if (e.target.classList.contains('win-close')) return;
      dragging = true;
      ox = e.clientX - win.offsetLeft;
      oy = e.clientY - win.offsetTop;
      // Gli iframe "ingoiano" i mousemove: disattivane i puntatori durante il drag
      document.querySelectorAll('.win iframe')
        .forEach((f) => { f.style.pointerEvents = 'none'; });
      e.preventDefault();
    });
    document.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      win.style.left = (e.clientX - ox) + 'px';
      win.style.top  = (e.clientY - oy) + 'px';
    });
    document.addEventListener('mouseup', () => {
      if (!dragging) return;
      dragging = false;
      document.querySelectorAll('.win iframe')
        .forEach((f) => { f.style.pointerEvents = ''; });
    });
  }

  /* -----------------------------------------------------------
     startClock(): orologio reale nella taskbar (HH:MM:SS)
     ----------------------------------------------------------- */
  function startClock() {
    const el = document.getElementById('tb-clock');
    const tick = () => {
      const d = new Date();
      const p = (n) => String(n).padStart(2, '0');
      el.textContent = `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
    };
    tick();
    setInterval(tick, 1000);
  }

  /* -----------------------------------------------------------
     deselectOnVoid(): click sul vuoto deseleziona le icone
     ----------------------------------------------------------- */
  function deselectOnVoid(e) {
    if (e.target.id === 'desktop' || e.target.id === 'icon-layer') {
      document.querySelectorAll('.desk-icon.selected')
        .forEach((n) => n.classList.remove('selected'));
    }
  }

  /* -----------------------------------------------------------
     init(): costruisce il desktop. Chiamato dopo il boot.
     ----------------------------------------------------------- */
  function init() {
    buildIcons();
    startClock();
    document.getElementById('desktop').addEventListener('click', deselectOnVoid);
  }

  // Il desktop si inizializza alla fine del boot.
  // Fallback: se per qualche motivo il boot non parte, init dopo load.
  document.addEventListener('lzyyy:booted', init, { once: true });
  window.addEventListener('load', () => {
    if (!document.querySelector('.desk-icon')) {
      // boot ancora in corso: non fare nulla, ci pensa l'evento.
    }
  });
})();
