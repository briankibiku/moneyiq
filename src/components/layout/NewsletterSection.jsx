import { useState } from 'react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Integrate with email service (Mailchimp, ConvertKit, etc.)
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setEmail('');
  };

  return (
    <section id="newsletter" className="py-20 lg:py-28 gradient-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card p-8 sm:p-12 lg:p-16 text-center relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-secondary/10 rounded-full blur-3xl" />

          <div className="relative z-10 max-w-xl mx-auto">
            <p className="text-sm font-semibold text-secondary uppercase tracking-wider mb-3">
              Stay Updated
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-light-50 mb-4">
              Get Weekly Financial{' '}
              <span className="gradient-text-gold">Insights</span>
            </h2>
            <p className="text-light-400 text-lg mb-8">
              Rate changes, market updates, and money-saving tips delivered to your inbox every week. 
              No spam, unsubscribe anytime.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                id="newsletter-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-light-50 placeholder:text-light-400/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth"
              />
              <button
                type="submit"
                id="newsletter-submit"
                className="px-8 py-3 rounded-xl text-sm font-bold text-white gradient-cta hover:opacity-90 transition-smooth shadow-lg whitespace-nowrap"
              >
                {submitted ? '✓ Subscribed!' : 'Subscribe Free'}
              </button>
            </form>

            <p className="text-xs text-light-400/60 mt-4">
              Join 2,000+ Kenyans who read our weekly financial digest.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
