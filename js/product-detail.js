/**
 * Diamond E-Commerce - Product Detail Controller
 * Handles dynamic product rendering, interactive gallery, specs, reviews, and related items
 */

const ProductDetail = {
  product: null,
  selectedColor: null,
  selectedStorage: null,
  quantity: 1,

  init() {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id') || 'iphone-16-pro-max';
    this.product = ProductService.getById(productId);

    if (!this.product) {
      this.product = DIAMOND_PRODUCTS[0];
    }

    this.selectedColor = this.product.colors[0];
    this.selectedStorage = this.product.storageOptions ? this.product.storageOptions[0] : null;

    this.render();
    this.bindEvents();
    this.renderReviews();
    this.renderRelated();

    window.addEventListener('diamond:languageChanged', () => {
      this.render();
      this.renderReviews();
      this.renderRelated();
    });
  },

  getCurrentPrice() {
    let price = this.product.basePrice;
    if (this.selectedStorage && this.selectedStorage.priceMultiplier) {
      price = Math.round(price * this.selectedStorage.priceMultiplier);
    }
    return price;
  },

  render() {
    const lang = I18n.getLang();
    const p = this.product;
    const name = p.name[lang] || p.name.en;
    const tagline = p.tagline[lang] || p.tagline.en;
    const desc = p.description[lang] || p.description.en;

    document.title = `${name} | Diamond Tech Luxury`;

    // 1. Breadcrumbs
    const breadcrumbName = document.getElementById('breadcrumb-product-name');
    const breadcrumbCat = document.getElementById('breadcrumb-category');
    if (breadcrumbName) breadcrumbName.textContent = name;
    if (breadcrumbCat) {
      breadcrumbCat.textContent = I18n.t(`cat${p.category.charAt(0).toUpperCase() + p.category.slice(1)}`) || p.category;
      breadcrumbCat.href = `shop.html?category=${p.category}`;
    }

    // 2. Images & Gallery
    const mainImg = document.getElementById('product-main-image');
    const thumbsContainer = document.getElementById('product-thumbnails-container');
    if (mainImg) {
      mainImg.src = p.images[0];
      mainImg.alt = name;
      mainImg.onerror = () => { mainImg.src = 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1000&q=85'; };
    }

    if (thumbsContainer) {
      thumbsContainer.innerHTML = p.images.map((img, i) => `
        <button type="button" class="gallery-thumb-btn ${i === 0 ? 'is-active' : ''}" data-index="${i}">
          <img src="${img}" alt="${name} angle ${i + 1}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=200&q=80'">
        </button>
      `).join('');

      thumbsContainer.querySelectorAll('.gallery-thumb-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.dataset.index, 10);
          if (mainImg) mainImg.src = p.images[idx];
          thumbsContainer.querySelectorAll('.gallery-thumb-btn').forEach(b => b.classList.remove('is-active'));
          btn.classList.add('is-active');
        });
      });
    }

    // 3. Product Header info
    const brandEl = document.getElementById('product-detail-brand');
    if (brandEl) brandEl.textContent = p.brand;

    const condEl = document.getElementById('product-detail-condition');
    const condition = p.condition || 'new';
    if (condEl) {
      let condText = '';
      let condClass = '';
      if (condition === 'new') {
        condText = lang === 'ar' ? '✨ غير مستخدم نهائياً (مغلف بختم المصنع)' : '✨ Grade A+ • Never Used (Factory Sealed)';
        condClass = 'badge-condition-new';
      } else if (condition === 'like-new') {
        condText = lang === 'ar' ? '💎 مستعمل كالجديد (استخدام أقل من سنة)' : '💎 Grade A • Like New (Used < 1 Year)';
        condClass = 'badge-condition-likenew';
      } else {
        condText = lang === 'ar' ? '🛡️ مجدد معتمد (استخدام أقل من 3 سنوات)' : '🛡️ Grade B+ • Certified (Used < 3 Years)';
        condClass = 'badge-condition-certified';
      }
      condEl.innerHTML = `<span class="product-condition-tag ${condClass}">${condText}</span>`;
    }

    const titleEl = document.getElementById('product-detail-title');
    if (titleEl) titleEl.textContent = name;

    const taglineEl = document.getElementById('product-detail-tagline');
    if (taglineEl) taglineEl.textContent = tagline;

    const ratingVal = document.getElementById('product-rating-value');
    const ratingStars = document.getElementById('product-rating-stars');
    const reviewCount = document.getElementById('product-reviews-count');
    if (ratingVal) ratingVal.textContent = p.rating;
    if (ratingStars) ratingStars.innerHTML = `${'★'.repeat(Math.floor(p.rating))}${'☆'.repeat(5 - Math.floor(p.rating))}`;
    if (reviewCount) reviewCount.textContent = `(${p.reviewsCount} ${I18n.t('verifiedReviews')})`;

    // 4. Pricing
    this.updatePriceDisplay();

    // 5. Short Description
    const descEl = document.getElementById('product-detail-desc');
    if (descEl) descEl.textContent = desc;

    // 6. Color Swatches
    const colorsContainer = document.getElementById('product-colors-container');
    const colorNameDisplay = document.getElementById('selected-color-name');
    if (colorsContainer) {
      if (colorNameDisplay) {
        colorNameDisplay.textContent = this.selectedColor.name[lang] || this.selectedColor.name.en;
      }

      colorsContainer.innerHTML = p.colors.map(c => `
        <label class="color-swatch-label ${c.code === this.selectedColor.code ? 'is-selected' : ''}">
          <input type="radio" name="product-color-radio" value="${c.code}" ${c.code === this.selectedColor.code ? 'checked' : ''}>
          <span class="color-swatch-circle" style="background-color: ${c.hex};" title="${c.name[lang] || c.name.en}"></span>
        </label>
      `).join('');

      colorsContainer.querySelectorAll('input[name="product-color-radio"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
          this.selectedColor = p.colors.find(c => c.code === e.target.value) || p.colors[0];
          if (colorNameDisplay) {
            colorNameDisplay.textContent = this.selectedColor.name[lang] || this.selectedColor.name.en;
          }
          colorsContainer.querySelectorAll('.color-swatch-label').forEach(l => l.classList.remove('is-selected'));
          e.target.closest('.color-swatch-label').classList.add('is-selected');
        });
      });
    }

    // 7. Storage / Variants
    const storageWrap = document.getElementById('product-storage-wrap');
    const storageContainer = document.getElementById('product-storage-container');
    if (storageContainer && p.storageOptions && p.storageOptions.length > 0) {
      if (storageWrap) storageWrap.style.display = 'block';

      storageContainer.innerHTML = p.storageOptions.map(opt => `
        <label class="storage-pill-label ${opt.size === this.selectedStorage?.size ? 'is-selected' : ''}">
          <input type="radio" name="product-storage-radio" value="${opt.size}" ${opt.size === this.selectedStorage?.size ? 'checked' : ''}>
          <span class="storage-pill-box">${opt.size}</span>
        </label>
      `).join('');

      storageContainer.querySelectorAll('input[name="product-storage-radio"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
          this.selectedStorage = p.storageOptions.find(opt => opt.size === e.target.value);
          storageContainer.querySelectorAll('.storage-pill-label').forEach(l => l.classList.remove('is-selected'));
          e.target.closest('.storage-pill-label').classList.add('is-selected');
          this.updatePriceDisplay();
        });
      });
    } else if (storageWrap) {
      storageWrap.style.display = 'none';
    }

    // 8. In Stock status
    const stockEl = document.getElementById('product-stock-status');
    if (stockEl) {
      stockEl.innerHTML = `
        <span class="stock-dot in-stock"></span>
        <span>${I18n.t('inStock')} — <strong>${p.stockCount}</strong> ${I18n.t('itemsLeft')}</span>
      `;
    }

    // 9. Technical Specs Tab Content
    this.renderTabs(p, lang);
  },

  updatePriceDisplay() {
    const priceEl = document.getElementById('product-current-price');
    const currPrice = this.getCurrentPrice();
    if (priceEl) priceEl.textContent = `$${currPrice.toLocaleString()}`;
  },

  renderTabs(p, lang) {
    const tabDesc = document.getElementById('tab-content-description');
    if (tabDesc) {
      tabDesc.innerHTML = `
        <div class="specs-overview-content">
          <h3>${p.tagline[lang] || p.tagline.en}</h3>
          <p class="specs-lead-text">${p.description[lang] || p.description.en}</p>
          
          <div class="features-key-highlights">
            <div class="highlight-box">
              <div class="hl-icon">✦</div>
              <h4>Aerospace Engineering</h4>
              <p>Grade 5 titanium alloy frame with highest strength-to-weight ratio in consumer tech.</p>
            </div>
            <div class="highlight-box">
              <div class="hl-icon">⚡</div>
              <h4>Silicon Superiority</h4>
              <p>Ultra-dense 3nm manufacturing process delivering highest efficiency and on-device AI.</p>
            </div>
            <div class="highlight-box">
              <div class="hl-icon">🛡️</div>
              <h4>Diamond Care+ Warranty</h4>
              <p>2-Year comprehensive global protection covering accidental drops and official service.</p>
            </div>
          </div>
        </div>
      `;
    }

    const tabSpecs = document.getElementById('tab-content-specs');
    if (tabSpecs && p.specs) {
      const specRows = Object.entries(p.specs).map(([key, val]) => {
        const labelKey = `spec${key.charAt(0).toUpperCase() + key.slice(1)}`;
        const label = I18n.t(labelKey) || key;
        return `
          <div class="spec-row">
            <div class="spec-name">${label}</div>
            <div class="spec-value">${val}</div>
          </div>
        `;
      }).join('');

      tabSpecs.innerHTML = `<div class="specs-table-wrapper">${specRows}</div>`;
    }

    const tabBox = document.getElementById('tab-content-box');
    if (tabBox && p.inTheBox) {
      tabBox.innerHTML = `
        <ul class="in-the-box-list">
          ${p.inTheBox.map(item => `
            <li>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00f0ff" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span>${item}</span>
            </li>
          `).join('')}
        </ul>
      `;
    }
  },

  bindEvents() {
    const qtyInput = document.getElementById('product-qty-input');
    const btnMinus = document.getElementById('btn-qty-decrease');
    const btnPlus = document.getElementById('btn-qty-increase');

    if (btnMinus && qtyInput) {
      btnMinus.addEventListener('click', () => {
        let val = parseInt(qtyInput.value, 10) || 1;
        if (val > 1) {
          qtyInput.value = val - 1;
          this.quantity = val - 1;
        }
      });
    }

    if (btnPlus && qtyInput) {
      btnPlus.addEventListener('click', () => {
        let val = parseInt(qtyInput.value, 10) || 1;
        if (val < 10) {
          qtyInput.value = val + 1;
          this.quantity = val + 1;
        }
      });
    }

    const btnAddCart = document.getElementById('btn-add-to-cart');
    if (btnAddCart) {
      btnAddCart.addEventListener('click', () => {
        Cart.addItem(this.product.id, this.quantity, {
          color: this.selectedColor,
          storage: this.selectedStorage
        });
        Cart.openDrawer();
      });
    }

    const btnBuyNow = document.getElementById('btn-buy-now');
    if (btnBuyNow) {
      btnBuyNow.addEventListener('click', () => {
        Cart.addItem(this.product.id, this.quantity, {
          color: this.selectedColor,
          storage: this.selectedStorage
        });
        window.location.href = 'cart.html';
      });
    }

    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('is-active'));
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('is-active'));

        btn.classList.add('is-active');
        const pane = document.getElementById(`tab-content-${targetTab}`);
        if (pane) pane.classList.add('is-active');
      });
    });

    const btnWish = document.getElementById('btn-product-detail-wishlist');
    if (btnWish) {
      btnWish.addEventListener('click', () => {
        const isAdded = Cart.toggleWishlist(this.product.id);
        btnWish.classList.toggle('is-active', isAdded);
      });
    }
  },

  renderReviews() {
    const reviewsContainer = document.getElementById('product-reviews-list');
    if (!reviewsContainer) return;

    const mockReviews = [
      {
        author: "Julian H. Sterling",
        badge: "Verified Buyer",
        rating: 5,
        date: "October 14, 2025",
        title: "Absolute pinnacle of craftsmanship and performance.",
        content: "The titanium finish and acoustic resonance surpass anything else on the market. Diamond's express courier delivered it in flawless museum-grade packaging."
      },
      {
        author: "Rashid Al-Kuwari",
        badge: "Verified Buyer",
        rating: 5,
        date: "December 02, 2025",
        title: "قمة الفخامة والأداء الاستثنائي",
        content: "تجربة شحن وسرعة استجابة مذهلة. خامات التيتانيوم خفيفة جداً والكاميرا تلتقط تفاصيل فائقة النقاء."
      },
      {
        author: "Elena Rostova",
        badge: "Verified Buyer",
        rating: 4.8,
        date: "January 19, 2026",
        title: "Exceeded my highest expectations.",
        content: "From the display brightness under direct sunlight to the battery endurance, this is the definitive flagship device."
      }
    ];

    reviewsContainer.innerHTML = mockReviews.map(r => `
      <div class="review-card">
        <div class="review-header">
          <div class="review-author-info">
            <div class="review-avatar">${r.author.charAt(0)}</div>
            <div>
              <div class="review-author-name">${r.author}</div>
              <span class="review-verified-badge">✓ ${r.badge}</span>
            </div>
          </div>
          <div class="review-meta">
            <div class="rating-stars">${'★'.repeat(Math.floor(r.rating))}</div>
            <span class="review-date">${r.date}</span>
          </div>
        </div>
        <h4 class="review-title">${r.title}</h4>
        <p class="review-content">${r.content}</p>
      </div>
    `).join('');
  },

  renderRelated() {
    const container = document.getElementById('related-products-container');
    if (!container) return;

    const related = ProductService.getRelated(this.product.id, 4);
    const lang = I18n.getLang();

    container.innerHTML = related.map(p => Shop.renderProductCard(p, lang)).join('');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('product-main-image')) {
    ProductDetail.init();
  }
});
