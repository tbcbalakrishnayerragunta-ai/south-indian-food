import React from 'react';
import { Phone, MapPin, Clock } from 'lucide-react';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#3D1A08] text-[#FFF8F0] pt-16 pb-8 border-t border-primary/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12 border-b border-white/10 pb-12">
          {/* Brand */}
          <div className="sm:col-span-2 space-y-4">
            <h2 className="text-3xl font-black text-primary font-['Poppins']">Tiffin House</h2>
            <p className="text-white/70 max-w-sm text-base leading-relaxed">
              Fresh South Indian Breakfast, Every Morning.
              No compromises on taste, quality, or hygiene.
            </p>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold font-['Poppins']">Contact Us</h3>
            <div className="space-y-3 text-white/80 text-sm">
              <p className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>+91 98765 43210</span>
              </p>
              <p className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>42 Gandhi Nagar,<br />Coimbatore 641001</span>
              </p>
            </div>
          </div>

          {/* Connect & Hours */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold font-['Poppins']">Connect</h3>
              <div className="flex gap-3">
                <a
                  href="https://wa.me/919876543210"
                  target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center hover:scale-110 transition-transform text-white shadow-md"
                  aria-label="WhatsApp"
                >
                  <FaWhatsapp className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-orange-400 flex items-center justify-center hover:scale-110 transition-transform text-white shadow-md"
                  aria-label="Instagram"
                >
                  <FaInstagram className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-bold font-['Poppins']">Hours</h3>
              <p className="flex items-center gap-3 text-white/80 text-sm">
                <Clock className="w-5 h-5 text-primary shrink-0" />
                <span>Mon–Sun: 7:00 AM – 11:00 AM</span>
              </p>
            </div>
          </div>
        </div>

        <div className="text-center text-white/50 text-sm">
          © {new Date().getFullYear()} Tiffin House. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
