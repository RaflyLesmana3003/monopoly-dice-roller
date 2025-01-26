"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence, useAnimate } from "framer-motion"
import { Dice } from "./Dice"
import { ChallengePopup } from "./ChallengePopup"
import { PlayerHistory } from "./PlayerHistory"
import { Button } from "@/components/ui/button"
import { Dices } from "lucide-react"
import confetti from "canvas-confetti"
import { challenges, rewards, punishments } from "@/data/gameData"
import { rollComments } from "@/data/rollComments"

export interface HistoryItem {
  type: "roll" | "challenge" | "reward" | "punishment"
  description: string
  timestamp: number
  relatedEvents?: HistoryItem[]
  total?: number
  comment?: string
}

interface DiceRollerProps {
  onHistoryUpdate: (history: HistoryItem[]) => void
  playerHistory: HistoryItem[]
}

export function DiceRoller({ onHistoryUpdate, playerHistory }: DiceRollerProps) {
  const [dice, setDice] = useState([1, 1])
  const [isRolling, setIsRolling] = useState(false)
  const [showChallenge, setShowChallenge] = useState(false)
  const [currentChallenge, setCurrentChallenge] = useState("")
  const [doubleType, setDoubleType] = useState<string | null>(null)
  const [rollComment, setRollComment] = useState<string | null>(null)
  const [scope, animate] = useAnimate()

  const addHistoryItem = (type: HistoryItem["type"], description: string, total?: number, comment?: string) => {
    const newItem: HistoryItem = {
      type,
      description,
      timestamp: Date.now(),
      relatedEvents: [],
      total,
      comment,
    }

    if (type === "roll") {
      onHistoryUpdate([...playerHistory, newItem])
    } else {
      const updatedHistory = [...playerHistory]
      const lastRoll = updatedHistory[updatedHistory.length - 1]
      if (lastRoll && lastRoll.type === "roll") {
        lastRoll.relatedEvents = lastRoll.relatedEvents || []
        lastRoll.relatedEvents.push(newItem)
      } else {
        updatedHistory.push(newItem)
      }
      onHistoryUpdate(updatedHistory)
    }
  }

  const rollDice = () => {
    setIsRolling(true)
    setRollComment(null)
    const rollDuration = 2000 // 2 seconds of rolling animation
    const intervalDuration = 100 // Change dice values every 100ms during rolling

    const rollInterval = setInterval(() => {
      setDice([Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1])
    }, intervalDuration)

    setTimeout(() => {
      clearInterval(rollInterval)
      const finalDice = [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1]
      const total = finalDice[0] + finalDice[1]
      setDice(finalDice)
      setIsRolling(false)

      // Generate roll comment
      const comments = rollComments[total as keyof typeof rollComments]
      const comment = comments[Math.floor(Math.random() * comments.length)]
      setRollComment(comment)

      addHistoryItem("roll", `Rolled ${finalDice[0]} and ${finalDice[1]}`, total, comment)

      // Check for doubles and trigger animations
      if (finalDice[0] === finalDice[1]) {
        handleDoubles(finalDice[0])
      }

      // Gacha-like mechanics: 30% chance for a challenge
      if (Math.random() < 0.3) {
        const challenge = challenges[Math.floor(Math.random() * challenges.length)]
        setCurrentChallenge(challenge)
        setShowChallenge(true)
        addHistoryItem("challenge", challenge)
      }
    }, rollDuration)
  }

  const handleDoubles = (value: number) => {
    const doubleCount =
      playerHistory.filter((item) => item.type === "roll" && item.description.includes(`${value} and ${value}`))
        .length + 1

    let type: string
    switch (doubleCount) {
      case 1:
        type = "double"
        break
      case 2:
        type = "double double"
        break
      case 3:
        type = "triple double"
        break
      case 4:
        type = "quad double"
        break
      default:
        type = "mega double"
        break
    }

    setDoubleType(type)

    // Trigger shaking animation
    animate(scope.current, { x: [-5, 5, -5, 5, 0] }, { duration: 0.5, type: "spring" })

    // Trigger confetti based on double type
    const confettiCount = Math.min(doubleCount * 50, 300)
    confetti({
      particleCount: confettiCount,
      spread: 70,
      origin: { y: 0.6 },
    })
  }

  const handleChallengeComplete = (success: boolean) => {
    setShowChallenge(false)
    if (success) {
      const reward = rewards[Math.floor(Math.random() * rewards.length)]
      addHistoryItem("reward", reward)
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      })
    } else {
      const punishment = punishments[Math.floor(Math.random() * punishments.length)]
      addHistoryItem("punishment", punishment)
    }
  }

  useEffect(() => {
    if (doubleType) {
      const timer = setTimeout(() => setDoubleType(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [doubleType])

  return (
    <motion.div ref={scope} className="flex flex-col lg:flex-row lg:space-x-8">
      <div className="w-full lg:w-1/2 order-2 lg:order-1 mt-8 lg:mt-0">
        <PlayerHistory history={playerHistory} />
      </div>
      <div className="w-full lg:w-1/2 flex flex-col items-center space-y-4 order-1 lg:order-2">
        <motion.div
          className="flex space-x-4"
          animate={isRolling ? { y: [0, -20, 20, -10, 10, 0] } : {}}
          transition={{ duration: 0.5, repeat: isRolling ? Number.POSITIVE_INFINITY : 0 }}
        >
          <Dice value={dice[0]} isRolling={isRolling} />
          <Dice value={dice[1]} isRolling={isRolling} />
        </motion.div>
        <AnimatePresence>
          {!isRolling && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">Total: {dice[0] + dice[1]}</p>
            </motion.div>
          )}
        </AnimatePresence>
        {rollComment && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-lg font-medium text-accent text-center"
          >
            {rollComment}
          </motion.div>
        )}
        {doubleType && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-2xl font-bold text-accent"
          >
            {doubleType.toUpperCase()}!
          </motion.div>
        )}
        <Button
          onClick={rollDice}
          disabled={isRolling || showChallenge}
          className="bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-all duration-300 transform hover:scale-105"
        >
          <Dices className="mr-2 h-4 w-4" />
          {isRolling ? "Rolling..." : "Roll Dice"}
        </Button>
        <ChallengePopup isOpen={showChallenge} onClose={handleChallengeComplete} challenge={currentChallenge} />
      </div>
    </motion.div>
  )
}

