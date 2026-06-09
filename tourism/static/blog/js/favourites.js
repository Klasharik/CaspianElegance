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
    
    // Определяем текущее состояние ДО изменения —
    // если сейчас заполнено, значит пользователь убирает лайк, и наоборот
    const isFilled = clickedIcon.classList.contains('bi-heart-fill');

    // Оптимистичное обновление — меняем иконку МГНОВЕННО, не ждём сервер.
    // Пользователь видит отклик сразу, без задержки сети
    document.querySelectorAll(`[data-url="${targetUrl}"]`).forEach(icon => {
        if (isFilled) {
            // Убираем лайк — делаем иконку пустой
            icon.classList.replace('bi-heart-fill', 'bi-heart');
            icon.style.color = 'white';
        } else {
            // Добавляем лайк — делаем иконку красной
            icon.classList.replace('bi-heart', 'bi-heart-fill');
            icon.style.color = '#ed311c';
        }
    });

    fetch(targetUrl, {
        method: 'POST',
        headers: { 'X-CSRFToken': getCookie('csrftoken') }
    })
    .then(res => {
        // Если сервер вернул ошибку — откатываем изменение обратно,
        // чтобы иконка не врала пользователю
        if (!res.ok) throw new Error('Server error');
        return res.json();
    })
    .then(data => {
        // Сервер ответил — проверяем что его ответ совпадает с тем,
        // что мы уже показали пользователю. Если нет — исправляем.
        document.querySelectorAll(`[data-url="${targetUrl}"]`).forEach(icon => {
            if (data.status === 'added') {
                icon.classList.replace('bi-heart', 'bi-heart-fill');
                icon.style.color = '#ed311c';
            } else {
                icon.classList.replace('bi-heart-fill', 'bi-heart');
                icon.style.color = 'white';
            }
        });
    })
    .catch(() => {
        // Запрос упал — откатываем иконку к исходному состоянию,
        // потому что на самом деле ничего не изменилось
        document.querySelectorAll(`[data-url="${targetUrl}"]`).forEach(icon => {
            if (isFilled) {
                // Было заполнено — возвращаем заполненное
                icon.classList.replace('bi-heart', 'bi-heart-fill');
                icon.style.color = '#ed311c';
            } else {
                // Было пустым — возвращаем пустое
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

    // Запоминаем текущее состояние ДО изменения
    const isFilled = heartIcon.classList.contains('bi-heart-fill');

    // Блокируем кнопку
    heartIcon.style.pointerEvents = 'none';

    // Меняем иконку МГНОВЕННО не дожидаясь сервера
    if (isFilled) {
        card.style.opacity = '0.8';
        card.style.transition = 'opacity 0.3s';
        heartIcon.classList.replace('bi-heart-fill', 'bi-heart');
        heartIcon.style.color = '#aaa';
    } else {
        card.style.opacity = '1';
        heartIcon.classList.replace('bi-heart', 'bi-heart-fill');
        heartIcon.style.color = '#e74c3c';
    }

    fetch(url, {
        method: 'POST',
        headers: { 'X-CSRFToken': getCookie('csrftoken') }
    })
    .then(res => res.json())
    .then(data => {
        // Если сервер вернул неожиданный результат — исправляем
        if (data.status === 'removed' && !isFilled) {
            card.style.opacity = '0.8';
            heartIcon.classList.replace('bi-heart-fill', 'bi-heart');
            heartIcon.style.color = '#aaa';
        } else if (data.status === 'added' && isFilled) {
            card.style.opacity = '1';
            heartIcon.classList.replace('bi-heart', 'bi-heart-fill');
            heartIcon.style.color = '#e74c3c';
        }
    })
    .catch(() => {
        // Откат при ошибке — возвращаем исходное состояние
        if (isFilled) {
            card.style.opacity = '1';
            heartIcon.classList.replace('bi-heart', 'bi-heart-fill');
            heartIcon.style.color = '#e74c3c';
        } else {
            card.style.opacity = '0.8';
            heartIcon.classList.replace('bi-heart-fill', 'bi-heart');
            heartIcon.style.color = '#aaa';
        }
    })
    .finally(() => {
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

window.addEventListener('beforeunload', function () {
    navigator.sendBeacon('/favourites/clear-positions/');
});
