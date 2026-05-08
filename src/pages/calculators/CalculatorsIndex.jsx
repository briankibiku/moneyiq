import { Link } from 'react-router-dom';
import SEOHead from '../../components/seo/SEOHead';

const calculatorsList = [
  {
    id: 'paye',
    title: 'PAYE & Net Salary Calculator',
    description: 'Calculate your take-home pay after PAYE tax, NHIF, NSSF, and Housing Levy. Updated with 2024/2025 KRA tax bands.',
    href: '/paye-calculator-kenya',
    icon: '🧾',
    available: true,
  },
  {
    id: 'mpesa',
    title: 'M-Pesa Charges Calculator',
    description: 'Find transaction fees for sending and withdrawing money. Updated with latest Safaricom M-Pesa rates.',
    href: '/mpesa-charges-calculator',
    icon: '📱',
    available: true,
  },
  {
    id: 'personal-loan',
    title: 'Loan Calculator',
    description: 'Estimate your monthly loan repayments, total interest, and compare costs across Kenyan banks.',
    href: '/loan-calculator-kenya',
    icon: '💰',
    available: true,
  },
  {
    id: 'mortgage',
    title: 'Mortgage / Home Loan Calculator',
    description: 'Calculate monthly repayments for your home loan using current bank rates. See detailed amortization schedules.',
    href: '/mortgage-calculator-kenya',
    icon: '🏠',
    available: true,
  },
  {
    id: 'compare',
    title: 'Bank Rates Comparison',
    description: 'Compare lending and savings rates across major Kenyan banks to find the best deal.',
    href: '/compare/lending',
    icon: '📊',
    available: true,
  },
];

export default function CalculatorsIndex() {
  return (
    <>
      <SEOHead
        title="Financial Calculators Kenya | Loan, Mortgage & Savings Calculators - MoneyIQ"
        description="Free financial calculators for Kenya. Calculate mortgage repayments, personal loan costs, savings goals, and compare loan offers using real bank rates."
        keywords="financial calculator Kenya, loan calculator Kenya, mortgage calculator, savings calculator, HELB calculator"
        canonical="/calculators"
      />

      <main className="pt-20 pb-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-light-400 mb-8" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-light-50 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-light-50">Calculators</span>
          </nav>

          <div className="mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-light-50 mb-3">
              Financial <span className="gradient-text">Calculators</span>
            </h1>
            <p className="text-lg text-light-400 max-w-2xl">
              Powerful, free calculators designed for Kenyan financial products. 
              Use real bank rates to get accurate results.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {calculatorsList.map((calc) => (
              <Link
                key={calc.id}
                to={calc.available ? calc.href : '#'}
                id={`calc-link-${calc.id}`}
                className={`group glass-card p-6 lg:p-8 transition-smooth ${
                  calc.available
                    ? 'hover:bg-white/[0.08] hover:scale-[1.02] cursor-pointer'
                    : 'opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="text-3xl mb-4">{calc.icon}</div>
                <h2 className="text-lg font-semibold text-light-50 mb-2 group-hover:text-primary transition-colors">
                  {calc.title}
                </h2>
                <p className="text-sm text-light-400 leading-relaxed mb-4">{calc.description}</p>
                {calc.available ? (
                  <span className="inline-flex items-center text-sm font-medium text-primary">
                    Use Calculator →
                  </span>
                ) : (
                  <span className="inline-flex items-center text-xs font-medium text-light-400 bg-white/5 px-3 py-1 rounded-full">
                    Coming Soon
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
