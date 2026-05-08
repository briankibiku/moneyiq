import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Simple GA4 tracker component.
 * Usage: Place in App.jsx near the top of the component tree.
 */
export default function PageTracker({ measurementId }) {
  const location = useLocation();

  useEffect(() => {
    if (!measurementId || window.location.hostname === 'localhost') return;

    // Initialize script if not present
    if (!window.gtag) {
      const script = document.createElement('script');
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      script.async = true;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      window.gtag = function() {
        window.dataLayer.push(arguments);
      };
      window.gtag('js', new Date());
      window.gtag('config', measurementId);
    }
  }, [measurementId]);

  useEffect(() => {
    if (window.gtag && measurementId) {
      window.gtag('event', 'page_view', {
        page_path: location.pathname + location.search,
        page_location: window.location.href,
        page_title: document.title,
      });
    }
  }, [location, measurementId]);

  return null;
}
