// components/AuthForm.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import styles from './AuthForm.module.css';

type AuthFormProps = {
  type: "login";
  onSubmit: (email: string, password: string) => Promise<void>;
  error: string;
} | {
  type: "signup";
  onSubmit: (email: string, password: string, role: "student" | "company") => Promise<void>;
  error: string;
};

export default function AuthForm({ type, onSubmit, error }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"student" | "company">("student");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (type === "signup") {
        await onSubmit(email, password, role);
      } else {
        await onSubmit(email, password);
      }
    } catch {
      // Parent handles error state
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form} aria-live="polite" aria-atomic="true">
      {type === "signup" && (
        <div className={styles.roleButtons}>
          <button
            type="button"
            onClick={() => setRole("student")}
            className={`${styles.roleButton} ${role === "student" ? styles.roleButtonActive : styles.roleButtonInactive}`}
            aria-pressed={role === "student"}
          >
            Student
          </button>
          <button
            type="button"
            onClick={() => setRole("company")}
            className={`${styles.roleButton} ${role === "company" ? styles.roleButtonActive : styles.roleButtonInactive}`}
            aria-pressed={role === "company"}
          >
            Company
          </button>
        </div>
      )}

      <div>
        <label htmlFor="email" className={styles.label}>
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={styles.input}
          autoComplete="email"
        />
      </div>

      <div>
        <label htmlFor="password" className={styles.label}>
          Password
        </label>
        <div className={styles.passwordWrapper}>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className={styles.input}
            autoComplete={type === "login" ? "current-password" : "new-password"}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={styles.togglePassword}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      {error && (
        <p className={styles.errorText} role="alert" aria-live="assertive">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className={`${styles.submitButton} ${loading ? styles.submitButtonDisabled : ""}`}
      >
        {loading ? (
          <span>Processing...</span>
        ) : type === "login" ? (
          "Sign in"
        ) : (
          "Create account"
        )}
      </button>

      <div className={styles.linkText}>
        {type === "login" ? (
          <>
            Don&apos;t have an account?{" "}
            <Link href="/signup" className={styles.link}>
              Sign up
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link href="/login" className={styles.link}>
              Sign in
            </Link>
          </>
        )}
      </div>
    </form>
  );
}
