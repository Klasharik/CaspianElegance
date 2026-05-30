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

function toggleFav(clickedIcon) {
  if (!clickedIcon.dataset.url) {
    showPopup();
    return;
  }

  const targetUrl = clickedIcon.dataset.url;

  fetch(targetUrl, {
    method: 'POST',
    headers: {
      'X-CSRFToken': getCookie('csrftoken'),
    }
  })
  .then(res => res.json())
  .then(data => {
    const sameIcons = document.querySelectorAll(`[data-url="${targetUrl}"]`);

    sameIcons.forEach(icon => {
      if (data.status === 'added') {
        // Синхронно закрашиваем сердечко везде (и в Highlights, и в Cities)
        icon.classList.remove('bi-heart');
        icon.classList.add('bi-heart-fill');
        icon.style.color = '#ed311c';
      } else {
        // Синхронно опустошаем сердечко везде
        icon.classList.remove('bi-heart-fill');
        icon.classList.add('bi-heart');
        icon.style.color = 'white';
      }
    });
  });
}

function showPopup() {
  document.getElementById('fav-popup').style.display = 'block';
  document.getElementById('fav-overlay').style.display = 'block';
  document.body.style.overflow = 'hidden'; 
}

function closePopup() {
  document.getElementById('fav-popup').style.display = 'none';
  document.getElementById('fav-overlay').style.display = 'none';
  document.body.style.overflow = ''; 
}