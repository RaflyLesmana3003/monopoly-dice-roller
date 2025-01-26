"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { DiceRoller, type HistoryItem } from "@/components/DiceRoller"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { ChevronDown, ChevronUp } from "lucide-react"

interface Player {
  name: string
  history: HistoryItem[]
}

export default function Home() {
  const [players, setPlayers] = useState<Player[]>([])
  const [newPlayerName, setNewPlayerName] = useState("")
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0)
  const [showAddPlayer, setShowAddPlayer] = useState(true)

  const addPlayer = () => {
    if (newPlayerName.trim()) {
      setPlayers([
        ...players,
        {
          name: newPlayerName.trim(),
          history: [],
        },
      ])
      setNewPlayerName("")
    }
  }

  const resetData = () => {
    setPlayers([])
    setCurrentPlayerIndex(0)
  }

  const nextPlayer = () => {
    setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length)
  }

  const updatePlayerHistory = (newHistory: HistoryItem[]) => {
    setPlayers((prevPlayers) => {
      const updatedPlayers = [...prevPlayers]
      updatedPlayers[currentPlayerIndex] = {
        ...updatedPlayers[currentPlayerIndex],
        history: newHistory,
      }
      return updatedPlayers
    })
  }

  return (
    <motion.main className="flex min-h-screen flex-col items-center justify-start p-4 sm:p-6 md:p-8 lg:p-12 bg-background text-foreground">
      <motion.h1
        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 md:mb-8 text-primary text-center"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Monopoly Dice Roller
      </motion.h1>
      <Button
        onClick={() => setShowAddPlayer(!showAddPlayer)}
        className="mb-4 bg-secondary text-secondary-foreground hover:bg-secondary/90"
      >
        {showAddPlayer ? <ChevronUp className="mr-2 h-4 w-4" /> : <ChevronDown className="mr-2 h-4 w-4" />}
        {showAddPlayer ? "Hide" : "Show"} Add Player
      </Button>
      <AnimatePresence>
        {showAddPlayer && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md"
          >
            <Card className="mb-4 sm:mb-6 md:mb-8 bg-card text-card-foreground">
              <CardHeader>
                <CardTitle>Add Player</CardTitle>
                <CardDescription>Enter player name to join the game</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Player name"
                    value={newPlayerName}
                    onChange={(e) => setNewPlayerName(e.target.value)}
                    className="bg-background text-foreground border-input"
                  />
                  <Button onClick={addPlayer} className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {players.length > 0 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-6xl"
          >
            <Card className="mb-4 sm:mb-6 md:mb-8 bg-card text-card-foreground">
              <CardHeader>
                <CardTitle>{players[currentPlayerIndex].name}&apos;s Turn</CardTitle>
              </CardHeader>
              <CardContent>
                <Button onClick={nextPlayer} className="w-full bg-accent text-accent-foreground hover:bg-accent/90 mb-4">
                  Next Player
                </Button>
                <DiceRoller
                  key={currentPlayerIndex}
                  onHistoryUpdate={updatePlayerHistory}
                  playerHistory={players[currentPlayerIndex].history}
                />
              </CardContent>
              <CardFooter>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      <Button onClick={resetData} className="mt-8 bg-destructive text-destructive-foreground hover:bg-destructive/90">
        Reset All Data
      </Button>
    </motion.main>
  )
}

