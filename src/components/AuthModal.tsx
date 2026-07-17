import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Props { isOpen: boolean; onClose: () => void; defaultTab?: 'login' | 'register'; }

export function AuthModal({ isOpen, onClose, defaultTab = 'login' }: Props) {
  const { login, register } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>(defaultTab);
  const [form, setForm] = useState({ name: '', phone: '', password: '', email: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      if (tab === 'login') {
        await login(form.phone, form.password);
      } else {
        await register(form.name, form.phone, form.password, form.email);
      }
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className="relative bg-card border border-border rounded-3xl shadow-2xl w-full max-w-md p-8"
            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
          >
            <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors">
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="text-3xl mb-2">🍽️</div>
              <h2 className="text-2xl font-black text-foreground font-['Poppins']">
                {tab === 'login' ? 'Welcome Back!' : 'Join Tiffin House'}
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                {tab === 'login' ? 'Sign in to track your orders' : 'Create an account to start ordering'}
              </p>
            </div>

            {/* Tabs */}
            <div className="flex bg-muted rounded-xl p-1 mb-6">
              {(['login', 'register'] as const).map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${tab === t ? 'bg-card shadow text-foreground' : 'text-muted-foreground'}`}>
                  {t === 'login' ? 'Login' : 'Register'}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {tab === 'register' && (
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="text" placeholder="Full Name" required value={form.name}
                    onChange={e => set('name', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-background border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
              )}
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="tel" placeholder="10-digit Mobile Number" required value={form.phone}
                  maxLength={10} onChange={e => set('phone', e.target.value.replace(/\D/g, ''))}
                  className="w-full pl-10 pr-4 py-3 bg-background border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type={showPw ? 'text' : 'password'} placeholder="Password" required value={form.password}
                  onChange={e => set('password', e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-background border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {error && <p className="text-red-500 text-sm text-center">{error}</p>}

              <button type="submit" disabled={loading}
                className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all disabled:opacity-60">
                {loading ? 'Please wait…' : tab === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            {tab === 'login' && (
              <p className="text-center text-xs text-muted-foreground mt-4">
                Admin? Use your admin phone & password.
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
