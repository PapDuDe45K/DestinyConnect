"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { FiHome, FiBriefcase, FiFileText, FiLogOut } from "react-icons/fi";
import { motion } from "framer-motion";
import clsx from "clsx";
import styles from "./Dashboard.module.css";
import ThemeToggle from "@/components/ThemeToggle";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { currentUser, role, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Redirect to login if not logged in
  useEffect(() => {
    if (!loading && !currentUser) {
      router.push("/login");
    }
  }, [currentUser, loading, router]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) {
    return (
      <div className={styles.dashboardContainer}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            style={{
              width: '2rem',
              height: '2rem',
              border: '3px solid var(--primary)',
              borderTopColor: 'transparent',
              borderRadius: '50%'
            }}
          />
          <p style={{ color: 'gray', marginTop: '1rem' }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const navItems = {
    student: [
      { name: "Dashboard", href: "/dashboard/student", icon: FiHome },
      { name: "Opportunities", href: "/dashboard/student/opportunities", icon: FiBriefcase },
      { name: "Applications", href: "/dashboard/student/applications", icon: FiFileText },
    ],
    company: [
      { name: "Dashboard", href: "/dashboard/company", icon: FiHome },
      { name: "Post Opportunity", href: "/dashboard/company/post-opportunity", icon: FiBriefcase },
      { name: "Applications", href: "/dashboard/company/applications", icon: FiFileText },
    ],
  };

  const currentNav = navItems[role as keyof typeof navItems];

  return (
    <div className={styles.dashboardContainer}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo}>
          {role === "company" ? "DestinyHire" : "DestinyConnect"}
        </Link>

        <div className={styles.navItems}>
          {currentNav?.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                styles.navLink,
                pathname.startsWith(item.href) && styles.activeNavLink
              )}
            >
              <item.icon />
              <span>{item.name}</span>
            </Link>
          ))}

          <ThemeToggle />

          <button
            onClick={handleLogout}
            className={clsx(styles.navLink, styles.logoutButton)}
          >
            <FiLogOut />
            <span>Sign Out</span>
          </button>
        </div>
      </nav>

      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
