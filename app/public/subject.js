// Subject page: file list (materials + generated) with per-type previews.
// Talks only to the HTTP API; the folder on disk is the source of truth.

const subject = decodeURIComponent(location.pathname.split("/").filter(Boolean).pop());
document.title = `${subject} · Studyroom`;
document.getElementById("crumb").textContent = subject;

const $ = (sel) => document.querySelector(sel);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// URL of a file: always built from the entry's untouched relative path (never from a display label).
const fileUrl = (relPath) => `/files/${encodeURIComponent(subject)}/${relPath.split("/").map(encodeURIComponent).join("/")}`;

function fmtSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${Math.round(bytes / 1024)} KB`;
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
}

const GLYPH = { pdf: "PDF", video: "VIDEO", markdown: "MD", html: "HTML", text: "TXT", other: "FILE" };

let entries = [];        // every listed entry (materials + generated)
let selectedPath = null; // entry.path of the previewed file

/**
 * Render a list of entries grouped by top-level folder. `stripPrefix` only affects the
 * DISPLAY label (e.g. "_generated/" so transcripts/ and digest-<topic>/ read as folders);
 * data-path always carries the real relative path.
 */
function renderList(list, mount, stripPrefix) {
  if (list.length === 0) {
    mount.innerHTML = `<p class="empty">${esc(mount.dataset.empty)}</p>`;
    return;
  }
  const groups = new Map(); // folder label ("" = root) -> [{ entry, label }]
  for (const entry of list) {
    let display = entry.path;
    if (stripPrefix && display.startsWith(stripPrefix)) display = display.slice(stripPrefix.length);
    const parts = display.split("/");
    const folder = parts.length > 1 ? `${parts[0]}/` : "";
    const label = parts.length > 1 ? parts.slice(1).join("/") : parts[0];
    if (!groups.has(folder)) groups.set(folder, []);
    groups.get(folder).push({ entry, label });
  }
  // The trailing cell carries EITHER the badge or the size, never both. In a 260px pane the badge
  // is 94px, so competing for the same row left the filename 32px — "Le…". On a video with no
  // transcript the badge is the more actionable of the two, and the exact size is still one click
  // away in the preview bar.
  const rows = (items) => items.map(({ entry, label }) => {
    const needsTranscript = entry.type === "video" && !hasTranscript(entry);
    const trailing = needsTranscript
      ? '<span class="badge" title="No transcript yet — select this video and press Transcribe">no transcript</span>'
      : `<span class="fsize">${fmtSize(entry.size)}</span>`;
    return `
    <button class="file${entry.path === selectedPath ? " active" : ""}" data-path="${esc(entry.path)}" title="${esc(entry.path)}">
      <span class="glyph">${GLYPH[entry.type] || GLYPH.other}</span>
      <span class="fname">${esc(label)}</span>
      ${trailing}
    </button>`;
  }).join("");
  const html = [];
  if (groups.has("")) html.push(rows(groups.get("")));       // root-level files first
  for (const [folder, items] of groups) {
    if (folder === "") continue;
    html.push(`<details open><summary>${esc(folder)}</summary>${rows(items)}</details>`);
  }
  mount.innerHTML = html.join("");
}

async function loadFiles() {
  const res = await fetch(`/api/subjects/${encodeURIComponent(subject)}/files`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const { materials, generated } = await res.json();
  entries = [...materials, ...generated];
  renderList(materials, $("#materials"), null);
  renderList(generated, $("#generated"), "_generated/");
}

function select(entry) {
  selectedPath = entry.path;
  for (const b of document.querySelectorAll(".file")) b.classList.toggle("active", b.dataset.path === entry.path);
  const url = new URL(location.href);
  url.searchParams.set("file", entry.path);
  history.replaceState(null, "", url);
  renderPreview(entry);
  updateActionContext(); // select() is not on the updateComposer() path — without this the
                         // action row would stay stale until an unrelated busy transition
}

document.addEventListener("click", (ev) => {
  const btn = ev.target.closest(".file");
  if (!btn) return;
  const entry = entries.find((e) => e.path === btn.dataset.path);
  if (!entry || !leaveEditor()) return; // never swap the preview out from under unsaved edits
  select(entry);
});

// marked has no sanitizer. Rendered markdown lands in the app's own origin, so strip anything
// executable first: script-like elements, on* handlers, javascript:/data: URLs. HTML files are
// never rendered inline — they go through <iframe sandbox> instead.
const DROP_TAGS = new Set(["script", "style", "iframe", "object", "embed", "link", "meta", "base", "form", "template"]);
function sanitize(html) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  for (const el of [...doc.body.querySelectorAll("*")]) {
    if (DROP_TAGS.has(el.localName.toLowerCase())) { el.remove(); continue; }
    for (const attr of [...el.attributes]) {
      const name = attr.name.toLowerCase();
      // Browsers drop ASCII tab/newline/CR (and edge controls) when parsing URLs, so
      // "java<TAB>script:" navigates as "javascript:" — compare with control chars removed.
      const value = attr.value.replace(/[\u0000-\u0020]/g, "").toLowerCase();
      if (name.startsWith("on") || name === "srcdoc" || name === "formaction" ||
          value.startsWith("javascript:") || value.startsWith("vbscript:") ||
          ((name === "href" || name === "xlink:href") && value.startsWith("data:"))) {
        el.removeAttribute(attr.name);
      }
    }
    if (el.localName === "a" && /^https?:/i.test(el.getAttribute("href") || "")) {
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener");
    }
  }
  return doc.body;
}

// ---- flashcard decks (design doc §9, M5) ----

// A deck is detected by CONTENT, not filename: the digest kit's deck is a plain "flashcards.md",
// and a deck Gregory writes by hand should work too.
const Q_LINE = /^Q:\s?/;
const A_LINE = /^A:\s?/;

/**
 * Parse Q:/A: markdown into { preamble, cards: [{q, a}] }, or null if this is not a deck.
 *
 * Line-anchored: a naive split on "Q:" would shatter any answer that merely mentions it.
 * Detection requires at least two PAIRED cards — a card whose answer is empty does not count
 * toward the gate. The looser "two Q: lines" rule was measured only against Claude-generated
 * decks, but the app now lets Gregory write his own notes, and a note jotting "Q:" twice as
 * shorthand for open questions would be silently replaced by a card list with its body hidden.
 * (Unpaired cards still RENDER, with an empty answer — a half-written deck should show.)
 */
function parseDeck(text) {
  const lines = String(text).split("\n");
  const starts = lines.reduce((acc, line, i) => (Q_LINE.test(line) ? [...acc, i] : acc), []);
  if (starts.length === 0) return null;
  const cards = starts.map((start, n) => {
    const end = starts[n + 1] ?? lines.length;
    const block = lines.slice(start, end);
    const split = block.findIndex((line, i) => i > 0 && A_LINE.test(line));
    const qLines = split < 0 ? block : block.slice(0, split);
    const aLines = split < 0 ? [] : block.slice(split);
    return {
      q: [qLines[0].replace(Q_LINE, ""), ...qLines.slice(1)].join("\n").trim(),
      a: aLines.length ? [aLines[0].replace(A_LINE, ""), ...aLines.slice(1)].join("\n").trim() : "",
    };
  });
  if (cards.filter((c) => c.q && c.a).length < 2) return null;
  return { preamble: lines.slice(0, starts[0]).join("\n").trim(), cards };
}

/** Render a parsed deck into `body` as click-to-reveal cards. No scheduling logic (§9, M5). */
function renderDeck(deck, body) {
  const wrap = document.createElement("div");
  wrap.className = "deck";

  const head = document.createElement("div");
  head.className = "deck-head";
  if (deck.preamble) {
    const intro = document.createElement("div");
    intro.className = "deck-intro prose";
    intro.append(...sanitize(marked.parse(deck.preamble)).childNodes);
    head.append(intro);
  }
  const bar = document.createElement("div");
  bar.className = "deck-bar";
  const count = document.createElement("span");
  count.className = "deck-count";
  // The PARSED count, never the header's: the eigenvalues deck says "(22 cards)" and holds 24.
  count.textContent = `${deck.cards.length} card${deck.cards.length === 1 ? "" : "s"}`;
  const revealAll = document.createElement("button");
  revealAll.type = "button";
  revealAll.className = "btn small";
  revealAll.textContent = "Reveal all";
  bar.append(count, revealAll);
  head.append(bar);

  const list = document.createElement("ol");
  list.className = "cards";
  for (const card of deck.cards) {
    const li = document.createElement("li");
    li.className = "card";
    const q = document.createElement("button");
    q.type = "button";
    q.className = "card-q";
    q.setAttribute("aria-expanded", "false");
    // parseInline, not parse: marked.parse() wraps in <p>, and a <p> inside a <button> is invalid.
    q.append(...sanitize(marked.parseInline(card.q)).childNodes);
    const a = document.createElement("div");
    a.className = "card-a prose";
    a.hidden = true;
    a.append(...sanitize(marked.parse(card.a || "_(no answer in the file)_")).childNodes);
    q.addEventListener("click", () => {
      a.hidden = !a.hidden;
      q.setAttribute("aria-expanded", String(!a.hidden));
    });
    li.append(q, a);
    list.append(li);
  }

  revealAll.addEventListener("click", () => {
    const reveal = revealAll.textContent === "Reveal all";
    for (const a of list.querySelectorAll(".card-a")) a.hidden = !reveal;
    for (const q of list.querySelectorAll(".card-q")) q.setAttribute("aria-expanded", String(reveal));
    revealAll.textContent = reveal ? "Hide all" : "Reveal all";
  });

  wrap.append(head, list);
  body.replaceChildren(wrap);
}

let currentDeck = null; // parsed deck for the previewed file, or null — set only after the fetch
let showCards = true;   // deck view vs raw markdown; one flag, persists across file selections

async function renderPreview(entry) {
  const body = $("#preview");
  const url = fileUrl(entry.path);
  currentDeck = null; // deck-ness is unknowable until the text arrives; assume not until proven
  $("#preview-title").textContent = entry.name;
  $("#preview-meta").textContent = `${fmtSize(entry.size)} · ${entry.path}`;
  const open = $("#preview-open");
  open.href = url;
  open.hidden = false;
  $("#focus-chat").hidden = false;
  // Transcribe is offered for videos only, and only when this one isn't already transcribed.
  $("#transcribe").hidden = entry.type !== "video" || hasTranscript(entry);
  body.className = `preview-body kind-${entry.type}`;

  switch (entry.type) {
    case "pdf":
      body.innerHTML = `<embed src="${esc(url)}" type="application/pdf">`;
      break;
    case "video":
      body.innerHTML = `<video controls preload="metadata" src="${esc(url)}"></video>`;
      break;
    case "html":
      body.innerHTML = `<iframe sandbox src="${esc(url)}" title="${esc(entry.name)}"></iframe>`;
      break;
    case "markdown":
    case "text": {
      body.innerHTML = `<p class="empty">Loading…</p>`;
      let text;
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        text = await res.text();
      } catch (err) {
        body.innerHTML = `<p class="error">Could not load file: ${esc(err.message)}</p>`;
        syncFileButtons(entry); // this path skips the call at the end — without it the PREVIOUS
        return;                 // file's Cards toggle stays live above an error message
      }
      if (selectedPath !== entry.path) return; // user already moved on; the newer render owns the UI
      if (entry.type === "markdown") {
        currentDeck = parseDeck(text);
        if (currentDeck && showCards) {
          renderDeck(currentDeck, body);
          break;
        }
        const article = document.createElement("article");
        article.className = "prose";
        article.append(...sanitize(marked.parse(text)).childNodes);
        body.replaceChildren(article);
      } else {
        const pre = document.createElement("pre");
        pre.textContent = text;
        body.replaceChildren(pre);
      }
      break;
    }
    default:
      body.innerHTML = `<p class="empty">No preview for this file type. <a href="${esc(url)}" download>Download ${esc(entry.name)}</a></p>`;
  }
  syncFileButtons(entry);
}

(async function init() {
  try {
    await loadFiles();
  } catch (err) {
    $("#materials").innerHTML = `<p class="error">Could not load files: ${esc(err.message)}</p>`;
    return;
  }
  const wanted = new URLSearchParams(location.search).get("file");
  const entry = wanted && entries.find((e) => e.path === wanted);
  if (entry) select(entry);
})();

// =====================================================================================
// Chats — a list of independent Claude conversations per subject (design doc §3.3, §8).
// Each turn is a POST that streams NDJSON: delta | text | tool_use | done | error.
// =====================================================================================

let chats = [];            // records from the API, newest-updated first
let activeChatId = null;
const chatCache = new Map(); // chatId → { messages: [], loaded, busy, controller, stream }

const api = (p, opts) => fetch(`/api/subjects/${encodeURIComponent(subject)}${p}`, opts);
const jsonOpts = (method, body) => ({ method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body ?? {}) });

const emptyCache = () => ({ messages: [], loaded: false, busy: false, controller: null, stream: null });

/**
 * The cache for a chat — but NEVER minting one for a chat that isn't in the list. A bucket keyed on
 * a chat that doesn't exist accepts a typed message nothing can send, and repaints #chat-log over
 * whatever error put us in that state. Membership is the test, not `id == null`: a stale id outlives
 * `chats` being emptied (deleteChat filters the list, then awaits newChat, which can throw), so a
 * null check alone would leave the same bug reachable through the second door.
 */
function getCache(id) {
  if (!chats.some((c) => c.id === id)) return emptyCache();
  if (!chatCache.has(id)) chatCache.set(id, emptyCache());
  return chatCache.get(id);
}
const activeChat = () => chats.find((c) => c.id === activeChatId) ?? null;

/**
 * Report a chat-side failure: into the open chat's log when there is one, else as a banner in the
 * log area carrying a Retry — with no chat to attach a message to, the pane would otherwise sit
 * blank. Retry is a button, per the house rule: show the error, press the button again.
 */
function chatFailure(message, { retry = null } = {}) {
  const chat = activeChat();
  if (chat) {
    getCache(chat.id).messages.push({ kind: "error", text: message });
    renderLog(true);
    return;
  }
  const log = $("#chat-log");
  log.replaceChildren();
  const banner = document.createElement("p");
  banner.className = "error chat-banner";
  banner.textContent = message;
  if (retry) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn small";
    btn.textContent = "Retry";
    btn.addEventListener("click", () => {
      log.innerHTML = `<p class="empty">Loading…</p>`;
      retry();
    });
    banner.append(" ", btn);
  }
  log.append(banner);
  updateComposer(); // the controls must show as unavailable, not merely fail when pressed
}

/**
 * Catch a floating chat operation so its failure lands in the pane instead of the console. Only for
 * the handlers that had nothing: openChat and setChatConfig already report, and setChatConfig also
 * reverts its dropdown — which a generic catch cannot do, so it is deliberately not wrapped.
 */
const chatGuard = (p, { retry = null, prefix = "Something went wrong" } = {}) =>
  p.catch((err) => chatFailure(`${prefix}: ${err.message}`, { retry }));
const chatTitle = (c) => c.title || "New chat";

async function loadChats() {
  const res = await send(`/api/subjects/${encodeURIComponent(subject)}/chats`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  chats = await res.json();
  if (chats.length === 0) {
    // This second call needs its own ok check: on a 500 the body is HTML, so .json() would throw a
    // parse error and the banner would read "Unexpected token '<'" instead of what went wrong.
    const made = await send(`/api/subjects/${encodeURIComponent(subject)}/chats`, jsonOpts("POST", {}));
    if (!made.ok) throw new Error(`HTTP ${made.status}`);
    chats = [await made.json()];
  }
  const wanted = new URLSearchParams(location.search).get("chat");
  const target = chats.find((c) => c.id === wanted) ?? chats[0];
  await openChat(target.id);
}

function renderSwitcher() {
  const sel = $("#chat-switcher");
  sel.innerHTML = chats.map((c) => `<option value="${esc(c.id)}"${c.id === activeChatId ? " selected" : ""}>${esc(chatTitle(c))}${c.focus ? " · " + esc(c.focus.split("/").pop()) : ""}</option>`).join("");
}

async function openChat(id) {
  activeChatId = id;
  const url = new URL(location.href);
  url.searchParams.set("chat", id);
  history.replaceState(null, "", url);
  renderSwitcher();
  const chat = activeChat();
  const focusEl = $("#chat-focus");
  focusEl.hidden = !chat?.focus;
  if (chat?.focus) focusEl.textContent = `Focused on ${chat.focus}`;
  const cache = getCache(id);
  if (!cache.loaded) {
    try {
      const res = await api(`/chats/${id}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const { history: lines } = await res.json();
      cache.messages = lines.map((l) => ({ kind: l.kind, text: l.text ?? "", tool: l.tool }));
      cache.loaded = true;
    } catch (err) {
      cache.messages = [{ kind: "error", text: `Could not load this chat: ${err.message}` }];
    }
  }
  renderLog(true);
  syncChatConfig();
  updateComposer();
  $("#composer-input").focus();
}

