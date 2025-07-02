import TransactionLayout from "@/components/transaction-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare, Send, Clock, AlertCircle } from "lucide-react"

export default function EnquiriesPage() {
  return (
    <TransactionLayout currentStage="enquiries">
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <MessageSquare className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Enquiries</h1>
            <p className="text-muted-foreground">Legal and property enquiries between conveyancers.</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Enquiry Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Send className="h-5 w-5 text-blue-600" />
                    <span>Initial Enquiries Sent</span>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">Sent</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-amber-600" />
                    <span>Awaiting Responses</span>
                  </div>
                  <Badge className="bg-amber-100 text-amber-800">In Progress</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="h-5 w-5 text-muted-foreground" />
                    <span>Follow-up Enquiries</span>
                  </div>
                  <Badge variant="outline">Pending</Badge>
                </div>
              </div>

              <div className="pt-3 border-t text-sm text-muted-foreground">
                <p>12 enquiries sent, 8 responses received</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 border-l-4 border-green-500 bg-green-50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">Response Received</span>
                    <span className="text-xs text-muted-foreground">2 hours ago</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Property boundaries enquiry answered</p>
                </div>

                <div className="p-3 border-l-4 border-blue-500 bg-blue-50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">Enquiry Sent</span>
                    <span className="text-xs text-muted-foreground">1 day ago</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Additional fixtures & fittings clarification</p>
                </div>

                <div className="p-3 border-l-4 border-green-500 bg-green-50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">Response Received</span>
                    <span className="text-xs text-muted-foreground">2 days ago</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Building regulations compliance confirmed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Outstanding Enquiries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-amber-600" />
                      <span className="font-medium">Enquiry #7: Neighbour Disputes</span>
                    </div>
                    <Badge className="bg-amber-100 text-amber-800">Awaiting Response</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Please confirm if there have been any disputes with neighbours regarding boundaries, noise, or other
                    matters.
                  </p>
                  <div className="text-xs text-muted-foreground">Sent: 3 days ago</div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-amber-600" />
                      <span className="font-medium">Enquiry #9: Utilities & Services</span>
                    </div>
                    <Badge className="bg-amber-100 text-amber-800">Awaiting Response</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Please provide details of all utility connections and any service charges or maintenance agreements.
                  </p>
                  <div className="text-xs text-muted-foreground">Sent: 2 days ago</div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-amber-600" />
                      <span className="font-medium">Enquiry #11: Insurance Claims</span>
                    </div>
                    <Badge className="bg-amber-100 text-amber-800">Awaiting Response</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Have there been any insurance claims made on the property in the last 5 years?
                  </p>
                  <div className="text-xs text-muted-foreground">Sent: 1 day ago</div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-2">Additional Enquiry</label>
                    <Textarea placeholder="Type your additional enquiry here..." className="min-h-[100px]" />
                  </div>
                  <div className="flex space-x-3">
                    <Button variant="outline" className="flex-1">
                      Save Draft
                    </Button>
                    <Button className="flex-1">
                      <Send className="h-4 w-4 mr-2" />
                      Send Enquiry
                    </Button>
                  </div>
                </div>

                <div className="mt-6">
                  <Button className="w-full" disabled>
                    Continue to Mortgage Offer
                    <span className="ml-2 text-xs">(Complete all enquiries first)</span>
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
