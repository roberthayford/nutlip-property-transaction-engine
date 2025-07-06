"use client"

import { useState, useEffect } from "react"
import TransactionLayout from "@/components/transaction-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useRealTime } from "@/contexts/real-time-context"
import { useToast } from "@/hooks/use-toast"
import {
  MessageSquare,
  Send,
  Search,
  Star,
  Archive,
  Clock,
  CheckCircle,
  User,
  Calendar,
  RefreshCw,
  X,
  Eye,
  Reply,
  Mail,
} from "lucide-react"

interface Message {
  id: string
  sender: "buyer-conveyancer" | "seller-conveyancer"
  content: string
  timestamp: Date
  type: "question" | "response" | "follow-up"
}

interface Enquiry {
  id: string
  subject: string
  category: "property" | "legal" | "financial" | "timeline" | "other"
  priority: "low" | "medium" | "high" | "urgent"
  status: "pending" | "answered" | "follow-up" | "closed"
  messages: Message[]
  createdAt: Date
  updatedAt: Date
  isStarred: boolean
  isArchived: boolean
  tags: string[]
}

const RESPONSE_TEMPLATES = [
  {
    category: "property" as const,
    subject: "Property Boundaries Response",
    content:
      "The property boundaries are clearly defined in the title deeds as follows: [Please provide specific boundary details]",
  },
  {
    category: "legal" as const,
    subject: "Title Guarantee Confirmation",
    content:
      "We can confirm that a full title guarantee will be provided. There are no known limitations or restrictions.",
  },
  {
    category: "financial" as const,
    subject: "Deposit Terms Confirmation",
    content: "The deposit amount is 10% of the purchase price, payable upon exchange of contracts via bank transfer.",
  },
  {
    category: "timeline" as const,
    subject: "Completion Date Response",
    content:
      "We can accommodate some flexibility with the completion date. Please let us know your preferred timeline.",
  },
]