// ---- rendering ----
let renderQueued = false;
function renderLog(jump = false) {
  if (renderQueued) return;
  renderQueued = true;
  requestAnimationFrame(() => {
    renderQueued = false;
    // With no resolvable chat there is nothing to paint, and #chat-log may be holding the failure
    // banner — repainting it from an empty cache is what used to wipe the error off the screen.
    if (!activeChat()) return;
    const log = $("#chat-log");
    const nearBottom = jump || log.scrollHeight - log.scrollTop - log.clientHeight < 80;
    const cache = getCache(activeChatId);
    const parts = cache.messages.map(renderMessage);
    if (cache.stream) {
      const live = [...cache.stream.finalized, cache.stream.delta].filter(Boolean).join("\n\n");
      parts.push(`<div class="msg assistant streaming">${live ? mdToHtml(live) : '<span class="typing">Thinking…</span>'}</div>`);
    }
    if (parts.length === 0) parts.push(`<p class="empty chat-empty">Ask anything about ${esc(subject)} — Claude reads the actual files in this folder and cites pages.</p>`);
    log.innerHTML = parts.join("");
    if (nearBottom) log.scrollTop = log.scrollHeight;
  });
}

function mdToHtml(text) {
  const wrapper = document.createElement("div");
  wrapper.append(...sanitize(marked.parse(text)).childNodes);
  return wrapper.innerHTML;
}

