# Shortcut keyboard di makalah hasil skill

Berlaku untuk makalah `.docm` yang dibuat oleh skill `makalah-unri` dan `makalah-unri-si`. Keduanya membawa template `assets/Normal.dotm` yang sama persis, jadi daftar shortcutnya juga sama.

Daftar ini dibaca langsung dari peta shortcut dan kode makro di `Normal.dotm` (v6.1), bukan dari ingatan.

## Sebelum mulai

1. Shortcut hanya hidup di file **`.docm`** (keluaran bawaan). File `.docx` tidak membawa makro, jadi tidak ada shortcut.
2. Bila `.docm` diunduh dari internet: klik kanan berkas, **Properties**, centang **Unblock**, OK.
3. Buka di Word, lalu klik **Enable Content** pada bilah kuning.
4. Cek cepat: taruh kursor di baris kosong paling akhir dokumen, tekan `Ctrl+D`. Kalau muncul judul "DAFTAR ISI", makro jalan. Batalkan dengan `Ctrl+Z` (bila perlu beberapa kali) supaya daftar isi tidak dobel; makalah hasil skill sudah punya daftar isi. Atau cek di dokumen kosong, bukan di makalah yang akan dikumpulkan.

Makro ditulis untuk **Word desktop di Windows** (ekspor PDF memakai path Windows). Word Online tidak menjalankan makro. Word untuk Mac belum diuji.

Cara baca: `Ctrl+Shift+D` berarti tekan Ctrl, Shift, dan D bersamaan.

## Heading dan style paragraf

| Shortcut | Fungsi |
|---|---|
| `Ctrl+1` | Heading 1 (BAB). Makro langsung menyisipkan line break (seperti Shift+Enter) setelah nomor BAB, jadi tinggal ketik judul bab (misal PENDAHULUAN) |
| `Ctrl+2` sampai `Ctrl+9` | Heading 2 sampai Heading 9 (1.1, 1.1.1, dst) |
| `Alt+1` | Style paragraf **Body Main** (isi di bawah bab, juga kata pengantar) |
| `Alt+2` sampai `Alt+9` | Style paragraf **Body 2** sampai **Body 9** |
| `Alt+H` | Style **Heading Default** (judul tanpa nomor yang ikut masuk daftar isi: DAFTAR ISI, KATA PENGANTAR, DAFTAR PUSTAKA) |
| `Alt+A` | Kembali ke style **Normal** |
| `Alt+P` | Style **Daftar Pustaka** (menggantung dan rata kiri-kanan) |

Angkanya berpasangan: heading level N diikuti paragraf `Alt+N`. Contoh: judul subbab pakai `Ctrl+2`, paragraf di bawahnya `Alt+2` (Body 2); sub-subbab `Ctrl+3`, paragrafnya `Alt+3` (Body 3). Nomor heading ikut otomatis, jadi jangan diketik manual.

## Daftar isi, gambar, tabel, lampiran

| Shortcut | Fungsi |
|---|---|
| `Ctrl+D` atau `Ctrl+Shift+D` | Ketik judul **DAFTAR ISI** (style Heading Default) lalu sisipkan daftar isi otomatis level 1 sampai 3 |
| `Ctrl+G` | Keterangan gambar **dengan nomor bab** (Gambar 2.1), di bawah gambar |
| `Ctrl+Alt+G` | Keterangan gambar **tanpa nomor bab** (Gambar 1, 2, 3, urut) |
| `Ctrl+Shift+G` | Buat **DAFTAR GAMBAR** otomatis di posisi kursor |
| `Ctrl+T` | Keterangan tabel dengan nomor bab (Tabel 2.1) |
| `Ctrl+Alt+T` | Keterangan tabel tanpa nomor bab (Tabel 1, 2, 3) |
| `Ctrl+Shift+T` | Buat **DAFTAR TABEL** otomatis |
| `Ctrl+L` | Nomor lampiran huruf besar (A, B, C) dengan style Lampiran, lalu ketik judulnya |
| `Ctrl+Alt+L` | Nomor lampiran angka (1, 2, 3) |
| `Ctrl+Shift+L` | Buat **DAFTAR LAMPIRAN** otomatis |

Catatan untuk makalah buatan skill:

- Gambar dan tabel bawaan skill bernomor urut tanpa nomor bab ("Gambar 1. Judul"). Kalau menambah sendiri, pakai `Ctrl+Alt+G` dan `Ctrl+Alt+T` supaya nomornya nyambung. `Ctrl+G` dan `Ctrl+T` menghasilkan nomor bab, jangan dicampur dalam satu makalah.
- Makro keterangan menyisipkan "Gambar n" lalu satu spasi. Bila ingin seragam dengan bawaan skill, tambahkan titik sendiri sebelum judul.
- Keterangan bernomor bab butuh minimal satu Heading 1 di dokumen. Kalau belum ada, muncul peringatan "Harap masukkan Heading 1 terlebih dahulu! Tekan CTRL + 1."
- Untuk keterangan gambar dan tabel, kursor harus di baris tempat keterangan akan muncul (biasanya baris kosong tepat di bawah gambar atau tabel).
- Template juga membawa building block daftar isi bernama "DAFTAR ISI (Ctrl + D)" di galeri Table of Contents.

## Nomor halaman dan section

| Shortcut | Fungsi |
|---|---|
| `Alt+N` | Sisipkan section break halaman baru, lalu putuskan "Link to Previous" di header dan footer supaya nomor halaman section ini bisa diatur sendiri |
| `Alt+R` | Nomor halaman **romawi kecil** (i, ii, iii) di tengah bawah |
| `Alt+L` | Nomor halaman **angka** di tengah bawah |
| `Alt+Shift+L` | Nomor halaman **angka di kanan atas** (di header, footer dikosongkan) |

