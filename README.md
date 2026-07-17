# EcoMarket

Plataforma web para publicar y descubrir productos ecológicos. Incluye registro e inicio de sesión con Firebase Authentication, perfiles, catálogo con búsqueda y filtro, y CRUD protegido de productos almacenados en Cloud Firestore.

## Tecnologías

- Frontend: HTML5, CSS3, JavaScript ES6, Bootstrap 5 y Bootstrap Icons.
- Backend: Node.js 18+ y Express.
- Servicios: Firebase Authentication y Cloud Firestore mediante Firebase Admin SDK.

## Requisitos

- Node.js 18 o superior.
- Cuenta Firebase con Authentication y Cloud Firestore habilitados.
- Clave privada de servicio para Firebase Admin.

## Configuración

1. Crea un proyecto Firebase y activa **Authentication > Email/Password** y **Cloud Firestore**.
2. En Firebase, genera una clave privada de una cuenta de servicio. Descarga el archivo JSON y crea un `.env` local con la ruta `FIREBASE_SERVICE_ACCOUNT_PATH` o configura `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL` y `FIREBASE_PRIVATE_KEY`.
3. En Project settings > General, copia la **Web API Key** a `FIREBASE_WEB_API_KEY`.
4. Copia `.env.example` a `.env` y completa los valores.
5. Instala las dependencias y arranca el servidor:

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`. El servidor también publica la carpeta `front` y los recursos de `assets`, por lo que no hace falta levantar otro servicio.

## API REST

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/register` | Crea cuenta y documento Users |
| POST | `/api/login` | Autentica y devuelve token Firebase |
| GET | `/api/products` | Lista productos |
| GET | `/api/products/:id` | Consulta un producto |
| POST | `/api/products` | Crea producto autenticado |
| PUT | `/api/products/:id` | Edita producto propio |
| DELETE | `/api/products/:id` | Elimina producto propio |
| GET | `/api/profile` | Consulta perfil autenticado |
| PUT | `/api/profile` | Actualiza nombre y foto |

Para las rutas protegidas se debe enviar `Authorization: Bearer <idToken>`.

## Modelo de datos

`Users`: `id`, `nombre`, `correo`, `foto`, `fechaRegistro`.

`Products`: `id`, `nombre`, `descripcion`, `precio`, `categoria`, `imagen`, `ownerId`, `ownerName`, `fechaCreacion`.

## Qué debes hacer tú

1. Copia `.env.example` a `.env` y completa los valores con tu proyecto Firebase.
2. Descarga la clave privada de servicio y guarda su ruta en `FIREBASE_SERVICE_ACCOUNT_PATH` o completa `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL` y `FIREBASE_PRIVATE_KEY`.
3. Verifica que `Authentication > Sign-in method > Email/Password` esté habilitado en Firebase.
4. Ejecuta `npm install` y luego `npm run dev`.
5. Abre `http://localhost:3000` y prueba el registro, login, catálogo, creación de producto y carrito.
6. No compartas ni subas `.env` ni el archivo JSON de la cuenta de servicio al repositorio.
7. Si vas a usar Firebase Hosting, configura `authorizedDomains` en la consola de Firebase.
