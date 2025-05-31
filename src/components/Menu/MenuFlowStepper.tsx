import React from "react";
import styles from "./Menu.module.css";
import { BiFoodMenu } from "react-icons/bi";
import { FiEdit2 } from "react-icons/fi";
import {CiImageOn}from "react-icons/ci";

export default function MenuFlowStepper({ step }: { step: number }) {
  const steps = [
    { icon: <CiImageOn />, label: "Background" },
    { icon: <BiFoodMenu />, label: "Dishes" },
    { icon: <FiEdit2 />, label: "Design" },
  ];
  return (
    <div className={styles.stepsWrapper}>
      {steps.map((s, i) => (
        <React.Fragment key={i}>
          <div className={`${styles.step} ${step === i ? styles.activeStep : step > i ? styles.completedStep : ""}`}>
            <div className={styles.iconCircle}>{s.icon}</div>
            <div className={styles.stepLabel}>{s.label}</div>
          </div>
          {i < steps.length - 1 && (
            <div className={step > i ? styles.completedConnector : styles.connector} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}