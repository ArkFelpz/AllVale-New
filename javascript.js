class AnimationManager {
  constructor() {
    this.animatedElements = new Set();
    this.intersectionObserver = null;
    this.init();
  }

  init() {
    this.setupScrollAnimations();
    this.setupHoverAnimations();
    this.setupClickAnimations();
    this.setupAutoAnimations();
  }

  setupScrollAnimations() {
    const observerOptions = {
      threshold: [0.1, 0.3, 0.5],
      rootMargin: '0px 0px -100px 0px'
    };

    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.1) {
          const element = entry.target;
          const animationType = this.getAnimationType(element);

          if (animationType) {
            const delay = this.calculateDelay(element, entry);

            setTimeout(() => {
              this.triggerAnimation(element, animationType);
            }, delay);

            this.intersectionObserver.unobserve(element);
          }
        }
      });
    }, observerOptions);

    const revealSelectors = [
      '.reveal', '.reveal-left', '.reveal-right', '.reveal-scale',
      '.reveal-bounce', '.reveal-slide-bounce', '.reveal-scale-bounce',
      '.reveal-fade-slide', '.reveal-rotate', '.reveal-flip'
    ];

    revealSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        this.intersectionObserver.observe(el);
      });
    });
  }

  calculateDelay(element, entry) {
    const rect = entry.boundingClientRect;
    const viewportHeight = window.innerHeight;
    const isMobile = window.innerWidth <= 768;

    const distanceFromTop = rect.top;
    const normalizedDistance = Math.max(0, Math.min(1, distanceFromTop / viewportHeight));

    const delayClass = Array.from(element.classList).find(cls => cls.startsWith('reveal-delay-'));
    const classDelay = delayClass ? parseInt(delayClass.split('-')[2]) * (isMobile ? 50 : 100) : 0;

    let elementDelay = 0;
    if (element.classList.contains('product-card')) elementDelay = isMobile ? 50 : 100;
    else if (element.classList.contains('testimonial-card')) elementDelay = isMobile ? 75 : 150;
    else if (element.classList.contains('gallery-item')) elementDelay = isMobile ? 40 : 80;

    const baseDelay = isMobile ? 100 : 200;

    return normalizedDistance * baseDelay + classDelay + elementDelay;
  }

  getAnimationType(element) {
    const animationClasses = [
      'reveal-bounce', 'reveal-slide-bounce', 'reveal-scale-bounce',
      'reveal-fade-slide', 'reveal-rotate', 'reveal-flip',
      'reveal-left', 'reveal-right', 'reveal-scale', 'reveal'
    ];

    for (const animationClass of animationClasses) {
      if (element.classList.contains(animationClass)) {
        return animationClass;
      }
    }

    return null;
  }

  triggerAnimation(element, type) {
    element.classList.add('active');
    this.animatedElements.add(element);

    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.log(`Animação ativada: ${type}`, element);
    }

    if (element.onAnimationStart && typeof element.onAnimationStart === 'function') {
      element.onAnimationStart(type);
    }

    const event = new CustomEvent('animationStart', {
      detail: { element, type }
    });
    element.dispatchEvent(event);
  }

  setupHoverAnimations() {
    const hoverElements = document.querySelectorAll('[class*="hover-"]');

    hoverElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        const hoverClass = Array.from(element.classList).find(cls => cls.startsWith('hover-'));
        if (hoverClass) {
          element.classList.add('hover-active');
        }
      });

      element.addEventListener('mouseleave', () => {
        element.classList.remove('hover-active');
      });
    });
  }

  setupClickAnimations() {
    const clickElements = document.querySelectorAll('[data-animation]');

    clickElements.forEach(element => {
      element.addEventListener('click', (e) => {
        e.preventDefault();
        const animationType = element.getAttribute('data-animation');
        this.animateElement(element, animationType);
      });
    });
  }

  setupAutoAnimations() {

    const autoElements = document.querySelectorAll('.auto-animate');

    autoElements.forEach((element, index) => {
      setTimeout(() => {
        const animationType = element.getAttribute('data-animation') || 'fadeInUp';
        this.animateElement(element, animationType);
      }, index * 200); 
    });
  }

  animateElement(element, animationType, duration = 1000) {
    if (this.animatedElements.has(element)) return;

    element.classList.remove('animate');
    Array.from(element.classList).forEach(cls => {
      if (cls.startsWith('fade') || cls.startsWith('slide') || cls.startsWith('zoom') || 
          cls.startsWith('bounce') || cls.startsWith('flip') || cls.startsWith('rotate')) {
        element.classList.remove(cls);
      }
    });

    element.classList.add('animate', animationType);
    this.animatedElements.add(element);

    setTimeout(() => {
      element.classList.remove('animate', animationType);
    }, duration);
  }

  animateSequence(elements, animationType, delay = 200) {
    elements.forEach((element, index) => {
      setTimeout(() => {
        this.animateElement(element, animationType);
      }, index * delay);
    });
  }

  animateGrid(container, animationType, delay = 100) {
    const items = container.querySelectorAll('.product-card, .testimonial-card, .gallery-item');
    this.animateSequence(Array.from(items), animationType, delay);
  }
}

