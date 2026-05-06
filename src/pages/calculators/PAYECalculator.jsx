import { useState, useMemo, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SEOHead from '../../components/seo/SEOHead';
import { formatCurrency } from '../../utils/calculations';

/**
 * Kenya PAYE Tax Brackets (Finance Act 2023 / 2024 / 2026)
 */
const TAX_BANDS = [
  { label: '0 - 24,000', next: 24000, rate: 10, min: 0, max: 24000 },
  { label: 'On the next 8,333', next: 8333, rate: 25, min: 24001, max: 32333 },
  { label: 'On the next 467,667', next: 467667, rate: 30, min: 32334, max: 500000 },
  { label: 'On the next 300,000', next: 300000, rate: 32.5, min: 500001, max: 800000 },
  { label: 'On amounts over 800,000', next: Infinity, rate: 35, min: 800001, max: Infinity },
];

const PERSONAL_RELIEF = 2400;
const NSSF_TIER1_LIMIT = 7000;
const NSSF_TIER2_LIMIT = 36000;
const NSSF_RATE = 0.06;
const HOUSING_LEVY_RATE = 0.015;
const SHIF_RATE = 0.0275;

function calculateSHIF(gross) { return Math.round(gross * SHIF_RATE); }

function calculateNSSF(gross) {
  const tier1 = Math.min(gross, NSSF_TIER1_LIMIT) * NSSF_RATE;
  const tier2 = Math.max(0, Math.min(gross, NSSF_TIER2_LIMIT) - NSSF_TIER1_LIMIT) * NSSF_RATE;
  return { tier1: Math.round(tier1), tier2: Math.round(tier2), total: Math.round(tier1 + tier2) };
}

function calculatePAYE(taxableIncome) {
  let tax = 0;
  let remaining = taxableIncome;
  for (const band of TAX_BANDS) {
    if (remaining <= 0) break;
    const bandWidth = band.next === Infinity ? remaining : band.next;
    const taxable = Math.min(remaining, bandWidth);
    tax += taxable * (band.rate / 100);
    remaining -= taxable;
  }
  return Math.round(tax);
}

/**
 * Net to Gross Calculation using binary search
 */
function calculateGrossFromNet(targetNet, deductSHIF, deductNSSF, deductHousingLevy) {
  let low = targetNet;
  let high = targetNet * 2.5; 
  let gross = targetNet;
  
  for (let i = 0; i < 25; i++) {
    const mid = (low + high) / 2;
    const nssf = deductNSSF ? calculateNSSF(mid).total : 0;
    const shif = deductSHIF ? calculateSHIF(mid) : 0;
    const hlevy = deductHousingLevy ? Math.round(mid * HOUSING_LEVY_RATE) : 0;
    const taxablePay = Math.max(0, mid - nssf);
    const paye = Math.max(0, calculatePAYE(taxablePay) - PERSONAL_RELIEF);
    const net = mid - (paye + shif + nssf + hlevy);
    
    if (net < targetNet) low = mid;
    else high = mid;
    gross = mid;
  }
  return Math.round(gross);
}

export default function PAYECalculator() {
  const [basis, setBasis] = useState('gross'); // 'gross' or 'net'
  const [inputValue, setInputValue] = useState(230000);
  const [deductSHIF, setDeductSHIF] = useState(true);
  const [deductNSSF, setDeductNSSF] = useState(true);
  const [deductHousingLevy, setDeductHousingLevy] = useState(true);

  const results = useMemo(() => {
    let gross = basis === 'gross' ? inputValue : calculateGrossFromNet(inputValue, deductSHIF, deductNSSF, deductHousingLevy);
    
    const nssf = deductNSSF ? calculateNSSF(gross) : { total: 0, tier1: 0, tier2: 0 };
    const shif = deductSHIF ? calculateSHIF(gross) : 0;
    const housingLevy = deductHousingLevy ? Math.round(gross * HOUSING_LEVY_RATE) : 0;
    const taxablePay = Math.max(0, gross - nssf.total);
    const incomeTax = calculatePAYE(taxablePay);
    const paye = Math.max(0, incomeTax - PERSONAL_RELIEF);
    const netPay = gross - (paye + shif + nssf.total + housingLevy);

    return {
      grossSalary: gross, nssf: nssf.total, shif, housingLevy, taxablePay,
      incomeTax, personalRelief: PERSONAL_RELIEF, paye, netPay
    };
  }, [basis, inputValue, deductSHIF, deductNSSF, deductHousingLevy]);

  return (
    <>
      <SEOHead title="Kenya PAYE Calculator 2026" description="Calculate Gross to Net or Net to Gross salary for Kenya." />

      <main className="pt-24 pb-24 bg-white min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2 uppercase tracking-widest">PAYE Calculator</h1>
            <p className="text-sm text-gray-400 font-bold uppercase tracking-[0.2em]">Based on Finance Act 2023</p>
          </div>

          <div className="grid lg:grid-cols-12 gap-16 items-start">
            {/* Left: Input Form */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-4">
                <select
                  value={basis}
                  onChange={(e) => setBasis(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-100 border-none rounded-sm text-[10px] font-bold text-gray-600 outline-none uppercase tracking-wider">
                  <option value="gross">GROSS SALARY</option>
                  <option value="net">NET SALARY</option>
                </select>
                
                <div className="py-4 space-y-2">
                  <div className="flex justify-between items-center text-[9px] font-bold text-gray-300 uppercase tracking-widest px-1">
                    <span>Min 10k</span>
                    <span>Max 1M</span>
                  </div>
                  <input 
                    type="range" min={10000} max={1000000} step={1000} value={inputValue} 
                    onChange={(e) => setInputValue(Number(e.target.value))} 
                    className="w-full h-1 bg-gray-100 rounded-full appearance-none cursor-pointer accent-black" 
                  />
                </div>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">KES</span>
                  <input 
                    type="text" value={new Intl.NumberFormat('en-KE').format(inputValue)}
                    onChange={(e) => {
                      const val = e.target.value.replace(/,/g, '');
                      if (!isNaN(val)) setInputValue(Number(val));
                    }}
                    className="w-full pl-12 pr-4 py-5 bg-gray-50 border-none rounded-sm text-gray-900 font-bold text-2xl outline-none focus:ring-1 focus:ring-black"
                    placeholder={basis === 'gross' ? "Gross Salary" : "Net Salary"}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <select className="w-full px-4 py-4 bg-gray-100 border-none rounded-sm text-[10px] font-bold text-gray-600 outline-none uppercase tracking-wider">
                    <option>NSSF: 2024 Tiers</option>
                    <option>NSSF: Old Rates</option>
                  </select>
                  <select className="w-full px-4 py-4 bg-gray-100 border-none rounded-sm text-[10px] font-bold text-gray-600 outline-none uppercase tracking-wider">
                    <option>Monthly View</option>
                    <option>Annual View</option>
                  </select>
                </div>

                <div className="flex flex-col gap-4 py-6 border-y border-gray-50">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" checked={deductSHIF} onChange={(e) => setDeductSHIF(e.target.checked)} className="w-4 h-4 accent-black" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-black transition-colors">Deduct NHIF/SHIF</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" checked={deductHousingLevy} onChange={(e) => setDeductHousingLevy(e.target.checked)} className="w-4 h-4 accent-black" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-black transition-colors">Deduct Housing Levy</span>
                  </label>
                </div>

                <button className="w-full py-5 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-all rounded-sm">
                  Run Calculation
                </button>
              </div>
            </div>

            {/* Right: Results & Info */}
            <div className="lg:col-span-7 space-y-12">
              {/* Results Table */}
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-sm overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-[#E2E8F0] bg-[#F1F5F9]">
                  <h2 className="text-[10px] font-bold text-gray-900 uppercase tracking-wider">Payroll Computation Breakdown</h2>
                </div>
                <table className="w-full text-sm">
                  <tbody>
                    {[
                      { label: 'Basic Salary (Gross)', val: results.grossSalary, bold: true },
                      { label: 'NSSF Deduction', val: -results.nssf },
                      { label: 'SHIF (Health)', val: -results.shif },
                      { label: 'Housing Levy', val: -results.housingLevy },
                      { label: 'Taxable Pay', val: results.taxablePay, bold: true },
                      { label: 'Income Tax (Before Relief)', val: results.incomeTax },
                      { label: 'Personal Relief', val: -results.personalRelief },
                      { label: 'P.A.Y.E', val: results.paye, bold: true },
                      { label: 'Net Salary', val: results.netPay, bold: true, highlight: true },
                    ].map((row, i) => (
                      <tr key={i} className={`border-b border-gray-100/50 last:border-0 ${row.highlight ? 'bg-white' : ''}`}>
                        <td className="pl-6 py-4 text-gray-500 font-bold uppercase text-[9px] tracking-wider">{row.label}</td>
                        <td className={`pr-6 py-4 text-right font-mono text-xs ${row.bold ? 'font-bold text-gray-900' : 'text-gray-600'}`}>
                          {formatCurrency(Math.abs(row.val))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Tax Bands Section */}
              <div className="space-y-6">
                <div className="border-l-4 border-black pl-6 py-1">
                  <h2 className="text-xl font-bold text-gray-900 tracking-tight uppercase">Statutory Bands</h2>
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">2026 Tax Landscape</p>
                </div>
                
                <div className="bg-white border border-gray-100 rounded-sm overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Monthly Bands (KES)</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Rate</th>
                      </tr>
                    </thead>
                    <tbody className="text-[11px]">
                      {TAX_BANDS.map((band, i) => (
                        <tr key={i} className="border-b border-gray-50 last:border-0">
                          <td className="px-6 py-4 text-gray-600 font-bold uppercase tracking-tight">{band.label}</td>
                          <td className="px-6 py-4 text-gray-900 font-bold text-right">{band.rate}%</td>
                        </tr>
                      ))}
                      <tr className="bg-gray-50/50">
                        <td className="px-6 py-4 text-gray-600 font-bold uppercase tracking-tight">Personal Relief</td>
                        <td className="px-6 py-4 text-gray-900 font-bold text-right">{formatCurrency(PERSONAL_RELIEF)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
