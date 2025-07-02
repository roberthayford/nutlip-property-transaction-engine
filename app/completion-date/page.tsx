import TransactionLayout from "@/components/transaction-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, CheckCircle, AlertTriangle, Users } from "lucide-react"

export default function CompletionDatePage() {
  return (
    <TransactionLayout currentStage="completion-date">
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <Calendar className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Completion Date</h1>
            <p className="text-muted-foreground">
              Set the date when ownership will transfer and keys will be handed over.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Proposed Completion Date</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="completion-date">Select Completion Date</Label>
                <Input id="completion-date" type="date" defaultValue="2024-04-15" className="w-full" />
              </div>

              <div className="p-4 border rounded-lg bg-blue-50">
                <div className="flex items-start space-x-3">
                  <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-800">Proposed: April 15, 2024</h4>
                    <p className="text-sm text-blue-700">Monday - 10:00 AM</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="completion-time">Preferred Time</Label>
                <select id="completion-time" className="w-full p-2 border rounded-md">
                  <option>10:00 AM</option>
                  <option>11:00 AM</option>
                  <option>12:00 PM</option>
                  <option>2:00 PM</option>
                  <option>3:00 PM</option>
                </select>
              </div>

              <Button className="w-full">Propose Date</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Date Coordination</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-blue-600" />
                    <span>Buyer Availability</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-amber-600" />
                    <span>Seller Availability</span>
                  </div>
                  <Badge className="bg-amber-100 text-amber-800">Pending</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Buyer Conveyancer</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Available</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Seller Conveyancer</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Available</Badge>
                </div>
              </div>

              <div className="pt-3 border-t text-sm text-muted-foreground">
                <p>All parties must confirm availability before finalizing the completion date.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Completion Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <h4 className="font-semibold">Before Completion</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Mortgage offer received</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Contract exchange completed</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                      <span className="text-sm">Final searches updated</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                      <span className="text-sm">Buildings insurance arranged</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">On Completion Day</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Funds transfer to seller</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Legal title transfer</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Keys handed over</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Property registration</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t">
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-amber-800">Important Notice</h4>
                      <p className="text-sm text-amber-700">
                        The completion date cannot be changed once contracts are exchanged without agreement from all
                        parties.
                      </p>
                    </div>
                  </div>
                </div>

                <Button className="w-full mt-4">Continue to Contract Exchange</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TransactionLayout>
  )
}
