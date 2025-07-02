"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  CheckCircle,
  Clock,
  Key,
  PoundSterling,
  FileText,
  Calendar,
  MapPin,
  Users,
  Banknote,
  Download,
  Send,
  CheckSquare,
  XCircle,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import TransactionLayout from "@/components/transaction-layout"

interface CompletionItem {
  id: string
  title: string
  description: string
  status: "completed" | "pending" | "failed"
  timestamp?: string
  notes?: string
}

interface CompletionData {
  completionDate: string
  completionTime: string
  keyHandoverLocation: string
  finalBalance: number
  outstandingMortgage: number
  netProceeds: number
  completionItems: CompletionItem[]
  postCompletionTasks: CompletionItem[]
}

export default function SellerConveyancerCompletionPage() {
  const [completionData, setCompletionData] = useState<CompletionData>({
    completionDate: "2024-01-15",
    completionTime: "14:00",
    keyHandoverLocation: "Estate Agent Office - 123 High Street, London",
    finalBalance: 450000,
    outstandingMortgage: 280000,
    netProceeds: 170000,
    completionItems: [
      {
        id: "funds-received",
        title: "Completion Funds Received",
        description: "Confirmation of receipt of completion monies from buyer's conveyancer",
        status: "completed",
        timestamp: "2024-01-15 13:45",
      },
      {
        id: "mortgage-redemption",
        title: "Mortgage Redemption",
        description: "Outstanding mortgage redeemed with lender",
        status: "completed",
        timestamp: "2024-01-15 13:50",
      },
      {
        id: "title-transfer",
        title: "Title Transfer Completed",
        description: "Legal title transferred to buyer at Land Registry",
        status: "completed",
        timestamp: "2024-01-15 14:00",
      },
      {
        id: "keys-released",
        title: "Keys Released",
        description: "Property keys released to buyer",
        status: "completed",
        timestamp: "2024-01-15 14:15",
      },
    ],
    postCompletionTasks: [
      {
        id: "final-statement",
        title: "Final Statement to Client",
        description: "Send completion statement and remaining funds to seller",
        status: "pending",
      },
      {
        id: "land-registry",
        title: "Land Registry Registration",
        description: "Submit transfer documents to Land Registry",
        status: "pending",
      },
      {
        id: "discharge-mortgage",
        title: "Mortgage Discharge",
        description: "Obtain and file mortgage discharge certificate",
        status: "pending",
      },
    ],
  })

  const [notes, setNotes] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Load completion data from localStorage
    const savedData = localStorage.getItem("seller_conveyancer_completion")
    if (savedData) {
      try {
        setCompletionData(JSON.parse(savedData))
      } catch (error) {
        console.error("Error loading completion data:", error)
      }
    }
  }, [])

  const saveCompletionData = (data: CompletionData) => {
    setCompletionData(data)
    localStorage.setItem("seller_conveyancer_completion", JSON.stringify(data))
  }

  const handleTaskComplete = (taskId: string, isPostCompletion = false) => {
    const updatedData = { ...completionData }
    const tasks = isPostCompletion ? updatedData.postCompletionTasks : updatedData.completionItems

    const taskIndex = tasks.findIndex((task) => task.id === taskId)
    if (taskIndex !== -1) {
      tasks[taskIndex] = {
        ...tasks[taskIndex],
        status: "completed",
        timestamp: new Date().toISOString().slice(0, 16).replace("T", " "),
      }
      saveCompletionData(updatedData)
      toast({
        title: "Task Completed",
        description: `${tasks[taskIndex].title} has been marked as completed.`,
      })
    }
  }

  const handleSendFinalStatement = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Final Statement Sent",
        description: "Completion statement has been sent to the seller client.",
      })
      handleTaskComplete("final-statement", true)
    }, 2000)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const completedItems = completionData.completionItems.filter((item) => item.status === "completed").length
  const totalItems = completionData.completionItems.length
  const completionPercentage = Math.round((completedItems / totalItems) * 100)

  return (
    <TransactionLayout currentStage="completion" userRole="seller-conveyancer">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Transaction Completion</h1>
            <p className="text-muted-foreground mt-1">Final completion process and post-completion tasks</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Badge className="bg-green-100 text-green-800 text-center">
              <CheckCircle className="h-4 w-4 mr-1" />
              Completion Successful
            </Badge>
          </div>
        </div>

        {/* Completion Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">Completion Date</p>
                  <p className="text-lg font-bold">{completionData.completionDate}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Completion Time</p>
                  <p className="text-lg font-bold">{completionData.completionTime}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <PoundSterling className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium">Net Proceeds</p>
                  <p className="text-lg font-bold">£{completionData.netProceeds.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckSquare className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm font-medium">Progress</p>
                  <p className="text-lg font-bold">{completionPercentage}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Financial Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Banknote className="h-5 w-5" />
              <span>Financial Settlement Summary</span>
            </CardTitle>
            <CardDescription>Breakdown of completion finances</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Sale Price</Label>
                <div className="text-2xl font-bold text-green-600">£{completionData.finalBalance.toLocaleString()}</div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Outstanding Mortgage</Label>
                <div className="text-2xl font-bold text-red-600">
                  -£{completionData.outstandingMortgage.toLocaleString()}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Net Proceeds to Seller</Label>
                <div className="text-2xl font-bold text-blue-600">£{completionData.netProceeds.toLocaleString()}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Completion Checklist */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckSquare className="h-5 w-5" />
              <span>Completion Checklist</span>
            </CardTitle>
            <CardDescription>Key completion tasks and their status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {completionData.completionItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-start space-x-3 mb-3 sm:mb-0">
                    {getStatusIcon(item.status)}
                    <div className="flex-1">
                      <h4 className="font-medium">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                      {item.timestamp && (
                        <p className="text-xs text-muted-foreground mt-1">Completed: {item.timestamp}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">{getStatusBadge(item.status)}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Post-Completion Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Post-Completion Tasks</span>
            </CardTitle>
            <CardDescription>Tasks to be completed after the transaction</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {completionData.postCompletionTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-start space-x-3 mb-3 sm:mb-0">
                    {getStatusIcon(task.status)}
                    <div className="flex-1">
                      <h4 className="font-medium">{task.title}</h4>
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                      {task.timestamp && (
                        <p className="text-xs text-muted-foreground mt-1">Completed: {task.timestamp}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                    {getStatusBadge(task.status)}
                    {task.status === "pending" && (
                      <Button size="sm" onClick={() => handleTaskComplete(task.id, true)} className="w-full sm:w-auto">
                        Mark Complete
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Key Handover Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Key className="h-5 w-5" />
              <span>Key Handover Details</span>
            </CardTitle>
            <CardDescription>Property key collection information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <Label className="text-sm font-medium">Handover Location</Label>
                  <p className="text-sm text-muted-foreground">{completionData.keyHandoverLocation}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <Label className="text-sm font-medium">Parties Present</Label>
                  <p className="text-sm text-muted-foreground">Estate Agent, Buyer, Buyer's Representative</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Final Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Send className="h-5 w-5" />
              <span>Final Actions</span>
            </CardTitle>
            <CardDescription>Complete the transaction process</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="completion-notes" className="text-sm font-medium">
                  Completion Notes
                </Label>
                <Textarea
                  id="completion-notes"
                  placeholder="Add any final notes about the completion..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={handleSendFinalStatement} disabled={isLoading} className="flex-1">
                  {isLoading ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Final Statement
                    </>
                  )}
                </Button>

                <Button variant="outline" className="flex-1 bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  Download Completion Pack
                </Button>

                <Button variant="outline" className="flex-1 bg-transparent">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TransactionLayout>
  )
}
