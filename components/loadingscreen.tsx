// components/LoadingScreen.tsx
import { motion } from "framer-motion";

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 3 }}
        transition={{ duration: 1 }}
        className="text-3xl text-primary font-bold"
      >
        Luis Marcelo - Portfolio
      </motion.div>
    </div>
  );
}
