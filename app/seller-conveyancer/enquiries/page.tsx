"use client"

import { useState, useEffect } from "react"
import TransactionLayout from "@/components/transaction-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { MessageSquare, Clock, CheckCircle, AlertTriangle, FileText, Send, Eye, Reply } from "lucide-react"
import { useRealTime } from "@/contexts/real-time-context"
import { useToast } from "@/hooks/use-toast"

interface Enquiry {
  id: string
  subject: string
  question: string
  category: "legal" | "technical" | "financial" | "environmental" | "planning"
  priority: "low" | "medium" | "high" | "critical"
  status: "pending" | "answered" | "follow-up-required"
  dateSent: string
  dateAnswered?: string
  response?: string
  daysOverdue: number
}

export default function SellerConveyancerEnquiriesPage() {
  const { updates, sendUpdate } = useRealTime()
  const { toast } = useToast()

  const [enquiries, setEnquiries] = useState<Enquiry[]>([
    {
      id: "enq-001",
      subject: "Boundary Disputes",
      question: "Please confirm there have been no boundary disputes with neighboring properties in the last 10 years.",
      category: "legal",
      priority: "high",
      status: "pending",
      dateSent: "2024-03-20",
      daysOverdue: 6,
    },
    {
      id: "enq-002",
      subject: "Building Warranties",
      question: "Please provide details of any building warranties or guarantees that will transfer to the buyer.",
      category: "technical",
      priority: "medium",
      status: "pending",
      dateSent: "2024-03-19",
      daysOverdue: 7,
    },
    {
      id: "enq-003",
      subject: "Service Charges",
      question: "Please confirm the current service charge amounts and any planned increases.",
      category: "financial",
      priority: "medium",
      status: "pending",
      dateSent: "2024-03-18",
      daysOverdue: 8,
    },
    {
      id: "enq-004",
      subject: "Planning Applications",
      question: "Are there any current or pending planning applications affecting the property?",
      category: "planning",
      priority: "high",
      status: "answered",
      dateSent: "2024-03-15",
      dateAnswered: "2024-03-21",
      response: "No planning applications submitted or pending for the property.",
      daysOverdue: 0,
    },
    {
      id: "enq-005",
      subject: "Utilities and Services",
      question: "Please confirm all utilities are connected and in working order.",
      category: "technical",
      priority: "medium",
      status: "answered",
      dateSent: "2024-03-14",
      dateAnswered: "2024-03-20",
      response: "All utilities connected and in working order. No known issues.",
      daysOverdue: 0,
    },
    {
      id: "enq-006",
      subject: "Environmental Issues",
      question: "Are there any known environmental issues or contamination concerns?",
      category: "environmental",
      priority: "high",
      status: "answered",
      dateSent: "2024-03-13",
      dateAnswered: "2024-03-19",
      response: "No known environmental issues. Environmental search report attached.",
      daysOverdue: 0,
    },
    {
      id: "enq-007",
      subject: "Alterations and Extensions",
      question: "Please provide details of any alterations or extensions made to the property.",
      category: "technical",
      priority: "medium",
      status: "answered",
      dateSent: "2024-03-12",
      dateAnswered: "2024-03-18",
      response:
        "Kitchen extension completed in 2019 with proper planning permission and building regulations approval.",
      daysOverdue: 0,
    },
    {
      id: "enq-008",
      subject: "Parking Rights",
      question: "Please confirm parking arrangements and any allocated parking spaces.",
      category: "legal",
      priority: "low",
      status: "answered",
      dateSent: "2024-03-11",
      dateAnswered: "2024-03-17",
      response: "Two allocated parking spaces included in the sale. Parking permits not required.",
      daysOverdue: 0,
    },
    {
      id: "enq-009",
      subject: "Heating System",
      question: "Please provide details of the heating system and any recent servicing.",
      category: "technical",
      priority: "medium",
      status: "answered",
      dateSent: "2024-03-10",
      dateAnswered: "2024-03-16",
      response: "Gas central heating system installed 2020. Annual service completed February 2024.",
      daysOverdue: 0,
    },
    {
      id: "enq-010",
      subject: "Insurance Claims",
      question: "Have there been any insurance claims made on the property in the last 5 years?",
      category: "financial",
      priority: "medium",
      status: "answered",
      dateSent: "2024-03-09",
      dateAnswered: "2024-03-15",
      response: "No insurance claims made in the last 5 years.",
      daysOverdue: 0,
    },
    {
      id: "enq-011",
      subject: "Roof Condition",
      question: "Please provide details of roof condition and any recent repairs or maintenance.",
      category: "technical",
      priority: "high",
      status: "answered",
      dateSent: "2024-03-08",
      dateAnswered: "2024-03-14",
      response: "Roof inspected and minor repairs completed in 2023. Full roof survey available.",
      daysOverdue: 0,
    },
    {
      id: "enq-012",
      subject: "Neighbor Disputes",
      question: "Have there been any disputes or issues with neighboring properties?",
      category: "legal",
      priority: "medium",
      status: "pending",
      dateSent: "2024-03-07",
      daysOverdue: 19,
    },
  ])

  const [selectedEnquiry, setSelectedEnquiry] = useState<string | null>(null)
  const [response, setResponse] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Listen for real-time updates from buyer conveyancer
  useEffect(() => {
    const enquiryUpdates = updates.filter(
      (update) =>
        update.stage === "enquiries" && (update.type === "enquiry_sent" || update.type === "enquiry_follow_up"),
    )

    enquiryUpdates.forEach((update) => {
      if (update.type === "enquiry_sent" && update.data?.enquiry) {
        const newEnquiry = update.data.enquiry
        setEnquiries((prev) => {
          const exists = prev.find((e) => e.id === newEnquiry.id)
          if (!exists) {
            toast({
              title: "New Enquiry Received! 📨",
              description: `New enquiry: ${newEnquiry.subject}`,
            })
            return [...prev, newEnquiry]
          }
          return prev
        })
      }

      if (update.type === "enquiry_follow_up") {
        toast({
          title: "Follow-up Received! 📞",
          description: "Buyer conveyancer sent a follow-up reminder",
        })
      }
    })
  }, [updates, toast])

  // Calculate dynamic stats
  const totalEnquiries = enquiries.length
  const answeredEnquiries = enquiries.filter((e) => e.status === "answered").length
  const pendingEnquiries = enquiries.filter((e) => e.status === "pending").length
  const overdueEnquiries = enquiries.filter((e) => e.status === "pending" && e.daysOverdue > 5).length
  const highPriorityPending = enquiries.filter(
    (e) => e.status === "pending" && (e.priority === "high" || e.priority === "critical"),
  ).length

  const handleSendResponse = async (enquiryId: string) => {
    if (!response.trim()) return

    setIsSubmitting(true)

    // Simulate sending response
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const currentDate = new Date().toISOString().split("T")[0]

    setEnquiries((prev) =>
      prev.map((e) =>
        e.id === enquiryId
          ? {
              ...e,
              status: "answered" as const,
              response: response,
              dateAnswered: currentDate,
              daysOverdue: 0,
            }
          : e,
      ),
    )

    // Send real-time update to buyer conveyancer
    sendUpdate({
      type: "enquiry_answered",
      stage: "enquiries",
      role: "seller-conveyancer",
      title: "Enquiry Answered",
      description: `Response sent for enquiry`,
      data: { enquiryId, response, dateAnswered: currentDate },
    })

    setResponse("")
    setSelectedEnquiry(null)
    setIsSubmitting(false)

    toast({
      title: "Response Sent! ✅",
      description: "Your response has been sent to the buyer's conveyancer",
    })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "text-red-600 bg-red-50 border-red-200"
      case "high":
        return "text-orange-600 bg-orange-50 border-orange-200"
      case "medium":
        return "text-blue-600 bg-blue-50 border-blue-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "legal":
        return "⚖️"
      case "technical":
        return "🔧"
      case "financial":
        return "💰"
      case "environmental":
        return "🌱"
      case "planning":
        return "📋"
      default:
        return "📄"
    }
  }

  const responseTemplates = [
    {
      title: "Boundary Confirmation",
      content:
        "The property boundaries are clearly defined as shown on the title plan. There have been no boundary disputes with neighboring properties.",
    },
    {
      title: "No Issues Standard",
      content:
        "We can confirm there are no known issues regarding this matter. All relevant documentation is available for review.",
    },
    {
      title: "Documentation Available",
      content:
        "The requested documentation is available and will be provided separately. Please let us know if you require any additional information.",
    },
    {
      title: "Client Consultation Required",
      content:
        "We will need to consult with our client regarding this matter and will provide a response within 3 working days.",
    },
  ]

  return (
    <TransactionLayout title="Contract Enquiries" stage="enquiries" userRole="seller-conveyancer">
      <div className="space-y-6">
        {/* Interactive Enquiries Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Enquiries Overview
            </CardTitle>
            <CardDescription>Click on any status to view and manage enquiries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {/* Total Enquiries - Interactive */}
              <Dialog>
                <DialogTrigger asChild>
                  <div className="text-center p-4 bg-blue-50 border-2 border-blue-200 rounded-lg cursor-pointer hover:shadow-lg hover:border-blue-300 transition-all">
                    <div className="text-3xl font-bold text-blue-600">{totalEnquiries}</div>
                    <div className="text-sm text-blue-800 mb-2">Total Enquiries</div>
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      View All
                    </Button>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>All Enquiries ({totalEnquiries})</DialogTitle>
                    <DialogDescription>
                      Complete list of all enquiries received from buyer's conveyancer
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3">
                    {enquiries.map((enquiry) => (
                      <div key={enquiry.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{getCategoryIcon(enquiry.category)}</span>
                            <h4 className="font-medium">{enquiry.subject}</h4>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getPriorityColor(enquiry.priority)}>{enquiry.priority}</Badge>
                            <Badge variant={enquiry.status === "answered" ? "default" : "secondary"}>
                              {enquiry.status}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{enquiry.question}</p>
                        {enquiry.response ? (
                          <div className="bg-green-50 border border-green-200 rounded p-3 mt-2">
                            <p className="text-sm text-green-800 font-medium">Your Response:</p>
                            <p className="text-sm text-green-700 mt-1">{enquiry.response}</p>
                            <p className="text-xs text-green-600 mt-1">Sent: {enquiry.dateAnswered}</p>
                          </div>
                        ) : (
                          <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mt-2">
                            <p className="text-sm text-yellow-800">Response required</p>
                          </div>
                        )}
                        <div className="flex items-center justify-between mt-3">
                          <p className="text-xs text-muted-foreground">Received: {enquiry.dateSent}</p>
                          {enquiry.status === "pending" && (
                            <Button size="sm" onClick={() => setSelectedEnquiry(enquiry.id)}>
                              <Reply className="h-3 w-3 mr-1" />
                              Respond
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>

              {/* Pending Response - Interactive */}
              <Dialog>
                <DialogTrigger asChild>
                  <div className="text-center p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg cursor-pointer hover:shadow-lg hover:border-yellow-300 transition-all">
                    <div className="text-3xl font-bold text-yellow-600">{pendingEnquiries}</div>
                    <div className="text-sm text-yellow-800 mb-2">Pending Response</div>
                    <Button size="sm" variant="outline">
                      <Clock className="h-3 w-3 mr-1" />
                      View Pending
                    </Button>
                    {overdueEnquiries > 0 && (
                      <div className="text-xs text-red-600 mt-1">{overdueEnquiries} overdue</div>
                    )}
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Pending Responses ({pendingEnquiries})</DialogTitle>
                    <DialogDescription>Enquiries requiring your response</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3">
                    {enquiries
                      .filter((e) => e.status === "pending")
                      .map((enquiry) => (
                        <div
                          key={enquiry.id}
                          className={`border rounded-lg p-4 ${enquiry.daysOverdue > 5 ? "bg-red-50 border-red-200" : "bg-yellow-50"}`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{getCategoryIcon(enquiry.category)}</span>
                              <h4 className="font-medium">{enquiry.subject}</h4>
                              {enquiry.daysOverdue > 5 && <AlertTriangle className="h-4 w-4 text-red-500" />}
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getPriorityColor(enquiry.priority)}>{enquiry.priority}</Badge>
                              <Badge variant="secondary">Pending</Badge>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{enquiry.question}</p>
                          <div className="flex items-center justify-between mt-3">
                            <div>
                              <p className="text-xs text-muted-foreground">Received: {enquiry.dateSent}</p>
                              {enquiry.daysOverdue > 0 && (
                                <p
                                  className={`text-xs ${enquiry.daysOverdue > 5 ? "text-red-600" : "text-yellow-600"}`}
                                >
                                  {enquiry.daysOverdue} days overdue
                                </p>
                              )}
                            </div>
                            <Button size="sm" onClick={() => setSelectedEnquiry(enquiry.id)}>
                              <Reply className="h-3 w-3 mr-1" />
                              Respond Now
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </DialogContent>
              </Dialog>

              {/* Answered - Interactive */}
              <Dialog>
                <DialogTrigger asChild>
                  <div className="text-center p-4 bg-green-50 border-2 border-green-200 rounded-lg cursor-pointer hover:shadow-lg hover:border-green-300 transition-all">
                    <div className="text-3xl font-bold text-green-600">{answeredEnquiries}</div>
                    <div className="text-sm text-green-800 mb-2">Answered</div>
                    <Button size="sm" variant="outline">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      View Responses
                    </Button>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Answered Enquiries ({answeredEnquiries})</DialogTitle>
                    <DialogDescription>Enquiries you have responded to</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3">
                    {enquiries
                      .filter((e) => e.status === "answered")
                      .map((enquiry) => (
                        <div key={enquiry.id} className="border rounded-lg p-4 bg-green-50">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{getCategoryIcon(enquiry.category)}</span>
                              <h4 className="font-medium">{enquiry.subject}</h4>
                            </div>
                            <Badge className="bg-green-100 text-green-800">Answered</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{enquiry.question}</p>
                          <div className="bg-white border border-green-200 rounded p-3">
                            <p className="text-sm text-green-800 font-medium">Your Response:</p>
                            <p className="text-sm text-green-700 mt-1">{enquiry.response}</p>
                            <p className="text-xs text-green-600 mt-2">Sent: {enquiry.dateAnswered}</p>
                          </div>
                          <div className="flex items-center justify-between mt-3">
                            <p className="text-xs text-muted-foreground">Received: {enquiry.dateSent}</p>
                            <Button size="sm" variant="outline">
                              <FileText className="h-3 w-3 mr-1" />
                              Export
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </DialogContent>
              </Dialog>

              {/* High Priority - Interactive */}
              <Dialog>
                <DialogTrigger asChild>
                  <div className="text-center p-4 bg-red-50 border-2 border-red-200 rounded-lg cursor-pointer hover:shadow-lg hover:border-red-300 transition-all">
                    <div className="text-3xl font-bold text-red-600">{highPriorityPending}</div>
                    <div className="text-sm text-red-800 mb-2">High Priority</div>
                    <Button size="sm" variant="outline">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      View Urgent
                    </Button>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>High Priority Enquiries ({highPriorityPending})</DialogTitle>
                    <DialogDescription>Urgent enquiries requiring immediate attention</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3">
                    {enquiries
                      .filter((e) => e.status === "pending" && (e.priority === "high" || e.priority === "critical"))
                      .map((enquiry) => (
                        <div key={enquiry.id} className="border rounded-lg p-4 bg-red-50 border-red-200">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{getCategoryIcon(enquiry.category)}</span>
                              <h4 className="font-medium">{enquiry.subject}</h4>
                              <AlertTriangle className="h-4 w-4 text-red-500" />
                            </div>
                            <Badge className={getPriorityColor(enquiry.priority)}>{enquiry.priority}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{enquiry.question}</p>
                          <div className="flex items-center justify-between mt-3">
                            <div>
                              <p className="text-xs text-muted-foreground">Received: {enquiry.dateSent}</p>
                              <p className="text-xs text-red-600">{enquiry.daysOverdue} days overdue</p>
                            </div>
                            <Button
                              size="sm"
                              className="bg-red-600 hover:bg-red-700"
                              onClick={() => setSelectedEnquiry(enquiry.id)}
                            >
                              <Reply className="h-3 w-3 mr-1" />
                              Respond Urgently
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div
                className="bg-green-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(answeredEnquiries / totalEnquiries) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-center text-muted-foreground">
              {Math.round((answeredEnquiries / totalEnquiries) * 100)}% of enquiries answered
            </p>
          </CardContent>
        </Card>

        {/* Quick Response Interface */}
        {selectedEnquiry && (
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle>Respond to Enquiry</CardTitle>
              <CardDescription>{enquiries.find((e) => e.id === selectedEnquiry)?.subject}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white border rounded p-3">
                <p className="text-sm font-medium mb-1">Question:</p>
                <p className="text-sm text-muted-foreground">
                  {enquiries.find((e) => e.id === selectedEnquiry)?.question}
                </p>
              </div>

              <div>
                <Label htmlFor="response">Your Response</Label>
                <Textarea
                  id="response"
                  placeholder="Type your response to this enquiry..."
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  rows={4}
                  className="mt-2"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={() => handleSendResponse(selectedEnquiry)} disabled={!response.trim() || isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Response
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={() => setSelectedEnquiry(null)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Response Templates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Response Templates
            </CardTitle>
            <CardDescription>Quick response templates for common enquiries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {responseTemplates.map((template, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto p-4 text-left justify-start"
                  onClick={() => setResponse(template.content)}
                >
                  <div>
                    <div className="font-medium">{template.title}</div>
                    <div className="text-sm text-gray-600 mt-1">{template.content.substring(0, 60)}...</div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Enquiries Management Tabs */}
        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending">Pending ({pendingEnquiries})</TabsTrigger>
            <TabsTrigger value="answered">Answered ({answeredEnquiries})</TabsTrigger>
            <TabsTrigger value="all">All Enquiries</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {enquiries
              .filter((e) => e.status === "pending")
              .map((enquiry) => (
                <Card key={enquiry.id} className="border-l-4 border-l-yellow-500">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{enquiry.subject}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(enquiry.priority)}>{enquiry.priority} priority</Badge>
                        <Badge variant="secondary">
                          <Clock className="h-3 w-3 mr-1" />
                          Pending
                        </Badge>
                      </div>
                    </div>
                    <CardDescription>Received: {new Date(enquiry.dateSent).toLocaleDateString()}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm">{enquiry.question}</p>
                    </div>

                    {selectedEnquiry === enquiry.id ? (
                      <div className="space-y-3">
                        <Label htmlFor={`response-${enquiry.id}`}>Your Response</Label>
                        <Textarea
                          id={`response-${enquiry.id}`}
                          placeholder="Type your response to this enquiry..."
                          value={response}
                          onChange={(e) => setResponse(e.target.value)}
                          rows={4}
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleSendResponse(enquiry.id)}
                            disabled={!response.trim() || isSubmitting}
                          >
                            {isSubmitting ? (
                              <>
                                <Clock className="h-4 w-4 mr-2 animate-spin" />
                                Sending...
                              </>
                            ) : (
                              <>
                                <Send className="h-4 w-4 mr-2" />
                                Send Response
                              </>
                            )}
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => setSelectedEnquiry(null)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button variant="outline" size="sm" onClick={() => setSelectedEnquiry(enquiry.id)}>
                        Respond to Enquiry
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
          </TabsContent>

          <TabsContent value="answered" className="space-y-4">
            {enquiries
              .filter((e) => e.status === "answered")
              .map((enquiry) => (
                <Card key={enquiry.id} className="border-l-4 border-l-green-500">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{enquiry.subject}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(enquiry.priority)}>{enquiry.priority} priority</Badge>
                        <Badge variant="default">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Answered
                        </Badge>
                      </div>
                    </div>
                    <CardDescription>
                      Received: {new Date(enquiry.dateSent).toLocaleDateString()} | Answered:{" "}
                      {enquiry.dateAnswered && new Date(enquiry.dateAnswered).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="p-3 bg-gray-50 rounded-lg mb-3">
                      <p className="text-sm">{enquiry.question}</p>
                    </div>
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm font-medium text-green-800 mb-1">Your Response:</p>
                      <p className="text-sm text-green-700">{enquiry.response}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            {enquiries.map((enquiry) => (
              <Card
                key={enquiry.id}
                className={`border-l-4 ${enquiry.status === "answered" ? "border-l-green-500" : "border-l-yellow-500"}`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{enquiry.subject}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(enquiry.priority)}>{enquiry.priority} priority</Badge>
                      <Badge variant={enquiry.status === "answered" ? "default" : "secondary"}>
                        {enquiry.status === "answered" ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Answered
                          </>
                        ) : (
                          <>
                            <Clock className="h-3 w-3 mr-1" />
                            Pending
                          </>
                        )}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription>
                    Received: {new Date(enquiry.dateSent).toLocaleDateString()}
                    {enquiry.dateAnswered && ` | Answered: ${new Date(enquiry.dateAnswered).toLocaleDateString()}`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm">{enquiry.question}</p>
                  </div>
                  {enquiry.response && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg mt-3">
                      <p className="text-sm font-medium text-green-800 mb-1">Your Response:</p>
                      <p className="text-sm text-green-700">{enquiry.response}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        {/* Important Notes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              Important Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="font-medium text-amber-800">Response Timeframe</p>
                <p className="text-amber-700">
                  Aim to respond to all enquiries within 5 working days to avoid delays in the transaction.
                </p>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="font-medium text-blue-800">Client Consultation</p>
                <p className="text-blue-700">
                  Some enquiries may require consultation with your client before responding. Factor this into your
                  response time.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TransactionLayout>
  )
}
