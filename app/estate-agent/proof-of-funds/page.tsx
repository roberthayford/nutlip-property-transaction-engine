"use client"

import { useState } from "react"
import TransactionLayout from "@/components/transaction-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RealTimeActivityFeed } from "@/components/real-time-activity-feed"
import { MessengerChat } from "@/components/messenger-chat"
import { useRealTime } from "@/contexts/real-time-context"
import { useToast } from "@/hooks/use-toast"
import {
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Building,
  CreditCard,
  DollarSign,
} from "lucide-react"
import Link from "next/link"

interface Document {
  id: string
  name: string
  type: string
  size: number
  uploadedAt: Date
  status: "pending" | "approved" | "rejected"
  uploadedBy: string
}

const BUYER_DOCUMENTS: Document[] = [
  {
    id: "1",
    name: "Bank Statement - January 2024.pdf",
    type: "Bank Statement",
    size: 2048576,
    uploadedAt: new Date("2024-01-15"),
    status: "approved",
    uploadedBy: "John Smith",
  },
  {
    id: "2",
    name: "Mortgage Agreement in Principle.pdf",
    type: "Mortgage AIP",
    size: 1536000,
    uploadedAt: new Date("2024-01-10"),
    status: "approved",
    uploadedBy: "John Smith",
  },
  {
    id: "3",
    name: "Proof of Deposit Source.pdf",
    type: "Deposit Proof",
    size: 1024000,
    uploadedAt: new Date("2024-01-20"),
    status: "pending",
    uploadedBy: "John Smith",
  },
  {
    id: "4",
    name: "Payslips - Last 3 Months.pdf",
    type: "Income Proof",
    size: 2560000,
    uploadedAt: new Date("2024-01-18"),
    status: "pending",
    uploadedBy: "John Smith",
  },
]

export default function EstateAgentProofOfFundsPage() {
  const [documents, setDocuments] = useState<Document[]>(BUYER_DOCUMENTS)
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null)
  const { sendUpdate } = useRealTime()
  const { toast } = useToast()

  const handleApproveDocument = (documentId: string) => {
    const document = documents.find((doc) => doc.id === documentId)
    if (!document) return

    setDocuments((prev) => prev.map((doc) => (doc.id === documentId ? { ...doc, status: "approved" } : doc)))

    sendUpdate({
      type: "status_changed",
      stage: "proof-of-funds",
      role: "estate-agent",
      title: "Document Approved",
      description: `${document.name} has been approved`,
      data: {
        documentId,
        documentName: document.name,
        action: "approved",
      },
    })

    toast({
      title: "Document Approved",
      description: `${document.name} has been approved successfully.`,
    })
  }

  const handleRejectDocument = (documentId: string) => {
    const document = documents.find((doc) => doc.id === documentId)
    if (!document) return

    setDocuments((prev) => prev.map((doc) => (doc.id === documentId ? { ...doc, status: "rejected" } : doc)))

    sendUpdate({
      type: "status_changed",
      stage: "proof-of-funds",
      role: "estate-agent",
      title: "Document Rejected",
      description: `${document.name} has been rejected`,
      data: {
        documentId,
        documentName: document.name,
        action: "rejected",
      },
    })

    toast({
      title: "Document Rejected",
      description: `${document.name} has been rejected. The buyer will be notified.`,
      variant: "destructive",
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getStatusIcon = (status: Document["status"]) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "pending":
        return <Clock className="h-5 w-5 text-amber-600" />
      case "rejected":
        return <AlertCircle className="h-5 w-5 text-red-600" />
    }
  }

  const getStatusBadge = (status: Document["status"]) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      case "pending":
        return <Badge className="bg-amber-100 text-amber-800">Pending Review</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
    }
  }

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case "Bank Statement":
        return <Building className="h-5 w-5 text-blue-600" />
      case "Mortgage AIP":
        return <FileText className="h-5 w-5 text-green-600" />
      case "Deposit Proof":
        return <CreditCard className="h-5 w-5 text-purple-600" />
      case "Income Proof":
        return <DollarSign className="h-5 w-5 text-orange-600" />
      default:
        return <FileText className="h-5 w-5 text-gray-600" />
    }
  }

  const approvedCount = documents.filter((doc) => doc.status === "approved").length
  const pendingCount = documents.filter((doc) => doc.status === "pending").length
  const rejectedCount = documents.filter((doc) => doc.status === "rejected").length
  const allDocumentsReviewed = pendingCount === 0

  return (
    <TransactionLayout currentStage="proof-of-funds" userRole="estate-agent">
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <FileText className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Review Proof of Funds</h1>
            <p className="text-muted-foreground">Review and approve the buyer's financial documents</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
                  <div className="text-sm text-muted-foreground">Approved</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-amber-600">{pendingCount}</div>
                  <div className="text-sm text-muted-foreground">Pending</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">{rejectedCount}</div>
                  <div className="text-sm text-muted-foreground">Rejected</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">{documents.length}</div>
                  <div className="text-sm text-muted-foreground">Total</div>
                </CardContent>
              </Card>
            </div>

            {/* Documents List */}
            <Card>
              <CardHeader>
                <CardTitle>Buyer Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {documents.map((document) => (
                    <div
                      key={document.id}
                      className={`p-4 border rounded-lg transition-all ${
                        selectedDocument === document.id ? "border-primary bg-primary/5" : "hover:shadow-sm"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          {getDocumentIcon(document.type)}
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-medium">{document.name}</h4>
                              {getStatusIcon(document.status)}
                            </div>
                            <div className="text-sm text-muted-foreground space-y-1">
                              <p>Type: {document.type}</p>
                              <p>Size: {formatFileSize(document.size)}</p>
                              <p>Uploaded: {document.uploadedAt.toLocaleDateString()}</p>
                              <p>By: {document.uploadedBy}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">{getStatusBadge(document.status)}</div>
                      </div>

                      <div className="flex items-center space-x-2 mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedDocument(document.id)}
                          className="flex items-center space-x-1"
                        >
                          <Eye className="h-4 w-4" />
                          <span>View</span>
                        </Button>
                        <Button variant="outline" size="sm" className="flex items-center space-x-1 bg-transparent">
                          <Download className="h-4 w-4" />
                          <span>Download</span>
                        </Button>
                        {document.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleApproveDocument(document.id)}
                              className="bg-green-600 hover:bg-green-700 text-white flex items-center space-x-1"
                            >
                              <ThumbsUp className="h-4 w-4" />
                              <span>Approve</span>
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleRejectDocument(document.id)}
                              className="flex items-center space-x-1"
                            >
                              <ThumbsDown className="h-4 w-4" />
                              <span>Reject</span>
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Continue Button */}
            {allDocumentsReviewed && approvedCount > 0 && (
              <Card className="border-green-200 bg-green-50">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <div>
                      <h3 className="font-semibold text-green-900">Documents Reviewed</h3>
                      <p className="text-sm text-green-700">
                        All documents have been reviewed. The buyer can proceed to conveyancer selection.
                      </p>
                    </div>
                  </div>
                  <Link href="/estate-agent/conveyancers">
                    <Button className="w-full bg-green-600 hover:bg-green-700">Continue to Conveyancer Stage</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Activity Feed */}
          <div className="space-y-6">
            <RealTimeActivityFeed />
          </div>
        </div>
      </div>

      {/* Messenger Chat */}
      <MessengerChat
        currentUserRole="estate-agent"
        currentUserName="Sarah Johnson"
        otherParticipant={{
          role: "buyer",
          name: "John Smith",
        }}
      />
    </TransactionLayout>
  )
}
