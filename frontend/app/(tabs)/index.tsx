import React from "react";
import { ScrollView, StyleSheet, View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { SummaryCard } from "@/components/summary-card";
import { useResourceList } from "@/hooks/use-resource-list";
import {
  budgetItemService,
  creditCardService,
  incomeService,
  loanService,
  paymentMethodService,
  subscriptionService,
} from "@/services";

function formatCurrency(value: number) {
  return "$" + value.toLocaleString(undefined, { minimumFractionDigits: 2 });
}

export default function HomeScreen() {
  const router = useRouter();

  const budgetItems = useResourceList(budgetItemService);
  const incomes = useResourceList(incomeService);
  const creditCards = useResourceList(creditCardService);
  const loans = useResourceList(loanService);
  const subscriptions = useResourceList(subscriptionService);
  const paymentMethods = useResourceList(paymentMethodService);

  const anyLoading =
    budgetItems.isLoading ||
    incomes.isLoading ||
    creditCards.isLoading ||
    loans.isLoading ||
    subscriptions.isLoading ||
    paymentMethods.isLoading;

  if (anyLoading) {
    return (
      <ThemedView style={styles.center}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  const budgetTotal = budgetItems.data.reduce((s, i) => s + i.amount, 0);
  const incomeTotal = incomes.data.reduce((s, i) => s + i.amount, 0);
  const creditTotal = creditCards.data.reduce((s, i) => s + i.credit_limit, 0);
  const loanTotal = loans.data.reduce((s, i) => s + i.amount, 0);
  const subTotal = subscriptions.data.reduce((s, i) => s + i.amount, 0);

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <ThemedText type="title" style={styles.heading}>
          Dashboard
        </ThemedText>

        <View style={styles.grid}>
          <SummaryCard
            title="Budget Items"
            count={budgetItems.data.length}
            total={formatCurrency(budgetTotal)}
            onPress={() => router.push("/budget-items")}
          />
          <SummaryCard
            title="Incomes"
            count={incomes.data.length}
            total={formatCurrency(incomeTotal)}
            onPress={() => router.push("/incomes")}
          />
          <SummaryCard
            title="Credit Cards"
            count={creditCards.data.length}
            total={formatCurrency(creditTotal)}
            onPress={() => router.push("/credit-cards")}
          />
          <SummaryCard
            title="Loans"
            count={loans.data.length}
            total={formatCurrency(loanTotal)}
            onPress={() => router.push("/loans")}
          />
          <SummaryCard
            title="Subscriptions"
            count={subscriptions.data.length}
            total={formatCurrency(subTotal)}
            onPress={() => router.push("/subscriptions")}
          />
          <SummaryCard
            title="Payment Methods"
            count={paymentMethods.data.length}
            onPress={() => router.push("/payment-methods")}
          />
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scroll: {
    padding: 16,
    paddingTop: 60,
  },
  heading: {
    marginBottom: 20,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
});
