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

// Função para scroll suave para seções
function smoothScrollTo(target) {
  const element = document.querySelector(target);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}

// Função para mostrar modal de produto (futura implementação)
function showProductModal(productName) {
  // Aqui você pode implementar um modal com mais detalhes do produto
  console.log(`Mostrando detalhes do produto: ${productName}`);
  
  // Por enquanto, apenas um alert
  alert(`Detalhes do ${productName} serão implementados em breve!\n\nEntre em contato conosco para mais informações sobre este produto.`);
}

// Função para redirecionar para contato com produto selecionado
function redirectToContact(productName) {
  const whatsappNumber = "5512997776486";
  const message = `Olá! Gostaria de saber mais informações sobre a *${productName}* da AllVale.

Podem me enviar mais detalhes e orçamento?`;
  
  const encodedMessage = encodeURIComponent(message);
  const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
  
  // Detectar se é mobile para abrir app ou web
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (isMobile) {
    window.location.href = whatsappURL;
  } else {
    window.open(whatsappURL, '_blank');
  }
}

// Aplicar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
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
  
  // ============================================
  // INTERAÇÕES DOS PRODUTOS
  // ============================================
  
  // Adicionar eventos aos botões dos produtos
  const productButtons = document.querySelectorAll('.product-btn');
  productButtons.forEach((button, index) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Obter o nome do produto baseado no índice
      const productNames = [
        'Linha Suprema',
        'Linha Gold', 
        'Linha 42',
        'Linha Esmerium',
        'Linha AllVale Suprema'
      ];
      
      const productName = productNames[index] || 'Produto';
      
      // Mostrar modal ou redirecionar
      showProductModal(productName);
    });
  });
  
  // Adicionar eventos aos cards dos produtos para hover effects
  const productCards = document.querySelectorAll('.product-card');
  productCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-20px) rotateX(5deg)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) rotateX(0deg)';
    });
  });
  
  // ============================================
  // BOTÕES CTA
  // ============================================
  
  // Botão "Solicitar Orçamento"
  const ctaPrimary = document.querySelector('.cta-btn.primary');
  if (ctaPrimary) {
    ctaPrimary.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Redirecionar para página de contato
      window.location.href = '../contato/';
    });
  }
  
  // Botão "Conheça a AllVale"
  const ctaSecondary = document.querySelector('.cta-btn.secondary');
  if (ctaSecondary) {
    ctaSecondary.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Redirecionar para página sobre nós
      window.location.href = '../sobre nos/';
    });
  }
  
  // ============================================
  // ANIMAÇÕES ESPECIAIS
  // ============================================
  
  // Parallax effect no hero
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.products-hero');
    if (hero) {
      hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
  });
  
  // Counter animation para estatísticas (se houver)
  const animateCounters = () => {
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'));
      const count = parseInt(counter.innerText);
      const increment = target / 100;
      
      if (count < target) {
        counter.innerText = Math.ceil(count + increment);
        setTimeout(animateCounters, 20);
      } else {
        counter.innerText = target;
      }
    });
  };
  
  // Observer para animar contadores quando aparecem na tela
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        counterObserver.unobserve(entry.target);
      }
    });
  });
  
  const countersSection = document.querySelector('.counters-section');
  if (countersSection) {
    counterObserver.observe(countersSection);
  }
  
  // ============================================
  // NAVEGAÇÃO SUAVE
  // ============================================
  
  // Adicionar navegação suave para links internos
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = this.getAttribute('href');
      smoothScrollTo(target);
    });
  });
  
  // ============================================
  // LAZY LOADING DE IMAGENS (FUTURA IMPLEMENTAÇÃO)
  // ============================================
  
  // Observer para lazy loading de imagens
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        imageObserver.unobserve(img);
      }
    });
  });
  
  // Aplicar lazy loading a imagens com classe 'lazy'
  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
});

// ============================================
// FUNÇÕES GLOBAIS
// ============================================

// Função para compartilhar produto (futura implementação)
function shareProduct(productName) {
  if (navigator.share) {
    navigator.share({
      title: `${productName} - AllVale`,
      text: `Conheça a ${productName} da AllVale`,
      url: window.location.href
    });
  } else {
    // Fallback para navegadores que não suportam Web Share API
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      alert('Link copiado para a área de transferência!');
    });
  }
}

// Função para favoritar produto (futura implementação)
function toggleFavorite(productId) {
  const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
  const index = favorites.indexOf(productId);
  
  if (index > -1) {
    favorites.splice(index, 1);
    console.log('Produto removido dos favoritos');
  } else {
    favorites.push(productId);
    console.log('Produto adicionado aos favoritos');
  }
  
  localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Função para comparar produtos (futura implementação)
function addToComparison(productId) {
  const comparison = JSON.parse(localStorage.getItem('comparison') || '[]');
  
  if (comparison.length >= 3) {
    alert('Você pode comparar no máximo 3 produtos');
    return;
  }
  
  if (!comparison.includes(productId)) {
    comparison.push(productId);
    localStorage.setItem('comparison', JSON.stringify(comparison));
    console.log('Produto adicionado à comparação');
  }
}
