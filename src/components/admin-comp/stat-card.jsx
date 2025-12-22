import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"

export function StatCard({ icon, title, value, subtitle, color, borderColor, textColor }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={`bg-gradient-to-br ${color} backdrop-blur-xl border ${borderColor}`}>
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className={`${textColor}`}>{icon}</div>
            <div className="text-right">
              <p className="text-2xl sm:text-3xl font-bold text-orange-100">{value}</p>
            </div>
          </div>
          <div>
            <p className="text-xs sm:text-sm font-medium text-orange-200 truncate">{title}</p>
            {subtitle && (
              <p className="text-xs text-orange-300/60 mt-1 truncate">{subtitle}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}