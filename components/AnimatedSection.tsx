"use client";

import { motion } from "framer-motion";

const fadeSlideUp = {
  hidden: { opacity: 0, y: 48 },
  visible: { opacity: 1, y: 0 },
};

const defaultTransition = {
  duration: 0.6,
  ease: [0.22, 1, 0.36, 1] as const,
};

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function AnimatedSection({
  children,
  className = "",
  delay = 0,
}: AnimatedSectionProps) {
  return (
    <motion.section
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.12,
            delayChildren: delay,
          },
        },
      }}
    >
      {children}
    </motion.section>
  );
}

interface AnimatedItemProps {
  children: React.ReactNode;
  className?: string;
  transition?: { duration?: number; delay?: number };
}

export function AnimatedItem({
  children,
  className = "",
  transition,
}: AnimatedItemProps) {
  return (
    <motion.div
      className={className}
      variants={fadeSlideUp}
      transition={{ ...defaultTransition, ...transition }}
    >
      {children}
    </motion.div>
  );
}
