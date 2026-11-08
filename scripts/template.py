#!/usr/bin/env python3
"""Pasang style dan penomoran dari template Word (assets/Normal.dotm) ke .docx hasil build_makalah.js.

Usage:
  template.py raw.docx out.docx [--template path/ke/template.dotm]

Yang diambil dari template: word/styles.xml (Heading 1-9, Heading Default/Title, Body Main/2/3,
Caption, Table of Figures, TOC 1-9, Daftar Pustaka, ...) dan word/numbering.xml (penomoran
otomatis BAB I, 1.1, 1.1.1, dst yang terikat ke style heading). Halaman, margin, header/footer,
dan isi tetap dari hasil build.

Penyesuaian kecil atas template (semuanya dilakukan di sini, file dotm asli tidak diubah):
  - spasi setelah Heading 1 jadi 12 pt (aturan makalah-unri);
  - semua style heading memakai satu daftar penomoran (numId 33), supaya 1.1.1 selalu
    melanjutkan 1.1 di Word maupun LibreOffice;
  - tab rata kanan TOC 1-3 dan Table of Figures dipasang di lebar teks (7937 twip) agar nomor
    halaman tidak keluar dari margin kanan.
Makro dan shortcut di dotm tidak ikut ke .docx (format docx tidak bisa membawa makro);
untuk memakainya, pasang Normal.dotm sebagai template (lihat README).
"""
import sys, os, re, zipfile, argparse

HERE = os.path.dirname(os.path.abspath(__file__))
DEFAULT_TEMPLATE = os.path.join(HERE, '..', 'assets', 'Normal.dotm')
TEXT_W = 7937           # A4 21 cm - kiri 4 cm - kanan 3 cm
HEADING_NUM_ID = '33'   # daftar penomoran heading di template
LIST_OFFSET = 100       # penomoran daftar bernomor dari build digeser supaya tidak bentrok


def style_block(xml, sid):
    m = re.search(r'<w:style\b[^>]*w:styleId="%s"[^>]*>.*?</w:style>' % re.escape(sid), xml, re.S)
    return m


def patch_styles(xml):
    # 1. Heading 1: spasi setelah 12 pt (240 twip) menggantikan 18 pt bawaan template
    m = style_block(xml, 'Heading1')
    if m:
        blk = m.group(0)
        new = re.sub(r'<w:spacing w:after="\d+"/>', '<w:spacing w:after="240"/>', blk, count=1)
        xml = xml.replace(blk, new)
    # 2. semua heading ke daftar penomoran yang sama
    for lvl in range(1, 10):
        m = style_block(xml, 'Heading%d' % lvl)
        if m:
            blk = m.group(0)
            new = re.sub(r'(<w:numPr>(?:<w:ilvl w:val="\d+"/>)?<w:numId w:val=")\d+("/>)', r'\g<1>%s\2' % HEADING_NUM_ID, blk)
            xml = xml.replace(blk, new)
    # 3. tab rata kanan daftar isi dan daftar gambar/tabel di lebar teks
    for sid in ['TOC%d' % i for i in range(1, 10)] + ['TableofFigures']:
        m = style_block(xml, sid)
        if m:
            blk = m.group(0)
            if 'w:leader="dot"' in blk:
                new = re.sub(r'(<w:tab w:val="right" w:leader="dot" w:pos=")\d+("/>)', r'\g<1>%d\2' % TEXT_W, blk)
            else:
                new = blk.replace('<w:pPr>', '<w:pPr><w:tabs><w:tab w:val="right" w:leader="dot" w:pos="%d"/></w:tabs>' % TEXT_W, 1) \
                    if '<w:pPr>' in blk else blk.replace('</w:style>', '<w:pPr><w:tabs><w:tab w:val="right" w:leader="dot" w:pos="%d"/></w:tabs></w:pPr></w:style>' % TEXT_W)
            xml = xml.replace(blk, new)
    return xml


