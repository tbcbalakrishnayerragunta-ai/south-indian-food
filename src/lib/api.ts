const BASE = '/api';

function getToken() {
  return localStorage.getItem('token');
}

async function request(path: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Request failed: ${res.status}`);
  return data;
}

async function uploadFile(path: string, file: File): Promise<{ url: string }> {
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
  register: (body: { name: string; phone: string; password: string; email?: string }) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body: { phone: string; password: string }) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  me: () => request('/auth/me'),

  // Menu (public)
  getMenu: () => request('/menu'),

  // Orders (customer)
  createOrder: (body: { items: CartItemPayload[]; delivery_address?: string; notes?: string; coupon?: string }) =>
    request('/orders', { method: 'POST', body: JSON.stringify(body) }),
  getMyOrders: () => request('/orders/my'),
  getOrderStatus: (id: number) => request(`/orders/${id}/status`),

  // Payment — UPI + UTR flow
  submitUTR: (body: { order_id: number; utr_number: string }) =>
    request('/payment/submit-utr', { method: 'POST', body: JSON.stringify(body) }),

  // Coupons (public verify)
  verifyCoupon: (code: string, total: number) =>
    request('/orders/coupon/verify', { method: 'POST', body: JSON.stringify({ code, total }) }),

  // Admin — Stats & Reports
  getStats: () => request('/admin/stats'),
  getSalesReport: (days?: number) => request(`/admin/reports/sales?days=${days || 7}`),

  // Admin — Orders
  getAllOrders: (params?: { status?: string; payment_status?: string; search?: string }) => {
    const q = new URLSearchParams();
    if (params?.status) q.set('status', params.status);
    if (params?.payment_status) q.set('payment_status', params.payment_status);
    if (params?.search) q.set('search', params.search);
    return request(`/admin/orders${q.toString() ? '?' + q.toString() : ''}`);
  },
  updateOrderStatus: (id: number, status: string) =>
    request(`/admin/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  confirmPayment: (id: number) =>
    request(`/admin/orders/${id}/confirm-payment`, { method: 'PATCH' }),

  // Admin — Customers
  getCustomers: () => request('/admin/customers'),

  // Admin — Menu CRUD
  getAdminMenu: () => request('/admin/menu'),
  addMenuItem: (data: any) =>
    request('/admin/menu', { method: 'POST', body: JSON.stringify(data) }),
  updateMenuItem: (id: string, data: any) =>
    request(`/admin/menu/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteMenuItem: (id: string) =>
    request(`/admin/menu/${id}`, { method: 'DELETE' }),
  toggleMenuAvailability: (id: string, available: boolean) =>
    request(`/menu/${id}/availability`, { method: 'PATCH', body: JSON.stringify({ available }) }),
  uploadMenuImage: (file: File) => uploadFile('/admin/upload', file),

  // Admin — Coupons
  getCoupons: () => request('/admin/coupons'),
  addCoupon: (data: any) =>
    request('/admin/coupons', { method: 'POST', body: JSON.stringify(data) }),
  toggleCoupon: (id: number, active: boolean) =>
    request(`/admin/coupons/${id}`, { method: 'PATCH', body: JSON.stringify({ active }) }),
  deleteCoupon: (id: number) =>
    request(`/admin/coupons/${id}`, { method: 'DELETE' }),

  // Admin — Site Config
  getConfig: () => request('/admin/config'),
  updateConfig: (data: Record<string, string>) =>
    request('/admin/config', { method: 'PATCH', body: JSON.stringify(data) }),
};

export interface CartItemPayload {
  id: string;
  quantity: number;
}
