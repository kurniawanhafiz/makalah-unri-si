# makalah-unri-si

Skill untuk membuat **makalah kuliah berbahasa Indonesia** dalam format `.docx` yang siap dikumpulkan, khusus **Program Studi Sistem Informasi, FMIPA, Universitas Riau (UNRI)**. Cover, daftar isi otomatis, penomoran halaman, penomoran heading, dan daftar pustaka APA sudah diatur oleh skrip, jadi pengguna cukup memberi materi dan referensi.

> **Dibuat oleh Kurniawan Hafiz**

Skill ini adalah varian dari `makalah-unri`. Isi dan format keduanya sama persis; satu-satunya beda ada di cover, yang di sini selalu menampilkan dua baris tebal di atas "UNIVERSITAS RIAU":

```
FAKULTAS MATEMATIKA DAN ILMU PENGETAHUAN ALAM
PROGRAM STUDI SISTEM INFORMASI
UNIVERSITAS RIAU
```

Kedua baris bisa diganti lewat `meta.fakultas` dan `meta.prodi` di `content.json` bila perlu.

## Apa yang dihasilkan

Satu file `.docx` dengan urutan: cover, daftar isi, kata pengantar, Bab I Pendahuluan, Bab II Pembahasan, Bab III Penutup, daftar pustaka.

Format yang sudah dipasang:

- Kertas A4, margin 4-3-3-3 (kiri 4 cm, atas 3, kanan 3, bawah 3).
- Times New Roman 12, spasi 1,5, rata kiri-kanan. Cover memakai ukuran 14.
- Cover memuat fakultas, program studi, logo UNRI, judul, mata kuliah, dosen pengampu, tabel anggota (nama dan NIM berupa placeholder), nama universitas, dan tahun.
- Nomor halaman: cover dihitung halaman i tetapi nomornya disembunyikan; daftar isi dan kata pengantar memakai angka romawi di tengah bawah; Bab I sampai III memakai angka mulai 1 di kanan bawah; daftar pustaka tanpa nomor yang terlihat.
- Penomoran heading 1.1, 1.2, 2.1, dan sub-subbab 2.4.1.
- Daftar isi otomatis (field TOC level 1 sampai 3) lengkap dengan nomor halaman.
- Daftar pustaka gaya APA 7, urut abjad, menggantung sekaligus rata kiri-kanan, dengan link DOI atau link open access yang valid.
- Tabel dihindari (maksimal satu per makalah).

## Aturan isi yang dipegang skill

- Bab III (kesimpulan dan saran) bebas sitasi.
- Studi kasus ditulis tanpa sitasi dan tidak masuk ke latar belakang, rumusan masalah, atau tujuan, kecuali diminta.
- Semua kutipan berupa parafrase; klaim dari sumber hanya sebatas yang benar-benar dibaca.
- Contoh buatan sendiri diberi label "contoh rekaan".
- Sumber yang tidak bisa diverifikasi tidak dipakai, dan sumber tidak pernah dikarang.
- Gaya bahasa baku dan natural, tanpa tanda pisah panjang dan tanpa pola kalimat khas AI.

## Isi folder

```
makalah-unri-si/
├── README.md                   # file ini
├── SKILL.md                    # instruksi skill untuk Claude
├── assets/
│   ├── logo_unri.png           # logo untuk cover
│   ├── example_content.json    # contoh isi makalah
│   └── prompt_template.md      # template prompt bila skill tidak terpasang
├── references/
│   └── schema.md               # skema content.json
└── scripts/
    ├── build_makalah.js        # membangun .docx dari content.json
    └── finalize.py             # mengisi daftar isi dan nomor halaman
```

## Cara pasang

1. Di halaman repo ini, klik **Code**, lalu **Download ZIP**.
2. Di Claude, buka **Settings**, lalu menu **Skills**, dan upload file zip tadi.
3. Mulai chat baru supaya skill terbaca.

Catatan:

- Kalau sudah ada skill dengan nama sama, hapus yang lama dulu sebelum upload versi baru.
- Zip dari GitHub berisi folder bernama `makalah-unri-si-main`. Kalau upload ditolak karena nama folder, ekstrak zip-nya, ganti nama foldernya jadi `makalah-unri-si`, kompres lagi, lalu upload.
- Skill ini dan `makalah-unri` bisa dipasang berdampingan.

