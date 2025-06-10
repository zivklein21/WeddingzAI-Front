import React from "react";
import styles from "./Invitation.module.css";
import * as Icons from "../../icons/index";

export default function InvitationFlowStepper({ step }: { step: number }) {
  const steps = [
    { icon: <Icons.ImageIcon />, label: "Background" },
    { icon: <Icons.ListIcon />, label: "Details" },
    { icon: <Icons.EditIocn />, label: "Design" },
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