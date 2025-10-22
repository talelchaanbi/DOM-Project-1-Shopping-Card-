// Met à jour le total en fonction des quantités visibles
document.addEventListener('DOMContentLoaded', () => {
  const totalEl = document.querySelector('.total-price .total');

  const parsePrice = (text) => Number(text.replace(/[^\d.-]/g, '')) || 0;

  const updateTotal = () => {
    let total = 0;
    // Sélectionne chaque produit (le .card-body intérieur de la carte)
    document.querySelectorAll('.list-products .card .card-body').forEach((productEl) => {
      const price = parsePrice(productEl.querySelector('.unit-price')?.textContent || '0');
      const qty = Number(productEl.querySelector('.quantity')?.textContent || '0');
      total += price * qty;
    });
    totalEl.textContent = `${total} $`;
  };

  // Attache les événements pour chaque produit
  document.querySelectorAll('.list-products .card .card-body').forEach((productEl) => {
    const plusBtn = productEl.querySelector('.fa-plus-circle');
    const minusBtn = productEl.querySelector('.fa-minus-circle');
    const qtyEl = productEl.querySelector('.quantity');
    const trashBtn = productEl.querySelector('.fa-trash-alt');
    const heartBtn = productEl.querySelector('.fa-heart');

    plusBtn?.addEventListener('click', () => {
      qtyEl.textContent = Number(qtyEl.textContent) + 1;
      updateTotal();
    });

    minusBtn?.addEventListener('click', () => {
      const current = Number(qtyEl.textContent);
      if (current > 0) {
        qtyEl.textContent = current - 1;
        updateTotal();
      }
    });

    trashBtn?.addEventListener('click', () => {
      // Supprime tout le bloc du produit (le .card-body externe)
      const outer = productEl.closest('.card')?.parentElement;
      if (outer) {
        outer.remove();
        updateTotal();
      }
    });

    heartBtn?.addEventListener('click', () => {
      heartBtn.classList.toggle('liked');
    });
  });

  // Calcul initial
  updateTotal();
});