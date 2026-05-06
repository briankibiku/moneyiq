import { useState, useMemo } from 'react';
import SEOHead from '../../components/seo/SEOHead';
import { formatCurrency } from '../../utils/calculations';

const MPESA_RATES = [
  { min: 1, max: 49, send_registered: 0, send_unregistered: "N/A", withdraw_agent: "N/A" },
  { min: 50, max: 100, send_registered: 0, send_unregistered: "N/A", withdraw_agent: 11 },
  { min: 101, max: 500, send_registered: 7, send_unregistered: 47, withdraw_agent: 29 },
  { min: 501, max: 1000, send_registered: 13, send_unregistered: 64, withdraw_agent: 29 },
  { min: 1001, max: 1500, send_registered: 23, send_unregistered: 80, withdraw_agent: 30 },
  { min: 1501, max: 2500, send_registered: 33, send_unregistered: 106, withdraw_agent: 30 },
  { min: 2501, max: 3500, send_registered: 53, send_unregistered: 140, withdraw_agent: 52 },
  { min: 3501, max: 5000, send_registered: 57, send_unregistered: 171, withdraw_agent: 70 },
  { min: 5001, max: 7500, send_registered: 78, send_unregistered: 212, withdraw_agent: 87 },
  { min: 7501, max: 10000, send_registered: 90, send_unregistered: 260, withdraw_agent: 115 },
  { min: 10001, max: 15000, send_registered: 100, send_unregistered: 310, withdraw_agent: 167 },
  { min: 15001, max: 20000, send_registered: 105, send_unregistered: 342, withdraw_agent: 185 },
  { min: 20001, max: 25000, send_registered: 105, send_unregistered: 367, withdraw_agent: 197 },
  { min: 25001, max: 30000, send_registered: 105, send_unregistered: 395, withdraw_agent: 204 },
  { min: 30001, max: 35000, send_registered: 108, send_unregistered: 450, withdraw_agent: 204 },
  { min: 35001, max: 40000, send_registered: 108, send_unregistered: 480, withdraw_agent: 210 },
  { min: 40001, max: 45000, send_registered: 108, send_unregistered: 505, withdraw_agent: 210 },
  { min: 45001, max: 50000, send_registered: 108, send_unregistered: 535, withdraw_agent: 210 },
  { min: 50001, max: 150000, send_registered: 108, send_unregistered: "N/A", withdraw_agent: 310 },
  { min: 150001, max: 250000, send_registered: 108, send_unregistered: "N/A", withdraw_agent: 310 },
];

export default function MpesaCalculator() {
  const [amount, setAmount] = useState(5000);
  const currentCharges = useMemo(() => MPESA_RATES.find(r => amount >= r.min && amount <= r.max) || {}, [amount]);

  return (
    <>
      <SEOHead title="M-Pesa Charges Calculator" description="Check M-Pesa transaction fees instantly." />

      <main className="pt-24 pb-24 bg-white min-h-screen">
        <div className="max-w-xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="mb-8 border-b border-gray-100 pb-6 text-center sm:text-left">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-1 uppercase tracking-widest">M-Pesa Charges</h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">Transaction Fee Lookup</p>
          </div>

          {/* Input Section */}
          <div className="space-y-6 mb-10">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Transfer Amount</label>
              
              <div className="py-4 space-y-2">
                <div className="flex justify-between items-center text-[9px] font-bold text-gray-300 uppercase tracking-widest px-1">
                  <span>Min 1</span>
                  <span>Max 250,000 (Limit)</span>
                </div>
                <input 
                  type="range" min={1} max={250000} step={50} value={amount} 
                  onChange={(e) => setAmount(Number(e.target.value))} 
                  className="w-full h-1 bg-gray-100 rounded-full appearance-none cursor-pointer accent-black" 
                />
              </div>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">KES</span>
                <input 
                  type="text" value={new Intl.NumberFormat('en-KE').format(amount)}
                  onChange={(e) => {
                    const val = e.target.value.replace(/,/g, '');
                    if (!isNaN(val)) setAmount(Number(val));
                  }}
                  className="w-full pl-12 pr-4 py-4 bg-gray-100 border-none rounded-sm text-gray-900 font-bold text-xl outline-none focus:ring-1 focus:ring-black transition-all"
                />
              </div>
            </div>
          </div>

          {/* Results Table - Banking Grade Minimalism */}
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-sm overflow-hidden mb-12 shadow-sm">
            <div className="px-6 py-4 border-b border-[#E2E8F0] bg-[#F1F5F9]">
              <h2 className="text-[10px] font-bold text-gray-900 uppercase tracking-wider">Applicable Fees</h2>
            </div>
            <table className="w-full text-sm">
              <tbody>
                {[
                  { label: 'Transfer to M-Pesa User', val: currentCharges.send_registered },
                  { label: 'Transfer to Other User', val: currentCharges.send_unregistered },
                  { label: 'Withdraw at Agent', val: currentCharges.withdraw_agent, bold: true, highlight: true },
                ].map((row, i) => (
                  <tr key={i} className={`border-b border-gray-100/50 last:border-0 ${row.highlight ? 'bg-white' : ''}`}>
                    <td className="pl-6 py-4 text-gray-500 font-bold uppercase text-[9px] tracking-wider">{row.label}</td>
                    <td className={`pr-6 py-4 text-right font-mono text-xs ${row.bold ? 'font-bold text-gray-900' : 'text-gray-600'}`}>
                      {typeof row.val === 'number' ? formatCurrency(row.val) : row.val}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Info */}
          <div className="text-center opacity-30">
            <p className="text-[9px] text-gray-900 font-bold uppercase tracking-[0.3em]">
              Safaricom Rates &bull; MoneyIQ Kenya
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
