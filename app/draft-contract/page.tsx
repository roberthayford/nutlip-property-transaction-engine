"use client"

import TransactionLayout from "@/components/transaction-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Eye, Clock, CheckCircle } from "lucide-react"
import { trackDocumentAction } from "@/utils/analytics"

export default function DraftContractPage() {
  return (
    <TransactionLayout currentStage="draft-contract">
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <FileText className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Draft Contract</h1>
            <p className="text-muted-foreground">
              Review and approve the draft contract prepared by the seller's conveyancer.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Contract Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Draft Prepared</span>
                </div>
                <Badge className="bg-green-100 text-green-800">Complete</Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-amber-600" />
                  <span>Buyer Review</span>
                </div>
                <Badge className="bg-amber-100 text-amber-800">In Progress</Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span>Contract Approval</span>
                </div>
                <Badge variant="outline">Pending</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contract Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-medium">Sale Contract Draft v1.2</div>
                      <div className="text-sm text-muted-foreground">Updated 2 days ago</div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => trackDocumentAction('view', 'Sale Contract Draft')}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => trackDocumentAction('download', 'Sale Contract Draft')}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-medium">Property Information Form</div>
                      <div className="text-sm text-muted-foreground">Updated 3 days ago</div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => trackDocumentAction('view', 'Property Information Form')}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => trackDocumentAction('download', 'Property Information Form')}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-medium">Fixtures & Fittings List</div>
                      <div className="text-sm text-muted-foreground">Updated 1 week ago</div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => trackDocumentAction('view', 'Fixtures & Fittings List')}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => trackDocumentAction('download', 'Fixtures & Fittings List')}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Contract Key Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Purchase Price:</span>
                    <span className="font-semibold">£450,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Deposit:</span>
                    <span className="font-semibold">£45,000 (10%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Completion Date:</span>
                    <span className="font-semibold">To be agreed</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Property Type:</span>
                    <span className="font-semibold">Freehold</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Vacant Possession:</span>
                    <span className="font-semibold">Yes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Chain:</span>
                    <span className="font-semibold">No chain</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t space-y-3">
                <div className="flex space-x-3">
                  <Button variant="outline" className="flex-1">
                    Request Changes
                  </Button>
                  <Button className="flex-1">Approve Draft</Button>
                </div>
                <Button variant="secondary" className="w-full">
                  Continue to Search & Survey
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TransactionLayout>
  )
}
