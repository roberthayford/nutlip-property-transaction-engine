"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  Scale,
  FileText,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  Search,
  MessageSquare,
  Bell,
  PoundSterling,
  HandshakeIcon,
  ClipboardList,
  Calendar,
  X,
} from "lucide-react"

// Mock transaction data
const mockTransactions = [
  {
    id: 1,
    client: "John Smith",
    property: "123 Example Street",
    price: "£450,000",
    clientId: "JS001",
    stage: "draft-contract",
    status: "Contract review required",
    urgency: "high",
    dueDate: "Today",
  },
  {
    id: 2,
    client: "Emma Wilson",
    property: "456 Oak Avenue",
    price: "£320,000",
    clientId: "EW002",
    stage: "search-survey",
    status: "Awaiting search results",
    urgency: "medium",
    dueDate: "Tomorrow",
  },
  {
    id: 3,
    client: "Michael Brown",
    property: "789 Pine Close",
    price: "£275,000",
    clientId: "MB003",
    stage: "contract-exchange",
    status: "All conditions satisfied",
    urgency: "low",
    dueDate: "Next week",
  },
  {
    id: 4,
    client: "Sarah Davis",
    property: "321 Maple Drive",
    price: "£380,000",
    clientId: "SD004",
    stage: "draft-contract",
    status: "Initial review pending",
    urgency: "medium",
    dueDate: "2 days",
  },
  {
    id: 5,
    client: "Robert Johnson",
    property: "654 Elm Street",
    price: "£295,000",
    clientId: "RJ005",
    stage: "mortgage",
    status: "Mortgage application submitted",
    urgency: "low",
    dueDate: "1 week",
  },
  {
    id: 6,
    client: "Lisa Thompson",
    property: "987 Birch Lane",
    price: "£425,000",
    clientId: "LT006",
    stage: "enquiries",
    status: "Awaiting seller responses",
    urgency: "medium",
    dueDate: "3 days",
  },
  {
    id: 7,
    client: "Mark Wilson",
    property: "147 Cedar Road",
    price: "£310,000",
    clientId: "MW007",
    stage: "replies-to-requisitions",
    status: "Requisitions received",
    urgency: "high",
    dueDate: "Today",
  },
  {
    id: 8,
    client: "Jennifer Lee",
    property: "258 Spruce Avenue",
    price: "£365,000",
    clientId: "JL008",
    stage: "completion",
    status: "Completion date confirmed",
    urgency: "medium",
    dueDate: "5 days",
  },
]

const completedTransactions = [
  { client: "David Miller", property: "111 Oak Street", price: "£290,000", completedDate: "Last week" },
  { client: "Anna Garcia", property: "222 Pine Avenue", price: "£340,000", completedDate: "2 weeks ago" },
  { client: "James Taylor", property: "333 Maple Road", price: "£415,000", completedDate: "3 weeks ago" },
  { client: "Maria Rodriguez", property: "444 Elm Drive", price: "£385,000", completedDate: "1 month ago" },
]

