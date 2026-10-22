---
name: "makalah-unri-si"
description: "Varian makalah-unri khusus Program Studi Sistem Informasi, FMIPA Universitas Riau. Membuat makalah kuliah berbahasa Indonesia dalam format .docx siap kumpul (cover dengan logo UNRI, fakultas, dan program studi, daftar isi otomatis, Bab I-III, daftar pustaka APA dengan link valid) dengan dukungan rumus, gambar, dan pemeriksaan isi otomatis. Pakai skill ini hanya bila pengguna secara eksplisit menyebut makalah-unri-si, Sistem Informasi, SI, atau FMIPA. Untuk permintaan makalah umum tanpa penyebutan itu, pakai makalah-unri."
---

# Makalah UNRI Sistem Informasi (docx) v4

Skill ini sama persis dengan `makalah-unri`; satu-satunya beda ada di cover. Di atas "UNIVERSITAS RIAU" selalu tercantum dua baris tebal: "FAKULTAS MATEMATIKA DAN ILMU PENGETAHUAN ALAM" dan "PROGRAM STUDI SISTEM INFORMASI". Keduanya bisa diganti lewat `meta.fakultas` dan `meta.prodi` (isi string kosong untuk menyembunyikan).

Skill ini menghasilkan makalah Bahasa Indonesia dengan format yang sudah disepakati, sehingga pengguna tidak perlu menjelaskan format dari awal. Format, daftar isi, rumus, gambar, dan pemeriksaan isi dikerjakan oleh skrip. Tugas utama Claude: mengumpulkan input, memverifikasi referensi, menulis isi, lalu menjalankan skrip.

Semua perintah dijalankan dari folder skill ini (atau pakai path absolut ke folder ini). Skrip tidak bergantung pada path khusus; berkas sementara dibuat di folder sementara sistem.

## Alur kerja

1. **Kumpulkan input.** Tanya hanya yang belum diberikan, jangan lebih dari beberapa pertanyaan sekaligus:
   - Materi atau poin bahasan, judul makalah, mata kuliah, nama dosen pengampu.
   - Referensi dari pengguna (DOI, link, PDF). Boleh ditambah referensi lain yang valid.
   - **Syarat referensi** (empat hal yang hampir selalu diminta, tanyakan bila belum disebut): jumlah sumber, rentang tahun terbit, minimal yang berbahasa Indonesia, dan apakah ada studi kasus. Simpan di `meta.ref_config` (lihat `references/schema.md`) supaya diperiksa otomatis.
   - Jumlah anggota (default 4). Nama dan NIM dibiarkan placeholder, pengguna mengedit sendiri.
   - Logo: pakai `assets/logo_unri.png` kecuali pengguna mengunggah logo lain.
   - Format lain memakai default di bawah, kecuali pengguna menyebut berbeda.
2. **Cari dan verifikasi referensi** (lihat bagian Referensi: tentukan dulu mode pencarian, Consensus atau pencarian web). Jangan menulis isi sebelum tahu sumber mana yang benar-benar bisa dipakai. Catat hasilnya di `verifikasi_referensi` dan `sumber_dibuang` pada `content.json`.
3. **Tulis `content.json`** sesuai `references/schema.md`. Isi makalah mengikuti bagian Menulis isi. Rumus ditulis dengan LaTeX (lihat schema), gambar lewat blok `image`.
4. **Bangun dengan satu perintah:**
   ```bash
   python3 scripts/build.py content.json hasil/Makalah_<Judul>.docx --tabel --preview
   ```
   Perintah ini berurutan: (1) `check_content.py` memeriksa isi dan berhenti bila ada galat, (2) `build_makalah.js` membangun docx, (3) mendeteksi apakah LibreOffice bisa menggambar rumus, (4) `finalize.py` mengisi daftar isi dan nomor halaman, (5) validasi struktur docx dan cek rumus lewat pandoc, (6) `preview.sh` merender halaman penting ke PNG. `--tabel` mencetak tabel status referensi; `--strict` membuat peringatan ikut menghentikan build.
