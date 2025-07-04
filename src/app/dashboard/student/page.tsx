"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import styles from "../Dashboard.module.css";
import { FiBriefcase, FiFileText } from "react-icons/fi";

export default function StudentDashboard() {
  const { currentUser, loading, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!currentUser || role !== "student")) {
      router.push("/login");
    }
  }, [currentUser, loading, role, router]);

  if (loading) {
    return <div className={styles.loading}>Loading student dashboard...</div>;
  }

  return (
    <div className={styles.dashboardContent}>
      <h1 className={styles.pageTitle}>🎓 Welcome back, {currentUser?.displayName || "Student"}!</h1>

      <div className={styles.cardGrid}>
        <Link href="/dashboard/student/opportunities" className={styles.card}>
          <FiBriefcase size={24} />
          <h3>Browse Opportunities</h3>
          <p>Internships, learnerships, & more.</p>
        </Link>

        <Link href="/dashboard/student/applications" className={styles.card}>
          <FiFileText size={24} />
          <h3>Your Applications</h3>
          <p>Check status, feedback, and progress.</p>
        </Link>
      </div>
    </div>
  );
}