const AnimationUtils = {

  animateSection: (selector, animationType = 'fadeInUp') => {
    const section = document.querySelector(selector);
    if (section) {
      section.classList.add('animate', animationType);
    }
  },

  animateCards: (selector, animationType = 'fadeInUp', delay = 200) => {
    const cards = document.querySelectorAll(selector);
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('animate', animationType);
      }, index * delay);
    });
  },

  animateText: (element, text, delay = 50) => {
    element.textContent = '';
    let index = 0;
    const interval = setInterval(() => {
      element.textContent += text[index];
      index++;
      if (index >= text.length) {
        clearInterval(interval);
      }
    }, delay);
  },

  animateNumber: (element, targetNumber, duration = 2000) => {
    const startNumber = 0;
    const increment = targetNumber / (duration / 16);
    let currentNumber = startNumber;

    const timer = setInterval(() => {
      currentNumber += increment;
      if (currentNumber >= targetNumber) {
        currentNumber = targetNumber;
        clearInterval(timer);
      }
      element.textContent = Math.floor(currentNumber);
    }, 16);
  },

  setupParallax: () => {
    const parallaxElements = document.querySelectorAll('[data-parallax]');

    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;

      parallaxElements.forEach(element => {
        const rate = scrolled * element.getAttribute('data-parallax');
        element.style.transform = `translateY(${rate}px)`;
      });
    });
  }
};

class MobileResponsiveManager {
  constructor() {
    this.isMobile = window.innerWidth <= 768;
    this.isTablet = window.innerWidth <= 1024 && window.innerWidth > 768;
    this.isPortrait = window.innerHeight > window.innerWidth;
    this.init();
  }

  init() {
    this.setupViewportMeta();
    this.setupTouchEvents();
    this.setupOrientationChange();
    this.setupScrollOptimization();
    this.adjustForMobile();
  }

