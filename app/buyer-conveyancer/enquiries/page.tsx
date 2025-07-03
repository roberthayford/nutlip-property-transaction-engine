"use client"

import { useEffect, useRef, useState } from "react"
import TransactionLayout from "@/components/transaction-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, Clock, CheckCircle, AlertTriangle, Send, RefreshCcw, ArrowRight } from "lucide-react"
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

export default function BuyerConveyancerEnquiriesPage() {
  const { updates, markAsRead, sendUpdate } = useRealTime()
  const { toast } = useToast()

  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const processedIds = useRef<Set<string>>(new Set())

  const [subject, setSubject] = useState("")
  const [question, setQuestion] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isContinuing, setIsContinuing] = useState(false)

  // Listen for platform reset events
  useEffect(() => {
    const handlePlatformReset = () => {
      console.log("Buyer conveyancer enquiries: Platform reset detected, clearing enquiries")
      setEnquiries([])
      setSubject("")
      setQuestion("")
      processedIds.current.clear()
      toast({
        title: "Demo Reset! 🔄",
        description: "All enquiries have been cleared",
      })
    }

    window.addEventListener("platform-reset", handlePlatformReset)
    return () => window.removeEventListener("platform-reset", handlePlatformReset)
  }, [toast])

  // Listen for real-time updates - especially enquiry responses
  useEffect(() => {
    if (!updates.length) return

    const toMark: string[] = []

    updates.forEach((update) => {
      // Skip if already processed
      if (processedIds.current.has(update.id) || update.stage !== "enquiries") {
        return
      }

      processedIds.current.add(update.id)
      toMark.push(update.id)

      // Handle enquiry answered - THIS IS THE CRITICAL PART
      if (update.type === "enquiry_answered" && update.role === "seller-conveyancer" && update.data?.enquiryId) {
        const { enquiryId, response, dateAnswered, subject: responseSubject } = update.data as any

        console.log("Buyer received response for enquiry:", enquiryId, "Response:", response) // Debug log

        setEnquiries((prev) => {
          const updated = prev.map((enq) =>
            enq.id === enquiryId
              ? {
                  ...enq,
                  status: "answered" as const,
                  response,
                  dateAnswered,
                }
              : enq,
          )

          console.log("Updated enquiries:", updated) // Debug log
          return updated
        })

        toast({
          title: "Enquiry Answered! ✅",
          description: `Response received for "${responseSubject || "your enquiry"}"`,
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

  // Send a new enquiry
  const handleSendEnquiry = async () => {
    if (!subject.trim() || !question.trim()) return
    setIsSubmitting(true)

    // Simulate sending
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newEnquiry: Enquiry = {
      id: `enq-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Unique ID
      subject,
      question,
      category: "legal",
      priority: "medium",
      status: "pending",
      dateSent: new Date().toISOString().split("T")[0],
    }

    console.log("Buyer sending enquiry:", newEnquiry) // Debug log

    // Update own state immediately
    setEnquiries((prev) => [newEnquiry, ...prev])

    // Broadcast to seller conveyancer
    sendUpdate({
      type: "enquiry_sent",
      stage: "enquiries",
      role: "buyer-conveyancer",
      title: "New Enquiry Sent",
      description: newEnquiry.subject,
      data: { enquiry: newEnquiry },
    })

    console.log("Enquiry update sent to seller conveyancer") // Debug log

    // Feedback
    toast({ title: "Enquiry Sent 📨", description: subject })

    // Reset form
    setSubject("")
    setQuestion("")
    setIsSubmitting(false)
  }

  const handleContinueToMortgageOffer = async () => {
    setIsContinuing(true)

    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Send real-time update to notify all parties that enquiries stage is completed
    sendUpdate({
      type: "stage_completed",
      stage: "enquiries",
      role: "buyer-conveyancer",
      title: "Enquiries Stage Completed",
      description:
        "All pre-contract enquiries have been resolved and the transaction is progressing to mortgage offer stage",
      data: {
        stage: "enquiries",
        status: "completed",
        completedAt: new Date().toISOString(),
        totalEnquiries: enquiries.length,
        answeredEnquiries: enquiries.filter((e) => e.status === "answered").length,
        nextStage: "mortgage-offer",
      },
    })

    toast({
      title: "Enquiries Completed! ✅",
      description: "All parties have been notified. Proceeding to mortgage offer stage.",
    })

    setIsContinuing(false)

    // Navigate to mortgage offer page
    window.location.href = "/buyer-conveyancer/mortgage-offer"
  }

  const total = enquiries.length
  const answered = enquiries.filter((e) => e.status === "answered").length
  const pending = total - answered

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

  return (
    <TransactionLayout
      currentStage="enquiries"
      userRole="buyer-conveyancer"
      title="Pre-Contract Enquiries"
      description="Draft and track enquiries sent to the seller's conveyancer"
    >
      <div className="space-y-6">
        {/* Compose new enquiry */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              New Enquiry
            </CardTitle>
            <CardDescription>Send a new enquiry to the seller's conveyancer</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Textarea
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                rows={1}
                className="mt-1"
                placeholder="Short summary of your enquiry"
              />
            </div>
            <div>
              <Label htmlFor="question">Question</Label>
              <Textarea
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                rows={4}
                className="mt-1"
                placeholder="Provide full details of your enquiry"
              />
            </div>
            <Button onClick={handleSendEnquiry} disabled={isSubmitting || !subject.trim() || !question.trim()}>
              {isSubmitting ? (
                <>
                  <RefreshCcw className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Enquiry
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Enquiries Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Enquiries Status
            </CardTitle>
            <CardDescription>
              {total === 0 ? "No enquiries sent yet." : "Track the status of your enquiries"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-4 border rounded bg-blue-50">
                <div className="text-3xl font-bold text-blue-600">{total}</div>
                <p className="text-sm text-blue-800">Total Sent</p>
              </div>
              <div className="p-4 border rounded bg-yellow-50">
                <div className="text-3xl font-bold text-yellow-600">{pending}</div>
                <p className="text-sm text-yellow-800">Pending Response</p>
              </div>
              <div className="p-4 border rounded bg-green-50">
                <div className="text-3xl font-bold text-green-600">{answered}</div>
                <p className="text-sm text-green-800">Answered</p>
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

        {/* Recently Answered Enquiries */}
        {answered > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Recently Answered Enquiries
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {enquiries
                .filter((e) => e.status === "answered")
                .slice(0, 3)
                .map((enquiry) => (
                  <div key={enquiry.id} className="border-l-4 border-green-400 pl-4 py-3 bg-green-50 rounded">
                    <h4 className="font-medium text-sm">{enquiry.subject}</h4>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{enquiry.response}</p>
                    <p className="text-xs text-muted-foreground">Answered: {enquiry.dateAnswered}</p>
                  </div>
                ))}
            </CardContent>
          </Card>
        )}

        {/* Tabs list */}
        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending">Pending ({pending})</TabsTrigger>
            <TabsTrigger value="answered">Answered ({answered})</TabsTrigger>
            <TabsTrigger value="all">All ({total})</TabsTrigger>
          </TabsList>

          {/* Pending tab */}
          <TabsContent value="pending" className="space-y-4">
            {pending === 0 ? (
              <div className="text-center py-10">
                <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No pending enquiries.</p>
                <p className="text-sm text-gray-400 mt-2">
                  All enquiries have been answered or none have been sent yet.
                </p>
              </div>
            ) : (
              enquiries
                .filter((e) => e.status === "pending")
                .map((e) => (
                  <Card key={e.id} className="border-l-4 border-yellow-500">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{e.subject}</CardTitle>
                        <Badge className={getPriorityColor(e.priority)}>{e.priority} priority</Badge>
                      </div>
                      <CardDescription>Sent: {new Date(e.dateSent).toLocaleDateString()}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{e.question}</p>
                      <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                        <p className="text-sm text-yellow-800">⏳ Awaiting response from seller's conveyancer</p>
                      </div>
                    </CardContent>
                  </Card>
                ))
            )}
          </TabsContent>

          {/* Answered tab */}
          <TabsContent value="answered" className="space-y-4">
            {answered === 0 ? (
              <div className="text-center py-10">
                <CheckCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No answered enquiries yet.</p>
                <p className="text-sm text-gray-400 mt-2">
                  Responses will appear here when the seller's conveyancer replies.
                </p>
              </div>
            ) : (
              enquiries
                .filter((e) => e.status === "answered")
                .map((e) => (
                  <Card key={e.id} className="border-l-4 border-green-500">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{e.subject}</CardTitle>
                        <Badge className="bg-green-100 text-green-800">Answered</Badge>
                      </div>
                      <CardDescription>
                        Sent: {new Date(e.dateSent).toLocaleDateString()} | Answered:{" "}
                        {e.dateAnswered && new Date(e.dateAnswered).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="p-3 bg-gray-50 rounded">
                        <p className="text-sm font-medium mb-1">Your Question:</p>
                        <p className="text-sm">{e.question}</p>
                      </div>
                      <div className="p-3 bg-green-50 border border-green-200 rounded">
                        <p className="text-sm font-medium text-green-800 mb-1">Response:</p>
                        <p className="text-sm text-green-700">{e.response}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))
            )}
          </TabsContent>

          {/* All tab */}
          <TabsContent value="all" className="space-y-4">
            {total === 0 ? (
              <div className="text-center py-10">
                <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No enquiries yet.</p>
                <p className="text-sm text-gray-400 mt-2">Use the form above to send your first enquiry.</p>
              </div>
            ) : (
              enquiries.map((e) => (
                <Card
                  key={e.id}
                  className={`border-l-4 ${e.status === "answered" ? "border-green-500" : "border-yellow-500"}`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{e.subject}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(e.priority)}>{e.priority} priority</Badge>
                        <Badge variant={e.status === "answered" ? "default" : "secondary"}>
                          {e.status === "answered" ? (
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
                      Sent: {new Date(e.dateSent).toLocaleDateString()}
                      {e.dateAnswered && ` | Answered: ${new Date(e.dateAnswered).toLocaleDateString()}`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 bg-gray-50 rounded">
                      <p className="text-sm font-medium mb-1">Your Question:</p>
                      <p className="text-sm">{e.question}</p>
                    </div>
                    {e.response && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded">
                        <p className="text-sm font-medium text-green-800 mb-1">Response:</p>
                        <p className="text-sm text-green-700">{e.response}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button onClick={handleContinueToMortgageOffer} disabled={pending > 0 || isContinuing} className="flex-1">
            {isContinuing ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Completing Stage...
              </>
            ) : (
              <>
                <ArrowRight className="h-4 w-4 mr-2" />
                Continue to Mortgage Offer
              </>
            )}
          </Button>
        </div>

        {pending > 0 && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              <strong>Note:</strong> You have {pending} pending enquiries. All enquiries must be resolved before
              proceeding to the mortgage offer stage.
            </p>
          </div>
        )}

        {/* Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 text-sm space-y-2">
              <li>Provide clear, concise questions to speed up the seller's reply.</li>
              <li>Use follow-ups sparingly to avoid notification fatigue.</li>
              <li>Responses typically arrive within 5 working days.</li>
              <li>Check the browser console for debug logs if testing the real-time functionality.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </TransactionLayout>
  )
}
