# makalah-unri-si

Skill untuk membuat **makalah kuliah berbahasa Indonesia** dalam format `.docx` yang siap dikumpulkan, khusus **Program Studi Sistem Informasi, FMIPA, Universitas Riau (UNRI)**. Cover, daftar isi otomatis, penomoran halaman, penomoran heading, rumus, gambar, dan daftar pustaka APA sudah diatur oleh skrip, jadi pengguna cukup memberi materi dan referensi.

> **Dibuat oleh Kurniawan Hafiz** | Versi 5.1.0 | [English](README.en.md)

## Apa yang baru di v5.1

- **Lebih hemat token.** `SKILL.md` dipadatkan (±21 KB menjadi ±10 KB), deskripsi dipersingkat, dan aturan konektor Consensus/OpenAlex dipindah ke `references/pencarian.md` yang hanya dibaca saat konektor tersedia. Tidak ada aturan yang dibuang.
- Ukuran font seluruh teks cover: 14 untuk `makalah-unri`, 13 untuk `makalah-unri-si` (supaya baris fakultas tidak patah jadi dua).
- Label "contoh rekaan" dihapus; contoh dan studi kasus buatan sendiri tidak diberi label, dan validator tidak lagi memperingatkannya.
- README memuat cara pasang di Claude Code, Hermes Agent, dan OpenClaw.

### Yang baru di v5

- **Consensus AI dan OpenAlex dipakai bersamaan.** Bila kedua konektor terpasang, terhubung, dan belum limit, tiap butir materi dicari di keduanya, hasil digabung, dan duplikat dibuang. Bisa juga menetapkan di prompt salah satu sebagai utama dan yang lain pelengkap, atau membagi tugas keduanya.
- Bila hanya satu konektor yang tersedia (belum terhubung atau sudah limit), skill memakai yang tersedia lalu melengkapi dengan pencarian web. Bila tidak ada, skill memakai pencarian web (DOAJ, Garuda, laman jurnal, dst) seperti v3.
- Ketentuan bawaan tiap konektor dipertahankan. Consensus: open access, tanpa preprint, 5 tahun terakhir. OpenAlex: karya (works), pencarian di judul, abstrak, teks lengkap, dan keyword (`fulltext`), Boolean aktif, stemming aktif, plus filter yang sama. Semuanya bisa diganti lewat prompt (mis. "10 tahun terakhir"); parameter dan skill lain hanya dipakai bila diminta.
- Sumber berbahasa Indonesia dicari lewat semua jalur sekaligus: Consensus dengan filter negara Indonesia atau query Indonesia, OpenAlex dengan filter bahasa Indonesia dan filter negara Indonesia, lalu pencarian web bila masih kurang.
- Hasil Consensus yang belum punya DOI dicocokkan dulu lewat OpenAlex (`resolve_references` dan `get_work`), lalu semua sumber tetap diverifikasi ke laman aslinya. Tabel status referensi punya kolom "Ditemukan lewat".

### Yang sudah ada sejak v3

- Daftar pustaka rata kiri-kanan dan menggantung sudah dipasang langsung di skrip, begitu juga spasi 12 pt setelah Heading 1. Tidak ada lagi patch `sed` tiap build.
- Satu perintah untuk seluruh alur: `python3 scripts/build.py content.json hasil.docx`.
- Blok `equation` (LaTeX jadi equation Word yang bisa diedit), rumus sebaris `$...$`, dan blok `image` dengan keterangan "Gambar n." otomatis.
- Validator `check_content.py` sebelum build: sitasi, urutan abjad, jumlah dan tahun referensi, bahasa, em dash, dan kata gemar AI.
- `preview.sh` merender cover, daftar isi, halaman bab, dan daftar pustaka ke PNG.
- Tabel status referensi untuk ringkasan akhir.
- Skrip tidak lagi terkunci ke path tertentu.

Daftar lengkap ada di [CHANGELOG.md](CHANGELOG.md).

## Apa yang dihasilkan

Satu file `.docx` dengan urutan: cover, daftar isi, kata pengantar, Bab I Pendahuluan, Bab II Pembahasan, Bab III Penutup, daftar pustaka.

Format yang sudah dipasang:

- Kertas A4, margin 4-3-3-3 (kiri 4 cm, atas 3, kanan 3, bawah 3).
- Times New Roman 12, spasi 1,5, rata kiri-kanan. Seluruh teks cover memakai ukuran 13.
- Cover selalu menampilkan baris fakultas dan program studi di atas nama universitas. Keduanya bisa diganti lewat `meta.fakultas` dan `meta.prodi`.
- Nomor halaman: cover dihitung halaman i tetapi nomornya disembunyikan; daftar isi dan kata pengantar memakai angka romawi di tengah bawah; Bab I sampai III memakai angka mulai 1 di kanan bawah; daftar pustaka tanpa nomor yang terlihat.
- Penomoran heading 1.1, 1.2, 2.1, dan sub-subbab 2.4.1.
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
- Contoh dan studi kasus buatan sendiri tidak diberi label khusus.
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
│   ├── logo_unri.png           # logo untuk cover
│   ├── example_content.json    # contoh isi makalah (rumus, gambar, sitasi)
│   ├── example_diagram.png     # gambar untuk contoh
│   └── prompt_template.md      # template prompt bila skill tidak terpasang
├── references/
│   ├── schema.md               # skema content.json
│   └── pencarian.md            # aturan pencarian lewat konektor (dibaca saat perlu)
└── scripts/
    ├── build.py                # satu perintah: cek, bangun, daftar isi, validasi, preview
    ├── check_content.py        # validator isi sebelum build
    ├── build_makalah.js        # membangun .docx dari content.json
    ├── omml.js                 # konverter LaTeX ke equation Word
    ├── finalize.py             # mengisi daftar isi dan nomor halaman
    └── preview.sh              # render halaman penting ke PNG
