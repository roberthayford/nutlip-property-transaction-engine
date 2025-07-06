"use client"

import { useState } from "react"
import TransactionLayout from "@/components/transaction-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Clock, Key, PoundSterling, Calendar, Phone } from "lucide-react"

export default function SellerConveyancerTransactionPage() {
  const [completionStatus, setCompletionStatus] = useState<"pending" | "in-progress" | "completed">("pending")
  const [notes, setNotes] = useState("")
  const completionProgress = 85

  return (
    <TransactionLayout title="Transaction Completion" stage="transaction" userRole="seller-conveyancer">
      <div className="space-y-6">
        {/* Completion Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Completion Day Status
            </CardTitle>
            <CardDescription>Manage the final completion of the property transaction</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className={`flex items-center justify-between p-4 border rounded-lg ${
                completionStatus === "completed"
                  ? "bg-green-50 border-green-200"
                  : completionStatus === "in-progress"
                    ? "bg-blue-50 border-blue-200"
                    : "bg-yellow-50 border-yellow-200"
              }`}
            >
              <div className="flex items-center gap-3">
                {completionStatus === "completed" ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <Clock className="h-5 w-5 text-blue-600" />
                )}
                <div>
                  <div className="font-medium">
                    {completionStatus === "completed"
                      ? "Transaction Completed"
                      : completionStatus === "in-progress"
                        ? "Completion in Progress"
                        : "Ready for Completion"}
                  </div>
                  <div className="text-sm text-grey-600">
                    {completionStatus === "completed"
                      ? "All tasks completed successfully"
                      : completionStatus === "in-progress"
                        ? "Completion process underway"
                        : "All pre-completion requirements satisfied"}
                  </div>
                </div>
              </div>
              <Badge
                variant={
                  completionStatus === "completed"
                    ? "default"
                    : completionStatus === "in-progress"
                      ? "secondary"
                      : "outline"
                }
              >
                {completionStatus === "completed"
                  ? "Completed"
                  : completionStatus === "in-progress"
                    ? "In Progress"
                    : "Ready"}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Completion Progress</span>
                <span>{completionProgress}%</span>
              </div>
              <Progress value={completionProgress} className="h-2" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-sm text-blue-800 mb-1">Completion Date</div>
                <div className="font-bold text-blue-900">15 April 2024</div>
                <div className="text-xs text-blue-700">Today</div>
              </div>

              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-sm text-green-800 mb-1">Sale Price</div>
                <div className="font-bold text-green-900">£300,000</div>
                <div className="text-xs text-green-700">Agreed price</div>
              </div>

              <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="text-sm text-purple-800 mb-1">Net Proceeds</div>
                <div className="font-bold text-purple-900">£291,250</div>
                <div className="text-xs text-purple-700">After deductions</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Completion Day Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Completion Day Tasks</CardTitle>
            <CardDescription>Essential tasks to complete on completion day</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { task: "Receive completion funds from buyer", completed: true, time: "10:00 AM" },
                { task: "Verify funds cleared in client account", completed: true, time: "10:15 AM" },
                { task: "Release keys to buyer/estate agent", completed: false, time: "11:00 AM" },
                { task: "Send completion statement to client", completed: false, time: "11:30 AM" },
                { task: "Transfer net proceeds to client", completed: false, time: "12:00 PM" },
                { task: "Submit completion return to HMRC", completed: false, time: "2:00 PM" },
                { task: "Send final invoice to client", completed: false, time: "3:00 PM" },
                { task: "Archive transaction files", completed: false, time: "4:00 PM" },
              ].map((task, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {task.completed ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Clock className="h-4 w-4 text-yellow-600" />
                    )}
                    <div>
                      <span className={`text-sm ${task.completed ? "text-grey-900" : "text-grey-600"}`}>
                        {task.task}
                      </span>
                      <div className="text-xs text-grey-500">{task.time}</div>
                    </div>
                  </div>
                  {!task.completed && (
                    <Button size="sm" variant="outline">
                      Complete
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Financial Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PoundSterling className="h-5 w-5" />
              Final Financial Summary
            </CardTitle>
            <CardDescription>Complete breakdown of completion finances</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-sm text-green-800 mb-2">Gross Sale Proceeds</div>
                <div className="text-2xl font-bold text-green-900">£300,000</div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Estate agent commission</span>
                  <span>-£4,500</span>
                </div>
                <div className="flex justify-between">
                  <span>Legal fees</span>
                  <span>-£1,500</span>
                </div>
                <div className="flex justify-between">
                  <span>Nutlip platform fee</span>
                  <span>-£2,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Other disbursements</span>
                  <span>-£750</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between font-bold text-lg">
                  <span>Net proceeds to client</span>
                  <span className="text-green-600">£291,250</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Handover */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Key Handover
            </CardTitle>
            <CardDescription>Manage the handover of property keys and documents</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 border rounded-lg">
                <div className="font-medium mb-2">Keys Available</div>
                <div className="space-y-1 text-sm">
                  <div>• Front door keys (2)</div>
                  <div>• Back door key (1)</div>
                  <div>• Garage remote (1)</div>
                  <div>• Window keys (set)</div>
                </div>
              </div>

              <div className="p-3 border rounded-lg">
                <div className="font-medium mb-2">Documents Ready</div>
                <div className="space-y-1 text-sm">
                  <div>• Property warranties</div>
                  <div>• Appliance manuals</div>
                  <div>• Utility contact details</div>
                  <div>• Council tax information</div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="font-medium text-blue-800 mb-2">Handover Arrangements</div>
              <p className="text-sm text-blue-700">
                Keys to be released to estate agent at 11:00 AM following confirmation of funds receipt.
              </p>
            </div>

            <Button className="w-full">
              <Key className="h-4 w-4 mr-2" />
              Confirm Key Handover
            </Button>
          </CardContent>
        </Card>

        {/* Post-Completion Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Post-Completion Tasks</CardTitle>
            <CardDescription>Tasks to complete after the transaction</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { task: "Send completion certificate to client", priority: "high" },
                { task: "Submit SDLT return (if applicable)", priority: "high" },
                { task: "Register discharge of mortgage", priority: "medium" },
                { task: "Send final bill to client", priority: "medium" },
                { task: "Update case management system", priority: "low" },
                { task: "Archive physical files", priority: "low" },
              ].map((task, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm">{task.task}</span>
                    <Badge
                      variant={
                        task.priority === "high" ? "destructive" : task.priority === "medium" ? "default" : "secondary"
                      }
                      className="text-xs"
                    >
                      {task.priority}
                    </Badge>
                  </div>
                  <Button size="sm" variant="outline">
                    Complete
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Completion Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Completion Notes</CardTitle>
            <CardDescription>Record important details about the completion</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="completion-notes">Final Notes</Label>
              <Textarea
                id="completion-notes"
                placeholder="Record any important details about the completion process, issues encountered, or follow-up actions required..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
            </div>

            <div className="flex gap-2">
              <Button>Save Notes</Button>
              <Button
                variant="default"
                onClick={() => setCompletionStatus("completed")}
                disabled={completionStatus === "completed"}
              >
                Mark Transaction Complete
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contacts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Emergency Contacts
            </CardTitle>
            <CardDescription>Important contacts for completion day issues</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 border rounded-lg">
                <div className="font-medium">Buyer's Conveyancer</div>
                <div className="text-sm text-grey-600">Smith & Partners</div>
                <div className="text-sm">020 7123 4567</div>
              </div>

              <div className="p-3 border rounded-lg">
                <div className="font-medium">Estate Agent</div>
                <div className="text-sm text-grey-600">Premier Properties</div>
                <div className="text-sm">020 7987 6543</div>
              </div>

              <div className="p-3 border rounded-lg">
                <div className="font-medium">Client</div>
                <div className="text-sm text-grey-600">Mr & Mrs Johnson</div>
                <div className="text-sm">07123 456789</div>
              </div>

              <div className="p-3 border rounded-lg">
                <div className="font-medium">Nutlip Support</div>
                <div className="text-sm text-grey-600">Platform Support</div>
                <div className="text-sm">0800 123 4567</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Success Message */}
        {completionStatus === "completed" && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <div>
                  <div className="font-bold text-green-800">Transaction Completed Successfully!</div>
                  <div className="text-sm text-green-700">
                    The property sale has been completed and all funds have been transferred. Please complete any
                    remaining post-completion tasks.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </TransactionLayout>
  )
}
