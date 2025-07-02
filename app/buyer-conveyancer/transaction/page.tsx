import { TransactionLayout } from "@/components/transaction-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Clock, Home, Key, CreditCard, FileText, Users } from "lucide-react"

export default function BuyerConveyancerTransactionPage() {
  return (
    <TransactionLayout
      currentStage="transaction"
      userRole="buyer-conveyancer"
      title="Transaction Completion"
      description="Final completion day coordination and post-completion tasks"
    >
      <div className="space-y-6">
        {/* Completion Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Completion Status
            </CardTitle>
            <CardDescription>Real-time status of completion day activities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center p-6 border-2 border-dashed border-green-200 rounded-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">Completion Day</div>
              <div className="text-sm text-muted-foreground mb-4">28th May 2024 - 2:00 PM</div>
              <Badge variant="default">
                <CheckCircle className="h-3 w-3 mr-1" />
                Ready for Completion
              </Badge>
            </div>
            <Progress value={95} className="h-3" />
            <p className="text-sm text-muted-foreground text-center">95% complete - Final checks in progress</p>
          </CardContent>
        </Card>

        {/* Completion Checklist */}
        <Card>
          <CardHeader>
            <CardTitle>Completion Day Checklist</CardTitle>
            <CardDescription>Essential tasks for successful completion</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm">Mortgage funds received from lender</span>
                <Badge variant="outline" className="ml-auto">
                  09:30 AM
                </Badge>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm">Completion statement agreed</span>
                <Badge variant="outline" className="ml-auto">
                  10:15 AM
                </Badge>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm">Purchase funds transferred to seller's conveyancer</span>
                <Badge variant="outline" className="ml-auto">
                  11:45 AM
                </Badge>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm">Title deeds received</span>
                <Badge variant="outline" className="ml-auto">
                  12:30 PM
                </Badge>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-yellow-600" />
                <span className="text-sm">Keys collection arranged</span>
                <Badge variant="secondary" className="ml-auto">
                  Pending
                </Badge>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-yellow-600" />
                <span className="text-sm">Land Registry application submitted</span>
                <Badge variant="secondary" className="ml-auto">
                  Pending
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Completion Financial Summary
            </CardTitle>
            <CardDescription>Final financial breakdown for completion</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-medium">Funds Required</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Purchase Price</span>
                    <span>£400,000.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Legal Fees</span>
                    <span>£1,200.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Search Fees</span>
                    <span>£350.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Stamp Duty</span>
                    <span>£10,000.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Land Registry Fee</span>
                    <span>£270.00</span>
                  </div>
                  <div className="flex justify-between font-medium border-t pt-2">
                    <span>Total Required</span>
                    <span>£411,820.00</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium">Funds Available</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Mortgage Advance</span>
                    <span>£320,000.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Client Deposit</span>
                    <span>£91,820.00</span>
                  </div>
                  <div className="flex justify-between font-medium border-t pt-2 text-green-600">
                    <span>Total Available</span>
                    <span>£411,820.00</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Collection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Key Collection Arrangements
            </CardTitle>
            <CardDescription>Arrangements for property key handover</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Collection Details</h4>
                <p className="text-sm text-muted-foreground">Estate Agent Office</p>
                <p className="text-sm text-muted-foreground">Premier Properties</p>
                <p className="text-sm text-muted-foreground">123 High Street, London</p>
                <p className="text-sm text-muted-foreground">Available from: 2:30 PM</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Contact Information</h4>
                <p className="text-sm text-muted-foreground">Contact: Sarah Williams</p>
                <p className="text-sm text-muted-foreground">Phone: 020 7456 7890</p>
                <p className="text-sm text-muted-foreground">Mobile: 07700 123456</p>
                <Badge variant="outline">Confirmed</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Post-Completion Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Post-Completion Tasks
            </CardTitle>
            <CardDescription>Tasks to be completed after successful completion</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-yellow-600" />
              <span className="text-sm">Submit Land Registry application (within 30 days)</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-yellow-600" />
              <span className="text-sm">Pay Stamp Duty Land Tax (within 14 days)</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-yellow-600" />
              <span className="text-sm">Send completion report to client</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-yellow-600" />
              <span className="text-sm">Archive transaction documents</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-yellow-600" />
              <span className="text-sm">Update client care records</span>
            </div>
          </CardContent>
        </Card>

        {/* Completion Confirmation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Completion Confirmation
            </CardTitle>
            <CardDescription>Confirmation from all parties involved</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center p-6 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-green-800 mb-2">Transaction Completed Successfully</h3>
              <p className="text-sm text-green-700">
                All parties have confirmed successful completion. The property has been transferred to Mr. & Mrs.
                Johnson.
              </p>
              <p className="text-xs text-green-600 mt-2">Completed: 28th May 2024 at 2:15 PM</p>
            </div>
          </CardContent>
        </Card>

        {/* Final Actions */}
        <div className="flex gap-4">
          <Button className="flex-1">Generate Completion Report</Button>
          <Button variant="outline" className="flex-1">
            Submit Land Registry Application
          </Button>
        </div>
      </div>
    </TransactionLayout>
  )
}
