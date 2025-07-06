"use client"

import { useState } from "react"
import { TransactionLayout } from "@/components/transaction-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { CheckCircle, Clock, AlertTriangle, Building2, Shield, ArrowRight, Check, Calculator } from "lucide-react"
import { useRealTime } from "@/contexts/real-time-context"

const banks = [
  { name: "Barclays", logo: "🏦", color: "bg-blue-600" },
  { name: "HSBC", logo: "🏛️", color: "bg-red-600" },
  { name: "Lloyds Banking Group", logo: "🏪", color: "bg-green-600" },
  { name: "NatWest", logo: "🏢", color: "bg-purple-600" },
  { name: "Santander", logo: "🏦", color: "bg-red-500" },
  { name: "TSB", logo: "🏛️", color: "bg-blue-500" },
  { name: "Halifax", logo: "🏪", color: "bg-blue-700" },
  { name: "Nationwide", logo: "🏢", color: "bg-blue-800" },
  { name: "Metro Bank", logo: "🏦", color: "bg-purple-500" },
  { name: "Monzo", logo: "🏛️", color: "bg-pink-500" },
  { name: "Starling Bank", logo: "🏪", color: "bg-teal-600" },
  { name: "First Direct", logo: "🏢", color: "bg-orange-600" },
]

export default function BuyerConveyancerNutlipTransactionFeePage() {
  const { sendUpdate } = useRealTime()
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "bank-selection" | "processing" | "paid">("pending")
  const [selectedBank, setSelectedBank] = useState<string>("")
  const [notes, setNotes] = useState("")
  const [clientReference, setClientReference] = useState("NUTLIP-2024-BC-789")

  // Property details - in real app this would come from transaction data
  const propertyOffer = 300000
  const feePercentage = 0.5
  const calculatedFee = (propertyOffer * feePercentage) / 100
  const vatAmount = calculatedFee * 0.2
  const totalFeeIncVat = calculatedFee + vatAmount

  const handleBankSelection = (bankName: string) => {
    setSelectedBank(bankName)
  }

  const handlePayment = () => {
    if (selectedBank) {
      setPaymentStatus("processing")

      // Send real-time update that payment is processing
      sendUpdate({
        type: "status_changed",
        stage: "nutlip-transaction-fee",
        role: "buyer-conveyancer",
        title: "Payment Processing Started",
        description: `Nutlip transaction fee payment of £${totalFeeIncVat.toLocaleString()} is being processed via ${selectedBank}`,
        data: {
          paymentAmount: totalFeeIncVat,
          bank: selectedBank,
          status: "processing",
        },
      })

      // Simulate payment processing
      setTimeout(() => {
        setPaymentStatus("paid")

        // Send real-time update that payment is completed
        sendUpdate({
          type: "stage_completed",
          stage: "nutlip-transaction-fee",
          role: "buyer-conveyancer",
          title: "Payment Completed Successfully",
          description: `Nutlip transaction fee of £${totalFeeIncVat.toLocaleString()} has been successfully paid via ${selectedBank}`,
          data: {
            paymentAmount: totalFeeIncVat,
            bank: selectedBank,
            status: "completed",
            transactionId: `NUT-${Date.now().toString().slice(-8)}`,
            paymentDate: new Date().toISOString(),
          },
        })
      }, 3000)
    }
  }

  return (
    <TransactionLayout
      currentStage="nutlip-transaction-fee"
      userRole="buyer-conveyancer"
      title="Nutlip Transaction Fee Payment"
      description="Process payment for Nutlip platform transaction services"
    >
      <div className="space-y-6">
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
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Property Transaction Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-blue-700 mb-1">Property Address</div>
                  <div className="font-medium">123 Oak Avenue, London SW1A 1AA</div>
                </div>
                <div>
                  <div className="text-sm text-blue-700 mb-1">Accepted Offer</div>
                  <div className="font-bold text-lg">£{propertyOffer.toLocaleString()}</div>
                </div>
              </div>
            </div>

            {/* Fee Calculation */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="text-sm text-purple-800 mb-1">Fee Rate</div>
                <div className="text-2xl font-bold text-purple-900">{feePercentage}%</div>
                <div className="text-xs text-purple-700">Of accepted offer</div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-sm text-blue-800 mb-1">Base Fee</div>
                <div className="text-2xl font-bold text-blue-900">£{calculatedFee.toLocaleString()}</div>
                <div className="text-xs text-blue-700">Excl. VAT</div>
              </div>

              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="text-sm text-orange-800 mb-1">VAT (20%)</div>
                <div className="text-2xl font-bold text-orange-900">£{vatAmount.toLocaleString()}</div>
                <div className="text-xs text-orange-700">Added to base fee</div>
              </div>

              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-sm text-green-800 mb-1">Total Due</div>
                <div className="text-2xl font-bold text-green-900">£{totalFeeIncVat.toLocaleString()}</div>
                <div className="text-xs text-green-700">Inc. VAT</div>
              </div>
            </div>

            <div
              className={`flex items-center justify-between p-4 border rounded-lg ${
                paymentStatus === "paid"
                  ? "bg-green-50 border-green-200"
                  : paymentStatus === "processing"
                    ? "bg-yellow-50 border-yellow-200"
                    : "bg-grey-50 border-grey-200"
              }`}
            >
              <div className="flex items-center gap-3">
                {paymentStatus === "paid" ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <Clock className="h-5 w-5 text-yellow-600" />
                )}
                <div>
                  <div className="font-medium">
                    {paymentStatus === "paid"
                      ? "Payment Completed"
                      : paymentStatus === "processing"
                        ? "Payment Processing"
                        : "Payment Required"}
                  </div>
                  <div className="text-sm text-grey-600">
                    {paymentStatus === "paid"
                      ? "Transaction fee successfully paid"
                      : paymentStatus === "processing"
                        ? "Connecting to your bank..."
                        : "Payment required to proceed"}
                  </div>
                </div>
              </div>
              <Badge
                variant={
                  paymentStatus === "paid" ? "default" : paymentStatus === "processing" ? "secondary" : "outline"
                }
              >
                {paymentStatus === "paid" ? "Paid" : paymentStatus === "processing" ? "Processing" : "Pending"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Open Banking Payment System */}
        {paymentStatus !== "paid" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Secure Open Banking Payment
              </CardTitle>
              <CardDescription>
                Pay securely through your bank using Open Banking. Your payment details are never stored.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Security Notice */}
              <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                <Shield className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-medium text-green-800">Bank-Grade Security</div>
                  <div className="text-sm text-green-700">
                    Payments are processed directly through your bank's secure systems
                  </div>
                </div>
              </div>

              {/* Payment Reference */}
              <div className="space-y-2">
                <Label htmlFor="payment-reference">Payment Reference</Label>
                <Input
                  id="payment-reference"
                  value={clientReference}
                  onChange={(e) => setClientReference(e.target.value)}
                  placeholder="Enter payment reference"
                />
                <p className="text-xs text-grey-600">This reference will appear on your bank statement</p>
              </div>

              {/* Bank Selection */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-3">Select Your Bank</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {banks.map((bank) => (
                      <button
                        key={bank.name}
                        onClick={() => handleBankSelection(bank.name)}
                        className={`p-4 border-2 rounded-lg transition-all hover:shadow-md ${
                          selectedBank === bank.name
                            ? "border-blue-500 bg-blue-50"
                            : "border-grey-200 hover:border-grey-300"
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-2xl mb-2">{bank.logo}</div>
                          <div className="text-sm font-medium">{bank.name}</div>
                          {selectedBank === bank.name && <Check className="h-4 w-4 text-blue-600 mx-auto mt-2" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {selectedBank && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Selected Bank: {selectedBank}</div>
                        <div className="text-sm text-grey-600">You'll be redirected to your bank's secure login</div>
                      </div>
                      <Button onClick={handlePayment} className="flex items-center gap-2">
                        Pay £{totalFeeIncVat.toLocaleString()}
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {paymentStatus === "processing" && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-600"></div>
                    <div>
                      <div className="font-medium text-yellow-800">Processing Payment</div>
                      <div className="text-sm text-yellow-700">
                        Please complete the payment in your {selectedBank} banking app or browser window
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Fee Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Fee Breakdown</CardTitle>
            <CardDescription>Detailed breakdown of the Nutlip transaction services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Digital Transaction Management</div>
                    <div className="text-sm text-grey-600">End-to-end transaction coordination platform</div>
                  </div>
                  <span className="font-bold">£{(calculatedFee * 0.6).toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Document Management System</div>
                    <div className="text-sm text-grey-600">Secure document storage and sharing</div>
                  </div>
                  <span className="font-bold">£{(calculatedFee * 0.2).toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Communication & Notifications</div>
                    <div className="text-sm text-grey-600">Multi-party messaging and real-time updates</div>
                  </div>
                  <span className="font-bold">£{(calculatedFee * 0.15).toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Compliance & Support</div>
                    <div className="text-sm text-grey-600">Regulatory compliance and customer support</div>
                  </div>
                  <span className="font-bold">£{(calculatedFee * 0.05).toLocaleString()}</span>
                </div>

                <hr className="my-2" />

                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Subtotal (Excl. VAT)</div>
                    <div className="text-sm text-grey-600">Base platform fee</div>
                  </div>
                  <span className="font-bold">£{calculatedFee.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">VAT (20%)</div>
                    <div className="text-sm text-grey-600">Value Added Tax</div>
                  </div>
                  <span className="font-bold">£{vatAmount.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div>
                    <div className="font-bold">Total Fee (Inc. VAT)</div>
                    <div className="text-sm text-grey-600">Payable by buyer conveyancer</div>
                  </div>
                  <span className="text-xl font-bold text-blue-900">£{totalFeeIncVat.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Confirmation */}
        {paymentStatus === "paid" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <CheckCircle className="h-5 w-5" />
                Payment Successful
              </CardTitle>
              <CardDescription>Your Nutlip transaction fee has been successfully processed</CardDescription>
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
                    <div className="font-bold">{selectedBank} - Open Banking</div>
                  </div>
                  <div>
                    <div className="text-sm text-green-800 mb-1">Transaction ID</div>
                    <div className="font-bold">NUT-{Date.now().toString().slice(-8)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-green-800 mb-1">Payment Date</div>
                    <div className="font-bold">{new Date().toLocaleDateString()}</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline">Download Receipt</Button>
                <Button variant="outline">Email Receipt</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Client Communication */}
        <Card>
          <CardHeader>
            <CardTitle>Client Communication</CardTitle>
            <CardDescription>Record payment details for client billing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Client Billing</h4>
              <p className="text-sm text-blue-700 mb-3">
                This fee will be added to your client's completion statement as a disbursement.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="billing-notes">Notes for Client File</Label>
              <Textarea
                id="billing-notes"
                placeholder="Record payment details and any client discussions..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            <Button>Save to Client File</Button>
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
                <p className="font-medium text-amber-800">Fee Calculation</p>
                <p className="text-amber-700">
                  The Nutlip transaction fee is calculated at 0.5% of the accepted property offer (£
                  {propertyOffer.toLocaleString()}), plus VAT.
                </p>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="font-medium text-blue-800">Payment Responsibility</p>
                <p className="text-blue-700">
                  As the buyer's conveyancer, you are responsible for paying the Nutlip transaction fee and adding it to
                  your client's completion statement as a disbursement.
                </p>
              </div>

              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="font-medium text-green-800">Secure Payment</p>
                <p className="text-green-700">
                  All payments are processed through Open Banking with bank-grade security. No card details are stored.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TransactionLayout>
  )
}
