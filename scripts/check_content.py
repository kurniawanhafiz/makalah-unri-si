#!/usr/bin/env python3
"""Validator content.json sebelum makalah dibangun.

Usage:
  check_content.py content.json [--strict] [--tabel]

  --strict  peringatan juga dianggap galat (build berhenti)
  --tabel   cetak tabel status referensi (Markdown) untuk ringkasan akhir

GALAT (menghentikan build):
  - kolom wajib kosong, tipe blok salah, file gambar tidak ada, rumus kosong
  - tanda * atau $ tidak berpasangan
  - sitasi di teks yang tidak ada di daftar pustaka, dan sebaliknya
  - sitasi di bab penutup atau di studi kasus
  - daftar pustaka tidak urut abjad
  - jumlah tabel melebihi batas (bawaan 1, ubah lewat meta.maks_tabel)
  - jumlah referensi atau tahun terbit di luar meta.ref_config
PERINGATAN (hanya dilaporkan):
  - em dash, kata gemar AI, pembuka klise, label tebal **
  - studi kasus disebut di Bab I, tanpa label "contoh rekaan"
  - jumlah rumusan masalah dan tujuan tidak sama
  - entri pustaka tanpa link, link berakhir titik, bahasa referensi hanya perkiraan
"""
import sys, re, json, os, argparse, datetime, unicodedata

ap = argparse.ArgumentParser()
ap.add_argument('content')
ap.add_argument('--strict', action='store_true')
ap.add_argument('--tabel', action='store_true')
args = ap.parse_args()

errors, warns = [], []
err = lambda m: errors.append(m)
warn = lambda m: warns.append(m)

try:
    data = json.load(open(args.content, encoding='utf8'))
except Exception as e:
    print(f'GALAT: content.json tidak bisa dibaca: {e}')
    sys.exit(1)

meta = data.get('meta') or {}
cdir = os.path.dirname(os.path.abspath(args.content))
BLOCK_TYPES = {'p', 'quote', 'list', 'table', 'equation', 'image'}
YEAR = r'(?:19|20)\d{2}[a-z]?'
UP = r'[A-ZÀ-ÖØ-Þ]'
NAME = UP + r"[\w'’\-]*"
NARR = re.compile(rf'(?P<name>{NAME}(?:\s(?:dan|&)\s{NAME}|\sdkk\.|\set\sal\.)?)\s\((?P<year>{YEAR})\)')
PAREN = re.compile(rf'\(([^()]*?{YEAR}[^()]*)\)')
PART = re.compile(rf'(?P<name>{UP}[^,;()]*?),\s*(?P<year>{YEAR})\b')


# ---------- kolom wajib ----------
for k in ('judul', 'matkul', 'dosen'):
    if not str(meta.get(k, '')).strip():
        err(f'meta.{k} kosong')
for k, bad in (('dosen', 'Nama Dosen'), ('matkul', '...'), ('judul', '...')):
    if bad in str(meta.get(k, '')):
        warn(f'meta.{k} masih berisi placeholder "{bad}"')
if not data.get('bab'):
    err('daftar "bab" kosong')
dapus = data.get('daftar_pustaka') or []
if not dapus:
    err('daftar_pustaka kosong')


# ---------- jelajah isi ----------
def is_kasus(t):
    return bool(re.search(r'studi\s+kasus', t or '', re.I))


def block_texts(blocks, where):
    """yield (teks, jenis, letak). Rumus (latex) tidak ikut karena bukan prosa."""
    for bi, b in enumerate(blocks or []):
        t = b.get('t')
        loc = f'{where}, blok {bi + 1}'
        if t not in BLOCK_TYPES:
            err(f'{loc}: tipe blok tidak dikenal "{t}"')
            continue
        if t in ('p', 'quote'):
            yield b.get('text', ''), t, loc
        elif t == 'list':
            for it in b.get('items', []):
                yield it, t, loc
        elif t == 'table':
            yield b.get('caption', ''), t, loc
            for h in b.get('headers', []):
                yield h, t, loc
            for row in b.get('rows', []):
                if len(row) != len(b.get('headers', [])):
                    err(f'{loc}: jumlah kolom baris tabel tidak sama dengan header')
                for c in row:
                    yield c, t, loc
        elif t == 'image':
            p = b.get('path')
            if not p or not os.path.exists(p if os.path.isabs(p) else os.path.join(cdir, p)):
                err(f'{loc}: file gambar tidak ditemukan: {p}')
            for k in ('caption', 'sumber', 'alt'):
                if b.get(k):
                    yield b[k], t, loc
        elif t == 'equation':
            lat = b.get('latex')
            lat = ' '.join(lat) if isinstance(lat, list) else (lat or '')
            if not str(lat).strip():
                err(f'{loc}: blok equation tanpa latex')
            elif str(lat).count('{') != str(lat).count('}'):
                err(f'{loc}: kurung kurawal rumus tidak seimbang: {lat}')