export default function BuyerConveyancerDashboard() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Calculate statistics from mock data
  const transactionStats = {
    activeCases: mockTransactions.length,
    draftContract: mockTransactions.filter((t) => t.stage === "draft-contract").length,
    searchSurvey: mockTransactions.filter((t) => t.stage === "search-survey").length,
    enquiries: mockTransactions.filter((t) => t.stage === "enquiries").length,
    mortgage: mockTransactions.filter((t) => t.stage === "mortgage").length,
    completion: mockTransactions.filter((t) => t.stage === "completion").length,
    contractExchange: mockTransactions.filter((t) => t.stage === "contract-exchange").length,
    repliesToRequisitions: mockTransactions.filter((t) => t.stage === "replies-to-requisitions").length,
    completed: completedTransactions.length,
  }

  // Filter transactions based on active filter
  const getFilteredTransactions = () => {
    if (!activeFilter) return mockTransactions
    if (activeFilter === "completed") return []
    return mockTransactions.filter((t) => t.stage === activeFilter)
  }

  const getFilteredCompletedTransactions = () => {
    return activeFilter === "completed" ? completedTransactions : []
  }

  const filteredTransactions = getFilteredTransactions()
  const filteredCompletedTransactions = getFilteredCompletedTransactions()

  // Get stage display info
  const getStageInfo = (stage: string) => {
    const stageMap: Record<string, { name: string; color: string; icon: any }> = {
      "draft-contract": { name: "Draft Contract", color: "bg-blue-100 text-blue-800", icon: FileText },
      "search-survey": { name: "Search & Survey", color: "bg-amber-100 text-amber-800", icon: Search },
      enquiries: { name: "Enquiries", color: "bg-purple-100 text-purple-800", icon: MessageSquare },
      mortgage: { name: "Mortgage", color: "bg-green-100 text-green-800", icon: PoundSterling },
      completion: { name: "Completion", color: "bg-orange-100 text-orange-800", icon: Calendar },
      "contract-exchange": { name: "Contract Exchange", color: "bg-indigo-100 text-indigo-800", icon: HandshakeIcon },
      "replies-to-requisitions": {
        name: "Replies to Requisitions",
        color: "bg-red-100 text-red-800",
        icon: ClipboardList,
      },
    }
    return stageMap[stage] || { name: stage, color: "bg-gray-100 text-gray-800", icon: FileText }
  }

  const getFilterTitle = () => {
    if (!activeFilter) return "Active Cases"
    if (activeFilter === "completed") return "Completed Transactions"
    return getStageInfo(activeFilter).name + " Cases"
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 md:space-x-4">
              <Link href="/" className="text-xl md:text-2xl font-bold text-primary">
                Nutlip
              </Link>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800 text-xs md:text-sm">
                Buyer Conveyancer Dashboard
              </Badge>
            </div>
            <div className="flex items-center space-x-2 md:space-x-4">
              <Link
                href="https://v0-nutlip-platform-design.vercel.app/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:block"
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                >
                  Property Chain Management
                </Button>
              </Link>
              <Bell className="h-5 w-5 text-muted-foreground" />
              <div className="flex items-center space-x-2">
                <Scale className="h-4 w-4 md:h-5 md:w-5" />
                <span className="font-medium text-sm md:text-base hidden sm:inline">David Wilson, Solicitor</span>
                <span className="font-medium text-sm md:text-base sm:hidden">David W.</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome back, David!</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Manage legal aspects of property purchases for your clients.
          </p>
        </div>

        {/* Transaction Statistics Overview */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-semibold">Transaction Statistics</h2>
            {activeFilter && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveFilter(null)}
                className="flex items-center space-x-2"
              >
                <X className="h-4 w-4" />
                <span className="hidden sm:inline">Clear Filter</span>
              </Button>
            )}
          </div>

          <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mb-6">
            {/* Active Cases */}
            <Card
              className={`hover:shadow-md transition-all cursor-pointer ${
                activeFilter === null ? "ring-2 ring-purple-500 bg-purple-50" : ""
              }`}
              onClick={() => setActiveFilter(null)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 md:space-x-3">
                  <Users className="h-6 w-6 md:h-8 md:w-8 text-purple-600" />
                  <div>
                    <p className="text-xs md:text-sm font-medium text-muted-foreground">Active Cases</p>
                    <p className="text-xl md:text-2xl font-bold">{transactionStats.activeCases}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Completed Transactions */}
            <Card
              className={`hover:shadow-md transition-all cursor-pointer ${
                activeFilter === "completed" ? "ring-2 ring-green-500 bg-green-50" : ""
              }`}
              onClick={() => setActiveFilter("completed")}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 md:space-x-3">
                  <CheckCircle className="h-6 w-6 md:h-8 md:w-8 text-green-600" />
                  <div>
                    <p className="text-xs md:text-sm font-medium text-muted-foreground">Completed</p>
                    <p className="text-xl md:text-2xl font-bold">{transactionStats.completed}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Transaction Stages Breakdown */}
          <div className="grid gap-4 grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
            {/* Draft Contract */}
            <Card
              className={`hover:shadow-md transition-all cursor-pointer ${
                activeFilter === "draft-contract" ? "ring-2 ring-blue-500 bg-blue-50" : ""
              }`}
              onClick={() => setActiveFilter("draft-contract")}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 md:space-x-3">
                  <FileText className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                  <div>
                    <p className="text-xs md:text-sm font-medium text-muted-foreground">Draft Contract</p>
                    <p className="text-lg md:text-xl font-bold">{transactionStats.draftContract}</p>
                  </div>
                </div>
                <div className="mt-2">
                  <Link href="/buyer-conveyancer/draft-contract">
                    <Button size="sm" variant="outline" className="w-full bg-transparent text-xs">
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Search & Survey */}
            <Card
              className={`hover:shadow-md transition-all cursor-pointer ${
                activeFilter === "search-survey" ? "ring-2 ring-amber-500 bg-amber-50" : ""
              }`}
              onClick={() => setActiveFilter("search-survey")}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 md:space-x-3">
                  <Search className="h-5 w-5 md:h-6 md:w-6 text-amber-600" />
                  <div>
                    <p className="text-xs md:text-sm font-medium text-muted-foreground">Search & Survey</p>
                    <p className="text-lg md:text-xl font-bold">{transactionStats.searchSurvey}</p>
                  </div>
                </div>
                <div className="mt-2">
                  <Link href="/buyer-conveyancer/search-survey">
                    <Button size="sm" variant="outline" className="w-full bg-transparent text-xs">
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Enquiries */}
            <Card
              className={`hover:shadow-md transition-all cursor-pointer ${
                activeFilter === "enquiries" ? "ring-2 ring-purple-500 bg-purple-50" : ""
              }`}
              onClick={() => setActiveFilter("enquiries")}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 md:space-x-3">
                  <MessageSquare className="h-5 w-5 md:h-6 md:w-6 text-purple-600" />
                  <div>
                    <p className="text-xs md:text-sm font-medium text-muted-foreground">Enquiries</p>
                    <p className="text-lg md:text-xl font-bold">{transactionStats.enquiries}</p>
                  </div>
                </div>
                <div className="mt-2">
                  <Link href="/buyer-conveyancer/enquiries">
                    <Button size="sm" variant="outline" className="w-full bg-transparent text-xs">
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Mortgage */}
            <Card
              className={`hover:shadow-md transition-all cursor-pointer ${
                activeFilter === "mortgage" ? "ring-2 ring-green-500 bg-green-50" : ""
              }`}
              onClick={() => setActiveFilter("mortgage")}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 md:space-x-3">
                  <PoundSterling className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
                  <div>
                    <p className="text-xs md:text-sm font-medium text-muted-foreground">Mortgage</p>
                    <p className="text-lg md:text-xl font-bold">{transactionStats.mortgage}</p>
                  </div>
                </div>
                <div className="mt-2">
                  <Link href="/buyer-conveyancer/mortgage-offer">
                    <Button size="sm" variant="outline" className="w-full bg-transparent text-xs">
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Completion */}
            <Card
              className={`hover:shadow-md transition-all cursor-pointer ${
                activeFilter === "completion" ? "ring-2 ring-orange-500 bg-orange-50" : ""
              }`}
              onClick={() => setActiveFilter("completion")}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 md:space-x-3">
                  <Calendar className="h-5 w-5 md:h-6 md:w-6 text-orange-600" />
                  <div>
                    <p className="text-xs md:text-sm font-medium text-muted-foreground">Completion</p>
                    <p className="text-lg md:text-xl font-bold">{transactionStats.completion}</p>
                  </div>
                </div>
                <div className="mt-2">
                  <Link href="/buyer-conveyancer/completion-date">
                    <Button size="sm" variant="outline" className="w-full bg-transparent text-xs">
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Contract Exchange */}
            <Card
              className={`hover:shadow-md transition-all cursor-pointer ${
                activeFilter === "contract-exchange" ? "ring-2 ring-indigo-500 bg-indigo-50" : ""
              }`}
              onClick={() => setActiveFilter("contract-exchange")}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 md:space-x-3">
                  <HandshakeIcon className="h-5 w-5 md:h-6 md:w-6 text-indigo-600" />
                  <div>
                    <p className="text-xs md:text-sm font-medium text-muted-foreground">Contract Exchange</p>
                    <p className="text-lg md:text-xl font-bold">{transactionStats.contractExchange}</p>
                  </div>
                </div>
                <div className="mt-2">
                  <Link href="/buyer-conveyancer/contract-exchange">
                    <Button size="sm" variant="outline" className="w-full bg-transparent text-xs">
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Replies to Requisitions */}
            <Card
              className={`hover:shadow-md transition-all cursor-pointer ${
                activeFilter === "replies-to-requisitions" ? "ring-2 ring-red-500 bg-red-50" : ""
              }`}
              onClick={() => setActiveFilter("replies-to-requisitions")}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 md:space-x-3">
                  <ClipboardList className="h-5 w-5 md:h-6 md:w-6 text-red-600" />
                  <div>
                    <p className="text-xs md:text-sm font-medium text-muted-foreground">Replies to Requisitions</p>
                    <p className="text-lg md:text-xl font-bold">{transactionStats.repliesToRequisitions}</p>
                  </div>
                </div>
                <div className="mt-2">
                  <Link href="/buyer-conveyancer/replies-to-requisitions">
                    <Button size="sm" variant="outline" className="w-full bg-transparent text-xs">
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Filtered Cases Display */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg md:text-xl">{getFilterTitle()}</CardTitle>
                  {activeFilter && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {activeFilter === "completed"
                        ? `${filteredCompletedTransactions.length} transactions`
                        : `${filteredTransactions.length} cases`}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Active Cases */}
                  {filteredTransactions.map((transaction) => {
                    const stageInfo = getStageInfo(transaction.stage)
                    const StageIcon = stageInfo.icon

                    return (
                      <div key={transaction.id} className="p-4 border rounded-lg">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 gap-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm md:text-base">
                              {transaction.client} - {transaction.property}
                            </h4>
                            <p className="text-xs md:text-sm text-muted-foreground">
                              Purchase Price: {transaction.price}
                            </p>
                            <p className="text-xs md:text-sm text-muted-foreground">
                              Client ID: {transaction.clientId}
                            </p>
                          </div>
                          <Badge className={`${stageInfo.color} text-xs`}>{stageInfo.name}</Badge>
                        </div>
                        <div className="flex items-center space-x-2 mb-3">
                          {transaction.urgency === "high" ? (
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                          ) : transaction.urgency === "medium" ? (
                            <Clock className="h-4 w-4 text-amber-600" />
                          ) : (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          )}
                          <span
                            className={`text-xs md:text-sm ${
                              transaction.urgency === "high"
                                ? "text-red-600"
                                : transaction.urgency === "medium"
                                  ? "text-amber-600"
                                  : "text-green-600"
                            }`}
                          >
                            {transaction.status} - Due: {transaction.dueDate}
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Link href={`/buyer-conveyancer/${transaction.stage}`}>
                            <Button size="sm" className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto">
                              <StageIcon className="h-4 w-4 mr-2" />
                              Manage Case
                            </Button>
                          </Link>
                          <Button size="sm" variant="outline" className="w-full sm:w-auto bg-transparent">
                            View Details
                          </Button>
                        </div>
                      </div>
                    )
                  })}

                  {/* Completed Cases */}
                  {filteredCompletedTransactions.map((transaction, index) => (
                    <div key={`completed-${index}`} className="p-4 border rounded-lg bg-green-50">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 gap-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm md:text-base">
                            {transaction.client} - {transaction.property}
                          </h4>
                          <p className="text-xs md:text-sm text-muted-foreground">
                            Purchase Price: {transaction.price}
                          </p>
                          <p className="text-xs md:text-sm text-muted-foreground">
                            Completed: {transaction.completedDate}
                          </p>
                        </div>
                        <Badge className="bg-green-100 text-green-800 text-xs">Completed</Badge>
                      </div>
                      <div className="flex items-center space-x-2 mb-3">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-xs md:text-sm text-green-600">Transaction completed successfully</span>
                      </div>
                      <Button size="sm" variant="outline" className="w-full sm:w-auto bg-transparent">
                        View Archive
                      </Button>
                    </div>
                  ))}

                  {filteredTransactions.length === 0 && filteredCompletedTransactions.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-sm md:text-base">No transactions found for the selected filter.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Tasks */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/buyer-conveyancer/draft-contract">
                  <Button variant="outline" className="w-full justify-start bg-transparent text-sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Review Contracts ({transactionStats.draftContract})
                  </Button>
                </Link>
                <Link href="/buyer-conveyancer/search-survey">
                  <Button variant="outline" className="w-full justify-start bg-transparent text-sm">
                    <Search className="h-4 w-4 mr-2" />
                    Order Searches ({transactionStats.searchSurvey})
                  </Button>
                </Link>
                <Link href="/buyer-conveyancer/enquiries">
                  <Button variant="outline" className="w-full justify-start bg-transparent text-sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send Enquiries ({transactionStats.enquiries})
                  </Button>
                </Link>
                <Link href="/buyer-conveyancer/replies-to-requisitions">
                  <Button variant="outline" className="w-full justify-start bg-transparent text-sm">
                    <ClipboardList className="h-4 w-4 mr-2" />
                    Handle Requisitions ({transactionStats.repliesToRequisitions})
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">Urgent Tasks</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-800">Deadline Today</p>
                      <p className="text-xs text-red-700">Contract review for JS001</p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-800">Deadline Today</p>
                      <p className="text-xs text-red-700">Requisitions for MW007</p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Clock className="h-4 w-4 text-amber-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-800">Due Tomorrow</p>
                      <p className="text-xs text-amber-700">Search results for EW002</p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-800">Ready</p>
                      <p className="text-xs text-green-700">Exchange for MB003</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Pre-Exchange</span>
                    <span className="font-semibold">5</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Post-Exchange</span>
                    <span className="font-semibold">3</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Avg. Days to Complete</span>
                    <span className="font-semibold">42</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Success Rate</span>
                    <span className="font-semibold text-green-600">94%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
