// js/main.js

// Không cho chọn chữ
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.userSelect = 'none';
  document.body.style.webkitUserSelect = 'none'; // Safari iOS
  document.body.style.msUserSelect = 'none';     // IE
});

// Hàm bật fullscreen
function requestFullscreen() {
  const el = document.documentElement;
  if (el.requestFullscreen) {
    el.requestFullscreen();
  } else if (el.webkitRequestFullscreen) {
    el.webkitRequestFullscreen(); // Safari
  } else if (el.msRequestFullscreen) {
    el.msRequestFullscreen(); // IE11
  }
}

// Double TAP (mobile) và double CLICK (desktop)
let lastTapTime = 0;

function handleDoubleTap() {
  const now = Date.now();
  const tapInterval = now - lastTapTime;

  if (tapInterval < 300 && tapInterval > 0) {
    requestFullscreen();
  }

  lastTapTime = now;
}

// Cho mobile
document.addEventListener('touchstart', handleDoubleTap);

// Cho desktop
document.addEventListener('dblclick', requestFullscreen);

