// Konverter LaTeX (subset) -> OMML (rumus bawaan Word).
// Dipakai oleh build_makalah.js untuk blok "equation" dan rumus sebaris $...$.
//
// Didukung: \frac \dfrac \binom, pangkat ^ dan indeks _, \sqrt dan \sqrt[n],
// \sum \prod \int \oint \bigcup \bigcap (dengan batas), \lim, \left...\right,
// tanda kurung biasa (otomatis menyesuaikan tinggi), \text \mathrm \mathbf,
// \overline \bar \hat \vec \tilde, huruf Yunani, simbol umum, \\ (baris baru),
// dan & (titik sejajar antarbaris).
// Perintah di luar daftar sengaja menimbulkan galat supaya ketahuan saat build.

const SYMBOLS = {
  alpha: "α", beta: "β", gamma: "γ", delta: "δ", epsilon: "ε", varepsilon: "ε", zeta: "ζ", eta: "η",
  theta: "θ", iota: "ι", kappa: "κ", lambda: "λ", mu: "μ", nu: "ν", xi: "ξ", pi: "π", rho: "ρ",
  sigma: "σ", tau: "τ", phi: "φ", chi: "χ", psi: "ψ", omega: "ω",
  Gamma: "Γ", Delta: "Δ", Theta: "Θ", Lambda: "Λ", Xi: "Ξ", Pi: "Π", Sigma: "Σ", Phi: "Φ", Psi: "Ψ", Omega: "Ω",
  cdot: "⋅", times: "×", div: "÷", pm: "±", mp: "∓", leq: "≤", le: "≤", geq: "≥", ge: "≥",
  neq: "≠", ne: "≠", approx: "≈", equiv: "≡", sim: "∼", propto: "∝", infty: "∞",
  ldots: "…", cdots: "⋯", dots: "…", rightarrow: "→", to: "→", leftarrow: "←",
  Rightarrow: "⇒", Leftarrow: "⇐", leftrightarrow: "↔", Leftrightarrow: "⇔", implies: "⟹", iff: "⟺",
  in: "∈", notin: "∉", subset: "⊂", subseteq: "⊆", supset: "⊃", supseteq: "⊇", cup: "∪", cap: "∩",
  setminus: "∖", emptyset: "∅", varnothing: "∅", forall: "∀", exists: "∃", neg: "¬", land: "∧", lor: "∨",
  wedge: "∧", vee: "∨", oplus: "⊕", otimes: "⊗", partial: "∂", nabla: "∇", angle: "∠", degree: "°",
  circ: "∘", ast: "∗", star: "⋆", prime: "′", mid: "∣", parallel: "∥", perp: "⊥", therefore: "∴", because: "∵",
};
const NARY = { sum: "∑", prod: "∏", int: "∫", oint: "∮", bigcup: "⋃", bigcap: "⋂" };
const FUNCS = new Set(["sin", "cos", "tan", "cot", "sec", "csc", "log", "ln", "lg", "exp", "det", "gcd", "max", "min", "mod", "arcsin", "arccos", "arctan", "sinh", "cosh", "tanh"]);
const ACCENTS = { bar: "̅", hat: "̂", vec: "⃗", tilde: "̃", dot: "̇" };
const RELATIONS = new Set(["=", "<", ">"]);
const REL_CMDS = new Set(["leq", "le", "geq", "ge", "neq", "ne", "approx", "equiv", "sim", "propto", "rightarrow", "to", "Rightarrow", "Leftrightarrow", "implies", "iff", "in", "subset", "subseteq"]);
const SPACES = { ",": " ", ";": " ", ":": " ", " ": " ", quad: " ", qquad: "  ", "!": "" };
const RAW_CMDS = new Set(["text", "mathrm", "mathbf", "operatorname"]);
const DELIM_CMDS = { langle: "⟨", rangle: "⟩", lfloor: "⌊", rfloor: "⌋", lceil: "⌈", rceil: "⌉", vert: "|", Vert: "‖", "{": "{", "}": "}" };

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function tokenize(s) {
  const t = [];
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (/\s/.test(c)) { i++; continue; }
    if (c === "\\") {
      if (s[i + 1] === "\\") { t.push({ k: "nl" }); i += 2; continue; }
      const m = /^\\([A-Za-z]+)/.exec(s.slice(i));
      if (m) {
        t.push({ k: "cmd", v: m[1] });
        i += m[0].length;
        if (RAW_CMDS.has(m[1])) {
          while (i < s.length && /\s/.test(s[i])) i++;
          if (s[i] !== "{") throw new Error(`\\${m[1]} harus diikuti { ... }`);
          let d = 0, j = i;
          for (; j < s.length; j++) {
            if (s[j] === "{") d++;
            else if (s[j] === "}" && --d === 0) break;
          }
          if (d !== 0) throw new Error("Kurung kurawal tidak seimbang");
          t.push({ k: "raw", v: s.slice(i + 1, j) });
          i = j + 1;
        }
        continue;
      }
      if (i + 1 >= s.length) throw new Error("Garis miring terbalik di akhir rumus");
      t.push({ k: "cmd", v: s[i + 1] });
      i += 2;
      continue;
    }
    if ("{}^_&".includes(c)) { t.push({ k: c }); i++; continue; }
    t.push({ k: "ch", v: c });
    i++;
  }
  return t;
}

