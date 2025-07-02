import TransactionLayout from "@/components/transaction-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Home, Upload, CheckCircle, Clock, AlertTriangle, FileText } from "lucide-react"

export default function MortgageOfferPage() {
  return (
    <TransactionLayout currentStage="mortgage-offer">
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <Home className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Mortgage Offer</h1>
            <p className="text-muted-foreground">Secure your mortgage offer to complete the purchase.</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Mortgage Application Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Application Submitted</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Complete</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Credit Check</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Passed</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Property Valuation</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Complete</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-amber-600" />
                    <span>Final Underwriting</span>
                  </div>
                  <Badge className="bg-amber-100 text-amber-800">In Progress</Badge>
                </div>
              </div>

              <div className="pt-3 border-t">
                <div className="text-sm text-muted-foreground">Expected completion: 3-5 working days</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mortgage Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Lender:</span>
                  <span className="font-semibold">First National Bank</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Loan Amount:</span>
                  <span className="font-semibold">£405,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Interest Rate:</span>
                  <span className="font-semibold">4.25% (Fixed 5 years)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Term:</span>
                  <span className="font-semibold">25 years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monthly Payment:</span>
                  <span className="font-semibold">£2,234</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Product Fee:</span>
                  <span className="font-semibold">£999</span>
                </div>
              </div>

              <div className="pt-3 border-t">
                <div className="flex justify-between font-semibold">
                  <span>LTV Ratio:</span>
                  <span>90%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Required Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Payslips (3 months)</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Uploaded</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Bank Statements</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Uploaded</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                    <span>Employment Contract</span>
                  </div>
                  <Badge className="bg-amber-100 text-amber-800">Requested</Badge>
                </div>
              </div>

              <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">Upload additional documents</p>
                <Button variant="outline" size="sm">
                  Choose Files
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mortgage Broker</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">Premier Mortgage Solutions</h3>
                    <p className="text-sm text-muted-foreground">Your dedicated mortgage broker</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Broker:</span>
                    <span className="font-medium">Sarah Johnson</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phone:</span>
                    <span className="font-medium">020 7456 7890</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Email:</span>
                    <span className="font-medium">sarah@premiermortgage.co.uk</span>
                  </div>
                </div>
              </div>

              <Button variant="outline" className="w-full">
                Contact Broker
              </Button>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Mortgage Offer Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-amber-800">Awaiting Final Underwriting Decision</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        The lender is completing their final checks. This typically takes 3-5 working days.
                      </p>
                      <div className="text-xs text-muted-foreground">Expected: March 20, 2024</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg bg-muted">
                  <div className="flex items-start space-x-3">
                    <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Next: Formal Mortgage Offer</h4>
                      <p className="text-sm text-muted-foreground">
                        Once approved, you'll receive the formal mortgage offer document to review and accept.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t">
                <Button className="w-full" disabled>
                  Continue to Completion Date
                  <span className="ml-2 text-xs">(Awaiting mortgage offer)</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TransactionLayout>
  )
}
