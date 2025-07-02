import TransactionLayout from "@/components/transaction-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Users, Star, Phone, Mail, MapPin } from "lucide-react"
import Link from "next/link"

export default function BuyerConveyancersPage() {
  return (
    <TransactionLayout currentStage="conveyancers" userRole="buyer">
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <Users className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Conveyancers</h1>
            <p className="text-muted-foreground">Choose your legal representatives for the transaction.</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Buyer Conveyancer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">Smith & Associates Legal</h3>
                    <div className="flex items-center space-x-1 mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="text-sm text-muted-foreground ml-2">4.8 (124 reviews)</span>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Selected</Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>London, EC1A 1BB</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>020 7123 4567</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>contact@smithlegal.co.uk</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t">
                  <div className="flex justify-between text-sm">
                    <span>Fee:</span>
                    <span className="font-semibold">£1,200 + VAT</span>
                  </div>
                </div>
              </div>

              <Button variant="outline" className="w-full">
                Change Conveyancer
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Seller Conveyancer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">Johnson Legal Services</h3>
                    <div className="flex items-center space-x-1 mt-1">
                      {[1, 2, 3, 4].map((star) => (
                        <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                      <Star className="h-4 w-4 text-gray-300" />
                      <span className="text-sm text-muted-foreground ml-2">4.2 (89 reviews)</span>
                    </div>
                  </div>
                  <Badge variant="secondary">Seller's Choice</Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>London, SW1A 2AA</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>020 7987 6543</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>info@johnsonlegal.co.uk</span>
                  </div>
                </div>
              </div>

              <div className="text-sm text-muted-foreground p-3 bg-muted rounded-lg">
                The seller has appointed their conveyancer. You cannot change this selection.
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="contact-name">Your Contact Name</Label>
                  <Input id="contact-name" placeholder="Enter your full name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-phone">Phone Number</Label>
                  <Input id="contact-phone" placeholder="Enter your phone number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Email Address</Label>
                  <Input id="contact-email" type="email" placeholder="Enter your email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preferred-contact">Preferred Contact Method</Label>
                  <select id="preferred-contact" className="w-full p-2 border rounded-md">
                    <option>Email</option>
                    <option>Phone</option>
                    <option>Both</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t">
                <Link href="/buyer/draft-contract">
                  <Button className="w-full">Continue to Draft Contract</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TransactionLayout>
  )
}
