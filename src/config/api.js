// URL base del backend Node.js
export const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Ejemplo de uso en cualquier componente:
 * 
 * import { API_BASE_URL } from '../config/api';
 * 
 * const fetchProyectos = async () => {
 *   const response = await fetch(`${API_BASE_URL}/projects`);
 *   const data = await response.json();
 *   return data;
 * };
 */
