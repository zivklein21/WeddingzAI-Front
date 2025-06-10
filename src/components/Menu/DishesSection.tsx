import React, { useState, useEffect } from "react";
import menuService, { Dish as DishType } from "../../services/menu-service";
import styles from "./Menu.module.css";
import {toast} from "react-toastify";
import * as Icons from "../../icons/index";

interface Props {
  userId: string;
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

export default function DishesSection({ userId, dishes, setDishes, onDone }: Props) {
  const [form, setForm] = useState<DishType>(emptyDish);
  const [loading, setLoading] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedDish, setEditedDish] = useState<DishType | null>(null);

  useEffect(() => {
    if (userId && dishes.length === 0) {
      const fetchDishes = async () => {
        setLoading(true);
        try {
          const res = await menuService.getMenuByUserId(userId);
          if (res.data && res.data.dishes) {
            setDishes(res.data.dishes);
          } else {
            setDishes([]);
          }
        } catch (err) {
          console.error("Failed to fetch dishes", err);
          toast.error("Failed to fetch dishes");
        } finally {
          setLoading(false);
        }
      };
      fetchDishes();
    }
  }, [userId]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.description.trim()) return;
    setDishes([...dishes, { ...form }]);
    setForm(emptyDish);
  };

  const handleRemove = (idx: number) => {
    if (editingIndex === idx) {
      setEditingIndex(null);
      setEditedDish(null);
    }
    setDishes(dishes.filter((_, i) => i !== idx));
  };

  const startEdit = (idx: number) => {
    setEditingIndex(idx);
    setEditedDish({ ...dishes[idx] });
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditedDish(null);
  };

  const saveEdit = () => {
    if (editedDish) {
      const newDishes = [...dishes];
      newDishes[editingIndex!] = editedDish;
      setDishes(newDishes);
      setEditingIndex(null);
      setEditedDish(null);
    }
  };

  const handleSaveAll = async () => {
    if (!userId) {
      toast.info("Missing user ID");
      return;
    }
    setLoading(true);
    try {
      await menuService.updateDishesByUserId(userId, dishes);
      toast.success("Dishes saved successfully");
      onDone();
    } catch (err) {
      console.error("Failed to save dishes", err);
      toast.error("Failed to save dishes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form
        onSubmit={handleAdd}
        className={styles.formRow}
      >
        <input
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          placeholder="Dish name"
          required
          className={styles.input}
        />
        <input
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          placeholder="Description"
          required
          className={styles.input}
        />
        <select
          value={form.category}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              category: e.target.value as DishType["category"],
            }))
          }
          className={styles.select}
        >
          <option value="On the table">On the table</option>
          <option value="Starters">Starters</option>
          <option value="Intermediates">Intermediates</option>
          <option value="Mains">Mains</option>
          <option value="Desserts">Desserts</option>
        </select>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={form.isVegetarian}
            onChange={(e) =>
              setForm((f) => ({ ...f, isVegetarian: e.target.checked }))
            }
          />
          <Icons.VeganIcon className="icon"/>
        </label>
        <span className="icon" onClick={handleAdd}>
          <Icons.AddIcon />
        </span>
      </form>

      {dishes.length === 0 ? (
        <div>No dishes added yet</div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.menuTable}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Category</th>
                <th>Vegetarian</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {dishes.map((dish, i) => (
                <tr key={i}>
                  <td>
                    {editingIndex === i ? (
                      <input
                        className={styles.editInput}
                        value={editedDish?.name || ""}
                        onChange={(e) =>
                          setEditedDish((d) => d && { ...d, name: e.target.value })
                        }
                      />
                    ) : (
                      dish.name
                    )}
                  </td>
                  <td>
                    {editingIndex === i ? (
                      <input
                        className={styles.editInput}
                        value={editedDish?.description || ""}
                        onChange={(e) =>
                          setEditedDish((d) => d && { ...d, description: e.target.value })
                        }
                      />
                    ) : (
                      dish.description
                    )}
                  </td>
                  <td>
                    {editingIndex === i ? (
                      <select
                        className={styles.editSelect}
                        value={editedDish?.category || "On the table"}
                        onChange={(e) => {
                          const value = e.target.value as "On the table" | "Starters" | "Intermediates" | "Mains" | "Desserts";
                          setEditedDish((d) => d && { ...d, category: value });
                        }}
                      >
                        <option value="On the table">On the table</option>
                        <option value="Starters">Starters</option>
                        <option value="Intermediates">Intermediates</option>
                        <option value="Mains">Mains</option>
                        <option value="Desserts">Desserts</option>
                      </select>
                    ) : (
                      dish.category
                    )}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {editingIndex === i ? (
                      <input
                        type="checkbox"
                        checked={editedDish?.isVegetarian || false}
                        onChange={(e) =>
                          setEditedDish((d) => d && { ...d, isVegetarian: e.target.checked })
                        }
                      />
                    ) : dish.isVegetarian ? (
                      "Yes"
                    ) : (
                      "No"
                    )}
                  </td>
                  <td>
                    {editingIndex === i ? (
                      <>
                        <span onClick={saveEdit} className="icon"  style={{ marginRight: 6 }}>
                          <Icons.SaveIcon title="Save Dish"/>
                        </span>
                        <span onClick={cancelEdit} className="icon" >
                          <Icons.CloseIcon title="Cancel Edit"/>
                        </span>
                      </>
                    ) : (
                      <>
                        <span onClick={() => startEdit(i)} className="icon" style={{ marginRight: 6 }}>
                          <Icons.EditIocn title="Edit Dish"/>
                        </span>
                        <span onClick={() => handleRemove(i)} className="icon" >
                          <Icons.DeleteIcon title="Delete Dish"/>
                        </span>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <span
        onClick={handleSaveAll}
        style={{
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.5 : 1,
          fontSize: 28,
          marginTop: 10,
        }}
        className={styles.buttonRight}
      >
        <Icons.CheckIcon title="Save Dishes" className="icon"/>
      </span>

      {loading && <div className={styles.buttonRight}><Icons.LoaderIcon className="spinner"/></div>}
    </div>
  );
}