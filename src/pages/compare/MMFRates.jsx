import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../../components/seo/SEOHead';
import { useBankRates } from '../../hooks/useDataFetch';
import { formatCurrency } from '../../utils/calculations';

export default function MMFRates() {
  const { data: ratesData, loading } = useBankRates();

  const sortedMMFs = useMemo(() => {
    if (!ratesData?.moneyMarketFunds) return [];
    return [...ratesData.moneyMarketFunds].sort((a, b) => b.yield - a.yield);
  }, [ratesData]);

  if (loading) {
    return (
      <main className="pt-20 pb-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 w-48 bg-white/5 rounded" />
            <div className="h-12 w-full bg-white/5 rounded-xl" />
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
        title="Best Money Market Fund (MMF) Rates in Kenya 2026 - MoneyIQ"
        description="Compare daily yields and interest rates for Money Market Funds in Kenya. See minimum investment and top-up requirements for CIC, Sanlam, Britam, and more."
        keywords="MMF rates Kenya, best money market fund Kenya, CIC MMF yield, unit trust rates Kenya"
        canonical="/compare/mmf"
      />

      <main className="pt-20 pb-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-light-400 mb-8" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-light-50 transition-colors">Home</Link>
            <span>/</span>
            <Link to="/compare" className="hover:text-light-50 transition-colors">Compare Rates</Link>
            <span>/</span>
            <span className="text-light-50">Money Market Funds</span>
          </nav>

          <div className="mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-light-50 mb-3">
              Money Market Fund <span className="gradient-text">Rates</span>
            </h1>
            <p className="text-lg text-light-400 max-w-2xl">
              Compare current yields for the top Money Market Funds in Kenya. 
              Earn higher returns than traditional savings accounts with easy liquidity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedMMFs.map((mmf, index) => (
              <div key={mmf.id} className="glass-card p-6 flex flex-col relative overflow-hidden group">
                {index === 0 && (
                  <div className="absolute top-0 right-0 bg-secondary text-dark-900 text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase">
                    Highest Yield
                  </div>
                )}
                
                <h2 className="text-xl font-bold text-light-50 mb-1">{mmf.name}</h2>
                <div className="text-4xl font-black text-primary mb-6 font-number">
                  {mmf.yield.toFixed(2)}% <span className="text-xs font-normal text-light-400">p.a.</span>
                </div>

                <div className="space-y-3 mb-8 flex-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-light-400">Min. Investment</span>
                    <span className="text-light-200 font-mono">{formatCurrency(mmf.minInvestment)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-light-400">Min. Top-up</span>
                    <span className="text-light-200 font-mono">{formatCurrency(mmf.topUp)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-light-400">Regulation</span>
                    <span className="text-light-200 font-semibold text-[10px] uppercase bg-white/5 px-2 py-0.5 rounded">CMA Regulated</span>
                  </div>
                </div>

                <Link
                  to="/calculators/investment"
                  className="w-full py-3 rounded-xl text-center text-sm font-bold bg-white/5 text-light-50 hover:bg-primary hover:text-white transition-smooth border border-white/10"
                >
                  Calculate Growth
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 glass-card-light border-l-4 border-secondary">
            <h3 className="text-lg font-bold text-light-50 mb-2">💡 Quick Tip</h3>
            <p className="text-sm text-light-400 leading-relaxed">
              Money Market Funds are ideal for your emergency fund or saving for short-term goals. 
              While the yield fluctuates daily based on market conditions, they historically 
              outperform traditional bank savings accounts by 2-3x.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
