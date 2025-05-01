document.addEventListener('DOMContentLoaded', function() {
  // SECTION: Mega Menu
  const megaMenuToggles = document.querySelectorAll('.mega-menu-toggle');
  const closeMegaMenuButtons = document.querySelectorAll('.close-mega-menu');
  const navbar = document.querySelector('.navbar');
  const backdrop = document.querySelector('.mega-menu-backdrop');

  function closeAllMegaMenus() {
    document.querySelectorAll('.nav-item.show').forEach(item => {
      item.classList.remove('show');
    });
    if (navbar) {
      navbar.classList.remove('mega-open');
    }
    if (backdrop) {
      backdrop.style.display = 'none';
    }
  }

  megaMenuToggles.forEach(toggle => {
    toggle.addEventListener('click', function(e) {
      e.preventDefault();
      
      const parentItem = this.closest('.nav-item');
      const isOpen = parentItem.classList.contains('show');
      
      closeAllMegaMenus();
      
      if (!isOpen) {
        parentItem.classList.add('show');
        if (navbar) {
          navbar.classList.add('mega-open');
        }
        if (backdrop) {
          backdrop.style.display = 'block';
        }
      }
    });
  });

  closeMegaMenuButtons.forEach(button => {
    button.addEventListener('click', closeAllMegaMenus);
  });

  if (backdrop) {
    backdrop.addEventListener('click', closeAllMegaMenus);
  }

  document.addEventListener('click', function(e) {
    if (!e.target.closest('.nav-item.has-mega-menu') && 
        !e.target.classList.contains('mega-menu-toggle')) {
      closeAllMegaMenus();
    }
  });



  // SECTION: Underline Width Logic
  const navLinks = document.querySelectorAll('.navbar .nav-link');

  function updateUnderlineWidth(link) {
    if (link.offsetParent === null) return;
    const styles = getComputedStyle(link);
    const tempSpan = document.createElement('span');

    Object.assign(tempSpan.style, {
      visibility: 'hidden',
      position: 'absolute',
      fontFamily: styles.fontFamily,
      fontSize: styles.fontSize,
      fontWeight: styles.fontWeight,
      letterSpacing: styles.letterSpacing
    });

    tempSpan.innerText = link.innerText;
    document.body.appendChild(tempSpan);

    const textWidth = tempSpan.offsetWidth;
    const linkWidth = link.offsetWidth;
    document.body.removeChild(tempSpan);

    const underlineWidthPercent = linkWidth > 0 ? (textWidth / linkWidth) * 100 : 100;
    link.style.setProperty('--text-width', `${underlineWidthPercent}%`);
  }

  navLinks.forEach(updateUnderlineWidth);

  

  // SECTION: Route Card Interactions (Where-to-go)
  document.querySelectorAll('.route-card').forEach(card => {
    const regions = card.dataset.regions?.split(',');
    if (!regions) return;

    card.addEventListener('mouseenter', () => {
      regions.forEach(regionId => {
        document.querySelectorAll(`#${regionId} .region`)
                .forEach(path => path.classList.add('highlight'));
      });
    });

    card.addEventListener('mouseleave', () => {
      regions.forEach(regionId => {
        document.querySelectorAll(`#${regionId} .region`)
                .forEach(path => path.classList.remove('highlight'));
      });
    });
  });



  // SECTION: Category Preview Animation(Things-to-do)
  const categoryColors = {
    'events-and-festivals': '#a538f7',
  };


  const links = document.querySelectorAll('.category-link');
  const wrapper = document.querySelector('.preview-wrapper');
  const badge = wrapper.querySelector('.category-badge');

  let currImg = wrapper.querySelector('img.preview-img.current-img');
  let nextImg = wrapper.querySelector('img.preview-img.next-img');
  let currText = wrapper.querySelector('.preview-text-overlay.current-text');
  let nextText = wrapper.querySelector('.preview-text-overlay.next-text');

  const imgTextDuration = '0.8s';
  const badgeDuration = '0.3s';
  const transitionTiming = 'cubic-bezier(0.4, 0, 0.2, 1)';
  
  badge.style.transition = `opacity ${badgeDuration} ${transitionTiming}, background-color ${badgeDuration} ${transitionTiming}`;
  currImg.style.transition = `opacity ${imgTextDuration} ${transitionTiming}`;
  nextImg.style.transition = `opacity ${imgTextDuration} ${transitionTiming}`;
  currText.style.transition = `opacity ${imgTextDuration} ${transitionTiming}`;
  nextText.style.transition = `opacity ${imgTextDuration} ${transitionTiming}`;
  
  currImg.style.opacity = '1';
  nextImg.style.opacity = '0';
  currText.style.opacity = '1';
  nextText.style.opacity = '0';
  badge.style.opacity = '1';
  
  let isAnimating = false;
  let badgeTimeout, badgeAppearTimeout, animationCompleteTimeout;
  
  links.forEach(link => {
    link.addEventListener('mouseenter', () => {
      if (isAnimating) return;
      
      const slug = link.dataset.slug;
      const newCategory = link.dataset.category;
      const newColor = categoryColors[slug] || 'rgba(0,0,0,0.6)';
      const imgUrl = link.dataset.img;
      const title = link.dataset.title;
      const date = link.dataset.date;
      const desc = link.dataset.desc;
      
      if (!imgUrl) return;
      
      isAnimating = true;
      
      if (badgeTimeout) clearTimeout(badgeTimeout);
      if (badgeAppearTimeout) clearTimeout(badgeAppearTimeout);
      if (animationCompleteTimeout) clearTimeout(animationCompleteTimeout);
      
      const preloadImage = new Image();
      preloadImage.src = imgUrl;
      
      preloadImage.onload = () => {
        nextImg.src = imgUrl;
        nextText.querySelector('.preview-title').textContent = title;
        nextText.querySelector('.preview-date').textContent = date;
        nextText.querySelector('.preview-desc').textContent = desc;
        
        requestAnimationFrame(() => {
          badge.style.opacity = '0';
          
          currImg.style.opacity = '0';
          currText.style.opacity = '0';
          
          setTimeout(() => {
            nextImg.style.opacity = '1';
            nextText.style.opacity = '1';
          }, 50);
          
          badgeTimeout = setTimeout(() => {
            badge.textContent = newCategory;
            badge.style.backgroundColor = newColor;
            
            badgeAppearTimeout = setTimeout(() => {
              badge.style.opacity = '1';
            }, 50);
          }, parseFloat(badgeDuration) * 1000 + 50);
          
          animationCompleteTimeout = setTimeout(() => {
            currImg.classList.remove('current-img');
            currImg.classList.add('next-img');
            nextImg.classList.remove('next-img');
            nextImg.classList.add('current-img');
            
            currText.classList.remove('current-text');
            currText.classList.add('next-text');
            nextText.classList.remove('next-text');
            nextText.classList.add('current-text');
            
            [currImg, nextImg] = [nextImg, currImg];
            [currText, nextText] = [nextText, currText];
            
            nextImg.style.opacity = '0';
            nextText.style.opacity = '0';
            
            isAnimating = false;
          }, parseFloat(imgTextDuration) * 1000 + 100);
        });
      };
      
      preloadImage.onerror = () => {
        console.error('Image loading error:', imgUrl);
        isAnimating = false;
      };
    });
  });
});
