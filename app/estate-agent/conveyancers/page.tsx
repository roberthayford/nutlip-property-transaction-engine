"use client"

import type React from "react"

import { useState } from "react"
import TransactionLayout from "@/components/transaction-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Users,
  Star,
  Phone,
  Mail,
  MapPin,
  Plus,
  Search,
  CheckCircle,
  Clock,
  Send,
  Building,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface Conveyancer {
  id: string
  name: string
  rating: number
  reviews: number
  location: string
  phone: string
  email: string
  fee: string
  specialties: string[]
  responseTime: string
  status?: "available" | "busy" | "requested" | "confirmed"
}

const recommendedConveyancers: Conveyancer[] = [
  {
    id: "1",
    name: "Johnson Legal Services",
    rating: 4.7,
    reviews: 156,
    location: "London, SW1A 2AA",
    phone: "020 7987 6543",
    email: "info@johnsonlegal.co.uk",
    fee: "£1,150 + VAT",
    specialties: ["Residential Property", "Seller Representation", "Leasehold"],
    responseTime: "1-2 hours",
    status: "available",
  },
  {
    id: "2",
    name: "Davies & Co Solicitors",
    rating: 4.9,
    reviews: 203,
    location: "London, EC2A 4DP",
    phone: "020 7456 7890",
    email: "contact@daviesco.co.uk",
    fee: "£1,300 + VAT",
    specialties: ["Residential Property", "Seller Representation", "Chain Management"],
    responseTime: "30 minutes",
    status: "available",
  },
  {
    id: "3",
    name: "Wilson Property Law",
    rating: 4.5,
    reviews: 89,
    location: "London, W1A 0AX",
    phone: "020 7123 4567",
    email: "enquiries@wilsonlaw.co.uk",
    fee: "£1,200 + VAT",
    specialties: ["Residential Property", "Seller Representation", "Freehold Sales"],
    responseTime: "2-4 hours",
    status: "available",
  },
  {
    id: "4",
    name: "Harper Legal Group",
    rating: 4.8,
    reviews: 134,
    location: "London, SE1 9GF",
    phone: "020 7789 0123",
    email: "info@harperlegal.co.uk",
    fee: "£1,250 + VAT",
    specialties: ["Residential Property", "Seller Representation", "New Builds"],
    responseTime: "1 hour",
    status: "busy",
  },
]

