"use client"

import TransactionLayout from "@/components/transaction-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Search,
  CheckCircle,
  Clock,
  Download,
  ShoppingCart,
  FileText,
  Home,
  Plus,
  Info,
  Zap,
  Loader2,
} from "lucide-react"
import { useState } from "react"
import { useRealTime } from "@/contexts/real-time-context"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface SearchItem {
  id: string
  name: string
  description: string
  status: "pending" | "ordered" | "completed"
  cost: number
  estimatedDays: number
  provider: string
  category?: string
  priority?: "standard" | "recommended" | "optional"
}

interface AdditionalSearch {
  id: string
  name: string
  description: string
  detailedDescription: string
  cost: number
  estimatedDays: number
  provider: string
  category: "environmental" | "legal" | "structural" | "regulatory" | "specialist"
  priority: "recommended" | "optional" | "situational"
  riskLevel: "low" | "medium" | "high"
  whenNeeded: string
}

export default function BuyerConveyancerSearchSurveyPage() {
  const { sendUpdate } = useRealTime()
  const router = useRouter()
  const [isCompleting, setIsCompleting] = useState(false)
  const [searches, setSearches] = useState<SearchItem[]>([
    {
      id: "local-authority-search",
      name: "Local Authority Search",
      description: "Planning permissions, building regulations, road schemes, and local land charges",
      status: "pending",
      cost: 150,
      estimatedDays: 5,
      provider: "Local Council",
      category: "Standard",
      priority: "standard",
    },
    {
      id: "environmental-search",
      name: "Environmental Search",
      description: "Contaminated land, flooding, ground stability, and environmental hazards",
      status: "pending",
      cost: 120,
      estimatedDays: 3,
      provider: "Landmark Information",
      category: "Standard",
      priority: "standard",
    },
    {
      id: "water-drainage-search",
      name: "Water & Drainage Search",
      description: "Water supply, sewerage, surface water drainage, and water authority information",
      status: "pending",
      cost: 85,
      estimatedDays: 7,
      provider: "Thames Water",
      category: "Standard",
      priority: "standard",
    },
    {
      id: "chancel-repair-search",
      name: "Chancel Repair Search",
      description: "Liability for church chancel repairs - required for properties in certain areas",
      status: "pending",
      cost: 45,
      estimatedDays: 2,
      provider: "Chancel Check",
      category: "Standard",
      priority: "standard",
    },
  ])

  const [additionalSearches] = useState<AdditionalSearch[]>([
    {
      id: "coal-mining-search",
      name: "Coal Mining Search",
      description: "Historical coal mining activity and subsidence risk",
      detailedDescription:
        "Identifies past, present and future coal mining activity that could affect the property. Essential in areas with coal mining history.",
      cost: 95,
      estimatedDays: 3,
      provider: "Coal Authority",
      category: "environmental",
      priority: "recommended",
      riskLevel: "high",
      whenNeeded: "Properties in former coal mining areas",
    },
    {
      id: "tin-mining-search",
      name: "Tin Mining Search",
      description: "Historical tin mining activity and ground stability",
      detailedDescription:
        "Reveals tin mining history and potential ground stability issues, particularly relevant in Cornwall and Devon.",
      cost: 75,
      estimatedDays: 4,
      provider: "Cornwall Council",
      category: "environmental",
      priority: "situational",
      riskLevel: "medium",
      whenNeeded: "Properties in Cornwall, Devon, and other tin mining areas",
    },
    {
      id: "brine-extraction-search",
      name: "Brine Extraction Search",
      description: "Salt extraction and subsidence risk assessment",
      detailedDescription:
        "Identifies areas affected by brine extraction which can cause ground subsidence and property damage.",
      cost: 85,
      estimatedDays: 5,
      provider: "British Geological Survey",
      category: "environmental",
      priority: "situational",
      riskLevel: "high",
      whenNeeded: "Properties in Cheshire, Staffordshire, and other salt extraction areas",
    },
    {
      id: "commons-registration-search",
      name: "Commons Registration Search",
      description: "Rights over common land and village greens",
      detailedDescription:
        "Reveals any rights of common, town or village green registrations that could affect property use.",
      cost: 65,
      estimatedDays: 3,
      provider: "Local Authority",
      category: "legal",
      priority: "optional",
      riskLevel: "low",
      whenNeeded: "Properties near common land or village greens",
    },
    {
      id: "rights-of-way-search",
      name: "Rights of Way Search",
      description: "Public footpaths, bridleways, and access rights",
      detailedDescription:
        "Comprehensive search for public rights of way, footpaths, bridleways, and other access rights affecting the property.",
      cost: 55,
      estimatedDays: 4,
      provider: "Local Authority",
      category: "legal",
      priority: "recommended",
      riskLevel: "medium",
      whenNeeded: "Rural properties and those near public access routes",
    },
    {
      id: "flood-risk-assessment",
      name: "Detailed Flood Risk Assessment",
      description: "Comprehensive flood risk analysis and insurance implications",
      detailedDescription:
        "In-depth flood risk assessment including river, surface water, groundwater, and coastal flooding with insurance implications.",
      cost: 125,
      estimatedDays: 5,
      provider: "Environment Agency",
      category: "environmental",
      priority: "recommended",
      riskLevel: "high",
      whenNeeded: "Properties in flood risk areas or near water sources",
    },
    {
      id: "ground-stability-search",
      name: "Ground Stability Search",
      description: "Geological hazards and ground movement risk",
      detailedDescription:
        "Identifies geological hazards including landslides, ground dissolution, and other ground stability issues.",
      cost: 105,
      estimatedDays: 4,
      provider: "British Geological Survey",
      category: "structural",
      priority: "recommended",
      riskLevel: "high",
      whenNeeded: "Properties on slopes, near cliffs, or in geologically unstable areas",
    },
    {
      id: "radon-gas-search",
      name: "Radon Gas Search",
      description: "Radon gas risk assessment and mitigation requirements",
      detailedDescription:
        "Assesses radon gas risk levels and identifies if protective measures are required for health and safety.",
      cost: 45,
      estimatedDays: 2,
      provider: "Public Health England",
      category: "environmental",
      priority: "recommended",
      riskLevel: "medium",
      whenNeeded: "Properties in radon-affected areas (Cornwall, Derbyshire, etc.)",
    },
    {
      id: "tree-preservation-search",
      name: "Tree Preservation Order Search",
      description: "Protected trees and woodland restrictions",
      detailedDescription:
        "Identifies Tree Preservation Orders (TPOs) and conservation area restrictions affecting trees on or near the property.",
      cost: 35,
      estimatedDays: 3,
      provider: "Local Authority",
      category: "regulatory",
      priority: "optional",
      riskLevel: "low",
      whenNeeded: "Properties with significant trees or in conservation areas",
    },
    {
      id: "energy-performance-search",
      name: "Energy Performance Assessment",
      description: "Energy efficiency rating and improvement recommendations",
      detailedDescription:
        "Comprehensive energy performance evaluation with improvement recommendations and cost estimates.",
      cost: 95,
      estimatedDays: 3,
      provider: "Accredited Energy Assessor",
      category: "regulatory",
      priority: "optional",
      riskLevel: "low",
      whenNeeded: "Properties requiring energy efficiency improvements",
    },
    {
      id: "japanese-knotweed-survey",
      name: "Japanese Knotweed Survey",
      description: "Invasive plant species identification and treatment plan",
      detailedDescription:
        "Professional survey to identify Japanese knotweed and other invasive species with treatment and management plans.",
      cost: 155,
      estimatedDays: 2,
      provider: "Specialist Surveyor",
      category: "specialist",
      priority: "situational",
      riskLevel: "high",
      whenNeeded: "Properties with suspected invasive plant species",
    },
    {
      id: "asbestos-survey",
      name: "Asbestos Survey",
      description: "Asbestos identification and safety assessment",
      detailedDescription:
        "Professional asbestos survey to identify presence, condition, and safety risks with removal recommendations.",
      cost: 185,
      estimatedDays: 3,
      provider: "Licensed Asbestos Surveyor",
      category: "specialist",
      priority: "recommended",
      riskLevel: "high",
      whenNeeded: "Properties built before 1980",
    },
  ])

  const [selectedAdditionalSearches, setSelectedAdditionalSearches] = useState<string[]>([])
  const [showAdditionalSearches, setShowAdditionalSearches] = useState(false)
  const [filterCategory, setFilterCategory] = useState<string>("all")

  const handleOrderSearch = (searchId: string) => {
    const search = searches.find((s) => s.id === searchId)
    if (!search) {
      console.error("Search not found:", searchId)
      return
    }

    console.log("Ordering search:", searchId, search.name)

    // Update local state
    setSearches((prev) => prev.map((s) => (s.id === searchId ? { ...s, status: "ordered" as const } : s)))

    // Send real-time update to seller conveyancer
    sendUpdate({
      type: "status_changed",
      stage: "search-survey",
      role: "buyer-conveyancer",
      title: "Search Ordered",
      description: `${search.name} has been ordered by buyer conveyancer`,
      data: {
        searchId: searchId,
        searchName: search.name,
        status: "ordered",
        action: "order",
      },
    })

    // Show local confirmation
    toast({
      title: "Search Ordered",
      description: `${search.name} has been marked as ordered`,
    })
  }

  const handleCompleteSearch = (searchId: string) => {
    const search = searches.find((s) => s.id === searchId)
    if (!search) {
      console.error("Search not found:", searchId)
      return
    }

    console.log("Completing search:", searchId, search.name)

    // Update local state
    setSearches((prev) => prev.map((s) => (s.id === searchId ? { ...s, status: "completed" as const } : s)))

    // Send real-time update to seller conveyancer
    sendUpdate({
      type: "status_changed",
      stage: "search-survey",
      role: "buyer-conveyancer",
      title: "Search Completed",
      description: `${search.name} has been completed by buyer conveyancer`,
      data: {
        searchId: searchId,
        searchName: search.name,
        status: "completed",
        action: "complete",
      },
    })

    // Show local confirmation
    toast({
      title: "Search Completed",
      description: `${search.name} has been marked as completed`,
    })
  }

  const handleSelectAdditionalSearch = (searchId: string, checked: boolean) => {
    if (checked) {
      setSelectedAdditionalSearches((prev) => [...prev, searchId])
    } else {
      setSelectedAdditionalSearches((prev) => prev.filter((id) => id !== searchId))
    }
  }

  const handleOrderAdditionalSearches = () => {
    if (selectedAdditionalSearches.length === 0) {
      toast({
        title: "No Searches Selected",
        description: "Please select at least one additional search to order",
        variant: "destructive",
      })
      return
    }

    const selectedSearchObjects = additionalSearches.filter((search) => selectedAdditionalSearches.includes(search.id))

    // Add selected searches to main search list
    const newSearches = selectedSearchObjects.map((search) => ({
      id: search.id,
      name: search.name,
      description: search.description,
      status: "pending" as const,
      cost: search.cost,
      estimatedDays: search.estimatedDays,
      provider: search.provider,
      category: search.category,
      priority: search.priority,
    }))

    setSearches((prev) => [...prev, ...newSearches])

    // Send real-time updates for each new search
    selectedSearchObjects.forEach((search) => {
      sendUpdate({
        type: "status_changed",
        stage: "search-survey",
        role: "buyer-conveyancer",
        title: "Additional Search Added",
        description: `${search.name} has been added to the search list`,
        data: {
          searchId: search.id,
          searchName: search.name,
          status: "pending",
          action: "add",
          isAdditional: true,
          cost: search.cost,
          estimatedDays: search.estimatedDays,
          provider: search.provider,
          category: search.category,
          priority: search.priority,
        },
      })
    })

    const totalCost = selectedSearchObjects.reduce((sum, search) => sum + search.cost, 0)

    toast({
      title: "Additional Searches Added! 🎉",
      description: `${selectedAdditionalSearches.length} searches added (Total: £${totalCost})`,
    })

    // Reset selection and close dialog
    setSelectedAdditionalSearches([])
    setShowAdditionalSearches(false)
  }

  const handleContinueToEnquiries = async () => {
    setIsCompleting(true)

    try {
      // Send stage completion update
      sendUpdate({
        type: "stage_completed",
        stage: "search-survey",
        role: "buyer-conveyancer",
        title: "Search & Survey Stage Completed",
        description: "All property searches and surveys have been completed by buyer conveyancer",
        data: {
          searchSurvey: {
            completedBy: "Buyer Conveyancer",
            completedAt: new Date().toISOString(),
            surveyType: "HomeBuyer Report",
            searchResults: [
              "Local Authority Search - Clear",
              "Environmental Search - Low risk flood zone identified",
              "Water & Drainage Search - Standard connections confirmed",
              "Chancel Repair Search - No liability found",
            ],
            surveyFindings: [
              "Property in good overall condition",
              "Minor maintenance items identified",
              "No structural concerns",
              "Recommended: Gutter cleaning and minor roof repairs",
            ],
            status: "completed",
            nextStage: "Enquiries",
          },
        },
      })

      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Navigate to enquiries page
      router.push("/buyer-conveyancer/enquiries")
    } catch (error) {
      console.error("Error completing search & survey stage:", error)
      toast({
        title: "Error",
        description: "Failed to complete search & survey stage",
        variant: "destructive",
      })
    } finally {
      setIsCompleting(false)
    }
  }

  const getStatusIcon = (status: SearchItem["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "ordered":
        return <ShoppingCart className="h-4 w-4 text-blue-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusBadge = (status: SearchItem["status"]) => {
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

  const getPriorityBadge = (priority: AdditionalSearch["priority"]) => {
    const configs = {
      recommended: { label: "Recommended", className: "bg-blue-100 text-blue-800" },
      optional: { label: "Optional", className: "bg-gray-100 text-gray-800" },
      situational: { label: "Situational", className: "bg-amber-100 text-amber-800" },
    }

    const config = configs[priority]
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const getRiskBadge = (riskLevel: AdditionalSearch["riskLevel"]) => {
    const configs = {
      low: { label: "Low Risk", className: "bg-green-100 text-green-800" },
      medium: { label: "Medium Risk", className: "bg-amber-100 text-amber-800" },
      high: { label: "High Risk", className: "bg-red-100 text-red-800" },
    }

    const config = configs[riskLevel]
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const getProgress = (status: SearchItem["status"]) => {
    switch (status) {
      case "completed":
        return 100
      case "ordered":
        return 50
      default:
        return 0
    }
  }

  const filteredAdditionalSearches = additionalSearches.filter((search) => {
    if (filterCategory === "all") return true
    return search.category === filterCategory
  })

  const selectedSearchesCost = additionalSearches
    .filter((search) => selectedAdditionalSearches.includes(search.id))
    .reduce((sum, search) => sum + search.cost, 0)

  const completedSearches = searches.filter((s) => s.status === "completed").length
  const orderedSearches = searches.filter((s) => s.status === "ordered").length
  const totalSearches = searches.length

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "environmental", label: "Environmental" },
    { value: "legal", label: "Legal" },
    { value: "structural", label: "Structural" },
    { value: "regulatory", label: "Regulatory" },
    { value: "specialist", label: "Specialist" },
  ]

  return (
    <TransactionLayout currentStage="search-survey" userRole="buyer-conveyancer">
      <div className="space-y-6">
        {/* Search Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Property Searches Progress
            </CardTitle>
            <CardDescription>Manage property search ordering and completion status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{completedSearches}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{orderedSearches}</div>
                <div className="text-sm text-muted-foreground">Ordered</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">
                  {totalSearches - orderedSearches - completedSearches}
                </div>
                <div className="text-sm text-muted-foreground">Pending</div>
              </div>
            </div>

            {/* Individual Search Items */}
            <div className="space-y-4">
              {searches.map((search) => (
                <div key={search.id} className="border rounded-lg p-4 space-y-4">
                  {/* Search Header */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{search.name}</h4>
                        {getStatusBadge(search.status)}
                        {search.category && search.category !== "Standard" && (
                          <Badge variant="outline">{search.category}</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{search.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Cost: £{search.cost}</span>
                        <span>Est. {search.estimatedDays} days</span>
                        <span>Provider: {search.provider}</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{getProgress(search.status)}%</span>
                    </div>
                    <Progress value={getProgress(search.status)} className="h-2" />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleOrderSearch(search.id)}
                      disabled={search.status === "ordered" || search.status === "completed"}
                      size="sm"
                      variant={search.status === "ordered" ? "secondary" : "default"}
                      className="flex items-center gap-1"
                    >
                      <ShoppingCart className="h-3 w-3" />
                      {search.status === "ordered" || search.status === "completed" ? "Ordered ✓" : "Mark as Ordered"}
                    </Button>

                    <Button
                      onClick={() => handleCompleteSearch(search.id)}
                      disabled={search.status === "completed"}
                      size="sm"
                      variant={search.status === "completed" ? "secondary" : "outline"}
                      className="flex items-center gap-1"
                    >
                      <CheckCircle className="h-3 w-3" />
                      {search.status === "completed" ? "Completed ✓" : "Mark as Completed"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Survey Coordination */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Survey Coordination
            </CardTitle>
            <CardDescription>Manage survey arrangements and results</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Homebuyer Survey</h4>
                <p className="text-sm text-muted-foreground">Surveyor: Thompson & Co</p>
                <Badge variant="default">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Report Received
                </Badge>
              </div>
              <div className="space-y-2">
                <Button variant="outline" className="w-full bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  Download Survey Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search Results Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Search Results Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="border-l-4 border-green-400 pl-4 py-2">
                <h4 className="font-medium text-sm">Local Authority Search</h4>
                <p className="text-sm text-muted-foreground">
                  No adverse entries found. Planning permissions in order.
                </p>
              </div>
              <div className="border-l-4 border-yellow-400 pl-4 py-2">
                <h4 className="font-medium text-sm">Environmental Search</h4>
                <p className="text-sm text-muted-foreground">
                  Minor historical land use noted - requires further investigation.
                </p>
              </div>
              <div className="border-l-4 border-blue-400 pl-4 py-2">
                <h4 className="font-medium text-sm">Survey Report</h4>
                <p className="text-sm text-muted-foreground">
                  Property in good condition. Minor maintenance items identified.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button onClick={handleContinueToEnquiries} disabled={isCompleting} className="flex items-center gap-2">
            {isCompleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Completing Stage...
              </>
            ) : (
              "Continue to Enquiries"
            )}
          </Button>

          {/* Functional Order Additional Searches Button */}
          <Dialog open={showAdditionalSearches} onOpenChange={setShowAdditionalSearches}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                <Plus className="h-4 w-4" />
                Order Additional Searches
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Order Additional Property Searches
                </DialogTitle>
                <DialogDescription>
                  Select additional searches based on property location, age, and specific risk factors. Each search
                  provides valuable information to protect your client's investment.
                </DialogDescription>
              </DialogHeader>

              {/* Category Filter */}
              <div className="flex gap-2 mb-4">
                {categories.map((category) => (
                  <Button
                    key={category.value}
                    variant={filterCategory === category.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterCategory(category.value)}
                  >
                    {category.label}
                  </Button>
                ))}
              </div>

              {/* Selected Searches Summary */}
              {selectedAdditionalSearches.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{selectedAdditionalSearches.length} searches selected</span>
                    <span className="font-bold text-blue-600">Total: £{selectedSearchesCost}</span>
                  </div>
                </div>
              )}

              {/* Additional Searches List */}
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredAdditionalSearches.map((search) => (
                  <div key={search.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id={search.id}
                        checked={selectedAdditionalSearches.includes(search.id)}
                        onCheckedChange={(checked) => handleSelectAdditionalSearch(search.id, !!checked)}
                        className="mt-1"
                      />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <label htmlFor={search.id} className="font-semibold cursor-pointer">
                              {search.name}
                            </label>
                            <div className="flex items-center gap-2 mt-1">
                              {getPriorityBadge(search.priority)}
                              {getRiskBadge(search.riskLevel)}
                              <Badge variant="outline" className="text-xs">
                                {search.category}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-lg">£{search.cost}</div>
                            <div className="text-sm text-muted-foreground">{search.estimatedDays} days</div>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground">{search.description}</p>

                        <div className="bg-gray-50 rounded p-2 text-xs">
                          <p className="mb-1">
                            <strong>When needed:</strong> {search.whenNeeded}
                          </p>
                          <p>
                            <strong>Provider:</strong> {search.provider}
                          </p>
                        </div>

                        <details className="text-sm">
                          <summary className="cursor-pointer text-blue-600 hover:text-blue-800 flex items-center gap-1">
                            <Info className="h-3 w-3" />
                            More details
                          </summary>
                          <p className="mt-2 text-muted-foreground pl-4">{search.detailedDescription}</p>
                        </details>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <DialogFooter className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {selectedAdditionalSearches.length} searches selected • Total cost: £{selectedSearchesCost}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setShowAdditionalSearches(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleOrderAdditionalSearches}
                    disabled={selectedAdditionalSearches.length === 0}
                    className="flex items-center gap-2"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Order Selected Searches (£{selectedSearchesCost})
                  </Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button variant="outline">Request Rush Processing</Button>
        </div>
      </div>
    </TransactionLayout>
  )
}
