import { Link } from 'react-router-dom';
import { useBankRates } from '../../hooks/useDataFetch';
import { formatPercent, formatRelativeDate } from '../../utils/calculations';

export default function RatesPreviewSection() {
  const { data: ratesData, loading } = useBankRates();

  // Show top 5 banks sorted by lending rate (lowest first = best for borrower)
  const topBanks = ratesData
    ? [...ratesData.banks].sort((a, b) => a.lendingRate - b.lendingRate).slice(0, 5)
    : [];

  return (
    <section id="rates-preview" className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-10 lg:gap-12 items-start">
          {/* Left — Info */}
          <div className="lg:col-span-2 space-y-6">
            <p className="text-sm font-semibold text-secondary uppercase tracking-wider">
              Live Rate Comparison
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-light-50">
              Compare <span className="gradient-text-gold">Bank Rates</span> at a Glance
            </h2>
            <p className="text-light-400 text-lg leading-relaxed">
              We track lending, savings, mortgage, and deposit rates across all major Kenyan banks. 
              Updated regularly from official sources.
            </p>

            {ratesData && (
              <div className="glass-card-light p-4 inline-flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-sm text-light-300">
                  Last updated: <span className="text-light-50 font-medium">{formatRelativeDate(ratesData.lastUpdated)}</span>
                </span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                to="/compare/lending"
                id="rates-cta-lending"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-semibold text-white gradient-primary hover:opacity-90 transition-smooth"
              >
                View All Lending Rates
              </Link>
              <Link
                to="/compare/savings"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-semibold text-light-300 border border-white/10 hover:bg-white/5 transition-smooth"
              >
                Savings Rates
              </Link>
            </div>
          </div>

          {/* Right — Rate Table Preview */}
          <div className="lg:col-span-3">
            <div className="glass-card overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-4 px-6 py-3 bg-white/[0.03] border-b border-white/5 text-xs font-semibold text-light-400 uppercase tracking-wider">
                <span>Bank</span>
                <span className="text-center">Lending</span>
                <span className="text-center">Savings</span>
                <span className="text-center">Mortgage</span>
              </div>

              {/* Table Body */}
              {loading ? (
                // Skeleton loading
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="grid grid-cols-4 px-6 py-4 border-b border-white/5">
                    <div className="animate-shimmer h-4 w-24 rounded" />
                    <div className="animate-shimmer h-4 w-12 rounded mx-auto" />
                    <div className="animate-shimmer h-4 w-12 rounded mx-auto" />
                    <div className="animate-shimmer h-4 w-12 rounded mx-auto" />
                  </div>
                ))
              ) : (
                topBanks.map((bank, i) => (
                  <div
                    key={bank.id}
                    className={`grid grid-cols-4 items-center px-6 py-4 transition-smooth hover:bg-white/[0.03] ${
                      i < topBanks.length - 1 ? 'border-b border-white/5' : ''
                    }`}
                  >
                    <span className="text-sm font-medium text-light-50">{bank.name}</span>
                    <span className="text-center">
                      <span className="font-number text-sm font-semibold text-warning">{formatPercent(bank.lendingRate)}</span>
                    </span>
                    <span className="text-center">
                      <span className="font-number text-sm font-semibold text-success">{formatPercent(bank.savingsRate)}</span>
                    </span>
                    <span className="text-center">
                      <span className="font-number text-sm font-semibold text-accent-light">{formatPercent(bank.mortgageRate)}</span>
                    </span>
                  </div>
                ))
              )}

              {/* View More */}
              <div className="px-6 py-4 bg-white/[0.02]">
                <Link
                  to="/compare/lending"
                  className="flex items-center justify-center gap-2 text-sm font-medium text-primary hover:text-primary-light transition-colors"
                >
                  View all {ratesData?.banks?.length || 10}+ banks
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
