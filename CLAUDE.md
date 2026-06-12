# LZYYY_SYS — Claude Context

> Tutto quello che Claude deve sapere su questo progetto per continuare il lavoro senza dover rispiegare tutto da capo.

---

## 🎯 Cos'è il progetto

Un **sito web per il producer lazyyy** costruito come un **fake OS** — un sistema operativo immaginario degli anni 80 che non è mai esistito. Non è un portfolio normale: è un'esperienza interattiva con app funzionanti, easter egg nascosti, glitch visivi e un'estetica CRT su base fredda.

**URL Spotify:** https://open.spotify.com/artist/2YYiyxIraQIGFYQUImQzk0

---

## 🎵 L'artista: lazyyy

- **Nome d'arte:** lazyyy (tre y)
- **Nome OS:** LZYYY_SYS
- **Bio Spotify:** "wtf"
- **Genere:** sperimentale
- **Discografia principale:**
  - CLICK! (2026, album/single)
  - #FFFFFF (2026, album — titolo significativo per il design)
  - Non c'è pace (2025)
  - Canzoni popolari: *sanguini*, *987*, *CLICK!*, *Occhi Lucidi*, *Matematica*
- **Carattere:** il classico genio sperimentale che passa 6 ore a sampleare il suono di un ventilatore

---

## 🖥️ Concept OS

**Nome:** LZYYY_SYS  
**Tagline:** *"Un OS che non è mai esistito negli anni 80"*  
**Sottotitolo:** più pulito di DOS, più strano di qualsiasi cosa Apple abbia mai fatto

L'OS simula un sistema operativo immaginario anni 80 con:
- Boot screen con testo terminale animato
- Desktop con icone draggable
- Finestre apribili, trascinabili, minimizzabili
- Taskbar con orologio reale
- App funzionanti (vedi sotto)
- Glitch e malfunzionamenti controllati

---

## 🎨 Design System DEFINITIVO

### Filosofia visiva
Base **fredda e neutra** (quasi carta, quasi plastica anni 80). L'unico calore viene dai **fosfori del monitor** — verde CRT e ambra. Il contrasto non è tra colori: è tra *materico* e *luminoso*.

### Palette
```css
--white:    #f0ede8;   /* Cold White — base principale */
--offwhite: #e2ddd6;   /* Off White — superfici */
--grey-l:   #c8c3bc;   /* Grey Light — bordi */
--grey-m:   #8a857e;   /* Grey Mid — testo UI */
--grey-d:   #3a3732;   /* Grey Dark — testo corpo */
--black:    #111010;   /* Near Black — titoli */
--ph:       #d4f5a0;   /* Phosphor Green — CRT, elementi attivi */
--am:       #ffcc44;   /* Phosphor Amber — CRT, cursori, BPM */
--panel:    #1c1a17;   /* Pannelli scuri (synth, app interne) */
```

### Tipografia
| Font | Ruolo | Google Fonts |
|------|-------|-------------|
| VT323 | Titoli display, testi grandi | ✓ |
| Orbitron | Headers sezioni UI | ✓ |
| IBM Plex Mono | Testo corpo, descrizioni | ✓ |
| Share Tech Mono | Micro-label, sistemi, log | ✓ |

### Effetti visivi
- **Scanlines:** overlay fisso di linee orizzontali su tutto il display
- **Phosphor glow:** testo verde che respira lentamente (animation su text-shadow)
- **Amber cursor:** cursore blocco ambra, step-blink (non fade)
- **CRT flicker:** flickering occasionale e raro, come un vero monitor vecchio
- **Phosphor ghost:** doppio fantasma verde/ambra sul testo — simula persistenza CRT
- **Pixel noise:** rumore digitale animato su texture di sfondo

### Comportamento generale
- Tutto ha un glow sottile che respira
- Glitch rari ma precisi — non caos, ma **malfunzionamento controllato**
- Cursore crosshair su tutto il sito
- Scrollbar custom sottile

---

## 📁 Struttura cartelle progetto

```
ynglazy/
├── CLAUDE.md                  ← questo file
├── PRODOS_SPEC.md             ← spec completa del progetto
├── index.html                 ← boot screen (da fare)
├── desktop.html               ← desktop principale (da fare)
├── style/
│   ├── base.css               ← CSS variables + reset (da fare)
│   ├── boot.css               ← stili boot screen (da fare)
│   ├── desktop.css            ← stili desktop (da fare)
│   ├── windows.css            ← sistema finestre (da fare)
│   └── glitch.css             ← effetti glitch riutilizzabili (da fare)
├── js/
│   ├── boot.js                ← sequenza avvio (da fare)
│   ├── desktop.js             ← logica desktop (da fare)
│   ├── windows.js             ← drag & drop finestre (da fare)
│   ├── glitch.js              ← glitch randomizzati (da fare)
│   └── easter-eggs.js         ← tutti gli easter egg (da fare)
├── apps/                      ← vuota (synth-7 rimosso, da rifare)
└── design/
    ├── moodboard-retro.html   ← ✅ FATTO — moodboard stile scelto
    └── moodboard-5stili.html  ← ✅ FATTO — 5 direzioni estetiche
```

