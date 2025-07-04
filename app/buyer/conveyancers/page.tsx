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
import { RealTimeActivityFeed } from "@/components/real-time-activity-feed"
import { MessengerChat } from "@/components/messenger-chat"
import { useRealTime } from "@/contexts/real-time-context"
import { useToast } from "@/hooks/use-toast"
import { Scale, Star, MapPin, Phone, Mail, Clock, CheckCircle, Plus, Building } from "lucide-react"
import Link from "next/link"

interface Conveyancer {
  id: string
  name: string
  firm: string
  location: string
  rating: number
  reviews: number
  phone: string
  email: string
  specialties: string[]
  fee: number
  estimatedTime: string
  selected?: boolean
}

const RECOMMENDED_CONVEYANCERS: Conveyancer[] = [
  {
    id: "1",
    name: "James Mitchell",
    firm: "Mitchell & Associates",
    location: "Central London",
    rating: 4.8,
    reviews: 127,
    phone: "020 7123 4567",
    email: "j.mitchell@mitchelllaw.co.uk",
    specialties: ["Residential Property", "First Time Buyers", "Chain Management"],
    fee: 1200,
    estimatedTime: "4-6 weeks",
  },
  {
    id: "2",
    name: "Sarah Thompson",
    firm: "Thompson Legal Services",
    location: "North London",
    rating: 4.9,
    reviews: 89,
    phone: "020 8234 5678",
    email: "s.thompson@thompsonlegal.co.uk",
    specialties: ["Property Law", "Leasehold", "New Builds"],
    fee: 950,
    estimatedTime: "3-5 weeks",
  },
  {
    id: "3",
    name: "Robert Chen",
    firm: "Chen Property Law",
    location: "East London",
    rating: 4.7,
    reviews: 156,
    phone: "020 7345 6789",
    email: "r.chen@chenproperty.co.uk",
    specialties: ["Commercial Property", "Investment Properties", "Auctions"],
    fee: 1100,
    estimatedTime: "4-7 weeks",
  },
]

