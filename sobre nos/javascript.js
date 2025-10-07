console.log("=== INICIANDO CARREGAMENTO ===");
console.log("Header element:", document.getElementById("header"));
console.log("Footer element:", document.getElementById("footer"));

console.log("Carregando footer...");
fetch("../partners/footer.html")
  .then(response => {
    console.log("Resposta do footer:", response.status, response.statusText);
    if (!response.ok) throw new Error("Erro ao carregar o footer: " + response.status);
    return response.text();
  })
  .then(data => {
    console.log("Footer carregado, tamanho:", data.length);
    const correctedData = data.replace(/src="imgs\//g, 'src="../IMGS/');
    document.getElementById("footer").innerHTML = correctedData;
    console.log("Footer inserido no DOM");
  })
  .catch(error => {
    console.error("Erro ao carregar footer:", error);
    document.getElementById("footer").innerHTML = "<p>Erro ao carregar footer: " + error.message + "</p>";
  });

console.log("Carregando header...");
fetch("../partners/header.html")
  .then(response => {
    console.log("Resposta do header:", response.status, response.statusText);
    if (!response.ok) throw new Error("Erro ao carregar o header: " + response.status);
    return response.text();
  })
  .then(data => {
    console.log("Header carregado, tamanho:", data.length);
    const correctedData = data.replace(/src="imgs\//g, 'src="../IMGS/');
    document.getElementById("header").innerHTML = correctedData;
    console.log("Header inserido no DOM");
  })
  .catch(error => {
    console.error("Erro ao carregar header:", error);
    document.getElementById("header").innerHTML = "<p>Erro ao carregar header: " + error.message + "</p>";
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


function animateCounter(element, target, duration = 2000) {
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;
  
  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }
  
  function updateCounter() {
    current += increment;
    const progress = Math.min(current / target, 1);
    const easedProgress = easeOutQuart(progress);
    const displayValue = Math.floor(easedProgress * target);
    
    element.textContent = displayValue;
    
    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target;
    }
  }
  
  updateCounter();
}

// Detectar se é mobile de forma mais robusta
const isMobile = () => window.innerWidth <= 768;

// Configuração do observer mais permissiva para detectar elementos fora do viewport
const observerOptions = {
  rootMargin: '0px 0px 0px 0px', // Sem margem negativa para detectar elementos fora do viewport
  threshold: 0.1 // Dispara quando 10% do elemento estiver visível
};

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      console.log('Seção Nossa Essência detectada na viewport');
      const statNumbers = entry.target.querySelectorAll('.stat-number');
      console.log('Números encontrados:', statNumbers.length);
      
      statNumbers.forEach((stat, index) => {
        const target = parseInt(stat.getAttribute('data-target'));
        if (target && !stat.classList.contains('animated')) {
          console.log('Animando número:', target);
          stat.classList.add('animated');
          
          setTimeout(() => {
            animateCounter(stat, target, isMobile() ? 1500 : 2000);
          }, index * 300);
        }
      });
      
      statsObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
  const mvSection = document.querySelector('.mv-section');
  if (mvSection) {
    statsObserver.observe(mvSection);
    
    // Fallback mais inteligente - só anima se o elemento estiver visível
    const checkAndAnimateStats = () => {
      const rect = mvSection.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      
      if (isVisible) {
        const statNumbers = mvSection.querySelectorAll('.stat-number:not(.animated)');
        if (statNumbers.length > 0) {
          console.log('Fallback: Animando números visíveis');
          statNumbers.forEach((stat, index) => {
            const target = parseInt(stat.getAttribute('data-target'));
            if (target) {
              stat.classList.add('animated');
              setTimeout(() => {
                animateCounter(stat, target, isMobile() ? 1500 : 2000);
              }, index * 200);
            }
          });
        }
      }
    };
    
    // Fallback no scroll para elementos que podem ter sido perdidos
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(checkAndAnimateStats, 100);
    });
  }
  
  
  const revealObserverOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, revealObserverOptions);

  const revealSelectors = [
    '.reveal', '.reveal-left', '.reveal-right', '.reveal-scale',
    '.reveal-bounce', '.reveal-slide-bounce', '.reveal-scale-bounce',
    '.reveal-fade-slide', '.reveal-rotate', '.reveal-flip', '.reveal-slide-left'
  ];
  
  revealSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      revealObserver.observe(el);
    });
  });
});
