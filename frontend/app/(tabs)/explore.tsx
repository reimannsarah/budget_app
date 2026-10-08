import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { PolarChart, Pie } from "victory-native";
import { useFont } from "@shopify/react-native-skia";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors, Fonts } from "@/constants/theme";
import { assignChartColors } from "@/app/utils/assign-chart-colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  budgetItems,
  creditCards,
  incomes,
  loans,
  paymentMethods,
  subscriptions,
} from "@/assets/test-data/data";

function LegendRows({ data, labelKey, valueKey, total }: {
  data: { color: string; [key: string]: any }[];
  labelKey: string;
  valueKey: string;
  total: number;
}) {
  return (
    <View style={styles.legend}>
      {data.map((item, i) => (
        <View key={i} style={styles.legendRow}>
          <View style={[styles.legendSwatch, { backgroundColor: item.color }]} />
          <ThemedText style={styles.legendLabel}>{item[labelKey]}</ThemedText>
          <ThemedText style={styles.legendValue}>
            ${Number(item[valueKey]).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </ThemedText>
          <ThemedText style={styles.legendPercent}>
            {((Number(item[valueKey]) / total) * 100).toFixed(1)}%
          </ThemedText>
        </View>
      ))}
    </View>
  );
}

function BarRows({ data, labelKey, valueKey, maxValue }: {
  data: { color: string; [key: string]: any }[];
  labelKey: string;
  valueKey: string;
  maxValue: number;
}) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const trackBg = isDark ? "#2a3a3e" : "#d4e8e5";

  return (
    <View style={styles.barContainer}>
      {data.map((item, i) => (
        <View key={i} style={styles.barRow}>
          <View style={styles.barLabelRow}>
            <ThemedText style={styles.barLabel}>{item[labelKey]}</ThemedText>
            <ThemedText style={styles.barValue}>
              ${Number(item[valueKey]).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </ThemedText>
          </View>
          <View style={[styles.barTrack, { backgroundColor: trackBg }]}>
            <View
              style={[
                styles.barFill,
                {
                  backgroundColor: item.color,
                  width: `${(Number(item[valueKey]) / maxValue) * 100}%`,
                },
              ]}
            />
          </View>
        </View>
      ))}
    </View>
  );
}

function GroupedCount({ data, groupKey }: {
  data: { [key: string]: any }[];
  groupKey: string;
}) {
  const groups: Record<string, number> = {};
  data.forEach((item) => {
    const key = item[groupKey];
    groups[key] = (groups[key] || 0) + 1;
  });

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const chipBg = isDark ? "#1a2e33" : "#e8f4f2";

  return (
    <View style={styles.chipContainer}>
      {Object.entries(groups).map(([label, count]) => (
        <View key={label} style={[styles.chip, { backgroundColor: chipBg, borderColor: Colors.chartColors.cream }]}>
          <ThemedText style={styles.chipLabel}>{label}</ThemedText>
          <ThemedText style={[styles.chipCount, { color: Colors.chartColors.cream }]}>{count}</ThemedText>
        </View>
      ))}
    </View>
  );
}

export default function ChartsScreen() {
  const font = useFont(Fonts.sans, 12);

  const budgetData = assignChartColors(budgetItems);
  const budgetTotal = budgetItems.reduce((s, i) => s + i.amount, 0);

  const incomeData = assignChartColors(incomes);
  const incomeTotal = incomes.reduce((s, i) => s + i.amount, 0);

  const subData = assignChartColors(subscriptions);
  const subTotal = subscriptions.reduce((s, i) => s + i.amount, 0);

  const creditData = assignChartColors(creditCards);
  const maxCredit = Math.max(...creditCards.map((c) => c.credit_limit));

  const loanData = assignChartColors(loans);
  const maxLoan = Math.max(...loans.map((l) => l.amount));

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <ThemedText type="title" style={styles.heading}>Charts</ThemedText>

        <ThemedText type="subtitle" style={styles.sectionTitle}>Budget Items</ThemedText>
        <View style={styles.chartWrapper}>
          <PolarChart
            data={budgetData}
            colorKey="color"
            labelKey="category"
            valueKey="amount"
          >
            <Pie.Chart>
              {() => (
                <Pie.Slice>
                  <Pie.Label font={font} />
                </Pie.Slice>
              )}
            </Pie.Chart>
          </PolarChart>
        </View>
        <LegendRows data={budgetData} labelKey="category" valueKey="amount" total={budgetTotal} />

        <ThemedText type="subtitle" style={styles.sectionTitle}>Incomes</ThemedText>
        <View style={styles.chartWrapper}>
          <PolarChart
            data={incomeData}
            colorKey="color"
            labelKey="source"
            valueKey="amount"
          >
            <Pie.Chart>
              {() => (
                <Pie.Slice>
                  <Pie.Label font={font} />
                </Pie.Slice>
              )}
            </Pie.Chart>
          </PolarChart>
        </View>
        <LegendRows data={incomeData} labelKey="source" valueKey="amount" total={incomeTotal} />

        <ThemedText type="subtitle" style={styles.sectionTitle}>Subscriptions</ThemedText>
        <View style={styles.chartWrapper}>
          <PolarChart
            data={subData}
            colorKey="color"
            labelKey="name"
            valueKey="amount"
          >
            <Pie.Chart>
              {() => (
                <Pie.Slice>
                  <Pie.Label font={font} />
                </Pie.Slice>
              )}
            </Pie.Chart>
          </PolarChart>
        </View>
        <LegendRows data={subData} labelKey="name" valueKey="amount" total={subTotal} />

        <ThemedText type="subtitle" style={styles.sectionTitle}>Credit Cards by Limit</ThemedText>
        <BarRows data={creditData} labelKey="name" valueKey="credit_limit" maxValue={maxCredit} />

        <ThemedText type="subtitle" style={styles.sectionTitle}>Loans by Amount</ThemedText>
        <BarRows data={loanData} labelKey="name" valueKey="amount" maxValue={maxLoan} />

        <ThemedText type="subtitle" style={styles.sectionTitle}>Payment Methods</ThemedText>
        <GroupedCount data={paymentMethods} groupKey="type" />

        <View style={{ height: 40 }} />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 16, paddingTop: 60 },
  heading: { marginBottom: 20 },
  sectionTitle: { marginTop: 24, marginBottom: 12 },
  chartWrapper: { height: 300 },
  legend: { gap: 8, paddingHorizontal: 8 },
  legendRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  legendSwatch: { width: 14, height: 14, borderRadius: 3 },
  legendLabel: { flex: 1, fontSize: 14 },
  legendValue: { fontSize: 14, fontWeight: "600", minWidth: 70, textAlign: "right" },
  legendPercent: { fontSize: 13, opacity: 0.6, minWidth: 45, textAlign: "right" },
  barContainer: { gap: 12, paddingHorizontal: 8 },
  barRow: { gap: 4 },
  barLabelRow: { flexDirection: "row", justifyContent: "space-between" },
  barLabel: { fontSize: 14 },
  barValue: { fontSize: 14, fontWeight: "600" },
  barTrack: { height: 16, borderRadius: 8, overflow: "hidden" },
  barFill: { height: "100%", borderRadius: 8 },
  chipContainer: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  chip: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: "center",
  },
  chipLabel: { fontSize: 14, fontWeight: "600" },
  chipCount: { fontSize: 24, fontWeight: "700", marginTop: 4 },
});
