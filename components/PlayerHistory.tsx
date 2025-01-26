import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { HistoryItem } from "./DiceRoller"

interface PlayerHistoryProps {
  history: HistoryItem[]
}

function HistoryItemContent({ item }: { item: HistoryItem }) {
  return (
    <div className="mb-4 p-4 bg-secondary/10 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold text-primary">Roll</span>
        {item.total && <span className="text-sm font-medium text-primary">Total: {item.total}</span>}
      </div>
      <p className="text-sm mb-2">{item.description}</p>
      {item.comment && <p className="text-sm italic text-accent mb-2">{item.comment}</p>}
      {item.relatedEvents &&
        item.relatedEvents.map((relatedItem, index) => (
          <div key={index} className="ml-4 mt-2">
            <span
              className={`font-semibold ${
                relatedItem.type === "challenge"
                  ? "text-accent"
                  : relatedItem.type === "reward"
                    ? "text-green-600"
                    : "text-destructive"
              }`}
            >
              {relatedItem.type.charAt(0).toUpperCase() + relatedItem.type.slice(1)}:
            </span>
            <p className="text-sm">{relatedItem.description}</p>
          </div>
        ))}
    </div>
  )
}

export function PlayerHistory({ history }: PlayerHistoryProps) {
  const sortedHistory = [...history].reverse()

  if (sortedHistory.length === 0) {
    return (
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle>Turn History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">No turns yet. Roll the dice to start!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Turn History</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] lg:h-[500px] w-full rounded-md border p-4">
          {sortedHistory.map((item, index) => (
            <HistoryItemContent key={index} item={item} />
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