class Parser {
  constructor(tokens) { this.t = tokens; this.i = 0; }
  peek() { return this.t[this.i]; }
  next() { return this.t[this.i++]; }

  seq(stop, end = this.t.length) {
    const out = [];
    while (this.i < end) {
      const tk = this.peek();
      if (stop && stop(tk)) break;
      out.push(this.item());
    }
    return out;
  }

  item() {
    const a = this.atom();
    let sub = null, sup = null;
    for (;;) {
      const tk = this.peek();
      if (tk && tk.k === "_") { this.next(); sub = this.script(); }
      else if (tk && tk.k === "^") { this.next(); sup = this.script(); }
      else break;
    }
    if (a.t === "nary") { a.sub = sub; a.sup = sup; a.body = this.naryBody(); return a; }
    if (a.t === "lim") { a.sub = sub; return a; }
    if (sub || sup) return { t: "script", base: a, sub, sup };
    return a;
  }

  script() {
    const tk = this.peek();
    if (!tk) throw new Error("Pangkat atau indeks tanpa isi");
    if (tk.k === "{") { this.next(); const n = this.seq((x) => x.k === "}"); this.next(); return n; }
    return [this.atom()];
  }

  arg() {
    const tk = this.peek();
    if (!tk) throw new Error("Argumen perintah kurang");
    if (tk.k === "{") { this.next(); const n = this.seq((x) => x.k === "}"); this.next(); return n; }
    return [this.atom()];
  }

  naryBody() {
    const body = [];
    while (this.i < this.t.length) {
      const tk = this.peek();
      if (tk.k === "}" || tk.k === "nl" || tk.k === "&") break;
      if (tk.k === "ch" && RELATIONS.has(tk.v)) break;
      if (tk.k === "cmd" && REL_CMDS.has(tk.v)) break;
      if (tk.k === "cmd" && tk.v === "right") break;
      if (body.length && tk.k === "ch" && (tk.v === "+" || tk.v === "-")) break;
      body.push(this.item());
    }
    return body;
  }

  findClose(from) {
    let paren = 0, brace = 0;
    for (let j = from; j < this.t.length; j++) {
      const x = this.t[j];
      if (x.k === "{") brace++;
      else if (x.k === "}") { if (--brace < 0) return -1; }
      else if (brace === 0 && x.k === "ch" && x.v === "(") paren++;
      else if (brace === 0 && x.k === "ch" && x.v === ")") { if (--paren === 0) return j; }
    }
    return -1;
  }

  delimTok() {
    const tk = this.next();
    if (!tk) throw new Error("\\left atau \\right tanpa pembatas");
    if (tk.k === "ch") return tk.v === "." ? "" : tk.v;
    if (tk.k === "cmd" && DELIM_CMDS[tk.v] !== undefined) return DELIM_CMDS[tk.v];
    throw new Error("Pembatas tidak dikenal setelah \\left atau \\right");
  }

  atom() {
    const tk = this.next();
    switch (tk.k) {
      case "{": { const n = this.seq((x) => x.k === "}"); this.next(); return { t: "group", nodes: n }; }
      case "&": return { t: "amp" };
      case "}": throw new Error("Kurung kurawal penutup berlebih");
      case "^": case "_": throw new Error("Pangkat atau indeks tanpa basis");
      case "ch": {
        if (tk.v === "(") {
          const close = this.findClose(this.i - 1);
          if (close > 0) {
            const body = this.seq(null, close);
            this.i = close + 1;
            return { t: "delim", open: "(", close: ")", body };
          }
        }
        if (tk.v === "'") return { t: "run", text: "′", mode: "p" };
        return { t: "run", text: tk.v, mode: "i" };
      }
      case "cmd": return this.command(tk.v);
      default: throw new Error("Token tidak terduga");
    }
  }

