import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderDetails: { dish: string; quantity: number; total: number } | null;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose, orderDetails }) => {
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(onClose, 8000);
    return () => clearTimeout(timer);
  }, [isOpen, onClose]);

  if (!orderDetails) return null;

  // Generate confetti array
  const confetti = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    color: ['bg-primary', 'bg-accent', 'bg-secondary', 'bg-blue-500'][Math.floor(Math.random() * 4)],
    left: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 2}s`,
    animationDuration: `${2 + Math.random() * 3}s`,
    isCircle: Math.random() > 0.5,
  }));

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Confetti container */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {confetti.map((c) => (
              <div
                key={c.id}
                className={`absolute top-[-20px] w-3 h-3 ${c.color} ${c.isCircle ? 'rounded-full' : 'rounded-sm'} animate-confetti`}
                style={{
                  left: c.left,
                  animationDelay: c.animationDelay,
                  animationDuration: c.animationDuration,
                }}
              />
            ))}
          </div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-card rounded-3xl p-8 md:p-10 max-w-md w-full relative z-10 shadow-2xl border border-border text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ type: 'spring', damping: 12, delay: 0.2 }}
              className="w-24 h-24 bg-accent/20 text-accent rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Check className="w-12 h-12" strokeWidth={3} />
            </motion.div>

            <h2 className="text-3xl font-black text-foreground mb-3 font-['Poppins']">Order Confirmed!</h2>
            <p className="text-muted-foreground mb-8">
              Your order has been received successfully. We'll prepare it fresh and hot.
            </p>

            <div className="bg-muted rounded-2xl p-6 text-left mb-8">
              <p className="text-sm text-muted-foreground uppercase tracking-wider font-bold mb-4 border-b border-border pb-2">Order Summary</p>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium text-foreground">{orderDetails.dish} (x{orderDetails.quantity})</span>
                  <span className="font-medium text-foreground">₹{orderDetails.total}</span>
                </div>
                <div className="flex justify-between text-sm text-primary font-bold">
                  <span>Pickup Time</span>
                  <span>In 15 Mins</span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-4 bg-foreground text-background font-bold rounded-xl hover:bg-foreground/90 transition-colors"
            >
              Done
            </button>
          </motion.div>

          <style>{`
            @keyframes fall {
              0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
              100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
            }
            .animate-confetti {
              animation-name: fall;
              animation-timing-function: linear;
              animation-iteration-count: infinite;
            }
          `}</style>
        </div>
      )}
    </AnimatePresence>
  );
};
