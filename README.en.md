# makalah-unri-si

A skill that builds **Indonesian-language university papers (makalah)** as ready-to-submit `.docx` files, made for the **Information Systems program, FMIPA, Universitas Riau (UNRI)**. Cover page, automatic table of contents, page numbering, heading numbering, equations, figures, and the APA reference list are handled by scripts, so you only supply the topic and sources.

> **Made by Kurniawan Hafiz** | Version 6.1.0 | [Bahasa Indonesia](README.md)

## What's new in v6.1

- **Default output is `.docm`.** The VBA project, keyboard shortcuts, and building blocks from `assets/Normal.dotm` are copied into the paper, so `Ctrl+1` to `Ctrl+9` (headings), `Ctrl+D` (table of contents), `Ctrl+G` (figure caption), `Ctrl+T` (table caption), and the rest work without installing the template.
- `--docx` produces a plain `.docx` without macros, for portals that reject `.docm`.
- The `.docm` structure is checked automatically (valid zip and XML; macros, shortcuts, and building blocks copied intact from the template). The macros themselves have not been run on the build machine, so do the quick check below in Word.

**Quick check in Word:** if the file was downloaded, right-click it, **Properties**, tick **Unblock**; open it, click **Enable Content**, then try `Ctrl+D` and `Ctrl+G`. If a portal rejects `.docm`, use **Save As** `.docx` in Word (macros are dropped) or build with `--docx`.

## What's new in v6

