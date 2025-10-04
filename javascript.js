/* ============================================
   SISTEMA DE ANIMAÇÕES AVANÇADO - JAVASCRIPT
   ============================================ */

// Classe principal para gerenciar animações
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

  // Sistema de animações no scroll - MELHORADO
  setupScrollAnimations() {
    // Opções otimizadas para melhor performance
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
            // Delay baseado no tipo de animação e posição
            const delay = this.calculateDelay(element, entry);
            
            setTimeout(() => {
              this.triggerAnimation(element, animationType);
            }, delay);
            
            // Parar de observar após animar
            this.intersectionObserver.unobserve(element);
          }
        }
      });
    }, observerOptions);

    // Observar todos os elementos com classes de reveal
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

  // Calcular delay baseado na posição e tipo do elemento
  calculateDelay(element, entry) {
    const rect = entry.boundingClientRect;
    const viewportHeight = window.innerHeight;
    const isMobile = window.innerWidth <= 768;
    
    // Delay baseado na distância do topo da viewport
    const distanceFromTop = rect.top;
    const normalizedDistance = Math.max(0, Math.min(1, distanceFromTop / viewportHeight));
    
    // Delay baseado na classe de delay
    const delayClass = Array.from(element.classList).find(cls => cls.startsWith('reveal-delay-'));
    const classDelay = delayClass ? parseInt(delayClass.split('-')[2]) * (isMobile ? 50 : 100) : 0;
    
    // Delay baseado no tipo de elemento (reduzido para mobile)
    let elementDelay = 0;
    if (element.classList.contains('product-card')) elementDelay = isMobile ? 50 : 100;
    else if (element.classList.contains('testimonial-card')) elementDelay = isMobile ? 75 : 150;
    else if (element.classList.contains('gallery-item')) elementDelay = isMobile ? 40 : 80;
    
    // Reduzir delay geral para mobile
    const baseDelay = isMobile ? 100 : 200;
    
    return normalizedDistance * baseDelay + classDelay + elementDelay;
  }

  getAnimationType(element) {
    // Verificar todas as classes de animação disponíveis
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
    // Adicionar classe active para ativar a animação
    element.classList.add('active');
    this.animatedElements.add(element);
    
    // Log para debug (pode ser removido em produção)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.log(`Animação ativada: ${type}`, element);
    }
    
    // Callback personalizado se definido
    if (element.onAnimationStart && typeof element.onAnimationStart === 'function') {
      element.onAnimationStart(type);
    }
    
    // Disparar evento customizado
    const event = new CustomEvent('animationStart', {
      detail: { element, type }
    });
    element.dispatchEvent(event);
  }

  // Sistema de animações no hover
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

  // Sistema de animações no clique
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

  // Sistema de animações automáticas
  setupAutoAnimations() {
    // Animar elementos com classe 'auto-animate' após um delay
    const autoElements = document.querySelectorAll('.auto-animate');
    
    autoElements.forEach((element, index) => {
      setTimeout(() => {
        const animationType = element.getAttribute('data-animation') || 'fadeInUp';
        this.animateElement(element, animationType);
      }, index * 200); // Delay escalonado
    });
  }

  // Função principal para animar qualquer elemento
  animateElement(element, animationType, duration = 1000) {
    if (this.animatedElements.has(element)) return;

    // Remover classes de animação anteriores
    element.classList.remove('animate');
    Array.from(element.classList).forEach(cls => {
      if (cls.startsWith('fade') || cls.startsWith('slide') || cls.startsWith('zoom') || 
          cls.startsWith('bounce') || cls.startsWith('flip') || cls.startsWith('rotate')) {
        element.classList.remove(cls);
      }
    });

    // Adicionar nova animação
    element.classList.add('animate', animationType);
    this.animatedElements.add(element);

    // Limpar após animação
    setTimeout(() => {
      element.classList.remove('animate', animationType);
    }, duration);
  }

  // Função para animar sequência de elementos
  animateSequence(elements, animationType, delay = 200) {
    elements.forEach((element, index) => {
      setTimeout(() => {
        this.animateElement(element, animationType);
      }, index * delay);
    });
  }

  // Função para animar elementos em grid
  animateGrid(container, animationType, delay = 100) {
    const items = container.querySelectorAll('.product-card, .testimonial-card, .gallery-item');
    this.animateSequence(Array.from(items), animationType, delay);
  }
}

