import SEOHead from '../components/seo/SEOHead';
import HeroSection from '../components/layout/HeroSection';
import CalculatorsSection from '../components/layout/CalculatorsSection';
import RatesPreviewSection from '../components/layout/RatesPreviewSection';
import HowItWorksSection from '../components/layout/HowItWorksSection';
import ArticlesPreviewSection from '../components/layout/ArticlesPreviewSection';
import NewsletterSection from '../components/layout/NewsletterSection';

const homeStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'MoneyIQ Kenya',
  url: 'https://moneyiq.co.ke',
  description: 'Kenya\'s premier financial comparison and calculator platform.',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://moneyiq.co.ke/search?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};

export default function Home() {
  return (
    <>
      <SEOHead
        title="MoneyIQ Kenya | Smart Financial Tools, Loan Calculators & Rate Comparisons"
        description="MoneyIQ helps Kenyans make smarter money decisions. Compare bank rates, calculate loan repayments, explore mortgage options, and track financial trends — all in one place."
        keywords="Kenya loan calculator, bank rates Kenya, mortgage calculator Kenya, personal loan Kenya, savings calculator, financial tools Kenya, CBK rates, interest rates Kenya 2026, best bank rates Kenya"
        canonical="/"
        structuredData={homeStructuredData}
      />

      <main id="main-content">
        <HeroSection />
        <CalculatorsSection />
        <RatesPreviewSection />
        <HowItWorksSection />
        <ArticlesPreviewSection />
        <NewsletterSection />
      </main>
    </>
  );
}
