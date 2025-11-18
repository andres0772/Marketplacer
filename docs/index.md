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
├── api-gateway/              # Gateway de la API
├── services/                 # Microservicios
│   ├── authentication/       # Servicio de autenticación
│   ├── productos/           # Servicio de productos
│   ├── pedidos/             # Servicio de pedidos
│   └── pagos/               # Servicio de pagos
├── src/                     # Frontend React
│   ├── api/                 # Cliente API
│   ├── components/          # Componentes reutilizables
│   ├── pages/               # Páginas de la aplicación
│   ├── store/               # Estado global (Zustand)
│   └── types/               # Definiciones TypeScript
├── docs/                    # Documentación
├── docker-compose.yml       # Orquestación de servicios
└── mkdocs.yml              # Configuración de documentación
```

## Primeros Pasos

### Requisitos Previos

- Node.js 18+ (para frontend)
- Docker y Docker Compose (para backend)
- Python 3.9+ (opcional, para desarrollo local)

### Instalación

1. **Frontend**:
```bash
npm install
npm run build
```

2. **Backend** (con Docker):
```bash
docker-compose up -d
```

### Variables de Entorno

Crear archivo `.env` con:
```env
VITE_API_GATEWAY_URL=http://localhost:8000
```
mas informacion ve a la parte de desarrollo

## Próximos Pasos

- [Guía de Usuario](user-guide.md): Aprende a usar la plataforma
- [Documentación de API](api.md): Explora los endpoints disponibles
- [Base de Datos](database.md): Entiende el esquema de datos
- [Guía de Desarrollo](development.md): Contribuye al proyecto

