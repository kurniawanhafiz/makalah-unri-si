# Shortcut di file makalah hasil skill

Panduan ini menjelaskan shortcut keyboard bawaan template `assets/Normal.dotm` untuk mengedit makalah `.docx` hasil skill `makalah-unri` dan `makalah-unri-si`. Daftarnya sama untuk kedua varian karena keduanya memakai file `Normal.dotm` yang identik.

> Shortcut hanya jalan di **Microsoft Word** (Windows) dan hanya setelah template dipasang ke dokumen (lihat [Langkah pasang](#langkah-pasang)). File `.docx` tidak bisa membawa makro atau shortcut, jadi tanpa langkah ini tombolnya tidak akan bereaksi.

## Langkah pasang

1. Salin `assets/Normal.dotm` ke folder template Word. Ketik `%appdata%\Microsoft\Templates` di File Explorer. Boleh juga disimpan di folder lain.
2. Buka makalahnya di Word. Aktifkan tab **Developer** (File > Options > Customize Ribbon > centang Developer).
3. Klik **Document Template**, lalu **Attach**, dan pilih `Normal.dotm`. Jangan centang "Automatically update document styles".
4. Klik **Enable Content** atau izinkan makro bila Word menanyakannya.
5. Klik di dalam paragraf yang mau diubah, lalu tekan shortcut-nya.

Cara cek bahwa shortcut sudah terpasang: File > Options > Customize Ribbon > **Keyboard shortcuts: Customize**, pilih kategori **Macros** atau **Styles**, lalu lihat kolom "Current keys".

## Ringkasan cepat

| Tombol | Fungsi |
|---|---|
| `Ctrl+1` sampai `Ctrl+9` | Heading 1 sampai Heading 9 |
| `Alt+1` | Body Main |
| `Alt+2` sampai `Alt+9` | Body 2 sampai Body 9 |
| `Alt+H` | Heading Default (judul tanpa nomor) |
| `Alt+P` | Daftar Pustaka |
| `Alt+A` | Normal |
| `Ctrl+G` / `Ctrl+T` / `Ctrl+L` | Sisipkan keterangan Gambar / Tabel / Lampiran |
| `Ctrl+D` | Daftar isi |
| `Alt+R` / `Alt+L` | Nomor halaman romawi / angka |
| `Alt+N` | Section baru |
| `Alt+S` | Ekspor PDF |

## Style paragraf

### Heading (Ctrl + angka)

| Tombol | Style | Hasil di makalah |
|---|---|---|
| `Ctrl+1` | Heading 1 | BAB I, BAB II, dst (nomor otomatis) |
| `Ctrl+2` | Heading 2 | 1.1, 1.2, 2.1, dst |
| `Ctrl+3` | Heading 3 | 1.1.1, 2.4.1, dst |
| `Ctrl+4` sampai `Ctrl+9` | Heading 4 sampai 9 | Level lebih dalam, untuk edit manual |

Nomor heading dibuat otomatis oleh style, jadi **jangan mengetik nomor sendiri** di judul (nanti dobel). Mengganti level heading cukup dengan menekan shortcut lain di paragraf yang sama, nomor ikut menyesuaikan.

Catatan: di Word standar, `Ctrl+1`, `Ctrl+2`, dan `Ctrl+5` dipakai untuk spasi baris. Di dokumen yang memasang template ini, tombol tersebut diganti menjadi heading.

### Isi paragraf (Alt + angka)

| Tombol | Style | Dipakai untuk |
|---|---|---|
| `Alt+1` | Body Main | Paragraf di bawah Bab dan kata pengantar (baris pertama menjorok 1 cm) |
| `Alt+2` | Body 2 | Paragraf di bawah subbab (1.1) |
| `Alt+3` | Body 3 | Paragraf di bawah sub-subbab (1.1.1) |
| `Alt+4` sampai `Alt+9` | Body 4 sampai Body 9 | Level lebih dalam, bila perlu |

### Style lain

| Tombol | Style | Dipakai untuk |
|---|---|---|
| `Alt+H` | Title / Heading Default | DAFTAR ISI, KATA PENGANTAR, DAFTAR PUSTAKA, dan judul sejenis yang masuk daftar isi tanpa nomor bab |
| `Alt+P` | Daftar Pustaka | Entri daftar pustaka (rata kiri-kanan dan menggantung) |
| `Alt+A` | Normal | Mengembalikan paragraf ke style dasar |

## Keterangan dan daftar isi

| Tombol | Fungsi |
|---|---|
| `Ctrl+G` | Sisipkan keterangan gambar, nomor "Gambar n." otomatis |
| `Ctrl+Shift+G` | Terapkan style keterangan gambar ke teks yang sudah ada |
| `Ctrl+Alt+G` | Keterangan gambar dengan format tanpa titik setelah nomor |
| `Ctrl+T` | Sisipkan keterangan tabel, nomor "Tabel n." otomatis |
| `Ctrl+Shift+T` | Terapkan style keterangan tabel ke teks yang sudah ada |
| `Ctrl+Alt+T` | Keterangan tabel dengan format tanpa titik setelah nomor |
| `Ctrl+L` | Sisipkan keterangan lampiran bernomor huruf (Lampiran A, B, dst) |
| `Ctrl+Shift+L` | Terapkan style keterangan lampiran ke teks yang sudah ada |
| `Ctrl+Alt+L` | Keterangan lampiran bernomor angka (Lampiran 1, 2, dst) |
| `Ctrl+D` atau `Ctrl+Shift+D` | Terapkan format daftar isi kustom |

Keterangan memakai style Caption dengan field nomor otomatis, jadi Daftar Gambar dan Daftar Tabel bisa diperbarui. Setelah menambah atau menghapus keterangan, klik kanan daftarnya lalu pilih **Update Field**.

## Halaman, section, dan ekspor

| Tombol | Fungsi |
|---|---|
| `Alt+R` | Sisipkan nomor halaman romawi (i, ii, iii) di tengah bawah, untuk daftar isi dan kata pengantar |
| `Alt+L` | Sisipkan nomor halaman angka (1, 2, 3) |
| `Alt+Shift+L` | Nomor halaman angka di kanan atas |
| `Alt+N` | Buat section baru, supaya penomoran halaman bisa dipisah per bagian |
| `Alt+S` | Ekspor dokumen ke PDF |

## Alat bantu tulisan

| Tombol | Fungsi |
|---|---|
| `Alt+E` | Ubah teks bahasa Inggris yang dipilih menjadi miring (italic) |
| `Alt+I` | Cek ejaan bahasa Indonesia |
| `Alt+→` (panah kanan) | Urutkan dan rapikan daftar pustaka |

## Tips

- Setelah selesai mengedit, klik kanan daftar isi lalu pilih **Update Field** supaya nomor halaman pasti, terutama bila makalah memuat rumus.
- Ganti nama anggota, `( NIM )`, dan bulan-tahun di kata pengantar secara manual. Itu bukan bagian dari shortcut.
- Bila tombol tidak bereaksi: pastikan template terpasang, makro diizinkan, dan fokus kursor ada di dalam dokumen (bukan di kotak lain).
- Shortcut bisa diubah lewat File > Options > Customize Ribbon > Keyboard shortcuts.

## Catatan

Fungsi tiap shortcut dibaca dari pengaturan keyboard di `Normal.dotm`. Nama makronya (misalnya `InsertCaptionGambarWithDot`) dipakai untuk menjelaskan fungsinya. Perilaku persisnya, seperti format "dengan titik" dan "tanpa titik" atau tombol urut daftar pustaka, sebaiknya dicoba sekali di dokumen contoh sebelum dipakai di makalah yang mau dikumpulkan.
