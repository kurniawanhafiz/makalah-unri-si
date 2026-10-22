# makalah-unri-si

A skill that builds **Indonesian-language university papers (makalah)** as ready-to-submit `.docx` files, made for the **Information Systems program, FMIPA, Universitas Riau (UNRI)**. Cover page, automatic table of contents, page numbering, heading numbering, equations, figures, and the APA reference list are handled by scripts, so you only supply the topic and sources.

> **Made by Kurniawan Hafiz** | Version 4.0.0 | [Bahasa Indonesia](README.md)

## What's new in v4

- **Consensus AI as the default reference finder.** When the Consensus connector is installed and connected, the skill searches for sources through it with default filters: open access, no preprints, past 5 years. If it is not installed, or the account quota is used up, the skill falls back to web search (DOAJ, Garuda, journal sites, etc.) as in v3.
- The default filters can be overridden in the prompt (e.g. "last 10 years"). Other Consensus filters and other skills are used only when requested.
- Indonesian-language sources are searched through Consensus first (Indonesia country filter or Indonesian queries), then completed with web search if still short.
- Consensus results are still verified against the original pages; the reference status table has a "Ditemukan lewat" (found via) column.

### Since v3

- Justified and hanging-indent reference list, and 12 pt spacing after Heading 1, are built into the script (no more per-build `sed` patch).
- One command for the whole pipeline: `python3 scripts/build.py content.json out.docx`.
- `equation` blocks (LaTeX converted to editable Word equations), inline `$...$` math, and `image` blocks with automatic "Gambar n." captions.
- `check_content.py` validator before building: citations, alphabetical order, source count and years, language, em dashes, and AI-favoured words.
- `preview.sh` renders the cover, table of contents, chapter pages, and reference list to PNG.
- Reference status table for the final summary.
- Scripts no longer depend on environment-specific paths.

See [CHANGELOG.md](CHANGELOG.md) for the full list.

## Output

A single `.docx`: cover, table of contents, preface (kata pengantar), Chapter I Introduction, Chapter II Discussion, Chapter III Conclusion, reference list.

- A4, margins 4-3-3-3 cm (left 4, top 3, right 3, bottom 3). Times New Roman 12, 1.5 spacing, justified. Cover at 14 pt.
- Cover lines on this variant:

```
FAKULTAS MATEMATIKA DAN ILMU PENGETAHUAN ALAM
PROGRAM STUDI SISTEM INFORMASI
UNIVERSITAS RIAU
```

- Roman page numbers for the table of contents and preface, Arabic numbers from Chapter I, none visible on the reference list.
- Headings numbered 1.1, 1.2, 2.1, and 2.4.1.
- Automatic table of contents (TOC field, levels 1 to 3) with page numbers.
- APA 7 reference list, alphabetical, hanging indent and justified, with DOI or valid open-access links.

## Install

1. On the repo page, click **Code**, then **Download ZIP**.
2. In Claude, open **Settings**, then **Skills**, and upload the zip.
3. Start a new chat so the skill is picked up.

If the upload is rejected because of the folder name, extract the zip, rename the folder to `makalah-unri-si`, re-zip, and upload again. For other faculties or programs, use the base version, `makalah-unri`. The two skills are identical except for the cover. They can be installed side by side.

## Usage

Call the skill with `/makalah-unri-si` and send the paper details: title, course, lecturer, topics, sources, and optionally source rules (count, year range, minimum Indonesian-language sources) and whether a case study is wanted.

## Manual use (without Claude)

Requirements: Node.js, the `docx` npm package, Python 3, LibreOffice (`soffice`), and optionally `pandoc` and `poppler-utils`.

```bash
npm install docx
cp assets/example_content.json content.json
python3 scripts/build.py content.json out/Paper.docx --tabel --preview
```

Options: `--strict` (warnings stop the build), `--tabel` (print the reference status table), `--preview` (render key pages to PNG), `--tanpa-cek` (skip the validator). Set `MAKALAH_SOFFICE` to point at a specific LibreOffice command.

The `content.json` format is documented in [`references/schema.md`](references/schema.md) (in Indonesian).

## Known limitations

- LibreOffice without the Math module cannot draw equations. On such machines equations appear blank in previews and table-of-contents page numbers are estimates. In Word they render normally; right-click the table of contents and choose **Update Field** for exact numbers.
- The equation converter supports a LaTeX subset. Unsupported commands fail the build loudly instead of silently producing wrong output.
- The validator reads citations of the form `Author (year)` and `(Author, year)`; unusual patterns may be missed or misread (use `meta.lewati_sitasi`).
- Always double-check every reference before submitting.

## License and credit

MIT licensed (see [LICENSE](LICENSE)). Made by **Kurniawan Hafiz**. The UNRI logo belongs to Universitas Riau and is included only as a cover element for coursework.
