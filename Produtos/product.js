// Product.js - Sistema dinâmico de produtos
class ProductManager {
  constructor() {
    this.products = [];
    this.currentProduct = null;
    this.init();
  }

  async init() {
    try {
      await this.loadProducts();
      this.loadProductFromURL();
      this.renderProduct();
    } catch (error) {
      console.error('Erro ao inicializar ProductManager:', error);
    }
  }

  async loadProducts() {
    try {
      // Adicionar timestamp para evitar cache
      const response = await fetch(`products.json?v=${Date.now()}&t=${Math.random()}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      this.products = data.products;
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      this.products = this.getFallbackProducts();
    }
  }

  getFallbackProducts() {
    return [
      {
        id: "linha-gold",
        name: "Linha Gold IV",
        badge: "Gold",
        badgeType: "gold",
        icon: "fas fa-medal",
        description: "A Linha Gold IV, foi desenvolvida para atender às demandas da arquitetura com elegância, resistência e versatilidade. Com perfis de 32 mm, oferece robustez estrutural e desempenho técnico que a tornam ideal para grandes vãos e composições arquitetônicas exigentes.",
        features: [
          "Design elegante e sofisticado",
          "Funcionalidade superior",
          "Durabilidade comprovada",
          "Versatilidade em aplicações",
          "Excelente vedação",
          "Conforto térmico e acústico"
        ],
        image: "../imgs/Banner Produtos.jpg",
        category: "gold",
        details: {
          perfil: "32mm",
          aplicacao: "Médio a alto padrão",
          tecnologia: "Avançada"
        },
        tipologias: [
          "Porta de Giro",
          "Veneziana – Vidro – Lambril",
          "Porta de Correr",
          "Porta de canto – Opção com tela mosquiteira",
          "Maxim-ar",
          "Quadro Fixo",
          "Janelas de correr",
          "Com persiana",
          "Motorizada integrada"
        ],
        gallery: [
          "../imgs/1.jpg",
          "../imgs/2.jpg",
          "../imgs/3.jpg",
          "../imgs/4.jpg",
          "../imgs/5.jpg",
          "../imgs/6.jpg"
        ]
      }
    ];
  }

  loadProductFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (!productId) {
      // Se não há ID na URL, usar o primeiro produto
      this.currentProduct = this.products[0];
      return;
    }
    
    this.currentProduct = this.products.find(product => product.id === productId);
    
    if (!this.currentProduct) {
      // Se não encontrar o produto específico, usar o primeiro disponível
      this.currentProduct = this.products[0];
    }
  }

  renderProduct() {
    if (!this.currentProduct) return;

    this.updatePageTitle();
    this.updateHeroSection();
    this.updateProductDetails();
    this.updateFeatures();
    this.updateSpecifications();
    this.updateTipologias();
    this.updateGallery();
    this.updateMetaTags();
    this.updateCTATitle();
  }

  updatePageTitle() {
    const title = document.getElementById('page-title');
    if (title) {
      title.textContent = `${this.currentProduct.name} - AllVale · Esquadrias de Alumínio`;
    }
  }

  updateHeroSection() {
    const badge = document.getElementById('product-badge');
    const title = document.getElementById('product-title');
    const subtitle = document.getElementById('product-subtitle');

    if (badge) {
      badge.textContent = this.currentProduct.badge;
      badge.className = `product-badge ${this.currentProduct.badgeType}`;
    }

    if (title) {
      title.textContent = this.currentProduct.name;
    }

    if (subtitle) {
      subtitle.textContent = this.currentProduct.description.split('.')[0] + '.';
    }
  }

  updateProductDetails() {
    const description = document.getElementById('product-description');
    const mainImage = document.getElementById('product-main-image');

    if (description) {
      description.textContent = this.currentProduct.description;
    }

    if (mainImage) {
      mainImage.src = this.currentProduct.image;
      mainImage.alt = this.currentProduct.name;
    }
  }

  updateFeatures() {
    const featuresList = document.getElementById('features-list');
    if (!featuresList || !this.currentProduct.features) return;

    featuresList.innerHTML = this.currentProduct.features
      .map(feature => `
        <div class="feature-item">
          <i class="fas fa-check"></i>
          <span>${feature}</span>
        </div>
      `).join('');
  }

  updateSpecifications() {
    if (!this.currentProduct.details) return;

    const perfil = document.getElementById('spec-perfil');
    const aplicacao = document.getElementById('spec-aplicacao');
    const tecnologia = document.getElementById('spec-tecnologia');

    if (perfil) perfil.textContent = this.currentProduct.details.perfil;
    if (aplicacao) aplicacao.textContent = this.currentProduct.details.aplicacao;
    if (tecnologia) tecnologia.textContent = this.currentProduct.details.tecnologia;
  }

  updateTipologias() {
    const tipologiasSection = document.getElementById('tipologias-section');
    const tipologiasGrid = document.getElementById('tipologias-grid');

    if (!this.currentProduct.tipologias || !tipologiasGrid) {
      if (tipologiasSection) tipologiasSection.style.display = 'none';
      return;
    }

    tipologiasGrid.innerHTML = this.currentProduct.tipologias
      .map(tipologia => `
        <div class="tipologia-item">
          <div class="tipologia-icon">
            <i class="fas fa-cog"></i>
          </div>
          <h3 class="tipologia-name">${tipologia}</h3>
        </div>
      `).join('');
  }

  updateGallery() {
    const gallerySection = document.getElementById('gallery-section');
    const galleryGrid = document.getElementById('gallery-grid');

    if (!this.currentProduct.gallery || !galleryGrid) {
      if (gallerySection) gallerySection.style.display = 'none';
      return;
    }

    galleryGrid.innerHTML = this.currentProduct.gallery
      .map((image, index) => `
        <div class="gallery-item" onclick="openZoomModal(${index})">
          <img src="${image}" alt="${this.currentProduct.name} - Imagem ${index + 1}" loading="lazy">
          <div class="gallery-overlay">
            <i class="fas fa-search-plus"></i>
          </div>
        </div>
      `).join('');
  }

  updateMetaTags() {
    // Atualizar meta tags dinamicamente
    const metaDescription = document.querySelector('meta[name="description"]');
    const metaTitle = document.querySelector('title');
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');

    const title = `${this.currentProduct.name} - AllVale · Esquadrias de Alumínio`;
    const description = `${this.currentProduct.description.substring(0, 150)}...`;

    if (metaDescription) metaDescription.content = description;
    if (metaTitle) metaTitle.textContent = title;
    if (ogTitle) ogTitle.content = title;
    if (ogDescription) ogDescription.content = description;
  }

  updateCTATitle() {
    const ctaTitle = document.getElementById('cta-title');
    if (ctaTitle) {
      ctaTitle.textContent = `Interessado na ${this.currentProduct.name}?`;
    }
  }

  // Método para obter produto por ID (para uso externo)
  getProductById(id) {
    return this.products.find(product => product.id === id);
  }

  // Método para obter todos os produtos
  getAllProducts() {
    return this.products;
  }
}

// Funções do Modal de Zoom (igual ao portfolio)
function openZoomModal(imageIndex) {
  if (!window.productManager || !window.productManager.currentProduct || !window.productManager.currentProduct.gallery) return;
  
  const images = window.productManager.currentProduct.gallery;
  
  window.zoomConfig = {
    currentIndex: imageIndex,
    images: images,
    totalImages: images.length
  };

  updateZoomModal();
  setupZoomModalEvents();
  
  const modal = document.getElementById('zoom-modal');
  modal.classList.add('active');
  document.body.style.overflow = 'hidden'; // Previne scroll da página
}

function closeZoomModal() {
  const modal = document.getElementById('zoom-modal');
  modal.classList.remove('active');
  document.body.style.overflow = ''; // Restaura scroll da página
}

function updateZoomModal() {
  if (!window.zoomConfig) return;

  const { currentIndex, images, totalImages } = window.zoomConfig;
  const zoomImage = document.getElementById('zoom-image');
  const zoomCounter = document.getElementById('zoom-counter');
  const zoomPrev = document.getElementById('zoom-prev');
  const zoomNext = document.getElementById('zoom-next');

  zoomImage.src = images[currentIndex];
  zoomImage.alt = `${window.productManager.currentProduct.name} - Imagem ${currentIndex + 1}`;
  zoomCounter.textContent = `${currentIndex + 1} / ${totalImages}`;

  // Mostrar/ocultar botões de navegação
  zoomPrev.style.display = totalImages > 1 ? 'flex' : 'none';
  zoomNext.style.display = totalImages > 1 ? 'flex' : 'none';
}

function navigateZoom(direction) {
  if (!window.zoomConfig) return;

  const { currentIndex, totalImages } = window.zoomConfig;
  let newIndex = currentIndex + direction;

  // Loop infinito
  if (newIndex < 0) {
    newIndex = totalImages - 1;
  } else if (newIndex >= totalImages) {
    newIndex = 0;
  }

  window.zoomConfig.currentIndex = newIndex;
  updateZoomModal();
}

function setupZoomModalEvents() {
  const modal = document.getElementById('zoom-modal');
  const closeBtn = document.getElementById('zoom-close');
  const prevBtn = document.getElementById('zoom-prev');
  const nextBtn = document.getElementById('zoom-next');

  // Fechar modal
  closeBtn.onclick = () => closeZoomModal();
  
  // Fechar clicando fora da imagem
  modal.onclick = (e) => {
    if (e.target === modal) {
      closeZoomModal();
    }
  };

  // Navegação
  prevBtn.onclick = (e) => {
    e.stopPropagation();
    navigateZoom(-1);
  };

  nextBtn.onclick = (e) => {
    e.stopPropagation();
    navigateZoom(1);
  };

  // Prevenir fechamento ao clicar na imagem
  const zoomImage = document.getElementById('zoom-image');
  zoomImage.onclick = (e) => e.stopPropagation();

  // Teclas de atalho
  document.addEventListener('keydown', handleZoomKeyboard);
}

function handleZoomKeyboard(e) {
  const modal = document.getElementById('zoom-modal');
  if (!modal.classList.contains('active')) return;

  switch(e.key) {
    case 'Escape':
      closeZoomModal();
      break;
    case 'ArrowLeft':
      navigateZoom(-1);
      break;
    case 'ArrowRight':
      navigateZoom(1);
      break;
  }
}

// Função para abrir lightbox da galeria (mantida para compatibilidade)
function openLightbox(imageSrc, index) {
  openZoomModal(index);
}
async function loadHeaderAndFooter() {
  try {
    const headerResponse = await fetch('../partners/header.html');
    if (headerResponse.ok) {
      const headerHtml = await headerResponse.text();
      document.getElementById('header').innerHTML = headerHtml;
    }
    const footerResponse = await fetch('../partners/footer.html');
    if (footerResponse.ok) {
      const footerHtml = await footerResponse.text();
      document.getElementById('footer').innerHTML = footerHtml;
    }
  } catch (error) {
    console.error('Erro ao carregar header/footer:', error);
  }
}
document.addEventListener('DOMContentLoaded', () => {
  loadHeaderAndFooter();
  setTimeout(() => {
    window.productManager = new ProductManager();
  }, 100);
});
function navigateToProduct(productId) {
  const currentUrl = new URL(window.location);
  currentUrl.searchParams.set('id', productId);
  window.location.href = currentUrl.toString();
}
window.ProductManager = ProductManager;
window.navigateToProduct = navigateToProduct;
