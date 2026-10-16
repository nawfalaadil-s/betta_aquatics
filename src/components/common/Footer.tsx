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
    showToast('Subscribed! You will receive new livestock drop alerts.', 'success');
    setEmail('');
  };

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-10 pb-24 md:pb-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Value Prop Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pb-10 border-b border-slate-800">
          <div className="flex items-center gap-3 p-3 bg-slate-800/60 rounded-2xl border border-slate-800">
            <ShieldCheck className="w-7 h-7 text-teal-400 shrink-0" />
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wider">Live Arrival</div>
              <div className="text-[11px] text-slate-400">100% Guaranteed DOA Policy</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-800/60 rounded-2xl border border-slate-800">
            <Truck className="w-7 h-7 text-teal-400 shrink-0" />
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wider">Express Air Cargo</div>
              <div className="text-[11px] text-slate-400">Overnight 24-36h Delivery</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-800/60 rounded-2xl border border-slate-800">
            <Sparkles className="w-7 h-7 text-teal-400 shrink-0" />
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wider">WYSIWYG Fish</div>
              <div className="text-[11px] text-slate-400">Exact Specimen Pictured</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-800/60 rounded-2xl border border-slate-800">
            <Award className="w-7 h-7 text-teal-400 shrink-0" />
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wider">Health Quarantined</div>
              <div className="text-[11px] text-slate-400">72h Tank Conditioned</div>
            </div>
          </div>
        </div>

        {/* Links and Newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 py-10 border-b border-slate-800">
          {/* Brand Col */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-slate-800 p-1 flex items-center justify-center">
                <img src="/logo-fish.svg" alt="Betta Aquatics" className="w-full h-full object-contain" />
              </div>
              <span className="font-display font-extrabold text-lg text-white tracking-tight">
                BETTA <span className="text-teal-400">AQUATICS</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4 max-w-sm font-normal">
              Freshwater ornamental fish store based in Bengaluru. Healthy show Bettas, pure strain guppies, and tissue-cultured aquatic flora shipped safely across India.
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
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3 font-display">Livestock</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/shop?cat=cat-betta" className="hover:text-teal-400 transition-colors">Halfmoon & Plakat Bettas</Link></li>
              <li><Link to="/shop?cat=cat-guppy" className="hover:text-teal-400 transition-colors">Imported Guppy Pairs</Link></li>
              <li><Link to="/shop?cat=cat-pairs" className="hover:text-teal-400 transition-colors">Breeding Pairs</Link></li>
              <li><Link to="/shop?cat=cat-plants" className="hover:text-teal-400 transition-colors">Live Aquarium Plants</Link></li>
              <li><Link to="/shop?cat=cat-food" className="hover:text-teal-400 transition-colors">Fish Food & Pellets</Link></li>
              <li><Link to="/shop?cat=cat-accessories" className="hover:text-teal-400 transition-colors">Indian Almond Leaves</Link></li>
            </ul>
          </div>

          {/* Guides Col */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3 font-display">Customer Support</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/page/shipping-acclimation" className="hover:text-teal-400 transition-colors">Acclimation & DOA Policy</Link></li>
              <li><Link to="/page/faq" className="hover:text-teal-400 transition-colors">Frequently Asked Questions</Link></li>
              <li><Link to="/account/orders" className="hover:text-teal-400 transition-colors">Track Consignment</Link></li>
              <li><Link to="/page/about-us" className="hover:text-teal-400 transition-colors">About Our Facility</Link></li>
              <li><Link to="/admin" className="text-amber-400/80 hover:text-amber-300 font-semibold">Admin Operations</Link></li>
            </ul>
          </div>

          {/* Newsletter Col */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2 font-display">Livestock Alerts</h4>
            <p className="text-xs text-slate-400 mb-3 font-normal">
              Receive updates when new show-class Bettas and rare imports arrive.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-teal-500"
              />
              <button
                type="submit"
                className="w-full py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                {subscribed ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Subscribed!</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Subscribe to Drops</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} Betta Aquatics India Pvt Ltd. All rights reserved.
          </div>
          <div className="text-[11px] text-slate-500 text-center sm:text-right">
            <span>Live Arrival Policy: Video recording of unopened transit bag required within 2 hours of delivery for DOA coverage.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