5. **Perbaiki galat dan tinjau peringatan.** Galat (sitasi di Bab III atau studi kasus, sitasi tanpa entri pustaka atau sebaliknya, daftar pustaka tidak urut abjad, jumlah atau tahun referensi di luar syarat, rumus rusak) harus dibereskan. Peringatan (em dash, kata gemar AI, pembuka klise, entri tanpa link) ditinjau dan diperbaiki bila memang benar.
6. **Cek visual.** Lihat PNG di folder `*_preview/`: cover, daftar isi, halaman pertama tiap bab, halaman berisi rumus atau gambar, dan daftar pustaka. Pastikan cover satu halaman, nomor halaman sesuai, dan entri daftar pustaka rata kiri-kanan dengan baris kedua menjorok. Bila LibreOffice di mesin tidak punya modul Math, rumus tampil kosong di preview; itu keterbatasan tampilan, rumusnya tersimpan sebagai equation Word dan lolos cek pandoc.
7. **Serahkan** file `.docx` hasil `build.py` (bukan berkas sementara) memakai tool pengirim file yang tersedia di sesi. Di ringkasan akhir, tulis:
   - apa yang perlu diedit pengguna (nama, NIM, bulan-tahun di kata pengantar),
   - tabel status referensi dari `--tabel` (sumber, tahun, bahasa, disitasi di bab mana, ditemukan lewat apa, dicek lewat apa, link) dan daftar sumber yang dibuang beserta alasannya,
   - bila nomor halaman daftar isi dihitung dari perkiraan (ada rumus dan LibreOffice tanpa Math), minta pengguna klik kanan daftar isi lalu **Update Field** di Word.

## Format yang sudah dipasang skrip (jangan diubah tanpa diminta)

- A4, margin 4-3-3-3 dibaca sebagai kiri 4 cm, atas 3, kanan 3, bawah 3. Times New Roman 12, spasi 1,5, rata kiri-kanan. Cover ukuran 14.
- Urutan: cover, daftar isi, kata pengantar, Bab I-III, daftar pustaka.
- Cover selalu menampilkan baris fakultas dan program studi di atas nama universitas. Keduanya bisa diganti lewat `meta.fakultas` dan `meta.prodi`.
- Placeholder NIM di cover: `( NIM )`.
- Cover dihitung halaman i tetapi nomornya tidak tampil. Daftar isi dan kata pengantar bernomor romawi di tengah bawah. Bab I sampai III bernomor angka mulai 1 di kanan bawah. Daftar pustaka tanpa nomor yang terlihat.
- Penomoran heading 1.1, 1.2, 2.1, dan sub-subbab 2.4.1. Paragraf di bawah subbab sejajar dengan teks subbab (bukan dengan angkanya), dan baris pertama tetap menjorok.
- Daftar isi otomatis (field TOC, level 1-3). Entri pertama adalah "HALAMAN JUDUL": teks kecil berwarna putih (Heading 1) di paling atas cover, tidak terlihat di cover tetapi muncul di daftar isi dengan halaman i. "DAFTAR ISI" (halaman ii) dan "DAFTAR PUSTAKA" juga Heading 1 sehingga ikut masuk daftar isi.
- Semua Heading 1 memakai spasi sebelum 0 dan setelah 12 pt. Ini sudah permanen di skrip, tidak perlu patch tambahan.
- Daftar pustaka gaya APA 7, urut abjad, menggantung (hanging indent) dan sekaligus rata kiri-kanan (justified). Keduanya berlaku bersamaan dan sudah dipasang di skrip; jangan diganti ke rata kiri.
- Rumus: blok `equation` menjadi equation Word (OMML) yang bisa diedit, dengan nomor (1), (2), ... bila `nomor: true`. Rumus sebaris ditulis `$...$` di dalam teks.
- Gambar: blok `image` dengan keterangan "Gambar n." otomatis di bawahnya, opsional baris "Sumber: ...".
- Hindari tabel. Maksimal satu tabel per makalah (ubah lewat `meta.maks_tabel` bila diminta), dan hanya bila datanya memang tabular.

## Menulis isi

Struktur umum (sesuaikan dengan materi pengguna):