function renderMessage(m) {
  switch (m.kind) {
    case "user": return `<div class="msg user">${esc(m.text)}</div>`;
    case "assistant": return `<div class="msg assistant">${mdToHtml(m.text)}</div>`;
    case "tool_use": return `<div class="msg tool">${esc(m.text || m.tool || "Working…")}</div>`;
    case "error": return `<div class="msg error-bubble">${esc(m.text)}</div>`;
    default: return "";
  }
}

function updateComposer() {
  const cache = getCache(activeChatId);
  const noChat = !activeChat();
  $("#chat-send").hidden = cache.busy;
  $("#chat-send").disabled = noChat;
  $("#composer-input").disabled = noChat;
  $("#chat-cancel").hidden = !cache.busy;
  $("#chat-status").textContent = cache.busy ? "Claude is working…" : "";
  $("#chat-delete").disabled = cache.busy || noChat;
  $("#chat-rename").disabled = noChat;
  // Changing model/effort cannot affect a turn already in flight, so offering it mid-turn
  // would be a lie about what the running turn is doing.
  $("#chat-model").disabled = cache.busy || noChat;
  $("#chat-effort").disabled = cache.busy || noChat;
  updateActionContext(); // covers openChat/sendMessage/finishStream, which all call this
}

/** Reflect the active chat's saved model/effort into the two selects. */
function syncChatConfig() {
  const chat = activeChat();
  $("#chat-model").value = chat?.model ?? "";
  $("#chat-effort").value = chat?.effort ?? "";
  $("#chat-model-actual").textContent = "";
}

