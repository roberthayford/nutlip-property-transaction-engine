"use client"

import TransactionLayout from "@/components/transaction-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Upload, CheckCircle, AlertCircle } from "lucide-react"
import { useRealTime } from "@/contexts/real-time-context"
import { RealTimeActivityFeed } from "@/components/real-time-activity-feed"

export default function BuyerProofOfFundsPage() {
  const { sendUpdate } = useRealTime()

  const handleDocumentUpload = () => {
    sendUpdate({
      type: "document_uploaded",
      stage: "proof-of-funds",
      role: "buyer",
      title: "Document Uploaded",
      description: "New bank statement uploaded for review",
    })
  }

  return (
    <TransactionLayout currentStage="proof-of-funds" userRole="buyer">
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <CreditCard className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Proof of Funds</h1>
            <p className="text-muted-foreground">Verify your financial capability to complete the purchase.</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Required Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Bank Statements (3 months)</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Uploaded</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Mortgage Agreement in Principle</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Uploaded</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Proof of Deposit Source</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Uploaded</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upload Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="document-type">Document Type</Label>
                <select className="w-full p-2 border rounded-md">
                  <option>Select document type</option>
                  <option>Bank Statement</option>
                  <option>Mortgage Agreement in Principle</option>
                  <option>Proof of Deposit Source</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-2">Drag and drop files here, or click to browse</p>
                <Button variant="outline">Choose Files</Button>
              </div>

              <Button className="w-full" onClick={handleDocumentUpload}>
                Upload Document
              </Button>
            </CardContent>
          </Card>

          <RealTimeActivityFeed />

          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Financial Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-primary">£450,000</div>
                  <div className="text-sm text-muted-foreground">Purchase Price</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">£45,000</div>
                  <div className="text-sm text-muted-foreground">Deposit Required</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">£405,000</div>
                  <div className="text-sm text-muted-foreground">Mortgage Required</div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t">
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg mb-4">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="h-5 w-5 text-amber-600" />
                    <div>
                      <h4 className="font-semibold text-amber-800">Awaiting Estate Agent Review</h4>
                      <p className="text-sm text-amber-700">
                        Your documents have been submitted and are being reviewed by the estate agent.
                      </p>
                    </div>
                  </div>
                </div>

                <Button className="w-full" disabled>
                  Continue to Conveyancers
                  <span className="ml-2 text-xs">(Awaiting document approval)</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TransactionLayout>
  )
}