- **Kata pengantar**: puji syukur, terima kasih kepada dosen pengampu dan rekan kelompok, permohonan kritik dan saran. Tiga paragraf pendek.
- **Bab I Pendahuluan**: 1.1 Latar Belakang (dari gambaran umum ke masalah, dengan sitasi), 1.2 Rumusan Masalah (daftar bernomor, satu pertanyaan per materi), 1.3 Tujuan Penulisan (jumlah sama dengan rumusan), 1.4 Manfaat Penulisan. Studi kasus tidak dimasukkan ke latar belakang, rumusan masalah, maupun tujuan, kecuali pengguna memintanya.
- **Bab II Pembahasan**: satu subbab per butir materi pengguna, urut sesuai materi. Gunakan kutipan dari referensi di tiap subbab, dan sertakan contoh bila materinya memungkinkan. Bila materi punya pengertian dan jenis-jenis, buat subbab "Pengertian" dan "Jenis-jenis" dengan sub-subbab per jenis. Contoh diberi label "Contoh [judul sub materi]". Bila ada studi kasus, ikuti aturan studi kasus di bawah.
- **Bab III Penutup**: 3.1 Kesimpulan (menjawab tiap rumusan masalah), 3.2 Saran. Bab III tidak memakai sitasi dan tidak merujuk referensi. Isinya rangkuman temuan Bab II dan pemikiran penulis sendiri.

### Studi kasus

- Ditulis tanpa sitasi dan tanpa referensi. Tidak ada kutipan (Penulis, tahun) di dalamnya, dan tidak ada entri daftar pustaka khusus untuknya, kecuali pengguna memintanya.
- Tidak masuk ke Latar Belakang, Rumusan Masalah, dan Tujuan Penulisan. Tempatnya di Bab II (atau bagian yang ditunjuk pengguna).
- Studi kasus rekaan diberi label "contoh rekaan" di teksnya. Beri judul subbab yang memuat kata "Studi Kasus" supaya validator mengenalinya.

### Gaya penulisan

- Bahasa Indonesia baku, ilmiah, mengalir. Hindari tanda pisah panjang (em dash). Hindari pembuka klise ("Dalam era ..."), kata gemar AI (krusial, esensial, komprehensif, holistik, signifikan), daftar tiga yang dipaksakan, penutup satu kalimat yang menggurui, serta label tebal di dalam paragraf.
- Variasikan panjang kalimat dan awal kalimat. Gunakan "kami" hanya di kata pengantar, Bab III, dan bagian yang memang bersuara penulis.
- Semua kutipan berupa parafrase dengan kata sendiri. Jangan menyalin kalimat sumber. Kutipan langsung hanya bila perlu dan sangat pendek.
- Klaim yang disandarkan pada sumber hanya boleh sebatas yang benar-benar dibaca. Kalau hanya abstrak yang terbaca, tulis hal yang ada di abstrak saja. Kalau menafsirkan sendiri, tulis sebagai pendapat penulis ("menurut kami").
- Sitasi dalam teks: Penulis (2023), (Penulis, 2023), dua penulis dengan "dan" atau "&", tiga penulis atau lebih memakai "dkk.". Sitasi hanya di Bab I dan Bab II. Daftar pustaka hanya memuat sumber yang disitasi di Bab I atau Bab II.

## Referensi

### Mode pencarian (v4)

Sebelum mencari sumber, tentukan dulu mode pencariannya. Tidak perlu bertanya ke pengguna untuk ini.

