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
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  Download,
  Eye,
  MessageSquare,
  Phone,
  Mail,
  UserPlus,
} from "lucide-react"
import Link from "next/link"

interface UploadedDocument {
  id: string
  name: string
  type: string
  size: number
  uploadedAt: Date
  status: "pending" | "approved" | "rejected"
}

interface ProofOfFundsData {
  status: "not-started" | "in-progress" | "submitted" | "verified"
  documents: UploadedDocument[]
  notes: string
  lastUpdated: string
}

const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  "bank-statement": "Bank Statement",
  "mortgage-agreement": "Mortgage Agreement in Principle",
  "income-proof": "Proof of Income",
}

export default function EstateAgentProofOfFundsPage() {
  const { toast } = useToast()
  const [proofOfFundsData, setProofOfFundsData] = useState<ProofOfFundsData>({
    status: "not-started",
    documents: [],
    notes: "",
    lastUpdated: new Date().toISOString(),
  })

  const [newNote, setNewNote] = useState("")

  // Load data from shared localStorage on component mount
  useEffect(() => {
    const loadData = () => {
      const savedData = localStorage.getItem("proof-of-funds-shared")
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData)
          // Convert date strings back to Date objects
          const documentsWithDates = parsedData.documents.map((doc: any) => ({
            ...doc,
            uploadedAt: new Date(doc.uploadedAt),
          }))
          setProofOfFundsData({
            ...parsedData,
            documents: documentsWithDates,
            notes: parsedData.notes || "",
          })
        } catch (error) {
          console.error("Error loading proof of funds data:", error)
        }
      }
    }

    loadData()

    // Listen for storage changes to sync across tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "proof-of-funds-shared") {
        loadData()
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  // Save data to shared localStorage
  const saveData = (data: ProofOfFundsData) => {
    localStorage.setItem("proof-of-funds-shared", JSON.stringify(data))
    setProofOfFundsData(data)
  }

  const handleAddNote = () => {
    if (!newNote.trim()) return

    const updatedData = {
      ...proofOfFundsData,
      notes:
        proofOfFundsData.notes + (proofOfFundsData.notes ? "\n\n" : "") + `[${new Date().toLocaleString()}] ${newNote}`,
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
    const updatedDocuments = proofOfFundsData.documents.map((doc) =>
      doc.id === documentId ? { ...doc, status: "approved" as const } : doc,
    )

    const allApproved = updatedDocuments.every((doc) => doc.status === "approved")
    const newStatus = allApproved ? "verified" : proofOfFundsData.status

    const updatedData = {
      ...proofOfFundsData,
      documents: updatedDocuments,
      status: newStatus,
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
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-grey-100 text-grey-800"
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

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getDocumentTypeLabel = (type: string) => {
    return DOCUMENT_TYPE_LABELS[type] || type
  }

  // Check if funds are verified to enable the Add Conveyancer button
  const canProceedToAddConveyancer = proofOfFundsData.status === "verified"

  return (
    <TransactionLayout currentStage="proof-of-funds" userRole="estate-agent">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-grey-900">Proof of Funds</h1>
            <p className="text-grey-600 mt-1">Review and verify the buyer's financial documentation</p>
          </div>
          <Badge className={`${getStatusColor(proofOfFundsData.status)} flex items-center gap-2`}>
            {getStatusIcon(proofOfFundsData.status)}
            {proofOfFundsData.status === "not-started" && "Not Started"}
            {proofOfFundsData.status === "in-progress" && "In Progress"}
            {proofOfFundsData.status === "submitted" && "Submitted"}
            {proofOfFundsData.status === "verified" && "Verified"}
          </Badge>
        </div>

        {/* No Documents Message */}
        {proofOfFundsData.documents.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-grey-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-grey-900 mb-2">No Documents Submitted</h3>
                <p className="text-grey-600">
                  The buyer has not yet submitted any proof of funds documents for review.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Documents List */}
        {proofOfFundsData.documents.length > 0 && (
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
                      <FileText className="h-5 w-5 text-grey-400" />
                      <div>
                        <div className="font-medium">{document.name}</div>
                        <div className="text-sm text-grey-500">
                          {getDocumentTypeLabel(document.type)} • {formatFileSize(document.size)} • Uploaded{" "}
                          {formatDate(document.uploadedAt)}
                        </div>
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
        )}

        {/* Notes Section */}
        <Card>
          <CardHeader>
            <CardTitle>Notes & Comments</CardTitle>
            <CardDescription>Add notes about the proof of funds review</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {proofOfFundsData.notes && (
              <div className="p-4 bg-grey-50 rounded-lg">
                <pre className="whitespace-pre-wrap text-sm">{proofOfFundsData.notes}</pre>
              </div>
            )}
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
        {proofOfFundsData.documents.length > 0 && (
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
        )}

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

        {/* Add Conveyancer Button */}
        <Card>
          <CardHeader>
            <CardTitle>Next Step</CardTitle>
            <CardDescription>
              {canProceedToAddConveyancer
                ? "Funds have been verified. You can now proceed to add conveyancers to the transaction."
                : "Complete the proof of funds verification to proceed to the next stage."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/estate-agent/add-conveyancer">
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={!canProceedToAddConveyancer}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add Conveyancer
              </Button>
            </Link>
            {!canProceedToAddConveyancer && (
              <p className="text-sm text-grey-500 mt-2 text-center">Please verify all documents before proceeding</p>
            )}
          </CardContent>
        </Card>
      </div>
    </TransactionLayout>
  )
}
