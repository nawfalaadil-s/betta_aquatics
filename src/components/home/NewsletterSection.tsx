import React, { useState } from 'react';
import { Send, Check, Mail, Sparkles } from 'lucide-react';
import { HomepageSection } from '../../lib/types';

interface NewsletterSectionProps {
  section?: HomepageSection;
}

export const NewsletterSection: React.FC<NewsletterSectionProps> = ({ section }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const title = section?.title || 'Join The VIP Fish Club';
  const subtitle = section?.subtitle || 'Be the first to know when rare wild hybrids, pure strain guppies, and master show specimens are listed.';

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
    }, 2000);
  };

  return (
    <section className="py-12 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white relative overflow-hidden border-b border-slate-800">
      {/* Decorative ambient elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Priority Live Stock Alerts</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight mb-3">
          {title}
        </h2>

        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto mb-6 leading-relaxed">
          {subtitle}
        </p>

        <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 outline-none focus:border-blue-400 focus:bg-white/15 transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={subscribed}
            className="btn-accent shrink-0 py-2.5 px-5 flex items-center justify-center gap-2"
          >
            {subscribed ? (
              <>
                <Check className="w-4 h-4" />
                <span>Subscribed!</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Subscribe</span>
              </>
            )}
          </button>
        </form>

        <p className="text-2xs text-slate-400 mt-3">
          No spam, ever. Unsubscribe at any time with one click.
        </p>
      </div>
    </section>
  );
};
