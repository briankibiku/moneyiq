import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../../components/seo/SEOHead';
import { useDataFetch } from '../../hooks/useDataFetch';
import { formatNumber } from '../../utils/calculations';

export default function ExchangeRates() {
  const { data, loading } = useDataFetch('exchange-rates.json');
  
  const [amount, setAmount] = useState(1);
  const [direction, setDirection] = useState('toKES'); // toKES or fromKES
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  const exchangeResult = useMemo(() => {
    if (!data?.rates) return 0;
    const rateObj = data.rates.find(r => r.code === selectedCurrency);
    if (!rateObj) return 0;

    if (direction === 'toKES') {
      return amount * rateObj.buy;
    } else {
      return amount / rateObj.sell;
    }
  }, [data, amount, direction, selectedCurrency]);

  if (loading) {
    return (
      <main className="pt-20 pb-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
          <div className="h-8 w-48 bg-white/5 rounded mb-8" />
          <div className="h-64 w-full bg-white/5 rounded-2xl mb-8" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-16 w-full bg-white/5 rounded-xl" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <SEOHead
        title="Live Exchange Rates Kenya | KES Currency Converter - MoneyIQ"
        description="Check live exchange rates for USD, GBP, EUR and regional currencies against the Kenya Shilling. Use our instant currency converter."
        keywords="exchange rates Kenya, USD to KES, GBP to KES, currency converter Kenya, CBK exchange rates"
        canonical="/compare/exchange-rates"
      />

      <main className="pt-20 pb-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-light-400 mb-8" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-light-50 transition-colors">Home</Link>
            <span>/</span>
            <Link to="/compare" className="hover:text-light-50 transition-colors">Compare Rates</Link>
            <span>/</span>
            <span className="text-light-50">Exchange Rates</span>
          </nav>

          <div className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-light-50 mb-3">
              Currency <span className="gradient-text">Exchange Rates</span>
            </h1>
            <p className="text-lg text-light-400 max-w-2xl">
              Real-time indicative exchange rates for major global and regional currencies 
              against the Kenya Shilling (KES).
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Converter Card */}
            <div className="lg:col-span-1">
              <div className="glass-card p-6 lg:p-8 sticky top-24">
                <h2 className="text-xl font-bold text-light-50 mb-6 flex items-center gap-2">
                  <span>🔄</span> Instant Converter
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-light-300 mb-2">I want to convert</label>
                    <div className="flex bg-white/5 rounded-xl border border-white/10 overflow-hidden p-1">
                      <button 
                        onClick={() => setDirection('toKES')}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-smooth ${direction === 'toKES' ? 'bg-primary text-white shadow-lg' : 'text-light-400 hover:text-light-200'}`}
                      >
                        To KES
                      </button>
                      <button 
                        onClick={() => setDirection('fromKES')}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-smooth ${direction === 'fromKES' ? 'bg-primary text-white shadow-lg' : 'text-light-400 hover:text-light-200'}`}
                      >
                        From KES
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-light-300 mb-2">Amount</label>
                    <input 
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-light-50 font-mono focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-light-300 mb-2">Currency</label>
                    <select 
                      value={selectedCurrency}
                      onChange={(e) => setSelectedCurrency(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-light-50 focus:ring-2 focus:ring-primary focus:border-transparent outline-none appearance-none cursor-pointer"
                    >
                      {data?.rates.map(r => (
                        <option key={r.code} value={r.code}>{r.flag} {r.code} - {r.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="pt-6 border-t border-white/5">
                    <p className="text-xs text-light-400 uppercase tracking-wider mb-2">Result</p>
                    <div className="text-3xl font-black text-primary font-number">
                      {direction === 'toKES' ? 'KES ' : `${selectedCurrency} `}
                      {formatNumber(exchangeResult)}
                    </div>
                    <p className="text-[10px] text-light-400 mt-2 italic">
                      * Using current indicative {direction === 'toKES' ? 'Buying' : 'Selling'} rate.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Rates Table */}
            <div className="lg:col-span-2">
              <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white/5 border-b border-white/10">
                        <th className="px-6 py-4 text-xs font-bold text-light-400 uppercase tracking-wider">Currency</th>
                        <th className="px-6 py-4 text-xs font-bold text-light-400 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-4 text-xs font-bold text-light-400 uppercase tracking-wider text-right">Buying (KES)</th>
                        <th className="px-6 py-4 text-xs font-bold text-light-400 uppercase tracking-wider text-right">Selling (KES)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {data?.rates.map((rate) => (
                        <tr key={rate.code} className="hover:bg-white/[0.03] transition-colors group">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{rate.flag}</span>
                              <span className="font-bold text-light-50 group-hover:text-primary transition-colors">{rate.code}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-light-400">
                            {rate.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right font-mono text-sm text-success">
                            {rate.buy.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right font-mono text-sm text-red-400">
                            {rate.sell.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-6 py-4 bg-white/[0.02] border-t border-white/5 flex justify-between items-center text-[10px] text-light-400">
                  <span>Source: Central Bank of Kenya</span>
                  <span>Last Updated: {new Date(data?.lastUpdated).toLocaleString('en-KE')}</span>
                </div>
              </div>

              <div className="mt-8 grid sm:grid-cols-2 gap-4">
                <div className="glass-card-light p-4 flex gap-4 items-center">
                  <div className="text-2xl">📉</div>
                  <div>
                    <h4 className="text-sm font-bold text-light-50">Buying Rate</h4>
                    <p className="text-xs text-light-400">The rate the bank buys foreign currency from you.</p>
                  </div>
                </div>
                <div className="glass-card-light p-4 flex gap-4 items-center">
                  <div className="text-2xl">📈</div>
                  <div>
                    <h4 className="text-sm font-bold text-light-50">Selling Rate</h4>
                    <p className="text-xs text-light-400">The rate the bank sells foreign currency to you.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
