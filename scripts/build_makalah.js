#!/usr/bin/env node
// Usage: node build_makalah.js content.json out_raw.docx headings.json [logo.png]
// Opsi lingkungan: MAKALAH_PAGINASI=1 menghasilkan "kembaran paginasi" (rumus diganti
// penanda setinggi perkiraan) khusus untuk menghitung nomor halaman daftar isi.
const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, ImageRun, Table, TableRow, TableCell,
  WidthType, BorderStyle, AlignmentType, Footer, PageNumber, NumberFormat,
  LevelFormat, TableOfContents, ShadingType, LineRuleType, VerticalAlign,
  ImportedXmlComponent,
} = require("docx");
const { inlineOmml, displayOmml, estimateHeight } = require("./omml.js");

process.on("uncaughtException", (e) => { console.error("GALAT: " + e.message); process.exit(1); });
const [, , contentPath, outPath, headingsPath, logoArg] = process.argv;
if (!contentPath || !outPath || !headingsPath) {
  console.error("Usage: node build_makalah.js content.json out_raw.docx headings.json [logo.png]");
  process.exit(1);
}
const PAGINASI = process.env.MAKALAH_PAGINASI === "1";
const contentDir = path.dirname(path.resolve(contentPath));
const data = JSON.parse(fs.readFileSync(contentPath, "utf8"));
const meta = data.meta || {};

// varian (umum atau Sistem Informasi) dibaca dari variant.json di folder skill
let variant = { varian: "umum", fakultas_default: "", prodi_default: "" };
try { variant = { ...variant, ...JSON.parse(fs.readFileSync(path.join(__dirname, "..", "variant.json"), "utf8")) }; } catch (e) { /* pakai bawaan */ }

const resolveFromContent = (p) => (path.isAbsolute(p) ? p : path.join(contentDir, p));
const logoPath = logoArg || (meta.logo ? resolveFromContent(meta.logo) : path.join(__dirname, "..", "assets", "logo_unri.png"));

const FONT = "Times New Roman";
const TEXT_W = 7937; // A4 21cm - kiri 4cm - kanan 3cm
const IND1 = 567;    // teks subbab (1.1)
const IND2 = 1361;   // teks sub-subbab (1.1.1)
const SP = { line: 360, lineRule: LineRuleType.AUTO, before: 0, after: 0 };
const J = AlignmentType.JUSTIFIED;
const ROMAN = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
const CM = 567; // twip per cm
const PX_PER_CM = 37.795;

let ctx = ""; // letak blok yang sedang diproses, untuk pesan galat

// ---------- teks: *miring* dan rumus sebaris $...$ ----------
const mathComponent = (xml) => ImportedXmlComponent.fromXmlString(xml).root[0];

function inlineMath(latex) {
  if (PAGINASI) {
    const n = Math.max(2, latex.replace(/\\[A-Za-z]+|[{}^_\s]/g, "").length);
    return new TextRun({ text: "x".repeat(n), font: FONT, size: 24 });
  }
  try { return mathComponent(inlineOmml(latex)); }
  catch (e) { throw new Error(`Rumus sebaris tidak valid di ${ctx}: ${e.message}\n  $${latex}$`); }
}

function runs(text, o = {}) {
  const out = [];
  // pisah di $...$ yang tidak didahului garis miring terbalik
  const parts = String(text).split(/(?<!\\)\$((?:[^$\\]|\\.)+?)\$/);
  parts.forEach((part, idx) => {
    if (idx % 2 === 1) { out.push(inlineMath(part)); return; }
    String(part.replace(/\\\$/g, "$")).split(/(\*[^*]+\*)/).filter(Boolean).forEach((seg) => {
      const it = seg.length > 2 && seg.startsWith("*") && seg.endsWith("*");
      out.push(new TextRun({ text: it ? seg.slice(1, -1) : seg, font: FONT, size: 24, ...o, italics: it || o.italics }));
    });
  });
  return out;
}
const run = (t, o = {}) => new TextRun({ text: t, font: FONT, size: 24, ...o });

const bodyKP = (t) => new Paragraph({ alignment: J, indent: { firstLine: 709 }, spacing: SP, children: runs(t) });
const body = (t, left) => new Paragraph({ alignment: J, indent: { left, firstLine: 709 }, spacing: SP, children: runs(t) });
const quote = (t, left) => new Paragraph({ alignment: J, indent: { left: left + 567, right: 567 }, spacing: SP, children: runs(t) });
const h1 = (lines, pageBreak = false) =>
  new Paragraph({ style: "Heading1", pageBreakBefore: pageBreak, children: lines.map((l, i) => run(l, { bold: true, break: i ? 1 : 0 })) });
const h2 = (num, t) => new Paragraph({ style: "Heading2", children: [run(`${num}\t${t}`, { bold: true })] });
const h3 = (num, t) => new Paragraph({ style: "Heading3", children: [run(`${num}\t${t}`, { bold: true })] });
const spacer = () => new Paragraph({ spacing: { line: 240, lineRule: LineRuleType.AUTO, before: 0, after: 0 }, children: [run("")] });

