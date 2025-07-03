"use client"

import { useEffect, useRef, useState } from "react"
import TransactionLayout from "@/components/transaction-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { MessageSquare, Clock, CheckCircle, AlertTriangle, FileText, Send, TestTube } from "lucide-react"
import { useRealTime } from "@/contexts/real-time-context"
import { useToast } from "@/hooks/use-toast"

interface Enquiry {
  id: string
  subject: string
  question: string
  category: "legal" | "technical" | "financial" | "environmental" | "planning"
  priority: "low" | "medium" | "high" | "critical"
  status: "pending" | "answered"
  dateSent: string
  dateAnswered?: string
  response?: string
}

export default function SellerConveyancerEnquiriesPage() {
  const { updates, markAsRead, sendUpdate } = useRealTime()
  const { toast } = useToast()

  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const processedIds = useRef<Set<string>>(new Set())
  const [selectedEnquiry, setSelectedEnquiry] = useState<string | null>(null)
  const [response, setResponse] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Listen for platform reset events
  useEffect(() => {
    const handlePlatformReset = () => {
      console.log("Seller conveyancer enquiries: Platform reset detected, clearing enquiries")
      setEnquiries([])
      setSelectedEnquiry(null)
      setResponse("")
      processedIds.current.clear()
      toast({
        title: "Demo Reset! 🔄",
        description: "All enquiries have been cleared",
      })
    }

    window.addEventListener("platform-reset", handlePlatformReset)
    return () => window.removeEventListener("platform-reset", handlePlatformReset)
  }, [toast])

  // Listen for incoming enquiries from buyer conveyancer
  useEffect(() => {
    if (!updates.length) return

    const toMark: string[] = []

    updates.forEach((u) => {
      // Only process enquiry_sent updates that we haven't seen before
      if (
        processedIds.current.has(u.id) ||
        u.stage !== "enquiries" ||
        u.type !== "enquiry_sent" ||
        u.role !== "buyer-conveyancer"
      )
        return

      processedIds.current.add(u.id)
      toMark.push(u.id)

      if (u.data?.enquiry) {
        const newEnquiry = u.data.enquiry as Enquiry
        console.log("Seller received enquiry:", newEnquiry) // Debug log

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
    })

    // Mark updates as read after processing
    if (toMark.length) {
      setTimeout(() => {
        toMark.forEach((id) => markAsRead(id))
      }, 0)
    }
  }, [updates, toast, markAsRead])

  const total = enquiries.length
  const answered = enquiries.filter((e) => e.status === "answered").length
  const pending = total - answered

  const handleSendResponse = async (enquiryId: string) => {
    if (!response.trim()) return

    setIsSubmitting(true)

    // Simulate sending response
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const currentDate = new Date().toISOString().split("T")[0]
    const enquiry = enquiries.find((e) => e.id === enquiryId)

    console.log("Sending response for enquiry:", enquiryId, "Response:", response) // Debug log

    // Update local state first
    setEnquiries((prev) =>
      prev.map((e) =>
        e.id === enquiryId
          ? {
              ...e,
              status: "answered" as const,
              response: response,
              dateAnswered: currentDate,
            }
          : e,
      ),
    )

    // Send real-time update to buyer conveyancer
    sendUpdate({
      type: "enquiry_answered",
      stage: "enquiries",
      role: "seller-conveyancer",
      title: "Enquiry Response Sent",
      description: `Response provided for enquiry: ${enquiry?.subject || enquiryId}`,
      data: {
        enquiryId,
        response,
        dateAnswered: currentDate,
        subject: enquiry?.subject,
      },
    })

    console.log("Response update sent to buyer conveyancer") // Debug log

    setResponse("")
    setSelectedEnquiry(null)
    setIsSubmitting(false)

    toast({
      title: "Response Sent! ✅",
      description: "Your response has been sent to the buyer's conveyancer",
    })
  }

  // Test function to create a sample enquiry
  const handleCreateTestEnquiry = () => {
    const testEnquiry: Enquiry = {
      id: `test-enq-${Date.now()}`,
      subject: "Test Boundary Question",
      question: "Can you confirm the exact boundaries of the property as shown on the title plan?",
      category: "legal",
      priority: "medium",
      status: "pending",
      dateSent: new Date().toISOString().split("T")[0],
    }

    setEnquiries((prev) => [...prev, testEnquiry])

    toast({
      title: "Test Enquiry Created! 🧪",
      description: "You can now respond to this test enquiry",
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
    <TransactionLayout
      currentStage="enquiries"
      userRole="seller-conveyancer"
      title="Incoming Enquiries"
      description="View and respond to enquiries from the buyer's conveyancer"
    >
      <div className="space-y-6">
        {/* Test Controls */}
        <Card className="border-purple-200 bg-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="h-5 w-5 text-purple-600" />
              Test Controls
            </CardTitle>
            <CardDescription>Use these controls to test the enquiry system</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleCreateTestEnquiry} variant="outline" className="mr-4 bg-transparent">
              <TestTube className="h-4 w-4 mr-2" />
              Create Test Enquiry
            </Button>
            <span className="text-sm text-muted-foreground">This will create a test enquiry you can respond to</span>
          </CardContent>
        </Card>

        {/* Interactive Enquiries Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Enquiries Overview
            </CardTitle>
            <CardDescription>
              {total === 0 ? "No enquiries received yet." : "Click the box to view all enquiries"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Total Enquiries */}
              <Dialog>
                <DialogTrigger asChild>
                  <div className="cursor-pointer text-center p-6 border-2 rounded-lg hover:shadow-md bg-blue-50 border-blue-200 hover:border-blue-300 transition-all">
                    <div className="text-4xl font-bold text-blue-600">{total}</div>
                    <div className="text-sm text-blue-800 mb-2">Total Enquiries</div>
                    <Button size="sm" variant="outline">
                      View All
                    </Button>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>All Enquiries ({total})</DialogTitle>
                  </DialogHeader>
                  {total === 0 ? (
                    <p className="text-center py-6 text-muted-foreground">No enquiries yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {enquiries.map((e) => (
                        <div key={e.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{getCategoryIcon(e.category)}</span>
                              <h4 className="font-medium">{e.subject}</h4>
                            </div>
                            <Badge variant={e.status === "answered" ? "default" : "secondary"}>{e.status}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{e.question}</p>
                          {e.response && (
                            <div className="bg-green-50 border border-green-200 rounded p-3 mt-2">
                              <p className="text-sm text-green-800 font-medium">Your Response:</p>
                              <p className="text-sm text-green-700 mt-1">{e.response}</p>
                              <p className="text-xs text-green-600 mt-1">Sent: {e.dateAnswered}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </DialogContent>
              </Dialog>

              {/* Pending Enquiries */}
              <div className="text-center p-6 border-2 rounded-lg bg-yellow-50 border-yellow-200">
                <div className="text-4xl font-bold text-yellow-600">{pending}</div>
                <div className="text-sm text-yellow-800">Pending Response</div>
              </div>

              {/* Answered Enquiries */}
              <div className="text-center p-6 border-2 rounded-lg bg-green-50 border-green-200">
                <div className="text-4xl font-bold text-green-600">{answered}</div>
                <div className="text-sm text-green-800">Answered</div>
              </div>
            </div>

            {/* Progress Bar */}
            {total > 0 && (
              <div className="mt-6">
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div
                    className="bg-green-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${(answered / total) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm text-center text-muted-foreground">
                  {Math.round((answered / total) * 100)}% of enquiries answered
                </p>
              </div>
            )}
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
                  className="h-auto p-4 text-left justify-start bg-transparent"
                  onClick={() => setResponse(template.content)}
                  disabled={!selectedEnquiry}
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
            <TabsTrigger value="pending">Pending ({pending})</TabsTrigger>
            <TabsTrigger value="answered">Answered ({answered})</TabsTrigger>
            <TabsTrigger value="all">All Enquiries</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {pending === 0 ? (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No pending enquiries at the moment.</p>
                <p className="text-sm text-gray-400 mt-2">Use the test button above to create a sample enquiry</p>
              </div>
            ) : (
              enquiries
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
                ))
            )}
          </TabsContent>

          <TabsContent value="answered" className="space-y-4">
            {answered === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No answered enquiries yet.</p>
              </div>
            ) : (
              enquiries
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
                ))
            )}
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            {total === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No enquiries received yet.</p>
              </div>
            ) : (
              enquiries.map((enquiry) => (
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
              ))
            )}
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
