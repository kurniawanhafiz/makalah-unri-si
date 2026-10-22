# makalah-unri-si

Skill untuk membuat **makalah kuliah berbahasa Indonesia** dalam format `.docx` yang siap dikumpulkan, khusus **Program Studi Sistem Informasi, FMIPA, Universitas Riau (UNRI)**. Cover, daftar isi otomatis, penomoran halaman, penomoran heading, rumus, gambar, dan daftar pustaka APA sudah diatur oleh skrip, jadi pengguna cukup memberi materi dan referensi.

> **Dibuat oleh Kurniawan Hafiz** | Versi 4.0.0 | [English](README.en.md)

## Apa yang baru di v4

- **Consensus AI sebagai pencari referensi default.** Bila konektor Consensus sudah terpasang dan terhubung, skill mencari referensi lewat Consensus dengan filter bawaan: open access, tanpa preprint, 5 tahun terakhir. Bila belum terpasang, atau kuota akun habis, skill memakai pencarian web (DOAJ, Garuda, laman jurnal, dst) seperti v3.
- Filter bawaan bisa diganti lewat prompt (mis. "10 tahun terakhir"). Filter Consensus lain dan skill lain hanya dipakai bila diminta.
- Sumber berbahasa Indonesia dicari lewat Consensus dulu (filter negara Indonesia atau query berbahasa Indonesia), lalu dilengkapi pencarian web bila masih kurang.
- Hasil Consensus tetap diverifikasi ke laman aslinya; tabel status referensi punya kolom "Ditemukan lewat".

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
- Times New Roman 12, spasi 1,5, rata kiri-kanan. Cover memakai ukuran 14.
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
- Contoh buatan sendiri diberi label "contoh rekaan".
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
│   └── schema.md               # skema content.json
└── scripts/
    ├── build.py                # satu perintah: cek, bangun, daftar isi, validasi, preview
    ├── check_content.py        # validator isi sebelum build
    ├── build_makalah.js        # membangun .docx dari content.json
    ├── omml.js                 # konverter LaTeX ke equation Word
    ├── finalize.py             # mengisi daftar isi dan nomor halaman
    └── preview.sh              # render halaman penting ke PNG
```

## Cara pasang

1. Di halaman repo ini, klik **Code**, lalu **Download ZIP**.
2. Di Claude, buka **Settings**, lalu menu **Skills**, dan upload file zip tadi.
3. Mulai chat baru supaya skill terbaca.

Catatan:

- Kalau sudah ada skill dengan nama sama, hapus yang lama dulu sebelum upload versi baru.
- Zip dari GitHub berisi folder bernama `makalah-unri-si-main`. Kalau upload ditolak karena nama folder, ekstrak zip-nya, ganti nama foldernya jadi `makalah-unri-si`, kompres lagi, lalu upload.
- Untuk kampus atau program studi lain, pakai versi dasarnya, `makalah-unri`. Isi dan format kedua skill sama persis; bedanya hanya cover. Keduanya bisa dipasang berdampingan.

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

## Catatan

- Logo UNRI adalah milik Universitas Riau. File logo disertakan hanya sebagai kelengkapan cover tugas kuliah.
- Nama anggota, NIM, dan tanggal selalu berupa placeholder dan harus diedit sendiri.
- Periksa kembali setiap referensi sebelum dikumpulkan.

## Lisensi dan kredit

Dirilis dengan lisensi MIT (lihat [LICENSE](LICENSE)). Dibuat oleh **Kurniawan Hafiz**.
