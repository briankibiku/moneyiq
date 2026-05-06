import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../../components/seo/SEOHead';
import { useDataFetch } from '../../hooks/useDataFetch';
import { formatCurrency, formatPercent } from '../../utils/calculations';

export default function SACCORates() {
  const { data, loading } = useDataFetch('sacco-rates.json');

  const sortedSACCOs = useMemo(() => {
    if (!data?.saccos) return [];
    return [...data.saccos].sort((a, b) => b.dividendOnShares - a.dividendOnShares);
  }, [data]);

  if (loading) {
    return (
      <main className="pt-20 pb-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 w-48 bg-white/5 rounded mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-48 bg-white/5 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <SEOHead
        title="Best SACCO Dividend Rates in Kenya 2026 - MoneyIQ"
        description="Compare SACCO dividend on shares and interest on deposits. See rates for Stima SACCO, Kenya Police SACCO, Safaricom SACCO and more."
        keywords="SACCO rates Kenya, best SACCO Kenya, SACCO dividends 2026, Stima SACCO rates"
        canonical="/compare/saccos"
      />

      <main className="pt-20 pb-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-light-400 mb-8" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-light-50 transition-colors">Home</Link>
            <span>/</span>
            <Link to="/compare" className="hover:text-light-50 transition-colors">Compare Rates</Link>
            <span>/</span>
            <span className="text-light-50">SACCOs</span>
          </nav>

          <div className="mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-light-50 mb-3">
              SACCO <span className="gradient-text">Dividend Rates</span>
            </h1>
            <p className="text-lg text-light-400 max-w-2xl">
              Compare returns for the top SACCOs in Kenya. SACCOs consistently offer some of the 
              highest returns on savings through dividends and interest on deposits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedSACCOs.map((sacco, index) => (
              <div key={sacco.id} className="glass-card p-6 flex flex-col relative overflow-hidden group">
                {index === 0 && (
                  <div className="absolute top-0 right-0 bg-secondary text-dark-900 text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase">
                    Top Performer
                  </div>
                )}
                
                <h2 className="text-xl font-bold text-light-50 mb-4">{sacco.name}</h2>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-[10px] text-light-400 uppercase tracking-wider mb-1">Dividends (Shares)</p>
                    <p className="text-2xl font-black text-primary font-number">{sacco.dividendOnShares.toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-light-400 uppercase tracking-wider mb-1">Interest (Deposits)</p>
                    <p className="text-2xl font-black text-secondary font-number">{sacco.interestOnDeposits.toFixed(1)}%</p>
                  </div>
                </div>

                <div className="space-y-3 mb-8 flex-1 pt-4 border-t border-white/5">
                  <div className="flex justify-between text-sm">
                    <span className="text-light-400">Min. Monthly Saving</span>
                    <span className="text-light-200 font-mono">{formatCurrency(sacco.minMonthlySaving)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-light-400">Membership Fee</span>
                    <span className="text-light-200 font-mono">{formatCurrency(sacco.membershipFee)}</span>
                  </div>
                </div>

                <Link
                  to="/calculators/savings"
                  className="w-full py-3 rounded-xl text-center text-sm font-bold bg-white/5 text-light-50 hover:bg-primary hover:text-white transition-smooth border border-white/10"
                >
                  Project My Returns
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-12 grid md:grid-cols-2 gap-6">
            <div className="glass-card-light p-6">
              <h3 className="text-lg font-bold text-light-50 mb-3">Dividends on Shares</h3>
              <p className="text-sm text-light-400 leading-relaxed">
                Shares represent your ownership in the SACCO. They are non-withdrawable but can be 
                sold or transferred. Dividends are typically higher than interest on deposits.
              </p>
            </div>
            <div className="glass-card-light p-6">
              <h3 className="text-lg font-bold text-light-50 mb-3">Interest on Deposits</h3>
              <p className="text-sm text-light-400 leading-relaxed">
                Deposits are your monthly savings which determine your loan multiplier (usually 3x or 4x). 
                Interest is paid annually on these deposits.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