1. **Cek Consensus AI.** Cari tool `mcp__Consensus__search` (bila hanya tampil sebagai tool tertunda, muat lewat ToolSearch), lalu coba panggil. Tool tidak ada, atau panggilan gagal karena konektor belum terhubung: pakai **pencarian web** (cara pada bagian "Verifikasi dan penulisan entri" di bawah).
2. **Consensus terpasang, terhubung, dan kuota belum habis: Consensus menjadi pencari referensi default**, bukan cadangan. Ini berlaku juga bila pengguna sudah memberi beberapa sumber sendiri; sumber pengguna tetap diverifikasi dan ikut dihitung.
3. **Kuota Consensus habis** (galat batas penggunaan atau pesan upgrade tanpa hasil): pakai pencarian web untuk sisa pekerjaan. Hasil yang sudah didapat sebelum kuota habis tetap boleh dipakai setelah diverifikasi. Galat batas laju sementara (terlalu banyak permintaan) bukan kuota habis: tunggu sekitar 30 detik dan ulangi sekali; bila tetap gagal, pakai pencarian web.
4. **Filter default Consensus** pada setiap panggilan `search`: `open_access=true`, `exclude_preprints=true`, dan `year_min` = tahun berjalan dikurangi 5 (tahun 2026 menjadi `year_min=2021`). Ketiganya memang permintaan pengguna sebagai standar, jadi aturan konektor "jangan pakai filter" tidak berlaku di sini.
5. **Permintaan pengguna di prompt menang atas default.** Bila pengguna menyebut filter lain (rentang tahun berbeda, preprint boleh, tidak harus open access, dan sebagainya), pakai itu menggantikan default yang bersangkutan. Rentang tahun dari `meta.ref_config` (mis. `umur_maks_tahun`) juga menggantikan 5 tahun. Filter Consensus di luar tiga default (`study_types`, `sjr_max`, `domain`, `citation_min`, dan seterusnya), fitur Consensus lain (mis. `create_thread`), serta skill lain (mis. humanizer atau stop-slop) hanya dipakai bila pengguna memintanya di prompt. Jangan melonggarkan atau menambah filter sendiri.
6. **Cara memanggil.** Query berupa istilah akademik yang spesifik (Inggris untuk topik umum), satu query per butir materi, maksimal 3 panggilan sekaligus.
7. **Sumber berbahasa Indonesia** (bila ada syarat `min_indonesia` atau pengguna memintanya): panggil Consensus dulu dengan `country="id"`, atau dengan query berbahasa Indonesia. Bila tetap tidak cukup, baru lengkapi dengan pencarian web (Garuda, SINTA, DOAJ, OJS jurnal).
8. **Kekurangan sumber.** Bila setelah verifikasi sumber dari Consensus belum memenuhi syarat jumlah atau bahasa, lengkapi dengan pencarian web. Filter default tidak dilonggarkan sendiri.
9. **Hasil Consensus tetap diverifikasi.** Consensus hanya menemukan kandidat. Penulis, tahun, judul, jurnal, volume, dan halaman dicocokkan dengan laman aslinya (DOI, laman jurnal, DOAJ, Garuda) seperti aturan di bawah. Paket gratis tidak selalu memberi DOI atau link: cari DOI atau laman artikelnya lewat pencarian web berdasarkan judul dan penulis, lalu buka. Tanpa link yang bisa dibuka dan metadatanya cocok, sumber dibuang dan dicatat di `sumber_dibuang`. Klaim di makalah hanya sebatas abstrak atau teks yang benar-benar terbaca.
10. **Pencatatan.** Isi `ditemukan_lewat` pada tiap entri `verifikasi_referensi`: `Consensus` atau `Pencarian web` (atau `Dari pengguna`). Kolom `dicek_lewat` tetap untuk cara verifikasinya (DOI, laman jurnal, dst). Bila tool Consensus mengembalikan pesan penggunaan atau ajakan upgrade, sampaikan apa adanya di akhir ringkasan akhir. Sitasi bernomor [1] ala konektor hanya untuk balasan chat; isi makalah tetap APA 7.

### Verifikasi dan penulisan entri (berlaku untuk semua mode)

