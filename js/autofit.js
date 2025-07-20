function autoFitText() {
  const elements = document.querySelectorAll('.autofit');
  const maxWidth = window.innerWidth * 0.95;
  const maxHeight = window.innerHeight * 0.45; // Không cao quá 45% màn hình

  elements.forEach(el => {
    let fontSize = 220;
    el.style.fontSize = fontSize + 'px';

    // Giảm dần cho đến khi vừa với cả chiều ngang và chiều cao
    while ((el.scrollWidth > maxWidth || el.offsetHeight > maxHeight) && fontSize > 20) {
      fontSize--;
      el.style.fontSize = fontSize + 'px';
    }
  });
}

window.addEventListener('load', autoFitText);
window.addEventListener('resize', autoFitText);
window.addEventListener('orientationchange', () => {
  setTimeout(autoFitText, 300);
});
