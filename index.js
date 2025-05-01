document.addEventListener('DOMContentLoaded', function () {
  //Element Selectors
  const video = document.getElementById('carousel-video');
  const carousel = document.getElementById('carouselExampleCaptions');
  const muteBtn = document.getElementById('mute-btn');
  const playPauseBtn = document.getElementById('play-pause-btn');
  const navLinks = document.querySelectorAll('.nav-pills .nav-link');

  // Carousel Initialization
  const carouselInstance = new bootstrap.Carousel(carousel, {
    interval: false,
    pause: 'hover',
    wrap: true
  });
  carousel.removeAttribute('data-bs-ride');

  //Timer and Flags
  let autoSlideTimer = null;
  const defaultImageInterval = 5000;
  let userInteracted = false;
  let userPausedVideo = false;
  let manualSlideChange = false;

  // Function to update play/pause icon based on video state
  function updatePlayPauseIcon() {
    if (video.paused) {
      playPauseBtn.querySelector('i').className = 'fa fa-play';
    } else {
      playPauseBtn.querySelector('i').className = 'fa fa-pause';
    }
  }

  // Function to safely clear the auto slide timer
  function clearAutoSlideTimer() {
    if (autoSlideTimer !== null) {
      clearTimeout(autoSlideTimer);
      autoSlideTimer = null;
    }
  }

  

  // SECTION: Auto Slide Logic
  function calculateSlideInterval(slideIndex) {
    const allSlides = carousel.querySelectorAll('.carousel-item');
    const activeItem = allSlides[slideIndex];
    if (!activeItem) {
      return defaultImageInterval;
    }

    if (activeItem.classList.contains('carousel-video')) {
      if (video.paused) {
        // If video is paused, use default interval
        return defaultImageInterval;
      } else {
        // If video is playing, calculate remaining time
        const remainingTime = Math.round((video.duration - video.currentTime) * 1000);
        return Math.max(remainingTime, 1000);
      }
    } else {
      // For image slides, use interval from data attribute or default
      const interval = parseInt(activeItem.getAttribute('data-bs-interval') || defaultImageInterval);
      return interval;
    }
  }

  // Function to start auto sliding based on current state
  function startAutoSlide() {
    clearAutoSlideTimer();
    const activeSlideIndex = Array.from(carousel.querySelectorAll('.carousel-item'))
      .findIndex(item => item.classList.contains('active'));

    // Reset flags immediately if they are active
    if (userInteracted || manualSlideChange) {
      userInteracted = false;
      manualSlideChange = false;
    }

    // Calculate interval for the current slide
    const interval = calculateSlideInterval(activeSlideIndex);

    // Set timer for transitioning to the next slide
    autoSlideTimer = setTimeout(() => {
      carouselInstance.next();
    }, interval);
  }



  // SECTION: Carousel Event Handlers
  carousel.addEventListener('slid.bs.carousel', function (e) {
    const activeItem = carousel.querySelector('.carousel-item.active');
    // If switched to video slide and user has not previously paused the video
    if (activeItem.classList.contains('carousel-video') && !userPausedVideo) {
      video.play().catch(err => {
        console.warn('Auto-play failed:', err);
      });
    }
    updatePlayPauseIcon();
    startAutoSlide();
  });

  carousel.addEventListener('slide.bs.carousel', function (e) {
    clearAutoSlideTimer();
    const fromSlide = carousel.querySelectorAll('.carousel-item')[e.from];
    // If leaving a video slide, pause the video
    if (fromSlide.classList.contains('carousel-video')) {
      video.pause();
      updatePlayPauseIcon();
    }
  });



  // SECTION: Control Buttons Handlers
  const carouselControls = carousel.querySelectorAll('.carousel-control-prev, .carousel-control-next, .carousel-indicators button');
  carouselControls.forEach(control => {
    control.addEventListener('click', () => {
      userInteracted = true;
      manualSlideChange = true;
      clearAutoSlideTimer();
    });
  });

  // Handlers for video control buttons
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
      video.play().catch(err => {
        console.warn('Playback failed:', err);
      });
      userPausedVideo = false;
    } else {
      video.pause();
      userPausedVideo = true;
    }
    updatePlayPauseIcon();
    userInteracted = true;
    clearAutoSlideTimer();
    startAutoSlide();
  });



  // SECTION: Video Event Handlers
  video.addEventListener('play', () => {
    updatePlayPauseIcon();
    if (carousel.querySelector('.carousel-item.active').classList.contains('carousel-video')) {
      clearAutoSlideTimer();
      startAutoSlide();
    }
  });

  video.addEventListener('pause', () => {
    updatePlayPauseIcon();
    if (carousel.querySelector('.carousel-item.active').classList.contains('carousel-video')) {
      clearAutoSlideTimer();
      startAutoSlide();
    }
  });

  video.addEventListener('ended', function () {
    userPausedVideo = true;
    if (carousel.querySelector('.carousel-item.active').classList.contains('carousel-video')) {
      clearAutoSlideTimer();
      carouselInstance.next();
    }
  });



  // SECTION: Video Initialization
  video.addEventListener('loadedmetadata', function () {
    video.muted = true;
    muteBtn.querySelector('i').className = 'fa fa-volume-mute';
    video.currentTime = 0;

    const activeItem = carousel.querySelector('.carousel-item.active');
    if (activeItem && activeItem.classList.contains('carousel-video') && !userPausedVideo) {
      video.play().catch(err => {
        console.warn('Auto-play failed:', err);
      });
      updatePlayPauseIcon();
      startAutoSlide();
    } else if (activeItem) {
      startAutoSlide();
    }
  });



  // SECTION: Page Visibility Handling
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      if (!video.paused) {
        video.pause();
        updatePlayPauseIcon();
      }
      clearAutoSlideTimer();
    } else {
      const activeItem = carousel.querySelector('.carousel-item.active');
      if (activeItem && activeItem.classList.contains('carousel-video') && !userInteracted && !userPausedVideo) {
        video.play().catch(err => {
          console.warn('Auto-play failed:', err);
        });
        updatePlayPauseIcon();
      }
      startAutoSlide();
    }
  });



  // SECTION: Underline Navigation Links
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


  
  // SECTION: Initial Setup
  video.muted = true;
  muteBtn.querySelector('i').className = 'fa fa-volume-mute';
  video.currentTime = 0;

  // Start auto slide if not already started after a slight delay
  setTimeout(() => {
    if (autoSlideTimer === null) {
      startAutoSlide();
    }
  }, 100);

  // Prevent conflicts on page unload
  window.addEventListener('beforeunload', function() {
    clearAutoSlideTimer();
  });
});
