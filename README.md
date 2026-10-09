# makalah-unri-si

Skill [Claude](https://claude.ai) untuk membuat makalah kuliah berbahasa Indonesia dalam format `.docx` yang siap dikumpulkan, khusus **Program Studi Sistem Informasi, FMIPA Universitas Riau**. Isinya: cover dengan logo UNRI, daftar isi otomatis, kata pengantar, Bab I sampai III, dan daftar pustaka gaya APA 7 dengan link DOI.

Dibuat oleh **Kurniawan Hafiz**.

Format dikerjakan oleh skrip, jadi hasilnya konsisten dan kamu tidak perlu menjelaskan aturan format dari awal setiap kali membuat makalah.

> Ini varian dari `makalah-unri`. Bedanya hanya di cover: di atas **UNIVERSITAS RIAU** selalu ada dua baris tebal, yaitu **FAKULTAS MATEMATIKA DAN ILMU PENGETAHUAN ALAM** dan **PROGRAM STUDI SISTEM INFORMASI**. Untuk cover tanpa fakultas dan prodi, pakai repo `makalah-unri`.

## Fitur

- Cover dengan logo UNRI, nama fakultas dan prodi, daftar anggota kelompok, dan placeholder nama serta NIM.
- Daftar isi otomatis (field TOC level 1 sampai 3) lengkap dengan nomor halaman.
- Entri "HALAMAN JUDUL", "DAFTAR ISI", dan "DAFTAR PUSTAKA" ikut tampil di daftar isi. "HALAMAN JUDUL" adalah Heading 1 berwarna putih berukuran kecil di paling atas cover, jadi tidak terlihat di cover.
- Penomoran heading 1.1, 1.2, 2.1, dan sub-subbab 2.4.1.
- Daftar pustaka APA 7, urut abjad, hanging indent, memakai link DOI.
- Verifikasi referensi sebelum menulis. Sumber yang tidak bisa dibuka atau tidak relevan tidak dipakai, dan alasannya disampaikan ke pengguna.
- Gaya bahasa baku dan natural, tanpa tanda pisah panjang dan tanpa pola kalimat khas AI.

## Format yang dipasang

- Kertas A4, margin 4-3-3-3 (kiri 4 cm, atas 3, kanan 3, bawah 3).
- Times New Roman 12, spasi 1,5, rata kiri-kanan. Cover ukuran 14.
- Urutan: cover, daftar isi, kata pengantar, Bab I Pendahuluan, Bab II Pembahasan, Bab III Penutup, daftar pustaka.
- Cover dihitung halaman i tetapi nomornya tidak tampil. Daftar isi dan kata pengantar bernomor romawi di tengah bawah. Bab I sampai III bernomor angka mulai 1 di kanan bawah. Daftar pustaka tanpa nomor yang terlihat.
- Hindari tabel. Maksimal satu tabel per makalah, hanya bila datanya memang tabular.

## Cara pasang

1. Di halaman repo ini, klik **Code**, lalu **Download ZIP**.
2. Di Claude, buka **Settings**, lalu menu **Skills**, dan upload file zip tadi.
3. Mulai chat baru supaya skill terbaca.

Catatan:

- Kalau sudah ada skill dengan nama sama, hapus yang lama dulu sebelum upload versi baru.
- Zip dari GitHub berisi folder bernama `makalah-unri-si-main`. Kalau upload ditolak karena nama folder, ekstrak zip-nya, ganti nama foldernya jadi `makalah-unri-si`, kompres lagi, lalu upload.
- Skill ini dan `makalah-unri` bisa dipasang berdampingan.

## Cara pakai

Panggil skill dengan `/makalah-unri-si` di chat, lalu kirim data makalahnya. Contoh:

```
/makalah-unri-si
Buatkan makalah.
- Judul: Proposal Penelitian
- Mata kuliah: Bahasa Indonesia
- Dosen pengampu: Nama Dosen, M.Pd.
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

### Kustomisasi

- **Fakultas dan prodi lain**: ganti lewat `meta.fakultas` dan `meta.prodi` di `content.json`, atau sebutkan di data makalah.
- **Format lain** (misalnya margin berbeda): minta ke Claude, perubahan berlaku untuk makalah itu saja.
- **Logo lain**: unggah logo saat meminta makalah, atau ganti `assets/logo_unri.png`.

## Struktur repo

```
makalah-unri-si/
├── SKILL.md             Instruksi alur kerja untuk Claude
├── README.md
├── assets/
│   ├── logo_unri.png
│   ├── example_content.json   Contoh isi makalah
│   └── prompt_template.md     Template prompt bila tidak memakai skill
├── references/
│   └── schema.md        Skema content.json
└── scripts/
    ├── build_makalah.js Membuat .docx mentah dan daftar heading
    └── finalize.py      Mengisi daftar isi otomatis dan nomor halaman
```

## Menjalankan skrip secara manual

Claude menjalankan skrip ini sendiri, tetapi kamu juga bisa menjalankannya langsung dari folder repo:

```bash
node scripts/build_makalah.js content.json raw.docx headings.json
python3 scripts/finalize.py raw.docx headings.json Makalah_Judul.docx
```

`content.json` mengikuti skema di `references/schema.md`. Contoh lengkapnya ada di `assets/example_content.json`.

Kebutuhan:

- Node.js dengan paket [`docx`](https://www.npmjs.com/package/docx)
- Python 3
- LibreOffice (`soffice`) serta `pdfinfo` dan `pdftotext` dari poppler, dipakai `finalize.py` untuk menghitung nomor halaman daftar isi

## Catatan

- Sumber referensi diverifikasi lewat DOI atau pencarian. Tetap cek ulang daftar pustaka sebelum dikumpulkan, terutama daftar penulis.
- Contoh buatan sendiri di dalam makalah diberi label "contoh rekaan".
- Logo UNRI adalah milik Universitas Riau. Pakai sesuai ketentuan kampus.

---

Dibuat oleh **Kurniawan Hafiz**.
