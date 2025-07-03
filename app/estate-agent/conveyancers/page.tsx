"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Bell, CheckCircle, Clock, Eye, Users, Plus, Search, Phone, Mail, MapPin, FileText } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import TransactionLayout from "@/components/transaction-layout"
import { useRealTime } from "@/contexts/real-time-context"
import { toast } from "@/hooks/use-toast"
import Link from "next/link"

interface ConveyancersData {
  completedBy?: string
  completedAt?: string
  buyerConveyancer?: {
    name: string
    firm: string
    contact: string
  }
  sellerConveyancer?: {
    name: string
    firm: string
    contact: string
  }
  status?: string
  nextStage?: string
}

interface ConveyancerProfile {
  id: string
  name: string
  firm: string
  email: string
  phone: string
  address: string
  specializations: string[]
  rating: number
  completedTransactions: number
  averageCompletionTime: string
}

const mockConveyancers: ConveyancerProfile[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    firm: "Johnson & Associates",
    email: "sarah@johnsonlaw.co.uk",
    phone: "020 7123 4567",
    address: "123 Legal Street, London, EC1A 1BB",
    specializations: ["Residential Property", "Commercial Property", "Leasehold"],
    rating: 4.8,
    completedTransactions: 245,
    averageCompletionTime: "8-10 weeks",
  },
  {
    id: "2",
    name: "Michael Brown",
    firm: "Brown Legal Services",
    email: "michael@brownlegal.co.uk",
    phone: "020 7987 6543",
    address: "456 Solicitor Avenue, London, WC1B 2CC",
    specializations: ["Residential Property", "First Time Buyers", "Buy-to-Let"],
    rating: 4.6,
    completedTransactions: 189,
    averageCompletionTime: "7-9 weeks",
  },
  {
    id: "3",
    name: "Emma Wilson",
    firm: "Wilson Property Law",
    email: "emma@wilsonproperty.co.uk",
    phone: "020 7456 7890",
    address: "789 Conveyancer Road, London, SE1C 3DD",
    specializations: ["Residential Property", "New Builds", "Shared Ownership"],
    rating: 4.9,
    completedTransactions: 312,
    averageCompletionTime: "6-8 weeks",
  },
  {
    id: "4",
    name: "David Thompson",
    firm: "Thompson & Partners",
    email: "david@thompsonpartners.co.uk",
    phone: "020 7321 0987",
    address: "321 Property Lane, London, N1D 4EE",
    specializations: ["Residential Property", "Remortgaging", "Transfer of Equity"],
    rating: 4.7,
    completedTransactions: 156,
    averageCompletionTime: "8-11 weeks",
  },
]

