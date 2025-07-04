"use client"

import type React from "react"

import { useState, useRef } from "react"
import TransactionLayout from "@/components/transaction-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RealTimeActivityFeed } from "@/components/real-time-activity-feed"
import { MessengerChat } from "@/components/messenger-chat"
import { useRealTime } from "@/contexts/real-time-context"
import { useToast } from "@/hooks/use-toast"
import {
  Upload,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  DollarSign,
  CreditCard,
  Building,
  Loader2,
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

const REQUIRED_DOCUMENTS = [
  { type: "bank-statement", label: "Bank Statement", icon: Building },
  { type: "mortgage-agreement", label: "Mortgage Agreement in Principle", icon: FileText },
  { type: "deposit-proof", label: "Proof of Deposit", icon: CreditCard },
  { type: "income-proof", label: "Proof of Income", icon: DollarSign },
]

export default function BuyerProofOfFundsPage() {
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([])
  const [selectedDocumentType, setSelectedDocumentType] = useState<string>("")
  const [isUploading, setIsUploading] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { sendUpdate, addDocument } = useRealTime()
  const { toast } = useToast()

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return

    if (!selectedDocumentType) {
      toast({
        title: "Document Type Required",
        description: "Please select a document type before uploading.",
        variant: "destructive",
      })
      return
    }

    const file = files[0]
    uploadDocument(file)
  }

  const uploadDocument = async (file: File) => {
    setIsUploading(true)

    try {
      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const newDocument: UploadedDocument = {
        id: crypto.randomUUID(),
        name: file.name,
        type: selectedDocumentType,
        size: file.size,
        uploadedAt: new Date(),
        status: "pending",
      }

      setUploadedDocuments((prev) => [...prev, newDocument])

      // Add to real-time system
      addDocument({
        name: file.name,
        stage: "proof-of-funds",
        uploadedBy: "buyer",
        deliveredTo: "estate-agent",
        size: file.size,
        priority: "standard",
      })

      // Send update
      sendUpdate({
        type: "document_uploaded",
        stage: "proof-of-funds",
        role: "buyer",
        title: "Document Uploaded",
        description: `${REQUIRED_DOCUMENTS.find((d) => d.type === selectedDocumentType)?.label} uploaded`,
        data: {
          documentType: selectedDocumentType,
          fileName: file.name,
        },
      })

      // Simulate approval after a delay
      setTimeout(() => {
        setUploadedDocuments((prev) =>
          prev.map((doc) => (doc.id === newDocument.id ? { ...doc, status: "approved" } : doc)),
        )

        sendUpdate({
          type: "status_changed",
          stage: "proof-of-funds",
          role: "estate-agent",
          title: "Document Approved",
          description: `${REQUIRED_DOCUMENTS.find((d) => d.type === selectedDocumentType)?.label} has been approved`,
          data: {
            documentId: newDocument.id,
            documentType: selectedDocumentType,
          },
        })
      }, 3000)

      toast({
        title: "Document Uploaded",
        description: `${file.name} has been uploaded successfully.`,
      })

      setSelectedDocumentType("")
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your document. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const getDocumentStatus = (type: string) => {
    const doc = uploadedDocuments.find((d) => d.type === type)
    if (!doc) return "missing"
    return doc.status
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "rejected":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Upload className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending Review</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
      default:
        return <Badge variant="outline">Not Uploaded</Badge>
    }
  }

  const approvedCount = uploadedDocuments.filter((doc) => doc.status === "approved").length
  const allDocumentsApproved = approvedCount === REQUIRED_DOCUMENTS.length

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <TransactionLayout currentStage="proof-of-funds" userRole="buyer">
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <FileText className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Proof of Funds</h1>
            <p className="text-muted-foreground">Upload documents to verify your financial capability</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Document Upload Progress</span>
                  <Badge variant={allDocumentsApproved ? "default" : "secondary"}>
                    {approvedCount}/{REQUIRED_DOCUMENTS.length} Approved
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {REQUIRED_DOCUMENTS.map((docType) => {
                    const status = getDocumentStatus(docType.type)
                    const doc = uploadedDocuments.find((d) => d.type === docType.type)
                    const IconComponent = docType.icon

                    return (
                      <div key={docType.type} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <IconComponent className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{docType.label}</p>
                            {doc && (
                              <p className="text-sm text-muted-foreground">
                                {doc.name} ({formatFileSize(doc.size)})
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(status)}
                          {getStatusBadge(status)}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Upload Card */}
            <Card>
              <CardHeader>
                <CardTitle>Upload Documents</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="document-type">Document Type</Label>
                  <Select value={selectedDocumentType} onValueChange={setSelectedDocumentType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                      {REQUIRED_DOCUMENTS.map((docType) => (
                        <SelectItem key={docType.type} value={docType.type}>
                          {docType.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDragOver
                      ? "border-primary bg-primary/5"
                      : "border-muted-foreground/25 hover:border-muted-foreground/50"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {isUploading ? (
                    <div className="space-y-2">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                      <p className="text-sm text-muted-foreground">Uploading document...</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Drag and drop your file here, or{" "}
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-primary hover:underline"
                        >
                          browse
                        </button>
                      </p>
                      <p className="text-xs text-muted-foreground">Supports PDF, JPG, PNG files up to 10MB</p>
                    </div>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileSelect(e.target.files)}
                />

                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={!selectedDocumentType || isUploading}
                  className="w-full"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Choose File
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Continue Button */}
            {allDocumentsApproved && (
              <Card className="border-green-200 bg-green-50">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <div>
                      <h3 className="font-semibold text-green-900">All Documents Approved</h3>
                      <p className="text-sm text-green-700">You can now proceed to the next stage</p>
                    </div>
                  </div>
                  <Link href="/buyer/conveyancers">
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      Continue to Conveyancer Selection
                    </Button>
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
        currentUserRole="buyer"
        currentUserName="John Smith"
        otherParticipant={{
          role: "estate-agent",
          name: "Sarah Johnson",
        }}
      />
    </TransactionLayout>
  )
}
