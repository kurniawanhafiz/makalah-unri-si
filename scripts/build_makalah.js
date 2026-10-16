#!/usr/bin/env node
// Usage: node build_makalah.js content.json out_raw.docx headings.json [logo.png]
const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, ImageRun, Table, TableRow, TableCell,
  WidthType, BorderStyle, AlignmentType, Footer, PageNumber, NumberFormat,
  LevelFormat, TableOfContents, ShadingType, LineRuleType,
} = require("docx");

const [, , contentPath, outPath, headingsPath, logoArg] = process.argv;
if (!contentPath || !outPath || !headingsPath) {
  console.error("Usage: node build_makalah.js content.json out_raw.docx headings.json [logo.png]");
  process.exit(1);
}
const data = JSON.parse(fs.readFileSync(contentPath, "utf8"));
const meta = data.meta || {};
const logoPath = logoArg || meta.logo || path.join(__dirname, "..", "assets", "logo_unri.png");

const FONT = "Times New Roman";
const TEXT_W = 7937; // A4 21cm - kiri 4cm - kanan 3cm
const IND1 = 567;    // teks subbab (1.1)
const IND2 = 1361;   // teks sub-subbab (1.1.1)
const SP = { line: 360, lineRule: LineRuleType.AUTO, before: 0, after: 0 };
const J = AlignmentType.JUSTIFIED;
const ROMAN = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

// teks dengan *miring* -> TextRun
function runs(text, o = {}) {
  return String(text).split(/(\*[^*]+\*)/).filter(Boolean).map((part) => {
    const it = part.length > 2 && part.startsWith("*") && part.endsWith("*");
    return new TextRun({ text: it ? part.slice(1, -1) : part, font: FONT, size: 24, ...o, italics: it || o.italics });
  });
}
const run = (t, o = {}) => new TextRun({ text: t, font: FONT, size: 24, ...o });

const bodyKP = (t) => new Paragraph({ alignment: J, indent: { firstLine: 709 }, spacing: SP, children: runs(t) });
const body = (t, left) => new Paragraph({ alignment: J, indent: { left, firstLine: 709 }, spacing: SP, children: runs(t) });
const quote = (t, left) => new Paragraph({ alignment: J, indent: { left: left + 567, right: 567 }, spacing: SP, children: runs(t) });
const h1 = (lines, pageBreak = false) =>
  new Paragraph({ style: "Heading1", pageBreakBefore: pageBreak, children: lines.map((l, i) => run(l, { bold: true, break: i ? 1 : 0 })) });
const h2 = (num, t) => new Paragraph({ style: "Heading2", children: [run(`${num}\t${t}`, { bold: true })] });
const h3 = (num, t) => new Paragraph({ style: "Heading3", children: [run(`${num}\t${t}`, { bold: true })] });
const spacer = () => new Paragraph({ spacing: { line: 240, before: 0, after: 0 }, children: [run("")] });

const headings = [];
const numberingConfigs = [];
let listCount = 0, tableCount = 0;

const border = { style: BorderStyle.SINGLE, size: 4, color: "000000" };
const borders = { top: border, bottom: border, left: border, right: border };
function mkTable(headers, rows, widths, left) {
  const cell = (txt, w, head) =>
    new TableCell({
      width: { size: w, type: WidthType.DXA }, borders,
      shading: head ? { fill: "D9D9D9", type: ShadingType.CLEAR, color: "auto" } : undefined,
      margins: { top: 50, bottom: 50, left: 100, right: 100 },
      children: [new Paragraph({ alignment: AlignmentType.LEFT, spacing: { line: 276, before: 0, after: 0 }, children: runs(txt, { bold: head }) })],
    });
  return new Table({
    indent: { size: left, type: WidthType.DXA },
    width: { size: widths.reduce((a, b) => a + b, 0), type: WidthType.DXA },
    columnWidths: widths,
    rows: [
      new TableRow({ tableHeader: true, cantSplit: true, children: headers.map((h, i) => cell(h, widths[i], true)) }),
      ...rows.map((r) => new TableRow({ cantSplit: true, children: r.map((c, i) => cell(c, widths[i], false)) })),
    ],
  });
}

