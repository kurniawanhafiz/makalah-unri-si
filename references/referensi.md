# Pencarian dan verifikasi referensi

Dibaca saat langkah 2 (cari dan verifikasi referensi). Tahun berjalan dihitung dari tanggal sistem; "5 tahun terakhir" = tahun berjalan dikurangi 5 (2026 menjadi 2021).

## A. Mode pencarian

Tentukan mode sendiri, jangan tanya pengguna soal konektor.

1. **Cek konektor.** Cari tool `mcp__Consensus__search` dan `mcp__OpenAlex__search_works` (bila tertunda, muat lewat ToolSearch), lalu coba panggil. Tool tidak ada atau galat belum terhubung = konektor itu tidak tersedia. Nilai satu per satu.
2. **Pilih mode.** Keduanya ada: **mode dua konektor** (default). Satu ada: pakai itu, lengkapi pencarian web bila kurang. Tidak ada: pencarian web (bagian B). Agent tanpa konektor (mis. Hermes) langsung ke bagian B.
3. **Mode dua konektor.** Tiap butir materi dicari di keduanya (satu query per butir, maksimal 3 panggilan sekaligus per konektor), hasil digabung, duplikat (DOI sama, atau judul + tahun sama) dibuang, lalu dinilai relevansinya dan diverifikasi. Berlaku juga bila pengguna sudah memberi sumber; sumber pengguna ikut diverifikasi dan dihitung. Bila pengguna menetapkan satu konektor utama dan lainnya pelengkap, panggil pelengkap hanya setelah utama belum cukup (jumlah, bahasa, relevansi); bila pengguna membagi tugas, ikuti.
4. **Limit per konektor.** Consensus: galat batas penggunaan atau pesan upgrade tanpa hasil. OpenAlex: galat batas penggunaan, kuota/kredit habis, atau pesan upgrade tanpa hasil. Bila limit di tengah jalan, lanjut dengan konektor yang ada lalu web; hasil sebelum limit tetap boleh dipakai setelah diverifikasi. Galat batas laju sementara bukan limit: tunggu sekitar 30 detik, ulangi sekali, bila gagal anggap konektor tidak tersedia.
5. **Consensus**, setiap `search`: `open_access=true`, `exclude_preprints=true`, `year_min` = tahun berjalan - 5. Query istilah akademik spesifik (Inggris untuk topik umum). Ketiga filter ini permintaan pengguna, jadi aturan "jangan pakai filter" tidak berlaku.
6. **OpenAlex**, setiap `search_works` (karya, bukan penulis/institusi/jurnal): `search_in="fulltext"`, `mode="keyword"` (bukan `exact` atau `semantic`), `open_access_only=true`, `raw_filter="type:!preprint"`, `from_year` = tahun berjalan - 5. Query pakai AND, OR, NOT, tanda kurung, frasa berkutip; sinonim digabung dengan OR. Jangan taruh `*` di dalam frasa berkutip (ditolak). Hasil terlalu banyak/sedikit: setel query dengan `preview=true` dulu.
7. **Permintaan pengguna menang atas default.** Filter lain dari pengguna menggantikan default di kedua konektor. `meta.ref_config` juga menggantikan 5 tahun: `umur_maks_tahun` = tahun berjalan - nilainya, `tahun_min` dipakai langsung. Parameter lain di luar nomor 5-6, tool konektor lain, dan skill lain (humanizer, stop-slop) hanya dipakai bila pengguna memintanya. Jangan melonggarkan atau menambah filter sendiri.
8. **Sumber berbahasa Indonesia** (bila ada `min_indonesia` atau diminta): panggil semua jalur sekaligus: Consensus `country="id"` atau query Indonesia; OpenAlex `language="id"` dengan query Indonesia; OpenAlex `countries=["ID"]`. Gabung, buang duplikat. Masih kurang: web (Garuda, SINTA, DOAJ, OJS). Bahasa dibaca dari laman asli, bukan metadata konektor.
9. **Kekurangan sumber** setelah verifikasi: lengkapi lewat web, filter tidak dilonggarkan.
10. **Relevansi.** OpenAlex mencari teks lengkap, jadi karya bisa muncul hanya karena menyebut istilahnya sekilas. Baca abstrak tiap kandidat sebelum dipakai.
11. **Konektor hanya menemukan kandidat.** Kandidat Consensus tanpa DOI dicocokkan lewat OpenAlex `resolve_references` (maks 25 entri/panggilan) dan `get_work`; pakai hanya kepercayaan `exact` atau `likely`, sisanya cari lewat web berdasarkan judul + penulis. Tanpa OpenAlex, langsung web. Penulis, tahun, judul, jurnal, volume, halaman tetap dicocokkan dengan laman asli (bagian B). Tanpa link yang bisa dibuka dan metadata cocok: buang dan catat di `sumber_dibuang`.
12. **Pencatatan.** Isi `ditemukan_lewat` per entri: `Consensus`, `OpenAlex`, `Consensus + OpenAlex`, `Pencarian web`, atau `Dari pengguna`. Pesan limit/upgrade dari konektor disampaikan apa adanya di ringkasan akhir. Sitasi bernomor [1] ala konektor hanya untuk chat; isi makalah tetap APA 7.

## B. Verifikasi dan penulisan entri (semua mode)

- Buka setiap DOI/link pengguna dengan tool pengambil halaman. Bila terblokir, cari lewat pencarian web untuk judul, penulis, tahun, jurnal, volume, halaman, abstrak. Beberapa situs menolak akses otomatis (ResearchGate sering 403): cocokkan metadata lewat laman jurnal, DOAJ, atau Garuda.
- Sumber tidak terverifikasi atau tidak relevan tidak dipakai; sebutkan sumber dan alasannya ke pengguna (`sumber_dibuang`) dan minta PDF bila ia ingin sumber itu dipakai. PDF unggahan boleh dibaca penuh.
- Boleh menambah sumber sendiri (jurnal, buku, artikel resmi) asal terverifikasi dan linknya valid. Jangan pernah mengarang sumber, DOI, halaman, atau penulis; bila daftar penulis tidak pasti, sampaikan.
- Jangan hanya mengandalkan DOI. Basis data: DOAJ, Garuda, SINTA, Google Scholar, OJS jurnal, repositori kampus, arXiv/CORE bila relevan, ResearchGate terakhir. Jangan buang sumber hanya karena tanpa DOI.
- Syarat sumber non-DOI: abstrak/teks bisa dibuka tanpa login dan bayar, metadata cocok dengan laman asli.
- Prioritas link: DOI, laman jurnal resmi, DOAJ, repositori/Garuda, ResearchGate. Satu link per entri, hanya yang sudah benar-benar dibuka.
- Format `content.json`: satu string APA 7 per entri, `*bintang*` untuk huruf miring (jurnal, volume, judul buku), urut abjad. DOI ditulis `https://doi.org/...`. Tanpa DOI, URL artikel di akhir entri tanpa kata "Diakses dari".
- Tiap sumber isi `verifikasi_referensi`: `ref` (awal entri, mis. "Alfa, A. (2023)"), `ditemukan_lewat`, `dicek_lewat` (DOI, laman jurnal, DOAJ, Garuda, dst), `bahasa` (`id`/`en`). Dari sini tabel status dan syarat bahasa Indonesia dihitung pasti.
- Jumlah wajar: 5 sampai 8 sumber, atau sesuai syarat pengguna; hanya sumber yang disitasi di Bab I dan II dihitung.
- Klaim hanya sebatas yang benar-benar dibaca; bila hanya abstrak, tulis yang ada di abstrak.
