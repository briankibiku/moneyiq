import { Link } from 'react-router-dom';
import SEOHead from '../../components/seo/SEOHead';

export default function About() {
  return (
    <>
      <SEOHead
        title="About MoneyIQ Kenya | Our Mission & Team"
        description="MoneyIQ is Kenya's premier financial comparison platform. We help Kenyans make smarter money decisions with free tools, calculators, and up-to-date rate comparisons."
        keywords="MoneyIQ Kenya, about MoneyIQ, financial comparison Kenya"
        canonical="/about"
      />

      <main className="pt-20 pb-16 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-light-400 mb-8" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-light-50 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-light-50">About</span>
          </nav>

          <article className="prose prose-invert prose-lg max-w-none">
            <h1 className="text-3xl sm:text-4xl font-bold text-light-50 mb-6">
              About <span className="gradient-text">MoneyIQ</span> Kenya
            </h1>

            <div className="glass-card p-8 lg:p-10 space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-light-50 mb-3">Our Mission</h2>
                <p className="text-light-300 leading-relaxed">
                  MoneyIQ exists to democratize financial information in Kenya. We believe every Kenyan 
                  deserves access to clear, accurate, and up-to-date financial data to make informed 
                  decisions about loans, savings, investments, and more.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-light-50 mb-3">What We Do</h2>
                <ul className="space-y-3 text-light-300">
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1">✓</span>
                    <span><strong className="text-light-50">Rate Comparisons</strong> — We track lending, savings, mortgage, and deposit rates across all major Kenyan banks and update them regularly.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1">✓</span>
                    <span><strong className="text-light-50">Financial Calculators</strong> — Our free tools help you calculate loan repayments, savings growth, and compare financial products.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1">✓</span>
                    <span><strong className="text-light-50">Financial Education</strong> — We publish guides, tips, and insights to help you navigate Kenya's financial landscape.</span>
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-light-50 mb-3">Our Promise</h2>
                <p className="text-light-300 leading-relaxed">
                  MoneyIQ is and will always be <strong className="text-light-50">100% free</strong> to use. 
                  We don't require sign-ups, we don't sell your data, and we don't charge for our tools. 
                  Our goal is simple: help Kenyans make smarter financial decisions.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-light-50 mb-3">Data Accuracy</h2>
                <p className="text-light-300 leading-relaxed">
                  All rates and data on MoneyIQ are sourced from official bank publications, the 
                  Central Bank of Kenya, and other public sources. While we strive for accuracy, rates 
                  can change frequently. We recommend confirming with your bank before making financial decisions.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-light-50 mb-3">Contact Us</h2>
                <p className="text-light-300 leading-relaxed">
                  Have feedback, suggestions, or found incorrect data? We'd love to hear from you.
                </p>
                <p className="text-primary font-medium mt-2">
                  📧 hello@moneyiq.co.ke
                </p>
              </section>
            </div>
          </article>
        </div>
      </main>
    </>
  );
}
