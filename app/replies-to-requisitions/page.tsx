import TransactionLayout from "@/components/transaction-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Reply, Clock, CheckCircle, AlertTriangle, FileText } from "lucide-react"

export default function RepliesToRequisitionsPage() {
  return (
    <TransactionLayout currentStage="replies-to-requisitions">
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <Reply className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Replies to Requisitions</h1>
            <p className="text-muted-foreground">Final legal queries and responses before completion.</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Requisition Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Requisitions Received</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Complete</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-amber-600" />
                    <span>Replies in Progress</span>
                  </div>
                  <Badge className="bg-amber-100 text-amber-800">In Progress</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="h-5 w-5 text-muted-foreground" />
                    <span>Final Review</span>
                  </div>
                  <Badge variant="outline">Pending</Badge>
                </div>
              </div>

              <div className="pt-3 border-t text-sm text-muted-foreground">
                <p>8 requisitions received, 6 replies completed</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Completion Readiness</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Mortgage Funds</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Insurance Arranged</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-amber-600" />
                    <span>Final Searches</span>
                  </div>
                  <Badge className="bg-amber-100 text-amber-800">Updating</Badge>
                </div>
              </div>

              <div className="pt-3 border-t">
                <div className="text-sm text-muted-foreground">Completion scheduled: April 15, 2024</div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Outstanding Requisitions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-amber-600" />
                      <span className="font-medium">Requisition #6: Final Meter Readings</span>
                    </div>
                    <Badge className="bg-amber-100 text-amber-800">Reply Required</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Please provide final meter readings for gas, electricity, and water as of the completion date.
                  </p>
                  <div className="space-y-2">
                    <Textarea placeholder="Enter your reply here..." className="min-h-[80px]" />
                    <div className="flex space-x-2">
                      <Button size="sm">Submit Reply</Button>
                      <Button size="sm" variant="outline">
                        Save Draft
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-amber-600" />
                      <span className="font-medium">Requisition #8: Key Arrangements</span>
                    </div>
                    <Badge className="bg-amber-100 text-amber-800">Reply Required</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Please confirm arrangements for key handover on completion day, including location and contact
                    details.
                  </p>
                  <div className="space-y-2">
                    <Textarea placeholder="Enter your reply here..." className="min-h-[80px]" />
                    <div className="flex space-x-2">
                      <Button size="sm">Submit Reply</Button>
                      <Button size="sm" variant="outline">
                        Save Draft
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Completed Replies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-4 border rounded-lg bg-green-50">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="font-medium">Requisition #1: Property Vacant Possession</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Replied</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Query:</strong> Confirm property will be sold with vacant possession.
                  </p>
                  <p className="text-sm">
                    <strong>Reply:</strong> Confirmed - property will be vacant on completion with all personal
                    belongings removed.
                  </p>
                  <div className="text-xs text-muted-foreground mt-2">Replied: 2 days ago</div>
                </div>

                <div className="p-4 border rounded-lg bg-green-50">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="font-medium">Requisition #3: Outstanding Charges</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Replied</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Query:</strong> Confirm no outstanding service charges or ground rent.
                  </p>
                  <p className="text-sm">
                    <strong>Reply:</strong> All charges paid up to date. No outstanding amounts due.
                  </p>
                  <div className="text-xs text-muted-foreground mt-2">Replied: 1 day ago</div>
                </div>

                <Button variant="outline" className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  View All Replies
                </Button>
              </div>

              <div className="mt-6 pt-4 border-t">
                <Button className="w-full" disabled>
                  Continue to Final Transaction
                  <span className="ml-2 text-xs">(Complete all replies first)</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TransactionLayout>
  )
}
