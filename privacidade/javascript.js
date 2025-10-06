document.addEventListener('DOMContentLoaded', function() {
  initializePrivacyPage();
  setupSmoothScrolling();
  setupSectionAnimations();
  setupInteractiveElements();
  setupMobileOptimizations();
});

function initializePrivacyPage() {
  const privacySections = document.querySelectorAll('.privacy-section');
  
  privacySections.forEach((section, index) => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
      section.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      section.style.opacity = '1';
      section.style.transform = 'translateY(0)';
    }, index * 100);
  });
}

function setupSmoothScrolling() {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        const headerHeight = 80;
        const targetPosition = targetElement.offsetTop - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

function setupSectionAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        
        if (element.classList.contains('reveal')) {
          element.classList.add('active');
        }
        
        if (element.classList.contains('privacy-section')) {
          animateSection(element);
        }
      }
    });
  }, observerOptions);

  const elementsToObserve = document.querySelectorAll('.reveal, .privacy-section');
  elementsToObserve.forEach(element => {
    observer.observe(element);
  });
}

function animateSection(section) {
  const header = section.querySelector('.section-header');
  const content = section.querySelector('.section-content');
  
  if (header) {
    header.style.transform = 'translateX(-20px)';
    header.style.opacity = '0';
    
    setTimeout(() => {
      header.style.transition = 'all 0.6s ease';
      header.style.transform = 'translateX(0)';
      header.style.opacity = '1';
    }, 100);
  }
  
  if (content) {
    content.style.transform = 'translateX(20px)';
    content.style.opacity = '0';
    
    setTimeout(() => {
      content.style.transition = 'all 0.6s ease';
      content.style.transform = 'translateX(0)';
      content.style.opacity = '1';
    }, 200);
  }
}

function setupInteractiveElements() {
  const privacySections = document.querySelectorAll('.privacy-section');
  
  privacySections.forEach(section => {
    section.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-8px) scale(1.02)';
    });
    
    section.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });

  const infoItems = document.querySelectorAll('.info-list li, .purpose-list li, .right-item, .protection-item');
  
  infoItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
      this.style.transform = 'translateX(10px)';
      this.style.backgroundColor = '#f8f9fa';
    });
    
    item.addEventListener('mouseleave', function() {
      this.style.transform = 'translateX(0)';
      this.style.backgroundColor = '';
    });
  });

  const highlightBoxes = document.querySelectorAll('.highlight-box, .security-notice, .consent-box, .cookies-info, .changes-info, .storage-info');
  
  highlightBoxes.forEach(box => {
    box.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.02)';
      this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.15)';
    });
    
    box.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
      this.style.boxShadow = '';
    });
  });

  const ctaButton = document.querySelector('.cta-button');
  if (ctaButton) {
    ctaButton.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-5px) scale(1.05)';
    });
    
    ctaButton.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(-3px) scale(1)';
    });
  }
}

function setupMobileOptimizations() {
  const isMobile = window.innerWidth <= 768;
  
  if (isMobile) {
    const privacySections = document.querySelectorAll('.privacy-section');
    
    privacySections.forEach(section => {
      section.addEventListener('touchstart', function() {
        this.style.transform = 'scale(0.98)';
      });
      
      section.addEventListener('touchend', function() {
        this.style.transform = 'scale(1)';
      });
    });

    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
      ctaButton.addEventListener('touchstart', function() {
        this.style.transform = 'scale(0.95)';
      });
      
      ctaButton.addEventListener('touchend', function() {
        this.style.transform = 'scale(1)';
      });
    }
  }

  window.addEventListener('resize', function() {
    const newIsMobile = window.innerWidth <= 768;
    
    if (newIsMobile !== isMobile) {
      setupMobileOptimizations();
    }
  });
}

function animateCounter(element, target, duration = 2000) {
  let start = 0;
  const increment = target / (duration / 16);
  
  const timer = setInterval(() => {
    start += increment;
    element.textContent = Math.floor(start);
    
    if (start >= target) {
      element.textContent = target;
      clearInterval(timer);
    }
  }, 16);
}

function setupParallaxEffect() {
  const hero = document.querySelector('.privacy-hero');
  
  if (hero) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;
      
      hero.style.transform = `translateY(${rate}px)`;
    });
  }
}

function setupTypewriterEffect() {
  const title = document.querySelector('.privacy-title');
  
  if (title) {
    const text = title.textContent;
    title.textContent = '';
    
    let index = 0;
    const timer = setInterval(() => {
      title.textContent += text[index];
      index++;
      
      if (index >= text.length) {
        clearInterval(timer);
      }
    }, 100);
  }
}

function setupScrollProgress() {
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 0%;
    height: 3px;
    background: linear-gradient(90deg, #000080, #25D366);
    z-index: 9999;
    transition: width 0.1s ease;
  `;
  
  document.body.appendChild(progressBar);
  
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    progressBar.style.width = scrollPercent + '%';
  });
}

function setupBackToTop() {
  const backToTopButton = document.createElement('button');
  backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
  backToTopButton.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, #000080, #223E70);
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    font-size: 18px;
    box-shadow: 0 4px 15px rgba(0, 0, 128, 0.3);
    transition: all 0.3s ease;
    opacity: 0;
    visibility: hidden;
    z-index: 1000;
  `;
  
  document.body.appendChild(backToTopButton);
  
  backToTopButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  backToTopButton.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-3px) scale(1.1)';
    this.style.boxShadow = '0 6px 20px rgba(0, 0, 128, 0.4)';
  });
  
  backToTopButton.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0) scale(1)';
    this.style.boxShadow = '0 4px 15px rgba(0, 0, 128, 0.3)';
  });
  
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      backToTopButton.style.opacity = '1';
      backToTopButton.style.visibility = 'visible';
    } else {
      backToTopButton.style.opacity = '0';
      backToTopButton.style.visibility = 'hidden';
    }
  });
}

function setupPrintStyles() {
  const printStyles = document.createElement('style');
  printStyles.textContent = `
    @media print {
      .privacy-hero {
        background: #000080 !important;
        -webkit-print-color-adjust: exact;
        color-adjust: exact;
      }
      
      .privacy-section {
        break-inside: avoid;
        box-shadow: none !important;
        border: 1px solid #ddd !important;
      }
      
      .floating-whatsapp,
      .back-to-top {
        display: none !important;
      }
    }
  `;
  
  document.head.appendChild(printStyles);
}

function initializeAdvancedFeatures() {
  setupScrollProgress();
  setupBackToTop();
  setupPrintStyles();
  
  if (window.innerWidth > 768) {
    setupParallaxEffect();
  }
}

setTimeout(initializeAdvancedFeatures, 1000);

window.addEventListener('load', function() {
  document.body.classList.add('loaded');
  
  const loader = document.querySelector('.loader');
  if (loader) {
    loader.style.opacity = '0';
    setTimeout(() => {
      loader.style.display = 'none';
    }, 500);
  }
});
