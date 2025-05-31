import React, { useState } from "react";
import styles from "./Menu.module.css";
import { useNavigate } from 'react-router-dom';

// Icons
import { FiArrowLeft } from "react-icons/fi";

export interface Dish {
  name: string;
  description: string;
  category: string;
  isVegetarian: boolean;
}

// Components
import MenuFlowStepper from "./MenuFlowStepper";
import BackgroundSection from "./BackgroundSection";
import DishesSection from "./DishesSection";
import DesignSection from "./DesignSection";


export default function Menu() {
  const [step, setStep] = useState(0);

  // states
  const [designPrompt, setDesignPrompt] = useState('');
  const [backgroundUrl, setBackgroundUrl] = useState('');
  const [dishes, setDishes] = useState<Dish[]>([]);
  const navigate = useNavigate();

  return (
    <div className={styles.menuPage}>
      <div className={styles.menuContainer}>
        <FiArrowLeft className={styles.backIcon} onClick={() => navigate(-1)} title="Go Back" />
        <h2 className={styles.menuHeader}>Menu</h2>
        
        <MenuFlowStepper step={step} />
        {step === 0 && (
          <BackgroundSection
            designPrompt={designPrompt}
            setDesignPrompt={setDesignPrompt}
            backgroundUrl={backgroundUrl}
            setBackgroundUrl={setBackgroundUrl}
            onDone={() => setStep(1)}
          />
        )}
        {step === 1 && (
          <DishesSection
            dishes={dishes}
            setDishes={setDishes}
            onDone={() => setStep(2)}
          />
        )}
        {step === 2 && (
          <DesignSection
            backgroundUrl={backgroundUrl}
            dishes={dishes}
          />
        )}
      </div>
    </div>
  );
}