// Funções utilitárias para animações específicas
const AnimationUtils = {
  // Animar entrada de seções
  animateSection: (selector, animationType = 'fadeInUp') => {
    const section = document.querySelector(selector);
    if (section) {
      section.classList.add('animate', animationType);
    }
  },

  // Animar cards em sequência
  animateCards: (selector, animationType = 'fadeInUp', delay = 200) => {
    const cards = document.querySelectorAll(selector);
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('animate', animationType);
      }, index * delay);
    });
  },

  // Animar texto letra por letra
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

  // Animar números incrementando
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

  // Parallax scroll effect
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

// ============================================
// SISTEMA DE RESPONSIVIDADE MOBILE
// ============================================

// Classe para gerenciar responsividade mobile
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
    // Garantir que o viewport meta tag está correto
    let viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.name = 'viewport';
      document.head.appendChild(viewport);
    }
    viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
  }

  setupTouchEvents() {
    // Melhorar eventos de touch para mobile
    if (this.isMobile) {
      // Prevenir zoom duplo toque em botões
      const buttons = document.querySelectorAll('button, .btn-whatsapp, .cta-button');
      buttons.forEach(button => {
        button.addEventListener('touchstart', (e) => {
          e.preventDefault();
        }, { passive: false });
      });

      // Melhorar scroll suave
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
    // Ajustar header sticky
    const header = document.querySelector('header');
    if (header && this.isMobile) {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Otimizar animações durante scroll
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
    // Ajustar layout quando orientação muda
    this.isPortrait = window.innerHeight > window.innerWidth;
    
    // Recalcular posições se necessário
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
      heroSection.style.minHeight = this.isPortrait ? '500px' : '400px';
    }
  }

  adjustForMobile() {
    this.isMobile = window.innerWidth <= 768;
    this.isTablet = window.innerWidth <= 1024 && window.innerWidth > 768;
    
    // Ajustar padding do body para header fixo
    if (this.isMobile) {
      document.body.style.paddingTop = '60px';
    } else {
      document.body.style.paddingTop = '0';
    }

    // Ajustar tamanhos de fonte dinamicamente
    this.adjustFontSizes();
    
    // Ajustar espaçamentos
    this.adjustSpacing();
  }

  adjustFontSizes() {
    const baseFontSize = this.isMobile ? 14 : 16;
    document.documentElement.style.fontSize = `${baseFontSize}px`;
  }

  adjustSpacing() {
    // Ajustar espaçamentos entre seções para mobile
    if (this.isMobile) {
      const sections = document.querySelectorAll('section');
      sections.forEach(section => {
        section.style.scrollMarginTop = '70px';
      });
    }
  }

  // Método para detectar se é dispositivo móvel
  isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || this.isMobile;
  }

  // Método para detectar se é touch device
  isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }
}

// Inicializar sistema de animações quando DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
  // Inicializar gerenciador de responsividade mobile
  window.mobileManager = new MobileResponsiveManager();
  
  // Inicializar gerenciador de animações
  window.animationManager = new AnimationManager();
  
  // Configurar parallax se houver elementos
  AnimationUtils.setupParallax();
  
  // Animações específicas do site
  setupSiteAnimations();
  
  // Listener para redimensionamento da janela
  window.addEventListener('resize', () => {
    if (window.mobileManager) {
      window.mobileManager.adjustForMobile();
    }
  });
});

