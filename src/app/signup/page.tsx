"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import AuthForm from "@/components/AuthForm";
import Image from "next/image";
import ThemeToggle from "@/components/ThemeToggle";
import styles from "./page.module.css";

export default function Signup() {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleSignup = async (
    email: string,
    password: string,
    role: "student" | "company"
  ) => {
    try {
      // Create user in Firebase Auth
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCred.user.uid;

      // Save base user data in 'users' collection with Firestore timestamp
      await setDoc(doc(db, "users", uid), {
        uid,
        email,
        role,
        createdAt: serverTimestamp(),
      });

      // Save minimal role-specific document with onboarding flag
      const roleCollection = role === "student" ? "students" : "companies";
      await setDoc(doc(db, roleCollection, uid), {
        uid,
        email,
        role,
        createdAt: serverTimestamp(),
        onboardingComplete: false,
      });

      // Redirect to central multi-step complete-profile page (absolute path!)
      router.push("/complete-profile");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Signup failed. Please try again.");
      } else {
        setError("Signup failed. Please try again.");
      }
      console.error("Signup Error:", err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        {/* Header with logo and theme toggle */}
        <div className={styles.headerContainer}>
          <div className={styles.logoContainer}>
            <Image src="/logo.svg" alt="DestinyConnect" width={40} height={40} />
            <h1 className={styles.appName}>DestinyConnect</h1>
          </div>
          <ThemeToggle />
        </div>

        {/* Signup Form Section */}
        <div>
          <h2 className={styles.heading}>Create your account</h2>
          <p className={styles.subheading}>Join DestinyConnect today</p>
        </div>

        {/* Auth form passes role back on submit */}
        <AuthForm type="signup" onSubmit={handleSignup} error={error} />
      </div>
    </div>
  );
}
