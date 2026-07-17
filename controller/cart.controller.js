import { db, timestamp } from '../config/firebase.js';

const carts = db.collection('Carts');
const products = db.collection('Products');
const quantityOf = (value) => Math.max(1, Math.min(99, Number.parseInt(value, 10) || 1));

export async function getCart(req, res, next) {
  try {
    const cart = await carts.doc(req.user.uid).get();
    res.json({ items: cart.exists ? cart.data().items || [] : [] });
  } catch (error) { next(error); }
}

export async function addItem(req, res, next) {
  const { productId } = req.body;
  if (!productId) return res.status(400).json({ error: 'Selecciona un producto válido.' });
  try {
    const cartRef = carts.doc(req.user.uid);
    const product = await products.doc(productId).get();
    if (!product.exists) return res.status(404).json({ error: 'El producto ya no está disponible.' });
    const source = product.data();
    await db.runTransaction(async (transaction) => {
      const cart = await transaction.get(cartRef);
      const items = cart.exists ? cart.data().items || [] : [];
      const existing = items.find((item) => item.productId === productId);
      if (existing) existing.quantity = Math.min(99, existing.quantity + quantityOf(req.body.quantity));
      else items.push({ productId, nombre: source.nombre, precio: source.precio, imagen: source.imagen || '', categoria: source.categoria, quantity: quantityOf(req.body.quantity) });
      transaction.set(cartRef, { ownerId: req.user.uid, items, updatedAt: timestamp() }, { merge: true });
    });
    res.status(201).json({ message: 'Producto agregado al carrito.' });
  } catch (error) { next(error); }
}

export async function updateItem(req, res, next) {
  const quantity = Number.parseInt(req.body.quantity, 10);
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) return res.status(400).json({ error: 'La cantidad debe estar entre 1 y 99.' });
  try {
    const ref = carts.doc(req.user.uid);
    await db.runTransaction(async (transaction) => {
      const cart = await transaction.get(ref);
      const items = cart.exists ? cart.data().items || [] : [];
      const item = items.find((entry) => entry.productId === req.params.productId);
      if (!item) throw Object.assign(new Error('El producto no está en el carrito.'), { status: 404 });
      item.quantity = quantity;
      transaction.update(ref, { items, updatedAt: timestamp() });
    });
    res.json({ message: 'Cantidad actualizada.' });
  } catch (error) { if (error.status) return res.status(error.status).json({ error: error.message }); next(error); }
}

export async function removeItem(req, res, next) {
  try {
    const ref = carts.doc(req.user.uid);
    await db.runTransaction(async (transaction) => {
      const cart = await transaction.get(ref);
      const items = cart.exists ? cart.data().items || [] : [];
      if (!items.some((item) => item.productId === req.params.productId)) throw Object.assign(new Error('El producto no está en el carrito.'), { status: 404 });
      transaction.update(ref, { items: items.filter((item) => item.productId !== req.params.productId), updatedAt: timestamp() });
    });
    res.status(204).end();
  } catch (error) { if (error.status) return res.status(error.status).json({ error: error.message }); next(error); }
}

export async function clearCart(req, res, next) {
  try { await carts.doc(req.user.uid).set({ ownerId: req.user.uid, items: [], updatedAt: timestamp() }, { merge: true }); res.status(204).end(); }
  catch (error) { next(error); }
}
