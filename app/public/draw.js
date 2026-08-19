// Pen notes — a canvas you write on with a stylus or mouse, saved as an ordinary .png with the
// vector strokes tucked into a PNG tEXt chunk.
//
// Why a PNG and not an SVG: this app exists so Claude can read your materials. Claude's Read tool is
// multimodal, so a .png of your handwriting genuinely participates in Digest/Quiz/Summarize — an
// .svg arrives as raw path data and the note becomes invisible to the exact features it feeds. The
// embedded chunk buys back what raster normally costs: reopening a note restores every stroke, so
// undo still works and you can keep drawing on it weeks later.
//
// A plain script exposing one global, like /vendor/marked.min.js — subject.js is not a module.
window.Draw = (function () {
  "use strict";

  const SIG = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  const KEYWORD = "studyroom-strokes";
  const PAPER = "#fffdf8";
  const RULE = "#e8e2d4";
  const RULE_GAP = 34;

  // A4 at 96 dpi. The page is the DOCUMENT's size, deliberately independent of the pane it is being
  // viewed in: a note written on a narrow companion pane and one written full-width are the same
  // sheet of paper, and reopening either does not reflow a single stroke.
  const A4 = { w: 794, h: 1123 };
  const ZOOMS = [0.25, 0.33, 0.5, 0.67, 0.8, 1, 1.25, 1.5, 2, 3, 4];
  // Backing-store ceiling in device pixels. Ten A4 sheets at 4× would ask for a canvas no browser
  // will allocate, and a failed allocation is a blank note — so render scale is capped instead, and
  // zooming past the cap costs sharpness rather than the whole page.
  const MAX_BACKING = 48e6;

  const TOOLS = [
    { id: "pen", label: "Pen" },
    { id: "highlighter", label: "Highlighter" },
    { id: "eraser", label: "Eraser" },
  ];
  const PEN_INKS = ["#23272e", "#a32d2d", "#185fa5", "#3b6d11"];
  // Highlighter colours are the ones that actually exist in a pencil case: lemon, pink, and green
  // and blue pulled back from full neon so they don't fight the text they sit over.
  const HIGHLIGHTS = ["#f2e14c", "#f58cb4", "#86e05a", "#5cc8f0"];
  const HIGHLIGHT_ALPHA = 0.45;
  // The nib is a flat edge held at a fixed angle, like a real chisel highlighter. 70° off horizontal
  // is the useful compromise: a stroke along a line of text lays down nearly the full span, while a
  // vertical stroke narrows to about a third of it instead of collapsing to nothing.
  const NIB_ANGLE = (70 * Math.PI) / 180;

  /** Half the nib, as a vector. Sweeping this along a path is what gives the flat-tip shape. */
  function nib(span) {
    return { x: (Math.cos(NIB_ANGLE) * span) / 2, y: (Math.sin(NIB_ANGLE) * span) / 2 };
  }

  // =====================================================================================
  // PNG chunk plumbing
  // =====================================================================================

  let crcTable = null;
  function crc32(bytes) {
    if (!crcTable) {
      crcTable = new Uint32Array(256);
      for (let n = 0; n < 256; n++) {
        let c = n;
        for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
        crcTable[n] = c >>> 0;
      }
    }
    let c = 0xffffffff;
    for (let i = 0; i < bytes.length; i++) c = crcTable[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
  }

  /** Every chunk in a PNG as { type, dataStart, len, start }, or [] if this isn't a PNG at all. */
  function chunkList(bytes) {
    for (let i = 0; i < SIG.length; i++) if (bytes[i] !== SIG[i]) return [];
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const out = [];
    let p = 8;
    // +12 is the chunk's own overhead (4 length, 4 type, 4 CRC); a truncated tail just ends the walk
    // rather than throwing — a half-written file should degrade to "no strokes", not to an exception.
    while (p + 12 <= bytes.length) {
      const len = view.getUint32(p);
      if (p + 12 + len > bytes.length) break;
      const type = String.fromCharCode(bytes[p + 4], bytes[p + 5], bytes[p + 6], bytes[p + 7]);
      out.push({ type, start: p, len, dataStart: p + 8 });
      p += 12 + len;
    }
    return out;
  }

  /**
   * The strokes stored in a PNG, or null if there are none. Null is an ordinary outcome, not an
   * error: it's what you get for a photo, a diagram someone dropped in, or a pen note whose metadata
   * some other program stripped. The caller falls back to drawing on the image as a backdrop.
   */
  function readStrokes(buffer) {
    const bytes = new Uint8Array(buffer);
    for (const c of chunkList(bytes)) {
      if (c.type !== "tEXt") continue;
      let end = c.dataStart;
      while (end < c.dataStart + c.len && bytes[end] !== 0) end++;
      let key = "";
      for (let i = c.dataStart; i < end; i++) key += String.fromCharCode(bytes[i]);
      if (key !== KEYWORD) continue;
      let text = "";
      for (let i = end + 1; i < c.dataStart + c.len; i++) text += String.fromCharCode(bytes[i]);
      try {
        return decode(JSON.parse(text));
      } catch {
        return null; // corrupt payload behaves exactly like an absent one
      }
    }
    return null;
  }

  /** A copy of `blob` carrying `payload` in a tEXt chunk, spliced in just before IEND. */
  async function embed(blob, payload) {
    const bytes = new Uint8Array(await blob.arrayBuffer());
    const end = chunkList(bytes).find((c) => c.type === "IEND");
    if (!end) return blob; // not a PNG we understand; hand it back untouched rather than corrupt it

    const text = KEYWORD + "\0" + payload;
    const body = new Uint8Array(4 + text.length);
    body.set([0x74, 0x45, 0x58, 0x74]); // "tEXt"
    // The payload is JSON of hex colours and integers, so it is pure ASCII and charCodeAt is exact —
    // which matters, because tEXt is Latin-1 and has no way to carry anything wider.
    for (let i = 0; i < text.length; i++) body[4 + i] = text.charCodeAt(i) & 0xff;

    const chunk = new Uint8Array(body.length + 8);
    new DataView(chunk.buffer).setUint32(0, text.length);
    chunk.set(body, 4);
    new DataView(chunk.buffer).setUint32(body.length + 4, crc32(body));

    const out = new Uint8Array(bytes.length + chunk.length);
    out.set(bytes.subarray(0, end.start), 0);
    out.set(chunk, end.start);
    out.set(bytes.subarray(end.start), end.start + chunk.length);
    return new Blob([out], { type: "image/png" });
  }

  // =====================================================================================
  // Stroke encoding — compact on purpose: this rides inside the image file.
  // Points flatten to [x, y, pressure, x, y, pressure, …] with coordinates rounded to whole document
  // pixels and pressure to a byte. A dense page lands around 15 KB, small enough that compressing it
  // would only add a code path that can fail.
  // =====================================================================================

  const packStroke = (s) => {
    const p = [];
    for (const q of s.pts) p.push(Math.round(q.x), Math.round(q.y), Math.round(q.p * 255));
    return { t: s.tool, c: s.color, z: s.size, p };
  };

  /**
   * v3: one file is the whole notebook. `sh` is an array of sheets, each an array of strokes, and
   * `pg.n` is how many there are. The image itself stacks the sheets top to bottom, so anything that
   * only sees a PNG — a browser tab, Claude's Read tool, GitHub — still sees every page.
   */
  function encode(sheets, page) {
    return JSON.stringify({
      v: 3,
      w: Math.round(page.w),
      h: Math.round(page.h * sheets.length),
      pg: { w: Math.round(page.w), h: Math.round(page.h), n: sheets.length },
      sh: sheets.map((strokes) => strokes.map(packStroke)),
    });
  }

  /**
   * One file is one sheet. Two older shapes still have to open cleanly:
   *   v1  — no page model at all; the sheet was however big the pane happened to be.
   *   v2 with n > 1 — the brief period when sheets were stacked inside a single file.
   * Both are read back as ONE page of their full stored height, so every stroke stays exactly where
   * it was drawn. Re-cutting them to A4 would move ink, which is never the right answer.
   */
  function unpackStrokes(list) {
    const out = [];
    for (const s of list || []) {
      const pts = [];
      for (let i = 0; i + 2 < s.p.length; i += 3) pts.push({ x: s.p[i], y: s.p[i + 1], p: s.p[i + 2] / 255 });
      if (pts.length) out.push({ tool: s.t, color: s.c, size: s.z, pts });
    }
    return out;
  }

  /**
   * Three shapes have to open cleanly:
   *   v1 — no page model; the sheet was however big the pane happened to be.
   *   v2 — one sheet per file, briefly, with an S<n>- name.
   *   v3 — one file, many sheets.
   * The older two become a single sheet of their stored size. Re-cutting them to A4 would move ink,
   * which is never the right answer for a note somebody already wrote.
   */
  function decode(doc) {
    if (!doc || !doc.v || doc.v > 3) return null;
    if (doc.v === 3) {
      if (!Array.isArray(doc.sh) || !doc.pg) return null;
      return {
        sheets: doc.sh.map(unpackStrokes),
        page: { w: doc.pg.w, h: doc.pg.h },
      };
    }
    if (!Array.isArray(doc.s)) return null;
    const page = doc.pg && doc.pg.w && doc.pg.h
      ? { w: doc.pg.w, h: doc.pg.h * Math.max(1, doc.pg.n || 1) }
      : { w: doc.w, h: doc.h };
    return { sheets: [unpackStrokes(doc.s)], page };
  }

  // =====================================================================================
  // Painting
  //
  // Two layers, and the split is the whole reason the page behaves like a notebook:
  //
  //   paper  — the cream ground, the ruled lines, and any backdrop image. Repainted from scratch on
  //            every composite and never drawn into by a tool.
  //   ink    — a transparent canvas holding only your strokes. The eraser is destination-out HERE,
  //            so it can only ever remove ink.
  //
  // One canvas would mean the eraser cutting holes in the ruled lines, which is not what an eraser
  // does to a notebook.
  // =====================================================================================

  /** Round-tool width in document units. The highlighter has no width — it has a nib; see below. */
  function widthAt(tool, size, pressure) {
    if (tool === "eraser") return size * 5;
    return size * (0.45 + 0.55 * pressure) * 1.4;
  }

  /** The blend a tool lays down. Shared by the full repaint and the live segment path. */
  function applyTool(cx, tool) {
    cx.lineCap = "round";
    cx.lineJoin = "round";
    if (tool === "eraser") cx.globalCompositeOperation = "destination-out";
    if (tool === "highlighter") {
      // Multiply is what makes it read as a highlighter rather than as paint: whatever is under the
      // mark keeps showing through, so pen strokes stay legible and overlaps deepen the way real
      // ink does. Plain alpha at any strength either hides the writing or looks like a wash.
      cx.globalCompositeOperation = "multiply";
      cx.globalAlpha = HIGHLIGHT_ALPHA;
    }
  }

  function paintStroke(cx, s) {
    const p = s.pts;
    if (!p.length) return;
    cx.save();
    applyTool(cx, s.tool);
    cx.strokeStyle = s.color;
    cx.fillStyle = s.color;

    // The highlighter is a flat tip, so it isn't a stroked line at all: it's the area the nib sweeps
    // out, drawn as ONE filled polygon — the nib offset carried up one side of the path and back
    // down the other. One fill also means one composite, which is what keeps a translucent mark from
    // going dark wherever the stroke doubles back on itself.
    if (s.tool === "highlighter") {
      const d = nib(s.size);
      cx.beginPath();
      cx.moveTo(p[0].x + d.x, p[0].y + d.y);
      for (let i = 1; i < p.length; i++) cx.lineTo(p[i].x + d.x, p[i].y + d.y);
      for (let i = p.length - 1; i >= 0; i--) cx.lineTo(p[i].x - d.x, p[i].y - d.y);
      cx.closePath();
      cx.fill();
      cx.restore();
      return;
    }
    if (p.length === 1) {
      cx.beginPath();
      cx.arc(p[0].x, p[0].y, widthAt(s.tool, s.size, p[0].p) / 2, 0, Math.PI * 2);
      cx.fill();
      cx.restore();
      return;
    }
    // The pen is drawn segment by segment so each one can carry its own pressure-derived width;
    // the eraser is one constant-width path.
    if (s.tool === "pen") {
      for (let i = 1; i < p.length; i++) {
        cx.beginPath();
        cx.lineWidth = widthAt(s.tool, s.size, (p[i - 1].p + p[i].p) / 2);
        cx.moveTo(p[i - 1].x, p[i - 1].y);
        cx.lineTo(p[i].x, p[i].y);
        cx.stroke();
      }
    } else {
      cx.beginPath();
      cx.lineWidth = widthAt(s.tool, s.size, 1);
      cx.moveTo(p[0].x, p[0].y);
      for (let i = 1; i < p.length; i++) cx.lineTo(p[i].x, p[i].y);
      cx.stroke();
    }
    cx.restore();
  }

  /**
   * The permanent layer: ground, backdrop, rules. Nothing a tool does reaches this.
   * A backdrop is a previous flattened save of this same note, so it already carries its own rules —
   * drawing ours on top of it would double them a shade darker every time the note was reopened.
   */
  function paintPaper(cx, w, h, backdrop) {
    cx.save();
    cx.globalCompositeOperation = "source-over";
    cx.fillStyle = PAPER;
    cx.fillRect(0, 0, w, h);
    if (backdrop) {
      cx.drawImage(backdrop, 0, 0, w, h);
    } else {
      cx.strokeStyle = RULE;
      cx.lineWidth = 1;
      for (let y = RULE_GAP; y < h; y += RULE_GAP) {
        cx.beginPath();
        cx.moveTo(0, y + 0.5);
        cx.lineTo(w, y + 0.5);
        cx.stroke();
      }
    }
    cx.restore();
  }

  /**
   * The S1 / S2 mark in the corner of each sheet. It is painted into the PAPER, so it survives the
   * eraser and — the point of it — it is there in the exported image and the PDF. One file holds the
   * whole notebook, so the file name cannot say which sheet you are looking at; the sheet does.
   */
  function stampSheet(cx, page, n) {
    cx.save();
    cx.setTransform(cx.getTransform()); // keep the caller's document transform
    cx.fillStyle = "#b9b2a1";
    cx.font = `500 ${Math.round(page.h * 0.018)}px -apple-system, "Segoe UI", Helvetica, Arial, sans-serif`;
    cx.textAlign = "right";
    cx.textBaseline = "top";
    cx.fillText(`S${n}`, page.w - page.w * 0.03, page.h * 0.022);
    cx.restore();
  }

  /**
   * One sheet, rendered paper-then-ink onto its own canvas at `scale`.
   * The two layers are kept apart here for the same reason they are on screen: the eraser is
   * destination-out on the ink, so it can never take the ruled lines with it.
   */
  function renderSheet(strokes, page, scale, n, backdrop) {
    const c = document.createElement("canvas");
    c.width = Math.max(1, Math.round(page.w * scale));
    c.height = Math.max(1, Math.round(page.h * scale));
    const ctx = c.getContext("2d");
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    paintPaper(ctx, page.w, page.h, backdrop);
    if (n) stampSheet(ctx, page, n);

    const ink = document.createElement("canvas");
    ink.width = c.width;
    ink.height = c.height;
    const ix = ink.getContext("2d");
    ix.setTransform(scale, 0, 0, scale, 0, 0);
    for (const s of strokes) paintStroke(ix, s);

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.drawImage(ink, 0, 0);
    return c;
  }

  /** The whole notebook as one tall canvas, sheets stacked in order. This is what gets saved. */
  function renderNotebook(sheets, page, scale, backdrop) {
    const c = document.createElement("canvas");
    c.width = Math.max(1, Math.round(page.w * scale));
    c.height = Math.max(1, Math.round(page.h * sheets.length * scale));
    const ctx = c.getContext("2d");
    sheets.forEach((strokes, i) => {
      const one = renderSheet(strokes, page, scale, i + 1, i === 0 ? backdrop : null);
      ctx.drawImage(one, 0, Math.round(page.h * i * scale));
    });
    return c;
  }

  /**
   * One empty A4 sheet as a PNG blob — what "+ Note → Pen" writes before the editor opens.
   * Portrait by default; the surface's own controls change it from there.
   */
  async function blank(spec) {
    // Either an explicit { w, h } — so a new sheet matches the orientation of the one you were on —
    // or a boolean for plain portrait/landscape A4.
    const page = spec && spec.w
      ? { w: spec.w, h: spec.h }
      : (spec ? { w: A4.h, h: A4.w } : { w: A4.w, h: A4.h });
    const c = renderNotebook([[]], page, 1, null);
    const png = await new Promise((r) => c.toBlob(r, "image/png"));
    return embed(png, encode([[]], page));
  }

  // =====================================================================================
  // PDF export
  //
  // Hand-rolled, because the alternative is shipping a PDF library into an app whose whole
  // dependency list is currently one line long. Each sheet goes in as a JPEG and is referenced by a
  // page — /DCTDecode means the JPEG bytes are embedded verbatim, so there is no pixel format to
  // convert and no compressor to write.
  // =====================================================================================

  const PT_PER_PX = 72 / 96; // document units are CSS pixels at 96 dpi; PDF works in points
  const PDF_SCALE = 2;       // render sheets at 2× so handwriting stays crisp in print

  /** A rendered sheet canvas as JPEG bytes for embedding. */
  async function rasterize(canvas) {
    const blob = await new Promise((r) => canvas.toBlob(r, "image/jpeg", 0.92));
    return { bytes: new Uint8Array(await blob.arrayBuffer()), w: canvas.width, h: canvas.height };
  }

  /** Build a PDF from rasterized sheets. Returns a Blob. */
  function buildPdf(sheets) {
    const enc = new TextEncoder();
    const chunks = [];
    let length = 0;
    const put = (data) => {
      const bytes = typeof data === "string" ? enc.encode(data) : data;
      chunks.push(bytes);
      length += bytes.length;
      return length;
    };

    // Object 1 is the catalog and 2 the page tree; each sheet then takes three objects.
    const offsets = [];
    const objectAt = (n) => { offsets[n] = length; };
    const total = 2 + sheets.length * 3;

    put("%PDF-1.4\n%\xE2\xE3\xCF\xD3\n");

    objectAt(1);
    put(`1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n`);

    const kids = sheets.map((_, i) => `${3 + i * 3} 0 R`).join(" ");
    objectAt(2);
    put(`2 0 obj\n<< /Type /Pages /Kids [${kids}] /Count ${sheets.length} >>\nendobj\n`);

    sheets.forEach((s, i) => {
      const pageObj = 3 + i * 3;
      const imgObj = pageObj + 1;
      const contentObj = pageObj + 2;
      // The page is sized from the SHEET's own document units, so a landscape sheet stays landscape
      // and a taller-than-A4 one keeps its height instead of being cropped.
      const wPt = (s.page.w * PT_PER_PX).toFixed(2);
      const hPt = (s.page.h * PT_PER_PX).toFixed(2);

      objectAt(pageObj);
      put(`${pageObj} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${wPt} ${hPt}] `
        + `/Resources << /XObject << /Im0 ${imgObj} 0 R >> >> /Contents ${contentObj} 0 R >>\nendobj\n`);

      objectAt(imgObj);
      put(`${imgObj} 0 obj\n<< /Type /XObject /Subtype /Image /Width ${s.w} /Height ${s.h} `
        + `/ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${s.bytes.length} >>\nstream\n`);
      put(s.bytes);
      put("\nendstream\nendobj\n");

      // Scale the unit image up to the page box. cm takes the matrix in the order a b c d e f.
      const content = `q\n${wPt} 0 0 ${hPt} 0 0 cm\n/Im0 Do\nQ\n`;
      objectAt(contentObj);
      put(`${contentObj} 0 obj\n<< /Length ${enc.encode(content).length} >>\nstream\n${content}endstream\nendobj\n`);
    });

    const xref = length;
    let table = `xref\n0 ${total + 1}\n0000000000 65535 f \n`;
    for (let n = 1; n <= total; n++) table += `${String(offsets[n]).padStart(10, "0")} 00000 n \n`;
    put(table);
    put(`trailer\n<< /Size ${total + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`);

    return new Blob(chunks, { type: "application/pdf" });
  }

  /**
   * Every sheet of a notebook, in order, as one PDF — one page per sheet, at the sheet's own size.
   * Rendered straight from the strokes, so it never depends on what the file is called or on how
   * many files there are.
   */
  async function toPdf(sheets, page, backdrop) {
    const out = [];
    for (let i = 0; i < sheets.length; i++) {
      const canvas = renderSheet(sheets[i], page, PDF_SCALE, i + 1, i === 0 ? backdrop : null);
      out.push({ ...(await rasterize(canvas)), page });
    }
    return buildPdf(out);
  }

  /** Hand a Blob to the browser as a download named `name`. */
  function download(blob, name) {
    const href = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = href;
    a.download = name;
    a.click();
    // The click is handled asynchronously; revoking immediately cancels the download.
    setTimeout(() => URL.revokeObjectURL(href), 10000);
  }

  // =====================================================================================
  // The surface
  // =====================================================================================

  function button(label, className) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = className || "btn small";
    b.textContent = label;
    return b;
  }

  /**
   * Mount a drawing surface into `container`.
   *
   * `strokes`/`width`/`height` come from readStrokes(); `backdrop` is an already-loaded <img> used
   * when a PNG carries no stroke data, so an imported diagram can still be drawn on.
   *
   * Returns { rev, toBlob(), serialize(), destroy() }. `rev` counts committed mutations — the caller
   * compares it against the value at open to know whether there is anything to save, which is O(1)
   * where re-serialising to diff would not be.
   */
  function open(container, opts) {
    const o = opts || {};
    const wrap = document.createElement("div");
    wrap.className = "draw";

    const bar = document.createElement("div");
    bar.className = "draw-bar";
    const body = document.createElement("div");
    body.className = "draw-body";
    const rail = document.createElement("div"); // page controls: zoom, orientation, sheets
    rail.className = "draw-rail";
    const scroller = document.createElement("div");
    scroller.className = "draw-scroll";
    const sheet = document.createElement("div"); // the paper, at its on-screen size
    sheet.className = "draw-sheet";
    const canvas = document.createElement("canvas");
    canvas.className = "draw-canvas";

    // A cursor that shows the actual mark you are about to make. The highlighter's nib is a flat
    // edge whose coverage depends on which way you move, so a crosshair tells you nothing useful —
    // this draws the nib itself, at its true length and angle.
    //
    // It lives INSIDE the scrolled sheet and carries a viewBox in document units. Sized to the
    // viewport instead, it vanished the moment you scrolled past the first few lines, and every
    // coordinate would need the scroll offset folded in by hand.
    const SVGNS = "http://www.w3.org/2000/svg";
    const overlay = document.createElementNS(SVGNS, "svg");
    overlay.setAttribute("class", "draw-cursor");
    overlay.setAttribute("preserveAspectRatio", "none");
    const nibHalo = document.createElementNS(SVGNS, "line"); // white underlay, so it reads on ink too
    const nibLine = document.createElementNS(SVGNS, "line");
    const ring = document.createElementNS(SVGNS, "circle");
    nibHalo.setAttribute("class", "nib-halo");
    nibLine.setAttribute("class", "nib-line");
    ring.setAttribute("class", "nib-ring");
    overlay.append(nibHalo, nibLine, ring);

    const tabs = document.createElement("div");
    tabs.className = "draw-tabs";

    sheet.append(canvas, overlay);
    scroller.append(sheet);
    body.append(rail, scroller);
    wrap.append(bar, body, tabs);
    container.replaceChildren(wrap);

    const cx = canvas.getContext("2d");
    const ink = document.createElement("canvas"); // the layer the eraser is allowed to touch
    const ix = ink.getContext("2d");
    // The notebook: an array of sheets, each an array of strokes, ALL held here. Switching sheets is
    // an index change, not a file load — which is why flipping through them is instant and why no
    // sheet can be lost by navigating away from it before a save.
    const book = (o.sheets && o.sheets.length ? o.sheets.map((s) => s.slice()) : [[]]);
    let current = 0;
    const undoneBy = book.map(() => []);
    const strokesNow = () => book[current];
    const backdrop = o.backdrop || null;
    let tool = "pen";
    let cur = null;
    let sawPen = false;
    let pending = false;

    // Each tool remembers its own colour and thickness. Reaching for the highlighter should not
    // reset the pen you had set up, and coming back to the pen should not hand you a highlighter's
    // 8px nib.
    const colors = { pen: PEN_INKS[0], highlighter: HIGHLIGHTS[0], eraser: PEN_INKS[0] };
    const sizes = { pen: 3, highlighter: 18, eraser: 3 };
    // The slider means a different thing per tool — a nib span wants a much wider range than a pen
    // line — so each carries its own bounds and its own label.
    const RANGE = {
      pen: { min: 1, max: 16, label: "Thickness" },
      highlighter: { min: 6, max: 48, label: "Nib span" },
      eraser: { min: 1, max: 16, label: "Eraser size" },
    };

    // The page, in document units. Strokes are stored in these units and NOTHING rescales them —
    // not zooming, not resizing the pane, not dragging the gutter. Only the view scale changes, so a
    // note reopened at a different size is the same note, byte for byte.
    let page = o.page && o.page.w ? { w: o.page.w, h: o.page.h } : { w: A4.w, h: A4.h };
    let zoom = 1;
    let fitWidth = true;    // until you touch the zoom controls, the sheet tracks the pane width
    let renderScale = 1;    // backing pixels per document unit (zoom × dpr, capped)

    // One surface shows exactly ONE sheet. The other sheets are their own files — see the tab bar
    // below — so nothing here has to know they exist beyond drawing the tabs.
    const docH = () => page.h;

    const api = {
      rev: 0,
      toBlob,
      serialize: () => encode(book, page),
      page: () => ({ w: page.w, h: page.h }),
      sheets: () => book.length,
      destroy,
    };

    /**
     * Commit a change. The callback is how a surface announces itself to the pane around it — the
     * companion's "unsaved" marker is driven by it, the same way the textarea drives that marker
     * from its own input event. Without it the marker only ever updates when something else happens
     * to repaint the bar.
     */
    function bump() {
      api.rev += 1;
      if (o.onChange) o.onChange();
    }

    /** Put the document transform on a context: backing pixels per document unit. */
    function useDocSpace(ctx) {
      ctx.setTransform(renderScale, 0, 0, renderScale, 0, 0);
    }

    /** Stack the ink layer onto the paper. The visible canvas is only ever written here. */
    function composite() {
      cx.setTransform(1, 0, 0, 1, 0, 0);
      cx.globalAlpha = 1;
      cx.globalCompositeOperation = "source-over";
      cx.clearRect(0, 0, canvas.width, canvas.height);
      useDocSpace(cx);
      // The backdrop belongs to the first sheet only — it is the imported image the note was
      // started from, not a watermark for every page after it.
      paintPaper(cx, page.w, docH(), current === 0 ? backdrop : null);
      stampSheet(cx, page, current + 1);
      cx.setTransform(1, 0, 0, 1, 0, 0); // the layers share a backing size, so blit 1:1
      cx.drawImage(ink, 0, 0);
    }

    function redraw() {
      ix.setTransform(1, 0, 0, 1, 0, 0);
      ix.clearRect(0, 0, ink.width, ink.height);
      useDocSpace(ix);
      for (const s of strokesNow()) paintStroke(ix, s);
      composite();
    }

    function schedule() {
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => { pending = false; composite(); });
    }

    /**
     * Size the sheet and its canvases for the current page setup and zoom.
     *
     * The canvas covers the WHOLE document, not the visible slice: it is what gets saved, and a
     * viewport-sized canvas is exactly the bug that made the paper stop a few lines down.
     */
    function layout() {
      const cssW = page.w * zoom;
      const cssH = docH() * zoom;
      sheet.style.width = `${cssW}px`;
      sheet.style.height = `${cssH}px`;
      canvas.style.width = overlay.style.width = `${cssW}px`;
      canvas.style.height = overlay.style.height = `${cssH}px`;

      let scale = zoom * (window.devicePixelRatio || 1);
      const area = page.w * scale * docH() * scale;
      if (area > MAX_BACKING) scale *= Math.sqrt(MAX_BACKING / area);
      renderScale = scale;
      canvas.width = ink.width = Math.max(1, Math.round(page.w * scale));
      canvas.height = ink.height = Math.max(1, Math.round(docH() * scale));

      // User units are DOCUMENT units, so the cursor is placed in the same coordinates the strokes
      // use and needs no zoom or scroll arithmetic of its own.
      overlay.setAttribute("viewBox", `0 0 ${page.w} ${docH()}`);
      redraw();
    }

    /** Zoom so one page width fills the scroller, minus its padding. */
    function applyFitWidth() {
      const avail = scroller.clientWidth - 32;
      if (avail < 40) return;
      zoom = Math.min(4, Math.max(0.1, avail / page.w));
      showZoom();
    }

    function at(e) {
      const r = canvas.getBoundingClientRect();
      return {
        x: (e.clientX - r.left) / zoom,
        y: (e.clientY - r.top) / zoom,
        // Mouse and trackpad report 0.5 while a button is down and 0 otherwise; a stylus reports the
        // real thing. Treating 0 as 0.5 keeps a mouse line an even width instead of hairline-thin.
        p: e.pressure > 0 ? e.pressure : 0.5,
      };
    }

    /** Put the tool's footprint under the pointer, in document units (the overlay's own space). */
    function moveCursor(e) {
      const q = at(e);
      if (tool === "highlighter") {
        const d = nib(sizes.highlighter);
        for (const line of [nibHalo, nibLine]) {
          line.setAttribute("x1", q.x - d.x);
          line.setAttribute("y1", q.y - d.y);
          line.setAttribute("x2", q.x + d.x);
          line.setAttribute("y2", q.y + d.y);
        }
        nibLine.setAttribute("stroke", colors.highlighter);
      } else if (tool === "eraser") {
        ring.setAttribute("cx", q.x);
        ring.setAttribute("cy", q.y);
        ring.setAttribute("r", widthAt("eraser", sizes.eraser, 1) / 2);
      }
    }

    /** Which cursor shape applies, and whether the native pointer should get out of its way. */
    function syncCursor() {
      const shape = tool === "highlighter" ? "nib" : tool === "eraser" ? "ring" : "";
      overlay.dataset.shape = shape;
      canvas.classList.toggle("hide-cursor", Boolean(shape));
    }

    canvas.addEventListener("pointermove", moveCursor);
    canvas.addEventListener("pointerenter", (e) => { overlay.classList.add("on"); moveCursor(e); });
    canvas.addEventListener("pointerleave", () => overlay.classList.remove("on"));

    canvas.addEventListener("pointerdown", (e) => {
      if (e.pointerType === "pen") sawPen = true;
      // Palm rejection: once a stylus has touched this surface, bare fingers stop drawing. Without
      // it the heel of your hand lays down a stroke every time you write a word.
      if (e.pointerType === "touch" && sawPen) return;
      e.preventDefault();
      // Capture keeps a stroke alive when the pointer leaves the canvas mid-word. It throws if the
      // pointer is already gone by the time we ask, which must not cost you the stroke itself.
      try { canvas.setPointerCapture(e.pointerId); } catch { /* draw without capture */ }
      cur = { tool, color: colors[tool], size: sizes[tool], pts: [at(e)] };
      strokesNow().push(cur);
      undone = [];
      paintStroke(ix, cur);
      composite();
    });

    canvas.addEventListener("pointermove", (e) => {
      if (!cur) return;
      // Pointer events are throttled to the display, but a fast stroke moves a long way between
      // frames; the coalesced list is every sample the digitiser actually took.
      // An empty list is not the same as no method: it comes back empty for synthetic events, and
      // falling through to nothing would silently drop the move. The event itself is the fallback.
      const coalesced = e.getCoalescedEvents ? e.getCoalescedEvents() : [];
      const samples = coalesced.length ? coalesced : [e];
      let added = false;
      for (const s of samples) {
        const q = at(s);
        const prev = cur.pts[cur.pts.length - 1];
        if (Math.abs(q.x - prev.x) < 0.6 && Math.abs(q.y - prev.y) < 0.6) continue;
        cur.pts.push(q);
        added = true;
        if (cur.tool !== "highlighter") {
          // Cheap path: extend the line in place on the ink layer. A translucent highlighter can't
          // do this without darkening its own overlaps, so it repaints its whole stroke instead.
          ix.save();
          useDocSpace(ix);
          applyTool(ix, cur.tool);
          ix.strokeStyle = cur.color;
          ix.beginPath();
          ix.lineWidth = widthAt(cur.tool, cur.size, (prev.p + q.p) / 2);
          ix.moveTo(prev.x, prev.y);
          ix.lineTo(q.x, q.y);
          ix.stroke();
          ix.restore();
        }
      }
      if (!added) return;
      if (cur.tool === "highlighter") redraw();
      else schedule();
    });

    function endStroke() {
      if (!cur) return;
      // A tap that never moved is a dot, which is a legitimate mark; an empty stroke is not.
      if (!cur.pts.length) strokesNow().pop();
      cur = null;
      bump();
      redraw();
    }
    canvas.addEventListener("pointerup", endStroke);
    canvas.addEventListener("pointercancel", endStroke);

    /**
     * The saved file is the WHOLE notebook, not the sheet you happen to be looking at: every sheet
     * stacked into one tall PNG, each stamped with its number. The on-screen canvas only ever holds
     * one sheet, so this renders from the strokes rather than reading back what is displayed.
     */
    async function toBlob() {
      const scale = Math.min(2, Math.sqrt(MAX_BACKING / (page.w * page.h * book.length)));
      const c = renderNotebook(book, page, Math.max(1, scale), backdrop);
      const png = await new Promise((r) => c.toBlob(r, "image/png"));
      return embed(png, api.serialize());
    }

    // ---- toolbar ----
    const swatches = document.createElement("span");
    swatches.className = "draw-swatches";

    const picker = document.createElement("input");
    picker.type = "color";
    picker.className = "draw-picker";
    picker.title = "Pick any colour";
    picker.setAttribute("aria-label", "Custom colour");
    picker.addEventListener("input", () => {
      colors[tool] = picker.value;
      markSwatches();
    });

    const size = document.createElement("input");
    size.type = "range";
    size.step = "1";
    size.className = "draw-size";
    const sizeOut = document.createElement("span");
    sizeOut.className = "draw-size-out";
    size.addEventListener("input", () => {
      sizes[tool] = Number(size.value);
      sizeOut.textContent = size.value;
    });

    function markSwatches() {
      for (const b of swatches.children) b.classList.toggle("on", b.dataset.c === colors[tool]);
      picker.value = colors[tool];
    }

    /** Rebuild the palette for the current tool — highlighter colours are not pen colours. */
    function renderSwatches() {
      const inks = tool === "highlighter" ? HIGHLIGHTS : PEN_INKS;
      swatches.replaceChildren(...inks.map((c) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "draw-ink";
        b.dataset.c = c;
        b.style.background = c;
        b.setAttribute("aria-label", `Colour ${c}`);
        b.addEventListener("click", () => { colors[tool] = c; markSwatches(); });
        return b;
      }));
      markSwatches();
    }

    function selectTool(id) {
      tool = id;
      for (const [i, b] of toolButtons.entries()) b.classList.toggle("on", TOOLS[i].id === id);
      syncCursor();
      // The eraser takes a thickness but no colour, so the palette would only be misleading.
      const inkable = id !== "eraser";
      swatches.hidden = !inkable;
      picker.hidden = !inkable;
      if (inkable) renderSwatches();
      const range = RANGE[id];
      size.min = String(range.min);
      size.max = String(range.max);
      size.value = String(sizes[id]);
      size.title = range.label;
      size.setAttribute("aria-label", range.label);
      sizeOut.textContent = size.value;
    }

    const toolButtons = TOOLS.map((t) => {
      const b = button(t.label);
      b.addEventListener("click", () => selectTool(t.id));
      return b;
    });

    const undo = button("Undo");
    undo.addEventListener("click", () => {
      if (!strokesNow().length) return;
      undoneBy[current].push(strokesNow().pop());
      bump();
      redraw();
    });
    const redo = button("Redo");
    redo.addEventListener("click", () => {
      if (!undone.length) return;
      strokesNow().push(undoneBy[current].pop());
      bump();
      redraw();
    });
    const clear = button("Clear", "btn small danger");
    clear.addEventListener("click", () => {
      if (!strokesNow().length || !confirm("Clear every stroke on this sheet?")) return;
      undoneBy[current] = strokesNow().splice(0, strokesNow().length).reverse();
      bump();
      redraw();
    });

    bar.append(...toolButtons, sep(), swatches, picker, sep(), size, sizeOut, sep(), undo, redo, clear);
    selectTool("pen");

    // ---- left rail: the paper itself ----
    const zoomOut = button("−", "btn small icon");
    const zoomIn = button("+", "btn small icon");
    const zoomLabel = document.createElement("span");
    zoomLabel.className = "draw-zoom";
    const fitBtn = button("Fit", "btn small");
    const portraitBtn = button("Portrait", "btn small");
    const landscapeBtn = button("Landscape", "btn small");
    const addSheet = button("+ Sheet", "btn small");
    const delSheet = button("− Sheet", "btn small");
    const pdfBtn = button("PDF", "btn small");
    const sheetCount = document.createElement("span");
    sheetCount.className = "draw-sheets";

    function showZoom() {
      zoomLabel.textContent = `${Math.round(zoom * 100)}%`;
      fitBtn.classList.toggle("on", fitWidth);
      sheetCount.textContent = `Sheet ${current + 1} of ${book.length}`;
      const landscape = page.w > page.h;
      portraitBtn.classList.toggle("on", !landscape);
      landscapeBtn.classList.toggle("on", landscape);
      // A note always has at least one sheet; deleting the last one would leave nothing to open.
      delSheet.disabled = book.length < 2;
      delSheet.title = delSheet.disabled ? "A note keeps at least one sheet" : "Delete the sheet you are on";
    }

    /** Step through the preset zooms. Any manual step means you no longer want fit-to-width. */
    function stepZoom(dir) {
      fitWidth = false;
      const near = ZOOMS.reduce((best, z) => (Math.abs(z - zoom) < Math.abs(best - zoom) ? z : best), ZOOMS[0]);
      const i = ZOOMS.indexOf(near);
      zoom = ZOOMS[Math.min(ZOOMS.length - 1, Math.max(0, i + dir))];
      showZoom();
      layout();
    }
    zoomIn.addEventListener("click", () => stepZoom(1));
    zoomOut.addEventListener("click", () => stepZoom(-1));
    fitBtn.addEventListener("click", () => { fitWidth = true; applyFitWidth(); layout(); });

    /**
     * Re-cut this sheet to A4 in the given orientation. Strokes keep their coordinates — rotating
     * them would be a guess about what you meant — so the sheet grows taller if that is what it
     * takes to keep every mark on the paper. Nothing already drawn can fall off the bottom.
     */
    function setOrientation(landscape) {
      const next = landscape ? { w: A4.h, h: A4.w } : { w: A4.w, h: A4.h };
      if (next.w === page.w && next.h === page.h) return;
      let lowest = 0;
      for (const sheet of book) for (const s of sheet) for (const q of s.pts) if (q.y > lowest) lowest = q.y;
      page = { w: next.w, h: Math.max(next.h, Math.ceil(lowest + 1)) };
      bump();
      if (fitWidth) applyFitWidth();
      showZoom();
      layout();
    }
    portraitBtn.addEventListener("click", () => setOrientation(false));
    landscapeBtn.addEventListener("click", () => setOrientation(true));

    /** Show sheet `i`. Purely a view change — nothing is written, so it cannot lose ink. */
    function goToSheet(i) {
      if (i < 0 || i >= book.length || i === current) return;
      current = i;
      showZoom();
      renderTabs();
      redraw();
      scroller.scrollTop = 0;
    }

    addSheet.addEventListener("click", () => {
      book.splice(current + 1, 0, []); // inserted after the one you are on, not at the very end
      undoneBy.splice(current + 1, 0, []);
      current += 1;
      bump();
      showZoom();
      renderTabs();
      redraw();
      scroller.scrollTop = 0;
    });

    delSheet.addEventListener("click", () => {
      if (book.length < 2) return;
      const n = current + 1;
      if (!confirm(`Delete sheet ${n} of ${book.length}?\n\nEverything drawn on it goes with it. This is undone by leaving without saving.`)) return;
      book.splice(current, 1);
      undoneBy.splice(current, 1);
      current = Math.min(current, book.length - 1);
      bump();
      showZoom();
      renderTabs();
      redraw();
    });

    // Built from the strokes in hand, so it exports what is on screen — including sheets added since
    // the last save — and never depends on what the file is called or how many files there are.
    let exporting = false;
    pdfBtn.addEventListener("click", async () => {
      if (exporting) return;
      exporting = true;
      pdfBtn.disabled = true;
      const say = o.onStatus || (() => {});
      try {
        say(`Building a PDF of ${book.length} sheet${book.length === 1 ? "" : "s"}…`);
        const name = `${o.name || "notes"}.pdf`;
        download(await toPdf(book, page, backdrop), name);
        say(`Exported ${name} — ${book.length} page${book.length === 1 ? "" : "s"}.`);
      } catch (err) {
        say(`PDF export failed: ${err.message}`, true);
      } finally {
        exporting = false;
        pdfBtn.disabled = false;
      }
    });

    rail.append(
      zoomIn, zoomLabel, zoomOut, fitBtn,
      railSep(), portraitBtn, landscapeBtn,
      railSep(), addSheet, delSheet, sheetCount,
      railSep(), pdfBtn,
    );

    // ---- bottom tab bar: one button per sheet ----
    function renderTabs() {
      tabs.replaceChildren(...book.map((_, i) => {
        const b = button(`S${i + 1}`, "btn small");
        b.classList.toggle("on", i === current);
        b.title = `Sheet ${i + 1}`;
        b.addEventListener("click", () => goToSheet(i));
        return b;
      }));
    }

    // Bound to the surface, not the document: the note editor's textarea has its own undo stack and
    // must keep it.
    wrap.tabIndex = -1;
    wrap.addEventListener("keydown", (e) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      const key = e.key.toLowerCase();
      if (key === "z") {
        e.preventDefault();
        (e.shiftKey ? redo : undo).click();
      } else if (key === "=" || key === "+" || key === "-") {
        e.preventDefault();
        stepZoom(key === "-" ? -1 : 1);
      }
    });

    // Ctrl-wheel is the zoom gesture everywhere else; without this it zooms the whole page instead.
    scroller.addEventListener("wheel", (e) => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      stepZoom(e.deltaY < 0 ? 1 : -1);
    }, { passive: false });

    // Only the SCROLLER's width matters now — the sheet's own height is set by the page model, so a
    // resize can no longer change the document, only how much of it you can see.
    const ro = window.ResizeObserver
      ? new ResizeObserver(() => { if (fitWidth) { applyFitWidth(); layout(); } })
      : null;
    if (ro) ro.observe(scroller);
    function destroy() {
      if (ro) ro.disconnect();
    }

    applyFitWidth();
    showZoom();
    renderTabs();
    layout();
    return api;
  }

  function sep() {
    const s = document.createElement("span");
    s.className = "draw-sep";
    return s;
  }

  function railSep() {
    const s = document.createElement("span");
    s.className = "draw-rail-sep";
    return s;
  }

  return { open, readStrokes, embed, blank, encode, toPdf, A4 };
})();
