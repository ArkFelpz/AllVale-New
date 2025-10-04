// DEBUG: Verificar se os elementos existem
console.log("=== INICIANDO CARREGAMENTO ===");
console.log("Header element:", document.getElementById("header"));
console.log("Footer element:", document.getElementById("footer"));

// Carregar Header e Footer
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
/* seletor de linguagem */
const languageSelect = document.getElementById("language-select");
if (languageSelect) {
  languageSelect.addEventListener("change", () => {
    const lang = languageSelect.value;
    document.getElementById("hero-title").innerText = translations[lang].title;
    document.getElementById("hero-text").innerText = translations[lang].text;
    document.getElementById("subscribe-btn").innerText = translations[lang].btn;
  });
}

// Animação das estatísticas
function animateCounter(element, target, duration = 2000) {
  let start = 0;
  const increment = target / (duration / 16);
  
  function updateCounter() {
    start += increment;
    if (start < target) {
      element.textContent = Math.floor(start);
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target;
    }
  }
  
  updateCounter();
}

// Detectar se é mobile
const isMobile = window.innerWidth <= 768;

// Observer para animar as estatísticas quando aparecem na tela
const observerOptions = {
  threshold: isMobile ? 0.1 : 0.3, // 10% no mobile, 30% no desktop
  rootMargin: isMobile ? '0px 0px -20px 0px' : '0px 0px -50px 0px' // Menos margem no mobile
};

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      console.log('Seção Nossa Essência detectada na viewport');
      const statNumbers = entry.target.querySelectorAll('.stat-number');
      console.log('Números encontrados:', statNumbers.length);
      statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        if (target && !stat.classList.contains('animated')) {
          console.log('Animando número:', target);
          stat.classList.add('animated');
          animateCounter(stat, target);
        }
      });
    }
  });
}, observerOptions);

// Aplicar observer quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
  const mvSection = document.querySelector('.mv-section');
  if (mvSection) {
    statsObserver.observe(mvSection);
    
    // Fallback para mobile: se após 2 segundos as animações não dispararam, forçar
    setTimeout(() => {
      const statNumbers = mvSection.querySelectorAll('.stat-number:not(.animated)');
      if (statNumbers.length > 0) {
        console.log('Fallback: Forçando animações dos números no mobile');
        statNumbers.forEach(stat => {
          const target = parseInt(stat.getAttribute('data-target'));
          if (target) {
            stat.classList.add('animated');
            animateCounter(stat, target);
          }
        });
      }
    }, 2000);
  }
  
  // ============================================
  // REVEAL ANIMATIONS ON SCROLL
  // ============================================
  
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

  // Observe all reveal elements with new animation system
  const revealSelectors = [
    '.reveal', '.reveal-left', '.reveal-right', '.reveal-scale',
    '.reveal-bounce', '.reveal-slide-bounce', '.reveal-scale-bounce',
    '.reveal-fade-slide', '.reveal-rotate', '.reveal-flip'
  ];
  
  revealSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      revealObserver.observe(el);
    });
  });
});
