import { Link } from 'react-router-dom';

const calculators = [
  {
    id: 'paye',
    title: 'PAYE Calculator',
    description: 'Calculate your net salary after tax, NHIF, NSSF, and Housing Levy deductions.',
    href: '/paye-calculator-kenya',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    gradient: 'from-primary to-emerald-600',
    bgGlow: 'bg-primary/10',
  },
  {
    id: 'mpesa',
    title: 'M-Pesa Charges',
    description: 'Quickly find transaction fees for sending and withdrawing money with the latest rates.',
    href: '/mpesa-charges-calculator',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    gradient: 'from-secondary to-amber-500',
    bgGlow: 'bg-secondary/10',
  },
  {
    id: 'loan',
    title: 'Loan Calculator',
    description: 'Estimate monthly repayments and total interest for personal and bank loans.',
    href: '/loan-calculator-kenya',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    gradient: 'from-blue-500 to-indigo-600',
    bgGlow: 'bg-blue-500/10',
  },
  {
    id: 'mortgage',
    title: 'Mortgage Calculator',
    description: 'Plan your home purchase with accurate amortization schedules for Kenyan mortgages.',
    href: '/mortgage-calculator-kenya',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    gradient: 'from-purple-500 to-pink-500',
    bgGlow: 'bg-purple-500/10',
  },
];

export default function CalculatorsSection() {
  return (
    <section id="calculators-section" className="py-20 lg:py-28 gradient-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
            Financial Tools
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-light-50 mb-4">
            Powerful Calculators for Every{' '}
            <span className="gradient-text">Financial Decision</span>
          </h2>
          <p className="text-light-400 text-lg">
            From home loans to savings goals — get accurate calculations using real Kenyan bank rates.
          </p>
        </div>

        {/* Calculator Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {calculators.map((calc) => (
            <Link
              key={calc.id}
              to={calc.href}
              id={`calc-card-${calc.id}`}
              className="group glass-card p-6 lg:p-8 hover:bg-white transition-smooth hover:border-primary/50"
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-primary/5 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-smooth">
                {calc.icon}
              </div>

              {/* Content */}
              <h3 className="text-base font-black text-light-50 mb-2 group-hover:text-primary transition-colors">
                {calc.title}
              </h3>
              <p className="text-xs text-light-400 leading-relaxed font-medium mb-4">
                {calc.description}
              </p>

              {/* Action Link */}
              <div className="flex items-center text-[10px] font-bold text-primary uppercase tracking-widest pt-2 border-t border-dark-700 mt-auto">
                Launch Tool
                <svg className="ml-1 w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
