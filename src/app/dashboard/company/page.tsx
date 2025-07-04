"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { FiBriefcase, FiUsers, FiSettings, FiArrowRight } from "react-icons/fi";
import { motion } from "framer-motion";
import clsx from "clsx";
import styles from "./CompanyDashboard.module.css";

export default function CompanyDashboard() {
  const { currentUser, role, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  if (!currentUser || role !== "company") {
    // Optionally redirect or show error - or just a message
    return <p>Access denied. Please login as a company user.</p>;
  }

  const companyName = currentUser.email?.split("@")[0] ?? "Company";

  return (
    <div className={styles.container}>
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={clsx(styles.card, styles.welcomeBanner)}
      >
        <h1>Welcome back, {companyName}!</h1>
        <p>Manage your opportunities and connect with talented students.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className={styles.cardGrid}>
        <StatCard
          icon={FiUsers}
          title="Talent Pool"
          value="24"
          description="Qualified candidates"
          href="/dashboard/company/applications"
          color="blue"
        />

        <StatCard
          icon={FiBriefcase}
          title="Your Opportunities"
          value="8"
          description="Active listings"
          href="/dashboard/company/post-opportunity"
          color="green"
        />

        <StatCard
          icon={FiSettings}
          title="Company Profile"
          value="65%"
          description="Complete your profile"
          href="/dashboard/company/complete-profile"
          color="purple"
          progress={65}
        />
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string;
  description: string;
  href: string;
  color?: "blue" | "green" | "purple" | "yellow";
  progress?: number;
}

function StatCard({
  icon: Icon,
  title,
  value,
  description,
  href,
  color = "blue",
  progress,
}: StatCardProps) {
  const colorVariants = {
    blue: styles.blueCard,
    green: styles.greenCard,
    purple: styles.purpleCard,
    yellow: styles.yellowCard,
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className={clsx(styles.card, colorVariants[color])}
    >
      <Link href={href} className={styles.cardLink}>
        <div className={styles.cardHeader}>
          <div className={clsx(styles.cardIcon, styles[`${color}Icon`])}>
            <Icon />
          </div>
          <h3 className={styles.cardTitle}>{title}</h3>
        </div>

        <p className={styles.cardValue}>{value}</p>
        <p className={styles.cardDescription}>{description}</p>

        {progress && (
          <div className={styles.progressContainer}>
            <div className={styles.progressBar} style={{ width: `${progress}%` }} />
            <span className={styles.progressText}>{progress}% complete</span>
          </div>
        )}

        <div className={styles.cardFooter}>
          <span>View details</span>
          <FiArrowRight />
        </div>
      </Link>
    </motion.div>
  );
}
