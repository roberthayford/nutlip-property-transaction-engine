"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, CheckCircle, Clock, AlertTriangle, Shield, FileText, Home, User } from "lucide-react"
import TransactionLayout from "@/components/transaction-layout"
import { useRealTime } from "@/contexts/real-time-context"

export default function BuyerSearchSurveyPage() {
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
    <TransactionLayout currentStage="search-survey" userRole="buyer">
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Search & Survey - Buyer View</h1>
          <p className="text-muted-foreground">
            Your conveyancer is conducting property searches and coordinating surveys to protect your purchase.
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
                  This stage involves your conveyancer and the seller's conveyancer conducting property searches and
                  coordinating surveys to ensure you have complete information about your purchase.
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
                    Your conveyancer is conducting property searches and coordinating surveys. You will be notified when
                    this stage is completed with the results.
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
                      Your conveyancer has completed the property searches and survey. The results are being reviewed to
                      protect your interests.
                    </p>
                  </div>
                </div>

                {completionData && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-grey-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-grey-600">Completed By</p>
                      <p className="text-sm">{completionData.completedBy || "Your Conveyancer"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-grey-600">Completion Date</p>
                      <p className="text-sm">
                        {completionData.completedAt
                          ? new Date(completionData.completedAt).toLocaleDateString()
                          : "Today"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-grey-600">Survey Type</p>
                      <p className="text-sm">{completionData.surveyType || "Homebuyer Report"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-grey-600">Next Stage</p>
                      <p className="text-sm">Enquiries</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Your Role During Searches & Survey */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Your Role During Searches & Survey</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2 flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>What You Need to Do</span>
              </h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Stay available for any questions from your conveyancer</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Review search and survey findings when provided</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Consider the impact of findings on your purchase decision</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Discuss any concerns with your conveyancer</span>
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
                  <span>Planning restrictions that might affect your use of the property</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-amber-600 mt-1">•</span>
                  <span>Environmental issues that could impact the property value</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-amber-600 mt-1">•</span>
                  <span>Structural problems identified in the survey</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-amber-600 mt-1">•</span>
                  <span>Unexpected costs that might arise from the findings</span>
                </li>
              </ul>
            </div>

            {/* Purchase Protection */}
            <div>
              <h4 className="font-semibold mb-2 flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>How Your Conveyancer Protects You</span>
              </h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start space-x-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>Reviews all search results for potential legal issues</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>Interprets survey findings and their implications</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>Identifies any legal restrictions on the property</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>Advises on insurance requirements and availability</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2 flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>What's Happening</span>
              </h4>
              <p className="text-sm text-muted-foreground">
                Your conveyancer is conducting comprehensive searches with local authorities, environmental agencies,
                and other relevant bodies. They're also coordinating property surveys to assess the physical condition
                of your potential new home. This thorough investigation protects you from hidden problems and ensures
                you're making an informed purchase decision.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2 flex items-center space-x-2">
                <Home className="h-4 w-4" />
                <span>Next Steps</span>
              </h4>
              <p className="text-sm text-muted-foreground">
                {searchSurveyCompleted
                  ? "Your conveyancer will now prepare enquiries based on the search and survey findings. They will raise any concerns with the seller's conveyancer to ensure all issues are properly addressed before you proceed with the purchase."
                  : "Once the searches and survey are completed, your conveyancer will review all findings and prepare enquiries to address any concerns. You'll be kept informed of any significant findings that might affect your purchase decision."}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </TransactionLayout>
  )
}
