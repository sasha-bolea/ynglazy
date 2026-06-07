/* =========================================================
   LZYYY_SYS — boot.js
   Sequenza di avvio + PRELOADER reale.
   Copre il caricamento degli asset (immagini + font) mostrando
   il log terminale; svanisce solo quando tutto è pronto E
   la durata minima di animazione è trascorsa.
   ========================================================= */

(() => {
  'use strict';

  /* -----------------------------------------------------------
     CONFIG
     ASSETS: lista immagini da precaricare. Vuota per ora
     (icone = emoji). Aggiungere qui i path quando arrivano i
     wallpaper / icone pixel art: es. 'assets/wallpapers/bg.png'
     ----------------------------------------------------------- */
  const ASSETS = [
    // 'assets/wallpapers/desktop.png',
    // 'assets/icons/filemgr.png',
  ];

  const MIN_BOOT_MS = 3200;   // durata minima animazione di avvio
  const FREEZE_AT    = 68;    // % a cui la barra "si blocca" (mood)
  const FREEZE_MS    = 900;   // durata del freeze

  /* Righe del log di avvio: [testo, tag] dove tag ∈ ok|warn|err|none */
  const BOOT_LINES = [
    ['SYS bootloader v0.8.7', 'none'],
    ['Cold start :: phosphor warmup', 'none'],
    ['Loading audio kernel ............', 'ok'],
    ['Mounting sample library ........', 'ok'],
    ['Calibrating CRT phosphor .......', 'ok'],
    ['Initializing chaos module ......', 'ok'],
    ['Decoding 0x4C5A5959 ............', 'none'],
    ['Linking desktop surface ........', 'ok'],
    ['Spawning taskbar daemon ........', 'ok'],
    ['Checking reality coherence .....', 'err', '[FAIL — ignored]'],
  ];

  /* DOM refs */
  const overlay = document.getElementById('boot-overlay');
  const logEl   = document.getElementById('boot-log');
  const barWrap = document.getElementById('boot-bar');
  const barFill = document.getElementById('boot-bar-fill');
  const pctEl   = document.getElementById('boot-bar-pct');
  const hexEl   = document.getElementById('boot-hex');

  /* -----------------------------------------------------------
     preloadImage(src): carica un'immagine, risolve sempre
     (anche su errore, per non bloccare il boot).
     ----------------------------------------------------------- */
  function preloadImage(src) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = resolve;
      img.onerror = resolve;
      img.src = src;
    });
  }

  /* -----------------------------------------------------------
     waitFonts(): risolve quando i webfont sono pronti
     (o subito se l'API non è disponibile).
     ----------------------------------------------------------- */
  function waitFonts() {
    if (document.fonts && document.fonts.ready) {
      return document.fonts.ready.catch(() => {});
    }
    return Promise.resolve();
  }

  /* -----------------------------------------------------------
     fillHexStream(): riempie lo sfondo con rumore esadecimale
     (estetica Lain). Aggiorna periodicamente fino al fade.
     ----------------------------------------------------------- */
  let hexTimer = null;
  function fillHexStream() {
    const chars = '0123456789ABCDEF';
    const gen = () => {
      let out = '';
      for (let i = 0; i < 1400; i++) {
        out += chars[(Math.random() * 16) | 0];
        if ((i + 1) % 2 === 0) out += ' ';
        if ((i + 1) % 48 === 0) out += '\n';
      }
      return out;
    };
    hexEl.textContent = gen();
    hexTimer = setInterval(() => { hexEl.textContent = gen(); }, 120);
  }

  /* -----------------------------------------------------------
     setProgress(pct): aggiorna barra + percentuale
     ----------------------------------------------------------- */
  function setProgress(pct) {
    const v = Math.max(0, Math.min(100, Math.round(pct)));
    barFill.style.width = v + '%';
    pctEl.textContent = '> ' + String(v).padStart(3, '0') + '% ::';
  }

  /* -----------------------------------------------------------
     printLine(line): scrive una riga di log con eventuale tag
     ----------------------------------------------------------- */
  function printLine([text, tag, extra]) {
    const el = document.createElement('span');
    el.className = 'boot-line';
    el.textContent = text + ' ';
    if (tag === 'ok')        el.innerHTML += '<span class="tag-ok">[OK]</span>';
    else if (tag === 'warn') el.innerHTML += `<span class="tag-warn">${extra || '[WARN]'}</span>`;
    else if (tag === 'err')  el.innerHTML += `<span class="tag-err">${extra || '[ERR]'}</span>`;
    logEl.appendChild(el);
    logEl.scrollTop = logEl.scrollHeight;
  }

  /* -----------------------------------------------------------
     sleep(ms): promessa temporizzata
     ----------------------------------------------------------- */
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  /* -----------------------------------------------------------
     runBootSequence(): orchestratore.
     Avvia in parallelo il preload reale e l'animazione del log;
     attende entrambi prima del fade verso il desktop.
     ----------------------------------------------------------- */
  async function runBootSequence() {
    const startTime = Date.now();
    fillHexStream();

    // Preload reale in parallelo all'animazione
    const preloadPromise = Promise.all([
      waitFonts(),
      ...ASSETS.map(preloadImage),
    ]);

    // Animazione log + barra
    const total = BOOT_LINES.length;
    for (let i = 0; i < total; i++) {
      printLine(BOOT_LINES[i]);
      let target = ((i + 1) / total) * 96;

      // Freeze controllato attorno a FREEZE_AT% (mood + hook EE-01)
      if (target >= FREEZE_AT && !barWrap.dataset.froze) {
        barWrap.dataset.froze = '1';
        setProgress(FREEZE_AT);
        barWrap.classList.add('glitch');
        await sleep(FREEZE_MS);
        barWrap.classList.remove('glitch');
      }
      setProgress(target);
      await sleep(160 + Math.random() * 160);
    }

    // Attendi preload reale + durata minima
    await preloadPromise;
    const elapsed = Date.now() - startTime;
    if (elapsed < MIN_BOOT_MS) await sleep(MIN_BOOT_MS - elapsed);

    setProgress(100);
    await sleep(420);
    finishBoot();
  }

  /* -----------------------------------------------------------
     finishBoot(): flash CRT, rimuove overlay, segnala il desktop
     ----------------------------------------------------------- */
  function finishBoot() {
    clearInterval(hexTimer);
    overlay.classList.add('boot-done');
    // Notifica al desktop che può inizializzarsi / animarsi
    document.dispatchEvent(new CustomEvent('lzyyy:booted'));
    overlay.addEventListener('transitionend', () => overlay.remove(), { once: true });
  }

  /* -----------------------------------------------------------
     Hook EE-01: click sulla barra durante il freeze → messaggio
     (gestione completa rimandata a easter-eggs.js; qui solo seme)
     ----------------------------------------------------------- */
  barWrap.addEventListener('click', () => {
    if (barWrap.classList.contains('glitch')) {
      const el = document.createElement('span');
      el.className = 'boot-line';
      el.innerHTML = '<span class="tag-warn">… non dovevi toccarla. (0x1A)</span>';
      logEl.appendChild(el);
    }
  });

  // Avvio al DOM pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runBootSequence);
  } else {
    runBootSequence();
  }
})();
