"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import TransactionLayout from "@/components/transaction-layout"
import { useRealTime } from "@/contexts/real-time-context"
import {
  Phone,
  Mail,
  Building,
  Calendar,
  CheckCircle,
  Clock,
  User,
  AlertCircle,
  Bell,
  MapPin,
  FileText,
} from "lucide-react"
import Link from "next/link"

interface ConveyancerRequest {
  id: string
  conveyancerId: string
  conveyancerName: string
  conveyancerFirm: string
  conveyancerEmail: string
  conveyancerPhone: string
  conveyancerAddress: string
  requestType: "buyer" | "seller"
  requestedBy: string
  requestedTo: string
  status: "pending" | "accepted" | "declined"
  requestId: string
  createdAt: Date
}

export default function SellerConveyancerAddConveyancerPage() {
  const { toast } = useToast()
  const { updates, sendUpdate, markAsRead } = useRealTime()
  const [incomingRequests, setIncomingRequests] = useState<ConveyancerRequest[]>([])
  const [acceptingRequest, setAcceptingRequest] = useState<string | null>(null)
  const [hasAcceptedRequest, setHasAcceptedRequest] = useState(false)

  // Listen for incoming conveyancer requests
  useEffect(() => {
    const conveyancerRequests = updates
      .filter(
        (update) =>
          update.stage === "add-conveyancer" &&
          update.type === "conveyancer_request" &&
          update.data &&
          (update.data as any).requestedTo === "seller-conveyancer",
      )
      .map((update) => ({
        id: update.id,
        ...(update.data as any),
        createdAt: update.createdAt,
      })) as ConveyancerRequest[]

    setIncomingRequests(conveyancerRequests)
  }, [updates])

  // Check if we've already accepted a request
  useEffect(() => {
    const acceptedRequest = updates.find(
      (update) =>
        update.stage === "add-conveyancer" &&
        update.type === "conveyancer_accepted" &&
        update.role === "seller-conveyancer",
    )

    if (acceptedRequest) {
      setHasAcceptedRequest(true)
    }
  }, [updates])

  const handleAcceptRequest = async (request: ConveyancerRequest) => {
    setAcceptingRequest(request.requestId)

    try {
      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Send acceptance update
      sendUpdate({
        stage: "add-conveyancer",
        role: "seller-conveyancer",
        type: "conveyancer_accepted",
        title: "Conveyancer Appointment Accepted",
        description: `Accepted appointment as ${request.requestType}'s conveyancer`,
        data: {
          ...request,
          acceptedAt: new Date(),
          status: "accepted",
        },
      })

      // Mark the original request as read
      markAsRead(request.id)

      setHasAcceptedRequest(true)

      toast({
        title: "Request Accepted!",
        description: `You have accepted the appointment as ${request.requestType}'s conveyancer. The transaction will now proceed to the Draft Contract stage.`,
      })

      // Auto-redirect to draft contract after a short delay
      setTimeout(() => {
        window.location.href = "/seller-conveyancer/draft-contract"
      }, 2000)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to accept the request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setAcceptingRequest(null)
    }
  }

  const handleDeclineRequest = async (request: ConveyancerRequest) => {
    try {
      // Send decline update
      sendUpdate({
        stage: "add-conveyancer",
        role: "seller-conveyancer",
        type: "conveyancer_declined",
        title: "Conveyancer Appointment Declined",
        description: `Declined appointment as ${request.requestType}'s conveyancer`,
        data: {
          ...request,
          declinedAt: new Date(),
          status: "declined",
        },
      })

      // Mark the original request as read
      markAsRead(request.id)

      toast({
        title: "Request Declined",
        description: "You have declined the conveyancer appointment.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to decline the request. Please try again.",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string | Date) => {
    const date = typeof dateString === "string" ? new Date(dateString) : dateString
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const pendingRequests = incomingRequests.filter(
    (req) =>
      !updates.some(
        (update) => update.type === "conveyancer_accepted" && (update.data as any)?.requestId === req.requestId,
      ) &&
      !updates.some(
        (update) => update.type === "conveyancer_declined" && (update.data as any)?.requestId === req.requestId,
      ),
  )

  return (
    <TransactionLayout currentStage="add-conveyancer" userRole="seller-conveyancer">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Conveyancer Appointments</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">Manage your conveyancer appointment requests</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Bell className="h-4 w-4" />
            <span>
              {pendingRequests.length} Pending Request{pendingRequests.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Status Card */}
        {hasAcceptedRequest ? (
          <Card className="border-2 border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <CheckCircle className="h-5 w-5" />
                Appointment Confirmed
              </CardTitle>
              <CardDescription>
                You have successfully accepted a conveyancer appointment for this transaction.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <Link href="/seller-conveyancer/draft-contract">
                  <Button size="lg" className="px-8 py-3">
                    <FileText className="h-5 w-5 mr-2" />
                    Continue to Draft Contract
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : pendingRequests.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Waiting for Appointment Requests
              </CardTitle>
              <CardDescription>No conveyancer appointment requests have been received yet.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <User className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">
                  When estate agents or clients request your services as a conveyancer, the requests will appear here
                  for you to accept or decline.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-2 border-blue-200 bg-blue-50/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <Bell className="h-5 w-5" />
                Incoming Appointment Requests
                <Badge className="bg-red-100 text-red-800 animate-pulse">{pendingRequests.length} New</Badge>
              </CardTitle>
              <CardDescription>Review and respond to conveyancer appointment requests</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {pendingRequests.map((request) => (
                <div
                  key={request.requestId}
                  className="border rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">Conveyancer Appointment Request</h3>
                        <Badge className="bg-orange-100 text-orange-800">
                          {request.requestType.charAt(0).toUpperCase() + request.requestType.slice(1)}'s Conveyancer
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          From: {request.requestedBy.replace("-", " ")}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <User className="h-4 w-4 text-gray-400" />
                            <span className="font-medium">Your Details:</span>
                          </div>
                          <div className="ml-6 space-y-1 text-sm text-gray-600">
                            <div>{request.conveyancerName}</div>
                            <div className="flex items-center gap-1">
                              <Building className="h-3 w-3" />
                              {request.conveyancerFirm}
                            </div>
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {request.conveyancerEmail}
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {request.conveyancerPhone}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {request.conveyancerAddress}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="font-medium">Request Details:</span>
                          </div>
                          <div className="ml-6 space-y-1 text-sm text-gray-600">
                            <div>Received: {formatDate(request.createdAt)}</div>
                            <div>
                              Role: {request.requestType.charAt(0).toUpperCase() + request.requestType.slice(1)}'s
                              Conveyancer
                            </div>
                            <div>Requested by: {request.requestedBy.replace("-", " ")}</div>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                          <div className="text-sm text-blue-700">
                            <p className="font-medium mb-1">Appointment Request</p>
                            <p>
                              You have been requested to act as the {request.requestType}'s conveyancer for this
                              property transaction. Accepting this request will add you to the transaction and allow you
                              to proceed with the legal work.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button variant="outline" onClick={() => handleDeclineRequest(request)} className="px-6">
                      Decline
                    </Button>
                    <Button
                      onClick={() => handleAcceptRequest(request)}
                      disabled={acceptingRequest === request.requestId}
                      className="px-6 bg-green-600 hover:bg-green-700"
                    >
                      {acceptingRequest === request.requestId ? (
                        <>
                          <Clock className="h-4 w-4 mr-2 animate-spin" />
                          Accepting...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Accept Appointment
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              About Conveyancer Appointments
            </CardTitle>
            <CardDescription>Understanding the conveyancer appointment process</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Your Responsibilities</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Review and respond to appointment requests promptly</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Ensure you have capacity to handle the transaction</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Confirm your contact details are accurate</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Begin legal work once appointment is confirmed</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Next Steps</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Accept the conveyancer appointment request</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-4 h-4 border-2 border-gray-300 rounded mt-0.5 flex-shrink-0"></div>
                    <span>Proceed to Draft Contract stage</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-4 h-4 border-2 border-gray-300 rounded mt-0.5 flex-shrink-0"></div>
                    <span>Begin legal due diligence and contract preparation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-4 h-4 border-2 border-gray-300 rounded mt-0.5 flex-shrink-0"></div>
                    <span>Coordinate with other parties in the transaction</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TransactionLayout>
  )
}
