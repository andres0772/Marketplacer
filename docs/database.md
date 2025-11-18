# Base de Datos

El Marketplace Artesanal utiliza múltiples bases de datos para cada microservicio, siguiendo el patrón de arquitectura de microservicios.

## Arquitectura de Bases de Datos

### MongoDB (Servicio de Autenticación)

**Puerto**: 27017  
**Base de Datos**: `auth_db`

#### Colección: users

| Campo | Tipo | Descripción |
|-------|------|-------------|
| username | String | Nombre de usuario único |
| email | String | Correo electrónico único |
| password_hash | String | Contraseña hasheada |
| created_at | DateTime | Fecha de creación |

---

### PostgreSQL (Servicio de Productos)

**Puerto**: 5433  
**Base de Datos**: `productos_db`

#### Tabla: productos

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | ID único del producto |
| nombre | VARCHAR | NOT NULL | Nombre del producto |
| descripcion | TEXT | | Descripción detallada |
| precio | FLOAT | NOT NULL | Precio en pesos colombianos |
| categoria | VARCHAR | | Categoría del producto |
| image | VARCHAR | NULLABLE | URL de la imagen |
| is_active | BOOLEAN | DEFAULT TRUE | Estado activo/inactivo |

**Índices:**
- `idx_productos_nombre` en `nombre`
- `idx_productos_categoria` en `categoria`

---

### PostgreSQL (Servicio de Pedidos)

**Puerto**: 5435  
**Base de Datos**: `pedidos_db`

#### Tabla: orders

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | ID único del pedido |
| id_usuario | INTEGER | NOT NULL | ID del usuario que realizó el pedido |
| monto_total | INTEGER | NOT NULL | Monto total en centavos |
| estado | VARCHAR | DEFAULT 'pending' | Estado del pedido (pending, processing, completed, cancelled) |
| fecha_creacion | TIMESTAMP | DEFAULT NOW() | Fecha de creación |
| activo | BOOLEAN | DEFAULT TRUE | Estado activo/inactivo |

#### Tabla: order_items

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | ID único del item |
| id_pedido | INTEGER | FOREIGN KEY (orders.id) | ID del pedido |
| id_producto | INTEGER | NOT NULL | ID del producto |
| cantidad | INTEGER | NOT NULL | Cantidad del producto |
| precio_unitario | INTEGER | NOT NULL | Precio unitario al momento de la compra |

**Relaciones:**
- `order_items.id_pedido` → `orders.id` (CASCADE)

**Índices:**
- `idx_orders_usuario` en `id_usuario`
- `idx_order_items_pedido` en `id_pedido`

---

### PostgreSQL (Servicio de Pagos)

**Puerto**: 5434  
**Base de Datos**: `pagos_db`

#### Tabla: payments

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | ID único del pago |
| id_usuario | INTEGER | NOT NULL | ID del usuario |
| id_pedido | INTEGER | NOT NULL | ID del pedido asociado |
| monto | INTEGER | NOT NULL | Monto en centavos |
| moneda | VARCHAR | DEFAULT 'COP' | Código de moneda |
| estado | VARCHAR | DEFAULT 'pending' | Estado del pago (pending, completed, failed) |
| metodo_pago | VARCHAR | NULLABLE | Método de pago utilizado |
| fecha_pago | TIMESTAMP | NULLABLE | Fecha de completación del pago |
| fecha_creacion | TIMESTAMP | DEFAULT NOW() | Fecha de creación |
| fecha_actualizacion | TIMESTAMP | DEFAULT NOW() | Última actualización |
| activo | BOOLEAN | DEFAULT TRUE | Estado activo/inactivo |

**Índices:**
- `idx_payments_usuario` en `id_usuario`
- `idx_payments_pedido` en `id_pedido`
- `idx_payments_estado` en `estado`

---

## Diagrama de Relaciones

```
┌─────────────────┐
│ MongoDB (Auth)  │
│   users         │
└─────────────────┘
        │
        │ id_usuario (referencia lógica)
        │
        ├──────────────────┬──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ PostgreSQL   │  │ PostgreSQL   │  │ PostgreSQL   │
│ productos_db │  │ pedidos_db   │  │ pagos_db     │
│              │  │              │  │              │
│ productos    │  │ orders       │  │ payments     │
│              │  │ order_items  │  │              │
└──────────────┘  └──────────────┘  └──────────────┘
                         │
                         │ id_pedido (FK)
                         │
                         └─────────────────────────────┐
                                                       │
                                                       ▼
                                             (referencia a orders)
```

## Consideraciones de Diseño

### Separación de Datos
Cada microservicio tiene su propia base de datos independiente, siguiendo el principio de "Database per Service" de la arquitectura de microservicios.

### Referencias entre Servicios
Las relaciones entre servicios se manejan mediante:
- IDs numéricos almacenados en cada servicio
- Comunicación a través del API Gateway
- No hay JOINs directos entre bases de datos de diferentes servicios

### Consistencia Eventual
El sistema utiliza consistencia eventual para mantener datos sincronizados entre servicios.

### Escalabilidad
Cada base de datos puede escalarse independientemente según las necesidades del servicio.

## Volúmenes de Docker

Los datos se persisten en volúmenes de Docker:
- `auth_data`: Datos de MongoDB (autenticación)
- `productos_data`: Datos de productos
- `pedidos_data`: Datos de pedidos
- `pagos_data`: Datos de pagos

## Migraciones y Esquema

Las tablas se crean automáticamente al iniciar los servicios mediante SQLAlchemy ORM usando el método `Base.metadata.create_all()`.

Para desarrollo local, asegúrate de tener los contenedores Docker corriendo:

```bash
docker-compose up -d
```
