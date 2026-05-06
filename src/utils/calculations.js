/**
 * Financial calculation utilities for MoneyIQ calculators.
 * All calculator math lives here — pure functions, easy to test.
 */

/**
 * Calculate monthly loan repayment using the reducing balance (amortization) formula.
 * PMT = P * [r(1+r)^n] / [(1+r)^n - 1]
 * 
 * @param {number} principal - Loan amount in KES
 * @param {number} annualRate - Annual interest rate (e.g., 14.5 for 14.5%)
 * @param {number} years - Loan tenure in years
 * @returns {object} { monthlyPayment, totalPayment, totalInterest }
 */
export function calculateLoanRepayment(principal, annualRate, years) {
  const monthlyRate = annualRate / 100 / 12;
  const numPayments = years * 12;

  if (monthlyRate === 0) {
    const monthlyPayment = principal / numPayments;
    return {
      monthlyPayment,
      totalPayment: principal,
      totalInterest: 0,
    };
  }

  const monthlyPayment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
    (Math.pow(1 + monthlyRate, numPayments) - 1);

  const totalPayment = monthlyPayment * numPayments;
  const totalInterest = totalPayment - principal;

  return {
    monthlyPayment,
    totalPayment,
    totalPayable: totalPayment,
    totalInterest,
  };
}

/** Alias for Mortgage calculations */
export const calculateMortgage = calculateLoanRepayment;

/**
 * Generate full amortization schedule
 * 
 * @param {number} principal - Loan amount
 * @param {number} annualRate - Annual interest rate %
 * @param {number} years - Loan tenure
 * @returns {Array} Array of monthly payment breakdowns
 */
export function generateAmortizationSchedule(principal, annualRate, years) {
  const monthlyRate = annualRate / 100 / 12;
  const numPayments = years * 12;
  const { monthlyPayment } = calculateLoanRepayment(principal, annualRate, years);

  const schedule = [];
  let balance = principal;

  for (let month = 1; month <= numPayments; month++) {
    const interestPayment = balance * monthlyRate;
    const principalPayment = monthlyPayment - interestPayment;
    balance -= principalPayment;

    schedule.push({
      month,
      payment: monthlyPayment,
      principal: principalPayment,
      interest: interestPayment,
      balance: Math.max(0, balance),
    });
  }

  return schedule;
}

/**
 * Calculate savings growth with compound interest
 * 
 * @param {number} initialDeposit - Initial deposit in KES
 * @param {number} monthlyContribution - Monthly contribution
 * @param {number} annualRate - Annual interest rate %
 * @param {number} years - Investment period
 * @param {string} compounding - 'monthly' | 'quarterly' | 'annually'
 * @returns {object} { finalAmount, totalDeposits, totalInterest, yearlyBreakdown }
 */
export function calculateSavingsGrowth(initialDeposit, monthlyContribution, annualRate, years, compounding = 'monthly') {
  const periodsPerYear = compounding === 'monthly' ? 12 : compounding === 'quarterly' ? 4 : 1;
  const rate = annualRate / 100 / periodsPerYear;
  const totalPeriods = years * periodsPerYear;
  const contributionPerPeriod = monthlyContribution * (12 / periodsPerYear);

  let balance = initialDeposit;
  const yearlyBreakdown = [];

  for (let period = 1; period <= totalPeriods; period++) {
    balance = (balance + contributionPerPeriod) * (1 + rate);

    if (period % periodsPerYear === 0) {
      const year = period / periodsPerYear;
      const totalDeposits = initialDeposit + monthlyContribution * 12 * year;
      yearlyBreakdown.push({
        year,
        balance,
        deposits: totalDeposits,
        interest: balance - totalDeposits,
      });
    }
  }

  const totalDeposits = initialDeposit + monthlyContribution * 12 * years;
  const totalInterest = balance - totalDeposits;

  return {
    finalAmount: balance,
    totalDeposits,
    totalInterest,
    yearlyBreakdown,
  };
}

/**
 * Format number as Kenya Shillings
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format number with commas
 */
export function formatNumber(num) {
  return new Intl.NumberFormat('en-KE').format(num);
}

/**
 * Format percentage
 */
export function formatPercent(value, decimals = 2) {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format relative date
 */
export function formatRelativeDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}
