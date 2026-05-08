import { Link } from 'react-router-dom';
import SEOHead from '../components/seo/SEOHead';
import FAQSection from '../components/ui/FAQSection';

const allFaqs = [
  {
    category: 'PAYE & Tax',
    questions: [
      {
        question: "How is PAYE calculated in Kenya?",
        answer: "PAYE (Pay As You Earn) is calculated based on graduated tax bands. Your taxable income (gross salary minus NSSF contributions) is subjected to different rates: 10% for the first KES 24,000, 25% for the next KES 8,333, 30% for the next KES 467,667, and so on. A personal relief of KES 2,400 is then deducted from the total tax to arrive at the final PAYE."
      },
      {
        question: "Does NHIF still apply?",
        answer: "As of 2024/2025, NHIF has been transitioned to SHIF (Social Health Insurance Fund). The deduction is now 2.75% of your gross salary, which is mandatory for all Kenyan employees."
      },
      {
        question: "How much tax do I pay on 100k salary?",
        answer: "For a gross salary of KES 100,000, your PAYE would be approximately KES 18,343 (after NSSF and Personal Relief). Total deductions including SHIF (KES 2,750) and Housing Levy (KES 1,500) would result in a net pay of roughly KES 75,307."
      },
      {
        question: "What is the Housing Levy in Kenya?",
        answer: "The Housing Levy is a mandatory deduction of 1.5% of your gross salary, introduced under the Affordable Housing Act. Both the employer and employee contribute 1.5% each."
      },
    ]
  },
  {
    category: 'M-Pesa',
    questions: [
      {
        question: "What is the maximum M-Pesa limit per transaction?",
        answer: "The maximum amount you can send or withdraw in a single M-Pesa transaction is KES 250,000. Your daily limit is KES 500,000."
      },
      {
        question: "How much are M-Pesa withdrawal charges at an agent?",
        answer: "Withdrawal charges vary by amount. For example, withdrawing KES 1,000 costs KES 29, while withdrawing KES 10,000 costs KES 115."
      },
      {
        question: "Are M-Pesa to M-Pesa transfers free?",
        answer: "Transfers between KES 1 and KES 100 are free for registered users. Above KES 100, charges apply based on the amount being sent."
      },
    ]
  },
  {
    category: 'Loans & Mortgages',
    questions: [
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
      },
      {
        question: "How much down payment do I need for a mortgage in Kenya?",
        answer: "Most Kenyan banks require a minimum down payment of 10% to 20% of the property value."
      },
      {
        question: "What is the maximum mortgage tenure in Kenya?",
        answer: "Typical mortgage tenures in Kenya range from 10 to 25 years, depending on the lender and the borrower's age."
      },
      {
        question: "Are there additional costs when taking a mortgage?",
        answer: "Yes, you should budget for extra costs such as valuation fees, legal fees, stamp duty (2-4%), and insurance premiums."
      },
    ]
  },
];

const structuredFAQ = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": allFaqs.flatMap(cat => cat.questions.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  })))
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://moneyiq.co.ke/" },
    { "@type": "ListItem", "position": 2, "name": "FAQs", "item": "https://moneyiq.co.ke/faqs" }
  ]
};

export default function FAQs() {
  return (
    <>
      <SEOHead
        title="FAQs - Frequently Asked Questions | MoneyIQ Kenya"
        description="Find answers to common questions about PAYE tax calculations, M-Pesa charges, loan repayments, and mortgage rates in Kenya."
        canonical="/faqs"
        structuredData={[structuredFAQ, breadcrumbSchema]}
      />

      <main className="pt-24 pb-24 bg-white min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {/* Page Header */}
          <div className="mb-12 border-b border-gray-100 pb-8 mt-8">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2 uppercase tracking-widest">FAQs</h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">Quick answers to common financial queries</p>
          </div>
          {/* FAQ Categories */}
          <div className="space-y-16">
            {allFaqs.map((category) => (
              <div key={category.category}>
                <h2 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-6 pb-3 border-b border-gray-100">
                  {category.category}
                </h2>
                <FAQSection faqs={category.questions} showTitle={false} />
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-20 pt-12 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-400 mb-6">Can't find what you're looking for?</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/paye-calculator-kenya"
                className="inline-flex items-center justify-center px-8 py-3 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-black transition-all"
              >
                Try PAYE Calculator
              </Link>
              <Link
                to="/mpesa-charges-calculator"
                className="inline-flex items-center justify-center px-8 py-3 border border-gray-200 text-gray-600 text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-gray-50 transition-all"
              >
                Check M-Pesa Charges
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
