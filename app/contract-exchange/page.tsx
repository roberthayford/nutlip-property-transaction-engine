import TransactionLayout from "@/components/transaction-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Handshake, FileText, Clock, CheckCircle, AlertTriangle, DollarSign } from "lucide-react"

export default function ContractExchangePage() {
  return (
    <TransactionLayout currentStage="contract-exchange">
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <Handshake className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Contract Exchange</h1>
            <p className="text-muted-foreground">The legal point of no return - contracts become legally binding.</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Exchange Readiness</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Mortgage Offer</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Received</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Survey Complete</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Satisfactory</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Searches Complete</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Clear</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Enquiries Resolved</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Complete</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                    <span>Deposit Ready</span>
                  </div>
                  <Badge className="bg-amber-100 text-amber-800">Pending</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Exchange Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Exchange Date:</span>
                  <span className="font-semibold">March 25, 2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Completion Date:</span>
                  <span className="font-semibold">April 15, 2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Exchange Deposit:</span>
                  <span className="font-semibold">£45,000 (10%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Contract Price:</span>
                  <span className="font-semibold">£450,000</span>
                </div>
              </div>

              <div className="pt-3 border-t">
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold text-red-800">Important:</p>
                      <p className="text-red-700">
                        After exchange, you are legally committed to complete the purchase.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Deposit Transfer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold">Exchange Deposit</span>
                  </div>
                  <Badge className="bg-amber-100 text-amber-800">Required</Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span className="font-semibold">£45,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transfer to:</span>
                    <span className="font-semibold">Seller's Conveyancer</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Account:</span>
                    <span className="font-semibold">Johnson Legal Client Account</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Button className="w-full">Transfer Deposit</Button>
                <Button variant="outline" className="w-full">
                  View Transfer Instructions
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Legal Representatives</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Buyer's Conveyancer</span>
                    <Badge className="bg-green-100 text-green-800">Ready</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Smith & Associates Legal</p>
                </div>

                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Seller's Conveyancer</span>
                    <Badge className="bg-green-100 text-green-800">Ready</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Johnson Legal Services</p>
                </div>
              </div>

              <div className="text-sm text-muted-foreground p-3 bg-muted rounded-lg">
                Both conveyancers have confirmed readiness for contract exchange.
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Exchange Process</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center p-4 border rounded-lg">
                    <FileText className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <h4 className="font-semibold mb-1">1. Final Checks</h4>
                    <p className="text-sm text-muted-foreground">Conveyancers perform final verification</p>
                  </div>

                  <div className="text-center p-4 border rounded-lg">
                    <Handshake className="h-8 w-8 mx-auto mb-2 text-green-600" />
                    <h4 className="font-semibold mb-1">2. Exchange</h4>
                    <p className="text-sm text-muted-foreground">Contracts exchanged between parties</p>
                  </div>

                  <div className="text-center p-4 border rounded-lg">
                    <CheckCircle className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                    <h4 className="font-semibold mb-1">3. Binding</h4>
                    <p className="text-sm text-muted-foreground">Legal commitment established</p>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-800">Ready to Exchange</h4>
                      <p className="text-sm text-blue-700 mb-3">
                        All requirements have been met. Your conveyancer will coordinate the exchange with the seller's
                        conveyancer.
                      </p>
                      <Button className="bg-blue-600 hover:bg-blue-700">Authorize Contract Exchange</Button>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button className="w-full" disabled>
                    Continue to Nutlip Transaction Fee
                    <span className="ml-2 text-xs">(Complete exchange first)</span>
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
