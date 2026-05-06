import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../../components/seo/SEOHead';
import { calculateSavingsGrowth, formatCurrency, formatPercent } from '../../utils/calculations';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const faqData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is compound interest?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Compound interest is interest calculated on the initial principal, which also includes all of the accumulated interest from previous periods. It is essentially "interest on interest."',
      },
    },
    {
      '@type': 'Question',
      name: 'How does compounding frequency affect my returns?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The more frequently interest is compounded, the higher the final amount will be. Monthly compounding results in more interest than annual compounding on the same principal and interest rate.',
      },
    },
  ],
};

export default function InvestmentCalculator() {
  const [initialInvestment, setInitialInvestment] = useState(100000);
  const [monthlyContribution, setMonthlyContribution] = useState(5000);
  const [annualRate, setAnnualRate] = useState(10);
  const [years, setYears] = useState(10);
  const [compounding, setCompounding] = useState('monthly');

  const results = useMemo(
    () => calculateSavingsGrowth(initialInvestment, monthlyContribution, annualRate, years, compounding),
    [initialInvestment, monthlyContribution, annualRate, years, compounding]
  );

  const chartData = results.yearlyBreakdown.map(year => ({
    name: `Year ${year.year}`,
    Balance: Math.round(year.balance),
    Deposits: Math.round(year.deposits),
    Interest: Math.round(year.interest),
  }));

  return (
    <>
      <SEOHead
        title="Investment Returns Calculator Kenya | Compound Interest Tool - MoneyIQ"
        description="Plan your investments in Kenya. Calculate future returns with compound interest, monthly contributions, and various compounding frequencies."
        keywords="investment calculator Kenya, compound interest calculator, unit trust returns, MMF returns calculator"
        canonical="/calculators/investment"
        structuredData={faqData}
      />

      <main className="pt-20 pb-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-light-400 mb-8" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-light-50 transition-colors">Home</Link>
            <span>/</span>
            <Link to="/calculators" className="hover:text-light-50 transition-colors">Calculators</Link>
            <span>/</span>
            <span className="text-light-50">Investment Calculator</span>
          </nav>

          <div className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-light-50 mb-3">
              Investment <span className="gradient-text">Calculator</span>
            </h1>
            <p className="text-lg text-light-400 max-w-2xl">
              Project your wealth growth over time. See how small monthly contributions 
              and the power of compound interest can build significant wealth.
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2">
              <div className="glass-card p-6 lg:p-8 space-y-6 sticky top-24">
                <h2 className="text-lg font-semibold text-light-50">Investment Details</h2>

                <div>
                  <label className="block text-sm font-medium text-light-300 mb-2">Initial Investment</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-light-400 text-sm font-mono">KES</span>
                    <input
                      type="number" value={initialInvestment}
                      onChange={(e) => setInitialInvestment(Number(e.target.value))}
                      className="w-full pl-14 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-light-50 font-mono focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-light-300 mb-2">Monthly Contribution</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-light-400 text-sm font-mono">KES</span>
                    <input
                      type="number" value={monthlyContribution}
                      onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                      className="w-full pl-14 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-light-50 font-mono focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-light-300 mb-2">
                    Annual Return Rate: <span className="text-secondary font-mono">{annualRate}%</span>
                  </label>
                  <input type="range" min={1} max={30} step={0.5} value={annualRate}
                    onChange={(e) => setAnnualRate(Number(e.target.value))} className="w-full accent-secondary" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-light-300 mb-2">
                    Time Horizon: <span className="text-accent-light font-mono">{years} years</span>
                  </label>
                  <input type="range" min={1} max={40} step={1} value={years}
                    onChange={(e) => setYears(Number(e.target.value))} className="w-full accent-blue-500" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-light-300 mb-2">Compounding Frequency</label>
                  <select
                    value={compounding}
                    onChange={(e) => setCompounding(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-light-50 focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth appearance-none cursor-pointer"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="annually">Annually</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3 space-y-6">
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="glass-card p-5 text-center">
                  <p className="text-xs font-medium text-light-400 uppercase tracking-wider mb-1">Total Value</p>
                  <p className="text-2xl font-bold text-success font-number">{formatCurrency(results.finalAmount)}</p>
                </div>
                <div className="glass-card p-5 text-center">
                  <p className="text-xs font-medium text-light-400 uppercase tracking-wider mb-1">Total Principal</p>
                  <p className="text-2xl font-bold text-primary font-number">{formatCurrency(results.totalDeposits)}</p>
                </div>
                <div className="glass-card p-5 text-center">
                  <p className="text-xs font-medium text-light-400 uppercase tracking-wider mb-1">Interest Earned</p>
                  <p className="text-2xl font-bold text-secondary font-number">{formatCurrency(results.totalInterest)}</p>
                </div>
              </div>

              <div className="glass-card p-6">
                <h3 className="text-sm font-semibold text-light-300 uppercase tracking-wider mb-4">Wealth Accumulation</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="name" tick={{fill: '#94A3B8', fontSize: 12}} />
                      <YAxis tick={{fill: '#94A3B8', fontSize: 12}} tickFormatter={(v) => v >= 1000000 ? `${(v/1000000).toFixed(1)}M` : `${v/1000}K`} />
                      <Tooltip 
                        contentStyle={{backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px'}}
                        itemStyle={{color: '#F8FAFC'}}
                        formatter={(v) => formatCurrency(v)}
                      />
                      <Legend />
                      <Area type="monotone" dataKey="Balance" stroke="#10B981" fillOpacity={1} fill="url(#colorBalance)" />
                      <Area type="monotone" dataKey="Deposits" stroke="#2563EB" fillOpacity={0} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="glass-card p-6 lg:p-8">
                <h2 className="text-xl font-bold text-light-50 mb-6">Frequently Asked Questions</h2>
                <div className="space-y-6">
                  {faqData.mainEntity.map((faq, i) => (
                    <div key={i} className="border-b border-white/5 pb-5 last:border-0 last:pb-0">
                      <h3 className="text-base font-semibold text-light-100 mb-2">{faq.name}</h3>
                      <p className="text-sm text-light-400 leading-relaxed">{faq.acceptedAnswer.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
