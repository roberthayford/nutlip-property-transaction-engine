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
import { Users, Star, Phone, Mail, MapPin, Plus, Search, CheckCircle, Clock } from "lucide-react"
import Link from "next/link"

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
  status?: "available" | "busy" | "requested"
}

const recommendedConveyancers: Conveyancer[] = [
  {
    id: "1",
    name: "Smith & Associates Legal",
    rating: 4.8,
    reviews: 124,
    location: "London, EC1A 1BB",
    phone: "020 7123 4567",
    email: "contact@smithlegal.co.uk",
    fee: "£1,200 + VAT",
    specialties: ["Residential Property", "First Time Buyers", "Buy-to-Let"],
    responseTime: "2-4 hours",
    status: "available",
  },
  {
    id: "2",
    name: "Thompson Property Law",
    rating: 4.6,
    reviews: 89,
    location: "London, W1A 0AX",
    phone: "020 7456 7890",
    email: "info@thompsonlaw.co.uk",
    fee: "£1,100 + VAT",
    specialties: ["Residential Property", "Leasehold", "New Builds"],
    responseTime: "1-3 hours",
    status: "available",
  },
  {
    id: "3",
    name: "Davies Legal Services",
    rating: 4.9,
    reviews: 156,
    location: "London, SW1A 2AA",
    phone: "020 7789 0123",
    email: "contact@davieslegal.co.uk",
    fee: "£1,350 + VAT",
    specialties: ["Residential Property", "Chain Management", "Commercial"],
    responseTime: "30 minutes",
    status: "busy",
  },
]

