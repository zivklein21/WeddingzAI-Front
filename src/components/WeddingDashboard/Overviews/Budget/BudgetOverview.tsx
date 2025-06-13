import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { getBudget } from '../../../../services/budget-service';
import styles from './BudgetOverview.module.css';
import * as Icons from "../../../../icons/index";

interface Budget {
  totalBudget: number;
  categories: { name: string; amount: number }[];
}

export default function BudgetOverview() {
  const [budget, setBudget] = useState<Budget | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const { request, abort } = getBudget();
    request
      .then((resp) => setBudget(resp.data))
      .catch(() => setError('Failed to load budget'));
    return abort;
  }, []);

  if (error) return <div className={styles.card}><Icons.ErrorIcon className='errorIcon'/></div>;
  if (!budget) return <div className={styles.card}><Icons.LoaderIcon className='spinner'/></div>;

  const spent = budget.categories.reduce((sum, c) => sum + c.amount, 0);
  const remaining = budget.totalBudget - spent;
  const percent = budget.totalBudget
    ? Math.round((spent / budget.totalBudget) * 100)
    : 0;

  const pieData = [
    { name: 'Spent', value: spent },
    { name: 'Remaining', value: remaining }
  ];

  const COLORS = ['#A5E5B5', '#E0E0E0'];

  return (
    <div>
      <div className={styles.content}>
        <div className={styles.chart}>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie
                data={pieData}
                innerRadius={30}
                outerRadius={50}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className={styles.centerLabel}>{percent}%</div>
        </div>

        <div className={styles.stats}>
          <div className={styles.statRow}>
            <span className={styles.statLabel}>Total Budget:</span>
            <span className={styles.statValue}>
              {budget.totalBudget.toLocaleString()}$
            </span>
          </div>
          <div className={styles.statRow}>
            <span className={styles.statLabel}>Spent:</span>
            <span className={styles.statValue}>
              {spent.toLocaleString()}$ ({percent}%)
            </span>
          </div>
          <div className={styles.statRow}>
            <span className={styles.statLabel}>Remaining:</span>
            <span className={styles.statValue}>
              {remaining.toLocaleString()}$
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}