/**
 * Persist one config field. `""` clears it back to inheriting settings.json. On failure the select
 * is reverted, so it always shows what the server actually stored rather than what was attempted.
 */
async function setChatConfig(field, value) {
  const chat = activeChat();
  if (!chat) return;
  const previous = chat[field] ?? "";
  try {
    const res = await api(`/chats/${chat.id}`, jsonOpts("PATCH", { [field]: value || null }));
    if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || `HTTP ${res.status}`);
    chat[field] = value || null;
  } catch (err) {
    $(`#chat-${field}`).value = previous;
    getCache(chat.id).messages.push({ kind: "error", text: `Could not set ${field}: ${err.message}` });
    renderLog(true);
  }
}

// ---- sending / streaming ----
async function sendMessage(text) {
  // Backstop behind the disabled composer. Keyed on activeChat(), not activeChatId: the id can be
  // non-null while resolving to nothing (a delete whose replacement never arrived), and that state
  // is exactly where a typed message used to vanish into a bucket nothing could send.
  if (!activeChat()) return;
  const id = activeChatId;
  const cache = getCache(id);
  if (cache.busy || !text.trim()) return;
  cache.busy = true;
  cache.messages.push({ kind: "user", text });
  cache.stream = { finalized: [], delta: "" };
  const controller = new AbortController();
  cache.controller = controller;
  updateComposer();
  renderLog(true);
  bumpChat(id, text);

  let res;
  try {
    res = await api(`/chats/${id}/messages`, { ...jsonOpts("POST", { message: text }), signal: controller.signal });
  } catch (err) {
    finishStream(id, err.name === "AbortError" ? "Cancelled." : `Request failed: ${err.message}`);
    return;
  }
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try { msg = (await res.json()).error || msg; } catch { /* keep */ }
    finishStream(id, msg);
    return;
  }
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      let nl;
      while ((nl = buf.indexOf("\n")) >= 0) {
        const line = buf.slice(0, nl).trim();
        buf = buf.slice(nl + 1);
        if (!line) continue;
        let ev;
        try { ev = JSON.parse(line); } catch { continue; }
        if (handleEvent(id, ev)) return; // done/error already finalised the stream
      }
    }
  } catch (err) {
    finishStream(id, err.name === "AbortError" ? "Cancelled." : `Stream interrupted: ${err.message}`);
    return;
  }
  finishStream(id, null); // stream ended without an explicit done — treat as finished
}

/** Apply one NDJSON event to the chat's cache. Returns true when the turn is over. */
function handleEvent(id, ev) {
  const cache = getCache(id);
  const s = cache.stream;
  if (!s) return true;
  switch (ev.kind) {
    case "delta": s.delta += ev.text; break;
    case "text": s.finalized.push(ev.text); s.delta = ""; break; // authoritative block: push, never wipe earlier ones
    case "tool_use": cache.messages.push({ kind: "tool_use", tool: ev.tool, text: ev.text }); break;
    // The model the CLI reports it is actually running. Shown beside the dropdown so the UI can
    // never claim a model the turn ignored — e.g. if --resume were to pin the original one.
    case "model": if (id === activeChatId) $("#chat-model-actual").textContent = `on ${ev.text}`; break;
    case "done": finishStream(id, null); return true;
    case "error": finishStream(id, ev.text || "Something went wrong."); return true;
    default: break;
  }
  if (id === activeChatId) renderLog();
  return false;
}

/** Commit the streamed text (finalized blocks only — the same join the server persists) and release. */
function finishStream(id, errorText) {
  const cache = getCache(id);
  if (!cache.busy) return;
  const full = cache.stream ? cache.stream.finalized.join("\n\n") : "";
  if (full) cache.messages.push({ kind: "assistant", text: full });
  if (errorText) cache.messages.push({ kind: "error", text: errorText });
  cache.stream = null;
  cache.busy = false;
  cache.controller = null;
  if (id === activeChatId) { renderLog(); updateComposer(); }
  // A finished turn may have written into _generated/. finishStream is synchronous, so this is a
  // deliberate floating promise — the catch keeps a transient failure from becoming an unhandled
  // rejection plus a silently stale list. Cancelled turns refresh too: Claude may already have
  // written files before the kill. renderList re-applies .active from selectedPath, so the
  // current selection survives the refresh.
  loadFiles().catch((err) => console.warn("file list refresh failed:", err.message));
}

async function cancelTurn() {
  const id = activeChatId;
  const cache = getCache(id);
  if (!cache.busy) return;
  cache.controller?.abort(); // dropping the request cancels server-side too
  try { await api(`/chats/${id}/cancel`, jsonOpts("POST", {})); } catch { /* the abort already did it */ }
  finishStream(id, "Cancelled.");
}

/** Keep the local chat list in sync: default title from the first message, move to the top. */
function bumpChat(id, firstMessage) {
  const chat = chats.find((c) => c.id === id);
  if (!chat) return;
  if (!chat.title && firstMessage) {
    const line = firstMessage.replace(/\s+/g, " ").trim();
    chat.title = line.length > 40 ? `${line.slice(0, 40).trimEnd()}…` : line;
  }
  chat.updatedAt = Date.now();
  chats.sort((a, b) => b.updatedAt - a.updatedAt);
  renderSwitcher();
}

// ---- chat management ----
async function newChat(focus = null) {
  const res = await send(`/api/subjects/${encodeURIComponent(subject)}/chats`, jsonOpts("POST", focus ? { focus } : {}));
  if (!res.ok) { chatFailure(`Could not create chat (HTTP ${res.status})`); return; }
  const chat = await res.json();
  chats.unshift(chat);
  await openChat(chat.id);
}