export default function BuyerConveyancersPage() {
  const [selectedConveyancer, setSelectedConveyancer] = useState<string | null>(null)
  const [showCustomForm, setShowCustomForm] = useState(false)
  const [customConveyancer, setCustomConveyancer] = useState({
    name: "",
    firm: "",
    phone: "",
    email: "",
    notes: "",
  })
  const { sendUpdate } = useRealTime()
  const { toast } = useToast()

  const handleSelectConveyancer = (conveyancerId: string) => {
    setSelectedConveyancer(conveyancerId)
    const conveyancer = RECOMMENDED_CONVEYANCERS.find((c) => c.id === conveyancerId)

    if (conveyancer) {
      sendUpdate({
        type: "status_changed",
        stage: "conveyancers",
        role: "buyer",
        title: "Conveyancer Selected",
        description: `${conveyancer.name} from ${conveyancer.firm} has been selected`,
        data: {
          conveyancerId,
          conveyancerName: conveyancer.name,
          conveyancerFirm: conveyancer.firm,
        },
      })

      toast({
        title: "Conveyancer Selected",
        description: `${conveyancer.name} has been selected as your conveyancer.`,
      })
    }
  }

  const handleCustomConveyancerSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!customConveyancer.name || !customConveyancer.firm || !customConveyancer.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    sendUpdate({
      type: "status_changed",
      stage: "conveyancers",
      role: "buyer",
      title: "Custom Conveyancer Added",
      description: `${customConveyancer.name} from ${customConveyancer.firm} has been added`,
      data: {
        conveyancerName: customConveyancer.name,
        conveyancerFirm: customConveyancer.firm,
        isCustom: true,
      },
    })

    toast({
      title: "Conveyancer Added",
      description: `${customConveyancer.name} has been added successfully.`,
    })

    setShowCustomForm(false)
    setCustomConveyancer({ name: "", firm: "", phone: "", email: "", notes: "" })
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
          <Scale className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Select Your Conveyancer</h1>
            <p className="text-muted-foreground">Choose a legal representative for your property purchase</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Recommended Conveyancers */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Recommended Conveyancers</h2>
                <Button
                  variant="outline"
                  onClick={() => setShowCustomForm(!showCustomForm)}
                  className="flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Your Own</span>
                </Button>
              </div>

              {RECOMMENDED_CONVEYANCERS.map((conveyancer) => (
                <Card
                  key={conveyancer.id}
                  className={`cursor-pointer transition-all ${
                    selectedConveyancer === conveyancer.id ? "ring-2 ring-primary border-primary" : "hover:shadow-md"
                  }`}
                  onClick={() => handleSelectConveyancer(conveyancer.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold">{conveyancer.name}</h3>
                          {selectedConveyancer === conveyancer.id && <CheckCircle className="h-5 w-5 text-green-600" />}
                        </div>

                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-2">
                            <Building className="h-4 w-4" />
                            <span>{conveyancer.firm}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4" />
                            <span>{conveyancer.location}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4" />
                            <span>{conveyancer.phone}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4" />
                            <span>{conveyancer.email}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4" />
                            <span>Estimated completion: {conveyancer.estimatedTime}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 mt-3">
                          <div className="flex items-center space-x-1">
                            {renderStars(conveyancer.rating)}
                            <span className="text-sm font-medium ml-1">{conveyancer.rating}</span>
                            <span className="text-sm text-muted-foreground">({conveyancer.reviews} reviews)</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-3">
                          {conveyancer.specialties.map((specialty) => (
                            <Badge key={specialty} variant="secondary" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">£{conveyancer.fee}</div>
                        <div className="text-sm text-muted-foreground">Legal fees</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Custom Conveyancer Form */}
            {showCustomForm && (
              <Card>
                <CardHeader>
                  <CardTitle>Add Your Own Conveyancer</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCustomConveyancerSubmit} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Conveyancer Name *</Label>
                        <Input
                          id="name"
                          value={customConveyancer.name}
                          onChange={(e) => setCustomConveyancer((prev) => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter conveyancer's name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="firm">Law Firm *</Label>
                        <Input
                          id="firm"
                          value={customConveyancer.firm}
                          onChange={(e) => setCustomConveyancer((prev) => ({ ...prev, firm: e.target.value }))}
                          placeholder="Enter law firm name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={customConveyancer.phone}
                          onChange={(e) => setCustomConveyancer((prev) => ({ ...prev, phone: e.target.value }))}
                          placeholder="Enter phone number"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={customConveyancer.email}
                          onChange={(e) => setCustomConveyancer((prev) => ({ ...prev, email: e.target.value }))}
                          placeholder="Enter email address"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notes">Additional Notes</Label>
                      <Textarea
                        id="notes"
                        value={customConveyancer.notes}
                        onChange={(e) => setCustomConveyancer((prev) => ({ ...prev, notes: e.target.value }))}
                        placeholder="Any additional information about your conveyancer"
                        rows={3}
                      />
                    </div>
                    <div className="flex space-x-3">
                      <Button type="submit">Add Conveyancer</Button>
                      <Button type="button" variant="outline" onClick={() => setShowCustomForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Continue Button */}
            {selectedConveyancer && (
              <Card className="border-green-200 bg-green-50">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <div>
                      <h3 className="font-semibold text-green-900">Conveyancer Selected</h3>
                      <p className="text-sm text-green-700">You can now proceed to the next stage</p>
                    </div>
                  </div>
                  <Link href="/buyer/draft-contract">
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      Continue to Draft Contract Review
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Activity Feed */}
          <div className="space-y-6">
            <RealTimeActivityFeed />
          </div>
        </div>
      </div>

      {/* Messenger Chat */}
      <MessengerChat
        currentUserRole="buyer"
        currentUserName="John Smith"
        otherParticipant={{
          role: "estate-agent",
          name: "Sarah Johnson",
        }}
      />
    </TransactionLayout>
  )
}
