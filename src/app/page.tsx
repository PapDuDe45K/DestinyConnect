// --- src/app/page.tsx ---
"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import ThemeToggle from "@/components/ThemeToggle";
import styles from './page.module.css';

export default function Home() {
  const router = useRouter();
  const { currentUser, role, logout } = useAuth();

  const goToDashboard = () => {
    if (role === "student") router.push("/dashboard/student");
    else if (role === "company") router.push("/dashboard/company");
  };

  return (
    <div className={styles.main}>
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <div className={styles.logoContainer}>
            <Image src="/logo.svg" alt="Logo" width={40} height={40} />
            <h2 className={styles.appName}>DestinyConnect</h2>
          </div>
          <div className={styles.navLinks}>
            {currentUser ? (
              <>
                <p style={{ fontWeight: 'bold' }}>{role === "student" ? "Student" : "Company"} Dashboard</p>
                <button className={styles.navLinkButton} onClick={goToDashboard}>Dashboard</button>
                <button className={styles.navLinkLogin} style={{ color: 'red' }} onClick={logout}>Sign Out</button>
              </>
            ) : (
              <>
                <button className={styles.navLinkButton} style={{ color: 'teal' }} onClick={() => router.push("/signup")}>Join Now</button>
                <button className={styles.navLinkLogin} onClick={() => router.push("/login")}>Login</button>
              </>
            )}
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>Welcome to <span className={styles.heroTitleAccent}>DestinyConnect</span></h1>
        <p className={styles.heroSubtitle}>Bridging the gap between <span className={styles.heroSubtitleAccentDebt}>Debt</span> and <span className={styles.heroSubtitleAccentDestiny}>Destiny</span>.</p>
        <div className={styles.heroButtons}>
          {currentUser ? (
            <button className={styles.heroButton} onClick={goToDashboard}>Go to Dashboard</button>
          ) : (
            <button className={styles.heroButton} style={{ backgroundColor: 'teal' }} onClick={() => router.push("/signup")}>Join Now</button>
          )}
        </div>
      </section>

      <section className={styles.statsSection}>
        <StatCard label="Students Helped" value="500+" color="teal" />
        <StatCard label="Partner Companies" value="120+" color="blue" />
        <StatCard label="Debt Assistance" value="R5.2m" color="purple" />
        <StatCard label="Success Rate" value="85%" color="gold" />
      </section>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className={styles.statCard}>
      <p className={styles.statValue} style={{ color }}>{value}</p>
      <p className={styles.statLabel}>{label}</p>
    </div>
  );
}
