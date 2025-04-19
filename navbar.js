document.addEventListener('DOMContentLoaded', function() {
  // Mega Menu
  const megaMenuToggles = document.querySelectorAll('.mega-menu-toggle');
  const closeMegaMenuButtons = document.querySelectorAll('.close-mega-menu');
  const navbar = document.querySelector('.navbar');

  function closeAllMegaMenus() {
    document.querySelectorAll('.nav-item.show').forEach(item => {
      item.classList.remove('show');
    });
    if (navbar) {
      navbar.classList.remove('mega-open');
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
      }
    });
  });

  closeMegaMenuButtons.forEach(button => {
    button.addEventListener('click', closeAllMegaMenus);
  });

  document.addEventListener('click', function(e) {
    if (!e.target.closest('.nav-item.has-mega-menu') && 
        !e.target.classList.contains('mega-menu-toggle')) {
      closeAllMegaMenus();
    }
  });

  
  // Underline Width Logic
  const navLinks = document.querySelectorAll('.navbar .nav-link');

  function updateUnderlineWidth(link) {
    if (link.offsetParent === null) return; // Skip if the link is not visible
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
});
