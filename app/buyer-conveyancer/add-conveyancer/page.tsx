import { TransactionLayout } from "@/components/transaction-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, Users, FileText, Phone, Mail } from "lucide-react"
import Link from "next/link"

export default function BuyerConveyancerConveyancersPage() {
  return (
    <TransactionLayout
      currentStage="conveyancers"
      userRole="buyer-conveyancer"
      title="Conveyancer Coordination"
      description="Coordinate with the seller's conveyancer and manage legal documentation"
    >
      <div className="space-y-6">
        {/* Seller Conveyancer Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Seller's Conveyancer Details
            </CardTitle>
            <CardDescription>Contact information and coordination status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Smith & Associates Solicitors</h4>
                <p className="text-sm text-muted-foreground">Sarah Johnson, Partner</p>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4" />
                  <span>020 7123 4567</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4" />
                  <span>sarah.johnson@smithassociates.co.uk</span>
                </div>
              </div>
              <div className="space-y-2">
                <Badge variant="secondary" className="w-fit">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Contact Established
                </Badge>
                <p className="text-sm text-muted-foreground">Initial contact made on 15th March 2024</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Coordination Checklist */}
        <Card>
          <CardHeader>
            <CardTitle>Coordination Checklist</CardTitle>
            <CardDescription>Essential coordination tasks with the seller's conveyancer</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span>Initial contact established</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span>Contract pack requested</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-yellow-600" />
              <span>Awaiting property information forms</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-yellow-600" />
              <span>Title deeds review pending</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-yellow-600" />
              <span>Local authority searches coordination</span>
            </div>
          </CardContent>
        </Card>

        {/* Recent Communications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Recent Communications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="border-l-2 border-blue-200 pl-4 py-2">
              <p className="font-medium text-sm">Contract Pack Request</p>
              <p className="text-sm text-muted-foreground">Sent to seller's conveyancer - 16th March 2024</p>
            </div>
            <div className="border-l-2 border-green-200 pl-4 py-2">
              <p className="font-medium text-sm">Initial Contact Email</p>
              <p className="text-sm text-muted-foreground">Received response - 15th March 2024</p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button asChild>
            <Link href="/buyer-conveyancer/draft-contract">Continue to Draft Contract</Link>
          </Button>
          <Button variant="outline">Send Follow-up Email</Button>
        </div>
      </div>
    </TransactionLayout>
  )
}
