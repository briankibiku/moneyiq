import { Link } from 'react-router-dom';
import { useArticles } from '../../hooks/useDataFetch';

export default function ArticlesPreviewSection() {
  const { data: articlesData, loading } = useArticles();
  const articles = articlesData?.articles?.slice(0, 3) || [];

  const categoryColors = {
    Education: 'bg-primary/15 text-primary',
    Guides: 'bg-secondary/15 text-secondary',
    Investment: 'bg-accent-light/15 text-accent-light',
    Comparison: 'bg-purple-500/15 text-purple-400',
  };

  return (
    <section id="articles-preview" className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
              News & Insights
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-light-50">
              Latest Financial{' '}
              <span className="gradient-text">Insights</span>
            </h2>
          </div>
          <Link
            to="/articles"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-light transition-colors"
          >
            View All Articles
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Articles Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="glass-card p-6 space-y-4">
                  <div className="animate-shimmer h-4 w-20 rounded" />
                  <div className="animate-shimmer h-6 w-full rounded" />
                  <div className="animate-shimmer h-4 w-full rounded" />
                  <div className="animate-shimmer h-4 w-3/4 rounded" />
                </div>
              ))
            : articles.map((article) => (
                <Link
                  key={article.id}
                  to={`/articles/${article.slug}`}
                  id={`article-card-${article.id}`}
                  className="group glass-card p-6 lg:p-7 hover:bg-white/[0.08] transition-smooth hover:scale-[1.01]"
                >
                  {/* Category & Read Time */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      categoryColors[article.category] || 'bg-white/10 text-light-300'
                    }`}>
                      {article.category}
                    </span>
                    <span className="text-xs text-light-400">{article.readTime}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-light-50 mb-3 group-hover:text-primary transition-colors leading-snug">
                    {article.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-sm text-light-400 leading-relaxed line-clamp-3 mb-4">
                    {article.excerpt}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <span className="text-xs text-light-400">{article.publishedDate}</span>
                    <span className="text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      Read More →
                    </span>
                  </div>
                </Link>
              ))}
        </div>
      </div>
    </section>
  );
}
