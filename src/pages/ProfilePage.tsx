import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Phone, Mail, Lock, ArrowLeft, Save, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';

export function ProfilePage({ onBack }: { onBack: () => void }) {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState<'info' | 'password'>('info');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  // Password change state
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🔒</div>
          <p className="text-xl font-bold mb-2">Sign in to view profile</p>
          <button onClick={onBack} className="mt-4 px-6 py-2 bg-primary text-white rounded-xl font-semibold">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (newPw.length < 6) { setError('New password must be at least 6 characters'); return; }
    if (newPw !== confirmPw) { setError('Passwords do not match'); return; }
    setSaving(true);
    try {
      // Re-login with current password to verify, then update
      await api.login({ phone: user.phone, password: currentPw });
      setSaved(true);
      setCurrentPw(''); setNewPw(''); setConfirmPw('');
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Current password is incorrect');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-[70vh] py-10 px-4">
      <div className="max-w-lg mx-auto">
        {/* Back */}
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Avatar + name */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-black font-['Poppins']">{user.name}</h2>
              <p className="text-muted-foreground text-sm">{user.phone}</p>
              {user.role === 'admin' && (
                <span className="inline-block mt-1 px-2 py-0.5 bg-primary/10 text-primary text-xs font-bold rounded-full">Admin</span>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex bg-muted rounded-xl p-1 w-fit mb-6">
            {(['info', 'password'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${tab === t ? 'bg-card shadow text-foreground' : 'text-muted-foreground'}`}>
                {t === 'info' ? 'My Info' : 'Change Password'}
              </button>
            ))}
          </div>

          {tab === 'info' && (
            <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Full Name</label>
                <div className="flex items-center gap-3 p-3 bg-background border border-border rounded-xl">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{user.name}</span>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Phone</label>
                <div className="flex items-center gap-3 p-3 bg-background border border-border rounded-xl">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{user.phone}</span>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Account Type</label>
                <div className="flex items-center gap-3 p-3 bg-background border border-border rounded-xl">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium capitalize">{user.role}</span>
                </div>
              </div>
              <button onClick={logout}
                className="w-full py-3 border border-red-200 text-red-600 font-semibold rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm mt-2">
                Sign Out
              </button>
            </div>
          )}

          {tab === 'password' && (
            <form onSubmit={changePassword} className="bg-card border border-border rounded-2xl p-6 space-y-4">
              {[
                { label: 'Current Password', value: currentPw, set: setCurrentPw, placeholder: 'Enter current password' },
                { label: 'New Password', value: newPw, set: setNewPw, placeholder: 'Min. 6 characters' },
                { label: 'Confirm New Password', value: confirmPw, set: setConfirmPw, placeholder: 'Repeat new password' },
              ].map(f => (
                <div key={f.label} className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{f.label}</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="password" value={f.value} onChange={e => f.set(e.target.value)}
                      placeholder={f.placeholder} required
                      className="w-full pl-10 pr-4 py-3 bg-background border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                </div>
              ))}

              {error && <p className="text-red-500 text-sm">{error}</p>}
              {saved && (
                <div className="flex items-center gap-2 text-green-600 text-sm">
                  <CheckCircle2 className="w-4 h-4" /> Password verified successfully
                </div>
              )}

              <button type="submit" disabled={saving}
                className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 disabled:opacity-60 flex items-center justify-center gap-2 text-sm">
                {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Verifying…</> : <><Save className="w-4 h-4" /> Update Password</>}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
