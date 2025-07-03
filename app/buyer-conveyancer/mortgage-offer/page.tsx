"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import TransactionLayout from "@/components/transaction-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import { useRealTime } from "@/contexts/real-time-context"
import {
  CheckCircle,
  Clock,
  Home,
  FileText,
  Info,
  ArrowRight,
  Calendar,
  Building2,
  PoundSterling,
  Percent,
} from "lucide-react"

export default function BuyerConveyancerMortgageOfferPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { sendUpdate } = useRealTime()

  // Form states
  const [submitted, setSubmitted] = useState(false)
  const [mortgageNotApplicable, setMortgageNotApplicable] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Mortgage form data
  const [formData, setFormData] = useState({
    lenderName: "",
    loanAmount: "",
    interestRate: "",
    rateType: "fixed",
    termYears: "",
    monthlyPayment: "",
    depositAmount: "",
    mortgageType: "repayment",
    specialConditions: "",
    offerValidUntil: "",
    notes: "",
  })

  // Load saved state on component mount
  useEffect(() => {
    const savedSubmitted = localStorage.getItem("buyer-conveyancer-mortgage-submitted")
    const savedNotApplicable = localStorage.getItem("buyer-conveyancer-mortgage-not-applicable")
    const savedFormData = localStorage.getItem("buyer-conveyancer-mortgage-form")

    if (savedSubmitted === "true") {
      setSubmitted(true)
    }
    if (savedNotApplicable === "true") {
      setMortgageNotApplicable(true)
    }
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData))
    }
  }, [])

  // Listen for platform reset events
  useEffect(() => {
    const handlePlatformReset = () => {
      console.log("Platform reset detected, clearing buyer conveyancer mortgage offer data")

      // Reset all state
      setSubmitted(false)
      setMortgageNotApplicable(false)
      setIsSubmitting(false)
      setFormData({
        lenderName: "",
        loanAmount: "",
        interestRate: "",
        rateType: "fixed",
        termYears: "",
        monthlyPayment: "",
        depositAmount: "",
        mortgageType: "repayment",
        specialConditions: "",
        offerValidUntil: "",
        notes: "",
      })

      // Clear localStorage
      localStorage.removeItem("buyer-conveyancer-mortgage-submitted")
      localStorage.removeItem("buyer-conveyancer-mortgage-not-applicable")
      localStorage.removeItem("buyer-conveyancer-mortgage-form")

      toast({
        title: "Mortgage Offer Reset",
        description: "All mortgage data has been cleared and reset to default state.",
      })
    }

    window.addEventListener("platform-reset", handlePlatformReset)
    return () => window.removeEventListener("platform-reset", handlePlatformReset)
  }, [toast])

  const handleInputChange = (field: string, value: string) => {
    const updatedFormData = { ...formData, [field]: value }
    setFormData(updatedFormData)
    localStorage.setItem("buyer-conveyancer-mortgage-form", JSON.stringify(updatedFormData))
  }

  const handleSubmitMortgageOffer = async () => {
    // Validate required fields
    if (!formData.lenderName || !formData.loanAmount || !formData.interestRate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required mortgage details.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setSubmitted(true)
    localStorage.setItem("buyer-conveyancer-mortgage-submitted", "true")

    // Send real-time update
    sendUpdate({
      type: "stage_completed",
      stage: "mortgage-offer",
      role: "buyer-conveyancer",
      title: "Mortgage Offer Submitted",
      description: `Mortgage offer from ${formData.lenderName} for £${formData.loanAmount} submitted to seller conveyancer`,
      data: {
        mortgageOffer: {
          ...formData,
          status: "completed",
          submittedAt: new Date().toISOString(),
        },
      },
    })

    setIsSubmitting(false)

    toast({
      title: "Mortgage Offer Submitted! 🎉",
      description: `Mortgage offer from ${formData.lenderName} has been successfully submitted to the seller conveyancer.`,
    })
  }

  const handleMarkNotApplicable = async () => {
    setIsSubmitting(true)

    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setMortgageNotApplicable(true)
    localStorage.setItem("buyer-conveyancer-mortgage-not-applicable", "true")

    // Send real-time update
    sendUpdate({
      type: "stage_completed",
      stage: "mortgage-offer",
      role: "buyer-conveyancer",
      title: "Cash Purchase Confirmed",
      description: "This is a cash purchase - no mortgage offer required",
      data: {
        mortgageOffer: {
          status: "not_applicable",
          reason: "Cash purchase",
          submittedAt: new Date().toISOString(),
        },
      },
    })

    setIsSubmitting(false)

    toast({
      title: "Cash Purchase Confirmed",
      description: "Transaction marked as cash purchase - no mortgage offer required.",
    })
  }

  const handleContinueToCompletionDate = () => {
    router.push("/buyer-conveyancer/completion-date")
  }

  const getStatusBadge = () => {
    if (submitted) {
      return (
        <Badge className="bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Mortgage Offer Submitted
        </Badge>
      )
    }
    if (mortgageNotApplicable) {
      return (
        <Badge className="bg-blue-100 text-blue-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Cash Purchase
        </Badge>
      )
    }
    return (
      <Badge variant="secondary" className="bg-amber-100 text-amber-800">
        <Clock className="h-3 w-3 mr-1" />
        Awaiting Submission
      </Badge>
    )
  }

  return (
    <TransactionLayout currentStage="mortgage-offer" userRole="buyer-conveyancer">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Mortgage Offer</h1>
            <p className="text-muted-foreground">Submit the buyer's mortgage offer details</p>
          </div>
          {getStatusBadge()}
        </div>

        {/* Completion Status */}
        {(submitted || mortgageNotApplicable) && (
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <CheckCircle className="h-5 w-5" />
                {mortgageNotApplicable ? "Cash Purchase Confirmed" : "Mortgage Offer Submitted Successfully"}
              </CardTitle>
              <CardDescription>
                {mortgageNotApplicable
                  ? "This transaction has been confirmed as a cash purchase"
                  : "The mortgage offer has been submitted to the seller conveyancer"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {submitted && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white rounded-lg border border-green-200">
                  <div>
                    <div className="text-sm font-medium text-green-800">Lender</div>
                    <div className="font-semibold">{formData.lenderName}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-green-800">Loan Amount</div>
                    <div className="font-semibold">£{formData.loanAmount}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-green-800">Interest Rate</div>
                    <div className="font-semibold">
                      {formData.interestRate}% ({formData.rateType})
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-green-800">Term</div>
                    <div className="font-semibold">{formData.termYears} years</div>
                  </div>
                </div>
              )}

              {mortgageNotApplicable && (
                <div className="p-4 bg-white rounded-lg border border-blue-200">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-6 w-6 text-blue-600" />
                    <div>
                      <h4 className="font-semibold text-blue-900">Cash Purchase Transaction</h4>
                      <p className="text-sm text-blue-700">
                        No mortgage offer is required for this transaction as it is a cash purchase.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Mortgage Offer Form */}
        {!submitted && !mortgageNotApplicable && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Mortgage Offer Details
              </CardTitle>
              <CardDescription>Enter the buyer's mortgage offer information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Lender Information */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Lender Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="lenderName">Lender Name *</Label>
                    <Input
                      id="lenderName"
                      placeholder="e.g., Halifax, Nationwide, HSBC"
                      value={formData.lenderName}
                      onChange={(e) => handleInputChange("lenderName", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="loanAmount">Loan Amount *</Label>
                    <div className="relative">
                      <PoundSterling className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="loanAmount"
                        placeholder="e.g., 360000"
                        value={formData.loanAmount}
                        onChange={(e) => handleInputChange("loanAmount", e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Interest Rate & Terms */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Interest Rate & Terms</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="interestRate">Interest Rate *</Label>
                    <div className="relative">
                      <Input
                        id="interestRate"
                        placeholder="e.g., 4.5"
                        value={formData.interestRate}
                        onChange={(e) => handleInputChange("interestRate", e.target.value)}
                        className="pr-8"
                      />
                      <Percent className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <Label>Rate Type</Label>
                    <RadioGroup
                      value={formData.rateType}
                      onValueChange={(value) => handleInputChange("rateType", value)}
                      className="flex gap-4 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="fixed" id="fixed" />
                        <Label htmlFor="fixed">Fixed</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="variable" id="variable" />
                        <Label htmlFor="variable">Variable</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div>
                    <Label htmlFor="termYears">Term (Years)</Label>
                    <Input
                      id="termYears"
                      placeholder="e.g., 25"
                      value={formData.termYears}
                      onChange={(e) => handleInputChange("termYears", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Payment Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="monthlyPayment">Monthly Payment</Label>
                    <div className="relative">
                      <PoundSterling className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="monthlyPayment"
                        placeholder="e.g., 1850"
                        value={formData.monthlyPayment}
                        onChange={(e) => handleInputChange("monthlyPayment", e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="depositAmount">Deposit Amount</Label>
                    <div className="relative">
                      <PoundSterling className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="depositAmount"
                        placeholder="e.g., 90000"
                        value={formData.depositAmount}
                        onChange={(e) => handleInputChange("depositAmount", e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Mortgage Type</Label>
                    <RadioGroup
                      value={formData.mortgageType}
                      onValueChange={(value) => handleInputChange("mortgageType", value)}
                      className="flex gap-4 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="repayment" id="repayment" />
                        <Label htmlFor="repayment">Repayment</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="interest-only" id="interest-only" />
                        <Label htmlFor="interest-only">Interest Only</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Additional Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="offerValidUntil">Offer Valid Until</Label>
                    <Input
                      id="offerValidUntil"
                      type="date"
                      value={formData.offerValidUntil}
                      onChange={(e) => handleInputChange("offerValidUntil", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="specialConditions">Special Conditions</Label>
                    <Input
                      id="specialConditions"
                      placeholder="e.g., Subject to valuation"
                      value={formData.specialConditions}
                      onChange={(e) => handleInputChange("specialConditions", e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any additional information about the mortgage offer..."
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t">
                <Button
                  onClick={handleSubmitMortgageOffer}
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {isSubmitting ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4 mr-2" />
                      Submit Mortgage Offer
                    </>
                  )}
                </Button>

                <Button
                  onClick={handleMarkNotApplicable}
                  disabled={isSubmitting}
                  variant="outline"
                  className="flex-1 bg-transparent"
                >
                  {isSubmitting ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Building2 className="h-4 w-4 mr-2" />
                      Mark as Cash Purchase
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Important Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-600" />
              Important Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="font-medium text-blue-800">Mortgage Offer Submission</p>
                <p className="text-blue-700">
                  Submit the buyer's formal mortgage offer details to the seller conveyancer for review and approval.
                </p>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="font-medium text-amber-800">Cash Purchase Option</p>
                <p className="text-amber-700">
                  If this is a cash purchase, mark it as "Not Applicable" to skip the mortgage offer requirement.
                </p>
              </div>

              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="font-medium text-green-800">Next Steps</p>
                <p className="text-green-700">
                  {submitted || mortgageNotApplicable
                    ? "The mortgage stage is complete. You can now proceed to coordinate the completion date."
                    : "Complete the mortgage offer submission to proceed with the transaction."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Continue to Completion Date Button */}
        <Card className="border-2 border-dashed border-blue-300 bg-gradient-to-r from-blue-50 to-cyan-50">
          <CardContent className="p-6 text-center">
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Ready to Set Completion Date</h3>
                <p className="text-sm text-blue-700 mb-4">
                  You can coordinate the completion date with the seller conveyancer while working on the mortgage offer
                  in parallel. This helps streamline the transaction process.
                </p>
              </div>

              <div className="group">
                <Button
                  onClick={handleContinueToCompletionDate}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  <Calendar className="h-5 w-5 mr-2 group-hover:translate-x-1 transition-transform" />
                  Continue to Completion Date
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>

              <p className="text-xs text-blue-600">Coordinate completion timing with all parties involved</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </TransactionLayout>
  )
}
