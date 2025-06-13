import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth/AuthContext";
import { useNavigate } from "react-router-dom";
import InvitationFlowStepper from "./InvitationFlowStepper";
import BackgroundSection from "./BackgroundSection";
import DetailsSection from "./DetailsSection";
import DesignSection from "./DesignSection";
import invitationService, { Sentence } from "../../services/invitation-service";

import * as Icons from "../../icons/index";
import { ToastContainer } from "react-toastify";

export default function Menu() {
  const [step, setStep] = useState(0);
  const [invitationData, setInvitationData] = useState({
    coupleNames: "",
    designPrompt: "",
    backgroundUrl: "",
    sentences: [] as Sentence[],
    date: "",
    ceremonyHour: "",
    receptionHour: "",
    venue: "",
  });

  const user = useAuth();
  const userId = user.user?._id ?? "";
  const navigate = useNavigate();

  // לקיחת התפריט מהשרת כאשר userId זמין
  useEffect(() => {
    if (!userId) return;

    invitationService.getInvitationByUserId(userId)
      .then(res => {
        setInvitationData(res.data);
      })
      .catch(err => {
        console.error("Failed to fetch invitation:", err);
      });
  }, [userId]);

  // אם יש שם בני הזוג, נעדכן את השדה בצורה נקייה
  const coupleNames = `${user.user?.firstPartner ?? ""} & ${user.user?.secondPartner ?? ""}`;
  const date = `${user.user?.weddingDate}`;
  const venue = `${user.user?.weddingVenue}`;
  return (
    <div className="pageMain">
      <div className="pageContainer">
        
        <Icons.BackArrowIcon className="backIcon" onClick={() => navigate(-1)} title="Go Back" />
        <h2 className="pageHeader">Invitation</h2>

        <InvitationFlowStepper step={step} />

        {step === 0 && (
          <BackgroundSection
            userId={userId}
            coupleNames={coupleNames}
            date={date}
            venue={venue}
            designPrompt={invitationData.designPrompt}
            setDesignPrompt={(prompt) => setInvitationData(d => ({ ...d, designPrompt: prompt }))}
            backgroundUrl={invitationData.backgroundUrl}
            setBackgroundUrl={(url) => setInvitationData(d => ({ ...d, backgroundUrl: url }))}
            onDone={() => setStep(1)}
          />
        )}

        {step === 1 && (
          <DetailsSection
            sentences={invitationData.sentences}
            setSentences={(sentences) => setInvitationData(d => ({ ...d, sentences }))}
            onDone={() => setStep(2)}
            userId={userId}
            date={invitationData.date}
            venue={invitationData.venue}            
          />
        )}

        {step === 2 && (
          <DesignSection
            userId={userId}
            backgroundUrl={invitationData.backgroundUrl}
            sentences={invitationData.sentences}
            coupleNames={invitationData.coupleNames || coupleNames}
            date={invitationData.date}
            venue={invitationData.venue}
            ceremonyHour={invitationData.ceremonyHour}
            receptionHour={invitationData.receptionHour}
            existingDesignJson={
              (() => {
                try {
                  return  undefined;
                } catch {
                  return undefined;
                }
              })()
            }
          />
        )}
      </div>
      <ToastContainer position="bottom-right" />

    </div>
  );
}