import { motion } from "framer-motion";

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center space-y-2"
      >
        <p className="text-3xl text-primary font-bold tracking-wide">
          Luis Marcelo · Portfolio
        </p>
        <p className="text-sm text-muted-foreground font-mono">
          © {new Date().getFullYear()}
        </p>
      </motion.div>
    </div>
  );
}