  setupViewportMeta() {

    let viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.name = 'viewport';
      document.head.appendChild(viewport);
    }
    viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
  }

  setupTouchEvents() {

    if (this.isMobile) {

      const buttons = document.querySelectorAll('button, .btn-whatsapp, .cta-button');
      buttons.forEach(button => {
        button.addEventListener('touchstart', (e) => {
          e.preventDefault();
        }, { passive: false });
      });

      document.documentElement.style.scrollBehavior = 'smooth';
    }
  }

  setupOrientationChange() {
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        this.adjustForMobile();
        this.handleOrientationChange();
      }, 100);
    });
  }

  setupScrollOptimization() {
    if (this.isMobile) {
      let ticking = false;

      const optimizeScroll = () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            this.handleScroll();
            ticking = false;
          });
          ticking = true;
        }
      };

      window.addEventListener('scroll', optimizeScroll, { passive: true });
    }
  }

  handleScroll() {

    const header = document.querySelector('header');
    if (header && this.isMobile) {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    const animatedElements = document.querySelectorAll('.animate, .reveal');
    animatedElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

      if (isVisible && !el.classList.contains('animated')) {
        el.classList.add('animated');
      }
    });
  }

  handleOrientationChange() {

    this.isPortrait = window.innerHeight > window.innerWidth;

    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
      heroSection.style.minHeight = this.isPortrait ? '500px' : '400px';
    }
  }

  adjustForMobile() {
    this.isMobile = window.innerWidth <= 768;
    this.isTablet = window.innerWidth <= 1024 && window.innerWidth > 768;

    if (this.isMobile) {
      document.body.style.paddingTop = '60px';
    } else {
      document.body.style.paddingTop = '0';
    }

    this.adjustFontSizes();

    this.adjustSpacing();
  }

  adjustFontSizes() {
    const baseFontSize = this.isMobile ? 14 : 16;
    document.documentElement.style.fontSize = `${baseFontSize}px`;
  }

  adjustSpacing() {

    if (this.isMobile) {
      const sections = document.querySelectorAll('section');
      sections.forEach(section => {
        section.style.scrollMarginTop = '70px';
      });
    }
  }

  isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || this.isMobile;
  }

  isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }
}

document.addEventListener('DOMContentLoaded', () => {

  window.mobileManager = new MobileResponsiveManager();

  window.animationManager = new AnimationManager();

  AnimationUtils.setupParallax();

  setupSiteAnimations();

  setupTestimonialsCarousel();

  window.addEventListener('resize', () => {
    if (window.mobileManager) {
      window.mobileManager.adjustForMobile();
    }
  });
});

function setupSiteAnimations() {

  setTimeout(() => {
    AnimationUtils.animateSection('.hero-title', 'fadeInDown');
    AnimationUtils.animateSection('.hero-subtitle', 'fadeInUp');
    AnimationUtils.animateSection('.hero-button', 'bounceIn');
  }, 500);

  const productObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        AnimationUtils.animateCards('.product-card', 'fadeInUp', 200);
        productObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  const productsSection = document.querySelector('.products-section');
  if (productsSection) {
    productObserver.observe(productsSection);
  }

  const testimonialObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        AnimationUtils.animateCards('.testimonial-card', 'slideInUp', 150);
        testimonialObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  const testimonialsSection = document.querySelector('.testimonials-section');
  if (testimonialsSection) {
    testimonialObserver.observe(testimonialsSection);
  }

  const galleryObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        AnimationUtils.animateCards('.gallery-item', 'zoomIn', 100);
        galleryObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  const gallerySection = document.querySelector('.gallery-section');
  if (gallerySection) {
    galleryObserver.observe(gallerySection);
  }
}

function setupTestimonialsCarousel() {
  const carousel = document.querySelector('.testimonials-carousel');
  if (!carousel) return;

  const track = carousel.querySelector('.carousel-track');
  const items = carousel.querySelectorAll('.carousel-item');
  const prevBtn = carousel.querySelector('.carousel-prev');
  const nextBtn = carousel.querySelector('.carousel-next');
  const indicators = document.querySelectorAll('.indicator');

  let currentIndex = 1; 

  function updateCarousel() {
    const translateX = -currentIndex * 100;
    track.style.transform = `translateX(${translateX}%)`;

    items.forEach((item, index) => {
      item.classList.toggle('active', index === currentIndex);
    });

    indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === currentIndex);
    });
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % items.length;
    updateCarousel();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    updateCarousel();
  }

  function goToSlide(index) {
    currentIndex = index;
    updateCarousel();
  }

  if (nextBtn) nextBtn.addEventListener('click', nextSlide);
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);

  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => goToSlide(index));
  });

  let autoPlayInterval = setInterval(nextSlide, 5000);

  carousel.addEventListener('mouseenter', () => {
    clearInterval(autoPlayInterval);
  });

  carousel.addEventListener('mouseleave', () => {
    autoPlayInterval = setInterval(nextSlide, 5000);
  });

  updateCarousel();
}

