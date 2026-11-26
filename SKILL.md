---
name: "makalah-unri-si"
description: "Varian makalah-unri khusus Program Studi Sistem Informasi, FMIPA Universitas Riau. Membuat makalah kuliah berbahasa Indonesia format .docx siap kumpul (cover logo UNRI, fakultas, dan program studi, daftar isi otomatis, Bab I-III, daftar pustaka APA dengan link valid, rumus, gambar, pemeriksaan isi otomatis). Pakai hanya bila pengguna eksplisit menyebut makalah-unri-si, Sistem Informasi, SI, atau FMIPA; untuk permintaan makalah umum pakai makalah-unri."
---

# Makalah UNRI Sistem Informasi (docx) v5.1

Sama persis dengan `makalah-unri`; satu-satunya beda ada di cover. Di atas "UNIVERSITAS RIAU" selalu tercantum dua baris tebal: "FAKULTAS MATEMATIKA DAN ILMU PENGETAHUAN ALAM" dan "PROGRAM STUDI SISTEM INFORMASI" (ukuran 13 agar baris fakultas tidak patah). Keduanya bisa diganti lewat `meta.fakultas` dan `meta.prodi` (string kosong menyembunyikan).

Format, daftar isi, rumus, gambar, dan pemeriksaan isi dikerjakan skrip. Tugas Claude: mengumpulkan input, memverifikasi referensi, menulis isi, menjalankan skrip. Semua perintah dijalankan dari folder skill ini.

## Alur kerja

1. **Kumpulkan input.** Tanya hanya yang belum diberikan, beberapa pertanyaan sekaligus saja:
   - Materi atau poin bahasan, judul, mata kuliah, dosen pengampu.
   - Referensi dari pengguna (DOI, link, PDF); boleh ditambah sumber valid lain.
   - **Syarat referensi** (tanyakan bila belum disebut): jumlah sumber, rentang tahun, minimal berbahasa Indonesia, ada tidaknya studi kasus. Simpan di `meta.ref_config` (lihat `references/schema.md`).
   - Jumlah anggota (default 4); nama dan NIM tetap placeholder. Logo: `assets/logo_unri.png` kecuali pengguna mengunggah yang lain.
   - Format lain memakai default di bawah kecuali pengguna menyebut berbeda.
2. **Cari dan verifikasi referensi** (bagian Referensi). Jangan menulis isi sebelum tahu sumber mana yang bisa dipakai. Catat di `verifikasi_referensi` dan `sumber_dibuang`.
3. **Tulis `content.json`** sesuai `references/schema.md`. Rumus dengan LaTeX, gambar lewat blok `image`.
4. **Bangun:**
   ```bash
   python3 scripts/build.py content.json hasil/Makalah_<Judul>.docx --tabel --preview
   ```
   Urutan: `check_content.py` (berhenti bila ada galat), `build_makalah.js`, deteksi rumus di LibreOffice, `finalize.py` (daftar isi dan nomor halaman), validasi docx dan rumus (pandoc), `preview.sh` (PNG). `--tabel` mencetak tabel status referensi; `--strict` membuat peringatan ikut menghentikan build.
5. **Perbaiki galat, tinjau peringatan.** Galat wajib dibereskan (sitasi di Bab III atau studi kasus, sitasi tanpa entri atau sebaliknya, daftar pustaka tidak urut abjad, jumlah atau tahun di luar syarat, rumus rusak). Peringatan (em dash, kata gemar AI, pembuka klise, entri tanpa link) diperbaiki bila memang benar.
6. **Cek visual** PNG di `*_preview/`: cover satu halaman, daftar isi, halaman pertama tiap bab, halaman rumus atau gambar, daftar pustaka rata kiri-kanan dengan baris kedua menjorok. LibreOffice tanpa modul Math menampilkan rumus kosong di preview; itu keterbatasan tampilan, rumusnya tersimpan sebagai equation Word dan lolos cek pandoc.
7. **Serahkan** `.docx` hasil `build.py` (bukan berkas sementara) lewat tool pengirim file. Di ringkasan akhir tulis: yang perlu diedit pengguna (nama, NIM, bulan-tahun kata pengantar); tabel status referensi dari `--tabel` dan sumber yang dibuang beserta alasannya; bila nomor halaman daftar isi perkiraan (ada rumus dan LibreOffice tanpa Math), minta pengguna klik kanan daftar isi lalu **Update Field** di Word.

