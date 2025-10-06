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
      const response = await fetch('products.json');
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
    const productId = urlParams.get('id') || 'linha-gold';
    
    this.currentProduct = this.products.find(product => product.id === productId);
    
    if (!this.currentProduct) {
      // Fallback para o primeiro produto se não encontrar
      this.currentProduct = this.products[0] || this.getFallbackProducts()[0];
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
        <div class="gallery-item" onclick="openLightbox('${image}', ${index})">
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

  // Método para obter produto por ID (para uso externo)
  getProductById(id) {
    return this.products.find(product => product.id === id);
  }

  // Método para obter todos os produtos
  getAllProducts() {
    return this.products;
  }
}

// Função para abrir lightbox da galeria
function openLightbox(imageSrc, index) {
  // Implementação simples do lightbox
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <div class="lightbox-content">
      <span class="lightbox-close" onclick="closeLightbox()">&times;</span>
      <img src="${imageSrc}" alt="Imagem ${index + 1}">
    </div>
  `;
  
  // Estilos do lightbox
  lightbox.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    cursor: pointer;
  `;
  
  const content = lightbox.querySelector('.lightbox-content');
  content.style.cssText = `
    position: relative;
    max-width: 90%;
    max-height: 90%;
    cursor: default;
  `;
  
  const img = lightbox.querySelector('img');
  img.style.cssText = `
    width: 100%;
    height: auto;
    border-radius: 8px;
  `;
  
  const close = lightbox.querySelector('.lightbox-close');
  close.style.cssText = `
    position: absolute;
    top: -40px;
    right: 0;
    color: white;
    font-size: 30px;
    cursor: pointer;
    background: rgba(0, 0, 0, 0.5);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  `;
  
  document.body.appendChild(lightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });
}

function closeLightbox() {
  const lightbox = document.querySelector('.lightbox');
  if (lightbox) {
    lightbox.remove();
  }
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
