import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../../components/seo/SEOHead';
import { useDataFetch } from '../../hooks/useDataFetch';
import { formatCurrency } from '../../utils/calculations';

export default function BankCharges() {
  const { data, loading } = useDataFetch('bank-charges.json');

  if (loading) {
    return (
      <main className="pt-20 pb-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
          <div className="h-8 w-48 bg-white/5 rounded mb-8" />
          <div className="h-64 w-full bg-white/5 rounded-2xl" />
        </div>
      </main>
    );
  }

  return (
    <>
      <SEOHead
        title="Bank Charges Comparison Kenya | Account & Transaction Fees - MoneyIQ"
        description="Compare bank ledger fees, ATM withdrawal costs, and mobile transfer charges across Kenyan banks. Find the cheapest bank account for your needs."
        keywords="bank charges Kenya, ledger fees Kenya, ATM withdrawal fees, mobile banking charges Kenya"
        canonical="/compare/bank-charges"
      />

      <main className="pt-20 pb-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-light-400 mb-8" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-light-50 transition-colors">Home</Link>
            <span>/</span>
            <Link to="/compare" className="hover:text-light-50 transition-colors">Compare Rates</Link>
            <span>/</span>
            <span className="text-light-50">Bank Charges</span>
          </nav>

          <div className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-light-50 mb-3">
              Bank <span className="gradient-text">Charges & Fees</span>
            </h1>
            <p className="text-lg text-light-400 max-w-2xl">
              Hidden fees can eat into your savings. Compare account maintenance and 
              transaction costs across major Kenyan banks.
            </p>
          </div>

          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    <th className="px-6 py-4 text-xs font-bold text-light-400 uppercase tracking-wider">Bank</th>
                    <th className="px-6 py-4 text-xs font-bold text-light-400 uppercase tracking-wider text-right">Ledger Fee (Monthly)</th>
                    <th className="px-6 py-4 text-xs font-bold text-light-400 uppercase tracking-wider text-right">ATM Withdrawal</th>
                    <th className="px-6 py-4 text-xs font-bold text-light-400 uppercase tracking-wider text-right">Mobile to Bank</th>
                    <th className="px-6 py-4 text-xs font-bold text-light-400 uppercase tracking-wider text-right">Mobile to M-PESA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {data?.banks.map((bank) => (
                    <tr key={bank.id} className="hover:bg-white/[0.03] transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-bold text-light-50 group-hover:text-primary transition-colors">{bank.name}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right font-mono text-sm text-light-200">
                        {bank.ledgerFee === 0 ? <span className="text-success font-bold">FREE</span> : formatCurrency(bank.ledgerFee)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right font-mono text-sm text-light-200">
                        {formatCurrency(bank.atmWithdrawal)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right font-mono text-sm text-light-200">
                        {bank.mobileTransferToBank === 0 ? <span className="text-success font-bold">FREE</span> : formatCurrency(bank.mobileTransferToBank)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right font-mono text-sm text-light-200">
                        {formatCurrency(bank.mobileTransferToMpesa)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 bg-white/[0.02] border-t border-white/5 flex justify-between items-center text-[10px] text-light-400">
              <span>Note: Fees are indicative and may vary by account type.</span>
              <span>Last Updated: {new Date(data?.lastUpdated).toLocaleDateString('en-KE')}</span>
            </div>
          </div>

          <div className="mt-12 p-8 glass-card bg-gradient-to-br from-primary/5 to-accent/5">
            <h3 className="text-xl font-bold text-light-50 mb-4">How to Save on Bank Fees</h3>
            <ul className="space-y-4">
              <li className="flex gap-3 text-light-400 text-sm">
                <span className="text-primary font-bold">01.</span>
                <span>Opt for <strong>"Pay as you go"</strong> accounts if you don't perform many monthly transactions.</span>
              </li>
              <li className="flex gap-3 text-light-400 text-sm">
                <span className="text-primary font-bold">02.</span>
                <span>Use <strong>mobile banking apps</strong> instead of USSD codes to save on session charges.</span>
              </li>
              <li className="flex gap-3 text-light-400 text-sm">
                <span className="text-primary font-bold">03.</span>
                <span>Avoid withdrawing small amounts from ATMs frequently; withdraw larger amounts less often.</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </>
  );
}
