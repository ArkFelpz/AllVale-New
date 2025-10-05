class BlogManager {
  constructor() {
    this.posts = [];
    this.allPosts = [];
    this.categories = [];
    this.settings = {};
    this.currentPage = 1;
    this.postsPerPage = 6;
    this.currentCategory = 'all';
    this.isLoading = false;
    this.init();
  }

  async init() {
    try {
      console.log('🚀 Inicializando BlogManager...');
      
      this.setupEventListeners();
      this.setupCategoryFilter();
      this.setupNewsletterForm();
      this.setupSearch();
      this.setupTags();
      this.setupClearFilters();
      
      console.log('📝 Carregando dados do blog...');
      await this.loadBlogData();
      
      console.log('🔄 Configurando scroll infinito...');
      this.setupInfiniteScroll();
      
      console.log('✅ BlogManager inicializado com sucesso!');
    } catch (error) {
      console.error('❌ Erro na inicialização do BlogManager:', error);
      this.showErrorMessage('Erro ao inicializar o blog. Recarregue a página.');
    }
  }

  async loadBlogData() {
    try {
      let data;
      
      try {
        console.log('🌐 Tentando carregar dados do servidor admin...');
        const response = await fetch('https://seu-servidor.com/allvale-admin/api/posts.json', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (response.ok) {
          data = await response.json();
          console.log('✅ Dados carregados do servidor admin');
        } else {
          throw new Error('Servidor admin não disponível');
        }
      } catch (serverError) {
        console.log('⚠️ Servidor admin indisponível, usando dados locais');
        console.log('📁 Carregando dados do posts.json local');
        const response = await fetch('./posts.json');
        if (!response.ok) {
          throw new Error('Erro ao carregar dados do blog');
        }
        data = await response.json();
      }
      
      this.allPosts = data.posts.filter(post => post.published);
      this.categories = data.categories;
      this.settings = data.settings;
      this.postsPerPage = this.settings.postsPerPage || 6;
      
      console.log(`📰 ${this.allPosts.length} posts carregados`);
      console.log(`📂 ${this.categories.length} categorias carregadas`);
      
      this.updateCategoriesList();
      
      this.loadPopularTags();
      
      await this.loadPosts();
      await this.loadRecentPosts();
      
    } catch (error) {
      console.error('Erro ao carregar dados do blog:', error);
      this.showErrorMessage('Erro ao carregar posts. Verifique se o arquivo posts.json existe.');
    }
  }

  async loadPosts(page = 1, category = 'all') {
    if (this.isLoading) return;
    
    this.isLoading = true;
    this.showLoadingState();

    try {
      let filteredPosts = this.allPosts;

      if (category !== 'all') {
        filteredPosts = this.allPosts.filter(post => 
          post.category.toLowerCase() === category.toLowerCase()
        );
      }

      filteredPosts = filteredPosts.sort((a, b) => 
        new Date(b.date) - new Date(a.date)
      );

      const startIndex = (page - 1) * this.postsPerPage;
      const endIndex = startIndex + this.postsPerPage;
      const postsToShow = filteredPosts.slice(startIndex, endIndex);

      if (page === 1) {
        this.posts = postsToShow;
        this.renderPosts();
        if (postsToShow.length > 0) {
          this.updateFeaturedPost(postsToShow.find(post => post.featured) || postsToShow[0]);
        }
      } else {
        this.posts = [...this.posts, ...postsToShow];
        this.appendPosts(postsToShow);
      }

      this.updateLoadMoreButton(filteredPosts.length > endIndex);
      
      console.log(`Posts carregados: ${postsToShow.length} de ${filteredPosts.length} total`);
      
    } catch (error) {
      console.error('Erro ao carregar posts:', error);
      this.showErrorMessage('Erro ao carregar posts. Tente recarregar a página.');
    } finally {
      this.isLoading = false;
      this.hideLoadingState();
    }
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
  }

  generatePostLink(slug) {
    return `post.html?slug=${slug}`;
  }

  updateFeaturedPost(post) {
    if (!post) return;

    const elements = {
      title: document.getElementById('featured-post-title'),
      excerpt: document.getElementById('featured-post-excerpt'),
      image: document.getElementById('featured-post-img'),
      date: document.getElementById('featured-post-date'),
      category: document.getElementById('featured-post-category'),
      link: document.getElementById('featured-post-link')
    };

    if (elements.title) elements.title.textContent = post.title;
    if (elements.excerpt) elements.excerpt.textContent = post.excerpt;
    if (elements.image) elements.image.src = post.image;
    if (elements.date) elements.date.textContent = this.formatDate(post.date);
    
    const categoryObj = this.categories.find(cat => cat.id === post.category);
    if (elements.category) elements.category.textContent = categoryObj ? categoryObj.name : post.category;
    
    if (elements.link) elements.link.href = this.generatePostLink(post.slug);
  }

  renderPosts() {
    const container = document.getElementById('blog-posts-container');
    if (!container) return;

    container.innerHTML = '';

    const postsToRender = this.posts.slice(1);

    postsToRender.forEach((post, index) => {
      const postElement = this.createPostElement(post);
      postElement.style.animationDelay = `${index * 0.1}s`;
      container.appendChild(postElement);
    });

    setTimeout(() => {
      const posts = container.querySelectorAll('.blog-post');
      posts.forEach(post => {
        post.classList.add('animate-in');
      });
    }, 100);
  }

  appendPosts(newPosts) {
    const container = document.getElementById('blog-posts-container');
    if (!container) return;

    newPosts.forEach((post, index) => {
      const postElement = this.createPostElement(post);
      postElement.style.animationDelay = `${index * 0.1}s`;
      container.appendChild(postElement);
    });

    setTimeout(() => {
      const newPostElements = container.querySelectorAll('.blog-post:not(.animate-in)');
      newPostElements.forEach(post => {
        post.classList.add('animate-in');
      });
    }, 100);
  }

  createPostElement(post) {
    const postDiv = document.createElement('article');
    postDiv.className = 'blog-post reveal-fade-slide';
    
    const categoryObj = this.categories.find(cat => cat.id === post.category);
    const categoryName = categoryObj ? categoryObj.name : post.category;
    
    postDiv.innerHTML = `
      <div class="blog-post-image">
        <img src="${post.image}" alt="${post.title}" loading="lazy">
      </div>
      <div class="blog-post-content">
        <div class="blog-post-meta">
          <span class="post-date">${this.formatDate(post.date)}</span>
          <span class="post-category">${categoryName}</span>
        </div>
        <h3 class="blog-post-title">
          <a href="${this.generatePostLink(post.slug)}">${post.title}</a>
        </h3>
        <p class="blog-post-excerpt">${post.excerpt}</p>
        <a href="${this.generatePostLink(post.slug)}" class="blog-post-link">Ler Mais</a>
      </div>
    `;

    return postDiv;
  }

  async loadRecentPosts() {
    const recentPosts = this.allPosts.slice(0, this.settings.recentPostsCount || 4);
    const container = document.getElementById('recent-posts');
    
    if (!container || recentPosts.length === 0) return;

    container.innerHTML = '';

    recentPosts.forEach(post => {
      const recentPostDiv = document.createElement('div');
      recentPostDiv.className = 'recent-post';
      
      recentPostDiv.innerHTML = `
        <div class="recent-post-image">
          <img src="${post.image}" alt="${post.title}" loading="lazy">
        </div>
        <div class="recent-post-content">
          <h4 class="recent-post-title">
            <a href="${this.generatePostLink(post.slug)}">${post.title}</a>
          </h4>
          <span class="recent-post-date">${this.formatDate(post.date)}</span>
        </div>
      `;

      container.appendChild(recentPostDiv);
    });
  }

  setupCategoryFilter() {
    const categoryLinks = document.querySelectorAll('[data-category]');
    
    categoryLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const category = link.getAttribute('data-category');
        
        categoryLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        this.currentCategory = category;
        this.currentPage = 1;
        this.loadPosts(1, category);
        
        if (category !== 'all') {
          this.showClearFiltersButton();
        } else {
          this.hideClearFiltersButton();
        }
      });
    });
  }

  updateCategoriesList() {
    const categoriesList = document.getElementById('categories-list');
    if (!categoriesList) return;

    categoriesList.innerHTML = '';

    const allItem = document.createElement('li');
    allItem.innerHTML = '<a href="#" data-category="all">Todas</a>';
    categoriesList.appendChild(allItem);

    this.categories.forEach(category => {
      const categoryItem = document.createElement('li');
      categoryItem.innerHTML = `<a href="#" data-category="${category.id}">${category.name}</a>`;
      categoriesList.appendChild(categoryItem);
    });

    this.setupCategoryFilter();
  }

  setupNewsletterForm() {
    const form = document.getElementById('newsletter-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = form.querySelector('input[type="email"]').value;
      
      try {
        await this.subscribeNewsletter(email);
        this.showSuccessMessage('Inscrição realizada com sucesso!');
        form.reset();
      } catch (error) {
        console.error('Erro na inscrição:', error);
        this.showErrorMessage('Erro ao realizar inscrição. Tente novamente.');
      }
    });
  }

  async subscribeNewsletter(email) {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Email inscrito:', email);
        resolve();
      }, 1000);
    });
  }

  setupInfiniteScroll() {
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (!loadMoreBtn) return;

    loadMoreBtn.addEventListener('click', () => {
      this.currentPage++;
      this.loadPosts(this.currentPage, this.currentCategory);
    });

    window.addEventListener('scroll', () => {
      if (this.isLoading) return;

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (scrollTop + windowHeight >= documentHeight - 1000) {
        this.currentPage++;
        this.loadPosts(this.currentPage, this.currentCategory);
      }
    });
  }

  updateLoadMoreButton(hasMore) {
    const btn = document.getElementById('load-more-btn');
    if (!btn) return;

    if (hasMore) {
      btn.style.display = 'inline-flex';
    } else {
      btn.style.display = 'none';
    }
  }

  showLoadingState() {
    const container = document.getElementById('blog-posts-container');
    if (container) {
      container.classList.add('loading');
    }
  }

  hideLoadingState() {
    const container = document.getElementById('blog-posts-container');
    if (container) {
      container.classList.remove('loading');
    }
  }

  showErrorMessage(message) {
    this.showMessage(message, 'error');
  }

  showSuccessMessage(message) {
    this.showMessage(message, 'success');
  }

  // Mostrar mensagem
  showMessage(message, type) {
    const container = document.querySelector('.blog-content-section .container');
    if (!container) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `${type}-message`;
    messageDiv.textContent = message;

    container.insertBefore(messageDiv, container.firstChild);

    setTimeout(() => {
      if (messageDiv.parentNode) {
        messageDiv.parentNode.removeChild(messageDiv);
      }
    }, 5000);
  }

  searchPosts(searchTerm) {
    if (!searchTerm || searchTerm.trim() === '') {
      return this.allPosts;
    }

    const term = searchTerm.toLowerCase().trim();
    return this.allPosts.filter(post => 
      post.title.toLowerCase().includes(term) ||
      post.excerpt.toLowerCase().includes(term) ||
      post.content.toLowerCase().includes(term) ||
      post.tags.some(tag => tag.toLowerCase().includes(term))
    );
  }

  getRelatedPosts(currentPost, limit = 3) {
    return this.allPosts
      .filter(post => 
        post.id !== currentPost.id && 
        (post.category === currentPost.category || 
         post.tags.some(tag => currentPost.tags.includes(tag)))
      )
      .slice(0, limit);
  }

  // Configurar funcionalidade de busca
  setupSearch() {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    
    if (!searchForm || !searchInput) return;

    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.performSearch(searchInput.value);
    });

    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim();
      if (query.length >= 2) {
        this.showSearchResults(this.searchPosts(query));
      } else {
        this.hideSearchResults();
      }
    });
  }

  // Realizar busca
  performSearch(query) {
    if (!query.trim()) return;

    const results = this.searchPosts(query);
    this.showSearchResults(results);
    
    // Filtrar posts principais
    this.posts = results;
    this.renderPosts();
    
    // Atualizar botão de carregar mais
    this.updateLoadMoreButton(false);
    
    // Mostrar botão de limpar filtros
    this.showClearFiltersButton();
  }

  // Mostrar resultados da busca
  showSearchResults(results) {
    const container = document.getElementById('search-results');
    if (!container) return;

    if (results.length === 0) {
      container.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">Nenhum resultado encontrado.</p>';
    } else {
      container.innerHTML = '';
      results.slice(0, 5).forEach(post => {
        const resultItem = document.createElement('div');
        resultItem.className = 'search-result-item';
        resultItem.innerHTML = `
          <div class="search-result-title">${post.title}</div>
          <div class="search-result-excerpt">${BlogUtils.truncateText(post.excerpt, 80)}</div>
        `;
        
        resultItem.addEventListener('click', () => {
          window.location.href = this.generatePostLink(post.slug);
        });
        
        container.appendChild(resultItem);
      });
    }

    container.style.display = 'block';
  }

  // Esconder resultados da busca
  hideSearchResults() {
    const container = document.getElementById('search-results');
    if (container) {
      container.style.display = 'none';
    }
  }

  // Configurar funcionalidade de tags
  setupTags() {
    // Tags serão carregadas após os dados do blog
  }

  // Carregar tags populares
  loadPopularTags() {
    const container = document.getElementById('tags-cloud');
    if (!container) return;

    // Coletar todas as tags
    const allTags = {};
    this.allPosts.forEach(post => {
      post.tags.forEach(tag => {
        allTags[tag] = (allTags[tag] || 0) + 1;
      });
    });

    // Ordenar por frequência e pegar as mais populares
    const popularTags = Object.entries(allTags)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([tag, count]) => ({ tag, count }));

    container.innerHTML = '';

    popularTags.forEach(({ tag, count }) => {
      const tagElement = document.createElement('a');
      tagElement.href = '#';
      tagElement.className = 'tag-cloud-item';
      
      // Definir tamanho baseado na frequência
      if (count >= 3) tagElement.classList.add('large');
      else if (count === 1) tagElement.classList.add('small');
      
      tagElement.textContent = tag;
      tagElement.title = `${count} posts`;
      
      tagElement.addEventListener('click', (e) => {
        e.preventDefault();
        this.filterByTag(tag);
      });
      
      container.appendChild(tagElement);
    });
  }

  // Filtrar posts por tag
  filterByTag(tag) {
    const filteredPosts = this.allPosts.filter(post => 
      post.tags.some(postTag => postTag.toLowerCase() === tag.toLowerCase())
    );

    this.posts = filteredPosts;
    this.renderPosts();
    this.updateLoadMoreButton(false);
    
    // Mostrar botão de limpar filtros
    this.showClearFiltersButton();
    
    // Mostrar mensagem de filtro
    this.showSuccessMessage(`Mostrando posts com a tag "${tag}"`);
  }

  // Configurar botão de limpar filtros
  setupClearFilters() {
    const clearFiltersBtn = document.getElementById('clear-filters-btn');
    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener('click', () => {
        this.clearFilters();
      });
    }
  }

  // Limpar filtros
  clearFilters() {
    this.currentCategory = 'all';
    this.currentPage = 1;
    this.loadPosts();
    
    // Limpar busca
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.value = '';
      this.hideSearchResults();
    }

    // Limpar categoria ativa
    const categoryLinks = document.querySelectorAll('[data-category]');
    categoryLinks.forEach(link => link.classList.remove('active'));
    const allCategoryLink = document.querySelector('[data-category="all"]');
    if (allCategoryLink) {
      allCategoryLink.classList.add('active');
    }

    // Esconder botão de limpar filtros
    this.hideClearFiltersButton();
    
    this.showSuccessMessage('Filtros limpos com sucesso!');
  }

  // Mostrar botão de limpar filtros
  showClearFiltersButton() {
    const container = document.getElementById('clear-filters-container');
    if (container) {
      container.style.display = 'block';
    }
  }

  // Esconder botão de limpar filtros
  hideClearFiltersButton() {
    const container = document.getElementById('clear-filters-container');
    if (container) {
      container.style.display = 'none';
    }
  }

  // Configurar event listeners
  setupEventListeners() {
    // Atualizar posts recentes quando posts principais mudarem
    const observer = new MutationObserver(() => {
      this.loadRecentPosts();
    });

    const postsContainer = document.getElementById('blog-posts-container');
    if (postsContainer) {
      observer.observe(postsContainer, { childList: true });
    }
  }
}

