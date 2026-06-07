# PRODOS — Fake OS Website per Producer Sperimentale
> *"Un sistema operativo che si è ascoltato troppa roba strana e ha perso il filo della realtà."*

---

## 🎯 Concept

Un sito web che simula un sistema operativo immaginario — non Windows, non Mac, non Linux. **PRODOS**: un OS che sembra costruito da un producer che ha sampleato i propri crash di sistema. Glitch, rumore visivo, finestre che non si comportano come dovrebbero, easter egg nascosti ovunque.

L'obiettivo non è la coerenza. È la **personalità**.

---

## 🧱 Architettura del Progetto

```
prodos/
├── index.html              # Bootloader / schermata di avvio
├── desktop.html            # Desktop principale
├── style/
│   ├── base.css            # Reset + variabili CSS globali
│   ├── boot.css            # Stili schermata di avvio
│   ├── desktop.css         # Stili desktop + taskbar
│   ├── windows.css         # Sistema finestre draggable
│   └── glitch.css          # Effetti glitch riutilizzabili
├── js/
│   ├── boot.js             # Sequenza di avvio + testo terminale
│   ├── desktop.js          # Logica desktop (icone, finestre)
│   ├── windows.js          # Drag & drop, resize, z-index
│   ├── glitch.js           # Effetti glitch randomizzati
│   ├── tetris.js           # Gioco Tetris completo
│   ├── easter-eggs.js      # Tutti gli easter egg
│   └── filesystem.js       # Fake file system (cartelle, file mp3 → Spotify)
├── apps/
│   ├── synth-7.html        # ✅ FATTO — Step sequencer synth
│   ├── tetris.html         # App Tetris embedded
│   ├── file-manager.html   # File manager con le canzoni
│   ├── terminal.html       # Terminale fake con comandi segreti
│   ├── media-player.html   # Player audio fake (→ Spotify)
│   └── about.html          # "Chi sono" in formato crash report
├── assets/
│   ├── fonts/              # Font bitmap/glitch
│   ├── sounds/             # Suoni UI (click, errore, startup)
│   ├── icons/              # Icone pixel art custom
│   └── wallpapers/         # Sfondi generativi / glitch
└── README.md
```

---

## 🖥️ Schermate & Sezioni

### 1. BOOTLOADER (`index.html`)
La prima cosa che vede l'utente. Simula un avvio OS.

**Elementi:**
- Schermo nero con testo verde che scorre (stile terminale)
- Messaggi di avvio fake: `Loading audio kernel... [OK]`, `Mounting sample library... [WARN: 847 missing files]`, `Initializing chaos module... [OK]`
- Barra di avanzamento che si blocca, riparte, poi glitcha
- Transizione finale al desktop con effetto CRT flicker
- **Easter egg #1**: se l'utente clicca sulla barra di caricamento durante il freeze, appare un messaggio segreto

### 2. DESKTOP (`desktop.html`)
Il cuore del sito. Un desktop funzionante.

**Icone desktop:**
| Icona | App | Descrizione |
|-------|-----|-------------|
| 🎵 | File Manager | Le sue canzoni come file `.wav` / `.mp3` |
| 🧱 | Tetris | Tetris con la sua musica |
| 🎹 | SYNTH-7 | Step sequencer synth ✅ |
| 💻 | Terminale | Comandi segreti, easter egg via CLI |
| 📄 | About.exe | Bio in formato crash report / BSOD |
| 🔊 | SampleBank | Cartella con suoni strani (easter egg audio) |
| ⚠️ | System Error | Apre una finestra di errore che non si chiude |
| 🗑️ | Cestino | Contiene "cose eliminate" |

### 3. FILE MANAGER
```
📁 /home/prod/
├── 📁 Albums/
│   ├── 🎵 sanguini.wav        → Spotify
│   ├── 🎵 987.wav             → Spotify
│   ├── 🎵 CLICK!.wav          → Spotify
│   ├── 🎵 Occhi_Lucidi.wav    → Spotify
│   └── 🎵 Matematica.wav      → Spotify
├── 📁 Samples/
│   ├── 🔊 ventilatore_6h.wav  → easter egg audio
│   └── 🔊 frigo_3am.wav       → easter egg audio
├── 📁 Trash_Old_Projects/
│   └── ⚠️ [CORROTTO]
└── 📄 README.txt              → messaggio personale
```

### 4. TERMINALE
```bash
help            → lista comandi
whoami          → bio del producer
ls music/       → lista canzoni con link
play <canzone>  → apre Spotify
glitch          → attiva effetto glitch sul desktop
matrix          → easter egg visivo
sudo rm -rf /   → "errore" drammatico
secret          → ???
```

---

## ✨ Easter Egg Master List

| ID | Trigger | Effetto |
|----|---------|---------|
| EE-01 | Click barra boot durante freeze | Messaggio segreto |
| EE-02 | Konami Code (↑↑↓↓←→←→BA) | Chaos totale |
| EE-03 | Doppio click orologio taskbar | Orologio impazzisce |
| EE-04 | 7 finestre aperte insieme | "TOO MANY WINDOWS" + glitch |
| EE-05 | Terminale: `secret` | Audio nascosto |
| EE-06 | Trascina icona nel cestino | "Sei sicuro? [SI] [FORSE] [MAI]" |
| EE-07 | Tetris score > 1000 | Messaggio personalizzato |
| EE-08 | Idle 10 min | Screensaver glitch |
| EE-09 | Click destro → "Non fare questo" | Sorpresa |
| EE-10 | Sequenza click su icone specifiche | Sblocca traccia inedita |

---

## 🎨 Design System DEFINITIVO

Vedi `CLAUDE.md` per la palette e tipografia completa.

**Sintesi:** base fredda (#F0EDE8) + fosfori CRT (verde #D4F5A0, ambra #FFCC44).  
Font: VT323 / Orbitron / IBM Plex Mono / Share Tech Mono.

---

## 🛠️ Stack Tecnico

- Vanilla JS + HTML + CSS (no framework)
- Web Audio API (synth, suoni UI)
- CSS animations (glitch)
- Canvas API (visualizer, Tetris)
- Spotify Embed (musica)
- Deploy: GitHub Pages o Vercel

---

*PRODOS_SPEC · LZYYY_SYS · [INSTABILE]*
