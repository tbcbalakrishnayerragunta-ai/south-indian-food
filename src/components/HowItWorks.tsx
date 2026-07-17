import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, FileText, CheckCircle } from 'lucide-react';

const steps = [
  { icon: ShoppingCart, title: 'Choose Food', desc: 'Select your dish from our menu' },
  { icon: FileText, title: 'Fill Details', desc: 'Enter your name and number' },
  { icon: CheckCircle, title: 'Pay & Pickup', desc: 'Scan QR and collect your order' },
];

export const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-24 bg-background relative z-10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4 font-['Poppins']">
            Order in 3 Simple Steps
          </h2>
          <p className="text-lg text-muted-foreground">Fast, easy, and completely hassle-free.</p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Dashed line connecting steps on desktop */}
          <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-[2px] border-t-2 border-dashed border-primary/30 -z-10" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="relative flex flex-col items-center text-center"
                >
                  <div className="w-24 h-24 bg-card rounded-full border-4 border-background shadow-xl flex items-center justify-center mb-6 relative">
                    <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse" />
                    <Icon className="w-10 h-10 text-primary relative z-10" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground font-bold rounded-full flex items-center justify-center border-2 border-background shadow-sm">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3 font-['Poppins']">{step.title}</h3>
                  <p className="text-muted-foreground text-sm max-w-[200px] leading-relaxed">
                    {step.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
