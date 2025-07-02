"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Bell, Wifi, WifiOff } from "lucide-react"
import { useRealTime } from "@/contexts/real-time-context"

export function RealTimeIndicator() {
  const { updates, transactionState } = useRealTime()
  const [isConnected, setIsConnected] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  // Simulate connection status
  useEffect(() => {
    const timer = setTimeout(() => setIsConnected(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  // Calculate unread updates
  useEffect(() => {
    const unread = updates.filter((update) => !update.read).length
    setUnreadCount(unread)
  }, [updates])

  const getStatusColor = () => {
    if (!isConnected) return "bg-red-500"
    return "bg-green-500"
  }

  const getStatusText = () => {
    if (!isConnected) return "Connecting..."
    return "Connected"
  }

  const formatTimestamp = (timestamp: string | Date) => {
    try {
      const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp
      if (!date || isNaN(date.getTime())) return ""
      return date.toLocaleTimeString()
    } catch {
      return ""
    }
  }

  return (
    <div className="flex items-center space-x-2">
      {/* Connection Status */}
      <div className="flex items-center space-x-2">
        {isConnected ? <Wifi className="h-4 w-4 text-green-600" /> : <WifiOff className="h-4 w-4 text-red-600" />}
        <Badge variant={isConnected ? "default" : "destructive"} className="text-xs">
          <div className={`w-2 h-2 rounded-full ${getStatusColor()} mr-1`} />
          {getStatusText()}
        </Badge>
      </div>

      {/* Notifications */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="relative bg-transparent">
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs">
                {unreadCount > 9 ? "9+" : unreadCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
          <Card className="border-0 shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center justify-between">
                Real-time Updates
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {unreadCount} new
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-64">
                {updates.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">No updates yet</div>
                ) : (
                  <div className="space-y-2 p-2">
                    {updates.slice(0, 10).map((update) => (
                      <div
                        key={update.id}
                        className={`p-2 rounded-lg border text-sm ${
                          update.read ? "bg-muted/50" : "bg-background border-primary/20"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-xs">{update.title}</p>
                            <p className="text-muted-foreground text-xs mt-1">{update.description}</p>
                            <div className="flex items-center justify-between mt-2">
                              <Badge variant="outline" className="text-xs">
                                {update.stage}
                              </Badge>
                              <span className="text-xs text-muted-foreground">{formatTimestamp(update.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </PopoverContent>
      </Popover>
    </div>
  )
}
