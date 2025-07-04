import TransactionLayout from "@/components/transaction-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { HandHeart, Users, Home, CheckCircle, Clock } from "lucide-react"
import { MessengerChat } from "@/components/messenger-chat"
import Link from "next/link"

export default function EstateAgentOfferAcceptedPage() {
  return (
    <TransactionLayout currentStage="offer-accepted" userRole="estate-agent">
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <HandHeart className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Offer Accepted - Estate Agent View</h1>
            <p className="text-muted-foreground">Manage the accepted offer and coordinate next steps.</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Home className="h-5 w-5" />
                <span>Property Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold">123 Example Street</h3>
                <p className="text-muted-foreground">London, SW1A 1AA</p>
              </div>
              <div className="flex items-center space-x-4">
                <Badge variant="secondary">3 Bed</Badge>
                <Badge variant="secondary">2 Bath</Badge>
                <Badge variant="secondary">Garden</Badge>
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between text-sm">
                  <span>Listed Price:</span>
                  <span className="font-semibold">£475,000</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Accepted Offer:</span>
                  <span className="font-semibold text-green-600">£450,000</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Parties Involved</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Buyer:</span>
                  <span className="font-semibold">John Smith</span>
                </div>
                <div className="flex justify-between">
                  <span>Seller:</span>
                  <span className="font-semibold">Mrs. Patricia Davies</span>
                </div>
                <div className="flex justify-between">
                  <span>Offer Date:</span>
                  <span className="font-semibold">March 8, 2024</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <Badge className="bg-green-100 text-green-800">Accepted</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Transaction Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium">Offer Accepted</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Complete</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Proof of Funds</span>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">Next Step</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">Conveyancers</span>
                  </div>
                  <Badge variant="outline">Pending</Badge>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t">
                <div className="grid gap-3 md:grid-cols-2">
                  <Link href="/estate-agent/proof-of-funds">
                    <Button className="w-full bg-green-600 hover:bg-green-700">Review Proof of Funds</Button>
                  </Link>
                  <Button variant="outline" className="w-full bg-transparent">
                    Contact Buyer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Messenger Chat */}
      <MessengerChat
        currentUserRole="estate-agent"
        currentUserName="Sarah Johnson"
        otherParticipant={{
          role: "buyer",
          name: "John Smith",
        }}
      />
    </TransactionLayout>
  )
}
