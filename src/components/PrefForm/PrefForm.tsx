import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import tdlService from "../../services/tdl-service";
import authService from "../../services/auth-service";
import styles from "./PrefForm.module.css";
import { useAuth } from "../../hooks/useAuth/AuthContext";
import * as Icons from "../../icons/index";

const formSchema = z.object({
  firstPartner: z.string(),
  secondPartner: z.string(),
  hasDateAndVenue: z.string(),
  weddingDate: z.string(),
  venue: z.string(),
  guestCount: z.string(),
  weddingStyle: z.string(),
  venueType: z.string(),
  dateRange: z.string(),
  importantPart: z.string(),
  planningPriority: z.string(),
  mustHave: z.string(),
  ceremonyTime: z.string(),
  additionalNotes: z.string(),
});

type FormData = z.infer<typeof formSchema>;

export default function PrefForm() {
  const [formData, setFormData] = useState<FormData>({
    firstPartner: "",
    secondPartner: "",
    hasDateAndVenue: "",
    weddingDate: "",
    venue: "",
    guestCount: "",
    weddingStyle: "",
    venueType: "",
    dateRange: "",
    importantPart: "",
    planningPriority: "",
    mustHave: "",
    ceremonyTime: "",
    additionalNotes: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const navigate = useNavigate();

  const { user, updateUserSession } = useAuth();
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstPartner: user.firstPartner || '',
        secondPartner: user.secondPartner || '',
      }));
    }
  }, [user]);

  const handleChangeDateAndVenue = (value: string) => {
    setFormData(prev => ({
      ...prev,
      hasDateAndVenue: value,
      weddingDate: value === "Yes, we already have both 🎉" ? "" : prev.weddingDate,
      venue: value === "Yes, we already have both 🎉" ? "" : prev.venue,
    }));
  };

  const handleNextStep = () => setCurrentStep(s => Math.min(3, s + 1));
  const handlePreviousStep = () => setCurrentStep(s => Math.max(1, s - 1));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSubmitError("");
    setFormErrors({});

    const result = formSchema.safeParse(formData);
    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.errors.forEach(err => {
        errs[err.path[0] as string] = err.message;
      });
      setFormErrors(errs);
      setLoading(false);
      return;
    }

    try {
      await authService.updateUser({
        firstPartner: formData.firstPartner,
        secondPartner: formData.secondPartner,
        weddingDate: formData.weddingDate,
        weddingVenue: formData.venue,
      });

      // Update user session with new data
      updateUserSession({
        firstPartner: formData.firstPartner,
        secondPartner: formData.secondPartner,
        weddingDate: formData.weddingDate,
        weddingVenue: formData.venue,
      });
    
      const blob = new Blob([JSON.stringify(formData, null, 2)], {
        type: "application/json",
      });
      const file = new File([blob], "preferences.json", {
        type: "application/json",
      });
      await tdlService.uploadFormJson(file);
      navigate("/todolist");
    } catch (err: any) {
      setSubmitError(err.response?.data?.error || "Upload failed.");
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.formContainer}>
        <h2>Let's Plan Your Wedding 🎉</h2>
        <p>Please answer the following questions to help us create your personalized wedding to-do list.</p>

        <form>
          {currentStep === 1 && (
            <>
              <div className={styles.formGroup}>
                  <div className={styles.partnersRow}>
                    <div className={styles.partnerField}>
                      <label className={styles.partnersLabel}>First Partner</label>
                      <input type="text" className={styles.partnersInput} onChange={e => setFormData(prev => ({ ...prev, firstPartner: e.target.value }))} value={formData.firstPartner}/>
                    </div>
                    <div className={styles.partnerField}>
                      <label className={styles.partnersLabel}>Second Partner</label>
                      <input type="text" className={styles.partnersInput} onChange={e => setFormData(prev => ({ ...prev, secondPartner: e.target.value }))} value={formData.secondPartner}></input>
                    </div>
                  </div>                
                  {formErrors.firstPartner && <p className={styles.error}>{formErrors.firstPartner}</p>}
                  {formErrors.secondPartner && <p className={styles.error}>{formErrors.secondPartner}</p>}
              </div>


              <div className={styles.buttonRow}>
                {currentStep > 1 && (
                  <span onClick={handlePreviousStep} className="icon">
                    <Icons.BackArrowIcon/>
                  </span>
                )}
                <span onClick={handleNextStep} className="icon">
                  <Icons.FrontArrowIcon/>
                </span>
              </div>
            </>
          )}

          {currentStep === 2 && (
            <>
              <div className={styles.formGroup}>
                <label>Do you already have a wedding date and venue?</label>
                <select
                  value={formData.hasDateAndVenue}
                  onChange={e => handleChangeDateAndVenue(e.target.value)}
                >
                  <option value="">Select an option</option>
                  <option value="Yes, we already have both 🎉">
                    Yes, we already have both 🎉
                  </option>
                  <option value="We have a date but still looking for a venue">
                    We have a date but still looking for a venue
                  </option>
                  <option value="Not yet">Not yet</option>
                </select>
                {formErrors.hasDateAndVenue && <p className={styles.error}>{formErrors.hasDateAndVenue}</p>}
              </div>

              {formData.hasDateAndVenue === "Yes, we already have both 🎉" && (
                <>
                  <div className={styles.formGroup}>
                    <label>Wedding Date</label>
                    <input
                      type="date"
                      value={formData.weddingDate}
                      onChange={e => setFormData(prev => ({ ...prev, weddingDate: e.target.value }))}
                    />
                    {formErrors.weddingDate && <p className={styles.error}>{formErrors.weddingDate}</p>}
                  </div>
                  <div className={styles.formGroup}>
                    <label>Venue</label>
                    <input
                      type="text"
                      value={formData.venue}
                      onChange={e => setFormData(prev => ({ ...prev, venue: e.target.value }))}
                    />
                    {formErrors.venue && <p className={styles.error}>{formErrors.venue}</p>}
                  </div>
                </>
              )}

              {formData.hasDateAndVenue === "We have a date but still looking for a venue" && (
                <div className={styles.formGroup}>
                  <label>Wedding Date</label>
                  <input
                    type="date"
                    value={formData.weddingDate}
                    onChange={e => setFormData(prev => ({ ...prev, weddingDate: e.target.value }))}
                  />
                  {formErrors.weddingDate && <p className={styles.error}>{formErrors.weddingDate}</p>}
                </div>
              )}

              <div className={styles.buttonRow}>
                {currentStep > 1 && (
                  <span onClick={handlePreviousStep} className="icon">
                    <Icons.BackArrowIcon/>
                  </span>
                )}
                  <span onClick={handleNextStep} className="icon">
                    <Icons.FrontArrowIcon/>
                  </span>
              </div>
            </>
          )}

          {currentStep === 3 && (
            <div className={styles.scrollableFormSection}>
              <div className={styles.formGroup}>
                <label>How many guests are you expecting?</label>
                <select
                  value={formData.guestCount}
                  onChange={e => setFormData(prev => ({ ...prev, guestCount: e.target.value }))}
                >
                  <option value="">Select an option</option>
                  <option value="Under 100">Under 100</option>
                  <option value="100-200">100-200</option>
                  <option value="200-400">200-400</option>
                  <option value="400+">400+</option>
                </select>
                {formErrors.guestCount && <p className={styles.error}>{formErrors.guestCount}</p>}
              </div>

              <div className={styles.formGroup}>
                <label>Venue Type (if no venue yet)</label>
                <select
                  value={formData.venueType}
                  onChange={e => setFormData(prev => ({ ...prev, venueType: e.target.value }))}
                >
                  <option value="">Select an option</option>
                  <option value="Garden / Outdoor 🌳">Garden / Outdoor 🌳</option>
                  <option value="Event hall 💃">Event hall 💃</option>
                  <option value="Hotel 🏨">Hotel 🏨</option>
                  <option value="Beach 🏖️">Beach 🏖️</option>
                  <option value="At home 🏡">At home 🏡</option>
                  <option value="Not sure yet 🤔">Not sure yet 🤔</option>
                </select>
                {formErrors.venueType && <p className={styles.error}>{formErrors.venueType}</p>}
              </div>

              {formData.weddingDate === "" && (
                <div className={styles.formGroup}>
                  <label>Date Range </label>
                  <select
                    value={formData.dateRange}
                    onChange={e => setFormData(prev => ({ ...prev, dateRange: e.target.value }))}
                  >
                    <option value="">Select an option</option>
                    <option value="January–March ❄️">January–March ❄️</option>
                    <option value="April–June 🌸">April–June 🌸</option>
                    <option value="July–September ☀️">July–September ☀️</option>
                    <option value="October–December 🍂">October–December 🍂</option>
                    <option value="Not sure yet 🤷‍♀️">Not sure yet 🤷‍♀️</option>
                  </select>
                  {formErrors.dateRange && <p className={styles.error}>{formErrors.dateRange}</p>}
                </div>
              )}

              <div className={styles.formGroup}>
                <label>Most important part of your wedding?</label>
                <select
                  value={formData.importantPart}
                  onChange={e => setFormData(prev => ({ ...prev, importantPart: e.target.value }))}
                >
                  <option value="">Select an option</option>
                  <option value="Ceremony 💍">Ceremony 💍</option>
                  <option value="Reception 🕺">Reception 🕺</option>
                  <option value="Food 🍽️">Food 🍽️</option>
                  <option value="Entertainment 🎉">Entertainment 🎉</option>
                  <option value="Decorations 🌸">Decorations 🌸</option>
                </select>
                {formErrors.importantPart && <p className={styles.error}>{formErrors.importantPart}</p>}
              </div>

              <div className={styles.formGroup}>
                <label>Planning priority?</label>
                <select
                  value={formData.planningPriority}
                  onChange={e => setFormData(prev => ({ ...prev, planningPriority: e.target.value }))}
                >
                  <option value="">Select an option</option>
                  <option value="Budget 💸">Budget 💸</option>
                  <option value="Guest Experience 👥">Guest Experience 👥</option>
                  <option value="Venue 🏰">Venue 🏰</option>
                  <option value="Vendors 📋">Vendors 📋</option>
                  <option value="Timeline ⏰">Timeline ⏰</option>
                </select>
                {formErrors.planningPriority && <p className={styles.error}>{formErrors.planningPriority}</p>}
              </div>

              <div className={styles.formGroup}>
                <label>Must-haves on your wedding day?</label>
                <select
                  value={formData.mustHave}
                  onChange={e => setFormData(prev => ({ ...prev, mustHave: e.target.value }))}
                >
                  <option value="">Select an option</option>
                  <option value="Photo Booth 📸">Photo Booth 📸</option>
                  <option value="Live Band 🎶">DJ 🎶</option>
                  <option value="Fireworks 🎆">Fireworks 🎆</option>
                  <option value="Special Dance 💃">Special Dance 💃</option>
                  <option value="Unique Cake 🍰">Unique Cake 🍰</option>
                </select>
                {formErrors.mustHave && <p className={styles.error}>{formErrors.mustHave}</p>}
              </div>

              <div className={styles.formGroup}>
                <label>Ceremony time?</label>
                <select
                  value={formData.ceremonyTime}
                  onChange={e => setFormData(prev => ({ ...prev, ceremonyTime: e.target.value }))}
                >
                  <option value="">Select an option</option>
                  <option value="Morning 🌞">Morning 🌞</option>
                  <option value="Afternoon ☀️">Afternoon ☀️</option>
                  <option value="Evening 🌙">Evening 🌙</option>
                  <option value="No preference">No preference</option>
                </select>
                {formErrors.ceremonyTime && <p className={styles.error}>{formErrors.ceremonyTime}</p>}
              </div>

              <div className={styles.formGroup}>
                <label>Anything else?</label>
                <textarea
                  value={formData.additionalNotes}
                  onChange={e => setFormData(prev => ({ ...prev, additionalNotes: e.target.value }))}
                />
                {formErrors.additionalNotes && <p className={styles.error}>{formErrors.additionalNotes}</p>}
              </div>

              {submitError && <p className={styles.error}>{submitError}</p>}

              <div className={styles.buttonRow}>
                <span onClick={handlePreviousStep} className="icon">
                  <Icons.BackArrowIcon/>
                </span>
                <span onClick={handleSubmit} className="icon">
                  {loading ? <Icons.LoaderIcon className="spinner"/> : <Icons.SendIcon/>}
                </span>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}