## Format yang sudah dipasang skrip (jangan diubah tanpa diminta)

- A4, margin 4-3-3-3 = kiri 4 cm, atas 3, kanan 3, bawah 3. Times New Roman 12, spasi 1,5, rata kiri-kanan. Cover ukuran 13 (seluruh teks cover, dari `variant.json`).
- Urutan: cover, daftar isi, kata pengantar, Bab I-III, daftar pustaka.
- Cover selalu menampilkan baris fakultas dan program studi di atas nama universitas; bisa diganti lewat `meta.fakultas` dan `meta.prodi`.
- Placeholder NIM: `( NIM )`.
- Cover dihitung halaman i tanpa nomor tampil. Daftar isi dan kata pengantar romawi di tengah bawah. Bab I-III angka mulai 1 di kanan bawah. Daftar pustaka tanpa nomor terlihat.
- Heading 1.1, 1.2, 2.1, sub-subbab 2.4.1. Paragraf di bawah subbab sejajar dengan teks subbab (bukan angkanya), baris pertama menjorok.
- Daftar isi otomatis (TOC level 1-3). Entri pertama "HALAMAN JUDUL": Heading 1 putih ukuran kecil di atas cover (tak terlihat, tampil di daftar isi halaman i). "DAFTAR ISI" (ii) dan "DAFTAR PUSTAKA" juga Heading 1. Semua Heading 1 spasi sebelum 0, setelah 12 pt (permanen di skrip).
- Daftar pustaka APA 7, urut abjad, menggantung sekaligus rata kiri-kanan (jangan diganti rata kiri).
- Blok `equation` menjadi equation Word (OMML) yang bisa diedit, bernomor (1), (2), ... bila `nomor: true`. Rumus sebaris `$...$`.
- Blok `image` dengan keterangan "Gambar n." otomatis, opsional baris "Sumber: ...".
- Hindari tabel: maksimal satu (`meta.maks_tabel`), hanya bila datanya tabular. Jangan pakai tabel kecil untuk hal yang bisa jadi kalimat.

## Menulis isi

- **Kata pengantar**: puji syukur, terima kasih kepada dosen dan rekan kelompok, permohonan kritik dan saran. Tiga paragraf pendek.
- **Bab I**: 1.1 Latar Belakang (umum ke masalah, bersitasi), 1.2 Rumusan Masalah (daftar bernomor, satu pertanyaan per materi), 1.3 Tujuan (jumlah sama dengan rumusan), 1.4 Manfaat.
- **Bab II**: satu subbab per butir materi, urut sesuai materi, kutipan dari referensi di tiap subbab, contoh bila memungkinkan. Materi berisi pengertian dan jenis: subbab "Pengertian" dan "Jenis-jenis" dengan sub-subbab per jenis. Contoh diberi label "Contoh [judul sub materi]".
- **Bab III**: 3.1 Kesimpulan (menjawab tiap rumusan), 3.2 Saran. Tanpa sitasi dan tanpa merujuk referensi; isinya rangkuman Bab II dan pemikiran penulis.
- **Studi kasus** (bila ada): tanpa sitasi, tanpa kutipan (Penulis, tahun), tanpa entri pustaka khusus, kecuali diminta. Tidak masuk Latar Belakang, Rumusan Masalah, Tujuan; tempatnya Bab II atau bagian yang ditunjuk pengguna. Judul subbab memuat "Studi Kasus" agar dikenali validator. Studi kasus dan contoh buatan sendiri tidak diberi label khusus.

**Gaya:**
- Bahasa Indonesia baku, ilmiah, mengalir. Hindari em dash, pembuka klise ("Dalam era ..."), kata gemar AI (krusial, esensial, komprehensif, holistik, signifikan), daftar tiga yang dipaksakan, penutup satu kalimat yang menggurui, label tebal di dalam paragraf.
- Variasikan panjang dan awal kalimat. "Kami" hanya di kata pengantar, Bab III, dan bagian bersuara penulis.
- Kutipan berupa parafrase dengan kata sendiri; kutipan langsung hanya bila perlu dan sangat pendek. Klaim hanya sebatas yang benar-benar dibaca (hanya abstrak terbaca: tulis yang ada di abstrak); tafsiran sendiri ditulis sebagai pendapat penulis ("menurut kami").
- Sitasi: Penulis (2023), (Penulis, 2023), dua penulis dengan "dan" atau "&", tiga atau lebih "dkk.". Sitasi hanya di Bab I dan II; daftar pustaka hanya memuat sumber yang disitasi di sana.

