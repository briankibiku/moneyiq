import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../../components/seo/SEOHead';
import { useBankRates } from '../../hooks/useDataFetch';
import { calculateLoanRepayment, generateAmortizationSchedule, formatCurrency, formatPercent } from '../../utils/calculations';
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const COLORS = ['#0A6E3D', '#FFB800'];
const popularCars = [
  { name: 'Toyota Vitz', price: 800000 },
  { name: 'Toyota Axio', price: 1200000 },
  { name: 'Mazda Demio', price: 900000 },
  { name: 'Subaru Impreza', price: 1500000 },
  { name: 'Toyota Hilux', price: 4500000 },
  { name: 'Prado', price: 7000000 },
];

const faqData = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'What is the interest rate for car loans in Kenya?', acceptedAnswer: { '@type': 'Answer', text: 'Car loan rates in Kenya range from 13-18% p.a. for new vehicles, and 14-20% for used vehicles, depending on bank and credit profile.' }},
    { '@type': 'Question', name: 'What deposit is needed for a car loan?', acceptedAnswer: { '@type': 'Answer', text: 'Most banks require 20-30% deposit. New vehicles may need as low as 10-20%, while used cars typically need 30-40%.' }},
    { '@type': 'Question', name: 'Can I get a loan for a used car?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. The vehicle must typically be under 8 years old at the end of the loan term. Used car rates are usually 1-2% higher.' }},
  ],
};

