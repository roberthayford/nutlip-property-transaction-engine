import TransactionLayout from "@/components/transaction-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DollarSign, CreditCard, Receipt, CheckCircle, Info } from "lucide-react"

export default function NutlipTransactionFeePage() {
  return (
    <TransactionLayout currentStage="nutlip-transaction-fee">
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <DollarSign className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Nutlip Transaction Fee</h1>
            <p className="text-muted-foreground">Complete your payment for using the Nutlip platform services.</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Fee Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Platform Service Fee:</span>
                  <span className="font-semibold">£299.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transaction Management:</span>
                  <span className="font-semibold">£199.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Document Processing:</span>
                  <span className="font-semibold">£99.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Communication Hub:</span>
                  <span className="font-semibold">£49.00</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="font-semibold">£646.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">VAT (20%):</span>
                    <span className="font-semibold">£129.20</span>
                  </div>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold">Total:</span>
                    <span className="font-bold text-primary">£775.20</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 border rounded-lg cursor-pointer hover:bg-accent">
                  <div className="flex items-center space-x-3">
                    <input type="radio" name="payment" id="card" defaultChecked />
                    <CreditCard className="h-5 w-5" />
                    <label htmlFor="card" className="font-medium cursor-pointer">
                      Credit/Debit Card
                    </label>
                  </div>
                </div>

                <div className="p-3 border rounded-lg cursor-pointer hover:bg-accent opacity-50">
                  <div className="flex items-center space-x-3">
                    <input type="radio" name="payment" id="bank" disabled />
                    <Receipt className="h-5 w-5" />
                    <label htmlFor="bank" className="font-medium cursor-pointer">
                      Bank Transfer
                    </label>
                    <Badge variant="secondary" className="ml-auto">
                      Coming Soon
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t">
                <div className="space-y-2">
                  <Label htmlFor="card-number">Card Number</Label>
                  <Input id="card-number" placeholder="1234 5678 9012 3456" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input id="expiry" placeholder="MM/YY" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input id="cvv" placeholder="123" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardholder">Cardholder Name</Label>
                  <Input id="cardholder" placeholder="John Smith" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Services Included</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Transaction Management</h4>
                    <p className="text-sm text-muted-foreground">Complete oversight of your property transaction</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Progress Tracking</h4>
                    <p className="text-sm text-muted-foreground">Real-time updates on all transaction stages</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Document Management</h4>
                    <p className="text-sm text-muted-foreground">Secure storage and sharing of all documents</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Communication Hub</h4>
                    <p className="text-sm text-muted-foreground">Centralized communication between all parties</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Expert Support</h4>
                    <p className="text-sm text-muted-foreground">Access to property transaction specialists</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg bg-green-50">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-green-800">Secure Payment</h4>
                    <p className="text-sm text-green-700">
                      Your payment is processed securely using industry-standard encryption.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>256-bit SSL encryption</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>PCI DSS compliant</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>No card details stored</span>
                </div>
              </div>

              <div className="pt-3 border-t">
                <div className="flex items-start space-x-2">
                  <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                  <p className="text-xs text-muted-foreground">
                    Payment is due before proceeding to the final transaction stage.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Complete Payment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-800">Payment Terms</h4>
                      <p className="text-sm text-blue-700">
                        By proceeding with payment, you agree to Nutlip's terms of service. This fee covers all platform
                        services for your property transaction.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="terms" className="rounded" />
                  <label htmlFor="terms" className="text-sm">
                    I agree to the{" "}
                    <a href="#" className="text-primary underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-primary underline">
                      Privacy Policy
                    </a>
                  </label>
                </div>

                <div className="space-y-3">
                  <Button className="w-full" size="lg">
                    Pay £775.20
                  </Button>
                  <Button variant="outline" className="w-full">
                    Continue to Replies to Requisitions
                    <span className="ml-2 text-xs">(Payment required first)</span>
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
