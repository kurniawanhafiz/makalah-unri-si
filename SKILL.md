---
name: "makalah-unri-si"
description: "Varian makalah-unri khusus Program Studi Sistem Informasi, FMIPA Universitas Riau. Membuat makalah kuliah berbahasa Indonesia dalam format .docx siap kumpul (cover dengan logo UNRI, fakultas, dan program studi, daftar isi otomatis, Bab I-III, daftar pustaka APA dengan link valid) dengan dukungan rumus, gambar, dan pemeriksaan isi otomatis. Pakai skill ini hanya bila pengguna secara eksplisit menyebut makalah-unri-si, Sistem Informasi, SI, atau FMIPA. Untuk permintaan makalah umum tanpa penyebutan itu, pakai makalah-unri."
---

# Makalah UNRI (docx) v6.3

Sama persis dengan `makalah-unri`; satu-satunya beda ada di cover: di atas "UNIVERSITAS RIAU" selalu tercantum dua baris tebal "FAKULTAS MATEMATIKA DAN ILMU PENGETAHUAN ALAM" dan "PROGRAM STUDI SISTEM INFORMASI" (bisa diganti lewat `meta.fakultas` dan `meta.prodi`; string kosong menyembunyikan).

Format, daftar isi, rumus, gambar, dan pemeriksaan isi dikerjakan skrip. Tugas Claude: kumpulkan input, verifikasi referensi, tulis isi, jalankan skrip. Jalankan perintah dari folder skill ini (atau path absolut); berkas sementara dibuat di folder sementara sistem.

## Alur kerja

1. **Input.** Tanya hanya yang belum diberikan, beberapa pertanyaan sekaligus: materi/poin bahasan, judul, mata kuliah, dosen pengampu; referensi dari pengguna (DOI, link, PDF); **syarat referensi** (jumlah sumber, rentang tahun, minimal berbahasa Indonesia, ada studi kasus atau tidak), simpan di `meta.ref_config`; **tabel** (bawaan: sesuai kebutuhan; bila pengguna minta tanpa tabel, isi `meta.maks_tabel: 0`); jumlah anggota (default 4; nama dan NIM tetap placeholder). Logo: `assets/logo_unri.png` kecuali pengguna mengunggah lain.
2. **Referensi.** Baca `references/referensi.md` lalu cari dan verifikasi sumber. Jangan menulis isi sebelum tahu sumber mana yang benar-benar bisa dipakai. Catat di `verifikasi_referensi` dan `sumber_dibuang`.
3. **Tulis `content.json`** sesuai `references/schema.md` (baca sekali; contoh di `assets/example_content.json`). Rumus pakai LaTeX, gambar lewat blok `image`.
4. **Bangun:**
   ```bash
   python3 scripts/build.py content.json hasil/Makalah_<Judul>.docm --tabel
   ```
   Urutan otomatis: cek isi (berhenti bila galat), bangun docx, pasang style/penomoran dari `assets/Normal.dotm`, isi daftar isi, validasi struktur dan rumus. `--tabel` mencetak tabel status referensi; `--strict` membuat peringatan ikut menghentikan build; `--template berkas.dotm` memakai template lain; `--preview` merender PNG halaman penting (lihat langkah 6). Keluaran bawaan `.docm` (makro dan shortcut Normal.dotm ikut); `--docx` menghasilkan `.docx` tanpa makro, dipakai hanya bila diminta atau portal kampus menolak `.docm`. Ekstensi argumen keluaran diabaikan; yang menentukan adalah `--docx`.
5. **Perbaiki.** Galat wajib dibereskan (sitasi di Bab III atau studi kasus, sitasi tanpa entri pustaka atau sebaliknya, pustaka tidak urut abjad, jumlah/tahun referensi di luar syarat, rumus rusak). Peringatan (em dash, kata gemar AI, pembuka klise, entri tanpa link) ditinjau dan diperbaiki bila benar.
6. **Cek visual: opsional, hemat token.** Cukup andalkan validasi skrip. Jalankan `--preview` dan lihat PNG hanya bila pengguna memintanya atau ada indikasi masalah tata letak; bila dilakukan, lihat paling banyak cover dan satu halaman isi. Tanpa modul Math di LibreOffice, rumus tampil kosong di preview; itu keterbatasan tampilan, rumus tersimpan sebagai equation Word.
7. **Serahkan** berkas hasil `build.py` (bukan berkas mentah, daftar isinya kosong) dengan tool pengirim file. Ringkasan akhir singkat: yang perlu diedit pengguna (nama, NIM, bulan-tahun kata pengantar); tabel status referensi dan sumber yang dibuang beserta alasannya; untuk `.docm`: klik kanan berkas > Properties > Unblock (bila diunduh), buka di Word, Enable Content, coba Ctrl+D (daftar isi) dan Ctrl+G (keterangan gambar), karena skill hanya memeriksa struktur, bukan menjalankan makro; bila portal menolak `.docm`, Save As `.docx` atau bangun ulang dengan `--docx`; bila nomor halaman daftar isi perkiraan (ada rumus dan LibreOffice tanpa Math), minta pengguna klik kanan daftar isi > Update Field. Sampaikan pesan limit/upgrade konektor apa adanya.

## Format (sudah dipasang skrip, jangan diubah tanpa diminta)

