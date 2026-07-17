const BASE = '/api';

function getToken() {
  return localStorage.getItem('token');
}

async function request(path, options = {}) {
  const token = getToken();

  async function request(path, options = {}) {
  const token = getToken();

  const headers = {
    ...(options.headers || {}),
  };

  // ✅ Important fix
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers,
  });

  let data = null;

  try {
    data = await res.json();
  } catch (err) {
    console.warn("Empty or invalid JSON response");
  }

  if (!res.ok) {
    throw new Error(data?.error || `Request failed: ${res.status}`);
  }

  return data;
}

  if (!res.ok) throw new Error(data.error || `Request failed: ${res.status}`);

  return data;
}

// 🔥 NEW FALLBACK FUNCTION
async function getMenuWithFallback() {
  try {
    return await request('/menu');
  } catch (err) {
    console.warn("Backend failed, using static menu.json");

    const base = import.meta.env.BASE_URL; // 🔥 magic

    const res = await fetch(`${base}menu.json`);

    if (!res.ok) throw new Error("Failed to load menu.json");

    return await res.json();
  }
}

async function uploadFile(path, file) {
  const token = getToken();
  const form = new FormData();
  form.append('image', file);

  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error || 'Upload failed');

  return data;
}

export const api = {
  // Auth
  register: (body) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),

  login: (body) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),

  me: () => request('/auth/me'),

  // ✅ FIXED MENU
  getMenu: () => getMenuWithFallback(),

  // Orders
  createOrder: (body) =>
    request('/orders', { method: 'POST', body: JSON.stringify(body) }),

  getMyOrders: () => request('/orders/my'),

  getOrderStatus: (id) => request(`/orders/${id}/status`),

  submitUTR: (body) =>
    request('/payment/submit-utr', { method: 'POST', body: JSON.stringify(body) }),

  verifyCoupon: (code, total) =>
    request('/orders/coupon/verify', {
      method: 'POST',
      body: JSON.stringify({ code, total }),
    }),

  // Admin
  getStats: () => request('/admin/stats'),

  getSalesReport: (days) =>
    request(`/admin/reports/sales?days=${days || 7}`),

  getAllOrders: (params) => {
    const q = new URLSearchParams();
    if (params?.status) q.set('status', params.status);
    if (params?.payment_status) q.set('payment_status', params.payment_status);
    if (params?.search) q.set('search', params.search);

    return request(`/admin/orders${q.toString() ? '?' + q.toString() : ''}`);
  },

  updateOrderStatus: (id, status) =>
    request(`/admin/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  confirmPayment: (id) =>
    request(`/admin/orders/${id}/confirm-payment`, {
      method: 'PATCH',
    }),

  getCustomers: () => request('/admin/customers'),

  getAdminMenu: () => request('/admin/menu'),

  addMenuItem: (data) =>
    request('/admin/menu', { method: 'POST', body: JSON.stringify(data) }),

  updateMenuItem: (id, data) =>
    request(`/admin/menu/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  deleteMenuItem: (id) =>
    request(`/admin/menu/${id}`, { method: 'DELETE' }),

  toggleMenuAvailability: (id, available) =>
    request(`/menu/${id}/availability`, {
      method: 'PATCH',
      body: JSON.stringify({ available }),
    }),

  uploadMenuImage: (file) => uploadFile('/admin/upload', file),

  getCoupons: () => request('/admin/coupons'),

  addCoupon: (data) =>
    request('/admin/coupons', { method: 'POST', body: JSON.stringify(data) }),

  toggleCoupon: (id, active) =>
    request(`/admin/coupons/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ active }),
    }),

  deleteCoupon: (id) =>
    request(`/admin/coupons/${id}`, { method: 'DELETE' }),

  getConfig: () => request('/admin/config'),

  updateConfig: (data) =>
    request('/admin/config', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};
