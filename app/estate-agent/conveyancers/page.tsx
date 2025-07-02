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
import { Users, CheckCircle, Clock, Phone, Mail, MapPin, Send } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function EstateAgentConveyancersPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    firmName: "",
    solicitorName: "",
    email: "",
    phone: "",
    address: "",
    message: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast({
      title: "Request Sent Successfully",
      description: `Invitation sent to ${formData.firmName} to join the transaction.`,
    })

    // Reset form
    setFormData({
      firmName: "",
      solicitorName: "",
      email: "",
      phone: "",
      address: "",
      message: "",
    })

    setIsSubmitting(false)
  }

  return (
    <TransactionLayout currentStage="conveyancers" userRole="estate-agent">
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <Users className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Conveyancers - Estate Agent View</h1>
            <p className="text-muted-foreground">Monitor conveyancer appointments and coordinate the legal process.</p>
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
                    <p className="text-sm text-muted-foreground">Appointed by: John Smith (Buyer)</p>
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

              <Button variant="outline" className="w-full bg-transparent">
                Contact Buyer Conveyancer
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Add Seller Conveyancer</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firmName">Law Firm Name *</Label>
                    <Input
                      id="firmName"
                      name="firmName"
                      value={formData.firmName}
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
                      value={formData.solicitorName}
                      onChange={handleInputChange}
                      placeholder="e.g. Rachel Thompson"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
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
                      value={formData.phone}
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
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="123 Legal Street, London, SW1A 2AA"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message (Optional)</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Additional information about the transaction..."
                    rows={3}
                  />
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full">
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
              </form>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Legal Process Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium">Conveyancers Appointed</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Complete</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Draft Contract Preparation</span>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">Property Searches</span>
                  </div>
                  <Badge variant="outline">Pending</Badge>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Estate Agent Role</h4>
                  <p className="text-sm text-green-700">
                    Both conveyancers have been appointed and are coordinating the legal aspects. You'll be kept
                    informed of progress and any issues that may arise.
                  </p>
                </div>

                <div className="mt-4">
                  <Link href="/estate-agent/draft-contract">
                    <Button className="w-full">Continue to Draft Contract</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TransactionLayout>
  )
}
