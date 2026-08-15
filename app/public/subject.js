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
  const rows = (items) => items.map(({ entry, label }) => `
    <button class="file${entry.path === selectedPath ? " active" : ""}" data-path="${esc(entry.path)}" title="${esc(entry.path)}">
      <span class="glyph">${GLYPH[entry.type] || GLYPH.other}</span>
      <span class="fname">${esc(label)}</span>
      <span class="fsize">${fmtSize(entry.size)}</span>
    </button>`).join("");
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
  if (entry) select(entry);
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

async function renderPreview(entry) {
  const body = $("#preview");
  const url = fileUrl(entry.path);
  $("#preview-title").textContent = entry.name;
  $("#preview-meta").textContent = `${fmtSize(entry.size)} · ${entry.path}`;
  const open = $("#preview-open");
  open.href = url;
  open.hidden = false;
  $("#focus-chat").hidden = false;
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
        return;
      }
      if (selectedPath !== entry.path) return; // user already moved on
      if (entry.type === "markdown") {
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

function getCache(id) {
  if (!chatCache.has(id)) chatCache.set(id, { messages: [], loaded: false, busy: false, controller: null, stream: null });
  return chatCache.get(id);
}
const activeChat = () => chats.find((c) => c.id === activeChatId) ?? null;
const chatTitle = (c) => c.title || "New chat";

async function loadChats() {
  const res = await api("/chats");
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  chats = await res.json();
  if (chats.length === 0) {
    const created = await (await api("/chats", jsonOpts("POST", {}))).json();
    chats = [created];
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
  $("#chat-send").hidden = cache.busy;
  $("#chat-cancel").hidden = !cache.busy;
  $("#chat-status").textContent = cache.busy ? "Claude is working…" : "";
  $("#chat-delete").disabled = cache.busy;
  // Changing model/effort cannot affect a turn already in flight, so offering it mid-turn
  // would be a lie about what the running turn is doing.
  $("#chat-model").disabled = cache.busy;
  $("#chat-effort").disabled = cache.busy;
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
  const res = await api("/chats", jsonOpts("POST", focus ? { focus } : {}));
  if (!res.ok) { alert(`Could not create chat (HTTP ${res.status})`); return; }
  const chat = await res.json();
  chats.unshift(chat);
  await openChat(chat.id);
}

async function deleteChat() {
  const chat = activeChat();
  if (!chat || getCache(chat.id).busy) return;
  if (!confirm(`Delete "${chatTitle(chat)}"? Its history moves to the archive folder.`)) return;
  const res = await api(`/chats/${chat.id}`, { method: "DELETE" });
  if (!res.ok && res.status !== 204) { alert(`Could not delete (HTTP ${res.status})`); return; }
  chats = chats.filter((c) => c.id !== chat.id);
  chatCache.delete(chat.id);
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
      const res = await api(`/chats/${chat.id}`, jsonOpts("PATCH", { title }));
      if (res.ok) chat.title = title;
      renderSwitcher();
    }
  };
  input.onkeydown = (e) => { if (e.key === "Enter") { e.preventDefault(); finish(true); } else if (e.key === "Escape") finish(false); };
  input.onblur = () => finish(true);
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
  const busy = activeChatId ? getCache(activeChatId).busy : false;
  $("#action-context").textContent = file ? `Context: ${file.name}` : "Select a file on the left, or type a topic";
  for (const btn of document.querySelectorAll("[data-action]")) {
    const a = ACTIONS[btn.dataset.action];
    btn.disabled = busy || (a?.needs === "file" && !file);
  }
  // Close an open row when the turn starts, or when the context file changed under it — its label
  // described the old context, so leaving it open would invite typing an answer to a stale question.
  if (busy || (pendingAction && (file?.path ?? null) !== (pendingAction.file?.path ?? null))) hideActionInput();
}

// ---- wiring ----
$("#chat-switcher").addEventListener("change", (e) => openChat(e.target.value));
$("#chat-new").addEventListener("click", () => newChat());
$("#chat-rename").addEventListener("click", startRename);
$("#chat-delete").addEventListener("click", deleteChat);
$("#chat-cancel").addEventListener("click", cancelTurn);
$("#chat-model").addEventListener("change", (e) => setChatConfig("model", e.target.value));
$("#chat-effort").addEventListener("change", (e) => setChatConfig("effort", e.target.value));
$("#focus-chat").addEventListener("click", () => { if (selectedPath) newChat(selectedPath); });
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

loadChats().catch((err) => {
  $("#chat-log").innerHTML = `<p class="error">Could not load chats: ${esc(err.message)}</p>`;
});
