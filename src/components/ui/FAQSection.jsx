import { useState } from 'react';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left group"
      >
        <span className="text-sm font-bold text-gray-900 uppercase tracking-widest group-hover:text-black transition-colors">
          {question}
        </span>
        <span className={`text-xl transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          {isOpen ? '−' : '+'}
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 pb-6' : 'max-h-0'
        }`}
      >
        <p className="text-sm text-gray-500 leading-relaxed">
          {answer}
        </p>
      </div>
    </div>
  );
};

export default function FAQSection({ faqs, title = "Frequently Asked Questions", showTitle = true }) {
  return (
    <section className={`mt-4 ${showTitle ? 'pt-16 border-t border-gray-50' : ''}`}>
      <div className="max-w-3xl">
        {showTitle && (
          <div className="border-l-4 border-black pl-6 py-1 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight uppercase">{title}</h2>
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">Quick answers to common queries</p>
          </div>
        )}
        <div className="space-y-2">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
}
