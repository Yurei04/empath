import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";

export default function LetterMessage({ title, author, letter }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -4, scale: 1.01 }}
      className="w-full"
    >
      <Card
        className="w-full p-4 sm:p-6 flex flex-col gap-3 sm:gap-4
        shadow-2xl backdrop-blur-xl border-2 border-yellow-500/20
        bg-gradient-to-br from-amber-950/40 to-slate-900/60
        transition-all duration-500 relative overflow-hidden group"
      >
        {/* Subtle hover glow */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, rgba(255,215,0,0.15), transparent 70%)`,
          }}
        />

        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-yellow-400/10 to-transparent rounded-bl-full" />
        
        <CardContent className="flex flex-col gap-3 sm:gap-4 p-0 relative z-10">
          {/* Mail icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: "spring" }}
            className="absolute -top-2 -left-2"
          >
            <div className="bg-gradient-to-br from-yellow-500 to-amber-500 p-1.5 sm:p-2 rounded-full shadow-lg">
              <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-slate-900" />
            </div>
          </motion.div>

          {/* Title box */}
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl border border-yellow-400/30 p-3 sm:p-4 backdrop-blur-md bg-amber-950/30 ml-5 sm:ml-6"
          >
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-yellow-200 break-words">
              {title}
            </h1>
          </motion.div>

          {/* Author box */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="rounded-xl border border-yellow-400/20 p-2.5 sm:p-3 text-xs sm:text-sm font-medium text-yellow-300/90 bg-amber-950/20"
          >
            <span className="text-yellow-400/60">From:</span> {author}
          </motion.div>

          {/* Letter box */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="rounded-xl border border-yellow-400/30 p-3 sm:p-4 md:p-5 leading-relaxed text-xs sm:text-sm md:text-base font-light bg-gradient-to-br from-amber-950/20 to-slate-900/40"
          >
            <p className="whitespace-pre-line text-yellow-100/90 break-words">
              {letter}
            </p>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}