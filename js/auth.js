/**
 * Diamond E-Commerce - Authentication & Profile Management System
 * Handles Sign In, Sign Up, Profile Settings with Custom Picture Upload, and My Orders
 */

const Auth = {
  userSessionKey: 'diamond_user_session',
  usersDbKey: 'diamond_registered_users',
  ordersHistoryKey: 'diamond_orders_history',

  defaultUsers: [
    {
      id: 'usr_001',
      name: 'Alexander Vance',
      email: 'alexander@example.com',
      password: 'password123',
      phone: '+974 7104 0746',
      avatar: null,
      memberSince: '2026'
    }
  ],

  getUsers() {
    try {
      const data = localStorage.getItem(this.usersDbKey);
      if (!data) {
        localStorage.setItem(this.usersDbKey, JSON.stringify(this.defaultUsers));
        return this.defaultUsers;
      }
      return JSON.parse(data);
    } catch (e) {
      return this.defaultUsers;
    }
  },

  getCurrentUser() {
    try {
      const data = localStorage.getItem(this.userSessionKey);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },

  isAuthenticated() {
    return this.getCurrentUser() !== null;
  },

  signIn(email, password) {
    const users = this.getUsers();
    const cleanEmail = (email || '').trim().toLowerCase();
    const user = users.find(u => u.email.toLowerCase() === cleanEmail && u.password === password);

    if (user) {
      const sessionData = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || '+974 7104 0746',
        avatar: user.avatar || null,
        memberSince: user.memberSince || '2026'
      };
      localStorage.setItem(this.userSessionKey, JSON.stringify(sessionData));
      this.updateNavbarUI();
      this.closeModals();
      Toast.show(`${I18n.t('authSuccessLogin')} ${user.name}!`, 'success');
      window.dispatchEvent(new CustomEvent('diamond:authChanged', { detail: { user: sessionData } }));
      return { success: true };
    }

    return {
      success: false,
      message: I18n.getLang() === 'ar' 
        ? 'بيانات الاعتماد غير صحيحة. يرجى التحقق من البريد الإلكتروني وكلمة المرور.'
        : 'Invalid credentials. Please check your email and password.'
    };
  },

  signUp(name, email, password) {
    if (!name || !email || !password) {
      return {
        success: false,
        message: I18n.getLang() === 'ar' ? 'يرجى إكمال كافة الحقول المطلوبة.' : 'Please fill in all required fields.'
      };
    }

    const users = this.getUsers();
    const cleanEmail = email.trim().toLowerCase();
    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      return {
        success: false,
        message: I18n.getLang() === 'ar' ? 'هذا البريد الإلكتروني مسجل مسبقاً.' : 'An account with this email already exists.'
      };
    }

    const newUser = {
      id: `usr_${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      password: password,
      phone: '',
      avatar: null,
      memberSince: '2026'
    };

    users.push(newUser);
    localStorage.setItem(this.usersDbKey, JSON.stringify(users));

    const sessionData = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      avatar: null,
      memberSince: newUser.memberSince
    };
    localStorage.setItem(this.userSessionKey, JSON.stringify(sessionData));
    this.updateNavbarUI();
    this.closeModals();
    Toast.show(I18n.t('authSuccessRegister'), 'success');
    window.dispatchEvent(new CustomEvent('diamond:authChanged', { detail: { user: sessionData } }));
    return { success: true };
  },

  updateProfile(name, email, phone, avatarBase64) {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return { success: false };

    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === currentUser.id);

    const updatedUser = {
      ...currentUser,
      name: (name || currentUser.name).trim(),
      email: (email || currentUser.email).trim().toLowerCase(),
      phone: (phone || currentUser.phone || '').trim(),
      avatar: avatarBase64 !== undefined ? avatarBase64 : currentUser.avatar
    };

    if (userIndex > -1) {
      users[userIndex] = { ...users[userIndex], ...updatedUser };
      localStorage.setItem(this.usersDbKey, JSON.stringify(users));
    }

    localStorage.setItem(this.userSessionKey, JSON.stringify(updatedUser));
    this.updateNavbarUI();
    this.closeModals();
    Toast.show(I18n.t('profileSuccessSaved'), 'success');
    window.dispatchEvent(new CustomEvent('diamond:authChanged', { detail: { user: updatedUser } }));
    return { success: true };
  },

  logout() {
    localStorage.removeItem(this.userSessionKey);
    this.updateNavbarUI();
    Toast.show(I18n.t('authLoggedOut'), 'info');
    window.dispatchEvent(new CustomEvent('diamond:authChanged', { detail: { user: null } }));
  },

  // Modal Openers
  openSignInModal() {
    this.closeModals();
    const modal = document.getElementById('auth-signin-modal');
    if (modal) modal.classList.add('is-open');
    document.body.classList.add('modal-open');
  },

  openSignUpModal() {
    this.closeModals();
    const modal = document.getElementById('auth-signup-modal');
    if (modal) modal.classList.add('is-open');
    document.body.classList.add('modal-open');
  },

  openForgotModal() {
    this.closeModals();
    const modal = document.getElementById('auth-forgot-modal');
    if (modal) {
      // Reset forms
      const step1 = document.getElementById('form-forgot-step1');
      const step2 = document.getElementById('form-forgot-step2');
      const errEl = document.getElementById('forgot-error');
      if (step1) step1.style.display = 'block';
      if (step2) step2.style.display = 'none';
      if (errEl) errEl.style.display = 'none';
      modal.classList.add('is-open');
    }
    document.body.classList.add('modal-open');
  },

  forgotPasswordState: { email: '', code: '' },

  sendResetCode(email) {
    if (!email || !email.includes('@')) {
      const errEl = document.getElementById('forgot-error');
      if (errEl) {
        errEl.textContent = I18n.getLang() === 'ar' ? 'يرجى إدخال بريد إلكتروني صحيح.' : 'Please enter a valid email address.';
        errEl.style.display = 'block';
      }
      return false;
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    this.forgotPasswordState = {
      email: email.trim().toLowerCase(),
      code: code
    };

    const step1 = document.getElementById('form-forgot-step1');
    const step2 = document.getElementById('form-forgot-step2');
    const errEl = document.getElementById('forgot-error');
    if (errEl) errEl.style.display = 'none';
    if (step1) step1.style.display = 'none';
    if (step2) step2.style.display = 'block';

    const codeInput = document.getElementById('forgot-code-input');
    if (codeInput) {
      codeInput.value = '';
      codeInput.focus();
    }

    Toast.show(`${I18n.t('authCodeSentToast')} ${code}`, 'success', 8000);
    return true;
  },

  verifyAndResetPassword(code, newPassword) {
    const errEl = document.getElementById('forgot-error');
    if (!this.forgotPasswordState.code || code.trim() !== this.forgotPasswordState.code) {
      if (errEl) {
        errEl.textContent = I18n.getLang() === 'ar' ? 'رمز التحقق غير صحيح. يرجى التأكد من الرمز والمحاولة مجدداً.' : 'Invalid verification code. Please check and try again.';
        errEl.style.display = 'block';
      }
      return false;
    }

    if (!newPassword || newPassword.length < 6) {
      if (errEl) {
        errEl.textContent = I18n.getLang() === 'ar' ? 'يجب أن تتكون كلمة المرور من 6 أحرف على الأقل.' : 'Password must be at least 6 characters.';
        errEl.style.display = 'block';
      }
      return false;
    }

    const users = this.getUsers();
    const cleanEmail = this.forgotPasswordState.email;
    const userIndex = users.findIndex(u => u.email.toLowerCase() === cleanEmail);

    if (userIndex > -1) {
      users[userIndex].password = newPassword;
      localStorage.setItem(this.usersDbKey, JSON.stringify(users));
    } else {
      // If user wasn't registered yet, create one
      const newUser = {
        id: `usr_${Date.now()}`,
        name: cleanEmail.split('@')[0],
        email: cleanEmail,
        password: newPassword,
        phone: '+974 7104 0746',
        avatar: null,
        memberSince: '2026'
      };
      users.push(newUser);
      localStorage.setItem(this.usersDbKey, JSON.stringify(users));
    }

    Toast.show(I18n.t('authPasswordResetSuccess'), 'success', 5000);
    this.openSignInModal();
    return true;
  },

  openProfileModal() {
    this.closeModals();
    const user = this.getCurrentUser();
    if (!user) {
      this.openSignInModal();
      return;
    }

    const modal = document.getElementById('profile-settings-modal');
    if (modal) {
      const nameInput = document.getElementById('profile-name-input');
      const emailInput = document.getElementById('profile-email-input');
      const phoneInput = document.getElementById('profile-phone-input');
      const phoneDialSelect = document.getElementById('profile-phone-dial');
      const avatarPreview = document.getElementById('profile-avatar-preview');

      if (nameInput) nameInput.value = user.name || '';
      if (emailInput) emailInput.value = user.email || '';
      
      if (phoneInput && user.phone) {
        // Extract dial code if present
        const match = user.phone.match(/^(\+\d{1,4})\s*(.*)$/);
        if (match && phoneDialSelect) {
          phoneDialSelect.value = match[1];
          phoneInput.value = match[2];
        } else {
          phoneInput.value = user.phone;
        }
      } else if (phoneInput) {
        phoneInput.value = '';
      }

      if (avatarPreview) {
        if (user.avatar) {
          avatarPreview.innerHTML = `<img src="${user.avatar}" alt="Avatar" class="avatar-img-preview">`;
        } else {
          const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
          avatarPreview.innerHTML = `<span class="avatar-initials-preview">${initials}</span>`;
        }
      }

      modal.classList.add('is-open');
      document.body.classList.add('modal-open');
    }
  },

  openOrdersModal() {
    this.closeModals();
    const modal = document.getElementById('my-orders-modal');
    const container = document.getElementById('orders-list-container');
    if (!modal) return;

    let orders = [];
    try {
      orders = JSON.parse(localStorage.getItem(this.ordersHistoryKey) || '[]');
    } catch (e) {
      orders = [];
    }

    const lang = I18n.getLang();

    if (!orders || orders.length === 0) {
      if (container) {
        container.innerHTML = `
          <div class="orders-empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
            <p>${I18n.t('ordersEmpty')}</p>
            <a href="shop.html" class="btn btn-primary btn-sm" style="margin-top: 14px;">${I18n.t('cartContinueShopping')}</a>
          </div>
        `;
      }
    } else {
      if (container) {
        container.innerHTML = orders.map(order => {
          const itemsText = order.items.map(i => `${i.name[lang] || i.name.en} (x${i.quantity})`).join(', ');
          const waMsg = lang === 'ar' 
            ? `مرحباً دايموند تك، أود الاستفسار عن حالة الطلب رقم: ${order.orderId}`
            : `Hello Diamond, inquiring about status for Order ID: ${order.orderId}`;
          const waUrl = `https://wa.me/97471040746?text=${encodeURIComponent(waMsg)}`;
          return `
            <div class="order-history-item">
              <div class="order-item-header">
                <div>
                  <strong class="order-ref-badge">${order.orderId}</strong>
                  <span class="order-date-text">${order.date}</span>
                </div>
                <span class="order-status-pill">${I18n.t('orderStatusProcessing')}</span>
              </div>
              <div class="order-item-summary">
                <div class="order-items-names">${itemsText}</div>
                <div class="order-total-amount">$${order.total.toLocaleString()}</div>
              </div>
              <div class="order-item-actions">
                <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn-order-wa-track">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12.032 2C6.505 2 2.025 6.48 2.025 12.008c0 1.954.563 3.778 1.541 5.321L2 22l4.832-1.528A9.957 9.957 0 0 0 12.032 22C17.56 22 22.04 17.52 22.04 12.008 22.04 6.48 17.56 2 12.032 2z"/></svg>
                  <span>${I18n.t('trackOnWhatsApp')}</span>
                </a>
              </div>
            </div>
          `;
        }).join('');
      }
    }

    modal.classList.add('is-open');
    document.body.classList.add('modal-open');
  },

  closeModals() {
    document.querySelectorAll('.diamond-modal-container').forEach(m => m.classList.remove('is-open'));
    document.body.classList.remove('modal-open');
  },

  updateNavbarUI() {
    const user = this.getCurrentUser();
    const authTriggers = document.querySelectorAll('.auth-nav-container');
    const drawerAuthTriggers = document.querySelectorAll('.auth-drawer-container');

    authTriggers.forEach(container => {
      if (user) {
        const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        const avatarHtml = user.avatar
          ? `<img src="${user.avatar}" alt="${user.name}" class="navbar-avatar-img">`
          : `<span class="user-avatar-initials">${initials}</span>`;

        container.innerHTML = `
          <div class="user-profile-menu">
            <button type="button" class="btn-user-avatar" id="user-menu-btn" aria-label="User Account">
              ${avatarHtml}
              <span class="user-name-label">${user.name.split(' ')[0]}</span>
              <svg class="chevron-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>
            <div class="user-dropdown-menu" id="user-dropdown">
              <div class="dropdown-header">
                <div class="user-dropdown-name">${user.name}</div>
                <div class="user-dropdown-email">${user.email}</div>
              </div>
              <div class="dropdown-divider"></div>
              <button type="button" class="dropdown-item" onclick="Auth.openOrdersModal()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                <span data-i18n="navOrders">${I18n.t('navOrders')}</span>
              </button>
              <button type="button" class="dropdown-item" onclick="Auth.openProfileModal()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                <span data-i18n="navProfileSettings">${I18n.t('navProfileSettings')}</span>
              </button>
              <div class="dropdown-divider"></div>
              <button type="button" class="dropdown-item btn-logout" onclick="Auth.logout()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                <span data-i18n="navLogout">${I18n.t('navLogout')}</span>
              </button>
            </div>
          </div>
        `;
      } else {
        container.innerHTML = `
          <button type="button" class="btn-auth-signin" onclick="Auth.openSignInModal()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <span data-i18n="navSignIn">${I18n.t('navSignIn')}</span>
          </button>
        `;
      }
    });

    drawerAuthTriggers.forEach(container => {
      if (user) {
        const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        const avatarHtml = user.avatar
          ? `<img src="${user.avatar}" alt="${user.name}" class="navbar-avatar-img" style="width:40px;height:40px;border-radius:50%;">`
          : `<span class="user-avatar-initials" style="width:40px;height:40px;font-size:0.9rem;">${initials}</span>`;

        container.innerHTML = `
          <div class="drawer-user-card">
            <div class="drawer-user-info">
              ${avatarHtml}
              <div>
                <div class="drawer-user-name">${user.name}</div>
                <div class="drawer-user-email">${user.email}</div>
              </div>
            </div>
            <div class="drawer-user-actions">
              <button type="button" class="drawer-user-btn" onclick="Auth.openOrdersModal(); Auth.closeDrawerNav();">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                <span data-i18n="navOrders">${I18n.t('navOrders')}</span>
              </button>
              <button type="button" class="drawer-user-btn" onclick="Auth.openProfileModal(); Auth.closeDrawerNav();">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                <span data-i18n="navProfileSettings">${I18n.t('navProfileSettings')}</span>
              </button>
              <button type="button" class="drawer-user-btn btn-logout-drawer" onclick="Auth.logout()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                <span data-i18n="navLogout">${I18n.t('navLogout')}</span>
              </button>
            </div>
          </div>
        `;
      } else {
        container.innerHTML = `
          <button type="button" class="btn btn-primary btn-block btn-lg" onclick="Auth.openSignInModal(); Auth.closeDrawerNav();">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <span data-i18n="navSignIn">${I18n.t('navSignIn')}</span>
          </button>
        `;
      }
    });
  },

  closeDrawerNav() {
    const mobileDrawer = document.querySelector('.mobile-nav-drawer');
    const mobileOverlay = document.querySelector('.mobile-nav-overlay');
    if (mobileDrawer) mobileDrawer.classList.remove('is-open');
    if (mobileOverlay) mobileOverlay.classList.remove('is-open');
    document.body.classList.remove('mobile-nav-open');
  },

  init() {
    this.updateNavbarUI();

    // Toggle dropdowns & modal backdrops
    document.addEventListener('click', (e) => {
      const userBtn = e.target.closest('#user-menu-btn');
      if (userBtn) {
        const dropdown = userBtn.nextElementSibling;
        if (dropdown) dropdown.classList.toggle('is-open');
      } else if (!e.target.closest('.user-profile-menu')) {
        document.querySelectorAll('.user-dropdown-menu').forEach(d => d.classList.remove('is-open'));
      }

      if (e.target.classList.contains('modal-backdrop') || e.target.closest('.btn-close-modal')) {
        this.closeModals();
      }
    });

    // Handle Sign In submit
    document.addEventListener('submit', (e) => {
      if (e.target.id === 'form-signin') {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        const res = this.signIn(email, password);
        if (!res.success) {
          const errEl = document.getElementById('signin-error');
          if (errEl) {
            errEl.textContent = res.message;
            errEl.style.display = 'block';
          }
        }
      } else if (e.target.id === 'form-signup') {
        e.preventDefault();
        const name = e.target.name.value;
        const email = e.target.email.value;
        const password = e.target.password.value;
        const res = this.signUp(name, email, password);
        if (!res.success) {
          const errEl = document.getElementById('signup-error');
          if (errEl) {
            errEl.textContent = res.message;
            errEl.style.display = 'block';
          }
        }
      } else if (e.target.id === 'form-forgot-step1') {
        e.preventDefault();
        const email = document.getElementById('forgot-email-input')?.value;
        this.sendResetCode(email);
      } else if (e.target.id === 'form-forgot-step2') {
        e.preventDefault();
        const code = document.getElementById('forgot-code-input')?.value;
        const newPass = document.getElementById('forgot-newpass-input')?.value;
        this.verifyAndResetPassword(code, newPass);
      } else if (e.target.id === 'form-profile-settings') {
        e.preventDefault();
        const name = document.getElementById('profile-name-input')?.value;
        const email = document.getElementById('profile-email-input')?.value;
        const dial = document.getElementById('profile-phone-dial')?.value || '+974';
        const rawPhone = document.getElementById('profile-phone-input')?.value || '';
        const phone = rawPhone ? `${dial} ${rawPhone.trim()}` : '';
        const avatarImg = document.querySelector('#profile-avatar-preview img')?.src;
        this.updateProfile(name, email, phone, avatarImg);
      }
    });

    // Profile Picture File Upload Handler
    document.addEventListener('change', (e) => {
      if (e.target.id === 'profile-avatar-file') {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const preview = document.getElementById('profile-avatar-preview');
            if (preview) {
              preview.innerHTML = `<img src="${event.target.result}" alt="New Avatar Preview" class="avatar-img-preview">`;
            }
          };
          reader.readAsDataURL(file);
        }
      }
    });

    window.addEventListener('diamond:languageChanged', () => {
      this.updateNavbarUI();
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Auth.init();
});