async function deleteChat() {
  const chat = activeChat();
  if (!chat || getCache(chat.id).busy) return;
  if (!confirm(`Delete "${chatTitle(chat)}"? Its history moves to the archive folder.`)) return;
  const res = await send(`/api/subjects/${encodeURIComponent(subject)}/chats/${chat.id}`, { method: "DELETE" });
  if (!res.ok) { chatFailure(`Could not delete (HTTP ${res.status})`); return; }
  chats = chats.filter((c) => c.id !== chat.id);
  chatCache.delete(chat.id);
  activeChatId = null; // cleared BEFORE the await: if the replacement never arrives, the guards must
                       // see "no chat" rather than an id pointing at something already deleted
  if (chats.length === 0) await newChat();
  else await openChat(chats[0].id);
}

function startRename() {
  const chat = activeChat();
  if (!chat) return;
  const input = $("#chat-rename-input"), sel = $("#chat-switcher");
  input.value = chatTitle(chat);
  sel.hidden = true; input.hidden = false; input.focus(); input.select();
  const finish = async (save) => {
    input.hidden = true; sel.hidden = false;
    const title = input.value.replace(/\s+/g, " ").trim();
    if (save && title && title !== chat.title) {
      const res = await send(`/api/subjects/${encodeURIComponent(subject)}/chats/${chat.id}`, jsonOpts("PATCH", { title }));
      if (res.ok) chat.title = title;
      else chatFailure(`Could not rename (HTTP ${res.status})`);
      renderSwitcher();
    }
  };
  input.onkeydown = (e) => { if (e.key === "Enter") { e.preventDefault(); finish(true); } else if (e.key === "Escape") finish(false); };
  input.onblur = () => finish(true);
}

// ---- transcription (design doc §6.5) ----

const transcriptPath = (videoEntry) => `_generated/transcripts/${videoEntry.name.replace(/\.[^.]+$/, "")}.md`;
/** Does this video already have a transcript in the current listing? Drives the button + badge. */
function hasTranscript(entry) {
  if (entry.type !== "video") return false;
  const want = transcriptPath(entry);
  return entries.some((e) => e.path === want);
}

let txController = null; // AbortController while a transcription streams

function showTxRow(on) {
  $("#tx-row").hidden = !on;
  $("#transcribe").disabled = on;
  if (!on) {
    $("#tx-pct").textContent = "";
    $("#tx-line").textContent = "";
    $("#tx-bar").removeAttribute("value");
  }
}

async function startTranscribe(entry) {
  if (txController) return;
  const bar = $("#tx-bar");
  showTxRow(true);
  bar.removeAttribute("value"); // valueless <progress> renders as an indeterminate bar
  $("#tx-pct").textContent = "starting…";
  txController = new AbortController();
  try {
    const res = await api("/transcribe", { ...jsonOpts("POST", { file: entry.path }), signal: txController.signal });
    if (!res.ok) {
      const msg = (await res.json().catch(() => ({}))).error || `HTTP ${res.status}`;
      $("#tx-pct").textContent = "";
      $("#tx-line").textContent = msg;
      $("#transcribe").disabled = false;
      return;
    }
    // Idempotent short-circuit: an existing transcript comes back as plain JSON, not a stream.
    if ((res.headers.get("content-type") || "").includes("application/json")) {
      await res.json();
      showTxRow(false);
      await loadFiles().catch(() => {});
      return;
    }
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buf = "";
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      let nl;
      while ((nl = buf.indexOf("\n")) >= 0) {
        const line = buf.slice(0, nl).trim();
        buf = buf.slice(nl + 1);
        if (!line) continue;
        let ev;
        try { ev = JSON.parse(line); } catch { continue; }
        if (ev.kind === "progress") {
          // pct is null when ffprobe couldn't give a duration — leave the bar indeterminate
          // rather than inventing a number.
          if (typeof ev.pct === "number") bar.value = ev.pct; else bar.removeAttribute("value");
          $("#tx-pct").textContent = typeof ev.pct === "number" ? `${ev.pct}% · ${ev.at ?? ""}` : (ev.at ?? "working…");
          $("#tx-line").textContent = ev.text ?? "";
        } else if (ev.kind === "done") {
          bar.value = 100; // completion comes from the process exiting, not from pct: Whisper
          $("#tx-pct").textContent = "100%"; // stops emitting during the silent tail (~60s on L2)
          showTxRow(false);
          await loadFiles().catch(() => {});
          const made = entries.find((e) => e.path === ev.path);
          if (made) select(made);
          return;
        } else if (ev.kind === "error") {
          $("#tx-pct").textContent = "";
          $("#tx-line").textContent = ev.text || "Transcription failed.";
          $("#transcribe").disabled = false;
          bar.removeAttribute("value");
          return;
        }
      }
    }
    showTxRow(false);
  } catch (err) {
    $("#tx-line").textContent = err.name === "AbortError" ? "Cancelled." : `Transcription failed: ${err.message}`;
    $("#transcribe").disabled = false;
  } finally {
    txController = null;
  }
}

// ---- study actions (design doc §7.2) ----

/** Local date, not toISOString() — at UTC+8 that would stamp yesterday on every evening file. */
const todayISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

/** File name or topic → slug for artifact paths: no extension, no "- handouts" tail, ≤40 chars. */
function slugify(s) {
  return String(s)
    .replace(/\.[^./]+$/, "")
    .replace(/[\s-]*handouts$/i, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40)
    .replace(/-+$/, "");
}

/** What an action targets: the previewed file, else the chat's focus file, else null. */
function actionContextFile() {
  const byPath = (p) => (p ? entries.find((e) => e.path === p) ?? null : null);
  return byPath(selectedPath) ?? byPath(activeChat()?.focus);
}

// A page range is APPENDED after the verbatim §7.2 text rather than edited into it — §0 makes the
// templates the spec. Summarize is the exception: its own template carries the slot.
const withPages = (text, pages) => (pages ? `${text} Focus on pages ${pages}.` : text);