  command(n) {
    if (n === "frac" || n === "dfrac" || n === "tfrac") return { t: "frac", num: this.arg(), den: this.arg() };
    if (n === "binom") return { t: "delim", open: "(", close: ")", body: [{ t: "frac", num: this.arg(), den: this.arg(), noBar: true }] };
    if (n === "sqrt") {
      let deg = null;
      const p = this.peek();
      if (p && p.k === "ch" && p.v === "[") {
        this.next();
        deg = this.seq((x) => x.k === "ch" && x.v === "]");
        this.next();
      }
      return { t: "rad", deg, body: this.arg() };
    }
    if (n === "left") {
      const open = this.delimTok();
      const body = this.seq((x) => x.k === "cmd" && x.v === "right");
      if (!this.peek()) throw new Error("\\left tanpa \\right");
      this.next();
      return { t: "delim", open, close: this.delimTok(), body };
    }
    if (n === "right") throw new Error("\\right tanpa \\left");
    if (NARY[n]) return { t: "nary", chr: NARY[n], isInt: n === "int" || n === "oint" };
    if (n === "lim") return { t: "lim" };
    if (FUNCS.has(n)) return { t: "run", text: n === "mod" ? " mod " : n, mode: "p" };
    if (RAW_CMDS.has(n)) {
      const raw = this.next();
      return { t: "run", text: raw.v, mode: n === "mathbf" ? "b" : n === "operatorname" ? "p" : "nor" };
    }
    if (n === "overline") return { t: "bar", body: this.arg() };
    if (ACCENTS[n]) return { t: "acc", chr: ACCENTS[n], body: this.arg() };
    if (SYMBOLS[n]) return { t: "run", text: SYMBOLS[n], mode: "p" };
    if (SPACES[n] !== undefined) return { t: "run", text: SPACES[n], mode: "p" };
    if (["{", "}", "%", "#", "$", "_", "&"].includes(n)) return { t: "run", text: n, mode: "p" };
    throw new Error(`Perintah LaTeX tidak dikenal: \\${n}`);
  }
}

const RPR = '<w:rPr><w:rFonts w:ascii="Cambria Math" w:hAnsi="Cambria Math"/><w:sz w:val="24"/></w:rPr>';
const RPR_TEXT = '<w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="24"/></w:rPr>';

function run(text, mode) {
  if (text === "") return "";
  const mrpr = mode === "p" ? '<m:rPr><m:sty m:val="p"/></m:rPr>'
    : mode === "b" ? '<m:rPr><m:sty m:val="b"/></m:rPr>'
    : mode === "nor" ? "<m:rPr><m:nor/></m:rPr>" : "";
  return `<m:r>${mrpr}${mode === "nor" ? RPR_TEXT : RPR}<m:t xml:space="preserve">${esc(text)}</m:t></m:r>`;
}

function flatten(nodes) {
  return nodes.flatMap((n) => (n.t === "group" ? flatten(n.nodes) : [n]));
}

function emitNodes(nodes) {
  let out = "", buf = null;
  const flush = () => { if (buf) { out += run(buf.text, buf.mode); buf = null; } };
  for (const n of flatten(nodes)) {
    if (n.t === "run") {
      if (buf && buf.mode === n.mode) buf.text += n.text;
      else { flush(); buf = { text: n.text, mode: n.mode }; }
    } else { flush(); out += emit(n); }
  }
  flush();
  return out;
}

const E = (nodes) => `<m:e>${emitNodes(nodes || [])}</m:e>`;