export default function EstateAgentConveyancersPage() {
  const { updates } = useRealTime()
  const [conveyancersStatus, setConveyancersStatus] = useState<"awaiting" | "completed">("awaiting")
  const [conveyancersData, setConveyancersData] = useState<ConveyancersData>({})
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedConveyancer, setSelectedConveyancer] = useState<ConveyancerProfile | null>(null)
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false)
  const [isCustomFormOpen, setIsCustomFormOpen] = useState(false)
  const [requestType, setRequestType] = useState<"buyer" | "seller">("seller")
  const [requestingConveyancer, setRequestingConveyancer] = useState<string | null>(null)
  const [requestedConveyancers, setRequestedConveyancers] = useState<Set<string>>(new Set())

  // Custom conveyancer form state
  const [customConveyancer, setCustomConveyancer] = useState({
    name: "",
    firm: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  })

  useEffect(() => {
    // Listen for conveyancers appointment updates
    const conveyancersUpdate = updates.find(
      (update) => update.stage === "conveyancers" && update.type === "stage_completed",
    )

    if (conveyancersUpdate?.data?.conveyancers) {
      const conveyancersInfo = conveyancersUpdate.data.conveyancers
      setConveyancersData(conveyancersInfo)

      if (conveyancersInfo.status === "completed") {
        setConveyancersStatus("completed")
      }
    }
  }, [updates])

  const filteredConveyancers = mockConveyancers.filter(
    (conveyancer) =>
      conveyancer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conveyancer.firm.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conveyancer.specializations.some((spec) => spec.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleRequestConveyancer = (conveyancer: ConveyancerProfile, type: "buyer" | "seller") => {
    setSelectedConveyancer(conveyancer)
    setRequestType(type)
    setIsRequestDialogOpen(true)
  }

  const handleCustomConveyancerSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the request to your backend
    console.log("Custom conveyancer request:", customConveyancer)
    setIsCustomFormOpen(false)
    setCustomConveyancer({
      name: "",
      firm: "",
      email: "",
      phone: "",
      address: "",
      notes: "",
    })
  }

  const handleConveyancerRequest = async () => {
    if (!selectedConveyancer) return

    setRequestingConveyancer(selectedConveyancer.id)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Add to requested conveyancers
      setRequestedConveyancers((prev) => new Set([...prev, selectedConveyancer.id]))

      // Show success toast
      toast({
        title: "Request Sent Successfully",
        description: `${selectedConveyancer.name} has been requested as the ${requestType}'s conveyancer. They will be notified and need to confirm their appointment.`,
      })

      setIsRequestDialogOpen(false)
      setSelectedConveyancer(null)
    } catch (error) {
      toast({
        title: "Request Failed",
        description: "There was an error sending the conveyancer request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setRequestingConveyancer(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <TransactionLayout
      currentStage="conveyancers"
      userRole="estate-agent"
      title="Conveyancers - Estate Agent View"
      description="Manage and request conveyancers for the property transaction"
    >
      <div className="space-y-6">
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4">
          <Dialog open={isCustomFormOpen} onOpenChange={setIsCustomFormOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Custom Conveyancer
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Custom Conveyancer</DialogTitle>
                <DialogDescription>
                  Enter the details of a conveyancer not in our directory to request their addition to the transaction.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCustomConveyancerSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Conveyancer Name *</Label>
                    <Input
                      id="name"
                      value={customConveyancer.name}
                      onChange={(e) => setCustomConveyancer((prev) => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="firm">Law Firm *</Label>
                    <Input
                      id="firm"
                      value={customConveyancer.firm}
                      onChange={(e) => setCustomConveyancer((prev) => ({ ...prev, firm: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={customConveyancer.email}
                      onChange={(e) => setCustomConveyancer((prev) => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={customConveyancer.phone}
                      onChange={(e) => setCustomConveyancer((prev) => ({ ...prev, phone: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">Office Address</Label>
                  <Input
                    id="address"
                    value={customConveyancer.address}
                    onChange={(e) => setCustomConveyancer((prev) => ({ ...prev, address: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    value={customConveyancer.notes}
                    onChange={(e) => setCustomConveyancer((prev) => ({ ...prev, notes: e.target.value }))}
                    placeholder="Any additional information about this conveyancer..."
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsCustomFormOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Submit Request</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Current Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Appointment Status
            </CardTitle>
            <CardDescription>Current status of conveyancer appointments</CardDescription>
          </CardHeader>
          <CardContent>
            {conveyancersStatus === "awaiting" && (
              <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <Clock className="h-5 w-5 text-amber-600" />
                <div className="flex-1">
                  <div className="font-medium">Awaiting Conveyancer Appointments</div>
                  <div className="text-sm text-gray-600">
                    You can help facilitate the process by recommending conveyancers from our directory or adding custom
                    conveyancers.
                  </div>
                </div>
                <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                  Appointments in Progress
                </Badge>
              </div>
            )}

            {conveyancersStatus === "completed" && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div className="flex-1">
                    <div className="font-medium">Conveyancers Appointed Successfully</div>
                    <div className="text-sm text-gray-600">
                      Both buyer and seller have appointed their legal representatives and the transaction can proceed
                      to the draft contract stage.
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Appointments Complete
                  </Badge>
                </div>

                {/* Conveyancers Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-3 text-blue-800">Buyer's Conveyancer</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Name:</span>{" "}
                        <span>{conveyancersData.buyerConveyancer?.name || "Sarah Johnson"}</span>
                      </div>
                      <div>
                        <span className="font-medium">Firm:</span>{" "}
                        <span>{conveyancersData.buyerConveyancer?.firm || "Johnson & Associates"}</span>
                      </div>
                      <div>
                        <span className="font-medium">Contact:</span>{" "}
                        <span>{conveyancersData.buyerConveyancer?.contact || "020 7123 4567"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-3 text-orange-800">Seller's Conveyancer</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Name:</span>{" "}
                        <span>{conveyancersData.sellerConveyancer?.name || "Michael Brown"}</span>
                      </div>
                      <div>
                        <span className="font-medium">Firm:</span>{" "}
                        <span>{conveyancersData.sellerConveyancer?.firm || "Brown Legal Services"}</span>
                      </div>
                      <div>
                        <span className="font-medium">Contact:</span>{" "}
                        <span>{conveyancersData.sellerConveyancer?.contact || "020 7987 6543"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Conveyancer Directory */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Conveyancer Directory
            </CardTitle>
            <CardDescription>Browse and request conveyancers from our verified directory</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by name, firm, or specialization..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Conveyancer List */}
              <div className="grid gap-4">
                {filteredConveyancers.map((conveyancer) => (
                  <div key={conveyancer.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{conveyancer.name}</h3>
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            ★ {conveyancer.rating}
                          </Badge>
                        </div>
                        <p className="text-gray-600 font-medium mb-2">{conveyancer.firm}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Mail className="h-4 w-4" />
                              {conveyancer.email}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Phone className="h-4 w-4" />
                              {conveyancer.phone}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <MapPin className="h-4 w-4" />
                              {conveyancer.address}
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-sm">
                              <span className="font-medium">Completed:</span> {conveyancer.completedTransactions}{" "}
                              transactions
                            </div>
                            <div className="text-sm">
                              <span className="font-medium">Average time:</span> {conveyancer.averageCompletionTime}
                            </div>
                          </div>
                        </div>

                        <div className="mb-3">
                          <div className="text-sm font-medium mb-1">Specializations:</div>
                          <div className="flex flex-wrap gap-1">
                            {conveyancer.specializations.map((spec, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {spec}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        <Button
                          size="sm"
                          onClick={() => handleRequestConveyancer(conveyancer, "seller")}
                          className="whitespace-nowrap"
                          disabled={requestedConveyancers.has(conveyancer.id)}
                        >
                          {requestedConveyancers.has(conveyancer.id) ? "✓ Requested" : "Request for Seller"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRequestConveyancer(conveyancer, "buyer")}
                          className="whitespace-nowrap"
                        >
                          Request for Buyer
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredConveyancers.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No conveyancers found matching your search criteria.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Request Dialog */}
        <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request Conveyancer</DialogTitle>
              <DialogDescription>
                Send a request to add {selectedConveyancer?.name} as the {requestType}'s conveyancer for this
                transaction.
              </DialogDescription>
            </DialogHeader>
            {selectedConveyancer && (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">{selectedConveyancer.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{selectedConveyancer.firm}</p>
                  <div className="text-sm space-y-1">
                    <div>Email: {selectedConveyancer.email}</div>
                    <div>Phone: {selectedConveyancer.phone}</div>
                  </div>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700">
                    This request will be sent to the {requestType} and the conveyancer. They will need to confirm the
                    appointment before proceeding.
                  </p>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsRequestDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleConveyancerRequest}
                    disabled={requestingConveyancer === selectedConveyancer?.id}
                  >
                    {requestingConveyancer === selectedConveyancer?.id ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Sending Request...
                      </>
                    ) : (
                      "Send Request"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Estate Agent Role Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Your Role in Conveyancer Selection
            </CardTitle>
            <CardDescription>How you can facilitate the conveyancer appointment process</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Your Responsibilities</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Recommend qualified conveyancers from our verified directory</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Facilitate communication between parties and conveyancers</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Add custom conveyancers when requested by clients</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Monitor appointment progress and resolve any issues</span>
                </li>
              </ul>
            </div>

            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium mb-2 text-green-800">Benefits of Our Directory</h4>
              <ul className="space-y-2 text-sm text-green-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>All conveyancers are pre-verified and qualified</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Performance ratings based on completed transactions</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Specialization matching for specific property types</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Integrated communication and progress tracking</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Continue to Next Stage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Ready to Continue?
            </CardTitle>
            <CardDescription>Proceed to the next stage of the transaction</CardDescription>
          </CardHeader>
          <CardContent>
            {conveyancersStatus === "completed" ? (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-medium text-green-800">Conveyancers Successfully Appointed</div>
                      <div className="text-sm text-green-700">
                        Both parties have their legal representatives in place. The transaction can now proceed to the
                        draft contract stage.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Link href="/estate-agent/draft-contract">
                    <Button size="lg" className="px-8 py-3">
                      <FileText className="h-5 w-5 mr-2" />
                      Continue to Draft Contract
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-amber-600" />
                    <div>
                      <div className="font-medium text-amber-800">Waiting for Conveyancer Appointments</div>
                      <div className="text-sm text-amber-700">
                        Both buyer and seller need to appoint their conveyancers before proceeding to the draft contract
                        stage.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button size="lg" disabled className="px-8 py-3 opacity-50">
                    <Clock className="h-5 w-5 mr-2" />
                    Waiting for Appointments
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </TransactionLayout>
  )
}
