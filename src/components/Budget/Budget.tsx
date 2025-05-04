import React, { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import styles from "./budget.module.css";
import { FaTrashAlt, FaChevronDown } from "react-icons/fa";
import budgetService from "../../services/budget-service";
import type { Budget, BudgetCategory } from "../../services/budget-service";

const Budget = () => {
  const categoryOptions = [
    "Venue", "Suit", "Dress", "Catering", "Photography", "Flowers", "Music", "Transportation", "Decorations"
  ];
  
  const COLORS = ["#FFCCEA", "#d4af37", "#888888", "#9FB3DF", "#E6B2BA", "#FDB7EA", "#A7B49E", "#FDDBBB", "#CB9DF0", "#FFFFFF"];  
  const [totalBudget, setTotalBudget] = useState("");
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [error, setError] = useState<string | null>(null);

  const saveBudget = async (updatedCategories: BudgetCategory[], updatedTotalBudget: string) => {
    try {
      const budget: Budget = {
        totalBudget: parseFloat(updatedTotalBudget) || 0,
        categories: updatedCategories
      };
      await budgetService.updateBudget(budget).request;
      setError(null);
    } catch {
      setError("Failed to save budget changes. Please try again.");
    }
  };

  const handleAddCategory = async () => {
    const amount = parseFloat(newAmount);
    if (!selectedCategory || isNaN(amount) || amount <= 0) return;
    
    const updatedCategories = [...categories, { name: selectedCategory, amount }];
    setCategories(updatedCategories);
    setSelectedCategory("");
    setNewAmount("");
    
    await saveBudget(updatedCategories, totalBudget);
  };

  const handleRemoveCategory = async (index: number) => {
    const updatedCategories = categories.filter((_, i) => i !== index);
    setCategories(updatedCategories);
    await saveBudget(updatedCategories, totalBudget);
  };

  const handleTotalBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTotalBudget(e.target.value);
  };

  const handleTotalBudgetBlur = async () => {
    if (totalBudget) {
      await saveBudget(categories, totalBudget);
    }
  };

  const totalSpent = categories.reduce((acc, curr) => acc + curr.amount, 0);
  const remainingBudget = totalBudget ? Math.max(parseFloat(totalBudget) - totalSpent, 0) : 0;
  
  const pieData = [
    ...categories,
    { name: "Remaining Budget", amount: remainingBudget }
  ];

  if (error) {
    return <div className={styles.main}>
      <div className={styles.error}>{error}</div>
      <button onClick={() => window.location.reload()}>Retry</button>
    </div>;
  }

  return (
    <div className={styles.main}>
      <div className={styles.budgetContainer}>
        <div>
          <h2 className={styles.budgetTitle}>Wedding Budget</h2>
          <p className={styles.budgetSubtitle}>Plan your expenses with ease</p>
          <div className="mb-4">
            <label className="block font-medium">Total Wedding Budget:</label>
            <input
              type="number"
              value={totalBudget}
              onChange={handleTotalBudgetChange}
              onBlur={handleTotalBudgetBlur}
              placeholder="Enter Total Budget"
              className={styles.budgetInput}
            />
          </div>
        </div>
    
        <div className={styles.addCategoryCard}>
          <h3 className={styles.budgetSubtitle}>Add Categories</h3>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={styles.budgetInput}
          >
            <option value="" disabled>Select a category</option>
            {categoryOptions.map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </select>
          <input
            type="number"
            value={newAmount}
            onChange={(e) => setNewAmount(e.target.value)}
            placeholder="Amount"
            className={styles.budgetInput}
          />
          <button
            onClick={handleAddCategory}
            className={styles.addBtn}
          >
            Add
          </button>
        </div>
    
        {categories.length > 0 && (
          <div className="space-y-3">
            <h3 className={styles.budgetSubtitle}>Categories</h3>
            {categories.map((category, index) => (
              <div key={index} className={styles.categoryCard}>
                <div className={styles.categoryHeader}>
                  <div className={styles.categoryTitle}>
                    <FaChevronDown />
                    <span>{category.name}</span>
                  </div>
                  <div className={styles.categoryCost}>
                    <span className={styles.actualCost}>Actual Cost</span>
                    <span className={styles.costAmount}>${category.amount.toFixed(2)}</span>
                      <div className={styles.deleteIcon}>
                        <FaTrashAlt
                          onClick={() => handleRemoveCategory(index)}
                          style={{ cursor: 'pointer', color: 'red', fontSize: '1.2rem' }}
                        />
                      </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
    
        <div className={styles.categoryCard}>
          <h3 className={styles.budgetSubtitle}>Remaining Budget</h3>
          <div className={styles.costAmount}>
            {totalBudget && categories.length > 0 ? (
              <p>Remaining Budget: ${remainingBudget.toFixed(2)}</p>
            ) : (
              <p className="text-gray-500">Enter a total budget and categories to see remaining budget.</p>
            )}
          </div>
        </div>
    
        {categories.length > 0 && totalBudget && (
          <div className={styles.chartSection}>
            <h3 className={styles.budgetSubtitle}>Budget Breakdown</h3>
            <PieChart width={400} height={400}>
              <Pie
                data={pieData}
                dataKey="amount"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                fill="#8884d8"
                label={(entry) => `${((entry.amount / parseFloat(totalBudget)) * 100).toFixed(2)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.name === "Remaining Budget" ? "#DCDCDC" : COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
        )}
      </div>
    </div>
  );  
};

export default Budget;