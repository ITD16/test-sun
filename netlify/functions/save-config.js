const { json, authRequired, getRepoFile, putRepoFile, repoInfo } = require("./_utils");

function normalizeDomains(arr) {
  return Array.from(new Set(
    (Array.isArray(arr) ? arr : [])
      .map(x => String(x || "").trim().toUpperCase())
      .filter(Boolean)
  ));
}

function normalizeConfig(config) {
  return {
    enableFirework: !!config.enableFirework,
    domains1b: normalizeDomains(config.domains1b),
    domains789: normalizeDomains(config.domains789),
    domains0b: normalizeDomains(config.domains0b)
  };
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  const auth = authRequired(event);
  if (!auth.ok) return auth.response;

  try {
    const body = JSON.parse(event.body || "{}");
    const nextConfig = normalizeConfig(body.config || {});
    const { configPath, logPath } = repoInfo();

    const oldConfigFile = await getRepoFile(configPath);
    const before = JSON.parse(oldConfigFile.content || "{}");
    const after = nextConfig;

    const configContent = JSON.stringify(after, null, 2) + "\n";
    const configResult = await putRepoFile(
      configPath,
      configContent,
      `update config by ${auth.username}`,
      oldConfigFile.sha
    );

    let oldLogSha = null;
    let oldLogs = "";
    try {
      const logFile = await getRepoFile(logPath);
      oldLogSha = logFile.sha;
      oldLogs = logFile.content || "";
    } catch (err) {
      oldLogs = "";
    }

    const logLine = JSON.stringify({
      time: new Date().toISOString(),
      user: auth.username,
      action: "update_config",
      before,
      after
    });

    const newLogs = oldLogs ? `${oldLogs.trimEnd()}\n${logLine}\n` : `${logLine}\n`;

    await putRepoFile(
      logPath,
      newLogs,
      `append config log by ${auth.username}`,
      oldLogSha || undefined
    );

    return json(200, {
      ok: true,
      commitSha: configResult.commit?.sha || ""
    });
  } catch (err) {
    return json(500, { error: err.message || "Cannot save config" });
  }
};