// §7.2 templates, verbatim. `needs`: what scopes the action. `pages`: file-scoped actions that
// accept an optional PDF page range — every PDF here is 40–417 pages, all over §7.1's ~30-page
// threshold, so the affordance has to reach Digest on mml-book.pdf, not just Summarize.
const ACTIONS = {
  digest: {
    needs: "either", pages: true,
    prompt: ({ file, topic, pages, date }) => withPages(
      `Create a complete study kit for ${file ? `"${file.path}"` : topic} in _generated/digest-${slugify(file ? file.name : topic)}-${date}/ with these files: notes.md (structured summary of the material), visual.html (self-contained visual explainer per the rules: concept map of how the ideas relate, diagrams of the key mechanisms), worked-examples.md (step-by-step solved problems with the reasoning spelled out), flashcards.md (Q:/A: format), quiz.md (questions + "## Answers"). Ground everything in the actual material and tailor it to my learner profile. When done, list each file with a one-line description.`,
      pages),
  },
  summarize: {
    needs: "file", pages: true,
    prompt: ({ file, pages }) =>
      `Summarize "${file.path}"${pages ? `, pages ${pages}` : ""}. Save to _generated/ and give me the key points inline.`,
  },
  quiz: {
    needs: "either", pages: true,
    prompt: ({ file, topic, pages }) => withPages(
      `Create a 10-question quiz (mix of multiple choice and short answer) on ${file ? `"${file.path}"` : topic}. Save to _generated/. Show me the questions only; I'll answer here in chat, then you grade me against the key.`,
      pages),
  },
  flashcards: {
    needs: "either", pages: true,
    prompt: ({ file, topic, pages }) => withPages(
      `Create ~20 flashcards on ${file ? `"${file.path}"` : topic} in the Q:/A: format. Save to _generated/ and show them inline.`,
      pages),
  },
  explain: {
    needs: "topic", pages: false,
    prompt: ({ topic }) =>
      `Explain ${topic} as if preparing me for an exam: definition, intuition, one worked example from the course materials, common pitfalls. Cite where in the materials it's covered.`,
  },
  visual: {
    needs: "topic", pages: false,
    prompt: ({ topic, date }) =>
      `Create a self-contained visual explainer for ${topic} at _generated/visual-${slugify(topic)}-${date}.html. Inline CSS + inline SVG only, no JavaScript. Show the structure spatially: concept maps, flow diagrams, labeled figures. Text only where a diagram can't carry it.`,
  },
  research: {
    needs: "topic", pages: false,
    prompt: ({ topic, date }) =>
      `Research ${topic} using web search. Cross-reference what you find with the course materials where relevant, and note agreements or differences. Save a note to _generated/research-${slugify(topic)}-${date}.md with a "## Sources" section listing every URL used. Give me the key findings inline.`,
  },
};

const INPUT_LABELS = { pages: "Pages (optional), e.g. 12–30", research: "Question to research…", visual: "Topic for the explainer…", topic: "Topic or concept…" };

/**
 * What the single input row must collect, or null to send straight away. A file in context scopes
 * the action WHATEVER its type; the file's type only decides whether a page range is worth asking
 * for. (Selecting a .md transcript and pressing Quiz me must run file-scoped, not ask for a topic.)
 */
function actionNeedsInput(a, file) {
  if (a.needs === "topic") return "topic";
  if (!file) return a.needs === "either" ? "topic" : null; // "file" with no file: button is disabled
  return a.pages && file.type === "pdf" ? "pages" : null;
}

// { kind, want, file } while the input row is open. The context file is captured HERE, at the
// moment the row's label promised what it would collect, and sendAction() uses the captured pair —
// never live state. Re-deriving at submit lets a selection change made while the row is open
// reinterpret what the user typed (a topic read as a page range, or typed input silently dropped).
let pendingAction = null;

function showActionInput(kind, want, file) {
  pendingAction = { kind, want, file };
  $("#action-label").textContent = want === "pages" ? INPUT_LABELS.pages : (INPUT_LABELS[kind] ?? INPUT_LABELS.topic);
  $("#action-form").hidden = false;
  const input = $("#action-topic");
  input.value = kind === "visual" && file ? file.name.replace(/\.[^./]+$/, "") : "";
  input.focus();
  input.select();
}

function hideActionInput() {
  pendingAction = null;
  $("#action-form").hidden = true;
  $("#action-topic").value = "";
}

function runAction(kind) {
  const a = ACTIONS[kind];
  if (!a || !activeChatId) return;
  if (getCache(activeChatId).busy) return;          // backstop — the buttons are disabled while busy
  const file = actionContextFile();
  if (a.needs === "file" && !file) return;          // backstop — the button is disabled without one
  const want = actionNeedsInput(a, file);
  if (want) showActionInput(kind, want, file);
  else sendAction({ kind, want: null, file }, "");
}

/** Sends from the CAPTURED {kind, want, file} — see pendingAction. Never re-derives context. */
function sendAction({ kind, want, file }, value) {
  const a = ACTIONS[kind];
  const text = value.trim();
  if (want === "topic" && !text) return;            // required and blank: leave the row open
  const prompt = a.prompt({
    file,
    topic: want === "topic" ? text : "",
    pages: want === "pages" ? text : "",
    date: todayISO(),
  });
  hideActionInput();
  sendMessage(prompt);
}

/** Context line + button availability. Called from select() and from updateComposer(). */
function updateActionContext() {
  const file = actionContextFile();
  const noChat = !activeChat();
  const busy = noChat ? false : getCache(activeChatId).busy;
  $("#action-context").textContent = file ? `Context: ${file.name}` : "Select a file on the left, or type a topic";
  for (const btn of document.querySelectorAll("[data-action]")) {
    const a = ACTIONS[btn.dataset.action];
    // Without a chat these can only no-op, so they must not look pressable.
    btn.disabled = busy || noChat || (a?.needs === "file" && !file);
  }
  // Close an open row when the turn starts, or when the context file changed under it — its label
  // described the old context, so leaving it open would invite typing an answer to a stale question.
  if (busy || (pendingAction && (file?.path ?? null) !== (pendingAction.file?.path ?? null))) hideActionInput();
}

// =====================================================================================
// File management — upload, write, rename, archive. The app owns Gregory's materials now;
// Claude's own rules (prompts.js) are unchanged: it still only CREATES, only under _generated/.
// =====================================================================================

const EDITABLE = new Set(["markdown", "text", "html"]); // mirrors isEditable() on the server
const EDIT_MAX = 1024 * 1024;                            // a 50 MB text file has no business in a <textarea>

let editing = null; // { path, original } while the editor is open

const fileApi = (relPath, query = "") =>
  `/api/subjects/${encodeURIComponent(subject)}/files/${relPath.split("/").map(encodeURIComponent).join("/")}${query}`;

/** The server's own message when it sent one; a non-JSON body must not hide the status code. */
async function errorText(res) {
  try {
    return (await res.json()).error || `HTTP ${res.status}`;
  } catch {
    return `HTTP ${res.status}`;
  }
}

/**
 * fetch() rejects outright when the server is gone (restarted, crashed, laptop asleep) — and every
 * one of these calls is fired from an event handler, so a bare rejection is unhandled and the last
 * thing the user sees is a status line frozen on "Uploading…". Turn that into a real message.
 */
