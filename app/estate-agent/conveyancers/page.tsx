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
import {
  Scale,
  Star,
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  Plus,
  Building,
  Users,
  Send,
  Loader2,
} from "lucide-react"
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
  type: "buyer" | "seller"
  status: "pending" | "requested" | "appointed"
}

const CONVEYANCERS: Conveyancer[] = [
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
    type: "buyer",
    status: "appointed",
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
    type: "seller",
    status: "pending",
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
    type: "seller",
    status: "pending",
  },
]

export default function EstateAgentConveyancersPage() {
  const [conveyancers, setConveyancers] = useState<Conveyancer[]>(CONVEYANCERS)
  const [showCustomForm, setShowCustomForm] = useState(false)
  const [requestingConveyancer, setRequestingConveyancer] = useState<string | null>(null)
  const [customConveyancer, setCustomConveyancer] = useState({
    name: "",
    firm: "",
    phone: "",
    email: "",
    type: "seller" as "buyer" | "seller",
    notes: "",
  })
  const { sendUpdate } = useRealTime()
  const { toast } = useToast()

  const handleRequestConveyancer = async (conveyancerId: string) => {
    setRequestingConveyancer(conveyancerId)
    const conveyancer = conveyancers.find((c) => c.id === conveyancerId)

    if (!conveyancer) return

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setConveyancers((prev) => prev.map((c) => (c.id === conveyancerId ? { ...c, status: "requested" } : c)))

      sendUpdate({
        type: "status_changed",
        stage: "conveyancers",
        role: "estate-agent",
        title: "Conveyancer Requested",
        description: `Request sent to ${conveyancer.name} for ${conveyancer.type} representation`,
        data: {
          conveyancerId,
          conveyancerName: conveyancer.name,
          conveyancerType: conveyancer.type,
        },
      })

      toast({
        title: "Request Sent",
        description: `Request sent to ${conveyancer.name} successfully.`,
      })

      // Simulate acceptance after delay
      setTimeout(() => {
        setConveyancers((prev) => prev.map((c) => (c.id === conveyancerId ? { ...c, status: "appointed" } : c)))

        sendUpdate({
          type: "status_changed",
          stage: "conveyancers",
          role: "estate-agent",
          title: "Conveyancer Appointed",
          description: `${conveyancer.name} has accepted the appointment`,
          data: {
            conveyancerId,
            conveyancerName: conveyancer.name,
            conveyancerType: conveyancer.type,
          },
        })

        toast({
          title: "Conveyancer Appointed",
          description: `${conveyancer.name} has accepted the appointment.`,
        })
      }, 3000)
    } catch (error) {
      toast({
        title: "Request Failed",
        description: "There was an error sending the request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setRequestingConveyancer(null)
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

    const newConveyancer: Conveyancer = {
      id: crypto.randomUUID(),
      name: customConveyancer.name,
      firm: customConveyancer.firm,
      location: "Custom",
      rating: 0,
      reviews: 0,
      phone: customConveyancer.phone,
      email: customConveyancer.email,
      specialties: ["Custom Conveyancer"],
      fee: 0,
      estimatedTime: "TBD",
      type: customConveyancer.type,
      status: "appointed",
    }

    setConveyancers((prev) => [...prev, newConveyancer])

    sendUpdate({
      type: "status_changed",
      stage: "conveyancers",
      role: "estate-agent",
      title: "Custom Conveyancer Added",
      description: `${customConveyancer.name} from ${customConveyancer.firm} has been added`,
      data: {
        conveyancerName: customConveyancer.name,
        conveyancerFirm: customConveyancer.firm,
        conveyancerType: customConveyancer.type,
        isCustom: true,
      },
    })

    toast({
      title: "Conveyancer Added",
      description: `${customConveyancer.name} has been added successfully.`,
    })

    setShowCustomForm(false)
    setCustomConveyancer({ name: "", firm: "", phone: "", email: "", type: "seller", notes: "" })
  }

  const renderStars = (rating: number) => {
    if (rating === 0) return <span className="text-sm text-muted-foreground">No ratings</span>
    return (
      <div className="flex items-center space-x-1">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
          />
        ))}
        <span className="text-sm font-medium ml-1">{rating}</span>
      </div>
    )
  }

  const getStatusBadge = (status: Conveyancer["status"]) => {
    switch (status) {
      case "appointed":
        return <Badge className="bg-green-100 text-green-800">Appointed</Badge>
      case "requested":
        return <Badge className="bg-blue-100 text-blue-800">Requested</Badge>
      case "pending":
        return <Badge variant="outline">Available</Badge>
    }
  }

  const buyerConveyancers = conveyancers.filter((c) => c.type === "buyer")
  const sellerConveyancers = conveyancers.filter((c) => c.type === "seller")
  const allConveyancersAppointed =
    buyerConveyancers.some((c) => c.status === "appointed") && sellerConveyancers.some((c) => c.status === "appointed")

  return (
    <TransactionLayout currentStage="conveyancers" userRole="estate-agent">
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <Scale className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Manage Conveyancers</h1>
            <p className="text-muted-foreground">Coordinate legal representation for both parties</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Buyer Conveyancers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Buyer Conveyancers</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {buyerConveyancers.map((conveyancer) => (
                  <div key={conveyancer.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold">{conveyancer.name}</h3>
                          {conveyancer.status === "appointed" && <CheckCircle className="h-5 w-5 text-green-600" />}
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
                          {conveyancer.estimatedTime !== "TBD" && (
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4" />
                              <span>Estimated completion: {conveyancer.estimatedTime}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center space-x-4 mt-3">
                          {renderStars(conveyancer.rating)}
                          {conveyancer.reviews > 0 && (
                            <span className="text-sm text-muted-foreground">({conveyancer.reviews} reviews)</span>
                          )}
                        </div>

                        {conveyancer.specialties.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {conveyancer.specialties.map((specialty) => (
                              <Badge key={specialty} variant="secondary" className="text-xs">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="text-right space-y-2">
                        {conveyancer.fee > 0 && (
                          <div>
                            <div className="text-lg font-bold text-primary">£{conveyancer.fee}</div>
                            <div className="text-sm text-muted-foreground">Legal fees</div>
                          </div>
                        )}
                        {getStatusBadge(conveyancer.status)}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Seller Conveyancers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Scale className="h-5 w-5" />
                    <span>Seller Conveyancers</span>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setShowCustomForm(!showCustomForm)}
                    className="flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Custom</span>
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {sellerConveyancers.map((conveyancer) => (
                  <div key={conveyancer.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold">{conveyancer.name}</h3>
                          {conveyancer.status === "appointed" && <CheckCircle className="h-5 w-5 text-green-600" />}
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
                          {conveyancer.estimatedTime !== "TBD" && (
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4" />
                              <span>Estimated completion: {conveyancer.estimatedTime}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center space-x-4 mt-3">
                          {renderStars(conveyancer.rating)}
                          {conveyancer.reviews > 0 && (
                            <span className="text-sm text-muted-foreground">({conveyancer.reviews} reviews)</span>
                          )}
                        </div>

                        {conveyancer.specialties.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {conveyancer.specialties.map((specialty) => (
                              <Badge key={specialty} variant="secondary" className="text-xs">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="text-right space-y-2">
                        {conveyancer.fee > 0 && (
                          <div>
                            <div className="text-lg font-bold text-primary">£{conveyancer.fee}</div>
                            <div className="text-sm text-muted-foreground">Legal fees</div>
                          </div>
                        )}
                        {getStatusBadge(conveyancer.status)}
                        {conveyancer.status === "pending" && (
                          <Button
                            size="sm"
                            onClick={() => handleRequestConveyancer(conveyancer.id)}
                            disabled={requestingConveyancer === conveyancer.id}
                            className="flex items-center space-x-1"
                          >
                            {requestingConveyancer === conveyancer.id ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Requesting...</span>
                              </>
                            ) : (
                              <>
                                <Send className="h-4 w-4" />
                                <span>Request</span>
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Custom Conveyancer Form */}
            {showCustomForm && (
              <Card>
                <CardHeader>
                  <CardTitle>Add Custom Conveyancer</CardTitle>
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
                      <div className="space-y-2">
                        <Label htmlFor="type">Representing</Label>
                        <select
                          id="type"
                          className="w-full p-2 border rounded-md"
                          value={customConveyancer.type}
                          onChange={(e) =>
                            setCustomConveyancer((prev) => ({ ...prev, type: e.target.value as "buyer" | "seller" }))
                          }
                        >
                          <option value="seller">Seller</option>
                          <option value="buyer">Buyer</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notes">Additional Notes</Label>
                      <Textarea
                        id="notes"
                        value={customConveyancer.notes}
                        onChange={(e) => setCustomConveyancer((prev) => ({ ...prev, notes: e.target.value }))}
                        placeholder="Any additional information about the conveyancer"
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
            {allConveyancersAppointed && (
              <Card className="border-green-200 bg-green-50">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <div>
                      <h3 className="font-semibold text-green-900">All Conveyancers Appointed</h3>
                      <p className="text-sm text-green-700">
                        Both buyer and seller conveyancers have been appointed. You can proceed to the next stage.
                      </p>
                    </div>
                  </div>
                  <Link href="/estate-agent/draft-contract">
                    <Button className="w-full bg-green-600 hover:bg-green-700">Continue to Draft Contract</Button>
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
        currentUserRole="estate-agent"
        currentUserName="Sarah Johnson"
        otherParticipant={{
          role: "buyer",
          name: "John Smith",
        }}
      />
    </TransactionLayout>
  )
}