## Referensi

**Mode pencarian** (tentukan sendiri, jangan tanya pengguna): coba panggil `mcp__Consensus__search` dan `mcp__OpenAlex__search_works` (muat lewat ToolSearch bila tertunda). Minimal satu tersedia: baca `references/pencarian.md` dan ikuti. Tidak ada: pencarian web dengan aturan di bawah.

**Verifikasi dan penulisan entri (semua mode):**
- Buka setiap DOI atau link dari pengguna dengan tool pengambil halaman. Bila terblokir, cari lewat pencarian web untuk judul, penulis, tahun, jurnal, volume, halaman, abstrak. Hasil konektor juga hanya kandidat: metadata dan link tetap dicek ke laman asli.
- Sumber yang tak bisa diverifikasi atau tak relevan tidak dipakai dan tidak masuk daftar pustaka. Katakan terus terang sumber mana dan kenapa (`sumber_dibuang`); minta PDF bila pengguna ingin sumber itu dipakai. PDF yang diunggah boleh dibaca penuh dan dikutip lebih dalam.
- Boleh menambah sumber sendiri (jurnal, buku, artikel resmi) asal terverifikasi dan linknya valid. Jangan pernah mengarang sumber, DOI, halaman, atau penulis; bila daftar penulis tak pasti, sampaikan.
- Jangan hanya mengandalkan DOI. Cari lewat DOAJ, Garuda dan SINTA (jurnal Indonesia), Google Scholar, laman jurnal (OJS), repositori kampus, arXiv atau CORE bila relevan; ResearchGate pilihan terakhir. Jangan membuang sumber hanya karena tanpa DOI.
- Sumber non-DOI: teks lengkap atau minimal abstrak terbuka tanpa login dan tanpa bayar, metadata (penulis, tahun, judul, jurnal, volume, halaman) cocok dengan laman asli. ResearchGate sering menolak akses otomatis (403): cocokkan lewat laman jurnal, DOAJ, atau Garuda. Tetap tak cocok: tidak dipakai.
- Prioritas link: DOI, laman artikel di situs jurnal, DOAJ, repositori atau Garuda, ResearchGate. Satu link per entri, hanya yang benar-benar sudah dibuka atau dicek.
- Format entri: satu string APA 7, `*bintang*` untuk huruf miring (jurnal, volume, judul buku), urut abjad. DOI `https://doi.org/...`. Tanpa DOI, URL laman artikel di akhir entri tanpa "Diakses dari".
- Tiap sumber di `verifikasi_referensi`: `ref` (potongan awal entri, mis. "Alfa, A. (2023)"), `ditemukan_lewat` (`Consensus`, `OpenAlex`, `Consensus + OpenAlex`, `Pencarian web`, `Dari pengguna`), `dicek_lewat`, `bahasa` (`id` atau `en`).
- Jumlah wajar 5 sampai 8 sumber atau sesuai syarat pengguna, dihitung dari sumber yang disitasi di Bab I dan II.

## Hal yang sering salah

- Jangan memakai karya hanya karena judulnya cocok atau muncul di hasil konektor; baca abstraknya. Jangan memakai kecocokan `resolve_references` yang `uncertain` atau `none` untuk mengisi DOI.
- Jangan menaruh sitasi atau kutipan di Bab III maupun studi kasus (validator menghentikan build).
- Rumus jangan berupa teks biasa ("n!/(r!(n-r)!)"): pakai `equation` atau `$...$`. LaTeX di luar daftar yang didukung sengaja menimbulkan galat; ganti dengan padanannya.
- Serahkan hasil `build.py`, bukan berkas mentah (daftar isinya kosong).
- Permintaan perubahan format (mis. margin lain): ubah konstanta di `scripts/build_makalah.js` untuk makalah itu saja dan sebutkan.
- Makalah sebagai PPT atau ringkasan adalah pekerjaan terpisah; isi makalah menjadi bahannya.
