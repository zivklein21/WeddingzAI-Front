// src/components/Budget/BudgetChart.tsx
import React, { useState, useEffect } from "react";
import { getBudget, CanceledError } from "../../services/budget-service";
import { Budget } from "../../types";
import "./budget-chart.css";

// כל צבעי הפסטל שלך (לא לבן כמעט)
const PASTEL_COLORS = [
  "#FFFEEC", "#FAF8F6", "#FFF8D5", "#D5F6FB", "#F6F3A9", "#E5ECF8",
  "#FOEBD8", "#D1FEB8", "#EFDFD8", "#F7DFC2", "#EBCCFF", "#E7D7CA",
  "#BEDDF1", "#DAD4B6", "#E9C9AA", "#E7D27C", "#CFCFC4", "#F6B8D0",
  "#E3A7B5", "#F8C57C", "#D7CAB7", "#A4D8D8", "#D4C6AA", "#D3C7A2"
];

interface BudgetChartProps {
  /** קוטר הדיאגרמה בפיקסלים */
  size?: number;
  /** עובי הטבעת בפיקסלים */
  strokeWidth?: number;
}

export default function BudgetChart({
  size = 100,
  strokeWidth = 12,
}: BudgetChartProps) {
  const [budget, setBudget] = useState<Budget | null>(null);

  useEffect(() => {
    const { request, abort } = getBudget();
    request
      .then(res => setBudget(res.data))
      .catch(err => {
        if (!(err instanceof CanceledError)) console.error(err);
      });
    return () => abort();
  }, []);

  if (!budget) return <p className="bc-loading">Loading…</p>;

  const { totalBudget, categories } = budget;
  const totalSpent = categories.reduce((sum, c) => sum + c.amount, 0);
  const totalPct = Math.min(100, Math.round((totalSpent / totalBudget) * 100));

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let cumulativeFraction = 0; // מעקב אחרי איפה אנחנו במסלול

  return (
    <div className="bc-wrapper" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* 1) טבעת שחורה מלאה */}
        <circle
          cx={size/2} cy={size/2} r={radius}
          fill="none"
          stroke="#000"
          strokeWidth={strokeWidth}
          strokeLinecap="butt"
        />
        {/* 2) סלייס אחד לכל קטגוריה (pastel), צמודים בלי רווחים */}
        {categories.map((cat, i) => {
          const fraction = cat.amount / totalBudget; // חלק היחסי
          const sliceLen = fraction * circumference;
          const dashArray = `${sliceLen} ${circumference}`;
          const dashOffset = circumference * (1 - cumulativeFraction);
          cumulativeFraction += fraction;
          const color = PASTEL_COLORS[i % PASTEL_COLORS.length];

          return (
            <circle
              key={cat.name}
              cx={size/2} cy={size/2} r={radius}
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeDasharray={dashArray}
              strokeDashoffset={dashOffset}
              strokeLinecap="butt"
              transform={`rotate(-90 ${size/2} ${size/2})`}
            />
          );
        })}
        {/* 3) אחוז במרכז בשחור */}
        <text
          x="50%" y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="bc-label"
        >
          {totalPct}%
        </text>
      </svg>
    </div>
  );
}