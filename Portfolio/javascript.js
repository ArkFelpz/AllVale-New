document.addEventListener('DOMContentLoaded', function() {
  fetch('../partners/header.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('header').innerHTML = data;
      initializeNavigation();
    })
    .catch(error => {
      console.error('Erro ao carregar header:', error);
    });
  fetch('../partners/footer.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('footer').innerHTML = data;
    })
    .catch(error => {
      console.error('Erro ao carregar footer:', error);
    });
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
  const revealSelectors = [
    '.reveal', '.reveal-left', '.reveal-right', '.reveal-scale',
    '.reveal-bounce', '.reveal-slide-bounce', '.reveal-scale-bounce',
    '.reveal-fade-slide', '.reveal-rotate', '.reveal-flip'
  ];
  
  revealSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      observer.observe(el);
    });
  });
  let portfolioData = null;
  let projectCards = [];
  async function loadPortfolioData() {
    try {
      const localData = localStorage.getItem('portfolioData');
      if (localData) {
        console.log('📱 Carregando dados do localStorage');
        portfolioData = JSON.parse(localData);
      } else {
        console.log('📁 Carregando dados do projects.json');
        const response = await fetch('./projects.json');
        portfolioData = await response.json();
      }
      updateProjectCards();
      
    } catch (error) {
      console.error('Erro ao carregar dados do portfolio:', error);
    }
  }

  function updateProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    
    console.log('🔍 Encontrados', projectCards.length, 'cards de projeto');
    console.log('📊 Dados carregados:', portfolioData ? portfolioData.projects.length : 0, 'projetos');
    
    projectCards.forEach((card, index) => {
      const projectName = card.querySelector('.project-name').textContent.trim();
      console.log(`📋 Verificando projeto: "${projectName}"`);
            const project = portfolioData.projects.find(p => p.title === projectName);
      
      if (project) {
        console.log(`✅ Projeto encontrado: ${project.title} -> ${project.slug}`);
        card.style.cursor = 'pointer';
        card.setAttribute('data-project-slug', project.slug);
        card.replaceWith(card.cloneNode(true));
        const newCard = document.querySelector(`[data-project-slug="${project.slug}"]`);
        setupProjectCardInteractions(newCard);
      } else {
        console.log(`❌ Projeto não encontrado: "${projectName}"`);
        setupProjectCardInteractions(card);
      }
    });
  }
  function setupProjectCardInteractions(card) {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-10px)';
      this.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.15)';
    });
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.08)';
    });
    card.addEventListener('click', function() {
      const projectSlug = this.getAttribute('data-project-slug');
      if (projectSlug) {
        window.location.href = `project.html?slug=${projectSlug}`;
      } else {
        const projectName = this.querySelector('.project-name').textContent;
        const projectLocation = this.querySelector('.project-location').textContent;
        const message = `Olá! Gostaria de saber mais sobre o projeto "${projectName}" - ${projectLocation}`;
        const whatsappUrl = `https://wa.me/5512997643142?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
      }
    });
    card.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  }
  loadPortfolioData();
  setTimeout(() => {
    const allCards = document.querySelectorAll('.project-card');
    console.log(`🔧 Tornando ${allCards.length} projetos visíveis inicialmente`);
    
    allCards.forEach((card, index) => {
      const projectName = card.querySelector('.project-name').textContent.trim();
      console.log(`🔧 Tornando visível: ${projectName}`);
      card.style.display = 'block';
      card.style.opacity = '1';
      card.style.transform = 'scale(1)';
      card.classList.remove('hidden');
      card.classList.add('visible');
    });
    console.log('✅ Todos os projetos foram tornados visíveis inicialmente');
  }, 500);
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
  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
  let scrollTimeout;
  window.addEventListener('scroll', function() {
    if (!scrollTimeout) {
      scrollTimeout = setTimeout(function() {
        scrollTimeout = null;
      }, 16);
    }
  });
  projectCards.forEach((card, index) => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Ver detalhes do projeto ${index + 1}`);
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-navigation');
    }
  });
  document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
  });
  function handleResponsiveImages() {
    const projectImages = document.querySelectorAll('.project-image img');
    
    projectImages.forEach(img => {
      img.addEventListener('error', function() {
        this.src = '../imgs/lazy_placeholder.gif';
        this.alt = 'Imagem não disponível';
      });
      img.addEventListener('load', function() {
        this.style.opacity = '1';
        this.style.transition = 'opacity 0.3s ease';
      });
    });
  }
  handleResponsiveImages();
  function initializeNavigation() {
    const currentPage = 'portfólio';
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      if (link.textContent.toLowerCase().includes(currentPage)) {
        link.classList.add('active');
      }
    });
  }
  function trackPortfolioInteraction(projectName, action) {
    console.log(`Portfolio interaction: ${action} - ${projectName}`);
  }
  projectCards.forEach(card => {
    const projectName = card.querySelector('.project-name').textContent;
    
    card.addEventListener('click', function() {
      trackPortfolioInteraction(projectName, 'click');
    });
  });
  window.addEventListener('error', function(e) {
    console.error('Erro na página do portfólio:', e.error);
  });
  setTimeout(() => {
    initializePortfolioTabs();
  }, 100);

  console.log('Portfolio JavaScript inicializado com sucesso!');
});
function initializePortfolioTabs() {
  const tabButtons = document.querySelectorAll('.tab-button');
  const projectCards = document.querySelectorAll('.project-card');
  
  if (!tabButtons.length || !projectCards.length) {
    console.log('Elementos das abas não encontrados');
    return;
  }
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      const targetTab = this.getAttribute('data-tab');
      tabButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      filterProjects(targetTab);
      animateProjectCards();
    });
    button.addEventListener('mouseenter', function() {
      if (!this.classList.contains('active')) {
        this.style.transform = 'translateY(-2px)';
      }
    });
    
    button.addEventListener('mouseleave', function() {
      if (!this.classList.contains('active')) {
        this.style.transform = 'translateY(0)';
      }
    });
  });
}

function filterProjects(category) {
  const projectCards = document.querySelectorAll('.project-card');
  
  console.log(`🔍 Filtrando por categoria: ${category}`);
  console.log(`📋 Total de cards encontrados: ${projectCards.length}`);
  
  projectCards.forEach((card, index) => {
    const cardCategory = card.getAttribute('data-category');
    const projectName = card.querySelector('.project-name').textContent.trim();
    
    console.log(`📋 Card ${index + 1}: "${projectName}" - Categoria: ${cardCategory}`);
    card.classList.remove('hidden', 'visible');
    if (category === 'todos' || cardCategory === category) {
      console.log(`✅ Mostrando: ${projectName}`);
      card.classList.add('visible');
      card.style.display = 'block';
    } else {
      console.log(`❌ Escondendo: ${projectName}`);
      card.classList.add('hidden');
    }
  });
}

function animateProjectCards() {
  const visibleCards = document.querySelectorAll('.project-card.visible');
  visibleCards.forEach((card, index) => {
    card.style.animation = 'none';
    card.offsetHeight;
    card.style.animation = null;
    setTimeout(() => {
      card.style.opacity = '1';
      card.style.transform = 'scale(1)';
    }, index * 100);
  });
}
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
