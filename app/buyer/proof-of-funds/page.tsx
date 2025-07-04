"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { TransactionLayout } from "@/components/transaction-layout"
import {
  FileText,
  Upload,
  CheckCircle,
  Clock,
  AlertTriangle,
  X,
  Eye,
  Download,
  Building2,
  CreditCard,
  UserPlus,
} from "lucide-react"
import Link from "next/link"

// Custom Pound Sign Icon Component
const PoundSignIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 11h8" />
    <path d="M6 15h8" />
    <path d="M16 4v8a4 4 0 0 1-8 0V4" />
  </svg>
)

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

const REQUIRED_DOCUMENTS = [
  {
    id: "bank-statement",
    name: "Bank Statement",
    icon: Building2,
    description: "Recent bank statement showing available funds",
  },
  {
    id: "mortgage-agreement",
    name: "Mortgage Agreement in Principle",
    icon: CreditCard,
    description: "Pre-approved mortgage agreement from your lender",
  },
  {
    id: "income-proof",
    name: "Proof of Income",
    icon: PoundSignIcon,
    description: "Salary slips, tax returns, or employment letter",
  },
]

export default function BuyerProofOfFundsPage() {
  const { toast } = useToast()
  const [proofOfFundsData, setProofOfFundsData] = useState<ProofOfFundsData>({
    status: "not-started",
    documents: [],
    notes: "",
    lastUpdated: new Date().toISOString(),
  })

  const [selectedDocumentType, setSelectedDocumentType] = useState<string>("")
  const [isUploading, setIsUploading] = useState(false)

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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !selectedDocumentType) return

    // Check if document type already exists
    const existingDoc = proofOfFundsData.documents.find((doc) => doc.type === selectedDocumentType)
    if (existingDoc) {
      toast({
        title: "Document Already Uploaded",
        description: "A document of this type has already been uploaded. Please remove it first to upload a new one.",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const newDocument: UploadedDocument = {
      id: Date.now().toString(),
      name: file.name,
      type: selectedDocumentType,
      size: file.size,
      uploadedAt: new Date(),
      status: "pending",
    }

    const updatedDocuments = [...proofOfFundsData.documents, newDocument]
    const newStatus = updatedDocuments.length === REQUIRED_DOCUMENTS.length ? "submitted" : "in-progress"

    const updatedData = {
      ...proofOfFundsData,
      documents: updatedDocuments,
      status: newStatus,
      lastUpdated: new Date().toISOString(),
    }

    saveData(updatedData)
    setSelectedDocumentType("")
    setIsUploading(false)

    // Reset file input
    event.target.value = ""

    toast({
      title: "Document Uploaded",
      description: `${file.name} has been uploaded successfully and is pending review.`,
    })
  }

  const handleRemoveDocument = (documentId: string) => {
    const updatedDocuments = proofOfFundsData.documents.filter((doc) => doc.id !== documentId)
    const newStatus = updatedDocuments.length === 0 ? "not-started" : "in-progress"

    const updatedData = {
      ...proofOfFundsData,
      documents: updatedDocuments,
      status: newStatus,
      lastUpdated: new Date().toISOString(),
    }

    saveData(updatedData)

    toast({
      title: "Document Removed",
      description: "The document has been removed from your submission.",
    })
  }

  const getDocumentStatus = (documentType: string) => {
    const document = proofOfFundsData.documents.find((doc) => doc.type === documentType)
    return document?.status || "not-uploaded"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
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
      case "approved":
        return <CheckCircle className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      case "rejected":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Upload className="h-4 w-4" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const uploadedCount = proofOfFundsData.documents.length
  const totalRequired = REQUIRED_DOCUMENTS.length
  const progressPercentage = (uploadedCount / totalRequired) * 100

  const availableDocumentTypes = REQUIRED_DOCUMENTS.filter(
    (docType) => !proofOfFundsData.documents.some((doc) => doc.type === docType.id),
  )

  const canProceed = proofOfFundsData.status === "verified"

  return (
    <TransactionLayout currentStage="proof-of-funds" userRole="buyer">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Proof of Funds</h1>
            <p className="text-gray-600 mt-1">Upload your financial documents to verify your ability to purchase</p>
          </div>
          <Badge className={`${getStatusColor(proofOfFundsData.status)} flex items-center gap-2`}>
            {getStatusIcon(proofOfFundsData.status)}
            {proofOfFundsData.status === "not-started" && "Not Started"}
            {proofOfFundsData.status === "in-progress" && "In Progress"}
            {proofOfFundsData.status === "submitted" && "Under Review"}
            {proofOfFundsData.status === "verified" && "Verified"}
          </Badge>
        </div>

        {/* Progress Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Progress</CardTitle>
            <CardDescription>
              {uploadedCount} of {totalRequired} required documents uploaded
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={progressPercentage} className="w-full" />
              <div className="text-sm text-gray-600">
                {proofOfFundsData.status === "verified"
                  ? "All documents have been verified. You can proceed to the next stage."
                  : proofOfFundsData.status === "submitted"
                    ? "All documents uploaded and under review by the estate agent."
                    : `${totalRequired - uploadedCount} more document${totalRequired - uploadedCount !== 1 ? "s" : ""} required.`}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Document Upload Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Document Upload Progress</CardTitle>
            <CardDescription>Track the status of your required documents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {REQUIRED_DOCUMENTS.map((docType) => {
                const status = getDocumentStatus(docType.id)
                const IconComponent = docType.icon
                return (
                  <div key={docType.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <IconComponent className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="font-medium">{docType.name}</div>
                        <div className="text-sm text-gray-500">{docType.description}</div>
                      </div>
                    </div>
                    <Badge className={getStatusColor(status)}>
                      {getStatusIcon(status)}
                      {status === "not-uploaded" ? "Required" : status}
                    </Badge>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Upload New Document */}
        {availableDocumentTypes.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Upload Document</CardTitle>
              <CardDescription>Select a document type and upload your file</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="document-type">Document Type</Label>
                  <Select value={selectedDocumentType} onValueChange={setSelectedDocumentType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableDocumentTypes.map((docType) => (
                        <SelectItem key={docType.id} value={docType.id}>
                          {docType.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="file-upload">Choose File</Label>
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    disabled={!selectedDocumentType || isUploading}
                  />
                </div>
              </div>
              {isUploading && (
                <div className="flex items-center space-x-2 text-blue-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-sm">Uploading document...</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Uploaded Documents */}
        {proofOfFundsData.documents.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Uploaded Documents</CardTitle>
              <CardDescription>Manage your uploaded documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {proofOfFundsData.documents.map((document) => (
                  <div key={document.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="font-medium">{document.name}</div>
                        <div className="text-sm text-gray-500">
                          {formatFileSize(document.size)} • Uploaded {formatDate(document.uploadedAt)}
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
                        {document.status !== "approved" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRemoveDocument(document.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Continue Button */}
        {canProceed && (
          <Card>
            <CardContent className="pt-6">
              <Link href="/buyer/add-conveyancer">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Conveyancer
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Status Messages */}
        {proofOfFundsData.status === "submitted" && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <Clock className="h-6 w-6 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-blue-900">Under Review</h3>
                  <p className="text-sm text-blue-700">
                    Your documents are being reviewed by the estate agent. You'll be notified once they're approved.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {proofOfFundsData.status === "verified" && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <div>
                  <h3 className="font-semibold text-green-900">Documents Verified</h3>
                  <p className="text-sm text-green-700">
                    All your documents have been approved. You can now proceed to the next stage of the transaction.
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
