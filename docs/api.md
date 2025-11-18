# Documentación de la API

Esta página documenta los endpoints disponibles en el API Gateway del Marketplace Artesanal.

## Base URL

```
http://localhost:8000/api/v1
```

## Autenticación

La mayoría de los endpoints requieren autenticación mediante token JWT. El token debe incluirse en el header:

```
Authorization: Bearer <token>
```

---

## Autenticación

### Registrar Usuario

**POST** `/auth/register`

Crea una nueva cuenta de usuario.

**Request Body:**
```json
{
  "username": "artesano123",
  "email": "artesano@example.com",
  "password": "contraseña_segura"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "username": "artesano123",
  "email": "artesano@example.com"
}
```

### Iniciar Sesión

**POST** `/auth/login`

Autentica un usuario existente.

**Request Body (form-data):**
```
username: artesano123
password: contraseña_segura
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "username": "artesano123",
  "email": "artesano@example.com"
}
```

### Obtener Perfil

**GET** `/auth/profile`

Obtiene información del usuario autenticado.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "username": "artesano123",
  "email": "artesano@example.com"
}
```

---

## Productos

### Listar Productos

**GET** `/productos/`

Obtiene la lista completa de productos.

**Response:**
```json
[
  {
    "id": 1,
    "nombre": "Cerámica Artesanal",
    "descripcion": "Hermosa cerámica hecha a mano",
    "precio": 45000,
    "categoria": "Cerámica",
    "image": "https://example.com/image.jpg",
    "is_active": true
  }
]
```

### Obtener Producto

**GET** `/productos/{id}`

Obtiene los detalles de un producto específico.

**Response:**
```json
{
  "id": 1,
  "nombre": "Cerámica Artesanal",
  "descripcion": "Hermosa cerámica hecha a mano",
  "precio": 45000,
  "categoria": "Cerámica",
  "image": "https://example.com/image.jpg",
  "is_active": true
}
```

### Crear Producto

**POST** `/productos/`

Crea un nuevo producto. Requiere autenticación.

**Request Body:**
```json
{
  "nombre": "Cerámica Artesanal",
  "descripcion": "Hermosa cerámica hecha a mano",
  "precio": 45000,
  "categoria": "Cerámica",
  "image": "https://example.com/image.jpg",
  "is_active": true
}
```

### Actualizar Producto

**PUT** `/productos/{id}`

Actualiza un producto existente. Requiere autenticación.

**Request Body:**
```json
{
  "precio": 50000,
  "is_active": false
}
```

### Eliminar Producto

**DELETE** `/productos/{id}`

Elimina un producto. Requiere autenticación.

---

## Pedidos

### Listar Pedidos

**GET** `/pedidos/`

Obtiene todos los pedidos del usuario autenticado.

**Response:**
```json
[
  {
    "id": 1,
    "id_usuario": 1,
    "monto_total": 90000,
    "estado": "pending",
    "fecha_creacion": "2024-01-15T10:30:00",
    "activo": true,
    "items": [
      {
        "id": 1,
        "id_pedido": 1,
        "id_producto": 1,
        "cantidad": 2,
        "precio_unitario": 45000
      }
    ]
  }
]
```

### Obtener Pedido

**GET** `/pedidos/{id}`

Obtiene detalles de un pedido específico.

### Crear Pedido

**POST** `/pedidos/`

Crea un nuevo pedido. Requiere autenticación.

**Request Body:**
```json
{
  "id_usuario": 1,
  "items": [
    {
      "id_producto": 1,
      "cantidad": 2
    }
  ]
}
```

**Response:**
```json
{
  "id": 1,
  "id_usuario": 1,
  "monto_total": 90000,
  "estado": "pending",
  "fecha_creacion": "2024-01-15T10:30:00",
  "activo": true,
  "items": [...]
}
```

### Actualizar Pedido

**PUT** `/pedidos/{id}`

Actualiza el estado de un pedido.

**Request Body:**
```json
{
  "estado": "completed"
}
```

### Eliminar Pedido

**DELETE** `/pedidos/{id}`

Cancela un pedido.

---

## Pagos

### Listar Pagos

**GET** `/pagos/`

Obtiene el historial de pagos del usuario.

**Response:**
```json
[
  {
    "id": 1,
    "id_usuario": 1,
    "id_pedido": 1,
    "monto": 90000,
    "moneda": "COP",
    "estado": "completed",
    "metodo_pago": "credit_card",
    "fecha_pago": "2024-01-15T11:00:00",
    "fecha_creacion": "2024-01-15T10:30:00",
    "fecha_actualizacion": "2024-01-15T11:00:00",
    "activo": true
  }
]
```

### Obtener Pago

**GET** `/pagos/{id}`

Obtiene detalles de un pago específico.

### Crear Pago

**POST** `/pagos/`

Procesa un nuevo pago. Requiere autenticación.

**Request Body:**
```json
{
  "id_usuario": 1,
  "id_pedido": 1,
  "monto": 90000,
  "moneda": "COP",
  "metodo_pago": "credit_card"
}
```

### Actualizar Pago

**PUT** `/pagos/{id}`

Actualiza el estado de un pago.

**Request Body:**
```json
{
  "estado": "completed",
  "fecha_pago": "2024-01-15T11:00:00"
}
```

---

## Códigos de Estado HTTP

- `200 OK`: Solicitud exitosa
- `201 Created`: Recurso creado exitosamente
- `400 Bad Request`: Datos de entrada inválidos
- `401 Unauthorized`: No autenticado
- `403 Forbidden`: No autorizado
- `404 Not Found`: Recurso no encontrado
- `500 Internal Server Error`: Error del servidor

## Manejo de Errores

Todos los errores devuelven un objeto JSON con el formato:

```json
{
  "detail": "Descripción del error"
}
```
