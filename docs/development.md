# Guía de Desarrollo

Esta guía te ayudará a configurar el entorno de desarrollo para el Marketplace Artesanal.

## Requisitos Previos

### Software Necesario

- **Node.js** 18+ y npm
- **Docker** y **Docker Compose**
- **Git**
- Editor de código (recomendado: VS Code)

### Conocimientos Requeridos

- React y TypeScript
- FastAPI y Python
- Docker y contenedores
- Bases de datos SQL y NoSQL
- Arquitectura de microservicios

---

## Configuración del Entorno

### 1. Clonar el Repositorio

```bash
git clone https://github.com/andres0772/Marketplacer.git    
cd Marketplacer
```

### 2. Configurar Backend (Microservicios)

#### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
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

#### Iniciar Servicios Backend

```bash
docker-compose up -d
```

Verificar que todos los servicios estén corriendo:

```bash
docker-compose ps
```

#### Ver Logs de Servicios

```bash
# Todos los servicios
docker-compose logs -f

# Servicio específico
docker-compose logs -f api-gateway
docker-compose logs -f productos-service
```

### 3. Configurar Frontend

#### Instalar Dependencias

```bash
npm install
```

#### Variables de Entorno Frontend

Crea un archivo `.env` en la raíz:

```env
VITE_API_GATEWAY_URL=http://localhost:8000
```

#### Build de Producción

```bash
npm run build
```

El output estará en el directorio `dist/`.

---

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

---

## Flujo de Desarrollo

### 1. Desarrollo Frontend

El frontend React se comunica con el API Gateway en `http://localhost:8000`.

**Características clave:**
- **Routing**: React Router DOM
- **Estado**: Zustand (auth, carrito)
- **API**: Axios client configurado
- **Estilos**: Tailwind CSS

**Archivos importantes:**
- `src/api/client.ts`: Cliente API con interceptores
- `src/types/models.ts`: Tipos TypeScript
- `src/store/`: Estado global

### 2. Desarrollo Backend

Cada microservicio es independiente con su propia base de datos.

**Convenciones:**
- Usar FastAPI para todos los servicios
- Pydantic para validación de datos
- SQLAlchemy para ORM (PostgreSQL)
- Motor/PyMongo para MongoDB

**Patrón de código:**
```python
# Estructura típica de un servicio
from fastapi import FastAPI, APIRouter
from models import Entity, EntityCreate

app = FastAPI()
router = APIRouter(prefix="/api/v1/entity")

@router.get("/")
async def get_entities():
    # Lógica aquí
    pass

app.include_router(router)
```

### 3. Comunicación entre Servicios

El API Gateway maneja toda la comunicación:

1. Frontend → API Gateway (`:8000`)
2. API Gateway → Microservicio específico
3. Microservicio → Base de datos

**No hay comunicación directa** entre frontend y microservicios.

---

## Comandos Útiles

### Docker

```bash
# Iniciar todos los servicios
docker-compose up -d

# Detener servicios
docker-compose down

# Reconstruir servicios
docker-compose up -d --build

# Ver logs en tiempo real
docker-compose logs -f

# Ejecutar comando en contenedor
docker-compose exec api-gateway bash

# Limpiar volúmenes (¡cuidado! borra datos)
docker-compose down -v
```

### Frontend

```bash
# Build de producción
npm run build

# Limpiar caché
rm -rf node_modules dist
npm install
```

---

## Testing

### Backend

Agregar tests en cada servicio:

```python
# tests/test_productos.py
import pytest
from main import app

def test_get_productos():
    # Test aquí
    pass
```

Ejecutar tests:
```bash
docker-compose exec productos-service pytest
```

---

## Mejores Prácticas

### Frontend

1. **Componentes**: Un componente por archivo
2. **TypeScript**: Usar tipos estrictos
3. **Estado**: Zustand para global, hooks para local
4. **Nombres**: camelCase para variables, PascalCase para componentes

### Backend

1. **Modelos**: Definir Pydantic models para validación
2. **Separación**: Routers separados por dominio
3. **Logs**: Usar logging para debugging
4. **Errores**: Manejar excepciones con HTTPException

### Git

```bash
# Branches por feature
git checkout -b feature/nueva-funcionalidad

# Commits descriptivos
git commit -m "feat: agregar filtro de categorías"
git commit -m "fix: corregir validación de email"
```

---

## Troubleshooting

### Backend no responde

```bash
# Verificar estado de contenedores
docker-compose ps

# Revisar logs
docker-compose logs api-gateway

# Reiniciar servicio específico
docker-compose restart api-gateway
```

### Error de conexión a base de datos

```bash
# Verificar healthcheck
docker-compose ps

# Ver logs de la base de datos
docker-compose logs productos-db

# Esperar a que inicie completamente
docker-compose up -d
sleep 10
```

### Frontend no conecta con backend

1. Verificar `.env` con `VITE_API_GATEWAY_URL=http://localhost:8000`
2. Verificar CORS en `api-gateway/main.py`
3. Verificar que API Gateway esté corriendo: `curl http://localhost:8000/health`

---

## Recursos Adicionales

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zustand](https://github.com/pmndrs/zustand)
