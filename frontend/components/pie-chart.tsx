import { assignChartColors } from "@/utils/assign-chart-colors";
import { budgetItems } from "@/assets/test-data/data";
import { Fonts } from "@/constants/theme";
import { useFont } from "@shopify/react-native-skia";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { PolarChart, Pie } from "victory-native";
import { ThemedText } from "@/components/themed-text";

type ChartDataItem = {
  category: string;
  amount: number;
  color: string;
};

export default function PieChart() {
  const font = useFont(Fonts.sans, 12);
  const dataWithColors = assignChartColors(budgetItems);
  const [chartData] = useState<ChartDataItem[]>(dataWithColors);

  const total = chartData.reduce((sum, item) => sum + item.amount, 0);

  return (
    <View style={styles.container}>
      <View style={styles.chartWrapper}>
        <PolarChart
          data={chartData}
          colorKey={"color"}
          labelKey={"category"}
          valueKey={"amount"}
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
      <View style={styles.legend}>
        {chartData.map((item) => (
          <View key={item.category} style={styles.legendRow}>
            <View style={[styles.legendSwatch, { backgroundColor: item.color }]} />
            <ThemedText style={styles.legendLabel}>{item.category}</ThemedText>
            <ThemedText style={styles.legendValue}>
              ${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </ThemedText>
            <ThemedText style={styles.legendPercent}>
              {((item.amount / total) * 100).toFixed(1)}%
            </ThemedText>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  chartWrapper: {
    height: 300,
  },
  legend: {
    gap: 8,
    paddingHorizontal: 8,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendSwatch: {
    width: 14,
    height: 14,
    borderRadius: 3,
  },
  legendLabel: {
    flex: 1,
    fontSize: 14,
  },
  legendValue: {
    fontSize: 14,
    fontWeight: "600",
    minWidth: 70,
    textAlign: "right",
  },
  legendPercent: {
    fontSize: 13,
    opacity: 0.6,
    minWidth: 45,
    textAlign: "right",
  },
});
