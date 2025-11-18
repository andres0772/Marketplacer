# Marketplace Artesanal - Guía de Desarrollo

Este es un proyecto de marketplace de productos artesanales locales con arquitectura de microservicios.

## Arquitectura del Proyecto

### Frontend
- **Framework**: React 18.3.1 con TypeScript 5.8.3
- **Build Tool**: Vite 7.0.0
- **Routing**: React Router DOM 6.30.1
- **Estado Global**: Zustand 4.4.7 (auth y carrito)
- **Estilos**: Tailwind CSS 3.4.17
- **HTTP Client**: Axios
- **Entry Point**: `src/main.tsx`

### Backend (Microservicios con FastAPI)

El backend consiste en múltiples microservicios independientes:

1. **API Gateway** (Puerto 8000): Punto de entrada único para el frontend
2. **Authentication Service** (Puerto 8001): Gestión de usuarios y tokens JWT - MongoDB
3. **Productos Service** (Puerto 8004): CRUD de productos - PostgreSQL
4. **Pedidos Service** (Puerto 8003): Gestión de pedidos y items - PostgreSQL
5. **Pagos Service** (Puerto 8002): Procesamiento de pagos - PostgreSQL

## Configuración del Proyecto

### Variables de Entorno

**Frontend** (`.env`):
```env
VITE_API_GATEWAY_URL=http://localhost:8000
```

**Backend** (`.env` en raíz):
```env
AUTH_SERVICE_URL=http://auth-service:8001
PRODUCTOS_SERVICE_URL=http://productos-service:8004
PEDIDOS_SERVICE_URL=http://pedidos-service:8003
PAGOS_SERVICE_URL=http://pagos-service:8002
API_GATEWAY_URL_PUBLIC=http://localhost:8000

DB_USER=user
DB_PASSWORD=password
PAGOS_DB_NAME=pagos_db
PEDIDOS_DB_NAME=pedidos_db
PRODUCTOS_DB_NAME=productos_db

AUTH_DB_URL=mongodb://auth-db:27017/
PAGOS_DB_URL=postgresql://user:password@pagos-db:5432/pagos_db
PEDIDOS_DB_URL=postgresql://user:password@pedidos-db:5432/pedidos_db
PRODUCTOS_DB_URL=postgresql://user:password@productos-db:5432/productos_db
```

## Comandos de Desarrollo

### Frontend

```bash
# Instalar dependencias
npm install

# Build de producción
npm run build
```

**IMPORTANTE**: El proyecto no usa servidor de desarrollo. Siempre ejecuta `npm run build` después de cambios.

### Backend (Docker)

```bash
# Iniciar todos los microservicios
docker-compose up -d

# Ver logs de servicios
docker-compose logs -f

# Detener servicios
docker-compose down

# Reconstruir servicios después de cambios
docker-compose up -d --build
```

## Estructura del Código

### Frontend

```
src/
├── api/
│   └── client.ts          # Axios client con configuración del API Gateway
├── components/
│   ├── Navbar.tsx         # Navegación principal con carrito y auth
│   └── ProductCard.tsx    # Tarjeta de producto reutilizable
├── pages/
│   ├── Home.tsx           # Página de inicio con productos destacados
│   ├── Productos.tsx      # Catálogo completo con búsqueda y filtros
│   ├── Auth.tsx           # Login y registro
│   ├── Pedidos.tsx        # Historial de pedidos del usuario
│   ├── Pagos.tsx          # Historial de pagos
│   └── Carrito.tsx        # Carrito de compras y checkout
├── store/
│   ├── authStore.ts       # Estado de autenticación (Zustand)
│   └── cartStore.ts       # Estado del carrito (Zustand)
├── types/
│   └── models.ts          # Tipos TypeScript para todos los modelos
└── App.tsx                # Router principal
```

### Backend

Cada servicio en `services/` sigue esta estructura:
- `main.py`: Endpoints FastAPI
- `models.py`: Modelos SQLAlchemy y Pydantic
- `Dockerfile`: Configuración del contenedor
- `requirements.txt`: Dependencias Python

## Flujo de Datos

1. **Frontend** hace peticiones a `http://localhost:8000/api/v1/*`
2. **API Gateway** recibe y redirige a microservicio correspondiente
3. **Microservicio** procesa la petición y accede a su base de datos
4. **Respuesta** viaja de vuelta al frontend

