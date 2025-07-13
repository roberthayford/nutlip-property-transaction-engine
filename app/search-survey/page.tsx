import TransactionLayout from "@/components/transaction-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Home, FileText, AlertTriangle, CheckCircle, Clock } from "lucide-react"
import { trackDocumentAction, trackFeatureUsage } from "@/utils/analytics"

export default function SearchSurveyPage() {
  return (
    <TransactionLayout currentStage="search-survey">
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <Search className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Search & Survey</h1>
            <p className="text-muted-foreground">
              Property searches and surveys to ensure you're making an informed purchase.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Search className="h-5 w-5" />
                <span>Property Searches</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Local Authority Search</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Complete</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Environmental Search</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Complete</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-amber-600" />
                    <span>Water & Drainage Search</span>
                  </div>
                  <Badge className="bg-amber-100 text-amber-800">In Progress</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <span>Chancel Repair Search</span>
                  </div>
                  <Badge variant="outline">Pending</Badge>
                </div>
              </div>

              <div className="pt-3 border-t">
                <div className="flex justify-between text-sm">
                  <span>Total Search Cost:</span>
                  <span className="font-semibold">£350 + VAT</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Home className="h-5 w-5" />
                <span>Property Survey</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">HomeBuyer Report</h3>
                    <p className="text-sm text-muted-foreground">Comprehensive property condition report</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">Booked</Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Survey Date:</span>
                    <span className="font-medium">March 15, 2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Surveyor:</span>
                    <span className="font-medium">ABC Property Surveys</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cost:</span>
                    <span className="font-medium">£650</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => trackDocumentAction('view', 'Survey Report')}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  View Survey Report (Available after survey)
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => trackFeatureUsage('survey', 'reschedule')}
                >
                  Reschedule Survey
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Search Results Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-green-800">Local Authority Search - Clear</h4>
                      <p className="text-sm text-muted-foreground">
                        No planning restrictions or enforcement notices found.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-amber-800">Environmental Search - Minor Issues</h4>
                      <p className="text-sm text-muted-foreground">
                        Low risk flood zone identified. Recommend flood insurance review.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg bg-muted">
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Remaining searches in progress...</h4>
                      <p className="text-sm text-muted-foreground">Expected completion: 3-5 working days</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t">
                <Button className="w-full" disabled>
                  Continue to Enquiries
                  <span className="ml-2 text-xs">(Complete all searches first)</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TransactionLayout>
  )
}
