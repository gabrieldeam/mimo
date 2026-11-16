import { API_BASE_URL } from '../config/api';
const request = async (path, options) => { if (!API_BASE_URL) throw new Error('API não configurada'); const response = await fetch(`${API_BASE_URL}${path}`, { headers: { 'Content-Type': 'application/json' }, ...options }); if (!response.ok) throw new Error(`Servidor respondeu ${response.status}`); return response.json(); };
export const createUser = (user) => request('/users', { method: 'POST', body: JSON.stringify(user) });
export const fetchProducts = () => request('/products');
