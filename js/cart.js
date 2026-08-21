/**
 * Diamond E-Commerce - Cart & Wishlist State Management
 * Persistent localStorage engine with drawer slideout and toast notifications
 */

const Cart = {
  storageKey: 'diamond_cart_v1',
  wishlistKey: 'diamond_wishlist_v1',
  couponKey: 'diamond_active_coupon',
  validCoupons: {
    'DIAMOND10': 0.10, // 10% off
    'TECH2026': 0.15,  // 15% off
    'VIPGIFT': 0.05    // 5% off
  },

  getCart() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Failed to read cart from localStorage", e);
      return [];
    }
  },

  saveCart(items) {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
    this.updateBadges();
    this.renderDrawer();
    window.dispatchEvent(new CustomEvent('diamond:cartUpdated', { detail: { items } }));
  },

  addItem(productId, quantity = 1, options = {}) {
    const product = ProductService.getById(productId);
    if (!product) return false;

    const cart = this.getCart();
    const selectedColor = options.color || product.colors[0];
    const selectedStorage = options.storage || (product.storageOptions ? product.storageOptions[0] : null);
    
    // Calculate final unit price based on storage option
    let unitPrice = product.basePrice;
    if (selectedStorage && selectedStorage.priceMultiplier) {
      unitPrice = Math.round(product.basePrice * selectedStorage.priceMultiplier);
    }

    const uniqueId = `${product.id}-${selectedColor.code}-${selectedStorage ? selectedStorage.size.replace(/\s+/g, '') : 'std'}`;

    const existingIndex = cart.findIndex(item => item.cartItemId === uniqueId);
    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        cartItemId: uniqueId,
        productId: product.id,
        name: product.name,
        brand: product.brand,
        image: product.images[0],
        color: selectedColor,
        storage: selectedStorage,
        unitPrice: unitPrice,
        originalPrice: product.originalPrice ? Math.round(product.originalPrice * (selectedStorage?.priceMultiplier || 1)) : unitPrice,
        quantity: quantity,
        addedAt: new Date().toISOString()
      });
    }

    this.saveCart(cart);
    
    const lang = I18n.getLang();
    const productName = product.name[lang] || product.name.en;
    Toast.show(`${productName} ${I18n.t('addedToCart')}`, 'success');
    
    return true;
  },

  removeItem(cartItemId) {
    let cart = this.getCart();
    cart = cart.filter(item => item.cartItemId !== cartItemId);
    this.saveCart(cart);
    Toast.show(I18n.t('toastItemRemoved'), 'info');
  },

  updateQuantity(cartItemId, quantity) {
    let cart = this.getCart();
    const item = cart.find(i => i.cartItemId === cartItemId);
    if (item) {
      if (quantity <= 0) {
        this.removeItem(cartItemId);
        return;
      }
      item.quantity = quantity;
      this.saveCart(cart);
    }
  },

  clearCart() {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.couponKey);
    this.saveCart([]);
  },

  getCount() {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + item.quantity, 0);
  },

  getSubtotal() {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + (item.unitPrice * item.quantity), 0);
  },

  getCoupon() {
    return localStorage.getItem(this.couponKey) || null;
  },

  applyCoupon(code) {
    if (!code) return { success: false, message: I18n.t('promoInvalid') };
    const normalized = code.trim().toUpperCase();
    if (this.validCoupons[normalized]) {
      localStorage.setItem(this.couponKey, normalized);
      this.saveCart(this.getCart()); // trigger updates
      return { success: true, discountRate: this.validCoupons[normalized], message: I18n.t('promoApplied') };
    }
    return { success: false, message: I18n.t('promoInvalid') };
  },

  removeCoupon() {
    localStorage.removeItem(this.couponKey);
    this.saveCart(this.getCart());
  },

  getDiscountAmount() {
    const coupon = this.getCoupon();
    if (!coupon || !this.validCoupons[coupon]) return 0;
    const rate = this.validCoupons[coupon];
    return Math.round(this.getSubtotal() * rate);
  },

  getTaxAmount() {
    const subtotalAfterDiscount = this.getSubtotal() - this.getDiscountAmount();
    return Math.round(subtotalAfterDiscount * 0.05); // 5% VAT
  },

  getFinalTotal() {
    const subtotal = this.getSubtotal();
    if (subtotal === 0) return 0;
    const discount = this.getDiscountAmount();
    const tax = this.getTaxAmount();
    return (subtotal - discount) + tax;
  },

  // Wishlist Methods
  getWishlist() {
    try {
      const data = localStorage.getItem(this.wishlistKey);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  isInWishlist(productId) {
    const list = this.getWishlist();
    return list.includes(productId);
  },

  toggleWishlist(productId) {
    let list = this.getWishlist();
    const index = list.indexOf(productId);
    let added = false;
    if (index > -1) {
      list.splice(index, 1);
      Toast.show(I18n.t('toastWishlistRemoved'), 'info');
    } else {
      list.push(productId);
      added = true;
      Toast.show(I18n.t('toastWishlistAdded'), 'success');
    }
    localStorage.setItem(this.wishlistKey, JSON.stringify(list));
    this.updateBadges();
    window.dispatchEvent(new CustomEvent('diamond:wishlistUpdated', { detail: { wishlist: list, added, productId } }));
    return added;
  },

  // Update UI Elements with Pop Animations
  updateBadges() {
    const count = this.getCount();
    const wishlistCount = this.getWishlist().length;

    document.querySelectorAll('.cart-count-badge').forEach(badge => {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'inline-flex' : 'none';
      badge.classList.remove('badge-pop');
      void badge.offsetWidth; // force reflow for animation trigger
      if (count > 0) badge.classList.add('badge-pop');
    });

    document.querySelectorAll('.wishlist-count-badge').forEach(badge => {
      badge.textContent = wishlistCount;
      badge.style.display = wishlistCount > 0 ? 'inline-flex' : 'none';
      badge.classList.remove('badge-pop');
      void badge.offsetWidth; // force reflow
      if (wishlistCount > 0) badge.classList.add('badge-pop');
    });
  },

  // Drawer Slide-out UI
  renderDrawer() {
    const drawerContainer = document.getElementById('cart-drawer-items');
    const drawerSubtotal = document.getElementById('cart-drawer-subtotal');
    const drawerEmpty = document.getElementById('cart-drawer-empty');
    const drawerFooter = document.getElementById('cart-drawer-footer');
    if (!drawerContainer) return;

    const cart = this.getCart();
    const lang = I18n.getLang();

    if (cart.length === 0) {
      drawerContainer.innerHTML = '';
      if (drawerEmpty) drawerEmpty.style.display = 'block';
      if (drawerFooter) drawerFooter.style.display = 'none';
      return;
    }

    if (drawerEmpty) drawerEmpty.style.display = 'none';
    if (drawerFooter) drawerFooter.style.display = 'block';

    drawerContainer.innerHTML = cart.map(item => {
      const name = item.name[lang] || item.name.en;
      const colorName = item.color.name[lang] || item.color.name.en;
      const storageSize = item.storage ? item.storage.size : '';

      return `
        <div class="cart-drawer-item" data-cart-id="${item.cartItemId}">
          <div class="cart-drawer-img">
            <img src="${item.image}" alt="${name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=200&q=80'">
          </div>
          <div class="cart-drawer-info">
            <div class="cart-drawer-brand">${item.brand}</div>
            <h4 class="cart-drawer-title">${name}</h4>
            <div class="cart-drawer-variant">
              <span class="color-dot" style="background-color: ${item.color.hex}"></span>
              <span>${colorName}</span>
              ${storageSize ? `<span class="variant-separator">•</span><span>${storageSize}</span>` : ''}
            </div>
            <div class="cart-drawer-row">
              <div class="cart-drawer-qty">
                <button type="button" class="btn-qty-minus" onclick="Cart.updateQuantity('${item.cartItemId}', ${item.quantity - 1})">-</button>
                <span class="qty-number">${item.quantity}</span>
                <button type="button" class="btn-qty-plus" onclick="Cart.updateQuantity('${item.cartItemId}', ${item.quantity + 1})">+</button>
              </div>
              <div class="cart-drawer-price">$${(item.unitPrice * item.quantity).toLocaleString()}</div>
            </div>
          </div>
          <button type="button" class="cart-drawer-remove" onclick="Cart.removeItem('${item.cartItemId}')" title="${I18n.t('tableAction')}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </div>
      `;
    }).join('');

    if (drawerSubtotal) {
      drawerSubtotal.textContent = `$${this.getSubtotal().toLocaleString()}`;
    }
  },

  openDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-drawer-overlay');
    if (drawer && overlay) {
      this.renderDrawer();
      drawer.classList.add('is-open');
      overlay.classList.add('is-open');
      document.body.classList.add('drawer-open');
    }
  },

  closeDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-drawer-overlay');
    if (drawer && overlay) {
      drawer.classList.remove('is-open');
      overlay.classList.remove('is-open');
      document.body.classList.remove('drawer-open');
    }
  },

  init() {
    this.updateBadges();
    this.renderDrawer();

    // Bind drawer trigger buttons
    document.addEventListener('click', (e) => {
      if (e.target.closest('.btn-cart-trigger')) {
        // If not on cart.html, open drawer. If on cart.html, can still open or navigate
        if (!window.location.pathname.endsWith('cart.html')) {
          e.preventDefault();
          this.openDrawer();
        }
      }
      if (e.target.closest('.btn-close-drawer') || e.target.id === 'cart-drawer-overlay') {
        this.closeDrawer();
      }
    });

    window.addEventListener('diamond:languageChanged', () => {
      this.renderDrawer();
    });
  }
};

// Global Toast Notification System
const Toast = {
  container: null,

  init() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'diamond-toast-container';
      this.container.className = 'diamond-toast-container';
      document.body.appendChild(this.container);
    }
  },

  show(message, type = 'info', duration = 3500) {
    this.init();
    const toast = document.createElement('div');
    toast.className = `diamond-toast toast-${type}`;
    
    let iconSvg = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
    if (type === 'success') {
      iconSvg = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00f0ff" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>';
    } else if (type === 'error') {
      iconSvg = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
    }

    toast.innerHTML = `
      <div class="toast-icon">${iconSvg}</div>
      <div class="toast-message">${message}</div>
      <button type="button" class="toast-close" onclick="this.parentElement.remove()">&times;</button>
    `;

    this.container.appendChild(toast);

    // Trigger animate-in
    setTimeout(() => toast.classList.add('is-visible'), 10);

    // Auto dismiss
    setTimeout(() => {
      toast.classList.remove('is-visible');
      setTimeout(() => toast.remove(), 400);
    }, duration);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Cart.init();
});
