import { Colors } from "@/constants/theme";

export function assignChartColors<T extends object>(dataArray: T[]) {
  const colorArray = Object.values(Colors.chartColors);
  return dataArray.map((row, index) => ({
    ...row,
    color: colorArray[index % colorArray.length],
  }));
}