---

## 📱 App pianificate

| App | File | Stato | Note |
|-----|------|-------|------|
| SYNTH-7 | apps/synth.html | ✅ FATTO | Pannello scheuomorfico, oscilloscopio, manopole, mobile-ready |
| File Manager | apps/file-manager.html | ✅ FATTO | Canzoni come file .wav → link Spotify, dati da data/discography.json |
| Tetris | apps/tetris.html | ✅ FATTO | Touch: pulsanti + gesti swipe. EE-07 incluso |
| Browser | apps/browser.html | ✅ FATTO | Presave orcd.co + scheda OFFLINE con gioco dino |
| Terminale | apps/terminal.html | ✅ FATTO | Comandi fake; EE-05 `secret` → drone audio nascosto |
| Chess | apps/chess.html | ✅ FATTO | Mac System 6/7 1-bit, iso pixel-art, motore reale (perft-verificato), CPU 3 livelli |
| Paint | apps/paint.html | ✅ FATTO | PAINT.EXE: canvas 512×320 pixelato, 7 strumenti, flood fill, undo, save PNG, touch-ready |
| About.exe | — | ❌ RIMOSSA | Fatta e poi tolta su richiesta (2026-06-10) |
| SampleBank | — | ❌ RIMOSSA | Fatta e poi tolta su richiesta (2026-06-10) |

---

## 🐣 Easter Egg pianificati

| ID | Trigger | Effetto |
|----|---------|---------|
| EE-01 | Click barra boot durante freeze | Messaggio segreto testuale |
| EE-02 | Konami Code (↑↑↓↓←→←→BA) | Animazione chaos totale desktop |
| EE-03 | Doppio click orologio taskbar | Orologio impazzisce |
| EE-04 | 7 finestre aperte insieme | "TOO MANY WINDOWS" + glitch |
| EE-05 ✅ | Terminale: comando `secret` | Drone audio generato + messaggio criptico |
| EE-06 | Trascina icona nel cestino | "Sei sicuro? [SI] [FORSE] [MAI]" |
| EE-07 | Tetris score > 1000 | Messaggio personalizzato |
| EE-08 | Idle 10 min | Screensaver glitch |
| EE-09 | Click destro → "Non fare questo" | Sorpresa |
| EE-10 | Sequenza click su icone specifiche | Sblocca traccia inedita |

---

## 🗺️ Roadmap

### Fase 1 — Fondamenta ⬜
- [ ] Boot screen con animazione terminale
- [ ] Desktop base + taskbar
- [ ] Sistema finestre (drag, close, minimize, z-index)

### Fase 2 — App Core ✅
- [x] SYNTH-7
- [x] File Manager con canzoni → Spotify
- [x] Tetris
- [x] Terminale
- [x] Browser (presave + dino)
- ~~About.exe~~ / ~~SampleBank~~ — rimosse su richiesta

### Fase 3 — Contenuti ⬜
- [ ] Inserire canzoni reali con link Spotify
- [ ] Suoni UI custom (prodotti da lazyyy?)
- [ ] Sfondo generativo/animato
- [ ] Icone pixel art custom

### Fase 4 — Easter Egg & Polish ⬜
- [ ] Tutti gli easter egg
- [ ] Effetti glitch randomizzati
- [ ] Screensaver
- [ ] Deploy (GitHub Pages o Vercel)

---

## 🛠️ Stack tecnico

- **Vanilla JS + HTML + CSS** — nessun framework, massimo controllo
- **Web Audio API** — per il synth e i suoni UI
- **CSS animations** — per tutti gli effetti glitch
- **Canvas API** — per visualizer e Tetris
- **Spotify Embed** — per la musica nel file manager / Tetris
- **Deploy:** GitHub Pages o Vercel (statico, zero backend)

---

## 📝 Note sparse

- Mobile: schermata "questo OS non supporta schermi piccoli" (fake error) — feature, non bug
- Il login screen prima del desktop potrebbe avere una password easter egg
- I "file" nel file manager hanno metadata fake assurdi (dimensione: 847TB, data: 1987-03-14)
- Notifiche random del sistema ("SampleBank.exe non risponde")
- Il cursore è crosshair in tutto il sito

---

*LZYYY_SYS · CLAUDE.md · generato automaticamente · [INSTABILE]*
