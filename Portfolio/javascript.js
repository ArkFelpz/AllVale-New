// ============================================
// PORTFOLIO JAVASCRIPT - ALLVALE
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  
  // ============================================
  // LOAD HEADER AND FOOTER
  // ============================================
  
  // Load header
  fetch('../partners/header.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('header').innerHTML = data;
      initializeNavigation();
    })
    .catch(error => {
      console.error('Erro ao carregar header:', error);
    });

  // Load footer
  fetch('../partners/footer.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('footer').innerHTML = data;
    })
    .catch(error => {
      console.error('Erro ao carregar footer:', error);
    });

  // ============================================
  // REVEAL ANIMATIONS ON SCROLL
  // ============================================
  
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, observerOptions);

  // Observe all reveal elements
  document.querySelectorAll('.reveal').forEach(el => {
    observer.observe(el);
  });

  // ============================================
  // PROJECT CARD INTERACTIONS
  // ============================================
  
  const projectCards = document.querySelectorAll('.project-card');
  
  projectCards.forEach(card => {
    // Add hover effects
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-10px)';
      this.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.15)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.08)';
    });
    
    // Add click functionality (can be expanded for modal/lightbox)
    card.addEventListener('click', function() {
      const projectName = this.querySelector('.project-name').textContent;
      const projectLocation = this.querySelector('.project-location').textContent;
      
      // Create a simple alert for now - can be replaced with modal
      console.log(`Projeto: ${projectName} - ${projectLocation}`);
      
      // Optional: Open WhatsApp with project info
      const message = `Olá! Gostaria de saber mais sobre o projeto "${projectName}" - ${projectLocation}`;
      const whatsappUrl = `https://wa.me/5512997643142?text=${encodeURIComponent(message)}`;
      
      // Uncomment to open WhatsApp
      // window.open(whatsappUrl, '_blank');
    });
    
    // Keyboard accessibility
    card.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });

  // ============================================
  // SMOOTH SCROLLING FOR ANCHOR LINKS
  // ============================================
  
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // ============================================
  // FLOATING WHATSAPP BUTTON ANIMATIONS
  // ============================================
  
  const floatingWhatsapp = document.querySelector('.floating-whatsapp a');
  
  if (floatingWhatsapp) {
    floatingWhatsapp.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.1)';
      this.style.boxShadow = '0 6px 25px rgba(37, 211, 102, 0.6)';
    });
    
    floatingWhatsapp.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
      this.style.boxShadow = '0 4px 20px rgba(37, 211, 102, 0.4)';
    });
  }

  // ============================================
  // CTA BUTTON ANIMATIONS
  // ============================================
  
  const ctaButton = document.querySelector('.cta-button');
  
  if (ctaButton) {
    ctaButton.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-3px)';
      this.style.boxShadow = '0 10px 35px rgba(37, 211, 102, 0.4)';
    });
    
    ctaButton.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = '0 6px 25px rgba(37, 211, 102, 0.3)';
    });
  }

  // ============================================
  // LAZY LOADING FOR IMAGES
  // ============================================
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      }
    });
  });

  // Observe all images with data-src attribute
  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });

  // ============================================
  // PERFORMANCE OPTIMIZATIONS
  // ============================================
  
  // Throttle scroll events
  let scrollTimeout;
  window.addEventListener('scroll', function() {
    if (!scrollTimeout) {
      scrollTimeout = setTimeout(function() {
        // Scroll-based animations or effects can be added here
        scrollTimeout = null;
      }, 16); // ~60fps
    }
  });

  // ============================================
  // ACCESSIBILITY IMPROVEMENTS
  // ============================================
  
  // Add keyboard navigation for project cards
  projectCards.forEach((card, index) => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Ver detalhes do projeto ${index + 1}`);
  });

  // Focus management for better accessibility
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-navigation');
    }
  });

  document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
  });

  // ============================================
  // RESPONSIVE IMAGE HANDLING
  // ============================================
  
  function handleResponsiveImages() {
    const projectImages = document.querySelectorAll('.project-image img');
    
    projectImages.forEach(img => {
      // Add error handling for broken images
      img.addEventListener('error', function() {
        this.src = '../imgs/lazy_placeholder.gif';
        this.alt = 'Imagem não disponível';
      });
      
      // Add loading states
      img.addEventListener('load', function() {
        this.style.opacity = '1';
        this.style.transition = 'opacity 0.3s ease';
      });
    });
  }

  handleResponsiveImages();

  // ============================================
  // INITIALIZATION FUNCTIONS
  // ============================================
  
  function initializeNavigation() {
    // Add active class to current page in navigation
    const currentPage = 'portfólio';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
      if (link.textContent.toLowerCase().includes(currentPage)) {
        link.classList.add('active');
      }
    });
  }

  // ============================================
  // ANALYTICS AND TRACKING (Optional)
  // ============================================
  
  // Track portfolio interactions
  function trackPortfolioInteraction(projectName, action) {
    // This can be connected to Google Analytics or other tracking services
    console.log(`Portfolio interaction: ${action} - ${projectName}`);
    
    // Example: gtag('event', 'portfolio_interaction', {
    //   'project_name': projectName,
    //   'action': action
    // });
  }

  // Add tracking to project cards
  projectCards.forEach(card => {
    const projectName = card.querySelector('.project-name').textContent;
    
    card.addEventListener('click', function() {
      trackPortfolioInteraction(projectName, 'click');
    });
  });

  // ============================================
  // ERROR HANDLING
  // ============================================
  
  window.addEventListener('error', function(e) {
    console.error('Erro na página do portfólio:', e.error);
  });

  // ============================================
  // INITIALIZATION COMPLETE
  // ============================================
  
  console.log('Portfolio JavaScript inicializado com sucesso!');
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Debounce function for performance
function debounce(func, wait, immediate) {
  let timeout;
  return function executedFunction() {
    const context = this;
    const args = arguments;
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

// Throttle function for scroll events
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