def merge_numbering(tpl_xml, build_xml):
    """Gabungkan penomoran template (heading) dengan daftar bernomor dari build (rumusan masalah, dst)."""
    abs_blocks = re.findall(r'<w:abstractNum\b.*?</w:abstractNum>', build_xml, re.S)
    num_blocks = re.findall(r'<w:num\b[^>]*>.*?</w:num>', build_xml, re.S)
    abs_new = []
    for b in abs_blocks:
        b = re.sub(r'(<w:abstractNum\b[^>]*w:abstractNumId=")(\d+)(")', lambda m: m.group(1) + str(int(m.group(2)) + LIST_OFFSET) + m.group(3), b, count=1)
        abs_new.append(b)
    num_new = []
    for b in num_blocks:
        b = re.sub(r'(<w:num\b[^>]*w:numId=")(\d+)(")', lambda m: m.group(1) + str(int(m.group(2)) + LIST_OFFSET) + m.group(3), b, count=1)
        b = re.sub(r'(<w:abstractNumId w:val=")(\d+)(")', lambda m: m.group(1) + str(int(m.group(2)) + LIST_OFFSET) + m.group(3), b, count=1)
        num_new.append(b)
    i = tpl_xml.find('<w:num ')
    if i < 0:
        i = tpl_xml.rfind('</w:numbering>')
    out = tpl_xml[:i] + ''.join(abs_new) + tpl_xml[i:]
    j = out.rfind('</w:num>')
    j = j + len('</w:num>') if j >= 0 else out.rfind('</w:numbering>')
    return out[:j] + ''.join(num_new) + out[j:]


def used_styles(zin):
    ids = set()
    for name in zin.namelist():
        if name.startswith('word/') and name.endswith('.xml') and name not in ('word/styles.xml', 'word/numbering.xml'):
            s = zin.read(name).decode('utf8', 'ignore')
            ids |= set(re.findall(r'<w:(?:pStyle|rStyle|tblStyle) w:val="([^"]+)"', s))
    return ids


def apply_template(raw, out, template=DEFAULT_TEMPLATE):
    if not os.path.exists(template):
        raise SystemExit('Template tidak ditemukan: %s' % template)
    with zipfile.ZipFile(template) as zt:
        tpl_styles = zt.read('word/styles.xml').decode('utf8')
        tpl_num = zt.read('word/numbering.xml').decode('utf8')
    tpl_styles = patch_styles(tpl_styles)
    with zipfile.ZipFile(raw) as zin:
        build_styles = zin.read('word/styles.xml').decode('utf8')
        build_num = zin.read('word/numbering.xml').decode('utf8') if 'word/numbering.xml' in zin.namelist() else ''
        # style yang dipakai dokumen tetapi tidak ada di template: ambil dari hasil build
        have = set(re.findall(r'w:styleId="([^"]+)"', tpl_styles))
        missing = [s for s in sorted(used_styles(zin)) if s not in have]
        extra = ''
        for sid in missing:
            m = style_block(build_styles, sid)
            if m:
                extra += m.group(0)
            else:
                print('PERINGATAN: style "%s" dipakai tetapi tidak ada di template maupun build' % sid)
        if extra:
            tpl_styles = tpl_styles.replace('</w:styles>', extra + '</w:styles>')
            print('Style tambahan dari build:', ', '.join(missing))
        num_xml = merge_numbering(tpl_num, build_num) if build_num else tpl_num
        # nomor daftar di dokumen digeser sama seperti di numbering
        with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as zout:
            for item in zin.infolist():
                if item.is_dir():
                    continue  # folder kosong di zip bisa menggagalkan buka lewat layanan cloud
                d = zin.read(item.filename)
                if item.filename == 'word/styles.xml':
                    d = tpl_styles.encode('utf8')
                elif item.filename == 'word/numbering.xml':
                    d = num_xml.encode('utf8')
                elif item.filename == 'word/document.xml':
                    s = d.decode('utf8')
                    s = re.sub(r'(<w:numId w:val=")(\d+)(")', lambda m: m.group(1) + str(int(m.group(2)) + LIST_OFFSET) + m.group(3), s)
                    d = s.encode('utf8')
                zout.writestr(item, d)
    return out


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('raw')
    ap.add_argument('out')
    ap.add_argument('--template', default=DEFAULT_TEMPLATE)
    a = ap.parse_args()
    apply_template(a.raw, a.out, a.template)
    print('template terpasang:', a.out)
