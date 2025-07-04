// components/ThemeToggle.tsx
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import styles from "./ThemeToggle.module.css";

const ThemeToggle = () => {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // ✅ Prevent hydration mismatch

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <button onClick={toggleTheme} className={styles.toggleButton}>
      {resolvedTheme === "dark" ? (
        <SunIcon className={`${styles.icon} ${styles.darkIcon}`} />
      ) : (
        <MoonIcon className={`${styles.icon} ${styles.lightIcon}`} />
      )}
    </button>
  );
};

export default ThemeToggle;
