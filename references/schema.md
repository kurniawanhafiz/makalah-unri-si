# Skema content.json (v4)

```json
{
  "meta": {
    "judul": "Proposal Penelitian",
    "matkul": "Bahasa Indonesia",
    "dosen": "Afrinaldi, M.Pd.",
    "universitas": "UNIVERSITAS RIAU",
    "tahun": "2026",
    "jumlah_anggota": 4,
    "kota": "Pekanbaru",
    "bulan_tahun": "Oktober 2026",
    "fakultas": "opsional; bawaan FAKULTAS MATEMATIKA DAN ILMU PENGETAHUAN ALAM",
    "prodi": "opsional; bawaan PROGRAM STUDI SISTEM INFORMASI",
    "logo": "opsional, path png relatif ke content.json; default assets/logo_unri.png",
    "maks_tabel": 1,
    "ref_config": {
      "jumlah_min": 8, "jumlah_maks": 10,
      "umur_maks_tahun": 10,
      "min_indonesia": 5
    },
    "lewati_sitasi": []
  },
  "kata_pengantar": ["paragraf 1", "paragraf 2", "paragraf 3"],
  "bab": [
    {
      "judul": "Pendahuluan",
      "sections": [
        {
          "judul": "Latar Belakang",
          "blocks": [ { "t": "p", "text": "..." } ],
          "subs": [
            { "judul": "Opsional: sub-subbab (jadi 1.1.1)", "blocks": [ ] }
          ]
        }
      ]
    }
  ],
  "daftar_pustaka": ["Penulis, A. (2023). Judul. *Jurnal*, *10*(2), 1–10. https://doi.org/..."],
  "verifikasi_referensi": [
    { "ref": "Penulis, A. (2023)", "ditemukan_lewat": "Consensus", "dicek_lewat": "DOI / laman jurnal / DOAJ / Garuda", "bahasa": "id" }
  ],
  "sumber_dibuang": [
    { "sumber": "https://contoh.id/artikel", "alasan": "tidak bisa dibuka tanpa login" }
  ]
}
```

- Judul bab ditulis biasa ("Pendahuluan"); skrip membuat "BAB I" + "PENDAHULUAN" dan menomori 1.1, 1.2, ... otomatis. Jumlah bab bebas (biasanya 3). Bab kedua dan seterusnya otomatis mulai di halaman baru.
- Bab pertama dianggap pendahuluan. Bab terakhir (atau bab yang judulnya memuat "penutup", "kesimpulan", "saran") dianggap penutup dan tidak boleh memuat sitasi.
- Subbab atau sub-subbab yang judulnya memuat "studi kasus" dianggap studi kasus dan tidak boleh memuat sitasi.

## Kolom `verifikasi_referensi` (v4)

| Kolom | Fungsi |
|---|---|
| `ref` | Potongan awal entri daftar pustaka, mis. "Alfa, A. (2023)". |
| `ditemukan_lewat` | Opsional. Dari mana sumber ditemukan: `Consensus`, `Pencarian web`, atau `Dari pengguna`. Tampil sebagai kolom "Ditemukan lewat" di tabel status referensi; kosong tampil `-`. |
| `dicek_lewat` | Cara verifikasi metadata dan link (DOI, laman jurnal, DOAJ, Garuda, dst). |
| `bahasa` | `id` atau `en`. |

## Kolom `meta` tambahan

| Kolom | Fungsi |
|---|---|
| `fakultas`, `prodi` | Baris tebal di atas nama universitas. String kosong `""` menyembunyikan baris. Bawaan: kedua baris tampil. |
| `maks_tabel` | Batas jumlah tabel (bawaan 1). Lebih dari batas dianggap galat. |
| `ref_config.jumlah_min`, `jumlah_maks` | Batas jumlah entri daftar pustaka. `jumlah` saja berarti persis sekian. |
| `ref_config.umur_maks_tahun` | Sumber paling lama berumur sekian tahun dari tahun ini. Atau pakai `tahun_min` (angka tahun) langsung. |
| `ref_config.min_indonesia` | Minimal sumber berbahasa Indonesia. Bahasa dibaca dari `verifikasi_referensi[].bahasa`; tanpa itu dihitung perkiraan dan hanya jadi peringatan. |
| `lewati_sitasi` | Daftar teks sitasi yang sengaja dilewati validator (mis. nama tokoh yang kebetulan berpola sitasi). |

