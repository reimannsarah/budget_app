export type Subscription = {
  id: number;
  amount: number;
  credit_card_id: number | null;
  due_date: string;
  name: string;
  payment_method_id: number;
  created_at: string;
  updated_at: string;
};
