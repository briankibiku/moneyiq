import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../../components/seo/SEOHead';
import { useBankRates } from '../../hooks/useDataFetch';
import { calculateLoanRepayment, formatCurrency, formatPercent } from '../../utils/calculations';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

const COLORS = ['#0A6E3D', '#FFB800', '#1E40AF'];

const faqData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What are the requirements for a business loan in Kenya?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Typical requirements include: Certificate of Registration/Incorporation, KRA PIN for the business and directors, 6-12 months bank statements, audited accounts for larger loans, and collateral (title deed or logbook) for secured loans.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the average interest rate for SME loans in Kenya?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'SME loan rates usually range between 13% and 18% per annum, depending on the risk profile, collateral provided, and the specific bank. Many banks now use risk-based pricing.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between secured and unsecured business loans?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Secured loans require collateral (like land or a vehicle) and typically have lower interest rates and longer tenures. Unsecured loans don\'t require collateral but often have higher rates and shorter repayment periods.',
      },
    },
  ],
};

export default function BusinessLoanCalculator() {
  const { data: ratesData } = useBankRates();

  const [loanAmount, setLoanAmount] = useState(2000000);
  const [interestRate, setInterestRate] = useState(16.5);
  const [loanTenure, setLoanTenure] = useState(3);
  const [processingFeePercent, setProcessingFeePercent] = useState(2.5);
  const [insurancePercent, setInsurancePercent] = useState(0.5);

  const processingFee = useMemo(() => (loanAmount * processingFeePercent) / 100, [loanAmount, processingFeePercent]);
  const insuranceFee = useMemo(() => (loanAmount * insurancePercent) / 100, [loanAmount, insurancePercent]);
  const totalUpfrontFees = processingFee + insuranceFee;

  const results = useMemo(
    () => calculateLoanRepayment(loanAmount, interestRate, loanTenure),
    [loanAmount, interestRate, loanTenure]
  );

  const totalCost = results.totalPayment + totalUpfrontFees;

  const pieData = [
    { name: 'Principal', value: loanAmount },
    { name: 'Total Interest', value: results.totalInterest },
    { name: 'Fees & Insurance', value: totalUpfrontFees },
  ];

  return (
    <>
      <SEOHead
        title="Business Loan Calculator Kenya | SME Loan Repayment Tool - MoneyIQ"
        description="Calculate monthly repayments for business and SME loans in Kenya. Factor in processing fees, insurance, and interest rates from major Kenyan banks."
        keywords="business loan calculator Kenya, SME loan calculator, commercial loan Kenya, KCB business loan, Equity business loan"
        canonical="/calculators/business-loan"
        structuredData={faqData}
      />

      <main className="pt-20 pb-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-light-400 mb-8" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-light-50 transition-colors">Home</Link>
            <span>/</span>
            <Link to="/calculators" className="hover:text-light-50 transition-colors">Calculators</Link>
            <span>/</span>
            <span className="text-light-50">Business Loan</span>
          </nav>

          <div className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-light-50 mb-3">
              Business Loan <span className="gradient-text">Calculator</span>
            </h1>
            <p className="text-lg text-light-400 max-w-2xl">
              Plan your business expansion or working capital needs. Calculate repayments including 
              processing fees and insurance common in Kenyan commercial lending.
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2">
              <div className="glass-card p-6 lg:p-8 space-y-6 sticky top-24">
                <h2 className="text-lg font-semibold text-light-50">Loan Parameters</h2>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-light-300 mb-2">Loan Amount</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-light-400 text-sm font-mono">KES</span>
                    <input
                      type="number" value={loanAmount}
                      onChange={(e) => setLoanAmount(Number(e.target.value))}
                      className="w-full pl-14 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-light-50 font-mono focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth"
                    />
                  </div>
                  <input type="range" min={100000} max={50000000} step={100000} value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))} className="w-full mt-2 accent-primary" />
                </div>

                {/* Interest Rate */}
                <div>
                  <label className="block text-sm font-medium text-light-300 mb-2">
                    Interest Rate: <span className="text-secondary font-mono">{interestRate}%</span>
                  </label>
                  <input type="range" min={5} max={25} step={0.25} value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))} className="w-full accent-secondary" />
                </div>

                {/* Tenure */}
                <div>
                  <label className="block text-sm font-medium text-light-300 mb-2">
                    Tenure: <span className="text-accent-light font-mono">{loanTenure} years</span>
                  </label>
                  <input type="range" min={1} max={10} step={1} value={loanTenure}
                    onChange={(e) => setLoanTenure(Number(e.target.value))} className="w-full accent-blue-500" />
                </div>

                {/* Fees */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-light-400 mb-2">Processing Fee (%)</label>
                    <input type="number" value={processingFeePercent} step={0.1}
                      onChange={(e) => setProcessingFeePercent(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-light-50 font-mono text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-light-400 mb-2">Insurance (%)</label>
                    <input type="number" value={insurancePercent} step={0.1}
                      onChange={(e) => setInsurancePercent(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-light-50 font-mono text-sm" />
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3 space-y-6">
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="glass-card p-5 text-center">
                  <p className="text-xs font-medium text-light-400 uppercase tracking-wider mb-1">Monthly Repayment</p>
                  <p className="text-2xl font-bold text-primary font-number">{formatCurrency(results.monthlyPayment)}</p>
                </div>
                <div className="glass-card p-5 text-center">
                  <p className="text-xs font-medium text-light-400 uppercase tracking-wider mb-1">Upfront Costs</p>
                  <p className="text-2xl font-bold text-secondary font-number">{formatCurrency(totalUpfrontFees)}</p>
                </div>
                <div className="glass-card p-5 text-center">
                  <p className="text-xs font-medium text-light-400 uppercase tracking-wider mb-1">Total Cost</p>
                  <p className="text-2xl font-bold text-accent-light font-number">{formatCurrency(totalCost)}</p>
                </div>
              </div>

              <div className="glass-card p-6">
                <h3 className="text-sm font-semibold text-light-300 uppercase tracking-wider mb-4">Cost Breakdown</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                        {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip formatter={(v) => formatCurrency(v)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-6 text-xs text-light-400">
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-primary" /> Principal</div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-secondary" /> Interest</div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-accent" /> Fees</div>
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
