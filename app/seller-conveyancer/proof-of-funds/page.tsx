"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { TransactionLayout } from "@/components/transaction-layout"
import {
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  PoundSterling,
  User,
  Building2,
  Calendar,
  Download,
  Upload,
  Eye,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function SellerConveyancerProofOfFundsPage() {
  const [proofOfFundsStatus, setProofOfFundsStatus] = useState("pending")
  const [buyerDetails, setBuyerDetails] = useState({
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+44 7700 900123",
  })
  const [offerDetails, setOfferDetails] = useState({
    acceptedOffer: 450000,
    nutlipFee: 2250, // 0.5% of accepted offer
    sellerBalance: 447750,
  })
  const [documents, setDocuments] = useState([
    { id: 1, name: "Bank Statement - Current Account", status: "verified", uploadDate: "2024-01-15", size: "2.4 MB" },
    { id: 2, name: "Mortgage Agreement in Principle", status: "verified", uploadDate: "2024-01-15", size: "1.8 MB" },
    { id: 3, name: "Savings Account Statement", status: "pending", uploadDate: "2024-01-16", size: "1.2 MB" },
  ])
  const [notes, setNotes] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    const savedStatus = localStorage.getItem("seller-conveyancer-proof-of-funds-status")
    const savedNotes = localStorage.getItem("seller-conveyancer-proof-of-funds-notes")

    if (savedStatus) setProofOfFundsStatus(savedStatus)
    if (savedNotes) setNotes(savedNotes)
  }, [])

  const handleStatusChange = (newStatus: string) => {
    setProofOfFundsStatus(newStatus)
    localStorage.setItem("seller-conveyancer-proof-of-funds-status", newStatus)

    toast({
      title: "Status Updated",
      description: `Proof of funds status changed to ${newStatus}`,
    })
  }

  const handleNotesChange = (value: string) => {
    setNotes(value)
    localStorage.setItem("seller-conveyancer-proof-of-funds-notes", value)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "rejected":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-grey-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Verified</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending Review</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>
      default:
        return <Badge className="bg-grey-100 text-grey-800 border-grey-200">Unknown</Badge>
    }
  }

  return (
    <TransactionLayout>
      <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-grey-900">Proof of Funds Review</h1>
            <p className="text-sm sm:text-base text-grey-600 mt-1">Review and verify buyer's financial documentation</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">{getStatusBadge(proofOfFundsStatus)}</div>
        </div>

        {/* Buyer Information */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5 text-blue-600" />
              Buyer Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-medium text-grey-700">Full Name</Label>
                <p className="text-sm text-grey-900 mt-1">{buyerDetails.name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-grey-700">Email Address</Label>
                <p className="text-sm text-grey-900 mt-1">{buyerDetails.email}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-grey-700">Phone Number</Label>
                <p className="text-sm text-grey-900 mt-1">{buyerDetails.phone}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Offer Details */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <PoundSterling className="h-5 w-5 text-green-600" />
              Financial Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <Label className="text-sm font-medium text-blue-700">Accepted Offer Amount</Label>
                <p className="text-xl font-bold text-blue-900 mt-1">£{offerDetails.acceptedOffer.toLocaleString()}</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <Label className="text-sm font-medium text-orange-700">Nutlip Transaction Fee (0.5%)</Label>
                <p className="text-xl font-bold text-orange-900 mt-1">£{offerDetails.nutlipFee.toLocaleString()}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <Label className="text-sm font-medium text-green-700">Seller Balance</Label>
                <p className="text-xl font-bold text-green-900 mt-1">£{offerDetails.sellerBalance.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documents Review */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-purple-600" />
              Financial Documents
            </CardTitle>
            <CardDescription>Review and verify the buyer's proof of funds documentation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-grey-50 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-3 sm:mb-0">
                    {getStatusIcon(doc.status)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-grey-900 truncate">{doc.name}</p>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs text-grey-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {doc.uploadDate}
                        </span>
                        <span>{doc.size}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex items-center gap-1 text-xs bg-transparent">
                      <Eye className="h-3 w-3" />
                      <span className="hidden sm:inline">View</span>
                    </Button>
                    <Button size="sm" variant="outline" className="flex items-center gap-1 text-xs bg-transparent">
                      <Download className="h-3 w-3" />
                      <span className="hidden sm:inline">Download</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Review Actions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Review Decision</CardTitle>
            <CardDescription>Make your decision on the buyer's proof of funds</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="review-notes" className="text-sm font-medium">
                Review Notes
              </Label>
              <Textarea
                id="review-notes"
                placeholder="Add your review comments and any concerns..."
                value={notes}
                onChange={(e) => handleNotesChange(e.target.value)}
                className="mt-2 min-h-[100px]"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => handleStatusChange("verified")}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                disabled={proofOfFundsStatus === "verified"}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve Proof of Funds
              </Button>
              <Button
                onClick={() => handleStatusChange("rejected")}
                variant="destructive"
                className="flex-1"
                disabled={proofOfFundsStatus === "rejected"}
              >
                <AlertCircle className="h-4 w-4 mr-2" />
                Reject Documentation
              </Button>
              <Button
                onClick={() => handleStatusChange("pending")}
                variant="outline"
                className="flex-1"
                disabled={proofOfFundsStatus === "pending"}
              >
                <Clock className="h-4 w-4 mr-2" />
                Mark as Pending
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Additional Actions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Additional Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" className="flex-1 bg-transparent">
                <Building2 className="h-4 w-4 mr-2" />
                Contact Buyer's Bank
              </Button>
              <Button variant="outline" className="flex-1 bg-transparent">
                <Upload className="h-4 w-4 mr-2" />
                Request Additional Documents
              </Button>
              <Button variant="outline" className="flex-1 bg-transparent">
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </TransactionLayout>
  )
}