export default function BuyerConveyancersPage() {
  const [selectedConveyancer, setSelectedConveyancer] = useState<string | null>(null)
  const [showCustomForm, setShowCustomForm] = useState(false)
  const [requestedConveyancers, setRequestedConveyancers] = useState<string[]>([])
  const [customConveyancer, setCustomConveyancer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    message: "",
  })

  const handleRequestConveyancer = (conveyancerId: string) => {
    setRequestedConveyancers((prev) => [...prev, conveyancerId])
    // In a real app, this would send an API request
    console.log("Requesting conveyancer:", conveyancerId)
  }

  const handleCustomConveyancerSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would send an API request
    console.log("Custom conveyancer request:", customConveyancer)
    alert("Request sent to your conveyancer!")
    setCustomConveyancer({ name: "", email: "", phone: "", address: "", message: "" })
    setShowCustomForm(false)
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
    <TransactionLayout currentStage="conveyancers" userRole="buyer">
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <Users className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Choose Your Conveyancer</h1>
            <p className="text-muted-foreground">Select a legal representative to handle your property purchase.</p>
          </div>
        </div>

        {/* Selection Options */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card
            className={`cursor-pointer transition-all ${!showCustomForm ? "ring-2 ring-primary" : "hover:shadow-md"}`}
          >
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Search className="h-5 w-5" />
                <span>Choose from Recommended</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Select from our vetted list of experienced conveyancers.</p>
              <Button
                variant={!showCustomForm ? "default" : "outline"}
                className="mt-3 w-full"
                onClick={() => setShowCustomForm(false)}
              >
                Browse Conveyancers
              </Button>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all ${showCustomForm ? "ring-2 ring-primary" : "hover:shadow-md"}`}
          >
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="h-5 w-5" />
                <span>Add Your Own</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Already have a conveyancer? Send them a request to join.</p>
              <Button
                variant={showCustomForm ? "default" : "outline"}
                className="mt-3 w-full"
                onClick={() => setShowCustomForm(true)}
              >
                Add Custom Conveyancer
              </Button>
            </CardContent>
          </Card>
        </div>

        {!showCustomForm ? (
          /* Recommended Conveyancers List */
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Recommended Conveyancers</h2>
            <div className="grid gap-4">
              {recommendedConveyancers.map((conveyancer) => (
                <Card key={conveyancer.id} className="transition-all hover:shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold">{conveyancer.name}</h3>
                          {conveyancer.status === "busy" && (
                            <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                              <Clock className="h-3 w-3 mr-1" />
                              Busy
                            </Badge>
                          )}
                          {requestedConveyancers.includes(conveyancer.id) && (
                            <Badge className="bg-blue-100 text-blue-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Requested
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center space-x-1 mb-3">
                          {renderStars(conveyancer.rating)}
                          <span className="text-sm text-muted-foreground ml-2">
                            {conveyancer.rating} ({conveyancer.reviews} reviews)
                          </span>
                        </div>

                        <div className="grid gap-2 text-sm md:grid-cols-2">
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{conveyancer.location}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{conveyancer.phone}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span>{conveyancer.email}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>Response: {conveyancer.responseTime}</span>
                          </div>
                        </div>

                        <div className="mt-3">
                          <div className="flex flex-wrap gap-1">
                            {conveyancer.specialties.map((specialty, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="text-right ml-4">
                        <div className="text-lg font-semibold mb-3">{conveyancer.fee}</div>
                        <Button
                          onClick={() => handleRequestConveyancer(conveyancer.id)}
                          disabled={requestedConveyancers.includes(conveyancer.id) || conveyancer.status === "busy"}
                          className="w-full min-w-[120px]"
                        >
                          {requestedConveyancers.includes(conveyancer.id)
                            ? "Request Sent"
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
          </div>
        ) : (
          /* Custom Conveyancer Form */
          <Card>
            <CardHeader>
              <CardTitle>Add Your Own Conveyancer</CardTitle>
              <p className="text-sm text-muted-foreground">
                Send a request to your preferred conveyancer to join this transaction.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCustomConveyancerSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="conveyancer-name">Conveyancer/Firm Name *</Label>
                    <Input
                      id="conveyancer-name"
                      value={customConveyancer.name}
                      onChange={(e) => setCustomConveyancer((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter firm or conveyancer name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="conveyancer-email">Email Address *</Label>
                    <Input
                      id="conveyancer-email"
                      type="email"
                      value={customConveyancer.email}
                      onChange={(e) => setCustomConveyancer((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter email address"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="conveyancer-phone">Phone Number</Label>
                    <Input
                      id="conveyancer-phone"
                      value={customConveyancer.phone}
                      onChange={(e) => setCustomConveyancer((prev) => ({ ...prev, phone: e.target.value }))}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="conveyancer-address">Office Address</Label>
                    <Input
                      id="conveyancer-address"
                      value={customConveyancer.address}
                      onChange={(e) => setCustomConveyancer((prev) => ({ ...prev, address: e.target.value }))}
                      placeholder="Enter office address"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="conveyancer-message">Message (Optional)</Label>
                  <Textarea
                    id="conveyancer-message"
                    value={customConveyancer.message}
                    onChange={(e) => setCustomConveyancer((prev) => ({ ...prev, message: e.target.value }))}
                    placeholder="Add a personal message to your conveyancer..."
                    rows={3}
                  />
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">What happens next?</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Your conveyancer will receive an invitation email</li>
                    <li>• They'll need to create an account and accept the request</li>
                    <li>• Once accepted, they'll have access to all transaction documents</li>
                    <li>• You'll be notified when they join the transaction</li>
                  </ul>
                </div>

                <div className="flex space-x-3">
                  <Button type="submit" className="flex-1">
                    Send Request
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowCustomForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Seller Conveyancer Info */}
        <Card>
          <CardHeader>
            <CardTitle>Seller's Conveyancer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 border rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold">Johnson Legal Services</h3>
                  <div className="flex items-center space-x-1 mt-1">
                    {renderStars(4.2)}
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

            <div className="text-sm text-muted-foreground p-3 bg-muted rounded-lg mt-4">
              The seller has appointed their conveyancer. They will work with your chosen conveyancer to complete the
              transaction.
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Your Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="contact-name">Your Full Name</Label>
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
                <Button className="w-full" disabled={!selectedConveyancer && requestedConveyancers.length === 0}>
                  Continue to Draft Contract
                </Button>
              </Link>
              {!selectedConveyancer && requestedConveyancers.length === 0 && (
                <p className="text-sm text-muted-foreground text-center mt-2">
                  Please select or request a conveyancer to continue
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </TransactionLayout>
  )
}