## Cara pakai dengan panggil skill

Panggil skill dengan `/makalah-unri-si` di chat, lalu kirim data makalahnya. Contoh:

```
/makalah-unri-si
Buatkan makalah.
- Judul: Proposal Penelitian
- Mata kuliah: Bahasa Indonesia
- Dosen pengampu: Nama Dosen, gelar.
- Jumlah anggota: 4
- Materi / poin bahasan:
  - Pengertian proposal penelitian
  - Struktur proposal penelitian
  - Kaidah penulisan proposal
- Referensi dari saya (boleh ditambah yang valid):
  - https://doi.org/xxxx
  - (atau unggah PDF-nya)
```

Data yang wajib: judul, mata kuliah, dosen pengampu, dan poin bahasan. Kalau ada yang kurang, Claude akan bertanya. Jumlah anggota default 4, dan logo UNRI sudah dipakai otomatis.

Setelah file jadi:

- Edit nama anggota, NIM, dan bulan-tahun di kata pengantar (masih placeholder).
- Bila isi makalah kamu ubah, klik kanan daftar isi lalu pilih **Update Field** supaya nomor halaman diperbarui.

## Cara pakai bersama Claude

1. Pasang folder `makalah-unri-si/` sebagai skill di Claude. Untuk Claude Code, taruh di `~/.claude/skills/makalah-unri-si/` (atau `.claude/skills/` di dalam proyek).
2. Minta seperti biasa, misalnya: *"Buatkan makalah Sistem Informasi tentang teknologi digital modern untuk mata kuliah Konsep Sistem Informasi, dosen Nama Dosen, M.Kom., 6 anggota."*
3. Claude akan menanyakan hal yang belum diberikan, memverifikasi referensi, menulis `content.json`, lalu menjalankan skrip dan menyerahkan `.docx`.
4. Buka hasilnya di Word, ganti placeholder nama, NIM, dan tanggal, lalu klik kanan daftar isi dan pilih **Update Field** bila ada perubahan halaman.

Bila skill belum terpasang, `assets/prompt_template.md` bisa disalin sebagai prompt biasa.

## Cara pakai manual (tanpa Claude)

Kebutuhan: Node.js, paket npm `docx`, Python 3, dan LibreOffice (`soffice`) untuk menghitung nomor halaman daftar isi.

```bash
npm install docx

# 1. salin dan edit contoh isi (lihat references/schema.md untuk skemanya)
cp assets/example_content.json content.json

# 2. bangun file mentah
node scripts/build_makalah.js content.json raw.docx headings.json

# 3. finalisasi: isi daftar isi dan nomor halaman
python3 scripts/finalize.py raw.docx headings.json Makalah_Judul.docx
```

Serahkan `Makalah_Judul.docx`, bukan `raw.docx`, karena daftar isi di file mentah masih kosong.

Catatan: `SKILL.md` memakai path khusus lingkungan Claude (`/mnt/user-data/outputs/` dan `/mnt/skills/public/docx/...`). Untuk pemakaian manual, ganti dengan path milikmu. `finalize.py` otomatis memakai `soffice` biasa bila skrip bawaan Claude tidak ditemukan.

## Format `content.json`

Ringkasnya: `meta` (judul, matkul, dosen, universitas, tahun, jumlah_anggota, kota, bulan_tahun, opsional fakultas, prodi, dan logo), `kata_pengantar` (array paragraf), `bab` (array bab berisi `sections` dan `blocks`), dan `daftar_pustaka` (array string APA 7, `*kata*` untuk huruf miring). Penjelasan lengkap tipe blok (`p`, `quote`, `list`, `table`) ada di [`references/schema.md`](references/schema.md).

## Varian

Untuk program studi atau fakultas lain, gunakan versi dasarnya, [`makalah-unri`](../../../../makalah-unri). Cover-nya tidak menampilkan baris program studi, dan baris fakultas hanya muncul bila `meta.fakultas` diisi.

## Catatan

- Logo UNRI adalah milik Universitas Riau. File logo disertakan hanya sebagai kelengkapan cover tugas kuliah.
- Nama anggota, NIM, dan tanggal selalu berupa placeholder dan harus diedit sendiri.
- Periksa kembali setiap referensi sebelum dikumpulkan.

## Kredit

Dibuat oleh **Kurniawan Hafiz**.
