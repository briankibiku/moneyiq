import { Link } from 'react-router-dom';

export default function Breadcrumbs({ items }) {
  return (
    <nav className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-8" aria-label="Breadcrumb">
      <Link to="/" className="hover:text-black transition-colors">Home</Link>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-3">
          <span className="text-gray-200">/</span>
          {item.href ? (
            <Link to={item.href} className="hover:text-black transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
