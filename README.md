# LZYYY_SYS

> *"Un OS che non è mai esistito negli anni 80"* — più pulito di DOS, più strano di qualsiasi cosa Apple abbia mai fatto.

Sito web per il producer **[lazyyy](https://open.spotify.com/artist/2YYiyxIraQIGFYQUImQzk0)**, costruito come un **fake OS retrò**: non un portfolio classico, ma un'esperienza interattiva con boot screen, desktop a finestre, app funzionanti, glitch controllati ed easter egg nascosti — il tutto con estetica CRT a fosfori verdi e ambra.

## App incluse

| App | Descrizione |
|-----|-------------|
| **SYNTH-7** | Synth skeuomorfico con oscilloscopio e manopole (Web Audio API) |
| **File Manager** | La discografia come file `.wav` con metadata fake → link Spotify |
| **Tetris** | Giocabile, con supporto touch e messaggi segreti |
| **Browser** | Presave + scheda OFFLINE: runner con canna che salta le foglie |
| **Terminale** | Comandi fake, tastiera virtuale su mobile, e qualche comando *non* documentato |
| **Chess** | Scacchi 1-bit stile Mac System 6/7, motore reale, CPU a 3 livelli |
| **Paint** | PAINT.EXE: canvas pixelato, 7 strumenti, flood fill, salva PNG |

Le finestre si trascinano, si chiudono e si massimizzano (`□`). Su mobile sono fullscreen.

## 🐣 Easter egg

> Spoiler totale. Se preferisci scoprirli da solo, fermati qui.

| Dove | Trigger | Cosa succede |
|------|---------|--------------|
| Desktop | Aspetta ~20s | Popup **LZYYY DEFENDER**: "3 minacce rilevate". Se lo ignori o lo chiudi, parte il virus: finestre **ASCOLTA LAZYYY** che si moltiplicano (ESC o pulsante PURGE per ripulire). Se installi l'antivirus, scansione finta e sistema pulito |
| Terminale | `secret` | Canale nascosto: messaggio criptico + drone audio generato al volo (EE-05) |
| Terminale | `rm -rf /` | Pioggia di errori "IL DISCO URLA", poi rientro: non è stato cancellato niente |
| Terminale | `sudo` | "no." |
| Terminale | `exit` | "non si esce da LZYYY_SYS." |
| Terminale | `date` | L'OS è convinto di essere nel 1987 |
| Terminale | `cat password.txt` | "bella prova." |
| Terminale | `trash` → `restore corrotto.prj` → `cat corrotto.prj` | Il file si oppone al ripristino, poi **si avvia da solo**: 33 secondi di glitch psichedelico a schermo intero (12 modalità, canna rotante, foglie, fumo) e alla fine **crash di sistema** — serve riavviare |
| Terminale | `glitch` | Scorciatoia nascosta: avvia direttamente l'animazione qui sopra |
| Terminale | `restore demo_v9_DEFINITIVO_vero.wav` | L'altro file nel cestino. Coerente anche nel File Manager (finché non chiudi il tab) |
| Tetris | Score > 1000 | "lazyyy ne ha fatti di numeri." (EE-07) |
| Browser | Apri una nuova scheda | Sempre OFFLINE: gioca al runner mentre "aspetti la rete" |
| Chess | Menu della menubar | Voci e dialog in pieno stile System 6, qualcuna meno seria delle altre |
| File Manager | Metadata dei file | Dimensioni tipo `847 TB`, date come `1987-03-14`, file `[CORROTTO]` con `-1 B` |

## Stack

- **Vanilla HTML/CSS/JS** — nessun framework
- **Web Audio API** per synth e suoni
- **Canvas API** per Tetris, Chess, Paint, glitch e gioco del browser
- **GitHub Actions** (`update-discography.yml`) per aggiornare automaticamente la discografia da Spotify in `data/discography.json`
- Deploy statico su **Vercel**

## Struttura

```
index.html       → boot screen + desktop
apps/            → le app dell'OS (synth, tetris, terminal, chess, paint, ...)
js/              → boot, desktop, easter egg
style/           → design system CRT (palette fosfori, scanlines, glitch)
scripts/         → fetch discografia da Spotify
data/            → discography.json
img/             → sprite (canna, foglia)
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
