import { motion } from "framer-motion";

const blobVariants = {
  initial: { opacity: 0.4, scale: 0.8 },
  animate: {
    opacity: [0.4, 0.6, 0.4],
    scale: [1, 1.05, 1],
    transition: { duration: 8, repeat: Infinity, ease: "easeInOut" },
  },
};

export function AnimatedBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <motion.div
        className="absolute -left-20 top-20 h-64 w-64 rounded-full bg-primary/15 blur-3xl"
        variants={blobVariants}
        initial="initial"
        animate="animate"
      />
      <motion.div
        className="absolute -right-20 top-40 h-80 w-80 rounded-full bg-secondary/15 blur-3xl"
        variants={blobVariants}
        initial="initial"
        animate="animate"
        transition={{ delay: 2, duration: 10 }}
      />
      <motion.div
        className="absolute bottom-20 left-1/3 h-48 w-48 rounded-full bg-primary/10 blur-3xl"
        variants={blobVariants}
        initial="initial"
        animate="animate"
        transition={{ delay: 1, duration: 9 }}
      />
    </div>
  );
}
