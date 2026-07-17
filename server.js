import express from 'express'; import cors from 'cors'; import morgan from 'morgan'; import path from 'path'; import { fileURLToPath } from 'url'; import './config/firebase.js';
import authRoutes from './routes/auth.routes.js'; import productRoutes from './routes/product.routes.js'; import profileRoutes from './routes/profile.routes.js';
import cartRoutes from './routes/cart.routes.js';
const app = express(); const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(cors()); app.use(express.json({ limit: '1mb' })); app.use(morgan('dev'));
app.use('/api', authRoutes); app.use('/api/products', productRoutes); app.use('/api/profile', profileRoutes);
app.use('/api/cart', cartRoutes);
// Alias sin prefijo para integraciones que consumen las rutas REST especificadas.
app.use('/', authRoutes); app.use('/products', productRoutes); app.use('/profile', profileRoutes);
app.use('/cart', cartRoutes);
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'front'))); app.get('*', (_, res) => res.sendFile(path.join(__dirname, 'front/index.html')));
app.use((err, req, res, next) => { console.error(err); res.status(500).json({ error: err.message || 'Error interno del servidor.' }); });
app.listen(process.env.PORT || 3000, () => console.log(`EcoMarket listo en http://localhost:${process.env.PORT || 3000}`));
