import TransactionLayout from "@/components/transaction-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Home, Key, FileText, Calendar, Users, DollarSign, Bell } from "lucide-react"

export default function BuyerTransactionPage() {
  return (
    <TransactionLayout currentStage="transaction" userRole="buyer">
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <CheckCircle className="h-8 w-8 text-green-600" />
          <div>
            <h1 className="text-3xl font-bold text-green-800">Transaction Complete!</h1>
            <p className="text-muted-foreground">Congratulations! You are now the owner of your new property.</p>
          </div>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
          <div className="flex items-start space-x-3">
            <Bell className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-800">Transaction Completed by Conveyancers</h4>
              <p className="text-sm text-blue-700">
                This final stage was completed by <strong>your conveyancer</strong> and the{" "}
                <strong>seller's conveyancer</strong>. All legal requirements have been fulfilled and ownership has been
                successfully transferred.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Home className="h-5 w-5 text-green-600" />
                <span>Your New Property</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">123 Example Street</h3>
                <p className="text-muted-foreground">London, SW1A 1AA</p>
              </div>
              <div className="flex items-center space-x-4">
                <Badge variant="secondary">3 Bed</Badge>
                <Badge variant="secondary">2 Bath</Badge>
                <Badge variant="secondary">Garden</Badge>
              </div>
              <div className="pt-3 border-t">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Purchase Price:</span>
                  <span className="font-semibold text-green-600">£450,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Completion Date:</span>
                  <span className="font-semibold">April 15, 2024</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Key className="h-5 w-5 text-blue-600" />
                <span>Keys & Access</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <h4 className="font-semibold text-green-800">Keys Collected</h4>
                    <p className="text-sm text-green-700">You have received all keys and access codes</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Front Door Keys:</span>
                  <span className="font-medium">2 sets</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Back Door Keys:</span>
                  <span className="font-medium">2 sets</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Garage Remote:</span>
                  <span className="font-medium">1 unit</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Alarm Code:</span>
                  <span className="font-medium">Provided</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-purple-600" />
                <span>Important Documents</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Title Deeds</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Received</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Energy Performance Certificate</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Received</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Building Warranties</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Received</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Property Information Pack</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Received</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-orange-600" />
                <span>Transaction Team</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Estate Agent</span>
                    <Badge className="bg-green-100 text-green-800">Complete</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Sarah Johnson - Premium Properties</p>
                </div>

                <div className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Your Conveyancer</span>
                    <Badge className="bg-green-100 text-green-800">Complete</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">David Wilson - Smith & Associates</p>
                </div>

                <div className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Seller's Conveyancer</span>
                    <Badge className="bg-green-100 text-green-800">Complete</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Rachel Thompson - Johnson Legal</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span>Next Steps</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Immediate Actions</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Set up utilities in your name (gas, electricity, water)</li>
                    <li>• Register with the local council for council tax</li>
                    <li>• Update your address with banks, insurance, and other services</li>
                    <li>• Arrange buildings and contents insurance</li>
                  </ul>
                </div>

                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Within the First Month</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Register to vote at your new address</li>
                    <li>• Find local services (GP, dentist, schools if applicable)</li>
                    <li>• Update your driving license and vehicle registration</li>
                    <li>• Notify your employer of your address change</li>
                  </ul>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <Button className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Download All Documents
                  </Button>
                  <Button variant="outline" className="w-full">
                    <DollarSign className="h-4 w-4 mr-2" />
                    View Transaction Summary
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
