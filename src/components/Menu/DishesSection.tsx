import React, { useState, useEffect } from "react";
import menuService, { Dish as DishType } from "../../services/menu-service";
import { IoCheckmarkOutline, IoTrashOutline } from "react-icons/io5";

interface Props {
  menuId: string;
  dishes: DishType[];
  setDishes: (d: DishType[]) => void;
  onDone: () => void;
}

const emptyDish: DishType = {
  name: "",
  description: "",
  category: "On the table",
  isVegetarian: false,
};

export default function DishesSection({ menuId, dishes, setDishes, onDone }: Props) {
  const [form, setForm] = useState<DishType>(emptyDish);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  if (menuId && dishes.length === 0) {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await menuService.getMenu(menuId);
        setDishes(res.data.dishes);
      } catch (err) {
          console.error("Failed to save dishes", err);
  alert("Failed to save dishes");

      } finally {
        setLoading(false);
      }
    };
    fetch();
  }
}, [menuId]);

  // Add new dish locally
  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.description.trim()) return;
    setDishes([...dishes, form]);
    setForm(emptyDish);
  };

  // Remove dish from local array
  const handleRemove = (idx: number) => {
    setDishes(dishes.filter((_, i) => i !== idx));
  };

  // Save all dishes to DB
  const handleSaveAll = async () => {
    if (loading) return;
    setLoading(true);
    try {
      onDone();
    } catch (err) {
      alert("Failed to save dishes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleAdd} style={{ marginBottom: 16, display: "flex", gap: 8 }}>
        <input
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          placeholder="Dish name"
          required
        />
        <input
          value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          placeholder="Description"
          required
        />
        <select
          value={form.category}
          onChange={e => setForm(f => ({ ...f, category: e.target.value as DishType["category"] }))}
        >
          <option value="On the table">On the table</option>
          <option value="Starters">Starters</option>
          <option value="Intermediates">Intermediates</option>
          <option value="Mains">Mains</option>
          <option value="Desserts">Desserts</option>
        </select>
        <label style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <input
            type="checkbox"
            checked={form.isVegetarian}
            onChange={e => setForm(f => ({ ...f, isVegetarian: e.target.checked }))}
          /> Vegetarian
        </label>
        <button type="submit" disabled={loading}>Add</button>
      </form>
      <table style={{ width: "100%", marginBottom: 16 }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Category</th>
            <th>Vegetarian</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {dishes.map((dish, i) => (
            <tr key={i}>
              <td>{dish.name}</td>
              <td>{dish.description}</td>
              <td>{dish.category}</td>
              <td>{dish.isVegetarian ? "Yes" : "No"}</td>
              <td>
                <span style={{ cursor: "pointer" }} onClick={() => handleRemove(i)} title="Remove">
                  <IoTrashOutline />
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <span
        onClick={handleSaveAll}
        title="Save All"
        style={{
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.5 : 1,
          fontSize: 28
        }}
      >
        <IoCheckmarkOutline />
      </span>
      {loading && <div>Saving...</div>}
    </div>
  );
}