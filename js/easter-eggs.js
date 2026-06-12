/*



                             :1;
                             wd8}
                             MM8L
                            lpbMOL
                ,)c)        tCpOcOp}            .1}       .l1}
                cdhp        qwd>;cmq1          !\MB}      {wBb
               +waM[       lc00  ,(Uqa}         QaBL      WBBr
               {pMM;       {c0[    ]CdBa1}       OdB}     8B8
               CbMh        cCO`.    :jq8BB       <cpM     Q8M . `.
              ;qhM0       cwMpcw~     .vv>        jcq[`;~~wM8ff(cLwc
              (baMc   `[cQMMWkp[`            `,![/ZaMbOOUcdMM[[][jv>
             ~ChabQ [cwppMMkf         `,[))c0cwWW8BB8M(.  cUM;
            'cObpbk0ppdqCUcr  `;~1cccwCwaMMMkkMWBOvY0O    ]ck/
         `[1cwhMhMMbpUf ]cbcwdkbpkbbaUvv>,cmw8bv   )Qq    <cqL
     l[cwbhaMWWWWWMr:    daW8W0vvv      [UOhU>     [Cp     cQM!
  ;[waMMMMMMMMMMMMMM)    <v(          lccOv>       cwp     !0ah,
  _qM88MMMaMaMr <aMMML       1L1,    /cQ0>        !whr      j0Mp}
  :vvvvv>]whab   jkM8ML     ~ckMMc ;/cOr          \WM[       jaM8`
       )ZaaMM>   :jaM8b      <vabMMcwp[          ;CMM         <v>
      lMB88k>      <vv>         vb8BMr            _[:
      <BMMv`                     <M8ML
                                  ;vv;
*/
/* =========================================================
   LZYYY_SYS — easter-eggs.js
   EE: dopo 20s nel sito appare un popup "antivirus" in basso a
   destra. Se ignorato (× / IGNORA / timeout), parte un "virus":
   finestre "ASCOLTA LAZYYY" che si moltiplicano.
   ========================================================= */

(() => {
  'use strict';

  const SPOTIFY = 'https://open.spotify.com/artist/2YYiyxIraQIGFYQUImQzk0';
  const POPUP_DELAY = 800;     // appare subito dopo il boot
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
        `Installa <b>LZYYY Antivirus™</b> per proteggere il sistema.` +
        `<div class="av-actions">` +
          `<div class="av-btn primary">INSTALLA ORA</div>` +
          `<div class="av-btn ghost">IGNORA</div>` +
        `</div>` +
        `<div class="av-legal">continuando accetti la ` +
          `<span class="lnk" data-p="privacy">privacy policy</span> e la ` +
          `<span class="lnk" data-p="cookie">cookie policy</span></div>` +
      `</div>`;
    document.body.appendChild(p);

    // Virus SOLO se l'utente ignora/chiude. Se non tocca nulla → niente.
    const dismiss = () => p.remove();
    p.querySelector('.x').onclick = () => { dismiss(); triggerVirus(); };
    p.querySelector('.av-btn.ghost').onclick = () => { dismiss(); triggerVirus(); };
    p.querySelector('.av-btn.primary').onclick = () => fakeInstall(p);
    p.querySelectorAll('.lnk').forEach((l) => {
      l.onclick = (e) => { e.stopPropagation(); showPolicy(l.dataset.p); };
    });
  }

  /* showPolicy(kind): finestra OS con la policy richiesta.
     Il sito non raccoglie nulla: le policy dicono questo, in tema. */
  function showPolicy(kind) {
    const POLICIES = {
      privacy: {
        title: 'PRIVACY.TXT',
        body:
          `Questo sito non raccoglie dati personali.<br>` +
          `Niente account, niente form, niente tracker, niente analytics.<br><br>` +
          `I font arrivano da Google Fonts: quando li scarichi, Google ` +
          `vede il tuo indirizzo IP (è l'unico).<br><br>` +
          `Tutto il resto vive e muore nel tuo browser.`,
      },
      cookie: {
        title: 'COOKIE.TXT',
        body:
          `Questo sito non usa cookie.<br><br>` +
          `Usa sessionStorage per ricordare lo stato del cestino: ` +
          `sparisce quando chiudi la scheda e non viene inviato a nessuno.<br><br>` +
          `Niente profilazione, niente terze parti.<br>` +
          `(le "3 minacce rilevate" non sono reali. forse.)`,
      },
    };
    const def = POLICIES[kind];
    if (!def || document.getElementById('policy-' + kind)) return;
    const win = document.createElement('div');
    win.className = 'win';
    win.id = 'policy-' + kind;
    win.style.cssText = 'position:fixed;left:50%;top:45%;transform:translate(-50%,-50%);' +
      'z-index:9000;max-width:360px;width:90%;';
    win.innerHTML =
      `<div class="win-title"><span>▤ ${def.title}</span>` +
      `<span class="win-close" title="chiudi">×</span></div>` +
      `<div class="win-body">${def.body}</div>`;
    win.querySelector('.win-close').onclick = () => win.remove();
    document.body.appendChild(win);
  }

  /* fakeInstall(p): scansione finta → sistema pulito, niente virus */
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
        msg.innerHTML = '<b>sistema pulito</b> · 0 minacce';
        setTimeout(() => p.remove(), 1300);
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