- A4, margin kiri 4 cm, atas/kanan/bawah 3 cm. Times New Roman 12, spasi 1,5, rata kiri-kanan. Cover: semua teks ukuran 13 (bukan 14) agar baris fakultas muat satu baris.
- Urutan: cover, daftar isi, (daftar gambar/tabel bila ada), kata pengantar, Bab I-III, daftar pustaka. Cover selalu menampilkan baris fakultas dan prodi di atas nama universitas. Placeholder NIM: `( NIM )`.
- Cover dihitung halaman i tapi tanpa nomor. Daftar isi dan kata pengantar romawi tengah bawah. Bab I-III angka mulai 1 kanan bawah. Daftar pustaka tanpa nomor terlihat.
- Style dari `assets/Normal.dotm` (dipasang `scripts/template.py`): Heading 1 = "BAB I", Heading 2 = 1.1, Heading 3 = 1.1.1, Title untuk DAFTAR ISI/GAMBAR/TABEL, KATA PENGANTAR, DAFTAR PUSTAKA; Body Main/2/3 untuk paragraf. Nomor heading otomatis: **judul di `content.json` tidak boleh memuat nomor**.
- Daftar isi otomatis (level 1-3), entri pertama "HALAMAN JUDUL" (teks putih kecil di cover). Daftar Gambar dan Tabel otomatis, hanya bila ada gambar/tabel; keterangan memakai style Caption dengan field SEQ, bernomor per bab: "Gambar 1.1", "Tabel 2.1" (nomor bab diisi skrip; jangan diketik di `caption`).
- Daftar pustaka APA 7, urut abjad, hanging indent **dan** justified sekaligus; jangan diganti rata kiri.
- Rumus: blok `equation` (nomor (1), (2) bila `nomor: true`) atau `$...$` sebaris; jangan teks biasa. LaTeX di luar daftar yang didukung sengaja galat; ganti padanannya.
- Gambar: blok `image` dengan "Gambar b.n." otomatis, opsional "Sumber: ...". Tabel: tidak dibatasi; pakai sesuai kebutuhan atau permintaan pengguna, hanya bila data memang tabular. "Tanpa tabel" berarti `meta.maks_tabel: 0`; batas lain boleh diisi bila diminta.
- Perubahan format (mis. margin) lewat konstanta `scripts/build_makalah.js` untuk makalah itu saja; style lewat `assets/Normal.dotm` atau `scripts/template.py`, bukan format langsung.

## Menulis isi

- **Kata pengantar:** syukur, terima kasih kepada dosen dan rekan kelompok, permohonan kritik dan saran. Tiga paragraf pendek.
- **Bab I:** 1.1 Latar Belakang (umum ke masalah, dengan sitasi), 1.2 Rumusan Masalah (daftar bernomor, satu per materi), 1.3 Tujuan (jumlah sama dengan rumusan), 1.4 Manfaat.
- **Bab II:** satu subbab per butir materi, urut sesuai materi, tiap subbab berkutip dari referensi, sertakan contoh bila memungkinkan (label "Contoh [judul sub materi]"). Materi dengan pengertian dan jenis: subbab "Pengertian" dan "Jenis-jenis" dengan sub-subbab per jenis.
- **Bab III:** 3.1 Kesimpulan (menjawab tiap rumusan), 3.2 Saran. Tanpa sitasi dan tanpa merujuk referensi.
- **Studi kasus** (bila ada): di Bab II atau bagian yang ditunjuk pengguna, subbab berjudul memuat "Studi Kasus" (agar dikenali validator), tanpa sitasi dan tanpa entri pustaka, tidak masuk Latar Belakang/Rumusan/Tujuan, tanpa label "contoh rekaan". Kecuali pengguna meminta lain.
- **Gaya:** Indonesia baku, ilmiah, mengalir. Hindari em dash, pembuka klise ("Dalam era ..."), kata gemar AI (krusial, esensial, komprehensif, holistik, signifikan), daftar tiga yang dipaksakan, penutup satu kalimat yang menggurui, label tebal di dalam paragraf. Variasikan panjang dan awal kalimat. "Kami" hanya di kata pengantar, Bab III, dan bagian bersuara penulis.
- **Kutipan:** parafrase dengan kata sendiri; langsung hanya bila perlu dan sangat pendek. Klaim sebatas yang dibaca; tafsiran sendiri ditulis sebagai pendapat ("menurut kami"). Format: Penulis (2023), (Penulis, 2023), dua penulis dengan "dan" atau "&", tiga atau lebih "dkk.". Sitasi hanya di Bab I-II; daftar pustaka hanya memuat sumber yang disitasi di sana.

## Hal yang sering salah

- Hasil konektor belum valid sebelum metadata dan link dicek ke laman asli; jangan pakai karya hanya karena judulnya cocok.
- Jangan menaruh nomor di judul subbab (dobel dengan nomor otomatis).
- Jangan menaruh sitasi di Bab III atau studi kasus (validator menghentikan build).
- Jangan mengarang sumber, DOI, halaman, atau penulis; jangan buang sumber hanya karena tanpa DOI.
- Jangan menaruh tabel kecil untuk hal yang bisa jadi kalimat.
- Nama, NIM, dan bulan-tahun kata pengantar dibiarkan placeholder dan disebut di ringkasan.
- Permintaan PPT atau ringkasan adalah pekerjaan terpisah; pakai isi makalah sebagai bahan.
