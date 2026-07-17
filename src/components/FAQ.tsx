import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  { q: "What time do you start serving?", a: "We start from 7:00 AM daily. Our kitchen closes at 11:00 AM." },
  { q: "Can I pre-order for tomorrow?", a: "Yes! Pre-orders are accepted until midnight for the next morning." },
  { q: "Is home delivery available?", a: "Currently, we operate on a pickup-only model to ensure the food is served piping hot. We are working on delivery options!" },
  { q: "What payment methods do you accept?", a: "We accept all UPI apps including Google Pay, PhonePe, Paytm, Amazon Pay, and BHIM." },
  { q: "Can I cancel my order?", a: "You can cancel your order by calling us at least 30 minutes before your scheduled pickup time." }
];

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        <h2 className="text-4xl font-black text-center text-foreground mb-12 font-['Poppins']">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className={`border rounded-2xl overflow-hidden transition-colors ${isOpen ? 'border-primary/30 bg-primary/5' : 'border-border bg-card'}`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="font-bold text-foreground font-['Poppins']">{faq.q}</span>
                  <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className={`w-5 h-5 ${isOpen ? 'text-primary' : 'text-muted-foreground'}`} />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-5 pt-0 text-muted-foreground leading-relaxed">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