- Coba buka setiap DOI atau link dari pengguna dengan tool pengambil halaman web. Bila terblokir, cari lewat tool pencarian web untuk menemukan judul, penulis, tahun, jurnal, volume, halaman, dan abstrak.
- Sumber yang tidak bisa diverifikasi atau tidak relevan tidak dipakai dan tidak masuk daftar pustaka. Katakan terus terang ke pengguna sumber mana dan kenapa (isi `sumber_dibuang`). Minta pengguna mengunggah PDF-nya bila ia ingin sumber itu dipakai.
- PDF yang diunggah pengguna boleh dibaca penuh dan dikutip lebih dalam.
- Boleh menambah sumber sendiri (jurnal, buku, artikel resmi) asal bisa diverifikasi dan linknya valid. Jangan pernah mengarang sumber, DOI, halaman, atau penulis. Bila daftar penulis tidak pasti, sampaikan ke pengguna.
- Jangan hanya mengandalkan DOI. Cari lewat beberapa basis data: DOAJ, Portal Garuda dan SINTA untuk jurnal Indonesia, Google Scholar, laman resmi jurnal (OJS), repositori kampus, serta arXiv atau CORE bila relevan. ResearchGate boleh dipakai sebagai pilihan terakhir.
- Syarat sumber non-DOI: teks lengkap atau minimal abstraknya bisa dibuka tanpa login dan tanpa bayar, dan metadatanya (penulis, tahun, judul, jurnal, volume, halaman) cocok dengan laman aslinya. ResearchGate sering menolak akses otomatis (403); cocokkan metadatanya lewat laman jurnal, DOAJ, atau Garuda. Kalau tetap tidak cocok, sumber tidak dipakai.
- Urutan prioritas link: DOI, laman artikel di situs resmi jurnal, halaman artikel di DOAJ, repositori institusi atau Garuda, lalu ResearchGate. Satu link per entri, dan hanya link yang benar-benar sudah dibuka atau dicek.
- Format di `content.json`: tiap entri satu string APA 7, `*tanda bintang*` untuk huruf miring (nama jurnal, volume, judul buku), urut abjad. DOI ditulis `https://doi.org/...`. Tanpa DOI, tulis URL laman artikelnya di akhir entri, tanpa kata "Diakses dari".
- Untuk setiap sumber isi `verifikasi_referensi`: `ref` (potongan awal entri, mis. "Alfa, A. (2023)"), `ditemukan_lewat` (`Consensus`, `Pencarian web`, atau `Dari pengguna`), `dicek_lewat` (DOI, laman jurnal, DOAJ, Garuda, dst), dan `bahasa` (`id` atau `en`). Dengan ini tabel status referensi dan syarat minimal bahasa Indonesia terhitung pasti, bukan perkiraan.
- Jumlah wajar untuk makalah mahasiswa: 5 sampai 8 sumber, atau sesuai syarat pengguna. Hitungan hanya untuk sumber yang disitasi di Bab I dan II.

## Hal yang sering salah

- Jangan menganggap hasil Consensus sudah valid. Metadata dan link tetap dicek ke laman asli sebelum masuk daftar pustaka.
- Jangan memakai Consensus tanpa tiga filter default (open access, tanpa preprint, 5 tahun terakhir) kecuali pengguna menggantinya di prompt, dan jangan menambah filter lain tanpa diminta.
- Jangan bertanya ke pengguna apakah Consensus terpasang atau kuotanya habis; cek sendiri lewat tool dan galatnya.
- Serahkan hasil `build.py`, bukan berkas mentah, karena daftar isi di berkas mentah kosong.
- Jangan membuang sumber hanya karena tidak punya DOI. Coba DOAJ, Garuda, laman jurnal, repositori, atau ResearchGate dulu.
- Jangan menaruh sitasi atau kutipan di Bab III maupun studi kasus. Validator akan menghentikan build.
- Jangan membuat daftar pustaka rata kiri saja. Entri harus rata kiri-kanan dan tetap menggantung.
- Rumus jangan ditulis sebagai teks biasa seperti "n!/(r!(n-r)!)". Pakai blok `equation` atau `$...$`. Perintah LaTeX di luar daftar yang didukung sengaja menimbulkan galat saat build; ganti dengan padanan yang didukung.
- Jangan menaruh tabel kecil untuk hal yang bisa ditulis sebagai kalimat.
- Nama, NIM, dan bulan-tahun kata pengantar dibiarkan placeholder dan disebut di ringkasan akhir.
- Bila pengguna meminta perubahan format (misalnya margin lain), ubah konstanta di `scripts/build_makalah.js` untuk makalah itu saja dan sebutkan perubahannya.
- Bila pengguna ingin makalah sebagai PPT atau ringkasan, itu pekerjaan terpisah: gunakan isi makalah sebagai bahan.
