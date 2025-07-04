// app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import AuthForm from "@/components/AuthForm";
import Image from "next/image";
import ThemeToggle from "@/components/ThemeToggle";
import styles from './page.module.css'; // Import CSS Module

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleLogin = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const role = userData.role;
        const profileCompleted = userData.completedProfile;

        if (!profileCompleted) {
          router.push("/complete-profile");
        } else if (role === "student") {
          router.push("/dashboard/student");
        } else if (role === "company" || role === "vendor") {
          router.push("/dashboard/company");
        } else {
          console.error(`Unknown role: ${role}. Redirecting to login.`);
          setError("Unable to determine dashboard. Please log in again.");
          router.push("/login");
        }
      } else {
        setError("No user profile found. Contact support.");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Login failed. Please check your credentials.");
      } else {
        setError("Login failed. Please check your credentials.");
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <div className={styles.headerContainer}>
          <div className={styles.logoContainer}>
            <Image
  src="/logo.svg"
  alt="DestinyConnect"
  width={40}
  height={40}
/>
            <h1 className={styles.appName}>DestinyConnect</h1>
          </div>
          <ThemeToggle />
        </div>
        <div>
          <h2 className={styles.heading}>Sign in to your account</h2>
          <p className={styles.subheading}>Welcome back to DestinyConnect</p>
        </div>
        <AuthForm
          type="login"
          onSubmit={handleLogin}
          error={error}
        />
      </div>
    </div>
  );
}