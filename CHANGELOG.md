# Catatan perubahan

## v6.1.0 (2026-11-08)

Fitur baru:

- **Keluaran bawaan `.docm`.** `template.py` (`make_docm`) menyalin dari `assets/Normal.dotm` ke makalah: proyek VBA (`vbaProject.bin`) beserta tanda tangannya, `vbaData.xml`, peta shortcut (`customizations.xml`), dan building block (`glossary`), lengkap dengan content type dan relasinya. Shortcut dan makro template (heading, daftar isi, keterangan gambar/tabel, nomor halaman, dst) aktif langsung di makalah.
- `build.py --docx` menghasilkan `.docx` biasa tanpa makro. Ekstensi pada argumen keluaran diabaikan; ekstensi ditentukan oleh `--docx`.
- `build.py` memeriksa struktur `.docm` (zip dan XML valid, bagian makro dan glossary ada). Makro belum bisa dijalankan di mesin pembuat, jadi pengguna diminta mengecek di Word (Unblock, Enable Content, coba Ctrl+D dan Ctrl+G).

Tidak berubah: format dokumen, style, validator, dan alur pencarian referensi dari v6.

## v6.0.0 (2026-11-08)

Fitur baru:

- **Template Word `assets/Normal.dotm`** menjadi sumber style dan penomoran. `scripts/template.py` memasangnya ke .docx hasil build: Heading 1 ("BAB I") sampai Heading 9 dengan penomoran otomatis (BAB I, 1.1, 1.1.1, dst), Title / Heading Default untuk DAFTAR ISI, KATA PENGANTAR, dan DAFTAR PUSTAKA, Body Main / Body 2 / Body 3 untuk paragraf, Caption, Table of Figures, TOC, dan Daftar Pustaka. Judul subbab di `content.json` kini tanpa nomor. Template lain bisa dipakai lewat `build.py --template berkas.dotm`.
- Daftar Gambar dan Daftar Tabel otomatis (field Table of Figures) bila ada gambar atau tabel. Keterangan memakai style Caption dengan nomor otomatis (SEQ).
- README: cara pasang di Claude Code, Hermes Agent, dan OpenClaw, plus cara memasang Normal.dotm supaya shortcut dan makro template aktif di Word.

Perubahan:

- Ukuran font cover: seluruh teks cover `makalah-unri` 14, seluruh teks cover `makalah-unri-si` 13 (supaya baris fakultas tidak patah jadi dua). Diatur lewat `cover_size_pt` di `variant.json`.
- Label "contoh rekaan" dihapus dari aturan, validator (peringatan dihapus), contoh, dan README. Contoh buatan sendiri tidak diberi label.
- Data pribadi dihapus dari contoh dan dokumentasi (nama dosen di schema, dst). Kredit pembuat di README dan LICENSE dipertahankan.
- Spasi setelah Heading 1 dan Title tetap 12 pt (template bawaan 18 pt, ditimpa oleh `template.py`). Margin tetap 4-3-3-3 (template 3 cm semua sisi). Tab rata kanan daftar isi dipasang di lebar teks.
- Daftar pustaka memakai style Daftar Pustaka template (menggantung 0,9 cm, rata kiri-kanan), paragraf kata pengantar memakai Body Main (menjorok 1 cm), dan paragraf bawah subbab menjorok mengikuti Body 2 dan Body 3.

Catatan: makro VBA dan shortcut di Normal.dotm tidak ikut ke .docx karena format docx tidak bisa membawa makro. Pasang Normal.dotm sebagai template di Word untuk memakainya.

## v5.0.0 (2026-11-08)

Fitur baru:

- Consensus AI dan OpenAlex dipakai bersamaan. Bila kedua konektor tersedia, tiap butir materi dicari di keduanya, hasil digabung, dan duplikat (DOI sama, atau judul dan tahun sama) dibuang. Pengguna bisa menetapkan di prompt salah satu sebagai utama dan yang lain pelengkap, atau pembagian tugas; permintaan itu menggantikan default.
- Ketersediaan dan limit dinilai per konektor. Bila hanya satu yang tersedia, skill memakai konektor itu sendirian lalu melengkapi dengan pencarian web; bila tidak ada yang tersedia, pencarian web seperti v3. Salah satu limit di tengah jalan tidak menghentikan pekerjaan.
- Ketentuan tiap konektor dari versi sebelumnya dipertahankan. Consensus: open access, tanpa preprint, 5 tahun terakhir. OpenAlex: karya, `search_in="fulltext"`, Boolean dan stemming aktif (`mode="keyword"`), open access, tanpa preprint, 5 tahun terakhir. Rentang tahun dari prompt atau `ref_config` berlaku untuk kedua konektor.
- Sumber berbahasa Indonesia dicari lewat semua jalur sekaligus: Consensus (`country="id"` atau query Indonesia) serta OpenAlex (`language="id"` dan `countries=["ID"]`), lalu pencarian web bila masih kurang.
- Kandidat Consensus yang belum punya DOI dicocokkan dulu lewat OpenAlex (`resolve_references` dan `get_work`, hanya kecocokan `exact` atau `likely`), baru pencarian web untuk yang tidak ketemu. Verifikasi ke laman asli tetap wajib.
- `verifikasi_referensi[].ditemukan_lewat` kini bisa `Consensus`, `OpenAlex`, `Consensus + OpenAlex`, `Pencarian web`, atau `Dari pengguna`.

Tidak berubah: format dokumen, validator, skrip, dan alur build.

## v4.5.0 (2026-11-08)

Perubahan:

