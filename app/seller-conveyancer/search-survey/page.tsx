"use client"

import { useState, useEffect, useCallback } from "react"
import TransactionLayout from "@/components/transaction-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, Search, ShoppingCart, Bell, TrendingUp, Eye, Download, Plus } from "lucide-react"
import { useRealTime } from "@/contexts/real-time-context"
import { toast } from "@/hooks/use-toast"

interface SearchStatus {
  id: string
  name: string
  status: "pending" | "ordered" | "completed"
  lastUpdated?: Date
  completedAt?: Date
  cost?: number
  estimatedDays?: number
  provider?: string
  category?: string
  priority?: string
  isAdditional?: boolean
  addedAt?: Date
}

export default function SellerConveyancerSearchSurveyPage() {
  // ──────────────────────────────────────────────────────────────────────────────
  // Utility ─ Safely format a timestamp into a locale time string
  // Returns "--" if the value is missing or not a valid date.
  const formatTime = (ts: unknown): string => {
    if (!ts) return "--"
    const date = ts instanceof Date ? ts : new Date(ts as string | number)
    return isNaN(date.getTime()) ? "--" : date.toLocaleTimeString()
  }
  const { updates, sendUpdate } = useRealTime()

  // Start with standard searches - additional ones will be added dynamically
  const [searchStatuses, setSearchStatuses] = useState<SearchStatus[]>([
    {
      id: "local-authority-search",
      name: "Local Authority Search",
      status: "pending",
      cost: 150,
      estimatedDays: 5,
      provider: "Local Council",
      category: "Standard",
      priority: "standard",
      isAdditional: false,
    },
    {
      id: "environmental-search",
      name: "Environmental Search",
      status: "pending",
      cost: 120,
      estimatedDays: 3,
      provider: "Landmark Information",
      category: "Standard",
      priority: "standard",
      isAdditional: false,
    },
    {
      id: "water-drainage-search",
      name: "Water & Drainage Search",
      status: "pending",
      cost: 85,
      estimatedDays: 7,
      provider: "Thames Water",
      category: "Standard",
      priority: "standard",
      isAdditional: false,
    },
    {
      id: "chancel-repair-search",
      name: "Chancel Repair Search",
      status: "pending",
      cost: 45,
      estimatedDays: 2,
      provider: "Chancel Check",
      category: "Standard",
      priority: "standard",
      isAdditional: false,
    },
  ])

  const [showCompletedDetails, setShowCompletedDetails] = useState(false)
  const [showAdditionalSearches, setShowAdditionalSearches] = useState(false)

  // Calculate summary stats with proper reactivity
  const completedSearches = searchStatuses.filter((s) => s.status === "completed").length
  const orderedSearches = searchStatuses.filter((s) => s.status === "ordered").length
  const pendingSearches = searchStatuses.filter((s) => s.status === "pending").length
  const totalSearches = searchStatuses.length
  const additionalSearches = searchStatuses.filter((s) => s.isAdditional).length
  const standardSearches = searchStatuses.filter((s) => !s.isAdditional).length

  // Get search lists by status
  const completedSearchList = searchStatuses.filter((s) => s.status === "completed")
  const orderedSearchList = searchStatuses.filter((s) => s.status === "ordered")
  const additionalSearchList = searchStatuses.filter((s) => s.isAdditional)

  // Calculate overall progress percentage
  const overallProgress =
    totalSearches > 0 ? ((completedSearches * 100 + orderedSearches * 50) / (totalSearches * 100)) * 100 : 0

  // Process real-time updates with enhanced handling for additions
  const processSearchUpdate = useCallback((update: any) => {
    const { searchId, status, searchName, action, isAdditional } = update.data

    console.log("🔄 Processing search update:", { searchId, status, searchName, action, isAdditional })

    if (action === "add" && isAdditional) {
      // Handle new search addition
      const newSearch: SearchStatus = {
        id: searchId,
        name: searchName,
        status: "pending",
        lastUpdated: update.timestamp,
        addedAt: update.timestamp,
        isAdditional: true,
        // Extract additional details from update if available
        cost: update.data.cost || 0,
        estimatedDays: update.data.estimatedDays || 0,
        provider: update.data.provider || "Unknown",
        category: update.data.category || "Additional",
        priority: update.data.priority || "optional",
      }

      setSearchStatuses((prevStatuses) => {
        // Check if search already exists
        const existingSearch = prevStatuses.find((s) => s.id === searchId)
        if (existingSearch) {
          console.log("Search already exists, skipping addition")
          return prevStatuses
        }

        console.log(`✅ Adding new search: ${searchName}`)
        const updatedStatuses = [...prevStatuses, newSearch]
        console.log("📊 New search statuses after addition:", updatedStatuses)
        return updatedStatuses
      })

      // Show toast notification for new search
      toast({
        title: "New Search Added! 📋",
        description: `${searchName} has been added to the search list`,
      })
    } else if (action === "remove") {
      // Handle search removal
      setSearchStatuses((prevStatuses) => {
        const updatedStatuses = prevStatuses.filter((search) => search.id !== searchId)
        console.log(`🗑️ Removed search: ${searchName}`)
        console.log("📊 New search statuses after removal:", updatedStatuses)
        return updatedStatuses
      })

      toast({
        title: "Search Removed",
        description: `${searchName} has been removed from the search list`,
      })
    } else {
      // Handle status updates (order, complete)
      setSearchStatuses((prevStatuses) => {
        const updatedStatuses = prevStatuses.map((search) => {
          if (search.id === searchId) {
            const updatedSearch = {
              ...search,
              status: status as "pending" | "ordered" | "completed",
              lastUpdated: update.timestamp,
              ...(status === "completed" && { completedAt: update.timestamp }),
            }
            console.log(`✅ Updated ${search.name}: ${search.status} → ${status}`)
            return updatedSearch
          }
          return search
        })

        console.log("📊 New search statuses after status update:", updatedStatuses)
        return updatedStatuses
      })

      // Show toast notification for status changes
      if (status === "completed") {
        toast({
          title: "Search Completed! 🎉",
          description: `${searchName} has been completed by buyer conveyancer`,
        })
      } else if (status === "ordered") {
        toast({
          title: "Search Ordered! 📦",
          description: `${searchName} has been ordered by buyer conveyancer`,
        })
      }
    }
  }, [])

  // Listen for search status updates from buyer conveyancer
  useEffect(() => {
    console.log("👂 Listening for updates. Total updates:", updates.length)

    const searchUpdates = updates.filter(
      (update) =>
        update.stage === "search-survey" &&
        update.role === "buyer-conveyancer" &&
        update.data?.searchId &&
        (update.data?.status || update.data?.action),
    )

    console.log("🔍 Found search updates:", searchUpdates.length)

    if (searchUpdates.length > 0) {
      // Process the most recent update for each search
      const latestUpdates = new Map()
      searchUpdates.forEach((update) => {
        const searchId = update.data.searchId
        const updateKey = `${searchId}-${update.data.action || update.data.status}`
        if (!latestUpdates.has(updateKey) || update.timestamp > latestUpdates.get(updateKey).timestamp) {
          latestUpdates.set(updateKey, update)
        }
      })

      latestUpdates.forEach((update) => {
        processSearchUpdate(update)
      })
    }
  }, [updates, processSearchUpdate])

  // Log when summary stats change
  useEffect(() => {
    console.log("📈 Summary stats updated:", {
      completed: completedSearches,
      ordered: orderedSearches,
      pending: pendingSearches,
      total: totalSearches,
      additional: additionalSearches,
      progress: Math.round(overallProgress),
    })
  }, [completedSearches, orderedSearches, pendingSearches, totalSearches, additionalSearches, overallProgress])

  const handleViewCompletedDetails = () => {
    setShowCompletedDetails(!showCompletedDetails)

    if (completedSearches > 0) {
      toast({
        title: "Completed Searches",
        description: `${completedSearches} search${completedSearches > 1 ? "es" : ""} completed: ${completedSearchList.map((s) => s.name).join(", ")}`,
      })
    }
  }

  const handleViewAdditionalSearches = () => {
    setShowAdditionalSearches(!showAdditionalSearches)

    if (additionalSearches > 0) {
      toast({
        title: "Additional Searches",
        description: `${additionalSearches} additional search${additionalSearches > 1 ? "es" : ""} added to the standard searches`,
      })
    }
  }

  const handleDownloadCompletedReports = () => {
    if (completedSearches === 0) return

    toast({
      title: "Downloading Reports",
      description: `Downloading ${completedSearches} completed search reports...`,
    })

    // Simulate download
    setTimeout(() => {
      toast({
        title: "Download Complete",
        description: `${completedSearches} search reports downloaded successfully`,
      })
    }, 2000)
  }

  const getStatusIcon = (status: SearchStatus["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "ordered":
        return <ShoppingCart className="h-4 w-4 text-blue-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusBadge = (status: SearchStatus["status"]) => {
    const configs = {
      pending: { label: "Pending", className: "bg-gray-100 text-gray-800" },
      ordered: { label: "Ordered", className: "bg-blue-100 text-blue-800" },
      completed: { label: "Completed", className: "bg-green-100 text-green-800" },
    }

    const config = configs[status]
    return (
      <Badge className={config.className}>
        {getStatusIcon(status)}
        <span className="ml-1">{config.label}</span>
      </Badge>
    )
  }

  const getProgress = (status: SearchStatus["status"]) => {
    switch (status) {
      case "completed":
        return 100
      case "ordered":
        return 50
      default:
        return 0
    }
  }

  return (
    <TransactionLayout title="Property Searches & Survey" stage="search-survey" userRole="seller-conveyancer">
      <div className="space-y-6">
        {/* Real-time Search Progress Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Buyer's Search Progress (Live Updates)
            </CardTitle>
            <CardDescription>Real-time monitoring of buyer conveyancer's property searches</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Overall Progress Bar */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2 font-medium">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                  Overall Search Progress
                </span>
                <span className="text-lg font-bold text-blue-600">{Math.round(overallProgress)}%</span>
              </div>
              <Progress value={overallProgress} className="h-4" />
              <div className="text-sm text-muted-foreground text-center">
                {completedSearches} completed, {orderedSearches} ordered, {pendingSearches} pending ({totalSearches}{" "}
                total searches)
              </div>
            </div>

            {/* Enhanced Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* COMPLETED - Interactive Container */}
              <div
                className={`bg-green-50 border-2 rounded-lg p-4 text-center cursor-pointer transition-all duration-200 hover:shadow-md ${
                  completedSearches > 0
                    ? "border-green-300 hover:border-green-400 hover:bg-green-100"
                    : "border-green-200"
                }`}
                onClick={handleViewCompletedDetails}
              >
                <div className="text-3xl font-bold text-green-600">{completedSearches}</div>
                <div className="text-sm text-green-700 font-medium">Completed</div>
                <div className="text-xs text-green-600 mt-1">
                  {totalSearches > 0 ? Math.round((completedSearches / totalSearches) * 100) : 0}% of total
                </div>
                {completedSearches > 0 && (
                  <div className="mt-2 flex justify-center gap-1">
                    <Button size="sm" variant="outline" className="text-xs h-6 px-2 bg-transparent">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  </div>
                )}
              </div>

              {/* ORDERED - Interactive Container */}
              <div
                className={`bg-blue-50 border-2 rounded-lg p-4 text-center cursor-pointer transition-all duration-200 hover:shadow-md ${
                  orderedSearches > 0 ? "border-blue-300 hover:border-blue-400 hover:bg-blue-100" : "border-blue-200"
                }`}
                onClick={() => {
                  if (orderedSearches > 0) {
                    toast({
                      title: "Ordered Searches",
                      description: `${orderedSearches} search${orderedSearches > 1 ? "es" : ""} ordered: ${orderedSearchList.map((s) => s.name).join(", ")}`,
                    })
                  }
                }}
              >
                <div className="text-3xl font-bold text-blue-600">{orderedSearches}</div>
                <div className="text-sm text-blue-700 font-medium">Ordered</div>
                <div className="text-xs text-blue-600 mt-1">
                  {totalSearches > 0 ? Math.round((orderedSearches / totalSearches) * 100) : 0}% of total
                </div>
                {orderedSearches > 0 && (
                  <div className="mt-2 flex justify-center gap-1">
                    <Button size="sm" variant="outline" className="text-xs h-6 px-2 bg-transparent">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  </div>
                )}
              </div>

              {/* PENDING */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-gray-600">{pendingSearches}</div>
                <div className="text-sm text-gray-700 font-medium">Pending</div>
                <div className="text-xs text-gray-600 mt-1">
                  {totalSearches > 0 ? Math.round((pendingSearches / totalSearches) * 100) : 0}% of total
                </div>
              </div>

              {/* ADDITIONAL SEARCHES */}
              <div
                className={`bg-purple-50 border-2 rounded-lg p-4 text-center cursor-pointer transition-all duration-200 hover:shadow-md ${
                  additionalSearches > 0
                    ? "border-purple-300 hover:border-purple-400 hover:bg-purple-100"
                    : "border-purple-200"
                }`}
                onClick={handleViewAdditionalSearches}
              >
                <div className="text-3xl font-bold text-purple-600">{additionalSearches}</div>
                <div className="text-sm text-purple-700 font-medium">Additional</div>
                <div className="text-xs text-purple-600 mt-1">Beyond standard searches</div>
                {additionalSearches > 0 && (
                  <div className="mt-2 flex justify-center gap-1">
                    <Button size="sm" variant="outline" className="text-xs h-6 px-2 bg-transparent">
                      <Plus className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  </div>
                )}
              </div>

              {/* TOTAL */}
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-indigo-600">{totalSearches}</div>
                <div className="text-sm text-indigo-700 font-medium">Total Searches</div>
                <div className="text-xs text-indigo-600 mt-1">
                  {standardSearches} standard + {additionalSearches} additional
                </div>
              </div>
            </div>

            {/* Additional Searches Details */}
            {showAdditionalSearches && additionalSearches > 0 && (
              <Card className="border-purple-200 bg-purple-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-purple-800 flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Additional Searches ({additionalSearches})
                  </CardTitle>
                  <CardDescription>Searches added beyond the standard property search package</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {additionalSearchList.map((search) => (
                    <div
                      key={search.id}
                      className="flex items-center justify-between p-3 bg-white rounded-lg border border-purple-200"
                    >
                      <div className="flex items-center gap-3">
                        {getStatusIcon(search.status)}
                        <div>
                          <div className="font-medium text-sm">{search.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {search.category} • £{search.cost} • {search.estimatedDays} days
                          </div>
                          {search.addedAt && (
                            <div className="text-xs text-muted-foreground">
                              Added: {search.addedAt.toLocaleString()}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(search.status)}
                        {search.status === "completed" && (
                          <Button size="sm" variant="outline">
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" onClick={() => setShowAdditionalSearches(false)}>
                      Close
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Completed Searches Details */}
            {showCompletedDetails && completedSearches > 0 && (
              <Card className="border-green-200 bg-green-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-green-800 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Completed Searches ({completedSearches})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {completedSearchList.map((search) => (
                    <div
                      key={search.id}
                      className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-200"
                    >
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <div>
                          <div className="font-medium text-sm flex items-center gap-2">
                            {search.name}
                            {search.isAdditional && <Badge variant="outline">Additional</Badge>}
                          </div>
                          {search.completedAt && (
                            <div className="text-xs text-muted-foreground">
                              Completed: {search.completedAt.toLocaleString()}
                            </div>
                          )}
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  ))}

                  <div className="flex gap-2 pt-2">
                    <Button onClick={handleDownloadCompletedReports} className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Download All Reports
                    </Button>
                    <Button variant="outline" onClick={() => setShowCompletedDetails(false)}>
                      Close
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Progress Status Indicator */}
            <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">
                  {completedSearches === totalSearches
                    ? "🎉 All searches completed!"
                    : orderedSearches + completedSearches === totalSearches
                      ? "⏳ All searches ordered - awaiting completion"
                      : `📋 ${totalSearches - orderedSearches - completedSearches} searches still pending`}
                  {additionalSearches > 0 && (
                    <span className="text-purple-600 ml-2">
                      (Including {additionalSearches} additional search{additionalSearches > 1 ? "es" : ""})
                    </span>
                  )}
                </span>
              </div>
            </div>

            {/* Individual Search Status */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm text-muted-foreground">Individual Search Status</h4>
                <div className="text-xs text-muted-foreground">
                  {standardSearches} standard • {additionalSearches} additional • {totalSearches} total
                </div>
              </div>
              {searchStatuses.map((search) => (
                <div
                  key={search.id}
                  className={`border rounded-lg p-4 ${search.isAdditional ? "border-purple-200 bg-purple-50" : ""}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{search.name}</h4>
                      {search.isAdditional && <Badge variant="outline">Additional</Badge>}
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(search.status)}
                      {search.lastUpdated && (
                        <span className="text-xs text-muted-foreground">{search.lastUpdated.toLocaleTimeString()}</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{getProgress(search.status)}%</span>
                    </div>
                    <Progress value={getProgress(search.status)} className="h-2" />
                  </div>

                  {search.cost && (
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                      <span>Cost: £{search.cost}</span>
                      {search.estimatedDays && <span>Est. {search.estimatedDays} days</span>}
                      {search.provider && <span>Provider: {search.provider}</span>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Real-time Activity Monitor */}
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-700">🔴 Live Activity Monitor</CardTitle>
            <CardDescription>Real-time status updates and search additions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
              <div
                className={`p-3 rounded-lg transition-all duration-300 ${completedSearches > 0 ? "bg-green-100 border-2 border-green-300" : "bg-gray-50"}`}
              >
                <div className="text-2xl font-bold text-green-600">{completedSearches}</div>
                <div className="text-xs text-green-700">COMPLETED</div>
              </div>
              <div
                className={`p-3 rounded-lg transition-all duration-300 ${orderedSearches > 0 ? "bg-blue-100 border-2 border-blue-300" : "bg-gray-50"}`}
              >
                <div className="text-2xl font-bold text-blue-600">{orderedSearches}</div>
                <div className="text-xs text-blue-700">ORDERED</div>
              </div>
              <div
                className={`p-3 rounded-lg transition-all duration-300 ${pendingSearches > 0 ? "bg-gray-100 border-2 border-gray-300" : "bg-gray-50"}`}
              >
                <div className="text-2xl font-bold text-gray-600">{pendingSearches}</div>
                <div className="text-xs text-gray-700">PENDING</div>
              </div>
              <div
                className={`p-3 rounded-lg transition-all duration-300 ${additionalSearches > 0 ? "bg-purple-100 border-2 border-purple-300" : "bg-gray-50"}`}
              >
                <div className="text-2xl font-bold text-purple-600">{additionalSearches}</div>
                <div className="text-xs text-purple-700">ADDITIONAL</div>
              </div>
              <div className="p-3 bg-indigo-100 rounded-lg border-2 border-indigo-300">
                <div className="text-2xl font-bold text-indigo-600">{Math.round(overallProgress)}%</div>
                <div className="text-xs text-indigo-700">PROGRESS</div>
              </div>
            </div>

            {/* Recent Activity Feed */}
            <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
              <h5 className="font-medium text-sm">Recent Activity</h5>
              {updates
                .filter((update) => update.stage === "search-survey" && update.role === "buyer-conveyancer")
                .slice(0, 10)
                .map((update) => (
                  <div key={update.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded text-xs">
                    <div className="flex-shrink-0">
                      {update.data?.action === "add" ? (
                        <Plus className="h-3 w-3 text-purple-600" />
                      ) : update.data?.status === "completed" ? (
                        <CheckCircle className="h-3 w-3 text-green-600" />
                      ) : (
                        <ShoppingCart className="h-3 w-3 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{update.title}</div>
                      <div className="text-muted-foreground">{update.description}</div>
                    </div>
                    <div className="text-muted-foreground">{formatTime(update.timestamp)}</div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </TransactionLayout>
  )
}
