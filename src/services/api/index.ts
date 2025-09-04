
/**
 * Unified API Client
 * Centralized API service for all data operations
 */

import axios from 'axios';
import { Order, Product, Client } from '@/lib/data';

// API configuration
const API_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Error handling helper
const handleAxiosError = (error: any) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error("API Error Response:", error.response.data);
    console.error("Status:", error.response.status);
    throw new Error(error.response.data.error || `API Error: ${error.response.status}`);
  } else if (error.request) {
    // The request was made but no response was received
    console.error("Network Error:", error.request);
    throw new Error("Network error. Please check your connection.");
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error("Request Error:", error.message);
    throw new Error(`Request error: ${error.message}`);
  }
};

// ===== Orders API =====
export const getOrders = async (): Promise<Order[]> => {
  try {
    const response = await apiClient.get('/orders');
    return response.data;
  } catch (error) {
    return handleAxiosError(error);
  }
};

export const getOrder = async (id: string): Promise<Order> => {
  try {
    const response = await apiClient.get(`/orders/${id}`);
    return response.data;
  } catch (error) {
    return handleAxiosError(error);
  }
};

export const createOrder = async (order: Omit<Order, 'id'>): Promise<Order> => {
  try {
    const response = await apiClient.post('/orders', order);
    return response.data;
  } catch (error) {
    return handleAxiosError(error);
  }
};

export const updateOrder = async (id: string, order: Partial<Order>): Promise<Order> => {
  try {
    const response = await apiClient.put(`/orders/${id}`, order);
    return response.data;
  } catch (error) {
    return handleAxiosError(error);
  }
};

export const deleteOrder = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/orders/${id}`);
  } catch (error) {
    handleAxiosError(error);
  }
};

// ===== Products API =====
export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await apiClient.get('/inventory');
    return response.data;
  } catch (error) {
    return handleAxiosError(error);
  }
};

export const getProduct = async (id: string): Promise<Product> => {
  try {
    const response = await apiClient.get(`/inventory/${id}`);
    return response.data;
  } catch (error) {
    return handleAxiosError(error);
  }
};

export const createProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
  try {
    const response = await apiClient.post('/inventory', product);
    return response.data;
  } catch (error) {
    return handleAxiosError(error);
  }
};

export const updateProduct = async (id: string, product: Partial<Product>): Promise<Product> => {
  try {
    const response = await apiClient.put(`/inventory/${id}`, product);
    return response.data;
  } catch (error) {
    return handleAxiosError(error);
  }
};

export const deleteProduct = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/inventory/${id}`);
  } catch (error) {
    handleAxiosError(error);
  }
};

// ===== Clients API =====
export const getClients = async (): Promise<Client[]> => {
  try {
    const response = await apiClient.get('/clients');
    return response.data;
  } catch (error) {
    return handleAxiosError(error);
  }
};

export const getClient = async (id: string): Promise<Client> => {
  try {
    const response = await apiClient.get(`/clients/${id}`);
    return response.data;
  } catch (error) {
    return handleAxiosError(error);
  }
};

export const createClient = async (client: Omit<Client, 'id'>): Promise<Client> => {
  try {
    const response = await apiClient.post('/clients', client);
    return response.data;
  } catch (error) {
    return handleAxiosError(error);
  }
};

export const updateClient = async (id: string, client: Partial<Client>): Promise<Client> => {
  try {
    const response = await apiClient.put(`/clients/${id}`, client);
    return response.data;
  } catch (error) {
    return handleAxiosError(error);
  }
};

export const deleteClient = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/clients/${id}`);
  } catch (error) {
    handleAxiosError(error);
  }
};

// Export the axios instance for custom requests
export { apiClient };
