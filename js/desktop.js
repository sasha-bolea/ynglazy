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
    { app: 'browser',      glyph: '🌐', label: 'BROWSER',  file: 'apps/browser.html',      w: 640, h: 460 },
    { app: 'tetris',       glyph: '🧱', label: 'TETRIS',   file: 'apps/tetris.html',       w: 460, h: 480 },
    { app: 'synth-7',      glyph: '🎹', label: 'SYNTH-7',  file: 'apps/synth.html',        w: 600, h: 448 },
    { app: 'terminal',     glyph: '💻', label: 'TERMINAL' },
    { app: 'about',        glyph: '📄', label: 'ABOUT.EXE'},
    { app: 'sample-bank',  glyph: '🔊', label: 'SAMPLES'  },
    { app: 'sys-error',    glyph: '⚠️', label: 'SYS_ERR'  },
    { app: 'trash',        glyph: '🗑️', label: 'CESTINO'  },
  ];

  let winZ = 100;   // z-index incrementale finestre

  const isMobile = () => window.matchMedia('(max-width: 768px)').matches;

  /* Snapshot di fallback per le icone progetto se il fetch fallisce */
  const FALLBACK_PROJECTS = [
    { name: '#FFFFFF', type: 'album' },
    { name: 'Non c’è pace', type: 'single' },
  ];

  /* -----------------------------------------------------------
     buildIcons(): Cestino + icone progetto sul desktop.
     Le altre app stanno nella taskbar (buildLaunchers).
     ----------------------------------------------------------- */
  function buildIcons() {
    const layer = document.getElementById('icon-layer');

    if (isMobile()) {
      // Su mobile: tap singolo apre direttamente l'app
      layer.addEventListener('click', onIconOpen);
      // Tutte le app sul desktop (taskbar nascosta su mobile)
      ICONS.forEach((ic) => {
        layer.appendChild(makeIcon({ glyph: ic.glyph, label: ic.label, attr: { app: ic.app } }));
      });
    } else {
      layer.addEventListener('click', onIconSingleClick);
      layer.addEventListener('dblclick', onIconOpen);
      // Desktop: solo il Cestino (le altre app stanno nella taskbar)
      const trash = ICONS.find((i) => i.app === 'trash');
      layer.appendChild(makeIcon({ glyph: trash.glyph, label: trash.label, attr: { app: 'trash' } }));
    }
  }

  /* makeIcon(opt): crea un nodo icona desktop */
  function makeIcon({ glyph, label, attr }) {
    const el = document.createElement('div');
    el.className = 'desk-icon';
    Object.entries(attr).forEach(([k, v]) => { el.dataset[k] = v; });
    el.innerHTML = `<div class="glyph">${glyph}</div><div class="label">${label}</div>`;
    return el;
  }

  /* -----------------------------------------------------------
     buildProjectIcons(projects): un'icona per progetto.
     Doppio click → apre il File Manager su Desktop/<progetto>.
     ----------------------------------------------------------- */
  function buildProjectIcons(projects) {
    const layer = document.getElementById('icon-layer');
    // Rimuovi eventuali icone progetto precedenti (re-render post fetch)
    layer.querySelectorAll('.desk-icon[data-proj]').forEach((n) => n.remove());
    projects.forEach((p) => {
      layer.appendChild(makeIcon({
        glyph: '💿',
        label: p.name,
        attr: { proj: p.name },
      }));
    });
  }

  /* -----------------------------------------------------------
     buildLaunchers(): tutte le app tranne il Cestino come
     pulsanti nella taskbar. Click singolo = apri.
     ----------------------------------------------------------- */
  function buildLaunchers() {
    if (isMobile()) return; // app già sul desktop su mobile
    const bar = document.getElementById('tb-launch');
    ICONS.filter((ic) => ic.app !== 'trash').forEach((ic) => {
      const b = document.createElement('div');
      b.className = 'tb-app';
      b.dataset.app = ic.app;
      b.title = ic.label;
      b.innerHTML = `<span class="g">${ic.glyph}</span><span class="t">${ic.label}</span>`;
      b.addEventListener('click', () => openApp(ic));
      bar.appendChild(b);
    });
  }

  /* -----------------------------------------------------------
     openApp(def): dispatcher. App con file standalone → iframe;
     altrimenti finestra placeholder.
     ----------------------------------------------------------- */
  function openApp(def) {
    if (def.file) openAppWindow(def);
    else openPlaceholderWindow(def);
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
     onIconOpen(e): doppio click su icona desktop.
     Progetto → File Manager su Desktop/<nome>; Cestino → cartella
     Cestino; altrimenti apre l'app.
     ----------------------------------------------------------- */
  function onIconOpen(e) {
    const icon = e.target.closest('.desk-icon');
    if (!icon) return;
    if (icon.dataset.proj) return openFM(['Desktop', icon.dataset.proj]);
    if (icon.dataset.app === 'trash') return openFM(['Cestino']);
    openApp(ICONS.find((i) => i.app === icon.dataset.app));
  }

  /* -----------------------------------------------------------
     openFM(pathArr): apre il File Manager navigato su un percorso.
     ----------------------------------------------------------- */
  function openFM(pathArr) {
    const fm = ICONS.find((i) => i.app === 'file-manager');
    openAppWindow(fm, pathArr);
  }

  /* -----------------------------------------------------------
     openAppWindow(def): finestra che carica un'app standalone
     in un iframe. Una sola istanza per app (focus se già aperta).
     ----------------------------------------------------------- */
  function openAppWindow(def, navPath) {
    // Percorso → stringa (segmenti encodeURIComponent uniti da '/')
    const pathStr = Array.isArray(navPath)
      ? navPath.map(encodeURIComponent).join('/') : '';

    // Se già aperta: focus + (se richiesto) naviga via postMessage
    const existing = document.querySelector(`.win[data-app="${def.app}"]`);
    if (existing) {
      existing.style.zIndex = ++winZ;
      if (pathStr) {
        const frame = existing.querySelector('iframe');
        frame.contentWindow.postMessage({ type: 'fm-nav', path: pathStr }, '*');
      }
      return;
    }

    // Fragment (#) invece di query: sopravvive al redirect clean-URL del server
    const src = def.file + (pathStr ? '#' + pathStr : '');

    const win = document.createElement('div');
    win.className = 'win';
    win.dataset.app = def.app;
    win.style.zIndex = ++winZ;
    if (!isMobile()) {
      win.style.width = (def.w || 520) + 'px';
      win.style.left = (90 + Math.random() * 80) + 'px';
      win.style.top  = (60 + Math.random() * 60) + 'px';
    }

    win.innerHTML =
      `<div class="win-title">` +
        `<span>${def.glyph} ${def.label}</span>` +
        `<span class="win-close" title="chiudi">×</span>` +
      `</div>` +
      `<div class="win-body win-app">` +
        `<iframe src="${src}" title="${def.label}"></iframe>` +
      `</div>`;

    const body = win.querySelector('.win-app');
    if (!isMobile()) body.style.height = (def.h || 360) + 'px';

    document.getElementById('desktop').appendChild(win);

    win.addEventListener('mousedown', () => { win.style.zIndex = ++winZ; });
    win.querySelector('.win-close').addEventListener('click', () => win.remove());
    if (!isMobile()) makeDraggable(win, win.querySelector('.win-title'));
  }

  /* -----------------------------------------------------------
     openPlaceholderWindow(def): finestra minima trascinabile.
     Verrà sostituita dal sistema completo in windows.js.
     ----------------------------------------------------------- */
  function openPlaceholderWindow(def) {
    const win = document.createElement('div');
    win.className = 'win';
    win.style.zIndex = ++winZ;
    if (!isMobile()) {
      win.style.left = (60 + Math.random() * 120) + 'px';
      win.style.top  = (70 + Math.random() * 90) + 'px';
    }

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

    win.addEventListener('mousedown', () => { win.style.zIndex = ++winZ; });
    win.querySelector('.win-close').addEventListener('click', () => win.remove());
    if (!isMobile()) makeDraggable(win, win.querySelector('.win-title'));
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
      // Vincola la finestra dentro la pagina: la barra del titolo
      // (nome + ×) resta sempre visibile e sopra la taskbar
      const taskbarH = document.getElementById('taskbar').offsetHeight;
      const titleH = handle.offsetHeight;
      const maxLeft = Math.max(0, window.innerWidth - win.offsetWidth);
      const maxTop  = Math.max(0, window.innerHeight - taskbarH - titleH);
      const left = Math.min(Math.max(e.clientX - ox, 0), maxLeft);
      const top  = Math.min(Math.max(e.clientY - oy, 0), maxTop);
      win.style.left = left + 'px';
      win.style.top  = top + 'px';
    });
    document.addEventListener('mouseup', () => {
      if (!dragging) return;
      dragging = false;
      document.querySelectorAll('.win iframe')
        .forEach((f) => { f.style.pointerEvents = ''; });
    });
  }

  /* -----------------------------------------------------------
     setupHomeButton(): su mobile trasforma START in HOME.
     Click su HOME chiude la finestra in primo piano (torna al
     desktop); se non ci sono finestre aperte non fa nulla.
     ----------------------------------------------------------- */
  function setupHomeButton() {
    if (!isMobile()) return;
    const btn = document.querySelector('.tb-start');
    btn.textContent = '⌂ HOME';
    btn.classList.add('tb-home');
    btn.addEventListener('click', () => {
      const wins = [...document.querySelectorAll('.win')];
      if (!wins.length) return;
      wins.sort((a, b) => (parseInt(b.style.zIndex) || 0) - (parseInt(a.style.zIndex) || 0));
      wins[0].remove();
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
    buildLaunchers();
    buildProjectIcons(FALLBACK_PROJECTS);   // icone immediate
    loadProjectIcons();                      // poi aggiorna dai dati vivi
    startClock();
    setupHomeButton();
    document.getElementById('desktop').addEventListener('click', deselectOnVoid);
    // All'avvio apre il Browser (solo su desktop — su mobile l'utente sceglie dall'icona)
    if (!isMobile()) openApp(ICONS.find((i) => i.app === 'browser'));
  }

  /* -----------------------------------------------------------
     loadProjectIcons(): legge data/discography.json e rigenera
     le icone progetto sul desktop. Fallback resta lo snapshot.
     ----------------------------------------------------------- */
  async function loadProjectIcons() {
    try {
      const r = await fetch('data/discography.json', { cache: 'no-cache' });
      if (!r.ok) return;
      const data = await r.json();
      if (Array.isArray(data.projects) && data.projects.length) {
        buildProjectIcons(data.projects);
      }
    } catch (_) { /* offline: restano le icone di fallback */ }
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
