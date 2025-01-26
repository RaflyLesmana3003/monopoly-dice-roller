import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { challenges, rewards, punishments } from "@/data/gameData"

interface ChallengePopupProps {
  isOpen: boolean
  onClose: (success: boolean) => void
}

export function ChallengePopup({ isOpen, onClose }: ChallengePopupProps) {
  const [challenge] = useState(challenges[Math.floor(Math.random() * challenges.length)])
  const [reward] = useState(rewards[Math.floor(Math.random() * rewards.length)])
  const [punishment] = useState(punishments[Math.floor(Math.random() * punishments.length)])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="w-[350px] bg-card text-card-foreground">
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
                <Button
                  onClick={() => onClose(true)}
                  variant="default"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Accept
                </Button>
                <Button
                  onClick={() => onClose(false)}
                  variant="outline"
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Refuse
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

