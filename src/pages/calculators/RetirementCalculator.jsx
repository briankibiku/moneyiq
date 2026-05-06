import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../../components/seo/SEOHead';
import { formatCurrency } from '../../utils/calculations';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const faqData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much do I need for retirement in Kenya?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A common rule of thumb is the "70% rule," which suggests you should aim for 70% of your pre-retirement income to maintain your lifestyle. However, this depends on your expected expenses and health costs.',
      },
    },
    {
      '@type': 'Question',
      name: 'What are the main retirement savings vehicles in Kenya?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Primary options include NSSF (mandatory), individual pension schemes, employee-sponsored schemes, and voluntary contributions to insurance-linked pension products.',
      },
    },
  ],
};

export default function RetirementCalculator() {
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(60);
  const [currentSavings, setCurrentSavings] = useState(500000);
  const [monthlyContribution, setMonthlyContribution] = useState(15000);
  const [expectedReturn, setExpectedReturn] = useState(10);
  const [monthlyExpenseAfterRetirement, setMonthlyExpenseAfterRetirement] = useState(80000);

  const yearsToRetirement = retirementAge - currentAge;

  const results = useMemo(() => {
    if (yearsToRetirement <= 0) return null;

    let balance = currentSavings;
    const yearlyData = [];
    const monthlyRate = expectedReturn / 100 / 12;

    for (let year = 1; year <= yearsToRetirement; year++) {
      for (let month = 1; month <= 12; month++) {
        balance = (balance + monthlyContribution) * (1 + monthlyRate);
      }
      yearlyData.push({
        year: currentAge + year,
        Balance: Math.round(balance),
      });
    }

    // Rough estimate of how long the fund will last
    // Safe withdrawal rate of 4%
    const annualIncomePossible = balance * 0.04;
    const monthlyIncomePossible = annualIncomePossible / 12;

    return {
      finalBalance: balance,
      monthlyIncomePossible,
      yearlyData,
      isGoalMet: monthlyIncomePossible >= monthlyExpenseAfterRetirement,
    };
  }, [currentAge, retirementAge, currentSavings, monthlyContribution, expectedReturn, monthlyExpenseAfterRetirement]);

  return (
    <>
      <SEOHead
        title="Retirement Calculator Kenya | Pension Planning Tool - MoneyIQ"
        description="Plan your retirement in Kenya. Estimate your future pension fund, monthly income after retirement, and see if your current savings are enough."
        keywords="retirement calculator Kenya, pension calculator, NSSF calculator, retirement planning Kenya"
        canonical="/calculators/retirement"
        structuredData={faqData}
      />

      <main className="pt-20 pb-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-light-400 mb-8" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-light-50 transition-colors">Home</Link>
            <span>/</span>
            <Link to="/calculators" className="hover:text-light-50 transition-colors">Calculators</Link>
            <span>/</span>
            <span className="text-light-50">Retirement Calculator</span>
          </nav>

          <div className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-light-50 mb-3">
              Retirement <span className="gradient-text">Planner</span>
            </h1>
            <p className="text-lg text-light-400 max-w-2xl">
              Will you have enough to live comfortably? Estimate your nest egg and 
              the monthly income it can generate based on your current saving habits.
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2">
              <div className="glass-card p-6 lg:p-8 space-y-5 sticky top-24">
                <h2 className="text-lg font-semibold text-light-50">Planning Inputs</h2>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-light-400 mb-2">Current Age</label>
                    <input type="number" value={currentAge} onChange={(e) => setCurrentAge(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-light-50 font-mono text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-light-400 mb-2">Retirement Age</label>
                    <input type="number" value={retirementAge} onChange={(e) => setRetirementAge(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-light-50 font-mono text-sm" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-light-300 mb-2">Current Pension/Savings</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-light-400 text-sm font-mono">KES</span>
                    <input
                      type="number" value={currentSavings}
                      onChange={(e) => setCurrentSavings(Number(e.target.value))}
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
                  <label className="block text-sm font-medium text-light-300 mb-2">Expected Annual Return (%)</label>
                  <input type="range" min={1} max={20} step={0.5} value={expectedReturn}
                    onChange={(e) => setExpectedReturn(Number(e.target.value))} className="w-full accent-primary" />
                  <div className="text-right text-xs text-light-400 font-mono mt-1">{expectedReturn}%</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-light-300 mb-2">Desired Monthly Income</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-light-400 text-sm font-mono">KES</span>
                    <input
                      type="number" value={monthlyExpenseAfterRetirement}
                      onChange={(e) => setMonthlyExpenseAfterRetirement(Number(e.target.value))}
                      className="w-full pl-14 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-light-50 font-mono focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3 space-y-6">
              {results && (
                <>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="glass-card p-6 text-center border border-primary/20">
                      <p className="text-xs font-medium text-light-400 uppercase tracking-wider mb-2">Fund at Retirement</p>
                      <p className="text-3xl lg:text-4xl font-bold text-primary font-number">{formatCurrency(results.finalBalance)}</p>
                    </div>
                    <div className="glass-card p-6 text-center">
                      <p className="text-xs font-medium text-light-400 uppercase tracking-wider mb-2">Est. Monthly Income</p>
                      <p className={`text-3xl lg:text-4xl font-bold font-number ${results.isGoalMet ? 'text-success' : 'text-warning'}`}>
                        {formatCurrency(results.monthlyIncomePossible)}
                      </p>
                    </div>
                  </div>

                  <div className={`p-4 rounded-xl border flex items-start gap-3 ${results.isGoalMet ? 'bg-success/10 border-success/30 text-success' : 'bg-warning/10 border-warning/30 text-warning'}`}>
                    <span className="text-xl">{results.isGoalMet ? '✅' : '⚠️'}</span>
                    <div>
                      <p className="font-bold">{results.isGoalMet ? 'Retirement Goal Met!' : 'Retirement Shortfall Detected'}</p>
                      <p className="text-sm opacity-90">
                        {results.isGoalMet 
                          ? `Your projected income of ${formatCurrency(results.monthlyIncomePossible)} meets your desired ${formatCurrency(monthlyExpenseAfterRetirement)}.`
                          : `You may fall short by ${formatCurrency(monthlyExpenseAfterRetirement - results.monthlyIncomePossible)} per month. Consider increasing contributions.`}
                      </p>
                    </div>
                  </div>

                  <div className="glass-card p-6">
                    <h3 className="text-sm font-semibold text-light-300 uppercase tracking-wider mb-4">Pension Growth</h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={results.yearlyData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                          <XAxis dataKey="year" tick={{fill: '#94A3B8', fontSize: 12}} />
                          <YAxis tick={{fill: '#94A3B8', fontSize: 12}} tickFormatter={(v) => `${(v/1000000).toFixed(1)}M`} />
                          <Tooltip 
                            contentStyle={{backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px'}}
                            itemStyle={{color: '#F8FAFC'}}
                            formatter={(v) => formatCurrency(v)}
                          />
                          <Bar dataKey="Balance" fill="#0A6E3D" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </>
              )}

              {!results && (
                <div className="glass-card p-12 text-center text-light-400">
                  Please ensure Retirement Age is greater than Current Age.
                </div>
              )}

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
