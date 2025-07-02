"use client"

import { CardDescription } from "@/components/ui/card"

import { useState, useEffect } from "react"
import {
  Bell,
  CheckCircle,
  Clock,
  Eye,
  AlertTriangle,
  Users,
  FileText,
  MessageSquare,
  Calendar,
  User,
  Building,
  Download,
  Edit,
  Save,
  X,
  Check,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import TransactionLayout from "@/components/transaction-layout"
import { RealTimeActivityFeed } from "@/components/real-time-activity-feed"
import { useRealTime } from "@/contexts/real-time-context"
import Link from "next/link"

// Mock data for requisitions
const initialRequisitions = [
  {
    id: "req-1",
    title: "Property Title Verification",
    description: "Please confirm the property title is clear and provide evidence of ownership",
    priority: "high",
    status: "pending",
    dueDate: "2024-03-28",
    category: "Legal",
    sender: "Seller's Conveyancer",
    response: "",
    dateReceived: "2024-03-25",
    referenceNumber: "REQ-2024-001",
  },
  {
    id: "req-2",
    title: "Planning Permission History",
    description: "Provide details of any planning applications or building regulations approvals for the property",
    priority: "medium",
    status: "pending",
    dueDate: "2024-03-30",
    category: "Planning",
    sender: "Seller's Conveyancer",
    response: "",
    dateReceived: "2024-03-25",
    referenceNumber: "REQ-2024-002",
  },
  {
    id: "req-3",
    title: "Boundary Disputes",
    description: "Confirm there are no ongoing or historical boundary disputes with neighboring properties",
    priority: "medium",
    status: "pending",
    dueDate: "2024-03-29",
    category: "Property",
    sender: "Seller's Conveyancer",
    response: "",
    dateReceived: "2024-03-25",
    referenceNumber: "REQ-2024-003",
  },
  {
    id: "req-4",
    title: "Service Charges and Ground Rent",
    description: "Provide details of any service charges, ground rent, or management fees applicable to the property",
    priority: "high",
    status: "pending",
    dueDate: "2024-03-27",
    category: "Financial",
    sender: "Seller's Conveyancer",
    response: "",
    dateReceived: "2024-03-25",
    referenceNumber: "REQ-2024-004",
  },
  {
    id: "req-5",
    title: "Environmental Searches",
    description: "Confirm environmental search results and any potential contamination issues",
    priority: "low",
    status: "pending",
    dueDate: "2024-04-01",
    category: "Environmental",
    sender: "Seller's Conveyancer",
    response: "",
    dateReceived: "2024-03-25",
    referenceNumber: "REQ-2024-005",
  },
  {
    id: "req-6",
    title: "Utilities and Services",
    description: "Provide confirmation of all utilities connected to the property and any shared services",
    priority: "medium",
    status: "pending",
    dueDate: "2024-03-31",
    category: "Property",
    sender: "Seller's Conveyancer",
    response: "",
    dateReceived: "2024-03-25",
    referenceNumber: "REQ-2024-006",
  },
]

export default function EstateAgentRepliesToRequisitionsPage() {
  const [requisitions, setRequisitions] = useState(initialRequisitions)
  const [filter, setFilter] = useState<"all" | "pending" | "replied" | "urgent">("all")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingResponse, setEditingResponse] = useState("")
  const { updates, addUpdate } = useRealTime()

  // Load saved data on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("estate-agent-requisitions-status")
      if (saved) {
        try {
          const parsedData = JSON.parse(saved)
          setRequisitions(parsedData)
        } catch (error) {
          console.error("Error parsing saved requisitions:", error)
        }
      }
    }
  }, [])

  // Save data whenever requisitions change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("estate-agent-requisitions-status", JSON.stringify(requisitions))
    }
  }, [requisitions])

  // Listen for reset events
  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleReset = () => {
        setRequisitions(initialRequisitions)
        setEditingId(null)
        setEditingResponse("")
      }

      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === "pte-reset-demo" && e.newValue === "true") {
          handleReset()
        }
      }

      window.addEventListener("storage", handleStorageChange)
      return () => window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  const handleStartEdit = (requisition: any) => {
    setEditingId(requisition.id)
    setEditingResponse(requisition.response || "")
  }

  const handleSaveResponse = (requisitionId: string) => {
    setRequisitions((prev) =>
      prev.map((req) =>
        req.id === requisitionId
          ? {
              ...req,
              response: editingResponse,
              status: editingResponse.trim() ? "replied" : "pending",
            }
          : req,
      ),
    )

    // Add real-time update
    addUpdate({
      id: `requisition-response-${Date.now()}`,
      type: "requisition-response",
      title: "Requisition Response Updated",
      description: `Estate agent provided response to requisition ${requisitionId}`,
      timestamp: new Date(),
      priority: "medium",
      stage: "replies-to-requisitions",
      user: "Estate Agent",
    })

    setEditingId(null)
    setEditingResponse("")
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingResponse("")
  }

  const handleMarkComplete = (requisitionId: string) => {
    setRequisitions((prev) => prev.map((req) => (req.id === requisitionId ? { ...req, status: "replied" } : req)))

    // Add real-time update
    addUpdate({
      id: `requisition-complete-${Date.now()}`,
      type: "requisition-complete",
      title: "Requisition Marked Complete",
      description: `Estate agent marked requisition ${requisitionId} as complete`,
      timestamp: new Date(),
      priority: "low",
      stage: "replies-to-requisitions",
      user: "Estate Agent",
    })
  }

  const filteredRequisitions = requisitions.filter((req) => {
    switch (filter) {
      case "pending":
        return req.status === "pending"
      case "replied":
        return req.status === "replied"
      case "urgent":
        return req.priority === "high"
      default:
        return true
    }
  })

  const completedCount = requisitions.filter((req) => req.status === "replied").length
  const totalCount = requisitions.length
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-amber-100 text-amber-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "replied":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-amber-100 text-amber-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Legal":
        return <FileText className="h-4 w-4" />
      case "Planning":
        return <Building className="h-4 w-4" />
      case "Financial":
        return <MessageSquare className="h-4 w-4" />
      case "Environmental":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const isAllComplete = completedCount === totalCount && totalCount > 0

  return (
    <TransactionLayout
      currentStage="replies-to-requisitions"
      userRole="estate-agent"
      title="Replies to Requisitions - Estate Agent View"
      description="Monitor completion requisitions and responses between conveyancers"
    >
      <div className="space-y-6">
        {/* Conveyancer Stage Info */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-blue-600" />
            <div>
              <div className="font-medium">Conveyancer Completion Process</div>
              <div className="text-sm text-gray-600">
                The conveyancers are handling final completion requisitions and responses. This is the final legal step
                before completion. You will be notified of progress and any issues that may affect the completion
                timeline.
              </div>
            </div>
          </div>
        </div>

        {/* Notification Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Requisitions Status
            </CardTitle>
            <CardDescription>Current status of completion requisitions and responses</CardDescription>
          </CardHeader>
          <CardContent>
            {completedCount === 0 && (
              <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <Clock className="h-5 w-5 text-amber-600" />
                <div className="flex-1">
                  <div className="font-medium">Monitoring Requisitions Progress</div>
                  <div className="text-sm text-gray-600">
                    The conveyancers are exchanging completion requisitions and responses. You will be notified
                    automatically when all requisitions are resolved.
                  </div>
                </div>
                <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                  {progressPercentage}% Complete
                </Badge>
              </div>
            )}

            {completedCount > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div className="flex-1">
                    <div className="font-medium">All Requisitions Resolved</div>
                    <div className="text-sm text-gray-600">
                      All completion requisitions have been answered and the transaction is ready for completion.
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Completed
                  </Badge>
                </div>

                {/* Requisitions Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completed By</p>
                    <p className="font-semibold">Estate Agent</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Requisitions</p>
                    <p className="font-semibold">{totalCount} Items</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completed</p>
                    <p className="font-semibold">
                      {new Date().toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Next Stage</p>
                    <p className="font-semibold">Completion</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Estate Agent Monitoring Role */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Estate Agent Monitoring Role
            </CardTitle>
            <CardDescription>Your role during the replies to requisitions stage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Your Responsibilities</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Monitor progress and stay informed of any completion issues</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Coordinate key handover arrangements for completion day</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Ensure property is ready for vacant possession</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Facilitate final property inspection if required</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Maintain communication with buyer and seller about completion timeline</span>
                </li>
              </ul>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-medium mb-2 text-yellow-800">Potential Issues to Watch For</h4>
              <ul className="space-y-2 text-sm text-yellow-700">
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Delays in requisition responses that could affect completion date</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Outstanding mortgage discharge issues</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Final meter readings or utility transfer problems</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Key collection or property access complications</span>
                </li>
              </ul>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium mb-2 text-blue-800">What Happens Next</h4>
              <p className="text-sm text-blue-700">
                {completedCount > 0
                  ? "All requisitions have been resolved. The transaction will now proceed to completion. Ensure all practical arrangements are in place for completion day."
                  : "The conveyancers will continue to exchange requisitions and responses until all completion matters are resolved. You'll be notified of key milestones and any issues that may affect the completion timeline."}
              </p>
            </div>

            {/* Completion Timeline */}
            <div className="p-4 border rounded-lg bg-green-50">
              <h4 className="font-semibold mb-2 flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Completion Timeline
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Target Completion Date:</span>
                  <span className="font-semibold">April 26, 2024</span>
                </div>
                <div className="flex justify-between">
                  <span>Completion Time:</span>
                  <span className="font-semibold">2:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Days Remaining:</span>
                  <span className="font-semibold text-green-600">2 Days</span>
                </div>
                <div className="flex justify-between">
                  <span>Requisitions Deadline:</span>
                  <span className="font-semibold">April 25, 2024</span>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                {completedCount > 0
                  ? "All requisitions resolved - ready for completion"
                  : "You will be automatically notified when all requisitions are resolved"}
              </p>
              <Badge variant="outline" className="px-4 py-2">
                {completedCount > 0 ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Ready for Completion
                  </>
                ) : (
                  <>
                    <Clock className="h-4 w-4 mr-2" />
                    Awaiting Requisition Resolution
                  </>
                )}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Replies to Requisitions</h1>
            <p className="text-muted-foreground mt-2">
              Monitor and coordinate responses to legal requisitions from the seller's conveyancer
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Set Reminders
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <FileText className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Requisitions</p>
                  <p className="text-2xl font-bold">{totalCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Replied</p>
                  <p className="text-2xl font-bold">{completedCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Clock className="h-8 w-8 text-amber-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">{totalCount - completedCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-8 w-8 text-red-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">High Priority</p>
                  <p className="text-2xl font-bold">{requisitions.filter((req) => req.priority === "high").length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>Overall Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Requisitions Completed</span>
                <span className="text-sm text-muted-foreground">
                  {completedCount} of {totalCount}
                </span>
              </div>
              <Progress value={progressPercentage} className="w-full" />
              <p className="text-sm text-muted-foreground">
                {isAllComplete
                  ? "All requisitions have been addressed. Ready to proceed to completion."
                  : `${totalCount - completedCount} requisitions still need responses.`}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Requisitions List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5" />
                    <span>Requisitions</span>
                  </CardTitle>
                  <div className="flex space-x-2">
                    <Button
                      variant={filter === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilter("all")}
                    >
                      All
                    </Button>
                    <Button
                      variant={filter === "pending" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilter("pending")}
                    >
                      Pending
                    </Button>
                    <Button
                      variant={filter === "replied" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilter("replied")}
                    >
                      Replied
                    </Button>
                    <Button
                      variant={filter === "urgent" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilter("urgent")}
                    >
                      Urgent
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredRequisitions.map((requisition) => (
                    <div key={requisition.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            {getCategoryIcon(requisition.category)}
                            <h3 className="font-semibold">{requisition.title}</h3>
                            <Badge className={getPriorityColor(requisition.priority)}>{requisition.priority}</Badge>
                            <Badge className={getStatusColor(requisition.status)}>{requisition.status}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{requisition.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <User className="h-3 w-3" />
                              <span>{requisition.sender}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>Due: {new Date(requisition.dueDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <FileText className="h-3 w-3" />
                              <span>{requisition.referenceNumber}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Response Section */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">Response Status</Label>
                        {editingId === requisition.id ? (
                          <div className="space-y-3">
                            <Textarea
                              value={editingResponse}
                              onChange={(e) => setEditingResponse(e.target.value)}
                              placeholder="Monitor the response status and coordinate with the buyer's conveyancer..."
                              className="min-h-[100px]"
                            />
                            <div className="flex space-x-2">
                              <Button size="sm" onClick={() => handleSaveResponse(requisition.id)}>
                                <Save className="h-4 w-4 mr-1" />
                                Save
                              </Button>
                              <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                                <X className="h-4 w-4 mr-1" />
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {requisition.response ? (
                              <div className="bg-muted p-3 rounded-md">
                                <p className="text-sm">{requisition.response}</p>
                              </div>
                            ) : (
                              <div className="bg-muted p-3 rounded-md">
                                <p className="text-sm text-muted-foreground italic">
                                  No response status recorded yet. Monitor progress with buyer's conveyancer.
                                </p>
                              </div>
                            )}
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline" onClick={() => handleStartEdit(requisition)}>
                                <Edit className="h-4 w-4 mr-1" />
                                Update Status
                              </Button>
                              {requisition.status === "pending" && (
                                <Button size="sm" variant="outline" onClick={() => handleMarkComplete(requisition.id)}>
                                  <Check className="h-4 w-4 mr-1" />
                                  Mark Complete
                                </Button>
                              )}
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4 mr-1" />
                                View Details
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activity Feed */}
          <div>
            <RealTimeActivityFeed updates={updates} />
          </div>
        </div>

        {/* Continue Button */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-2">Ready to Continue?</h3>
                <p className="text-sm text-muted-foreground">
                  {isAllComplete
                    ? "All requisitions have been addressed. You can now proceed to completion."
                    : "Complete all requisition responses before proceeding to completion."}
                </p>
              </div>
              <Link href="/estate-agent/completion">
                <Button disabled={!isAllComplete} className="bg-green-600 hover:bg-green-700">
                  Continue to Completion
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </TransactionLayout>
  )
}
