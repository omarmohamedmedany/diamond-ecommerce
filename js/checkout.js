/**
 * Diamond E-Commerce - Cart & Multi-Step Checkout Controller
 * Handles Cart Table, Interactive Payment Simulation, and Receipt Generation
 */

const Checkout = {
  currentStep: 1,
  selectedPayment: 'card',
  shippingData: null,
  placedOrder: null,

  init() {
    this.renderCartTable();
    this.renderSummary();
    this.bindEvents();

    window.addEventListener('diamond:cartUpdated', () => {
      this.renderCartTable();
      this.renderSummary();
    });

    window.addEventListener('diamond:languageChanged', () => {
      this.renderCartTable();
      this.renderSummary();
    });
  },

  renderCartTable() {
    const tableBody = document.getElementById('cart-table-body');
    const emptyState = document.getElementById('cart-empty-view');
    const fullState = document.getElementById('cart-full-view');
    if (!tableBody) return;

    const cart = Cart.getCart();
    const lang = I18n.getLang();

    if (cart.length === 0) {
      if (emptyState) emptyState.style.display = 'block';
      if (fullState) fullState.style.display = 'none';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    if (fullState) fullState.style.display = 'grid';

    tableBody.innerHTML = cart.map(item => {
      const prod = ProductService.getById(item.productId);
      const name = prod ? (prod.name[lang] || prod.name.en) : (typeof item.name === 'object' ? (item.name[lang] || item.name.en) : item.name);
      const brand = prod ? prod.brand : item.brand;
      const brandName = (typeof I18n !== 'undefined') ? I18n.getBrandName(brand, lang) : brand;
      const colorName = (item.color && typeof item.color.name === 'object') ? (item.color.name[lang] || item.color.name.en) : (item.color?.name || '');
      const storageSize = item.storage ? ((typeof I18n !== 'undefined') ? I18n.formatStorage(item.storage, lang) : (item.storage.size || item.storage)) : '';
      const lineTotal = item.unitPrice * item.quantity;

      return `
        <tr class="cart-table-row" data-id="${item.cartItemId}">
          <td class="col-product">
            <div class="cart-item-flex">
              <a href="product.html?id=${item.productId}" class="cart-item-thumb">
                <img src="${item.image}" alt="${name}" loading="lazy" decoding="async" width="80" height="80" onerror="this.src='https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=200&q=80'">
              </a>
              <div class="cart-item-details">
                <div class="cart-item-brand">${brandName}</div>
                <h4 class="cart-item-title"><a href="product.html?id=${item.productId}">${name}</a></h4>
                <div class="cart-item-variant">
                  <span class="color-dot" style="background-color: ${item.color.hex}"></span>
                  <span>${colorName}</span>
                  ${storageSize ? `<span class="variant-separator">•</span><span>${storageSize}</span>` : ''}
                </div>
              </div>
            </div>
          </td>
          <td class="col-price">
            <span class="unit-price">${(typeof I18n !== 'undefined' && I18n.formatPrice) ? I18n.formatPrice(item.unitPrice, lang) : (item.unitPrice.toLocaleString() + ' QR')}</span>
          </td>
          <td class="col-qty">
            <div class="table-qty-control" data-cart-id="${item.cartItemId}">
              <button type="button" class="btn-qty-sub" data-action="qty-minus" data-cart-id="${item.cartItemId}" aria-label="Decrease quantity">-</button>
              <span class="qty-val">${item.quantity}</span>
              <button type="button" class="btn-qty-add" data-action="qty-plus" data-cart-id="${item.cartItemId}" aria-label="Increase quantity">+</button>
            </div>
          </td>
          <td class="col-total">
            <span class="line-total-price">${(typeof I18n !== 'undefined' && I18n.formatPrice) ? I18n.formatPrice(lineTotal, lang) : (lineTotal.toLocaleString() + ' QR')}</span>
          </td>
          <td class="col-action">
            <button type="button" class="btn-table-remove" data-action="cart-remove" data-cart-id="${item.cartItemId}" title="${I18n.t('tableAction')}" aria-label="Remove item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </td>
        </tr>
      `;
    }).join('');
  },

  renderSummary() {
    const subtotalEl = document.getElementById('summary-subtotal');
    const taxEl = document.getElementById('summary-tax');
    const totalEl = document.getElementById('summary-total');
    const lang = (typeof I18n !== 'undefined') ? I18n.getLang() : 'en';

    const subtotal = Cart.getSubtotal();
    const tax = Cart.getTaxAmount();
    const total = Cart.getFinalTotal();

    if (subtotalEl) subtotalEl.textContent = (typeof I18n !== 'undefined' && I18n.formatPrice) ? I18n.formatPrice(subtotal, lang) : (`$${subtotal.toLocaleString()}`);
    if (taxEl) taxEl.textContent = (typeof I18n !== 'undefined' && I18n.formatPrice) ? I18n.formatPrice(tax, lang) : (`$${tax.toLocaleString()}`);
    if (totalEl) totalEl.textContent = (typeof I18n !== 'undefined' && I18n.formatPrice) ? I18n.formatPrice(total, lang) : (`$${total.toLocaleString()}`);
  },

  bindEvents() {
    const btnProceed = document.getElementById('btn-proceed-checkout');
    if (btnProceed) {
      btnProceed.addEventListener('click', () => {
        if (Cart.getCount() === 0) {
          Toast.show(I18n.t('cartEmptyDesc'), 'info');
          return;
        }
        this.openCheckoutModal();
      });
    }

    // Delegated touch & click handlers for Cart Table items
    const tableBody = document.getElementById('cart-table-body');
    if (tableBody) {
      tableBody.addEventListener('click', (e) => {
        const removeBtn = e.target.closest('.btn-table-remove');
        if (removeBtn) {
          e.preventDefault();
          e.stopPropagation();
          const row = removeBtn.closest('.cart-table-row');
          const cartId = row ? row.dataset.id : null;
          if (cartId) Cart.removeItem(cartId);
          return;
        }

        const subBtn = e.target.closest('.btn-qty-sub');
        if (subBtn) {
          e.preventDefault();
          e.stopPropagation();
          const row = subBtn.closest('.cart-table-row');
          const cartId = row ? row.dataset.id : null;
          if (cartId) {
            const item = Cart.getCart().find(i => i.cartItemId === cartId);
            if (item) Cart.updateQuantity(cartId, item.quantity - 1);
          }
          return;
        }

        const addBtn = e.target.closest('.btn-qty-add');
        if (addBtn) {
          e.preventDefault();
          e.stopPropagation();
          const row = addBtn.closest('.cart-table-row');
          const cartId = row ? row.dataset.id : null;
          if (cartId) {
            const item = Cart.getCart().find(i => i.cartItemId === cartId);
            if (item) Cart.updateQuantity(cartId, item.quantity + 1);
          }
          return;
        }
      });
    }

    this.setupCreditCardPreview();

    document.querySelectorAll('input[name="payment-method-radio"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.selectedPayment = e.target.value;
        document.querySelectorAll('.payment-tab-content').forEach(c => c.style.display = 'none');
        const targetTab = document.getElementById(`payment-content-${this.selectedPayment}`);
        if (targetTab) targetTab.style.display = 'block';
      });
    });

    const shippingForm = document.getElementById('checkout-shipping-form');
    if (shippingForm) {
      shippingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(shippingForm);
        const dial = formData.get('phoneDial') || '+974';
        const rawPhone = formData.get('phone') || '';
        const countryCode = formData.get('country') || 'QA';
        const countryObj = (typeof COUNTRIES_DATA !== 'undefined') ? (COUNTRIES_DATA.find(c => c.dial === dial) || COUNTRIES_DATA.find(c => c.code === countryCode)) : null;

        if (typeof CountriesHelper !== 'undefined' && countryObj) {
          if (!CountriesHelper.validatePhoneNumber(countryObj, rawPhone)) {
            const lang = (typeof I18n !== 'undefined') ? I18n.getLang() : 'en';
            const msg = CountriesHelper.getValidationHint ? CountriesHelper.getValidationHint(countryObj, lang) : (lang === 'ar' 
              ? `يرجى إدخال رقم هاتف صحيح لـ ${countryObj.nameAr} (${countryObj.minLen} أرقام)`
              : `Please enter a valid ${countryObj.minLen}-digit phone number for ${countryObj.nameEn}`);
            if (typeof Toast !== 'undefined') Toast.show(msg, 'warning');
            const phoneInput = shippingForm.querySelector('.phone-number-field, input[name="phone"]');
            if (phoneInput) phoneInput.focus();
            return;
          }
        }

        const phone = rawPhone ? `${dial} ${rawPhone.trim()}` : '';
        const countryName = countryObj ? countryObj.nameEn : countryCode;

        this.shippingData = {
          fullName: formData.get('fullName'),
          email: formData.get('email'),
          phone: phone,
          address: formData.get('address'),
          city: formData.get('city'),
          country: countryName,
          notes: formData.get('notes')
        };
        this.goToStep(2);
      });
    }

    const paymentForm = document.getElementById('checkout-payment-form');
    if (paymentForm) {
      paymentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.processOrder();
      });
    }
  },

  setupCreditCardPreview() {
    const cardNumInput = document.getElementById('card-number-input');
    const cardHolderInput = document.getElementById('card-holder-input');
    const cardExpiryInput = document.getElementById('card-expiry-input');

    const previewNum = document.getElementById('card-preview-number');
    const previewHolder = document.getElementById('card-preview-holder');
    const previewExpiry = document.getElementById('card-preview-expiry');

    if (cardNumInput) {
      cardNumInput.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\D/g, '').substring(0, 16);
        val = val.replace(/(\d{4})/g, '$1 ').trim();
        e.target.value = val;
        if (previewNum) previewNum.textContent = val || '•••• •••• •••• ••••';
      });
    }

    if (cardHolderInput) {
      cardHolderInput.addEventListener('input', (e) => {
        if (previewHolder) previewHolder.textContent = e.target.value.toUpperCase() || 'ALEXANDER VANCE';
      });
    }

    if (cardExpiryInput) {
      cardExpiryInput.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\D/g, '').substring(0, 4);
        if (val.length >= 2) {
          val = val.substring(0, 2) + '/' + val.substring(2);
        }
        e.target.value = val;
        if (previewExpiry) previewExpiry.textContent = val || 'MM/YY';
      });
    }
  },

  openCheckoutModal() {
    const modal = document.getElementById('checkout-modal');
    if (modal) {
      this.goToStep(1);
      
      const user = Auth.getCurrentUser();
      if (user) {
        const nameInp = document.querySelector('#checkout-shipping-form input[name="fullName"]');
        const emailInp = document.querySelector('#checkout-shipping-form input[name="email"]');
        const phoneInp = document.querySelector('#checkout-shipping-form input[name="phone"]');
        const dialSelect = document.getElementById('checkout-phone-dial');
        
        if (nameInp && !nameInp.value) nameInp.value = user.name;
        if (emailInp && !emailInp.value) emailInp.value = user.email;
        if (phoneInp && !phoneInp.value && user.phone) {
          const match = user.phone.match(/^(\+\d{1,4})\s*(.*)$/);
          if (match && dialSelect) {
            dialSelect.value = match[1];
            phoneInp.value = match[2];
          } else {
            phoneInp.value = user.phone;
          }
        }
      }

      if (typeof CountriesHelper !== 'undefined') {
        CountriesHelper.renderDialSelects();
      }

      modal.classList.add('is-open');
      document.body.classList.add('modal-open');
    }
  },

  closeCheckoutModal() {
    const modal = document.getElementById('checkout-modal');
    if (modal) {
      modal.classList.remove('is-open');
      document.body.classList.remove('modal-open');
    }
  },

  goToStep(stepNumber) {
    this.currentStep = stepNumber;
    
    document.querySelectorAll('.checkout-step-indicator').forEach(ind => {
      const step = parseInt(ind.dataset.step, 10);
      ind.classList.toggle('is-active', step === stepNumber);
      ind.classList.toggle('is-completed', step < stepNumber);
    });

    document.querySelectorAll('.checkout-step-pane').forEach(pane => {
      const step = parseInt(pane.dataset.step, 10);
      pane.style.display = step === stepNumber ? 'block' : 'none';
    });
  },

  validateStep1(data) {
    const errors = [];
    if (!data) return { valid: false, errors: ['No data provided'] };
    const name = data.fullName || data.name || '';
    const email = data.email || '';
    const phone = data.phone || '';
    const city = data.city || '';
    const address = data.address || '';

    if (!name.trim()) errors.push('Full name is required');
    if (!email.trim() || !email.includes('@')) errors.push('Valid email is required');
    if (!phone.trim()) errors.push('Phone number is required');
    if (!city.trim()) errors.push('City is required');
    if (!address.trim()) errors.push('Address is required');

    return {
      valid: errors.length === 0,
      errors
    };
  },

  validateStep2(paymentMethod, data) {
    const method = paymentMethod || this.selectedPayment || 'card';
    if (method === 'cod' || method === 'apple') {
      return { valid: true, errors: [] };
    }
    const errors = [];
    if (!data) return { valid: false, errors: ['Card details required'] };
    if (!data.number || data.number.replace(/\s/g, '').length < 15) errors.push('Valid card number required');
    if (!data.name || !data.name.trim()) errors.push('Cardholder name required');
    if (!data.expiry || !data.expiry.includes('/')) errors.push('Expiry date required');
    if (!data.cvv || data.cvv.length < 3) errors.push('CVV required');

    return {
      valid: errors.length === 0,
      errors
    };
  },

  processPayment() {
    return this.processOrder();
  },

  processOrder() {
    const btnSubmit = document.getElementById('btn-submit-order');
    if (btnSubmit) {
      btnSubmit.disabled = true;
      btnSubmit.innerHTML = `
        <span class="spinner-border"></span>
        <span>${I18n.t('processingOrder')}</span>
      `;
    }

    setTimeout(() => {
      const orderId = `DM-${Math.floor(100000 + Math.random() * 900000)}`;
      const cartItems = Cart.getCart();
      const finalTotal = Cart.getFinalTotal();
      const dateStr = new Date().toLocaleString();

      this.placedOrder = {
        orderId,
        date: dateStr,
        items: cartItems,
        total: finalTotal,
        shipping: this.shippingData,
        paymentMethod: this.selectedPayment
      };

      // Save order to history
      try {
        const history = JSON.parse(localStorage.getItem('diamond_orders_history') || '[]');
        history.unshift(this.placedOrder);
        localStorage.setItem('diamond_orders_history', JSON.stringify(history));
      } catch (e) {
        console.error("Failed to save order history", e);
      }

      // Clear cart
      Cart.clearCart();

      // Render confirmation
      this.renderOrderConfirmation(this.placedOrder);
      this.goToStep(3);

      if (btnSubmit) {
        btnSubmit.disabled = false;
        btnSubmit.innerHTML = `<span>${I18n.t('placeOrderBtn')}</span>`;
      }
    }, 1200);
  },

  renderOrderConfirmation(order) {
    const container = document.getElementById('order-confirmation-content');
    if (!container) return;

    const lang = I18n.getLang();
    let paymentName = I18n.t('payCreditCard');
    if (order.paymentMethod === 'apple') paymentName = I18n.t('payApplePay');
    if (order.paymentMethod === 'cod') paymentName = I18n.t('payCashOnDelivery');
    if (order.paymentMethod === 'crypto') paymentName = I18n.t('payCrypto');

    const itemsListText = order.items.map(i => `• ${i.name[lang] || i.name.en} (${i.quantity}x) - ${((typeof I18n !== 'undefined' && I18n.formatPrice) ? I18n.formatPrice(i.unitPrice * i.quantity, lang) : ((i.unitPrice * i.quantity).toLocaleString() + ' QR'))}`).join('\n');
    const formattedTotal = (typeof I18n !== 'undefined' && I18n.formatPrice) ? I18n.formatPrice(order.total, lang) : (order.total.toLocaleString() + ' QR');
    
    const waText = lang === 'ar'
      ? `*تأكيد طلب متجر دايموند تك*\nرقم الطلب: ${order.orderId}\nاسم العميل: ${order.shipping.fullName}\nرقم الهاتف: ${order.shipping.phone}\nعنوان التوصيل: ${order.shipping.address}، ${order.shipping.city}\nوسيلة الدفع: ${paymentName}\n\n*الأجهزة المطلوبة:*\n${itemsListText}\n\n*المبلغ الإجمالي المدفوع:* ${formattedTotal}\nشكراً لثقتكم واختياركم دايموند تك.`
      : `*DIAMOND TECH ORDER CONFIRMATION*\nOrder ID: ${order.orderId}\nCustomer: ${order.shipping.fullName}\nPhone: ${order.shipping.phone}\nAddress: ${order.shipping.address}, ${order.shipping.city}\nPayment: ${paymentName}\n\n*Ordered Items:*\n${itemsListText}\n\n*Total Paid:* ${formattedTotal}\nThank you for choosing Diamond.`;
    
    const waUrl = `https://wa.me/97471040746?text=${encodeURIComponent(waText)}`;

    container.innerHTML = `
      <div class="order-receipt-card" id="printable-receipt">
        <div class="receipt-header">
          <div class="receipt-brand-logo">
            <span class="diamond-gem-symbol">✦</span>
            <strong>${I18n.t('brandName').toUpperCase()}</strong>
          </div>
          <div class="receipt-status-badge">
            <span data-i18n="receiptVerifiedBadge">${I18n.t('receiptVerifiedBadge')}</span>
          </div>
        </div>

        <div class="receipt-grid-meta">
          <div class="meta-item">
            <span class="meta-label" data-i18n="orderNumberLabel">${I18n.t('orderNumberLabel')}</span>
            <strong class="meta-val highlight-cyan">${order.orderId}</strong>
          </div>
          <div class="meta-item">
            <span class="meta-label" data-i18n="orderDateLabel">${I18n.t('orderDateLabel')}</span>
            <strong class="meta-val">${order.date}</strong>
          </div>
          <div class="meta-item">
            <span class="meta-label" data-i18n="orderPaymentMethodLabel">${I18n.t('orderPaymentMethodLabel')}</span>
            <strong class="meta-val">${paymentName}</strong>
          </div>
          <div class="meta-item">
            <span class="meta-label" data-i18n="fullName">${I18n.t('fullName')}</span>
            <strong class="meta-val">${order.shipping.fullName}</strong>
          </div>
        </div>

        <div class="receipt-items-table">
          <h4 data-i18n="purchasedDevicesHeading">${I18n.t('purchasedDevicesHeading')}</h4>
          ${order.items.map(item => `
            <div class="receipt-item-row">
              <div class="receipt-item-main">
                <strong>${item.name[lang] || item.name.en}</strong>
                <div class="receipt-item-opt">
                  <span>${item.color.name[lang] || item.color.name.en}</span>
                  ${item.storage ? ` • <span>${(typeof I18n !== 'undefined' && I18n.formatStorage) ? I18n.formatStorage(item.storage.size, lang) : item.storage.size}</span>` : ''}
                </div>
              </div>
              <div class="receipt-item-qty">x${item.quantity}</div>
              <div class="receipt-item-price">${(typeof I18n !== 'undefined' && I18n.formatPrice) ? I18n.formatPrice(item.unitPrice * item.quantity, lang) : ((item.unitPrice * item.quantity).toLocaleString() + ' QR')}</div>
            </div>
          `).join('')}
        </div>

        <div class="receipt-total-row">
          <span data-i18n="orderTotalPaid">${I18n.t('orderTotalPaid')}</span>
          <strong class="receipt-final-amount">${formattedTotal}</strong>
        </div>

        <div class="receipt-actions no-print">
          <button type="button" class="btn btn-outline btn-print-receipt" onclick="window.print()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
            <span data-i18n="printReceiptBtn">${I18n.t('printReceiptBtn')}</span>
          </button>
          <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp-confirm">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12.032 2C6.505 2 2.025 6.48 2.025 12.008c0 1.954.563 3.778 1.541 5.321L2 22l4.832-1.528A9.957 9.957 0 0 0 12.032 22C17.56 22 22.04 17.52 22.04 12.008 22.04 6.48 17.56 2 12.032 2z"/></svg>
            <span data-i18n="whatsappConfirmBtn">${I18n.t('whatsappConfirmBtn')}</span>
          </a>
        </div>
      </div>
    `;
  }
};

window.Checkout = Checkout;

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('cart-table-body')) {
    Checkout.init();
  }
});
