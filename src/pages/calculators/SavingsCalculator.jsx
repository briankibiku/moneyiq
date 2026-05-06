import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../../components/seo/SEOHead';
import { calculateSavingsGrowth, formatCurrency, formatPercent } from '../../utils/calculations';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const faqData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the best savings rate in Kenya?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Traditional savings account rates in Kenya range from 2.5% to 4% p.a. However, Money Market Funds (MMFs) offer significantly higher returns of 8-14% p.a. with easy access to your funds. Fixed deposits offer 5-9% depending on the tenure and bank.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does compound interest work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Compound interest means you earn interest on both your original deposit and the accumulated interest. For example, if you save KES 100,000 at 10% p.a. compounded monthly, after 1 year you\'d have approximately KES 110,471 — the extra KES 471 beyond simple interest comes from compounding.',
      },
    },
    {
      '@type': 'Question',
      name: 'Should I choose monthly, quarterly, or annual compounding?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Monthly compounding gives the highest returns because interest is calculated and added more frequently. The difference becomes more significant with larger amounts and longer periods. Always check how your bank compounds interest.',
      },
    },
  ],
};

const presetGoals = [
  { label: 'Emergency Fund', amount: 300000, months: 12, icon: '🛡️' },
  { label: 'Holiday Trip', amount: 200000, months: 6, icon: '✈️' },
  { label: 'Car Down Payment', amount: 500000, months: 24, icon: '🚗' },
  { label: 'Home Deposit', amount: 2000000, months: 60, icon: '🏠' },
  { label: 'Education Fund', amount: 1000000, months: 48, icon: '🎓' },
  { label: 'Wedding Fund', amount: 800000, months: 18, icon: '💍' },
];

