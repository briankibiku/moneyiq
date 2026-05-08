import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../../components/seo/SEOHead';
import { useBankRates } from '../../hooks/useDataFetch';
import { calculateLoanRepayment, formatCurrency, formatPercent } from '../../utils/calculations';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import FAQSection from '../../components/ui/FAQSection';
import Breadcrumbs from '../../components/ui/Breadcrumbs';

const faqData = [
  {
    question: "What is the current bank lending rate in Kenya?",
    answer: "As of 2026, average lending rates in Kenya range between 13% and 18%, influenced by the Central Bank Rate (CBR) and individual bank risk assessments."
  },
  {
    question: "How do I calculate my monthly loan repayment (EMI)?",
    answer: "Monthly repayments are calculated using the formula: [P x R x (1+R)^N] / [(1+R)^N - 1], where P is Principal, R is monthly interest rate, and N is the number of months."
  },
  {
    question: "What factors affect loan eligibility in Kenya?",
    answer: "Banks primarily look at your credit score (CRB report), monthly income, debt-to-income ratio, and employment stability."
  }
];

const structuredFAQ = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqData.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://moneyiq.co.ke/" },
    { "@type": "ListItem", "position": 2, "name": "Calculators", "item": "https://moneyiq.co.ke/calculators" },
    { "@type": "ListItem", "position": 3, "name": "Loan Calculator", "item": "https://moneyiq.co.ke/loan-calculator-kenya" }
  ]
};

const COLORS = ['#111827', '#6B7280'];

export default function PersonalLoanCalculator() {
  const { data: ratesData } = useBankRates();
  const [loanAmount, setLoanAmount] = useState(500000);
  const [interestRate, setInterestRate] = useState(14.5);
  const [loanTenure, setLoanTenure] = useState(3);

  const results = useMemo(() => calculateLoanRepayment(loanAmount, interestRate, loanTenure), [loanAmount, interestRate, loanTenure]);
  const pieData = [
    { name: 'Principal', value: loanAmount },
    { name: 'Interest', value: results.totalInterest }
  ];

  return (
    <>
      <SEOHead 
        title="Personal Loan Calculator Kenya 2026 - Monthly Repayments" 
        description="Estimate your monthly personal loan repayments and total interest costs with the latest bank rates in Kenya." 
        canonical="/loan-calculator-kenya" 
        structuredData={[structuredFAQ, breadcrumbSchema]}
      />

      <main className="pt-32 pb-24 bg-white min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <Breadcrumbs items={[{ label: 'Calculators', href: '/calculators' }, { label: 'Personal Loan' }]} />
          <div className="mb-16">
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-4">Loan Calculator</h1>
            <p className="text-gray-500 max-w-xl">Estimate your monthly personal loan repayments and total interest costs.</p>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 space-y-10">
              <div className="space-y-8">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">Loan Amount</label>
                  <div className="space-y-4 pt-4 pb-2">
                    <div className="flex justify-between items-center mb-1 px-1">
                      <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">Min 50k</span>
                      <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">Max 10M</span>
                    </div>
                    <input type="range" min={50000} max={10000000} step={50000} value={loanAmount} onChange={(e) => setLoanAmount(Number(e.target.value))} className="w-full h-1 bg-gray-100 rounded-full appearance-none cursor-pointer accent-black transition-all hover:bg-gray-200" />
                    <div className="relative pt-2">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">KES</span>
                      <input 
                        type="text" 
                        value={new Intl.NumberFormat('en-KE').format(loanAmount)}
                        onChange={(e) => {
                          const val = e.target.value.replace(/,/g, '');
                          if (!isNaN(val)) setLoanAmount(Number(val));
                        }}
                        className="w-full pl-12 pr-4 py-6 bg-gray-50 border-none rounded-sm text-gray-900 font-bold text-3xl outline-none focus:ring-1 focus:ring-black transition-shadow" 
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4 pt-4 pb-2">
                    <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400">Interest Rate (%)</label>
                    <input type="range" min={8} max={25} step={0.25} value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} className="w-full h-1 bg-gray-100 rounded-full appearance-none cursor-pointer accent-black transition-all hover:bg-gray-200" />
                    <input type="number" step="0.25" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} className="w-full py-4 bg-gray-50 border-none rounded-sm text-gray-900 font-bold text-2xl outline-none focus:ring-1 focus:ring-black" />
                  </div>
                  <div className="space-y-4 pt-4 pb-2">
                    <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400">Tenure (Years)</label>
                    <input type="range" min={1} max={7} step={1} value={loanTenure} onChange={(e) => setLoanTenure(Number(e.target.value))} className="w-full h-1 bg-gray-100 rounded-full appearance-none cursor-pointer accent-black transition-all hover:bg-gray-200" />
                    <input type="number" value={loanTenure} onChange={(e) => setLoanTenure(Number(e.target.value))} className="w-full py-4 bg-gray-50 border-none rounded-sm text-gray-900 font-bold text-2xl outline-none focus:ring-1 focus:ring-black" />
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-8">
              <div className="p-10 bg-gray-900 rounded-3xl text-white">
                <p className="text-[11px] font-bold uppercase tracking-widest opacity-60 mb-4">Monthly Payment (EMI)</p>
                <h2 className="text-6xl font-bold tracking-tighter mb-2">{formatCurrency(results.monthlyPayment)}</h2>
                <div className="mt-10 pt-8 border-t border-white/10 grid grid-cols-2 gap-8">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-1">Total Interest</p>
                    <p className="text-xl font-bold">{formatCurrency(results.totalInterest)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-1">Total Payable</p>
                    <p className="text-xl font-bold">{formatCurrency(results.totalPayable)}</p>
                  </div>
                </div>
              </div>

              <div className="p-8 border border-gray-100 rounded-3xl flex flex-col items-center">
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" cornerRadius={4}>
                        {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex gap-8 mt-6">
                  {pieData.map((d, i) => (
                    <div key={d.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{d.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* FAQ Section */}
          <FAQSection faqs={faqData} />
        </div>
      </main>
    </>
  );
}
