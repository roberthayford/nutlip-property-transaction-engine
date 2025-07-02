import TransactionLayout from "@/components/transaction-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Scale, FileText, Eye, Download, Clock, AlertCircle, CheckCircle } from "lucide-react"

export default function BuyerConveyancerProofOfFundsPage() {
  return (
    <TransactionLayout currentStage="proof-of-funds" userRole="buyer-conveyancer">
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <Scale className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Proof of Funds - Legal Review</h1>
            <p className="text-muted-foreground">Monitor and review client's financial documentation.</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Client Financial Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Client:</span>
                  <span className="font-semibold">John Smith</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Purchase Price:</span>
                  <span className="font-semibold">£450,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Required Deposit:</span>
                  <span className="font-semibold">£45,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mortgage Amount:</span>
                  <span className="font-semibold">£405,000</span>
                </div>
              </div>

              <div className="pt-3 border-t">
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-amber-600" />
                    <span className="text-sm font-medium text-amber-800">Awaiting Estate Agent Approval</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Document Review Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Bank Statements</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Submitted</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Mortgage AIP</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Submitted</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Deposit Source</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Submitted</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Submitted Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <span className="font-medium">Bank Statements (3 months)</span>
                        <Badge className="bg-blue-100 text-blue-800">Under Review</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p>File: bank_statements_jan_mar_2024.pdf</p>
                        <p>Uploaded: March 10, 2024</p>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <span className="font-medium">Mortgage Agreement in Principle</span>
                        <Badge className="bg-blue-100 text-blue-800">Under Review</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p>File: mortgage_aip_first_national.pdf</p>
                        <p>Uploaded: March 12, 2024</p>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-800">Legal Note</h4>
                      <p className="text-sm text-blue-700">
                        Documents are currently under review by the estate agent. Once approved, we can proceed with the
                        legal aspects of the transaction including contract review and property searches.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <Button className="w-full" disabled>
                    Proceed to Contract Review
                    <span className="ml-2 text-xs">(Awaiting proof of funds approval)</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TransactionLayout>
  )
}
