import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Star, Search, Leaf, Zap } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { api } from '../lib/api';

interface MenuItemType {
  id: string;
  name: string;
  price: number;
  description: string;
  image_url: string;
  badge: string | null;
  available: boolean;
}

export function Menu() {
  const { addItem, items: cartItems } = useCart();
  const [menuItems, setMenuItems] = useState<MenuItemType[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMenu()
      .then(setMenuItems)
      .catch(() => {/* use static fallback */})
      .finally(() => setLoading(false));
  }, []);

  const filtered = menuItems.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.description.toLowerCase().includes(search.toLowerCase())
  );

  function getCartQty(id: string) {
    return cartItems.find(i => i.id === id)?.quantity || 0;
  }

  return (
    <section id="menu" className="py-24 bg-background relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-20 left-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <motion.div className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary font-semibold text-sm rounded-full mb-4">
            🍛 Today's Menu
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-foreground font-['Poppins']">
            Fresh South Indian Breakfast
          </h2>
          <p className="text-lg text-muted-foreground mt-3 max-w-xl mx-auto">
            Made fresh every morning. Pre-order and pick up hot in 15 minutes.
          </p>
        </motion.div>

        {/* Search */}
        <div className="relative max-w-md mx-auto mb-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search dishes…"
            className="w-full pl-11 pr-4 py-3 bg-card border border-border rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
          />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3].map(i => <div key={i} className="h-80 bg-muted animate-pulse rounded-3xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-2xl mb-2">😕</p>
            <p>No dishes match "{search}"</p>
          </div>
        ) : (
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}>
            {filtered.map(item => {
              const qty = getCartQty(item.id);
              return (
                <motion.div key={item.id}
                  variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
                  className="group bg-card border border-border rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  {/* Image */}
                  <div className="relative overflow-hidden h-48">
                    <img src={item.image_url} alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    {item.badge && (
                      <span className="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                        {item.badge}
                      </span>
                    )}
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 dark:bg-black/60 text-xs font-bold px-2 py-1 rounded-full">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      <span>4.8</span>
                    </div>
                    {/* Veg indicator */}
                    <div className="absolute bottom-3 left-3 w-5 h-5 border-2 border-green-500 rounded-sm flex items-center justify-center bg-white/80">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-black text-lg font-['Poppins'] text-foreground leading-tight">{item.name}</h3>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Leaf className="w-3 h-3 text-green-500" />
                        <Zap className="w-3 h-3 text-yellow-500" />
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{item.description}</p>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-black text-primary">₹{item.price}</p>
                        <p className="text-xs text-muted-foreground">per plate</p>
                      </div>

                      <AnimatePresence mode="wait">
                        {qty === 0 ? (
                          <motion.button key="add"
                            onClick={() => addItem({ id: item.id, name: item.name, price: item.price, image: item.image_url })}
                            className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-primary/90 active:scale-95 transition-all shadow-[0_4px_12px_rgb(255,107,43,0.3)]"
                            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
                            <Plus className="w-4 h-4" /> Add
                          </motion.button>
                        ) : (
                          <motion.div key="qty" className="flex items-center gap-2"
                            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
                            <span className="bg-primary/10 text-primary font-bold px-3 py-1.5 rounded-xl text-sm">
                              {qty} in cart
                            </span>
                            <button
                              onClick={() => addItem({ id: item.id, name: item.name, price: item.price, image: item.image_url })}
                              className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-all active:scale-90">
                              <Plus className="w-4 h-4" />
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}
