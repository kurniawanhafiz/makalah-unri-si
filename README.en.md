# makalah-unri-si

A skill that builds **Indonesian-language university papers (makalah)** as ready-to-submit `.docx` files, made for the **Information Systems program, FMIPA, Universitas Riau (UNRI)**. Cover page, automatic table of contents, page numbering, heading numbering, equations, figures, and the APA reference list are handled by scripts, so you only supply the topic and sources.

> **Made by Kurniawan Hafiz** | Version 5.1.0 | [Bahasa Indonesia](README.md)

## What's new in v5.1

- **Fewer tokens.** `SKILL.md` was condensed (about 21 KB down to about 10 KB), the description shortened, and the Consensus/OpenAlex connector rules moved to `references/pencarian.md`, read only when a connector is available. No rule was dropped.
- Font size of all cover text: 14 for `makalah-unri`, 13 for `makalah-unri-si` (so the faculty line does not wrap).
- The "contoh rekaan" label was removed; self-made examples and case studies carry no label, and the validator no longer warns about it.
- The README now covers installing on Claude Code, Hermes Agent, and OpenClaw.

### New in v5

- **Consensus AI and OpenAlex used together.** When both connectors are installed, connected, and not rate-limited, every topic is searched in both, results are merged, and duplicates are removed. You can also set one as primary and the other as supplementary in the prompt, or split the work between them.
- If only one connector is available (not connected or limit reached), the skill uses it and completes the rest with web search. If neither is available, it uses web search (DOAJ, Garuda, journal sites, etc.) as in v3.
- Each connector keeps its default settings. Consensus: open access, no preprints, past 5 years. OpenAlex: works, searching titles, abstracts, full text, and keywords (`fulltext`), Boolean on, stemming on, plus the same filters. All can be overridden in the prompt (e.g. "last 10 years"); other parameters and skills are used only when requested.
- Indonesian-language sources are searched through every route at once: Consensus with the Indonesia country filter or Indonesian queries, OpenAlex with the Indonesian language filter and the Indonesia country filter, then web search if still short.
- Consensus results without a DOI are first matched through OpenAlex (`resolve_references` and `get_work`), and every source is still verified against the original page. The reference status table has a "Ditemukan lewat" (found via) column.

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

- A4, margins 4-3-3-3 cm (left 4, top 3, right 3, bottom 3). Times New Roman 12, 1.5 spacing, justified. All cover text at 13 pt.
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

The skill is a folder `makalah-unri-si/` containing `SKILL.md`. Pick your agent below. For all of them the folder must be named exactly `makalah-unri-si` (a GitHub zip contains `makalah-unri-si-main`; extract and rename it).

Requirements on the machine running the agent: Node.js and the `docx` npm package, Python 3, LibreOffice (`soffice`), optionally `pandoc` and `poppler-utils`. The Claude app (cloud) already has them.

### Claude (web or desktop app)

1. On the repo page, click **Code**, then **Download ZIP**.
2. Open **Settings**, then **Skills**, and upload the zip.
3. Start a new chat and call it with `/makalah-unri-si`.

If a skill with the same name exists, delete it first. If the upload is rejected over the folder name, extract the zip, rename the folder to `makalah-unri-si`, re-zip, and upload again.

### Claude Code

```bash
# personal: available in every project
mkdir -p ~/.claude/skills
cp -r makalah-unri-si ~/.claude/skills/

# or per project (committable): run from the repo root
mkdir -p .claude/skills
cp -r makalah-unri-si .claude/skills/
cd ~/.claude/skills/makalah-unri-si && npm install docx   # once
```

Claude Code watches skill folders, so no restart is needed. If `~/.claude/skills/` was newly created while a session was running, run `/reload-skills`. Call it with `/makalah-unri-si` or just ask for a makalah.

### Hermes Agent

```bash
mkdir -p ~/.hermes/skills
cp -r makalah-unri-si ~/.hermes/skills/
cd ~/.hermes/skills/makalah-unri-si && npm install docx   # once
```

Then run `/reload-skills` in Hermes (or start a new session) and call it with `/makalah-unri-si`. Alternative without copying: keep the folder elsewhere and register it in `~/.hermes/config.yaml`:

```yaml
skills:
  external_dirs:
    - ~/my-skills
```

Project skills in `<project>/.hermes/skills/` load only after `hermes skills trust` in that repo. Note: the Hermes docs do not describe installing from a local folder; the steps above follow its skill directory layout.

### OpenClaw

```bash
# into the active workspace
openclaw skills install ./makalah-unri-si --as makalah-unri-si

# or for all local agents (~/.openclaw/skills)
openclaw skills install ./makalah-unri-si --global
```

You can also copy the folder straight into `<workspace>/skills/makalah-unri-si/`. Call it with `$` in the Control UI composer and pick `makalah-unri-si`, or `/makalah-unri-si` on message channels. Local installs are not refreshed by `openclaw skills update`; reinstall to update. Run `npm install docx` once inside the installed skill folder.

### Reference connectors

Searching through Consensus and OpenAlex uses Claude connectors and is optional. On agents without those connectors the skill falls back to web search (DOAJ, Garuda, journal sites), so the agent needs a web search or page-fetch tool.

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
