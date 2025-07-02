"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useRealTime } from "@/contexts/real-time-context"
import { Bell, CheckCircle, AlertTriangle, FileText, Users, MessageSquare, Eye, EyeOff, Filter, X } from "lucide-react"

interface RealTimeActivityFeedProps {
  className?: string
  maxItems?: number
  showFilters?: boolean
}

export function RealTimeActivityFeed({ className = "", maxItems = 10, showFilters = true }: RealTimeActivityFeedProps) {
  const { updates, markAsRead, markAllAsRead } = useRealTime()
  const [filter, setFilter] = useState<"all" | "unread" | "important">("all")
  const [showRead, setShowRead] = useState(true)

  // Filter updates based on current filter
  const filteredUpdates = updates
    .filter((update) => {
      if (filter === "unread" && update.read) return false
      if (filter === "important" && update.type !== "stage_completed" && update.type !== "document_uploaded")
        return false
      if (!showRead && update.read) return false
      return true
    })
    .slice(0, maxItems)

  const unreadCount = updates.filter((update) => !update.read).length

  const getUpdateIcon = (type: string) => {
    switch (type) {
      case "stage_completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "document_uploaded":
        return <FileText className="h-4 w-4 text-blue-600" />
      case "status_changed":
        return <AlertTriangle className="h-4 w-4 text-amber-600" />
      case "user_joined":
        return <Users className="h-4 w-4 text-purple-600" />
      case "message_sent":
        return <MessageSquare className="h-4 w-4 text-indigo-600" />
      default:
        return <Bell className="h-4 w-4 text-gray-600" />
    }
  }

  const getUpdateColor = (type: string, read: boolean) => {
    const baseColor = read ? "bg-gray-50" : "bg-blue-50"
    switch (type) {
      case "stage_completed":
        return read ? "bg-green-50 border-green-200" : "bg-green-100 border-green-300"
      case "document_uploaded":
        return read ? "bg-blue-50 border-blue-200" : "bg-blue-100 border-blue-300"
      case "status_changed":
        return read ? "bg-amber-50 border-amber-200" : "bg-amber-100 border-amber-300"
      default:
        return read ? "bg-gray-50 border-gray-200" : "bg-blue-50 border-blue-300"
    }
  }

  const formatTimestamp = (timestamp: any) => {
    try {
      // Handle various timestamp formats
      if (!timestamp) return "Unknown time"

      let date: Date
      if (timestamp instanceof Date) {
        date = timestamp
      } else if (typeof timestamp === "string" || typeof timestamp === "number") {
        date = new Date(timestamp)
      } else {
        return "Unknown time"
      }

      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "Unknown time"
      }

      return date.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch (error) {
      console.error("Error formatting timestamp:", error)
      return "Unknown time"
    }
  }

  const formatRelativeTime = (timestamp: any) => {
    try {
      if (!timestamp) return "Unknown time"

      let date: Date
      if (timestamp instanceof Date) {
        date = timestamp
      } else if (typeof timestamp === "string" || typeof timestamp === "number") {
        date = new Date(timestamp)
      } else {
        return "Unknown time"
      }

      if (isNaN(date.getTime())) {
        return "Unknown time"
      }

      const now = new Date()
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

      if (diffInMinutes < 1) return "Just now"
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`

      const diffInHours = Math.floor(diffInMinutes / 60)
      if (diffInHours < 24) return `${diffInHours}h ago`

      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays}d ago`
    } catch (error) {
      console.error("Error formatting relative time:", error)
      return "Unknown time"
    }
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">Activity Feed</CardTitle>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount} new
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {showFilters && (
              <>
                <Button variant="ghost" size="sm" onClick={() => setShowRead(!showRead)} className="text-xs">
                  {showRead ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilter(filter === "all" ? "unread" : filter === "unread" ? "important" : "all")}
                  className="text-xs"
                >
                  <Filter className="h-3 w-3" />
                </Button>
              </>
            )}
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs">
                Mark all read
              </Button>
            )}
          </div>
        </div>
        <CardDescription>
          Real-time transaction updates
          {filter !== "all" && (
            <Badge variant="outline" className="ml-2 text-xs">
              {filter}
            </Badge>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-80">
          <div className="space-y-2 p-4">
            {filteredUpdates.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No activity to show</p>
                {filter !== "all" && (
                  <Button variant="ghost" size="sm" onClick={() => setFilter("all")} className="mt-2 text-xs">
                    <X className="h-3 w-3 mr-1" />
                    Clear filter
                  </Button>
                )}
              </div>
            ) : (
              filteredUpdates.map((update) => (
                <div
                  key={update.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-sm ${getUpdateColor(update.type, update.read)}`}
                  onClick={() => !update.read && markAsRead(update.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">{getUpdateIcon(update.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className={`text-sm font-medium truncate ${!update.read ? "font-semibold" : ""}`}>
                          {update.title}
                        </h4>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {!update.read && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
                          <span className="text-xs text-gray-500">{formatRelativeTime(update.timestamp)}</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">{update.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {update.stage?.replace("-", " ") || "General"}
                          </Badge>
                          {update.role && (
                            <Badge variant="secondary" className="text-xs">
                              {update.role.replace("-", " ")}
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-gray-400">{formatTimestamp(update.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
