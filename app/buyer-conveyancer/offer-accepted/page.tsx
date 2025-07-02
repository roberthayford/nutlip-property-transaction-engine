import TransactionLayout from "@/components/transaction-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Scale, Clock, CheckCircle, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function BuyerConveyancerOfferAcceptedPage() {
  return (
    <TransactionLayout currentStage="offer-accepted" userRole="buyer-conveyancer">
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <Scale className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Offer Accepted - Legal Overview</h1>
            <p className="text-muted-foreground">Legal preparation for the property purchase transaction.</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Client & Property Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Client:</span>
                  <span className="font-semibold">John Smith</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Property:</span>
                  <span className="font-semibold">123 Example Street</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Purchase Price:</span>
                  <span className="font-semibold">£450,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Deposit:</span>
                  <span className="font-semibold">£45,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Offer Status:</span>
                  <Badge className="bg-green-100 text-green-800">Accepted</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Legal Preparation Checklist</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Client Instructions Received</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Complete</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-amber-600" />
                    <span>Proof of Funds Review</span>
                  </div>
                  <Badge className="bg-amber-100 text-amber-800">In Progress</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <span>Draft Contract Review</span>
                  </div>
                  <Badge variant="outline">Pending</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Next Legal Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-800">Immediate Actions Required</h4>
                      <ul className="text-sm text-blue-700 mt-2 space-y-1">
                        <li>• Monitor client's proof of funds submission</li>
                        <li>• Prepare for contract review once received</li>
                        <li>• Coordinate with seller's conveyancer</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <Link href="/buyer-conveyancer/proof-of-funds">
                    <Button className="w-full bg-purple-600 hover:bg-purple-700">Monitor Proof of Funds</Button>
                  </Link>
                  <Button variant="outline" className="w-full">
                    Contact Client
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
