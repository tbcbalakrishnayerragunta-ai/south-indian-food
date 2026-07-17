import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

export const Hero: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: 'easeOut' as const } },
  };

  return (
    <section id="home" className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden pt-20 pb-12">
      {/* Background Gradients & Blobs */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-secondary/30 via-background to-background -z-20" />
      
      <div className="absolute top-1/4 left-1/4 w-[30vw] h-[30vw] bg-primary/20 rounded-full blur-[100px] -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[25vw] h-[25vw] bg-accent/20 rounded-full blur-[80px] -z-10" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] bg-secondary/30 rounded-full blur-[120px] -z-10" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 mb-8 backdrop-blur-sm shadow-sm">
            <Star className="w-4 h-4 fill-primary" />
            <span className="text-sm font-semibold tracking-wide">Best Seller of the Day: Medu Vada</span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-black text-foreground mb-6 leading-[1.1]">
            <span className="block font-['Poppins']">Fresh South Indian Breakfast</span>
            <span className="block text-primary italic mt-2 font-['Poppins']">Delivered Hot</span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-lg md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Pre-order your breakfast in just 30 seconds. Authentic taste, premium quality, zero wait time.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <a
              href="#order"
              className="group relative px-8 py-4 bg-primary text-primary-foreground text-lg font-bold rounded-full overflow-hidden shadow-[0_8px_30px_rgb(255,107,43,0.3)] transition-all hover:scale-105 active:scale-95 w-full sm:w-auto"
              data-cursor="hover"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Order Now <span className="group-hover:translate-x-1 transition-transform">→</span>
              </span>
              <div className="absolute inset-0 h-full w-full bg-white/20 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out" />
            </a>
            
            <a
              href="#menu"
              className="px-8 py-4 bg-card text-foreground text-lg font-semibold rounded-full border border-border shadow-sm hover:bg-muted transition-colors w-full sm:w-auto"
              data-cursor="hover"
            >
              View Menu ↓
            </a>
          </motion.div>

          {/* Floating Stats */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {['500+ Happy Customers', 'Fresh Daily', '15 Min Pickup'].map((stat, i) => (
              <div key={i} className="px-6 py-4 rounded-2xl bg-card/60 backdrop-blur-md border border-border/50 shadow-sm">
                <p className="font-semibold text-foreground">{stat}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
