#!/usr/bin/env python3
"""Usage: finalize.py raw.docx headings.json out.docx

Mengisi cache daftar isi otomatis (judul + nomor halaman) supaya langsung
terlihat di Word, WPS, dan LibreOffice. Field TOC tetap hidup: klik kanan
daftar isi > Update Field bila isi makalah diubah.
"""
import sys, os, re, json, subprocess, tempfile, zipfile
from xml.sax.saxutils import escape

raw, hpath, out = sys.argv[1:4]
heads = json.load(open(hpath, encoding='utf8'))
SOFFICE = '/mnt/skills/public/docx/scripts/office/soffice.py'
TEXT_W = 7937
ROMAN = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x']


def to_pdf(docx, outdir):
    cmd = ['python3', SOFFICE] if os.path.exists(SOFFICE) else ['soffice']
    subprocess.run(cmd + ['--headless', '--convert-to', 'pdf', '--outdir', outdir, docx],
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
    return os.path.join(outdir, os.path.splitext(os.path.basename(docx))[0] + '.pdf')


def pages_of(pdf):
    n = int(re.search(r'Pages:\s+(\d+)', subprocess.check_output(['pdfinfo', pdf]).decode()).group(1))
    res = []
    for i in range(1, n + 1):
        txt = subprocess.check_output(['pdftotext', '-f', str(i), '-l', str(i), '-layout', pdf, '-']).decode()
        # buang baris daftar isi (titik-titik) supaya tidak terhitung sebagai heading
        res.append([' '.join(l.split()) for l in txt.splitlines() if '....' not in l])
    return res


def match(lines, page):
    if len(lines) == 2:  # "BAB I" lalu judul bab di baris berikutnya
        return any(page[i] == lines[0] and page[i + 1].startswith(lines[1][:25]) for i in range(len(page) - 1))
    key = lines[0][:40]
    return any(l.startswith(key) for l in page)


def compute(pages):
    babs = [h for h in heads if h['lines'][0].startswith('BAB ')]
    bab1 = next((i for i in range(2, len(pages)) if match(babs[0]['lines'], pages[i])), None)
    if bab1 is None:
        raise SystemExit('Heading Bab I tidak ditemukan di PDF')
    label = lambda p: ROMAN[p] if p < bab1 else str(p - bab1 + 1)
    entries, cur = [], 2
    for h in heads:
        if h.get('label'):  # HALAMAN JUDUL (i) dan DAFTAR ISI (ii) letaknya tetap
            entries.append((h['level'], h['text'], h['label']))
            continue
        found = next((p for p in range(cur, len(pages)) if match(h['lines'], pages[p])), None)
        if found is None:
            raise SystemExit('Heading tidak ditemukan: ' + h['text'])
        cur = found
        entries.append((h['level'], h['text'], label(found)))
    return entries


def entry_p(lvl, txt, pg, first=False):
    x = ('<w:p><w:pPr><w:pStyle w:val="TOC%d"/><w:tabs><w:tab w:val="right" w:leader="dot" w:pos="%d"/></w:tabs></w:pPr>'
         % (lvl, TEXT_W))
    if first:
        x += ('<w:r><w:fldChar w:fldCharType="begin"/></w:r><w:r><w:instrText xml:space="preserve"> TOC \\o "1-3" \\h \\z \\u </w:instrText></w:r>'
              '<w:r><w:fldChar w:fldCharType="separate"/></w:r>')
    return x + '<w:r><w:t xml:space="preserve">%s</w:t></w:r><w:r><w:tab/></w:r><w:r><w:t>%s</w:t></w:r></w:p>' % (escape(txt), pg)


def inject(entries, dst):
    paras = ''.join(entry_p(l, t, g, i == 0) for i, (l, t, g) in enumerate(entries))
    paras += '<w:p><w:r><w:fldChar w:fldCharType="end"/></w:r></w:p>'
    sdt = ('<w:sdt><w:sdtPr><w:alias w:val="Daftar Isi"/><w:docPartObj><w:docPartGallery w:val="Table of Contents"/>'
           '<w:docPartUnique/></w:docPartObj></w:sdtPr><w:sdtContent>' + paras + '</w:sdtContent></w:sdt>')
    with zipfile.ZipFile(raw) as zin, zipfile.ZipFile(dst, 'w', zipfile.ZIP_DEFLATED) as zout:
        for item in zin.infolist():
            d = zin.read(item.filename)
            if item.filename == 'word/document.xml':
                s = d.decode('utf8')
                i, j = s.find('<w:sdt>'), s.find('</w:sdt>') + 8
                d = (s[:i] + sdt + s[j:]).encode('utf8')
            zout.writestr(item, d)


tmp = tempfile.mkdtemp()
entries = compute(pages_of(to_pdf(raw, tmp)))
os.makedirs(os.path.dirname(os.path.abspath(out)), exist_ok=True)
for _ in range(3):  # daftar isi yang panjang bisa menggeser halaman, hitung ulang sampai stabil
    stage = os.path.join(tmp, 'stage.docx')
    inject(entries, stage)
    new = compute(pages_of(to_pdf(stage, tmp)))
    if new == entries:
        break
    entries = new
inject(entries, out)
for e in entries:
    print(e)
print('written', out)
