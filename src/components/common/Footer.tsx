import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, Sparkles, Send, Phone, Mail, Award, Check } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

export const Footer: React.FC = () => {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    setSubscribed(true);
    showToast('Subscribed! Welcome to the Betta Aquatics VIP Collector List.', 'success');
    setEmail('');
  };

  return (
    <footer className="bg-ocean-950 text-slate-300 border-t border-ocean-900 pt-12 pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Value Prop Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-12 border-b border-ocean-900">
          <div className="flex items-center gap-3 p-3 bg-ocean-900/50 rounded-2xl border border-ocean-800">
            <ShieldCheck className="w-8 h-8 text-aqua-400 shrink-0" />
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wider">Live Arrival</div>
              <div className="text-[11px] text-slate-400">100% Guaranteed DOA Policy</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-ocean-900/50 rounded-2xl border border-ocean-800">
            <Truck className="w-8 h-8 text-aqua-400 shrink-0" />
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wider">Express Air Cargo</div>
              <div className="text-[11px] text-slate-400">Overnight 24-36h Delivery</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-ocean-900/50 rounded-2xl border border-ocean-800">
            <Sparkles className="w-8 h-8 text-aqua-400 shrink-0" />
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wider">Exact Fish Shown</div>
              <div className="text-[11px] text-slate-400">Unique True Specimen Guarantee</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-ocean-900/50 rounded-2xl border border-ocean-800">
            <Award className="w-8 h-8 text-aqua-400 shrink-0" />
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wider">Champion Strains</div>
              <div className="text-[11px] text-slate-400">Hand-Conditioned Bloodlines</div>
            </div>
          </div>
        </div>

        {/* Links and Newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 py-12 border-b border-ocean-900">
          {/* Brand Col */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-ocean-900 border border-aqua-400/40 p-1 flex items-center justify-center shadow-glow-aqua">
                <img src="/logo-fish.svg" alt="Betta Aquatics" className="w-full h-full object-contain" />
              </div>
              <span className="font-display font-extrabold text-xl text-white tracking-wider">
                BETTA <span className="text-aqua-400">AQUATICS</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4 max-w-sm">
              India's premier ornamental fish sanctuary. We specialize in champion-lineage Halfmoons, rare Galaxy Plakats, pure strain guppies, and pristine aquatic flora. Shipped across India with professional oxygen pressurized transit.
            </p>
            <div className="flex flex-col gap-2 text-xs">
              <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300">
                <Phone className="w-4 h-4" />
                <span>WhatsApp: +91 98765 43210</span>
              </a>
              <a href="mailto:care@bettaaquatics.in" className="flex items-center gap-2 text-slate-400 hover:text-white">
                <Mail className="w-4 h-4" />
                <span>care@bettaaquatics.in</span>
              </a>
            </div>
          </div>

          {/* Catalog Col */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3 font-display">Collections</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/shop?cat=cat-betta" className="hover:text-aqua-400 transition-colors">Show Bettas (Male & Female)</Link></li>
              <li><Link to="/shop?cat=cat-guppy" className="hover:text-aqua-400 transition-colors">Imported Guppy Pairs</Link></li>
              <li><Link to="/shop?cat=cat-pairs" className="hover:text-aqua-400 transition-colors">Proven Breeding Pairs</Link></li>
              <li><Link to="/shop?cat=cat-plants" className="hover:text-aqua-400 transition-colors">Aquatic Plants & Mosses</Link></li>
              <li><Link to="/shop?cat=cat-food" className="hover:text-aqua-400 transition-colors">High Protein Micro Pellets</Link></li>
              <li><Link to="/shop?cat=cat-accessories" className="hover:text-aqua-400 transition-colors">Catappa Almond Leaves</Link></li>
            </ul>
          </div>

          {/* Guides Col */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3 font-display">Customer Care</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/page/shipping-acclimation" className="hover:text-aqua-400 transition-colors">Shipping & Acclimation Guide</Link></li>
              <li><Link to="/page/faq" className="hover:text-aqua-400 transition-colors">Frequently Asked Questions</Link></li>
              <li><Link to="/account/orders" className="hover:text-aqua-400 transition-colors">Track Your Consignment</Link></li>
              <li><Link to="/page/about-us" className="hover:text-aqua-400 transition-colors">About Our Fish Farm</Link></li>
              <li><Link to="/admin" className="text-amber-400/80 hover:text-amber-300 font-semibold">Store Administrator Portal</Link></li>
            </ul>
          </div>

          {/* Newsletter Col */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2 font-display">Collector VIP Club</h4>
            <p className="text-xs text-slate-400 mb-3">
              Subscribe for early access to rare specimen imports and weekly stock drops.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-ocean-900 border border-ocean-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-aqua-500"
              />
              <button
                type="submit"
                className="w-full py-2 bg-aqua-500 hover:bg-aqua-400 text-ocean-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                {subscribed ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Subscribed!</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Get Exclusive Drops</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} Betta Aquatics India Pvt Ltd. All rights reserved.
          </div>
          <div className="text-[11px] text-slate-500 text-center sm:text-right">
            <span>Specimen Transparency: For all unique specimens, photographs and videos depict the actual individual fish.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
