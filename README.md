# makalah-unri-si

Skill untuk membuat **makalah kuliah berbahasa Indonesia** dalam format `.docx` yang siap dikumpulkan, khusus **Program Studi Sistem Informasi, FMIPA, Universitas Riau (UNRI)**. Cover, daftar isi otomatis, penomoran halaman, penomoran heading, rumus, gambar, dan daftar pustaka APA sudah diatur oleh skrip, jadi pengguna cukup memberi materi dan referensi.

> **Dibuat oleh Kurniawan Hafiz** | Versi 6.1.0 | [English](README.en.md)

## Apa yang baru di v6.1

- **Keluaran bawaan `.docm`.** Proyek VBA, shortcut keyboard, dan building block dari `assets/Normal.dotm` ikut tersalin ke makalah, jadi Ctrl+1 sampai Ctrl+9 (heading), Ctrl+D (daftar isi), Ctrl+G (keterangan gambar), Ctrl+T (keterangan tabel), dan lainnya langsung aktif tanpa memasang template.
- `--docx` menghasilkan `.docx` biasa tanpa makro, untuk portal kampus yang menolak `.docm`.
- Struktur `.docm` diperiksa otomatis (zip dan XML valid, makro, shortcut, dan building block tersalin utuh dari template). Makronya sendiri belum bisa dijalankan di mesin pembuat; cek langkah di bagian [Template Word dan makro](#template-word-dan-makro).

## Apa yang baru di v6

- **Memakai template Word `assets/Normal.dotm`.** Heading 1 ("BAB I"), Heading 2 (1.1), Heading 3 (1.1.1) sampai Heading 9 bernomor otomatis; DAFTAR ISI, KATA PENGANTAR, dan DAFTAR PUSTAKA memakai style Heading Default (Title); paragraf memakai Body Main, Body 2, dan Body 3. Hasilnya mudah diedit sendiri di Word: ganti level heading lewat style, nomor ikut berubah.
- **Daftar Gambar dan Daftar Tabel otomatis** bila makalah punya gambar atau tabel (keterangan memakai style Caption dengan nomor otomatis).
- Ukuran font cover: seluruh teks cover 13 (supaya baris fakultas tidak patah jadi dua baris). Varian dasar `makalah-unri` tetap 14.
- Label "contoh rekaan" tidak dipakai lagi, dan data pribadi dibersihkan dari contoh dan dokumentasi.
- Cara pasang di Claude Code, Hermes Agent, dan OpenClaw ada di bagian [Cara pasang](#cara-pasang).

### Yang sudah ada di v5

- **Consensus AI dan OpenAlex dipakai bersamaan.** Bila kedua konektor terpasang, terhubung, dan belum limit, tiap butir materi dicari di keduanya, hasil digabung, dan duplikat dibuang. Bisa juga menetapkan di prompt salah satu sebagai utama dan yang lain pelengkap, atau membagi tugas keduanya.
- Bila hanya satu konektor yang tersedia, skill memakai yang tersedia lalu melengkapi dengan pencarian web. Bila tidak ada, skill memakai pencarian web (DOAJ, Garuda, laman jurnal, dst).
- Ketentuan bawaan tiap konektor: open access, tanpa preprint, 5 tahun terakhir (OpenAlex: karya, `fulltext`, Boolean dan stemming aktif). Bisa diganti lewat prompt.
- Sumber berbahasa Indonesia dicari lewat semua jalur sekaligus, lalu pencarian web bila masih kurang.
- Hasil Consensus tanpa DOI dicocokkan lewat OpenAlex, dan semua sumber tetap diverifikasi ke laman aslinya.

### Yang sudah ada sejak v3

- Daftar pustaka rata kiri-kanan dan menggantung sudah dipasang langsung di skrip, begitu juga spasi 12 pt setelah Heading 1.
- Satu perintah untuk seluruh alur: `python3 scripts/build.py content.json hasil.docx`.
- Blok `equation` (LaTeX jadi equation Word yang bisa diedit), rumus sebaris `$...$`, dan blok `image` dengan keterangan "Gambar n." otomatis.
- Validator `check_content.py` sebelum build: sitasi, urutan abjad, jumlah dan tahun referensi, bahasa, em dash, dan kata gemar AI.
- `preview.sh` merender cover, daftar isi, halaman bab, dan daftar pustaka ke PNG.
- Tabel status referensi untuk ringkasan akhir.
- Skrip tidak lagi terkunci ke path tertentu.

Daftar lengkap ada di [CHANGELOG.md](CHANGELOG.md).

## Apa yang dihasilkan

Satu file `.docm` (atau `.docx` dengan `--docx`) dengan urutan: cover, daftar isi, daftar gambar dan daftar tabel (bila ada), kata pengantar, Bab I Pendahuluan, Bab II Pembahasan, Bab III Penutup, daftar pustaka.

Format yang sudah dipasang:

- Kertas A4, margin 4-3-3-3 (kiri 4 cm, atas 3, kanan 3, bawah 3).
- Times New Roman 12, spasi 1,5, rata kiri-kanan. Seluruh teks cover memakai ukuran 13.
- Cover selalu menampilkan baris fakultas dan program studi di atas nama universitas. Keduanya bisa diganti lewat `meta.fakultas` dan `meta.prodi`.
- Nomor halaman: cover dihitung halaman i tetapi nomornya disembunyikan; daftar isi dan kata pengantar memakai angka romawi di tengah bawah; Bab I sampai III memakai angka mulai 1 di kanan bawah; daftar pustaka tanpa nomor yang terlihat.
- Penomoran heading otomatis dari style template: BAB I, 1.1, 1.2, 2.1, dan sub-subbab 2.4.1.
- Daftar isi otomatis (field TOC level 1 sampai 3) lengkap dengan nomor halaman.
- Daftar pustaka gaya APA 7, urut abjad, menggantung sekaligus rata kiri-kanan, dengan link DOI atau link open access yang valid.
- Tabel dihindari (maksimal satu per makalah).

Cover pada varian ini:

```
FAKULTAS MATEMATIKA DAN ILMU PENGETAHUAN ALAM
PROGRAM STUDI SISTEM INFORMASI
UNIVERSITAS RIAU
```

## Aturan isi yang dipegang skill

- Bab III (kesimpulan dan saran) bebas sitasi.
- Studi kasus ditulis tanpa sitasi dan tidak masuk ke latar belakang, rumusan masalah, atau tujuan, kecuali diminta.
- Semua kutipan berupa parafrase; klaim dari sumber hanya sebatas yang benar-benar dibaca.
- Sumber yang tidak bisa diverifikasi tidak dipakai, dan sumber tidak pernah dikarang.
- Gaya bahasa baku dan natural, tanpa tanda pisah panjang dan tanpa pola kalimat khas AI.

Sebagian aturan itu sekarang dicek mesin lewat `check_content.py`, jadi pelanggaran keras menghentikan build.

## Isi folder

```
makalah-unri-si/
├── README.md                   # file ini
├── README.en.md                # versi Inggris
├── SKILL.md                    # instruksi skill untuk Claude
├── CHANGELOG.md                # catatan perubahan
├── LICENSE                     # MIT
├── variant.json                # penanda varian (cover)
├── assets/
│   ├── Normal.dotm             # template Word (style, penomoran heading, makro dan shortcut)
│   ├── logo_unri.png           # logo untuk cover
│   ├── example_content.json    # contoh isi makalah (rumus, gambar, sitasi)
│   ├── example_diagram.png     # gambar untuk contoh
│   └── prompt_template.md      # template prompt bila skill tidak terpasang
├── references/
│   └── schema.md               # skema content.json
└── scripts/
    ├── build.py                # satu perintah: cek, bangun, daftar isi, validasi, preview
    ├── check_content.py        # validator isi sebelum build
    ├── build_makalah.js        # membangun .docx dari content.json
    ├── omml.js                 # konverter LaTeX ke equation Word
    ├── template.py             # memasang style dan penomoran dari Normal.dotm
    ├── finalize.py             # mengisi daftar isi, daftar gambar/tabel, dan nomor halaman
    └── preview.sh              # render halaman penting ke PNG
```

## Cara pasang

Ganti `<username>` dengan nama akun GitHub pemilik repo ini. Setelah dipasang, mulai sesi atau chat baru supaya skill terbaca, lalu panggil dengan `/makalah-unri-si`.

### Claude (claude.ai atau aplikasi desktop)

1. Di halaman repo ini, klik **Code**, lalu **Download ZIP**.
2. Di Claude, buka **Settings**, lalu menu **Skills**, dan upload file zip tadi.
3. Mulai chat baru supaya skill terbaca.

Catatan:

- Kalau sudah ada skill dengan nama sama, hapus yang lama dulu sebelum upload versi baru.
- Zip dari GitHub berisi folder bernama `makalah-unri-si-main`. Kalau upload ditolak karena nama folder, ekstrak zip-nya, ganti nama foldernya jadi `makalah-unri-si`, kompres lagi, lalu upload.

### Claude Code

Skill pribadi (berlaku di semua proyek):

```bash
git clone https://github.com/<username>/makalah-unri-si.git ~/.claude/skills/makalah-unri-si
```

Atau per proyek: clone ke `.claude/skills/makalah-unri-si` di folder proyek. Tanpa git, ekstrak zip lalu pindahkan foldernya ke `~/.claude/skills/` dengan nama `makalah-unri-si`. Buka sesi Claude Code baru, lalu ketik `/makalah-unri-si`.

### Hermes Agent

Skill Hermes berada di `~/.hermes/skills/` (setiap skill satu folder berisi `SKILL.md`):

```bash
git clone https://github.com/<username>/makalah-unri-si.git ~/.hermes/skills/makalah-unri-si
```

Alternatif: simpan skill di folder lain lalu daftarkan di `~/.hermes/config.yaml`:

```yaml
skills:
  external_dirs:
    - ~/folder-skill-saya
```

Mulai sesi baru, lalu panggil `/makalah-unri-si` atau minta Hermes membuat makalah.

### OpenClaw

Taruh foldernya di folder `skills` workspace OpenClaw (skill workspace punya prioritas tertinggi):

```bash
git clone https://github.com/<username>/makalah-unri-si.git <workspace>/skills/makalah-unri-si
```

`<workspace>` adalah folder workspace agenmu. Mulai sesi baru supaya skill terbaca. Bila tidak muncul, cek dokumentasi OpenClaw bagian Skills (urutan folder dan pengaturan `skills.load.extraDirs`).

### Kebutuhan di luar Claude

Di Claude Code, Hermes Agent, dan OpenClaw, skill ini memakai shell milik agen. Pasang dulu: Node.js, Python 3, LibreOffice (`soffice`), dan di folder skill jalankan `npm install docx`. Opsional: `pandoc` dan `poppler-utils` untuk cek rumus dan preview. Pencarian referensi lewat konektor Consensus dan OpenAlex hanya berjalan di agen yang punya konektor itu; selain itu skill memakai pencarian web.

### Template Word dan makro

Makalah dibuat sebagai `.docm` yang membawa makro dari `assets/Normal.dotm`. Cara pakai:

1. Bila `.docm` diunduh dari internet, klik kanan berkas, pilih **Properties**, centang **Unblock**, lalu OK. Tanpa ini Word memblokir makro.
2. Buka di Word, lalu klik **Enable Content** pada bilah kuning.
3. Cek cepat: `Ctrl+D` untuk daftar isi, `Ctrl+G` untuk keterangan gambar.

Beberapa shortcut di template: `Ctrl+1` sampai `Ctrl+9` heading, `Ctrl+D` daftar isi, `Ctrl+G` keterangan gambar, `Ctrl+T` keterangan tabel, `Ctrl+L` keterangan lampiran, `Alt+R` dan `Alt+L` nomor halaman romawi dan angka, `Alt+N` section baru, `Alt+S` ekspor PDF.

Bila portal kampus menolak `.docm`: di Word pilih **Save As** lalu format `.docx` (makro hilang, style dan penomoran tetap), atau bangun dengan `--docx`. Makro tidak bisa disimpan di `.docx`. Untuk dokumen `.docx` yang tetap ingin memakai shortcut, pasang `assets/Normal.dotm` lewat **Developer > Document Template > Attach** (jangan centang "Automatically update document styles").

## Cara pakai dengan panggil skill

Panggil skill dengan `/makalah-unri-si` di chat, lalu kirim data makalahnya. Contoh:

```
/makalah-unri-si
Buatkan makalah.
- Judul: Kombinasi, Permutasi, dan Koefisien Binomial
- Mata kuliah: Matematika Diskrit
- Dosen pengampu: Nama Dosen, gelar.
- Jumlah anggota: 4
- Materi / poin bahasan:
  - Pengertian dan jenis kombinasi
  - Pengertian dan jenis permutasi
  - Koefisien binomial
- Referensi: 10 jurnal, terbit 10 tahun terakhir, minimal 5 berbahasa Indonesia
- Studi kasus: 1, bertema TI/SI, tanpa referensi
- Rumus pakai equation
```

Data yang wajib: judul, mata kuliah, dosen pengampu, dan poin bahasan. Syarat referensi (jumlah, rentang tahun, minimal berbahasa Indonesia) dan ada tidaknya studi kasus sebaiknya disebut; kalau tidak, Claude akan menanyakannya. Jumlah anggota default 4, dan logo UNRI sudah dipakai otomatis.

Setelah file jadi:

- Edit nama anggota, NIM (`( NIM )`), dan bulan-tahun di kata pengantar.
- Klik kanan daftar isi lalu pilih **Update Field** supaya nomor halaman pasti, terutama bila makalah memuat rumus.

## Cara pakai manual (tanpa Claude)

Kebutuhan: Node.js, paket npm `docx`, Python 3, LibreOffice (`soffice`) untuk menghitung nomor halaman, dan opsional `pandoc` dan `poppler-utils` (`pdftoppm`, `pdftotext`) untuk cek rumus dan preview.

```bash
npm install docx

# 1. salin dan edit contoh isi (skemanya ada di references/schema.md)
cp assets/example_content.json content.json

# 2. satu perintah: cek isi, bangun, daftar isi, validasi, preview
python3 scripts/build.py content.json hasil/Makalah_Judul.docm --tabel --preview
```

Opsi `build.py`:

| Opsi | Fungsi |
|---|---|
| `--strict` | Peringatan validator ikut menghentikan build |
| `--tabel` | Cetak tabel status referensi |
| `--preview` | Render halaman penting ke PNG di `hasil/Makalah_Judul_preview/` |
| `--docx` | Keluaran `.docx` biasa tanpa makro (bawaan: `.docm`) |
| `--tanpa-cek` | Lewati validator (tidak disarankan) |
| `--template berkas.dotm` | Pakai template Word lain (bawaan `assets/Normal.dotm`) |

Variabel lingkungan `MAKALAH_SOFFICE` bisa dipakai untuk menunjuk perintah LibreOffice tertentu.

## Format `content.json`

Ringkasnya: `meta` (judul, matkul, dosen, universitas, tahun, jumlah_anggota, kota, bulan_tahun, opsional fakultas, prodi, logo, maks_tabel, ref_config), `kata_pengantar` (array paragraf), `bab` (array bab berisi `sections` dan `blocks`), `daftar_pustaka` (array string APA 7), `verifikasi_referensi`, dan `sumber_dibuang`. Tipe blok: `p`, `quote`, `list`, `table`, `equation`, `image`. Penjelasan lengkap ada di [`references/schema.md`](references/schema.md).

## Batasan yang diketahui

- LibreOffice tanpa modul Math tidak menggambar rumus. Di mesin seperti itu rumus kosong di preview dan nomor halaman daftar isi dihitung dari perkiraan. Di Word rumus tampil normal; klik kanan daftar isi lalu **Update Field** untuk angka pasti.
- Konverter rumus mendukung subset LaTeX (lihat schema). Perintah di luar daftar menimbulkan galat saat build, bukan hasil diam-diam salah.
- Validator membaca sitasi dengan pola `Penulis (tahun)` dan `(Penulis, tahun)`. Pola yang tidak biasa bisa terlewat atau salah baca; pakai `meta.lewati_sitasi` untuk kasus yang sengaja.
- Bahasa referensi dihitung dari `verifikasi_referensi[].bahasa`; tanpa itu hanya perkiraan.
- Skill tidak bisa memastikan sebuah link terbuka dari mesinmu. Periksa kembali setiap referensi sebelum dikumpulkan.

## Pemecahan masalah

| Gejala | Penyebab dan solusi |
|---|---|
| `Cannot find module 'docx'` | Jalankan `npm install docx` di folder skill, atau pasang global. |
| `LibreOffice (soffice) tidak ditemukan` | Pasang LibreOffice atau set `MAKALAH_SOFFICE`. |
| Build berhenti dengan GALAT sitasi | Sitasi di teks harus ada di daftar pustaka dan sebaliknya; Bab III dan studi kasus tidak boleh bersitasi. |
| Rumus kosong di preview | Lihat batasan di atas. Cek di Word. |
| Nomor halaman daftar isi meleset | Klik kanan daftar isi, **Update Field**. |
| Zip ditolak saat upload skill | Ganti nama folder hasil ekstrak jadi `makalah-unri-si`, kompres ulang. |
| Shortcut Word dari template tidak jalan | Pastikan berkas `.docm`, sudah di-Unblock (Properties), dan Enable Content diklik. File `.docx` tidak membawa makro. |

## Catatan

- Logo UNRI adalah milik Universitas Riau. File logo disertakan hanya sebagai kelengkapan cover tugas kuliah.
- Nama anggota, NIM, dan tanggal selalu berupa placeholder dan harus diedit sendiri.
- Periksa kembali setiap referensi sebelum dikumpulkan.

## Lisensi dan kredit

Dirilis dengan lisensi MIT (lihat [LICENSE](LICENSE)). Dibuat oleh **Kurniawan Hafiz**.
