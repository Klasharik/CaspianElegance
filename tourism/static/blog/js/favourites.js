function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.substring(0, name.length + 1) === name + '=') {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function toggleFav(icon) {
  if (!icon.dataset.url) {
    showPopup();
    return;
  }

  fetch(icon.dataset.url, {
    method: 'POST',
    headers: {
      'X-CSRFToken': getCookie('csrftoken'),
    }
  })

  .then(res => res.json())
  .then(data => {
    if (data.status === 'added') {
      icon.className = icon.className.replace('bi-heart', 'bi-heart-fill');
      icon.style.color = '#ed311c';
    } else {
      icon.className = icon.className.replace('bi-heart-fill', 'bi-heart');
      icon.style.color = 'white';
    }
  });
}

function showPopup() {
  document.getElementById('fav-popup').style.display = 'block';
  document.getElementById('fav-overlay').style.display = 'block';
  document.body.style.overflow = 'hidden'; // запрещает скролл
}

function closePopup() {
  document.getElementById('fav-popup').style.display = 'none';
  document.getElementById('fav-overlay').style.display = 'none';
  document.body.style.overflow = ''; // возвращает скролл
}