const headings = [];
const numberingConfigs = [];
let listCount = 0, tableCount = 0, figCount = 0, eqCount = 0, eqNumbered = 0;

const border = { style: BorderStyle.SINGLE, size: 4, color: "000000" };
const borders = { top: border, bottom: border, left: border, right: border };
const noB = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: noB, bottom: noB, left: noB, right: noB };

function mkTable(headers, rows, widths, left) {
  const cell = (txt, w, head) =>
    new TableCell({
      width: { size: w, type: WidthType.DXA }, borders,
      shading: head ? { fill: "D9D9D9", type: ShadingType.CLEAR, color: "auto" } : undefined,
      margins: { top: 50, bottom: 50, left: 100, right: 100 },
      children: [new Paragraph({ alignment: AlignmentType.LEFT, spacing: { line: 276, lineRule: LineRuleType.AUTO, before: 0, after: 0 }, children: runs(txt, { bold: head }) })],
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

// ---------- gambar ----------
function imageInfo(buf, file) {
  if (buf.length > 24 && buf[0] === 0x89 && buf.toString("ascii", 1, 4) === "PNG") return { type: "png", w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
  if (buf.length > 4 && buf[0] === 0xff && buf[1] === 0xd8) {
    let o = 2;
    while (o + 9 < buf.length) {
      if (buf[o] !== 0xff) { o++; continue; }
      const m = buf[o + 1];
      if (m >= 0xc0 && m <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(m)) return { type: "jpg", h: buf.readUInt16BE(o + 5), w: buf.readUInt16BE(o + 7) };
      o += 2 + buf.readUInt16BE(o + 2);
    }
  }
  if (buf.toString("ascii", 0, 3) === "GIF") return { type: "gif", w: buf.readUInt16LE(6), h: buf.readUInt16LE(8) };
  throw new Error(`Gambar harus PNG, JPG, atau GIF: ${file}`);
}

function imageBlocks(b, left) {
  const file = resolveFromContent(b.path || "");
  if (!b.path || !fs.existsSync(file)) throw new Error(`File gambar tidak ditemukan di ${ctx}: ${b.path}`);
  const buf = fs.readFileSync(file);
  const info = imageInfo(buf, b.path);
  const avail = (TEXT_W - left) / CM;
  let wcm = Math.min(b.width_cm || 12, avail);
  let hcm = (wcm * info.h) / info.w;
  const maxH = b.max_height_cm || 12;
  if (hcm > maxH) { hcm = maxH; wcm = (hcm * info.w) / info.h; }
  figCount++;
  const out = [
    new Paragraph({
      alignment: AlignmentType.CENTER, keepNext: true, indent: { left },
      spacing: { line: 240, lineRule: LineRuleType.AUTO, before: 120, after: 60 },
      children: [new ImageRun({
        type: info.type, data: buf,
        transformation: { width: Math.round(wcm * PX_PER_CM), height: Math.round(hcm * PX_PER_CM) },
        altText: { title: `Gambar ${figCount}`, description: b.alt || b.caption || `Gambar ${figCount}`, name: `gambar${figCount}` },
      })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER, indent: { left }, spacing: { line: 276, lineRule: LineRuleType.AUTO, before: 0, after: b.sumber ? 0 : 160 },
      children: [run(`Gambar ${figCount}. `, { bold: true }), ...runs(b.caption || "")],
    }),
  ];
  if (b.sumber) {
    out.push(new Paragraph({
      alignment: AlignmentType.CENTER, indent: { left }, spacing: { line: 276, lineRule: LineRuleType.AUTO, before: 0, after: 160 },
      children: runs(`Sumber: ${b.sumber}`, { size: 22 }),
    }));
  }
  return out;
}

// ---------- rumus tampil ----------
function equationBlocks(b, left) {
  const lat = Array.isArray(b.latex) ? b.latex.join(" \\\\ ") : String(b.latex || "");
  if (!lat.trim()) throw new Error(`Blok equation tanpa latex di ${ctx}`);
  eqCount++;
  const number = b.nomor === true;
  const eqNo = number ? ++eqNumbered : 0; // hanya rumus bernomor yang dihitung
  const total = TEXT_W - left;
  const eqPara = (extra = {}) => {
    if (PAGINASI) {
      return new Paragraph({ alignment: AlignmentType.CENTER, keepLines: true,
        spacing: { line: estimateHeight(lat), lineRule: LineRuleType.EXACT, before: 120, after: 120 }, children: [run("")], ...extra });
    }
    let xml;
    try { xml = displayOmml(lat); }
    catch (e) { throw new Error(`Rumus tidak valid di ${ctx}: ${e.message}\n  ${lat}`); }
    return new Paragraph({ alignment: AlignmentType.CENTER, keepLines: true,
      spacing: { line: 360, lineRule: LineRuleType.AUTO, before: 120, after: 120 }, children: [mathComponent(xml)], ...extra });
  };
  if (!number) return [eqPara({ indent: { left } })];
  const side = Math.round(total * 0.12);
  const mid = total - 2 * side;
  const cell = (w, children, va) => new TableCell({
    width: { size: w, type: WidthType.DXA }, borders: noBorders, verticalAlign: va || VerticalAlign.CENTER,
    margins: { top: 0, bottom: 0, left: 0, right: 0 }, children,
  });
  const empty = new Paragraph({ spacing: { line: 240, lineRule: LineRuleType.AUTO, before: 0, after: 0 }, children: [run("")] });
  const numP = new Paragraph({ alignment: AlignmentType.RIGHT, spacing: SP, children: [run(`(${eqNo})`)] });
  return [
    new Table({
      indent: { size: left, type: WidthType.DXA },
      width: { size: total, type: WidthType.DXA }, columnWidths: [side, mid, side],
      rows: [new TableRow({ cantSplit: true, children: [cell(side, [empty]), cell(mid, [eqPara()]), cell(side, [numP])] })],
    }),
    spacer(),
  ];
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
    } else if (b.t === "equation") out.push(...equationBlocks(b, left));
    else if (b.t === "image") out.push(...imageBlocks(b, left));
    else throw new Error(`Tipe blok tidak dikenal di ${ctx}: ${b.t}`);
  }
  return out;
}

// ---------- COVER ----------
const C = (text, o = {}) => new Paragraph({ alignment: AlignmentType.CENTER, spacing: SP, children: [run(text, { size: 28, ...o })] });
const nameCell = (txt, w) =>
  new TableCell({ width: { size: w, type: WidthType.DXA }, borders: noBorders, margins: { top: 20, bottom: 20, left: 60, right: 60 },
    children: [new Paragraph({ spacing: { line: 276, lineRule: LineRuleType.AUTO, before: 0, after: 0 }, children: [run(txt, { size: 28 })] })] });
const nameW = [500, 4437, 3000];
const anggota = meta.jumlah_anggota || 4;
const nameTable = new Table({
  alignment: AlignmentType.CENTER, width: { size: 7937, type: WidthType.DXA }, columnWidths: nameW,
  rows: Array.from({ length: anggota }, (_, i) => i + 1).map((n) =>
    new TableRow({ children: [nameCell(`${n}.`, nameW[0]), nameCell(`Nama Anggota ${n}`, nameW[1]), nameCell("( NIM )", nameW[2])] })),
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
// fakultas dan prodi: nilai bawaan datang dari variant.json; meta.* menimpa, string kosong menyembunyikan
const fakultas = meta.fakultas !== undefined ? meta.fakultas : variant.fakultas_default;
const prodi = meta.prodi !== undefined ? meta.prodi : variant.prodi_default;
if (fakultas) cover.push(C(String(fakultas).toUpperCase(), { bold: true }));
if (prodi) cover.push(C(String(prodi).toUpperCase(), { bold: true }));
cover.push(C(meta.universitas || "UNIVERSITAS RIAU", { bold: true }), C(String(meta.tahun || new Date().getFullYear()), { bold: true }));

// ---------- KATA PENGANTAR ----------
ctx = "kata pengantar";
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
    ctx = `subbab ${sn} ${sec.judul}`;
    babChildren.push(...renderBlocks(sec.blocks, IND1));
    (sec.subs || []).forEach((sub, ki) => {
      const kn = `${sn}.${ki + 1}`;
      headings.push({ level: 3, text: `${kn} ${sub.judul}`, lines: [`${kn} ${sub.judul}`] });
      babChildren.push(h3(kn, sub.judul));
      ctx = `sub-subbab ${kn} ${sub.judul}`;
      babChildren.push(...renderBlocks(sub.blocks, IND2));
    });
  });
});

// ---------- DAFTAR PUSTAKA ----------
// rata kiri-kanan (JUSTIFIED) dan menggantung (hanging) berlaku bersamaan
ctx = "daftar pustaka";
const dapus = [
  h1(["DAFTAR PUSTAKA"]),
  ...(data.daftar_pustaka || []).map((r) =>
    new Paragraph({ alignment: J, indent: { left: 709, hanging: 709 }, spacing: SP, children: runs(r) })),
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
      // Heading 1: spasi sebelum 0 dan setelah 12 pt (240 twip) supaya tidak rapat ke teks di bawahnya
      heading("Heading1", "Heading 1", { alignment: AlignmentType.CENTER, outlineLevel: 0, spacing: { ...SP, after: 240 } }),
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
Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(outPath, buf);
  console.log("ok", outPath, `| varian: ${variant.varian} | tabel: ${tableCount} | gambar: ${figCount} | rumus: ${eqCount}${PAGINASI ? " | PAGINASI" : ""}`);
}).catch((e) => { console.error(e.message); process.exit(1); });