- OpenAlex menggantikan Consensus AI sebagai pencari referensi default. Bila konektor OpenAlex terpasang, terhubung, dan belum limit, skill memakainya lebih dulu; bila belum terpasang, atau sudah limit, skill memakai pencarian web seperti v3. Pengecekan dilakukan sendiri lewat tool dan galatnya, tanpa bertanya ke pengguna. Consensus tidak dipakai di versi ini.
- Ketentuan bawaan pencarian: karya (`search_works`), `search_in="fulltext"` (judul, abstrak, teks lengkap, dan keyword), Boolean aktif, dan stemming aktif (`mode="keyword"`). Aturan baru: tanda `*` tidak boleh di dalam frasa berkutip karena OpenAlex menolak query itu.
- Filter default v4 dibawa ke OpenAlex: `open_access_only=true`, `raw_filter="type:!preprint"`, dan `from_year` = tahun berjalan dikurangi 5. Permintaan di prompt atau `ref_config` menggantikan default. Parameter dan tool OpenAlex lain, serta skill lain, hanya dipakai bila diminta.
- Sumber berbahasa Indonesia dicari bergantian: `language="id"` dengan query berbahasa Indonesia, lalu `countries=["ID"]`, lalu pencarian web (Garuda, SINTA, DOAJ, OJS).
- Verifikasi: `get_work` dan `resolve_references` dipakai sebagai cek awal metadata dan DOI. Verifikasi ke laman asli tetap wajib.
- Karena pencarian mencakup teks lengkap, abstrak dibaca dulu untuk memastikan karya benar-benar membahas butir materinya.
- `verifikasi_referensi[].ditemukan_lewat` kini berisi `OpenAlex`, `Pencarian web`, atau `Dari pengguna`.

Tidak berubah: format dokumen, validator, skrip, dan alur build dari v4.

Rencana: v5 memakai OpenAlex dan Consensus bersamaan.

## v4.0.0 (2026-10-23)

Fitur baru:

- Consensus AI sebagai pencari referensi default. Bila konektor Consensus terpasang dan terhubung, skill memakainya lebih dulu; bila belum terpasang, atau kuota akun habis, skill memakai pencarian web seperti v3. Pengecekan dilakukan sendiri lewat tool dan galatnya, tanpa bertanya ke pengguna.
- Filter default Consensus: open access, tanpa preprint, 5 tahun terakhir. Permintaan di prompt (mis. rentang tahun lain atau `ref_config`) menggantikan default. Filter dan fitur Consensus lain, serta skill lain, hanya dipakai bila diminta di prompt.
- Sumber berbahasa Indonesia dicari lewat Consensus dulu (filter `country="id"` atau query berbahasa Indonesia); bila tetap kurang, dilengkapi pencarian web (Garuda, SINTA, DOAJ, OJS).
- Hasil Consensus tetap diverifikasi: metadata dicocokkan ke laman asli, link yang tidak ada di hasil Consensus dicari lewat pencarian web, sumber yang tidak lolos dibuang dan dicatat.
- `verifikasi_referensi[].ditemukan_lewat` (opsional) dan kolom "Ditemukan lewat" di tabel status referensi (`--tabel`).

Tidak berubah: format dokumen, validator, dan alur build dari v3.

## v3.0.0 (2026-10-22)

Perbaikan:

- Daftar pustaka kini benar-benar rata kiri-kanan (justified) dan menggantung di `build_makalah.js`. Sebelumnya hanya tertulis di SKILL.md, skripnya masih rata kiri.
- Spasi 12 pt setelah Heading 1 dipasang permanen di skrip. Langkah `grep || sed` dihapus dari alur kerja.
- Gambar tidak lagi terpotong di LibreOffice (jarak baris ditulis eksplisit `auto`).
- Path dan nama tool tidak lagi terkunci ke satu lingkungan. Skrip menghitung path dari lokasinya sendiri dan memakai folder sementara sistem.
- Placeholder NIM di cover berbunyi `( NIM )`.

Fitur baru:

- Blok `equation`: rumus LaTeX menjadi equation Word (OMML), dengan nomor opsional. Rumus sebaris `$...$` di dalam teks.
- Blok `image`: gambar PNG, JPG, atau GIF dengan keterangan "Gambar n." otomatis dan baris "Sumber" opsional.
- `scripts/check_content.py`: validator sebelum build. Galat untuk aturan keras, peringatan untuk gaya.
- `scripts/build.py`: satu perintah untuk cek, bangun, daftar isi, validasi, cek rumus lewat pandoc, dan preview.
- `scripts/preview.sh`: render halaman penting ke PNG.
- `meta.ref_config`, `verifikasi_referensi`, `sumber_dibuang`: syarat dan status referensi tercatat dan dicek, ada tabel status untuk ringkasan akhir.
- Penghitung nomor halaman daftar isi punya jalur cadangan (kembaran paginasi) untuk mesin yang LibreOffice-nya tidak punya modul Math.
- Pertanyaan input baku: jumlah referensi, rentang tahun, minimal berbahasa Indonesia, studi kasus.

Struktur:

- Kedua skill kini dibangkitkan dari satu sumber, jadi perubahan tidak perlu dikerjakan dua kali.
- Deskripsi trigger dipertegas: `makalah-unri` untuk permintaan makalah umum, `makalah-unri-si` hanya bila Sistem Informasi, FMIPA, atau nama skillnya disebut.
- Ditambah README.en.md, LICENSE (MIT), dan CHANGELOG.

## v2

Versi sebelum v3: cover UNRI, daftar isi otomatis, daftar pustaka APA, Heading 1 dengan spasi setelah 12 pt (lewat patch `sed`), Bab III dan studi kasus bebas sitasi, referensi tidak hanya mengandalkan DOI, varian `makalah-unri-si`.