```

## Cara pasang

Skill ini berupa folder `makalah-unri-si/` berisi `SKILL.md`. Pilih sesuai agen yang dipakai. Untuk ketiganya, folder harus bernama persis `makalah-unri-si` (zip dari GitHub berisi `makalah-unri-si-main`; ekstrak lalu ganti namanya).

Kebutuhan di mesin tempat agen berjalan: Node.js dan paket npm `docx`, Python 3, LibreOffice (`soffice`), opsional `pandoc` dan `poppler-utils`. Di aplikasi Claude (cloud) semuanya sudah tersedia.

### Claude (aplikasi web atau desktop)

1. Di halaman repo, klik **Code**, lalu **Download ZIP**.
2. Buka **Settings**, menu **Skills**, upload zip.
3. Mulai chat baru, lalu panggil dengan `/makalah-unri-si`.

Kalau sudah ada skill bernama sama, hapus yang lama dulu. Kalau upload ditolak karena nama folder, ekstrak zip, ganti nama folder jadi `makalah-unri-si`, kompres lagi, upload.

### Claude Code

```bash
# pribadi: berlaku di semua proyek
mkdir -p ~/.claude/skills
cp -r makalah-unri-si ~/.claude/skills/

# atau per proyek (bisa di-commit): jalankan dari root repo
mkdir -p .claude/skills
cp -r makalah-unri-si .claude/skills/
cd ~/.claude/skills/makalah-unri-si && npm install docx   # sekali saja
```

Claude Code memantau folder skill, jadi tidak perlu restart. Bila `~/.claude/skills/` baru dibuat saat sesi sudah berjalan, jalankan `/reload-skills`. Panggil dengan `/makalah-unri-si` atau cukup minta "buatkan makalah".

### Hermes Agent

```bash
mkdir -p ~/.hermes/skills
cp -r makalah-unri-si ~/.hermes/skills/
cd ~/.hermes/skills/makalah-unri-si && npm install docx   # sekali saja
```

Lalu jalankan `/reload-skills` di Hermes (atau mulai sesi baru) dan panggil dengan `/makalah-unri-si`. Alternatif tanpa menyalin: simpan folder di tempat lain dan daftarkan di `~/.hermes/config.yaml`:

```yaml
skills:
  external_dirs:
    - ~/skills-saya
```

Skill proyek di `<proyek>/.hermes/skills/` baru dimuat setelah `hermes skills trust` di repo itu. Catatan: dokumentasi Hermes tidak menjelaskan pemasangan dari folder lokal; langkah di atas mengikuti struktur direktori skill-nya.

### OpenClaw

```bash
# ke workspace aktif
openclaw skills install ./makalah-unri-si --as makalah-unri-si

# atau untuk semua agen lokal (~/.openclaw/skills)
openclaw skills install ./makalah-unri-si --global
```

Bisa juga menyalin folder langsung ke `<workspace>/skills/makalah-unri-si/`. Panggil dengan `$` di kolom chat Control UI lalu pilih `makalah-unri-si`, atau `/makalah-unri-si` di kanal pesan. Pemasangan lokal tidak ikut `openclaw skills update`; pasang ulang untuk memperbarui. Jalankan `npm install docx` sekali di folder skill terpasang.

### Konektor referensi

Pencarian referensi lewat Consensus dan OpenAlex adalah konektor Claude dan bersifat opsional. Di agen yang tidak punya konektor itu, skill otomatis memakai pencarian web (DOAJ, Garuda, laman jurnal), dan agennya perlu punya tool pencarian atau pengambil halaman web.

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
python3 scripts/build.py content.json hasil/Makalah_Judul.docx --tabel --preview
```

Opsi `build.py`:

| Opsi | Fungsi |
|---|---|
| `--strict` | Peringatan validator ikut menghentikan build |
| `--tabel` | Cetak tabel status referensi |
| `--preview` | Render halaman penting ke PNG di `hasil/Makalah_Judul_preview/` |
| `--tanpa-cek` | Lewati validator (tidak disarankan) |

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
| Skill tidak muncul di Claude Code, Hermes, atau OpenClaw | Pastikan `SKILL.md` ada langsung di `.../makalah-unri-si/SKILL.md`, lalu `/reload-skills` (Claude Code, Hermes) atau pasang ulang (OpenClaw). |

## Catatan

- Logo UNRI adalah milik Universitas Riau. File logo disertakan hanya sebagai kelengkapan cover tugas kuliah.
- Nama anggota, NIM, dan tanggal selalu berupa placeholder dan harus diedit sendiri.
- Periksa kembali setiap referensi sebelum dikumpulkan.

## Lisensi dan kredit

Dirilis dengan lisensi MIT (lihat [LICENSE](LICENSE)). Dibuat oleh **Kurniawan Hafiz**.
