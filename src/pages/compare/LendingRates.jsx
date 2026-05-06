import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../../components/seo/SEOHead';
import { useBankRates } from '../../hooks/useDataFetch';
import { formatPercent, formatRelativeDate } from '../../utils/calculations';

const sortOptions = [
  { value: 'lendingRate', label: 'Lending Rate (Low → High)' },
  { value: 'savingsRate', label: 'Savings Rate (High → Low)' },
  { value: 'mortgageRate', label: 'Mortgage Rate (Low → High)' },
  { value: 'name', label: 'Bank Name (A → Z)' },
];

export default function LendingRatesComparison() {
  const { data: ratesData, loading } = useBankRates();
  const [sortBy, setSortBy] = useState('lendingRate');
  const [search, setSearch] = useState('');

  const sortedBanks = useMemo(() => {
    if (!ratesData) return [];
    let banks = [...ratesData.banks];

    // Filter
    if (search) {
      banks = banks.filter((b) => b.name.toLowerCase().includes(search.toLowerCase()));
    }

    // Sort
    banks.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'savingsRate') return b.savingsRate - a.savingsRate; // Higher is better
      return a[sortBy] - b[sortBy]; // Lower is better for lending/mortgage
    });

    return banks;
  }, [ratesData, sortBy, search]);

  const bestLending = ratesData ? Math.min(...ratesData.banks.map((b) => b.lendingRate)) : null;
  const bestSavings = ratesData ? Math.max(...ratesData.banks.map((b) => b.savingsRate)) : null;

  return (
    <>
      <SEOHead
        title="Bank Lending Rates Comparison Kenya 2026 | Compare All Banks - MoneyIQ"
        description="Compare lending rates, savings rates, and mortgage rates across all major Kenyan banks. Find the best rates for your financial needs."
        keywords="bank rates Kenya, lending rates comparison, savings rates Kenya, mortgage rates comparison, best bank rates Kenya 2026"
        canonical="/compare/lending"
      />

      <main className="pt-20 pb-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-light-400 mb-8" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-light-50 transition-colors">Home</Link>
            <span>/</span>
            <Link to="/compare/lending" className="hover:text-light-50 transition-colors">Compare Rates</Link>
            <span>/</span>
            <span className="text-light-50">Lending Rates</span>
          </nav>

          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-light-50 mb-3">
              Bank Rates Comparison <span className="gradient-text">Kenya 2026</span>
            </h1>
            <p className="text-lg text-light-400 max-w-2xl">
              Compare lending, savings, and mortgage rates across all major Kenyan banks. 
              Updated regularly from official sources.
            </p>
            {ratesData && (
              <div className="inline-flex items-center gap-3 mt-4 glass-card-light px-4 py-2">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-sm text-light-300">
                  Source: {ratesData.source} • Updated {formatRelativeDate(ratesData.lastUpdated)}
                </span>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          {ratesData && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="glass-card p-4 text-center">
                <p className="text-xs text-light-400 uppercase tracking-wider mb-1">CBK Base Rate</p>
                <p className="text-xl font-bold text-primary font-number">{formatPercent(ratesData.centralBankRate)}</p>
              </div>
              <div className="glass-card p-4 text-center">
                <p className="text-xs text-light-400 uppercase tracking-wider mb-1">Best Lending</p>
                <p className="text-xl font-bold text-success font-number">{formatPercent(bestLending)}</p>
              </div>
              <div className="glass-card p-4 text-center">
                <p className="text-xs text-light-400 uppercase tracking-wider mb-1">Best Savings</p>
                <p className="text-xl font-bold text-secondary font-number">{formatPercent(bestSavings)}</p>
              </div>
              <div className="glass-card p-4 text-center">
                <p className="text-xs text-light-400 uppercase tracking-wider mb-1">Banks Tracked</p>
                <p className="text-xl font-bold text-accent-light font-number">{ratesData.banks.length}</p>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-light-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                id="bank-search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search banks..."
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-light-50 placeholder:text-light-400/60 focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth"
              />
            </div>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-light-50 focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth appearance-none cursor-pointer"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Rate Table */}
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-white/[0.03] text-xs text-light-400 uppercase tracking-wider">
                    <th className="px-6 py-4 text-left font-semibold">Bank</th>
                    <th className="px-6 py-4 text-center font-semibold">Lending Rate</th>
                    <th className="px-6 py-4 text-center font-semibold">Savings Rate</th>
                    <th className="px-6 py-4 text-center font-semibold">Mortgage Rate</th>
                    <th className="px-6 py-4 text-center font-semibold">Personal Loan</th>
                    <th className="px-6 py-4 text-center font-semibold">Fixed Deposit (12m)</th>
                  </tr>
                </thead>
                <tbody>
                  {loading
                    ? Array.from({ length: 8 }).map((_, i) => (
                        <tr key={i} className="border-b border-white/5">
                          <td className="px-6 py-4"><div className="animate-shimmer h-4 w-32 rounded" /></td>
                          <td className="px-6 py-4"><div className="animate-shimmer h-4 w-16 rounded mx-auto" /></td>
                          <td className="px-6 py-4"><div className="animate-shimmer h-4 w-16 rounded mx-auto" /></td>
                          <td className="px-6 py-4"><div className="animate-shimmer h-4 w-16 rounded mx-auto" /></td>
                          <td className="px-6 py-4"><div className="animate-shimmer h-4 w-16 rounded mx-auto" /></td>
                          <td className="px-6 py-4"><div className="animate-shimmer h-4 w-16 rounded mx-auto" /></td>
                        </tr>
                      ))
                    : sortedBanks.map((bank, i) => (
                        <tr
                          key={bank.id}
                          className={`border-b border-white/5 hover:bg-white/[0.03] transition-colors ${
                            i === 0 ? 'bg-primary/5' : ''
                          }`}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-xs font-bold text-light-300">
                                {bank.name.charAt(0)}
                              </div>
                              <span className="font-medium text-light-50">{bank.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`font-number font-semibold ${
                              bank.lendingRate === bestLending ? 'text-success' : 'text-warning'
                            }`}>
                              {formatPercent(bank.lendingRate)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`font-number font-semibold ${
                              bank.savingsRate === bestSavings ? 'text-success' : 'text-light-200'
                            }`}>
                              {formatPercent(bank.savingsRate)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="font-number font-semibold text-accent-light">
                              {formatPercent(bank.mortgageRate)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="font-number font-semibold text-light-200">
                              {formatPercent(bank.personalLoanRate)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="font-number font-semibold text-light-200">
                              {formatPercent(bank.fixedDepositRate['12months'])}
                            </span>
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>

            {sortedBanks.length === 0 && !loading && (
              <div className="px-6 py-12 text-center">
                <p className="text-light-400">No banks match your search.</p>
              </div>
            )}
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-light-400/60 mt-6 text-center">
            Rates are indicative and sourced from public data as of the last update. 
            Please contact your bank directly for the most current rates applicable to your specific situation.
          </p>
        </div>
      </main>
    </>
  );
}
