import axios, { AxiosInstance } from 'axios';
import type {
  Producto,
  ProductoCreate,
  ProductoUpdate,
  Order,
  OrderCreate,
  OrderUpdate,
  Payment,
  PaymentCreate,
  PaymentUpdate,
  UserRegister,
  UserLogin,
  AuthResponse,
} from '../types/models';

// API Gateway URL desde variables de entorno o valor por defecto
const API_BASE_URL = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8000';

class APIClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
    });

    // Interceptor para agregar dinámicamente el token de autenticación en cada petición
    this.client.interceptors.request.use((config) => {
      // Leemos el token del localStorage justo antes de enviar la petición.
      // Esto asegura que siempre usamos el token más actualizado.
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    }, (error) => Promise.reject(error));
  }

  // ============ AUTHENTICATION ============
  async register(userData: UserRegister): Promise<AuthResponse> {
    const response = await this.client.post('/api/v1/auth/register', userData);
    return response.data;
  }

  async login(credentials: UserLogin): Promise<AuthResponse> {
    // El endpoint de login de FastAPI espera datos de formulario en formato URL-encoded.
    const params = new URLSearchParams();
    params.append('username', credentials.username);
    params.append('password', credentials.password);

    // Al pasar un URLSearchParams, axios debería usar el Content-Type correcto automáticamente.
    // Forzarlo explícitamente a veces puede causar problemas si la configuración global interfiere.
    const response = await this.client.post('/api/v1/auth/login', params);
    return response.data;
  }

  async getProfile(): Promise<any> {
    const response = await this.client.get('/api/v1/auth/me');
    return response.data;
  }

  // ============ PRODUCTOS ============
  async getProductos(): Promise<Producto[]> {
    const response = await this.client.get('/api/v1/productos/');
    return response.data;
  }

  async getProducto(id: number): Promise<Producto> {
    const response = await this.client.get(`/api/v1/productos/${id}`);
    return response.data;
  }

  async createProducto(producto: ProductoCreate): Promise<Producto> {
    const response = await this.client.post('/api/v1/productos/', producto);
    return response.data;
  }

  async updateProducto(id: number, producto: ProductoUpdate): Promise<Producto> {
    const response = await this.client.put(`/api/v1/productos/${id}`, producto);
    return response.data;
  }

  async deleteProducto(id: number): Promise<void> {
    await this.client.delete(`/api/v1/productos/${id}`);
  }

  // ============ PEDIDOS ============
  async getPedidos(): Promise<Order[]> {
    const response = await this.client.get('/api/v1/pedidos/');
    return response.data;
  }

  async getPedido(id: number): Promise<Order> {
    const response = await this.client.get(`/api/v1/pedidos/${id}`);
    return response.data;
  }

  async createPedido(pedido: OrderCreate): Promise<Order> {
    const response = await this.client.post('/api/v1/pedidos/', pedido);
    return response.data;
  }

  async updatePedido(id: number, pedido: OrderUpdate): Promise<Order> {
    const response = await this.client.put(`/api/v1/pedidos/${id}`, pedido);
    return response.data;
  }

  async deletePedido(id: number): Promise<void> {
    await this.client.delete(`/api/v1/pedidos/${id}`);
  }

  // ============ PAGOS ============
  async getPagos(): Promise<Payment[]> {
    const response = await this.client.get('/api/v1/pagos/');
    return response.data;
  }

  async getPago(id: number): Promise<Payment> {
    const response = await this.client.get(`/api/v1/pagos/${id}`);
    return response.data;
  }

  async createPago(pago: PaymentCreate): Promise<Payment> {
    const response = await this.client.post('/api/v1/pagos/', pago);
    return response.data;
  }

  async updatePago(id: number, pago: PaymentUpdate): Promise<Payment> {
    const response = await this.client.put(`/api/v1/pagos/${id}`, pago);
    return response.data;
  }

  async deletePago(id: number): Promise<void> {
    await this.client.delete(`/api/v1/pagos/${id}`);
  }
}

export const apiClient = new APIClient();
export default apiClient;