items = []   # dict(text, bab, role, kasus, where)
tables = 0
figs = 0
eqs = 0
babs = data.get('bab') or []
nbab = len(babs)
for bi, bab in enumerate(babs):
    judul = str(bab.get('judul', ''))
    role = 'pendahuluan' if bi == 0 else ('penutup' if re.search(r'penutup|kesimpulan|saran', judul, re.I) or (nbab >= 3 and bi == nbab - 1) else 'isi')
    for si, sec in enumerate(bab.get('sections') or []):
        sec_where = f'subbab {bi + 1}.{si + 1} {sec.get("judul", "")}'
        sec_kasus = is_kasus(sec.get('judul'))
        groups = [(sec.get('blocks'), sec_where, sec_kasus)]
        for ki, sub in enumerate(sec.get('subs') or []):
            groups.append((sub.get('blocks'), f'sub-subbab {bi + 1}.{si + 1}.{ki + 1} {sub.get("judul", "")}', sec_kasus or is_kasus(sub.get('judul'))))
        for blocks, where, kasus in groups:
            for b in blocks or []:
                if b.get('t') == 'table':
                    tables += 1
                elif b.get('t') == 'image':
                    figs += 1
                elif b.get('t') == 'equation':
                    eqs += 1
            for text, kind, loc in block_texts(blocks, where):
                items.append(dict(text=str(text), bab=bi, role=role, kasus=kasus, where=loc, judul_bab=judul))

maks_tabel = int(meta.get('maks_tabel', 1))
if tables > maks_tabel:
    err(f'ada {tables} tabel, batas {maks_tabel} (ubah meta.maks_tabel bila memang diminta)')


# ---------- * dan $ berpasangan ----------
def bare(s):
    return s.replace('\\$', '')


for it in items + [dict(text=str(r), where='daftar pustaka') for r in dapus] + [dict(text=str(p), where='kata pengantar') for p in data.get('kata_pengantar', [])]:
    t = it['text']
    if bare(t).count('$') % 2:
        err(f'{it["where"]}: tanda $ tidak berpasangan: "{t[:60]}"')
    if len(re.findall(r'\*', re.sub(r'\$[^$]*\$', '', t))) % 2:
        err(f'{it["where"]}: tanda * (miring) tidak berpasangan: "{t[:60]}"')


# ---------- daftar pustaka ----------
def fold(s):
    return ''.join(c for c in unicodedata.normalize('NFKD', s) if not unicodedata.combining(c))


refs = []
for i, raw in enumerate(dapus):
    clean = str(raw).replace('*', '')
    m = re.match(rf'^(?P<authors>.+?)\s\((?P<year>{YEAR}|n\.d\.)\)\.', clean)
    if not m:
        warn(f'daftar pustaka #{i + 1} tidak cocok pola APA "Penulis (tahun).": {clean[:70]}')
        refs.append(dict(i=i, raw=clean, authors=clean.split('.')[0], surname1=clean.split(',')[0].strip().lower(), year=None, title=''))
        continue
    authors = m.group('authors').strip()
    rest = clean[m.end():].strip()
    title = rest.split('. ')[0] if rest else ''
    refs.append(dict(i=i, raw=clean, authors=authors, surname1=authors.split(',')[0].strip().lower(), year=m.group('year'), title=title, rest=rest))

keys = [re.sub(r'[^a-z0-9]', '', fold(r['raw']).lower()) for r in refs]
for a, b in zip(range(len(keys)), range(1, len(keys))):
    if keys[a] > keys[b]:
        err(f'daftar pustaka tidak urut abjad: "{refs[a]["raw"][:45]}..." berada sebelum "{refs[b]["raw"][:45]}..."')
        break

for r in refs:
    if not re.search(r'https?://', r['raw']):
        warn(f'daftar pustaka #{r["i"] + 1} tanpa link: {r["raw"][:60]}')
    elif re.search(r'https?://\S+\.$', r['raw']):
        warn(f'daftar pustaka #{r["i"] + 1}: link berakhir titik, hapus titiknya: {r["raw"][-40:]}')
    if re.search(r'doi', r['raw'], re.I) and not re.search(r'https://doi\.org/10\.\d{4,9}/\S+', r['raw']):
        warn(f'daftar pustaka #{r["i"] + 1}: penulisan DOI tidak berbentuk https://doi.org/10.xxxx/...')


