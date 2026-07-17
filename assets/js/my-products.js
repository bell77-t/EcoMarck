import { request, escapeHtml, money, placeholder, userId, notify } from './app.js';

function card(product) {
  return `<div class="col"><article class="card product-card my-product-card"><img class="product-img" src="${escapeHtml(product.imagen || placeholder)}" alt="${escapeHtml(product.nombre)}" onerror="this.src='${placeholder}'"><div class="card-body d-flex flex-column"><span class="badge badge-category align-self-start mb-2">${escapeHtml(product.categoria)}</span><h2 class="h5">${escapeHtml(product.nombre)}</h2><p class="price mt-auto mb-3">${money(product.precio)}</p><div class="d-flex gap-2"><a class="btn btn-light flex-fill" href="product.html?id=${product.id}" aria-label="Ver ${escapeHtml(product.nombre)}"><i class="bi bi-eye"></i></a><a class="btn btn-outline-eco flex-fill" href="edit-product.html?id=${product.id}">Editar</a><button class="btn btn-outline-danger delete-product" data-id="${product.id}" aria-label="Eliminar ${escapeHtml(product.nombre)}"><i class="bi bi-trash3"></i></button></div></div></article></div>`;
}

document.addEventListener('DOMContentLoaded', async () => {
  if (!userId()) { location.href = 'login.html'; return; }
  const grid = document.querySelector('#myProducts');
  try {
    const products = (await request('/products')).filter((product) => product.ownerId === userId());
    document.querySelector('#productCount').textContent = `${products.length} ${products.length === 1 ? 'publicación' : 'publicaciones'}`;
    grid.innerHTML = products.length ? products.map(card).join('') : `<div class="col-12"><div class="empty my-empty"><i class="bi bi-box2-heart fs-1"></i><h2 class="h4 mt-3">Aún no has publicado productos</h2><p>Comparte tu primera alternativa ecológica con la comunidad.</p><a class="btn btn-eco" href="create-product.html"><i class="bi bi-plus-lg"></i> Publicar producto</a></div></div>`;
    grid.querySelectorAll('.delete-product').forEach((button) => button.addEventListener('click', async () => {
      if (!confirm('¿Quieres eliminar este producto? Esta acción no se puede deshacer.')) return;
      try { await request(`/products/${button.dataset.id}`, { method: 'DELETE' }); notify('Producto eliminado.'); button.closest('.col').remove(); }
      catch (error) { notify(error.message, 'danger'); }
    }));
  } catch (error) { grid.innerHTML = `<div class="col-12"><div class="empty text-danger">${escapeHtml(error.message)}</div></div>`; }
});
