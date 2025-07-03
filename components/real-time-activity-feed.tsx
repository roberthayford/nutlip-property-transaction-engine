"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bell, Clock, CheckCircle, AlertTriangle, FileText } from "lucide-react"

interface ActivityUpdate {
  id: string
  type: "stage_completed" | "document_uploaded" | "message_sent" | "status_change"
  stage: string
  user: string
  userRole: string
  message: string
  timestamp?: string | Date
  priority: "low" | "medium" | "high"
}

const mockActivities: ActivityUpdate[] = [
  {
    id: "1",
    type: "stage_completed",
    stage: "proof-of-funds",
    user: "John Smith",
    userRole: "buyer",
    message: "Proof of funds submitted and verified",
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
    priority: "high",
  },
  {
    id: "2",
    type: "document_uploaded",
    stage: "conveyancers",
    user: "Smith & Associates",
    userRole: "buyer-conveyancer",
    message: "Draft contract documents uploaded",
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
    priority: "medium",
  },
  {
    id: "3",
    type: "message_sent",
    stage: "search-survey",
    user: "Davies Legal",
    userRole: "seller-conveyancer",
    message: "Property search results available for review",
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
    priority: "medium",
  },
  {
    id: "4",
    type: "status_change",
    stage: "mortgage-offer",
    user: "Sarah Johnson",
    userRole: "buyer",
    message: "Mortgage offer received and accepted",
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hours ago
    priority: "high",
  },
]

export function RealTimeActivityFeed() {
  const [activities, setActivities] = useState<ActivityUpdate[]>(mockActivities)

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      const newActivity: ActivityUpdate = {
        id: Date.now().toString(),
        type: "status_change",
        stage: "enquiries",
        user: "System",
        userRole: "system",
        message: "New enquiry response received",
        timestamp: new Date().toISOString(),
        priority: "medium",
      }

      setActivities((prev) => [newActivity, ...prev.slice(0, 9)]) // Keep only 10 most recent
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const getActivityIcon = (type: string) => {
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
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatTimestamp = (timestamp?: string | Date) => {
    if (!timestamp) {
      return "Just now"
    }

    try {
      const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp

      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "Just now"
      }

      const now = new Date()
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

      if (diffInMinutes < 1) {
        return "Just now"
      } else if (diffInMinutes < 60) {
        return `${diffInMinutes} min ago`
      } else if (diffInMinutes < 1440) {
        const hours = Math.floor(diffInMinutes / 60)
        return `${hours} hour${hours > 1 ? "s" : ""} ago`
      } else {
        return date.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        })
      }
    } catch (error) {
      console.warn("Error formatting timestamp:", error)
      return "Just now"
    }
  }

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "buyer":
        return "Buyer"
      case "seller":
        return "Seller"
      case "estate-agent":
        return "Estate Agent"
      case "buyer-conveyancer":
        return "Buyer's Conveyancer"
      case "seller-conveyancer":
        return "Seller's Conveyancer"
      case "system":
        return "System"
      default:
        return role
    }
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2">
          <Bell className="h-5 w-5" />
          <span>Live Activity Feed</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px] px-4">
          <div className="space-y-3">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex-shrink-0 mt-0.5">{getActivityIcon(activity.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{activity.user}</p>
                    <Badge variant="outline" className={`text-xs ${getPriorityColor(activity.priority)}`}>
                      {activity.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 mb-1">{getRoleDisplayName(activity.userRole)}</p>
                  <p className="text-sm text-gray-800 mb-2">{activity.message}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      {activity.stage.replace("-", " ")}
                    </Badge>
                    <span className="text-xs text-gray-500">{formatTimestamp(activity.timestamp)}</span>
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
