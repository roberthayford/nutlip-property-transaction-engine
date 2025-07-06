"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import TransactionLayout from "@/components/transaction-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageSquare, Bell, Info, CheckCircle, Clock, Home, ArrowRight, Users, FileText } from "lucide-react"
import { useRealTime } from "@/contexts/real-time-context"

export default function EstateAgentEnquiriesPage() {
  const { updates, markAsRead } = useRealTime()
  const router = useRouter()
  const [enquiriesStatus, setEnquiriesStatus] = useState<"awaiting" | "completed">("awaiting")
  const [completionData, setCompletionData] = useState<any>(null)

  // Listen once for an unread "enquiries" completion update
  useEffect(() => {
    const latest = updates.find((u) => !u.read && u.type === "stage_completed" && u.stage === "enquiries")

    if (latest) {
      setEnquiriesStatus("completed")
      setCompletionData(latest.data)
      markAsRead(latest.id) // mark it read so we don't trigger again
    }
  }, [updates, markAsRead])

  const handleContinueToMortgageOffer = () => {
    router.push("/estate-agent/mortgage-offer")
  }

  return (
    <TransactionLayout currentStage="enquiries" userRole="estate-agent">
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <MessageSquare className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Enquiries - Estate Agent View</h1>
            <p className="text-muted-foreground">Monitor legal enquiry progress and transaction coordination.</p>
          </div>
        </div>

        {/* Estate Agent Monitoring Role */}
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <Info className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-green-900 mb-2">Estate Agent Monitoring Role</h3>
                <p className="text-green-800 text-sm mb-3">
                  During the enquiries stage, the buyer's and seller's conveyancers handle all legal enquiries and
                  responses. As the estate agent, your role is to monitor progress and ensure the transaction continues
                  smoothly toward completion.
                </p>
                <div className="flex items-center space-x-2 text-green-700 text-sm">
                  <Bell className="h-4 w-4" />
                  <span>You will be automatically notified when this stage is completed and any issues arise.</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Notification Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {enquiriesStatus === "awaiting" ? (
                <>
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-amber-50 border-amber-200">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-amber-600" />
                      <div>
                        <h4 className="font-semibold text-amber-900">Awaiting Completion Notification</h4>
                        <p className="text-sm text-amber-800">
                          Conveyancers are handling all legal enquiries. You will be notified when completed.
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-amber-100 text-amber-800">Monitoring</Badge>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50 border-green-200">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <h4 className="font-semibold text-green-900">Enquiries Stage Completed</h4>
                      <p className="text-sm text-green-800">
                        All pre-contract enquiries have been resolved by the conveyancers.
                      </p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Completed</Badge>
                  </div>

                  {completionData && (
                    <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
                      <h4 className="font-semibold text-blue-900 mb-2">Completion Summary</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-blue-700">Total Enquiries:</span>
                          <span className="font-medium ml-2">{completionData.totalEnquiries}</span>
                        </div>
                        <div>
                          <span className="text-blue-700">Answered:</span>
                          <span className="font-medium ml-2">{completionData.answeredEnquiries}</span>
                        </div>
                        <div>
                          <span className="text-blue-700">Completed:</span>
                          <span className="font-medium ml-2">
                            {new Date(completionData.completedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-blue-700">Next Stage:</span>
                          <span className="font-medium ml-2 capitalize">
                            {completionData.nextStage?.replace("-", " ")}
                          </span>
                        </div>
                      </div>
                      <div className="mt-4">
                        <Button
                          onClick={handleContinueToMortgageOffer}
                          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Home className="h-4 w-4" />
                          Continue to Mortgage Offer
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}

              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2 text-green-800">Stage Completion</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  You will be notified immediately when all enquiries are resolved and this stage is completed.
                </p>
                <div className="text-xs text-green-600">✓ Email and in-app notification enabled</div>
              </div>

              <div className="p-4 bg-grey-50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Next Steps:</strong>{" "}
                  {enquiriesStatus === "completed"
                    ? "The transaction has automatically progressed to the mortgage offer stage."
                    : "Once all enquiries are resolved by the conveyancers, you will be notified and the transaction will automatically progress to the mortgage offer stage."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estate Agent Role Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Your Role During Enquiries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                <Users className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-green-900 mb-1">Transaction Coordination</h4>
                  <p className="text-sm text-green-800">
                    Monitor the enquiries process to ensure both parties' conveyancers are progressing efficiently and
                    address any coordination issues that may arise.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                <Bell className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">Progress Monitoring</h4>
                  <p className="text-sm text-blue-800">
                    Stay informed about enquiry progress and completion timelines to keep all parties updated on
                    transaction status and expected next steps.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-amber-50 rounded-lg">
                <FileText className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-900 mb-1">Issue Escalation</h4>
                  <p className="text-sm text-amber-800">
                    If significant delays or complex enquiries arise that could affect the transaction timeline, you may
                    need to facilitate communication between parties or escalate to senior management.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-purple-900 mb-1">Client Communication</h4>
                  <p className="text-sm text-purple-800">
                    Keep your clients (buyer and seller) informed about enquiry progress and any potential impacts on
                    the transaction timeline or completion date.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TransactionLayout>
  )
}
