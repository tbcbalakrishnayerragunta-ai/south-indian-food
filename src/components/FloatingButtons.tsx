import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

export const FloatingButtons: React.FC = () => {
  const [showTopButton, setShowTopButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowTopButton(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed bottom-6 z-50 pointer-events-none inset-x-0 mx-auto max-w-7xl px-4 flex justify-between items-end h-0">
      {/* Bottom Center: Scroll Top */}
      <div className="pointer-events-auto absolute left-1/2 -translate-x-1/2 bottom-0 hidden md:block">
        <AnimatePresence>
          {showTopButton && (
            <motion.button
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="w-12 h-12 bg-card border border-border shadow-md rounded-full flex items-center justify-center text-foreground hover:bg-muted transition-colors"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Right: WhatsApp */}
      <div className="pointer-events-auto ml-auto">
        <a
          href="https://wa.me/919876543210"
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform"
          aria-label="Contact on WhatsApp"
        >
          <FaWhatsapp className="w-7 h-7" />
        </a>
      </div>
    </div>
  );
};
