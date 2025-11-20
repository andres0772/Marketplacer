# Plantilla del Proyecto del Seminario

| Código | Nombre | Correo |
|:---|:---|:---|
| 542378923 | Andres Esteban Vasquez Peña | andres.vasquez.2360@miremington.edu.co |
| 1006425924 | yesid velasquez giraldo| yesid.velasquez.5924@miremington.edu.co |

---

# Marketplace Artesanal - Documentación

Bienvenido a la documentación del **Marketplace Artesanal**, una plataforma de comercio electrónico diseñada para conectar artesanos locales con compradores que valoran productos únicos y hechos a mano.

## Descripción del Proyecto

Marketplace Artesanal es una aplicación web moderna construida con una arquitectura de microservicios que facilita la compra y venta de productos artesanales locales.

### Características Principales

- 🎨 **Catálogo de Productos**: Explora una amplia variedad de productos artesanales
- 🛒 **Carrito de Compras**: Sistema intuitivo de gestión de carrito
- 📦 **Gestión de Pedidos**: Seguimiento completo del estado de pedidos
- 💳 **Procesamiento de Pagos**: Sistema seguro de pagos
- 👤 **Autenticación de Usuarios**: Registro e inicio de sesión seguros
- 📱 **Diseño Responsivo**: Experiencia optimizada en todos los dispositivos

## Arquitectura del Sistema

El proyecto utiliza una arquitectura de microservicios con los siguientes componentes:

### Frontend
- **Framework**: React 18.3.1 con TypeScript
- **Enrutamiento**: React Router DOM 6.30.1
- **Estado Global**: Zustand 4.4.7
- **Estilos**: Tailwind CSS 3.4.17
- **Animaciones**: Framer Motion 11.0.8
- **Build Tool**: Vite 7.0.0

### Backend (Microservicios)

1. **API Gateway** (Puerto 8000)
   - Punto de entrada único para el frontend
   - Enrutamiento a microservicios
   - Framework: FastAPI

2. **Servicio de Autenticación** (Puerto 8001)
   - Registro y login de usuarios
   - Gestión de tokens JWT
   - Base de datos: MongoDB

3. **Servicio de Productos** (Puerto 8004)
   - CRUD de productos artesanales
   - Categorización y búsqueda
   - Base de datos: PostgreSQL

4. **Servicio de Pedidos** (Puerto 8003)
   - Creación y gestión de pedidos
   - Seguimiento de estado
   - Base de datos: PostgreSQL

5. **Servicio de Pagos** (Puerto 8002)
   - Procesamiento de pagos
   - Historial de transacciones
   - Base de datos: PostgreSQL

## Tecnologías Utilizadas

### Frontend
- React 18.3.1
- TypeScript 5.8.3
- Tailwind CSS 3.4.17
- Vite 7.0.0
- Axios para peticiones HTTP
- Zustand para estado global

### Backend
- Python 3.x
- FastAPI (Framework)
- SQLAlchemy (ORM)
- Pydantic (Validación)
- MongoDB (Auth DB)
- PostgreSQL (Otros servicios)

### Infraestructura
- Docker & Docker Compose
- Arquitectura de microservicios
- Red Docker para comunicación entre servicios

## Estructura del Proyecto

