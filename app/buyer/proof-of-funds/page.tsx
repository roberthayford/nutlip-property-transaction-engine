"use client"

import type React from "react"

import { useState } from "react"
import TransactionLayout from "@/components/transaction-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Upload, CheckCircle, AlertCircle, FileText, Loader2 } from "lucide-react"
import { useRealTime } from "@/contexts/real-time-context"
import { RealTimeActivityFeed } from "@/components/real-time-activity-feed"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface Document {
  id: string
  name: string
  type: string
  status: "uploaded" | "pending" | "approved" | "rejected"
  uploadDate: string
}

export default function BuyerProofOfFundsPage() {
  const { sendUpdate } = useRealTime()
  const router = useRouter()
  const { toast } = useToast()

  const [selectedDocumentType, setSelectedDocumentType] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "1",
      name: "Bank Statement - January 2024",
      type: "Bank Statement",
      status: "approved",
      uploadDate: "2024-01-15",
    },
    {
      id: "2",
      name: "Mortgage Agreement in Principle",
      type: "Mortgage AIP",
      status: "approved",
      uploadDate: "2024-01-10",
    },
    {
      id: "3",
      name: "Proof of Deposit Source",
      type: "Deposit Proof",
      status: "pending",
      uploadDate: "2024-01-20",
    },
  ])

  const allDocumentsApproved = documents.every((doc) => doc.status === "approved")
  const requiredDocuments = ["Bank Statement", "Mortgage AIP", "Deposit Proof"]
  const uploadedTypes = documents.map((doc) => doc.type)
  const missingDocuments = requiredDocuments.filter((type) => !uploadedTypes.includes(type))

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0 || !selectedDocumentType) {
      toast({
        title: "Upload Error",
        description: "Please select a document type and choose files to upload.",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      // Simulate file upload
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const newDocument: Document = {
        id: Date.now().toString(),
        name: files[0].name,
        type: selectedDocumentType,
        status: "pending",
        uploadDate: new Date().toISOString().split("T")[0],
      }

      setDocuments((prev) => [...prev, newDocument])

      sendUpdate({
        type: "document_uploaded",
        stage: "proof-of-funds",
        role: "buyer",
        title: "Document Uploaded",
        description: `${selectedDocumentType} uploaded for review`,
      })

      toast({
        title: "Upload Successful",
        description: `${selectedDocumentType} has been uploaded and is being reviewed.`,
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
    handleFileUpload(e.dataTransfer.files)
  }

  const handleContinue = () => {
    sendUpdate({
      type: "stage_completed",
      stage: "proof-of-funds",
      role: "buyer",
      title: "Proof of Funds Approved",
      description: "All documents approved, proceeding to conveyancer selection",
    })

    toast({
      title: "Documents Approved!",
      description: "Proceeding to conveyancer selection.",
    })

    router.push("/buyer/conveyancers")
  }

  const getStatusBadge = (status: Document["status"]) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      case "pending":
        return <Badge className="bg-amber-100 text-amber-800">Under Review</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Uploaded</Badge>
    }
  }

  const getStatusIcon = (status: Document["status"]) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "pending":
        return <AlertCircle className="h-5 w-5 text-amber-600" />
      case "rejected":
        return <AlertCircle className="h-5 w-5 text-red-600" />
      default:
        return <FileText className="h-5 w-5 text-gray-600" />
    }
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
              <CardTitle className="flex items-center justify-between">
                Uploaded Documents
                <Badge variant="outline">
                  {documents.length} of {requiredDocuments.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(doc.status)}
                      <div>
                        <div className="font-medium">{doc.name}</div>
                        <div className="text-sm text-muted-foreground">Uploaded {doc.uploadDate}</div>
                      </div>
                    </div>
                    {getStatusBadge(doc.status)}
                  </div>
                ))}

                {missingDocuments.length > 0 && (
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <h4 className="font-medium text-amber-800 mb-2">Missing Documents:</h4>
                    <ul className="text-sm text-amber-700 space-y-1">
                      {missingDocuments.map((doc, index) => (
                        <li key={index}>• {doc}</li>
                      ))}
                    </ul>
                  </div>
                )}
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
                <select
                  id="document-type"
                  className="w-full p-2 border rounded-md"
                  value={selectedDocumentType}
                  onChange={(e) => setSelectedDocumentType(e.target.value)}
                >
                  <option value="">Select document type</option>
                  <option value="Bank Statement">Bank Statement</option>
                  <option value="Mortgage AIP">Mortgage Agreement in Principle</option>
                  <option value="Deposit Proof">Proof of Deposit Source</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragOver ? "border-primary bg-primary/5" : "border-muted"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {isUploading ? (
                  <div className="flex flex-col items-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                    <p className="text-muted-foreground">Uploading document...</p>
                  </div>
                ) : (
                  <>
                    <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground mb-2">Drag and drop files here, or click to browse</p>
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e.target.files)}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById("file-upload")?.click()}
                      disabled={!selectedDocumentType}
                    >
                      Choose Files
                    </Button>
                  </>
                )}
              </div>

              <Button
                className="w-full"
                onClick={() => document.getElementById("file-upload")?.click()}
                disabled={isUploading || !selectedDocumentType}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Upload Document"
                )}
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
                {allDocumentsApproved ? (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-4">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <h4 className="font-semibold text-green-800">Documents Approved</h4>
                        <p className="text-sm text-green-700">
                          All your documents have been reviewed and approved. You can now proceed to select
                          conveyancers.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg mb-4">
                    <div className="flex items-center space-x-3">
                      <AlertCircle className="h-5 w-5 text-amber-600" />
                      <div>
                        <h4 className="font-semibold text-amber-800">Awaiting Document Review</h4>
                        <p className="text-sm text-amber-700">
                          Your documents are being reviewed. You'll be notified once they're approved.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <Button className="w-full" onClick={handleContinue} disabled={!allDocumentsApproved}>
                  {allDocumentsApproved ? (
                    "Continue to Conveyancers"
                  ) : (
                    <>
                      Continue to Conveyancers
                      <span className="ml-2 text-xs">(Awaiting document approval)</span>
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TransactionLayout>
  )
}
