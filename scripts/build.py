#!/usr/bin/env python3
"""Satu perintah untuk seluruh alur: cek isi -> bangun -> daftar isi -> validasi -> (opsional) preview.

Usage:
  python3 scripts/build.py content.json hasil/Makalah_Judul.docx [--strict] [--tabel] [--preview] [--tanpa-cek]

Semua path dihitung dari lokasi skrip ini, jadi boleh dijalankan dari folder mana pun.
Berkas sementara ditaruh di folder sementara sistem (bukan di folder pengguna).
"""
import sys, os, re, json, shutil, subprocess, tempfile, argparse

HERE = os.path.dirname(os.path.abspath(__file__))
ap = argparse.ArgumentParser()
ap.add_argument('content')
ap.add_argument('out')
ap.add_argument('--strict', action='store_true', help='peringatan validator dianggap galat')
ap.add_argument('--tabel', action='store_true', help='cetak tabel status referensi')
ap.add_argument('--preview', action='store_true', help='render halaman penting ke PNG')
ap.add_argument('--tanpa-cek', action='store_true', help='lewati check_content.py (tidak disarankan)')
args = ap.parse_args()

content = os.path.abspath(args.content)
out = os.path.abspath(args.out)
tmp = tempfile.mkdtemp(prefix='makalah_')
env = dict(os.environ)


def sh(cmd, check=True, **kw):
    return subprocess.run(cmd, check=check, text=True, **kw)


def banner(t):
    print(f'\n=== {t} ===', flush=True)


def node_env():
    e = dict(env)
    extra = [p for p in ('/usr/local/lib/node_modules_global', os.path.expanduser('~/.npm-global/lib/node_modules'),
                         os.path.join(HERE, '..', 'node_modules')) if os.path.isdir(p)]
    if extra:
        e['NODE_PATH'] = os.pathsep.join(extra + ([e['NODE_PATH']] if e.get('NODE_PATH') else []))
    return e


# 1. cek isi
if not args.tanpa_cek:
    banner('1. Cek isi (check_content.py)')
    cmd = [sys.executable, os.path.join(HERE, 'check_content.py'), content]
    if args.strict:
        cmd.append('--strict')
    if args.tabel:
        cmd.append('--tabel')
    if sh(cmd, check=False).returncode != 0:
        print('\nBuild dihentikan: perbaiki galat di atas lalu jalankan ulang.')
        sys.exit(1)

# 2. bangun docx mentah
banner('2. Bangun .docx (build_makalah.js)')
raw = os.path.join(tmp, 'raw.docx')
heads = os.path.join(tmp, 'headings.json')
r = subprocess.run(['node', os.path.join(HERE, 'build_makalah.js'), content, raw, heads],
                   text=True, capture_output=True, env=node_env())
print(r.stdout.strip())
if r.returncode != 0:
    print(r.stderr.strip() or 'build_makalah.js gagal (pastikan paket npm "docx" terpasang: npm install docx)')
    sys.exit(1)
m = re.search(r'rumus: (\d+)', r.stdout)
n_math = int(m.group(1)) if m else 0
n_inline = len(re.findall(r'(?<!\\)\$', open(content, encoding='utf8').read())) // 2

# 3. apakah LibreOffice di mesin ini bisa menggambar rumus?
paginasi = None
if n_math or n_inline:
    banner('3. Cek dukungan rumus di LibreOffice')
    probe_json = os.path.join(tmp, 'probe.json')
    json.dump({'meta': {'judul': 'p'}, 'bab': [{'judul': 'p', 'sections': [{'judul': 'p', 'blocks': [
        {'t': 'equation', 'latex': 'QWQ=\\frac{ZXZ}{2}'}]}]}], 'daftar_pustaka': []}, open(probe_json, 'w'))
    pr = subprocess.run(['node', os.path.join(HERE, 'build_makalah.js'), probe_json, os.path.join(tmp, 'probe.docx'), os.path.join(tmp, 'ph.json')],
                        text=True, capture_output=True, env=node_env())
    can_math = False
    if pr.returncode == 0:
        sys.path.insert(0, HERE)
        try:
            cmd = None
            for c in (os.environ.get('MAKALAH_SOFFICE'), '/mnt/skills/public/docx/scripts/office/soffice.py', shutil.which('soffice')):
                if c:
                    cmd = ['python3', c] if c.endswith('.py') else c.split()
                    break
            subprocess.run(cmd + ['--headless', '--convert-to', 'pdf', '--outdir', tmp, os.path.join(tmp, 'probe.docx')],
                           stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True, timeout=180)
            txt = subprocess.check_output(['pdftotext', os.path.join(tmp, 'probe.pdf'), '-']).decode(errors='ignore')
            can_math = 'QWQ' in txt
        except Exception:
            can_math = False
    if can_math:
        print('LibreOffice dapat menggambar rumus: nomor halaman dihitung langsung.')
    else:
        print('LibreOffice di mesin ini tidak dapat menggambar rumus: nomor halaman daftar isi dihitung dari kembaran paginasi (perkiraan).')
        paginasi = os.path.join(tmp, 'paginasi.docx')
        e = node_env()
        e['MAKALAH_PAGINASI'] = '1'
        pr = subprocess.run(['node', os.path.join(HERE, 'build_makalah.js'), content, paginasi, os.path.join(tmp, 'headings_pag.json')],
                            text=True, capture_output=True, env=e)
        if pr.returncode != 0:
            print(pr.stderr)
            sys.exit(1)

# 4. finalisasi daftar isi
banner('4. Isi daftar isi dan nomor halaman (finalize.py)')
os.makedirs(os.path.dirname(out), exist_ok=True)
cmd = [sys.executable, os.path.join(HERE, 'finalize.py'), raw, heads, out]
if paginasi:
    cmd += ['--paginasi', paginasi]
if sh(cmd, check=False).returncode != 0:
    print('finalize.py gagal')
    sys.exit(1)

# 5. validasi docx
banner('5. Validasi struktur .docx')
val = '/mnt/skills/public/docx/scripts/office/validate.py'
if os.path.exists(val):
    if sh([sys.executable, val, out], check=False).returncode != 0:
        print('PERINGATAN: validasi docx melaporkan masalah (lihat di atas).')
else:
    try:
        import zipfile
        with zipfile.ZipFile(out) as z:
            assert z.testzip() is None
            import xml.dom.minidom as md
            md.parseString(z.read('word/document.xml'))
        print('Validator docx bawaan tidak ada; cek dasar (zip + XML) lolos.')
    except Exception as ex:
        print('GAGAL cek dasar docx:', ex)
        sys.exit(1)

# 5b. rumus: bandingkan dengan LaTeX asli lewat pandoc (OMML -> LaTeX), bila pandoc tersedia
if n_math or n_inline:
    pandoc = shutil.which('pandoc')
    if pandoc:
        md = subprocess.run([pandoc, out, '-t', 'markdown'], capture_output=True, text=True).stdout
        n_back = len(re.findall(r'\$\$|(?<!\$)\$(?!\$)', md)) // 2
        print(f'Cek rumus (pandoc): {n_back} rumus terbaca kembali dari docx, {n_math} tampil + {n_inline} sebaris di sumber.')
        if n_back < n_math + n_inline:
            print('PERINGATAN: ada rumus yang tidak terbaca kembali, cek manual di Word.')
    else:
        print('pandoc tidak ada: cek rumus otomatis dilewati.')

# 6. preview
if args.preview:
    banner('6. Preview halaman')
    sh(['bash', os.path.join(HERE, 'preview.sh'), out])

print(f'\nSELESAI: {out}')
shutil.rmtree(tmp, ignore_errors=True)
