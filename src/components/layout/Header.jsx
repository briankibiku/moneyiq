import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  { label: 'PAYE Calculator', href: '/paye-calculator-kenya' },
  { label: 'M-Pesa Charges', href: '/mpesa-charges-calculator' },
  { label: 'Loan Calculator', href: '/loan-calculator-kenya' },
  { label: 'Mortgage Calculator', href: '/mortgage-calculator-kenya' },
  { label: 'FAQs', href: '/faqs' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/80 backdrop-blur-xl py-4 shadow-sm' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gray-900 flex items-center justify-center group-hover:scale-105 transition-all duration-500">
              <span className="text-white font-bold text-base">M</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight leading-none text-gray-900">
                MoneyIQ
              </span>
              <span className="text-[9px] font-medium text-gray-400 uppercase tracking-widest leading-none mt-1">Kenya</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-4 py-2 rounded-lg text-[11px] font-medium uppercase tracking-wider transition-all ${
                  location.pathname === link.href
                    ? 'text-gray-900 bg-gray-50'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-3 rounded-2xl bg-gray-50 text-gray-900 hover:bg-gray-100 transition-all"
            aria-label="Toggle Menu"
          >
            {mobileOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-white/95 backdrop-blur-2xl lg:hidden transition-all duration-500 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ top: '80px' }}
      >
        <div className="p-6 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`block px-6 py-4 rounded-2xl text-lg font-black tracking-tight transition-all ${
                location.pathname === link.href
                  ? 'bg-primary text-white shadow-xl shadow-primary/20'
                  : 'text-gray-900 hover:bg-gray-50'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
