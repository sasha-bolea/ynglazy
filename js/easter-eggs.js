/* =========================================================
   LZYYY_SYS — easter-eggs.js
   EE: dopo 20s nel sito appare un popup "antivirus" in basso a
   destra. Se ignorato (× / IGNORA / timeout), parte un "virus":
   finestre "ASCOLTA LAZYYY" che si moltiplicano.
   ========================================================= */

(() => {
  'use strict';

  const SPOTIFY = 'https://open.spotify.com/artist/2YYiyxIraQIGFYQUImQzk0';
  const POPUP_DELAY = 20000;   // 20s dall'avvio
  const IGNORE_AFTER = 12000;  // se il popup resta intoccato, conta come ignorato
  const MAX_VIRUS = 26;        // tetto finestre per non bloccare il browser
  const SPAWN_MS = 650;        // ritmo di moltiplicazione

  let virusFired = false;
  let viruses = [];
  let spawnTimer = null;
  let purgeBtn = null;

  /* start(): avvia il timer del popup dopo il boot */
  function start() { setTimeout(showAntivirus, POPUP_DELAY); }

  /* showAntivirus(): popup finto in basso a destra */
  function showAntivirus() {
    if (virusFired) return;
    const p = document.createElement('div');
    p.className = 'av-popup';
    p.innerHTML =
      `<div class="av-head"><span>⚠ LZYYY DEFENDER</span><span class="x" title="chiudi">×</span></div>` +
      `<div class="av-body">` +
        `<b>3 minacce rilevate</b> nel sistema.<br>` +
        `Installa <b>LZYYY Antivirus™</b> per rimuovere ` +
        `<i>orecchie_pigre.exe</i>.` +
        `<div class="av-actions">` +
          `<div class="av-btn primary">INSTALLA ORA</div>` +
          `<div class="av-btn ghost">IGNORA</div>` +
        `</div>` +
      `</div>`;
    document.body.appendChild(p);

    // Se resta intoccato troppo a lungo → conta come ignorato
    const ignoreTimer = setTimeout(() => {
      if (document.body.contains(p)) { p.remove(); triggerVirus(); }
    }, IGNORE_AFTER);

    const dismiss = () => { clearTimeout(ignoreTimer); p.remove(); };
    p.querySelector('.x').onclick = () => { dismiss(); triggerVirus(); };
    p.querySelector('.av-btn.ghost').onclick = () => { dismiss(); triggerVirus(); };
    p.querySelector('.av-btn.primary').onclick = () => { clearTimeout(ignoreTimer); fakeInstall(p); };
  }

  /* fakeInstall(p): scansione finta → "minaccia" → virus comunque */
  function fakeInstall(p) {
    const body = p.querySelector('.av-body');
    body.innerHTML =
      `<b>Scansione in corso…</b>` +
      `<div class="av-scan"><i></i></div>` +
      `<div class="msg">analisi processi…</div>`;
    const bar = body.querySelector('i');
    const msg = body.querySelector('.msg');
    let v = 0;
    const t = setInterval(() => {
      v += 8;
      bar.style.width = Math.min(100, v) + '%';
      if (v >= 100) {
        clearInterval(t);
        msg.innerHTML = '1 minaccia trovata: <b>non_ascolta_lazyyy</b>';
        setTimeout(() => { p.remove(); triggerVirus(); }, 1300);
      }
    }, 120);
  }

  /* triggerVirus(): avvia l'infestazione */
  function triggerVirus() {
    if (virusFired) return;
    virusFired = true;
    spawnVirus(); spawnVirus();
    spawnTimer = setInterval(() => {
      if (viruses.length < MAX_VIRUS) spawnVirus();
      else stopSpawning();
    }, SPAWN_MS);
    showPurge();
    window.addEventListener('keydown', onEsc);
  }

  function onEsc(e) { if (e.key === 'Escape') purgeAll(); }
  function stopSpawning() { clearInterval(spawnTimer); spawnTimer = null; }

  /* spawnVirus(): crea una finestra virus in posizione casuale */
  function spawnVirus() {
    if (viruses.length >= MAX_VIRUS) return;
    const w = document.createElement('div');
    w.className = 'virus-win';
    const x = Math.random() * (window.innerWidth - 200);
    const y = Math.random() * (window.innerHeight - 170 - 30);
    w.style.left = Math.max(0, x) + 'px';
    w.style.top  = Math.max(0, y) + 'px';
    w.innerHTML =
      `<div class="vw-head"><span>♪ SYSTEM</span><span class="x" title="chiudi">×</span></div>` +
      `<div class="vw-body">` +
        `<div class="big">ASCOLTA<br>LAZYYY</div>` +
        `<a href="${SPOTIFY}" target="_blank" rel="noopener">▶ apri spotify</a>` +
      `</div>`;
    // Chiuderne una ne fa nascere due (si moltiplica)
    w.querySelector('.x').onclick = () => {
      removeVirus(w);
      spawnVirus(); spawnVirus();
    };
    document.body.appendChild(w);
    viruses.push(w);
  }

  function removeVirus(w) { w.remove(); viruses = viruses.filter((v) => v !== w); }

  /* showPurge(): pulsante per terminare tutto */
  function showPurge() {
    purgeBtn = document.createElement('div');
    purgeBtn.className = 'virus-purge';
    purgeBtn.textContent = '⏻ TERMINA TUTTO (ESC)';
    purgeBtn.onclick = purgeAll;
    document.body.appendChild(purgeBtn);
  }

  /* purgeAll(): rimuove tutte le finestre virus e ferma lo spawn */
  function purgeAll() {
    stopSpawning();
    viruses.forEach((v) => v.remove());
    viruses = [];
    if (purgeBtn) { purgeBtn.remove(); purgeBtn = null; }
    window.removeEventListener('keydown', onEsc);
  }

  // Parte dopo il boot del desktop
  document.addEventListener('lzyyy:booted', start, { once: true });
})();