- **Uses the Word template `assets/Normal.dotm`.** Heading 1 ("BAB I"), Heading 2 (1.1), Heading 3 (1.1.1) through Heading 9 are numbered automatically; TABLE OF CONTENTS, PREFACE, and REFERENCES use the Heading Default (Title) style; paragraphs use Body Main, Body 2, and Body 3. The result is easy to edit in Word: change a heading level through its style and the numbering follows.
- **Automatic List of Figures and List of Tables** when the paper has figures or tables (captions use the Caption style with automatic numbering).
- Cover font size: all cover text is 13 pt (so the faculty line stays on one line). The base `makalah-unri` skill keeps 14 pt.
- The "contoh rekaan" (made-up example) label is gone, and personal data was removed from examples and docs.
- Install instructions for Claude Code, Hermes Agent, and OpenClaw are in [Install](#install).

### In v5

- **Consensus AI and OpenAlex used together**, each with its own defaults (open access, no preprints, past 5 years), merged and de-duplicated; one connector or web search as fallback.
- Indonesian-language sources searched through every route; Consensus results without a DOI are matched through OpenAlex, and every source is still verified against the original page.

### Since v3

- Justified and hanging-indent reference list, and 12 pt spacing after Heading 1, are built in.
- One command for the whole pipeline: `python3 scripts/build.py content.json out.docx`.
- `equation` blocks (LaTeX converted to editable Word equations), inline `$...$` math, and `image` blocks with automatic "Gambar n." captions.
- `check_content.py` validator before building: citations, alphabetical order, source count and years, language, em dashes, and AI-favoured words.
- `preview.sh` renders the cover, table of contents, chapter pages, and reference list to PNG.
- Reference status table for the final summary.
- Scripts no longer depend on environment-specific paths.

See [CHANGELOG.md](CHANGELOG.md) for the full list.

## Output

A single `.docm` (or `.docx` with `--docx`): cover, table of contents, list of figures and list of tables (if any), preface (kata pengantar), Chapter I Introduction, Chapter II Discussion, Chapter III Conclusion, reference list.

- A4, margins 4-3-3-3 cm (left 4, top 3, right 3, bottom 3). Times New Roman 12, 1.5 spacing, justified. All cover text at 13 pt.
- Cover lines on this variant:

```
FAKULTAS MATEMATIKA DAN ILMU PENGETAHUAN ALAM
PROGRAM STUDI SISTEM INFORMASI
UNIVERSITAS RIAU
```

- Roman page numbers for the table of contents and preface, Arabic numbers from Chapter I, none visible on the reference list.
- Headings numbered automatically by the template styles: BAB I, 1.1, 1.2, 2.1, and 2.4.1.
- Automatic table of contents (TOC field, levels 1 to 3) with page numbers.
- APA 7 reference list, alphabetical, hanging indent and justified, with DOI or valid open-access links.

## Install

Replace `<username>` with the GitHub account that owns this repo. After installing, start a new session or chat so the skill is picked up, then call it with `/makalah-unri-si`.

**Claude (claude.ai or desktop app):** on the repo page click **Code**, then **Download ZIP**; in Claude open **Settings**, then **Skills**, and upload the zip. If the upload is rejected because of the folder name, extract the zip, rename the folder to `makalah-unri-si`, re-zip, and upload again.

**Claude Code:**

```bash
git clone https://github.com/<username>/makalah-unri-si.git ~/.claude/skills/makalah-unri-si
```

(or `.claude/skills/makalah-unri-si` inside a project for a per-project skill).

**Hermes Agent:** skills live in `~/.hermes/skills/`, one folder per skill with a `SKILL.md`:

```bash
git clone https://github.com/<username>/makalah-unri-si.git ~/.hermes/skills/makalah-unri-si
```

Or keep the folder elsewhere and list its parent under `skills.external_dirs` in `~/.hermes/config.yaml`.

**OpenClaw:** put the folder in the `skills` folder of your OpenClaw workspace (workspace skills have the highest precedence):

```bash
git clone https://github.com/<username>/makalah-unri-si.git <workspace>/skills/makalah-unri-si
```

If it does not show up, check the OpenClaw Skills docs (folder precedence and `skills.load.extraDirs`).

**Outside Claude** the skill uses the agent's own shell, so install Node.js, Python 3, LibreOffice (`soffice`), and run `npm install docx` in the skill folder (optional: `pandoc`, `poppler-utils`). The Consensus and OpenAlex connectors only work in agents that have them; otherwise the skill falls back to web search.

**Word template and shortcuts.** The default `.docm` already carries the macros and shortcuts from `assets/Normal.dotm` (unblock it and click Enable Content). A plain `.docx` cannot hold macros; to get shortcuts there, attach `assets/Normal.dotm` via **Developer > Document Template > Attach** (leave "Automatically update document styles" unchecked).

## Usage

Call the skill with `/makalah-unri-si` and send the paper details: title, course, lecturer, topics, sources, and optionally source rules (count, year range, minimum Indonesian-language sources) and whether a case study is wanted.

## Manual use (without Claude)

Requirements: Node.js, the `docx` npm package, Python 3, LibreOffice (`soffice`), and optionally `pandoc` and `poppler-utils`.

```bash
npm install docx
cp assets/example_content.json content.json
python3 scripts/build.py content.json out/Paper.docm --tabel --preview
```

Options: `--docx` (plain `.docx`, no macros; default is `.docm`), `--strict` (warnings stop the build), `--tabel` (print the reference status table), `--preview` (render key pages to PNG), `--tanpa-cek` (skip the validator). Set `MAKALAH_SOFFICE` to point at a specific LibreOffice command.

The `content.json` format is documented in [`references/schema.md`](references/schema.md) (in Indonesian).

## Known limitations

- LibreOffice without the Math module cannot draw equations. On such machines equations appear blank in previews and table-of-contents page numbers are estimates. In Word they render normally; right-click the table of contents and choose **Update Field** for exact numbers.
- The equation converter supports a LaTeX subset. Unsupported commands fail the build loudly instead of silently producing wrong output.
- The validator reads citations of the form `Author (year)` and `(Author, year)`; unusual patterns may be missed or misread (use `meta.lewati_sitasi`).
- Always double-check every reference before submitting.

## License and credit

MIT licensed (see [LICENSE](LICENSE)). Made by **Kurniawan Hafiz**. The UNRI logo belongs to Universitas Riau and is included only as a cover element for coursework.
