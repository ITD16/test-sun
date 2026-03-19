let originalConfig = null;

const els = {
  meBox: document.getElementById("meBox"),
  enableFirework: document.getElementById("enableFirework"),
  domains1bList: document.getElementById("domains1bList"),
  domains789List: document.getElementById("domains789List"),
  domains0bList: document.getElementById("domains0bList"),
  saveMessage: document.getElementById("saveMessage"),
  saveError: document.getElementById("saveError"),
  logsBox: document.getElementById("logsBox"),
  saveBtn: document.getElementById("saveBtn"),
  resetBtn: document.getElementById("resetBtn"),
  reloadBtn: document.getElementById("reloadBtn"),
  reloadLogsBtn: document.getElementById("reloadLogsBtn"),
  logoutBtn: document.getElementById("logoutBtn")
};

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function createDomainRow(value = "") {
  const row = document.createElement("div");
  row.className = "domain-row";

  const input = document.createElement("input");
  input.type = "text";
  input.value = value;
  input.placeholder = "Example: SUNWIN.AG";

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "danger";
  btn.textContent = "X";
  btn.addEventListener("click", () => row.remove());

  row.appendChild(input);
  row.appendChild(btn);
  return row;
}

function renderDomainList(container, items) {
  container.innerHTML = "";
  (items || []).forEach(item => container.appendChild(createDomainRow(item)));
}

function getDomainList(container) {
  return Array.from(container.querySelectorAll("input"))
    .map(x => x.value.trim().toUpperCase())
    .filter(Boolean);
}

function collectConfig() {
  return {
    enableFirework: !!els.enableFirework.checked,
    domains1b: getDomainList(els.domains1bList),
    domains789: getDomainList(els.domains789List),
    domains0b: getDomainList(els.domains0bList)
  };
}

function renderConfig(config) {
  els.enableFirework.checked = !!config.enableFirework;
  renderDomainList(els.domains1bList, config.domains1b || []);
  renderDomainList(els.domains789List, config.domains789 || []);
  renderDomainList(els.domains0bList, config.domains0b || []);
}

async function ensureMe() {
  const res = await fetch("/api/me", { credentials: "include" });
  if (!res.ok) {
    window.location.href = "/";
    return;
  }
  const data = await res.json();
  els.meBox.textContent = `User: ${data.username} (${data.role || "user"})`;
}

async function loadConfig() {
  els.saveError.textContent = "";
  els.saveMessage.textContent = "";
  const res = await fetch("/api/config", { credentials: "include" });
  if (!res.ok) {
    if (res.status === 401) {
      window.location.href = "/login.html";
      return;
    }
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Cannot load config");
  }
  const data = await res.json();
  originalConfig = data.config;
  renderConfig(originalConfig);
}

async function loadLogs() {
  els.logsBox.innerHTML = "Loading...";
  const res = await fetch("/api/logs", { credentials: "include" });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    els.logsBox.innerHTML = `<div class="error">${escapeHtml(data.error || "Cannot load logs")}</div>`;
    return;
  }

  const data = await res.json();
  const logs = Array.isArray(data.logs) ? data.logs : [];

  if (!logs.length) {
    els.logsBox.innerHTML = `<div class="muted">Chưa có log</div>`;
    return;
  }

  els.logsBox.innerHTML = logs.map(log => {
    const changesHtml = Object.entries(log.changes || {})
      .map(([key, value]) => `
        <div class="log-change">
          <div><strong>${escapeHtml(key)}</strong></div>
          <div class="log-grid">
            <div>
              <div class="muted">Before</div>
              <pre>${escapeHtml(JSON.stringify(value.before, null, 2))}</pre>
            </div>
            <div>
              <div class="muted">After</div>
              <pre>${escapeHtml(JSON.stringify(value.after, null, 2))}</pre>
            </div>
          </div>
        </div>
      `)
      .join("");

    return `
      <div class="log-item">
        <div class="log-meta">
          <strong>${escapeHtml(log.user || "unknown")}</strong>
          (${escapeHtml(log.role || "user")})
          - ${escapeHtml(log.time || "")}
        </div>
        ${changesHtml || `<div class="muted">No detail</div>`}
      </div>
    `;
  }).join("");
}

async function saveConfig() {
  els.saveError.textContent = "";
  els.saveMessage.textContent = "";

  const config = collectConfig();
  const res = await fetch("/api/config/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ config })
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    els.saveError.textContent = data.error || "Save failed";
    return;
  }

  originalConfig = config;
  els.saveMessage.textContent = `Saved ok. Commit: ${data.commitSha || ""}`;
  await loadLogs();
}

document.querySelectorAll("[data-add]").forEach(btn => {
  btn.addEventListener("click", () => {
    const key = btn.getAttribute("data-add");
    const map = {
      domains1b: els.domains1bList,
      domains789: els.domains789List,
      domains0b: els.domains0bList
    };
    map[key]?.appendChild(createDomainRow(""));
  });
});

els.saveBtn?.addEventListener("click", saveConfig);
els.resetBtn?.addEventListener("click", () => originalConfig && renderConfig(originalConfig));
els.reloadBtn?.addEventListener("click", loadConfig);
els.reloadLogsBtn?.addEventListener("click", loadLogs);
els.logoutBtn?.addEventListener("click", async () => {
  await fetch("/api/logout", { method: "POST", credentials: "include" });
  window.location.href = "/";
});

(async function init() {
  try {
    await ensureMe();
    await loadConfig();
    await loadLogs();
  } catch (err) {
    els.saveError.textContent = err.message || "Init failed";
  }
})();
