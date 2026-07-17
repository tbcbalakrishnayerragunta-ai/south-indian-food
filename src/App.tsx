import React, { useState } from 'react';
import { useRoute, useLocation } from 'wouter';
import { LoadingScreen } from './components/LoadingScreen';
import { ScrollProgress } from './components/ScrollProgress';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Menu } from './components/Menu';
import { WhyUs } from './components/WhyUs';
import { HowItWorks } from './components/HowItWorks';
import { Testimonials } from './components/Testimonials';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { FloatingButtons } from './components/FloatingButtons';
import { CustomCursor } from './components/CustomCursor';
import { Cart } from './components/Cart';
import { AuthModal } from './components/AuthModal';
import { OrderTracker } from './components/OrderTracker';
import { PaymentModal } from './components/PaymentModal';
import { AdminPage } from './pages/AdminPage';
import { OrderHistoryPage } from './pages/OrderHistoryPage';
import { ProfilePage } from './pages/ProfilePage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { useDarkMode } from './hooks/useDarkMode';
import { Toaster } from '@/components/ui/toaster';

// ── Admin App ─────────────────────────────────────────────────────────────────
function AdminApp() {
  return (
    <AuthProvider>
      <CartProvider>
        <AdminPage />
        <Toaster />
      </CartProvider>
    </AuthProvider>
  );
}

// ── Customer App ──────────────────────────────────────────────────────────────
function CustomerAppInner() {
  const { isDark, toggle } = useDarkMode();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [authOpen, setAuthOpen] = useState(false);
  const [page, setPage] = useState<'home' | 'orders' | 'profile'>('home');
  const [trackedOrderId, setTrackedOrderId] = useState<number | null>(null);
  const [paymentOrder, setPaymentOrder] = useState<{ id: number; total: number } | null>(null);
  const [, setLocation] = useLocation();

  function handleOrderPlaced(orderId: number) {
    setTrackedOrderId(orderId);
  }

  function handlePaymentRequired(orderId: number, total: number) {
    setPaymentOrder({ id: orderId, total });
  }

  function handlePaymentSuccess() {
    setPaymentOrder(null);
  }

  return (
    <>
      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      {!loading && (
        <div className="relative min-h-screen bg-background text-foreground font-['Inter'] selection:bg-primary/30">
          <ScrollProgress />
          <CustomCursor />
          <Navbar
            isDark={isDark}
            toggleDark={toggle}
            onAuthClick={() => setAuthOpen(true)}
            onOrdersClick={() => setPage('orders')}
            onProfileClick={() => setPage('profile')}
            onAdminClick={() => setLocation('/admin')}
          />

          {page === 'orders' ? (
            <div className="pt-16">
              <OrderHistoryPage onTrackOrder={setTrackedOrderId} onBack={() => setPage('home')} />
            </div>
          ) : page === 'profile' ? (
            <div className="pt-16">
              <ProfilePage onBack={() => setPage('home')} />
            </div>
          ) : (
            <main className="pt-16">
              <Hero />
              <Menu />
              <WhyUs />
              <HowItWorks />
              <Testimonials />
              <FAQ />
            </main>
          )}

          <Footer />
          <FloatingButtons />

          <Cart onOrderPlaced={handleOrderPlaced} onAuthRequired={() => setAuthOpen(true)} />
          <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />

          {trackedOrderId && (
            <OrderTracker
              orderId={trackedOrderId}
              onClose={() => setTrackedOrderId(null)}
              onPaymentRequired={handlePaymentRequired}
            />
          )}

          {paymentOrder && (
            <PaymentModal
              orderId={paymentOrder.id}
              total={paymentOrder.total}
              onSuccess={handlePaymentSuccess}
              onClose={() => setPaymentOrder(null)}
            />
          )}
        </div>
      )}
      <Toaster />
    </>
  );
}

function CustomerApp() {
  return (
    <AuthProvider>
      <CartProvider>
        <CustomerAppInner />
      </CartProvider>
    </AuthProvider>
  );
}

// ── Root Router ───────────────────────────────────────────────────────────────
export default function App() {
  const [isAdmin] = useRoute('/admin');
  if (isAdmin) return <AdminApp />;
  return <CustomerApp />;
}
