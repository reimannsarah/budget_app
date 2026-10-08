import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { SummaryCard } from "@/components/summary-card";
import {
  budgetItems,
  creditCards,
  incomes,
  loans,
  paymentMethods,
  subscriptions,
} from "@/assets/test-data/data";

function formatCurrency(value: number) {
  return "$" + value.toLocaleString(undefined, { minimumFractionDigits: 2 });
}

export default function HomeScreen() {
  const router = useRouter();

  const budgetTotal = budgetItems.reduce((s, i) => s + i.amount, 0);
  const incomeTotal = incomes.reduce((s, i) => s + i.amount, 0);
  const creditTotal = creditCards.reduce((s, i) => s + i.credit_limit, 0);
  const loanTotal = loans.reduce((s, i) => s + i.amount, 0);
  const subTotal = subscriptions.reduce((s, i) => s + i.amount, 0);

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <ThemedText type="title" style={styles.heading}>
          Dashboard
        </ThemedText>

        <View style={styles.grid}>
          <SummaryCard
            title="Budget Items"
            count={budgetItems.length}
            total={formatCurrency(budgetTotal)}
            onPress={() => router.push("/budget-items")}
          />
          <SummaryCard
            title="Incomes"
            count={incomes.length}
            total={formatCurrency(incomeTotal)}
            onPress={() => router.push("/incomes")}
          />
          <SummaryCard
            title="Credit Cards"
            count={creditCards.length}
            total={formatCurrency(creditTotal)}
            onPress={() => router.push("/credit-cards")}
          />
          <SummaryCard
            title="Loans"
            count={loans.length}
            total={formatCurrency(loanTotal)}
            onPress={() => router.push("/loans")}
          />
          <SummaryCard
            title="Subscriptions"
            count={subscriptions.length}
            total={formatCurrency(subTotal)}
            onPress={() => router.push("/subscriptions")}
          />
          <SummaryCard
            title="Payment Methods"
            count={paymentMethods.length}
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
