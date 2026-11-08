/**
 * Main Application Logic for L'Étoile Gourmet Chef Management System
 */

document.addEventListener("DOMContentLoaded", () => {
  // APP STATE
  const state = {
    dishes: [],
    selectedCategory: "All",
    searchQuery: "",
    statusFilter: "all",
    sortBy: "newest",
    viewLayout: "grid", // "grid" or "table"
    activeMode: "chef", // "chef" or "customer"
    currentUser: AuthService.getCurrentUser(),
    editingDishId: null,
    deletingDishId: null
  };

  // DOM ELEMENTS
  const DOM = {
    // Header
    portalSubTitle: document.getElementById("portalSubTitle"),
    viewToggleBtn: document.getElementById("viewToggleBtn"),
    viewToggleLabel: document.getElementById("viewToggleLabel"),
    addNewDishBtn: document.getElementById("addNewDishBtn"),
    userProfileWidget: document.getElementById("userProfileWidget"),

    // Views & Banners
    chefDashboardView: document.getElementById("chefDashboardView"),
    customerMenuView: document.getElementById("customerMenuView"),
    loginBanner: document.getElementById("loginBanner"),
    bannerLoginBtn: document.getElementById("bannerLoginBtn"),

    // Stats
    statTotalDishes: document.getElementById("statTotalDishes"),
    statActiveDishes: document.getElementById("statActiveDishes"),
    statOutOfStock: document.getElementById("statOutOfStock"),
    statFeaturedDishes: document.getElementById("statFeaturedDishes"),

    // Controls & Filters
    searchInput: document.getElementById("searchInput"),
    clearSearchBtn: document.getElementById("clearSearchBtn"),
    statusFilterSelect: document.getElementById("statusFilterSelect"),
    sortSelect: document.getElementById("sortSelect"),
    gridViewBtn: document.getElementById("gridViewBtn"),
    tableViewBtn: document.getElementById("tableViewBtn"),
    resetMenuBtn: document.getElementById("resetMenuBtn"),
    categoryTabs: document.getElementById("categoryTabs"),

    // Containers
    dishesGridContainer: document.getElementById("dishesGridContainer"),
    dishesTableContainer: document.getElementById("dishesTableContainer"),
    dishesTableBody: document.getElementById("dishesTableBody"),
    emptyState: document.getElementById("emptyState"),
    emptyStateAddBtn: document.getElementById("emptyStateAddBtn"),

    // Customer Menu Container
    customerCategoryNav: document.getElementById("customerCategoryNav"),
    customerDishesContainer: document.getElementById("customerDishesContainer"),

    // Modals & Forms
    loginModal: document.getElementById("loginModal"),
    loginForm: document.getElementById("loginForm"),
    loginEmail: document.getElementById("loginEmail"),
    loginPassword: document.getElementById("loginPassword"),
    rememberMe: document.getElementById("rememberMe"),
    loginErrorMsg: document.getElementById("loginErrorMsg"),

    dishModal: document.getElementById("dishModal"),
    dishModalTitle: document.getElementById("dishModalTitle"),
    dishForm: document.getElementById("dishForm"),
    dishFormId: document.getElementById("dishFormId"),
    dishName: document.getElementById("dishName"),
    dishCategory: document.getElementById("dishCategory"),
    dishPrice: document.getElementById("dishPrice"),
    dishPrepTime: document.getElementById("dishPrepTime"),
    dishCalories: document.getElementById("dishCalories"),
    dishDescription: document.getElementById("dishDescription"),
    dishIngredients: document.getElementById("dishIngredients"),
    dishImage: document.getElementById("dishImage"),
    imagePreview: document.getElementById("imagePreview"),
    presetImageButtons: document.getElementById("presetImageButtons"),
    dishAvailable: document.getElementById("dishAvailable"),
    dishFeatured: document.getElementById("dishFeatured"),

    deleteModal: document.getElementById("deleteModal"),
    deleteDishName: document.getElementById("deleteDishName"),
    confirmDeleteBtn: document.getElementById("confirmDeleteBtn"),

    toastContainer: document.getElementById("toastContainer")
  };

  // INITIALIZATION
  function init() {
    loadDishesData();
    renderAuthUI();
    renderPresetImageButtons();
    bindEvents();
    render();
  }

  function loadDishesData() {
    state.dishes = DishRepository.getDishes();
  }

  // RENDER MAIN APPLICATION UI
  function render() {
    updateStats();

    const filteredDishes = getFilteredDishes();

    if (state.activeMode === "chef") {
      DOM.chefDashboardView.style.display = "block";
      DOM.customerMenuView.style.display = "none";
      DOM.portalSubTitle.textContent = "Chef Manager Dashboard";
      DOM.viewToggleLabel.textContent = "View Customer Menu";

      if (filteredDishes.length === 0) {
        DOM.dishesGridContainer.style.display = "none";
        DOM.dishesTableContainer.style.display = "none";
        DOM.emptyState.style.display = "block";
      } else {
        DOM.emptyState.style.display = "none";
        if (state.viewLayout === "grid") {
          DOM.dishesGridContainer.style.display = "grid";
          DOM.dishesTableContainer.style.display = "none";
          renderGridView(filteredDishes);
        } else {
          DOM.dishesGridContainer.style.display = "none";
          DOM.dishesTableContainer.style.display = "block";
          renderTableView(filteredDishes);
        }
      }
    } else {
      // Customer View Mode
      DOM.chefDashboardView.style.display = "none";
      DOM.customerMenuView.style.display = "block";
      DOM.portalSubTitle.textContent = "Live Customer Digital Menu";
      DOM.viewToggleLabel.textContent = "Chef Dashboard";
      renderCustomerMenu(filteredDishes);
    }
  }

  // STATS UPDATE
  function updateStats() {
    const total = state.dishes.length;
    const active = state.dishes.filter(d => d.available).length;
    const stockout = total - active;
    const featured = state.dishes.filter(d => d.featured).length;

    DOM.statTotalDishes.textContent = total;
    DOM.statActiveDishes.textContent = active;
    DOM.statOutOfStock.textContent = stockout;
    DOM.statFeaturedDishes.textContent = featured;
  }

  // FILTER & SORT LOGIC
  function getFilteredDishes() {
    return state.dishes.filter(dish => {
      // Category filter
      if (state.selectedCategory !== "All") {
        if (state.selectedCategory === "Specials") {
          if (!dish.featured) return false;
        } else if (dish.category !== state.selectedCategory) {
          return false;
        }
      }

      // Availability / Status filter
      if (state.statusFilter === "available" && !dish.available) return false;
      if (state.statusFilter === "unavailable" && dish.available) return false;
      if (state.statusFilter === "featured" && !dish.featured) return false;

      // Search Query
      if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase();
        const matchesName = dish.name.toLowerCase().includes(query);
        const matchesDesc = dish.description.toLowerCase().includes(query);
        const matchesIngr = dish.ingredients.some(ing => ing.toLowerCase().includes(query));
        if (!matchesName && !matchesDesc && !matchesIngr) return false;
      }

      return true;
    }).sort((a, b) => {
      if (state.sortBy === "name-asc") return a.name.localeCompare(b.name);
      if (state.sortBy === "price-asc") return a.price - b.price;
      if (state.sortBy === "price-desc") return b.price - a.price;
      if (state.sortBy === "preptime") return (a.prepTime || 0) - (b.prepTime || 0);
      // default "newest"
      return 0;
    });
  }

  // RENDER GRID VIEW (CHEF DASHBOARD)
  function renderGridView(dishes) {
    DOM.dishesGridContainer.innerHTML = dishes.map(dish => {
      const isAuth = !!state.currentUser;
      return `
        <article class="dish-card ${!dish.available ? 'unavailable' : ''}">
          <div class="dish-card-image-wrap">
            <img src="${dish.image || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80'}" alt="${escapeHtml(dish.name)}" class="dish-card-image" loading="lazy">
            <span class="dish-badge-category">${dish.category}</span>
            ${dish.featured ? `<span class="dish-badge-featured"><i class="fa-solid fa-star"></i> Special</span>` : ''}
            ${!dish.available ? `<div class="dish-out-of-stock-overlay"><i class="fa-solid fa-ban"></i> Out of Stock</div>` : ''}
          </div>

          <div class="dish-card-content">
            <div class="dish-card-header">
              <h3 class="dish-title">${escapeHtml(dish.name)}</h3>
              <span class="dish-price">$${dish.price.toFixed(2)}</span>
            </div>

            <p class="dish-description">${escapeHtml(dish.description)}</p>

            <div class="dish-meta-info">
              <span><i class="fa-regular fa-clock"></i> ${dish.prepTime || 15} mins</span>
              <span><i class="fa-solid fa-fire-flame-curved"></i> ${dish.calories || 400} kcal</span>
            </div>

            <div class="dish-dietary-tags">
              ${(dish.dietary || []).map(tag => `<span class="tag-badge">${escapeHtml(tag)}</span>`).join('')}
            </div>

            <div class="dish-card-actions">
              <!-- Quick Stock Switch -->
              <label class="availability-toggle" title="Quick toggle stock availability">
                <input type="checkbox" class="toggle-input toggle-availability-btn" data-id="${dish.id}" ${dish.available ? 'checked' : ''} ${!isAuth ? 'disabled' : ''}>
                <span class="toggle-slider-sm"></span>
                <span class="status-label ${dish.available ? 'in-stock' : 'out-stock'}">
                  ${dish.available ? 'In Stock' : 'Out of Stock'}
                </span>
              </label>

              <!-- Action buttons for manager -->
              <div class="card-action-btns">
                <button class="btn-icon toggle-featured-btn ${dish.featured ? 'active' : ''}" data-id="${dish.id}" title="${dish.featured ? 'Unmark Chef Special' : 'Mark as Chef Special'}" ${!isAuth ? 'style="display:none;"' : ''}>
                  <i class="${dish.featured ? 'fa-solid fa-star' : 'fa-regular fa-star'}" style="color: ${dish.featured ? 'var(--accent-gold)' : 'inherit'}"></i>
                </button>
                <button class="btn-icon edit-dish-btn" data-id="${dish.id}" title="Edit Dish" ${!isAuth ? 'style="display:none;"' : ''}>
                  <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button class="btn-icon delete-dish-btn" data-id="${dish.id}" title="Delete Dish" ${!isAuth ? 'style="display:none;"' : ''}>
                  <i class="fa-solid fa-trash-can" style="color: var(--danger-color)"></i>
                </button>
              </div>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  // RENDER TABLE VIEW (CHEF DASHBOARD)
  function renderTableView(dishes) {
    const isAuth = !!state.currentUser;
    DOM.dishesTableBody.innerHTML = dishes.map(dish => `
      <tr>
        <td>
          <div class="table-dish-cell">
            <img src="${dish.image || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80'}" class="table-dish-thumb" alt="${escapeHtml(dish.name)}">
            <div class="table-dish-info">
              <h4>${escapeHtml(dish.name)} ${dish.featured ? '<i class="fa-solid fa-star" style="color: var(--accent-gold); font-size: 0.8rem;"></i>' : ''}</h4>
              <p>${escapeHtml(dish.ingredients ? dish.ingredients.slice(0, 3).join(', ') : '')}</p>
            </div>
          </div>
        </td>
        <td><span class="tag-badge">${dish.category}</span></td>
        <td><strong>$${dish.price.toFixed(2)}</strong></td>
        <td>${(dish.dietary || []).map(d => `<span class="tag-badge">${d}</span>`).join(' ')}</td>
        <td>${dish.prepTime || 15} mins</td>
        <td>
          <label class="availability-toggle">
            <input type="checkbox" class="toggle-input toggle-availability-btn" data-id="${dish.id}" ${dish.available ? 'checked' : ''} ${!isAuth ? 'disabled' : ''}>
            <span class="toggle-slider-sm"></span>
            <span class="status-label ${dish.available ? 'in-stock' : 'out-stock'}">
              ${dish.available ? 'Available' : 'Sold Out'}
            </span>
          </label>
        </td>
        <td>
          <div class="card-action-btns">
            <button class="btn-icon edit-dish-btn" data-id="${dish.id}" title="Edit Dish" ${!isAuth ? 'style="display:none;"' : ''}>
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button class="btn-icon delete-dish-btn" data-id="${dish.id}" title="Delete Dish" ${!isAuth ? 'style="display:none;"' : ''}>
              <i class="fa-solid fa-trash-can" style="color: var(--danger-color)"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  // RENDER CUSTOMER DIGITAL MENU
  function renderCustomerMenu(dishes) {
    DOM.customerDishesContainer.innerHTML = dishes.map(dish => `
      <article class="dish-card ${!dish.available ? 'unavailable' : ''}">
        <div class="dish-card-image-wrap">
          <img src="${dish.image || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80'}" alt="${escapeHtml(dish.name)}" class="dish-card-image">
          <span class="dish-badge-category">${dish.category}</span>
          ${dish.featured ? `<span class="dish-badge-featured"><i class="fa-solid fa-star"></i> Chef Special</span>` : ''}
          ${!dish.available ? `<div class="dish-out-of-stock-overlay"><i class="fa-solid fa-circle-xmark"></i> Sold Out Today</div>` : ''}
        </div>

        <div class="dish-card-content">
          <div class="dish-card-header">
            <h3 class="dish-title">${escapeHtml(dish.name)}</h3>
            <span class="dish-price">$${dish.price.toFixed(2)}</span>
          </div>

          <p class="dish-description">${escapeHtml(dish.description)}</p>

          <div class="dish-meta-info">
            <span><i class="fa-regular fa-clock"></i> ${dish.prepTime || 15} mins</span>
            <span><i class="fa-solid fa-fire-flame-curved"></i> ${dish.calories || 400} kcal</span>
          </div>

          <div class="dish-dietary-tags">
            ${(dish.dietary || []).map(tag => `<span class="tag-badge">${escapeHtml(tag)}</span>`).join('')}
          </div>
        </div>
      </article>
    `).join('');
  }

  // PRESET IMAGE BUTTONS IN EDIT MODAL
  function renderPresetImageButtons() {
    DOM.presetImageButtons.innerHTML = PRESET_IMAGES.map(p => `
      <button type="button" class="btn-preset" data-url="${p.url}">${p.name}</button>
    `).join('');
  }

  // AUTH UI RENDER
  function renderAuthUI() {
    const user = state.currentUser;

    if (user) {
      DOM.loginBanner.style.display = "none";
      DOM.userProfileWidget.innerHTML = `
        <img src="${user.avatar || 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=200&q=80'}" class="user-avatar" alt="Chef Avatar">
        <div class="user-info">
          <span class="user-name">${escapeHtml(user.name)}</span>
          <span class="user-role">${escapeHtml(user.title)}</span>
        </div>
        <button id="logoutBtn" class="btn btn-secondary btn-sm" title="Log Out"><i class="fa-solid fa-right-from-bracket"></i></button>
      `;

      // Show auth-only elements
      document.querySelectorAll(".auth-only").forEach(el => el.style.display = "inline-flex");
    } else {
      DOM.loginBanner.style.display = "flex";
      DOM.userProfileWidget.innerHTML = `
        <button id="navLoginBtn" class="btn btn-primary"><i class="fa-solid fa-key"></i> Chef Login</button>
      `;

      // Hide auth-only buttons
      document.querySelectorAll(".auth-only").forEach(el => el.style.display = "none");
    }
  }

  // BIND EVENT LISTENERS
  function bindEvents() {
    // Mode Switch (Chef vs Customer View)
    DOM.viewToggleBtn.addEventListener("click", () => {
      state.activeMode = state.activeMode === "chef" ? "customer" : "chef";
      render();
    });

    // Layout Toggle (Grid vs Table)
    DOM.gridViewBtn.addEventListener("click", () => {
      state.viewLayout = "grid";
      DOM.gridViewBtn.classList.add("active");
      DOM.tableViewBtn.classList.remove("active");
      render();
    });

    DOM.tableViewBtn.addEventListener("click", () => {
      state.viewLayout = "table";
      DOM.tableViewBtn.classList.add("active");
      DOM.gridViewBtn.classList.remove("active");
      render();
    });

    // Search Input
    DOM.searchInput.addEventListener("input", (e) => {
      state.searchQuery = e.target.value.trim();
      DOM.clearSearchBtn.style.display = state.searchQuery ? "block" : "none";
      render();
    });

    DOM.clearSearchBtn.addEventListener("click", () => {
      DOM.searchInput.value = "";
      state.searchQuery = "";
      DOM.clearSearchBtn.style.display = "none";
      render();
    });

    // Filters
    DOM.statusFilterSelect.addEventListener("change", (e) => {
      state.statusFilter = e.target.value;
      render();
    });

    DOM.sortSelect.addEventListener("change", (e) => {
      state.sortBy = e.target.value;
      render();
    });

    // Category Tabs
    DOM.categoryTabs.addEventListener("click", (e) => {
      const tab = e.target.closest(".cat-tab");
      if (!tab) return;
      DOM.categoryTabs.querySelectorAll(".cat-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      state.selectedCategory = tab.dataset.category;
      render();
    });

    // Preset Image Clicks in Modal
    DOM.presetImageButtons.addEventListener("click", (e) => {
      if (e.target.classList.contains("btn-preset")) {
        const url = e.target.dataset.url;
        DOM.dishImage.value = url;
        DOM.imagePreview.src = url;
      }
    });

    DOM.dishImage.addEventListener("input", (e) => {
      const url = e.target.value.trim();
      if (url) {
        DOM.imagePreview.src = url;
      }
    });

    // Add New Dish Modal Open
    DOM.addNewDishBtn.addEventListener("click", () => openDishModal());
    DOM.emptyStateAddBtn.addEventListener("click", () => openDishModal());

    // Reset Menu Button
    DOM.resetMenuBtn.addEventListener("click", () => {
      if (confirm("Reset menu to original sample dishes? Any custom edits will be reverted.")) {
        state.dishes = DishRepository.resetToDefaults();
        showToast("Menu reset to factory defaults", "info");
        render();
      }
    });

    // Handle Clicks inside Dishes Container (Delegation for Toggle, Edit, Delete)
    const handleDishActions = (e) => {
      const toggleAvail = e.target.closest(".toggle-availability-btn");
      if (toggleAvail) {
        if (!state.currentUser) {
          showToast("Please log in as Chef Manager to modify availability.", "error");
          openLoginModal();
          return;
        }
        const id = toggleAvail.dataset.id;
        const updated = DishRepository.toggleAvailability(id);
        if (updated) {
          loadDishesData();
          showToast(`"${updated.name}" status set to ${updated.available ? 'In Stock' : 'Out of Stock'}`, updated.available ? "success" : "info");
          render();
        }
        return;
      }

      const toggleFeatured = e.target.closest(".toggle-featured-btn");
      if (toggleFeatured) {
        if (!state.currentUser) return;
        const id = toggleFeatured.dataset.id;
        const updated = DishRepository.toggleFeatured(id);
        if (updated) {
          loadDishesData();
          showToast(`"${updated.name}" ${updated.featured ? 'marked as Chef Special!' : 'removed from Chef Specials'}`, "success");
          render();
        }
        return;
      }

      const editBtn = e.target.closest(".edit-dish-btn");
      if (editBtn) {
        if (!state.currentUser) return;
        const id = editBtn.dataset.id;
        openDishModal(id);
        return;
      }

      const deleteBtn = e.target.closest(".delete-dish-btn");
      if (deleteBtn) {
        if (!state.currentUser) return;
        const id = deleteBtn.dataset.id;
        openDeleteModal(id);
        return;
      }
    };

    DOM.dishesGridContainer.addEventListener("click", handleDishActions);
    DOM.dishesTableBody.addEventListener("click", handleDishActions);

    // Save Dish Form Submission
    DOM.dishForm.addEventListener("submit", (e) => {
      e.preventDefault();
      saveDishFromForm();
    });

    // Delete Dish Confirmation
    DOM.confirmDeleteBtn.addEventListener("click", () => {
      if (state.deletingDishId) {
        const dish = DishRepository.getDishById(state.deletingDishId);
        DishRepository.deleteDish(state.deletingDishId);
        loadDishesData();
        closeModal(DOM.deleteModal);
        showToast(`"${dish ? dish.name : 'Dish'}" deleted successfully.`, "info");
        render();
      }
    });

    // Auth Event Delegation
    DOM.userProfileWidget.addEventListener("click", (e) => {
      if (e.target.closest("#logoutBtn")) {
        AuthService.logout();
        state.currentUser = null;
        renderAuthUI();
        showToast("Logged out of Chef Manager Portal", "info");
        render();
      } else if (e.target.closest("#navLoginBtn")) {
        openLoginModal();
      }
    });

    DOM.bannerLoginBtn.addEventListener("click", openLoginModal);

    // Login Form Submit
    DOM.loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = DOM.loginEmail.value;
      const pass = DOM.loginPassword.value;
      const remember = DOM.rememberMe.checked;

      const res = AuthService.login(email, pass, remember);
      if (res.success) {
        state.currentUser = res.user;
        closeModal(DOM.loginModal);
        renderAuthUI();
        showToast(`Welcome back, ${res.user.name}!`, "success");
        render();
      } else {
        DOM.loginErrorMsg.style.display = "block";
        DOM.loginErrorMsg.textContent = res.error;
      }
    });

    // Modal Close Buttons
    document.querySelectorAll(".closeModalBtn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const modal = e.target.closest(".modal-overlay");
        if (modal) closeModal(modal);
      });
    });

    // Close Modal on background overlay click
    document.querySelectorAll(".modal-overlay").forEach(overlay => {
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) closeModal(overlay);
      });
    });
  }

  // MODAL HELPERS
  function openDishModal(dishId = null) {
    if (!state.currentUser) {
      showToast("Chef Manager login required.", "error");
      openLoginModal();
      return;
    }

    state.editingDishId = dishId;
    DOM.dishForm.reset();
    DOM.loginErrorMsg.style.display = "none";

    if (dishId) {
      // EDIT MODE
      const dish = DishRepository.getDishById(dishId);
      if (!dish) return;

      DOM.dishModalTitle.innerHTML = `<i class="fa-solid fa-pen-to-square"></i> Update Dish - ${escapeHtml(dish.name)}`;
      DOM.dishFormId.value = dish.id;
      DOM.dishName.value = dish.name;
      DOM.dishCategory.value = dish.category;
      DOM.dishPrice.value = dish.price;
      DOM.dishPrepTime.value = dish.prepTime || 20;
      DOM.dishCalories.value = dish.calories || 450;
      DOM.dishDescription.value = dish.description;
      DOM.dishIngredients.value = (dish.ingredients || []).join(", ");
      DOM.dishImage.value = dish.image || "";
      DOM.imagePreview.src = dish.image || "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80";
      DOM.dishAvailable.checked = dish.available;
      DOM.dishFeatured.checked = !!dish.featured;

      // Dietary Checkboxes
      const dietary = dish.dietary || [];
      document.querySelectorAll(".dietary-check").forEach(chk => {
        chk.checked = dietary.includes(chk.value);
      });
    } else {
      // ADD MODE
      DOM.dishModalTitle.innerHTML = `<i class="fa-solid fa-utensils"></i> Add New Dish`;
      DOM.dishFormId.value = "";
      DOM.imagePreview.src = PRESET_IMAGES[0].url;
      DOM.dishImage.value = PRESET_IMAGES[0].url;
      DOM.dishAvailable.checked = true;
      DOM.dishFeatured.checked = false;
      document.querySelectorAll(".dietary-check").forEach(chk => chk.checked = false);
    }

    openModal(DOM.dishModal);
  }

  function saveDishFromForm() {
    const id = DOM.dishFormId.value;
    const name = DOM.dishName.value.trim();
    const category = DOM.dishCategory.value;
    const price = parseFloat(DOM.dishPrice.value) || 0;
    const prepTime = parseInt(DOM.dishPrepTime.value, 10) || 15;
    const calories = parseInt(DOM.dishCalories.value, 10) || 400;
    const description = DOM.dishDescription.value.trim();

    // Parse ingredients from comma separated string
    const rawIng = DOM.dishIngredients.value;
    const ingredients = rawIng ? rawIng.split(',').map(s => s.trim()).filter(Boolean) : [];

    // Parse dietary checkboxes
    const dietary = Array.from(document.querySelectorAll('.dietary-check:checked')).map(c => c.value);

    const image = DOM.dishImage.value.trim() || PRESET_IMAGES[0].url;
    const available = DOM.dishAvailable.checked;
    const featured = DOM.dishFeatured.checked;

    const dishPayload = {
      name,
      category,
      price,
      prepTime,
      calories,
      description,
      ingredients,
      dietary,
      image,
      available,
      featured
    };

    if (id) {
      // UPDATE EXISTING DISH
      const updated = DishRepository.updateDish(id, dishPayload);
      if (updated) {
        showToast(`Successfully updated "${updated.name}"!`, "success");
      }
    } else {
      // CREATE NEW DISH
      const created = DishRepository.addDish(dishPayload);
      showToast(`Created new dish "${created.name}"!`, "success");
    }

    loadDishesData();
    closeModal(DOM.dishModal);
    render();
  }

  function openDeleteModal(dishId) {
    const dish = DishRepository.getDishById(dishId);
    if (!dish) return;
    state.deletingDishId = dishId;
    DOM.deleteDishName.textContent = `"${dish.name}"`;
    openModal(DOM.deleteModal);
  }

  function openLoginModal() {
    DOM.loginErrorMsg.style.display = "none";
    openModal(DOM.loginModal);
  }

  function openModal(modalEl) {
    modalEl.classList.add("active");
  }

  function closeModal(modalEl) {
    modalEl.classList.remove("active");
  }

  // TOAST NOTIFICATIONS
  function showToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;

    let iconClass = "fa-circle-info";
    if (type === "success") iconClass = "fa-circle-check";
    if (type === "error") iconClass = "fa-triangle-exclamation";

    toast.innerHTML = `
      <i class="fa-solid ${iconClass}"></i>
      <span>${escapeHtml(message)}</span>
    `;

    DOM.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = "fadeOut 0.3s ease forwards";
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // ESCAPE HTML UTILITY
  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // START APP
  init();
});
