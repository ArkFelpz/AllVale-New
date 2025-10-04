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
      console.log('Seção de estatísticas detectada na viewport');
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

// Validação do formulário
function validateForm() {
  const form = document.getElementById('contactForm');
  const name = document.getElementById('name');
  const email = document.getElementById('email');
  const subject = document.getElementById('subject');
  const message = document.getElementById('message');
  
  let isValid = true;
  
  // Limpar erros anteriores
  document.querySelectorAll('.error-message').forEach(error => error.remove());
  document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(input => {
    input.classList.remove('error');
  });
  
  // Validar nome
  if (!name.value.trim()) {
    showError(name, 'Nome é obrigatório');
    isValid = false;
  }
  
  // Validar email
  if (!email.value.trim()) {
    showError(email, 'E-mail é obrigatório');
    isValid = false;
  } else if (!isValidEmail(email.value)) {
    showError(email, 'E-mail inválido');
    isValid = false;
  }
  
  // Validar assunto
  if (!subject.value) {
    showError(subject, 'Assunto é obrigatório');
    isValid = false;
  }
  
  // Validar mensagem
  if (!message.value.trim()) {
    showError(message, 'Mensagem é obrigatória');
    isValid = false;
  }
  
  return isValid;
}

function showError(field, message) {
  field.classList.add('error');
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.textContent = message;
  errorDiv.style.color = '#e74c3c';
  errorDiv.style.fontSize = '14px';
  errorDiv.style.marginTop = '5px';
  field.parentNode.appendChild(errorDiv);
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Máscara para telefone
function formatPhone(input) {
  // Remove todos os caracteres não numéricos
  let value = input.value.replace(/\D/g, '');
  
  // Limita a 13 dígitos (55 + 2 dígitos DDD + 9 dígitos número)
  if (value.length > 13) {
    value = value.substring(0, 13);
  }
  
  // Aplica a máscara conforme o usuário digita
  if (value.length === 0) {
    input.value = '';
  } else if (value.length <= 2) {
    // +55
    input.value = `+${value}`;
  } else if (value.length <= 4) {
    // +55 12
    input.value = `+${value.substring(0, 2)} ${value.substring(2)}`;
  } else if (value.length <= 7) {
    // +55 12-997
    input.value = `+${value.substring(0, 2)} ${value.substring(2, 4)}-${value.substring(4)}`;
  } else if (value.length <= 11) {
    // +55 12-9977-7
    input.value = `+${value.substring(0, 2)} ${value.substring(2, 4)}-${value.substring(4, 8)}-${value.substring(8)}`;
  } else {
    // +55 12-99777-6486
    input.value = `+${value.substring(0, 2)} ${value.substring(2, 4)}-${value.substring(4, 9)}-${value.substring(9)}`;
  }
}

// Função para tentar envio automático via webhook/API
async function tryAutoSend(name, email, phone, subject, message, whatsappNumber) {
  // URL do seu webhook/API (substitua pela sua URL real)
  const webhookURL = 'https://seu-servidor.com/webhook/whatsapp';
  
  // Dados para enviar
  const payload = {
    name: name,
    email: email,
    phone: phone,
    subject: subject,
    message: message,
    whatsappNumber: whatsappNumber,
    timestamp: new Date().toISOString()
  };
  
  try {
    const response = await fetch(webhookURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });
    
    if (response.ok) {
      const result = await response.json();
      return result.success === true;
    }
    return false;
  } catch (error) {
    console.log('Webhook não configurado ou indisponível, usando método manual');
    return false;
  }
}

function showAutoSendSuccess() {
  const form = document.getElementById('contactForm');
  const successDiv = document.createElement('div');
  successDiv.className = 'auto-send-success';
  successDiv.innerHTML = `
    <div style="
      background: linear-gradient(139deg, #25D366 0%, #128C7E 100%);
      color: white;
      padding: 25px;
      border-radius: 12px;
      text-align: center;
      margin-top: 20px;
      font-weight: 600;
      box-shadow: 0 10px 30px rgba(37, 211, 102, 0.2);
    ">
      <i class="fas fa-check-circle" style="font-size: 32px; margin-bottom: 15px; animation: bounce 2s infinite;"></i>
      <h4 style="margin-bottom: 10px; font-size: 18px;">Mensagem Enviada!</h4>
      <p style="font-size: 16px; margin-bottom: 15px;">Sua mensagem foi enviada automaticamente pelo WhatsApp.</p>
      <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 8px; font-size: 14px;">
        <p><strong>Status:</strong> Enviada com sucesso!</p>
        <p style="margin-top: 8px; opacity: 0.9;">Você receberá uma resposta em breve.</p>
      </div>
    </div>
  `;
  
  // Adicionar animação CSS
  const style = document.createElement('style');
  style.textContent = `
    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
      40% { transform: translateY(-10px); }
      60% { transform: translateY(-5px); }
    }
  `;
  document.head.appendChild(style);
  
  form.appendChild(successDiv);
  
  // Remover mensagem após 5 segundos
  setTimeout(() => {
    successDiv.remove();
  }, 5000);
}

