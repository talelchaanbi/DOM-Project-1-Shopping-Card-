// Gestion simple du panier via localStorage + badge navbar + pages Products/Cart
document.addEventListener('DOMContentLoaded', () => {
  // Set CSS var for navbar height to avoid visual gap/overlap
  const setNavOffset = () => {
    const nav = document.querySelector('nav.navbar');
    if (!nav) return;
    const h = nav.offsetHeight || 64;
    document.documentElement.style.setProperty('--nav-offset', h + 'px');
  };
  setNavOffset();
  window.addEventListener('resize', setNavOffset);
  window.addEventListener('orientationchange', setNavOffset);
  const CART_KEY = 'cart';

  // Utils stockage
  const loadCart = () => {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || {};
    } catch (e) {
      return {};
    }
  };
  const saveCart = (cart) => localStorage.setItem(CART_KEY, JSON.stringify(cart));
  const getCartCount = (cart) => Object.values(cart).reduce((sum, item) => sum + (item.qty || 0), 0);
  const updateBadge = () => {
    const cart = loadCart();
    const count = getCartCount(cart);
    document.querySelectorAll('.cart-count').forEach((el) => {
      el.textContent = count;
    });
  };

  // Search handling (global): on non-index pages, redirect to index with ?q=
  const getQuery = (name) => new URLSearchParams(window.location.search).get(name) || '';
  const isIndexPage = !!document.querySelector('.list-products .add-to-cart');
  const allSearchForms = Array.from(document.querySelectorAll('form[role="search"]'));
  const setAllSearchInputs = (value) => {
    allSearchForms.forEach((form) => {
      const input = form.querySelector('input[type="search"], input[role="searchbox"]');
      if (input) input.value = value;
    });
  };

  const filterProducts = (query) => {
    if (!isIndexPage) return; // only on index
    const q = String(query || '').trim().toLowerCase();
    const cards = Array.from(document.querySelectorAll('.list-products > .card-body'));
    let shown = 0;
    cards.forEach((wrap) => {
      const title = wrap.querySelector('.card-title')?.textContent?.toLowerCase() || '';
      const desc = wrap.querySelector('.card-text')?.textContent?.toLowerCase() || '';
      const match = !q || title.includes(q) || desc.includes(q);
      wrap.style.display = match ? '' : 'none';
      if (match) shown++;
    });
    // No results message
    let empty = document.querySelector('.no-results');
    if (shown === 0) {
      if (!empty) {
        empty = document.createElement('div');
        empty.className = 'no-results text-center text-muted py-4';
        empty.textContent = 'No products match your search.';
        document.querySelector('.list-products')?.appendChild(empty);
      }
    } else {
      empty?.remove();
    }
  };

  allSearchForms.forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="search"], input[role="searchbox"]');
      const q = input?.value || '';
      if (isIndexPage) {
        // Filter in place and sync URL
        filterProducts(q);
        const url = new URL(window.location.href);
        if (q.trim()) url.searchParams.set('q', q.trim()); else url.searchParams.delete('q');
        window.history.replaceState({}, '', url.toString());
      } else {
        // Redirect to index with query (relative URL for file:// compatibility)
        const qs = q.trim() ? ('?q=' + encodeURIComponent(q.trim())) : '';
        window.location.href = 'index.html' + qs;
      }
    });
  });

  const setQty = (productId, qty, meta = {}) => {
    const cart = loadCart();
    if (!cart[productId]) cart[productId] = { qty: 0, price: meta.price || 0, title: meta.title || productId };
    cart[productId].qty = Math.max(0, qty);
    if (meta.price != null) cart[productId].price = meta.price;
    if (meta.title) cart[productId].title = meta.title;
    if (cart[productId].qty === 0) delete cart[productId]; // nettoie items 0
    saveCart(cart);
    updateBadge();
  };
  const incQty = (productId, delta = 1, meta = {}) => {
    const cart = loadCart();
    const current = cart[productId]?.qty || 0;
    setQty(productId, current + delta, { ...cart[productId], ...meta });
  };
  const removeItem = (productId) => {
    const cart = loadCart();
    if (cart[productId]) {
      delete cart[productId];
      saveCart(cart);
      updateBadge();
    }
  };

  // Calculs
  const parsePrice = (text) => Number(String(text).replace(/[^\d.-]/g, '')) || 0;
  const formatPrice = (n) => `${n} $`;

  const updateCartTotalFromDom = () => {
    const totalEl = document.querySelector('.total-price .total');
    if (!totalEl) return;
    let total = 0;
    document.querySelectorAll('.list-products .card .card-body').forEach((productEl) => {
      const datasetPrice = Number(productEl.dataset.price || '0');
      const price = datasetPrice || parsePrice(productEl.querySelector('.unit-price')?.textContent || '0');
      const qty = Number(productEl.querySelector('.quantity')?.textContent || '0');
      total += price * qty;
    });
    totalEl.textContent = formatPrice(total);
  };

  const updateEmptyCartState = () => {
    const list = document.querySelector('.list-products');
    if (!list) return;
    const itemsCount = list.querySelectorAll('.card .card-body[data-product-id]').length;
    let empty = document.querySelector('.empty-cart');
    const totalBox = document.querySelector('.total-price');

    if (itemsCount === 0) {
      if (!empty) {
        empty = document.createElement('div');
        empty.className = 'empty-cart text-center p-4';
        empty.innerHTML = `
          <h3 class="mb-3">Your cart is empty</h3>
          <p class="text-muted mb-3">Add products from the Products page.</p>
          <a href="index.html" class="btn btn-brand"><i class="fas fa-shopping-bag me-1"></i> Browse products</a>
        `;
        list.appendChild(empty);
      }
      if (totalBox) totalBox.style.display = 'none';
    } else {
      if (empty) empty.remove();
      if (totalBox) totalBox.style.display = '';
    }
  };

  // Navbar badge initial
  updateBadge();

  // Apply initial search if query param exists (index page)
  const initialQ = new URLSearchParams(window.location.search).get('q') || '';
  if (initialQ) {
    const forms = Array.from(document.querySelectorAll('form[role="search"]'));
    forms.forEach((form) => {
      const input = form.querySelector('input[type="search"], input[role="searchbox"]');
      if (input) input.value = initialQ;
    });
    const isIndex = !!document.querySelector('.list-products .add-to-cart');
    if (isIndex) {
      const q = String(initialQ || '').trim().toLowerCase();
      const cards = Array.from(document.querySelectorAll('.list-products > .card-body'));
      let shown = 0;
      cards.forEach((wrap) => {
        const title = wrap.querySelector('.card-title')?.textContent?.toLowerCase() || '';
        const desc = wrap.querySelector('.card-text')?.textContent?.toLowerCase() || '';
        const match = !q || title.includes(q) || desc.includes(q);
        wrap.style.display = match ? '' : 'none';
        if (match) shown++;
      });
      let empty = document.querySelector('.no-results');
      if (shown === 0) {
        if (!empty) {
          empty = document.createElement('div');
          empty.className = 'no-results text-center text-muted py-4';
          empty.textContent = 'No products match your search.';
          document.querySelector('.list-products')?.appendChild(empty);
        }
      } else {
        empty?.remove();
      }
    }
  }

  // Page Products: boutons Add to cart
  document.querySelectorAll('.add-to-cart').forEach((btn) => {
    btn.addEventListener('click', () => {
      const productId = btn.dataset.productId;
      const price = Number(btn.dataset.price || '0');
      const title = btn.dataset.title || productId;
      incQty(productId, 1, { price, title });
      // petit feedback visuel
      btn.disabled = true;
      const original = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-check me-1"></i> Added';
      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = original;
      }, 700);
    });
  });

  // Page Cart (index.html): synchroniser quantités à partir du stockage
  const isCartPage = document.querySelector('.shopping-card-container .total-price') && document.querySelector('.list-products');
  if (isCartPage) {
    const cart = loadCart();
    // Injecter quantités initiales selon localStorage et retirer celles à 0
    Array.from(document.querySelectorAll('.list-products .card .card-body[data-product-id]')).forEach((productEl) => {
      const productId = productEl.dataset.productId;
      const qtyEl = productEl.querySelector('.quantity');
      const storedQty = cart[productId]?.qty || 0;
      qtyEl.textContent = storedQty;
      if (storedQty === 0) {
        const outer = productEl.closest('.card')?.parentElement;
        if (outer) outer.remove();
        return; // skip binding events for removed items
      }
      // Ajouter dataset price si manquant
      if (!productEl.dataset.price) {
        const price = parsePrice(productEl.querySelector('.unit-price')?.textContent || '0');
        productEl.dataset.price = String(price);
      }
    });

    // Attacher événements +/−/trash/like
    document.querySelectorAll('.list-products .card .card-body[data-product-id]').forEach((productEl) => {
      const productId = productEl.dataset.productId;
      const title = productEl.querySelector('.card-title')?.textContent?.trim() || productId;
      const plusBtn = productEl.querySelector('.fa-plus-circle');
      const minusBtn = productEl.querySelector('.fa-minus-circle');
      const qtyEl = productEl.querySelector('.quantity');
      const trashBtn = productEl.querySelector('.fa-trash-alt');
      const heartBtn = productEl.querySelector('.fa-heart');

      const getPrice = () => Number(productEl.dataset.price || parsePrice(productEl.querySelector('.unit-price')?.textContent || '0'));

      plusBtn?.addEventListener('click', () => {
        const next = Number(qtyEl.textContent) + 1;
        qtyEl.textContent = next;
        setQty(productId, next, { price: getPrice(), title });
        updateCartTotalFromDom();
      });

      minusBtn?.addEventListener('click', () => {
        const current = Number(qtyEl.textContent);
        if (current > 0) {
          const next = current - 1;
          qtyEl.textContent = next;
          setQty(productId, next, { price: getPrice(), title });
          updateCartTotalFromDom();
          if (next === 0) {
            // retirer du DOM si quantité devient 0
            const outer = productEl.closest('.card')?.parentElement;
            if (outer) outer.remove();
            updateEmptyCartState();
          }
        }
      });

      trashBtn?.addEventListener('click', () => {
        removeItem(productId);
        // Supprime la carte du DOM
        const outer = productEl.closest('.card')?.parentElement; // .card-body (outer wrapper)
        if (outer) outer.remove();
        updateCartTotalFromDom();
        updateEmptyCartState();
      });

      heartBtn?.addEventListener('click', () => {
        heartBtn.classList.toggle('liked');
      });
    });

    // Calcul initial du total après sync et état panier vide
    updateCartTotalFromDom();
    updateEmptyCartState();
  }
});