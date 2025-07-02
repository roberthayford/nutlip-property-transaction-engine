import TransactionLayout from "@/components/transaction-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Key, Home, FileText, Download, Star } from "lucide-react"

export default function TransactionPage() {
  return (
    <TransactionLayout currentStage="transaction">
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <CheckCircle className="h-8 w-8 text-green-600" />
          <div>
            <h1 className="text-3xl font-bold text-green-800">Transaction Complete!</h1>
            <p className="text-muted-foreground">
              Congratulations! Your property purchase has been successfully completed.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-green-800">
                <Home className="h-5 w-5" />
                <span>Property Ownership</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Property:</span>
                  <span className="font-semibold">123 Example Street</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Completion Date:</span>
                  <span className="font-semibold">April 15, 2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Purchase Price:</span>
                  <span className="font-semibold">£450,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Legal Title:</span>
                  <Badge className="bg-green-100 text-green-800">Transferred</Badge>
                </div>
              </div>

              <div className="pt-3 border-t border-green-200">
                <div className="flex items-center space-x-2">
                  <Key className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Keys collected at 10:30 AM</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transaction Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Purchase Price:</span>
                  <span className="font-semibold">£450,000.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Deposit Paid:</span>
                  <span className="font-semibold">£45,000.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mortgage Amount:</span>
                  <span className="font-semibold">£405,000.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Legal Fees:</span>
                  <span className="font-semibold">£1,440.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Stamp Duty:</span>
                  <span className="font-semibold">£12,500.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nutlip Fee:</span>
                  <span className="font-semibold">£775.20</span>
                </div>
              </div>

              <div className="pt-3 border-t">
                <div className="flex justify-between font-semibold">
                  <span>Total Costs:</span>
                  <span>£14,715.20</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Important Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <span>Title Deeds</span>
                  </div>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <span>Completion Statement</span>
                  </div>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <span>Energy Performance Certificate</span>
                  </div>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <span>Property Information Pack</span>
                  </div>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Button className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download All Documents
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Register with Local Council</h4>
                    <p className="text-sm text-muted-foreground">Update council tax records with your new address</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Update Address Records</h4>
                    <p className="text-sm text-muted-foreground">Notify banks, employers, and service providers</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Arrange Utilities</h4>
                    <p className="text-sm text-muted-foreground">
                      Set up gas, electricity, water, and internet services
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Home Insurance</h4>
                    <p className="text-sm text-muted-foreground">Ensure buildings and contents insurance is active</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Thank You for Using Nutlip</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="flex justify-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-6 w-6 text-yellow-400 fill-current" />
                  ))}
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">How was your experience?</h3>
                  <p className="text-muted-foreground mb-4">
                    Your feedback helps us improve our service for future property transactions.
                  </p>
                </div>

                <div className="flex space-x-3 justify-center">
                  <Button>Leave a Review</Button>
                  <Button variant="outline">Refer a Friend</Button>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Need help with your new property? Contact our support team at{" "}
                    <a href="mailto:support@nutlip.com" className="text-primary underline">
                      support@nutlip.com
                    </a>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TransactionLayout>
  )
}
