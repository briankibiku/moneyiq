import { useState } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../../components/seo/SEOHead';

const glossaryData = [
  { term: 'Amortization', definition: 'The process of gradually paying off a debt through a series of periodic installments (usually monthly) that include both principal and interest.' },
  { term: 'CBR (Central Bank Rate)', definition: 'The benchmark interest rate set by the Central Bank of Kenya. It influences all other interest rates in the economy, including what you pay on loans.' },
  { term: 'Compound Interest', definition: 'Interest calculated on the initial principal and also on the accumulated interest of previous periods. It is "interest on interest."' },
  { term: 'CRB (Credit Reference Bureau)', definition: 'An institution that collects and shares credit information about borrowers. Banks use CRB reports to determine your creditworthiness.' },
  { term: 'Housing Levy', definition: 'A mandatory contribution (1.5% of gross salary) introduced by the Kenyan government to fund affordable housing projects.' },
  { term: 'KRA PIN', definition: 'A unique identification number assigned to taxpayers by the Kenya Revenue Authority for tax purposes.' },
  { term: 'MMF (Money Market Fund)', definition: 'A low-risk investment fund that pools money from investors to buy short-term debt instruments like Treasury Bills.' },
  { term: 'NHIF (National Hospital Insurance Fund)', definition: 'A government-mandated health insurance scheme in Kenya to which all salaried employees contribute monthly.' },
  { term: 'NSSF (National Social Security Fund)', definition: 'A mandatory retirement savings scheme in Kenya where employees and employers contribute a portion of the salary.' },
  { term: 'PAYE (Pay As You Earn)', definition: 'A method of collecting income tax from employees at the source of their income, which is their monthly salary.' },
  { term: 'Principal', definition: 'The original amount of money borrowed in a loan or the amount invested, before interest.' },
  { term: 'Reducing Balance', definition: 'A method of calculating interest based on the remaining balance of the loan, rather than the original amount.' },
  { term: 'SACCO', definition: 'Savings and Credit Co-operative Society. A member-owned financial institution that provides savings and credit services.' },
  { term: 'Treasury Bill (T-Bill)', definition: 'A short-term debt obligation backed by the Kenyan government, typically with maturities of 91, 182, or 364 days.' },
  { term: 'Withholding Tax', definition: 'Tax deducted at the source of income, such as the 15% tax on interest earned from fixed deposits.' },
];

export default function Glossary() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGlossary = glossaryData.filter(item =>
    item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <SEOHead
        title="Financial Glossary Kenya | Money Terms Explained - MoneyIQ"
        description="Understand Kenyan financial terms easily. From KRA and NSSF to Amortization and CBR, we explain everything in simple language."
        keywords="financial glossary Kenya, money terms explained, KRA meaning, NSSF meaning, CBR meaning"
        canonical="/glossary"
      />

      <main className="pt-20 pb-16 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-light-400 mb-8" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-light-50 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-light-50">Financial Glossary</span>
          </nav>

          <div className="mb-10 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-light-50 mb-3">
              Financial <span className="gradient-text">Glossary</span>
            </h1>
            <p className="text-lg text-light-400">
              Kenyan financial terms explained in simple, everyday language.
            </p>
          </div>

          <div className="mb-12">
            <div className="relative max-w-xl mx-auto">
              <input
                type="text"
                placeholder="Search for a term (e.g. NSSF, CRB)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-light-50 focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth outline-none"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-light-400 text-xl">🔍</span>
            </div>
          </div>

          <div className="space-y-6">
            {filteredGlossary.length > 0 ? (
              filteredGlossary.map((item) => (
                <div key={item.term} className="glass-card p-6 border-l-4 border-primary/40 hover:border-primary transition-smooth">
                  <h2 className="text-xl font-bold text-light-50 mb-2">{item.term}</h2>
                  <p className="text-light-400 leading-relaxed">{item.definition}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-12 glass-card">
                <p className="text-light-400">No matching terms found. Try a different search.</p>
              </div>
            )}
          </div>

          <div className="mt-16 p-8 glass-card bg-gradient-to-r from-primary/10 to-secondary/10 text-center">
            <h2 className="text-2xl font-bold text-light-50 mb-4">Want to see these terms in action?</h2>
            <p className="text-light-400 mb-8">
              Use our calculators to see how things like amortization and interest rates 
              actually affect your money.
            </p>
            <Link
              to="/calculators"
              className="inline-flex items-center px-8 py-3 rounded-xl text-sm font-semibold text-white gradient-cta hover:opacity-90 transition-smooth"
            >
              Go to Calculators →
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
