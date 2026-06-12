# readme-art.py — pipeline dell'art di README.txt
# 1) data/readme-art.txt: ogni alfanumerico -> 'a' o 'A' random
#    (caratteri speciali e spazi intatti)
# 2) inietta l'art nella voce README.txt di apps/terminal.html
#    tra "lazy ma che ca..." e "...zzo"
import json
import random
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ART = ROOT / 'data' / 'readme-art.txt'
TERMINAL = ROOT / 'apps' / 'terminal.html'

# trasforma l'art: alfanumerici -> a/A random
art = ART.read_text(encoding='utf-8').replace('\r\n', '\n')
art = re.sub(r'[a-zA-Z0-9]', lambda m: random.choice('aA'), art)
ART.write_text(art, encoding='utf-8')

# righe pulite (niente spazi finali, niente righe vuote in coda)
rows = [l.rstrip() for l in art.split('\n')]
while rows and rows[-1] == '':
    rows.pop()
lines = ['lazy ma che caaaaaaaaaaaaaaaaaaaaaaaaaaaa', *rows,
         'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaazzo']

# inietta nel terminale al posto della voce README.txt esistente
html = TERMINAL.read_text(encoding='utf-8')
pattern = re.compile(r"'README\.txt': \[[\s\S]*?\]\.join\('\\n'\),")
if not pattern.search(html):
    raise SystemExit('blocco README non trovato in terminal.html')
entry = "'README.txt': " + json.dumps(lines, ensure_ascii=False) + ".join('\\n'),"
html = pattern.sub(lambda m: entry, html, count=1)
TERMINAL.write_text(html, encoding='utf-8')
print(f'art aggiornata · iniettate {len(lines)} righe')
