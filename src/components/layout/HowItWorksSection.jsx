const steps = [
  {
    step: '01',
    title: 'Choose Your Tool',
    description: 'Select from our range of financial calculators or rate comparison tools.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    step: '02',
    title: 'Enter Your Details',
    description: 'Input your loan amount, interest rate, and tenure — or let us auto-fill with current bank rates.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
  },
  {
    step: '03',
    title: 'Get Instant Results',
    description: 'See your monthly repayments, total interest, amortization schedules, and visual charts instantly.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    step: '04',
    title: 'Compare & Decide',
    description: 'Compare options from different banks and make an informed decision that saves you money.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 lg:py-28 gradient-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
            How It Works
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-light-50 mb-4">
            Financial Clarity in{' '}
            <span className="gradient-text">4 Simple Steps</span>
          </h2>
          <p className="text-light-400 text-lg">
            No sign-up, no fees, no hassle. Just smart tools for smart decisions.
          </p>
        </div>

        {/* Steps */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {steps.map((step, i) => (
            <div key={step.step} className="relative group">
              {/* Connector line (desktop) */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[60%] w-full h-px bg-gradient-to-r from-white/10 to-transparent z-0" />
              )}

              <div className="relative glass-card-light p-6 lg:p-8 text-center hover:bg-white/[0.06] transition-smooth z-10">
                {/* Step number */}
                <div className="text-xs font-bold text-primary/40 font-mono mb-4">{step.step}</div>

                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-5 group-hover:scale-110 group-hover:bg-primary/15 transition-smooth">
                  {step.icon}
                </div>

                <h3 className="text-lg font-semibold text-light-50 mb-2">{step.title}</h3>
                <p className="text-sm text-light-400 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
