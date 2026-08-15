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

// ---- wiring ----
$("#chat-switcher").addEventListener("change", (e) => openChat(e.target.value));
$("#chat-new").addEventListener("click", () => newChat());
$("#chat-rename").addEventListener("click", startRename);
$("#chat-delete").addEventListener("click", deleteChat);
$("#chat-cancel").addEventListener("click", cancelTurn);
$("#focus-chat").addEventListener("click", () => { if (selectedPath) newChat(selectedPath); });
$("#composer").addEventListener("submit", (e) => {
  e.preventDefault();
  const input = $("#composer-input");
  const text = input.value.trim();
  if (!text || getCache(activeChatId).busy) return;
  input.value = "";
  sendMessage(text);
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