```
marketplace-artesanal/
├── api-gateway/              # API Gateway (FastAPI)
│   ├── Dockerfile
│   ├── main.py              # Lógica del gateway
│   └── requirements.txt
│
├── services/                # Microservicios
│   ├── authentication/      # Servicio de autenticación
│   │   ├── Dockerfile
│   │   ├── main.py
│   │   └── requirements.txt
│   ├── productos/          # Servicio de productos
│   │   ├── Dockerfile
│   │   ├── main.py
│   │   ├── models.py
│   │   └── requirements.txt
│   ├── pedidos/            # Servicio de pedidos
│   │   ├── Dockerfile
│   │   ├── main.py
│   │   ├── models.py
│   │   └── requirements.txt
│   └── pagos/              # Servicio de pagos
│       ├── Dockerfile
│       ├── main.py
│       ├── models.py
│       └── requirements.txt
│
├── src/                    # Frontend React
│   ├── api/               # Cliente API
│   │   └── client.ts      # Axios client configurado
│   ├── components/        # Componentes reutilizables
│   │   ├── Navbar.tsx
│   │   └── ProductCard.tsx
│   ├── pages/             # Páginas principales
│   │   ├── Home.tsx
│   │   ├── Productos.tsx
│   │   ├── Auth.tsx
│   │   ├── Pedidos.tsx
│   │   ├── Pagos.tsx
│   │   └── Carrito.tsx
│   ├── store/             # Estado global (Zustand)
│   │   ├── authStore.ts
│   │   └── cartStore.ts
│   ├── types/             # Definiciones TypeScript
│   │   └── models.ts
│   ├── App.tsx            # Componente principal
│   └── main.tsx           # Punto de entrada
│
├── docs/                  # Documentación MkDocs
├── docker-compose.yml     # Orquestación de servicios
├── mkdocs.yml            # Configuración de docs
└── package.json          # Dependencias frontend
```

## Primeros Pasos

### Requisitos Previos

- Node.js 20+ (para frontend)
- Docker y Docker Compose (para backend)
- Python 3.9+ (opcional, para desarrollo local)

### Instalación

### Variables de Entorno

Crear archivo `.env` con en la carpeta frontend:
```
cd frontend
```
### colocar esto dentro del archivo .env
env
VITE_API_GATEWAY_URL=http://localhost:8000

### iniciar el frontend

```bash
cd frontend/
```
## instalar dependencias y iniciar
```bash
npm install
npm run dev
```

#### Configuracion de la variable de entorno para el backend

Crea un archivo `.env` en la raíz de la carpeta backend:

```
cd backend/
```

env
```
# URLs para comunicación entre contenedores
AUTH_SERVICE_URL=http://auth-service:8001
PRODUCTOS_SERVICE_URL=http://productos-service:8004
PEDIDOS_SERVICE_URL=http://pedidos-service:8003
PAGOS_SERVICE_URL=http://pagos-service:8002

# URL pública del API Gateway
API_GATEWAY_URL_PUBLIC=http://localhost:8000

# Credenciales de base de datos
DB_USER=user
DB_PASSWORD=password

# Nombres de bases de datos
PAGOS_DB_NAME=pagos_db
PEDIDOS_DB_NAME=pedidos_db
PRODUCTOS_DB_NAME=productos_db

# URLs de conexión a bases de datos
AUTH_DB_URL=mongodb://auth-db:27017/
PAGOS_DB_URL=postgresql://user:password@pagos-db:5432/pagos_db
PEDIDOS_DB_URL=postgresql://user:password@pedidos-db:5432/pedidos_db
PRODUCTOS_DB_URL=postgresql://user:password@productos-db:5432/productos_db
```

**Iniciar los microservicios** (con Docker):

```bash
cd backend
docker compose up -d
```

#### Verificar que todos los servicios estén corriendo:

```bash
docker compose ps
```

#### Ver Logs de Servicios

```bash
# Todos los servicios
docker compose logs -f
```
# Servicio específico
```
docker compose logs -f api-gateway
docker compose logs -f productos-service
```
```
Esto construirá las imágenes y ejecutará todos los contenedores. Podrás acceder al frontend en `http://localhost:5173` y al API Gateway en `http://localhost:8000`, y ver los demas edpoint 8002, 8003 y 8004
```

### configuracion para ver la documentacion automatica con Mkdocs


```bash
cd Marketplacer
```

luego creas un entorno virtual con:

```bash
python3 -m venv venv
source venv/bin/activate
```

luego instala las dependencias con:

```bash
pip install mkdocs
pip install mkdocs-material
```

luego ejecuta el servidor con:

```bash
mkdocs serve
```

y dirijete a http://127.0.0.1:8000/