// Envio do formulário
function handleFormSubmit(event) {
  event.preventDefault();
  
  if (!validateForm()) {
    return;
  }
  
  // Coletar dados do formulário
  const formData = new FormData(event.target);
  const name = formData.get('name');
  const email = formData.get('email');
  const phoneFormatted = formData.get('phone');
  const phone = phoneFormatted.replace(/\D/g, ''); // Remove formatação, mantém apenas números
  const subject = formData.get('subject');
  const message = formData.get('message');
  
  // Número do WhatsApp (substitua pelo número real da empresa)
  const whatsappNumber = "5512997776486"; // Formato: código do país + DDD + número (sem símbolos)
  
  // Criar mensagem formatada
  const whatsappMessage = `Olá, vim pelo site da AllVale

*Nome completo:* ${name}
*E-mail:* ${email}
*Telefone:* ${phoneFormatted || 'Não informado'}
*Assunto:* ${subject}
*Mensagem:* ${message}`;
  
  // Codificar mensagem para URL
  const encodedMessage = encodeURIComponent(whatsappMessage);
  
  // URL do WhatsApp Web/App
  const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
  
  // Detectar se é mobile para abrir app ou web
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // Tentar método automático primeiro (se configurado)
  tryAutoSend(name, email, phone, subject, message, whatsappNumber).then(success => {
    if (success) {
      // Se o envio automático funcionou
      showAutoSendSuccess();
      document.getElementById('contactForm').reset();
    } else {
      // Fallback para o método manual
      if (isMobile) {
        window.location.href = whatsappURL;
      } else {
        window.open(whatsappURL, '_blank');
      }
      showWhatsAppInstructions();
      document.getElementById('contactForm').reset();
    }
  }).catch(() => {
    // Em caso de erro, usar método manual
    if (isMobile) {
      window.location.href = whatsappURL;
    } else {
      window.open(whatsappURL, '_blank');
    }
    showWhatsAppInstructions();
    document.getElementById('contactForm').reset();
  });
}

function showWhatsAppInstructions() {
  const form = document.getElementById('contactForm');
  const instructionsDiv = document.createElement('div');
  instructionsDiv.className = 'whatsapp-instructions';
  instructionsDiv.innerHTML = `
    <div style="
      background: linear-gradient(139deg, #25D366 0%, #128C7E 100%);
      color: white;
      padding: 25px;
      border-radius: 12px;
      text-align: center;
      margin-top: 20px;
      font-weight: 600;
      box-shadow: 0 10px 30px rgba(37, 211, 102, 0.2);
    ">
      <i class="fab fa-whatsapp" style="font-size: 32px; margin-bottom: 15px; animation: pulse 2s infinite;"></i>
      <h4 style="margin-bottom: 10px; font-size: 18px;">WhatsApp Aberto!</h4>
      <p style="font-size: 16px; margin-bottom: 15px;">Sua mensagem já está formatada e pronta.</p>
      <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 8px; font-size: 14px;">
        <p><strong>Próximo passo:</strong> Clique em "Enviar" no WhatsApp</p>
        <p style="margin-top: 8px; opacity: 0.9;">Sua mensagem será enviada instantaneamente!</p>
      </div>
    </div>
  `;
  
  // Adicionar animação CSS
  const style = document.createElement('style');
  style.textContent = `
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.1); }
      100% { transform: scale(1); }
    }
  `;
  document.head.appendChild(style);
  
  form.appendChild(instructionsDiv);
  
  // Remover mensagem após 8 segundos
  setTimeout(() => {
    instructionsDiv.remove();
  }, 8000);
}

// Aplicar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
  // Observer para estatísticas
  const statsSection = document.querySelector('.contact-stats');
  if (statsSection) {
    statsObserver.observe(statsSection);
    
    // Fallback para mobile: se após 2 segundos as animações não dispararam, forçar
    setTimeout(() => {
      const statNumbers = statsSection.querySelectorAll('.stat-number:not(.animated)');
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
  
  // ============================================
  // FORMULÁRIO DE CONTATO
  // ============================================
  
  // Máscara para telefone
  const phoneInput = document.getElementById('phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', () => formatPhone(phoneInput));
    phoneInput.addEventListener('keypress', (e) => {
      // Permite apenas números e algumas teclas especiais
      const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight'];
      if (!allowedKeys.includes(e.key) && (e.key < '0' || e.key > '9')) {
        e.preventDefault();
      }
    });
  }
  
  // Envio do formulário
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', handleFormSubmit);
  }
  
  // Validação em tempo real
  const formInputs = document.querySelectorAll('.contact-form-element input, .contact-form-element select, .contact-form-element textarea');
  formInputs.forEach(input => {
    input.addEventListener('blur', () => {
      // Remover classe de erro quando o usuário começar a digitar
      if (input.value.trim()) {
        input.classList.remove('error');
        const errorMessage = input.parentNode.querySelector('.error-message');
        if (errorMessage) {
          errorMessage.remove();
        }
      }
    });
  });
});

// Adicionar estilos para campos com erro
const style = document.createElement('style');
style.textContent = `
  .form-group input.error,
  .form-group select.error,
  .form-group textarea.error {
    border-color: #e74c3c !important;
    background-color: #fdf2f2 !important;
  }
  
  .form-group input.error:focus,
  .form-group select.error:focus,
  .form-group textarea.error:focus {
    box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1) !important;
  }
`;
document.head.appendChild(style);
