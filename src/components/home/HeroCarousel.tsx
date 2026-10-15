import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, Plane, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SLIDES = [
  {
    id: 1,
    badge: 'CHAMPION BLOODLINES • DIRECT BREEDER SELECTION',
    title: 'Experience Living Jewels of the Aquatic World',
    subtitle: 'Hand-selected Show Class Halfmoons, rare Galaxy Plakats, and pure strain Albino Guppies. Shipped with guaranteed live arrival.',
    ctaPrimary: 'Shop Bettas',
    ctaPrimaryLink: '/shop?cat=cat-betta',
    ctaSecondary: 'Explore All Livestock',
    ctaSecondaryLink: '/shop',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1600&q=85',
    accent: 'from-cyan-500/20 to-teal-500/10'
  },
  {
    id: 2,
    badge: '1-OF-A-KIND SHOW SPECIMENS',
    title: 'Exact Fish Pictured Is What Arrives at Your Door',
    subtitle: 'Each unique Betta specimen is photographed individually under natural spectrum lighting with full lineage and health documentation.',
    ctaPrimary: 'View Unique Drops',
    ctaPrimaryLink: '/shop?filter=unique',
    ctaSecondary: 'Learn Acclimation',
    ctaSecondaryLink: '/page/shipping-acclimation',
    image: 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?auto=format&fit=crop&w=1600&q=85',
    accent: 'from-rose-500/20 to-amber-500/10'
  },
  {
    id: 3,
    badge: 'HEALTHY PLANTED AQUASCAPES',
    title: 'Pristine Tissue-Cultured Plants & Bio-Conditioners',
    subtitle: 'Snail-free aquatic flora, organic Indian almond leaves, and high-protein micro feeds for long and vibrant betta lives.',
    ctaPrimary: 'Shop Plants & Food',
    ctaPrimaryLink: '/shop?cat=cat-plants',
    ctaSecondary: 'Aquarium Care',
    ctaSecondaryLink: '/shop?cat=cat-accessories',
    image: 'https://images.unsplash.com/photo-1520302630591-fd1c66edc19d?auto=format&fit=crop&w=1600&q=85',
    accent: 'from-emerald-500/20 to-cyan-500/10'
  }
];

export const HeroCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[currentSlide];

  return (
    <section className="relative overflow-hidden bg-ocean-950 text-white min-h-[440px] sm:min-h-[500px] lg:min-h-[540px] flex items-center">
      {/* Background Slides with AnimatePresence */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 z-0"
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover object-center opacity-40 mix-blend-luminosity brightness-110"
          />
          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-r from-ocean-950 via-ocean-950/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-ocean-950 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12 relative z-10 w-full">
        <div className="max-w-2xl">
          {/* Badge */}
          <motion.div
            key={`badge-${slide.id}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ocean-900/90 border border-aqua-400/40 text-aqua-300 text-[11px] sm:text-xs font-bold tracking-wider mb-4 shadow-glow-aqua"
          >
            <Sparkles className="w-3.5 h-3.5 text-aqua-400" />
            <span>{slide.badge}</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            key={`title-${slide.id}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display font-extrabold text-2xl sm:text-4xl lg:text-5xl leading-tight text-white mb-3 tracking-tight"
          >
            {slide.title}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            key={`sub-${slide.id}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xs sm:text-base text-slate-300 mb-6 leading-relaxed max-w-xl font-normal"
          >
            {slide.subtitle}
          </motion.p>

          {/* CTAs */}
          <motion.div
            key={`cta-${slide.id}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center gap-3 sm:gap-4"
          >
            <Link
              to={slide.ctaPrimaryLink}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-aqua-500 hover:bg-aqua-400 text-ocean-950 font-bold text-xs sm:text-sm transition-all shadow-glow-aqua active:scale-95"
            >
              <span>{slide.ctaPrimary}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to={slide.ctaSecondaryLink}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-ocean-900/80 hover:bg-ocean-800 text-slate-200 hover:text-white border border-slate-700 hover:border-slate-500 font-semibold text-xs sm:text-sm transition-all active:scale-95"
            >
              <span>{slide.ctaSecondary}</span>
            </Link>
          </motion.div>

          {/* Trust Highlights Mini Strip */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-300">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-aqua-400" />
              <span>100% Live Arrival Guarantee</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Plane className="w-4 h-4 text-aqua-400" />
              <span>Overnight Express Air Cargo</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-aqua-400" />
              <span>Certified Healthy Quarantined</span>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-1.5 rounded-full transition-all ${
              currentSlide === idx ? 'w-6 bg-aqua-400 shadow-glow-aqua' : 'w-2 bg-slate-600'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
