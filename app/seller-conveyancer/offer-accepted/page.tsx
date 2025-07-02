import TransactionLayout from "@/components/transaction-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Clock, CheckCircle, AlertTriangle, Home } from "lucide-react"
import Link from "next/link"

export default function SellerConveyancerOfferAcceptedPage() {
  return (
    <TransactionLayout currentStage="offer-accepted" userRole="seller-conveyancer">
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <Users className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Offer Accepted - Seller's Legal View</h1>
            <p className="text-muted-foreground">Prepare legal documentation for the property sale.</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Sale Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Seller:</span>
                  <span className="font-semibold">Mrs. Patricia Davies</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Buyer:</span>
                  <span className="font-semibold">John Smith</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Property:</span>
                  <span className="font-semibold">123 Example Street</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sale Price:</span>
                  <span className="font-semibold">£450,000</span>
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
              <CardTitle>Legal Preparation Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Seller Instructions</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Complete</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-amber-600" />
                    <span>Title Deeds Review</span>
                  </div>
                  <Badge className="bg-amber-100 text-amber-800">In Progress</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <span>Draft Contract Preparation</span>
                  </div>
                  <Badge variant="outline">Pending</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Immediate Actions Required</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-orange-800">Contract Preparation</h4>
                      <ul className="text-sm text-orange-700 mt-2 space-y-1">
                        <li>• Prepare draft contract for buyer's conveyancer</li>
                        <li>• Gather property information forms</li>
                        <li>• Compile fixtures and fittings list</li>
                        <li>• Review title deeds and restrictions</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Home className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-800">Property Documentation</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Ensure all property documentation is current and accurate before contract preparation.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <Link href="/seller-conveyancer/draft-contract">
                    <Button className="w-full bg-orange-600 hover:bg-orange-700">Prepare Draft Contract</Button>
                  </Link>
                  <Button variant="outline" className="w-full">
                    Contact Seller
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
