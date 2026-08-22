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
    if (priceEl) priceEl.textContent = `$${currPrice.toLocaleString()}`;
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
            <div class="highlight-box">
              <div class="hl-icon">🛡️</div>
              <h4>${I18n.t('featureHl3Title')}</h4>
              <p>${I18n.t('featureHl3Desc')}</p>
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

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('product-main-image')) {
    ProductDetail.init();
  }
});
