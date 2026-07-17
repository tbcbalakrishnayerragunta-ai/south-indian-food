import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { Clock, Package, Bike, ChefHat, CheckCircle, XCircle, ShoppingBag, ArrowLeft, RefreshCw } from 'lucide-react';

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  placed:    { label: 'Placed',    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',     icon: ShoppingBag },
  confirmed: { label: 'Confirmed', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300', icon: CheckCircle },
  preparing: { label: 'Preparing', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300', icon: ChefHat },
  ready:     { label: 'Ready',     color: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',  icon: Package },
  delivered: { label: 'Delivered', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300', icon: Bike },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',         icon: XCircle },
};

const PAYMENT_BADGE: Record<string, { text: string; color: string }> = {
  pending:       { text: '⏳ Pending',        color: 'text-amber-600' },
  utr_submitted: { text: '🔍 UTR Submitted',  color: 'text-blue-600' },
  paid:          { text: '✓ Paid',            color: 'text-green-600' },
  failed:        { text: '✗ Failed',          color: 'text-red-600' },
};

export function OrderHistoryPage({ onTrackOrder, onBack }: { onTrackOrder: (id: number) => void; onBack: () => void }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  function load() {
    if (!user) { setLoading(false); return; }
    setLoading(true);
    api.getMyOrders().then(setOrders).catch(() => {}).finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, [user]);

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🔒</div>
          <p className="text-xl font-bold mb-2">Sign in to view orders</p>
          <p className="text-muted-foreground">Your order history will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 max-w-2xl mx-auto min-h-[70vh]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-muted transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-black font-['Poppins']">My Orders</h2>
        </div>
        <button onClick={load} className="p-2 rounded-full hover:bg-muted transition-colors" title="Refresh">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-24 bg-muted animate-pulse rounded-2xl" />)}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🍽️</div>
          <p className="text-xl font-bold mb-2">No orders yet</p>
          <p className="text-muted-foreground mb-6">Your orders will appear here after checkout</p>
          <button onClick={onBack}
            className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all">
            Browse Menu →
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order, i) => {
            const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.placed;
            const Icon = cfg.icon;
            const items = order.items?.filter(Boolean) || [];
            const isActive = !['delivered', 'cancelled'].includes(order.status);
            const payBadge = PAYMENT_BADGE[order.payment_status] || PAYMENT_BADGE.pending;

            return (
              <motion.div key={order.id}
                className="bg-card border border-border rounded-2xl p-4 sm:p-5 hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-black text-base">Order #{order.id}</span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${cfg.color}`}>
                        <Icon className="w-3 h-3" /> {cfg.label}
                      </span>
                    </div>
                    {items.length > 0 && (
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {items.slice(0,3).map((i: any) => `${i.item_name}×${i.quantity}`).join(', ')}
                        {items.length > 3 && ` +${items.length-3} more`}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(order.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                    </p>
                    {order.utr_number && (
                      <p className="text-xs font-mono mt-1 text-blue-600">UTR: {order.utr_number}</p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xl font-black text-primary">₹{parseFloat(order.total_amount).toFixed(0)}</p>
                    <span className={`text-xs font-semibold ${payBadge.color}`}>{payBadge.text}</span>
                  </div>
                </div>
                {isActive && (
                  <button onClick={() => onTrackOrder(order.id)}
                    className="mt-3 w-full py-2 border border-primary/30 text-primary text-sm font-semibold rounded-xl hover:bg-primary/5 transition-colors">
                    Track Order →
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
