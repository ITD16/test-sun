const { json, readUsers, setSessionCookie } = require("./_utils");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  try {
    const { username, password } = JSON.parse(event.body || "{}");
    const users = readUsers();

    const found = users.find(
      x => x.username === username && x.password === password && x.active !== false
    );

    if (!found) {
      return json(401, { error: "Invalid username or password" });
    }

    return json(
      200,
      {
        ok: true,
        username: found.username,
        role: found.role || "user"
      },
      {
        "Set-Cookie": setSessionCookie(found)
      }
    );
  } catch (err) {
    return json(500, { error: err.message || "Login error" });
  }
};
