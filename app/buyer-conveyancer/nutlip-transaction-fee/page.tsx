"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import TransactionLayout from "@/components/transaction-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useRealTime } from "@/contexts/real-time-context"
import {
  CheckCircle,
  Clock,
  CreditCard,
  FileText,
  AlertTriangle,
  Calculator,
  ArrowRight,
  Building2,
  Shield,
  Zap,
  Reply,
} from "lucide-react"

interface BankOption {
  id: string
  name: string
  logo: string
  processingTime: string
  fees: string
}

const bankOptions: BankOption[] = [
  {
    id: "hsbc",
    name: "HSBC",
    logo: "🏦",
    processingTime: "Instant",
    fees: "No fees",
  },
  {
    id: "barclays",
    name: "Barclays",
    logo: "🏛️",
    processingTime: "Instant",
    fees: "No fees",
  },
  {
    id: "lloyds",
    name: "Lloyds Bank",
    logo: "🐎",
    processingTime: "Instant",
    fees: "No fees",
  },
  {
    id: "natwest",
    name: "NatWest",
    logo: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    processingTime: "Instant",
    fees: "No fees",
  },
  {
    id: "santander",
    name: "Santander",
    logo: "🔴",
    processingTime: "Instant",
    fees: "No fees",
  },
  {
    id: "nationwide",
    name: "Nationwide",
    logo: "🏠",
    processingTime: "Instant",
    fees: "No fees",
  },
]

