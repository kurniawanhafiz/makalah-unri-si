# makalah-unri-si

A skill that builds **Indonesian-language university papers (makalah)** as ready-to-submit `.docm` (or `.docx`) files, made for the **Information Systems study program (Program Studi Sistem Informasi), FMIPA, Universitas Riau (UNRI)**. Cover page, automatic table of contents, page numbering, heading numbering, equations, figures, and the APA reference list are handled by scripts, so you only supply the topic and sources.

> **Made by Kurniawan Hafiz** | Version 6.2.0 | [Bahasa Indonesia](README.md)

## What's new in v6.2

Token savings; the output format is unchanged:

- `SKILL.md` was trimmed from about 3,300 to about 1,500 words. Reference search and verification moved to `references/referensi.md`, which is read only during the reference step.
- The skill description was shortened (it is loaded in every session).
- The visual check (`--preview`, PNG) is now optional; by default the script validation is relied on.
- The UNRI logo was compressed from 1.3 MB to about 54 KB (looks the same on the cover).
- The scripts are unchanged.

## What's new in v6.1

- **Default output is `.docm`.** The VBA project, keyboard shortcuts, and building blocks from `assets/Normal.dotm` are copied into the paper, so `Ctrl+1` to `Ctrl+9` (headings), `Ctrl+D` (table of contents), `Ctrl+G` (figure caption), `Ctrl+T` (table caption), and the rest work without installing the template.
- `--docx` produces a plain `.docx` without macros, for campus portals that reject `.docm`.
- The `.docm` structure is checked automatically (valid zip and XML; macros, shortcuts, and building blocks copied intact from the template). The macros themselves cannot be run on the build machine; see the steps in [Word template and macros](#word-template-and-macros).

## What's new in v6

- **Uses the Word template `assets/Normal.dotm`.** Heading 1 ("BAB I"), Heading 2 (1.1), Heading 3 (1.1.1) through Heading 9 are numbered automatically; TABLE OF CONTENTS (DAFTAR ISI), PREFACE (KATA PENGANTAR), and REFERENCES (DAFTAR PUSTAKA) use the Heading Default (Title) style; paragraphs use Body Main, Body 2, and Body 3. The result is easy to edit in Word: change a heading level through its style and the numbering follows.
- **Automatic List of Figures and List of Tables** when the paper has figures or tables (captions use the Caption style with automatic numbering).
- Cover font size: all cover text is 13 pt (so the faculty line stays on one line). The base `makalah-unri` skill keeps 14 pt.
- The "contoh rekaan" (made-up example) label is gone, and personal data was removed from examples and docs.
- Install instructions for Claude Code, Hermes Agent, and OpenClaw are in [Install](#install).

### What was already in v5

- **Consensus AI and OpenAlex used together.** When both connectors are installed, connected, and under their limits, every topic point is searched in both, the results are merged, and duplicates are removed. You can also name one as primary and the other as a supplement in the prompt, or split the work between them.
- With only one connector available, the skill uses it and fills the gaps with web search. With none, it uses web search (DOAJ, Garuda, journal pages, etc.).
- Default rules for each connector: open access, no preprints, past 5 years (OpenAlex: works, `fulltext`, Boolean and stemming on). Any of these can be changed in the prompt.
- Indonesian-language sources are searched through every route at once, then web search if still short.
- Consensus results without a DOI are matched through OpenAlex, and every source is still verified against its original page.

### Since v3

- Justified and hanging-indent reference list, and 12 pt spacing after Heading 1, are built into the script.
- One command for the whole pipeline: `python3 scripts/build.py content.json out/Paper.docm`.
- `equation` blocks (LaTeX converted to editable Word equations), inline `$...$` math, and `image` blocks with automatic "Gambar n." captions.
- `check_content.py` validator before building: citations, alphabetical order, source count and years, language, em dashes, and AI-favoured words.
- `preview.sh` renders the cover, table of contents, chapter pages, and reference list to PNG.
- Reference status table for the final summary.
- Scripts no longer depend on environment-specific paths.

See [CHANGELOG.md](CHANGELOG.md) for the full list (in Indonesian).

## What it produces

A single `.docm` file (or `.docx` with `--docx`) in this order: cover, table of contents, list of figures and list of tables (if any), preface (kata pengantar), Chapter I Introduction, Chapter II Discussion, Chapter III Conclusion, reference list.

Formatting that is already applied:

- A4 paper, margins 4-3-3-3 (left 4 cm, top 3, right 3, bottom 3).
- Times New Roman 12, 1.5 spacing, justified. All cover text is 13 pt.
- The cover always shows the faculty and study program lines above the university name. Both can be replaced through `meta.fakultas` and `meta.prodi`.
- Page numbers: the cover counts as page i but its number is hidden; the table of contents and preface use Roman numerals at bottom center; Chapters I to III use Arabic numerals starting at 1 at bottom right; the reference list has no visible number.
- Heading numbering is automatic from the template styles: BAB I, 1.1, 1.2, 2.1, and sub-subsections like 2.4.1.
- Automatic table of contents (TOC field, levels 1 to 3) with page numbers.
- APA 7 reference list, alphabetical, hanging indent and justified, with valid DOI or open-access links.
- Tables are avoided (at most one per paper).

Cover on this variant:

```
FAKULTAS MATEMATIKA DAN ILMU PENGETAHUAN ALAM
PROGRAM STUDI SISTEM INFORMASI
UNIVERSITAS RIAU
```

For general papers without the faculty and study program lines, use the base `makalah-unri` variant (same content and format, only the cover differs).

## Content rules the skill follows

- Chapter III (conclusion and suggestions) contains no citations.
- The case study is written without citations and does not go into the background, problem statement, or objectives, unless requested.
- Every quotation is a paraphrase; claims from a source go only as far as what was actually read.
- Sources that cannot be verified are not used, and sources are never invented.
- Standard, natural Indonesian, without em dashes and without typical AI sentence patterns.

Some of these rules are now machine-checked by `check_content.py`, so hard violations stop the build.

## Folder contents

```
makalah-unri-si/
├── README.md                   # Indonesian version
├── README.en.md                # this file
├── SKILL.md                    # skill instructions for Claude
├── CHANGELOG.md                # change log (Indonesian)
├── LICENSE                     # MIT
├── variant.json                # variant marker (cover)
├── assets/
│   ├── Normal.dotm             # Word template (styles, heading numbering, macros and shortcuts)
│   ├── logo_unri.png           # logo for the cover
│   ├── example_content.json    # sample paper content (equations, figure, citations)
│   ├── example_diagram.png     # figure used by the sample
│   └── prompt_template.md      # prompt template for when the skill is not installed
├── references/
│   ├── schema.md               # content.json schema
│   └── referensi.md            # reference search and verification rules (read during the reference step)
└── scripts/
    ├── build.py                # one command: check, build, table of contents, validate, (optional) preview
    ├── check_content.py        # content validator run before the build
    ├── build_makalah.js        # builds the .docx from content.json
    ├── omml.js                 # LaTeX to Word equation converter
    ├── template.py             # applies styles and numbering from Normal.dotm
    ├── finalize.py             # fills in the table of contents, figure/table lists, and page numbers
    └── preview.sh              # renders key pages to PNG
```

## Install

After installing, start a new session or chat so the skill is picked up, then call it with `/makalah-unri-si`.

### Claude (claude.ai or desktop app)

1. On this repo's page, click **Code**, then **Download ZIP**.
2. In Claude, open **Settings**, then **Skills**, and upload the zip.
3. Start a new chat so the skill is picked up.

Notes:

- If a skill with the same name already exists, delete the old one before uploading the new version.
- The zip from GitHub contains a folder named `makalah-unri-si-main`. If the upload is rejected because of the folder name, extract the zip, rename the folder to `makalah-unri`, re-zip, and upload again.

### Claude Code

Personal skill (available in all projects):

```bash
git clone https://github.com/kurniawanhafiz/makalah-unri-si.git ~/.claude/skills/makalah-unri-si
```

Or per project: clone into `.claude/skills/makalah-unri` inside the project folder. Without git, extract the zip and move the folder to `~/.claude/skills/` as `makalah-unri-si`. Open a new Claude Code session, then type `/makalah-unri-si`.

### Hermes Agent

Hermes skills live in `~/.hermes/skills/` (one folder per skill, each with a `SKILL.md`):

```bash
git clone https://github.com/kurniawanhafiz/makalah-unri-si.git ~/.hermes/skills/makalah-unri-si
```

Alternatively, keep the skill in another folder and register it in `~/.hermes/config.yaml`:

```yaml
skills:
  external_dirs:
    - ~/my-skills-folder
```

Start a new session, then call `/makalah-unri-si` or ask Hermes to write a paper.

### OpenClaw

Put the folder in the `skills` folder of your OpenClaw workspace (workspace skills have the highest precedence):

```bash
git clone https://github.com/kurniawanhafiz/makalah-unri-si.git <workspace>/skills/makalah-unri-si
```

`<workspace>` is your agent's workspace folder. Start a new session so the skill is picked up. If it does not show up, check the OpenClaw Skills docs (folder precedence and the `skills.load.extraDirs` setting).

### Requirements outside Claude

In Claude Code, Hermes Agent, and OpenClaw, the skill uses the agent's own shell. Install first: Node.js, Python 3, LibreOffice (`soffice`), and run `npm install docx` in the skill folder. Optional: `pandoc` and `poppler-utils` for equation checks and previews. Reference search through the Consensus and OpenAlex connectors only works in agents that have those connectors; otherwise the skill uses web search.

### Word template and macros

The paper is built as a `.docm` that carries the macros from `assets/Normal.dotm`. To use them:

1. If the `.docm` was downloaded from the internet, right-click the file, choose **Properties**, tick **Unblock**, then OK. Without this, Word blocks the macros.
2. Open it in Word, then click **Enable Content** on the yellow bar.
3. Quick check: `Ctrl+D` for the table of contents, `Ctrl+G` for a figure caption.

Some shortcuts in the template: `Ctrl+1` to `Ctrl+9` headings, `Ctrl+D` table of contents, `Ctrl+G` figure caption, `Ctrl+T` table caption, `Ctrl+L` appendix caption, `Alt+R` and `Alt+L` Roman and Arabic page numbers, `Alt+N` new section, `Alt+S` export to PDF.

If a campus portal rejects `.docm`: in Word choose **Save As** and pick `.docx` (macros are dropped; styles and numbering stay), or build with `--docx`. Macros cannot be stored in a `.docx`. For a `.docx` that should still use the shortcuts, attach `assets/Normal.dotm` via **Developer > Document Template > Attach** (leave "Automatically update document styles" unchecked).

## Usage: calling the skill

Call the skill with `/makalah-unri-si` in the chat, then send the paper details. Example (the skill reads Indonesian input):

```
/makalah-unri-si
Buatkan makalah.
- Judul: Kombinasi, Permutasi, dan Koefisien Binomial
- Mata kuliah: Matematika Diskrit
- Dosen pengampu: Nama Dosen, gelar.
- Jumlah anggota: 4
- Materi / poin bahasan:
  - Pengertian dan jenis kombinasi
  - Pengertian dan jenis permutasi
  - Koefisien binomial
- Referensi: 10 jurnal, terbit 10 tahun terakhir, minimal 5 berbahasa Indonesia
- Studi kasus: 1, bertema TI/SI, tanpa referensi
- Rumus pakai equation
```

Required: title, course, lecturer, and topic points. Source rules (count, year range, minimum Indonesian-language sources) and whether a case study is wanted should be stated; otherwise Claude will ask. The number of members defaults to 4, and the UNRI logo is used automatically.

After the file is built:

- Edit the member names, student IDs (`( NIM )`), and the month and year in the preface.
- Right-click the table of contents and choose **Update Field** so the page numbers are exact, especially when the paper contains equations.

## Manual use (without Claude)

Requirements: Node.js, the `docx` npm package, Python 3, LibreOffice (`soffice`) to calculate page numbers, and optionally `pandoc` and `poppler-utils` (`pdftoppm`, `pdftotext`) for equation checks and previews.

```bash
npm install docx

# 1. copy and edit the sample content (schema in references/schema.md)
cp assets/example_content.json content.json

# 2. one command: check content, build, table of contents, validate, (optional) preview
python3 scripts/build.py content.json out/Makalah_Title.docm --tabel --preview
```

`build.py` options:

| Option | Function |
|---|---|
| `--strict` | Validator warnings also stop the build |
| `--tabel` | Print the reference status table |
| `--preview` | Render key pages to PNG in `out/Makalah_Title_preview/` |
| `--docx` | Plain `.docx` output without macros (default: `.docm`) |
| `--tanpa-cek` | Skip the validator (not recommended) |
| `--template file.dotm` | Use another Word template (default `assets/Normal.dotm`) |

The environment variable `MAKALAH_SOFFICE` can point to a specific LibreOffice command.

## `content.json` format

In short: `meta` (title, course, lecturer, university, year, member count, city, month-year, optionally faculty, study program, logo, max tables, ref_config), `kata_pengantar` (array of paragraphs), `bab` (array of chapters containing `sections` and `blocks`), `daftar_pustaka` (array of APA 7 strings), `verifikasi_referensi`, and `sumber_dibuang`. Block types: `p`, `quote`, `list`, `table`, `equation`, `image`. Full details are in [`references/schema.md`](references/schema.md) (in Indonesian).

## Known limitations

- LibreOffice without the Math module cannot draw equations. On such machines equations appear blank in previews and table-of-contents page numbers are estimates. In Word they render normally; right-click the table of contents and choose **Update Field** for exact numbers.
- The equation converter supports a LaTeX subset (see the schema). Unsupported commands fail the build loudly instead of silently producing wrong output.
- The validator reads citations of the form `Author (year)` and `(Author, year)`. Unusual patterns may be missed or misread; use `meta.lewati_sitasi` for deliberate cases.
- Reference language is counted from `verifikasi_referensi[].bahasa`; without it, the count is only an estimate.
- The skill cannot confirm that a link opens from your machine. Double-check every reference before submitting.

## Troubleshooting

| Symptom | Cause and fix |
|---|---|
| `Cannot find module 'docx'` | Run `npm install docx` in the skill folder, or install it globally. |
| `LibreOffice (soffice) tidak ditemukan` | Install LibreOffice or set `MAKALAH_SOFFICE`. |
| Build stops with a citation error (GALAT sitasi) | Every in-text citation must be in the reference list and vice versa; Chapter III and the case study must not contain citations. |
| Equations blank in the preview | See the limitations above. Check in Word. |
| Table-of-contents page numbers are off | Right-click the table of contents, **Update Field**. |
| Zip rejected when uploading the skill | Rename the extracted folder to `makalah-unri-si` and re-zip. |
| Template shortcuts do not work in Word | Make sure the file is a `.docm`, has been unblocked (Properties), and Enable Content was clicked. A `.docx` does not carry macros. |

## Notes

- The UNRI logo belongs to Universitas Riau. The logo file is included only as a cover element for coursework.
- Member names, student IDs, and dates are always placeholders and must be edited by you.
- Double-check every reference before submitting.

## License and credit

Released under the MIT license (see [LICENSE](LICENSE)). Made by **Kurniawan Hafiz**.
