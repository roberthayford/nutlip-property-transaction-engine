import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  User,
  Home,
  Clock,
  CheckCircle,
  AlertTriangle,
  FileText,
  Bell,
  Heart,
  Send,
  X,
  Eye,
  Search,
  CalendarDays,
  PoundSterling,
} from "lucide-react"

export default function BuyerDashboard() {
  const currentStage = "proof-of-funds"
  const completedStages = 1
  const totalStages = 12
  const progressPercentage = (completedStages / totalStages) * 100

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 md:space-x-4">
              <Link href="/" className="flex items-center">
                <div className="flex items-center">
                  <img src="/nutlip_logo.webp" alt="Nutlip Logo" className="h-8 w-auto" />
                </div>
              </Link>
              <Badge variant="secondary" className="text-xs md:text-sm">
                Buyer Dashboard
              </Badge>
            </div>
            <div className="flex items-center space-x-2 md:space-x-4">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 md:h-5 md:w-5" />
                <span className="font-medium text-sm md:text-base">John Smith</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome back, John!</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Track your property search activity and manage your purchase transaction.
          </p>
        </div>

        {/* Buyer Activity Stats */}
        <div className="grid gap-4 md:gap-6 grid-cols-2 md:grid-cols-4 mb-6 md:mb-8">
          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center space-x-2">
                <Heart className="h-6 w-6 md:h-8 md:w-8 text-red-500" />
                <div>
                  <p className="text-xs md:text-sm font-medium text-muted-foreground">Favorite Properties</p>
                  <p className="text-xl md:text-2xl font-bold">12</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center space-x-2">
                <Send className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
                <div>
                  <p className="text-xs md:text-sm font-medium text-muted-foreground">Offers Sent</p>
                  <p className="text-xl md:text-2xl font-bold">6</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center space-x-2">
                <X className="h-6 w-6 md:h-8 md:w-8 text-red-600" />
                <div>
                  <p className="text-xs md:text-sm font-medium text-muted-foreground">Offers Declined</p>
                  <p className="text-xl md:text-2xl font-bold">4</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-6 w-6 md:h-8 md:w-8 text-green-600" />
                <div>
                  <p className="text-xs md:text-sm font-medium text-muted-foreground">Offers Accepted</p>
                  <p className="text-xl md:text-2xl font-bold">1</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Buyer Stats */}
        <div className="grid gap-4 md:gap-6 grid-cols-2 md:grid-cols-4 mb-6 md:mb-8">
          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center space-x-2">
                <Eye className="h-6 w-6 md:h-8 md:w-8 text-purple-600" />
                <div>
                  <p className="text-xs md:text-sm font-medium text-muted-foreground">Properties Viewed</p>
                  <p className="text-xl md:text-2xl font-bold">28</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center space-x-2">
                <Search className="h-6 w-6 md:h-8 md:w-8 text-orange-600" />
                <div>
                  <p className="text-xs md:text-sm font-medium text-muted-foreground">Saved Searches</p>
                  <p className="text-xl md:text-2xl font-bold">5</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center space-x-2">
                <CalendarDays className="h-6 w-6 md:h-8 md:w-8 text-teal-600" />
                <div>
                  <p className="text-xs md:text-sm font-medium text-muted-foreground">Viewings Booked</p>
                  <p className="text-xl md:text-2xl font-bold">8</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center space-x-2">
                <PoundSterling className="h-6 w-6 md:h-8 md:w-8 text-emerald-600" />
                <div>
                  <p className="text-xs md:text-sm font-medium text-muted-foreground">Average Offer</p>
                  <p className="text-xl md:text-2xl font-bold">£425K</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Transaction Progress */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">Current Transaction Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Overall Progress</span>
                    <span className="text-sm text-muted-foreground">
                      {completedStages} of {totalStages} stages
                    </span>
                  </div>
                  <div className="w-full bg-grey-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-sm md:text-base">Offer Accepted</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800 text-xs">Complete</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-sm md:text-base">Proof of Funds</span>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800 text-xs">In Progress</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium text-sm md:text-base">Conveyancers</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Pending
                    </Badge>
                  </div>
                </div>

                <div className="mt-6">
                  <Link href="/buyer/proof-of-funds">
                    <Button className="w-full">Continue Current Stage</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Alerts */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/buyer/proof-of-funds">
                  <Button variant="outline" className="w-full justify-start text-sm bg-transparent">
                    <FileText className="h-4 w-4 mr-2" />
                    Upload Documents
                  </Button>
                </Link>
                <Link href="/buyer/mortgage-offer">
                  <Button variant="outline" className="w-full justify-start text-sm bg-transparent">
                    <Home className="h-4 w-4 mr-2" />
                    Check Mortgage Status
                  </Button>
                </Link>
                <Link href="/buyer/conveyancers">
                  <Button variant="outline" className="w-full justify-start text-sm bg-transparent">
                    <User className="h-4 w-4 mr-2" />
                    Contact Conveyancer
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">Alerts & Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-800">Action Required</p>
                      <p className="text-xs text-amber-700">Estate agent reviewing your documents</p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Bell className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">Reminder</p>
                      <p className="text-xs text-blue-700">Survey scheduled for March 15</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">Current Property</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm md:text-base">123 Example Street</h4>
                  <p className="text-sm text-muted-foreground">London, SW1A 1AA</p>
                  <p className="text-lg font-bold text-green-600">£450,000</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="secondary" className="text-xs">
                      3 Bed
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      2 Bath
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      Garden
                    </Badge>
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
