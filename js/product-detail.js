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

    document.title = `${name} | ${lang === 'ar' ? 'دايموند تك الفاخرة' : 'Diamond Tech Luxury'}`;
    this.updateSEO(p, lang);

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
          <img src="${img}" alt="${name} angle ${i + 1}" loading="lazy" decoding="async" width="100" height="100" onerror="this.src='https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=200&q=80'">
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
    if (brandEl) brandEl.textContent = (typeof I18n !== 'undefined') ? I18n.getBrandName(p.brand, lang) : p.brand;

    const condEl = document.getElementById('product-detail-condition');
    const condition = p.condition || 'new';
    if (condEl) {
      let condText = '';
      let condClass = '';
      if (condition === 'new') {
        condText = lang === 'ar' ? 'جديد كلياً (كرتونة مغلقة)' : 'Brand New (Sealed Box)';
        condClass = 'badge-condition-new';
      } else if (condition === 'like-new') {
        condText = lang === 'ar' ? 'كالجديد (استعمال أقل من سنة)' : 'Like New (Used < 1 Year)';
        condClass = 'badge-condition-likenew';
      } else {
        condText = lang === 'ar' ? 'مستعمل (استعمال أقل من 3 سنوات)' : 'Pre-Owned (Used < 3 Years)';
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
          <span class="storage-pill-box">${(typeof I18n !== 'undefined') ? I18n.formatStorage(opt.size, lang) : opt.size}</span>
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
    const lang = (typeof I18n !== 'undefined') ? I18n.getLang() : 'en';
    if (priceEl) priceEl.textContent = (typeof I18n !== 'undefined' && I18n.formatPrice) ? I18n.formatPrice(currPrice, lang) : (`$${currPrice.toLocaleString()}`);
    this.updateWhatsAppLink();
  },

  updateWhatsAppLink() {
    const waBtn = document.getElementById('btn-order-whatsapp');
    if (!waBtn || !this.product) return;

    const lang = (typeof I18n !== 'undefined') ? I18n.getLang() : 'en';
    const prodName = this.product.name[lang] || this.product.name.en;
    const colorName = this.selectedColor ? (this.selectedColor.name[lang] || this.selectedColor.name.en) : '';
    const storageName = this.selectedStorage ? ((typeof I18n !== 'undefined' && I18n.formatStorage) ? I18n.formatStorage(this.selectedStorage.size, lang) : this.selectedStorage.size) : '';
    const formattedPrice = (typeof I18n !== 'undefined' && I18n.formatPrice) ? I18n.formatPrice(this.getCurrentPrice(), lang) : (`$${this.getCurrentPrice().toLocaleString()}`);

    let msg = '';
    if (lang === 'ar') {
      msg = `مرحباً دايموند تك، أود طلب الجهاز التالي مباشرة عبر الواتساب:
• الجهاز: ${prodName}
• اللون / التشطيب: ${colorName || 'الافتراضي'}
• السعة / الإصدار: ${storageName || 'الأساسي'}
• السعر: ${formattedPrice}
• الكمية: ${this.quantity || 1}

يرجى تأكيد التوافر وتفاصيل الشحن السريع. شكراً لكم!`;
    } else {
      msg = `Hello Diamond Tech Concierge, I would like to order this flagship device directly via WhatsApp:
• Device: ${prodName}
• Color / Finish: ${colorName || 'Default'}
• Storage / Variant: ${storageName || 'Standard'}
• Price: ${formattedPrice}
• Quantity: ${this.quantity || 1}

Please confirm availability and express courier delivery. Thank you!`;
    }

    waBtn.href = `https://wa.me/97471040746?text=${encodeURIComponent(msg)}`;
  },

  translateBoxItem(item, lang, p) {
    if (lang !== 'ar') return item;
    if (item === p.name.en || item === (typeof p.name === 'object' ? p.name.en : p.name)) return (typeof p.name === 'object' ? p.name.ar : p.name) || item;
    if (item.includes('USB-C to USB-C Braided Cable')) return 'كابل شحن مجدول USB-C إلى USB-C (1 متر)';
    if (item.includes('USB-C Braided Cable')) return 'كابل شحن USB-C مجدول فاخر';
    if (item.includes('USB-C Cable')) return 'كابل شحن USB-C أصلي معتمد';
    if (item.includes('Lightning Cable')) return 'كابل شحن لايتنينغ أصلي';
    if (item.includes('SIM Ejector Tool')) return 'دبوس إخراج شريحة الاتصال';
    if (item.includes('Certificate of Authenticity')) return 'شهادة أصالة وضمان معتمدة';
    if (item.includes('Manual & Documentation')) return 'دليل التشغيل والوثائق الرسمية';
    if (item.includes('Magnetic Fast Charger')) return 'كابل شحن مغناطيسي سريع';
    if (item.includes('Silicone Ear Tips')) return 'رؤوس أذن سيليكون بأحجام متعددة';
    if (item.includes('Wireless Charging Case')) return 'علبة شحن لاسلكية ذكية';
    if (item.includes('Power Adapter')) return 'محول طاقة جداري سريع';
    if (item.includes('S Pen')) return 'قلم S Pen الذكي';
    if (item.includes('Titanium Band')) return 'سوار تيتانيوم فاخر';
    if (item.includes('Documentation')) return 'كتيب التعليمات والضمان';
    if (item.includes('Manual')) return 'دليل المستخدم والوثائق';
    if (item.includes('Quick Start Guide')) return 'دليل البدء السريع';
    return item;
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
              <h4>${I18n.t('featureHl1Title')}</h4>
              <p>${I18n.t('featureHl1Desc')}</p>
            </div>
            <div class="highlight-box">
              <div class="hl-icon">⚡</div>
              <h4>${I18n.t('featureHl2Title')}</h4>
              <p>${I18n.t('featureHl2Desc')}</p>
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
              <span>${this.translateBoxItem(item, lang, p)}</span>
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

    const updateDetailQty = (delta) => {
      const input = document.getElementById('product-qty-input') || qtyInput;
      let currentVal = parseInt(input ? input.value : this.quantity, 10) || 1;
      let newVal = currentVal + delta;
      if (newVal < 1) newVal = 1;
      if (newVal > 10) newVal = 10;
      if (input) input.value = newVal;
      this.quantity = newVal;
    };

    if (btnMinus) {
      btnMinus.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        updateDetailQty(-1);
      };
    }

    if (btnPlus) {
      btnPlus.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        updateDetailQty(1);
      };
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
      btnBuyNow.addEventListener('click', (e) => {
        e.preventDefault();
        if (typeof App !== 'undefined' && App.showDynamicNotice) {
          App.showDynamicNotice();
        } else {
          alert('This is for a dynamic website');
        }
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

        // Smoothly center the clicked tab in the mobile scrollable bar
        try {
          btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        } catch (e) {}
      });
    });

    const btnShare = document.getElementById('btn-product-detail-share');
    if (btnShare) {
      btnShare.addEventListener('click', (e) => {
        e.preventDefault();
        if (typeof App !== 'undefined' && App.openShareModal) {
          App.openShareModal(this.product.id);
        }
      });
    }

    const btnWriteReview = document.getElementById('btn-write-review') || document.querySelector('.btn-write-review, [data-i18n="writeReviewBtn"]');
    if (btnWriteReview) {
      btnWriteReview.addEventListener('click', (e) => {
        e.preventDefault();
        this.openReviewModal();
      });
    }

    const mainImg = document.getElementById('product-main-image');
    if (mainImg) {
      mainImg.style.cursor = 'zoom-in';
      mainImg.addEventListener('click', () => {
        this.openImageZoom(mainImg.src);
      });
    }

    // Direct WhatsApp order button pre-fill
    const waBtn = document.getElementById('btn-order-whatsapp');
    if (waBtn && this.product) {
      const lang = (typeof I18n !== 'undefined') ? I18n.getLang() : 'en';
      const name = this.product.name[lang] || this.product.name.en;
      const brandName = (typeof I18n !== 'undefined') ? I18n.getBrandName(this.product.brand, lang) : this.product.brand;
      const priceText = (typeof I18n !== 'undefined' && I18n.formatPrice) ? I18n.formatPrice(this.getCurrentPrice(), lang) : (`${this.getCurrentPrice()} QR`);
      const waMsg = (lang === 'ar')
        ? `مرحباً، أود طلب جهاز ${name} (${brandName}) بسعر ${priceText} من متجر دايموند.`
        : `Hello Diamond Concierge, I would like to order ${name} (${brandName}) priced at ${priceText}.`;
      waBtn.href = `https://wa.me/97471040746?text=${encodeURIComponent(waMsg)}`;
    }
  },

  openImageZoom(imgSrc) {
    let modal = document.getElementById('image-zoom-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'image-zoom-modal';
      modal.className = 'diamond-modal-container';
      modal.innerHTML = `
        <div class="modal-backdrop" onclick="document.getElementById('image-zoom-modal').classList.remove('is-open'); document.body.classList.remove('modal-open');"></div>
        <div class="image-zoom-card" style="position: relative; max-width: 90vw; max-height: 90vh; display: flex; align-items: center; justify-content: center; z-index: 10001;">
          <button type="button" class="modal-close-btn btn-close-modal" style="position: absolute; top: 16px; right: 16px; background: rgba(0,0,0,0.6); color: #ffffff; border-radius: 50%; width: 40px; height: 40px; border: 1px solid rgba(255,255,255,0.2); font-size: 24px; cursor: pointer;" onclick="document.getElementById('image-zoom-modal').classList.remove('is-open'); document.body.classList.remove('modal-open');">&times;</button>
          <img id="image-zoom-img" src="${imgSrc}" alt="Zoomed View" style="max-width: 100%; max-height: 85vh; object-fit: contain; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.5);">
        </div>
      `;
      document.body.appendChild(modal);
    } else {
      const img = modal.querySelector('#image-zoom-img');
      if (img) img.src = imgSrc;
    }
    modal.classList.add('is-open');
    document.body.classList.add('modal-open');
  },

  openReviewModal() {
    let modal = document.getElementById('product-review-modal');
    const lang = (typeof I18n !== 'undefined') ? I18n.getLang() : 'en';
    const isAr = lang === 'ar';

    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'product-review-modal';
      modal.className = 'diamond-modal-container';
      modal.innerHTML = `
        <div class="modal-backdrop" onclick="ProductDetail.closeReviewModal()"></div>
        <div class="auth-modal-card" style="max-width: 520px;">
          <button type="button" class="modal-close-btn btn-close-modal" onclick="ProductDetail.closeReviewModal()">&times;</button>
          <div class="auth-card-header">
            <h3 class="auth-title">${isAr ? 'كتابة تقييم للعميل' : 'Write a Client Review'}</h3>
            <p class="auth-subtitle">${isAr ? 'شارك تجربتك وانطباعك حول هذا الجهاز الفاخر.' : 'Share your verified impressions and performance review.'}</p>
          </div>
          <form id="form-submit-product-review" class="auth-form">
            <div class="form-group">
              <label class="form-label">${isAr ? 'الاسم الكريم' : 'Your Name'}</label>
              <input type="text" id="review-author-input" class="form-input" placeholder="${isAr ? 'مثال: محمد السليطي' : 'e.g. Alexander Vance'}" required>
            </div>
            <div class="form-group">
              <label class="form-label">${isAr ? 'التقييم' : 'Overall Rating'}</label>
              <div class="review-stars-picker" style="display: flex; gap: 8px; font-size: 1.6rem; color: #fbbf24; cursor: pointer; user-select: none;">
                <span class="star-pick" data-val="1">★</span>
                <span class="star-pick" data-val="2">★</span>
                <span class="star-pick" data-val="3">★</span>
                <span class="star-pick" data-val="4">★</span>
                <span class="star-pick" data-val="5">★</span>
              </div>
              <input type="hidden" id="review-rating-val" value="5">
            </div>
            <div class="form-group">
              <label class="form-label">${isAr ? 'عنوان التقييم' : 'Review Title'}</label>
              <input type="text" id="review-title-input" class="form-input" placeholder="${isAr ? 'مثال: أداء استثنائي وخامات فاخرة' : 'e.g. Absolute pinnacle of engineering'}" required>
            </div>
            <div class="form-group">
              <label class="form-label">${isAr ? 'تفاصيل التجربة' : 'Review Details'}</label>
              <textarea id="review-body-input" class="form-textarea" rows="4" placeholder="${isAr ? 'شارك رأيك حول خامات الجهاز، دقة الشاشة، سرعة التوصيل...' : 'Describe build quality, acoustic clarity, courier handling...'}" required></textarea>
            </div>
            <button type="submit" class="btn btn-primary btn-block btn-lg">${isAr ? 'نشر التقييم' : 'Submit Review'}</button>
          </form>
        </div>
      `;
      document.body.appendChild(modal);

      modal.querySelectorAll('.star-pick').forEach(star => {
        star.addEventListener('click', (e) => {
          const val = parseInt(e.target.dataset.val, 10);
          document.getElementById('review-rating-val').value = val;
          modal.querySelectorAll('.star-pick').forEach((s, idx) => {
            s.style.opacity = idx < val ? '1' : '0.3';
          });
        });
      });

      const form = modal.querySelector('#form-submit-product-review');
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const author = document.getElementById('review-author-input')?.value || (isAr ? 'عميل موثق' : 'Verified Client');
          const rating = parseInt(document.getElementById('review-rating-val')?.value || 5, 10);
          const title = document.getElementById('review-title-input')?.value || (isAr ? 'تقييم ممتاز' : 'Exceptional Quality');
          const content = document.getElementById('review-body-input')?.value || '';

          const reviewsContainer = document.getElementById('product-reviews-list');
          if (reviewsContainer) {
            const today = new Date().toLocaleDateString(isAr ? 'ar-QA' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });
            const cardHtml = `
              <div class="review-card" style="border: 1px solid rgba(0, 240, 255, 0.4); animation: fadeIn 0.4s ease;">
                <div class="review-header">
                  <div class="review-author-info">
                    <div class="review-avatar">${author.charAt(0).toUpperCase()}</div>
                    <div>
                      <div class="review-author-name">${author}</div>
                      <span class="review-verified-badge">✓ ${isAr ? 'مشتري موثق' : 'Verified Buyer'}</span>
                    </div>
                  </div>
                  <div class="review-meta">
                    <div class="rating-stars">${'★'.repeat(rating)}</div>
                    <span class="review-date">${today}</span>
                  </div>
                </div>
                <h4 class="review-title">${title}</h4>
                <p class="review-content">${content}</p>
              </div>
            `;
            reviewsContainer.insertAdjacentHTML('afterbegin', cardHtml);
          }

          ProductDetail.closeReviewModal();
          if (typeof Toast !== 'undefined') {
            Toast.show(isAr ? 'تم نشر تقييمك بنجاح! شكراً لمشاركتك.' : 'Review submitted successfully! Thank you.', 'success');
          }
          form.reset();
        });
      }
    }

    modal.classList.add('is-open');
    document.body.classList.add('modal-open');
  },

  closeReviewModal() {
    const modal = document.getElementById('product-review-modal');
    if (modal) {
      modal.classList.remove('is-open');
      document.body.classList.remove('modal-open');
    }
  },

  renderReviews() {
    const reviewsContainer = document.getElementById('product-reviews-list');
    if (!reviewsContainer) return;

    const lang = I18n.getLang();

    const mockReviews = [
      {
        author: lang === 'ar' ? "جوليان ستيرلينغ" : "Julian H. Sterling",
        badge: I18n.t('verifiedBuyer') || "Verified Buyer",
        rating: 5,
        date: lang === 'ar' ? "14 أكتوبر 2025" : "October 14, 2025",
        title: lang === 'ar' ? "قمة الفخامة والإتقان الهندسي والأداء الاستثنائي" : "Absolute pinnacle of craftsmanship and performance.",
        content: lang === 'ar' ? "خامات التيتانيوم المصقولة والنقاء الصوتي فائق الدقة لا مثيل لهما. التوصيل كان سريعاً وفخماً للغاية والتغليف بأعلى معايير الحماية." : "The titanium finish and acoustic resonance surpass anything else on the market. Diamond's express courier delivered it in flawless museum-grade packaging."
      },
      {
        author: lang === 'ar' ? "راشد الكواري" : "Rashid Al-Kuwari",
        badge: I18n.t('verifiedBuyer') || "Verified Buyer",
        rating: 5,
        date: lang === 'ar' ? "02 ديسمبر 2025" : "December 02, 2025",
        title: lang === 'ar' ? "قمة الفخامة والأداء الاستثنائي" : "Pinnacle of Luxury and Performance",
        content: lang === 'ar' ? "تجربة شحن وسرعة استجابة مذهلة. خامات التيتانيوم خفيفة جداً والكاميرا تلتقط تفاصيل فائقة النقاء." : "Incredible dispatch speed and build quality. The titanium chassis is ultra-light and the pro camera captures stunning details."
      },
      {
        author: lang === 'ar' ? "إيلينا فاسيليفا" : "Elena Rostova",
        badge: I18n.t('verifiedBuyer') || "Verified Buyer",
        rating: 4.8,
        date: lang === 'ar' ? "19 يناير 2026" : "January 19, 2026",
        title: lang === 'ar' ? "تجاوز كافة توقعاتي بأعلى المعايير" : "Exceeded my highest expectations.",
        content: lang === 'ar' ? "من سطوع الشاشة تحت أشعة الشمس المباشرة وحتى عمر البطارية الطويل، هذا هو الجهاز الرائد بلا منازع." : "From the display brightness under direct sunlight to the battery endurance, this is the definitive flagship device."
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

  updateSEO(p, lang) {
    const name = p.name[lang] || p.name.en;
    const desc = p.description[lang] || p.description.en;
    const img = (p.images && p.images.length > 0) ? p.images[0] : 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1200&q=85';
    const currentPrice = this.getCurrentPrice();
    const pageUrl = window.location.href;

    // 1. Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = desc;

    // 2. Open Graph Tags
    const setOgTag = (property, content) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.content = content;
    };

    setOgTag('og:type', 'product');
    setOgTag('og:title', `${name} — Diamond Luxury Tech`);
    setOgTag('og:description', desc);
    setOgTag('og:image', img);
    setOgTag('og:url', pageUrl);
    setOgTag('og:site_name', 'Diamond Luxury Tech');
    setOgTag('product:price:amount', currentPrice.toString());
    setOgTag('product:price:currency', 'USD');

    // 3. Twitter Card
    const setTwitterTag = (name, content) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', name);
        document.head.appendChild(tag);
      }
      tag.content = content;
    };
    setTwitterTag('twitter:card', 'summary_large_image');
    setTwitterTag('twitter:title', `${name} — Diamond`);
    setTwitterTag('twitter:description', desc);
    setTwitterTag('twitter:image', img);

    // 4. Schema.org Product JSON-LD (Google Rich Snippets)
    let schemaScript = document.getElementById('product-jsonld');
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.id = 'product-jsonld';
      schemaScript.type = 'application/ld+json';
      document.head.appendChild(schemaScript);
    }

    const schemaData = {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": name,
      "image": p.images,
      "description": desc,
      "brand": {
        "@type": "Brand",
        "name": p.brand
      },
      "sku": p.id,
      "offers": {
        "@type": "Offer",
        "url": pageUrl,
        "priceCurrency": "USD",
        "price": currentPrice,
        "itemCondition": "https://schema.org/NewCondition",
        "availability": p.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        "seller": {
          "@type": "Organization",
          "name": "Diamond Tech Inc."
        }
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": p.rating || 4.9,
        "reviewCount": p.reviewsCount || 150
      }
    };

    schemaScript.textContent = JSON.stringify(schemaData, null, 2);
  },

  renderRelated() {
    const container = document.getElementById('related-products-container');
    if (!container) return;

    const related = ProductService.getRelated(this.product.id, 4);
    const lang = I18n.getLang();

    container.innerHTML = related.map(p => Shop.renderProductCard(p, lang)).join('');
  }
};

window.ProductDetail = ProductDetail;

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('product-main-image')) {
    ProductDetail.init();
  }
});
