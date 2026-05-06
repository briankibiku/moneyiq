import { Helmet } from 'react-helmet-async';

/**
 * SEO Head component — Dynamically sets page title, meta tags, and structured data.
 * Used on every page to maximize SEO.
 */
export default function SEOHead({
  title = 'MoneyIQ Kenya | Smart Financial Tools & Rate Comparisons',
  description = 'Compare bank rates, calculate loan repayments, and make smarter financial decisions with MoneyIQ Kenya.',
  keywords = 'Kenya loan calculator, bank rates Kenya, mortgage calculator Kenya',
  canonical,
  ogImage = 'https://moneyiq.co.ke/og-image.png',
  ogType = 'website',
  structuredData,
  noIndex = false,
}) {
  const siteUrl = 'https://moneyiq.co.ke';
  const fullCanonical = canonical ? `${siteUrl}${canonical}` : siteUrl;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {noIndex && <meta name="robots" content="noindex,nofollow" />}

      {/* Canonical */}
      <link rel="canonical" href={fullCanonical} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="MoneyIQ Kenya" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Schema.org Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
}