export default function SavingsCalculator() {
  const [initialDeposit, setInitialDeposit] = useState(50000);
  const [monthlyContribution, setMonthlyContribution] = useState(10000);
  const [annualRate, setAnnualRate] = useState(8.0);
  const [years, setYears] = useState(5);
  const [compounding, setCompounding] = useState('monthly');
  const [activeGoal, setActiveGoal] = useState(null);

  const handleGoalSelect = (goal) => {
    setActiveGoal(goal.label);
    const goalYears = Math.ceil(goal.months / 12);
    setYears(goalYears);
    // Rough calculation of required monthly contribution
    const required = Math.round((goal.amount - initialDeposit) / goal.months);
    setMonthlyContribution(Math.max(1000, required));
  };

  const results = useMemo(
    () => calculateSavingsGrowth(initialDeposit, monthlyContribution, annualRate, years, compounding),
    [initialDeposit, monthlyContribution, annualRate, years, compounding]
  );

  // Chart data
  const chartData = results.yearlyBreakdown.map((yr) => ({
    year: `Year ${yr.year}`,
    deposits: Math.round(yr.deposits),
    interest: Math.round(yr.interest),
    balance: Math.round(yr.balance),
  }));

  const interestRatio = results.totalDeposits > 0
    ? ((results.totalInterest / results.totalDeposits) * 100).toFixed(1)
    : 0;

  return (
    <>
      <SEOHead
        title="Savings Calculator Kenya 2026 | Plan Your Savings Goals - MoneyIQ"
        description="Free savings calculator for Kenya. Plan your savings goals, see how compound interest grows your money, and calculate how much you need to save monthly."
        keywords="savings calculator Kenya, compound interest calculator, savings goal Kenya, investment calculator Kenya, how much to save monthly"
        canonical="/calculators/savings"
        structuredData={faqData}
      />

      <main className="pt-20 pb-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-light-400 mb-8" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-light-50 transition-colors">Home</Link>
            <span>/</span>
            <Link to="/calculators" className="hover:text-light-50 transition-colors">Calculators</Link>
            <span>/</span>
            <span className="text-light-50">Savings Calculator</span>
          </nav>

          <div className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-light-50 mb-3">
              Savings Goal Calculator <span className="gradient-text">Kenya</span>
            </h1>
            <p className="text-lg text-light-400 max-w-2xl">
              See how compound interest can supercharge your savings. Set a goal, choose your rate,
              and watch your money grow over time.
            </p>
          </div>

          {/* Quick Goals */}
          <div className="mb-8">
            <p className="text-sm font-medium text-light-300 mb-3">Quick Goals</p>
            <div className="flex flex-wrap gap-2">
              {presetGoals.map((goal) => (
                <button
                  key={goal.label}
                  onClick={() => handleGoalSelect(goal)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-smooth border ${
                    activeGoal === goal.label
                      ? 'bg-primary/15 border-primary/40 text-primary'
                      : 'bg-white/5 border-white/10 text-light-300 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  <span>{goal.icon}</span>
                  {goal.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Input Form */}
            <div className="lg:col-span-2">
              <div className="glass-card p-6 lg:p-8 space-y-6 sticky top-24">
                <h2 className="text-lg font-semibold text-light-50">Savings Details</h2>

                {/* Initial Deposit */}
                <div>
                  <label htmlFor="initial-deposit" className="block text-sm font-medium text-light-300 mb-2">
                    Initial Deposit
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-light-400 text-sm font-mono">KES</span>
                    <input
                      id="initial-deposit"
                      type="number" value={initialDeposit}
                      onChange={(e) => setInitialDeposit(Number(e.target.value))}
                      className="w-full pl-14 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-light-50 font-mono focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth"
                    />
                  </div>
                  <input type="range" min={0} max={5000000} step={10000} value={initialDeposit}
                    onChange={(e) => setInitialDeposit(Number(e.target.value))}
                    className="w-full mt-2 accent-primary"
                  />
                </div>

                {/* Monthly Contribution */}
                <div>
                  <label htmlFor="monthly-contrib" className="block text-sm font-medium text-light-300 mb-2">
                    Monthly Contribution: <span className="text-primary font-mono">{formatCurrency(monthlyContribution)}</span>
                  </label>
                  <input id="monthly-contrib" type="range" min={0} max={200000} step={1000}
                    value={monthlyContribution}
                    onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                  <div className="flex justify-between text-xs text-light-400 font-mono"><span>0</span><span>200K</span></div>
                </div>

                {/* Annual Rate */}
                <div>
                  <label htmlFor="savings-rate" className="block text-sm font-medium text-light-300 mb-2">
                    Annual Interest Rate: <span className="text-secondary font-mono">{annualRate}%</span>
                  </label>
                  <input id="savings-rate" type="range" min={1} max={20} step={0.25}
                    value={annualRate}
                    onChange={(e) => setAnnualRate(Number(e.target.value))}
                    className="w-full accent-secondary"
                  />
                  <div className="flex justify-between text-xs text-light-400"><span>1%</span><span>20%</span></div>
                  <div className="flex gap-2 mt-2">
                    {[
                      { label: 'Savings Acc (~3%)', rate: 3 },
                      { label: 'MMF (~10%)', rate: 10 },
                      { label: 'Fixed Dep (~8%)', rate: 8 },
                    ].map((preset) => (
                      <button key={preset.label} onClick={() => setAnnualRate(preset.rate)}
                        className="text-[10px] px-2 py-1 rounded-lg bg-white/5 text-light-400 hover:bg-white/10 hover:text-light-200 transition-smooth">
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Years */}
                <div>
                  <label htmlFor="savings-years" className="block text-sm font-medium text-light-300 mb-2">
                    Time Period: <span className="text-accent-light font-mono">{years} {years === 1 ? 'year' : 'years'}</span>
                  </label>
                  <input id="savings-years" type="range" min={1} max={30} step={1}
                    value={years} onChange={(e) => setYears(Number(e.target.value))}
                    className="w-full accent-blue-500"
                  />
                  <div className="flex justify-between text-xs text-light-400"><span>1 yr</span><span>30 yrs</span></div>
                </div>

                {/* Compounding */}
                <div>
                  <label className="block text-sm font-medium text-light-300 mb-2">Compounding Frequency</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['monthly', 'quarterly', 'annually'].map((opt) => (
                      <button key={opt} onClick={() => setCompounding(opt)}
                        className={`px-3 py-2 rounded-lg text-xs font-medium capitalize transition-smooth border ${
                          compounding === opt
                            ? 'bg-primary/15 border-primary/40 text-primary'
                            : 'bg-white/5 border-white/10 text-light-400 hover:bg-white/10'
                        }`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="lg:col-span-3 space-y-6">
              {/* Key Results */}
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="glass-card p-5 text-center">
                  <p className="text-xs font-medium text-light-400 uppercase tracking-wider mb-1">Final Amount</p>
                  <p className="text-2xl lg:text-3xl font-bold text-success font-number">
                    {formatCurrency(results.finalAmount)}
                  </p>
                </div>
                <div className="glass-card p-5 text-center">
                  <p className="text-xs font-medium text-light-400 uppercase tracking-wider mb-1">Total Deposited</p>
                  <p className="text-2xl lg:text-3xl font-bold text-primary font-number">
                    {formatCurrency(results.totalDeposits)}
                  </p>
                </div>
                <div className="glass-card p-5 text-center">
                  <p className="text-xs font-medium text-light-400 uppercase tracking-wider mb-1">Interest Earned</p>
                  <p className="text-2xl lg:text-3xl font-bold text-secondary font-number">
                    {formatCurrency(results.totalInterest)}
                  </p>
                </div>
              </div>

              {/* Insight card */}
              <div className="glass-card-light p-4 flex items-start gap-3">
                <span className="text-xl">🚀</span>
                <div>
                  <p className="text-sm text-light-200 font-medium">Compound Interest Power</p>
                  <p className="text-sm text-light-400">
                    You deposited <span className="text-light-50 font-mono">{formatCurrency(results.totalDeposits)}</span> and
                    earned an extra <span className="text-secondary font-mono">{formatCurrency(results.totalInterest)}</span> in
                    interest — that&apos;s a <span className="text-success font-mono">{interestRatio}%</span> bonus on your deposits!
                    {compounding !== 'monthly' && (
                      <span className="text-primary"> Tip: Switch to monthly compounding for even higher returns.</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Area Chart */}
              <div className="glass-card p-6">
                <h3 className="text-sm font-semibold text-light-300 uppercase tracking-wider mb-4">Growth Over Time</h3>
                <div className="h-64 sm:h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="depositsGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0A6E3D" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#0A6E3D" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="interestGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#FFB800" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#FFB800" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="year" tick={{ fill: '#94A3B8', fontSize: 10 }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} interval={Math.max(0, Math.floor(chartData.length / 6))} />
                      <YAxis tick={{ fill: '#94A3B8', fontSize: 10 }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} tickFormatter={(v) => v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` : `${(v / 1000).toFixed(0)}K`} />
                      <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#F8FAFC', fontSize: '12px' }} />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', color: '#94A3B8' }} />
                      <Area type="monotone" dataKey="deposits" name="Deposits" stroke="#0A6E3D" strokeWidth={2} fill="url(#depositsGrad)" stackId="1" />
                      <Area type="monotone" dataKey="interest" name="Interest Earned" stroke="#FFB800" strokeWidth={2} fill="url(#interestGrad)" stackId="1" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Yearly Breakdown Table */}
              <div className="glass-card overflow-hidden">
                <div className="px-6 py-4 border-b border-white/5">
                  <h3 className="text-sm font-semibold text-light-300 uppercase tracking-wider">Year-by-Year Breakdown</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-white/[0.03] text-xs text-light-400 uppercase tracking-wider">
                        <th className="px-6 py-3 text-left font-semibold">Year</th>
                        <th className="px-6 py-3 text-right font-semibold">Total Deposited</th>
                        <th className="px-6 py-3 text-right font-semibold">Interest Earned</th>
                        <th className="px-6 py-3 text-right font-semibold">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.yearlyBreakdown.map((yr) => (
                        <tr key={yr.year} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                          <td className="px-6 py-3 text-light-50 font-mono">{yr.year}</td>
                          <td className="px-6 py-3 text-right text-primary font-mono">{formatCurrency(yr.deposits)}</td>
                          <td className="px-6 py-3 text-right text-secondary font-mono">{formatCurrency(yr.interest)}</td>
                          <td className="px-6 py-3 text-right text-light-50 font-mono font-semibold">{formatCurrency(yr.balance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* FAQ */}
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
