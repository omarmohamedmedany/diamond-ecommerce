/**
 * Diamond E-Commerce - Shop & Catalog Filtering Controller
 * Features sticky independent scroll sidebar, condition grading, interactive brand pills, and instant reactive filtering
 */

const Shop = {
  activeCategory: 'all',
  activeCondition: 'all',
  activeBrand: 'all',
  maxPrice: 6000,
  sortBy: 'featured',
  searchQuery: '',
  viewMode: 'grid',

  init() {
    this.parseUrlParams();
    this.renderCategoryCounts();
    this.renderConditionFilters();
    this.renderBrandFilters();
    this.bindEvents();
    this.renderProducts();
    this.updateActiveFilterPills();
  },

  parseUrlParams() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('category')) this.activeCategory = params.get('category');
    if (params.has('condition')) this.activeCondition = params.get('condition');
    if (params.has('brand')) this.activeBrand = params.get('brand');
    if (params.has('search')) this.searchQuery = params.get('search');
    if (params.has('sort')) this.sortBy = params.get('sort');

    const catRadio = document.querySelector(`input[name="filter-cat"][value="${this.activeCategory}"]`);
    if (catRadio) catRadio.checked = true;

    const sortSelect = document.getElementById('sort-products-select');
    if (sortSelect) sortSelect.value = this.sortBy;
  },

  renderCategoryCounts() {
    const allProducts = ProductService.getAll();
    const countAll = document.getElementById('cat-count-all');
    const countPhones = document.getElementById('cat-count-phones');
    const countWatches = document.getElementById('cat-count-watches');
    const countAudio = document.getElementById('cat-count-audio');
    const countAcc = document.getElementById('cat-count-accessories');

    if (countAll) countAll.textContent = allProducts.length;
    if (countPhones) countPhones.textContent = allProducts.filter(p => p.category === 'phones').length;
    if (countWatches) countWatches.textContent = allProducts.filter(p => p.category === 'watches').length;
    if (countAudio) countAudio.textContent = allProducts.filter(p => p.category === 'audio').length;
    if (countAcc) countAcc.textContent = allProducts.filter(p => p.category === 'accessories').length;
  },

  renderConditionFilters() {
    const container = document.getElementById('condition-filter-options');
    if (!container) return;

    const allProducts = ProductService.getAll();
    const allCount = allProducts.length;
    const countNew = allProducts.filter(p => (p.condition || 'new') === 'new').length;
    const countLikeNew = allProducts.filter(p => (p.condition || 'new') === 'like-new').length;
    const countCertified = allProducts.filter(p => (p.condition || 'new') === 'certified').length;

    const allText = I18n.t('filterAllConditions');
    const newText = I18n.t('conditionNeverUsed');
    const likeNewText = I18n.t('conditionLikeNew');
    const certifiedText = I18n.t('conditionCertified');

    container.innerHTML = `
      <label class="filter-radio-label">
        <span>
          <input type="radio" name="filter-condition-radio" value="all" ${this.activeCondition === 'all' ? 'checked' : ''}>
          <span data-i18n="filterAllConditions">${allText}</span>
        </span>
        <span class="count-pill">${allCount}</span>
      </label>
      <label class="filter-radio-label">
        <span>
          <input type="radio" name="filter-condition-radio" value="new" ${this.activeCondition === 'new' ? 'checked' : ''}>
          <span data-i18n="conditionNeverUsed">✨ ${newText}</span>
        </span>
        <span class="count-pill">${countNew}</span>
      </label>
      <label class="filter-radio-label">
        <span>
          <input type="radio" name="filter-condition-radio" value="like-new" ${this.activeCondition === 'like-new' ? 'checked' : ''}>
          <span data-i18n="conditionLikeNew">💎 ${likeNewText}</span>
        </span>
        <span class="count-pill">${countLikeNew}</span>
      </label>
      <label class="filter-radio-label">
        <span>
          <input type="radio" name="filter-condition-radio" value="certified" ${this.activeCondition === 'certified' ? 'checked' : ''}>
          <span data-i18n="conditionCertified">🛡️ ${certifiedText}</span>
        </span>
        <span class="count-pill">${countCertified}</span>
      </label>
    `;

    container.querySelectorAll('input[name="filter-condition-radio"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.activeCondition = e.target.value;
        this.renderProducts();
      });
    });
  },

  renderBrandFilters() {
    const brandContainer = document.getElementById('brand-filter-options');
    if (!brandContainer) return;

    const brands = ProductService.getBrands();
    const allProducts = ProductService.getAll();
    const allCount = allProducts.length;
    const allBrandsText = (typeof I18n !== 'undefined') ? I18n.t('filterAllBrands') : 'All Brands';

    let html = `
      <label class="filter-radio-label">
        <span>
          <input type="radio" name="filter-brand-radio" value="all" ${this.activeBrand === 'all' ? 'checked' : ''}>
          <span data-i18n="filterAllBrands">${allBrandsText}</span>
        </span>
        <span class="count-pill">${allCount}</span>
      </label>
    `;

    brands.forEach(brand => {
      const count = allProducts.filter(p => p.brand.toLowerCase() === brand.toLowerCase()).length;
      html += `
        <label class="filter-radio-label">
          <span>
            <input type="radio" name="filter-brand-radio" value="${brand}" ${this.activeBrand.toLowerCase() === brand.toLowerCase() ? 'checked' : ''}>
            <span>${brand}</span>
          </span>
          <span class="count-pill">${count}</span>
        </label>
      `;
    });

    brandContainer.innerHTML = html;

    brandContainer.querySelectorAll('input[name="filter-brand-radio"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.activeBrand = e.target.value;
        this.renderProducts();
      });
    });
  },

  bindEvents() {
    // Category radio filters
    document.querySelectorAll('input[name="filter-cat"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.activeCategory = e.target.value;
        this.renderProducts();
      });
    });

    // Price range slider
    const priceSlider = document.getElementById('price-range-slider');
    const priceValueDisplay = document.getElementById('price-range-val');
    if (priceSlider) {
      priceSlider.addEventListener('input', (e) => {
        this.maxPrice = parseInt(e.target.value, 10);
        if (priceValueDisplay) priceValueDisplay.textContent = `$${this.maxPrice.toLocaleString()}`;
        this.renderProducts();
      });
    }

    // Sort By dropdown
    const sortSelect = document.getElementById('sort-products-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.sortBy = e.target.value;
        this.renderProducts();
      });
    }

    // Search bar on shop page
    const shopSearch = document.getElementById('shop-search-input');
    if (shopSearch) {
      shopSearch.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.renderProducts();
      });
    }

    // Grid / List toggle
    const btnGrid = document.getElementById('btn-view-grid');
    const btnList = document.getElementById('btn-view-list');
    if (btnGrid && btnList) {
      btnGrid.addEventListener('click', () => {
        this.viewMode = 'grid';
        btnGrid.classList.add('active');
        btnList.classList.remove('active');
        const container = document.getElementById('shop-products-container');
        if (container) {
          container.classList.remove('list-view');
          container.classList.add('grid-view');
        }
      });

      btnList.addEventListener('click', () => {
        this.viewMode = 'list';
        btnList.classList.add('active');
        btnGrid.classList.remove('active');
        const container = document.getElementById('shop-products-container');
        if (container) {
          container.classList.remove('grid-view');
          container.classList.add('list-view');
        }
      });
    }

    // Clear all filters
    const clearBtn = document.getElementById('btn-clear-filters');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => this.resetFilters());
    }

    window.addEventListener('diamond:languageChanged', () => {
      this.renderCategoryCounts();
      this.renderConditionFilters();
      this.renderBrandFilters();
      this.renderProducts();
    });

    window.addEventListener('diamond:wishlistUpdated', () => {
      this.renderProducts();
    });
  },

  resetFilters() {
    this.activeCategory = 'all';
    this.activeCondition = 'all';
    this.activeBrand = 'all';
    this.maxPrice = 6000;
    this.searchQuery = '';
    this.sortBy = 'featured';

    const catRadio = document.querySelector('input[name="filter-cat"][value="all"]');
    if (catRadio) catRadio.checked = true;

    const condRadio = document.querySelector('input[name="filter-condition-radio"][value="all"]');
    if (condRadio) condRadio.checked = true;

    const brandRadio = document.querySelector('input[name="filter-brand-radio"][value="all"]');
    if (brandRadio) brandRadio.checked = true;

    const priceSlider = document.getElementById('price-range-slider');
    const priceDisplay = document.getElementById('price-range-val');
    if (priceSlider) priceSlider.value = 6000;
    if (priceDisplay) priceDisplay.textContent = '$6,000';

    const shopSearch = document.getElementById('shop-search-input');
    if (shopSearch) shopSearch.value = '';

    const sortSelect = document.getElementById('sort-products-select');
    if (sortSelect) sortSelect.value = 'featured';

    this.renderProducts();
  },

  getFilteredProducts() {
    let list = ProductService.getAll();
    const lang = I18n.getLang();

    if (this.activeCategory !== 'all') {
      list = list.filter(p => p.category === this.activeCategory);
    }

    if (this.activeCondition !== 'all') {
      list = list.filter(p => (p.condition || 'new') === this.activeCondition);
    }

    if (this.activeBrand !== 'all') {
      list = list.filter(p => p.brand.toLowerCase() === this.activeBrand.toLowerCase());
    }

    list = list.filter(p => p.basePrice <= this.maxPrice);

    if (this.searchQuery && this.searchQuery.trim() !== '') {
      const q = this.searchQuery.toLowerCase().trim();
      list = list.filter(p => {
        const name = (p.name[lang] || p.name.en).toLowerCase();
        const desc = (p.description[lang] || p.description.en).toLowerCase();
        return name.includes(q) || desc.includes(q) || p.brand.toLowerCase().includes(q);
      });
    }

    list = [...list].sort((a, b) => {
      switch (this.sortBy) {
        case 'price-low':
          return a.basePrice - b.basePrice;
        case 'price-high':
          return b.basePrice - a.basePrice;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return (b.badgeType === 'new' ? 1 : 0) - (a.badgeType === 'new' ? 1 : 0);
        case 'featured':
        default:
          return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      }
    });

    return list;
  },

  renderProducts() {
    const container = document.getElementById('shop-products-container');
    const countDisplay = document.getElementById('shop-results-count');
    if (!container) return;

    const products = this.getFilteredProducts();
    const allCount = ProductService.getAll().length;
    const lang = I18n.getLang();

    if (countDisplay) {
      countDisplay.innerHTML = `${I18n.t('showingProducts')} <strong>${products.length}</strong> ${I18n.t('ofProducts')} ${allCount} ${I18n.t('productsCount')}`;
    }

    this.updateActiveFilterPills();

    if (products.length === 0) {
      container.innerHTML = `
        <div class="no-products-state">
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <h3>${I18n.t('noProductsMatch')}</h3>
          <button type="button" class="btn btn-outline btn-sm" onclick="Shop.resetFilters()">${I18n.t('filterClearAll')}</button>
        </div>
      `;
      return;
    }

    container.innerHTML = products.map(p => this.renderProductCard(p, lang)).join('');
    window.dispatchEvent(new CustomEvent('diamond:productsRendered'));
  },

  renderProductCard(product, lang = 'en') {
    const name = product.name[lang] || product.name.en;
    const tagline = product.tagline[lang] || product.tagline.en;
    const isWishlisted = Cart.isInWishlist(product.id);
    const colorsHtml = (product.colors || []).slice(0, 4).map(c => `
      <span class="color-preview-dot" style="background-color: ${c.hex}" title="${c.name[lang] || c.name.en}"></span>
    `).join('');

    return `
      <div class="product-card" data-id="${product.id}">
        <div class="product-card-top">
          <button type="button" class="btn-wishlist-toggle ${isWishlisted ? 'is-active' : ''}" onclick="Cart.toggleWishlist('${product.id}')" title="${I18n.t('navWishlist')}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="${isWishlisted ? '#ef4444' : 'none'}" stroke="${isWishlisted ? '#ef4444' : 'currentColor'}" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          </button>
        </div>

        <a href="product.html?id=${product.id}" class="product-card-img-wrap">
          <img src="${product.images[0]}" alt="${name}" class="product-card-img" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80'">
        </a>

        <div class="product-card-body">
          <div class="product-card-meta">
            <span class="product-card-brand">${product.brand}</span>
            <div class="product-card-colors">${colorsHtml}</div>
          </div>

          <h3 class="product-card-title">
            <a href="product.html?id=${product.id}">${name}</a>
          </h3>
          <p class="product-card-tagline">${tagline}</p>

          <div class="product-card-rating">
            <div class="rating-stars">${'★'.repeat(Math.floor(product.rating))}</div>
            <span class="rating-num">${product.rating}</span>
            <span class="reviews-num">(${product.reviewsCount})</span>
          </div>

          <div class="product-card-footer">
            <div class="product-card-price-wrap">
              <span class="product-card-price">$${product.basePrice.toLocaleString()}</span>
            </div>

            <div class="product-card-actions">
              <button type="button" class="btn-card-quickview btn-quick-view" data-product-id="${product.id}" title="${I18n.t('quickView')}">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              </button>
              <button type="button" class="btn-card-addcart" onclick="Cart.addItem('${product.id}', 1)" title="${I18n.t('addToCart')}">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                <span>${I18n.t('addToCart')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  updateActiveFilterPills() {
    const container = document.getElementById('active-filter-pills');
    if (!container) return;

    const pills = [];

    if (this.activeCategory !== 'all') {
      const catKey = `cat${this.activeCategory.charAt(0).toUpperCase() + this.activeCategory.slice(1)}`;
      pills.push({ label: `Category: ${I18n.t(catKey) || this.activeCategory}`, reset: () => { this.activeCategory = 'all'; const r = document.querySelector('input[name="filter-cat"][value="all"]'); if (r) r.checked = true; } });
    }

    if (this.activeCondition !== 'all') {
      let label = 'Condition: ';
      if (this.activeCondition === 'new') label += I18n.t('conditionNeverUsed');
      else if (this.activeCondition === 'like-new') label += I18n.t('conditionLikeNew');
      else label += I18n.t('conditionCertified');
      pills.push({ label, reset: () => { this.activeCondition = 'all'; const c = document.querySelector('input[name="filter-condition-radio"][value="all"]'); if (c) c.checked = true; } });
    }

    if (this.activeBrand !== 'all') {
      pills.push({ label: `Brand: ${this.activeBrand}`, reset: () => { this.activeBrand = 'all'; const b = document.querySelector('input[name="filter-brand-radio"][value="all"]'); if (b) b.checked = true; } });
    }

    if (this.maxPrice < 6000) {
      pills.push({ label: `Max Price: $${this.maxPrice.toLocaleString()}`, reset: () => { this.maxPrice = 6000; const p = document.getElementById('price-range-slider'); if (p) p.value = 6000; } });
    }

    if (this.searchQuery) {
      pills.push({ label: `Search: "${this.searchQuery}"`, reset: () => { this.searchQuery = ''; const s = document.getElementById('shop-search-input'); if (s) s.value = ''; } });
    }

    if (pills.length === 0) {
      container.innerHTML = '';
      return;
    }

    container.innerHTML = `
      <div class="filter-pills-list">
        ${pills.map((pill, idx) => `
          <span class="filter-pill">
            <span>${pill.label}</span>
            <button type="button" class="btn-remove-pill" data-pill-idx="${idx}">&times;</button>
          </span>
        `).join('')}
        <button type="button" class="btn-reset-all-pills" onclick="Shop.resetFilters()">${I18n.t('filterClearAll')}</button>
      </div>
    `;

    container.querySelectorAll('.btn-remove-pill').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.target.dataset.pillIdx, 10);
        if (pills[idx]) {
          pills[idx].reset();
          this.renderProducts();
        }
      });
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('shop-products-container')) {
    Shop.init();
  }
});
