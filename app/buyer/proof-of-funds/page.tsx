"use client"

import type React from "react"

import { useState, useEffect } from "react"
import TransactionLayout from "@/components/transaction-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreditCard, Upload, CheckCircle, AlertCircle, FileText, RotateCcw } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface DocumentStatus {
  type: string
  label: string
  status: "not-uploaded" | "uploaded" | "approved" | "rejected"
  uploadedAt?: string
  fileName?: string
}

interface ProofOfFundsState {
  documents: DocumentStatus[]
  overallStatus: "not-started" | "in-progress" | "completed" | "approved"
}

const DEFAULT_STATE: ProofOfFundsState = {
  documents: [
    { type: "bank-statement", label: "Bank Statement", status: "not-uploaded" },
    { type: "proof-of-income", label: "Proof of Income", status: "not-uploaded" },
    { type: "mortgage-agreement", label: "Mortgage Agreement in Principle", status: "not-uploaded" },
  ],
  overallStatus: "not-started",
}

const STORAGE_KEY = "nutlip-buyer-proof-of-funds"

export default function BuyerProofOfFundsPage() {
  const [state, setState] = useState<ProofOfFundsState>(DEFAULT_STATE)
  const [selectedDocumentType, setSelectedDocumentType] = useState<string>("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY)
    if (savedState) {
      try {
        setState(JSON.parse(savedState))
      } catch (error) {
        console.error("Error loading saved state:", error)
      }
    }
  }, [])

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    // Trigger storage event for cross-tab sync
    window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY, newValue: JSON.stringify(state) }))
  }, [state])

  // Listen for storage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setState(JSON.parse(e.newValue))
        } catch (error) {
          console.error("Error parsing storage event:", error)
        }
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  const handleResetDemo = () => {
    // Clear localStorage
    localStorage.removeItem(STORAGE_KEY)

    // Reset component state
    setState(DEFAULT_STATE)
    setSelectedDocumentType("")
    setSelectedFile(null)

    // Force storage event for cross-tab sync
    window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY, newValue: JSON.stringify(DEFAULT_STATE) }))

    toast({
      title: "Demo Reset Complete",
      description: "All documents have been cleared and the page has been reset to default state.",
    })
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !selectedDocumentType) {
      toast({
        title: "Error",
        description: "Please select a document type and file to upload.",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Update document status
    setState((prev) => {
      const updatedDocuments = prev.documents.map((doc) =>
        doc.type === selectedDocumentType
          ? {
              ...doc,
              status: "uploaded" as const,
              uploadedAt: new Date().toISOString(),
              fileName: selectedFile.name,
            }
          : doc,
      )

      const uploadedCount = updatedDocuments.filter((doc) => doc.status !== "not-uploaded").length
      const overallStatus =
        uploadedCount === 0 ? "not-started" : uploadedCount === updatedDocuments.length ? "completed" : "in-progress"

      return {
        documents: updatedDocuments,
        overallStatus,
      }
    })

    setSelectedFile(null)
    setSelectedDocumentType("")
    setIsUploading(false)

    toast({
      title: "Upload Successful",
      description: `${selectedFile.name} has been uploaded successfully.`,
    })
  }

  const getStatusIcon = (status: DocumentStatus["status"]) => {
    switch (status) {
      case "uploaded":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "rejected":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusBadge = (status: DocumentStatus["status"]) => {
    switch (status) {
      case "uploaded":
        return <Badge className="bg-blue-100 text-blue-800">Uploaded</Badge>
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
      default:
        return <Badge variant="outline">Required</Badge>
    }
  }

  const uploadedCount = state.documents.filter((doc) => doc.status !== "not-uploaded").length
  const totalCount = state.documents.length
  const progressPercentage = (uploadedCount / totalCount) * 100

  const availableDocumentTypes = state.documents.filter((doc) => doc.status === "not-uploaded")

  return (
    <TransactionLayout currentStage="proof-of-funds" userRole="buyer">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CreditCard className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Proof of Funds - Buyer View</h1>
              <p className="text-muted-foreground">Upload required financial documents for verification.</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Badge
              className={`${
                state.overallStatus === "completed"
                  ? "bg-green-100 text-green-800"
                  : state.overallStatus === "in-progress"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-800"
              }`}
            >
              {state.overallStatus === "completed"
                ? "All Documents Uploaded"
                : state.overallStatus === "in-progress"
                  ? "In Progress"
                  : "Not Started"}
            </Badge>
            <Button
              onClick={handleResetDemo}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2 text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reset Demo</span>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Document Upload Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Overall Progress</span>
                  <span>
                    {uploadedCount} of {totalCount} documents
                  </span>
                </div>
                <Progress value={progressPercentage} className="w-full" />
              </div>

              <div className="space-y-3">
                {state.documents.map((doc) => (
                  <div key={doc.type} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(doc.status)}
                      <div>
                        <div className="font-medium text-sm">{doc.label}</div>
                        {doc.fileName && <div className="text-xs text-muted-foreground">{doc.fileName}</div>}
                      </div>
                    </div>
                    {getStatusBadge(doc.status)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5" />
                <span>Upload Document</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="document-type">Document Type</Label>
                <Select value={selectedDocumentType} onValueChange={setSelectedDocumentType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDocumentTypes.map((doc) => (
                      <SelectItem key={doc.type} value={doc.type}>
                        {doc.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="file-upload">Select File</Label>
                <Input
                  id="file-upload"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={handleFileSelect}
                  disabled={!selectedDocumentType}
                />
                {selectedFile && <p className="text-sm text-muted-foreground">Selected: {selectedFile.name}</p>}
              </div>

              <Button
                onClick={handleUpload}
                disabled={!selectedFile || !selectedDocumentType || isUploading}
                className="w-full"
              >
                {isUploading ? "Uploading..." : "Upload Document"}
              </Button>

              {availableDocumentTypes.length === 0 && (
                <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-green-800 font-medium">All documents uploaded!</p>
                  <p className="text-green-600 text-sm">Your proof of funds is ready for review.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">Estate Agent Review</span>
                </div>
                <Badge className="bg-blue-100 text-blue-800">Pending</Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Add Conveyancer</span>
                </div>
                <Badge variant="outline">Next Step</Badge>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-4">
                Once all documents are uploaded and approved, you can proceed to select your conveyancer.
              </p>
              <Button disabled={state.overallStatus !== "completed"} className="w-full bg-green-600 hover:bg-green-700">
                Continue to Add Conveyancer
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </TransactionLayout>
  )
}
