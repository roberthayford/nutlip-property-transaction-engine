"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, CheckCircle, Clock, AlertTriangle, Eye, FileText, Home, Users } from "lucide-react"
import TransactionLayout from "@/components/transaction-layout"
import { useRealTime } from "@/contexts/real-time-context"

export default function EstateAgentSearchSurveyPage() {
  const { updates } = useRealTime()
  const [searchSurveyCompleted, setSearchSurveyCompleted] = useState(false)
  const [completionData, setCompletionData] = useState<any>(null)

  // Listen for search-survey completion updates
  useEffect(() => {
    const searchSurveyUpdate = updates.find(
      (update) => update.type === "stage_completed" && update.stage === "search-survey" && !update.read,
    )

    if (searchSurveyUpdate) {
      setSearchSurveyCompleted(true)
      setCompletionData(searchSurveyUpdate.data)
    }
  }, [updates])

  return (
    <TransactionLayout currentStage="search-survey" userRole="estate-agent">
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Search & Survey - Estate Agent View</h1>
          <p className="text-muted-foreground">
            Monitor the property searches and survey process being conducted by the conveyancers.
          </p>
        </div>

        {/* Conveyancer Stage Info */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <Search className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900">Conveyancer-Handled Stage</h3>
                <p className="text-sm text-blue-700">
                  Property searches and surveys are being conducted by the buyer's conveyancer. Your role is to monitor
                  progress and facilitate property access as needed.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="h-5 w-5" />
              <span>Search & Survey Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!searchSurveyCompleted ? (
              <div className="flex items-center space-x-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <Clock className="h-6 w-6 text-amber-600" />
                <div>
                  <h4 className="font-semibold text-amber-900">Awaiting Search & Survey Completion</h4>
                  <p className="text-sm text-amber-700">
                    The buyer's conveyancer is conducting property searches and coordinating surveys. You will be
                    notified when this stage is completed.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <div>
                    <h4 className="font-semibold text-green-900">Search & Survey Completed</h4>
                    <p className="text-sm text-green-700">
                      The property searches and survey have been completed by the buyer's conveyancer.
                    </p>
                  </div>
                </div>

                {completionData && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Completed By</p>
                      <p className="text-sm">{completionData.completedBy || "Buyer's Conveyancer"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Completion Date</p>
                      <p className="text-sm">
                        {completionData.completedAt
                          ? new Date(completionData.completedAt).toLocaleDateString()
                          : "Today"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Survey Type</p>
                      <p className="text-sm">{completionData.surveyType || "Homebuyer Report"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Next Stage</p>
                      <p className="text-sm">Enquiries</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Estate Agent Monitoring Role */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="h-5 w-5" />
              <span>Estate Agent Monitoring Role</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2 flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Your Responsibilities</span>
              </h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Monitor the progress of property searches and surveys</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Facilitate property access for surveyors when required</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Provide property information to conveyancers if requested</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Keep all parties informed of any access arrangements</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2 flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4" />
                <span>Watch For</span>
              </h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start space-x-2">
                  <span className="text-amber-600 mt-1">•</span>
                  <span>Planning restrictions that might affect the sale</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-amber-600 mt-1">•</span>
                  <span>Environmental concerns raised in searches</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-amber-600 mt-1">•</span>
                  <span>Survey findings that might affect the agreed price</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-amber-600 mt-1">•</span>
                  <span>Access issues for property surveys</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2 flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>What's Happening</span>
              </h4>
              <p className="text-sm text-muted-foreground">
                The buyer's conveyancer is conducting comprehensive property searches with local authorities and
                coordinating property surveys. This stage ensures the buyer has full knowledge of the property's legal
                status and physical condition before proceeding with the purchase.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2 flex items-center space-x-2">
                <Home className="h-4 w-4" />
                <span>Next Steps</span>
              </h4>
              <p className="text-sm text-muted-foreground">
                {searchSurveyCompleted
                  ? "The conveyancers will now proceed to the enquiries stage, where they will raise and respond to legal and property enquiries based on the search and survey findings."
                  : "Once searches and surveys are completed, the conveyancers will proceed to raise enquiries based on their findings. You may be contacted if any issues require clarification about the property."}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </TransactionLayout>
  )
}
