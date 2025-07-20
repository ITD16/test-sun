window.addEventListener('load', autoFitText);
window.addEventListener('resize', autoFitText);

function autoFitText() {
  const elements = document.querySelectorAll('h1.autofit');
  elements.forEach(el => {
    let fontSize = 220; // Kích thước tối đa
    el.style.fontSize = fontSize + 'px';
    el.style.whiteSpace = 'nowrap'; // Ngăn chữ xuống dòng

    const maxWidth = window.innerWidth - 40; // trừ margin/đệm

    while (el.scrollWidth > maxWidth && fontSize > 32) {
      fontSize -= 1;
      el.style.fontSize = fontSize + 'px';
    }
  });
}
