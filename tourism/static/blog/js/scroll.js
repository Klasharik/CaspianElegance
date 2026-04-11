const scrollZone = document.getElementById('scrollZone');
let isDown = false;
let startX;
let scrollLeft;
let isDragging = false;
const threshold = 5; // pixels
// Mouse events
scrollZone.addEventListener('mousedown', (e) => {
  isDown = true;
  startX = e.pageX - scrollZone.offsetLeft;
  scrollLeft = scrollZone.scrollLeft;
  isDragging = false;
});
scrollZone.addEventListener('mousemove', (e) => {
  if (!isDown) return;
  const x = e.pageX - scrollZone.offsetLeft;
  const diff = Math.abs(x - startX);
  if (diff > threshold && !isDragging) {
    isDragging = true;
    scrollZone.classList.add('grabbing');
  }
  if (isDragging) {
    e.preventDefault();
    scrollZone.scrollLeft = scrollLeft - (x - startX);
  }
});
scrollZone.addEventListener('mouseup', () => {
  isDown = false;
  if (isDragging) {
    scrollZone.classList.remove('grabbing');
  }
});
scrollZone.addEventListener('mouseleave', () => {
  isDown = false;
  if (isDragging) {
    scrollZone.classList.remove('grabbing');
  }
});
// Touch events
scrollZone.addEventListener('touchstart', (e) => {
  isDown = true;
  startX = e.touches[0].pageX - scrollZone.offsetLeft;
  scrollLeft = scrollZone.scrollLeft;
  isDragging = false;
});
scrollZone.addEventListener('touchmove', (e) => {
  if (!isDown) return;
  const x = e.touches[0].pageX - scrollZone.offsetLeft;
  const diff = Math.abs(x - startX);
  if (diff > threshold && !isDragging) {
    isDragging = true;
    scrollZone.classList.add('grabbing');
  }
  if (isDragging) {
    e.preventDefault();
    scrollZone.scrollLeft = scrollLeft - (x - startX);
  }
});
scrollZone.addEventListener('touchend', () => {
  isDown = false;
  if (isDragging) {
    scrollZone.classList.remove('grabbing');
  }
});