export default function EstateAgentConveyancersPage() {
  const [showCustomForm, setShowCustomForm] = useState(false)
  const [requestedConveyancers, setRequestedConveyancers] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [conveyancerAppointed, setConveyancerAppointed] = useState(false)
  const { toast } = useToast()

  const [customConveyancer, setCustomConveyancer] = useState({
    firmName: "",
    solicitorName: "",
    email: "",
    phone: "",
    address: "",
    message: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCustomConveyancer((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleRequestConveyancer = (conveyancerId: string) => {
    setRequestedConveyancers((prev) => [...prev, conveyancerId])
    setConveyancerAppointed(true)
    toast({
      title: "Request Sent Successfully",
      description: "Invitation sent to conveyancer on behalf of the seller.",
    })
  }

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast({
      title: "Invitation Sent Successfully",
      description: `Request sent to ${customConveyancer.firmName} on behalf of the seller.`,
    })

    // Reset form
    setCustomConveyancer({
      firmName: "",
      solicitorName: "",
      email: "",
      phone: "",
      address: "",
      message: "",
    })

    setIsSubmitting(false)
    setShowCustomForm(false)
    setConveyancerAppointed(true)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
      />
    ))
  }

  return (
    <TransactionLayout currentStage="conveyancers" userRole="estate-agent">
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <Users className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Conveyancers - Estate Agent View</h1>
            <p className="text-muted-foreground">Appoint a conveyancer for your seller client.</p>
          </div>
        </div>

        {/* Estate Agent Role Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Your Role as Seller's Representative
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Your Responsibilities</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Help your seller client find and appoint a qualified conveyancer</li>
                <li>• Facilitate communication between seller and their legal representative</li>
                <li>• Provide property information to the seller's conveyancer when needed</li>
                <li>• Monitor progress and coordinate with the buyer's conveyancer</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Current Status */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Buyer's Conveyancer</CardTitle>
              <p className="text-sm text-muted-foreground">Already appointed by the buyer</p>
            </CardHeader>
            <CardContent>
              <div className="p-4 border rounded-lg bg-gray-50">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">Smith & Associates Legal</h3>
                    <p className="text-sm text-muted-foreground">Appointed by: John Smith (Buyer)</p>
                    <div className="flex items-center space-x-1 mt-1">
                      {renderStars(4.8)}
                      <span className="text-sm text-muted-foreground ml-2">4.8 (124 reviews)</span>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
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
                    <span>Solicitor:</span>
                    <span className="font-semibold">David Wilson</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Fee:</span>
                    <span className="font-semibold">£1,200 + VAT</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700">
                  <CheckCircle className="h-4 w-4 inline mr-2" />
                  Buyer's conveyancer is confirmed and ready to proceed.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Seller's Conveyancer</CardTitle>
              <p className="text-sm text-muted-foreground">
                {conveyancerAppointed ? "Request sent - awaiting confirmation" : "Needs to be appointed"}
              </p>
            </CardHeader>
            <CardContent>
              {!conveyancerAppointed ? (
                <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-600 mb-2">No Conveyancer Appointed</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Your seller client needs to appoint a conveyancer to handle the legal aspects of the sale.
                  </p>
                  <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                    <Clock className="h-3 w-3 mr-1" />
                    Appointment Required
                  </Badge>
                </div>
              ) : (
                <div className="p-4 border rounded-lg bg-blue-50">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">Request Sent</h3>
                      <p className="text-sm text-muted-foreground">Awaiting conveyancer confirmation</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">Pending</Badge>
                  </div>

                  <div className="mt-4 p-3 bg-blue-100 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-700">
                      <Clock className="h-4 w-4 inline mr-2" />
                      The conveyancer will respond within 24 hours to confirm their appointment.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Conveyancer Selection - Only show if not appointed */}
        {!conveyancerAppointed && (
          <Card>
            <CardHeader>
              <CardTitle>Appoint Seller's Conveyancer</CardTitle>
              <p className="text-sm text-muted-foreground">
                Choose from our recommended conveyancers or add your seller's preferred choice.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 mb-6">
                <Card
                  className={`cursor-pointer transition-all ${!showCustomForm ? "ring-2 ring-primary" : "hover:shadow-md"}`}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Search className="h-5 w-5" />
                      <span>Recommended Conveyancers</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Choose from our vetted conveyancers specializing in seller representation.
                    </p>
                    <Button
                      variant={!showCustomForm ? "default" : "outline"}
                      className="mt-3 w-full"
                      onClick={() => setShowCustomForm(false)}
                    >
                      Browse Recommendations
                    </Button>
                  </CardContent>
                </Card>

                <Card
                  className={`cursor-pointer transition-all ${showCustomForm ? "ring-2 ring-primary" : "hover:shadow-md"}`}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Plus className="h-5 w-5" />
                      <span>Add Custom Conveyancer</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Invite your seller's preferred conveyancer to join the transaction.
                    </p>
                    <Button
                      variant={showCustomForm ? "default" : "outline"}
                      className="mt-3 w-full"
                      onClick={() => setShowCustomForm(true)}
                    >
                      Add Custom
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {!showCustomForm ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Recommended Conveyancers for Sellers</h3>
                  <div className="grid gap-4">
                    {recommendedConveyancers.map((conveyancer) => (
                      <Card key={conveyancer.id} className="transition-all hover:shadow-md">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h4 className="font-semibold">{conveyancer.name}</h4>
                                {requestedConveyancers.includes(conveyancer.id) && (
                                  <Badge className="bg-blue-100 text-blue-800">
                                    <Send className="h-3 w-3 mr-1" />
                                    Requested
                                  </Badge>
                                )}
                                {conveyancer.status === "busy" && (
                                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                                    <Clock className="h-3 w-3 mr-1" />
                                    Busy
                                  </Badge>
                                )}
                              </div>

                              <div className="flex items-center space-x-1 mb-3">
                                {renderStars(conveyancer.rating)}
                                <span className="text-sm text-muted-foreground ml-2">
                                  {conveyancer.rating} ({conveyancer.reviews} reviews)
                                </span>
                              </div>

                              <div className="grid gap-2 text-sm md:grid-cols-2 mb-3">
                                <div className="flex items-center space-x-2">
                                  <MapPin className="h-4 w-4 text-muted-foreground" />
                                  <span>{conveyancer.location}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <span>Response: {conveyancer.responseTime}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Phone className="h-4 w-4 text-muted-foreground" />
                                  <span>{conveyancer.phone}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Mail className="h-4 w-4 text-muted-foreground" />
                                  <span>{conveyancer.email}</span>
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-1">
                                {conveyancer.specialties.map((specialty) => (
                                  <Badge key={specialty} variant="outline" className="text-xs">
                                    {specialty}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <div className="text-right ml-4">
                              <div className="text-lg font-semibold mb-3">{conveyancer.fee}</div>
                              <Button
                                onClick={() => handleRequestConveyancer(conveyancer.id)}
                                disabled={
                                  conveyancer.status === "busy" || requestedConveyancers.includes(conveyancer.id)
                                }
                                size="sm"
                              >
                                {requestedConveyancers.includes(conveyancer.id)
                                  ? "Requested"
                                  : conveyancer.status === "busy"
                                    ? "Unavailable"
                                    : "Send Request"}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-medium text-yellow-800 mb-2">What happens next?</h4>
                    <p className="text-sm text-yellow-700">
                      When you send a request, the conveyancer will receive an invitation email with transaction
                      details. They will respond directly to confirm their availability and provide their terms of
                      engagement.
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Add Custom Conveyancer for Seller</h3>
                  <form onSubmit={handleCustomSubmit} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="firmName">Law Firm Name *</Label>
                        <Input
                          id="firmName"
                          name="firmName"
                          value={customConveyancer.firmName}
                          onChange={handleInputChange}
                          placeholder="e.g. Johnson Legal Services"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="solicitorName">Solicitor Name *</Label>
                        <Input
                          id="solicitorName"
                          name="solicitorName"
                          value={customConveyancer.solicitorName}
                          onChange={handleInputChange}
                          placeholder="e.g. Rachel Thompson"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={customConveyancer.email}
                          onChange={handleInputChange}
                          placeholder="solicitor@lawfirm.co.uk"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={customConveyancer.phone}
                          onChange={handleInputChange}
                          placeholder="020 7987 6543"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Office Address</Label>
                      <Input
                        id="address"
                        name="address"
                        value={customConveyancer.address}
                        onChange={handleInputChange}
                        placeholder="123 Legal Street, London, SW1A 2AA"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message to Conveyancer (Optional)</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={customConveyancer.message}
                        onChange={handleInputChange}
                        placeholder="Additional information about the property sale and your seller client..."
                        rows={3}
                      />
                    </div>

                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-medium text-blue-800 mb-2">Transaction Details</h4>
                      <div className="text-sm text-blue-700 space-y-1">
                        <p>• Property: 123 Example Street, London, SW1A 1AA</p>
                        <p>• Sale Price: £450,000</p>
                        <p>• Seller: Sarah Johnson</p>
                        <p>• Estate Agent: Your Agency Name</p>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <Button type="submit" disabled={isSubmitting} className="flex-1">
                        {isSubmitting ? (
                          <>
                            <Clock className="h-4 w-4 mr-2 animate-spin" />
                            Sending Invitation...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Send Invitation
                          </>
                        )}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setShowCustomForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Legal Process Status */}
        <Card>
          <CardHeader>
            <CardTitle>Legal Process Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium">Buyer's Conveyancer Appointed</span>
                </div>
                <Badge className="bg-green-100 text-green-800">Complete</Badge>
              </div>

              <div
                className={`flex items-center justify-between p-3 rounded-lg ${
                  conveyancerAppointed ? "bg-blue-50 border border-blue-200" : "bg-orange-50 border border-orange-200"
                }`}
              >
                <div className="flex items-center space-x-3">
                  {conveyancerAppointed ? (
                    <Clock className="h-5 w-5 text-blue-600" />
                  ) : (
                    <Clock className="h-5 w-5 text-orange-600" />
                  )}
                  <span className="font-medium">Seller's Conveyancer Appointment</span>
                </div>
                <Badge className={conveyancerAppointed ? "bg-blue-100 text-blue-800" : "bg-orange-100 text-orange-800"}>
                  {conveyancerAppointed ? "In Progress" : "Pending"}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Draft Contract Preparation</span>
                </div>
                <Badge variant="outline">Awaiting Conveyancers</Badge>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t">
              {conveyancerAppointed ? (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Ready to Proceed</h4>
                    <p className="text-sm text-green-700">
                      The seller's conveyancer request has been sent and both legal representatives will begin
                      coordinating the draft contract preparation once confirmed. You can now proceed to the next stage.
                    </p>
                  </div>

                  <Link href="/estate-agent/draft-contract">
                    <Button className="w-full group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                      <div className="relative flex items-center justify-center space-x-2">
                        <span className="font-semibold">Continue to Draft Contract</span>
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                      </div>
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Next Steps</h4>
                    <p className="text-sm text-blue-700">
                      Please appoint a conveyancer for your seller client above. Once both legal representatives are
                      confirmed, the draft contract preparation and property searches can begin.
                    </p>
                  </div>

                  <Button disabled className="w-full bg-transparent" variant="outline">
                    <Clock className="h-4 w-4 mr-2" />
                    Awaiting Seller's Conveyancer Appointment
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    This will become active once the seller's conveyancer is appointed
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </TransactionLayout>
  )
}
