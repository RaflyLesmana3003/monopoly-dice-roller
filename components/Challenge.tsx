import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { challenges, rewards, punishments } from "@/data/gameData"

interface ChallengeProps {
  onComplete: (success: boolean) => void
}

export function Challenge({ onComplete }: ChallengeProps) {
  const [challenge] = useState(challenges[Math.floor(Math.random() * challenges.length)])
  const [reward] = useState(rewards[Math.floor(Math.random() * rewards.length)])
  const [punishment] = useState(punishments[Math.floor(Math.random() * punishments.length)])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Challenge</CardTitle>
          <CardDescription>Complete the challenge to earn a reward!</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-semibold mb-4">{challenge}</p>
          <p className="text-sm text-muted-foreground mb-2">Reward: {reward}</p>
          <p className="text-sm text-muted-foreground">Punishment: {punishment}</p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={() => onComplete(true)} variant="default">
            Accept
          </Button>
          <Button onClick={() => onComplete(false)} variant="outline">
            Refuse
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

