// Dashboard: list subjects discovered by the server.
function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

async function loadSubjects() {
  const ul = document.getElementById("subjects");
  let subjects;
  try {
    const res = await fetch("/api/subjects");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    subjects = await res.json();
  } catch (err) {
    ul.innerHTML = `<li class="empty">Could not load subjects: ${esc(err.message)}</li>`;
    return;
  }
  if (subjects.length === 0) {
    ul.innerHTML = `<li class="empty">No subjects yet — create a folder in your Studyroom directory.</li>`;
    return;
  }
  ul.innerHTML = subjects.map((s) => `
    <li class="subject">
      <a href="/subjects/${encodeURIComponent(s.name)}">
        <span class="subject-name">${esc(s.name)}</span>
        <span class="subject-meta">${s.fileCount} ${s.fileCount === 1 ? "file" : "files"}
          · ${s.hasGenerated ? '<span class="dot">●</span> has study artifacts' : "no artifacts yet"}</span>
      </a>
    </li>`).join("");
}

loadSubjects();