## Tipe blok (`blocks`)

| t | Fungsi | Field |
|---|--------|-------|
| `p` | Paragraf biasa, rata kiri-kanan, baris pertama menjorok | `text` |
| `quote` | Paragraf menjorok ke dalam (contoh paragraf, contoh kalimat) | `text` |
| `list` | Daftar bernomor 1., 2., 3. (rumusan masalah, tujuan) | `items` (array string) |
| `table` | Tabel bergaris dengan keterangan "Tabel n." otomatis. Dibatasi `meta.maks_tabel` | `caption`, `headers`, `rows`, opsional `widths` (DXA, jumlah = 7937 dikurangi indent) |
| `equation` | Rumus tampil di tengah, jadi equation Word (OMML) yang bisa diedit | `latex` (string, atau array string untuk beberapa baris), opsional `nomor: true` untuk penomoran (1), (2), ... |
| `image` | Gambar di tengah dengan keterangan "Gambar n." otomatis | `path` (png, jpg, atau gif; relatif ke content.json), `caption`, opsional `alt`, `sumber`, `width_cm` (bawaan 12), `max_height_cm` (bawaan 12) |

Di semua teks:

- `*kata*` menghasilkan huruf miring. Jangan memakai `*` untuk hal lain.
- `$...$` menghasilkan rumus sebaris. Tanda dolar literal ditulis `\$`.

## LaTeX yang didukung

`\frac`, `\dfrac`, `\binom`, pangkat `^` dan indeks `_`, `\sqrt` dan `\sqrt[n]`, `\sum`, `\prod`, `\int`, `\oint`, `\bigcup`, `\bigcap` (dengan batas), `\lim`, `\left ... \right`, tanda kurung biasa, `\text`, `\mathrm`, `\mathbf`, `\overline`, `\bar`, `\hat`, `\vec`, `\tilde`, huruf Yunani, simbol umum (`\times`, `\cdot`, `\leq`, `\geq`, `\neq`, `\in`, `\subset`, `\cup`, `\cap`, `\infty`, `\rightarrow`, dst), `\\` untuk baris baru, dan `&` untuk titik sejajar antarbaris. Perintah di luar daftar menimbulkan galat saat build, lengkap dengan letak blok yang bermasalah.

Contoh:

```json
{ "t": "equation", "latex": "C(n,r) = \\binom{n}{r} = \\frac{n!}{r!\\,(n-r)!}", "nomor": true }
{ "t": "equation", "latex": ["P(5,2) &= \\frac{5!}{3!}", "&= 20"] }
```

Di JSON, setiap garis miring terbalik ditulis dua kali (`\\frac`).

Paragraf di bawah subbab otomatis sejajar dengan teks subbab, dan di bawah sub-subbab sejajar dengan teks sub-subbab.

## Pemeriksaan otomatis (`scripts/check_content.py`)

Galat (build berhenti): kolom wajib kosong, tipe blok salah, file gambar tidak ada, rumus kosong atau kurung tidak seimbang, `*` atau `$` tidak berpasangan, sitasi tanpa entri pustaka dan sebaliknya, sitasi di bab penutup atau studi kasus, daftar pustaka tidak urut abjad, tabel melebihi batas, jumlah atau tahun referensi di luar `ref_config`.

Peringatan (dilaporkan saja, atau menghentikan build dengan `--strict`): em dash, kata gemar AI, pembuka klise, label tebal `**`, studi kasus disebut di Bab I, studi kasus tanpa label "contoh rekaan", jumlah rumusan masalah dan tujuan tidak sama, entri pustaka tanpa link atau DOI tidak berbentuk benar, bahasa referensi hanya perkiraan.
