import { Link } from 'react-router-dom';
import SEOHead from '../../components/seo/SEOHead';
import { useArticles } from '../../hooks/useDataFetch';

const categoryColors = {
  Education: 'bg-primary/15 text-primary',
  Guides: 'bg-secondary/15 text-secondary',
  Investment: 'bg-accent-light/15 text-accent-light',
  Comparison: 'bg-purple-500/15 text-purple-400',
};

export default function ArticlesIndex() {
  const { data: articlesData, loading } = useArticles();
  const articles = articlesData?.articles || [];

  return (
    <>
      <SEOHead
        title="Financial News & Insights Kenya | Money Tips & Guides - MoneyIQ"
        description="Stay updated with the latest financial news, money tips, rate changes, and expert guides for Kenyans. Make smarter financial decisions."
        keywords="financial news Kenya, money tips Kenya, savings tips, mortgage guide Kenya, investment Kenya"
        canonical="/articles"
      />

      <main className="pt-20 pb-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-light-400 mb-8" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-light-50 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-light-50">News & Insights</span>
          </nav>

          <div className="mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-light-50 mb-3">
              Financial News &{' '}
              <span className="gradient-text">Insights</span>
            </h1>
            <p className="text-lg text-light-400 max-w-2xl">
              Expert guides, rate updates, and money-saving tips to help you 
              navigate Kenya&apos;s financial landscape.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="glass-card p-6 space-y-4">
                    <div className="animate-shimmer h-4 w-20 rounded" />
                    <div className="animate-shimmer h-6 w-full rounded" />
                    <div className="animate-shimmer h-4 w-full rounded" />
                    <div className="animate-shimmer h-4 w-3/4 rounded" />
                  </div>
                ))
              : articles.map((article) => (
                  <article
                    key={article.id}
                    className="group glass-card p-6 lg:p-7 hover:bg-white/[0.08] transition-smooth hover:scale-[1.01]"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        categoryColors[article.category] || 'bg-white/10 text-light-300'
                      }`}>
                        {article.category}
                      </span>
                      <span className="text-xs text-light-400">{article.readTime}</span>
                    </div>

                    <h2 className="text-lg font-semibold text-light-50 mb-3 group-hover:text-primary transition-colors leading-snug">
                      {article.title}
                    </h2>

                    <p className="text-sm text-light-400 leading-relaxed line-clamp-3 mb-4">
                      {article.excerpt}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {article.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-xs text-light-400 bg-white/5 px-2 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <span className="text-xs text-light-400">{article.publishedDate}</span>
                      <span className="text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        Read More →
                      </span>
                    </div>
                  </article>
                ))}
          </div>
        </div>
      </main>
    </>
  );
}
