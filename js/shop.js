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
  sidebarCollapsed: true,
  filterDrawerOpen: false,

  init() {
    this.parseUrlParams();
    this.renderCategoryCounts();
    this.renderConditionFilters();
    this.renderBrandFilters();
    this.bindEvents();
    this.renderProducts();
    this.updateActiveFilterPills();
    this.updateFilterBadge();

    const toggleText = document.getElementById('btn-toggle-filters-text');
    if (toggleText) {
      toggleText.textContent = this.sidebarCollapsed 
        ? I18n.t('btnShowFilters') 
        : I18n.t('btnHideFilters');
    }
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
    const newTitle = I18n.t('conditionNewTitle') || 'Brand New';
    const newBracket = I18n.t('conditionNewBracket') || '(Sealed Box)';
    const likeNewTitle = I18n.t('conditionLikeNewTitle') || 'Like New';
    const likeNewBracket = I18n.t('conditionLikeNewBracket') || '(Used < 1 Year)';
    const certTitle = I18n.t('conditionCertifiedTitle') || 'Certified Used';
    const certBracket = I18n.t('conditionCertifiedBracket') || '(< 3 Years)';

    container.innerHTML = `
      <label class="filter-radio-label condition-filter-label">
        <div class="filter-label-left">
          <input type="radio" name="filter-condition-radio" value="all" ${this.activeCondition === 'all' ? 'checked' : ''}>
          <div class="condition-text-block">
            <span class="condition-main-name" data-i18n="filterAllConditions">${allText}</span>
          </div>
        </div>
        <span class="count-pill">${allCount}</span>
      </label>
      <label class="filter-radio-label condition-filter-label">
        <div class="filter-label-left">
          <input type="radio" name="filter-condition-radio" value="new" ${this.activeCondition === 'new' ? 'checked' : ''}>
          <div class="condition-text-block">
            <span class="condition-main-name" data-i18n="conditionNewTitle">${newTitle}</span>
            <span class="condition-sub-bracket" data-i18n="conditionNewBracket">${newBracket}</span>
          </div>
        </div>
        <span class="count-pill">${countNew}</span>
      </label>
      <label class="filter-radio-label condition-filter-label">
        <div class="filter-label-left">
          <input type="radio" name="filter-condition-radio" value="like-new" ${this.activeCondition === 'like-new' ? 'checked' : ''}>
          <div class="condition-text-block">
            <span class="condition-main-name" data-i18n="conditionLikeNewTitle">${likeNewTitle}</span>
            <span class="condition-sub-bracket" data-i18n="conditionLikeNewBracket">${likeNewBracket}</span>
          </div>
        </div>
        <span class="count-pill">${countLikeNew}</span>
      </label>
      <label class="filter-radio-label condition-filter-label">
        <div class="filter-label-left">
          <input type="radio" name="filter-condition-radio" value="certified" ${this.activeCondition === 'certified' ? 'checked' : ''}>
          <div class="condition-text-block">
            <span class="condition-main-name" data-i18n="conditionCertifiedTitle">${certTitle}</span>
            <span class="condition-sub-bracket" data-i18n="conditionCertifiedBracket">${certBracket}</span>
          </div>
        </div>
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
    const lang = (typeof I18n !== 'undefined') ? I18n.getLang() : 'en';

    let html = `
      <label class="filter-radio-label">
        <div class="filter-label-left">
          <input type="radio" name="filter-brand-radio" value="all" ${this.activeBrand === 'all' ? 'checked' : ''}>
          <span data-i18n="filterAllBrands">${allBrandsText}</span>
        </div>
        <span class="count-pill">${allCount}</span>
      </label>
    `;

    brands.forEach(brand => {
      const count = allProducts.filter(p => p.brand.toLowerCase() === brand.toLowerCase()).length;
      const brandDisplayName = (typeof I18n !== 'undefined') ? I18n.getBrandName(brand, lang) : brand;
      html += `
        <label class="filter-radio-label">
          <div class="filter-label-left">
            <input type="radio" name="filter-brand-radio" value="${brand}" ${this.activeBrand.toLowerCase() === brand.toLowerCase() ? 'checked' : ''}>
            <span>${brandDisplayName}</span>
          </div>
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
    const minLabel = document.getElementById('slider-min-label');
    const maxLabel = document.getElementById('slider-max-label');

    const updateSliderUI = () => {
      const lang = (typeof I18n !== 'undefined') ? I18n.getLang() : 'en';
      if (priceValueDisplay) {
        priceValueDisplay.textContent = (typeof I18n !== 'undefined' && I18n.formatPrice) ? I18n.formatPrice(this.maxPrice, lang) : (`${this.maxPrice.toLocaleString()} QR`);
      }
      if (minLabel) minLabel.textContent = (lang === 'ar') ? '100 ر.ق' : '100 QR';
      if (maxLabel) maxLabel.textContent = (lang === 'ar') ? '+6,000 ر.ق' : '6,000+ QR';
    };

    if (priceSlider) {
      priceSlider.addEventListener('input', (e) => {
        this.maxPrice = parseInt(e.target.value, 10);
        updateSliderUI();
        this.renderProducts();
      });
    }

    window.addEventListener('diamond:languageChanged', () => {
      updateSliderUI();
      this.renderProducts();
    });

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

    // Grid / List toggle with robust touch & click support
    const btnGrid = document.getElementById('btn-view-grid');
    const btnList = document.getElementById('btn-view-list');
    
    const setViewMode = (mode) => {
      this.viewMode = mode;
      const container = document.getElementById('shop-products-container');
      if (mode === 'grid') {
        if (btnGrid) btnGrid.classList.add('active');
        if (btnList) btnList.classList.remove('active');
        if (container) {
          container.classList.remove('list-view');
          container.classList.add('grid-view');
        }
      } else {
        if (btnList) btnList.classList.add('active');
        if (btnGrid) btnGrid.classList.remove('active');
        if (container) {
          container.classList.remove('grid-view');
          container.classList.add('list-view');
        }
      }
    };

    if (btnGrid) {
      btnGrid.addEventListener('click', (e) => {
        e.preventDefault();
        setViewMode('grid');
      });
    }

    if (btnList) {
      btnList.addEventListener('click', (e) => {
        e.preventDefault();
        setViewMode('list');
      });
    }

    // Filter Toggle / Drawer Button
    const btnToggle = document.getElementById('btn-toggle-filters');
    if (btnToggle) {
      btnToggle.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleFilters();
      });
    }

    // Close Drawer Buttons & Backdrop
    const btnCloseDrawer = document.getElementById('btn-close-filter-drawer');
    if (btnCloseDrawer) {
      btnCloseDrawer.addEventListener('click', (e) => {
        e.preventDefault();
        this.closeFilterDrawer();
      });
    }

    const drawerOverlay = document.getElementById('filter-drawer-overlay');
    if (drawerOverlay) {
      drawerOverlay.addEventListener('click', () => {
        this.closeFilterDrawer();
      });
    }

    const btnApplyDrawer = document.getElementById('btn-apply-filter-drawer');
    if (btnApplyDrawer) {
      btnApplyDrawer.addEventListener('click', (e) => {
        e.preventDefault();
        this.closeFilterDrawer();
        const mainContent = document.querySelector('.shop-main-content');
        if (mainContent && window.innerWidth <= 992) {
          mainContent.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }

    // Close drawer on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.filterDrawerOpen) {
        this.closeFilterDrawer();
      }
    });

    // Window Resize listener to reset drawer state if resizing to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 992 && this.filterDrawerOpen) {
        this.closeFilterDrawer();
      }
    });

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
      this.updateFilterBadge();
      const toggleText = document.getElementById('btn-toggle-filters-text');
      if (toggleText) {
        toggleText.textContent = this.sidebarCollapsed 
          ? I18n.t('btnShowFilters') 
          : I18n.t('btnFilters');
      }
    });

    window.addEventListener('diamond:wishlistUpdated', () => {
      this.renderProducts();
    });
  },

  toggleFilters() {
    const isMobile = window.innerWidth <= 992;
    if (isMobile) {
      if (this.filterDrawerOpen) {
        this.closeFilterDrawer();
      } else {
        this.openFilterDrawer();
      }
    } else {
      this.sidebarCollapsed = !this.sidebarCollapsed;
      const gridContainer = document.getElementById('shop-grid-container');
      const toggleBtn = document.getElementById('btn-toggle-filters');
      const toggleText = document.getElementById('btn-toggle-filters-text');
      
      if (gridContainer) {
        gridContainer.classList.toggle('sidebar-collapsed', this.sidebarCollapsed);
      }
      if (toggleBtn) {
        toggleBtn.classList.toggle('is-collapsed', this.sidebarCollapsed);
      }
      if (toggleText) {
        toggleText.textContent = this.sidebarCollapsed 
          ? I18n.t('btnShowFilters') 
          : I18n.t('btnHideFilters');
      }
    }
  },

  openFilterDrawer() {
    this.filterDrawerOpen = true;
    const sidebar = document.getElementById('shop-sidebar');
    const overlay = document.getElementById('filter-drawer-overlay');
    const toggleBtn = document.getElementById('btn-toggle-filters');
    const toggleText = document.getElementById('btn-toggle-filters-text');

    if (sidebar) sidebar.classList.add('drawer-open');
    if (overlay) overlay.classList.add('is-active');
    if (toggleBtn) toggleBtn.classList.add('is-active');
    if (toggleText) toggleText.textContent = (typeof I18n !== 'undefined' && I18n.t) ? I18n.t('btnHideFilters') : 'Hide Filters';
    document.body.style.overflow = 'hidden';
  },

  closeFilterDrawer() {
    this.filterDrawerOpen = false;
    const sidebar = document.getElementById('shop-sidebar');
    const overlay = document.getElementById('filter-drawer-overlay');
    const toggleBtn = document.getElementById('btn-toggle-filters');
    const toggleText = document.getElementById('btn-toggle-filters-text');

    if (sidebar) sidebar.classList.remove('drawer-open');
    if (overlay) overlay.classList.remove('is-active');
    if (toggleBtn) toggleBtn.classList.remove('is-active');
    if (toggleText) toggleText.textContent = (typeof I18n !== 'undefined' && I18n.t) ? I18n.t('btnShowFilters') : 'Show Filters';
    document.body.style.overflow = '';
  },

  updateFilterBadge() {
    let activeCount = 0;
    if (this.activeCategory !== 'all') activeCount++;
    if (this.activeCondition !== 'all') activeCount++;
    if (this.activeBrand !== 'all') activeCount++;
    if (this.maxPrice < 6000) activeCount++;
    if (this.searchQuery && this.searchQuery.trim().length > 0) activeCount++;

    const badge = document.getElementById('filter-active-count-badge');
    const toggleBtn = document.getElementById('btn-toggle-filters');
    if (badge) {
      if (activeCount > 0) {
        badge.textContent = activeCount;
        badge.style.display = 'inline-flex';
        if (toggleBtn) toggleBtn.classList.add('has-active-filters');
      } else {
        badge.style.display = 'none';
        if (toggleBtn) toggleBtn.classList.remove('has-active-filters');
      }
    }

    const filtered = this.getFilteredProducts();
    const applyBtn = document.getElementById('btn-apply-filter-drawer');
    if (applyBtn) {
      applyBtn.innerHTML = `<span>${I18n.t('btnApplyFilters')}</span> (${filtered.length})`;
    }
  },

  resetFilters() {
    this.activeCategory = 'all';
    this.activeCondition = 'all';
    this.activeBrand = 'all';
    this.maxPrice = 6000;
    this.searchQuery = '';
    this.sortBy = 'featured';

    // Clear URL search params
    if (window.history && window.history.replaceState) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Reset all radio inputs across sidebar
    document.querySelectorAll('input[name="filter-cat"]').forEach(r => { r.checked = (r.value === 'all'); });
    document.querySelectorAll('input[name="filter-condition-radio"]').forEach(r => { r.checked = (r.value === 'all'); });
    document.querySelectorAll('input[name="filter-brand-radio"]').forEach(r => { r.checked = (r.value === 'all'); });

    const priceSlider = document.getElementById('price-range-slider');
    const priceDisplay = document.getElementById('price-range-val');
    const minLabel = document.getElementById('slider-min-label');
    const maxLabel = document.getElementById('slider-max-label');
    this.maxPrice = 6000;
    if (priceSlider) {
      priceSlider.value = 6000;
      priceSlider.style.background = 'linear-gradient(to right, #0284c7 100%, #e2e8f0 100%)';
    }
    const currentLang = (typeof I18n !== 'undefined') ? I18n.getLang() : 'en';
    if (priceDisplay) {
      priceDisplay.textContent = (typeof I18n !== 'undefined' && I18n.formatPrice) ? I18n.formatPrice(6000, currentLang) : '6,000 QR';
    }
    if (minLabel) minLabel.textContent = (currentLang === 'ar') ? '100 ر.ق' : '100 QR';
    if (maxLabel) maxLabel.textContent = (currentLang === 'ar') ? '+6,000 ر.ق' : '6,000+ QR';

    const shopSearch = document.getElementById('shop-search-input');
    if (shopSearch) shopSearch.value = '';

    const sortSelect = document.getElementById('sort-products-select');
    if (sortSelect) sortSelect.value = 'featured';

    this.renderCategoryCounts();
    this.renderConditionFilters();
    this.renderBrandFilters();
    this.renderProducts();
    this.updateActiveFilterPills();
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
      const searchMatches = ProductService.search(this.searchQuery, lang);
      const matchIds = new Set(searchMatches.map(p => p.id));
      list = list.filter(p => matchIds.has(p.id));
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

  renderSkeletons(count = 6) {
    const container = document.getElementById('shop-products-container');
    if (!container) return;

    const skeletons = Array.from({ length: count }).map(() => `
      <div class="skeleton-card">
        <div class="skeleton-shimmer skeleton-img-wrap"></div>
        <div class="skeleton-body">
          <div class="skeleton-shimmer skeleton-line skeleton-line-sm"></div>
          <div class="skeleton-shimmer skeleton-line skeleton-line-title"></div>
          <div class="skeleton-shimmer skeleton-line skeleton-line-sub"></div>
          <div class="skeleton-shimmer skeleton-line skeleton-line-stars"></div>
          <div class="skeleton-footer">
            <div class="skeleton-shimmer skeleton-price"></div>
            <div class="skeleton-shimmer skeleton-btn"></div>
          </div>
        </div>
      </div>
    `).join('');

    container.innerHTML = skeletons;
  },

  renderProducts(withShimmer = true) {
    const container = document.getElementById('shop-products-container');
    if (!container) return;

    if (withShimmer) {
      if (this._shimmerTimer) clearTimeout(this._shimmerTimer);
      this.renderSkeletons(6);
      this._shimmerTimer = setTimeout(() => {
        this._executeRenderProducts();
      }, 160);
    } else {
      this._executeRenderProducts();
    }
  },

  _executeRenderProducts() {
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
    this.updateFilterBadge();

    if (products.length === 0) {
      const emptyDesc = (lang === 'ar')
        ? 'لم نتمكن من العثور على أجهزة مطابقة لمعايير البحث أو التصفية الحالية. اضغط أدناه لإعادة ضبط الفلاتر وعرض الكتالوج بالكامل.'
        : 'No devices match your current filters or search query. Click below to reset your criteria and view the complete flagship catalog.';

      container.innerHTML = `
        <div class="no-products-state catalog-no-results">
          <div class="no-results-icon-wrap">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>
          <h3>${I18n.t('noProductsMatch')}</h3>
          <p>${emptyDesc}</p>
          <button type="button" id="btn-reset-empty-filters" class="btn-reset-empty" onclick="event.preventDefault(); event.stopPropagation(); Shop.resetFilters()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path><path d="M21 3v5h-5"></path><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path><path d="M8 16H3v5"></path></svg>
            <span>${I18n.t('filterClearAll')}</span>
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = products.map(p => this.renderProductCard(p, lang)).join('');
    window.dispatchEvent(new CustomEvent('diamond:productsRendered'));
  },

  renderProductCard(product, lang = (typeof I18n !== 'undefined' ? I18n.getLang() : 'en')) {
    const name = (typeof product.name === 'object') ? (product.name[lang] || product.name.en) : product.name;
    const tagline = (typeof product.tagline === 'object') ? (product.tagline[lang] || product.tagline.en) : product.tagline;
    const brandName = (typeof I18n !== 'undefined') ? I18n.getBrandName(product.brand, lang) : product.brand;
    const colorsHtml = (product.colors || []).slice(0, 4).map(c => `
      <span class="color-preview-dot" style="background-color: ${c.hex}" title="${(c.name && typeof c.name === 'object') ? (c.name[lang] || c.name.en) : (c.name || '')}"></span>
    `).join('');

    return `
      <div class="product-card" data-id="${product.id}" onclick="if (!event.target.closest('button, .btn-card-addcart, .btn-card-quickview, .btn-quick-view, [data-action]')) { window.location.href = 'product.html?id=${product.id}'; }">
        <div class="product-card-img-wrap-outer">
          <a href="product.html?id=${product.id}" class="product-card-img-wrap">
            <img src="${product.images[0]}" alt="${name}" class="product-card-img" loading="lazy" decoding="async" width="400" height="400" onerror="this.src='https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80'">
          </a>
        </div>

        <div class="product-card-body">
          <div class="product-card-meta">
            <span class="product-card-brand">${brandName}</span>
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
              <span class="product-card-price">${(typeof I18n !== 'undefined' && I18n.formatPrice) ? I18n.formatPrice(product.basePrice, lang) : (product.basePrice.toLocaleString() + ' QR')}</span>
            </div>

            <div class="product-card-actions">
              <button type="button" class="btn-card-quickview btn-quick-view" data-product-id="${product.id}" title="${I18n.t('quickView')}">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              </button>
              <button type="button" class="btn-card-addcart" data-product-id="${product.id}" onclick="event.preventDefault(); event.stopPropagation(); Cart.addItem('${product.id}', 1)" title="${I18n.t('addToCart')}">
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

    const lang = (typeof I18n !== 'undefined') ? I18n.getLang() : 'en';
    const pills = [];

    if (this.activeCategory !== 'all') {
      const catKey = `cat${this.activeCategory.charAt(0).toUpperCase() + this.activeCategory.slice(1)}`;
      pills.push({ label: `${I18n.t('filterPillCategory')}${I18n.t(catKey) || this.activeCategory}`, reset: () => { this.activeCategory = 'all'; const r = document.querySelector('input[name="filter-cat"][value="all"]'); if (r) r.checked = true; } });
    }

    if (this.activeCondition !== 'all') {
      let condLabel = I18n.t('filterPillCondition');
      if (this.activeCondition === 'new') condLabel += I18n.t('conditionNeverUsed');
      else if (this.activeCondition === 'like-new') condLabel += I18n.t('conditionLikeNew');
      else condLabel += I18n.t('conditionCertified');
      pills.push({ label: condLabel, reset: () => { this.activeCondition = 'all'; const c = document.querySelector('input[name="filter-condition-radio"][value="all"]'); if (c) c.checked = true; } });
    }

    if (this.activeBrand !== 'all') {
      const brandLabel = (typeof I18n !== 'undefined') ? I18n.getBrandName(this.activeBrand, lang) : this.activeBrand;
      pills.push({ label: `${I18n.t('filterPillBrand')}${brandLabel}`, reset: () => { this.activeBrand = 'all'; const b = document.querySelector('input[name="filter-brand-radio"][value="all"]'); if (b) b.checked = true; } });
    }

    if (this.maxPrice < 6000) {
      const formattedMax = (typeof I18n !== 'undefined' && I18n.formatPrice) ? I18n.formatPrice(this.maxPrice, lang) : (`${this.maxPrice.toLocaleString()} QR`);
      pills.push({ label: `${I18n.t('filterPillMaxPrice')}${formattedMax}`, reset: () => { this.maxPrice = 6000; const p = document.getElementById('price-range-slider'); if (p) p.value = 6000; } });
    }

    if (this.searchQuery) {
      pills.push({ label: `${I18n.t('filterPillSearch')}"${this.searchQuery}"`, reset: () => { this.searchQuery = ''; const s = document.getElementById('shop-search-input'); if (s) s.value = ''; } });
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
        e.preventDefault();
        e.stopPropagation();
        const idx = parseInt(e.target.dataset.pillIdx, 10);
        if (pills[idx]) {
          pills[idx].reset();
          this.renderCategoryCounts();
          this.renderConditionFilters();
          this.renderBrandFilters();
          this.renderProducts();
          this.updateActiveFilterPills();
        }
      });
    });
  }
};

window.Shop = Shop;

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('shop-products-container')) {
    Shop.init();
  }
});
