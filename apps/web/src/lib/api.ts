import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Demo mode flag - set to true to skip all API calls
const DEMO_MODE = true;

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 3000, // 3 second timeout for faster fallback
});

// Add auth token interceptor if needed
api.interceptors.request.use((config) => {
  // In demo mode, reject all requests immediately
  if (DEMO_MODE) {
    return Promise.reject({ isDemo: true, message: 'Demo mode - using mock data' });
  }
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Silence network errors in demo mode
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.isDemo || error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
      // Silently reject - components should handle with mock data
      return Promise.reject({ silent: true });
    }
    return Promise.reject(error);
  }
);

export interface Product {
  id: string;
  name: string;
  genericName?: string;
  description?: string;
  unit: string;
  category?: string;
  manufacturer?: string;
  inventories: Inventory[];
}

export interface Inventory {
  id: string;
  batchNumber: string;
  quantity: number;
  expiryDate: string;
  sellingPrice: number;
  costPrice: number;
  location?: string;
  lowStockThreshold?: number;
}

export const inventoryApi = {
  getAll: async () => {
    const response = await api.get<Product[]>('/inventory');
    return response.data;
  },
  
  getLowStock: async () => {
    const response = await api.get<Product[]>('/inventory/low-stock');
    return response.data;
  },

  getExpiringSoon: async () => {
    const response = await api.get<Inventory[]>('/inventory/expiring');
    return response.data;
  }
};

export const authApi = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (data: any) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  }
};

export const mlApi = {
  getForecast: async (periods: number = 30) => {
    const response = await api.post('/ml/forecast', { periods });
    return response.data;
  },
  
  optimizeStock: async (productId: string) => {
    const response = await api.get(`/ml/inventory/optimize/${productId}`);
    return response.data;
  }
};