async function send(url, opts) {
  try {
    return await fetch(url, opts);
  } catch (err) {
    throw new Error(`can't reach the server — is it still running? (${err.message})`);
  }
}

/** Attach to every floating async call below: a failure must land in the status line, not the void. */
const guard = (p) => p.catch((err) => fileStatus(err.message, true));

function fileStatus(message, isError = false) {
  const el = $("#file-status");
  el.textContent = message || "";
  el.hidden = !message;
  el.classList.toggle("error", Boolean(isError));
}

const refreshFiles = () => loadFiles().catch((err) => console.warn("file list refresh failed:", err.message));

/** Which preview-bar buttons apply right now. Called at the end of every renderPreview(). */
function syncFileButtons(entry) {
  const open = Boolean(editing);
  // Deck-ness is not a property of `entry` (a listing row carries no text), so this reads the
  // module-level currentDeck that the markdown branch publishes after its fetch.
  const cards = $("#cards-toggle");
  cards.hidden = open || !currentDeck;
  cards.textContent = showCards ? "Markdown" : "Cards";
  cards.title = showCards ? "Show the raw markdown instead" : "Show these Q:/A: pairs as cards";
  $("#file-edit").hidden = open || !entry || !EDITABLE.has(entry.type);
  $("#file-save").hidden = !open;
  $("#file-edit-cancel").hidden = !open;
  $("#file-rename").hidden = open || !entry;
  $("#file-delete").hidden = open || !entry;
  if (open) {
    // While the editor is up, every action that reads the file off disk would read a stale copy.
    $("#transcribe").hidden = true;
    $("#focus-chat").hidden = true;
    $("#preview-open").hidden = true;
  }
}

/** True if it is safe to leave the editor — closes it, asking first only when the text changed. */
function leaveEditor() {
  if (!editing) return true;
  const ta = $("#preview .editor");
  if (ta && ta.value !== editing.original && !confirm("Discard your unsaved changes?")) return false;
  editing = null;
  return true;
}

async function uploadFiles(fileList) {
  const files = [...fileList];
  if (files.length === 0) return;
  const failed = [];
  const kept = [];
  let ok = 0;
  for (const [i, file] of files.entries()) {
    fileStatus(`Uploading ${file.name} (${i + 1}/${files.length})…`);
    // The raw File IS the body — no multipart, and the browser streams it, so a 350 MB lecture
    // never lands in memory on either end. One file's failure must not abandon the rest of the drop.
    try {
      let res = await send(fileApi(file.name), { method: "PUT", body: file });
      // Dropping a corrected copy of a handout you already have is an ordinary thing to do, and
      // "archive the old one first" is a silly detour — so offer the replacement here. Keyed on
      // `code`, because the other 409 on this route means the file is mid-transcription.
      if (res.status === 409 && (await res.clone().json().catch(() => ({}))).code === "exists") {
        if (!confirm(`"${file.name}" is already in ${subject}.\n\nReplace it with the file you just dropped? The current one is not kept.`)) {
          kept.push(file.name);
          continue;
        }
        res = await send(fileApi(file.name, "?overwrite=1"), { method: "PUT", body: file });
      }
      if (res.ok) ok += 1;
      else failed.push(`${file.name}: ${await errorText(res)}`);
    } catch (err) {
      failed.push(`${file.name}: ${err.message}`);
    }
  }
  await refreshFiles();
  // Report every outcome: a 4-file drop with 3 uploads and 1 duplicate used to show only the error,
  // so the three that landed looked like they hadn't.
  const parts = [];
  if (ok) parts.push(`Uploaded ${ok} file${ok === 1 ? "" : "s"}.`);
  if (kept.length) parts.push(`kept the existing ${kept.join(", ")}`);
  parts.push(...failed);
  fileStatus(parts.join(" · "), failed.length > 0);
}

async function createFile(rawName) {
  const name = /\.[^.]+$/.test(rawName) ? rawName : `${rawName}.md`; // a note without an extension is markdown
  const res = await send(fileApi(name), { method: "PUT", headers: { "Content-Type": "text/plain" }, body: "" });
  if (!res.ok) return fileStatus(await errorText(res), true);
  fileStatus("");
  $("#new-file").hidden = true;
  $("#new-file-name").value = "";
  await refreshFiles();
  const entry = entries.find((e) => e.path === name);
  if (entry) {
    select(entry);
    openEditor(entry); // a new note opens straight into the editor — that is the point of it
  }
}

async function openEditor(entry) {
  if (!EDITABLE.has(entry.type)) return;
  if (entry.size > EDIT_MAX) return fileStatus(`${entry.name} is too large to edit here (${fmtSize(entry.size)}).`, true);
  let text;
  try {
    const res = await send(fileUrl(entry.path));
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    text = await res.text();
  } catch (err) {
    return fileStatus(`Could not open ${entry.name}: ${err.message}`, true);
  }
  editing = { path: entry.path, original: text };
  const ta = document.createElement("textarea");
  ta.className = "editor";
  ta.spellcheck = false;
  ta.value = text;
  const body = $("#preview");
  body.className = "preview-body kind-editor";
  body.replaceChildren(ta);
  syncFileButtons(entry);
  ta.focus();
}

async function saveEditor() {
  const ta = $("#preview .editor");
  if (!editing || !ta) return;
  const res = await send(fileApi(editing.path, "?overwrite=1"), {
    method: "PUT",
    headers: { "Content-Type": "text/plain; charset=utf-8" },
    body: ta.value,
  });
  if (!res.ok) return fileStatus(await errorText(res), true);
  const path = editing.path;
  editing = null;
  await refreshFiles();
  const entry = entries.find((e) => e.path === path);
  if (entry) renderPreview(entry);
  fileStatus("Saved.");
}

function startFileRename() {
  const entry = entries.find((e) => e.path === selectedPath);
  if (!entry || editing) return;
  const input = $("#file-rename-input");
  const title = $("#preview-title");
  input.value = entry.name;
  input.hidden = false;
  title.hidden = true;
  input.focus();
  input.select();

  let done = false;
  const finish = async (commit) => {
    if (done) return;
    done = true;
    input.hidden = true;
    title.hidden = false;
    const next = input.value.trim();
    if (!commit || !next || next === entry.name) return;
    // Only the last segment changes — renaming must not move a file out of its folder.
    const parts = entry.path.split("/");
    parts[parts.length - 1] = next;
    const res = await send(fileApi(entry.path), jsonOpts("PATCH", { path: parts.join("/") }));
    if (!res.ok) return fileStatus(await errorText(res), true);
    const updated = await res.json();
    await refreshFiles();
    const moved = entries.find((e) => e.path === updated.path);
    if (moved) select(moved);
    fileStatus("");
  };
  input.onkeydown = (e) => {
    if (e.key === "Enter") { e.preventDefault(); guard(finish(true)); }
    if (e.key === "Escape") { e.preventDefault(); guard(finish(false)); }
  };
  input.onblur = () => guard(finish(true));
}

