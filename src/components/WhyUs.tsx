import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Shield, Zap, CreditCard, IndianRupee } from 'lucide-react';

const features = [
  { icon: Leaf, title: 'Fresh Everyday', desc: 'Made fresh each morning, zero compromises' },
  { icon: Shield, title: 'Hygienic Kitchen', desc: 'FSSAI certified, spotlessly clean' },
  { icon: Zap, title: 'Fast Pickup', desc: 'Ready in 15 minutes, no waiting' },
  { icon: CreditCard, title: 'Online Payment', desc: 'Secure UPI payments accepted' },
  { icon: IndianRupee, title: 'Affordable Price', desc: 'Premium taste, humble prices' },
];

export const WhyUs: React.FC = () => {
  return (
    <section id="why-us" className="py-24 bg-secondary/30 relative z-10 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4 font-['Poppins']">
            Why Tiffin House?
          </h2>
          <p className="text-lg text-muted-foreground">
            We believe in quality without compromise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-card/60 backdrop-blur-sm border border-card-border p-6 rounded-2xl flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-4">
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2 font-['Poppins']">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Counters (Simplified static for now, can use framer-motion useMotionValue for counting later if needed) */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto border-t border-border pt-12">
          {[
            { value: '500+', label: 'Happy Customers' },
            { value: '3', label: 'Years of Service' },
            { value: '100%', label: 'Fresh Ingredients' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.2 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-black text-primary mb-2 font-['Poppins']">{stat.value}</div>
              <div className="text-foreground font-semibold">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
