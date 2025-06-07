import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth/AuthContext";
import { useNavigate } from "react-router-dom";
import styles from "./Menu.module.css";
import MenuFlowStepper from "./MenuFlowStepper";
import BackgroundSection from "./BackgroundSection";
import DishesSection from "./DishesSection";
import DesignSection from "./DesignSection";
import menuService, { Dish } from "../../services/menu-service";
import { FiArrowLeft } from "react-icons/fi";

export default function Menu() {
  const [step, setStep] = useState(0);
  const [menuData, setMenuData] = useState({
    coupleNames: "",
    designPrompt: "",
    backgroundUrl: "",
    dishes: [] as Dish[],
    finalCanvasJson: undefined as string | undefined,
  });

  const user = useAuth();
  const userId = user.user?._id ?? "";
  const navigate = useNavigate();

  // לקיחת התפריט מהשרת כאשר userId זמין
  useEffect(() => {
    if (!userId) return;

    menuService.getMenuByUserId(userId)
      .then(res => {
        console.log("Menu data from server:", res.data);
        setMenuData(res.data);
      })
      .catch(err => {
        console.error("Failed to fetch menu:", err);
      });
  }, [userId]);

  // אם יש שם בני הזוג, נעדכן את השדה בצורה נקייה
  const coupleNames = `${user.user?.firstPartner ?? ""} & ${user.user?.secondPartner ?? ""}`;

  return (
    <div className={styles.menuPage}>
      <div className={styles.menuContainer}>
        
        <FiArrowLeft className={styles.backIcon} onClick={() => navigate(-1)} title="Go Back" />
        <h2 className={styles.menuHeader}>Menu</h2>

        <MenuFlowStepper step={step} />

        {step === 0 && (
          <BackgroundSection
            userId={userId}
            coupleNames={coupleNames}
            designPrompt={menuData.designPrompt}
            setDesignPrompt={(prompt) => setMenuData(d => ({ ...d, designPrompt: prompt }))}
            backgroundUrl={menuData.backgroundUrl}
            setBackgroundUrl={(url) => setMenuData(d => ({ ...d, backgroundUrl: url }))}
            onDone={() => setStep(1)}
          />
        )}

        {step === 1 && (
          <DishesSection
            dishes={menuData.dishes}
            setDishes={(dishes) => setMenuData(d => ({ ...d, dishes }))}
            onDone={() => setStep(2)}
            userId={userId}
          />
        )}

        {step === 2 && (
          <DesignSection
            userId={userId}
            backgroundUrl={menuData.backgroundUrl}
            dishes={menuData.dishes}
            coupleNames={menuData.coupleNames || coupleNames}
            existingDesignJson={
              (() => {
                try {
                  return menuData.finalCanvasJson ? JSON.parse(menuData.finalCanvasJson) : undefined;
                } catch {
                  return undefined;
                }
              })()
            }
          />
        )}
      </div>
    </div>
  );
}