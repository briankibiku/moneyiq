import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../../components/seo/SEOHead';
import { formatCurrency } from '../../utils/calculations';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const HELB_RATE = 4.0; // HELB annual interest rate
const HELB_PENALTY_RATE = 10.0; // penalty for default

const faqData = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'What is the HELB loan interest rate?', acceptedAnswer: { '@type': 'Answer', text: 'HELB charges a 4% annual interest rate on the outstanding loan balance. This is significantly lower than commercial bank rates, making it important to prioritize other higher-interest debts first.' }},
    { '@type': 'Question', name: 'When do I start repaying my HELB loan?', acceptedAnswer: { '@type': 'Answer', text: 'Repayment begins one year after completing your studies. If you are employed, your employer is required to deduct the repayment from your salary. Self-employed individuals must make direct payments.' }},
    { '@type': 'Question', name: 'What happens if I don\'t repay my HELB loan?', acceptedAnswer: { '@type': 'Answer', text: 'Defaulting attracts a 10% penalty on the outstanding balance. HELB can also list you with Credit Reference Bureaus (CRBs), preventing you from accessing credit facilities. They may also pursue legal action.' }},
    { '@type': 'Question', name: 'Can I negotiate a lower monthly HELB repayment?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. If the standard deduction is too high, you can apply to HELB for a reduced monthly repayment amount, especially if you are earning below KES 50,000 per month.' }},
  ],
};

function calculateHELBRepayment(principal, monthlyPayment, annualRate) {
  const monthlyRate = annualRate / 100 / 12;
  let balance = principal;
  const schedule = [];
  let month = 0;
  let totalPaid = 0;
  let totalInterest = 0;

  while (balance > 0 && month < 360) { // max 30 years safety
    month++;
    const interest = balance * monthlyRate;
    const principalPaid = Math.min(monthlyPayment - interest, balance);

    if (monthlyPayment <= interest) {
      // Payment doesn't cover interest — loan will never be paid off
      return { schedule: [], totalPaid: 0, totalInterest: 0, months: Infinity, error: true };
    }

    balance = Math.max(0, balance - principalPaid);
    totalPaid += monthlyPayment;
    totalInterest += interest;

    schedule.push({
      month,
      payment: month === Math.ceil(principal / (monthlyPayment - interest)) + 1 ? balance + interest : monthlyPayment,
      principal: principalPaid,
      interest,
      balance,
    });
  }

  return { schedule, totalPaid, totalInterest, months: month, error: false };
}

