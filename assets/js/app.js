export const API = '/api';
export const placeholder = 'https://placehold.co/800x600/e7f3e8/2e7d32?text=EcoMarket';

export const token = () => localStorage.getItem('ecoToken');
export const userId = () => localStorage.getItem('ecoUid');

export async function request(url, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token()) headers.Authorization = `Bearer ${token()}`;
  const response = await fetch(`${API}${url}`, { ...options, headers });
  if (response.status === 204) return null;
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'Ocurrió un error al procesar tu solicitud.');
  return data;
}

export function escapeHtml(value = '') { const div = document.createElement('div'); div.textContent = value; return div.innerHTML; }
export function money(value) { return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value); }

export function notify(message, type = 'success') {
  const box = document.querySelector('.toast-container') || Object.assign(document.body.appendChild(document.createElement('div')), { className: 'toast-container position-fixed top-0 end-0 p-3' });
  const item = document.createElement('div');
  item.className = `toast align-items-center text-bg-${type} border-0`;
  item.innerHTML = `<div class="d-flex"><div class="toast-body">${escapeHtml(message)}</div><button class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Cerrar"></button></div>`;
  box.appendChild(item); new bootstrap.Toast(item).show(); item.addEventListener('hidden.bs.toast', () => item.remove());
}

function navLink(href, label, icon) {
  const current = location.pathname.split('/').pop() || 'index.html';
  const active = current === href ? ' active' : '';
  return `<li class="nav-item"><a class="nav-link${active}" href="${href}"><i class="bi ${icon}"></i><span>${label}</span></a></li>`;
}

export function navbar() {
  const holder = document.querySelector('[data-navbar]');
  if (!holder) return;
  const logged = Boolean(token());
  const centerLinks = `${navLink('index.html', 'Inicio', 'bi-house-door')}${navLink('catalog.html', 'Explorar', 'bi-grid-3x3-gap')}${logged ? navLink('my-products.html', 'Mis productos', 'bi-box-seam') : ''}`;
  const cartLink = logged ? `<li class="nav-item"><a class="cart-link" href="cart.html" aria-label="Ver carrito"><span class="cart-icon"><i class="bi bi-bag-heart-fill"></i><b id="cartCount">0</b></span><span>Carrito</span></a></li>` : '';
  const account = logged
    ? `<li class="nav-item nav-action"><a class="btn nav-publish" href="create-product.html"><i class="bi bi-plus-lg"></i> Publicar</a></li>
       <li class="nav-item dropdown"><a class="nav-account dropdown-toggle" href="#" data-bs-toggle="dropdown" aria-expanded="false"><span class="account-avatar"><i class="bi bi-person-fill"></i></span><span>Mi cuenta</span></a><ul class="dropdown-menu dropdown-menu-end shadow-sm border-0"><li><a class="dropdown-item" href="profile.html"><i class="bi bi-person-gear"></i> Mi perfil</a></li><li><a class="dropdown-item" href="my-products.html"><i class="bi bi-box-seam"></i> Mis publicaciones</a></li><li><hr class="dropdown-divider"></li><li><button class="dropdown-item text-danger" id="logoutBtn"><i class="bi bi-box-arrow-right"></i> Cerrar sesión</button></li></ul></li>`
    : `<li class="nav-item">${navLink('login.html', 'Ingresar', 'bi-box-arrow-in-right')}</li><li class="nav-item nav-action"><a class="btn nav-publish" href="register.html">Crear cuenta <i class="bi bi-arrow-up-right"></i></a></li>`;
  holder.innerHTML = `<nav class="navbar navbar-expand-lg fixed-top"><div class="container nav-shell"><a class="navbar-brand brand" href="index.html"><span class="brand-mark"><i class="bi bi-leaf-fill"></i></span><span>Eco<span>Market</span></span></a><button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#ecoNav" aria-controls="ecoNav" aria-expanded="false" aria-label="Abrir menú"><i class="bi bi-list"></i></button><div class="collapse navbar-collapse" id="ecoNav"><ul class="navbar-nav mx-auto nav-center">${centerLinks}</ul><ul class="navbar-nav align-items-lg-center nav-right">${cartLink}${account}</ul></div></div></nav>`;
  document.querySelector('#logoutBtn')?.addEventListener('click', () => { localStorage.clear(); location.href = 'index.html'; });
}

export async function updateCartCount() {
  if (!token()) return;
  try { const cart = await request('/cart'); const counter = document.querySelector('#cartCount'); if (counter) counter.textContent = cart.items.reduce((total, item) => total + item.quantity, 0); }
  catch { /* Una sesión vencida no debe bloquear la navegación. */ }
}

export function footer() {
  const holder = document.querySelector('[data-footer]');
  if (!holder) return;
  holder.innerHTML = `<footer class="footer"><div class="container footer-grid"><div><a class="footer-brand" href="index.html"><i class="bi bi-leaf-fill"></i> EcoMarket</a><p>Una forma más consciente de descubrir, comprar y publicar.</p></div><div class="footer-links"><a href="catalog.html">Explorar catálogo</a><a href="create-product.html">Publicar producto</a></div><div class="footer-note"><span>Hecho con propósito</span><small>© 2026 EcoMarket</small></div></div></footer>`;
}

document.addEventListener('DOMContentLoaded', () => { navbar(); footer(); updateCartCount(); });
 