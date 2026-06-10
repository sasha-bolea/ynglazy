# LZYYY_SYS

> *"Un OS che non è mai esistito negli anni 80"* — più pulito di DOS, più strano di qualsiasi cosa Apple abbia mai fatto.

Sito web per il producer **[lazyyy](https://open.spotify.com/artist/2YYiyxIraQIGFYQUImQzk0)**, costruito come un **fake OS retrò**: non un portfolio classico, ma un'esperienza interattiva con boot screen, desktop a finestre, app funzionanti, glitch controllati ed easter egg nascosti — il tutto con estetica CRT a fosfori verdi e ambra.

## App incluse

| App | Descrizione |
|-----|-------------|
| **SYNTH-7** | Synth skeuomorfico con oscilloscopio e manopole (Web Audio API) |
| **File Manager** | La discografia come file `.wav` con metadata fake → link Spotify |
| **Tetris** | Giocabile, con supporto touch e messaggi segreti |
| **Browser** | Presave + scheda OFFLINE con gioco del dino |
| **Terminale** | Comandi fake, e qualche comando *non* fake |
| **About.exe** | Bio in formato crash report |
| **SampleBank** | 9 pad sintetizzati via Web Audio |

## Stack

- **Vanilla HTML/CSS/JS** — nessun framework
- **Web Audio API** per synth e suoni UI
- **Canvas API** per visualizer e Tetris
- **GitHub Actions** (`update-discography.yml`) per aggiornare automaticamente la discografia da Spotify in `data/discography.json`
- Deploy statico su **Vercel**

## Struttura

```
index.html       → boot screen + desktop
apps/            → le app dell'OS (synth, tetris, terminal, ...)
js/              → boot, desktop, easter egg
style/           → design system CRT (palette fosfori, scanlines, glitch)
scripts/         → fetch discografia da Spotify
data/            → discography.json
```

## Avvio locale

Nessuna build: è un sito statico.

```bash
npx serve .
```

Per aggiornare la discografia serve un token Spotify (vedi `.env.example`):

```bash
node scripts/fetch-discography.mjs
```

---

*LZYYY_SYS · [INSTABILE]*
