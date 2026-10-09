---
name: makalah-unri-si
description: Varian makalah-unri khusus Program Studi Sistem Informasi, FMIPA Universitas Riau. Membuat makalah kuliah berbahasa Indonesia dalam format .docx siap kumpul (cover dengan logo UNRI, daftar isi otomatis, kata pengantar, Bab I Pendahuluan, Bab II Pembahasan, Bab III Penutup, daftar pustaka APA dengan DOI valid). Pakai skill ini (bukan makalah-unri) bila pengguna menyebut makalah-unri-si, Sistem Informasi, atau FMIPA, atau meminta "buatkan makalah", "bikin makalah tentang ...", makalah kelompok, tugas makalah mata kuliah, atau menyebut format margin 4-3-3-3, Times New Roman 12, spasi 1,5, cover UNRI, atau penomoran 1.1 / 2.1, meskipun pengguna tidak menyebut kata skill atau docx.
---

# Makalah UNRI Sistem Informasi (docx)

Dibuat oleh Kurniawan Hafiz.

Skill ini sama persis dengan `makalah-unri`; satu-satunya beda ada di cover. Di atas "UNIVERSITAS RIAU" selalu tercantum dua baris tebal: "FAKULTAS MATEMATIKA DAN ILMU PENGETAHUAN ALAM" dan "PROGRAM STUDI SISTEM INFORMASI". Keduanya bisa diganti lewat `meta.fakultas` dan `meta.prodi` di `content.json` bila perlu.

Skill ini menghasilkan makalah Bahasa Indonesia dengan format yang sudah disepakati di percakapan sebelumnya, sehingga pengguna tidak perlu menjelaskan format dari awal. Format dikerjakan oleh skrip. Tugas utama Claude: mengumpulkan input, memverifikasi referensi, menulis isi, lalu menjalankan skrip.

## Alur kerja

1. **Kumpulkan input** (tanya hanya yang belum diberikan, jangan lebih dari beberapa pertanyaan):
   - Materi atau poin bahasan, judul makalah, mata kuliah, nama dosen pengampu.
   - Referensi dari pengguna (DOI, link, PDF). Boleh ditambah referensi lain yang valid.
   - Jumlah anggota (default 4). Nama dan NIM dibiarkan placeholder, pengguna mengedit sendiri.
   - Logo: pakai `assets/logo_unri.png` kecuali pengguna mengunggah logo lain.
   - Format lain memakai default di bawah, kecuali pengguna menyebut berbeda.
2. **Verifikasi referensi** (lihat bagian Referensi). Jangan menulis isi sebelum tahu sumber mana yang benar-benar bisa dipakai.
3. **Tulis `content.json`** sesuai `references/schema.md`. Isi makalah mengikuti bagian Menulis isi.
4. **Bangun dan finalisasi**:
   ```bash
   node scripts/build_makalah.js content.json /home/claude/raw.docx /home/claude/headings.json
   python3 scripts/finalize.py /home/claude/raw.docx /home/claude/headings.json /mnt/user-data/outputs/Makalah_<Judul>.docx
   python3 /mnt/skills/public/docx/scripts/office/validate.py /mnt/user-data/outputs/Makalah_<Judul>.docx
   ```
   Jalankan dari folder skill (atau pakai path absolut). `finalize.py` mengisi daftar isi otomatis lengkap dengan nomor halaman.
5. **Cek visual**: render ke PDF lewat soffice, lihat cover, daftar isi, satu halaman bab, dan daftar pustaka. Pastikan cover satu halaman dan nomor halaman sesuai.
6. **Serahkan** dengan `present_files`. Ringkas dalam beberapa kalimat: apa yang perlu diedit pengguna (nama, NIM, tanggal), referensi mana yang dipakai dan mana yang tidak (beserta alasannya), dan cara memperbarui daftar isi (klik kanan, Update Field).

## Format yang sudah dipasang skrip (jangan diubah tanpa diminta)

- A4, margin 4-3-3-3 dibaca sebagai kiri 4 cm, atas 3, kanan 3, bawah 3. Times New Roman 12, spasi 1,5, rata kiri-kanan. Cover ukuran 14.
- Urutan: cover, daftar isi, kata pengantar, Bab I-III, daftar pustaka.
- Cover dihitung halaman i tetapi nomornya tidak tampil. Daftar isi dan kata pengantar bernomor romawi di tengah bawah. Bab I sampai III bernomor angka mulai 1 di kanan bawah. Daftar pustaka tanpa nomor yang terlihat.
- Penomoran heading 1.1, 1.2, 2.1, dan sub-subbab 2.4.1. Paragraf di bawah subbab sejajar dengan teks subbab (bukan dengan angkanya), dan baris pertama tetap menjorok.
- Daftar isi otomatis (field TOC, level 1-3). Entri pertama adalah "HALAMAN JUDUL": teks kecil berwarna putih (Heading 1) di paling atas cover, tidak terlihat di cover tetapi muncul di daftar isi dengan halaman i. Judul "DAFTAR ISI" (halaman ii) dan "DAFTAR PUSTAKA" juga Heading 1, jadi keduanya ikut masuk daftar isi.
- Daftar pustaka gaya APA 7, urut abjad, menggantung (hanging indent), memakai link DOI.
- Hindari tabel. Maksimal satu tabel per makalah, dan hanya bila datanya memang tabular (misalnya sistematika). Contoh kalimat, contoh judul, dan perbandingan ditulis sebagai kalimat atau blok `quote`.

