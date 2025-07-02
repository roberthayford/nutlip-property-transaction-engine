"use client"

import { useState } from "react"
import TransactionLayout from "@/components/transaction-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  CreditCard,
  CheckCircle,
  AlertCircle,
  Eye,
  Download,
  X,
  Check,
  Home,
  PoundSterling,
  FileText,
  Calendar,
} from "lucide-react"
import Link from "next/link"
import { useRealTime } from "@/contexts/real-time-context"

export default function EstateAgentProofOfFundsPage() {
  const { sendUpdate } = useRealTime()
  const [documentsStatus, setDocumentsStatus] = useState<"pending" | "accepted" | "declined">("pending")
  const [declineReason, setDeclineReason] = useState("")
  const [showDeclineForm, setShowDeclineForm] = useState(false)

  const documents = [
    {
      id: "bank-statements",
      name: "Bank Statements (3 months)",
      status: "uploaded",
      uploadDate: "2024-03-10",
      fileName: "bank_statements_jan_mar_2024.pdf",
      size: "2.4 MB",
    },
    {
      id: "mortgage-aip",
      name: "Mortgage Agreement in Principle",
      status: "uploaded",
      uploadDate: "2024-03-12",
      fileName: "mortgage_aip_first_national.pdf",
      size: "1.2 MB",
    },
    {
      id: "deposit-source",
      name: "Proof of Deposit Source",
      status: "uploaded",
      uploadDate: "2024-03-11",
      fileName: "savings_account_statement.pdf",
      size: "1.8 MB",
    },
  ]

  const handleAcceptDocuments = () => {
    setDocumentsStatus("accepted")
    setShowDeclineForm(false)
    setDeclineReason("")

    sendUpdate({
      type: "status_changed",
      stage: "proof-of-funds",
      role: "estate-agent",
      title: "Proof of Funds Approved",
      description: "Estate agent has approved all buyer documentation",
    })
  }

  const handleDeclineDocuments = () => {
    if (declineReason.trim()) {
      setDocumentsStatus("declined")
      setShowDeclineForm(false)

      sendUpdate({
        type: "status_changed",
        stage: "proof-of-funds",
        role: "estate-agent",
        title: "Documents Declined",
        description: `Documents declined: ${declineReason}`,
      })
    } else {
      setShowDeclineForm(true)
    }
  }

  const handleCancelDecline = () => {
    setShowDeclineForm(false)
    setDeclineReason("")
  }

  const canProceed = documentsStatus === "accepted"

  return (
    <TransactionLayout currentStage="proof-of-funds" userRole="estate-agent">
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <CreditCard className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Proof of Funds Review</h1>
            <p className="text-muted-foreground">Review and approve the buyer's financial documentation to proceed.</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Home className="h-5 w-5" />
                <span>Property Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold">123 Example Street</h3>
                <p className="text-muted-foreground">London, SW1A 1AA</p>
              </div>
              <div className="flex items-center space-x-4">
                <Badge variant="secondary">3 Bed</Badge>
                <Badge variant="secondary">2 Bath</Badge>
                <Badge variant="secondary">Garden</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PoundSterling className="h-5 w-5" />
                <span>Offer Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Accepted Offer Amount:</span>
                <span className="font-semibold">£450,000</span>
              </div>
              <div className="flex justify-between">
                <span>Nutlip Transaction Fee (0.5%):</span>
                <span className="font-semibold">£2,250</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-medium">Balance to Seller:</span>
                <span className="font-bold text-green-600">£447,750</span>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Document Review Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {documentsStatus === "accepted" && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                      <div>
                        <h4 className="font-semibold text-green-800">Documents Accepted</h4>
                        <p className="text-sm text-green-700">
                          You have accepted all buyer documentation. The transaction can proceed to the conveyancers
                          stage.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {documentsStatus === "declined" && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <X className="h-6 w-6 text-red-600" />
                      <div>
                        <h4 className="font-semibold text-red-800">Documents Declined</h4>
                        <p className="text-sm text-red-700">
                          You have declined the buyer documentation. The buyer will need to resubmit.
                        </p>
                        {declineReason && (
                          <div className="mt-2 p-2 bg-red-100 rounded text-sm">
                            <strong>Reason:</strong> {declineReason}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {documentsStatus === "pending" && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <AlertCircle className="h-6 w-6 text-amber-600" />
                      <div>
                        <h4 className="font-semibold text-amber-800">Review Required</h4>
                        <p className="text-sm text-amber-700">
                          Please review all submitted documents and make a decision to proceed.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Submitted Documents</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {documents.map((document) => (
                  <div
                    key={document.id}
                    className={`p-4 border rounded-lg ${
                      documentsStatus === "accepted"
                        ? "bg-green-50 border-green-200"
                        : documentsStatus === "declined"
                          ? "bg-red-50 border-red-200"
                          : "bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          {documentsStatus === "accepted" ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : documentsStatus === "declined" ? (
                            <X className="h-5 w-5 text-red-600" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-amber-600" />
                          )}
                          <span className="font-medium">{document.name}</span>
                          {documentsStatus === "accepted" ? (
                            <Badge className="bg-green-100 text-green-800">Accepted</Badge>
                          ) : documentsStatus === "declined" ? (
                            <Badge className="bg-red-100 text-red-800">Declined</Badge>
                          ) : (
                            <Badge className="bg-amber-100 text-amber-800">Pending Review</Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <p>File: {document.fileName}</p>
                          <p>
                            Size: {document.size} • Uploaded: {document.uploadDate}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {documentsStatus === "pending" && (
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Review Decision</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!showDeclineForm ? (
                  <div className="flex space-x-4">
                    <Button
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={handleAcceptDocuments}
                      size="lg"
                    >
                      <Check className="h-5 w-5 mr-2" />
                      Accept All Documents
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-red-300 text-red-700 hover:bg-red-50 bg-transparent"
                      onClick={handleDeclineDocuments}
                      size="lg"
                    >
                      <X className="h-5 w-5 mr-2" />
                      Decline Documents
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="decline-reason">Reason for Declining (Required)</Label>
                      <Textarea
                        id="decline-reason"
                        placeholder="Please provide a detailed reason for declining the documents..."
                        value={declineReason}
                        onChange={(e) => setDeclineReason(e.target.value)}
                        className="min-h-[100px]"
                      />
                    </div>
                    <div className="flex space-x-3">
                      <Button
                        className="flex-1 bg-red-600 hover:bg-red-700"
                        onClick={handleDeclineDocuments}
                        disabled={!declineReason.trim()}
                      >
                        Confirm Decline
                      </Button>
                      <Button variant="outline" className="flex-1 bg-transparent" onClick={handleCancelDecline}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Next Steps</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {canProceed ? (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                      <div>
                        <h4 className="font-semibold text-green-800">Ready to Proceed</h4>
                        <p className="text-sm text-green-700">
                          All documents have been approved. The transaction can now move to the conveyancers stage.
                        </p>
                      </div>
                    </div>
                  </div>
                  <Link href="/estate-agent/conveyancers">
                    <Button className="w-full" size="lg">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Continue to Conveyancers
                    </Button>
                  </Link>
                </div>
              ) : documentsStatus === "declined" ? (
                <div className="space-y-4">
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <X className="h-6 w-6 text-red-600" />
                      <div>
                        <h4 className="font-semibold text-red-800">Documents Declined</h4>
                        <p className="text-sm text-red-700">
                          The buyer will be notified to resubmit their documentation.
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full" disabled size="lg">
                    Continue to Conveyancers
                    <span className="ml-2 text-xs">(Awaiting document resubmission)</span>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-semibold">Review Documents</h4>
                        <p className="text-muted-foreground text-sm">
                          Carefully review all submitted proof of funds documentation
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-muted rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-semibold">Make Decision</h4>
                        <p className="text-muted-foreground text-sm">Accept or decline the documentation</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-muted rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-semibold">Proceed to Conveyancers</h4>
                        <p className="text-muted-foreground text-sm">Move to the next stage once approved</p>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full" disabled size="lg">
                    Continue to Conveyancers
                    <span className="ml-2 text-xs">(Review documents first)</span>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </TransactionLayout>
  )
}