Pakai di section yang sedang ditempati kursor. Makro ini menghapus nomor lama di footer atau header section itu sebelum memasang yang baru, dan nomor **melanjutkan** section sebelumnya (tidak mulai dari 1). Bila bagian isi harus mulai dari 1: **Insert > Page Number > Format Page Numbers > Start at: 1**.

Nomor halaman makalah hasil skill sudah terpasang. Shortcut ini dipakai kalau kamu menambah section atau mengubah penomoran.

## Pemeriksaan teks

| Shortcut | Fungsi |
|---|---|
| `Alt+E` | Blok teks dulu. Setiap kata yang ditandai salah eja (garis merah) ditanyakan: jadikan *italic*? Cocok untuk istilah asing. Jawaban untuk kata yang sama diingat |
| `Alt+I` | Blok teks dulu. Kata salah eja otomatis diganti dengan **saran pertama** Word dan ditebalkan. Lalu muncul pilihan: Yes (pertahankan tebal), No (hilangkan tebal), Cancel (batalkan semua perubahan) |

Hati-hati dengan `Alt+I`: saran pertama Word tidak selalu benar dan nama atau istilah teknis bisa ikut terganti. Baca ulang hasilnya, atau pilih Cancel kalau ragu.

## Daftar pustaka

| Shortcut | Fungsi |
|---|---|
| `Alt+→` (panah kanan) | Blok semua entri daftar pustaka dulu. Makro mengurutkannya A sampai Z dan menerapkan style **Reference** |

Daftar pustaka hasil skill sudah urut abjad dan memakai style Daftar Pustaka, jadi makro ini terutama berguna untuk entri yang kamu tambah manual. Bila tampilan entri berubah dari yang diharapkan, blok lagi lalu tekan `Alt+P`.

Tombolnya terbaca dari peta shortcut sebagai kode 0x27, yang biasanya berarti panah kanan; ini satu-satunya shortcut yang tafsirannya belum saya pastikan di Word langsung. Untuk memastikan di Word-mu: **File > Options > Customize Ribbon > Keyboard shortcuts: Customize...**, kategori **Macros**, pilih `ReferenceSortAndStyling`, dan lihat kolom "Current keys".

## Ekspor PDF

| Shortcut | Fungsi |
|---|---|
| `Alt+S` | Ekspor dokumen ke PDF. Bila dokumen belum disimpan, Word minta disimpan dulu. Lalu ditanya: simpan di folder yang sama (Yes) atau pilih folder lain (No). PDF langsung terbuka setelah jadi |

## Makro tanpa shortcut

Makro ini ada di template tetapi tidak dipasangi tombol. Jalankan lewat `Alt+F8`, pilih namanya, lalu **Run**.

| Makro | Fungsi |
|---|---|
| `UpdateTableOfAll` | Perbarui Daftar Gambar, Daftar Tabel, Daftar Lampiran, dan Daftar Isi sekaligus (muncul kotak pesan per daftar) |
| `UpdateTableOfContents` | Perbarui Daftar Isi saja |
| `UpdateTableOfFigureGambar` | Perbarui Daftar Gambar |
| `UpdateTableOfFigureTabel` | Perbarui Daftar Tabel |
| `UpdateTableOfFigureLampiran` | Perbarui Daftar Lampiran |

Tanpa makro, cara biasanya sama hasilnya: klik kanan daftar, **Update Field**, pilih **Update entire table**. Lakukan ini setelah semua isi dan gambar final supaya nomor halaman pasti.

## Shortcut bawaan Word yang tertimpa

Template memakai beberapa kombinasi yang di Word biasa punya fungsi lain. Selama file `.docm` ini aktif, fungsi aslinya diganti:

| Shortcut | Fungsi asli Word (sekarang diganti) |
|---|---|
| `Ctrl+1`, `Ctrl+2`, `Ctrl+5` | Spasi 1, 2, dan 1,5 |
| `Ctrl+D` | Dialog Font |
| `Ctrl+G` | Go To |
| `Ctrl+L` | Rata kiri |
| `Ctrl+T` | Hanging indent |
| `Ctrl+Shift+D` | Garis bawah ganda |
| `Ctrl+Shift+G` | Hitung kata (Word Count) |
| `Ctrl+Shift+L` | Daftar berpoin |
| `Ctrl+Shift+T` | Kurangi hanging indent |

Spasi 1,5 sudah diatur oleh style, jadi tidak perlu `Ctrl+5`. Untuk rata kiri, pakai tombol di ribbon. Kombinasi `Alt+huruf` (misalnya `Alt+H`, `Alt+N`, `Alt+P`, `Alt+R`) juga biasanya dipakai Word untuk membuka tab ribbon lewat keyboard; selama makro aktif, kombinasi itu diarahkan ke fungsi di tabel di atas.

## Shortcut tidak jalan

| Gejala | Penyebab dan solusi |
|---|---|
| Tidak terjadi apa-apa | Cek ekstensi berkas. `.docx` tidak membawa makro; pakai `.docm` |
| Word menampilkan bilah kuning "Macros have been disabled" | Klik **Enable Content** |
| Tidak ada bilah kuning, makro tetap mati | File terblokir. Tutup Word, klik kanan berkas, **Properties**, centang **Unblock**, buka lagi |
| Kombinasi tertentu tidak bereaksi | Kemungkinan bentrok dengan aplikasi lain atau pengaturan keyboard. Lihat atau ubah di **File > Options > Customize Ribbon > Keyboard shortcuts: Customize...** |
| Makalah dibuat dengan `--docx`, shortcut tetap diinginkan | Pasang `assets/Normal.dotm` lewat **Developer > Document Template > Attach** (jangan centang "Automatically update document styles") |