# ---------- sitasi ----------
lewati = [str(x).lower() for x in meta.get('lewati_sitasi', [])]


def find_citations(text):
    found = []
    for m in NARR.finditer(text):
        found.append((m.group('name'), m.group('year'), m.group(0)))
    for m in PAREN.finditer(text):
        for part in m.group(1).split(';'):
            p = PART.search(part)
            if p:
                found.append((p.group('name'), p.group('year'), f'({part.strip()})'))
    return found


def first_token(name):
    return re.split(r'\s+(?:dan|&)\s+|\s+dkk\.?|\s+et\s+al\.?', name)[0].strip().lower()


def matches(name, year, r):
    if r['year'] is None:
        return False
    ft = first_token(name)
    return year == r['year'] and (ft == r['surname1'] or ft in r['surname1'])


cited_in = {r['i']: set() for r in refs}
for it in items:
    cites = find_citations(it['text'])
    if not cites:
        continue
    forbidden = it['role'] == 'penutup' or it['kasus']
    for name, year, raw in cites:
        if raw.lower() in lewati or f'{name} ({year})'.lower() in lewati:
            continue
        if forbidden:
            zona = 'bab penutup' if it['role'] == 'penutup' else 'studi kasus'
            err(f'sitasi di {zona} tidak diperbolehkan ({it["where"]}): {raw}')
            continue
        hit = [r for r in refs if matches(name, year, r)]
        if not hit:
            err(f'sitasi tidak ada di daftar pustaka ({it["where"]}): {raw}')
        for r in hit:
            cited_in[r['i']].add(it['bab'] + 1)

for r in refs:
    if not cited_in[r['i']]:
        err(f'daftar pustaka tidak disitasi di Bab I atau Bab II (hapus atau sitasi): {r["raw"][:70]}')


# ---------- ref_config ----------
cfg = meta.get('ref_config') or {}
ver = {str(v.get('ref', '')).replace('*', ''): v for v in data.get('verifikasi_referensi', [])}


def verif_for(r):
    for k, v in ver.items():
        if k and k in r['raw']:
            return v
    return None


ID_W = {'dan', 'yang', 'di', 'pada', 'untuk', 'dalam', 'terhadap', 'dengan', 'analisis', 'sistem', 'informasi', 'penerapan', 'pengaruh',
        'perancangan', 'rancang', 'bangun', 'berbasis', 'pengembangan', 'implementasi', 'studi', 'kajian', 'penggunaan', 'pembelajaran',
        'jurnal', 'teknologi', 'pendidikan', 'metode', 'sebagai', 'dari', 'atau', 'tentang', 'bagi', 'oleh', 'ilmiah', 'pemanfaatan', 'peran'}
EN_W = {'the', 'of', 'and', 'for', 'in', 'on', 'an', 'with', 'using', 'based', 'analysis', 'system', 'study', 'approach', 'review',
        'management', 'data', 'journal', 'to', 'from', 'by', 'towards', 'its', 'impact', 'design', 'development', 'learning', 'information'}


def lang_of(r):
    v = verif_for(r)
    if v and v.get('bahasa') in ('id', 'en'):
        return v['bahasa'], True
    text = fold((r.get('title', '') + ' ' + r.get('rest', '')[:160]).lower())
    words = re.findall(r'[a-z]+', text)
    idn = sum(w in ID_W for w in words)
    eng = sum(w in EN_W for w in words)
    return ('id' if idn > eng else 'en' if eng > idn else '?'), False


n = len(refs)
if 'jumlah' in cfg:
    cfg.setdefault('jumlah_min', cfg['jumlah'])
    cfg.setdefault('jumlah_maks', cfg['jumlah'])
if cfg.get('jumlah_min') and n < int(cfg['jumlah_min']):
    err(f'referensi {n}, minimal {cfg["jumlah_min"]} (meta.ref_config)')
if cfg.get('jumlah_maks') and n > int(cfg['jumlah_maks']):
    err(f'referensi {n}, maksimal {cfg["jumlah_maks"]} (meta.ref_config)')
tahun_min = cfg.get('tahun_min')
if not tahun_min and cfg.get('umur_maks_tahun') is not None:
    tahun_min = datetime.date.today().year - int(cfg['umur_maks_tahun'])
if tahun_min:
    for r in refs:
        y = re.match(r'\d{4}', r['year'] or '')
        if y and int(y.group()) < int(tahun_min):
            err(f'referensi terbit {y.group()}, lebih lama dari batas {tahun_min}: {r["raw"][:60]}')
