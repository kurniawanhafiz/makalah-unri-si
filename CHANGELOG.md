# Catatan perubahan

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
