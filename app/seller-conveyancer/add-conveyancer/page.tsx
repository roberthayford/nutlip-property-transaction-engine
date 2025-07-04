"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { TransactionLayout } from "@/components/transaction-layout"
import { Phone, Mail, MessageSquare, FileText, Users, Building, Calendar, Send } from "lucide-react"

interface ConveyancerInfo {
  id: string
  name: string
  firm: string
  email: string
  phone: string
  role: "buyer" | "seller"
  status: "active" | "pending" | "inactive"
  lastContact: string
  documentsShared: number
  pendingActions: number
}

interface CommunicationLog {
  id: string
  type: "email" | "phone" | "document"
  subject: string
  date: string
  status: "sent" | "received" | "pending"
  priority: "low" | "medium" | "high"
}

export default function SellerConveyancerConveyancersPage() {
  const { toast } = useToast()
  const [conveyancers, setConveyancers] = useState<ConveyancerInfo[]>([])
  const [communications, setCommunications] = useState<CommunicationLog[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [selectedConveyancer, setSelectedConveyancer] = useState<string>("")
  const [messageSubject, setMessageSubject] = useState("")

  useEffect(() => {
    // Load conveyancer data from localStorage
    const savedConveyancers = localStorage.getItem("conveyancers")
    if (savedConveyancers) {
      setConveyancers(JSON.parse(savedConveyancers))
    } else {
      // Default conveyancer data
      const defaultConveyancers: ConveyancerInfo[] = [
        {
          id: "1",
          name: "Sarah Johnson",
          firm: "Johnson & Associates Legal",
          email: "sarah.johnson@johnsonlegal.co.uk",
          phone: "+44 20 7123 4567",
          role: "buyer",
          status: "active",
          lastContact: "2024-01-15",
          documentsShared: 12,
          pendingActions: 2,
        },
        {
          id: "2",
          name: "Michael Chen",
          firm: "Chen Property Law",
          email: "m.chen@chenproperty.co.uk",
          phone: "+44 161 234 5678",
          role: "buyer",
          status: "active",
          lastContact: "2024-01-14",
          documentsShared: 8,
          pendingActions: 1,
        },
      ]
      setConveyancers(defaultConveyancers)
      localStorage.setItem("conveyancers", JSON.stringify(defaultConveyancers))
    }

    // Load communications data
    const savedCommunications = localStorage.getItem("conveyancer-communications")
    if (savedCommunications) {
      setCommunications(JSON.parse(savedCommunications))
    } else {
      const defaultCommunications: CommunicationLog[] = [
        {
          id: "1",
          type: "email",
          subject: "Contract Draft Review",
          date: "2024-01-15T10:30:00Z",
          status: "sent",
          priority: "high",
        },
        {
          id: "2",
          type: "document",
          subject: "Property Information Form",
          date: "2024-01-14T14:20:00Z",
          status: "received",
          priority: "medium",
        },
        {
          id: "3",
          type: "phone",
          subject: "Completion Date Discussion",
          date: "2024-01-13T16:45:00Z",
          status: "sent",
          priority: "medium",
        },
      ]
      setCommunications(defaultCommunications)
      localStorage.setItem("conveyancer-communications", JSON.stringify(defaultCommunications))
    }
  }, [])

  const handleSendMessage = () => {
    if (!selectedConveyancer || !messageSubject || !newMessage) {
      toast({
        title: "Missing Information",
        description: "Please select a conveyancer, add a subject, and write a message.",
        variant: "destructive",
      })
      return
    }

    const newCommunication: CommunicationLog = {
      id: Date.now().toString(),
      type: "email",
      subject: messageSubject,
      date: new Date().toISOString(),
      status: "sent",
      priority: "medium",
    }

    const updatedCommunications = [newCommunication, ...communications]
    setCommunications(updatedCommunications)
    localStorage.setItem("conveyancer-communications", JSON.stringify(updatedCommunications))

    // Reset form
    setNewMessage("")
    setMessageSubject("")
    setSelectedConveyancer("")

    toast({
      title: "Message Sent",
      description: "Your message has been sent successfully.",
    })
  }

  const handleCallConveyancer = (conveyancer: ConveyancerInfo) => {
    toast({
      title: "Calling Conveyancer",
      description: `Initiating call to ${conveyancer.name} at ${conveyancer.phone}`,
    })
  }

  const handleEmailConveyancer = (conveyancer: ConveyancerInfo) => {
    setSelectedConveyancer(conveyancer.id)
    toast({
      title: "Email Selected",
      description: `Ready to compose email to ${conveyancer.name}`,
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <TransactionLayout>
      <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Conveyancers</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Manage communication with other conveyancers in this transaction
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Users className="h-4 w-4" />
            <span>{conveyancers.length} Active Conveyancers</span>
          </div>
        </div>

        {/* Conveyancers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {conveyancers.map((conveyancer) => (
            <Card key={conveyancer.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div className="flex-1">
                    <CardTitle className="text-lg sm:text-xl">{conveyancer.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <Building className="h-3 w-3" />
                      {conveyancer.firm}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col sm:items-end gap-2">
                    <Badge className={`text-xs ${getStatusColor(conveyancer.status)}`}>
                      {conveyancer.status.charAt(0).toUpperCase() + conveyancer.status.slice(1)}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {conveyancer.role.charAt(0).toUpperCase() + conveyancer.role.slice(1)} Conveyancer
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Contact Information */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="break-all">{conveyancer.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{conveyancer.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>Last contact: {formatDate(conveyancer.lastContact)}</span>
                  </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-2 gap-4 py-3 border-t border-gray-100">
                  <div className="text-center">
                    <div className="text-lg sm:text-xl font-semibold text-blue-600">{conveyancer.documentsShared}</div>
                    <div className="text-xs text-gray-500">Documents Shared</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg sm:text-xl font-semibold text-orange-600">{conveyancer.pendingActions}</div>
                    <div className="text-xs text-gray-500">Pending Actions</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs sm:text-sm bg-transparent"
                    onClick={() => handleCallConveyancer(conveyancer)}
                  >
                    <Phone className="h-3 w-3 mr-1" />
                    Call
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs sm:text-sm bg-transparent"
                    onClick={() => handleEmailConveyancer(conveyancer)}
                  >
                    <Mail className="h-3 w-3 mr-1" />
                    Email
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 text-xs sm:text-sm bg-transparent">
                    <FileText className="h-3 w-3 mr-1" />
                    Documents
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Communication Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          {/* Send Message */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Send className="h-5 w-5" />
                Send Message
              </CardTitle>
              <CardDescription>Communicate with other conveyancers in the transaction</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="conveyancer-select" className="text-sm font-medium">
                  Select Conveyancer
                </Label>
                <select
                  id="conveyancer-select"
                  value={selectedConveyancer}
                  onChange={(e) => setSelectedConveyancer(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Choose a conveyancer...</option>
                  {conveyancers.map((conveyancer) => (
                    <option key={conveyancer.id} value={conveyancer.id}>
                      {conveyancer.name} - {conveyancer.firm}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message-subject" className="text-sm font-medium">
                  Subject
                </Label>
                <Input
                  id="message-subject"
                  value={messageSubject}
                  onChange={(e) => setMessageSubject(e.target.value)}
                  placeholder="Enter message subject..."
                  className="text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message-content" className="text-sm font-medium">
                  Message
                </Label>
                <Textarea
                  id="message-content"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message here..."
                  rows={4}
                  className="text-sm resize-none"
                />
              </div>

              <Button
                onClick={handleSendMessage}
                className="w-full sm:w-auto"
                disabled={!selectedConveyancer || !messageSubject || !newMessage}
              >
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </CardContent>
          </Card>

          {/* Recent Communications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <MessageSquare className="h-5 w-5" />
                Recent Communications
              </CardTitle>
              <CardDescription>Latest messages and document exchanges</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {communications.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm">No communications yet</p>
                  </div>
                ) : (
                  communications.slice(0, 5).map((comm) => (
                    <div key={comm.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0 mt-1">
                        {comm.type === "email" && <Mail className="h-4 w-4 text-blue-500" />}
                        {comm.type === "phone" && <Phone className="h-4 w-4 text-green-500" />}
                        {comm.type === "document" && <FileText className="h-4 w-4 text-purple-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                          <p className="text-sm font-medium text-gray-900 truncate">{comm.subject}</p>
                          <div className="flex items-center gap-2">
                            <Badge className={`text-xs ${getPriorityColor(comm.priority)}`}>{comm.priority}</Badge>
                            <Badge variant="outline" className="text-xs">
                              {comm.status}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{formatDate(comm.date)}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {communications.length > 5 && (
                <Button variant="outline" size="sm" className="w-full mt-4 bg-transparent">
                  View All Communications
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </TransactionLayout>
  )
}