langs = [lang_of(r) for r in refs]
if cfg.get('min_indonesia'):
    cid = sum(1 for lg, _ in langs if lg == 'id')
    perkiraan = any(not explicit for _, explicit in langs)
    if cid < int(cfg['min_indonesia']):
        msg = f'referensi berbahasa Indonesia {cid}, minimal {cfg["min_indonesia"]}' + (' (sebagian berupa perkiraan, cek manual atau isi bahasa di verifikasi_referensi)' if perkiraan else '')
        (warn if perkiraan else err)(msg)
if not data.get('verifikasi_referensi'):
    warn('verifikasi_referensi kosong: isi per sumber (ref, dicek_lewat, bahasa) agar tabel status referensi lengkap')
else:
    for r in refs:
        if not verif_for(r):
            warn(f'verifikasi_referensi tidak memuat sumber: {r["raw"][:60]}')

# ---------- gaya penulisan ----------
AI_WORDS = re.compile(r'\b(krusial|esensial|komprehensif|holistik|signifikan)\b', re.I)
OPENERS = re.compile(r'\b(dalam era|di era|seiring dengan perkembangan|seiring perkembangan|tidak dapat dipungkiri)\b', re.I)
for it in items:
    t = it['text']
    if '—' in t:
        warn(f'{it["where"]}: ada tanda pisah panjang (em dash)')
    if '**' in t:
        warn(f'{it["where"]}: ada label tebal ** di dalam teks')
    for m in AI_WORDS.finditer(t):
        warn(f'{it["where"]}: kata gemar AI "{m.group(0)}"')
    for m in OPENERS.finditer(t):
        warn(f'{it["where"]}: pembuka klise "{m.group(0)}"')
for i, p in enumerate(data.get('kata_pengantar', [])):
    if '—' in str(p):
        warn(f'kata pengantar paragraf {i + 1}: ada tanda pisah panjang (em dash)')

# ---------- aturan struktur ----------
for it in items:
    if it['bab'] == 0 and re.search(r'studi\s+kasus', it['text'], re.I):
        warn(f'{it["where"]}: studi kasus disebut di Bab I (hanya bila memang diminta)')
        break
kasus_text = ' '.join(it['text'] for it in items if it['kasus'])
if kasus_text and not re.search(r'rekaan', kasus_text, re.I):
    warn('studi kasus tidak memuat label "contoh rekaan" (wajib bila kasus dibuat sendiri)')


def list_count(bab_idx, pat):
    if bab_idx >= nbab:
        return None
    for sec in babs[bab_idx].get('sections') or []:
        if re.search(pat, sec.get('judul', ''), re.I):
            return sum(len(b.get('items', [])) for b in sec.get('blocks', []) if b.get('t') == 'list')
    return None


rm, tj = list_count(0, r'rumusan'), list_count(0, r'tujuan')
if rm and tj and rm != tj:
    warn(f'rumusan masalah {rm} butir, tujuan {tj} butir (sebaiknya sama)')

# ---------- laporan ----------
print(f'Isi: {nbab} bab, {tables} tabel, {figs} gambar, {eqs} rumus tampil, {len(refs)} referensi')
for w in warns:
    print('PERINGATAN:', w)
for e in errors:
    print('GALAT:', e)

if args.tabel:
    print('\n| No | Rujukan | Tahun | Bahasa | Disitasi di | Dicek lewat | Link |')
    print('|---|---|---|---|---|---|---|')
    for r, (lg, explicit) in zip(refs, langs):
        v = verif_for(r) or {}
        link = (re.search(r'https?://\S+', r['raw']) or [''])[0]
        bab_c = ', '.join(f'Bab {x}' for x in sorted(cited_in[r['i']])) or '-'
        lang = {'id': 'Indonesia', 'en': 'Inggris', '?': '?'}[lg] + ('' if explicit else '*')
        print(f'| {r["i"] + 1} | {r["authors"][:40]} | {r["year"] or "-"} | {lang} | {bab_c} | {v.get("dicek_lewat", "-")} | {link} |')
    if any(not e for _, e in langs):
        print('\n* bahasa perkiraan otomatis; isi "bahasa" di verifikasi_referensi untuk kepastian.')
    dibuang = data.get('sumber_dibuang') or []
    if dibuang:
        print('\nSumber yang tidak dipakai:')
        for d in dibuang:
            print(f'- {d.get("sumber", "?")}: {d.get("alasan", "-")}')

bad = errors or (args.strict and warns)
print('\nHASIL: ' + ('GAGAL' if bad else 'LOLOS') + f' ({len(errors)} galat, {len(warns)} peringatan)')
sys.exit(1 if bad else 0)
