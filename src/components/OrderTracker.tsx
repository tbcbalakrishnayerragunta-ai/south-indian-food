import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Clock, ChefHat, Package, Bike } from 'lucide-react';
import { api } from '../lib/api';

const STEPS = [
  { key: 'placed',     label: 'Order Placed',   icon: CheckCircle, color: 'text-blue-500' },
  { key: 'confirmed',  label: 'Confirmed',       icon: CheckCircle, color: 'text-purple-500' },
  { key: 'preparing',  label: 'Preparing',       icon: ChefHat,     color: 'text-orange-500' },
  { key: 'ready',      label: 'Ready to Pick Up',icon: Package,     color: 'text-green-500' },
  { key: 'delivered',  label: 'Delivered',       icon: Bike,        color: 'text-green-600' },
];

function stepIndex(status: string) {
  return STEPS.findIndex(s => s.key === status);
}

interface Props { orderId: number; onClose: () => void; onPaymentRequired: (orderId: number, total: number) => void; }

export function OrderTracker({ orderId, onClose, onPaymentRequired }: Props) {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  async function fetchStatus() {
    try {
      const data = await api.getOrderStatus(orderId);
      setOrder(data);
      // If payment pending, trigger payment flow
      if (data.payment_status === 'pending') {
        onPaymentRequired(orderId, parseFloat(data.total_amount));
      }
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 10000); // poll every 10s
    return () => clearInterval(interval);
  }, [orderId]);

  const currentStep = order ? stepIndex(order.status) : -1;

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-[95] flex items-end sm:items-center justify-center p-4"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        <motion.div
          className="relative bg-card border border-border rounded-3xl shadow-2xl w-full max-w-md p-6"
          initial={{ y: 60, scale: 0.96 }} animate={{ y: 0, scale: 1 }}
        >
          <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted">
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-6">
            <div className="text-4xl mb-2">🍛</div>
            <h2 className="text-xl font-black font-['Poppins']">Order #{orderId}</h2>
            {order && (
              <p className="text-sm text-muted-foreground mt-1">
                Estimated: ~{order.estimated_minutes} mins •
                <span className="ml-1 font-semibold text-foreground">₹{parseFloat(order.total_amount).toFixed(0)}</span>
              </p>
            )}
          </div>

          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading order status…</div>
          ) : order?.status === 'cancelled' ? (
            <div className="text-center py-6">
              <div className="text-4xl mb-2">❌</div>
              <p className="text-red-500 font-semibold">Order Cancelled</p>
            </div>
          ) : (
            <div className="space-y-1">
              {STEPS.map((step, idx) => {
                const Icon = step.icon;
                const done = idx <= currentStep;
                const active = idx === currentStep;
                return (
                  <div key={step.key}>
                    <div className={`flex items-center gap-3 p-3 rounded-xl transition-all ${active ? 'bg-primary/10 border border-primary/20' : ''}`}>
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${done ? 'bg-primary/20' : 'bg-muted'}`}>
                        <Icon className={`w-5 h-5 ${done ? step.color : 'text-muted-foreground'}`} />
                      </div>
                      <span className={`text-sm font-medium ${done ? 'text-foreground' : 'text-muted-foreground'}`}>{step.label}</span>
                      {active && (
                        <motion.div
                          className="ml-auto w-2 h-2 rounded-full bg-primary"
                          animate={{ scale: [1, 1.4, 1] }} transition={{ repeat: Infinity, duration: 1.2 }}
                        />
                      )}
                      {done && idx < currentStep && (
                        <span className="ml-auto text-xs text-green-600 font-semibold">✓</span>
                      )}
                    </div>
                    {idx < STEPS.length - 1 && (
                      <div className={`ml-[22px] w-0.5 h-4 ${idx < currentStep ? 'bg-primary' : 'bg-border'}`} />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {order?.items && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Items</p>
              {order.items.filter(Boolean).map((item: any, i: number) => (
                <div key={i} className="flex justify-between text-sm py-1">
                  <span>{item.name} × {item.quantity}</span>
                  <span className="text-muted-foreground">₹{(item.price * item.quantity).toFixed(0)}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
