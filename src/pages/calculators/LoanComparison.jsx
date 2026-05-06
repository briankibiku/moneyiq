import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../../components/seo/SEOHead';
import { useBankRates } from '../../hooks/useDataFetch';
import { calculateLoanRepayment, formatCurrency, formatPercent } from '../../utils/calculations';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#0A6E3D', '#FFB800', '#2563EB'];
const LABELS = ['Loan A', 'Loan B', 'Loan C'];

const emptyLoan = { amount: 1000000, rate: 14.0, years: 3, bank: '' };

export default function LoanComparison() {
  const { data: ratesData } = useBankRates();
  const [loans, setLoans] = useState([
    { amount: 1000000, rate: 14.0, years: 3, bank: '' },
    { amount: 1000000, rate: 15.5, years: 5, bank: '' },
    { amount: 1000000, rate: 13.0, years: 4, bank: '' },
  ]);

  const updateLoan = (index, field, value) => {
    setLoans((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      if (field === 'bank' && value && ratesData) {
        const bank = ratesData.banks.find((b) => b.id === value);
        if (bank) updated[index].rate = bank.personalLoanRate;
      }
      return updated;
    });
  };

  const results = useMemo(
    () => loans.map((loan) => calculateLoanRepayment(loan.amount, loan.rate, loan.years)),
    [loans]
  );

  // Find cheapest
  const cheapestIdx = results.reduce((minIdx, r, i) =>
    r.totalPayment < results[minIdx].totalPayment ? i : minIdx, 0);

  // Chart data
  const comparisonData = [
    {
      metric: 'Monthly Payment',
      ...Object.fromEntries(loans.map((_, i) => [LABELS[i], Math.round(results[i].monthlyPayment)])),
    },
    {
      metric: 'Total Interest',
      ...Object.fromEntries(loans.map((_, i) => [LABELS[i], Math.round(results[i].totalInterest)])),
    },
    {
      metric: 'Total Payment',
      ...Object.fromEntries(loans.map((_, i) => [LABELS[i], Math.round(results[i].totalPayment)])),
    },
  ];

  return (
    <>
      <SEOHead
        title="Loan Comparison Calculator Kenya | Compare Loan Offers Side by Side - MoneyIQ"
        description="Compare up to 3 loan offers side by side. See which bank or lender gives you the best deal based on total cost, monthly payment, and interest."
        keywords="loan comparison calculator Kenya, compare loans Kenya, best loan deal Kenya, loan comparison tool"
        canonical="/calculators/loan-comparison"
      />

      <main className="pt-20 pb-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-light-400 mb-8" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-light-50 transition-colors">Home</Link>
            <span>/</span>
            <Link to="/calculators" className="hover:text-light-50 transition-colors">Calculators</Link>
            <span>/</span>
            <span className="text-light-50">Loan Comparison</span>
          </nav>

          <div className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-light-50 mb-3">
              Loan Comparison <span className="gradient-text">Calculator</span>
            </h1>
            <p className="text-lg text-light-400 max-w-2xl">
              Comparing loan offers? Enter the details of up to 3 loans and instantly see which one
              saves you the most money.
            </p>
          </div>

          {/* Loan Input Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {loans.map((loan, i) => (
              <div key={i} className={`glass-card p-5 lg:p-6 space-y-4 relative ${
                i === cheapestIdx ? 'ring-2 ring-success/50' : ''
              }`}>
                {i === cheapestIdx && (
                  <div className="absolute -top-3 left-4 px-3 py-0.5 rounded-full bg-success text-white text-xs font-bold">
                    ✓ Best Deal
                  </div>
                )}
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <h3 className="text-sm font-semibold text-light-50">{LABELS[i]}</h3>
                </div>

                {/* Bank Selector */}
                {ratesData && (
                  <select
                    value={loan.bank}
                    onChange={(e) => updateLoan(i, 'bank', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-light-50 text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth appearance-none cursor-pointer"
                  >
                    <option value="">Custom Rate</option>
                    {ratesData.banks.map((bank) => (
                      <option key={bank.id} value={bank.id}>{bank.name}</option>
                    ))}
                  </select>
                )}

                {/* Amount */}
                <div>
                  <label className="block text-xs text-light-400 mb-1">Loan Amount (KES)</label>
                  <input
                    type="number" value={loan.amount}
                    onChange={(e) => updateLoan(i, 'amount', Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-light-50 text-sm font-mono focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth"
                  />
                </div>

                {/* Rate */}
                <div>
                  <label className="block text-xs text-light-400 mb-1">
                    Interest Rate: <span className="font-mono" style={{ color: COLORS[i] }}>{loan.rate}%</span>
                  </label>
                  <input type="range" min={5} max={30} step={0.25} value={loan.rate}
                    onChange={(e) => { updateLoan(i, 'rate', Number(e.target.value)); updateLoan(i, 'bank', ''); }}
                    className="w-full" style={{ accentColor: COLORS[i] }}
                  />
                </div>

                {/* Tenure */}
                <div>
                  <label className="block text-xs text-light-400 mb-1">
                    Tenure: <span className="font-mono" style={{ color: COLORS[i] }}>{loan.years} yrs</span>
                  </label>
                  <input type="range" min={1} max={30} step={1} value={loan.years}
                    onChange={(e) => updateLoan(i, 'years', Number(e.target.value))}
                    className="w-full" style={{ accentColor: COLORS[i] }}
                  />
                </div>

                {/* Mini Results */}
                <div className="pt-3 border-t border-white/5 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-light-400">Monthly</span>
                    <span className="font-mono font-semibold text-light-50">{formatCurrency(results[i].monthlyPayment)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-light-400">Total Interest</span>
                    <span className="font-mono font-semibold text-secondary">{formatCurrency(results[i].totalInterest)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-light-400">Total Payment</span>
                    <span className="font-mono font-bold" style={{ color: COLORS[i] }}>{formatCurrency(results[i].totalPayment)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Savings Insight */}
          {results.length >= 2 && (
            <div className="glass-card-light p-5 mb-8 flex items-start gap-3">
              <span className="text-2xl">💰</span>
              <div>
                <p className="text-base font-semibold text-light-50 mb-1">
                  {LABELS[cheapestIdx]} saves you the most!
                </p>
                <p className="text-sm text-light-400">
                  Choosing {LABELS[cheapestIdx]} over the most expensive option saves you{' '}
                  <span className="text-success font-mono font-bold">
                    {formatCurrency(
                      Math.max(...results.map((r) => r.totalPayment)) - results[cheapestIdx].totalPayment
                    )}
                  </span>{' '}
                  in total payments. That&apos;s{' '}
                  <span className="text-success font-mono font-bold">
                    {formatCurrency(
                      (Math.max(...results.map((r) => r.totalPayment)) - results[cheapestIdx].totalPayment) /
                        (loans[cheapestIdx].years * 12)
                    )}
                  </span>{' '}
                  per month you could save or invest elsewhere.
                </p>
              </div>
            </div>
          )}

          {/* Comparison Chart */}
          <div className="glass-card p-6 mb-8">
            <h3 className="text-sm font-semibold text-light-300 uppercase tracking-wider mb-4">Side-by-Side Comparison</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData} layout="vertical" barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                  <XAxis type="number" tick={{ fill: '#94A3B8', fontSize: 10 }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                    tickFormatter={(v) => v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` : `${(v / 1000).toFixed(0)}K`}
                  />
                  <YAxis type="category" dataKey="metric" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} width={110} />
                  <Tooltip formatter={(value) => formatCurrency(value)}
                    contentStyle={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#F8FAFC', fontSize: '12px' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', color: '#94A3B8' }} />
                  {LABELS.map((label, i) => (
                    <Bar key={label} dataKey={label} fill={COLORS[i]} radius={[0, 4, 4, 0]} barSize={16} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Detailed Comparison Table */}
          <div className="glass-card overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-white/5">
              <h3 className="text-sm font-semibold text-light-300 uppercase tracking-wider">Detailed Comparison</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-white/[0.03] text-xs text-light-400 uppercase tracking-wider">
                    <th className="px-6 py-3 text-left font-semibold">Metric</th>
                    {LABELS.map((label, i) => (
                      <th key={label} className="px-6 py-3 text-center font-semibold">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                          {label}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: 'Loan Amount', values: loans.map((l) => formatCurrency(l.amount)) },
                    { label: 'Interest Rate', values: loans.map((l) => formatPercent(l.rate)) },
                    { label: 'Tenure', values: loans.map((l) => `${l.years} years`) },
                    { label: 'Monthly Payment', values: results.map((r) => formatCurrency(r.monthlyPayment)), highlight: true },
                    { label: 'Total Interest', values: results.map((r) => formatCurrency(r.totalInterest)) },
                    { label: 'Total Payment', values: results.map((r) => formatCurrency(r.totalPayment)), highlight: true },
                    { label: 'Interest % of Loan', values: results.map((r, i) => formatPercent((r.totalInterest / loans[i].amount) * 100, 1)) },
                  ].map((row) => (
                    <tr key={row.label} className={`border-b border-white/5 ${row.highlight ? 'bg-white/[0.02]' : ''}`}>
                      <td className="px-6 py-3 text-light-300 font-medium">{row.label}</td>
                      {row.values.map((val, i) => (
                        <td key={i} className={`px-6 py-3 text-center font-mono ${
                          row.highlight && i === cheapestIdx ? 'text-success font-bold' : 'text-light-200'
                        }`}>
                          {val}
                          {row.highlight && i === cheapestIdx && <span className="ml-1 text-xs">✓</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tips */}
          <div className="glass-card p-6 lg:p-8">
            <h2 className="text-xl font-bold text-light-50 mb-4">Tips for Choosing the Right Loan</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { icon: '🎯', title: 'Look Beyond the Rate', desc: 'A lower interest rate doesn\'t always mean a cheaper loan. Compare the total payment amount, which accounts for both rate and tenure.' },
                { icon: '📅', title: 'Shorter Tenure = Less Interest', desc: 'Shorter loan terms mean higher monthly payments but significantly less total interest. Choose the shortest tenure you can comfortably afford.' },
                { icon: '💡', title: 'Check for Hidden Fees', desc: 'Some banks charge processing fees (1-3%), insurance premiums, or early repayment penalties. Factor these into your comparison.' },
                { icon: '🏦', title: 'Negotiate Your Rate', desc: 'Banks often offer preferential rates for existing customers, salaried employees, or those with check-off facilities. Always negotiate!' },
              ].map((tip) => (
                <div key={tip.title} className="flex gap-3 p-4 rounded-xl bg-white/[0.03]">
                  <span className="text-xl">{tip.icon}</span>
                  <div>
                    <h3 className="text-sm font-semibold text-light-50 mb-1">{tip.title}</h3>
                    <p className="text-xs text-light-400 leading-relaxed">{tip.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
