import { Link } from 'react-router-dom';

const footerLinks = {
  calculators: [
    { label: 'PAYE Calculator', href: '/calculators/paye' },
    { label: 'M-Pesa Charges', href: '/calculators/mpesa' },
    { label: 'Loan Calculator', href: '/calculators/personal-loan' },
    { label: 'Mortgage Calculator', href: '/calculators/mortgage' },
  ],
  compareRates: [
    { label: 'Lending Rates', href: '/compare/lending' },
    { label: 'Savings Rates', href: '/compare/savings' },
    { label: 'Fixed Deposits', href: '/compare/fixed-deposits' },
    { label: 'MMF Rates', href: '/compare/mmf' },
  ],
  resources: [
    { label: 'Financial Glossary', href: '/glossary' },
    { label: 'News & Insights', href: '/articles' },
    { label: 'About MoneyIQ', href: '/about' },
  ],
};

export default function Footer() {
  return (
    <footer id="main-footer" className="bg-white border-t border-gray-100" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1 space-y-8">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center transition-all">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold text-gray-900 tracking-tight leading-none">
                  MoneyIQ
                </span>
                <span className="text-[8px] font-medium text-gray-400 uppercase tracking-widest leading-none mt-0.5">Kenya</span>
              </div>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              Precision financial tools for the modern Kenyan. <br />
              Trusted data, updated daily.
            </p>
          </div>

          {/* Link Columns */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-bold text-gray-900 uppercase tracking-widest">Tools</h3>
            <ul className="space-y-3">
              {footerLinks.calculators.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="text-[10px] font-bold text-gray-900 uppercase tracking-widest">Compare</h3>
            <ul className="space-y-3">
              {footerLinks.compareRates.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="text-[10px] font-bold text-gray-900 uppercase tracking-widest">Company</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest">
            © {new Date().getFullYear()} MoneyIQ Kenya. Precision Engineering.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="text-[10px] text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors">Privacy</Link>
            <Link to="/terms" className="text-[10px] text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
