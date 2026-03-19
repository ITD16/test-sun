const form = document.getElementById("loginForm");
const errBox = document.getElementById("loginError");

form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  errBox.textContent = "";

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      credentials: "include"
    });

    const data = await res.json();
    if (!res.ok) {
      errBox.textContent = data.error || "Login failed";
      return;
    }
    window.location.href = "/admin.html";
  } catch (err) {
    errBox.textContent = err.message || "Network error";
  }
});
