(function () {
  const lineEl = document.getElementById("clock-line");

  if (!lineEl) {
    console.error("clock-line not found");
    return;
  }

  function updateClockGMT7() {
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const gmt7 = new Date(utc + 7 * 60 * 60000);

    const hh = String(gmt7.getHours()).padStart(2, "0");
    const mm = String(gmt7.getMinutes()).padStart(2, "0");
    const ss = String(gmt7.getSeconds()).padStart(2, "0");

    const dd = String(gmt7.getDate()).padStart(2, "0");
    const MM = String(gmt7.getMonth() + 1).padStart(2, "0");
    const yyyy = gmt7.getFullYear();

    // Dùng dấu "-" ngăn cách
    lineEl.textContent = `${hh}:${mm}:${ss} - ${dd}/${MM}/${yyyy}`;
  }

  updateClockGMT7();
  setInterval(updateClockGMT7, 1000);
})();
