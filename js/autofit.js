// auto-fit.js
window.addEventListener('load', autoFitText);
window.addEventListener('resize', autoFitText);

function autoFitText() {
  const elements = document.querySelectorAll('h1.autofit');
  elements.forEach(el => {
    let fontSize = 220; // max size
    el.style.fontSize = fontSize + 'px';

    while (el.scrollWidth > window.innerWidth - 40 && fontSize > 32) {
      fontSize -= 2;
      el.style.fontSize = fontSize + 'px';
    }
  });
}
