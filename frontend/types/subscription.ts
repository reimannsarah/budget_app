export type Subscription = {
  id: number;
  amount: number;
  credit_card: number | null;
  due_date: string;
  name: string;
  payment_method: number;
  created_at: string;
  updated_at: string;
};
