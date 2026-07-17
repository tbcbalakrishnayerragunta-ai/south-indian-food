import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, User, LogOut, ClipboardList, ShieldCheck, ShoppingBag, UserCircle, Menu as MenuIcon, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

interface NavbarProps {
  isDark: boolean;
  toggleDark: () => void;
  onAuthClick: () => void;
  onOrdersClick: () => void;
  onProfileClick: () => void;
  onAdminClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ isDark, toggleDark, onAuthClick, onOrdersClick, onProfileClick, onAdminClick }) => {
  const { user, logout } = useAuth();
  const { count, setIsOpen } = useCart();
  const [dropOpen, setDropOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { href: '#home',         label: 'Home' },
    { href: '#menu',         label: 'Menu' },
    { href: '#why-us',       label: 'Why Us' },
    { href: '#how-it-works', label: 'How It Works' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#home" className="font-black text-xl text-primary font-['Poppins'] hover:opacity-80 transition-opacity shrink-0">
            Tiffin House
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
            {links.map(l => (
              <a key={l.href} href={l.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                {l.label}
              </a>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1.5">
            {/* Cart */}
            <button onClick={() => setIsOpen(true)}
              className="relative p-2 rounded-full hover:bg-muted transition-colors" aria-label="Cart">
              <ShoppingBag className="w-5 h-5" />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs font-black rounded-full flex items-center justify-center"
                    initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    {count > 9 ? '9+' : count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Dark mode */}
            <button onClick={toggleDark} className="p-2 rounded-full hover:bg-muted transition-colors">
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Auth */}
            {user ? (
              <div className="relative">
                <button onClick={() => setDropOpen(!dropOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-muted transition-colors">
                  <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm font-semibold hidden md:block max-w-[80px] truncate">{user.name.split(' ')[0]}</span>
                </button>

                <AnimatePresence>
                  {dropOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setDropOpen(false)} />
                      <motion.div
                        className="absolute right-0 top-12 w-52 bg-card border border-border rounded-2xl shadow-xl py-2 z-50"
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}>
                        <div className="px-4 py-2 border-b border-border mb-1">
                          <p className="text-sm font-bold truncate">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.phone}</p>
                        </div>
                        <button onClick={() => { onProfileClick(); setDropOpen(false); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors">
                          <UserCircle className="w-4 h-4" /> My Profile
                        </button>
                        <button onClick={() => { onOrdersClick(); setDropOpen(false); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors">
                          <ClipboardList className="w-4 h-4" /> My Orders
                        </button>
                        {user.role === 'admin' && (
                          <button onClick={() => { onAdminClick(); setDropOpen(false); }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors text-primary font-semibold">
                            <ShieldCheck className="w-4 h-4" /> Admin Panel
                          </button>
                        )}
                        <div className="border-t border-border mt-1 pt-1">
                          <button onClick={() => { logout(); setDropOpen(false); }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted text-red-600 transition-colors">
                            <LogOut className="w-4 h-4" /> Sign Out
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button onClick={onAuthClick}
                className="px-4 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-xl hover:bg-primary/90 transition-all">
                Sign In
              </button>
            )}

            {/* Mobile menu toggle */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-full hover:bg-muted transition-colors ml-1">
              {mobileOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              className="md:hidden border-t border-border py-4 space-y-1"
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
              {links.map(l => (
                <a key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                  className="block px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-colors">
                  {l.label}
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};
