import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../../components/seo/SEOHead';
import { formatCurrency, formatPercent } from '../../utils/calculations';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#0A6E3D', '#FFB800'];

const faqData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is a fixed deposit?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A fixed deposit (FD) is a financial instrument where you deposit a sum of money for a fixed period at a fixed interest rate. It typically offers higher interest than a regular savings account.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is interest on fixed deposits taxed in Kenya?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, interest earned on fixed deposits in Kenya is subject to a 15% withholding tax, which is deducted by the bank before paying you.',
      },
    },
  ],
};

export default function DepositCalculator() {
  const [depositAmount, setDepositAmount] = useState(500000);
  const [interestRate, setInterestRate] = useState(9);
  const [periodMonths, setPeriodMonths] = useState(12);

  const results = useMemo(() => {
    const grossInterest = (depositAmount * interestRate * (periodMonths / 12)) / 100;
    const withholdingTax = grossInterest * 0.15;
    const netInterest = grossInterest - withholdingTax;
    const totalMaturity = depositAmount + netInterest;

    return {
      grossInterest,
      withholdingTax,
      netInterest,
      totalMaturity,
    };
  }, [depositAmount, interestRate, periodMonths]);

  const pieData = [
    { name: 'Principal', value: depositAmount },
    { name: 'Net Interest', value: results.netInterest },
  ];

  return (
    <>
      <SEOHead
        title="Fixed Deposit Calculator Kenya | FD Returns Tool - MoneyIQ"
        description="Calculate your returns on fixed deposits and call deposits in Kenya. Factor in withholding tax and compare maturity amounts across Kenyan banks."
        keywords="fixed deposit calculator Kenya, FD calculator, call deposit Kenya, bank interest rates Kenya"
        canonical="/calculators/deposit"
        structuredData={faqData}
      />

      <main className="pt-20 pb-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-light-400 mb-8" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-light-50 transition-colors">Home</Link>
            <span>/</span>
            <Link to="/calculators" className="hover:text-light-50 transition-colors">Calculators</Link>
            <span>/</span>
            <span className="text-light-50">Deposit Calculator</span>
          </nav>

          <div className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-light-50 mb-3">
              Fixed Deposit <span className="gradient-text">Calculator</span>
            </h1>
            <p className="text-lg text-light-400 max-w-2xl">
              Find out exactly how much you&apos;ll earn on your savings. We automatically 
              calculate the 15% withholding tax so you see your actual take-home return.
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2">
              <div className="glass-card p-6 lg:p-8 space-y-6 sticky top-24">
                <h2 className="text-lg font-semibold text-light-50">Deposit Details</h2>

                <div>
                  <label className="block text-sm font-medium text-light-300 mb-2">Deposit Amount</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-light-400 text-sm font-mono">KES</span>
                    <input
                      type="number" value={depositAmount}
                      onChange={(e) => setDepositAmount(Number(e.target.value))}
                      className="w-full pl-14 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-light-50 font-mono focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth"
                    />
                  </div>
                  <input type="range" min={10000} max={10000000} step={10000} value={depositAmount}
                    onChange={(e) => setDepositAmount(Number(e.target.value))} className="w-full mt-2 accent-primary" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-light-300 mb-2">
                    Annual Interest Rate: <span className="text-secondary font-mono">{interestRate}%</span>
                  </label>
                  <input type="range" min={1} max={18} step={0.25} value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))} className="w-full accent-secondary" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-light-300 mb-2">
                    Period: <span className="text-accent-light font-mono">{periodMonths} months</span>
                  </label>
                  <input type="range" min={1} max={60} step={1} value={periodMonths}
                    onChange={(e) => setPeriodMonths(Number(e.target.value))} className="w-full accent-blue-500" />
                </div>
              </div>
            </div>

            <div className="lg:col-span-3 space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="glass-card p-6 text-center border border-primary/20">
                  <p className="text-xs font-medium text-light-400 uppercase tracking-wider mb-2">Maturity Amount (Net)</p>
                  <p className="text-3xl lg:text-4xl font-bold text-success font-number">{formatCurrency(results.totalMaturity)}</p>
                </div>
                <div className="glass-card p-6 text-center">
                  <p className="text-xs font-medium text-light-400 uppercase tracking-wider mb-2">Net Interest Earned</p>
                  <p className="text-3xl lg:text-4xl font-bold text-secondary font-number">{formatCurrency(results.netInterest)}</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="glass-card p-6">
                  <h3 className="text-sm font-semibold text-light-300 uppercase tracking-wider mb-4">Allocation</h3>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={pieData} innerRadius={60} outerRadius={85} paddingAngle={5} dataKey="value">
                          {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                        </Pie>
                        <Tooltip formatter={(v) => formatCurrency(v)} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="glass-card p-6 space-y-4">
                  <h3 className="text-sm font-semibold text-light-300 uppercase tracking-wider mb-2">Breakdown</h3>
                  <div className="flex justify-between">
                    <span className="text-light-400">Principal</span>
                    <span className="text-light-100 font-mono">{formatCurrency(depositAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-light-400">Gross Interest</span>
                    <span className="text-light-100 font-mono">{formatCurrency(results.grossInterest)}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-4">
                    <span className="text-light-400 italic">W/H Tax (15%)</span>
                    <span className="text-red-400 font-mono">-{formatCurrency(results.withholdingTax)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2">
                    <span className="text-light-50">Total Return</span>
                    <span className="text-success font-mono">{formatCurrency(results.totalMaturity)}</span>
                  </div>
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
