"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useRealTime } from "@/contexts/real-time-context"
import { FileText, CheckCircle, Clock, AlertCircle, Upload, MessageSquare, Calendar } from "lucide-react"

function formatTimestamp(timestamp: string | Date | undefined): string {
  if (!timestamp) return "-"

  try {
    const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp
    if (isNaN(date.getTime())) return "-"
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  } catch {
    return "-"
  }
}

function getActivityIcon(type: string) {
  switch (type) {
    case "document_uploaded":
      return <Upload className="h-4 w-4 text-blue-600" />
    case "status_changed":
      return <CheckCircle className="h-4 w-4 text-green-600" />
    case "stage_completed":
      return <CheckCircle className="h-4 w-4 text-green-600" />
    case "completion_date_confirmed":
      return <Calendar className="h-4 w-4 text-green-600" />
    case "completion_date_rejected":
      return <AlertCircle className="h-4 w-4 text-red-600" />
    case "completion_date_proposed":
      return <Clock className="h-4 w-4 text-yellow-600" />
    case "contract_exchanged":
      return <FileText className="h-4 w-4 text-purple-600" />
    case "amendment_requested":
      return <MessageSquare className="h-4 w-4 text-orange-600" />
    case "amendment_replied":
      return <MessageSquare className="h-4 w-4 text-blue-600" />
    default:
      return <Clock className="h-4 w-4 text-gray-600" />
  }
}

function getActivityBadge(type: string) {
  switch (type) {
    case "document_uploaded":
      return <Badge className="bg-blue-100 text-blue-800">Document</Badge>
    case "status_changed":
      return <Badge className="bg-green-100 text-green-800">Status</Badge>
    case "stage_completed":
      return <Badge className="bg-green-100 text-green-800">Completed</Badge>
    case "completion_date_confirmed":
      return <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
    case "completion_date_rejected":
      return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
    case "completion_date_proposed":
      return <Badge className="bg-yellow-100 text-yellow-800">Proposed</Badge>
    case "contract_exchanged":
      return <Badge className="bg-purple-100 text-purple-800">Exchange</Badge>
    case "amendment_requested":
      return <Badge className="bg-orange-100 text-orange-800">Amendment</Badge>
    case "amendment_replied":
      return <Badge className="bg-blue-100 text-blue-800">Reply</Badge>
    default:
      return <Badge variant="outline">Update</Badge>
  }
}

export function RealTimeActivityFeed() {
  const { updates } = useRealTime()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="h-5 w-5" />
          <span>Recent Activity</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          {updates.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No recent activity</p>
            </div>
          ) : (
            <div className="space-y-4">
              {updates.map((update) => (
                <div key={update.id} className="flex items-start space-x-3 p-3 rounded-lg border">
                  <div className="flex-shrink-0 mt-0.5">{getActivityIcon(update.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium truncate">{update.title}</p>
                      {getActivityBadge(update.type)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{update.description}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="capitalize">{update.role.replace("-", " ")}</span>
                      <span>{formatTimestamp(update.createdAt)}</span>
                    </div>
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
