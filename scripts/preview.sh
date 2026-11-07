#!/usr/bin/env bash
# Render halaman penting makalah ke PNG: cover, daftar isi, halaman pertama tiap bab,
# halaman yang memuat rumus/gambar/tabel, dan daftar pustaka.
# Usage: bash scripts/preview.sh Makalah_Judul.docx [folder_keluaran]
# Keluaran bawaan: <nama_makalah>_preview/ di samping file docx.
set -euo pipefail

DOCX="${1:?Usage: preview.sh file.docx [folder_keluaran]}"
[ -f "$DOCX" ] || { echo "File tidak ditemukan: $DOCX" >&2; exit 1; }
BASE="$(basename "${DOCX%.docx}")"
OUT="${2:-$(dirname "$DOCX")/${BASE}_preview}"
mkdir -p "$OUT"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

if [ -n "${MAKALAH_SOFFICE:-}" ]; then SOFF=($MAKALAH_SOFFICE)
elif [ -f /mnt/skills/public/docx/scripts/office/soffice.py ]; then SOFF=(python3 /mnt/skills/public/docx/scripts/office/soffice.py)
elif command -v soffice >/dev/null 2>&1; then SOFF=(soffice)
else echo "LibreOffice (soffice) tidak ditemukan" >&2; exit 1; fi

"${SOFF[@]}" --headless --convert-to pdf --outdir "$TMP" "$DOCX" >/dev/null 2>&1
PDF="$TMP/${BASE}.pdf"
[ -f "$PDF" ] || { echo "Konversi ke PDF gagal" >&2; exit 1; }
N=$(pdfinfo "$PDF" | awk '/^Pages:/{print $2}')

# kumpulkan nomor halaman yang akan dilihat
declare -A PICK
PICK[1]=1; PICK[2]=1; PICK[$N]=1
for p in $(seq 1 "$N"); do
  t="$(pdftotext -f "$p" -l "$p" -layout "$PDF" - 2>/dev/null || true)"
  if echo "$t" | grep -qE '^\s*BAB [IVX]+\s*$'; then PICK[$p]=1; fi
  if echo "$t" | grep -qE '^\s*(Gambar|Tabel) [0-9]+\.'; then PICK[$p]=1; fi
  if echo "$t" | grep -qE '^\s*DAFTAR PUSTAKA'; then PICK[$p]=1; fi
done

rm -f "$OUT"/hal-*.png
for p in $(printf '%s\n' "${!PICK[@]}" | sort -n); do
  pdftoppm -r 80 -f "$p" -l "$p" -png "$PDF" "$OUT/hal-$(printf '%02d' "$p")"
done
# pdftoppm menambah akhiran nomor halaman; ratakan namanya
for f in "$OUT"/hal-*-*.png; do [ -e "$f" ] && mv "$f" "$(echo "$f" | sed -E 's/-[0-9]+\.png$/.png/')"; done

echo "Total $N halaman. Preview tersimpan di: $OUT"
ls "$OUT"
# Catatan: bila LibreOffice di mesin ini tidak punya modul Math, rumus tampil kosong di preview.
# Itu keterbatasan tampilan; rumus tetap tersimpan sebagai equation Word dan tampil di Word.