function emit(n) {
  switch (n.t) {
    case "amp": throw new Error("& hanya boleh di tingkat teratas rumus, bukan di dalam kurung atau pecahan");
    case "frac":
      return `<m:f><m:fPr><m:type m:val="${n.noBar ? "noBar" : "bar"}"/></m:fPr><m:num>${emitNodes(n.num)}</m:num><m:den>${emitNodes(n.den)}</m:den></m:f>`;
    case "script": {
      const base = E([n.base]);
      if (n.sub && n.sup) return `<m:sSubSup>${base}<m:sub>${emitNodes(n.sub)}</m:sub><m:sup>${emitNodes(n.sup)}</m:sup></m:sSubSup>`;
      if (n.sup) return `<m:sSup>${base}<m:sup>${emitNodes(n.sup)}</m:sup></m:sSup>`;
      return `<m:sSub>${base}<m:sub>${emitNodes(n.sub)}</m:sub></m:sSub>`;
    }
    case "nary": {
      const loc = n.isInt ? "subSup" : "undOvr";
      const pr = `<m:naryPr><m:chr m:val="${n.chr}"/><m:limLoc m:val="${loc}"/>${n.sub ? "" : '<m:subHide m:val="1"/>'}${n.sup ? "" : '<m:supHide m:val="1"/>'}</m:naryPr>`;
      return `<m:nary>${pr}<m:sub>${emitNodes(n.sub || [])}</m:sub><m:sup>${emitNodes(n.sup || [])}</m:sup>${E(n.body)}</m:nary>`;
    }
    case "lim":
      return `<m:limLow><m:e>${run("lim", "p")}</m:e><m:lim>${emitNodes(n.sub || [])}</m:lim></m:limLow>`;
    case "rad":
      return `<m:rad><m:radPr>${n.deg ? "" : '<m:degHide m:val="1"/>'}</m:radPr><m:deg>${emitNodes(n.deg || [])}</m:deg>${E(n.body)}</m:rad>`;
    case "delim":
      return `<m:d><m:dPr><m:begChr m:val="${esc(n.open)}"/><m:endChr m:val="${esc(n.close)}"/></m:dPr>${E(n.body)}</m:d>`;
    case "bar":
      return `<m:bar><m:barPr><m:pos m:val="top"/></m:barPr>${E(n.body)}</m:bar>`;
    case "acc":
      return `<m:acc><m:accPr><m:chr m:val="${n.chr}"/></m:accPr>${E(n.body)}</m:acc>`;
    default:
      throw new Error("Simpul tidak dikenal: " + n.t);
  }
}

function parseRow(tokens) {
  const p = new Parser(tokens);
  const nodes = p.seq(null);
  if (p.i < tokens.length) throw new Error("Rumus tidak terbaca sampai akhir");
  return nodes;
}

function contentOf(latex) {
  const tokens = tokenize(String(latex));
  const rows = [[]];
  for (const tk of tokens) {
    if (tk.k === "nl") rows.push([]);
    else rows[rows.length - 1].push(tk);
  }
  const parsed = rows.filter((r) => r.length).map(parseRow);
  if (!parsed.length) throw new Error("Rumus kosong");
  const hasAmp = parsed.some((r) => r.some((n) => n.t === "amp"));
  if (hasAmp) {
    // Baris dengan & dipecah di & pertama: kolom kiri rata kanan, kolom kanan rata kiri
    // (sama seperti lingkungan "aligned" di LaTeX; disandikan sebagai matriks 2 kolom
    // supaya tampil sejajar di Word maupun penampil lain).
    const mrows = parsed.map((r) => {
      const at = r.findIndex((n) => n.t === "amp");
      const left = at < 0 ? r : r.slice(0, at);
      const right = at < 0 ? [] : r.slice(at + 1);
      if (right.some((n) => n.t === "amp")) throw new Error("Hanya satu & per baris");
      return `<m:mr><m:e>${emitNodes(left)}</m:e><m:e>${emitNodes(right)}</m:e></m:mr>`;
    });
    return '<m:m><m:mPr><m:baseJc m:val="center"/><m:plcHide m:val="1"/><m:mcs>'
      + '<m:mc><m:mcPr><m:count m:val="1"/><m:mcJc m:val="right"/></m:mcPr></m:mc>'
      + '<m:mc><m:mcPr><m:count m:val="1"/><m:mcJc m:val="left"/></m:mcPr></m:mc>'
      + `</m:mcs></m:mPr>${mrows.join("")}</m:m>`;
  }
  if (parsed.length === 1) return emitNodes(parsed[0]);
  return `<m:eqArr>${parsed.map((r) => `<m:e>${emitNodes(r)}</m:e>`).join("")}</m:eqArr>`;
}

// Perkiraan tinggi rumus dalam twip, dipakai untuk menghitung nomor halaman daftar isi
// ketika penampil (mis. LibreOffice tanpa modul Math) tidak bisa menggambar rumus.
function estimateHeight(latex) {
  const rows = String(latex).split("\\\\").length;
  const tall = /\\(frac|dfrac|tfrac|binom)|\\(sum|prod|int|oint|bigcup|bigcap|lim)\b/.test(latex);
  const mid = /\\sqrt|\\overline/.test(latex);
  const one = tall ? 900 : mid ? 560 : 420;
  return one * rows;
}

// <m:oMath> untuk rumus sebaris di dalam paragraf
const inlineOmml = (latex) => `<m:oMath>${contentOf(latex)}</m:oMath>`;
// <m:oMathPara> untuk rumus tampil (terpusat di paragraf sendiri)
const displayOmml = (latex) => `<m:oMathPara><m:oMath>${contentOf(latex)}</m:oMath></m:oMathPara>`;

module.exports = { inlineOmml, displayOmml, estimateHeight };
