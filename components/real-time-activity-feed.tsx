"use client"

import { useRealTime } from "@/contexts/real-time-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileText, MessageSquare, CheckCircle, Upload, Clock } from "lucide-react"

export function RealTimeActivityFeed() {
  const { updates } = useRealTime()

  const getIcon = (type: string) => {
    switch (type) {
      case "document_uploaded":
        return Upload
      case "status_changed":
        return Clock
      case "message_sent":
        return MessageSquare
      case "stage_completed":
        return CheckCircle
      default:
        return FileText
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "document_uploaded":
        return "bg-blue-100 text-blue-800"
      case "status_changed":
        return "bg-amber-100 text-amber-800"
      case "message_sent":
        return "bg-purple-100 text-purple-800"
      case "stage_completed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>Live Activity</span>
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64">
          {updates.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">No recent activity</div>
          ) : (
            <div className="space-y-3">
              {updates.map((update) => {
                const Icon = getIcon(update.type)
                return (
                  <div key={update.id} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-muted/50">
                    <div className="flex-shrink-0">
                      <Icon className="h-4 w-4 text-muted-foreground mt-1" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{update.title}</p>
                        <Badge className={getTypeColor(update.type)} variant="secondary">
                          {update.role}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{update.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{update.timestamp.toLocaleTimeString()}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