function renderBlocks(blocks, left) {
  const out = [];
  for (const b of blocks || []) {
    if (b.t === "p") out.push(body(b.text, left));
    else if (b.t === "quote") out.push(quote(b.text, left));
    else if (b.t === "list") {
      const ref = `list${++listCount}`;
      numberingConfigs.push({
        reference: ref,
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: left + 425, hanging: 425 } }, run: { font: FONT, size: 24 } } }],
      });
      for (const it of b.items) out.push(new Paragraph({ numbering: { reference: ref, level: 0 }, alignment: J, spacing: SP, children: runs(it) }));
    } else if (b.t === "table") {
      tableCount++;
      const total = TEXT_W - left;
      const n = b.headers.length;
      const w0 = Math.floor(total / n);
      const widths = b.widths || b.headers.map((_, i) => (i < n - 1 ? w0 : total - w0 * (n - 1)));
      out.push(new Paragraph({ keepNext: true, spacing: SP, indent: { left }, children: [run(`Tabel ${tableCount}. `, { bold: true }), ...runs(b.caption)] }));
      out.push(mkTable(b.headers, b.rows, widths, left));
      out.push(spacer());
    } else throw new Error("Tipe blok tidak dikenal: " + b.t);
  }
  return out;
}

// ---------- COVER ----------
const C = (text, o = {}) => new Paragraph({ alignment: AlignmentType.CENTER, spacing: SP, children: [run(text, { size: 28, ...o })] });
const noB = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: noB, bottom: noB, left: noB, right: noB };
const nameCell = (txt, w) =>
  new TableCell({ width: { size: w, type: WidthType.DXA }, borders: noBorders, margins: { top: 20, bottom: 20, left: 60, right: 60 },
    children: [new Paragraph({ spacing: { line: 276, before: 0, after: 0 }, children: [run(txt, { size: 28 })] })] });
const nameW = [500, 4437, 3000];
const anggota = meta.jumlah_anggota || 4;
const nameTable = new Table({
  alignment: AlignmentType.CENTER, width: { size: 7937, type: WidthType.DXA }, columnWidths: nameW,
  rows: Array.from({ length: anggota }, (_, i) => i + 1).map((n) =>
    new TableRow({ children: [nameCell(`${n}.`, nameW[0]), nameCell(`Nama Anggota ${n}`, nameW[1]), nameCell("NIM. 0000000000", nameW[2])] })),
});
// "HALAMAN JUDUL": Heading 1 kecil berwarna putih di paling atas cover, supaya masuk daftar isi otomatis
const coverHeading = new Paragraph({
  style: "Heading1",
  spacing: { line: 100, lineRule: LineRuleType.EXACT, before: 0, after: 0 },
  children: [run("HALAMAN JUDUL", { bold: true, size: 8, color: "FFFFFF" })],
});
const cover = [
  coverHeading,
  C("MAKALAH", { bold: true }),
  C(String(meta.judul || "JUDUL MAKALAH").toUpperCase(), { bold: true }),
  C(""),
  C(`Disusun untuk memenuhi tugas mata kuliah ${meta.matkul || "..."}`),
  C(`Dosen Pengampu: ${meta.dosen || "..."}`),
  C(""),
];
if (fs.existsSync(logoPath)) {
  cover.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: SP, children: [
    new ImageRun({ type: "png", data: fs.readFileSync(logoPath), transformation: { width: 165, height: 166 },
      altText: { title: "Logo", description: "Logo universitas", name: "logo" } })] }));
}
cover.push(C(""), C("Disusun oleh:"), nameTable, C(""));
// varian Sistem Informasi: fakultas dan program studi selalu tampil di atas nama universitas
cover.push(
  C(String(meta.fakultas || "Fakultas Matematika dan Ilmu Pengetahuan Alam").toUpperCase(), { bold: true }),
  C(String(meta.prodi || "Program Studi Sistem Informasi").toUpperCase(), { bold: true }),
);
cover.push(C(meta.universitas || "UNIVERSITAS RIAU", { bold: true }), C(String(meta.tahun || new Date().getFullYear()), { bold: true }));

// ---------- KATA PENGANTAR ----------
const kataPengantar = [
  h1(["KATA PENGANTAR"], true),
  ...(data.kata_pengantar || []).map(bodyKP),
  new Paragraph({ spacing: SP, children: [run("")] }),
  new Paragraph({ alignment: AlignmentType.RIGHT, spacing: SP, children: [run(`${meta.kota || "Pekanbaru"}, ${meta.bulan_tahun || ""}`.trim())] }),
  new Paragraph({ alignment: AlignmentType.RIGHT, spacing: SP, children: [run("Penulis")] }),
];

