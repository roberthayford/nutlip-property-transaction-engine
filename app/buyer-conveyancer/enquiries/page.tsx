"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
  Plus,
  Eye,
  Reply,
  ArrowRight,
  Home,
  AlertCircle,
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

const ENQUIRY_TEMPLATES = [
  {
    category: "property" as const,
    subject: "Property Boundaries Clarification",
    content: "Could you please clarify the exact boundaries of the property as shown in the title deeds?",
  },
  {
    category: "legal" as const,
    subject: "Title Guarantee Query",
    content: "Please confirm the type of title guarantee being offered and any limitations.",
  },
  {
    category: "financial" as const,
    subject: "Deposit Payment Terms",
    content: "Could you confirm the deposit amount and payment terms for exchange of contracts?",
  },
  {
    category: "timeline" as const,
    subject: "Completion Date Flexibility",
    content: "Is there any flexibility with the proposed completion date? Our client may need additional time.",
  },
]

export default function BuyerConveyancerEnquiriesPage() {
  const { toast } = useToast()
  const { sendUpdate } = useRealTime()
  const router = useRouter()

  // State management
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [activeTab, setActiveTab] = useState<"active" | "pending" | "answered" | "starred">("active")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [filterPriority, setFilterPriority] = useState<string>("all")

  // Modal states
  const [showComposeModal, setShowComposeModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null)

  // Form states
  const [newEnquiry, setNewEnquiry] = useState({
    subject: "",
    category: "property" as const,
    priority: "medium" as const,
    content: "",
    tags: [] as string[],
  })
  const [followUpMessage, setFollowUpMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)

  // Load enquiries from localStorage
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

    // Listen for storage changes (responses from seller)
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
      if (update.type === "enquiry_answered" && update.role === "seller-conveyancer") {
        // Reload enquiries when seller responds
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
            title: "New Response Received",
            description: `Response received for: ${update.data?.subject || "enquiry"}`,
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
      setActiveTab("active")
      setSearchTerm("")
      setFilterCategory("all")
      setFilterPriority("all")
      setShowComposeModal(false)
      setShowDetailModal(false)
      setSelectedEnquiry(null)
      setNewEnquiry({
        subject: "",
        category: "property",
        priority: "medium",
        content: "",
        tags: [],
      })
      setFollowUpMessage("")

      // Clear localStorage
      localStorage.removeItem("conveyancer-enquiries")

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

  const handleSendEnquiry = async () => {
    if (!newEnquiry.subject.trim() || !newEnquiry.content.trim()) {
      toast({
        title: "Incomplete Enquiry",
        description: "Please fill in both subject and content",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const enquiry: Enquiry = {
        id: `enq-${Date.now()}`,
        subject: newEnquiry.subject,
        category: newEnquiry.category,
        priority: newEnquiry.priority,
        status: "pending",
        messages: [
          {
            id: `msg-${Date.now()}`,
            sender: "buyer-conveyancer",
            content: newEnquiry.content,
            timestamp: new Date(),
            type: "question",
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
        isStarred: false,
        isArchived: false,
        tags: newEnquiry.tags,
      }

      const updatedEnquiries = [...enquiries, enquiry]
      saveEnquiries(updatedEnquiries)

      // Send real-time update
      sendUpdate({
        type: "enquiry_sent",
        stage: "enquiries",
        role: "buyer-conveyancer",
        title: "New Enquiry Sent",
        description: `Enquiry sent: ${newEnquiry.subject}`,
        data: {
          enquiryId: enquiry.id,
          subject: enquiry.subject,
          category: enquiry.category,
          priority: enquiry.priority,
          content: newEnquiry.content,
        },
      })

      // Reset form
      setNewEnquiry({
        subject: "",
        category: "property",
        priority: "medium",
        content: "",
        tags: [],
      })
      setShowComposeModal(false)

      toast({
        title: "Enquiry Sent",
        description: "Your enquiry has been sent to the seller's conveyancer",
      })
    } catch (error) {
      toast({
        title: "Failed to Send Enquiry",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSendFollowUp = async () => {
    if (!followUpMessage.trim() || !selectedEnquiry) return

    setIsSubmitting(true)

    try {
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        sender: "buyer-conveyancer",
        content: followUpMessage,
        timestamp: new Date(),
        type: "follow-up",
      }

      const updatedEnquiry = {
        ...selectedEnquiry,
        messages: [...selectedEnquiry.messages, newMessage],
        status: "follow-up" as const,
        updatedAt: new Date(),
      }

      const updatedEnquiries = enquiries.map((enq) => (enq.id === selectedEnquiry.id ? updatedEnquiry : enq))
      saveEnquiries(updatedEnquiries)

      // Send real-time update
      sendUpdate({
        type: "enquiry_follow_up",
        stage: "enquiries",
        role: "buyer-conveyancer",
        title: "Follow-up Sent",
        description: `Follow-up sent for: ${selectedEnquiry.subject}`,
        data: {
          enquiryId: selectedEnquiry.id,
          subject: selectedEnquiry.subject,
          followUpContent: followUpMessage,
        },
      })

      setFollowUpMessage("")
      setSelectedEnquiry(updatedEnquiry)

      toast({
        title: "Follow-up Sent",
        description: "Your follow-up message has been sent",
      })
    } catch (error) {
      toast({
        title: "Failed to Send Follow-up",
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

  // Handle continue to mortgage offer
  const handleContinueToMortgageOffer = async () => {
    setIsNavigating(true)

    try {
      // Calculate statistics for the update
      const totalEnquiries = enquiries.length
      const answeredEnquiries = enquiries.filter((e) => e.status === "answered").length
      const completionDate = new Date()

      // Send real-time update with detailed information for the buyer's notification
      sendUpdate({
        type: "stage_completed",
        stage: "enquiries",
        role: "buyer-conveyancer",
        title: "Enquiries Stage Completed",
        description: "Moving to Mortgage Offer stage",
        data: {
          completedStage: "enquiries",
          nextStage: "mortgage-offer",
          totalEnquiries: totalEnquiries,
          answeredEnquiries: answeredEnquiries,
          completedAt: completionDate.toISOString(),
          stage: "enquiries",
          status: "completed",
        },
      })

      // Show success toast
      toast({
        title: "Enquiries Stage Completed",
        description: "Proceeding to Mortgage Offer stage...",
      })

      // Navigate to mortgage offer page after a brief delay
      setTimeout(() => {
        router.push("/buyer-conveyancer/mortgage-offer")
      }, 1500)
    } catch (error) {
      console.error("Error proceeding to mortgage offer:", error)
      toast({
        title: "Navigation Error",
        description: "Failed to proceed to Mortgage Offer. Please try again.",
        variant: "destructive",
      })
      setIsNavigating(false)
    }
  }

  // Check if we can proceed to mortgage offer
  const canProceedToMortgageOffer = () => {
    const criticalEnquiries = enquiries.filter((e) => e.priority === "urgent" || e.priority === "high")
    const answeredCriticalEnquiries = criticalEnquiries.filter((e) => e.status === "answered")

    // Allow proceeding if no critical enquiries or all critical enquiries are answered
    return criticalEnquiries.length === 0 || criticalEnquiries.length === answeredCriticalEnquiries.length
  }

  // Filter enquiries
  const filteredEnquiries = enquiries.filter((enquiry) => {
    // Tab filtering
    if (activeTab === "pending" && enquiry.status !== "pending") return false
    if (activeTab === "answered" && enquiry.status !== "answered") return false
    if (activeTab === "starred" && !enquiry.isStarred) return false
    if (activeTab === "active" && (enquiry.isArchived || enquiry.status === "closed")) return false

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
  const canProceed = canProceedToMortgageOffer()

  const useTemplate = (template: (typeof ENQUIRY_TEMPLATES)[0]) => {
    setNewEnquiry({
      ...newEnquiry,
      subject: template.subject,
      category: template.category,
      content: template.content,
    })
  }

  const handleTemplateClick = (template: (typeof ENQUIRY_TEMPLATES)[0]) => {
    setNewEnquiry({
      ...newEnquiry,
      subject: template.subject,
      category: template.category,
      content: template.content,
    })
  }

  return (
    <TransactionLayout currentStage="enquiries" userRole="buyer-conveyancer">
      <div className="space-y-6">
        {/* Header with Stats */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-grey-900">Property Enquiries</h1>
            <p className="text-grey-600">Communicate with the seller's conveyancer</p>
          </div>
          <Button onClick={() => setShowComposeModal(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Enquiry
          </Button>
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
                  <p className="text-sm text-grey-600">Pending Response</p>
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
                  <p className="text-sm text-grey-600">Answered</p>
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
              { key: "active", label: "Active", count: stats.total - enquiries.filter((e) => e.isArchived).length },
              { key: "pending", label: "Pending", count: stats.pending },
              { key: "answered", label: "Answered", count: stats.answered },
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
                <p className="text-grey-600 mb-4">
                  {activeTab === "active" ? "You haven't sent any enquiries yet." : `No ${activeTab} enquiries found.`}
                </p>
                <Button onClick={() => setShowComposeModal(true)} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Send Your First Enquiry
                </Button>
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
                          <span>Created: {enquiry.createdAt.toLocaleDateString()}</span>
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

        {/* Continue to Mortgage Offer Button */}
        <div className="flex justify-between items-center pt-6 border-t">
          <div className="flex-1">
            {!canProceed && (
              <div className="flex items-center gap-2 text-amber-600">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">Please resolve all urgent and high priority enquiries before proceeding</span>
              </div>
            )}
          </div>

          <Button
            onClick={handleContinueToMortgageOffer}
            disabled={!canProceed || isNavigating}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
            size="lg"
          >
            {isNavigating ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Home className="h-4 w-4" />
                Continue to Mortgage Offer
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>

        {/* Compose Modal */}
        {showComposeModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Compose New Enquiry</h2>
                  <Button variant="ghost" size="sm" onClick={() => setShowComposeModal(false)} className="h-8 w-8 p-0">
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Form */}
                  <div className="lg:col-span-2 space-y-4">
                    <div>
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        value={newEnquiry.subject}
                        onChange={(e) => setNewEnquiry({ ...newEnquiry, subject: e.target.value })}
                        placeholder="Enter enquiry subject..."
                        className="mt-1"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <select
                          id="category"
                          value={newEnquiry.category}
                          onChange={(e) => setNewEnquiry({ ...newEnquiry, category: e.target.value as any })}
                          className="mt-1 block w-full px-3 py-2 border border-grey-300 rounded-md"
                        >
                          <option value="property">Property</option>
                          <option value="legal">Legal</option>
                          <option value="financial">Financial</option>
                          <option value="timeline">Timeline</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="priority">Priority</Label>
                        <select
                          id="priority"
                          value={newEnquiry.priority}
                          onChange={(e) => setNewEnquiry({ ...newEnquiry, priority: e.target.value as any })}
                          className="mt-1 block w-full px-3 py-2 border border-grey-300 rounded-md"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="urgent">Urgent</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="content">Message *</Label>
                      <Textarea
                        id="content"
                        value={newEnquiry.content}
                        onChange={(e) => setNewEnquiry({ ...newEnquiry, content: e.target.value })}
                        placeholder="Enter your enquiry details..."
                        rows={8}
                        className="mt-1"
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={handleSendEnquiry}
                        disabled={isSubmitting || !newEnquiry.subject.trim() || !newEnquiry.content.trim()}
                        className="flex items-center gap-2"
                      >
                        {isSubmitting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        Send Enquiry
                      </Button>
                      <Button variant="outline" onClick={() => setShowComposeModal(false)} disabled={isSubmitting}>
                        Cancel
                      </Button>
                    </div>
                  </div>

                  {/* Templates */}
                  <div>
                    <h3 className="font-medium mb-4">Quick Templates</h3>
                    <div className="space-y-3">
                      {ENQUIRY_TEMPLATES.map((template, index) => (
                        <Card
                          key={index}
                          className="cursor-pointer hover:bg-grey-50"
                          onClick={() => handleTemplateClick(template)}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="text-xs capitalize">
                                {template.category}
                              </Badge>
                            </div>
                            <h4 className="font-medium text-sm mb-1">{template.subject}</h4>
                            <p className="text-xs text-grey-600 line-clamp-2">{template.content}</p>
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
                        className={`flex ${message.sender === "buyer-conveyancer" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            message.sender === "buyer-conveyancer"
                              ? "bg-blue-600 text-white"
                              : "bg-grey-100 text-grey-900"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <User className="h-3 w-3" />
                            <span className="text-xs font-medium">
                              {message.sender === "buyer-conveyancer" ? "You" : "Seller's Conveyancer"}
                            </span>
                            <span className="text-xs opacity-75">{message.timestamp.toLocaleString()}</span>
                          </div>
                          <p className="text-sm">{message.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Follow-up Form */}
                {selectedEnquiry.status === "answered" && (
                  <div className="border-t pt-4">
                    <h3 className="font-medium mb-3">Send Follow-up</h3>
                    <div className="space-y-3">
                      <Textarea
                        value={followUpMessage}
                        onChange={(e) => setFollowUpMessage(e.target.value)}
                        placeholder="Type your follow-up message..."
                        rows={3}
                      />
                      <Button
                        onClick={handleSendFollowUp}
                        disabled={isSubmitting || !followUpMessage.trim()}
                        className="flex items-center gap-2"
                      >
                        {isSubmitting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Reply className="h-4 w-4" />}
                        Send Follow-up
                      </Button>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t">
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
