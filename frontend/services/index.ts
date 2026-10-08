import { createResourceService } from "./resource-service";
import type { BudgetItem } from "@/types/budget-items";
import type { CreditCard } from "@/types/credit-card";
import type { Income } from "@/types/income";
import type { Loan } from "@/types/loan";
import type { PaymentMethod } from "@/types/payment-method";
import type { Subscription } from "@/types/subscription";

export const budgetItemService = createResourceService<BudgetItem>("/api/budget-items/");
export const creditCardService = createResourceService<CreditCard>("/api/credit-cards/");
export const incomeService = createResourceService<Income>("/api/incomes/");
export const loanService = createResourceService<Loan>("/api/loans/");
export const paymentMethodService = createResourceService<PaymentMethod>("/api/payment-methods/");
export const subscriptionService = createResourceService<Subscription>("/api/subscriptions/");
