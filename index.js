document.addEventListener('DOMContentLoaded', function () {
  // Элементы видео и карусели
  const video = document.getElementById('carousel-video');
  const carousel = document.getElementById('carouselExampleCaptions');
  const muteBtn = document.getElementById('mute-btn');
  const playPauseBtn = document.getElementById('play-pause-btn');
  const navLinks = document.querySelectorAll('.nav-pills .nav-link');

  navLinks.forEach(link => {
    const tempSpan = document.createElement('span');
    tempSpan.style.visibility = 'hidden';
    tempSpan.style.position = 'absolute';
    tempSpan.style.fontSize = getComputedStyle(link).fontSize;
    tempSpan.style.fontWeight = getComputedStyle(link).fontWeight;
    tempSpan.innerText = link.innerText;
    document.body.appendChild(tempSpan);
    
    const textWidth = tempSpan.offsetWidth;
    const buttonWidth = link.offsetWidth;
    
    document.body.removeChild(tempSpan);
    
    let underlineWidthPercent = (textWidth / buttonWidth) * 100;
    link.style.setProperty('--underline-width', `${underlineWidthPercent}%`);
  });

  // Функция для обновления иконки кнопки воспроизведения/паузы
  function updatePlayPauseIcon() {
    if (video.paused) {
      playPauseBtn.querySelector('i').className = 'fa fa-play';
    } else {
      playPauseBtn.querySelector('i').className = 'fa fa-pause';
    }
  }

  // Запускаем видео, если активен видео-слайд при загрузке
  if (document.querySelector('.carousel-item.active').classList.contains('carousel-video')) {
    video.play();
    updatePlayPauseIcon();
  }

  // Управление видео при переключении слайдов
  carousel.addEventListener('slide.bs.carousel', function (e) {
    const activeSlide = e.from; // Индекс текущего слайда
    const nextSlide = e.to; // Индекс следующего слайда

    // Если уходим с видео-слайда (предполагается, что он первый, индекс 0)
    if (activeSlide === 0) {
      video.pause(); // Приостанавливаем видео
      updatePlayPauseIcon();
    }

    // Если возвращаемся на видео-слайд
    if (nextSlide === 0 && video.paused) {
      video.play(); // Возобновляем воспроизведение с текущего момента
      updatePlayPauseIcon();
    }
  });

  // Функциональность кнопок управления видео
  muteBtn.addEventListener('click', () => {
    if (video.muted) {
      video.muted = false;
      muteBtn.querySelector('i').className = 'fa fa-volume-up';
    } else {
      video.muted = true;
      muteBtn.querySelector('i').className = 'fa fa-volume-mute';
    }
  });

  playPauseBtn.addEventListener('click', () => {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
    updatePlayPauseIcon();
  });

  // Обновляем иконку при событиях play и pause
  video.addEventListener('play', updatePlayPauseIcon);
  video.addEventListener('pause', updatePlayPauseIcon);
});
