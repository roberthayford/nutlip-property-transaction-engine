"use client"

import { useRealTime } from "@/contexts/real-time-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Activity, Clock, User, FileText, CheckCircle, AlertCircle } from "lucide-react"

interface ActivityUpdate {
  id: string
  type: "document" | "status" | "message" | "system"
  title: string
  description: string
  timestamp: Date | string
  user?: string
  status?: "success" | "warning" | "error" | "info"
}

function formatTimestamp(timestamp: Date | string | undefined): string {
  if (!timestamp) return "-"

  try {
    const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      return "-"
    }
    return date.toLocaleTimeString()
  } catch {
    return "-"
  }
}

function getActivityIcon(type: string, status?: string) {
  switch (type) {
    case "document":
      return <FileText className="h-4 w-4" />
    case "status":
      if (status === "success") return <CheckCircle className="h-4 w-4 text-green-600" />
      if (status === "error") return <AlertCircle className="h-4 w-4 text-red-600" />
      return <Activity className="h-4 w-4" />
    case "message":
      return <User className="h-4 w-4" />
    default:
      return <Activity className="h-4 w-4" />
  }
}

function getStatusBadge(status?: string) {
  if (!status) return null

  const variants = {
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    error: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800",
  }

  return <Badge className={variants[status as keyof typeof variants] || variants.info}>{status}</Badge>
}

export function RealTimeActivityFeed() {
  const { updates } = useRealTime()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Activity className="h-5 w-5" />
          <span>Recent Activity</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64">
          {updates.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No recent activity</p>
            </div>
          ) : (
            <div className="space-y-3">
              {updates.map((update: ActivityUpdate) => (
                <div key={update.id} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                  <div className="flex-shrink-0 mt-0.5">{getActivityIcon(update.type, update.status)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium truncate">{update.title}</h4>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(update.status)}
                        <span className="text-xs text-muted-foreground flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatTimestamp(update.timestamp)}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{update.description}</p>
                    {update.user && <p className="text-xs text-muted-foreground mt-1">by {update.user}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

export default RealTimeActivityFeed