export default function BuyerConveyancerNutlipTransactionFeePage() {
  const router = useRouter()
  const { toast } = useToast()
  const { sendUpdate } = useRealTime()

  // Payment flow states
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "bank-selection" | "processing" | "paid">("pending")
  const [selectedBank, setSelectedBank] = useState<string>("")
  const [paymentNotes, setPaymentNotes] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  // Property details - in real app this would come from transaction data
  const propertyOffer = 300000
  const feePercentage = 0.5
  const calculatedFee = (propertyOffer * feePercentage) / 100
  const vatAmount = calculatedFee * 0.2
  const totalFeeIncVat = calculatedFee + vatAmount

  // Load saved state on component mount
  useEffect(() => {
    const savedStatus = localStorage.getItem("nutlip-payment-status")
    const savedBank = localStorage.getItem("nutlip-selected-bank")
    const savedNotes = localStorage.getItem("nutlip-payment-notes")

    if (savedStatus) {
      setPaymentStatus(savedStatus as any)
    }
    if (savedBank) {
      setSelectedBank(savedBank)
    }
    if (savedNotes) {
      setPaymentNotes(savedNotes)
    }
  }, [])

  // Listen for platform reset events
  useEffect(() => {
    const handlePlatformReset = () => {
      console.log("Platform reset detected, clearing Nutlip transaction fee data")

      // Reset all state
      setPaymentStatus("pending")
      setSelectedBank("")
      setPaymentNotes("")
      setIsProcessing(false)

      // Clear localStorage
      localStorage.removeItem("nutlip-payment-status")
      localStorage.removeItem("nutlip-selected-bank")
      localStorage.removeItem("nutlip-payment-notes")

      toast({
        title: "Transaction Fee Reset",
        description: "All payment data has been cleared and reset to default state.",
      })
    }

    window.addEventListener("platform-reset", handlePlatformReset)
    return () => window.removeEventListener("platform-reset", handlePlatformReset)
  }, [toast])

  const handleStartPayment = () => {
    setPaymentStatus("bank-selection")
    localStorage.setItem("nutlip-payment-status", "bank-selection")

    toast({
      title: "Payment Process Started",
      description: "Please select your bank to proceed with the secure payment.",
    })
  }

  const handleBankSelection = (bankId: string) => {
    setSelectedBank(bankId)
    localStorage.setItem("nutlip-selected-bank", bankId)

    const selectedBankData = bankOptions.find((bank) => bank.id === bankId)
    toast({
      title: "Bank Selected",
      description: `${selectedBankData?.name} selected for secure payment processing.`,
    })
  }

  const handleProcessPayment = async () => {
    if (!selectedBank) {
      toast({
        title: "Bank Selection Required",
        description: "Please select a bank before proceeding with payment.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    setPaymentStatus("processing")
    localStorage.setItem("nutlip-payment-status", "processing")

    // Save notes
    localStorage.setItem("nutlip-payment-notes", paymentNotes)

    const selectedBankData = bankOptions.find((bank) => bank.id === selectedBank)

    toast({
      title: "Processing Payment",
      description: `Connecting to ${selectedBankData?.name} for secure payment processing...`,
    })

    // Simulate payment processing
    setTimeout(() => {
      setPaymentStatus("paid")
      setIsProcessing(false)
      localStorage.setItem("nutlip-payment-status", "paid")

      // Send real-time update
      sendUpdate({
        type: "stage_completed",
        stage: "nutlip-transaction-fee",
        role: "buyer-conveyancer",
        title: "Transaction Fee Payment Completed",
        description: `Payment of £${totalFeeIncVat.toLocaleString()} completed successfully via ${selectedBankData?.name}`,
        data: {
          status: "completed",
          paymentAmount: totalFeeIncVat,
          bank: selectedBankData?.name,
          transactionId: `TXN-${Date.now()}`,
          paymentDate: new Date().toISOString(),
        },
      })

      toast({
        title: "Payment Successful! 🎉",
        description: `Transaction fee of £${totalFeeIncVat.toLocaleString()} paid successfully via ${selectedBankData?.name}.`,
      })
    }, 3000)
  }

  const handleContinueToRequisitions = () => {
    router.push("/buyer-conveyancer/replies-to-requisitions")
  }

  const getStatusBadge = () => {
    switch (paymentStatus) {
      case "pending":
        return (
          <Badge variant="secondary" className="bg-amber-100 text-amber-800">
            <Clock className="h-3 w-3 mr-1" />
            Payment Pending
          </Badge>
        )
      case "bank-selection":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <CreditCard className="h-3 w-3 mr-1" />
            Select Bank
          </Badge>
        )
      case "processing":
        return (
          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
            <Zap className="h-3 w-3 mr-1" />
            Processing
          </Badge>
        )
      case "paid":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Payment Complete
          </Badge>
        )
    }
  }

  return (
    <TransactionLayout currentStage="nutlip-transaction-fee" userRole="buyer-conveyancer">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Nutlip Transaction Fee</h1>
            <p className="text-muted-foreground">Process the platform transaction fee payment</p>
          </div>
          {getStatusBadge()}
        </div>

        {/* Property & Fee Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Transaction Fee Calculation
            </CardTitle>
            <CardDescription>Nutlip platform fee based on accepted property offer</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Property Details */}
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h4 className="font-medium text-purple-800 mb-2">Property Transaction Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-purple-700 mb-1">Property Address</div>
                  <div className="font-medium">123 Oak Avenue, London SW1A 1AA</div>
                </div>
                <div>
                  <div className="text-sm text-purple-700 mb-1">Accepted Offer</div>
                  <div className="font-bold text-lg">£{propertyOffer.toLocaleString()}</div>
                </div>
              </div>
            </div>

            {/* Fee Calculation */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-sm text-blue-800 mb-1">Fee Rate</div>
                <div className="text-2xl font-bold text-blue-900">{feePercentage}%</div>
                <div className="text-xs text-blue-700">Of accepted offer</div>
              </div>

              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-sm text-green-800 mb-1">Base Fee</div>
                <div className="text-2xl font-bold text-green-900">£{calculatedFee.toLocaleString()}</div>
                <div className="text-xs text-green-700">Excl. VAT</div>
              </div>

              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="text-sm text-orange-800 mb-1">VAT (20%)</div>
                <div className="text-2xl font-bold text-orange-900">£{vatAmount.toLocaleString()}</div>
                <div className="text-xs text-orange-700">Added to base fee</div>
              </div>

              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="text-sm text-purple-800 mb-1">Total Fee</div>
                <div className="text-2xl font-bold text-purple-900">£{totalFeeIncVat.toLocaleString()}</div>
                <div className="text-xs text-purple-700">Inc. VAT</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Status */}
        {paymentStatus === "pending" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Secure Payment Processing
              </CardTitle>
              <CardDescription>Process the transaction fee using Open Banking</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="h-6 w-6 text-blue-600" />
                  <div>
                    <h4 className="font-semibold text-blue-900">Secure Open Banking Payment</h4>
                    <p className="text-sm text-blue-700">
                      Your payment is processed securely through your bank's own systems
                    </p>
                  </div>
                </div>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Bank-grade security and encryption</li>
                  <li>• No card details required</li>
                  <li>• Instant payment confirmation</li>
                  <li>• Full transaction transparency</li>
                </ul>
              </div>

              <div className="text-center">
                <Button onClick={handleStartPayment} size="lg" className="bg-purple-600 hover:bg-purple-700">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Start Secure Payment Process
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Bank Selection */}
        {paymentStatus === "bank-selection" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Select Your Bank
              </CardTitle>
              <CardDescription>Choose your bank for secure Open Banking payment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bankOptions.map((bank) => (
                  <div
                    key={bank.id}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      selectedBank === bank.id
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:border-purple-300"
                    }`}
                    onClick={() => handleBankSelection(bank.id)}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{bank.logo}</span>
                      <div>
                        <h4 className="font-semibold">{bank.name}</h4>
                        <p className="text-sm text-gray-600">{bank.processingTime}</p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">{bank.fees}</div>
                  </div>
                ))}
              </div>

              {selectedBank && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="payment-notes">Payment Notes (Optional)</Label>
                    <Textarea
                      id="payment-notes"
                      placeholder="Add any notes about this payment..."
                      value={paymentNotes}
                      onChange={(e) => setPaymentNotes(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div className="text-center">
                    <Button
                      onClick={handleProcessPayment}
                      size="lg"
                      disabled={isProcessing}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      {isProcessing ? (
                        <>
                          <Zap className="h-5 w-5 mr-2 animate-spin" />
                          Processing Payment...
                        </>
                      ) : (
                        <>
                          <CreditCard className="h-5 w-5 mr-2" />
                          Process Payment - £{totalFeeIncVat.toLocaleString()}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Processing Status */}
        {paymentStatus === "processing" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 animate-spin" />
                Processing Payment
              </CardTitle>
              <CardDescription>Securely processing your payment through Open Banking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="animate-pulse">
                  <div className="h-16 w-16 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <CreditCard className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">Processing Your Payment</h3>
                <p className="text-gray-600 mb-4">
                  Please wait while we securely process your payment through{" "}
                  {bankOptions.find((bank) => bank.id === selectedBank)?.name}
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                  <p className="text-sm text-blue-700">
                    <Shield className="h-4 w-4 inline mr-1" />
                    Your payment is being processed securely through your bank's systems
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payment Complete */}
        {paymentStatus === "paid" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <CheckCircle className="h-5 w-5" />
                Payment Completed Successfully
              </CardTitle>
              <CardDescription>The Nutlip transaction fee has been successfully processed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-green-800 mb-1">Payment Amount</div>
                    <div className="font-bold">£{totalFeeIncVat.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-green-800 mb-1">Payment Method</div>
                    <div className="font-bold">
                      {bankOptions.find((bank) => bank.id === selectedBank)?.name} (Open Banking)
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-green-800 mb-1">Transaction ID</div>
                    <div className="font-bold">TXN-{Date.now()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-green-800 mb-1">Payment Date</div>
                    <div className="font-bold">{new Date().toLocaleDateString()}</div>
                  </div>
                </div>
              </div>

              {paymentNotes && (
                <div className="p-4 bg-gray-50 border rounded-lg">
                  <h4 className="font-medium mb-2">Payment Notes</h4>
                  <p className="text-sm text-gray-700">{paymentNotes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Service Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Services Provided
            </CardTitle>
            <CardDescription>What the Nutlip platform fee covers for this transaction</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Digital transaction management</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Real-time progress tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Secure document sharing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Automated notifications</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Multi-party coordination</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Deadline management</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">24/7 platform access</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Customer support</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              Important Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="font-medium text-amber-800">Fee Structure</p>
                <p className="text-amber-700">
                  The Nutlip transaction fee is calculated at 0.5% of the accepted property offer (£
                  {propertyOffer.toLocaleString()}), plus VAT.
                </p>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="font-medium text-blue-800">Open Banking Security</p>
                <p className="text-blue-700">
                  All payments are processed through your bank's secure systems using Open Banking technology. No card
                  details are stored or processed by Nutlip.
                </p>
              </div>

              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="font-medium text-green-800">Transaction Progress</p>
                <p className="text-green-700">
                  {paymentStatus === "paid"
                    ? "Payment completed successfully. The transaction can now proceed to the final stages."
                    : "Complete the payment to proceed with the transaction to the final completion stages."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Continue to Requisitions Button */}
        <Card className="border-2 border-dashed border-purple-300 bg-gradient-to-r from-purple-50 to-indigo-50">
          <CardContent className="p-6 text-center">
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <div className="p-3 bg-purple-100 rounded-full">
                  <Reply className="h-6 w-6 text-purple-600" />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-purple-900 mb-2">Ready for Replies to Requisitions</h3>
                <p className="text-sm text-purple-700 mb-4">
                  {paymentStatus === "paid"
                    ? "Payment completed successfully! You can now proceed to handle completion requisitions and responses."
                    : "You can proceed to the requisitions stage while the payment processes in parallel."}
                </p>
              </div>

              <div className="group">
                <Button
                  onClick={handleContinueToRequisitions}
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  <Reply className="h-5 w-5 mr-2 group-hover:translate-x-1 transition-transform" />
                  Continue to Requisitions
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>

              <p className="text-xs text-purple-600">
                Handle completion requisitions and coordinate final transaction steps
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </TransactionLayout>
  )
}