// Sistema de sincronização com servidor admin
class BlogSyncManager {
  constructor() {
    this.syncInterval = 300000; // 5 minutos
    this.lastSync = null;
    this.init();
  }

  async init() {
    // Verificar atualizações periodicamente
    setInterval(() => {
      this.checkForUpdates();
    }, this.syncInterval);

    // Verificar atualizações na inicialização
    await this.checkForUpdates();
  }

  async checkForUpdates() {
    try {
      const response = await fetch('https://seu-servidor.com/allvale-admin/api/posts.json?' + Date.now(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        const lastModified = response.headers.get('Last-Modified');
        
        if (this.lastSync !== lastModified) {
          console.log('🔄 Novos dados disponíveis, atualizando blog...');
          this.lastSync = lastModified;
          
          // Recarregar blog com novos dados
          if (window.blogManager) {
            window.blogManager.allPosts = data.posts.filter(post => post.published);
            window.blogManager.categories = data.categories;
            window.blogManager.settings = data.settings;
            window.blogManager.loadPosts(1, window.blogManager.currentCategory);
            window.blogManager.loadRecentPosts();
          }
        }
      }
    } catch (error) {
      console.log('⚠️ Erro ao verificar atualizações:', error.message);
    }
  }
}

// Inicializar blog quando DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
  // Inicializar gerenciador do blog
  window.blogManager = new BlogManager();
  
  // Inicializar sistema de sincronização
  window.blogSyncManager = new BlogSyncManager();
});

// Funções utilitárias globais
window.BlogUtils = {
  // Formatar data
  formatDate: (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },

  // Truncar texto
  truncateText: (text, length = 150) => {
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
  },

  // Gerar slug
  generateSlug: (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  },

  // Obter parâmetro da URL
  getUrlParameter: (name) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  },

  // Validar email
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
};
