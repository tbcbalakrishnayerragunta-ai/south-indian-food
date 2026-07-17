import React from 'react';
import { Star } from 'lucide-react';

const reviews = [
  { name: 'Priya K.', text: "The softest idli I've ever had! Worth every rupee.", rating: 5, initial: 'P' },
  { name: 'Rahul M.', text: "Crispy vada at 8am? Yes please! Best breakfast spot.", rating: 5, initial: 'R' },
  { name: 'Sneha R.', text: "The dosa is absolutely divine. Pre-ordered 3 days in a row!", rating: 5, initial: 'S' },
  { name: 'Arjun T.', text: "Hygienic, fresh, and lightning fast. My go-to every morning.", rating: 5, initial: 'A' },
  { name: 'Divya L.', text: "Worth every rupee. The coconut chutney is heavenly.", rating: 5, initial: 'D' },
];

export const Testimonials: React.FC = () => {
  // Duplicate array for seamless marquee
  const loopedReviews = [...reviews, ...reviews];

  return (
    <section className="py-24 bg-primary/5 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 mb-12">
        <h2 className="text-4xl md:text-5xl font-black text-center text-foreground font-['Poppins']">
          What Our Customers Say
        </h2>
      </div>

      <div className="relative flex w-full group">
        <div className="flex animate-marquee group-hover:[animation-play-state:paused]">
          {loopedReviews.map((review, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[300px] md:w-[400px] mx-4 bg-card p-6 rounded-2xl border border-border shadow-sm"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-primary/20 text-primary font-bold text-xl rounded-full flex items-center justify-center shrink-0">
                  {review.initial}
                </div>
                <div>
                  <h4 className="font-bold text-foreground">{review.name}</h4>
                  <div className="flex gap-1 text-primary">
                    {[...Array(review.rating)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-primary" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground italic leading-relaxed">"{review.text}"</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
          width: max-content;
        }
      `}</style>
    </section>
  );
};
