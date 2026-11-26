# Pencarian referensi lewat konektor (Consensus dan OpenAlex)

Dibaca hanya bila minimal satu konektor tersedia. Verifikasi dan penulisan entri tetap mengikuti SKILL.md.

## Mode

- Cek tiap konektor sendiri-sendiri dengan mencoba memanggilnya: `mcp__Consensus__search`, `mcp__OpenAlex__search_works` (muat lewat ToolSearch bila tertunda). Tool tidak ada atau panggilan gagal karena belum terhubung: konektor itu tidak tersedia. Jangan bertanya ke pengguna.
- **Keduanya tersedia (default):** tiap butir materi dicari di keduanya, hasil digabung, duplikat (DOI sama, atau judul dan tahun sama) dibuang. Berlaku juga bila pengguna sudah memberi sumber; sumber pengguna tetap diverifikasi dan ikut dihitung. Bila pengguna menetapkan satu konektor sebagai utama, pelengkap baru dipanggil setelah jumlah, bahasa, atau relevansi dari yang utama kurang; bila pengguna membagi tugas, ikuti pembagiannya.
- **Satu tersedia:** pakai konektor itu, lengkapi kekurangan dengan pencarian web.
- **Limit** dinilai per konektor. Consensus: galat batas penggunaan atau pesan upgrade tanpa hasil. OpenAlex: galat batas penggunaan, kuota atau kredit habis, atau pesan upgrade tanpa hasil. Bila limit di tengah jalan, lanjutkan dengan konektor lain lalu pencarian web; hasil sebelum limit tetap boleh dipakai setelah diverifikasi. Galat batas laju sementara bukan limit: tunggu sekitar 30 detik, ulangi sekali, bila tetap gagal anggap konektor itu tidak tersedia untuk sisa pekerjaan.
- Satu query per butir materi per konektor, maksimal 3 panggilan sekaligus per konektor.

## Ketentuan bawaan

**Consensus** (`search`): `open_access=true`, `exclude_preprints=true`, `year_min` = tahun berjalan dikurangi 5 (2026 jadi 2021). Ini permintaan pengguna sebagai standar, jadi aturan konektor "jangan pakai filter" tidak berlaku. Query berupa istilah akademik spesifik (Inggris untuk topik umum).

**OpenAlex** (`search_works`, bukan penulis, institusi, atau jurnal):
- `search_in="fulltext"` dan `mode="keyword"` (Boolean dan stemming aktif). Jangan pakai `exact` atau `semantic`.
- Query: AND, OR, NOT, tanda kurung, frasa berkutip, sinonim digabung OR. Jangan menaruh `*` di dalam frasa berkutip (query ditolak); wildcard hanya untuk satu kata dan biasanya tidak perlu.
- Filter: `open_access_only=true`, `raw_filter="type:!preprint"`, `from_year` = tahun berjalan dikurangi 5.
- Hasil terlalu banyak atau sedikit: setel query dulu dengan `preview=true`.

**Permintaan pengguna menang atas default** (rentang tahun lain, preprint boleh, tidak harus open access, dst), di kedua konektor. `meta.ref_config` juga menggantikan 5 tahun: `umur_maks_tahun` jadi tahun berjalan dikurangi nilainya, `tahun_min` dipakai langsung. Parameter di luar daftar di atas (Consensus: `study_types`, `sjr_max`, `domain`, `citation_min`, `create_thread`; OpenAlex: `min_citations`, `core_sources_only`, `topic_ids`, `sort`, `rerank=false`, dst), tool konektor lain, dan skill lain (mis. humanizer, stop-slop) hanya dipakai bila diminta. Jangan melonggarkan atau menambah filter sendiri.

## Sumber berbahasa Indonesia

Bila ada syarat `min_indonesia` atau diminta pengguna, panggil semua jalur sekaligus: Consensus dengan `country="id"` atau query Indonesia; OpenAlex dengan `language="id"` dan query Indonesia; OpenAlex dengan `countries=["ID"]` (penulis berinstitusi Indonesia, karya bisa berbahasa Inggris). Gabung dan buang duplikat. Bila satu konektor saja, pakai jalurnya. Ketentuan bawaan tetap berlaku. Masih kurang: pencarian web (Garuda, SINTA, DOAJ, OJS). Bahasa dibaca dari laman asli, bukan metadata konektor, karena label bisa keliru.

## Relevansi dan verifikasi hasil konektor

- Pencarian OpenAlex mencakup teks lengkap, jadi karya bisa muncul hanya karena menyebut istilahnya sekilas. Baca abstrak tiap kandidat dari konektor mana pun dan pastikan benar-benar membahas butir materinya.
- Konektor hanya menemukan kandidat. Paket gratis Consensus tidak selalu memberi DOI atau link, jadi kandidat tanpa DOI dicocokkan dulu lewat OpenAlex: `resolve_references` (judul, penulis, tahun; maks 25 entri per panggilan) dan `get_work` (DOI atau ID OpenAlex) untuk DOI, penulis, tahun, judul, jurnal, abstrak, dan link OA. Pakai hanya kecocokan `exact` atau `likely`; `uncertain` atau `none` dicari lewat pencarian web berdasarkan judul dan penulis. Tanpa OpenAlex, kandidat tanpa DOI langsung dicari lewat web. Kandidat OpenAlex boleh dicek awal dengan `get_work`.
- Cek awal tidak menggantikan verifikasi di SKILL.md: penulis, tahun, judul, jurnal, volume, dan halaman tetap dicocokkan dengan laman asli.
- Setelah verifikasi jumlah atau bahasa masih kurang: lengkapi dengan pencarian web, filter tidak dilonggarkan sendiri.

## Pencatatan

`ditemukan_lewat` per entri: `Consensus`, `OpenAlex`, `Consensus + OpenAlex`, `Pencarian web`, atau `Dari pengguna`. Bila konektor mengembalikan pesan penggunaan, limit, atau ajakan upgrade, sampaikan apa adanya di akhir ringkasan. Sitasi bernomor [1] ala konektor hanya untuk balasan chat; isi makalah tetap APA 7.