## Estado Global (Zustand)

### Auth Store
- `user`: Usuario autenticado
- `token`: JWT token
- `isAuthenticated`: Boolean de estado
- `login()`, `logout()`, `setUser()`

### Cart Store
- `items`: Array de productos en el carrito
- `addItem()`, `removeItem()`, `updateQuantity()`
- `clearCart()`, `getTotalItems()`, `getTotalPrice()`

## Tipos de Datos Principales

### Producto
```typescript
interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  image: string | null;
  is_active: boolean;
}
```

### Order (Pedido)
```typescript
interface Order {
  id: number;
  id_usuario: number;
  monto_total: number;
  estado: string; // pending, processing, completed, cancelled
  fecha_creacion: string;
  activo: boolean;
  items: OrderItem[];
}
```

### Payment (Pago)
```typescript
interface Payment {
  id: number;
  id_usuario: number;
  id_pedido: number;
  monto: number;
  moneda: string;
  estado: string; // pending, completed, failed
  metodo_pago: string | null;
  fecha_pago: string | null;
  fecha_creacion: string;
}
```

## Diseño y Estilo

### Paleta de Colores
- **Primarios**: Amber (amber-500 a amber-900)
- **Acentos**: Orange (orange-500 a orange-600)
- **Fondos**: Gradientes de amber-50 a orange-100
- **Texto**: amber-900 para títulos, gray-600 para secundario

### Componentes de UI
- Cards con `border-amber-100` y `shadow-md`
- Botones con gradientes `from-amber-500 to-orange-600`
- Hover effects con `transition-all` y `hover:shadow-lg`
- Iconos de `lucide-react`

## API Endpoints

### Autenticación
- `POST /api/v1/auth/register` - Registro
- `POST /api/v1/auth/login` - Login (form-data)
- `GET /api/v1/auth/profile` - Perfil usuario

### Productos
- `GET /api/v1/productos/` - Listar todos
- `GET /api/v1/productos/{id}` - Obtener uno
- `POST /api/v1/productos/` - Crear
- `PUT /api/v1/productos/{id}` - Actualizar
- `DELETE /api/v1/productos/{id}` - Eliminar

### Pedidos
- `GET /api/v1/pedidos/` - Listar
- `POST /api/v1/pedidos/` - Crear
- `PUT /api/v1/pedidos/{id}` - Actualizar
- `DELETE /api/v1/pedidos/{id}` - Cancelar

### Pagos
- `GET /api/v1/pagos/` - Listar
- `POST /api/v1/pagos/` - Crear
- `PUT /api/v1/pagos/{id}` - Actualizar

## Documentación

La documentación completa está en el directorio `docs/` y se genera con MkDocs:

```bash
# Instalar MkDocs
pip install mkdocs mkdocs-material

# Servir documentación localmente
mkdocs serve

# Generar sitio estático
mkdocs build
```

Archivos de documentación:
- `docs/index.md` - Descripción general del proyecto
- `docs/api.md` - Documentación de endpoints
- `docs/database.md` - Esquema de bases de datos
- `docs/development.md` - Guía de desarrollo
- `docs/user-guide.md` - Guía para usuarios finales

## Consideraciones Importantes

### Frontend
- Siempre usar `npm run build` antes de probar cambios
- El token JWT se almacena en localStorage
- El carrito persiste entre sesiones usando Zustand persist
- Todas las rutas usan React Router (no recargan página)

### Backend
- Los servicios se comunican mediante nombres de contenedor Docker
- Cada servicio tiene su propia base de datos
- El API Gateway maneja CORS para permitir requests del frontend
- Las bases de datos se crean automáticamente al iniciar contenedores

### Arquitectura de Microservicios
- No hay comunicación directa entre microservicios (solo via API Gateway)
- Cada servicio es independiente y escalable
- Las bases de datos están aisladas por servicio
- Los volúmenes Docker persisten los datos

## Troubleshooting

### Build falla
```bash
npm install
npm run build
```

### Backend no responde
```bash
docker-compose ps  # Verificar estado
docker-compose logs -f  # Ver logs
docker-compose restart api-gateway
```

### Error de CORS
Verificar `api-gateway/main.py` - debe incluir `http://localhost:5173` en allow_origins

### Base de datos no conecta
Esperar a que los healthchecks de las bases de datos pasen antes de que los servicios inicien.
