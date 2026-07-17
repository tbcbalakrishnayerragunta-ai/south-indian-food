import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MENU_ITEMS } from '../data/menuData';

interface OrderFormProps {
  selectedDish: string;
  setSelectedDish: (id: string) => void;
  onProceed: (details: { name: string; mobile: string; dish: string; quantity: number; total: number }) => void;
  showPayment: boolean;
}

export const OrderForm: React.FC<OrderFormProps> = ({ selectedDish, setSelectedDish, onProceed, showPayment }) => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [quantity, setQuantity] = useState(1);

  const activeDish = MENU_ITEMS.find(item => item.id === (selectedDish || MENU_ITEMS[0].id)) || MENU_ITEMS[0];
  const total = activeDish.price * quantity;

  // Sync selected dish if none selected initially
  useEffect(() => {
    if (!selectedDish) {
      setSelectedDish(MENU_ITEMS[0].id);
    }
  }, [selectedDish, setSelectedDish]);

  const isValid = name.trim().length > 2 && mobile.trim().length === 10 && /^\d+$/.test(mobile) && selectedDish;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      onProceed({ name, mobile, dish: activeDish.name, quantity, total });
    }
  };

  return (
    <section id="order" className="py-24 bg-background relative z-10">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4 font-['Poppins']">
            Place Your Pre-Order
          </h2>
          <p className="text-lg text-muted-foreground">Fill in details and pick up in 15 mins.</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card/70 backdrop-blur-md border border-primary/20 rounded-3xl shadow-2xl p-6 md:p-10 relative overflow-hidden"
        >
          {/* Decorative background accent */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2" />
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Customer Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Mobile Number</label>
                <input
                  type="tel"
                  required
                  pattern="[0-9]{10}"
                  maxLength={10}
                  placeholder="10-digit number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-3 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Select Dish</label>
              <select
                value={selectedDish}
                onChange={(e) => setSelectedDish(e.target.value)}
                className="w-full px-4 py-3 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground appearance-none"
                style={{ backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23FF6B2B%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem top 50%', backgroundSize: '0.65rem auto' }}
              >
                {MENU_ITEMS.map(item => (
                  <option key={item.id} value={item.id}>{item.name} — ₹{item.price}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Quantity</label>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 rounded-xl bg-background border border-input flex items-center justify-center text-xl font-bold text-foreground hover:bg-muted active:scale-95 transition-all"
                >
                  −
                </button>
                <div className="w-16 h-12 flex items-center justify-center text-xl font-bold text-foreground bg-background border border-input rounded-xl">
                  {quantity}
                </div>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(20, quantity + 1))}
                  className="w-12 h-12 rounded-xl bg-background border border-input flex items-center justify-center text-xl font-bold text-foreground hover:bg-muted active:scale-95 transition-all"
                >
                  +
                </button>
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Price per plate: ₹{activeDish.price}</p>
                <p className="text-sm text-muted-foreground">Quantity: {quantity}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-foreground mb-1">Total Amount</p>
                <p className="text-4xl font-black text-primary font-['Poppins']">₹{total}</p>
              </div>
            </div>

            <AnimatePresence>
              {!showPayment && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                  <button
                    type="submit"
                    disabled={!isValid}
                    className="w-full mt-6 py-4 bg-primary text-primary-foreground text-lg font-bold rounded-xl shadow-[0_4px_20px_rgb(255,107,43,0.3)] hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none"
                    data-cursor="hover"
                  >
                    Proceed to Payment
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>
      </div>
    </section>
  );
};
