import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import styles from "./budget.module.css";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Category {
  name: string;
  amount: number;
}

interface BudgetChartProps {
  categories: Category[];
}

const BudgetChart = ({ categories }: BudgetChartProps) => {
  if (categories.length === 0) return null;

  const data = {
    labels: categories.map((c) => c.name),
    datasets: [
      {
        data: categories.map((c) => c.amount),
        backgroundColor: [
          "#f48fb1",
          "#ce93d8",
          "#81d4fa",
          "#a5d6a7",
          "#ffe082",
          "#ffab91",
          "#b39ddb",
          "#80cbc4",
          "#ffcc80",
          "#e6ee9c",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className={styles.chartContainer}>
      <h3>Budget Breakdown</h3>
      <Pie data={data} />
    </div>
  );
};

export default BudgetChart;
