"use client"

import { useState } from "react"
import TransactionLayout from "@/components/transaction-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { CreditCard, Upload, CheckCircle, AlertCircle, Eye, Download, X, Check } from "lucide-react"
import Link from "next/link"

// Mock user role - in a real app, this would come from authentication context
const useUserRole = () => {
  const [userRole, setUserRole] = useState<"buyer" | "estate-agent" | "buyer-conveyancer" | "seller-conveyancer">(
    "estate-agent", // Default to estate-agent for testing
  )
  return { userRole, setUserRole }
}

export default function ProofOfFundsPage() {
  const { userRole } = useUserRole()
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
    },
    {
      id: "mortgage-aip",
      name: "Mortgage Agreement in Principle",
      status: "uploaded",
      uploadDate: "2024-03-12",
      fileName: "mortgage_aip_first_national.pdf",
    },
    {
      id: "deposit-source",
      name: "Proof of Deposit Source",
      status: "uploaded",
      uploadDate: "2024-03-11",
      fileName: "savings_account_statement.pdf",
    },
  ]

  const handleAcceptDocuments = () => {
    setDocumentsStatus("accepted")
    setShowDeclineForm(false)
    setDeclineReason("")
  }

  const handleDeclineDocuments = () => {
    if (declineReason.trim()) {
      setDocumentsStatus("declined")
      setShowDeclineForm(false)
    } else {
      setShowDeclineForm(true)
    }
  }

  const handleCancelDecline = () => {
    setShowDeclineForm(false)
    setDeclineReason("")
  }

  const canProceed = documentsStatus === "accepted"

  if (userRole === "estate-agent") {
    return (
      <TransactionLayout currentStage="proof-of-funds">
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <CreditCard className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Proof of Funds - Review</h1>
              <p className="text-muted-foreground">Review and approve the buyer's financial documentation.</p>
            </div>
          </div>

          <div className="grid gap-6">
            <Card>
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
                            You have accepted all buyer documentation. The transaction can proceed to the next stage.
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

            <Card>
              <CardHeader>
                <CardTitle>Submitted Documents</CardTitle>
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
                            <p>Uploaded: {document.uploadDate}</p>
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
              <Card>
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
                        Accept Documents
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 border-red-300 text-red-700 hover:bg-red-50"
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
                          placeholder="Please provide a reason for declining the documents..."
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
                        <Button variant="outline" className="flex-1" onClick={handleCancelDecline}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="text-sm text-muted-foreground p-3 bg-muted rounded-lg">
                    <p>
                      <strong>Note:</strong> Once you accept the documents, the buyer will be able to proceed to the
                      next stage. If you decline, the buyer will need to resubmit corrected documentation.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {documentsStatus === "declined" && (
              <Card>
                <CardHeader>
                  <CardTitle>Resubmission Required</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      The buyer has been notified of the declined documents and the reason provided. They will need to
                      resubmit corrected documentation before proceeding.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setDocumentsStatus("pending")
                      setDeclineReason("")
                    }}
                  >
                    Reset Review Status
                  </Button>
                </CardContent>
              </Card>
            )}

            <Card>
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
                  {canProceed ? (
                    <Link href="/conveyancers">
                      <Button className="w-full" size="lg">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Continue to Conveyancers
                      </Button>
                    </Link>
                  ) : documentsStatus === "declined" ? (
                    <Button className="w-full" disabled size="lg">
                      Continue to Conveyancers
                      <span className="ml-2 text-xs">(Documents declined - awaiting resubmission)</span>
                    </Button>
                  ) : (
                    <Button className="w-full" disabled size="lg">
                      Continue to Conveyancers
                      <span className="ml-2 text-xs">(Review documents first)</span>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </TransactionLayout>
    )
  }

  // Original buyer view
  return (
    <TransactionLayout currentStage="proof-of-funds">
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <CreditCard className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Proof of Funds</h1>
            <p className="text-muted-foreground">Verify your financial capability to complete the purchase.</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
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

              <Button className="w-full">Upload Document</Button>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
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
                {documentsStatus === "accepted" ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <div>
                          <h4 className="font-semibold text-green-800">Documents Approved!</h4>
                          <p className="text-sm text-green-700">
                            Your documents have been approved by the estate agent. You can now proceed to the next
                            stage.
                          </p>
                        </div>
                      </div>
                    </div>
                    <Link href="/conveyancers">
                      <Button className="w-full">Continue to Conveyancers</Button>
                    </Link>
                  </div>
                ) : documentsStatus === "declined" ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <X className="h-5 w-5 text-red-600" />
                        <div>
                          <h4 className="font-semibold text-red-800">Documents Declined</h4>
                          <p className="text-sm text-red-700">
                            Your documents have been declined. Please review the feedback and resubmit.
                          </p>
                          {declineReason && (
                            <div className="mt-2 p-2 bg-red-100 rounded text-sm">
                              <strong>Reason:</strong> {declineReason}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button className="w-full" disabled>
                      Continue to Conveyancers
                      <span className="ml-2 text-xs">(Resubmit documents first)</span>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
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
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TransactionLayout>
  )
}