// ---------- BAB ----------
const babChildren = [];
(data.bab || []).forEach((bab, bi) => {
  const bn = bi + 1;
  const babTitle = String(bab.judul).toUpperCase();
  headings.push({ level: 1, text: `BAB ${ROMAN[bn]} ${babTitle}`, lines: [`BAB ${ROMAN[bn]}`, babTitle] });
  babChildren.push(h1([`BAB ${ROMAN[bn]}`, babTitle], bn > 1));
  (bab.sections || []).forEach((sec, si) => {
    const sn = `${bn}.${si + 1}`;
    headings.push({ level: 2, text: `${sn} ${sec.judul}`, lines: [`${sn} ${sec.judul}`] });
    babChildren.push(h2(sn, sec.judul));
    babChildren.push(...renderBlocks(sec.blocks, IND1));
    (sec.subs || []).forEach((sub, ki) => {
      const kn = `${sn}.${ki + 1}`;
      headings.push({ level: 3, text: `${kn} ${sub.judul}`, lines: [`${kn} ${sub.judul}`] });
      babChildren.push(h3(kn, sub.judul));
      babChildren.push(...renderBlocks(sub.blocks, IND2));
    });
  });
});

// ---------- DAFTAR PUSTAKA ----------
const dapus = [
  h1(["DAFTAR PUSTAKA"]),
  ...(data.daftar_pustaka || []).map((r) =>
    new Paragraph({ alignment: AlignmentType.LEFT, indent: { left: 709, hanging: 709 }, spacing: SP, children: runs(r) })),
];

// ---------- DOKUMEN ----------
const page = (pageNumbers) => ({
  page: { size: { width: 11906, height: 16838 }, margin: { top: 1701, right: 1701, bottom: 1701, left: 2268, header: 709, footer: 709 }, pageNumbers },
});
const emptyFooter = () => new Footer({ children: [new Paragraph({ children: [run("")] })] });
const numFooter = (align) => new Footer({ children: [new Paragraph({ alignment: align, children: [new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 24 })] })] });
const heading = (id, name, extra) => ({
  id, name, basedOn: "Normal", next: "Normal", quickFormat: true,
  run: { font: FONT, size: 24, bold: true, color: "000000" },
  paragraph: { spacing: SP, keepNext: true, ...extra },
});
const toc = (id, name, left) => ({ id, name, basedOn: "Normal", next: "Normal", run: { font: FONT, size: 24 }, paragraph: { spacing: SP, indent: { left } } });

const doc = new Document({
  creator: "Kelompok", title: meta.judul || "Makalah",
  styles: {
    default: { document: { run: { font: FONT, size: 24 }, paragraph: { spacing: SP } } },
    paragraphStyles: [
      heading("Heading1", "Heading 1", { alignment: AlignmentType.CENTER, outlineLevel: 0 }),
      heading("Heading2", "Heading 2", { alignment: AlignmentType.LEFT, outlineLevel: 1, indent: { left: IND1, hanging: IND1 } }),
      heading("Heading3", "Heading 3", { alignment: AlignmentType.LEFT, outlineLevel: 2, indent: { left: IND2, hanging: 794 } }),
      toc("TOC1", "toc 1", 0), toc("TOC2", "toc 2", 284), toc("TOC3", "toc 3", 568),
    ],
  },
  numbering: { config: numberingConfigs.length ? numberingConfigs : [{ reference: "x", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT }] }] },
  sections: [
    { properties: page({ start: 1, formatType: NumberFormat.LOWER_ROMAN }), footers: { default: emptyFooter() }, children: cover },
    { properties: page({ formatType: NumberFormat.LOWER_ROMAN }), footers: { default: numFooter(AlignmentType.CENTER) },
      children: [
        h1(["DAFTAR ISI"]),
        new TableOfContents("Daftar Isi", { hyperlink: true, headingStyleRange: "1-3" }),
        ...kataPengantar,
      ] },
    { properties: page({ start: 1, formatType: NumberFormat.DECIMAL }), footers: { default: numFooter(AlignmentType.RIGHT) }, children: babChildren },
    { properties: page({ formatType: NumberFormat.DECIMAL }), footers: { default: emptyFooter() }, children: dapus },
  ],
});

// urutan daftar isi: kata pengantar, bab dan subbab, daftar pustaka
const all = [
  { level: 1, text: "HALAMAN JUDUL", lines: ["HALAMAN JUDUL"], label: "i" },
  { level: 1, text: "DAFTAR ISI", lines: ["DAFTAR ISI"], label: "ii" },
  { level: 1, text: "KATA PENGANTAR", lines: ["KATA PENGANTAR"] },
  ...headings,
  { level: 1, text: "DAFTAR PUSTAKA", lines: ["DAFTAR PUSTAKA"] },
];
fs.writeFileSync(headingsPath, JSON.stringify(all, null, 1));
Packer.toBuffer(doc).then((buf) => { fs.writeFileSync(outPath, buf); console.log("ok", outPath, "| tabel:", tableCount); });
