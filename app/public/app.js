// Dashboard: the subjects the server discovered, plus create / rename / archive.
function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

const $ = (sel) => document.querySelector(sel);
const jsonOpts = (method, body) => ({ method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body ?? {}) });

let subjects = [];

/**
 * fetch() rejects outright when the server is gone (restarted, crashed, laptop asleep). Every call
 * below fires from an event handler, so a bare rejection is unhandled and the page just sits there
 * looking like nothing happened. Turn it into a message the user can act on.
 */
async function send(url, opts) {
  try {
    return await fetch(url, opts);
  } catch (err) {
    throw new Error(`can't reach the server — is it still running? (${err.message})`);
  }
}

/** Attach to every floating async call: a failure must land in the error line, not the void. */
const guard = (p) => p.catch((err) => showError(err.message));

/** The server's own message when it sent one; a non-JSON body must not hide the status code. */
async function errorText(res) {
  try {
    return (await res.json()).error || `HTTP ${res.status}`;
  } catch {
    return `HTTP ${res.status}`;
  }
}

function showError(message) {
  const el = $("#dash-error");
  el.textContent = message || "";
  el.hidden = !message;
}

function render() {
  const ul = $("#subjects");
  if (subjects.length === 0) {
    ul.innerHTML = `<li class="empty">No subjects yet — add your first one above.</li>`;
    return;
  }
  ul.innerHTML = subjects.map((s) => `
    <li class="subject" data-name="${esc(s.name)}">
      <a href="/subjects/${encodeURIComponent(s.name)}">
        <span class="subject-name">${esc(s.name)}</span>
        <span class="subject-meta">${s.fileCount} ${s.fileCount === 1 ? "file" : "files"}
          · ${s.hasGenerated ? '<span class="dot">●</span> has study artifacts' : "no artifacts yet"}</span>
      </a>
      <span class="subject-actions">
        <button type="button" class="btn small icon" data-act="rename" title="Rename ${esc(s.name)}" aria-label="Rename ${esc(s.name)}">✎</button>
        <button type="button" class="btn small icon danger" data-act="delete" title="Archive ${esc(s.name)}" aria-label="Archive ${esc(s.name)}">🗑</button>
      </span>
    </li>`).join("");
}

async function loadSubjects() {
  try {
    const res = await send("/api/subjects");
    if (!res.ok) throw new Error(await errorText(res));
    subjects = await res.json();
  } catch (err) {
    $("#subjects").innerHTML = `<li class="empty">Could not load subjects: ${esc(err.message)}</li>`;
    return;
  }
  render();
}

async function createSubject(name) {
  showError("");
  const res = await send("/api/subjects", jsonOpts("POST", { name }));
  if (!res.ok) return showError(await errorText(res));
  $("#new-subject-name").value = "";
  await loadSubjects();
}

/** Inline rename — same idiom as the chat rename on the subject page; no modal. */
function startRename(li, name) {
  if (li.querySelector(".subject-rename")) return;
  const link = li.querySelector("a");
  const input = document.createElement("input");
  input.type = "text";
  input.className = "subject-rename";
  input.maxLength = 64;
  input.value = name;
  input.setAttribute("aria-label", `Rename ${name}`);
  link.hidden = true;
  li.prepend(input);
  input.focus();
  input.select();

  let done = false;
  const finish = async (commit) => {
    if (done) return;
    done = true;
    const next = input.value.trim();
    input.remove();
    link.hidden = false;
    if (!commit || !next || next === name) return;
    showError("");
    const res = await send(`/api/subjects/${encodeURIComponent(name)}`, jsonOpts("PATCH", { name: next }));
    if (!res.ok) return showError(await errorText(res));
    await loadSubjects();
  };
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { e.preventDefault(); guard(finish(true)); }
    if (e.key === "Escape") { e.preventDefault(); guard(finish(false)); }
  });
  input.addEventListener("blur", () => guard(finish(true)));
}

async function deleteSubject(name) {
  // One confirm, and it says where the folder goes: this is an archive-move, not a delete.
  if (!confirm(`Archive "${name}"?\n\nThe folder moves to .studyroom/archive/subjects/ with its chats — nothing is erased, and you can move it back by hand.`)) return;
  showError("");
  const res = await send(`/api/subjects/${encodeURIComponent(name)}`, { method: "DELETE" });
  if (!res.ok) return showError(await errorText(res));
  await loadSubjects();
}

$("#new-subject").addEventListener("submit", (e) => {
  e.preventDefault(); // the form has no action: an unguarded submit would reload this page
  const name = $("#new-subject-name").value.trim();
  if (name) guard(createSubject(name));
});

$("#subjects").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-act]");
  if (!btn) return;
  const li = btn.closest(".subject");
  if (!li) return;
  if (btn.dataset.act === "rename") startRename(li, li.dataset.name);
  else guard(deleteSubject(li.dataset.name));
});

loadSubjects();
