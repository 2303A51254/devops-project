const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
};

export const http = {
  get: (path, token) => request(path, { method: 'GET', token }),
  post: (path, body, token) => request(path, { method: 'POST', body: JSON.stringify(body), token }),
  put: (path, body, token) => request(path, { method: 'PUT', body: JSON.stringify(body), token }),
  patch: (path, body, token) => request(path, { method: 'PATCH', body: JSON.stringify(body), token }),
  delete: (path, token) => request(path, { method: 'DELETE', token }),
};