export default function HELBCalculator() {
  const [totalLoan, setTotalLoan] = useState(400000);
  const [monthlyRepayment, setMonthlyRepayment] = useState(5000);
  const [graduationYear, setGraduationYear] = useState(2024);

  const results = useMemo(() => calculateHELBRepayment(totalLoan, monthlyRepayment, HELB_RATE), [totalLoan, monthlyRepayment]);

  const completionYear = graduationYear + 1 + Math.ceil(results.months / 12);
  const completionDate = results.error ? 'Never (payment too low!)' : `~${completionYear}`;

  // Chart data — yearly balances
  const chartData = results.schedule
    .filter((_, i) => (i + 1) % 12 === 0)
    .map((entry) => ({ year: `${graduationYear + 1 + entry.month / 12}`, balance: Math.round(entry.balance) }));

  return (
    <>
      <SEOHead title="HELB Loan Repayment Calculator 2026 | Kenya Student Loan - MoneyIQ"
        description="Calculate your HELB loan repayment schedule. See when you'll be debt-free, total interest, and plan your monthly repayments."
        keywords="HELB calculator, HELB loan repayment, HELB interest rate, student loan Kenya, HELB repayment schedule"
        canonical="/calculators/helb" structuredData={faqData} />

      <main className="pt-20 pb-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-light-400 mb-8" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-light-50 transition-colors">Home</Link><span>/</span>
            <Link to="/calculators" className="hover:text-light-50 transition-colors">Calculators</Link><span>/</span>
            <span className="text-light-50">HELB</span>
          </nav>

          <div className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-light-50 mb-3">HELB Loan Repayment <span className="gradient-text">Calculator</span></h1>
            <p className="text-lg text-light-400 max-w-2xl">
              Plan your HELB student loan repayment. See exactly when you&apos;ll be debt-free and how much interest you&apos;ll pay at the {HELB_RATE}% annual rate.
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2">
              <div className="glass-card p-6 lg:p-8 space-y-6 sticky top-24">
                <h2 className="text-lg font-semibold text-light-50">Your HELB Loan</h2>

                {/* Quick Presets */}
                <div>
                  <label className="block text-sm font-medium text-light-300 mb-2">Quick Preset</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: '4-Year Degree', amount: 400000 },
                      { label: '5-Year Degree', amount: 500000 },
                      { label: '2-Year Diploma', amount: 200000 },
                      { label: 'Masters', amount: 600000 },
                    ].map((p) => (
                      <button key={p.label} onClick={() => setTotalLoan(p.amount)}
                        className={`px-3 py-2 rounded-lg text-xs font-medium transition-smooth border ${totalLoan === p.amount ? 'bg-primary/15 border-primary/40 text-primary' : 'bg-white/5 border-white/10 text-light-400 hover:bg-white/10'}`}>
                        🎓 {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="helb-total" className="block text-sm font-medium text-light-300 mb-2">Total Loan Amount</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-light-400 text-sm font-mono">KES</span>
                    <input id="helb-total" type="number" value={totalLoan} onChange={(e) => setTotalLoan(Number(e.target.value))}
                      className="w-full pl-14 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-light-50 font-mono focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth" />
                  </div>
                  <input type="range" min={50000} max={1000000} step={10000} value={totalLoan} onChange={(e) => setTotalLoan(Number(e.target.value))} className="w-full mt-2 accent-primary" />
                </div>

                <div>
                  <label htmlFor="helb-monthly" className="block text-sm font-medium text-light-300 mb-2">
                    Monthly Repayment: <span className="text-primary font-mono">{formatCurrency(monthlyRepayment)}</span>
                  </label>
                  <input id="helb-monthly" type="range" min={1500} max={30000} step={500} value={monthlyRepayment}
                    onChange={(e) => setMonthlyRepayment(Number(e.target.value))} className="w-full accent-primary" />
                  <div className="flex justify-between text-xs text-light-400 font-mono"><span>1.5K</span><span>30K</span></div>
                  <div className="flex gap-2 mt-2">
                    {[3000, 5000, 8000, 15000].map((amt) => (
                      <button key={amt} onClick={() => setMonthlyRepayment(amt)}
                        className="text-[10px] px-2 py-1 rounded-lg bg-white/5 text-light-400 hover:bg-white/10 transition-smooth font-mono">
                        {(amt / 1000).toFixed(0)}K
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="grad-year" className="block text-sm font-medium text-light-300 mb-2">Graduation Year</label>
                  <select id="grad-year" value={graduationYear} onChange={(e) => setGraduationYear(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-light-50 focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth appearance-none cursor-pointer">
                    {Array.from({ length: 15 }, (_, i) => 2018 + i).map((yr) => <option key={yr} value={yr}>{yr}</option>)}
                  </select>
                </div>

                <div className="pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2 text-xs text-light-400">
                    <span className="text-yellow-400">ℹ️</span>
                    <span>HELB rate: {HELB_RATE}% p.a. | Penalty rate: {HELB_PENALTY_RATE}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3 space-y-6">
              {/* Error state */}
              {results.error && (
                <div className="glass-card p-6 border-2 border-red-500/30 text-center">
                  <p className="text-xl text-red-400 font-bold mb-2">⚠️ Payment Too Low!</p>
                  <p className="text-sm text-light-400">Your monthly payment of {formatCurrency(monthlyRepayment)} doesn&apos;t even cover the monthly interest. Increase your repayment to at least <span className="text-warning font-mono font-bold">{formatCurrency(Math.ceil(totalLoan * HELB_RATE / 100 / 12) + 100)}</span>/month.</p>
                </div>
              )}

              {!results.error && (
                <>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="glass-card p-4 text-center">
                      <p className="text-[10px] font-medium text-light-400 uppercase tracking-wider mb-1">Debt-Free By</p>
                      <p className="text-2xl font-bold text-success font-number">{completionDate}</p>
                    </div>
                    <div className="glass-card p-4 text-center">
                      <p className="text-[10px] font-medium text-light-400 uppercase tracking-wider mb-1">Time to Clear</p>
                      <p className="text-2xl font-bold text-primary font-number">{Math.floor(results.months / 12)}y {results.months % 12}m</p>
                    </div>
                    <div className="glass-card p-4 text-center">
                      <p className="text-[10px] font-medium text-light-400 uppercase tracking-wider mb-1">Total Interest</p>
                      <p className="text-2xl font-bold text-secondary font-number">{formatCurrency(results.totalInterest)}</p>
                    </div>
                    <div className="glass-card p-4 text-center">
                      <p className="text-[10px] font-medium text-light-400 uppercase tracking-wider mb-1">Total Paid</p>
                      <p className="text-2xl font-bold text-light-50 font-number">{formatCurrency(results.totalPaid)}</p>
                    </div>
                  </div>

                  <div className="glass-card-light p-4 flex items-start gap-3">
                    <span className="text-xl">🎓</span>
                    <p className="text-sm text-light-400">
                      At <span className="text-primary font-mono font-medium">{formatCurrency(monthlyRepayment)}/month</span>, you&apos;ll
                      clear your HELB loan of <span className="text-light-50 font-mono">{formatCurrency(totalLoan)}</span> in{' '}
                      <span className="text-success font-bold">{Math.floor(results.months / 12)} years and {results.months % 12} months</span>, paying{' '}
                      <span className="text-secondary font-mono">{formatCurrency(results.totalInterest)}</span> in total interest.
                      {monthlyRepayment < 5000 && <span className="text-warning"> Tip: Increasing your monthly payment saves significant interest over time.</span>}
                    </p>
                  </div>

                  {chartData.length > 1 && (
                    <div className="glass-card p-6">
                      <h3 className="text-sm font-semibold text-light-300 uppercase tracking-wider mb-4">Balance Over Time</h3>
                      <div className="h-56">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData}>
                            <defs><linearGradient id="helbGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0A6E3D" stopOpacity={0.4} /><stop offset="95%" stopColor="#0A6E3D" stopOpacity={0} /></linearGradient></defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="year" tick={{ fill: '#94A3B8', fontSize: 10 }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} />
                            <YAxis tick={{ fill: '#94A3B8', fontSize: 10 }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} tickFormatter={(v) => `${(v/1000).toFixed(0)}K`} />
                            <Tooltip formatter={(v) => formatCurrency(v)} contentStyle={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#F8FAFC', fontSize: '12px' }} />
                            <Area type="monotone" dataKey="balance" stroke="#0A6E3D" strokeWidth={2} fill="url(#helbGrad)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}

                  {/* Payment Impact Comparison */}
                  <div className="glass-card p-6">
                    <h3 className="text-sm font-semibold text-light-300 uppercase tracking-wider mb-4">What If You Paid More?</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead><tr className="bg-white/[0.03] text-xs text-light-400 uppercase tracking-wider">
                          <th className="px-4 py-3 text-left font-semibold">Monthly</th>
                          <th className="px-4 py-3 text-center font-semibold">Time</th>
                          <th className="px-4 py-3 text-right font-semibold">Total Interest</th>
                          <th className="px-4 py-3 text-right font-semibold">Interest Saved</th>
                        </tr></thead>
                        <tbody>
                          {[3000, 5000, 8000, 10000, 15000, 20000].map((amt) => {
                            const r = calculateHELBRepayment(totalLoan, amt, HELB_RATE);
                            if (r.error) return null;
                            const saved = results.totalInterest - r.totalInterest;
                            return (
                              <tr key={amt} className={`border-b border-white/5 ${amt === monthlyRepayment ? 'bg-primary/10' : 'hover:bg-white/[0.02]'}`}>
                                <td className="px-4 py-2.5 font-mono text-light-50 text-xs">{formatCurrency(amt)}{amt === monthlyRepayment && <span className="ml-1 text-primary text-[10px]">(current)</span>}</td>
                                <td className="px-4 py-2.5 text-center font-mono text-light-200 text-xs">{Math.floor(r.months / 12)}y {r.months % 12}m</td>
                                <td className="px-4 py-2.5 text-right font-mono text-secondary text-xs">{formatCurrency(r.totalInterest)}</td>
                                <td className="px-4 py-2.5 text-right font-mono text-xs">
                                  {saved > 0 ? <span className="text-success">-{formatCurrency(saved)}</span> : <span className="text-light-400">—</span>}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
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