function clearPreview() {
  selectedPath = null;
  const body = $("#preview");
  body.className = "preview-body";
  body.innerHTML = `<p class="empty">Pick a file on the left — PDFs, lecture videos, notes and generated study kits all preview here.</p>`;
  $("#preview-title").textContent = "Preview";
  $("#preview-meta").textContent = "";
  for (const id of ["#preview-open", "#focus-chat", "#transcribe"]) $(id).hidden = true;
  syncFileButtons(null);
  updateActionContext();
}

async function deleteFile() {
  const entry = entries.find((e) => e.path === selectedPath);
  if (!entry || editing) return;
  if (!confirm(`Archive "${entry.name}"?\n\nIt moves to .studyroom/archive/files/ — nothing is erased, and you can move it back by hand.`)) return;
  const res = await send(fileApi(entry.path), { method: "DELETE" });
  if (!res.ok) return fileStatus(await errorText(res), true);
  await refreshFiles();
  clearPreview();
  fileStatus(`Archived ${entry.name}.`);
}

// ---- wiring ----
$("#file-add").addEventListener("click", () => $("#file-input").click());
$("#file-input").addEventListener("change", (e) => {
  guard(uploadFiles(e.target.files));
  e.target.value = ""; // so re-picking the same file fires 'change' again
});
$("#file-new").addEventListener("click", () => {
  const form = $("#new-file");
  form.hidden = !form.hidden;
  if (!form.hidden) $("#new-file-name").focus();
});
$("#new-file").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = $("#new-file-name").value.trim();
  if (name) guard(createFile(name));
});
$("#new-file-cancel").addEventListener("click", () => { $("#new-file").hidden = true; fileStatus(""); });
$("#new-file-name").addEventListener("keydown", (e) => {
  if (e.key === "Escape") { e.preventDefault(); $("#new-file").hidden = true; }
});
$("#file-edit").addEventListener("click", () => {
  const entry = entries.find((e) => e.path === selectedPath);
  if (entry) guard(openEditor(entry));
});
$("#file-save").addEventListener("click", () => guard(saveEditor()));
$("#file-edit-cancel").addEventListener("click", () => {
  const path = editing?.path;
  if (!leaveEditor()) return;
  const entry = entries.find((e) => e.path === path);
  if (entry) renderPreview(entry);
  fileStatus("");
});
$("#cards-toggle").addEventListener("click", () => {
  showCards = !showCards;
  const entry = entries.find((e) => e.path === selectedPath);
  if (entry) renderPreview(entry);
});
$("#file-rename").addEventListener("click", startFileRename);
$("#file-delete").addEventListener("click", () => guard(deleteFile()));

// Drag-and-drop — the Finder-adjacent gesture, same upload path as the button.
// Bound to the DOCUMENT, not just the file pane: an unhandled drop anywhere else makes the browser
// NAVIGATE to the dropped file, throwing away the page and whatever chat was on screen. Missing a
// 260px target by a few pixels should not cost you your session, so the whole page accepts files
// and the pane just shows where they will land.
const dropPane = $(".pane-left");
const dragHasFiles = (e) => [...(e.dataTransfer?.types ?? [])].includes("Files");
document.addEventListener("dragover", (e) => {
  if (!dragHasFiles(e)) return;
  e.preventDefault();
  dropPane.classList.add("dropping");
});
document.addEventListener("dragleave", (e) => {
  if (!e.relatedTarget) dropPane.classList.remove("dropping"); // null = the pointer left the window
});
document.addEventListener("drop", (e) => {
  if (!dragHasFiles(e)) return;
  e.preventDefault();
  dropPane.classList.remove("dropping");
  if (e.dataTransfer.files.length) guard(uploadFiles(e.dataTransfer.files));
});

// A note editor that loses work on a stray Cmd-R is not a note editor. Only speaks up when dirty.
addEventListener("beforeunload", (e) => {
  const ta = $("#preview .editor");
  if (editing && ta && ta.value !== editing.original) e.preventDefault();
});

$("#chat-switcher").addEventListener("change", (e) => openChat(e.target.value));
// openChat and setChatConfig handle their own failures (setChatConfig reverts the dropdown, which a
// generic catch could not do), so only these three are wrapped.
$("#chat-new").addEventListener("click", () => chatGuard(newChat(), { prefix: "Could not create chat" }));
$("#chat-rename").addEventListener("click", startRename);
$("#chat-delete").addEventListener("click", () => chatGuard(deleteChat(), { prefix: "Could not delete chat" }));
$("#chat-cancel").addEventListener("click", cancelTurn);
$("#chat-model").addEventListener("change", (e) => setChatConfig("model", e.target.value));
$("#chat-effort").addEventListener("change", (e) => setChatConfig("effort", e.target.value));
$("#focus-chat").addEventListener("click", () => { if (selectedPath) newChat(selectedPath); });
$("#transcribe").addEventListener("click", () => {
  const entry = entries.find((e) => e.path === selectedPath);
  if (entry) startTranscribe(entry);
});
$("#tx-cancel").addEventListener("click", () => txController?.abort());
$("#composer").addEventListener("submit", (e) => {
  e.preventDefault();
  const input = $("#composer-input");
  const text = input.value.trim();
  if (!text || getCache(activeChatId).busy) return;
  input.value = "";
  sendMessage(text);
});
$(".action-buttons").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-action]");
  if (btn && !btn.disabled) runAction(btn.dataset.action);
});
$("#action-form").addEventListener("submit", (e) => {
  e.preventDefault(); // the form has no action attribute: an unguarded submit would GET this URL
                      // with the query string replaced, dropping ?file= and ?chat= and reloading
  if (pendingAction) sendAction(pendingAction, $("#action-topic").value);
});
$("#action-cancel").addEventListener("click", hideActionInput);
$("#action-topic").addEventListener("keydown", (e) => {
  if (e.key === "Escape") { e.preventDefault(); hideActionInput(); }
});
$("#composer-input").addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey && !e.isComposing) {
    e.preventDefault();
    $("#composer").requestSubmit();
  }
});

const bootChats = () => chatGuard(loadChats(), { retry: bootChats, prefix: "Could not load chats" });
bootChats();
