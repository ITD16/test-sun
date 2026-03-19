let currentMe = null;

async function ensureMe() {
  const res = await fetch("/api/me", { credentials: "include" });
  if (!res.ok) {
    window.location.href = "/";
    return;
  }
  const data = await res.json();
  currentMe = data;
  els.meBox.textContent = `User: ${data.username} (${data.role || "user"})`;
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

  const isAdmin = (currentMe?.role || "user") === "admin";

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

    const adminMeta = isAdmin
      ? `
        <div class="muted">IP: ${escapeHtml(log.ip || "-")}</div>
        <div class="muted">Device: ${escapeHtml(log.deviceInfo || "-")}</div>
      `
      : "";

    return `
      <div class="log-item">
        <div class="log-meta">
          <strong>${escapeHtml(log.user || "unknown")}</strong>
          (${escapeHtml(log.role || "user")})
          - ${escapeHtml(log.time || "")}
        </div>
        ${adminMeta}
        ${changesHtml || `<div class="muted">No detail</div>`}
      </div>
    `;
  }).join("");
}
