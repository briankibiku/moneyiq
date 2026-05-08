import { useState, useEffect } from 'react';

const COOKIE_KEY = 'moneyiq_cookie_consent';

export default function UserNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_KEY);
    if (!consent) {
      // Show after a short delay for better UX
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_KEY, JSON.stringify({ accepted: true, date: new Date().toISOString() }));
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_KEY, JSON.stringify({ accepted: false, date: new Date().toISOString() }));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 animate-slide-up">
      <div className="max-w-4xl mx-auto glass-card p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-2xl border border-white/10">
        <div className="flex-1">
          <p className="text-sm text-light-200 leading-relaxed">
            <span className="font-semibold text-light-50">🍪 Cookie Notice</span> — 
            MoneyIQ uses essential cookies to ensure the site works properly. We do not use tracking cookies or sell your data. 
            All calculations are done locally in your browser.{' '}
            <a href="/about" className="text-primary hover:underline">Learn more</a>.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleDecline}
            className="px-4 py-2 rounded-lg text-sm font-medium text-light-400 hover:text-light-200 bg-white/5 hover:bg-white/10 transition-smooth border border-white/10"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="px-5 py-2 rounded-lg text-sm font-semibold text-white gradient-cta hover:opacity-90 transition-smooth"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
