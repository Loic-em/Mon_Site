// ===== CART =====
let cart = [];

function toggleCart() {
  const sidebar = document.getElementById('cartSidebar');
  const overlay = document.getElementById('cartOverlay');
  sidebar.classList.toggle('open');
  overlay.classList.toggle('open');

  // Animation feedback
  if (sidebar.classList.contains('open')) {
    sidebar.style.animation = 'slideInRight 0.4s ease';
  }
}

function addToCart(name, price) {
  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ name, price, qty: 1 });
  }
  updateCart();
  showNotification(`✓ ${name} ajouté au panier !`);

  // Pulse animation on cart button
  const cartBtn = document.querySelector('.cart-btn');
  cartBtn.style.animation = 'pulse 0.6s ease';
  setTimeout(() => cartBtn.style.animation = '', 600);
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
}

function updateCart() {
  const countEl = document.getElementById('cart-count');
  const itemsEl = document.getElementById('cartItems');
  const footerEl = document.getElementById('cartFooter');
  const totalEl = document.getElementById('cartTotal');

  const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  countEl.textContent = totalItems;

  if (cart.length === 0) {
    itemsEl.innerHTML = '<p class="cart-empty">Votre panier est vide.</p>';
    footerEl.style.display = 'none';
  } else {
    itemsEl.innerHTML = cart.map((item, i) => `
      <div class="cart-item" style="animation: fadeInUp 0.3s ease;">
        <div>
          <div class="cart-item-name">${item.name}</div>
          <div style="font-size:12px;color:#888;">Qté: ${item.qty}</div>
        </div>
        <div style="display:flex;align-items:center;gap:12px;">
          <span class="cart-item-price">${(item.price * item.qty).toLocaleString()} FCFA</span>
          <button class="cart-item-remove" onclick="removeFromCart(${i})">✕</button>
        </div>
      </div>
    `).join('');
    footerEl.style.display = 'block';
    totalEl.textContent = totalPrice.toLocaleString() + ' FCFA';
  }
}

function passOrder() {
  if (cart.length === 0) return;
  const items = cart.map(i => `${i.qty}x ${i.name} (${(i.price * i.qty).toLocaleString()} FCFA)`).join('\n');
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const msg = encodeURIComponent(`Bonjour LAFNA ! 👋\n\nJe voudrais commander :\n${items}\n\nTotal : ${total.toLocaleString()} FCFA\n\nMerci !`);
  window.open(`https://wa.me/22500000000?text=${msg}`, '_blank');
}

// ===== FILTER =====
function filterProducts(category, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const cards = document.querySelectorAll('.product-card');
  let visibleCount = 0;

  cards.forEach((card, index) => {
    const shouldShow = category === 'all' || card.dataset.category === category;
    
    if (shouldShow) {
      card.classList.remove('hidden');
      card.style.animation = 'none';
      void card.offsetWidth; // Force reflow
      card.style.animation = `fadeInUp 0.5s ease ${index * 0.05}s forwards`;
      card.style.opacity = '0';
      visibleCount++;
    } else {
      card.classList.add('hidden');
    }
  });
}

// ===== MOUSE FOLLOW EFFECT ON CARDS =====
document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.collection-card');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--mouse-x', '50%');
      card.style.setProperty('--mouse-y', '50%');
    });
  });
});

// ===== MOBILE MENU =====
function toggleMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
}

// ===== NOTIFICATION =====
function showNotification(message) {
  const notif = document.getElementById('notification');
  notif.textContent = message;
  notif.classList.remove('show');
  
  // Force reflow
  void notif.offsetWidth;
  
  notif.classList.add('show');
  setTimeout(() => notif.classList.remove('show'), 3500);
}

// ===== CONTACT FORM =====
function submitForm(e) {
  e.preventDefault();
  const name = document.getElementById('fname').value;
  const phone = document.getElementById('fphone').value;
  const model = document.getElementById('fmodel').value;
  const message = document.getElementById('fmessage').value;

  const msg = encodeURIComponent(
    `Bonjour LAFNA ! 👋\n\nNom : ${name}\nTéléphone : ${phone}\nModèle : ${model || 'Non précisé'}\nMessage : ${message || 'Aucun message'}\n\nMerci !`
  );
  window.open(`https://wa.me/22500000000?text=${msg}`, '_blank');
  showNotification('✓ Votre demande a été envoyée !');
  e.target.reset();
}

// ===== NAVBAR SCROLL =====
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (window.scrollY > 50) {
    nav.style.background = 'rgba(10,10,10,0.98)';
  } else {
    nav.style.background = 'rgba(10,10,10,0.95)';
  }
});

// ===== SCROLL REVEAL & PARALLAX =====
const observerOptions = {
  threshold: [0, 0.1, 0.5],
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('reveal-visible');
      
      // Add stagger animation
      if (entry.target.parentElement && entry.target.parentElement.className.includes('grid')) {
        const siblings = entry.target.parentElement.querySelectorAll('[style*="opacity"]');
        const index = Array.from(siblings).indexOf(entry.target);
        entry.target.style.animationDelay = `${index * 0.1}s`;
      }
    }
  });
}, observerOptions);

// Parallax effect for hero section
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    heroBg.style.transform = `translateY(${scrollY * 0.5}px)`;
  }

  // Navbar animation
  const nav = document.getElementById('navbar');
  if (scrollY > 50) {
    nav.style.background = 'rgba(10,10,10,0.98)';
    nav.style.boxShadow = '0 8px 32px rgba(0,0,0,0.5)';
  } else {
    nav.style.background = 'rgba(10,10,10,0.95)';
    nav.style.boxShadow = 'none';
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const elements = document.querySelectorAll(
    '.collection-card, .product-card, .testi-card, .value-item, .contact-item'
  );
  
  elements.forEach((el) => {
    el.classList.add('reveal-element');
    el.style.opacity = '0';
    el.style.transform = 'translateY(40px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
    observer.observe(el);
  });

  // Add CSS for reveal animation
  const style = document.createElement('style');
  style.textContent = `
    .reveal-element.reveal-visible {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);
});
