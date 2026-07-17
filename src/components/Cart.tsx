import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag, MapPin, ChevronRight, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';

interface Props {
  onOrderPlaced: (orderId: number) => void;
  onAuthRequired: () => void;
}

export function Cart({ onOrderPlaced, onAuthRequired }: Props) {
  const { items, removeItem, updateQty, clearCart, total, count, isOpen, setIsOpen } = useCart();
  const { user } = useAuth();
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'cart' | 'details'>('cart');

  async function placeOrder() {
    if (!user) { onAuthRequired(); return; }
    setLoading(true); setError('');
    try {
      const order = await api.createOrder({
        items: items.map(i => ({ id: i.id, quantity: i.quantity })),
        delivery_address: address || undefined,
        notes: notes || undefined,
      });
      clearCart();
      setIsOpen(false);
      setStep('cart');
      setAddress('');
      onOrderPlaced(order.id);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Cart toggle button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-primary text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 font-bold text-sm hover:bg-primary/90 transition-all hover:scale-105 active:scale-95"
        style={{ display: count > 0 ? 'flex' : 'none' }}
      >
        <ShoppingBag className="w-5 h-5" />
        <span>{count} item{count !== 1 ? 's' : ''}</span>
        <span className="w-px h-4 bg-white/40" />
        <span>₹{total}</span>
        <ChevronRight className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div className="fixed inset-0 z-[90] flex"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex-1 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
            <motion.div
              className="w-full max-w-sm bg-card border-l border-border flex flex-col h-full overflow-hidden shadow-2xl"
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              {/* Header */}
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-primary" />
                  <h2 className="font-black text-lg font-['Poppins']">
                    {step === 'cart' ? 'Your Cart' : 'Order Details'}
                  </h2>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 rounded-full hover:bg-muted">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {step === 'cart' ? (
                <>
                  {/* Items */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {items.length === 0 ? (
                      <div className="text-center py-16 text-muted-foreground">
                        <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p>Your cart is empty</p>
                        <p className="text-sm mt-1">Add items from the menu</p>
                      </div>
                    ) : items.map(item => (
                      <div key={item.id} className="flex items-center gap-3 bg-background rounded-2xl p-3 border border-border">
                        <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-foreground truncate">{item.name}</p>
                          <p className="text-primary font-bold text-sm">₹{item.price * item.quantity}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateQty(item.id, item.quantity - 1)}
                            className="w-7 h-7 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-5 text-center text-sm font-bold">{item.quantity}</span>
                          <button onClick={() => updateQty(item.id, item.quantity + 1)}
                            className="w-7 h-7 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  {items.length > 0 && (
                    <div className="p-4 border-t border-border space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-bold">₹{total}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Delivery</span>
                        <span className="text-green-600 font-semibold">FREE</span>
                      </div>
                      <div className="flex justify-between font-black text-lg border-t border-border pt-3">
                        <span>Total</span>
                        <span className="text-primary">₹{total}</span>
                      </div>
                      <button onClick={() => setStep('details')}
                        className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
                        Proceed to Checkout <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 space-y-2">
                      {items.map(i => (
                        <div key={i.id} className="flex justify-between text-sm">
                          <span>{i.name} × {i.quantity}</span>
                          <span className="font-semibold">₹{i.price * i.quantity}</span>
                        </div>
                      ))}
                      <div className="border-t border-primary/20 pt-2 flex justify-between font-black">
                        <span>Total</span><span className="text-primary">₹{total}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" /> Delivery Address (optional)
                      </label>
                      <textarea value={address} onChange={e => setAddress(e.target.value)} rows={2}
                        placeholder="e.g. Shop 4, Gandhi Nagar, Hyderabad"
                        className="w-full px-4 py-3 bg-background border border-input rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Special Instructions</label>
                      <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2}
                        placeholder="e.g. Extra chutney, less spicy…"
                        className="w-full px-4 py-3 bg-background border border-input rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50" />
                    </div>

                    {!user && (
                      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3 text-sm text-amber-800 dark:text-amber-200">
                        You need to sign in to place an order.
                      </div>
                    )}
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                  </div>

                  <div className="p-4 border-t border-border space-y-3">
                    <button onClick={() => setStep('cart')}
                      className="w-full py-3 border border-input rounded-xl text-sm font-semibold hover:bg-muted transition-colors">
                      ← Back to Cart
                    </button>
                    <button onClick={placeOrder} disabled={loading}
                      className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                      {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Placing…</> : `Pay ₹${total}`}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
