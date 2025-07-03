"use client"

import { useRealTime } from "@/contexts/real-time-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bell, Clock, CheckCircle, AlertTriangle, User, FileText } from "lucide-react"

interface ActivityUpdate {
  id: string
  type: "stage_completed" | "document_uploaded" | "message_sent" | "status_change"
  stage: string
  user: string
  message: string
  timestamp: string | Date
  priority: "low" | "medium" | "high"
  data?: any
}

export function RealTimeActivityFeed() {
  const { updates } = useRealTime()

  const formatTimestamp = (timestamp: string | Date) => {
    try {
      const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp
      if (isNaN(date.getTime())) {
        return "Just now"
      }
      return date.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      return "Just now"
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "stage_completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "document_uploaded":
        return <FileText className="h-4 w-4 text-blue-600" />
      case "message_sent":
        return <Bell className="h-4 w-4 text-purple-600" />
      case "status_change":
        return <AlertTriangle className="h-4 w-4 text-orange-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (!updates || updates.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Real-Time Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No recent activity</p>
            <p className="text-sm">Updates will appear here as they happen</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Real-Time Activity
          <Badge variant="secondary" className="ml-auto">
            {updates.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80">
          <div className="space-y-3">
            {updates.map((update) => (
              <div key={update.id} className="flex items-start gap-3 p-3 border rounded-lg">
                <div className="flex-shrink-0 mt-0.5">{getIcon(update.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm font-medium">{update.user}</span>
                    <Badge variant="outline" className="text-xs">
                      {update.stage}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{update.message}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{formatTimestamp(update.timestamp)}</span>
                    <Badge variant="outline" className={`text-xs ${getPriorityColor(update.priority)}`}>
                      {update.priority}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

export default RealTimeActivityFeed
