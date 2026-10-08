export type FieldConfig = {
  key: string;
  label: string;
  keyboard?: "default" | "decimal-pad" | "number-pad";
};

export const budgetItemFields: FieldConfig[] = [
  { key: "category", label: "Category" },
  { key: "amount", label: "Amount", keyboard: "decimal-pad" },
  { key: "percentage_of_income", label: "% of Income", keyboard: "decimal-pad" },
];

export const creditCardFields: FieldConfig[] = [
  { key: "name", label: "Name" },
  { key: "credit_limit", label: "Credit Limit", keyboard: "decimal-pad" },
  { key: "annual_fee", label: "Annual Fee", keyboard: "decimal-pad" },
  { key: "minimum_monthly_payment", label: "Min Monthly Payment", keyboard: "decimal-pad" },
  { key: "due_date", label: "Due Date" },
  { key: "statement_date", label: "Statement Date" },
];

export const incomeFields: FieldConfig[] = [
  { key: "source", label: "Source" },
  { key: "amount", label: "Amount", keyboard: "decimal-pad" },
];

export const loanFields: FieldConfig[] = [
  { key: "name", label: "Name" },
  { key: "amount", label: "Amount", keyboard: "decimal-pad" },
  { key: "minimum_monthly_payment", label: "Min Monthly Payment", keyboard: "decimal-pad" },
  { key: "due_date", label: "Due Date" },
];

export const paymentMethodFields: FieldConfig[] = [
  { key: "name", label: "Name" },
  { key: "type", label: "Type" },
];

export const subscriptionFields: FieldConfig[] = [
  { key: "name", label: "Name" },
  { key: "amount", label: "Amount", keyboard: "decimal-pad" },
  { key: "due_date", label: "Due Date" },
  { key: "payment_method", label: "Payment Method ID", keyboard: "number-pad" },
  { key: "credit_card", label: "Credit Card ID", keyboard: "number-pad" },
];
