"use client"

import { useState, useEffect } from "react"
import TransactionLayout from "@/components/transaction-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useRealTime } from "@/contexts/real-time-context"
import {
  CheckCircle,
  Clock,
  PoundSterling,
  Key,
  Users,
  Home,
  Phone,
  Mail,
  Calendar,
  TrendingUp,
  Award,
  Target,
} from "lucide-react"

interface CompletionTask {
  id: string
  title: string
  completed: boolean
  timestamp?: string
  priority: "high" | "medium" | "low"
}

export default function EstateAgentCompletionPage() {
  const { toast } = useToast()
  const { sendUpdate } = useRealTime()

  const [completionTasks, setCompletionTasks] = useState<CompletionTask[]>([
    {
      id: "keys-handover",
      title: "Hand over keys to buyer",
      completed: true,
      timestamp: "2:30 PM",
      priority: "high",
    },
    {
      id: "final-walkthrough",
      title: "Complete final property walkthrough",
      completed: true,
      timestamp: "2:15 PM",
      priority: "high",
    },
    {
      id: "commission-confirmed",
      title: "Confirm commission payment received",
      completed: false,
      priority: "high",
    },
    {
      id: "feedback-buyer",
      title: "Collect feedback from buyer",
      completed: false,
      priority: "medium",
    },
    {
      id: "feedback-seller",
      title: "Collect feedback from seller",
      completed: false,
      priority: "medium",
    },
    {
      id: "referral-request",
      title: "Request referrals from satisfied clients",
      completed: false,
      priority: "medium",
    },
    {
      id: "marketing-update",
      title: "Update marketing materials with success story",
      completed: false,
      priority: "low",
    },
    {
      id: "follow-up-schedule",
      title: "Schedule follow-up calls for future business",
      completed: false,
      priority: "low",
    },
  ])

  const [notes, setNotes] = useState("")
  const [completionTime] = useState("2:30 PM")
  const [completionDate] = useState("April 15, 2024")

  // Transaction metrics
  const salePrice = 450000
  const commissionRate = 1.5 // 1.5%
  const commission = salePrice * (commissionRate / 100)
  const daysOnMarket = 28
  const viewingsArranged = 12
  const offersReceived = 3

  useEffect(() => {
    const savedTasks = localStorage.getItem("estate-agent-completion-tasks")
    const savedNotes = localStorage.getItem("estate-agent-completion-notes")

    if (savedTasks) {
      setCompletionTasks(JSON.parse(savedTasks))
    }
    if (savedNotes) {
      setNotes(savedNotes)
    }
  }, [])

  const toggleTask = (taskId: string) => {
    const updatedTasks = completionTasks.map((task) => {
      if (task.id === taskId) {
        const completed = !task.completed
        return {
          ...task,
          completed,
          timestamp: completed ? new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : undefined,
        }
      }
      return task
    })

    setCompletionTasks(updatedTasks)
    localStorage.setItem("estate-agent-completion-tasks", JSON.stringify(updatedTasks))

    const task = completionTasks.find((t) => t.id === taskId)

    if (task && !task.completed) {
      sendUpdate({
        type: "stage_completed",
        stage: "completion",
        role: "estate-agent",
        title: "Completion Task Completed",
        description: `${task.title} has been completed`,
        data: { taskId, taskTitle: task.title },
      })
    }

    toast({
      title: task?.completed ? "Task Incomplete" : "Task Completed",
      description: `${task?.title} ${task?.completed ? "marked as incomplete" : "completed successfully"}`,
    })
  }

  const saveNotes = () => {
    localStorage.setItem("estate-agent-completion-notes", notes)
    toast({
      title: "Notes Saved",
      description: "Completion notes have been saved successfully.",
    })
  }

  const requestFeedback = () => {
    sendUpdate({
      type: "document_uploaded",
      stage: "completion",
      role: "estate-agent",
      title: "Feedback Request Sent",
      description: "Feedback requests sent to buyer and seller",
    })

    toast({
      title: "Feedback Requested",
      description: "Feedback forms have been sent to both parties.",
    })
  }

  const completedTasks = completionTasks.filter((task) => task.completed).length
  const totalTasks = completionTasks.length
  const progressPercentage = Math.round((completedTasks / totalTasks) * 100)

  const getPriorityBadge = (priority: CompletionTask["priority"]) => {
    switch (priority) {
      case "high":
        return (
          <Badge variant="destructive" className="text-xs">
            High
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="default" className="bg-yellow-100 text-yellow-800 border-yellow-200 text-xs">
            Medium
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="text-xs">
            Low
          </Badge>
        )
    }
  }

  return (
    <TransactionLayout currentStage="completion" userRole="estate-agent">
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
          <Award className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-green-800">Sale Completed Successfully!</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Transaction completed on {completionDate} at {completionTime}
            </p>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Sale Price</p>
                  <p className="text-2xl font-bold text-gray-900">£{salePrice.toLocaleString()}</p>
                </div>
                <PoundSterling className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-xs text-gray-500 mt-1">Asking price achieved</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Commission</p>
                  <p className="text-2xl font-bold text-gray-900">£{commission.toLocaleString()}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <p className="text-xs text-gray-500 mt-1">{commissionRate}% commission rate</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Days on Market</p>
                  <p className="text-2xl font-bold text-gray-900">{daysOnMarket}</p>
                </div>
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
              <p className="text-xs text-gray-500 mt-1">Below average time</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Viewings</p>
                  <p className="text-2xl font-bold text-gray-900">{viewingsArranged}</p>
                </div>
                <Target className="h-8 w-8 text-orange-600" />
              </div>
              <p className="text-xs text-gray-500 mt-1">{offersReceived} offers received</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          <Card className="lg:col-span-2 xl:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                <span>Post-Completion Checklist</span>
                <Badge variant="outline" className="ml-auto text-xs">
                  {completedTasks}/{totalTasks} Complete
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>

              <div className="space-y-2 sm:space-y-3">
                {completionTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start space-x-3 p-2 sm:p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`mt-0.5 h-4 w-4 sm:h-5 sm:w-5 rounded border-2 flex items-center justify-center transition-colors ${
                        task.completed
                          ? "bg-green-600 border-green-600 text-white"
                          : "border-gray-300 hover:border-green-600"
                      }`}
                    >
                      {task.completed && <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <span
                          className={`text-sm sm:text-base font-medium ${
                            task.completed ? "line-through text-muted-foreground" : ""
                          }`}
                        >
                          {task.title}
                        </span>
                        <div className="flex items-center space-x-2 mt-1 sm:mt-0">
                          {getPriorityBadge(task.priority)}
                          {task.timestamp && (
                            <span className="text-xs text-muted-foreground flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {task.timestamp}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                <Home className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                <span>Property Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div>
                <h3 className="font-semibold text-base sm:text-lg">123 Example Street</h3>
                <p className="text-sm text-muted-foreground">London, SW1A 1AA</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-xs">
                  3 Bed
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  2 Bath
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  Garden
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  Parking
                </Badge>
              </div>
              <div className="pt-3 border-t space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Listed Price:</span>
                  <span className="font-semibold">£450,000</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Sold Price:</span>
                  <span className="font-semibold">£450,000</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Commission:</span>
                  <span className="font-semibold">£{commission.toLocaleString()}</span>
                </div>
              </div>

              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Key className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Keys Handed Over</span>
                </div>
                <p className="text-xs text-green-700 mt-1">Transaction completed successfully.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                <span>Client Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="p-2 sm:p-3 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-medium text-sm">Buyer</span>
                      <p className="text-xs text-muted-foreground">John Smith</p>
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground mt-1">
                        <Phone className="h-3 w-3" />
                        <span>07123 456789</span>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800 text-xs">Satisfied</Badge>
                  </div>
                </div>

                <div className="p-2 sm:p-3 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-medium text-sm">Seller</span>
                      <p className="text-xs text-muted-foreground">Jane Doe</p>
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground mt-1">
                        <Mail className="h-3 w-3" />
                        <span>jane.doe@email.com</span>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800 text-xs">Happy</Badge>
                  </div>
                </div>

                <div className="p-2 sm:p-3 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-medium text-sm">Buyer Conveyancer</span>
                      <p className="text-xs text-muted-foreground">Smith & Partners</p>
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground mt-1">
                        <Phone className="h-3 w-3" />
                        <span>020 7123 4567</span>
                      </div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800 text-xs">Professional</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 xl:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                <span>Business Development</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
                <div className="p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <h4 className="font-semibold text-blue-800 text-sm">Referral Opportunities</h4>
                  </div>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• Ask for Google/Rightmove reviews</li>
                    <li>• Request referrals from satisfied clients</li>
                    <li>• Connect with their network</li>
                    <li>• Follow up in 6 months</li>
                  </ul>
                </div>

                <div className="p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Award className="h-4 w-4 text-green-600" />
                    <h4 className="font-semibold text-green-800 text-sm">Marketing Assets</h4>
                  </div>
                  <ul className="text-xs text-green-700 space-y-1">
                    <li>• Add to success stories</li>
                    <li>• Update portfolio with photos</li>
                    <li>• Create case study</li>
                    <li>• Social media content</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="completion-notes" className="text-sm font-medium">
                  Completion Notes & Follow-up Actions
                </Label>
                <Textarea
                  id="completion-notes"
                  placeholder="Add notes about the completion, client feedback, potential referrals, or follow-up actions..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[80px] text-sm"
                />
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button onClick={saveNotes} variant="outline" size="sm" className="w-full sm:w-auto bg-transparent">
                    Save Notes
                  </Button>
                  <Button onClick={requestFeedback} size="sm" className="w-full sm:w-auto">
                    Request Feedback
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TransactionLayout>
  )
}
