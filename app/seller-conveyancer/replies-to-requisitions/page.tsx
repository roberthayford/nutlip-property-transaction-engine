"use client"

import { useState, useEffect } from "react"
import { TransactionLayout } from "@/components/transaction-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Clock, AlertTriangle, FileText, Send, Download, RefreshCw, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Requisition {
  id: string
  title: string
  question: string
  status: "pending" | "replied" | "urgent"
  priority: "high" | "medium" | "low"
  receivedDate: string
  dueDate: string
  repliedDate?: string
  reply?: string
  referenceNumber?: string
  fromBuyerConveyancer?: boolean
  urgency?: string
}

export default function SellerConveyancerRepliesToRequisitionsPage() {
  const { toast } = useToast()
  const [selectedRequisition, setSelectedRequisition] = useState<string | null>(null)
  const [reply, setReply] = useState("")
  const [activeFilter, setActiveFilter] = useState<"all" | "pending" | "replied" | "high-priority">("all")
  const [activeTab, setActiveTab] = useState("pending")

  // Initialize with data from localStorage
  const [requisitions, setRequisitions] = useState<Requisition[]>([])

  // Initialize data - Load from localStorage on mount
  useEffect(() => {
    // Load existing requisitions from localStorage
    const savedRequisitions = localStorage.getItem("seller-requisitions-data")
    if (savedRequisitions) {
      try {
        const parsedRequisitions = JSON.parse(savedRequisitions)
        setRequisitions(parsedRequisitions)
      } catch (error) {
        console.error("Error parsing saved requisitions:", error)
        setRequisitions([])
      }
    }
  }, [])

  // Listen for new incoming requisitions and platform reset events
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "seller-incoming-requisitions") {
        const incoming = e.newValue
        if (incoming) {
          const incomingReqs = JSON.parse(incoming)
          const convertedReqs = incomingReqs.map((req: any) => ({
            id: req.id,
            title: req.title,
            question: req.question,
            status: "pending" as const,
            priority: req.priority,
            receivedDate: req.receivedDate,
            referenceNumber: req.referenceNumber,
            fromBuyerConveyancer: true,
            urgency: req.urgency,
            dueDate: req.dueDate,
          }))

          setRequisitions((prev) => {
            const existingIds = prev.map((r) => r.id)
            const newReqs = convertedReqs.filter((req: any) => !existingIds.includes(req.id))
            if (newReqs.length > 0) {
              toast({
                title: "New Requisition Received",
                description: `${newReqs.length} new requisition(s) from buyer's conveyancer`,
              })
            }
            const updatedReqs = [...prev, ...newReqs]
            localStorage.setItem("seller-requisitions-data", JSON.stringify(updatedReqs))
            return updatedReqs
          })
        }
      }
    }

    // Listen for platform reset events
    const handlePlatformReset = () => {
      setRequisitions([])
      setSelectedRequisition(null)
      setReply("")
      setActiveFilter("all")
      setActiveTab("pending")
    }

    // Also check for updates on page focus
    const handleFocus = () => {
      const incoming = localStorage.getItem("seller-incoming-requisitions")
      if (incoming) {
        const incomingReqs = JSON.parse(incoming)
        const convertedReqs = incomingReqs.map((req: any) => ({
          id: req.id,
          title: req.title,
          question: req.question,
          status: "pending" as const,
          priority: req.priority,
          receivedDate: req.receivedDate,
          referenceNumber: req.referenceNumber,
          fromBuyerConveyancer: true,
          urgency: req.urgency,
          dueDate: req.dueDate,
        }))

        setRequisitions((prev) => {
          const existingIds = prev.map((r) => r.id)
          const newReqs = convertedReqs.filter((req: any) => !existingIds.includes(req.id))
          const updatedReqs = [...prev, ...newReqs]
          if (updatedReqs.length !== prev.length) {
            localStorage.setItem("seller-requisitions-data", JSON.stringify(updatedReqs))
          }
          return updatedReqs
        })
      }
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("focus", handleFocus)
    window.addEventListener("platform-reset", handlePlatformReset)

    // Check immediately on mount
    handleFocus()

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("focus", handleFocus)
      window.removeEventListener("platform-reset", handlePlatformReset)
    }
  }, [toast])

  // Save to localStorage whenever requisitions change
  useEffect(() => {
    if (requisitions.length >= 0) {
      localStorage.setItem("seller-requisitions-data", JSON.stringify(requisitions))
    }
  }, [requisitions])

  // Calculate reactive statistics
  const stats = {
    total: requisitions.length,
    pending: requisitions.filter((r) => r.status === "pending").length,
    replied: requisitions.filter((r) => r.status === "replied").length,
    highPriority: requisitions.filter((r) => r.priority === "high").length,
    fromBuyerConveyancer: requisitions.filter((r) => r.fromBuyerConveyancer).length,
  }

  const progressPercentage = stats.total > 0 ? Math.round((stats.replied / stats.total) * 100) : 0

  // Filter requisitions based on active filter
  const getFilteredRequisitions = () => {
    switch (activeFilter) {
      case "pending":
        return requisitions.filter((r) => r.status === "pending")
      case "replied":
        return requisitions.filter((r) => r.status === "replied")
      case "high-priority":
        return requisitions.filter((r) => r.priority === "high")
      default:
        return requisitions
    }
  }

  const handleFilterClick = (filter: "all" | "pending" | "replied" | "high-priority") => {
    setActiveFilter(filter)
    // Auto-switch to appropriate tab based on filter
    if (filter === "pending") {
      setActiveTab("pending")
    } else if (filter === "replied") {
      setActiveTab("replied")
    } else {
      setActiveTab("all")
    }

    toast({
      title: "Filter Applied",
      description: `Showing ${filter === "all" ? "all" : filter.replace("-", " ")} requisitions`,
    })
  }

  const handleReplySubmit = (requisitionId: string) => {
    if (!reply.trim()) {
      toast({
        title: "Reply Required",
        description: "Please enter a reply before sending",
        variant: "destructive",
      })
      return
    }

    const now = new Date()
    const repliedDate = now.toISOString().split("T")[0]
    const repliedTime = now.toTimeString().split(" ")[0]

    // Update local requisitions state
    const updatedRequisitions = requisitions.map((r) =>
      r.id === requisitionId
        ? {
            ...r,
            status: "replied" as const,
            repliedDate: repliedDate,
            reply: reply.trim(),
          }
        : r,
    )

    setRequisitions(updatedRequisitions)
    localStorage.setItem("seller-requisitions-data", JSON.stringify(updatedRequisitions))

    // Send reply back to buyer conveyancer
    const requisition = requisitions.find((r) => r.id === requisitionId)
    if (requisition) {
      // Update buyer's sent requisitions with the reply
      const buyerSentRequisitions = JSON.parse(localStorage.getItem("buyer-sent-requisitions") || "[]")
      const updatedBuyerSentRequisitions = buyerSentRequisitions.map((req: any) =>
        req.id === requisitionId
          ? {
              ...req,
              status: "replied",
              reply: reply.trim(),
              repliedDate: repliedDate,
              repliedTime: repliedTime,
              recipientConfirmation: "Reply received and processed by seller's conveyancer",
            }
          : req,
      )
      localStorage.setItem("buyer-sent-requisitions", JSON.stringify(updatedBuyerSentRequisitions))

      // Update buyer's main requisitions list
      const buyerRequisitions = JSON.parse(localStorage.getItem("buyer-conveyancer-requisitions") || "[]")
      const updatedBuyerRequisitions = buyerRequisitions.map((req: any) =>
        req.id === requisitionId
          ? {
              ...req,
              status: "replied",
              reply: reply.trim(),
              repliedDate: repliedDate,
            }
          : req,
      )
      localStorage.setItem("buyer-conveyancer-requisitions", JSON.stringify(updatedBuyerRequisitions))

      // Create a storage event to notify buyer conveyancer page
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "buyer-conveyancer-requisitions",
          newValue: JSON.stringify(updatedBuyerRequisitions),
          oldValue: JSON.stringify(buyerRequisitions),
        }),
      )

      // Also dispatch for sent requisitions
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "buyer-sent-requisitions",
          newValue: JSON.stringify(updatedBuyerSentRequisitions),
          oldValue: JSON.stringify(buyerSentRequisitions),
        }),
      )
    }

    setSelectedRequisition(null)
    setReply("")

    toast({
      title: "Reply Sent Successfully",
      description: "Your reply has been sent to the buyer's conveyancer",
    })
  }

  const handleRefresh = () => {
    // Force refresh from localStorage
    const incoming = localStorage.getItem("seller-incoming-requisitions")
    if (incoming) {
      const incomingReqs = JSON.parse(incoming)
      const convertedReqs = incomingReqs.map((req: any) => ({
        id: req.id,
        title: req.title,
        question: req.question,
        status: "pending" as const,
        priority: req.priority,
        receivedDate: req.receivedDate,
        referenceNumber: req.referenceNumber,
        fromBuyerConveyancer: true,
        urgency: req.urgency,
        dueDate: req.dueDate,
      }))

      setRequisitions((prev) => {
        const existingIds = prev.map((r) => r.id)
        const newReqs = convertedReqs.filter((req: any) => !existingIds.includes(req.id))
        return [...prev, ...newReqs]
      })
    }

    toast({
      title: "Data Refreshed",
      description: "Requisitions data has been updated",
    })
  }

  const filteredRequisitions = getFilteredRequisitions()

  return (
    <TransactionLayout title="Replies to Requisitions" stage="replies-to-requisitions" userRole="seller-conveyancer">
      <div className="space-y-6">
        {/* Enhanced Completion Requisitions Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Completion Requisitions Overview
                  {stats.fromBuyerConveyancer > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {stats.fromBuyerConveyancer} from Buyer's Conveyancer
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>Respond to pre-completion requisitions from the buyer's conveyancer</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleRefresh}>
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Refresh
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Interactive Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div
                className={`text-center p-4 bg-blue-50 rounded-lg border-2 cursor-pointer transition-all duration-200 group ${
                  activeFilter === "all" ? "border-blue-500 bg-blue-100" : "border-transparent hover:border-blue-200"
                }`}
                onClick={() => handleFilterClick("all")}
              >
                <div className="text-2xl font-bold text-blue-600 group-hover:scale-110 transition-transform">
                  {stats.total}
                </div>
                <div className="text-sm text-blue-800">Total Requisitions</div>
                <div className="text-xs text-blue-600 mt-1">Click to view all</div>
                {stats.fromBuyerConveyancer > 0 && (
                  <div className="text-xs text-blue-500 mt-1">({stats.fromBuyerConveyancer} from buyer)</div>
                )}
              </div>

              <div
                className={`text-center p-4 bg-yellow-50 rounded-lg border-2 cursor-pointer transition-all duration-200 group relative ${
                  activeFilter === "pending"
                    ? "border-yellow-500 bg-yellow-100"
                    : "border-transparent hover:border-yellow-200"
                }`}
                onClick={() => handleFilterClick("pending")}
              >
                <div className="text-2xl font-bold text-yellow-600 group-hover:scale-110 transition-transform">
                  {stats.pending}
                </div>
                <div className="text-sm text-yellow-800">Pending Reply</div>
                <div className="text-xs text-yellow-600 mt-1">Click to filter</div>
                {stats.pending > 0 && (
                  <div className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                    {stats.pending}
                  </div>
                )}
              </div>

              <div
                className={`text-center p-4 bg-green-50 rounded-lg border-2 cursor-pointer transition-all duration-200 group ${
                  activeFilter === "replied"
                    ? "border-green-500 bg-green-100"
                    : "border-transparent hover:border-green-200"
                }`}
                onClick={() => handleFilterClick("replied")}
              >
                <div className="text-2xl font-bold text-green-600 group-hover:scale-110 transition-transform">
                  {stats.replied}
                </div>
                <div className="text-sm text-green-800">Replied</div>
                <div className="text-xs text-green-600 mt-1">Click to filter</div>
              </div>

              <div
                className={`text-center p-4 bg-red-50 rounded-lg border-2 cursor-pointer transition-all duration-200 group ${
                  activeFilter === "high-priority"
                    ? "border-red-500 bg-red-100"
                    : "border-transparent hover:border-red-200"
                }`}
                onClick={() => handleFilterClick("high-priority")}
              >
                <div className="text-2xl font-bold text-red-600 group-hover:scale-110 transition-transform">
                  {stats.highPriority}
                </div>
                <div className="text-sm text-red-800">High Priority</div>
                <div className="text-xs text-red-600 mt-1">Click to filter</div>
                {stats.highPriority > 0 && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                    {stats.highPriority}
                  </div>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-grey-700">Overall Progress</span>
                <span className="text-sm text-grey-600">
                  {progressPercentage}% Complete ({stats.replied}/{stats.total})
                </span>
              </div>
              <div className="w-full bg-grey-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${progressPercentage}%`,
                  }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-grey-500 mt-1">
                <span>Started</span>
                <span>In Progress</span>
                <span>Complete</span>
              </div>
            </div>

            {/* Active Filter Indicator */}
            {activeFilter !== "all" && (
              <div className="flex items-center gap-2 mb-4 p-2 bg-blue-50 rounded-lg">
                <Badge variant="secondary">
                  Active Filter: {activeFilter.replace("-", " ").toUpperCase()} ({filteredRequisitions.length} items)
                </Badge>
                <Button variant="ghost" size="sm" onClick={() => handleFilterClick("all")}>
                  <X className="h-3 w-3 mr-1" />
                  Clear Filter
                </Button>
              </div>
            )}

            {/* Real-time Updates Indicator */}
            <div className="flex items-center gap-2 text-xs text-grey-500 mb-4">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Real-time updates active</span>
              <span>•</span>
              <span>Last updated: {new Date().toLocaleTimeString()}</span>
            </div>
          </CardContent>
        </Card>

        {/* Filtered Requisitions Display */}
        {activeFilter !== "all" && (
          <Card>
            <CardHeader>
              <CardTitle>
                {activeFilter === "pending" && "Pending Requisitions"}
                {activeFilter === "replied" && "Replied Requisitions"}
                {activeFilter === "high-priority" && "High Priority Requisitions"}
              </CardTitle>
              <CardDescription>
                Showing {filteredRequisitions.length} requisition{filteredRequisitions.length !== 1 ? "s" : ""}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredRequisitions.length === 0 ? (
                <div className="text-center py-8 text-grey-500">No requisitions match the current filter.</div>
              ) : (
                filteredRequisitions.map((requisition) => (
                  <Card
                    key={requisition.id}
                    className={`border-l-4 ${
                      requisition.status === "replied"
                        ? "border-l-green-500"
                        : requisition.priority === "high"
                          ? "border-l-red-500"
                          : "border-l-yellow-500"
                    } ${requisition.fromBuyerConveyancer ? "bg-blue-50" : ""}`}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                          {requisition.title}
                          {requisition.fromBuyerConveyancer && (
                            <Badge variant="outline" className="text-xs">
                              From Buyer's Conveyancer
                            </Badge>
                          )}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              requisition.priority === "high"
                                ? "destructive"
                                : requisition.priority === "medium"
                                  ? "default"
                                  : "secondary"
                            }
                          >
                            {requisition.priority} priority
                          </Badge>
                          <Badge variant={requisition.status === "replied" ? "default" : "secondary"}>
                            {requisition.status === "replied" ? (
                              <>
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Replied
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
                        Received: {new Date(requisition.receivedDate).toLocaleDateString()}
                        {requisition.repliedDate &&
                          ` | Replied: ${new Date(requisition.repliedDate).toLocaleDateString()}`}
                        {requisition.referenceNumber && (
                          <span className="ml-2 font-mono text-xs">Ref: {requisition.referenceNumber}</span>
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-3 bg-grey-50 rounded-lg">
                        <p className="text-sm font-medium mb-2">Question:</p>
                        <p className="text-sm">{requisition.question}</p>
                      </div>

                      {requisition.reply && (
                        <div className="p-3 bg-green-50 rounded-lg">
                          <p className="text-sm font-medium mb-2 text-green-800">Your Reply:</p>
                          <p className="text-sm text-green-700">{requisition.reply}</p>
                        </div>
                      )}

                      {requisition.status === "pending" && (
                        <>
                          {selectedRequisition === requisition.id ? (
                            <div className="space-y-3">
                              <Label htmlFor={`reply-${requisition.id}`}>Your Reply</Label>
                              <Textarea
                                id={`reply-${requisition.id}`}
                                placeholder="Type your reply to this requisition..."
                                value={reply}
                                onChange={(e) => setReply(e.target.value)}
                                rows={4}
                              />
                              <div className="flex gap-2">
                                <Button size="sm" onClick={() => handleReplySubmit(requisition.id)}>
                                  <Send className="h-4 w-4 mr-2" />
                                  Send Reply
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => setSelectedRequisition(null)}>
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <Button variant="outline" size="sm" onClick={() => setSelectedRequisition(requisition.id)}>
                              Reply to Requisition
                            </Button>
                          )}
                        </>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>
        )}

        {/* Original Tabs - Only show when no filter is active */}
        {activeFilter === "all" && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
              <TabsTrigger value="replied">Replied ({stats.replied})</TabsTrigger>
              <TabsTrigger value="all">All Requisitions</TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-4">
              {requisitions
                .filter((r) => r.status === "pending")
                .map((requisition) => (
                  <Card
                    key={requisition.id}
                    className={`border-l-4 border-l-yellow-500 ${requisition.fromBuyerConveyancer ? "bg-blue-50" : ""}`}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                          {requisition.title}
                          {requisition.fromBuyerConveyancer && (
                            <Badge variant="outline" className="text-xs">
                              From Buyer's Conveyancer
                            </Badge>
                          )}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant={requisition.priority === "high" ? "destructive" : "default"}>
                            {requisition.priority} priority
                          </Badge>
                          <Badge variant="secondary">
                            <Clock className="h-3 w-3 mr-1" />
                            Pending
                          </Badge>
                        </div>
                      </div>
                      <CardDescription>
                        Received: {new Date(requisition.receivedDate).toLocaleDateString()}
                        {requisition.referenceNumber && (
                          <span className="ml-2 font-mono text-xs">Ref: {requisition.referenceNumber}</span>
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-3 bg-grey-50 rounded-lg">
                        <p className="text-sm">{requisition.question}</p>
                      </div>

                      {selectedRequisition === requisition.id ? (
                        <div className="space-y-3">
                          <Label htmlFor={`reply-${requisition.id}`}>Your Reply</Label>
                          <Textarea
                            id={`reply-${requisition.id}`}
                            placeholder="Type your reply to this requisition..."
                            value={reply}
                            onChange={(e) => setReply(e.target.value)}
                            rows={4}
                          />
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => handleReplySubmit(requisition.id)}>
                              <Send className="h-4 w-4 mr-2" />
                              Send Reply
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => setSelectedRequisition(null)}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button variant="outline" size="sm" onClick={() => setSelectedRequisition(requisition.id)}>
                          Reply to Requisition
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
            </TabsContent>

            <TabsContent value="replied" className="space-y-4">
              {requisitions
                .filter((r) => r.status === "replied")
                .map((requisition) => (
                  <Card
                    key={requisition.id}
                    className={`border-l-4 border-l-green-500 ${requisition.fromBuyerConveyancer ? "bg-blue-50" : ""}`}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                          {requisition.title}
                          {requisition.fromBuyerConveyancer && (
                            <Badge variant="outline" className="text-xs">
                              From Buyer's Conveyancer
                            </Badge>
                          )}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant={requisition.priority === "high" ? "destructive" : "default"}>
                            {requisition.priority} priority
                          </Badge>
                          <Badge variant="default">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Replied
                          </Badge>
                        </div>
                      </div>
                      <CardDescription>
                        Received: {new Date(requisition.receivedDate).toLocaleDateString()} | Replied:{" "}
                        {requisition.repliedDate && new Date(requisition.repliedDate).toLocaleDateString()}
                        {requisition.referenceNumber && (
                          <span className="ml-2 font-mono text-xs">Ref: {requisition.referenceNumber}</span>
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-3 bg-grey-50 rounded-lg">
                        <p className="text-sm font-medium mb-2">Question:</p>
                        <p className="text-sm">{requisition.question}</p>
                      </div>
                      {requisition.reply && (
                        <div className="p-3 bg-green-50 rounded-lg">
                          <p className="text-sm font-medium mb-2 text-green-800">Your Reply:</p>
                          <p className="text-sm text-green-700">{requisition.reply}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
            </TabsContent>

            <TabsContent value="all" className="space-y-4">
              {requisitions.map((requisition) => (
                <Card
                  key={requisition.id}
                  className={`border-l-4 ${
                    requisition.status === "replied" ? "border-l-green-500" : "border-l-yellow-500"
                  } ${requisition.fromBuyerConveyancer ? "bg-blue-50" : ""}`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        {requisition.title}
                        {requisition.fromBuyerConveyancer && (
                          <Badge variant="outline" className="text-xs">
                            From Buyer's Conveyancer
                          </Badge>
                        )}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant={requisition.priority === "high" ? "destructive" : "default"}>
                          {requisition.priority} priority
                        </Badge>
                        <Badge variant={requisition.status === "replied" ? "default" : "secondary"}>
                          {requisition.status === "replied" ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Replied
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
                      Received: {new Date(requisition.receivedDate).toLocaleDateString()}
                      {requisition.repliedDate &&
                        ` | Replied: ${new Date(requisition.repliedDate).toLocaleDateString()}`}
                      {requisition.referenceNumber && (
                        <span className="ml-2 font-mono text-xs">Ref: {requisition.referenceNumber}</span>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 bg-grey-50 rounded-lg">
                      <p className="text-sm">{requisition.question}</p>
                    </div>
                    {requisition.reply && (
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="text-sm font-medium mb-2 text-green-800">Reply:</p>
                        <p className="text-sm text-green-700">{requisition.reply}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        )}

        {/* Standard Replies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Standard Reply Templates
            </CardTitle>
            <CardDescription>Pre-written replies for common completion requisitions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" className="h-auto p-4 text-left bg-transparent">
                <div>
                  <div className="font-medium">Vacant Possession</div>
                  <div className="text-sm text-grey-600">Standard confirmation of vacant possession</div>
                </div>
              </Button>

              <Button variant="outline" className="h-auto p-4 text-left bg-transparent">
                <div>
                  <div className="font-medium">Title Confirmation</div>
                  <div className="text-sm text-grey-600">Confirmation of no title changes</div>
                </div>
              </Button>

              <Button variant="outline" className="h-auto p-4 text-left bg-transparent">
                <div>
                  <div className="font-medium">Keys & Documents</div>
                  <div className="text-sm text-grey-600">Standard handover arrangements</div>
                </div>
              </Button>

              <Button variant="outline" className="h-auto p-4 text-left bg-transparent">
                <div>
                  <div className="font-medium">Completion Statement</div>
                  <div className="text-sm text-grey-600">Statement approval response</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Completion Checklist */}
        <Card>
          <CardHeader>
            <CardTitle>Pre-Completion Checklist</CardTitle>
            <CardDescription>Final items to complete before completion day</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                {
                  item: "All requisitions replied to",
                  completed: requisitions.every((r) => r.status === "replied"),
                  critical: true,
                },
                { item: "Completion statement agreed", completed: true, critical: true },
                { item: "Final searches completed", completed: true, critical: true },
                { item: "Keys prepared for handover", completed: false, critical: true },
                { item: "Relevant documents prepared", completed: false, critical: true },
                { item: "Client completion funds confirmed", completed: true, critical: false },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {item.completed ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Clock className="h-4 w-4 text-yellow-600" />
                    )}
                    <span className={`text-sm ${item.completed ? "text-grey-900" : "text-grey-600"}`}>{item.item}</span>
                    {item.critical && (
                      <Badge variant="destructive" className="text-xs">
                        Critical
                      </Badge>
                    )}
                  </div>
                  {!item.completed && (
                    <Button size="sm" variant="outline">
                      Complete
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

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
                <p className="font-medium text-amber-800">Response Timing</p>
                <p className="text-amber-700">
                  Requisitions should be replied to promptly, typically within 24-48 hours of receipt.
                </p>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="font-medium text-blue-800">Accuracy Important</p>
                <p className="text-blue-700">
                  Ensure all replies are accurate as they form part of the completion process and may affect completion.
                </p>
              </div>

              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="font-medium text-red-800">Completion Day</p>
                <p className="text-red-700">
                  All requisitions must be satisfactorily replied to before completion can proceed.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TransactionLayout>
  )
}
