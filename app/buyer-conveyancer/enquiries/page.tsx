"use client"

import type React from "react"

import { useState, useCallback, useEffect, useRef } from "react"
import TransactionLayout from "@/components/transaction-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { MessageSquare, Clock, CheckCircle, Send, Eye, AlertCircle, FileText, ArrowRight } from "lucide-react"
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

export default function BuyerConveyancerEnquiriesPage() {
  const { sendUpdate, updates, markAsRead } = useRealTime()
  const { toast } = useToast()

  const [enquiries, setEnquiries] = useState<Enquiry[]>([
    {
      id: "enq-001",
      subject: "Boundary Disputes",
      question: "Please confirm there have been no boundary disputes with neighboring properties in the last 10 years.",
      category: "legal",
      priority: "high",
      status: "answered",
      dateSent: "2024-03-20",
      dateAnswered: "2024-03-25",
      response: "No boundary disputes have occurred in the last 10 years.",
      daysOverdue: 0,
    },
    {
      id: "enq-002",
      subject: "Building Warranties",
      question: "Please provide details of any building warranties or guarantees that will transfer to the buyer.",
      category: "technical",
      priority: "medium",
      status: "answered",
      dateSent: "2024-03-19",
      dateAnswered: "2024-03-24",
      response: "10-year NHBC warranty valid until 2029. All documentation will be provided at completion.",
      daysOverdue: 0,
    },
    {
      id: "enq-003",
      subject: "Service Charges",
      question: "Please confirm the current service charge amounts and any planned increases.",
      category: "financial",
      priority: "medium",
      status: "answered",
      dateSent: "2024-03-18",
      dateAnswered: "2024-03-23",
      response: "Current service charge is £150/month. No increases planned for next 2 years.",
      daysOverdue: 0,
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
      status: "answered",
      dateSent: "2024-03-07",
      dateAnswered: "2024-03-13",
      response: "No disputes or issues with neighboring properties.",
      daysOverdue: 0,
    },
  ])

  // Keep track of updates we've already handled so we don't process them twice
  const processedUpdateIds = useRef<Set<string>>(new Set())

  const [selectedSubject, setSelectedSubject] = useState("")
  const [selectedPriority, setSelectedPriority] = useState<"low" | "medium" | "high" | "critical">("medium")
  const [newEnquiry, setNewEnquiry] = useState("")

  const handleSubjectChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => setSelectedSubject(e.target.value),
    [],
  )

  const handlePriorityChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) =>
      setSelectedPriority(e.target.value as "low" | "medium" | "high" | "critical"),
    [],
  )

  const handleMessageChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => setNewEnquiry(e.target.value),
    [],
  )

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isContinuing, setIsContinuing] = useState(false)

  // Calculate dynamic stats
  const totalEnquiries = enquiries.length
  const answeredEnquiries = enquiries.filter((e) => e.status === "answered").length
  const pendingEnquiries = enquiries.filter((e) => e.status === "pending").length
  const overdueEnquiries = enquiries.filter((e) => e.status === "pending" && e.daysOverdue > 5).length

  const handleSendEnquiry = async () => {
    if (!newEnquiry.trim() || !selectedSubject) return

    setIsSubmitting(true)

    // Simulate sending enquiry
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newEnquiryObj: Enquiry = {
      id: `enq-${String(enquiries.length + 1).padStart(3, "0")}`,
      subject: selectedSubject,
      question: newEnquiry,
      category: getSubjectCategory(selectedSubject),
      priority: selectedPriority,
      status: "pending",
      dateSent: new Date().toISOString().split("T")[0],
      daysOverdue: 0,
    }

    setEnquiries((prev) => [...prev, newEnquiryObj])
    setNewEnquiry("")
    setSelectedSubject("")
    setSelectedPriority("medium")
    setIsSubmitting(false)

    // Send real-time update
    sendUpdate({
      type: "enquiry_sent",
      stage: "enquiries",
      role: "buyer-conveyancer",
      title: `${selectedPriority.charAt(0).toUpperCase() + selectedPriority.slice(1)} Priority Enquiry Sent`,
      description: `New ${selectedPriority} priority enquiry about "${selectedSubject}" sent to seller's conveyancer`,
      data: { enquiry: newEnquiryObj },
    })

    toast({
      title: "Enquiry Sent! 📤",
      description: `Your ${selectedPriority} priority enquiry about "${selectedSubject}" has been sent`,
    })
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
        totalEnquiries: totalEnquiries,
        answeredEnquiries: answeredEnquiries,
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

  const handleFollowUp = (enquiryId: string) => {
    setEnquiries((prev) => prev.map((e) => (e.id === enquiryId ? { ...e, status: "follow-up-required" as const } : e)))

    sendUpdate({
      type: "enquiry_follow_up",
      stage: "enquiries",
      role: "buyer-conveyancer",
      title: "Follow-up Sent",
      description: `Follow-up sent for enquiry`,
      data: { enquiryId },
    })

    toast({
      title: "Follow-up Sent! 📞",
      description: "Follow-up reminder sent to seller's conveyancer",
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

  const getSubjectCategory = (subject: string): "legal" | "technical" | "financial" | "environmental" | "planning" => {
    const categoryMap: Record<string, "legal" | "technical" | "financial" | "environmental" | "planning"> = {
      "Planning Applications": "planning",
      "Building Regulations": "planning",
      "Conservation Area": "planning",
      "Listed Building": "planning",
      "Tree Preservation": "planning",
      "Utilities and Services": "technical",
      "Heating System": "technical",
      "Electrical Systems": "technical",
      "Plumbing Systems": "technical",
      "Security Systems": "technical",
      "Alterations and Extensions": "technical",
      "Roof Condition": "technical",
      "Structural Issues": "technical",
      "Fire Safety": "technical",
      "Boundary Disputes": "legal",
      "Neighbor Disputes": "legal",
      "Rights of Way": "legal",
      "Parking Rights": "legal",
      "Leasehold Information": "legal",
      "Management Company": "legal",
      "Service Charges": "financial",
      "Ground Rent": "financial",
      "Insurance Claims": "financial",
      "Maintenance History": "financial",
      "Environmental Issues": "environmental",
      "Flooding History": "environmental",
      "Garden/Outdoor Space": "environmental",
      "Building Warranties": "technical",
      "Shared Facilities": "legal",
      Other: "legal",
    }
    return categoryMap[subject] || "legal"
  }

  useEffect(() => {
    if (!updates.length) return

    updates.forEach((update) => {
      // Skip if already handled or not relevant
      if (
        processedUpdateIds.current.has(update.id) ||
        update.stage !== "enquiries" ||
        !["enquiry_sent", "enquiry_follow_up", "enquiry_answered"].includes(update.type)
      ) {
        return
      }

      processedUpdateIds.current.add(update.id)

      // Handle new enquiry sent
      if (update.type === "enquiry_sent" && update.data?.enquiry) {
        const newEnq = update.data.enquiry
        setEnquiries((prev) => {
          if (prev.some((e) => e.id === newEnq.id)) return prev
          toast({ title: "New Enquiry Received! 📨", description: `New enquiry: ${newEnq.subject}` })
          return [...prev, newEnq]
        })
      }

      // Handle follow-up
      if (update.type === "enquiry_follow_up") {
        toast({ title: "Follow-up Received! 📞", description: "Buyer conveyancer sent a follow-up reminder" })
      }

      // Handle enquiry answered
      if (update.type === "enquiry_answered" && update.data?.enquiryId) {
        const { enquiryId, response, dateAnswered } = update.data
        setEnquiries((prev) =>
          prev.map((enq) =>
            enq.id === enquiryId ? { ...enq, status: "answered", response, dateAnswered, daysOverdue: 0 } : enq,
          ),
        )
        toast({ title: "Enquiry Answered! ✅", description: `Response received for enquiry ${enquiryId}` })
      }

      // Remove the update from the shared context so it doesn't trigger again
      markAsRead(update.id)
    })
  }, [updates, toast, markAsRead])

  return (
    <TransactionLayout
      currentStage="enquiries"
      userRole="buyer-conveyancer"
      title="Pre-Contract Enquiries"
      description="Raise and manage pre-contract enquiries with the seller's conveyancer"
    >
      <div className="space-y-6">
        {/* Interactive Enquiries Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Enquiries Status
            </CardTitle>
            <CardDescription>Click on any status to view detailed enquiries</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Total Enquiries - Interactive */}
              <Dialog>
                <DialogTrigger asChild>
                  <div className="text-center p-4 border-2 rounded-lg cursor-pointer hover:shadow-lg hover:border-blue-300 transition-all bg-blue-50">
                    <div className="text-3xl font-bold text-blue-600">{totalEnquiries}</div>
                    <div className="text-sm text-muted-foreground mb-2">Total Enquiries</div>
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      View All
                    </Button>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>All Enquiries ({totalEnquiries})</DialogTitle>
                    <DialogDescription>Complete list of all pre-contract enquiries</DialogDescription>
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
                        {enquiry.response && (
                          <div className="bg-green-50 border border-green-200 rounded p-3 mt-2">
                            <p className="text-sm text-green-800">{enquiry.response}</p>
                            <p className="text-xs text-green-600 mt-1">Answered: {enquiry.dateAnswered}</p>
                          </div>
                        )}
                        <div className="flex items-center justify-between mt-3">
                          <p className="text-xs text-muted-foreground">Sent: {enquiry.dateSent}</p>
                          {enquiry.status === "pending" && (
                            <Button size="sm" variant="outline" onClick={() => handleFollowUp(enquiry.id)}>
                              Send Follow-up
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>

              {/* Answered Enquiries - Interactive */}
              <Dialog>
                <DialogTrigger asChild>
                  <div className="text-center p-4 border-2 rounded-lg cursor-pointer hover:shadow-lg hover:border-green-300 transition-all bg-green-50">
                    <div className="text-3xl font-bold text-green-600">{answeredEnquiries}</div>
                    <div className="text-sm text-muted-foreground mb-2">Answered</div>
                    <Button size="sm" variant="outline">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      View Answers
                    </Button>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Answered Enquiries ({answeredEnquiries})</DialogTitle>
                    <DialogDescription>Enquiries that have received responses</DialogDescription>
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
                            <p className="text-sm text-green-800 font-medium">Response:</p>
                            <p className="text-sm text-green-700 mt-1">{enquiry.response}</p>
                            <p className="text-xs text-green-600 mt-2">Answered: {enquiry.dateAnswered}</p>
                          </div>
                          <div className="flex items-center justify-between mt-3">
                            <p className="text-xs text-muted-foreground">Sent: {enquiry.dateSent}</p>
                            <Button size="sm" variant="outline">
                              <FileText className="h-3 w-3 mr-1" />
                              Export PDF
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </DialogContent>
              </Dialog>

              {/* Pending Enquiries - Interactive */}
              <Dialog>
                <DialogTrigger asChild>
                  <div className="text-center p-4 border-2 rounded-lg cursor-pointer hover:shadow-lg hover:border-yellow-300 transition-all bg-yellow-50">
                    <div className="text-3xl font-bold text-yellow-600">{pendingEnquiries}</div>
                    <div className="text-sm text-muted-foreground mb-2">Pending</div>
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
                    <DialogTitle>Pending Enquiries ({pendingEnquiries})</DialogTitle>
                    <DialogDescription>Enquiries awaiting response from seller's conveyancer</DialogDescription>
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
                              {enquiry.daysOverdue > 5 && <AlertCircle className="h-4 w-4 text-red-500" />}
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getPriorityColor(enquiry.priority)}>{enquiry.priority}</Badge>
                              <Badge variant="secondary">Pending</Badge>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{enquiry.question}</p>
                          <div className="flex items-center justify-between mt-3">
                            <div>
                              <p className="text-xs text-muted-foreground">Sent: {enquiry.dateSent}</p>
                              {enquiry.daysOverdue > 0 && (
                                <p
                                  className={`text-xs ${enquiry.daysOverdue > 5 ? "text-red-600" : "text-yellow-600"}`}
                                >
                                  {enquiry.daysOverdue} days overdue
                                </p>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => handleFollowUp(enquiry.id)}>
                                Send Follow-up
                              </Button>
                              <Button size="sm" variant="outline">
                                Escalate
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3">
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

        {/* Recently Answered Enquiries */}
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
                <div key={enquiry.id} className="border-l-4 border-green-400 pl-4 py-3">
                  <h4 className="font-medium text-sm">{enquiry.subject}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{enquiry.response}</p>
                  <p className="text-xs text-muted-foreground">Answered: {enquiry.dateAnswered}</p>
                </div>
              ))}
          </CardContent>
        </Card>

        {/* Raise New Enquiry */}
        <Card>
          <CardHeader>
            <CardTitle>Raise New Enquiry</CardTitle>
            <CardDescription>Submit additional enquiries to the seller's conveyancer</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Subject Dropdown */}
            <div>
              <Label htmlFor="subject">Enquiry Subject</Label>
              <select
                id="subject"
                value={selectedSubject}
                onChange={handleSubjectChange}
                className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select enquiry subject...</option>
                <option value="Planning Applications">Planning Applications</option>
                <option value="Utilities and Services">Utilities and Services</option>
                <option value="Boundary Disputes">Boundary Disputes</option>
                <option value="Building Warranties">Building Warranties</option>
                <option value="Service Charges">Service Charges</option>
                <option value="Environmental Issues">Environmental Issues</option>
                <option value="Alterations and Extensions">Alterations and Extensions</option>
                <option value="Parking Rights">Parking Rights</option>
                <option value="Heating System">Heating System</option>
                <option value="Insurance Claims">Insurance Claims</option>
                <option value="Roof Condition">Roof Condition</option>
                <option value="Neighbor Disputes">Neighbor Disputes</option>
                <option value="Ground Rent">Ground Rent</option>
                <option value="Leasehold Information">Leasehold Information</option>
                <option value="Management Company">Management Company</option>
                <option value="Fire Safety">Fire Safety</option>
                <option value="Building Regulations">Building Regulations</option>
                <option value="Conservation Area">Conservation Area</option>
                <option value="Listed Building">Listed Building</option>
                <option value="Tree Preservation">Tree Preservation</option>
                <option value="Rights of Way">Rights of Way</option>
                <option value="Flooding History">Flooding History</option>
                <option value="Structural Issues">Structural Issues</option>
                <option value="Electrical Systems">Electrical Systems</option>
                <option value="Plumbing Systems">Plumbing Systems</option>
                <option value="Security Systems">Security Systems</option>
                <option value="Garden/Outdoor Space">Garden/Outdoor Space</option>
                <option value="Shared Facilities">Shared Facilities</option>
                <option value="Maintenance History">Maintenance History</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Priority Selection */}
            <div>
              <Label htmlFor="priority">Priority Level</Label>
              <select
                id="priority"
                value={selectedPriority}
                onChange={handlePriorityChange}
                className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="low">🟢 Low Priority - General information</option>
                <option value="medium">🟡 Medium Priority - Important clarification</option>
                <option value="high">🟠 High Priority - Urgent response needed</option>
                <option value="critical">🔴 Critical Priority - Deal-breaking issue</option>
              </select>
            </div>

            {/* Category Auto-Assignment Display */}
            {selectedSubject && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getCategoryIcon(getSubjectCategory(selectedSubject))}</span>
                  <span className="text-sm font-medium text-blue-800">
                    Category:{" "}
                    {getSubjectCategory(selectedSubject).charAt(0).toUpperCase() +
                      getSubjectCategory(selectedSubject).slice(1)}
                  </span>
                </div>
              </div>
            )}

            {/* Enquiry Details */}
            <div>
              <Label htmlFor="enquiry">Enquiry Details</Label>
              <Textarea
                id="enquiry"
                placeholder="Enter your detailed enquiry question..."
                className="mt-2"
                rows={4}
                value={newEnquiry}
                onChange={handleMessageChange}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Be specific and detailed to get the most accurate response
              </p>
            </div>

            {/* Character Counter */}
            <div className="text-right">
              <span className={`text-xs ${newEnquiry.length > 500 ? "text-red-500" : "text-muted-foreground"}`}>
                {newEnquiry.length}/500 characters
              </span>
            </div>

            <Button
              className="w-full"
              onClick={handleSendEnquiry}
              disabled={!newEnquiry.trim() || !selectedSubject || isSubmitting || newEnquiry.length > 500}
            >
              {isSubmitting ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Sending Enquiry...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send {selectedPriority.charAt(0).toUpperCase() + selectedPriority.slice(1)} Priority Enquiry
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            onClick={handleContinueToMortgageOffer}
            disabled={pendingEnquiries > 0 || isContinuing}
            className="flex-1"
          >
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
          <Button variant="outline" disabled={pendingEnquiries === 0}>
            Send Follow-up ({pendingEnquiries})
          </Button>
        </div>

        {pendingEnquiries > 0 && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              <strong>Note:</strong> You have {pendingEnquiries} pending enquiries. All enquiries must be resolved
              before proceeding to the mortgage offer stage.
            </p>
          </div>
        )}
      </div>
    </TransactionLayout>
  )
}