export default function CarLoanCalculator() {
  const { data: ratesData } = useBankRates();
  const [vehiclePrice, setVehiclePrice] = useState(1500000);
  const [downPayment, setDownPayment] = useState(30);
  const [interestRate, setInterestRate] = useState(15.0);
  const [loanTenure, setLoanTenure] = useState(4);
  const [isUsed, setIsUsed] = useState(true);
  const [selectedBank, setSelectedBank] = useState('');

  const handleBankChange = (bankId) => {
    setSelectedBank(bankId);
    if (bankId && ratesData) {
      const bank = ratesData.banks.find((b) => b.id === bankId);
      if (bank) setInterestRate(bank.personalLoanRate + (isUsed ? 1 : 0));
    }
  };

  const loanAmount = vehiclePrice * (1 - downPayment / 100);
  const results = useMemo(() => calculateLoanRepayment(loanAmount, interestRate, loanTenure), [loanAmount, interestRate, loanTenure]);
  const schedule = useMemo(() => generateAmortizationSchedule(loanAmount, interestRate, loanTenure), [loanAmount, interestRate, loanTenure]);

  const annualInsurance = vehiclePrice * 0.05;
  const totalOwnership = results.totalPayment + (vehiclePrice * downPayment / 100) + (annualInsurance * loanTenure);

  const pieData = [{ name: 'Principal', value: loanAmount }, { name: 'Interest', value: results.totalInterest }];
  const yearlyData = schedule.filter((_, i) => (i + 1) % 12 === 0).map((e) => ({ year: `Yr ${e.month / 12}`, balance: Math.round(e.balance) }));

  return (
    <>
      <SEOHead title="Car Loan Calculator Kenya 2026 | Auto Loan Repayments - MoneyIQ"
        description="Free car loan calculator for Kenya. Calculate monthly vehicle loan repayments for new and used cars across Kenyan banks."
        keywords="car loan calculator Kenya, auto loan, vehicle financing Kenya, used car loan Kenya"
        canonical="/calculators/car-loan" structuredData={faqData} />

      <main className="pt-20 pb-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-light-400 mb-8" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-light-50 transition-colors">Home</Link><span>/</span>
            <Link to="/calculators" className="hover:text-light-50 transition-colors">Calculators</Link><span>/</span>
            <span className="text-light-50">Car Loan</span>
          </nav>

          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-light-50 mb-3">Car Loan Calculator <span className="gradient-text">Kenya</span></h1>
            <p className="text-lg text-light-400 max-w-2xl">Calculate your monthly auto loan repayments, total cost of ownership, and compare financing options.</p>
          </div>

          {/* Popular Cars */}
          <div className="mb-8">
            <p className="text-sm font-medium text-light-300 mb-3">Popular Cars in Kenya</p>
            <div className="flex flex-wrap gap-2">
              {popularCars.map((car) => (
                <button key={car.name} onClick={() => setVehiclePrice(car.price)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-smooth border ${vehiclePrice === car.price ? 'bg-primary/15 border-primary/40 text-primary' : 'bg-white/5 border-white/10 text-light-400 hover:bg-white/10'}`}>
                  🚗 {car.name} <span className="text-light-400/60 ml-1 font-mono">{formatCurrency(car.price)}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2">
              <div className="glass-card p-6 lg:p-8 space-y-5 sticky top-24">
                <h2 className="text-lg font-semibold text-light-50">Vehicle & Loan Details</h2>

                <div>
                  <label className="block text-sm font-medium text-light-300 mb-2">Vehicle Condition</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[false, true].map((used) => (
                      <button key={String(used)} onClick={() => setIsUsed(used)}
                        className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-smooth border ${isUsed === used ? 'bg-primary/15 border-primary/40 text-primary' : 'bg-white/5 border-white/10 text-light-400 hover:bg-white/10'}`}>
                        {used ? '🔄 Used' : '✨ New'}
                      </button>
                    ))}
                  </div>
                </div>

                {ratesData && (
                  <div>
                    <label htmlFor="bank-car" className="block text-sm font-medium text-light-300 mb-2">Select Bank</label>
                    <select id="bank-car" value={selectedBank} onChange={(e) => handleBankChange(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-light-50 focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth appearance-none cursor-pointer">
                      <option value="">Custom Rate</option>
                      {ratesData.banks.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                  </div>
                )}

                <div>
                  <label htmlFor="vehicle-price" className="block text-sm font-medium text-light-300 mb-2">Vehicle Price</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-light-400 text-sm font-mono">KES</span>
                    <input id="vehicle-price" type="number" value={vehiclePrice} onChange={(e) => setVehiclePrice(Number(e.target.value))}
                      className="w-full pl-14 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-light-50 font-mono focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth" />
                  </div>
                  <input type="range" min={300000} max={15000000} step={100000} value={vehiclePrice} onChange={(e) => setVehiclePrice(Number(e.target.value))} className="w-full mt-2 accent-primary" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-light-300 mb-2">Down Payment: <span className="text-primary font-mono">{downPayment}%</span> <span className="text-light-400 text-xs">({formatCurrency(vehiclePrice * downPayment / 100)})</span></label>
                  <input type="range" min={0} max={80} step={5} value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value))} className="w-full accent-primary" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-light-300 mb-2">Interest Rate: <span className="text-secondary font-mono">{interestRate}%</span></label>
                  <input type="range" min={8} max={25} step={0.25} value={interestRate} onChange={(e) => { setInterestRate(Number(e.target.value)); setSelectedBank(''); }} className="w-full accent-secondary" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-light-300 mb-2">Tenure: <span className="text-accent-light font-mono">{loanTenure} years</span></label>
                  <input type="range" min={1} max={7} step={1} value={loanTenure} onChange={(e) => setLoanTenure(Number(e.target.value))} className="w-full accent-blue-500" />
                </div>
              </div>
            </div>

            <div className="lg:col-span-3 space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Monthly Payment', value: results.monthlyPayment, color: 'text-primary' },
                  { label: 'Total Interest', value: results.totalInterest, color: 'text-secondary' },
                  { label: 'Loan Amount', value: loanAmount, color: 'text-accent-light' },
                  { label: 'Annual Insurance', value: annualInsurance, color: 'text-warning' },
                ].map((s) => (
                  <div key={s.label} className="glass-card p-4 text-center">
                    <p className="text-[10px] font-medium text-light-400 uppercase tracking-wider mb-1">{s.label}</p>
                    <p className={`text-xl lg:text-2xl font-bold font-number ${s.color}`}>{formatCurrency(s.value)}</p>
                  </div>
                ))}
              </div>

              <div className="glass-card-light p-5 flex items-start gap-3">
                <span className="text-2xl">🚗</span>
                <div>
                  <p className="text-sm text-light-200 font-medium mb-1">Total Cost of Ownership ({loanTenure} years)</p>
                  <p className="text-2xl font-bold text-light-50 font-number mb-1">{formatCurrency(totalOwnership)}</p>
                  <p className="text-xs text-light-400">Includes down payment, all loan repayments, and estimated insurance</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="glass-card p-6">
                  <h3 className="text-sm font-semibold text-light-300 uppercase tracking-wider mb-4">Payment Split</h3>
                  <div className="h-52">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart><Pie data={pieData} innerRadius={50} outerRadius={85} paddingAngle={3} dataKey="value">
                        {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                      </Pie><Tooltip formatter={(v) => formatCurrency(v)} contentStyle={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#F8FAFC', fontSize: '12px' }} /></PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center gap-6 mt-2">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-primary" /><span className="text-xs text-light-400">Principal</span></div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-secondary" /><span className="text-xs text-light-400">Interest</span></div>
                  </div>
                </div>

                <div className="glass-card p-6">
                  <h3 className="text-sm font-semibold text-light-300 uppercase tracking-wider mb-4">Balance Over Time</h3>
                  <div className="h-52">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={yearlyData}>
                        <defs><linearGradient id="carBG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0A6E3D" stopOpacity={0.4} /><stop offset="95%" stopColor="#0A6E3D" stopOpacity={0} /></linearGradient></defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="year" tick={{ fill: '#94A3B8', fontSize: 10 }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} />
                        <YAxis tick={{ fill: '#94A3B8', fontSize: 10 }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} tickFormatter={(v) => v >= 1e6 ? `${(v/1e6).toFixed(1)}M` : `${(v/1000).toFixed(0)}K`} />
                        <Tooltip formatter={(v) => formatCurrency(v)} contentStyle={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#F8FAFC', fontSize: '12px' }} />
                        <Area type="monotone" dataKey="balance" stroke="#0A6E3D" strokeWidth={2} fill="url(#carBG)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="glass-card overflow-hidden">
                <div className="px-6 py-4 border-b border-white/5"><h3 className="text-sm font-semibold text-light-300 uppercase tracking-wider">Repayment Schedule (First 12 months)</h3></div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="bg-white/[0.03] text-xs text-light-400 uppercase tracking-wider">
                      <th className="px-6 py-3 text-left font-semibold">Month</th><th className="px-6 py-3 text-right font-semibold">Payment</th>
                      <th className="px-6 py-3 text-right font-semibold">Principal</th><th className="px-6 py-3 text-right font-semibold">Interest</th>
                      <th className="px-6 py-3 text-right font-semibold">Balance</th>
                    </tr></thead>
                    <tbody>{schedule.slice(0, 12).map((r) => (
                      <tr key={r.month} className="border-b border-white/5 hover:bg-white/[0.02]">
                        <td className="px-6 py-2.5 text-light-50 font-mono text-xs">{r.month}</td>
                        <td className="px-6 py-2.5 text-right text-light-200 font-mono text-xs">{formatCurrency(r.payment)}</td>
                        <td className="px-6 py-2.5 text-right text-primary font-mono text-xs">{formatCurrency(r.principal)}</td>
                        <td className="px-6 py-2.5 text-right text-secondary font-mono text-xs">{formatCurrency(r.interest)}</td>
                        <td className="px-6 py-2.5 text-right text-light-200 font-mono text-xs">{formatCurrency(r.balance)}</td>
                      </tr>
                    ))}</tbody>
                  </table>
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
