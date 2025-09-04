
import { Order } from '@/lib/data';
import { productService, clientService } from './supabaseService';

const API_URL = 'http://localhost:5000/api';

// Error handling helper
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
  }
  return response.json();
};

// Order APIs
export const fetchOrders = async (): Promise<Order[]> => {
  const response = await fetch(`${API_URL}/orders`);
  return handleResponse(response);
};

export const fetchOrder = async (id: string): Promise<Order> => {
  const response = await fetch(`${API_URL}/orders/${id}`);
  return handleResponse(response);
};

export const createOrder = async (orderData: Omit<Order, 'id'>): Promise<Order> => {
  const response = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData),
  });
  return handleResponse(response);
};

export const updateOrder = async (id: string, orderData: Partial<Order>): Promise<Order> => {
  const response = await fetch(`${API_URL}/orders/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData),
  });
  return handleResponse(response);
};

export const deleteOrder = async (id: string): Promise<{ success: boolean, message: string }> => {
  const response = await fetch(`${API_URL}/orders/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
};

// Inventory APIs - now using Supabase
export const fetchInventory = async () => {
  return productService.getAll();
};

export const fetchProduct = async (id: string) => {
  return productService.getById(id);
};

export const createProduct = async (productData: any) => {
  return productService.create(productData);
};

export const updateProduct = async (id: string, productData: any) => {
  return productService.update(id, productData);
};

export const deleteProduct = async (id: string) => {
  await productService.delete(id);
  return { success: true, message: "Product deleted successfully" };
};

// Client APIs - now using Supabase
export const fetchClients = async () => {
  return clientService.getAll();
};

export const fetchClient = async (id: string) => {
  return clientService.getById(id);
};

export const createClient = async (clientData: any) => {
  return clientService.create(clientData);
};

export const updateClient = async (id: string, clientData: any) => {
  return clientService.update(id, clientData);
};

export const deleteClient = async (id: string) => {
  await clientService.delete(id);
  return { success: true, message: "Client deleted successfully" };
};
