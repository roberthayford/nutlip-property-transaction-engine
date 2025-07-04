import TransactionLayout from "@/components/transaction-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { HandHeart, Calendar, PoundSterling, Home } from "lucide-react"
import { MessengerChat } from "@/components/messenger-chat"
import Link from "next/link"

export default function BuyerOfferAcceptedPage() {
  return (
    <TransactionLayout currentStage="offer-accepted" userRole="buyer">
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <HandHeart className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Offer Accepted</h1>
            <p className="text-muted-foreground">Congratulations! Your offer has been accepted.</p>
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PoundSterling className="h-5 w-5" />
                <span>Offer Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Offer Amount:</span>
                <span className="font-semibold">£450,000</span>
              </div>
              <div className="flex justify-between">
                <span>Deposit:</span>
                <span className="font-semibold">£45,000</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <Badge className="bg-green-100 text-green-800">Accepted</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Next Steps</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold">Provide Proof of Funds</h4>
                    <p className="text-muted-foreground text-sm">
                      Submit documentation showing your ability to complete the purchase
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-muted rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold">Appoint Conveyancers</h4>
                    <p className="text-muted-foreground text-sm">Choose legal representatives for the transaction</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-muted rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold">Arrange Survey</h4>
                    <p className="text-muted-foreground text-sm">Book a property survey and searches</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t">
                <Link href="/buyer/proof-of-funds">
                  <Button className="w-full">Continue to Proof of Funds</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Messenger Chat */}
      <MessengerChat
        currentUserRole="buyer"
        currentUserName="John Smith"
        otherParticipant={{
          role: "estate-agent",
          name: "Sarah Johnson",
        }}
      />
    </TransactionLayout>
  )
}
