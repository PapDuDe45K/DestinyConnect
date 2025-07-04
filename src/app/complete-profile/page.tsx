"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FiChevronLeft, FiChevronRight, FiCheck } from "react-icons/fi";
import styles from "./CompleteProfile.module.css";

type FormData = {
  fullName: string;
  university?: string;
  course?: string;
  companyName?: string;
  industry?: string;
  description?: string;
  website?: string;
};

const steps = ["Basic Info", "Student Details", "Company Details"];

export default function CompleteProfile() {
  const router = useRouter();
  const { currentUser, role, loading: authLoading } = useAuth();

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    university: "",
    course: "",
    companyName: "",
    industry: "",
    description: "",
    website: "",
  });

  useEffect(() => {
    if (!authLoading && (!currentUser || !role)) {
      router.push("/login");
    }
  }, [currentUser, role, authLoading, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleNext = () => {
    setError("");
    if (step === 0 && !formData.fullName.trim()) {
      setError("Full Name is required.");
      return;
    }
    if (role === "student" && step === 1) {
      if (!formData.university?.trim() || !formData.course?.trim()) {
        setError("University and Course are required.");
        return;
      }
    }
    if (role === "company" && step === 2) {
      if (!formData.companyName?.trim() || !formData.industry?.trim()) {
        setError("Company Name and Industry are required.");
        return;
      }
    }
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setError("");
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      if (!currentUser) throw new Error("No user logged in");

      // 1. Minimal update to 'users' collection for basic profile data & management
      const userRef = doc(db, "users", currentUser.uid);
      await setDoc(
        userRef,
        { fullName: formData.fullName, profileComplete: true },
        { merge: true }
      );

      // 2. Enrich role-specific collection: 'students' or 'companies'
      if (role === "student") {
        const studentRef = doc(db, "students", currentUser.uid);
        await setDoc(studentRef, {
          uid: currentUser.uid,
          fullName: formData.fullName,
          university: formData.university,
          course: formData.course,
          profileComplete: true,
          createdAt: new Date(),
        });
      } else if (role === "company") {
        const companyRef = doc(db, "companies", currentUser.uid);
        await setDoc(companyRef, {
          uid: currentUser.uid,
          fullName: formData.fullName,
          companyName: formData.companyName,
          industry: formData.industry,
          description: formData.description || "",
          website: formData.website || "",
          profileComplete: true,
          createdAt: new Date(),
        });
      } else {
        throw new Error("Invalid role");
      }

      router.push(role === "student" ? "/dashboard/student/" : "/dashboard/company/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return <p className={styles.loading}>Loading...</p>;

  return (
    <div className={styles.container}>
      {/* Stepper */}
      <div className={styles.stepper}>
        {steps.map((label, index) => (
          <div key={label} className={styles.stepItem}>
            <div
              className={`${styles.stepCircle} 
                ${step === index ? styles.activeStep : ""}
                ${index < step ? styles.completedStep : ""}`}
            >
              {index < step ? <FiCheck /> : index + 1}
            </div>
            <p
              className={`${styles.stepLabel} ${
                step === index ? styles.activeLabel : ""
              }`}
            >
              {label}
            </p>
            {index !== steps.length - 1 && (
              <div
                className={`${styles.stepConnector} ${
                  index < step ? styles.completedLine : ""
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Error */}
      {error && <p className={styles.errorBox}>{error}</p>}

      {/* Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (step === steps.length - 1) {
            handleSubmit();
          } else {
            handleNext();
          }
        }}
        className={styles.form}
        noValidate
      >
        {/* Step Content */}
        {step === 0 && (
          <div className={styles.inputGroup}>
            <label htmlFor="fullName">
              Full Name <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              className={error.includes("Full Name") ? styles.errorInput : ""}
            />
          </div>
        )}

        {step === 1 && role === "student" && (
          <>
            <div className={styles.inputGroup}>
              <label htmlFor="university">
                University <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="university"
                name="university"
                value={formData.university}
                onChange={handleChange}
                placeholder="Enter your university"
                required
                className={error.includes("University") ? styles.errorInput : ""}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="course">
                Course <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="course"
                name="course"
                value={formData.course}
                onChange={handleChange}
                placeholder="Enter your course"
                required
                className={error.includes("Course") ? styles.errorInput : ""}
              />
            </div>
          </>
        )}

        {step === 1 && role === "company" && (
          <p className={styles.note}>
            Please proceed to next step for company details.
          </p>
        )}

        {step === 2 && role === "company" && (
          <>
            <div className={styles.inputGroup}>
              <label htmlFor="companyName">
                Company Name <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Enter your company name"
                required
                className={error.includes("Company Name") ? styles.errorInput : ""}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="industry">
                Industry <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="industry"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                placeholder="Enter your industry"
                required
                className={error.includes("Industry") ? styles.errorInput : ""}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="description">Company Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Tell us about your company"
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="website">Website</label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://yourcompany.com"
              />
            </div>
          </>
        )}

        {/* Navigation Buttons */}
        <div className={styles.buttons}>
          {step > 0 && (
            <button
              type="button"
              onClick={handleBack}
              className={styles.backButton}
            >
              <FiChevronLeft className="inline mr-1" /> Back
            </button>
          )}
          <button type="submit" disabled={loading} className={styles.nextButton}>
            {loading ? "Saving..." : step === steps.length - 1 ? "Finish" : "Next"}{" "}
            <FiChevronRight className="inline ml-1" />
          </button>
        </div>
      </form>
    </div>
  );
}
