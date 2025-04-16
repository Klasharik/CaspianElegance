document.addEventListener('DOMContentLoaded', function() {
  // Сохраняем ваш существующий код для навигационных вкладок
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

  // Элементы видео и карусели
  const video = document.getElementById('carousel-video');
  const muteBtn = document.getElementById('mute-btn');
  const playPauseBtn = document.getElementById('play-pause-btn');
  const carousel = document.getElementById('carouselExampleCaptions');

  // Получаем экземпляр карусели Bootstrap или создаем новый
  // Используем стандартные настройки Bootstrap для автопрокрутки фотографий
  const carouselBS = bootstrap.Carousel.getInstance(carousel) || 
                     new bootstrap.Carousel(carousel);

  // Функциональность кнопок управления видео (сохраняем ваш код)
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
      playPauseBtn.querySelector('i').className = 'fa fa-pause';
    } else {
      video.pause();
      playPauseBtn.querySelector('i').className = 'fa fa-play';
    }
  });

  video.addEventListener('play', () => {
    playPauseBtn.querySelector('i').className = 'fa fa-pause';
  });
  
  video.addEventListener('pause', () => {
    playPauseBtn.querySelector('i').className = 'fa fa-play';
  });

  let videoSlideTimer;
  
  // Функция, которая определяет длительность видео и устанавливает таймер
  function setupVideoSlideTimer() {
    // Очищаем существующий таймер, если он есть
    if (videoSlideTimer) {
      clearTimeout(videoSlideTimer);
      videoSlideTimer = null;
    }
    
    // Пауза карусели
    carouselBS.pause();
    
    // Воспроизведение видео с начала
    video.currentTime = 0;
    video.play();
    
    // Устанавливаем таймер на длительность видео
    // Если видео загружено и есть информация о длительности
    if (video.duration && !isNaN(video.duration)) {
      const videoDuration = video.duration * 1000; // Переводим в миллисекунды
      console.log('Длительность видео: ' + videoDuration + ' мс');
      
      videoSlideTimer = setTimeout(() => {
        carouselBS.next();
        carouselBS.cycle(); // Возобновляем автоматическую прокрутку
      }, videoDuration);
    } else {
      // Если длительность еще не определена, ждем события loadedmetadata
      video.addEventListener('loadedmetadata', function onceLoaded() {
        const videoDuration = video.duration * 1000; // Переводим в миллисекунды
        console.log('Длительность видео (после загрузки): ' + videoDuration + ' мс');
        
        videoSlideTimer = setTimeout(() => {
          carouselBS.next();
          carouselBS.cycle(); // Возобновляем автоматическую прокрутку
        }, videoDuration);
        
        // Удаляем обработчик события, чтобы он не срабатывал повторно
        video.removeEventListener('loadedmetadata', onceLoaded);
      });
    }
  }

  // Обработка смены слайдов карусели
  carousel.addEventListener('slide.bs.carousel', (event) => {
    // Если активен видео-слайд и мы уходим с него
    if (event.from === 0) {
      // Очищаем таймер видео-слайда
      if (videoSlideTimer) {
        clearTimeout(videoSlideTimer);
        videoSlideTimer = null;
      }
      // Приостанавливаем видео при уходе со слайда
      video.pause();
    }
  });

  // После завершения смены слайда
  carousel.addEventListener('slid.bs.carousel', (event) => {
    // Если активирован видео-слайд
    if (event.to === 0) {
      setupVideoSlideTimer();
    }
  });

  // Начальная настройка при загрузке страницы
  if (document.querySelector('.carousel-item.active').classList.contains('carousel-video')) {
    setupVideoSlideTimer();
  }
});