## Menulis isi

Struktur umum (sesuaikan dengan materi pengguna):

- **Kata pengantar**: puji syukur, terima kasih kepada dosen pengampu dan rekan kelompok, permohonan kritik dan saran. Tiga paragraf pendek.
- **Bab I Pendahuluan**: 1.1 Latar Belakang (dari gambaran umum ke masalah, dengan sitasi), 1.2 Rumusan Masalah (daftar bernomor, satu pertanyaan per materi), 1.3 Tujuan Penulisan (jumlah sama dengan rumusan), 1.4 Manfaat Penulisan.
- **Bab II Pembahasan**: satu subbab per butir materi pengguna, urut sesuai materi. Gunakan kutipan dari referensi di tiap subbab, dan sertakan contoh bila materinya memungkinkan.
- **Bab III Penutup**: 3.1 Kesimpulan (menjawab tiap rumusan masalah), 3.2 Saran.

Gaya penulisan:

- Bahasa Indonesia baku, ilmiah, mengalir. Hindari tanda pisah panjang (em dash). Hindari pembuka klise ("Dalam era ..."), kata gemar AI (krusial, esensial, komprehensif, holistik, signifikan), daftar tiga yang dipaksakan, penutup satu kalimat yang menggurui, serta label tebal di dalam paragraf.
- Variasikan panjang kalimat dan awal kalimat. Gunakan "kami" hanya di kata pengantar dan bagian yang memang bersuara penulis.
- Semua kutipan berupa parafrase dengan kata sendiri. Jangan menyalin kalimat sumber. Kutipan langsung hanya bila perlu dan sangat pendek.
- Contoh buatan sendiri wajib diberi label "contoh rekaan" di teksnya.
- Klaim yang disandarkan pada sumber hanya boleh sebatas yang benar-benar dibaca. Kalau hanya abstrak yang terbaca, tulis hal yang ada di abstrak saja. Kalau menafsirkan atau menyimpulkan sendiri, tulis sebagai pendapat penulis ("menurut kami").
- Sitasi dalam teks: Penulis (2023), (Penulis, 2023), dua penulis dengan "dan" atau "&", tiga penulis atau lebih memakai "dkk.".

## Referensi

- Coba buka setiap DOI/link dari pengguna dengan web_fetch. Bila terblokir, cari lewat web_search untuk menemukan judul, penulis, tahun, jurnal, volume, halaman, dan abstrak.
- Sumber yang tidak bisa diverifikasi atau tidak relevan dengan materi tidak dipakai dan tidak dimasukkan ke daftar pustaka. Katakan terus terang ke pengguna sumber mana dan kenapa. Minta pengguna mengunggah PDF-nya bila ia ingin sumber itu dipakai.
- PDF yang diunggah pengguna boleh dibaca penuh dan dikutip lebih dalam.
- Boleh menambah sumber sendiri (jurnal, buku, artikel resmi) asal bisa diverifikasi dan linknya valid. Jangan pernah mengarang sumber, DOI, halaman, atau penulis. Bila daftar penulis tidak pasti, sampaikan ke pengguna agar dicek.
- Format daftar pustaka di `content.json`: tulis tiap entri sebagai satu string APA 7, dengan *tanda bintang* untuk huruf miring (nama jurnal, volume, judul buku). Urutkan abjad. Cantumkan link `https://doi.org/...`.
- Jumlah minimal yang wajar untuk makalah mahasiswa: 5 sampai 8 sumber.

## Hal yang sering salah

- Selalu jalankan `finalize.py` dan serahkan hasilnya, jangan menyerahkan `raw.docx`, karena daftar isi di file mentah masih kosong.
- Jangan menaruh tabel kecil untuk hal yang bisa ditulis sebagai kalimat.
- Nama, NIM, dan tanggal kata pengantar dibiarkan sebagai placeholder dan disebut di ringkasan akhir.
- Bila pengguna meminta perubahan format (misalnya margin lain), ubah konstanta di `scripts/build_makalah.js` untuk makalah itu saja dan sebutkan perubahannya.
- Bila pengguna ingin makalah sebagai PPT atau ringkasan, itu pekerjaan terpisah: gunakan konten makalah sebagai bahan.
