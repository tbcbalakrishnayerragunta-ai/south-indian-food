import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import {
  ShoppingBag, TrendingUp, Clock, CheckCircle, ChefHat, Package, Bike,
  XCircle, RefreshCw, ToggleLeft, ToggleRight, LogOut, Receipt, Users,
  Plus, Pencil, Trash2, Upload, Tag, Settings, BarChart2, ArrowLeft,
  IndianRupee, AlertCircle, ShieldCheck, Search, Save, Loader2
} from 'lucide-react';

const STATUS_FLOW = ['placed', 'confirmed', 'preparing', 'ready', 'delivered'];
const STATUS_CFG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  placed:    { label: 'Placed',    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',     icon: ShoppingBag },
  confirmed: { label: 'Confirmed', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300', icon: CheckCircle },
  preparing: { label: 'Preparing', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300', icon: ChefHat },
  ready:     { label: 'Ready',     color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',  icon: Package },
  delivered: { label: 'Delivered', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300', icon: Bike },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',         icon: XCircle },
};
const PAY_CFG: Record<string, { label: string; color: string }> = {
  pending:       { label: '⏳ Pending',         color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' },
  utr_submitted: { label: '🔍 UTR — Verify',    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
  paid:          { label: '✅ Paid',             color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
  failed:        { label: '❌ Failed',           color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' },
};

type Tab = 'dashboard' | 'orders' | 'customers' | 'menu' | 'coupons' | 'settings';

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart2 },
  { id: 'orders',    label: 'Orders',    icon: ShoppingBag },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'menu',      label: 'Menu',      icon: ChefHat },
  { id: 'coupons',   label: 'Coupons',   icon: Tag },
  { id: 'settings',  label: 'Settings',  icon: Settings },
];

// ── Helpers ────────────────────────────────────────────────────────────────────
function Pill({ className, children }: { className: string; children: React.ReactNode }) {
  return <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${className}`}>{children}</span>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DASHBOARD TAB
// ═══════════════════════════════════════════════════════════════════════════════
function DashboardTab({ stats, report }: { stats: any; report: any[] }) {
  if (!stats) return <div className="text-center py-12 text-muted-foreground">Loading…</div>;
  const cards = [
    { label: 'Total Orders',   value: stats.total_orders,    icon: ShoppingBag, color: 'text-blue-600' },
    { label: 'Revenue',        value: `₹${Number(stats.revenue||0).toFixed(0)}`, icon: IndianRupee, color: 'text-green-600' },
    { label: 'Today\'s Orders', value: stats.today_orders,   icon: Clock,       color: 'text-orange-600' },
    { label: 'Active Orders',  value: stats.pending_orders,  icon: ChefHat,     color: 'text-purple-600' },
    { label: 'Customers',      value: stats.total_customers, icon: Users,       color: 'text-pink-600' },
  ];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {cards.map(c => (
          <motion.div key={c.label} whileHover={{ scale: 1.02 }}
            className="bg-card border border-border rounded-2xl p-4 flex flex-col gap-2">
            <div className={`w-9 h-9 rounded-xl bg-background flex items-center justify-center ${c.color}`}>
              <c.icon className="w-4 h-4" />
            </div>
            <p className="text-2xl font-black font-['Poppins'] leading-none">{c.value}</p>
            <p className="text-xs text-muted-foreground leading-tight">{c.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Sales chart (simple bars) */}
      {report.length > 0 && (
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="font-bold mb-4 text-sm text-muted-foreground uppercase tracking-wide">Last 7 Days Revenue</h3>
          <div className="flex items-end gap-1.5 h-28">
            {report.map((r: any) => {
              const maxRev = Math.max(...report.map((x: any) => parseFloat(x.revenue)));
              const pct = maxRev > 0 ? (parseFloat(r.revenue) / maxRev) * 100 : 0;
              return (
                <div key={r.date} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[9px] text-muted-foreground font-mono">₹{parseFloat(r.revenue).toFixed(0)}</span>
                  <div className="w-full bg-primary rounded-t-md transition-all" style={{ height: `${Math.max(4, pct * 0.8)}px` }} />
                  <span className="text-[9px] text-muted-foreground">{new Date(r.date).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Top selling items */}
      {stats.top_items?.length > 0 && (
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="font-bold mb-3 text-sm text-muted-foreground uppercase tracking-wide">Top Selling (7 Days)</h3>
          <div className="space-y-2">
            {stats.top_items.map((item: any, i: number) => (
              <div key={item.item_name} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-black flex items-center justify-center shrink-0">{i+1}</span>
                <div className="flex-1">
                  <div className="flex justify-between text-sm font-semibold mb-0.5">
                    <span>{item.item_name}</span>
                    <span className="text-muted-foreground">{item.qty} sold</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(100,(item.qty/stats.top_items[0].qty)*100)}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ORDERS TAB
// ═══════════════════════════════════════════════════════════════════════════════
function OrdersTab() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [payFilter, setPayFilter] = useState('');
  const [search, setSearch] = useState('');

  async function load() {
    setLoading(true);
    try {
      const data = await api.getAllOrders({ status: statusFilter || undefined, payment_status: payFilter || undefined, search: search || undefined });
      setOrders(data);
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, [statusFilter, payFilter, search]);

  async function advance(order: any) {
    const idx = STATUS_FLOW.indexOf(order.status);
    if (idx < 0 || idx >= STATUS_FLOW.length - 1) return;
    setUpdating(order.id);
    try { await api.updateOrderStatus(order.id, STATUS_FLOW[idx + 1]); await load(); } finally { setUpdating(null); }
  }
  async function cancel(id: number) {
    setUpdating(id);
    try { await api.updateOrderStatus(id, 'cancelled'); await load(); } finally { setUpdating(null); }
  }
  async function confirmPay(id: number) {
    setUpdating(id);
    try { await api.confirmPayment(id); await load(); } finally { setUpdating(null); }
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, phone, order ID…"
            className="w-full pl-9 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 min-w-[130px]">
          <option value="">All Status</option>
          {Object.entries(STATUS_CFG).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <select value={payFilter} onChange={e => setPayFilter(e.target.value)}
          className="px-3 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 min-w-[150px]">
          <option value="">All Payments</option>
          {Object.entries(PAY_CFG).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <button onClick={load} className="p-2.5 bg-card border border-border rounded-xl hover:bg-muted transition-colors">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="h-28 bg-muted animate-pulse rounded-2xl" />)}</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">No orders found</div>
      ) : (
        <div className="space-y-2">
          {orders.map(order => {
            const cfg = STATUS_CFG[order.status] || STATUS_CFG.placed;
            const payBadge = PAY_CFG[order.payment_status] || PAY_CFG.pending;
            const Icon = cfg.icon;
            const canAdvance = STATUS_FLOW.indexOf(order.status) < STATUS_FLOW.length - 1 && order.status !== 'cancelled';
            return (
              <motion.div key={order.id} layout className="bg-card border border-border rounded-2xl p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap mb-1">
                      <span className="font-black text-base">#{order.id}</span>
                      <Pill className={cfg.color}><Icon className="w-3 h-3" />{cfg.label}</Pill>
                      <Pill className={payBadge.color}>{payBadge.label}</Pill>
                    </div>
                    <p className="text-sm font-semibold">{order.customer_name} · {order.customer_phone}</p>
                    {order.delivery_address && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">📍 {order.delivery_address}</p>}
                    {order.items?.filter(Boolean).length > 0 && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {order.items.filter(Boolean).map((i: any) => `${i.name}×${i.quantity}`).join(', ')}
                      </p>
                    )}
                    {order.utr_number && (
                      <div className="mt-1.5 inline-flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg px-2.5 py-1">
                        <Receipt className="w-3 h-3 text-blue-600 shrink-0" />
                        <span className="text-xs font-mono text-blue-700 dark:text-blue-300">UTR: {order.utr_number}</span>
                      </div>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xl font-black text-primary">₹{parseFloat(order.total_amount).toFixed(0)}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})}
                      {' · '}
                      {new Date(order.created_at).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3 flex-wrap">
                  {order.payment_status === 'utr_submitted' && (
                    <button onClick={() => confirmPay(order.id)} disabled={updating === order.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-xs font-bold rounded-xl hover:bg-green-700 disabled:opacity-60">
                      ✅ Confirm Payment
                    </button>
                  )}
                  {canAdvance && (
                    <button onClick={() => advance(order)} disabled={updating === order.id}
                      className="flex-1 py-1.5 bg-primary text-primary-foreground text-sm font-bold rounded-xl hover:bg-primary/90 disabled:opacity-60 min-w-[120px]">
                      {updating === order.id ? '…' : `→ ${STATUS_CFG[STATUS_FLOW[STATUS_FLOW.indexOf(order.status)+1]]?.label}`}
                    </button>
                  )}
                  {order.status !== 'cancelled' && order.status !== 'delivered' && (
                    <button onClick={() => cancel(order.id)} disabled={updating === order.id}
                      className="px-3 py-1.5 border border-red-200 text-red-600 text-sm rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-60">
                      Cancel
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CUSTOMERS TAB
// ═══════════════════════════════════════════════════════════════════════════════
function CustomersTab() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.getCustomers().then(setCustomers).finally(() => setLoading(false));
  }, []);

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search)
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customers…"
          className="w-full pl-9 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
      </div>
      {loading ? (
        <div className="space-y-2">{[1,2,3,4].map(i => <div key={i} className="h-16 bg-muted animate-pulse rounded-2xl" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No customers found</div>
      ) : (
        <div className="space-y-2">
          {filtered.map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              className="bg-card border border-border rounded-2xl p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-primary font-black text-sm">{c.name[0]?.toUpperCase()}</span>
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm truncate">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.phone}</p>
                  {c.email && <p className="text-xs text-muted-foreground truncate">{c.email}</p>}
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-black text-primary">₹{parseFloat(c.total_spent||0).toFixed(0)}</p>
                <p className="text-xs text-muted-foreground">{c.order_count} orders</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MENU TAB
// ═══════════════════════════════════════════════════════════════════════════════
const EMPTY_ITEM = { id: '', name: '', description: '', price: '', image_url: '', badge: '', category: 'breakfast', ingredients: '', is_veg: true, discount: '0', available: true };

function MenuTab() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    try { setItems(await api.getAdminMenu()); } finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  function openNew() { setEditing({ ...EMPTY_ITEM }); setIsNew(true); }
  function openEdit(item: any) { setEditing({ ...item }); setIsNew(false); }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    setUploadingId('uploading');
    try {
      const { url } = await api.uploadMenuImage(file);
      setEditing((prev: any) => ({ ...prev, image_url: url }));
    } catch (err: any) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploadingId(null);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  async function save() {
    if (!editing) return;
    setSaving(true);
    try {
      const data = { ...editing, price: parseFloat(editing.price), discount: parseFloat(editing.discount || '0') };
      if (isNew) await api.addMenuItem(data);
      else await api.updateMenuItem(editing.id, data);
      setEditing(null);
      await load();
    } catch (err: any) {
      alert(err.message);
    } finally { setSaving(false); }
  }

  async function del(id: string) {
    if (!confirm('Delete this dish? This cannot be undone.')) return;
    await api.deleteMenuItem(id);
    setItems(items.filter(i => i.id !== id));
  }

  async function toggle(id: string, available: boolean) {
    await api.toggleMenuAvailability(id, !available);
    setItems(items.map(i => i.id === id ? { ...i, available: !available } : i));
  }

  if (editing) {
    return (
      <div className="space-y-4 max-w-lg">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => setEditing(null)} className="p-2 rounded-full hover:bg-muted transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h3 className="font-bold text-lg">{isNew ? 'Add New Dish' : 'Edit Dish'}</h3>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
          {/* Image preview + upload */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Dish Image</label>
            {editing.image_url && (
              <img src={editing.image_url} alt="preview" className="w-full h-40 object-cover rounded-xl border border-border" />
            )}
            <div className="flex gap-2">
              <input type="text" value={editing.image_url} onChange={e => setEditing((p: any) => ({ ...p, image_url: e.target.value }))}
                placeholder="Paste image URL…"
                className="flex-1 px-3 py-2 bg-background border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
              <button onClick={() => fileRef.current?.click()} disabled={uploadingId === 'uploading'}
                className="flex items-center gap-2 px-3 py-2 bg-muted border border-border rounded-xl text-sm font-semibold hover:bg-muted/80 disabled:opacity-60 shrink-0">
                {uploadingId === 'uploading' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                Upload
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </div>
          </div>

          {isNew && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">ID (slug, e.g. chicken-biryani) *</label>
              <input value={editing.id} onChange={e => setEditing((p: any) => ({ ...p, id: e.target.value.toLowerCase().replace(/\s+/g,'-') }))}
                placeholder="e.g. idli-combo"
                className="w-full px-3 py-2.5 bg-background border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
            </div>
          )}

          {[
            { key: 'name', label: 'Dish Name *', type: 'text', placeholder: 'e.g. Idli Combo' },
            { key: 'price', label: 'Price (₹) *', type: 'number', placeholder: '40' },
            { key: 'discount', label: 'Discount (₹)', type: 'number', placeholder: '0' },
            { key: 'badge', label: 'Badge (optional)', type: 'text', placeholder: 'Best Seller' },
          ].map(f => (
            <div key={f.key} className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{f.label}</label>
              <input type={f.type} value={editing[f.key]} onChange={e => setEditing((p: any) => ({ ...p, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                className="w-full px-3 py-2.5 bg-background border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
            </div>
          ))}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Description</label>
            <textarea value={editing.description} onChange={e => setEditing((p: any) => ({ ...p, description: e.target.value }))}
              rows={2} placeholder="Describe this dish…"
              className="w-full px-3 py-2.5 bg-background border border-input rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/40" />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Ingredients</label>
            <textarea value={editing.ingredients || ''} onChange={e => setEditing((p: any) => ({ ...p, ingredients: e.target.value }))}
              rows={2} placeholder="Rice, lentils, coconut chutney…"
              className="w-full px-3 py-2.5 bg-background border border-input rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/40" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Category</label>
              <select value={editing.category} onChange={e => setEditing((p: any) => ({ ...p, category: e.target.value }))}
                className="w-full px-3 py-2.5 bg-background border border-input rounded-xl text-sm focus:outline-none">
                {['breakfast', 'lunch', 'dinner', 'snacks', 'beverages', 'desserts'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Type</label>
              <select value={editing.is_veg ? 'veg' : 'nonveg'} onChange={e => setEditing((p: any) => ({ ...p, is_veg: e.target.value === 'veg' }))}
                className="w-full px-3 py-2.5 bg-background border border-input rounded-xl text-sm focus:outline-none">
                <option value="veg">🟢 Veg</option>
                <option value="nonveg">🔴 Non-Veg</option>
              </select>
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={editing.available} onChange={e => setEditing((p: any) => ({ ...p, available: e.target.checked }))}
              className="w-4 h-4 accent-primary" />
            <span className="text-sm font-semibold">Available (visible to customers)</span>
          </label>

          <div className="flex gap-2 pt-2">
            <button onClick={save} disabled={saving}
              className="flex-1 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 disabled:opacity-60 flex items-center justify-center gap-2 text-sm">
              {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Saving…</> : <><Save className="w-4 h-4" />{isNew ? 'Add Dish' : 'Save Changes'}</>}
            </button>
            <button onClick={() => setEditing(null)} className="px-4 py-2.5 border border-input rounded-xl text-sm font-semibold hover:bg-muted">
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <button onClick={openNew}
        className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 text-sm">
        <Plus className="w-4 h-4" /> Add New Dish
      </button>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[1,2,3,4].map(i => <div key={i} className="h-52 bg-muted animate-pulse rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {items.map(item => (
            <div key={item.id} className={`bg-card border rounded-2xl overflow-hidden ${item.available ? 'border-border' : 'border-red-200 dark:border-red-800 opacity-70'}`}>
              <div className="relative">
                <img src={item.image_url} alt={item.name} className="w-full h-36 object-cover"
                  onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&q=60'; }} />
                {!item.available && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">Out of Stock</span>
                  </div>
                )}
              </div>
              <div className="p-3">
                <div className="flex items-start justify-between mb-1 gap-2">
                  <div>
                    <h3 className="font-bold text-sm">{item.name}</h3>
                    <p className="text-xs text-muted-foreground capitalize">{item.is_veg ? '🟢' : '🔴'} {item.category}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-primary font-black">₹{item.price}</p>
                    {parseFloat(item.discount) > 0 && <p className="text-xs text-green-600">-₹{item.discount}</p>}
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => toggle(item.id, item.available)}
                    className={`flex-1 flex items-center justify-center gap-1 text-xs font-semibold py-1.5 rounded-xl transition-all ${item.available ? 'bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-700' : 'bg-red-100 text-red-700 hover:bg-green-100 hover:text-green-700'}`}>
                    {item.available ? <ToggleRight className="w-3.5 h-3.5" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                    {item.available ? 'Available' : 'Unavailable'}
                  </button>
                  <button onClick={() => openEdit(item)} className="p-1.5 border border-border rounded-xl hover:bg-muted transition-colors">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => del(item.id)} className="p-1.5 border border-red-200 text-red-500 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// COUPONS TAB
// ═══════════════════════════════════════════════════════════════════════════════
const EMPTY_COUPON = { code: '', discount_type: 'percentage', discount_value: '', min_order: '0', max_uses: '', expires_at: '' };

function CouponsTab() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ ...EMPTY_COUPON });
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    try { setCoupons(await api.getCoupons()); } finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  async function addCoupon(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!form.code || !form.discount_value) { setError('Code and discount value are required'); return; }
    setSaving(true);
    try {
      await api.addCoupon({
        ...form,
        discount_value: parseFloat(form.discount_value),
        min_order: parseFloat(form.min_order || '0'),
        max_uses: form.max_uses ? parseInt(form.max_uses) : null,
        expires_at: form.expires_at || null,
      });
      setForm({ ...EMPTY_COUPON });
      setAdding(false);
      await load();
    } catch (err: any) { setError(err.message); }
    finally { setSaving(false); }
  }

  return (
    <div className="space-y-4">
      <button onClick={() => setAdding(!adding)}
        className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 text-sm">
        <Plus className="w-4 h-4" /> {adding ? 'Cancel' : 'Create Coupon'}
      </button>

      {adding && (
        <form onSubmit={addCoupon} className="bg-card border border-border rounded-2xl p-5 space-y-3">
          <h3 className="font-bold">New Coupon</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1 col-span-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Coupon Code *</label>
              <input value={form.code} onChange={e => setForm(p => ({ ...p, code: e.target.value.toUpperCase() }))} placeholder="e.g. FIRST50" required
                className="w-full px-3 py-2.5 bg-background border border-input rounded-xl text-sm font-mono uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-primary/40" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Type</label>
              <select value={form.discount_type} onChange={e => setForm(p => ({ ...p, discount_type: e.target.value }))}
                className="w-full px-3 py-2.5 bg-background border border-input rounded-xl text-sm focus:outline-none">
                <option value="percentage">% Percentage</option>
                <option value="fixed">₹ Fixed</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Value *</label>
              <input type="number" value={form.discount_value} onChange={e => setForm(p => ({ ...p, discount_value: e.target.value }))} placeholder={form.discount_type === 'percentage' ? '10' : '20'} required
                className="w-full px-3 py-2.5 bg-background border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Min Order (₹)</label>
              <input type="number" value={form.min_order} onChange={e => setForm(p => ({ ...p, min_order: e.target.value }))} placeholder="0"
                className="w-full px-3 py-2.5 bg-background border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Max Uses</label>
              <input type="number" value={form.max_uses} onChange={e => setForm(p => ({ ...p, max_uses: e.target.value }))} placeholder="Unlimited"
                className="w-full px-3 py-2.5 bg-background border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
            </div>
            <div className="space-y-1 col-span-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Expires On</label>
              <input type="date" value={form.expires_at} onChange={e => setForm(p => ({ ...p, expires_at: e.target.value }))}
                className="w-full px-3 py-2.5 bg-background border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
            </div>
          </div>
          {error && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" />{error}</p>}
          <button type="submit" disabled={saving}
            className="w-full py-2.5 bg-primary text-white font-bold rounded-xl disabled:opacity-60 flex items-center justify-center gap-2 text-sm">
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Creating…</> : 'Create Coupon'}
          </button>
        </form>
      )}

      {loading ? (
        <div className="space-y-2">{[1,2].map(i => <div key={i} className="h-16 bg-muted animate-pulse rounded-2xl" />)}</div>
      ) : coupons.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No coupons yet</div>
      ) : (
        <div className="space-y-2">
          {coupons.map(c => (
            <div key={c.id} className="bg-card border border-border rounded-2xl p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 px-3 py-1.5 rounded-xl">
                  <span className="font-mono font-black text-primary text-sm">{c.code}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold">
                    {c.discount_type === 'percentage' ? `${c.discount_value}% off` : `₹${c.discount_value} off`}
                    {parseFloat(c.min_order) > 0 && ` (min ₹${c.min_order})`}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Used: {c.used_count}{c.max_uses ? `/${c.max_uses}` : ''} times
                    {c.expires_at && ` · Expires ${new Date(c.expires_at).toLocaleDateString('en-IN')}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => api.toggleCoupon(c.id, c.active).then(load)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${c.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {c.active ? 'Active' : 'Inactive'}
                </button>
                <button onClick={() => api.deleteCoupon(c.id).then(load)}
                  className="p-1.5 border border-red-200 text-red-500 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SETTINGS TAB
// ═══════════════════════════════════════════════════════════════════════════════
function SettingsTab() {
  const [config, setConfig] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.getConfig().then(setConfig).finally(() => setLoading(false));
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateConfig(config);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally { setSaving(false); }
  }

  const sections = [
    {
      title: 'Restaurant Information',
      fields: [
        { key: 'restaurant_name', label: 'Restaurant Name' },
        { key: 'restaurant_phone', label: 'Phone Number' },
        { key: 'restaurant_address', label: 'Address', multiline: true },
        { key: 'restaurant_hours', label: 'Opening Hours' },
        { key: 'restaurant_about', label: 'About / Tagline', multiline: true },
      ],
    },
    {
      title: 'Homepage Content',
      fields: [
        { key: 'hero_title', label: 'Hero Title' },
        { key: 'hero_subtitle', label: 'Hero Subtitle' },
        { key: 'hero_tagline', label: 'Hero Tagline', multiline: true },
      ],
    },
    {
      title: 'Social & Contact',
      fields: [
        { key: 'whatsapp_number', label: 'WhatsApp Number (with country code, no +)' },
        { key: 'instagram_url', label: 'Instagram URL' },
        { key: 'upi_id', label: 'UPI ID (for payments)' },
      ],
    },
  ];

  if (loading) return <div className="text-center py-12 text-muted-foreground">Loading settings…</div>;

  return (
    <form onSubmit={save} className="space-y-6">
      {sections.map(section => (
        <div key={section.title} className="bg-card border border-border rounded-2xl p-5 space-y-4">
          <h3 className="font-bold text-sm uppercase tracking-wide text-muted-foreground">{section.title}</h3>
          {section.fields.map(f => (
            <div key={f.key} className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">{f.label}</label>
              {f.multiline ? (
                <textarea value={config[f.key] || ''} onChange={e => setConfig(p => ({ ...p, [f.key]: e.target.value }))}
                  rows={2} className="w-full px-3 py-2.5 bg-background border border-input rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/40" />
              ) : (
                <input value={config[f.key] || ''} onChange={e => setConfig(p => ({ ...p, [f.key]: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-background border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
              )}
            </div>
          ))}
        </div>
      ))}
      <div className="flex items-center gap-3">
        <button type="submit" disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 disabled:opacity-60 text-sm">
          {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Saving…</> : <><Save className="w-4 h-4" />Save Settings</>}
        </button>
        {saved && <span className="text-green-600 text-sm font-semibold flex items-center gap-1"><CheckCircle className="w-4 h-4" />Saved!</span>}
      </div>
    </form>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN ADMIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════
export function AdminPage() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState<Tab>('dashboard');
  const [stats, setStats] = useState<any>(null);
  const [report, setReport] = useState<any[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function loadDashboard() {
    try {
      const [s, r] = await Promise.all([api.getStats(), api.getSalesReport(7)]);
      setStats(s); setReport(r);
    } catch {}
  }

  useEffect(() => { if (tab === 'dashboard') loadDashboard(); }, [tab]);

  // Auth check
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <ShieldCheck className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-black mb-2 font-['Poppins']">Admin Panel</h1>
          <p className="text-muted-foreground mb-4">Please sign in with your admin account on the main site.</p>
          <a href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl">
            <ArrowLeft className="w-4 h-4" /> Go to Main Site
          </a>
        </div>
      </div>
    );
  }
  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-5xl mb-4">🔒</div>
          <p className="text-xl font-bold mb-2">Access Denied</p>
          <p className="text-muted-foreground mb-4">This area is restricted to admin accounts only.</p>
          <a href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl">
            <ArrowLeft className="w-4 h-4" /> Back to Site
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static top-0 left-0 h-full w-60 bg-card border-r border-border z-40 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-5 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🍽️</span>
            <div>
              <h1 className="font-black text-base font-['Poppins'] leading-tight">Tiffin House</h1>
              <p className="text-xs text-muted-foreground">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {TABS.map(t => (
            <button key={t.id} onClick={() => { setTab(t.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-left ${tab === t.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
              <t.icon className="w-4 h-4 shrink-0" />
              {t.label}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-border space-y-1">
          <a href="/" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-muted-foreground hover:bg-muted transition-all">
            <ArrowLeft className="w-4 h-4" /> Main Site
          </a>
          <button onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-card/90 backdrop-blur-md border-b border-border px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-full hover:bg-muted">
              <Package className="w-5 h-5" />
            </button>
            <h2 className="font-black text-lg font-['Poppins'] capitalize">{tab}</h2>
          </div>
          <div className="flex items-center gap-2">
            {tab === 'dashboard' && (
              <button onClick={loadDashboard} className="p-2 rounded-full hover:bg-muted transition-colors" title="Refresh">
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.phone}</p>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
              {tab === 'dashboard' && <DashboardTab stats={stats} report={report} />}
              {tab === 'orders' && <OrdersTab />}
              {tab === 'customers' && <CustomersTab />}
              {tab === 'menu' && <MenuTab />}
              {tab === 'coupons' && <CouponsTab />}
              {tab === 'settings' && <SettingsTab />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
