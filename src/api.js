import { tokenStore } from './store.js';

export const BASE_URL = 'http://localhost:3000';

let currentToken = null;
tokenStore.subscribe(val => currentToken = val);

export function isTokenExpired(token) {
  if (!token) return true;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    const decoded = JSON.parse(jsonPayload);
    return decoded.exp && decoded.exp < Date.now() / 1000;
  } catch(e) {
    return true;
  }
}

export async function apiFetch(path, options = {}) {
  if (currentToken && isTokenExpired(currentToken)) {
    tokenStore.set(null);
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('role');
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('token-expired'));
    }
    throw new Error('Unauthorized');
  }

  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (currentToken) {
    headers['Authorization'] = `Bearer ${currentToken}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  
  if (response.status === 401) {
    tokenStore.set(null);
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('role');
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('token-expired'));
    }
    throw new Error('Unauthorized');
  }

  if (response.status === 204) return null; // NO CONTENT

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'API Error');
  }

  return data;
}

export function getToken(roleOrPermissions) {
  return apiFetch('/token', {
    method: 'POST',
    body: JSON.stringify(roleOrPermissions)
  });
}

export function fetchGames(page = 1, limit = 10) {
  return apiFetch(`/games?page=${page}&limit=${limit}`);
}

export function fetchGame(id) {
  return apiFetch(`/games/${id}`);
}

export function createGame(data) {
  return apiFetch('/games', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export function updateGame(id, data) {
  return apiFetch(`/games/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export function deleteGame(id) {
  return apiFetch(`/games/${id}`, {
    method: 'DELETE'
  });
}
