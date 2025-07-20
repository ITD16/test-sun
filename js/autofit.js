// src/scripts/autofit.js

function adjustFontSize() {
  const maxFontSize = 220;
  const minFontSize = 32;

  document.querySelectorAll('h1.autofit').forEach(el => {
    const textLength = el.textContent.length;
    const containerWidth = window.innerWidth;
    const baseCharWidth = 0.55;
    let fontSize = containerWidth / (textLength * baseCharWidth);
    fontSize = Math.max(minFontSize, Math.min(fontSize, maxFontSize));
    el.style.fontSize = fontSize + 'px';
  });
}

window.addEventListener('resize', adjustFontSize);
window.addEventListener('DOMContentLoaded', adjustFontSize);