// Animações específicas do site AllVale
function setupSiteAnimations() {
  // Animar hero section
  setTimeout(() => {
    AnimationUtils.animateSection('.hero-title', 'fadeInDown');
    AnimationUtils.animateSection('.hero-subtitle', 'fadeInUp');
    AnimationUtils.animateSection('.hero-button', 'bounceIn');
  }, 500);

  // Animar cards de produtos quando visíveis
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

  // Animar depoimentos
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

  // Animar galeria
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

// ============================================
// SISTEMA DE POP-UP EXCLUSIVO
// ============================================

// Classe para gerenciar o pop-up exclusivo
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
    // Hover para abrir pop-up
    this.badge.addEventListener('mouseenter', () => {
      this.clearHoverTimeout();
      this.hoverTimeout = setTimeout(() => {
        this.openPopup();
      }, 300); // Delay de 300ms para evitar abertura acidental
    });

    // Mouse leave para fechar pop-up
    this.badge.addEventListener('mouseleave', () => {
      this.clearHoverTimeout();
      this.hoverTimeout = setTimeout(() => {
        this.closePopup();
      }, 500); // Delay para permitir mover o mouse para o pop-up
    });

    // Manter pop-up aberto quando mouse estiver sobre ele
    this.popup.addEventListener('mouseenter', () => {
      this.clearHoverTimeout();
    });

    // Fechar pop-up quando mouse sair dele
    this.popup.addEventListener('mouseleave', () => {
      this.hoverTimeout = setTimeout(() => {
        this.closePopup();
      }, 200);
    });

    // Botão de fechar
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.closePopup();
      });
    }

    // Click no badge para abrir/fechar (mobile)
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
    // Fechar com ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.closePopup();
      }
    });
  }

  setupMobileSupport() {
    // Detectar se é dispositivo móvel
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
      // No mobile, usar click ao invés de hover
      this.badge.style.cursor = 'pointer';
    }
  }

  openPopup() {
    if (this.isOpen) return;

    this.isOpen = true;
    this.popup.classList.add('show');
    
    // Animar elementos do pop-up
    this.animatePopupItems();
    
    // Prevenir scroll do body
    document.body.style.overflow = 'hidden';
    
    // Focar no pop-up para acessibilidade
    this.popup.setAttribute('tabindex', '-1');
    this.popup.focus();
  }

  closePopup() {
    if (!this.isOpen) return;

    this.isOpen = false;
    this.popup.classList.remove('show');
    
    // Restaurar scroll do body
    document.body.style.overflow = '';
    
    // Resetar animações dos itens
    this.resetPopupItems();
  }

  animatePopupItems() {
    const items = this.popup.querySelectorAll('.feature-item');
    items.forEach((item, index) => {
      // Resetar animação
      item.style.animation = 'none';
      item.offsetHeight; // Trigger reflow
      
      // Aplicar animação com delay
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

  // Método público para abrir pop-up programaticamente
  show() {
    this.openPopup();
  }

  // Método público para fechar pop-up programaticamente
  hide() {
    this.closePopup();
  }
}

// ============================================
// INICIALIZAÇÃO DO POP-UP EXCLUSIVO
// ============================================

// Inicializar pop-up quando DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
  // Aguardar um pouco para garantir que todos os elementos estejam carregados
  setTimeout(() => {
    window.exclusivePopup = new ExclusivePopupManager();
  }, 100);
});

// Código original do site (mantido para compatibilidade)
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

// Carregar header e footer (apenas na página principal)
if (window.location.pathname.endsWith('/index.html') || window.location.pathname.endsWith('/')) {
  fetch("partners/footer.html")
    .then(response => {
      if (!response.ok) throw new Error("Erro ao carregar o footer");
      return response.text();
    })
    .then(data => {
      // Corrigir caminhos das imagens e links para a página principal
      let correctedData = data.replace(/src="\.\.\/imgs\//g, 'src="imgs/');
      correctedData = correctedData.replace(/href="\.\.\//g, 'href="');
      document.getElementById("footer").innerHTML = correctedData;
    })

  fetch("partners/header.html")
    .then(response => {
      if (!response.ok) throw new Error("Erro ao carregar o header");
      return response.text();
    })
    .then(data => {
      // Corrigir caminhos das imagens e links para a página principal
      let correctedData = data.replace(/src="\.\.\/imgs\//g, 'src="imgs/');
      correctedData = correctedData.replace(/href="\.\.\//g, 'href="');
      document.getElementById("header").innerHTML = correctedData;
    })
    .catch(error => console.error(error));
}

// Animações originais dos botões (melhoradas)
buttons.forEach(button => {
  button.addEventListener('click', () => {
    buttons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    
    // Usar o novo sistema de animações
    if (window.animationManager) {
      window.animationManager.animateElement(heroText, 'fadeInUp');
      window.animationManager.animateElement(heroImage, 'zoomIn');
    }
    
    heroText.textContent = button.getAttribute('data-text');
    heroImage.src = button.getAttribute('data-img');
  });
});

// Sistema de logos animados
window.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.logos-track');
  if (track) {
    const trackWidth = track.scrollWidth / 2;
    const randomStart = Math.random() * trackWidth;
    track.style.transform = `translateX(-${randomStart}px)`;
  }
});

// Seletor de linguagem (mantido para compatibilidade)
const languageSelect = document.getElementById("language-select");
if (languageSelect) {
  languageSelect.addEventListener("change", () => {
    const lang = languageSelect.value;
    document.getElementById("hero-title").innerText = translations[lang].title;
    document.getElementById("hero-text").innerText = translations[lang].text;
    document.getElementById("subscribe-btn").innerText = translations[lang].btn;
  });
}