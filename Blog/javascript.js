class BlogManager {
  constructor() {
    this.posts = [];
    this.allPosts = [];
    this.categories = [];
    this.settings = {};
    this.currentPage = 1;
    this.postsPerPage = 9; // Layout 3x3 como na Talentus
    this.isLoading = false;
    this.init();
  }

  async init() {
    try {
      console.log('🚀 Inicializando BlogManager...');
      
      await this.loadBlogData();
      await this.loadPosts();
      
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
          console.log('Dados carregados do servidor admin');
        } else {
          throw new Error('Servidor admin não disponível');
        }
      } catch (serverError) {
        console.log('Servidor admin indisponível, usando dados locais');
        console.log('Carregando dados do posts.json local');
        const response = await fetch('./posts.json');
        if (!response.ok) {
          throw new Error('Erro ao carregar dados do blog');
        }
        data = await response.json();
      }
      
      this.allPosts = data.posts.filter(post => post.published);
      this.categories = data.categories;
      this.settings = data.settings;
      this.postsPerPage = this.settings.postsPerPage || 8;
      
      console.log(`${this.allPosts.length} posts carregados`);
      console.log(`${this.categories.length} categorias carregadas`);
      
    } catch (error) {
      console.error('Erro ao carregar dados do blog:', error);
      this.showErrorMessage('Erro ao carregar posts. Verifique se o arquivo posts.json existe.');
    }
  }

  async loadPosts(page = 1) {
    if (this.isLoading) return;
    
    this.isLoading = true;
    this.showLoadingState();

    try {
      const sortedPosts = this.allPosts.sort((a, b) => 
        new Date(b.date) - new Date(a.date)
      );

      const startIndex = (page - 1) * this.postsPerPage;
      const endIndex = startIndex + this.postsPerPage;
      const postsToShow = sortedPosts.slice(startIndex, endIndex);

      this.currentPage = page;
      this.posts = postsToShow;
      this.renderPosts();
      this.renderPagination(sortedPosts.length);

      console.log(`Posts carregados: ${postsToShow.length} de ${sortedPosts.length} total`);
      
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
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
  }

  generatePostLink(slug) {
    return `post.html?slug=${slug}`;
  }

  renderPosts() {
    const container = document.getElementById('blog-posts-container');
    if (!container) return;

    container.innerHTML = '';

    this.posts.forEach((post, index) => {
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

  createPostElement(post) {
    const postDiv = document.createElement('article');
    postDiv.className = 'blog-post';
    
    postDiv.innerHTML = `
      <div class="blog-post-image">
        <img src="${post.image}" alt="${post.title}" loading="lazy">
      </div>
      <div class="blog-post-content">
        <h3 class="blog-post-title">
          <a href="${this.generatePostLink(post.slug)}">${post.title}</a>
        </h3>
        <a href="${this.generatePostLink(post.slug)}" class="blog-post-link">Ler Post »</a>
        <span class="blog-post-date">${this.formatDate(post.date)}</span>
      </div>
    `;

    return postDiv;
  }

  renderPagination(totalPosts) {
    const container = document.getElementById('pagination-container');
    if (!container) return;

    const totalPages = Math.ceil(totalPosts / this.postsPerPage);
    
    if (totalPages <= 1) {
      container.innerHTML = '';
      return;
    }

    let paginationHTML = '';

    // Botão anterior
    if (this.currentPage > 1) {
      paginationHTML += `
        <a href="#" class="pagination-btn" data-page="${this.currentPage - 1}">
          ← Anterior
        </a>
      `;
    }

    // Páginas numeradas
    const startPage = Math.max(1, this.currentPage - 2);
    const endPage = Math.min(totalPages, this.currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      const isActive = i === this.currentPage ? 'active' : '';
      paginationHTML += `
        <a href="#" class="pagination-btn ${isActive}" data-page="${i}">
          ${i}
        </a>
      `;
    }

    // Botão próximo
    if (this.currentPage < totalPages) {
      paginationHTML += `
        <a href="#" class="pagination-btn" data-page="${this.currentPage + 1}">
          Próximo →
        </a>
      `;
    }

    container.innerHTML = paginationHTML;

    // Adicionar event listeners
    const paginationBtns = container.querySelectorAll('.pagination-btn');
    paginationBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const page = parseInt(btn.getAttribute('data-page'));
        if (page && page !== this.currentPage) {
          this.loadPosts(page);
          // Scroll para o topo dos posts
          document.getElementById('blog-posts-container').scrollIntoView({ 
            behavior: 'smooth' 
          });
        }
      });
    });
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
            window.blogManager.loadPosts(1);
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
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
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