import React, { useState } from "react";
import styles from "./Menu.module.css";
import { FiPlus, FiTrash2, FiEdit2 , FiX} from "react-icons/fi";
import { IoCheckmarkOutline } from "react-icons/io5";

export interface Dish {
  name: string;
  description: string;
  category: string;
  isVegetarian: boolean;
}

interface Props {
  dishes: Dish[];
  setDishes: (d: Dish[]) => void;
  onDone: () => void;
}

const emptyDish: Dish = {
  name: "",
  description: "",
  category: "On the table",
  isVegetarian: false,
};

export default function DishesSection({ dishes, setDishes, onDone }: Props) {
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editDish, setEditDish] = useState<Dish>(emptyDish);

  const [form, setForm] = useState<Dish>(emptyDish);

  // Handle add new dish
  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setDishes([...dishes, form]);
    setForm(emptyDish);
  };

  // Handle edit
  const handleEdit = (i: number) => {
    setEditIndex(i);
    setEditDish(dishes[i]);
  };
  const handleEditSave = (i: number) => {
    const updated = [...dishes];
    updated[i] = editDish;
    setDishes(updated);
    setEditIndex(null);
  };

  // Remove dish
  const handleRemove = (i: number) => {
    setDishes(dishes.filter((_, idx) => idx !== i));
    if (editIndex === i) setEditIndex(null);
  };

  return (
    <div className={styles.section}>
      <h3>Menu Items</h3>
      <form className={styles.dishInputs} onSubmit={handleAdd} autoComplete="off">
        <input
          type="text"
          placeholder="Dish name"
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
        />
        <input
          type="text"
          placeholder="Dish description"
          value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
        />
        <select
          value={form.category}
          onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
        >
          <option value="On the table">On the table</option>
          <option value="Starters">Starters</option>
          <option value="Intermediates">Intermediates</option>
          <option value="Mains">Mains</option>
          <option value="Desserts">Desserts</option>
        </select>
        <label className={styles.vegBox}>
          <input
            type="checkbox"
            checked={form.isVegetarian}
            onChange={e => setForm(f => ({ ...f, isVegetarian: e.target.checked }))}
          />
          <span>Vegetarian</span>
        </label>
        <span className={styles.icon} title="Add">
          <FiPlus type="submit" onClick={handleAdd}/>
        </span>
      </form>

      {dishes.length > 0  &&
      <table className={styles.menuTable}>
        <thead>
          <tr>
            <th>Dish</th>
            <th>Description</th>
            <th>Category</th>
            <th>Vegetarian</th>
            <th></th> {/* Icons */}
          </tr>
        </thead>
        <tbody>
          {dishes.map((dish, i) =>
            editIndex === i ? (
              <tr key={i} className={styles.editRow}>
                <td>
                  <input
                    type="text"
                    value={editDish.name}
                    onChange={e => setEditDish(d => ({ ...d, name: e.target.value }))}
                    placeholder="Dish name"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={editDish.description}
                    onChange={e => setEditDish(d => ({ ...d, description: e.target.value }))}
                    placeholder="Description"
                  />
                </td>
                <td>
                  <select
                    value={editDish.category}
                    onChange={e => setEditDish(d => ({ ...d, category: e.target.value }))}
                  >
                    <option value="On the table">On the table</option>
                    <option value="Starters">Starters</option>
                    <option value="Intermediates">Intermediates</option>
                    <option value="Mains">Mains</option>
                    <option value="Desserts">Desserts</option>
                  </select>
                </td>
                <td>
                  <input
                    type="checkbox"
                    checked={editDish.isVegetarian}
                    onChange={e => setEditDish(d => ({ ...d, isVegetarian: e.target.checked }))}
                  />
                </td>
                <td>
                  <span className={styles.icon} onClick={() => handleEditSave(i)} title="Save">
                    <IoCheckmarkOutline />
                  </span>
                  <span className={styles.icon} onClick={() => setEditIndex(null)} title="Cancel">
                    <FiX />
                  </span>
                </td>
              </tr>
            ) : (
              <tr key={i}>
                <td>{dish.name}</td>
                <td>{dish.description}</td>
                <td>{dish.category}</td>
                <td>{dish.isVegetarian ? "Yes" : "No"}</td>
                <td>
                  <span className={styles.icon} onClick={() => handleEdit(i)} title="Edit">
                    <FiEdit2 />
                  </span>
                  <span className={styles.icon} onClick={() => handleRemove(i)} title="Delete">
                    <FiTrash2 />
                  </span>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>}
      <span className={styles.icon} onClick={onDone}>
        <IoCheckmarkOutline />
      </span>
    </div>
    
  );
}