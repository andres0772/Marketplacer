// Modelo de Producto
export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  image: string | null;
  is_active: boolean;
}

export interface ProductoCreate {
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  image?: string | null;
  is_active?: boolean;
}

export interface ProductoUpdate {
  nombre?: string;
  descripcion?: string;
  precio?: number;
  categoria?: string;
  image?: string | null;
  is_active?: boolean;
}

// Modelo de Pedido
export interface OrderItem {
  id: number;
  id_pedido: number;
  id_producto: number;
  cantidad: number;
  precio_unitario: number;
}

export interface OrderItemCreate {
  id_producto: number;
  cantidad: number;
}

export interface Order {
  id: number;
  id_usuario: number;
  monto_total: number;
  estado: string;
  fecha_creacion: string;
  activo: boolean;
  items: OrderItem[];
}

export interface OrderCreate {
  id_usuario: number;
  estado?: string;
  activo?: boolean;
  items: OrderItemCreate[];
}

export interface OrderUpdate {
  id_usuario?: number;
  estado?: string;
  activo?: boolean;
}

// Modelo de Pago
export interface Payment {
  id: number;
  id_usuario: number;
  id_pedido: number;
  monto: number;
  moneda: string;
  estado: string;
  metodo_pago: string | null;
  fecha_pago: string | null;
  fecha_creacion: string;
  fecha_actualizacion: string | null;
  activo: boolean;
}

export interface PaymentCreate {
  id_usuario: number;
  id_pedido: number;
  monto: number;
  moneda?: string;
  estado?: string;
  metodo_pago?: string | null;
  activo?: boolean;
}

export interface PaymentUpdate {
  id_usuario?: number;
  id_pedido?: number;
  monto?: number;
  moneda?: string;
  estado?: string;
  metodo_pago?: string | null;
  activo?: boolean;
}

// Modelo de Usuario/Auth
export interface UserRegister {
  username: string;
  email: string;
  password: string;
}

export interface UserLogin {
  username: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  username: string;
  email: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
}
