"use client"

import { useState } from "react"
import TransactionLayout from "@/components/transaction-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CheckCircle, Clock, FileText, AlertTriangle, Calculator, Info } from "lucide-react"
import { useRealTime } from "@/contexts/real-time-context"

export default function SellerConveyancerNutlipTransactionFeePage() {
  const [notes, setNotes] = useState("")
  const [paymentReceived, setPaymentReceived] = useState(false)
  const [confirmationStatus, setConfirmationStatus] = useState<"pending" | "confirming" | "confirmed">("pending")
  const { sendUpdate } = useRealTime()

  // Property details - in real app this would come from transaction data
  const propertyOffer = 300000
  const feePercentage = 0.5
  const calculatedFee = (propertyOffer * feePercentage) / 100
  const vatAmount = calculatedFee * 0.2
  const totalFeeIncVat = calculatedFee + vatAmount

  const handleConfirmPayment = async () => {
    setConfirmationStatus("confirming")

    // Simulate server&#45;side confirmation delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Broadcast stage completion
    sendUpdate({
      type: "stage_completed",
      stage: "nutlip-transaction-fee",
      role: "seller-conveyancer",
      title: "Nutlip Transaction Fee Confirmed",
      description: "Seller conveyancer confirmed payment receipt.",
    })

    // Broadcast next stage start
    sendUpdate({
      type: "status_changed",
      stage: "replies-to-requisitions",
      role: "seller-conveyancer",
      title: "Replies to Requisitions Started",
      description: "Moving transaction to the next stage.",
    })

    setConfirmationStatus("confirmed")

    // Redirect after short delay
    setTimeout(() => {
      window.location.href = "/seller-conveyancer/replies-to-requisitions"
    }, 1500)
  }

  return (
    <TransactionLayout title="Nutlip Transaction Fee" stage="nutlip-transaction-fee" userRole="seller-conveyancer">
      <div className="space-y-6">
        {/* Payment Responsibility Notice */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-600" />
              Transaction Fee Information
            </CardTitle>
            <CardDescription>Important information about the Nutlip platform fee</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Payment Responsibility</h4>
              <p className="text-sm text-blue-700 mb-3">
                The Nutlip transaction fee is paid by the <strong>buyer's conveyancer</strong> through our secure Open
                Banking system. As the seller's conveyancer, you are not required to make any payment.
              </p>
              <p className="text-sm text-blue-700">
                This page is for your information and records only. You will be notified when the payment has been
                completed.
              </p>
            </div>
          </CardContent>
        </Card>

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

            {/* Payment Confirmation Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Payment Confirmation
                </CardTitle>
                <CardDescription>Confirm receipt of Nutlip transaction fee payment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">Payment Received from Buyer's Conveyancer</h4>
                  <p className="text-sm text-green-700 mb-3">
                    Nutlip has confirmed receipt of £{totalFeeIncVat.toLocaleString()} from the buyer's conveyancer.
                    Please confirm this payment to proceed to the next stage.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-green-700">
                    <CheckCircle className="h-4 w-4" />
                    <span>Payment Reference: NUT-{Date.now().toString().slice(-8)}</span>
                  </div>
                </div>

                {confirmationStatus === "pending" && (
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-blue-50 border-blue-200">
                    <div>
                      <div className="font-medium">Confirmation Required</div>
                      <div className="text-sm text-grey-600">Click to confirm payment and proceed to next stage</div>
                    </div>
                    <Button onClick={handleConfirmPayment} className="bg-green-600 hover:bg-green-700">
                      Confirm Payment Received
                    </Button>
                  </div>
                )}

                {confirmationStatus === "confirming" && (
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-yellow-50 border-yellow-200">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-yellow-600 animate-spin" />
                      <div>
                        <div className="font-medium">Confirming Payment...</div>
                        <div className="text-sm text-grey-600">
                          Processing confirmation and updating transaction status
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary">Processing</Badge>
                  </div>
                )}

                {confirmationStatus === "confirmed" && (
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50 border-green-200">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="font-medium">Payment Confirmed</div>
                        <div className="text-sm text-grey-600">Moving to Replies to Requisitions stage...</div>
                      </div>
                    </div>
                    <Badge className="bg-green-600">Confirmed</Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </CardContent>
        </Card>

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

                <div className="flex justify-between items-center p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <div>
                    <div className="font-bold">Total Fee (Inc. VAT)</div>
                    <div className="text-sm text-grey-600">Paid by buyer's conveyancer</div>
                  </div>
                  <span className="text-xl font-bold text-purple-900">£{totalFeeIncVat.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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

        {/* Client Communication */}
        <Card>
          <CardHeader>
            <CardTitle>Client Communication</CardTitle>
            <CardDescription>Record fee information for your client files</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">No Payment Required</h4>
              <p className="text-sm text-green-700 mb-3">
                Your client (the seller) is not responsible for the Nutlip transaction fee. This fee is paid by the
                buyer's conveyancer and will appear on the buyer's completion statement.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="client-notes">Notes for Client File</Label>
              <Textarea
                id="client-notes"
                placeholder="Record any discussions with your client about the transaction fee structure..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            <Button>Save Notes</Button>
          </CardContent>
        </Card>

        {/* Payment Notification */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Notifications</CardTitle>
            <CardDescription>You will be automatically notified when payment is completed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <div className="font-medium text-sm">Email Notification</div>
                  <div className="text-sm text-grey-600">Immediate email when payment is completed</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <div className="font-medium text-sm">Platform Update</div>
                  <div className="text-sm text-grey-600">Real-time status update on this page</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div>
                  <div className="font-medium text-sm">Transaction Progress</div>
                  <div className="text-sm text-grey-600">Automatic progression to next stage</div>
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
                <p className="font-medium text-blue-800">Payment Responsibility</p>
                <p className="text-blue-700">
                  The buyer's conveyancer is responsible for paying this fee. Your client (the seller) has no payment
                  obligation.
                </p>
              </div>

              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="font-medium text-green-800">Transaction Progression</p>
                <p className="text-green-700">
                  The transaction will automatically progress to the next stage once the fee payment is completed.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TransactionLayout>
  )
}
