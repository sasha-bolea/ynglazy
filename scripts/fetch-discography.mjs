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
   fetch-discography.mjs
   Scarica la discografia di lazyyy via Spotify API e scrive
   data/discography.json (solo progetti dove è artista principale).
   Usato dalla GitHub Action schedulata e lanciabile a mano:
     node --env-file=.env scripts/fetch-discography.mjs
   ========================================================= */
import { writeFile, mkdir } from 'node:fs/promises';

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const ARTIST = '2YYiyxIraQIGFYQUImQzk0';
const MARKET = 'IT';
const OUT = 'data/discography.json';

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('ERR: SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET mancanti');
  process.exit(1);
}

// Ottiene token client-credentials
async function getToken() {
  const r = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64'),
    },
    body: 'grant_type=client_credentials',
  });
  const j = await r.json();
  if (!j.access_token) throw new Error('token fail: ' + JSON.stringify(j));
  return j.access_token;
}

// GET autenticata
async function api(url, token) {
  const r = await fetch(url, { headers: { Authorization: 'Bearer ' + token } });
  if (!r.ok) throw new Error(`${r.status} ${url} :: ${await r.text()}`);
  return r.json();
}

async function main() {
  const token = await getToken();

  // Tutti i progetti dell'artista (album, single, compilation)
  let albums = [];
  let url = `https://api.spotify.com/v1/artists/${ARTIST}/albums?include_groups=album,single,compilation&market=${MARKET}&limit=50`;
  while (url) {
    const page = await api(url, token);
    albums.push(...page.items);
    url = page.next;
  }

  // Dedup per nome + solo dove è artista principale
  const seen = new Set();
  const projects = [];
  for (const a of albums) {
    if (a.artists[0]?.id !== ARTIST) continue;
    const key = a.name.toLowerCase().trim();
    if (seen.has(key)) continue;
    seen.add(key);

    // Tracce del progetto (solo dove è primary)
    let tracks = [];
    let turl = `https://api.spotify.com/v1/albums/${a.id}/tracks?market=${MARKET}&limit=50`;
    while (turl) {
      const tp = await api(turl, token);
      tracks.push(...tp.items);
      turl = tp.next;
    }
    tracks = tracks
      .filter((t) => t.artists[0]?.id === ARTIST)
      .map((t) => ({ name: t.name, ms: t.duration_ms, url: t.external_urls.spotify }));

    if (!tracks.length) continue;
    projects.push({
      name: a.name,
      type: a.album_type,
      date: a.release_date,
      url: a.external_urls.spotify,
      tracks,
    });
  }

  // Recente prima
  projects.sort((x, y) => (y.date || '').localeCompare(x.date || ''));

  await mkdir('data', { recursive: true });
  await writeFile(OUT, JSON.stringify({ updated: new Date().toISOString(), projects }, null, 2));
  console.log(`OK: ${projects.length} progetti → ${OUT}`);
}

main().catch((e) => { console.error('ERR', e.message); process.exit(1); });
