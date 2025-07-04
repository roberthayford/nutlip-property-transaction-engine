"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { TransactionLayout } from "@/components/transaction-layout"
import {
  CreditCard,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  Download,
  Eye,
  MessageSquare,
  Phone,
  Mail,
} from "lucide-react"

interface ProofOfFundsData {
  status: "pending" | "submitted" | "verified" | "rejected"
  documents: Array<{
    id: string
    name: string
    type: string
    uploadedAt: string
    status: "pending" | "approved" | "rejected"
  }>
  bankStatement?: {
    balance: number
    accountHolder: string
    bankName: string
    statementDate: string
  }
  mortgagePreApproval?: {
    lender: string
    amount: number
    validUntil: string
    reference: string
  }
  notes: string
  lastUpdated: string
}

export default function EstateAgentProofOfFundsPage() {
  const { toast } = useToast()
  const [proofOfFundsData, setProofOfFundsData] = useState<ProofOfFundsData>({
    status: "submitted",
    documents: [
      {
        id: "1",
        name: "Bank Statement - March 2024.pdf",
        type: "bank-statement",
        uploadedAt: "2024-03-15T10:30:00Z",
        status: "approved",
      },
      {
        id: "2",
        name: "Mortgage Pre-approval Letter.pdf",
        type: "mortgage-preapproval",
        uploadedAt: "2024-03-15T11:15:00Z",
        status: "approved",
      },
      {
        id: "3",
        name: "Savings Account Statement.pdf",
        type: "savings-statement",
        uploadedAt: "2024-03-15T11:45:00Z",
        status: "pending",
      },
    ],
    bankStatement: {
      balance: 85000,
      accountHolder: "John Smith",
      bankName: "Barclays Bank",
      statementDate: "2024-03-01",
    },
    mortgagePreApproval: {
      lender: "Halifax",
      amount: 320000,
      validUntil: "2024-06-15",
      reference: "HAL-2024-045789",
    },
    notes: "All documents have been reviewed. Buyer has sufficient funds for the purchase.",
    lastUpdated: "2024-03-15T12:00:00Z",
  })

  const [newNote, setNewNote] = useState("")

  useEffect(() => {
    // Load proof of funds data from localStorage
    const savedData = localStorage.getItem("estate-agent-proof-of-funds")
    if (savedData) {
      try {
        setProofOfFundsData(JSON.parse(savedData))
      } catch (error) {
        console.error("Error loading proof of funds data:", error)
      }
    }
  }, [])

  const saveData = (data: ProofOfFundsData) => {
    localStorage.setItem("estate-agent-proof-of-funds", JSON.stringify(data))
    setProofOfFundsData(data)
  }

  const handleAddNote = () => {
    if (!newNote.trim()) return

    const updatedData = {
      ...proofOfFundsData,
      notes: proofOfFundsData.notes + "\n\n" + `[${new Date().toLocaleString()}] ${newNote}`,
      lastUpdated: new Date().toISOString(),
    }

    saveData(updatedData)
    setNewNote("")

    toast({
      title: "Note Added",
      description: "Your note has been added to the proof of funds record.",
    })
  }

  const handleApproveDocument = (documentId: string) => {
    const updatedData = {
      ...proofOfFundsData,
      documents: proofOfFundsData.documents.map((doc) =>
        doc.id === documentId ? { ...doc, status: "approved" as const } : doc,
      ),
      lastUpdated: new Date().toISOString(),
    }

    saveData(updatedData)

    toast({
      title: "Document Approved",
      description: "The document has been marked as approved.",
    })
  }

  const handleRejectDocument = (documentId: string) => {
    const updatedData = {
      ...proofOfFundsData,
      documents: proofOfFundsData.documents.map((doc) =>
        doc.id === documentId ? { ...doc, status: "rejected" as const } : doc,
      ),
      lastUpdated: new Date().toISOString(),
    }

    saveData(updatedData)

    toast({
      title: "Document Rejected",
      description: "The document has been marked as rejected.",
    })
  }

  const handleVerifyFunds = () => {
    const updatedData = {
      ...proofOfFundsData,
      status: "verified" as const,
      lastUpdated: new Date().toISOString(),
    }

    saveData(updatedData)

    toast({
      title: "Funds Verified",
      description: "The buyer's proof of funds has been verified and approved.",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
      case "approved":
        return "bg-green-100 text-green-800"
      case "submitted":
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
      case "approved":
        return <CheckCircle className="h-4 w-4" />
      case "submitted":
      case "pending":
        return <Clock className="h-4 w-4" />
      case "rejected":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <TransactionLayout currentStage="proof-of-funds" userRole="estate-agent">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Proof of Funds</h1>
            <p className="text-gray-600 mt-1">Review and verify the buyer's financial documentation</p>
          </div>
          <Badge className={`${getStatusColor(proofOfFundsData.status)} flex items-center gap-2`}>
            {getStatusIcon(proofOfFundsData.status)}
            {proofOfFundsData.status.charAt(0).toUpperCase() + proofOfFundsData.status.slice(1)}
          </Badge>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-blue-600" />
                Bank Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              {proofOfFundsData.bankStatement ? (
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(proofOfFundsData.bankStatement.balance)}
                  </div>
                  <div className="text-sm text-gray-600">
                    <div>{proofOfFundsData.bankStatement.accountHolder}</div>
                    <div>{proofOfFundsData.bankStatement.bankName}</div>
                    <div>Statement: {formatDate(proofOfFundsData.bankStatement.statementDate)}</div>
                  </div>
                </div>
              ) : (
                <div className="text-gray-500">No bank statement provided</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-600" />
                Mortgage Pre-approval
              </CardTitle>
            </CardHeader>
            <CardContent>
              {proofOfFundsData.mortgagePreApproval ? (
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatCurrency(proofOfFundsData.mortgagePreApproval.amount)}
                  </div>
                  <div className="text-sm text-gray-600">
                    <div>{proofOfFundsData.mortgagePreApproval.lender}</div>
                    <div>Valid until: {formatDate(proofOfFundsData.mortgagePreApproval.validUntil)}</div>
                    <div>Ref: {proofOfFundsData.mortgagePreApproval.reference}</div>
                  </div>
                </div>
              ) : (
                <div className="text-gray-500">No mortgage pre-approval provided</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Documents Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold">
                  {proofOfFundsData.documents.filter((doc) => doc.status === "approved").length}/
                  {proofOfFundsData.documents.length}
                </div>
                <div className="text-sm text-gray-600">Documents approved</div>
                <div className="flex gap-1 mt-2">
                  {proofOfFundsData.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className={`w-3 h-3 rounded-full ${
                        doc.status === "approved"
                          ? "bg-green-500"
                          : doc.status === "rejected"
                            ? "bg-red-500"
                            : "bg-yellow-500"
                      }`}
                      title={`${doc.name} - ${doc.status}`}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Documents List */}
        <Card>
          <CardHeader>
            <CardTitle>Submitted Documents</CardTitle>
            <CardDescription>Review and approve the buyer's financial documents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {proofOfFundsData.documents.map((document) => (
                <div key={document.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="font-medium">{document.name}</div>
                      <div className="text-sm text-gray-500">Uploaded {formatDate(document.uploadedAt)}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={getStatusColor(document.status)}>
                      {getStatusIcon(document.status)}
                      {document.status}
                    </Badge>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      {document.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleApproveDocument(document.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Approve
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleRejectDocument(document.id)}>
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notes Section */}
        <Card>
          <CardHeader>
            <CardTitle>Notes & Comments</CardTitle>
            <CardDescription>Add notes about the proof of funds review</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm">{proofOfFundsData.notes}</pre>
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-note">Add Note</Label>
              <Textarea
                id="new-note"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add your notes about the proof of funds..."
                rows={3}
              />
              <Button onClick={handleAddNote} disabled={!newNote.trim()}>
                Add Note
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
            <CardDescription>Take action on the proof of funds submission</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {proofOfFundsData.status !== "verified" && (
                <Button
                  onClick={handleVerifyFunds}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={proofOfFundsData.documents.some((doc) => doc.status !== "approved")}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Verify Funds
                </Button>
              )}
              <Button variant="outline">
                <MessageSquare className="h-4 w-4 mr-2" />
                Message Buyer
              </Button>
              <Button variant="outline">
                <Phone className="h-4 w-4 mr-2" />
                Call Buyer
              </Button>
              <Button variant="outline">
                <Mail className="h-4 w-4 mr-2" />
                Email Buyer
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Status Update */}
        {proofOfFundsData.status === "verified" && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <div>
                  <h3 className="font-semibold text-green-900">Funds Verified</h3>
                  <p className="text-sm text-green-700">
                    The buyer's proof of funds has been verified. The transaction can proceed to the next stage.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </TransactionLayout>
  )
}
