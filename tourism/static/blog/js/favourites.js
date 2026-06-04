// ─── CSRF ────────────────────────────────────────────────────────────────────
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

// ─── ГЛАВНАЯ СТРАНИЦА: обычный toggle ────────────────────────────────────────
function toggleFav(clickedIcon) {
    if (!clickedIcon.dataset.url) {
        showPopup();
        return;
    }

    const targetUrl = clickedIcon.dataset.url;

    fetch(targetUrl, {
        method: 'POST',
        headers: { 'X-CSRFToken': getCookie('csrftoken') }
    })
    .then(res => res.json())
    .then(data => {
        document.querySelectorAll(`[data-url="${targetUrl}"]`).forEach(icon => {
            if (data.status === 'added') {
                icon.classList.replace('bi-heart', 'bi-heart-fill');
                icon.style.color = '#ed311c';
            } else {
                icon.classList.replace('bi-heart-fill', 'bi-heart');
                icon.style.color = 'white';
            }
        });
    });
}

// ─── СТРАНИЦА ИЗБРАННОГО: мгновенный toggle с визуальной отменой ──────────────
function toggleFavOnFavPage(heartIcon) {
    const card = heartIcon.closest('.fav-item');
    const url = heartIcon.dataset.url;

    // Сразу блокируем кнопку чтобы не было двойных кликов пока идёт запрос
    heartIcon.style.pointerEvents = 'none';

    fetch(url, {
        method: 'POST',
        headers: { 'X-CSRFToken': getCookie('csrftoken') }
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === 'removed') {
            // Удалено с сервера — затемняем карточку, но не убираем со страницы
            // Пользователь видит что убрано, и может нажать снова чтобы вернуть
            card.style.opacity = '0.8';
            card.style.transition = 'opacity 0.3s';
            heartIcon.classList.replace('bi-heart-fill', 'bi-heart');
            heartIcon.style.color = '#aaa';
        } else if (data.status === 'added') {
            // Вернули обратно — восстанавливаем нормальный вид
            card.style.opacity = '1';
            heartIcon.classList.replace('bi-heart', 'bi-heart-fill');
            heartIcon.style.color = '#e74c3c';
        }
    })
    .finally(() => {
        // Разблокируем кнопку после завершения запроса
        heartIcon.style.pointerEvents = 'auto';
    });
}

// ─── ПОПАП ДЛЯ НЕАВТОРИЗОВАННЫХ ─────────────────────────────────────────────
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