import { request, escapeHtml, money, placeholder, token, notify, updateCartCount } from './app.js';

let cart = [];
const total = () => cart.reduce((sum, item) => sum + item.precio * item.quantity, 0);

function render() {
  const list = document.querySelector('#cartItems');
  const summary = document.querySelector('#cartSummary');
  if (!cart.length) {
    list.innerHTML = `<div class="cart-empty"><i class="bi bi-bag-heart"></i><h2>Tu carrito está esperando</h2><p>Explora productos con propósito y crea tu selección.</p><a class="btn btn-eco" href="catalog.html">Explorar catálogo <i class="bi bi-arrow-right"></i></a></div>`;
    summary.classList.add('d-none'); return;
  }
  list.innerHTML = cart.map((item) => `<article class="cart-item"><img src="${escapeHtml(item.imagen || placeholder)}" alt="${escapeHtml(item.nombre)}" onerror="this.src='${placeholder}'"><div class="cart-item-info"><span class="badge badge-category">${escapeHtml(item.categoria)}</span><h2>${escapeHtml(item.nombre)}</h2><p>${money(item.precio)} <span>por unidad</span></p></div><div class="cart-item-actions"><div class="quantity-control"><button data-action="decrease" data-id="${item.productId}" aria-label="Reducir cantidad">−</button><span>${item.quantity}</span><button data-action="increase" data-id="${item.productId}" aria-label="Aumentar cantidad">+</button></div><strong>${money(item.precio * item.quantity)}</strong><button class="remove-cart-item" data-id="${item.productId}"><i class="bi bi-trash3"></i> Eliminar</button></div></article>`).join('');
  summary.classList.remove('d-none');
  document.querySelector('#subtotal').textContent = money(total());
  document.querySelector('#cartTotal').textContent = money(total());
}

async function refresh() { const data = await request('/cart'); cart = data.items; render(); await updateCartCount(); }

document.addEventListener('DOMContentLoaded', async () => {
  if (!token()) { location.href = 'login.html'; return; }
  try { await refresh(); } catch (error) { document.querySelector('#cartItems').innerHTML = `<div class="empty text-danger">${escapeHtml(error.message)}</div>`; }
  document.querySelector('#cartItems').addEventListener('click', async (event) => {
    const action = event.target.closest('[data-action]'); const remove = event.target.closest('.remove-cart-item');
    const productId = action?.dataset.id || remove?.dataset.id; if (!productId) return;
    try {
      if (remove) await request(`/cart/${productId}`, { method: 'DELETE' });
      else { const item = cart.find((entry) => entry.productId === productId); const quantity = action.dataset.action === 'increase' ? item.quantity + 1 : item.quantity - 1; if (quantity < 1) await request(`/cart/${productId}`, { method: 'DELETE' }); else await request(`/cart/${productId}`, { method: 'PUT', body: JSON.stringify({ quantity }) }); }
      await refresh();
    } catch (error) { notify(error.message, 'danger'); }
  });
  document.querySelector('#clearCart').addEventListener('click', async () => { if (!confirm('¿Vaciar todo el carrito?')) return; try { await request('/cart', { method: 'DELETE' }); await refresh(); notify('Carrito vaciado.'); } catch (error) { notify(error.message, 'danger'); } });
});
