import { Link } from 'react-router-dom';
import { useBankRates } from '../../hooks/useDataFetch';
import { formatPercent } from '../../utils/calculations';

export default function HeroSection() {
  const { data: ratesData } = useBankRates();

  const stats = ratesData
    ? {
        cbkRate: ratesData.centralBankRate,
        avgLending: (ratesData.banks.reduce((s, b) => s + b.lendingRate, 0) / ratesData.banks.length),
        avgSavings: (ratesData.banks.reduce((s, b) => s + b.savingsRate, 0) / ratesData.banks.length),
        banksTracked: ratesData.banks.length,
      }
    : { cbkRate: 10.0, avgLending: 14.0, avgSavings: 3.2, banksTracked: 10 };

  return (
    <section id="hero" className="relative min-h-[90vh] flex items-center bg-white overflow-hidden pt-20">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          {/* Left Content */}
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-100 text-gray-900 text-[11px] font-bold uppercase tracking-widest">
              Financial Intelligence 2026
            </div>

            <h1 className="text-6xl sm:text-7xl lg:text-9xl font-bold leading-[0.9] tracking-tight text-gray-900">
              Finance <br /> Simplified.
            </h1>

            <p className="text-xl sm:text-2xl text-gray-500 leading-relaxed max-w-xl font-normal">
              Accurate financial modeling for Kenya. <br />
              <span className="text-gray-900 font-bold">PAYE, M-Pesa, & Loans</span> updated for the modern era.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Link
                to="/calculators/paye"
                className="inline-flex items-center justify-center px-10 py-4 rounded-xl text-base font-bold text-white bg-gray-900 hover:bg-black transition-all"
              >
                Launch Calculator
                <svg className="ml-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Right Stats Grid */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            {[
              { label: 'CBK Rate', value: formatPercent(stats.cbkRate, 2) },
              { label: 'Avg Lending', value: formatPercent(stats.avgLending, 2) },
              { label: 'Avg Savings', value: formatPercent(stats.avgSavings, 2) },
              { label: 'Tracked Banks', value: `${stats.banksTracked}+` },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="p-8 flex flex-col items-start bg-gray-50 border border-gray-100 rounded-2xl hover:bg-gray-100 transition-all"
              >
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