export default function SellerConveyancerEnquiriesPage() {
  const { toast } = useToast()
  const { sendUpdate } = useRealTime()

  // State management
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [activeTab, setActiveTab] = useState<"pending" | "answered" | "all" | "starred">("pending")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [filterPriority, setFilterPriority] = useState<string>("all")
  const [responseContent, setResponseContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showResponseModal, setShowResponseModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null)

  // Load enquiries and listen for new ones
  useEffect(() => {
    const loadEnquiries = () => {
      try {
        const stored = localStorage.getItem("conveyancer-enquiries")
        if (stored) {
          const parsed = JSON.parse(stored)
          const enquiriesWithDates = parsed.map((enquiry: any) => ({
            ...enquiry,
            createdAt: new Date(enquiry.createdAt),
            updatedAt: new Date(enquiry.updatedAt),
            messages: enquiry.messages.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp),
            })),
          }))
          setEnquiries(enquiriesWithDates)
        }
      } catch (error) {
        console.error("Error loading enquiries:", error)
      }
    }

    loadEnquiries()

    // Listen for storage changes (new enquiries from buyer)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "conveyancer-enquiries") {
        loadEnquiries()
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  // Listen for real-time updates
  useEffect(() => {
    const handleRealTimeUpdate = (event: CustomEvent) => {
      const update = event.detail
      if (update.type === "enquiry_sent" && update.role === "buyer-conveyancer") {
        // Reload enquiries when buyer sends new enquiry
        const stored = localStorage.getItem("conveyancer-enquiries")
        if (stored) {
          const parsed = JSON.parse(stored)
          const enquiriesWithDates = parsed.map((enquiry: any) => ({
            ...enquiry,
            createdAt: new Date(enquiry.createdAt),
            updatedAt: new Date(enquiry.updatedAt),
            messages: enquiry.messages.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp),
            })),
          }))
          setEnquiries(enquiriesWithDates)

          toast({
            title: "New Enquiry Received",
            description: `New enquiry: ${update.data?.subject || "Untitled"}`,
          })
        }
      }
    }

    window.addEventListener("realtime-update", handleRealTimeUpdate as EventListener)
    return () => window.removeEventListener("realtime-update", handleRealTimeUpdate as EventListener)
  }, [toast])

  // Reset functionality
  useEffect(() => {
    const handlePlatformReset = () => {
      setEnquiries([])
      setActiveTab("pending")
      setSearchTerm("")
      setFilterCategory("all")
      setFilterPriority("all")
      setShowResponseModal(false)
      setShowDetailModal(false)
      setSelectedEnquiry(null)
      setResponseContent("")

      toast({
        title: "Enquiries Reset",
        description: "All enquiry data has been cleared and reset to default state.",
      })
    }

    window.addEventListener("platform-reset", handlePlatformReset)
    return () => window.removeEventListener("platform-reset", handlePlatformReset)
  }, [toast])

  const saveEnquiries = (updatedEnquiries: Enquiry[]) => {
    try {
      localStorage.setItem("conveyancer-enquiries", JSON.stringify(updatedEnquiries))
      setEnquiries(updatedEnquiries)
    } catch (error) {
      console.error("Error saving enquiries:", error)
    }
  }

  const handleSendResponse = async () => {
    if (!responseContent.trim() || !selectedEnquiry) return

    setIsSubmitting(true)

    try {
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        sender: "seller-conveyancer",
        content: responseContent,
        timestamp: new Date(),
        type: "response",
      }

      const updatedEnquiry = {
        ...selectedEnquiry,
        messages: [...selectedEnquiry.messages, newMessage],
        status: "answered" as const,
        updatedAt: new Date(),
      }

      const updatedEnquiries = enquiries.map((enq) => (enq.id === selectedEnquiry.id ? updatedEnquiry : enq))
      saveEnquiries(updatedEnquiries)

      // Send real-time update
      sendUpdate({
        type: "enquiry_answered",
        stage: "enquiries",
        role: "seller-conveyancer",
        title: "Enquiry Answered",
        description: `Response sent for: ${selectedEnquiry.subject}`,
        data: {
          enquiryId: selectedEnquiry.id,
          subject: selectedEnquiry.subject,
          responseContent: responseContent,
        },
      })

      setResponseContent("")
      setShowResponseModal(false)
      setSelectedEnquiry(null)

      toast({
        title: "Response Sent",
        description: "Your response has been sent to the buyer's conveyancer",
      })
    } catch (error) {
      toast({
        title: "Failed to Send Response",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleToggleStar = (enquiryId: string) => {
    const updatedEnquiries = enquiries.map((enq) =>
      enq.id === enquiryId ? { ...enq, isStarred: !enq.isStarred } : enq,
    )
    saveEnquiries(updatedEnquiries)
  }

  const handleArchive = (enquiryId: string) => {
    const updatedEnquiries = enquiries.map((enq) =>
      enq.id === enquiryId ? { ...enq, isArchived: !enq.isArchived } : enq,
    )
    saveEnquiries(updatedEnquiries)
  }

  const useTemplate = (template: (typeof RESPONSE_TEMPLATES)[0]) => {
    setResponseContent(template.content)
  }

  // Filter enquiries
  const filteredEnquiries = enquiries.filter((enquiry) => {
    // Tab filtering
    if (activeTab === "pending" && enquiry.status !== "pending") return false
    if (activeTab === "answered" && enquiry.status !== "answered") return false
    if (activeTab === "starred" && !enquiry.isStarred) return false
    if (activeTab === "all" && enquiry.isArchived) return false

    // Search filtering
    if (searchTerm && !enquiry.subject.toLowerCase().includes(searchTerm.toLowerCase())) return false

    // Category filtering
    if (filterCategory !== "all" && enquiry.category !== filterCategory) return false

    // Priority filtering
    if (filterPriority !== "all" && enquiry.priority !== filterPriority) return false

    return true
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "answered":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "follow-up":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-grey-100 text-grey-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "medium":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-grey-100 text-grey-800"
    }
  }

  const getEnquiryStats = () => {
    return {
      total: enquiries.length,
      pending: enquiries.filter((e) => e.status === "pending").length,
      answered: enquiries.filter((e) => e.status === "answered").length,
      starred: enquiries.filter((e) => e.isStarred).length,
    }
  }

  const stats = getEnquiryStats()

  return (
    <TransactionLayout currentStage="enquiries" userRole="seller-conveyancer">
      <div className="space-y-6">
        {/* Header with Stats */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-grey-900">Property Enquiries</h1>
            <p className="text-grey-600">Respond to enquiries from the buyer's conveyancer</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {stats.pending} Pending
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-sm text-grey-600">Total Enquiries</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                  <p className="text-sm text-grey-600">Awaiting Response</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">{stats.answered}</p>
                  <p className="text-sm text-grey-600">Responded</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Star className="h-8 w-8 text-amber-600" />
                <div>
                  <p className="text-2xl font-bold">{stats.starred}</p>
                  <p className="text-sm text-grey-600">Starred</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-grey-400" />
                  <Input
                    placeholder="Search enquiries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2 border border-grey-300 rounded-md text-sm"
                >
                  <option value="all">All Categories</option>
                  <option value="property">Property</option>
                  <option value="legal">Legal</option>
                  <option value="financial">Financial</option>
                  <option value="timeline">Timeline</option>
                  <option value="other">Other</option>
                </select>
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="px-3 py-2 border border-grey-300 rounded-md text-sm"
                >
                  <option value="all">All Priorities</option>
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className="border-b border-grey-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { key: "pending", label: "Pending", count: stats.pending },
              { key: "answered", label: "Answered", count: stats.answered },
              { key: "all", label: "All", count: stats.total },
              { key: "starred", label: "Starred", count: stats.starred },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === tab.key
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-grey-500 hover:text-grey-700 hover:border-grey-300"
                }`}
              >
                {tab.label}
                <Badge variant="secondary" className="text-xs">
                  {tab.count}
                </Badge>
              </button>
            ))}
          </nav>
        </div>

        {/* Enquiries List */}
        <div className="space-y-4">
          {filteredEnquiries.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <MessageSquare className="h-12 w-12 text-grey-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-grey-900 mb-2">No Enquiries Found</h3>
                <p className="text-grey-600">
                  {activeTab === "pending" ? "No pending enquiries at the moment." : `No ${activeTab} enquiries found.`}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredEnquiries.map((enquiry) => (
              <Card key={enquiry.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-grey-900">{enquiry.subject}</h3>
                        <Badge variant="outline" className={getStatusColor(enquiry.status)}>
                          {enquiry.status.charAt(0).toUpperCase() + enquiry.status.slice(1)}
                        </Badge>
                        <Badge variant="outline" className={getPriorityColor(enquiry.priority)}>
                          {enquiry.priority.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="capitalize">
                          {enquiry.category}
                        </Badge>
                      </div>

                      <p className="text-grey-600 text-sm mb-3 line-clamp-2">
                        {enquiry.messages[0]?.content || "No content"}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-grey-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>Received: {enquiry.createdAt.toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          <span>
                            {enquiry.messages.length} message{enquiry.messages.length !== 1 ? "s" : ""}
                          </span>
                        </div>
                        {enquiry.updatedAt > enquiry.createdAt && (
                          <div className="flex items-center gap-1">
                            <RefreshCw className="h-3 w-3" />
                            <span>Updated: {enquiry.updatedAt.toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      {enquiry.status === "pending" && (
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedEnquiry(enquiry)
                            setShowResponseModal(true)
                          }}
                          className="flex items-center gap-1"
                        >
                          <Reply className="h-3 w-3" />
                          Respond
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleStar(enquiry.id)}
                        className={enquiry.isStarred ? "text-amber-600" : "text-grey-400"}
                      >
                        <Star className={`h-4 w-4 ${enquiry.isStarred ? "fill-current" : ""}`} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedEnquiry(enquiry)
                          setShowDetailModal(true)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleArchive(enquiry.id)}>
                        <Archive className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Response Modal */}
        {showResponseModal && selectedEnquiry && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold">Respond to Enquiry</h2>
                    <p className="text-grey-600">{selectedEnquiry.subject}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setShowResponseModal(false)} className="h-8 w-8 p-0">
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Original Enquiry */}
                  <div className="lg:col-span-2">
                    <div className="bg-grey-50 rounded-lg p-4 mb-6">
                      <h3 className="font-medium mb-2">Original Enquiry</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getPriorityColor(selectedEnquiry.priority)}>
                          {selectedEnquiry.priority.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="capitalize">
                          {selectedEnquiry.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-grey-700">{selectedEnquiry.messages[0]?.content}</p>
                    </div>

                    {/* Response Form */}
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="response">Your Response *</Label>
                        <Textarea
                          id="response"
                          value={responseContent}
                          onChange={(e) => setResponseContent(e.target.value)}
                          placeholder="Type your response to the enquiry..."
                          rows={8}
                          className="mt-1"
                        />
                      </div>

                      <div className="flex gap-3">
                        <Button
                          onClick={handleSendResponse}
                          disabled={isSubmitting || !responseContent.trim()}
                          className="flex items-center gap-2"
                        >
                          {isSubmitting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                          Send Response
                        </Button>
                        <Button variant="outline" onClick={() => setShowResponseModal(false)} disabled={isSubmitting}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Response Templates */}
                  <div>
                    <h3 className="font-medium mb-4">Response Templates</h3>
                    <div className="space-y-3">
                      {RESPONSE_TEMPLATES.filter(
                        (template) => template.category === selectedEnquiry.category || template.category === "legal",
                      ).map((template, index) => (
                        <Card
                          key={index}
                          className="cursor-pointer hover:bg-grey-50"
                          onClick={() => setResponseContent(template.content)}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="text-xs capitalize">
                                {template.category}
                              </Badge>
                            </div>
                            <h4 className="font-medium text-sm mb-1">{template.subject}</h4>
                            <p className="text-xs text-grey-600 line-clamp-3">{template.content}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Detail Modal */}
        {showDetailModal && selectedEnquiry && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold">{selectedEnquiry.subject}</h2>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={getStatusColor(selectedEnquiry.status)}>
                        {selectedEnquiry.status.charAt(0).toUpperCase() + selectedEnquiry.status.slice(1)}
                      </Badge>
                      <Badge className={getPriorityColor(selectedEnquiry.priority)}>
                        {selectedEnquiry.priority.toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {selectedEnquiry.category}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setShowDetailModal(false)} className="h-8 w-8 p-0">
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Message Thread */}
                <div className="space-y-4 mb-6">
                  <h3 className="font-medium">Conversation</h3>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {selectedEnquiry.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === "seller-conveyancer" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            message.sender === "seller-conveyancer"
                              ? "bg-blue-600 text-white"
                              : "bg-grey-100 text-grey-900"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <User className="h-3 w-3" />
                            <span className="text-xs font-medium">
                              {message.sender === "seller-conveyancer" ? "You" : "Buyer's Conveyancer"}
                            </span>
                            <span className="text-xs opacity-75">{message.timestamp.toLocaleString()}</span>
                          </div>
                          <p className="text-sm">{message.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t">
                  {selectedEnquiry.status === "pending" && (
                    <Button
                      onClick={() => {
                        setShowDetailModal(false)
                        setShowResponseModal(true)
                      }}
                      className="flex items-center gap-2"
                    >
                      <Reply className="h-4 w-4" />
                      Respond
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => handleToggleStar(selectedEnquiry.id)}
                    className="flex items-center gap-2"
                  >
                    <Star className={`h-4 w-4 ${selectedEnquiry.isStarred ? "fill-current text-amber-600" : ""}`} />
                    {selectedEnquiry.isStarred ? "Unstar" : "Star"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleArchive(selectedEnquiry.id)}
                    className="flex items-center gap-2"
                  >
                    <Archive className="h-4 w-4" />
                    {selectedEnquiry.isArchived ? "Unarchive" : "Archive"}
                  </Button>
                  <Button variant="outline" onClick={() => setShowDetailModal(false)}>
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </TransactionLayout>
  )
}
