"use client"

import TransactionLayout from "@/components/transaction-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { FileSignature, Clock, CheckCircle, AlertTriangle, Phone } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRealTime } from "@/contexts/real-time-context"
import { toast } from "@/hooks/use-toast"

export default function BuyerConveyancerContractExchangePage() {
  // Default states
  const defaultExchangeSteps = [
    {
      id: "pre-exchange-check",
      title: "Pre-Exchange Requirements Check",
      description: "Verify all pre-exchange requirements are completed",
      status: "active" as "pending" | "active" | "completed",
      critical: true,
      completedAt: null as Date | null,
    },
    {
      id: "coordinate-timing",
      title: "Coordinate Exchange Timing",
      description: "Agree exchange time with seller's conveyancer",
      status: "pending" as "pending" | "active" | "completed",
      critical: true,
      completedAt: null as Date | null,
    },
    {
      id: "deposit-confirmation",
      title: "Deposit Confirmation",
      description: "Confirm deposit funds are available and ready",
      status: "pending" as "pending" | "active" | "completed",
      critical: true,
      completedAt: null as Date | null,
    },
    {
      id: "exchange-call",
      title: "Exchange Call",
      description: "Formal telephone exchange with seller's conveyancer",
      status: "pending" as "pending" | "active" | "completed",
      critical: true,
      completedAt: null as Date | null,
    },
    {
      id: "contract-signing",
      title: "Contract Signing",
      description: "Confirm contracts are signed by both parties",
      status: "pending" as "pending" | "active" | "completed",
      critical: true,
      completedAt: null as Date | null,
    },
    {
      id: "post-exchange",
      title: "Post-Exchange Actions",
      description: "Complete immediate post-exchange requirements",
      status: "pending" as "pending" | "active" | "completed",
      critical: false,
      completedAt: null as Date | null,
    },
  ]

  const defaultChecklistItems = [
    {
      id: "buyer-contract-signed",
      title: "Contracts signed by buyer",
      description: "Buyer has signed the contract and returned it",
      category: "Legal",
      completed: true,
      critical: true,
      required: true,
      dueDate: "2024-04-20",
      completedAt: new Date("2024-04-18T10:30:00"),
      notes: "",
    },
    {
      id: "deposit-funds-confirmed",
      title: "Deposit funds confirmed",
      description: "Deposit funds are available and cleared",
      category: "Financial",
      completed: true,
      critical: true,
      required: true,
      dueDate: "2024-04-22",
      completedAt: new Date("2024-04-19T14:15:00"),
      notes: "",
    },
    {
      id: "mortgage-offer-place",
      title: "Mortgage offer in place",
      description: "Valid mortgage offer received and accepted",
      category: "Financial",
      completed: true,
      critical: true,
      required: true,
      dueDate: "2024-04-23",
      completedAt: new Date("2024-04-20T09:45:00"),
      notes: "",
    },
    {
      id: "searches-completed",
      title: "All searches completed",
      description: "Local authority, environmental, and other searches finished",
      category: "Legal",
      completed: true,
      critical: true,
      required: true,
      dueDate: "2024-04-21",
      completedAt: new Date("2024-04-19T16:20:00"),
      notes: "",
    },
    {
      id: "enquiries-answered",
      title: "Enquiries satisfactorily answered",
      description: "All pre-contract enquiries have been resolved",
      category: "Legal",
      completed: true,
      critical: true,
      required: true,
      dueDate: "2024-04-24",
      completedAt: new Date("2024-04-21T11:30:00"),
      notes: "",
    },
    {
      id: "seller-contract-signature",
      title: "Seller's contract signature pending",
      description: "Waiting for seller to sign their part of the contract",
      category: "Legal",
      completed: false,
      critical: true,
      required: true,
      dueDate: "2024-04-25",
      completedAt: null,
      notes: "",
    },
    {
      id: "completion-date-confirmation",
      title: "Final completion date confirmation",
      description: "Completion date agreed and confirmed by all parties",
      category: "Legal",
      completed: false,
      critical: true,
      required: true,
      dueDate: "2024-04-25",
      completedAt: null,
      notes: "",
    },
  ]

  // State variables
  const [exchangeStatus, setExchangeStatus] = useState<"preparing" | "ready" | "in-progress" | "completed">("preparing")
  const [exchangeReference, setExchangeReference] = useState<string>("")
  const [exchangeCompletedAt, setExchangeCompletedAt] = useState<Date | null>(null)
  const [proposedExchangeTime, setProposedExchangeTime] = useState("")
  const [depositAmount, setDepositAmount] = useState("")
  const [exchangeSteps, setExchangeSteps] = useState(defaultExchangeSteps)
  const [checklistItems, setChecklistItems] = useState(defaultChecklistItems)
  const [checklistFilter, setChecklistFilter] = useState<"all" | "pending" | "completed" | "critical">("all")
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [editingNote, setEditingNote] = useState("")
  const [showAddItem, setShowAddItem] = useState(false)
  const [newItemTitle, setNewItemTitle] = useState("")
  const [newItemDescription, setNewItemDescription] = useState("")
  const [newItemCategory, setNewItemCategory] = useState("Legal")
  const [newItemDueDate, setNewItemDueDate] = useState("")
  const [newItemCritical, setNewItemCritical] = useState(false)

  const { sendUpdate } = useRealTime()

  const totalSteps = exchangeSteps.length
  const completedSteps = exchangeSteps.filter((step) => step.status === "completed").length

  // Reset function
  const resetToDefaults = () => {
    setExchangeStatus("preparing")
    setExchangeReference("")
    setExchangeCompletedAt(null)
    setProposedExchangeTime("")
    setDepositAmount("")
    setExchangeSteps([...defaultExchangeSteps])
    setChecklistItems([...defaultChecklistItems])
    setChecklistFilter("all")
    setEditingItem(null)
    setEditingNote("")
    setShowAddItem(false)
    setNewItemTitle("")
    setNewItemDescription("")
    setNewItemCategory("Legal")
    setNewItemDueDate("")
    setNewItemCritical(false)

    // Clear localStorage
    localStorage.removeItem("buyer-conveyancer-exchange-state")
    localStorage.removeItem("buyer-conveyancer-checklist")
    localStorage.removeItem("contract-exchange-data")
  }

  // Listen for platform reset
  useEffect(() => {
    const handlePlatformReset = () => {
      resetToDefaults()
    }

    window.addEventListener("platform-reset", handlePlatformReset)
    return () => window.removeEventListener("platform-reset", handlePlatformReset)
  }, [])

  // Load saved state
  useEffect(() => {
    const saved = localStorage.getItem("buyer-conveyancer-exchange-state")
    if (saved) {
      try {
        const data = JSON.parse(saved)
        setExchangeStatus(data.exchangeStatus || "preparing")
        setExchangeReference(data.exchangeReference || "")
        setExchangeCompletedAt(data.exchangeCompletedAt ? new Date(data.exchangeCompletedAt) : null)
        setDepositAmount(data.depositAmount || "")
        if (data.exchangeSteps) {
          setExchangeSteps(
            data.exchangeSteps.map((step: any) => ({
              ...step,
              completedAt: step.completedAt ? new Date(step.completedAt) : null,
            })),
          )
        }
      } catch (error) {
        console.error("Error loading exchange state:", error)
      }
    }
  }, [])

  // Save state changes
  useEffect(() => {
    const data = {
      exchangeStatus,
      exchangeReference,
      exchangeCompletedAt,
      depositAmount,
      exchangeSteps,
    }
    localStorage.setItem("buyer-conveyancer-exchange-state", JSON.stringify(data))
  }, [exchangeStatus, exchangeReference, exchangeCompletedAt, depositAmount, exchangeSteps])

  // Load checklist state
  useEffect(() => {
    const savedChecklist = localStorage.getItem("buyer-conveyancer-checklist")
    if (savedChecklist) {
      try {
        const data = JSON.parse(savedChecklist)
        setChecklistItems(
          data.map((item: any) => ({
            ...item,
            completedAt: item.completedAt ? new Date(item.completedAt) : null,
          })),
        )
      } catch (error) {
        console.error("Error loading checklist:", error)
      }
    }
  }, [])

  // Save checklist changes
  useEffect(() => {
    localStorage.setItem("buyer-conveyancer-checklist", JSON.stringify(checklistItems))
  }, [checklistItems])

  // Filter checklist items
  const filteredChecklistItems = checklistItems.filter((item) => {
    switch (checklistFilter) {
      case "pending":
        return !item.completed
      case "completed":
        return item.completed
      case "critical":
        return item.critical
      default:
        return true
    }
  })

  // Checklist functions
  const toggleChecklistItem = (itemId: string) => {
    setChecklistItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const updated = {
            ...item,
            completed: !item.completed,
            completedAt: !item.completed ? new Date() : null,
          }

          if (!item.completed) {
            sendUpdate({
              type: "status_changed",
              stage: "contract-exchange",
              role: "buyer-conveyancer",
              title: "Checklist Item Completed",
              description: `${item.title} marked as complete`,
              data: { itemId, itemTitle: item.title },
            })

            toast({
              title: "Item Completed",
              description: `${item.title} has been marked as complete`,
            })
          }

          return updated
        }
        return item
      }),
    )
  }

  const saveItemNote = (itemId: string) => {
    setChecklistItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, notes: editingNote } : item)))
    setEditingItem(null)
    setEditingNote("")

    toast({
      title: "Note Saved",
      description: "Item note has been updated",
    })
  }

  const removeChecklistItem = (itemId: string) => {
    if (confirm("Are you sure you want to remove this item?")) {
      setChecklistItems((prev) => prev.filter((item) => item.id !== itemId))

      toast({
        title: "Item Removed",
        description: "Checklist item has been removed",
      })
    }
  }

  const addCustomItem = () => {
    if (!newItemTitle.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a title for the requirement",
        variant: "destructive",
      })
      return
    }

    const newItem = {
      id: `custom-${Date.now()}`,
      title: newItemTitle,
      description: newItemDescription,
      category: newItemCategory,
      completed: false,
      critical: newItemCritical,
      required: false,
      dueDate: newItemDueDate,
      completedAt: null,
      notes: "",
    }

    setChecklistItems((prev) => [...prev, newItem])
    resetNewItemForm()
    setShowAddItem(false)

    toast({
      title: "Item Added",
      description: `${newItemTitle} has been added to the checklist`,
    })
  }

  const resetNewItemForm = () => {
    setNewItemTitle("")
    setNewItemDescription("")
    setNewItemCategory("Legal")
    setNewItemDueDate("")
    setNewItemCritical(false)
  }

  const markAllComplete = () => {
    if (confirm("Are you sure you want to mark all items as complete?")) {
      setChecklistItems((prev) =>
        prev.map((item) => ({
          ...item,
          completed: true,
          completedAt: item.completed ? item.completedAt : new Date(),
        })),
      )

      toast({
        title: "All Items Completed",
        description: "All checklist items have been marked as complete",
      })
    }
  }

  const sendChecklistUpdate = () => {
    const completedCount = checklistItems.filter((item) => item.completed).length
    const totalCount = checklistItems.length

    sendUpdate({
      type: "status_changed",
      stage: "contract-exchange",
      role: "buyer-conveyancer",
      title: "Checklist Status Update",
      description: `Pre-exchange checklist: ${completedCount}/${totalCount} items completed`,
      data: { completedCount, totalCount, items: checklistItems },
    })

    toast({
      title: "Status Update Sent",
      description: "Checklist status has been shared with all parties",
    })
  }

  const exportChecklist = () => {
    const checklistData = checklistItems.map((item) => ({
      Title: item.title,
      Description: item.description,
      Category: item.category,
      Status: item.completed ? "Completed" : "Pending",
      Critical: item.critical ? "Yes" : "No",
      "Due Date": item.dueDate || "Not set",
      "Completed At": item.completedAt ? item.completedAt.toLocaleString() : "Not completed",
      Notes: item.notes || "None",
    }))

    console.log("Exporting checklist:", checklistData)

    toast({
      title: "Checklist Exported",
      description: "Checklist data has been prepared for export",
    })
  }

  const completeStep = (stepId: string) => {
    setExchangeSteps((prev) => {
      const updated = prev.map((step) => {
        if (step.id === stepId) {
          return { ...step, status: "completed" as const, completedAt: new Date() }
        }
        return step
      })

      // Activate next step
      const currentIndex = updated.findIndex((step) => step.id === stepId)
      if (currentIndex < updated.length - 1) {
        updated[currentIndex + 1].status = "active"
      }

      return updated
    })

    // Check if ready for exchange
    if (stepId === "pre-exchange-check") {
      setExchangeStatus("ready")
    }

    // Check if exchange is completed
    if (stepId === "post-exchange") {
      setExchangeStatus("completed")
      setExchangeCompletedAt(new Date())
      setExchangeReference(`EX${Date.now().toString().slice(-6)}`)
    }

    sendUpdate({
      type: "status_changed",
      stage: "contract-exchange",
      role: "buyer-conveyancer",
      title: "Exchange Step Completed",
      description: `${exchangeSteps.find((s) => s.id === stepId)?.title} completed`,
      data: { stepId },
    })

    toast({
      title: "Step Completed",
      description: `${exchangeSteps.find((s) => s.id === stepId)?.title} has been completed`,
    })
  }

  const proposeExchangeTime = () => {
    if (!proposedExchangeTime) {
      toast({
        title: "Time Required",
        description: "Please select a proposed exchange time",
        variant: "destructive",
      })
      return
    }

    completeStep("coordinate-timing")

    sendUpdate({
      type: "status_changed",
      stage: "contract-exchange",
      role: "buyer-conveyancer",
      title: "Exchange Time Proposed",
      description: `Proposed exchange time: ${new Date(proposedExchangeTime).toLocaleString()}`,
      data: { proposedTime: proposedExchangeTime },
    })
  }

  const confirmDeposit = () => {
    if (!depositAmount) {
      toast({
        title: "Deposit Amount Required",
        description: "Please enter the deposit amount",
        variant: "destructive",
      })
      return
    }

    completeStep("deposit-confirmation")

    sendUpdate({
      type: "status_changed",
      stage: "contract-exchange",
      role: "buyer-conveyancer",
      title: "Deposit Confirmed",
      description: `Deposit of £${depositAmount} confirmed and ready`,
      data: { depositAmount },
    })
  }

  const initiateExchangeCall = () => {
    setExchangeStatus("in-progress")

    // Simulate exchange call process
    setTimeout(() => {
      completeStep("exchange-call")
      setTimeout(() => {
        completeStep("contract-signing")
      }, 2000)
    }, 3000)

    sendUpdate({
      type: "status_changed",
      stage: "contract-exchange",
      role: "buyer-conveyancer",
      title: "Exchange Call Initiated",
      description: "Formal exchange call started with seller's conveyancer",
      data: { callStarted: new Date() },
    })

    toast({
      title: "Exchange Call Started",
      description: "Formal exchange process initiated with seller's conveyancer",
    })
  }

  const completeContractSigning = () => {
    completeStep("contract-signing")

    sendUpdate({
      type: "status_changed",
      stage: "contract-exchange",
      role: "buyer-conveyancer",
      title: "Contracts Signed",
      description: "Contracts have been signed by both parties",
      data: { contractsSigned: new Date() },
    })
  }

  const startExchangeProcess = () => {
    setExchangeStatus("in-progress")

    // Activate coordinate timing step
    setExchangeSteps((prev) =>
      prev.map((step) => (step.id === "coordinate-timing" ? { ...step, status: "active" } : step)),
    )

    toast({
      title: "Exchange Process Started",
      description: "Contract exchange process has been initiated",
    })
  }

  const contactSellerConveyancer = () => {
    toast({
      title: "Contacting Seller's Conveyancer",
      description: "Opening communication channel with Smith & Associates Solicitors",
    })
  }

  const cancelExchange = () => {
    if (confirm("Are you sure you want to cancel the exchange process? This action cannot be undone.")) {
      setExchangeStatus("ready")

      // Reset in-progress steps
      setExchangeSteps((prev) =>
        prev.map((step) => ({
          ...step,
          status: step.status === "completed" ? "completed" : "pending",
        })),
      )

      toast({
        title: "Exchange Cancelled",
        description: "The exchange process has been cancelled",
        variant: "destructive",
      })
    }
  }

  const handleContinueToTransactionFee = () => {
    // Mark exchange as completed
    setExchangeStatus("completed")
    setExchangeCompletedAt(new Date())
    setExchangeReference(`EX${Date.now().toString().slice(-6)}`)

    // Send comprehensive completion update
    sendUpdate({
      type: "contract_exchanged",
      stage: "contract-exchange",
      role: "buyer-conveyancer",
      title: "Contracts Exchanged Successfully",
      description: "Contract exchange has been completed - both parties are now legally committed to the transaction",
      data: {
        exchangeDate: new Date().toISOString(),
        completionDate: "2024-05-28",
        contractPrice: "£400,000",
        deposit: "£40,000 (10%)",
        exchangedBy: "buyer-conveyancer",
        exchangedAt: new Date().toISOString(),
        nextStage: "Transaction Fee",
        status: "completed",
        contractExchange: {
          exchangedBy: "buyer-conveyancer",
          exchangedAt: new Date().toISOString(),
          exchangeDate: new Date().toISOString(),
          completionDate: "2024-05-28",
          contractPrice: "£400,000",
          deposit: "£40,000 (10%)",
          status: "completed",
          nextStage: "Transaction Fee",
        },
      },
    })

    toast({
      title: "Exchange Completed",
      description: "Contract exchange completed successfully. All parties have been notified.",
    })
  }

  return (
    <TransactionLayout
      currentStage="contract-exchange"
      userRole="buyer-conveyancer"
      title="Contract Exchange"
      description="Coordinate the exchange of contracts between all parties"
    >
      <div className="space-y-6">
        {/* Enhanced Contract Exchange Workflow */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSignature className="h-5 w-5" />
              Contract Exchange Workflow
            </CardTitle>
            <CardDescription>Step-by-step contract exchange process coordination</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Current Status Banner */}
            <div
              className={`text-center p-4 rounded-lg border-2 ${
                exchangeStatus === "completed"
                  ? "bg-green-50 border-green-200"
                  : exchangeStatus === "in-progress"
                    ? "bg-blue-50 border-blue-200"
                    : exchangeStatus === "ready"
                      ? "bg-yellow-50 border-yellow-200"
                      : "bg-gray-50 border-gray-200"
              }`}
            >
              <div
                className={`text-xl font-bold mb-2 ${
                  exchangeStatus === "completed"
                    ? "text-green-700"
                    : exchangeStatus === "in-progress"
                      ? "text-blue-700"
                      : exchangeStatus === "ready"
                        ? "text-yellow-700"
                        : "text-gray-700"
                }`}
              >
                {exchangeStatus === "completed"
                  ? "Exchange Completed"
                  : exchangeStatus === "in-progress"
                    ? "Exchange in Progress"
                    : exchangeStatus === "ready"
                      ? "Ready for Exchange"
                      : "Preparing for Exchange"}
              </div>
              <div className="text-sm text-muted-foreground mb-3">
                {exchangeStatus === "completed"
                  ? `Completed on ${exchangeCompletedAt?.toLocaleDateString()} at ${exchangeCompletedAt?.toLocaleTimeString()}`
                  : exchangeStatus === "in-progress"
                    ? "Coordinating with seller's conveyancer"
                    : exchangeStatus === "ready"
                      ? "All pre-exchange requirements met"
                      : "Completing pre-exchange checklist"}
              </div>
              {exchangeStatus === "completed" && exchangeReference && (
                <Badge variant="secondary" className="text-sm">
                  Exchange Ref: {exchangeReference}
                </Badge>
              )}
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Exchange Progress</span>
                <span>{Math.round((completedSteps / totalSteps) * 100)}%</span>
              </div>
              <Progress value={(completedSteps / totalSteps) * 100} className="h-2" />
            </div>

            {/* Exchange Steps */}
            <div className="space-y-4">
              {exchangeSteps.map((step, index) => (
                <div
                  key={step.id}
                  className={`border rounded-lg p-4 transition-all ${
                    step.status === "completed"
                      ? "bg-green-50 border-green-200"
                      : step.status === "active"
                        ? "bg-blue-50 border-blue-200"
                        : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        step.status === "completed"
                          ? "bg-green-600 text-white"
                          : step.status === "active"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-400 text-white"
                      }`}
                    >
                      {step.status === "completed" ? <CheckCircle className="h-4 w-4" /> : index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{step.title}</h4>
                        {step.critical && <AlertTriangle className="h-4 w-4 text-red-500" />}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{step.description}</p>

                      {step.status === "completed" && step.completedAt && (
                        <p className="text-xs text-green-600">
                          Completed: {step.completedAt.toLocaleDateString()} at {step.completedAt.toLocaleTimeString()}
                        </p>
                      )}

                      {step.status === "active" && (
                        <div className="mt-3 space-y-2">
                          {step.id === "pre-exchange-check" && (
                            <Button onClick={() => completeStep("pre-exchange-check")} size="sm" className="mr-2">
                              Confirm Pre-Exchange Requirements
                            </Button>
                          )}

                          {step.id === "coordinate-timing" && (
                            <div className="space-y-2">
                              <div className="flex gap-2">
                                <input
                                  type="datetime-local"
                                  value={proposedExchangeTime}
                                  onChange={(e) => setProposedExchangeTime(e.target.value)}
                                  className="text-sm border rounded px-2 py-1"
                                />
                                <Button onClick={() => proposeExchangeTime()} size="sm">
                                  Propose Time
                                </Button>
                              </div>
                            </div>
                          )}

                          {step.id === "deposit-confirmation" && (
                            <div className="space-y-2">
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  placeholder="Deposit amount (£)"
                                  value={depositAmount}
                                  onChange={(e) => setDepositAmount(e.target.value)}
                                  className="text-sm border rounded px-2 py-1"
                                />
                                <Button onClick={() => confirmDeposit()} size="sm">
                                  Confirm Deposit
                                </Button>
                              </div>
                            </div>
                          )}

                          {step.id === "exchange-call" && (
                            <div className="space-y-2">
                              <Button onClick={() => initiateExchangeCall()} size="sm" className="mr-2">
                                <Phone className="h-4 w-4 mr-1" />
                                Initiate Exchange Call
                              </Button>
                              <p className="text-xs text-muted-foreground">
                                This will start the formal exchange process with seller's conveyancer
                              </p>
                            </div>
                          )}

                          {step.id === "contract-signing" && (
                            <Button onClick={() => completeContractSigning()} size="sm">
                              Confirm Contract Signed
                            </Button>
                          )}

                          {step.id === "post-exchange" && (
                            <Button onClick={() => completeStep("post-exchange")} size="sm">
                              Complete Post-Exchange Actions
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Exchange Summary (shown when completed) */}
            {exchangeStatus === "completed" && (
              <Card className="bg-green-50 border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-800 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Exchange Completed Successfully
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Exchange Reference:</span>
                      <p>{exchangeReference}</p>
                    </div>
                    <div>
                      <span className="font-medium">Exchange Date & Time:</span>
                      <p>
                        {exchangeCompletedAt?.toLocaleDateString()} at {exchangeCompletedAt?.toLocaleTimeString()}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium">Completion Date:</span>
                      <p>28th May 2024</p>
                    </div>
                    <div>
                      <span className="font-medium">Deposit Confirmed:</span>
                      <p>£{depositAmount || "40,000"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4 border-t">
              {exchangeStatus !== "completed" && (
                <>
                  <Button onClick={() => contactSellerConveyancer()} variant="outline" size="sm">
                    <Phone className="h-4 w-4 mr-1" />
                    Contact Seller's Conveyancer
                  </Button>
                  {exchangeStatus === "ready" && (
                    <Button onClick={() => startExchangeProcess()} size="sm">
                      Start Exchange Process
                    </Button>
                  )}
                  {exchangeStatus === "in-progress" && (
                    <Button onClick={() => cancelExchange()} variant="destructive" size="sm">
                      Cancel Exchange
                    </Button>
                  )}
                </>
              )}
              {exchangeStatus === "completed" && (
                <Button asChild onClick={handleContinueToTransactionFee}>
                  <Link href="/buyer-conveyancer/nutlip-transaction-fee">Continue to Transaction Fee</Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Pre-Exchange Checklist */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Pre-Exchange Checklist</span>
              <Badge variant="secondary">
                {checklistItems.filter((item) => item.completed).length}/{checklistItems.length} Complete
              </Badge>
            </CardTitle>
            <CardDescription>
              Essential requirements before exchange can proceed - click to mark complete
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Progress Overview */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Checklist Progress</span>
                <span>
                  {Math.round((checklistItems.filter((item) => item.completed).length / checklistItems.length) * 100)}%
                </span>
              </div>
              <Progress
                value={(checklistItems.filter((item) => item.completed).length / checklistItems.length) * 100}
                className="h-2"
              />
            </div>

            {/* Filter Options */}
            <div className="flex gap-2 mb-4">
              <Button
                variant={checklistFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setChecklistFilter("all")}
              >
                All ({checklistItems.length})
              </Button>
              <Button
                variant={checklistFilter === "pending" ? "default" : "outline"}
                size="sm"
                onClick={() => setChecklistFilter("pending")}
              >
                Pending ({checklistItems.filter((item) => !item.completed).length})
              </Button>
              <Button
                variant={checklistFilter === "completed" ? "default" : "outline"}
                size="sm"
                onClick={() => setChecklistFilter("completed")}
              >
                Completed ({checklistItems.filter((item) => item.completed).length})
              </Button>
              <Button
                variant={checklistFilter === "critical" ? "default" : "outline"}
                size="sm"
                onClick={() => setChecklistFilter("critical")}
              >
                Critical ({checklistItems.filter((item) => item.critical).length})
              </Button>
            </div>

            {/* Checklist Items */}
            <div className="space-y-3">
              {filteredChecklistItems.map((item) => (
                <div
                  key={item.id}
                  className={`border rounded-lg p-4 transition-all cursor-pointer hover:shadow-sm ${
                    item.completed
                      ? "bg-green-50 border-green-200"
                      : item.critical
                        ? "bg-red-50 border-red-200"
                        : "bg-white border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => toggleChecklistItem(item.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          item.completed ? "bg-green-600 border-green-600" : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        {item.completed && <CheckCircle className="h-3 w-3 text-white" />}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-sm font-medium ${item.completed ? "line-through text-gray-500" : ""}`}>
                          {item.title}
                        </span>
                        {item.critical && <AlertTriangle className="h-4 w-4 text-red-500" />}
                        <Badge variant="outline" className="text-xs">
                          {item.category}
                        </Badge>
                      </div>
                      <p className={`text-xs text-muted-foreground mb-2 ${item.completed ? "line-through" : ""}`}>
                        {item.description}
                      </p>

                      {item.dueDate && (
                        <div className="flex items-center gap-1 mb-2">
                          <Clock className="h-3 w-3 text-gray-400" />
                          <span
                            className={`text-xs ${
                              new Date(item.dueDate) < new Date() && !item.completed
                                ? "text-red-600 font-medium"
                                : "text-gray-500"
                            }`}
                          >
                            Due: {new Date(item.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}

                      {item.completed && item.completedAt && (
                        <p className="text-xs text-green-600">
                          ✓ Completed: {item.completedAt.toLocaleDateString()} at{" "}
                          {item.completedAt.toLocaleTimeString()}
                        </p>
                      )}

                      {item.notes && (
                        <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                          <strong>Notes:</strong> {item.notes}
                        </div>
                      )}

                      {/* Item Actions */}
                      <div className="flex gap-2 mt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            setEditingItem(item.id)
                          }}
                          className="h-6 px-2 text-xs"
                        >
                          {item.notes ? "Edit Note" : "Add Note"}
                        </Button>
                        {!item.required && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              removeChecklistItem(item.id)
                            }}
                            className="h-6 px-2 text-xs text-red-600 hover:text-red-700"
                          >
                            Remove
                          </Button>
                        )}
                      </div>

                      {/* Edit Note Form */}
                      {editingItem === item.id && (
                        <div className="mt-3 p-3 border rounded bg-white" onClick={(e) => e.stopPropagation()}>
                          <textarea
                            value={editingNote}
                            onChange={(e) => setEditingNote(e.target.value)}
                            placeholder="Add notes about this requirement..."
                            className="w-full text-xs border rounded p-2 resize-none"
                            rows={2}
                          />
                          <div className="flex gap-2 mt-2">
                            <Button size="sm" onClick={() => saveItemNote(item.id)} className="h-6 px-2 text-xs">
                              Save
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingItem(null)
                                setEditingNote("")
                              }}
                              className="h-6 px-2 text-xs"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {filteredChecklistItems.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">No items match the current filter</p>
                </div>
              )}
            </div>

            {/* Add Custom Item */}
            <div className="border-t pt-4">
              {showAddItem ? (
                <div className="space-y-3 p-4 border rounded-lg bg-gray-50">
                  <input
                    type="text"
                    placeholder="Requirement title..."
                    value={newItemTitle}
                    onChange={(e) => setNewItemTitle(e.target.value)}
                    className="w-full text-sm border rounded px-3 py-2"
                  />
                  <textarea
                    placeholder="Description (optional)..."
                    value={newItemDescription}
                    onChange={(e) => setNewItemDescription(e.target.value)}
                    className="w-full text-sm border rounded px-3 py-2 resize-none"
                    rows={2}
                  />
                  <div className="flex gap-2">
                    <select
                      value={newItemCategory}
                      onChange={(e) => setNewItemCategory(e.target.value)}
                      className="text-sm border rounded px-2 py-1"
                    >
                      <option value="Legal">Legal</option>
                      <option value="Financial">Financial</option>
                      <option value="Property">Property</option>
                      <option value="Documentation">Documentation</option>
                      <option value="Other">Other</option>
                    </select>
                    <input
                      type="date"
                      value={newItemDueDate}
                      onChange={(e) => setNewItemDueDate(e.target.value)}
                      className="text-sm border rounded px-2 py-1"
                    />
                    <label className="flex items-center gap-1 text-sm">
                      <input
                        type="checkbox"
                        checked={newItemCritical}
                        onChange={(e) => setNewItemCritical(e.target.checked)}
                      />
                      Critical
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={addCustomItem} size="sm">
                      Add Requirement
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setShowAddItem(false)
                        resetNewItemForm()
                      }}
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button variant="outline" onClick={() => setShowAddItem(true)} size="sm" className="w-full">
                  + Add Custom Requirement
                </Button>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 pt-4 border-t">
              <Button
                onClick={markAllComplete}
                variant="outline"
                size="sm"
                disabled={checklistItems.every((item) => item.completed)}
              >
                Mark All Complete
              </Button>
              <Button onClick={sendChecklistUpdate} variant="outline" size="sm">
                Send Status Update
              </Button>
              <Button onClick={exportChecklist} variant="outline" size="sm">
                Export Checklist
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Exchange Coordination */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Exchange Coordination
            </CardTitle>
            <CardDescription>Coordination with seller's conveyancer for simultaneous exchange</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Seller's Conveyancer</h4>
                <p className="text-sm text-muted-foreground">Smith & Associates Solicitors</p>
                <p className="text-sm text-muted-foreground">Sarah Johnson, Partner</p>
                <Badge variant="outline">Ready to Exchange</Badge>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Exchange Method</h4>
                <p className="text-sm text-muted-foreground">Telephone Exchange (Formula A)</p>
                <p className="text-sm text-muted-foreground">Scheduled for: 25th April 2024, 11:00 AM</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contract Details */}
        <Card>
          <CardHeader>
            <CardTitle>Contract Details</CardTitle>
            <CardDescription>Key terms and conditions for exchange</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Purchase Price</p>
                <p className="text-lg">£400,000</p>
              </div>
              <div>
                <p className="text-sm font-medium">Deposit Amount</p>
                <p className="text-lg">£40,000 (10%)</p>
              </div>
              <div>
                <p className="text-sm font-medium">Completion Date</p>
                <p className="text-lg">28th May 2024</p>
              </div>
              <div>
                <p className="text-sm font-medium">Contract Rate</p>
                <p className="text-lg">4% per annum</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk Warnings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Important Warnings
            </CardTitle>
            <CardDescription>Critical information about contract exchange</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="border-l-4 border-red-400 pl-4 py-2">
              <h4 className="font-medium text-sm">Legally Binding</h4>
              <p className="text-sm text-muted-foreground">
                Once contracts are exchanged, both parties are legally bound to complete the transaction
              </p>
            </div>
            <div className="border-l-4 border-yellow-400 pl-4 py-2">
              <h4 className="font-medium text-sm">Deposit at Risk</h4>
              <p className="text-sm text-muted-foreground">
                The deposit will be forfeited if the buyer fails to complete without valid reason
              </p>
            </div>
            <div className="border-l-4 border-blue-400 pl-4 py-2">
              <h4 className="font-medium text-sm">Completion Obligation</h4>
              <p className="text-sm text-muted-foreground">
                Completion must occur on the agreed date or penalty interest will apply
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button asChild onClick={handleContinueToTransactionFee}>
            <Link href="/buyer-conveyancer/nutlip-transaction-fee">Continue to Transaction Fee</Link>
          </Button>
          <Button variant="outline">Schedule Exchange Call</Button>
        </div>
      </div>
    </TransactionLayout>
  )
}
