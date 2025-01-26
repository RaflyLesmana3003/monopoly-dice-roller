import { motion } from "framer-motion"

interface DiceProps {
  value: number
  isRolling: boolean
}

const diceColors = [
  "bg-primary text-primary-foreground",
  "bg-secondary text-secondary-foreground",
  "bg-accent text-accent-foreground",
  "bg-destructive text-destructive-foreground",
]

export function Dice({ value, isRolling }: DiceProps) {
  const dots = Array.from({ length: value }, (_, i) => i)
  const diceColor = diceColors[Math.floor(Math.random() * diceColors.length)]

  return (
    <motion.div
      className={`w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 ${diceColor} rounded-lg shadow-lg flex items-center justify-center`}
      initial={{ scale: 1 }}
      animate={
        isRolling
          ? {
              scale: [1, 1.2, 0.8, 1.1, 0.9, 1],
              rotate: [0, 90, 180, 270, 360],
              borderRadius: ["16%", "50%", "16%", "50%", "16%"],
            }
          : {}
      }
      transition={{
        duration: 1,
        ease: "easeInOut",
        times: [0, 0.2, 0.4, 0.6, 0.8, 1],
        repeat: isRolling ? Number.POSITIVE_INFINITY : 0,
        repeatDelay: 0.5,
      }}
    >
      <div className={`grid gap-1 ${value === 1 ? "grid-cols-1" : value === 2 ? "grid-cols-2" : "grid-cols-3"} p-2`}>
        {dots.map((dot) => (
          <motion.div
            key={dot}
            className="w-1 h-1 sm:w-2 sm:h-2 md:w-3 md:h-3 bg-current rounded-full"
            initial={{ scale: 0 }}
            animate={{ scale: isRolling ? [0, 1, 0] : 1 }}
            transition={{
              duration: 0.5,
              ease: "easeInOut",
              repeat: isRolling ? Number.POSITIVE_INFINITY : 0,
              repeatDelay: 0.5,
            }}
          />
        ))}
      </div>
    </motion.div>
  )
}

