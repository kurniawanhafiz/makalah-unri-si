# Skema content.json

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
    "fakultas": "opsional, default FAKULTAS MATEMATIKA DAN ILMU PENGETAHUAN ALAM",
    "prodi": "opsional, default PROGRAM STUDI SISTEM INFORMASI",
    "logo": "opsional, path png; default assets/logo_unri.png"
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
  "daftar_pustaka": ["Penulis, A. (2023). Judul. *Jurnal*, *10*(2), 1–10. https://doi.org/..."]
}
```

- Judul bab ditulis biasa ("Pendahuluan"); skrip membuat "BAB I" + "PENDAHULUAN" dan menomori 1.1, 1.2, ... otomatis. Jumlah bab bebas (biasanya 3).
- Daftar bab sebanyak apa pun boleh, bab kedua dan seterusnya otomatis mulai di halaman baru.

## Tipe blok (`blocks`)

| t | Fungsi | Field |
|---|--------|-------|
| `p` | Paragraf biasa, rata kiri-kanan, baris pertama menjorok | `text` |
| `quote` | Paragraf menjorok ke dalam (contoh paragraf, contoh kalimat, baris contoh) | `text` |
| `list` | Daftar bernomor 1., 2., 3. (rumusan masalah, tujuan) | `items` (array string) |
| `table` | Tabel bergaris dengan keterangan "Tabel n." otomatis. Maksimal satu per makalah | `caption`, `headers`, `rows`, opsional `widths` (DXA, jumlah = 7937 dikurangi indent) |

Di semua teks, `*kata*` menghasilkan huruf miring. Jangan memakai `*` untuk hal lain.

Paragraf di bawah subbab otomatis sejajar dengan teks subbab, dan di bawah sub-subbab sejajar dengan teks sub-subbab.
