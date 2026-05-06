import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../../components/seo/SEOHead';
import { useBankRates } from '../../hooks/useDataFetch';
import { calculateMortgage, formatCurrency } from '../../utils/calculations';

export default function MortgageCalculator() {
  const { data: ratesData } = useBankRates();
  const [propertyValue, setPropertyValue] = useState(10000000);
  const [downPayment, setDownPayment] = useState(2000000);
  const [interestRate, setInterestRate] = useState(13.5);
  const [loanTenure, setLoanTenure] = useState(15);

  const loanAmount = propertyValue - downPayment;
  const results = useMemo(() => calculateMortgage(loanAmount, interestRate, loanTenure), [loanAmount, interestRate, loanTenure]);

  return (
    <>
      <SEOHead title="Mortgage Calculator Kenya" description="Calculate your monthly home loan repayments with our professional tool." />

      <main className="pt-24 pb-24 bg-white min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="mb-12 border-b border-gray-100 pb-6">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-1 uppercase tracking-widest">Mortgage Plan</h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">Kenya Real Estate Tool</p>
          </div>

          <div className="grid lg:grid-cols-12 gap-16 items-start">
            {/* Left: Input Section */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-6">
                {/* Property Value */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Property Value</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">KES</span>
                    <input 
                      type="text" value={new Intl.NumberFormat('en-KE').format(propertyValue)}
                      onChange={(e) => {
                        const val = e.target.value.replace(/,/g, '');
                        if (!isNaN(val)) setPropertyValue(Number(val));
                      }}
                      className="w-full pl-12 pr-4 py-4 bg-gray-100 border-none rounded-sm text-gray-900 font-bold text-xl outline-none focus:ring-1 focus:ring-black transition-all"
                    />
                  </div>
                </div>

                {/* Down Payment */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Down Payment</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">KES</span>
                    <input 
                      type="text" value={new Intl.NumberFormat('en-KE').format(downPayment)}
                      onChange={(e) => {
                        const val = e.target.value.replace(/,/g, '');
                        if (!isNaN(val)) setDownPayment(Number(val));
                      }}
                      className="w-full pl-12 pr-4 py-4 bg-gray-100 border-none rounded-sm text-gray-900 font-bold text-xl outline-none focus:ring-1 focus:ring-black transition-all"
                    />
                  </div>
                </div>

                {/* Rate & Tenure Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Rate (%)</label>
                    <input 
                      type="number" step="0.1" value={interestRate} 
                      onChange={(e) => setInterestRate(Number(e.target.value))}
                      className="w-full px-4 py-4 bg-gray-100 border-none rounded-sm text-gray-900 font-bold text-lg outline-none focus:ring-1 focus:ring-black transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Years</label>
                    <input 
                      type="number" value={loanTenure} 
                      onChange={(e) => setLoanTenure(Number(e.target.value))}
                      className="w-full px-4 py-4 bg-gray-100 border-none rounded-sm text-gray-900 font-bold text-lg outline-none focus:ring-1 focus:ring-black transition-all"
                    />
                  </div>
                </div>

                <button className="w-full py-5 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-all rounded-sm">
                  Generate Quote
                </button>
              </div>
            </div>

            {/* Right: Results Section */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-gray-900 text-white p-10 rounded-sm shadow-xl">
                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/40 mb-3 text-center">Monthly Repayment</p>
                <h2 className="text-5xl sm:text-6xl font-bold tracking-tighter text-center tabular-nums">
                  {formatCurrency(results.monthlyPayment)}
                </h2>
              </div>

              {/* Financial Details Table */}
              <div className="bg-white border border-gray-100 rounded-sm overflow-hidden">
                <table className="w-full text-sm">
                  <tbody>
                    {[
                      { label: 'Loan Amount', val: loanAmount },
                      { label: 'Total Interest', val: results.totalInterest },
                      { label: 'Total Payable', val: results.totalPayable, bold: true },
                    ].map((row, i) => (
                      <tr key={i} className="border-b border-gray-50 last:border-0">
                        <td className="pl-6 py-5 text-gray-400 font-bold uppercase text-[9px] tracking-widest">{row.label}</td>
                        <td className={`pr-6 py-5 text-right font-mono text-xs ${row.bold ? 'font-bold text-gray-900' : 'text-gray-600'}`}>
                          {formatCurrency(Math.abs(row.val))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Minimalist Note */}
              <div className="mt-8 border-t border-gray-50 pt-8 italic text-gray-400 text-[10px] text-center uppercase tracking-widest leading-relaxed">
                "Precision modeling based on standard Kenyan amortization schedules."
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