function toggleReadMore(button) {
  const testimonialText = button.previousElementSibling;
  const isExpanded = testimonialText.classList.contains('expanded');

  if (isExpanded) {
    testimonialText.classList.remove('expanded');
    button.textContent = 'Ler mais';
    button.classList.remove('expanded');
  } else {
    testimonialText.classList.add('expanded');
    button.textContent = 'Ler menos';
    button.classList.add('expanded');
  }
}

class ExclusivePopupManager {
  constructor() {
    this.badge = document.getElementById('exclusive-badge');
    this.popup = document.getElementById('exclusive-popup');
    this.closeBtn = document.getElementById('popup-close');
    this.isOpen = false;
    this.hoverTimeout = null;
    this.init();
  }

  init() {
    if (!this.badge || !this.popup) return;

    this.setupEventListeners();
    this.setupKeyboardNavigation();
    this.setupMobileSupport();
  }

  setupEventListeners() {

    this.badge.addEventListener('mouseenter', () => {
      this.clearHoverTimeout();
      this.hoverTimeout = setTimeout(() => {
        this.openPopup();
      }, 300); 
    });

    this.badge.addEventListener('mouseleave', () => {
      this.clearHoverTimeout();
      this.hoverTimeout = setTimeout(() => {
        this.closePopup();
      }, 500); 
    });

    this.popup.addEventListener('mouseenter', () => {
      this.clearHoverTimeout();
    });

    this.popup.addEventListener('mouseleave', () => {
      this.hoverTimeout = setTimeout(() => {
        this.closePopup();
      }, 200);
    });

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.closePopup();
      });
    }

    this.badge.addEventListener('click', (e) => {
      e.preventDefault();
      if (this.isOpen) {
        this.closePopup();
      } else {
        this.openPopup();
      }
    });
  }

  setupKeyboardNavigation() {

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.closePopup();
      }
    });
  }

  setupMobileSupport() {

    const isMobile = window.innerWidth <= 768;

    if (isMobile) {

      this.badge.style.cursor = 'pointer';
    }
  }

  openPopup() {
    if (this.isOpen) return;

    this.isOpen = true;
    this.popup.classList.add('show');

    this.animatePopupItems();

    document.body.style.overflow = 'hidden';

    this.popup.setAttribute('tabindex', '-1');
    this.popup.focus();
  }

  closePopup() {
    if (!this.isOpen) return;

    this.isOpen = false;
    this.popup.classList.remove('show');

    document.body.style.overflow = '';

    this.resetPopupItems();
  }

  animatePopupItems() {
    const items = this.popup.querySelectorAll('.feature-item');
    items.forEach((item, index) => {

      item.style.animation = 'none';
      item.offsetHeight; 

      setTimeout(() => {
        item.style.animation = `slideInUp 0.6s ease forwards`;
        item.style.animationDelay = `${index * 0.1}s`;
      }, 100);
    });
  }

  resetPopupItems() {
    const items = this.popup.querySelectorAll('.feature-item');
    items.forEach(item => {
      item.style.animation = 'none';
      item.style.opacity = '0';
      item.style.transform = 'translateY(20px)';
    });
  }

  clearHoverTimeout() {
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = null;
    }
  }
  show() {
    this.openPopup();
  }
  hide() {
    this.closePopup();
  }
}
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    window.exclusivePopup = new ExclusivePopupManager();
  }, 100);
});
const buttons = document.querySelectorAll('.hero-menu button');
const heroText = document.getElementById('hero-text');
const heroImage = document.querySelector('.hero-image img');

