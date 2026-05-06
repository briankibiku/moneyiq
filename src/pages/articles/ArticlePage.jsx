import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import SEOHead from '../../components/seo/SEOHead';
import { useArticles } from '../../hooks/useDataFetch';

const categoryColors = {
  Education: 'bg-primary/15 text-primary',
  Guides: 'bg-secondary/15 text-secondary',
  Investment: 'bg-accent-light/15 text-accent-light',
  Comparison: 'bg-purple-500/15 text-purple-400',
};

/** Render a content block */
function ContentBlock({ block }) {
  switch (block.type) {
    case 'heading':
      return <h2 className="text-xl font-bold text-light-50 mt-8 mb-3">{block.text}</h2>;
    case 'paragraph':
      return <p className="text-light-300 leading-relaxed mb-4">{block.text}</p>;
    case 'list':
      return (
        <ul className="space-y-2 mb-4 ml-1">
          {block.items.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-light-300 leading-relaxed">
              <span className="text-primary mt-0.5 shrink-0">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case 'callout':
      return (
        <div className="glass-card-light p-5 my-6 flex items-start gap-3 border-l-4 border-primary">
          <span className="text-lg">💡</span>
          <p className="text-sm text-light-200 leading-relaxed">{block.text}</p>
        </div>
      );
    default:
      return null;
  }
}

export default function ArticlePage() {
  const { slug } = useParams();
  const { data: articlesData, loading } = useArticles();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);

  useEffect(() => {
    if (articlesData?.articles) {
      const found = articlesData.articles.find((a) => a.slug === slug);
      setArticle(found || null);

      if (found) {
        const related = articlesData.articles
          .filter((a) => a.id !== found.id)
          .filter((a) => a.tags.some((t) => found.tags.includes(t)) || a.category === found.category)
          .slice(0, 3);
        setRelatedArticles(related);
      }
    }
  }, [articlesData, slug]);

  if (loading) {
    return (
      <main className="pt-20 pb-16 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4 animate-pulse">
            <div className="animate-shimmer h-4 w-40 rounded" />
            <div className="animate-shimmer h-10 w-full rounded" />
            <div className="animate-shimmer h-4 w-3/4 rounded" />
            <div className="animate-shimmer h-64 w-full rounded-xl mt-8" />
          </div>
        </div>
      </main>
    );
  }

  if (!article) {
    return (
      <main className="pt-20 pb-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-light-50 mb-3">Article Not Found</h1>
          <p className="text-light-400 mb-6">The article you&apos;re looking for doesn&apos;t exist.</p>
          <Link to="/articles" className="inline-flex items-center px-6 py-3 rounded-xl text-sm font-semibold text-white gradient-cta hover:opacity-90 transition-smooth">
            ← Back to Articles
          </Link>
        </div>
      </main>
    );
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    author: { '@type': 'Organization', name: article.author },
    datePublished: article.publishedDate,
    publisher: { '@type': 'Organization', name: 'MoneyIQ Kenya', url: 'https://moneyiq.co.ke' },
  };

  return (
    <>
      <SEOHead
        title={`${article.title} - MoneyIQ Kenya`}
        description={article.excerpt}
        keywords={article.tags.join(', ')}
        canonical={`/articles/${article.slug}`}
        structuredData={structuredData}
      />

      <main className="pt-20 pb-16 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-light-400 mb-8 flex-wrap" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-light-50 transition-colors">Home</Link>
            <span>/</span>
            <Link to="/articles" className="hover:text-light-50 transition-colors">Articles</Link>
            <span>/</span>
            <span className="text-light-50 truncate max-w-[200px]">{article.title}</span>
          </nav>

          {/* Article Header */}
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${categoryColors[article.category] || 'bg-white/10 text-light-300'}`}>
                {article.category}
              </span>
              <span className="text-xs text-light-400">{article.readTime}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-light-50 leading-tight mb-4">
              {article.title}
            </h1>

            <p className="text-lg text-light-400 leading-relaxed mb-4">{article.excerpt}</p>

            <div className="flex items-center gap-4 text-sm text-light-400 pt-4 border-t border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                  M
                </div>
                <span>{article.author}</span>
              </div>
              <span>•</span>
              <time dateTime={article.publishedDate}>{new Date(article.publishedDate).toLocaleDateString('en-KE', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
            </div>
          </header>

          {/* Article Body */}
          <article className="glass-card p-6 sm:p-8 lg:p-10 mb-8">
            {article.content?.map((block, i) => (
              <ContentBlock key={i} block={block} />
            ))}

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-white/5">
              {article.tags.map((tag) => (
                <span key={tag} className="text-xs text-light-400 bg-white/5 px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </article>

          {/* CTA */}
          <div className="glass-card p-6 sm:p-8 text-center mb-8 bg-gradient-to-r from-primary/10 to-secondary/10">
            <h3 className="text-lg font-bold text-light-50 mb-2">Ready to Run the Numbers?</h3>
            <p className="text-sm text-light-400 mb-4">Try our free financial calculators to make smarter money decisions.</p>
            <Link to="/calculators" className="inline-flex items-center px-6 py-3 rounded-xl text-sm font-semibold text-white gradient-cta hover:opacity-90 transition-smooth">
              Explore Calculators →
            </Link>
          </div>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-light-50 mb-4">Related Articles</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {relatedArticles.map((related) => (
                  <Link
                    key={related.id}
                    to={`/articles/${related.slug}`}
                    className="group glass-card p-5 hover:bg-white/[0.06] transition-smooth"
                  >
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${categoryColors[related.category] || 'bg-white/10 text-light-300'}`}>
                      {related.category}
                    </span>
                    <h3 className="text-sm font-semibold text-light-50 mt-3 mb-2 group-hover:text-primary transition-colors leading-snug line-clamp-2">
                      {related.title}
                    </h3>
                    <p className="text-xs text-light-400">{related.readTime}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  );
}
