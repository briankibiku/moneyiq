import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { useEffect, lazy, Suspense } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Analytics from './components/seo/Analytics';
import CookieConsent from './components/ui/CookieConsent';

// Eager-load the home page (critical path)
import Home from './pages/Home';

// Lazy-load all calculator and secondary pages for code splitting
const MortgageCalculator = lazy(() => import('./pages/calculators/MortgageCalculator'));
const PersonalLoanCalculator = lazy(() => import('./pages/calculators/PersonalLoanCalculator'));
const PAYECalculator = lazy(() => import('./pages/calculators/PAYECalculator'));
const MpesaCalculator = lazy(() => import('./pages/calculators/MpesaCalculator'));
const LendingRates = lazy(() => import('./pages/compare/LendingRates'));
const MMFRates = lazy(() => import('./pages/compare/MMFRates'));
const ExchangeRates = lazy(() => import('./pages/compare/ExchangeRates'));
const SACCORates = lazy(() => import('./pages/compare/SACCORates'));
const BankCharges = lazy(() => import('./pages/compare/BankCharges'));
const CBKHistory = lazy(() => import('./pages/compare/CBKHistory'));
const ArticlesIndex = lazy(() => import('./pages/articles/ArticlesIndex'));
const ArticlePage = lazy(() => import('./pages/articles/ArticlePage'));
const Glossary = lazy(() => import('./pages/glossary/Glossary'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const About = lazy(() => import('./pages/about/About'));

/** Loading fallback while lazy chunks load */
function PageLoader() {
  return (
    <main className="pt-20 pb-16 min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <p className="text-sm text-light-400">Loading...</p>
      </div>
    </main>
  );
}

/** Scroll to top on route change */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <Header />
      <div className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            
            {/* Calculators */}
            <Route path="/calculators/mortgage" element={<MortgageCalculator />} />
            <Route path="/calculators/personal-loan" element={<PersonalLoanCalculator />} />
            <Route path="/calculators/paye" element={<PAYECalculator />} />
            <Route path="/calculators/mpesa" element={<MpesaCalculator />} />
            
            {/* Rate Comparison */}
            <Route path="/compare" element={<LendingRates />} />
            <Route path="/compare/lending" element={<LendingRates />} />
            <Route path="/compare/savings" element={<LendingRates />} />
            <Route path="/compare/mortgage" element={<LendingRates />} />
            <Route path="/compare/fixed-deposits" element={<LendingRates />} />
            <Route path="/compare/mmf" element={<MMFRates />} />
            <Route path="/compare/exchange-rates" element={<ExchangeRates />} />
            <Route path="/compare/saccos" element={<SACCORates />} />
            <Route path="/compare/bank-charges" element={<BankCharges />} />
            <Route path="/compare/cbk-history" element={<CBKHistory />} />
            
            {/* Articles */}
            <Route path="/articles" element={<ArticlesIndex />} />
            <Route path="/articles/:slug" element={<ArticlePage />} />
            
            {/* About */}
            <Route path="/about" element={<About />} />
            <Route path="/glossary" element={<Glossary />} />
            <Route path="/admin" element={<AdminDashboard />} />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>
      <Footer />
      <CookieConsent />
    </div>
  );
}

function NotFound() {
  return (
    <main className="pt-20 pb-16 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold gradient-text mb-4">404</h1>
        <p className="text-xl text-light-300 mb-6">Page not found</p>
        <a
          href="/"
          className="inline-flex items-center px-6 py-3 rounded-xl text-sm font-semibold text-white gradient-cta hover:opacity-90 transition-smooth"
        >
          Go Home
        </a>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <Router>
        <Analytics measurementId="G-XXXXXXXXXX" />
        <AppLayout />
      </Router>
    </HelmetProvider>
  );
}