buttons.forEach(button => {
  button.addEventListener('click', () => {
    buttons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    heroText.textContent = button.getAttribute('data-text');
    const newSrc = button.getAttribute('data-img');
    if (heroImage.src !== newSrc) {
      heroImage.style.opacity = 0;
      heroImage.onload = () => {
        heroImage.style.opacity = 1;
      };
      heroImage.src = newSrc;
    }
  });
});
const currentPath = window.location.pathname;
if (document.getElementById("footer")) {
  let footerPath;
  if (currentPath.includes('/Blog/') || currentPath.includes('/Portfolio/') || currentPath.includes('/Produtos/') || currentPath.includes('/sobre nos/') || currentPath.includes('/contato/')) {
    footerPath = "../partners/footer.html";
  } else {
    footerPath = "partners/footer.html";
  }

  fetch(footerPath)
    .then(response => {
      if (!response.ok) throw new Error("Erro ao carregar o footer");
      return response.text();
    })
    .then(data => {

      let correctedData = data;
      if (currentPath.includes('/Blog/')) {
        correctedData = correctedData.replace(/src="\.\.\/imgs\//g, 'src="../imgs/');
        correctedData = correctedData.replace(/href="\.\.\//g, 'href="../');
      } else if (currentPath.includes('/Portfolio/') || currentPath.includes('/Produtos/') || currentPath.includes('/sobre nos/') || currentPath.includes('/contato/')) {
        correctedData = correctedData.replace(/src="\.\.\/imgs\//g, 'src="../imgs/');
        correctedData = correctedData.replace(/href="\.\.\//g, 'href="../');
      } else {

        correctedData = correctedData.replace(/src="\.\.\/imgs\//g, 'src="imgs/');
        correctedData = correctedData.replace(/href="\.\.\//g, 'href="');
      }
      document.getElementById("footer").innerHTML = correctedData;
    })
    .catch(error => console.error("Erro ao carregar footer:", error));
}

if (document.getElementById("header")) {

  let headerPath;
  if (currentPath.includes('/Blog/') || currentPath.includes('/Portfolio/') || currentPath.includes('/Produtos/') || currentPath.includes('/sobre nos/') || currentPath.includes('/contato/')) {
    headerPath = "../partners/header.html";
  } else {
    headerPath = "partners/header.html";
  }

  fetch(headerPath)
    .then(response => {
      if (!response.ok) throw new Error("Erro ao carregar o header");
      return response.text();
    })
    .then(data => {

      let correctedData = data;
      if (currentPath.includes('/Blog/')) {
        correctedData = correctedData.replace(/src="\.\.\/imgs\//g, 'src="../imgs/');
        correctedData = correctedData.replace(/href="\.\.\//g, 'href="../');
      } else if (currentPath.includes('/Portfolio/') || currentPath.includes('/Produtos/') || currentPath.includes('/sobre nos/') || currentPath.includes('/contato/')) {
        correctedData = correctedData.replace(/src="\.\.\/imgs\//g, 'src="../imgs/');
        correctedData = correctedData.replace(/href="\.\.\//g, 'href="../');
      } else {

        correctedData = correctedData.replace(/src="\.\.\/imgs\//g, 'src="imgs/');
        correctedData = correctedData.replace(/href="\.\.\//g, 'href="');
      }
      document.getElementById("header").innerHTML = correctedData;
    })
    .catch(error => console.error("Erro ao carregar header:", error));
}

buttons.forEach(button => {
  button.addEventListener('click', () => {
    buttons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    if (window.animationManager) {
      window.animationManager.animateElement(heroText, 'fadeInUp');
      window.animationManager.animateElement(heroImage, 'zoomIn');
    }

    heroText.textContent = button.getAttribute('data-text');
    heroImage.src = button.getAttribute('data-img');
  });
});

window.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.logos-track');
  if (track) {
    const trackWidth = track.scrollWidth / 2;
    const randomStart = Math.random() * trackWidth;
    track.style.transform = `translateX(-${randomStart}px)`;
  }
});

const languageSelect = document.getElementById("language-select");
if (languageSelect) {
  languageSelect.addEventListener("change", () => {
    const lang = languageSelect.value;
    document.getElementById("hero-title").innerText = translations[lang].title;
    document.getElementById("hero-text").innerText = translations[lang].text;
    document.getElementById("subscribe-btn").innerText = translations[lang].btn;
  });
}