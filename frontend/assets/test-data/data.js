export const budgetItems = [
  { id: 1, amount: 1200.00, category: "Rent", percentage_of_income: 30.00, created_at: "2026-01-01", updated_at: "2026-03-01" },
  { id: 2, amount: 400.00, category: "Groceries", percentage_of_income: 10.00, created_at: "2026-01-01", updated_at: "2026-03-01" },
  { id: 3, amount: 150.00, category: "Utilities", percentage_of_income: 3.75, created_at: "2026-01-01", updated_at: "2026-03-01" },
  { id: 4, amount: 200.00, category: "Transportation", percentage_of_income: 5.00, created_at: "2026-01-01", updated_at: "2026-03-01" },
  { id: 5, amount: 100.00, category: "Entertainment", percentage_of_income: 2.50, created_at: "2026-01-01", updated_at: "2026-03-01" },
  { id: 6, amount: 600.00, category: "Shopping", percentage_of_income: 15.00, created_at: "2026-01-01", updated_at: "2026-03-01" },
  { id: 7, amount: 500.00, category: "Leftover", percentage_of_income: 12.50, created_at: "2026-01-01", updated_at: "2026-03-01" },
];

export const creditCards = [
  { id: 1, annual_fee: 95.00, credit_limit: 10000, due_date: "2026-04-15", name: "Chase Sapphire", minimum_monthly_payment: 25.00, statement_date: "2026-03-20", created_at: "2026-01-01", updated_at: "2026-03-01" },
  { id: 2, annual_fee: 0.00, credit_limit: 5000, due_date: "2026-04-10", name: "Citi Double Cash", minimum_monthly_payment: 15.00, statement_date: "2026-03-15", created_at: "2026-01-01", updated_at: "2026-03-01" },
  { id: 3, annual_fee: 550.00, credit_limit: 20000, due_date: "2026-04-22", name: "Amex Platinum", minimum_monthly_payment: 35.00, statement_date: "2026-03-27", created_at: "2026-01-01", updated_at: "2026-03-01" },
  { id: 4, annual_fee: 0.00, credit_limit: 3000, due_date: "2026-04-05", name: "Discover It", minimum_monthly_payment: 10.00, statement_date: "2026-03-10", created_at: "2026-01-01", updated_at: "2026-03-01" },
  { id: 5, annual_fee: 195.00, credit_limit: 15000, due_date: "2026-04-18", name: "Capital One Venture", minimum_monthly_payment: 20.00, statement_date: "2026-03-23", created_at: "2026-01-01", updated_at: "2026-03-01" },
];

export const incomes = [
  { id: 1, amount: 4000.00, source: "Full-time Job", created_at: "2026-01-01", updated_at: "2026-03-01" },
  { id: 2, amount: 800.00, source: "Freelance", created_at: "2026-01-01", updated_at: "2026-03-01" },
  { id: 3, amount: 200.00, source: "Dividends", created_at: "2026-01-01", updated_at: "2026-03-01" },
  { id: 4, amount: 150.00, source: "Rental Income", created_at: "2026-01-01", updated_at: "2026-03-01" },
  { id: 5, amount: 50.00, source: "Side Project", created_at: "2026-01-01", updated_at: "2026-03-01" },
];

export const loans = [
  { id: 1, amount: 15000.00, due_date: "2028-06-01", minimum_monthly_payment: 320.00, name: "Car Loan", created_at: "2026-01-01", updated_at: "2026-03-01" },
  { id: 2, amount: 28000.00, due_date: "2032-01-01", minimum_monthly_payment: 450.00, name: "Student Loan", created_at: "2026-01-01", updated_at: "2026-03-01" },
  { id: 3, amount: 5000.00, due_date: "2027-03-15", minimum_monthly_payment: 150.00, name: "Personal Loan", created_at: "2026-01-01", updated_at: "2026-03-01" },
  { id: 4, amount: 2500.00, due_date: "2026-12-01", minimum_monthly_payment: 100.00, name: "Medical Loan", created_at: "2026-01-01", updated_at: "2026-03-01" },
  { id: 5, amount: 8000.00, due_date: "2029-09-01", minimum_monthly_payment: 200.00, name: "Home Improvement Loan", created_at: "2026-01-01", updated_at: "2026-03-01" },
];

export const paymentMethods = [
  { id: 1, name: "Chase Sapphire", type: "Credit Card", created_at: "2026-01-01", updated_at: "2026-03-01" },
  { id: 2, name: "Chase Checking", type: "Debit Card", created_at: "2026-01-01", updated_at: "2026-03-01" },
  { id: 3, name: "PayPal", type: "Digital Wallet", created_at: "2026-01-01", updated_at: "2026-03-01" },
  { id: 4, name: "Amex Platinum", type: "Credit Card", created_at: "2026-01-01", updated_at: "2026-03-01" },
  { id: 5, name: "Apple Pay", type: "Digital Wallet", created_at: "2026-01-01", updated_at: "2026-03-01" },
];

export const subscriptions = [
  { id: 1, amount: 15.99, credit_card: 1, due_date: "2026-04-01", name: "Netflix", payment_method: 1, created_at: "2026-01-01", updated_at: "2026-03-01" },
  { id: 2, amount: 9.99, credit_card: 2, due_date: "2026-04-05", name: "Spotify", payment_method: 2, created_at: "2026-01-01", updated_at: "2026-03-01" },
  { id: 3, amount: 14.99, credit_card: 3, due_date: "2026-04-08", name: "Adobe Creative Cloud", payment_method: 4, created_at: "2026-01-01", updated_at: "2026-03-01" },
  { id: 4, amount: 12.99, credit_card: null, due_date: "2026-04-12", name: "YouTube Premium", payment_method: 3, created_at: "2026-01-01", updated_at: "2026-03-01" },
  { id: 5, amount: 6.99, credit_card: null, due_date: "2026-04-15", name: "Apple iCloud", payment_method: 5, created_at: "2026-01-01", updated_at: "2026-03-01" },
];