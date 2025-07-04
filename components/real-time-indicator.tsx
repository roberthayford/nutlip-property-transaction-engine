"use client"

import { useState } from "react"
import { Bell, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useRealTime } from "@/contexts/real-time-context"

export function RealTimeIndicator() {
  const { updates, markAsRead } = useRealTime()
  const [isOpen, setIsOpen] = useState(false)

  const unreadUpdates = updates?.filter((u) => !u.read) || []
  const unreadCount = unreadUpdates.length

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleMarkAsRead = (id: string) => {
    markAsRead(id)
  }

  const handleMarkAllAsRead = () => {
    unreadUpdates.forEach((update) => markAsRead(update.id))
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ""}`}
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <Card className="absolute right-0 top-full mt-2 w-80 max-h-96 shadow-lg z-50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Notifications</CardTitle>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead} className="text-xs">
                    Mark all read
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="h-6 w-6 p-0">
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="max-h-64">
              {updates && updates.length > 0 ? (
                <div className="space-y-1">
                  {updates.slice(0, 20).map((update) => (
                    <div
                      key={update.id}
                      className={`p-3 border-b last:border-b-0 cursor-pointer hover:bg-muted/50 ${
                        !update.read ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
                      }`}
                      onClick={() => handleMarkAsRead(update.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{update.title}</p>
                          {update.description && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{update.description}</p>
                          )}
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {update.stage}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {update.role}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{formatTime(update.createdAt)}</span>
                          </div>
                        </div>
                        {!update.read && <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-muted-foreground text-sm">No notifications yet</div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
