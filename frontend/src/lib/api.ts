// src/lib/api.ts

// Determine the base URL based on the environment.
// In Vite, import.meta.env.DEV is true during local development.
// You can also use a .env file to set VITE_API_URL.
//const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : '');

const API_BASE_URL = 'https://agrifuel-backend.onrender.com';
export const api = {
  // --- Helper to get headers ---
  getHeaders: () => {
    const token = localStorage.getItem('af_token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
  },

  // --- GET Request ---
  get: async (endpoint: string) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: api.getHeaders(),
    });
    
    if (!response.ok) {
      const err = await response.json().catch(() => ({ message: 'API request failed' }));
      throw new Error(err.message || `Error ${response.status}`);
    }
    return response.json();
  },

  // --- POST Request ---
  post: async (endpoint: string, data: any) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: api.getHeaders(),
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const err = await response.json().catch(() => ({ message: 'API request failed' }));
      throw new Error(err.message || `Error ${response.status}`);
    }
    return response.json();
  },

  // --- PUT Request ---
  put: async (endpoint: string, data?: any) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: api.getHeaders(),
      ...(data ? { body: JSON.stringify(data) } : {})
    });
    
    if (!response.ok) {
      const err = await response.json().catch(() => ({ message: 'API request failed' }));
      throw new Error(err.message || `Error ${response.status}`);
    }
    return response.json();
  },

  // --- DELETE Request ---
  delete: async (endpoint: string) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: api.getHeaders(),
    });
    
    if (!response.ok) {
      const err = await response.json().catch(() => ({ message: 'API request failed' }));
      throw new Error(err.message || `Error ${response.status}`);
    }
    // Handle 204 No Content which doesn't return JSON
    if (response.status === 204) return null;
    return response.json();
  },
  
  // --- Export the raw URL if needed for Images/Formdata ---
  baseURL: API_BASE_URL
};