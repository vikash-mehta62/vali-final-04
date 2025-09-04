
import axios from 'axios';
import { Order, Product, Client } from '@/lib/data';

const API_URL = 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Orders
export const getOrders = async (): Promise<Order[]> => {
  const response = await apiClient.get('/orders');
  return response.data;
};

export const getOrder = async (id: string): Promise<Order> => {
  const response = await apiClient.get(`/orders/${id}`);
  return response.data;
};

export const createOrder = async (order: Omit<Order, 'id'>): Promise<Order> => {
  const response = await apiClient.post('/orders', order);
  return response.data;
};

export const updateOrder = async (id: string, order: Partial<Order>): Promise<Order> => {
  const response = await apiClient.put(`/orders/${id}`, order);
  return response.data;
};

export const deleteOrder = async (id: string): Promise<void> => {
  await apiClient.delete(`/orders/${id}`);
};

// Inventory
export const getProducts = async (): Promise<Product[]> => {
  const response = await apiClient.get('/inventory');
  return response.data;
};

export const getProduct = async (id: string): Promise<Product> => {
  const response = await apiClient.get(`/inventory/${id}`);
  return response.data;
};

export const createProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
  const response = await apiClient.post('/inventory', product);
  return response.data;
};

export const updateProduct = async (id: string, product: Partial<Product>): Promise<Product> => {
  const response = await apiClient.put(`/inventory/${id}`, product);
  return response.data;
};

export const deleteProduct = async (id: string): Promise<void> => {
  await apiClient.delete(`/inventory/${id}`);
};

// Clients
export const getClients = async (): Promise<Client[]> => {
  const response = await apiClient.get('/clients');
  return response.data;
};

export const getClient = async (id: string): Promise<Client> => {
  const response = await apiClient.get(`/clients/${id}`);
  return response.data;
};

export const createClient = async (client: Omit<Client, 'id'>): Promise<Client> => {
  const response = await apiClient.post('/clients', client);
  return response.data;
};

export const updateClient = async (id: string, client: Partial<Client>): Promise<Client> => {
  const response = await apiClient.put(`/clients/${id}`, client);
  return response.data;
};

export const deleteClient = async (id: string): Promise<void> => {
  await apiClient.delete(`/clients/${id}`);
};

export default apiClient;
