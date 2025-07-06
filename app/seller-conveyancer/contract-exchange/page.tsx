"use client"

import { useState, useEffect } from "react"
import TransactionLayout from "@/components/transaction-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, Clock, AlertTriangle, FileText, Phone, PoundSterling } from "lucide-react"

export default function SellerConveyancerContractExchangePage() {
  const [exchangeDate, setExchangeDate] = useState("")
  const [completionDate, setCompletionDate] = useState("2024-04-15")
  const [depositAmount, setDepositAmount] = useState("30000")
  const [notes, setNotes] = useState("")
  const [exchangeCompleted, setExchangeCompleted] = useState(false)

  const [exchangeInProgress, setExchangeInProgress] = useState(false)
  const [exchangeCompletedDate, setExchangeCompletedDate] = useState("")
  const [exchangeCompletedTime, setExchangeCompletedTime] = useState("")
  const [stepInputs, setStepInputs] = useState<Record<string, string>>({})
  const [exchangeSteps, setExchangeSteps] = useState([
    {
      id: "pre-check",
      title: "Pre-Exchange Verification",
      description: "Verify all conditions are met",
      completed: true,
      active: false,
      actionLabel: "Verify",
      completedAt: "Today 09:30",
      requiresConfirmation: false,
    },
    {
      id: "contact-buyer",
      title: "Contact Buyer's Conveyancer",
      description: "Coordinate exchange details and timing",
      completed: false,
      active: true,
      actionLabel: "Call Now",
      details:
        "Contact the buyer's conveyancer to agree on exchange timing, completion date, and deposit arrangements.",
      requiresConfirmation: false,
      requiresInput: true,
      inputPlaceholder: "Enter buyer's conveyancer contact details or notes...",
    },
    {
      id: "agree-terms",
      title: "Agree Exchange Terms",
      description: "Confirm completion date and deposit amount",
      completed: false,
      active: false,
      actionLabel: "Confirm Terms",
      requiresConfirmation: true,
    },
    {
      id: "telephone-exchange",
      title: "Telephone Exchange",
      description: "Execute formal exchange using Law Society Formula",
      completed: false,
      active: false,
      actionLabel: "Execute Exchange",
      details: "Perform the formal telephone exchange using the Law Society Formula. Both parties must be on the line.",
      requiresConfirmation: true,
      warning: true,
    },
    {
      id: "confirm-exchange",
      title: "Confirm Exchange",
      description: "Record exchange details and send confirmations",
      completed: false,
      active: false,
      actionLabel: "Confirm",
      requiresConfirmation: true,
    },
    {
      id: "post-exchange",
      title: "Post-Exchange Actions",
      description: "Send contracts and arrange deposit transfer",
      completed: false,
      active: false,
      actionLabel: "Complete",
      details: "Send signed contract to buyer's conveyancer and arrange for deposit transfer within 24 hours.",
    },
  ])

  const [preExchangeChecklist, setPreExchangeChecklist] = useState([
    { item: "Contract approved by both parties", completed: true, critical: true },
    { item: "All enquiries satisfactorily answered", completed: true, critical: true },
    { item: "Mortgage offer in place and valid", completed: true, critical: true },
    { item: "Property searches completed", completed: true, critical: true },
    { item: "Deposit funds confirmed available", completed: true, critical: true },
    { item: "Client authority to exchange obtained", completed: true, critical: false },
    { item: "Insurance arrangements confirmed", completed: false, critical: false },
    { item: "Final title checks completed", completed: false, critical: true },
  ])

  // Reset functionality
  useEffect(() => {
    const handlePlatformReset = () => {
      // Reset all state to default values
      setExchangeDate("")
      setCompletionDate("2024-04-15")
      setDepositAmount("30000")
      setNotes("")
      setExchangeCompleted(false)
      setExchangeInProgress(false)
      setExchangeCompletedDate("")
      setExchangeCompletedTime("")
      setStepInputs({})

      // Reset exchange steps to default
      setExchangeSteps([
        {
          id: "pre-check",
          title: "Pre-Exchange Verification",
          description: "Verify all conditions are met",
          completed: true,
          active: false,
          actionLabel: "Verify",
          completedAt: "Today 09:30",
          requiresConfirmation: false,
        },
        {
          id: "contact-buyer",
          title: "Contact Buyer's Conveyancer",
          description: "Coordinate exchange details and timing",
          completed: false,
          active: true,
          actionLabel: "Call Now",
          details:
            "Contact the buyer's conveyancer to agree on exchange timing, completion date, and deposit arrangements.",
          requiresConfirmation: false,
          requiresInput: true,
          inputPlaceholder: "Enter buyer's conveyancer contact details or notes...",
        },
        {
          id: "agree-terms",
          title: "Agree Exchange Terms",
          description: "Confirm completion date and deposit amount",
          completed: false,
          active: false,
          actionLabel: "Confirm Terms",
          requiresConfirmation: true,
        },
        {
          id: "telephone-exchange",
          title: "Telephone Exchange",
          description: "Execute formal exchange using Law Society Formula",
          completed: false,
          active: false,
          actionLabel: "Execute Exchange",
          details:
            "Perform the formal telephone exchange using the Law Society Formula. Both parties must be on the line.",
          requiresConfirmation: true,
          warning: true,
        },
        {
          id: "confirm-exchange",
          title: "Confirm Exchange",
          description: "Record exchange details and send confirmations",
          completed: false,
          active: false,
          actionLabel: "Confirm",
          requiresConfirmation: true,
        },
        {
          id: "post-exchange",
          title: "Post-Exchange Actions",
          description: "Send contracts and arrange deposit transfer",
          completed: false,
          active: false,
          actionLabel: "Complete",
          details: "Send signed contract to buyer's conveyancer and arrange for deposit transfer within 24 hours.",
        },
      ])

      // Reset pre-exchange checklist to default
      setPreExchangeChecklist([
        { item: "Contract approved by both parties", completed: true, critical: true },
        { item: "All enquiries satisfactorily answered", completed: true, critical: true },
        { item: "Mortgage offer in place and valid", completed: true, critical: true },
        { item: "Property searches completed", completed: true, critical: true },
        { item: "Deposit funds confirmed available", completed: true, critical: true },
        { item: "Client authority to exchange obtained", completed: true, critical: false },
        { item: "Insurance arrangements confirmed", completed: false, critical: false },
        { item: "Final title checks completed", completed: false, critical: true },
      ])

      // Clear localStorage
      localStorage.removeItem("contractExchangeCompleted")
      localStorage.removeItem("contractExchangeDate")
      localStorage.removeItem("contractExchangeTime")
      localStorage.removeItem("exchangeSteps")
      localStorage.removeItem("seller-conveyancer-exchange-data")
    }

    // Listen for platform reset event
    window.addEventListener("platform-reset", handlePlatformReset)

    return () => {
      window.removeEventListener("platform-reset", handlePlatformReset)
    }
  }, [])

  const canStartExchange = exchangeSteps[0].completed && !exchangeInProgress
  const activeStep = exchangeSteps.find((step) => step.active && !step.completed)

  const handleStepAction = (stepId: string) => {
    const step = exchangeSteps.find((s) => s.id === stepId)
    if (!step) return

    if (step.requiresConfirmation) {
      if (confirm(`Are you sure you want to ${step.actionLabel.toLowerCase()}? This action cannot be undone.`)) {
        completeStep(stepId)
      }
    } else {
      completeStep(stepId)
    }
  }

  const completeStep = (stepId: string) => {
    const now = new Date()
    const timeString = now.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    })

    setExchangeSteps((prev) => {
      const updated = prev.map((step, index) => {
        if (step.id === stepId) {
          return {
            ...step,
            completed: true,
            active: false,
            completedAt: `Today ${timeString}`,
          }
        }
        // Activate next step
        if (prev[index - 1]?.id === stepId && !step.completed) {
          return { ...step, active: true }
        }
        return step
      })

      // Check if exchange is complete
      const allCompleted = updated.every((step) => step.completed)
      if (allCompleted && !exchangeCompleted) {
        setExchangeCompleted(true)
        setExchangeCompletedDate(now.toLocaleDateString("en-GB"))
        setExchangeCompletedTime(timeString)
        setExchangeInProgress(false)

        // Save to localStorage
        localStorage.setItem("contractExchangeCompleted", "true")
        localStorage.setItem("contractExchangeDate", now.toLocaleDateString("en-GB"))
        localStorage.setItem("contractExchangeTime", timeString)
      }

      return updated
    })

    // Save progress to localStorage
    localStorage.setItem("exchangeSteps", JSON.stringify(exchangeSteps))
  }

  const handleStartExchange = () => {
    setExchangeInProgress(true)
    // Activate first incomplete step
    setExchangeSteps((prev) => prev.map((step) => (!step.completed && !step.active ? { ...step, active: true } : step)))
  }

  const handleCancelExchange = () => {
    if (confirm("Are you sure you want to cancel the exchange process? All progress will be lost.")) {
      setExchangeInProgress(false)
      setExchangeSteps((prev) =>
        prev.map((step) => ({
          ...step,
          active: step.id === "contact-buyer",
          completed: step.id === "pre-check",
        })),
      )
    }
  }

  const handleContactBuyerConveyancer = () => {
    // Simulate opening communication
    alert("Opening communication with buyer's conveyancer...")
  }

  const handleCompleteChecklistItem = (index: number) => {
    setPreExchangeChecklist((prev) => prev.map((item, i) => (i === index ? { ...item, completed: true } : item)))
  }

  return (
    <TransactionLayout title="Contract Exchange" stage="contract-exchange" userRole="seller-conveyancer">
      <div className="space-y-6">
        {/* Enhanced Contract Exchange Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Contract Exchange Status
            </CardTitle>
            <CardDescription>Manage the contract exchange process step-by-step</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Progress Overview */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Exchange Progress</span>
                <span className="text-sm text-grey-600">
                  {Math.round((exchangeSteps.filter((step) => step.completed).length / exchangeSteps.length) * 100)}%
                  Complete
                </span>
              </div>
              <div className="w-full bg-grey-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${(exchangeSteps.filter((step) => step.completed).length / exchangeSteps.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Current Status Banner */}
            <div
              className={`flex items-center justify-between p-4 border rounded-lg transition-all duration-300 ${
                exchangeCompleted
                  ? "bg-green-50 border-green-200"
                  : exchangeInProgress
                    ? "bg-blue-50 border-blue-200"
                    : "bg-yellow-50 border-yellow-200"
              }`}
            >
              <div className="flex items-center gap-3">
                {exchangeCompleted ? (
                  <CheckCircle className="h-6 w-6 text-green-600" />
                ) : exchangeInProgress ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                ) : (
                  <Clock className="h-6 w-6 text-yellow-600" />
                )}
                <div>
                  <div className="font-medium text-lg">
                    {exchangeCompleted
                      ? "Contracts Successfully Exchanged"
                      : exchangeInProgress
                        ? "Exchange in Progress"
                        : "Ready for Contract Exchange"}
                  </div>
                  <div className="text-sm text-grey-600">
                    {exchangeCompleted
                      ? `Exchanged on ${exchangeCompletedDate} at ${exchangeCompletedTime}`
                      : exchangeInProgress
                        ? "Exchange process is currently underway"
                        : "All pre-exchange conditions have been satisfied"}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge
                  variant={exchangeCompleted ? "default" : exchangeInProgress ? "secondary" : "outline"}
                  className="text-sm"
                >
                  {exchangeCompleted ? "Completed" : exchangeInProgress ? "In Progress" : "Ready"}
                </Badge>
                {exchangeCompleted && (
                  <span className="text-xs text-grey-500">
                    Reference: EX{Math.random().toString(36).substr(2, 6).toUpperCase()}
                  </span>
                )}
              </div>
            </div>

            {/* Interactive Exchange Steps */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-grey-700 mb-3">Exchange Process Steps</h4>
              {exchangeSteps.map((step, index) => (
                <div
                  key={step.id}
                  className={`border rounded-lg p-4 transition-all duration-200 ${
                    step.completed
                      ? "bg-green-50 border-green-200"
                      : step.active
                        ? "bg-blue-50 border-blue-200 shadow-sm"
                        : "bg-grey-50 border-grey-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          step.completed
                            ? "bg-green-600 text-white"
                            : step.active
                              ? "bg-blue-600 text-white"
                              : "bg-grey-300 text-grey-600"
                        }`}
                      >
                        {step.completed ? "✓" : index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{step.title}</div>
                        <div className="text-sm text-grey-600">{step.description}</div>
                        {step.completedAt && (
                          <div className="text-xs text-green-600 mt-1">Completed: {step.completedAt}</div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {step.warning && <AlertTriangle className="h-4 w-4 text-amber-500" />}
                      {step.active && !step.completed && (
                        <Button
                          size="sm"
                          onClick={() => handleStepAction(step.id)}
                          disabled={exchangeInProgress && step.requiresConfirmation}
                        >
                          {step.actionLabel}
                        </Button>
                      )}
                      {step.completed && (
                        <Badge variant="outline" className="text-xs">
                          Done
                        </Badge>
                      )}
                    </div>
                  </div>

                  {step.active && step.details && (
                    <div className="mt-3 p-3 bg-white rounded border">
                      <div className="text-sm text-grey-700">{step.details}</div>
                      {step.requiresInput && (
                        <div className="mt-2 space-y-2">
                          <Input
                            placeholder={step.inputPlaceholder}
                            value={stepInputs[step.id] || ""}
                            onChange={(e) =>
                              setStepInputs((prev) => ({
                                ...prev,
                                [step.id]: e.target.value,
                              }))
                            }
                            className="text-sm"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            {!exchangeCompleted && (
              <div className="flex gap-2 pt-4 border-t">
                {!exchangeInProgress ? (
                  <>
                    <Button onClick={handleStartExchange} className="flex-1" disabled={!canStartExchange}>
                      <Phone className="h-4 w-4 mr-2" />
                      Start Exchange Process
                    </Button>
                    <Button variant="outline" onClick={handleContactBuyerConveyancer}>
                      <Phone className="h-4 w-4 mr-2" />
                      Call Buyer's Conveyancer
                    </Button>
                  </>
                ) : (
                  <Button variant="destructive" onClick={handleCancelExchange} className="flex-1">
                    Cancel Exchange
                  </Button>
                )}
              </div>
            )}

            {/* Exchange Summary */}
            {exchangeCompleted && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">Exchange Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-grey-600">Exchange Date:</span>
                    <div className="font-medium">{exchangeCompletedDate}</div>
                  </div>
                  <div>
                    <span className="text-grey-600">Exchange Time:</span>
                    <div className="font-medium">{exchangeCompletedTime}</div>
                  </div>
                  <div>
                    <span className="text-grey-600">Completion Date:</span>
                    <div className="font-medium">{completionDate}</div>
                  </div>
                  <div>
                    <span className="text-grey-600">Deposit Amount:</span>
                    <div className="font-medium">£{Number.parseInt(depositAmount).toLocaleString()}</div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Exchange Details */}
        <Card>
          <CardHeader>
            <CardTitle>Exchange Details</CardTitle>
            <CardDescription>Key information for the contract exchange</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="exchange-date">Exchange Date</Label>
                <Input
                  id="exchange-date"
                  type="date"
                  value={exchangeDate}
                  onChange={(e) => setExchangeDate(e.target.value)}
                  disabled={exchangeCompleted}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="completion-date">Completion Date</Label>
                <Input
                  id="completion-date"
                  type="date"
                  value={completionDate}
                  onChange={(e) => setCompletionDate(e.target.value)}
                  disabled={exchangeCompleted}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deposit-amount">Deposit Amount</Label>
                <div className="relative">
                  <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-grey-400" />
                  <Input
                    id="deposit-amount"
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="pl-10"
                    disabled={exchangeCompleted}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Purchase Price</Label>
                <div className="p-2 bg-grey-50 rounded border">
                  <span className="font-medium">£300,000</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pre-Exchange Checklist */}
        <Card>
          <CardHeader>
            <CardTitle>Pre-Exchange Checklist</CardTitle>
            <CardDescription>Ensure all conditions are met before exchange</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {preExchangeChecklist.map((req, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {req.completed ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Clock className="h-4 w-4 text-yellow-600" />
                    )}
                    <span className={`text-sm ${req.completed ? "text-grey-900" : "text-grey-600"}`}>{req.item}</span>
                    {req.critical && (
                      <Badge variant="destructive" className="text-xs">
                        Critical
                      </Badge>
                    )}
                  </div>
                  {!req.completed && (
                    <Button size="sm" variant="outline" onClick={() => handleCompleteChecklistItem(index)}>
                      Complete
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Exchange Process */}
        <Card>
          <CardHeader>
            <CardTitle>Exchange Process</CardTitle>
            <CardDescription>Steps to complete the contract exchange</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  1
                </div>
                <div>
                  <div className="font-medium">Coordinate with Buyer's Conveyancer</div>
                  <div className="text-sm text-grey-600">
                    Agree on exchange date, completion date, and deposit amount
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  2
                </div>
                <div>
                  <div className="font-medium">Telephone Exchange</div>
                  <div className="text-sm text-grey-600">Exchange contracts by telephone using Law Society Formula</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  3
                </div>
                <div>
                  <div className="font-medium">Post Exchange</div>
                  <div className="text-sm text-grey-600">Send signed contract and receive deposit within 24 hours</div>
                </div>
              </div>
            </div>

            {!exchangeCompleted && (
              <Button className="w-full" onClick={() => setExchangeCompleted(true)}>
                Complete Contract Exchange
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Exchange Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Exchange Notes</CardTitle>
            <CardDescription>Record important details about the exchange process</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="exchange-notes">Notes</Label>
              <Textarea
                id="exchange-notes"
                placeholder="Record details of exchange conversation, any special arrangements, or important observations..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
            </div>

            <Button>Save Notes</Button>
          </CardContent>
        </Card>

        {/* Critical Warnings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Critical Warnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="font-medium text-red-800">Legal Commitment</p>
                <p className="text-red-700">
                  Once contracts are exchanged, both parties are legally bound. Failure to complete will result in
                  significant financial penalties.
                </p>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="font-medium text-amber-800">Deposit Security</p>
                <p className="text-amber-700">
                  Ensure deposit funds are held in a designated client account and are immediately available for
                  transfer.
                </p>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="font-medium text-blue-800">Documentation</p>
                <p className="text-blue-700">
                  Keep detailed records of the exchange process including time, date, and all parties involved.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TransactionLayout>
  )
}
