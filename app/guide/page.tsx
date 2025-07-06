"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { 
  ArrowLeft, 
  CheckCircle, 
  User, 
  Building, 
  Scale, 
  FileText, 
  Target, 
  MessageSquare, 
  Lightbulb, 
  Upload, 
  Bell, 
  HelpCircle, 
  Users, 
  Clock,
  ClipboardCheck,
  MessageCircle,
  FileQuestion,
  BookOpen,
  Star
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function GuidePage() {
  const [activeTab, setActiveTab] = useState("quick-start")
  const [isScrolled, setIsScrolled] = useState(false)

  // Track scroll for sticky navigation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7F9FC] to-[#EDF2F7]">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center text-[#003366] hover:text-[#4299E1] transition-colors">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Home
              </Link>
              <div className="flex items-center space-x-3">
                <Image 
                  src="/nutlip_logo.webp" 
                  alt="Nutlip Logo" 
                  width={120} 
                  height={48} 
                  className="h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Tab Navigation */}
      <div className={`sticky top-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'}`}>
        <div className="container mx-auto px-4 py-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Enhanced Tab Navigation */}
            <TabsList className="grid grid-cols-2 lg:grid-cols-6 w-full h-auto p-2 bg-white shadow-sm rounded-lg">
              <TabsTrigger 
                value="quick-start" 
                className="flex items-center gap-2 py-3 px-3 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-800 hover:bg-gray-50 transition-all duration-200 rounded-md"
              >
                <Star className="h-4 w-4" />
                <span className="hidden sm:inline font-medium">Quick Start</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="buyer" 
                className="flex items-center gap-2 py-3 px-3 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-800 hover:bg-gray-50 transition-all duration-200 rounded-md"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline font-medium">Buyer</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="estate-agent" 
                className="flex items-center gap-2 py-3 px-3 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-800 hover:bg-gray-50 transition-all duration-200 rounded-md"
              >
                <Building className="h-4 w-4" />
                <span className="hidden sm:inline font-medium">Estate Agent</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="buyer-conveyancer" 
                className="flex items-center gap-2 py-3 px-3 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-800 hover:bg-gray-50 transition-all duration-200 rounded-md"
              >
                <Scale className="h-4 w-4" />
                <span className="hidden sm:inline font-medium">Buyer Conveyancer</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="seller-conveyancer" 
                className="flex items-center gap-2 py-3 px-3 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-800 hover:bg-gray-50 transition-all duration-200 rounded-md"
              >
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline font-medium">Seller Conveyancer</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="common-features" 
                className="flex items-center gap-2 py-3 px-3 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-800 hover:bg-gray-50 transition-all duration-200 rounded-md"
              >
                <BookOpen className="h-4 w-4" />
                <span className="hidden sm:inline font-medium">Common Features</span>
              </TabsTrigger>
            </TabsList>

            {/* Tab Content */}
            <div className="container mx-auto px-4 py-8">
              {/* Quick Start Tab */}
              <TabsContent value="quick-start" className="space-y-6 animate-in fade-in-50 duration-500">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-[#003366] mb-4">🚀 Quick Start Guide</h2>
                  <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                    Master the essential features of the Nutlip Property Transaction Engine in just 30 minutes
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                  <Card className="border-2 border-[#4299E1]/20 hover:shadow-lg transition-shadow">
                    <CardHeader className="text-center">
                      <div className="mx-auto rounded-full bg-[#4299E1]/10 p-3 mb-3 w-16 h-16 flex items-center justify-center">
                        <Target className="h-8 w-8 text-[#4299E1]" />
                      </div>
                      <CardTitle className="text-xl text-[#003366]">Step 1: Access Nutlip</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          Open your web browser (Chrome, Safari, Firefox, or Edge)
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          Go to the Nutlip platform
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          You'll see your personalised dashboard
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-[#10B981]/20 hover:shadow-lg transition-shadow">
                    <CardHeader className="text-center">
                      <div className="mx-auto rounded-full bg-[#10B981]/10 p-3 mb-3 w-16 h-16 flex items-center justify-center">
                        <User className="h-8 w-8 text-[#10B981]" />
                      </div>
                      <CardTitle className="text-xl text-[#003366]">Step 2: Identify Your Role</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-[#4299E1]/10 text-[#4299E1]">🏠 Buyer</Badge>
                        <span className="text-sm text-gray-600">You're purchasing a property</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-[#10B981]/10 text-[#10B981]">🏢 Estate Agent</Badge>
                        <span className="text-sm text-gray-600">You're managing property sales</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-[#8B5CF6]/10 text-[#8B5CF6]">⚖️ Buyer Conveyancer</Badge>
                        <span className="text-sm text-gray-600">You're the buyer's solicitor</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-[#F59E0B]/10 text-[#F59E0B]">⚖️ Seller Conveyancer</Badge>
                        <span className="text-sm text-gray-600">You're the seller's solicitor</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-[#8B5CF6]/20 hover:shadow-lg transition-shadow">
                    <CardHeader className="text-center">
                      <div className="mx-auto rounded-full bg-[#8B5CF6]/10 p-3 mb-3 w-16 h-16 flex items-center justify-center">
                        <BookOpen className="h-8 w-8 text-[#8B5CF6]" />
                      </div>
                      <CardTitle className="text-xl text-[#003366]">Step 3: Understand Your Dashboard</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          📊 Your key statistics
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          📈 Current transaction progress
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          🔔 Recent notifications
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          ⚡ Quick action buttons
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Buyer Tab */}
              <TabsContent value="buyer" className="space-y-6 animate-in fade-in-50 duration-500">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-[#003366] mb-4">👤 Buyer Guide</h2>
                  <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                    Navigate your property purchase journey with confidence
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-xl text-[#003366] flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Your Dashboard
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 mb-4">As a buyer, your dashboard displays:</p>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <strong>Active Searches:</strong> Properties you're currently interested in
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <strong>Transaction Progress:</strong> Status of your current property purchase
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <strong>Recent Activity:</strong> Latest updates and notifications
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <strong>Quick Actions:</strong> Shortcuts to common tasks
                        </li>
                      </ul>
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600 font-medium">Your First Day Checklist:</p>
                        <ul className="mt-2 space-y-1 text-sm">
                          <li className="flex items-center">
                            <div className="w-5 h-5 border border-blue-300 rounded flex-shrink-0 mr-2"></div>
                            <span>Log in and explore your dashboard</span>
                          </li>
                          <li className="flex items-center">
                            <div className="w-5 h-5 border border-blue-300 rounded flex-shrink-0 mr-2"></div>
                            <span>Check which stage your transaction is at</span>
                          </li>
                          <li className="flex items-center">
                            <div className="w-5 h-5 border border-blue-300 rounded flex-shrink-0 mr-2"></div>
                            <span>Read any notifications (bell icon)</span>
                          </li>
                          <li className="flex items-center">
                            <div className="w-5 h-5 border border-blue-300 rounded flex-shrink-0 mr-2"></div>
                            <span>Upload your first document (if needed)</span>
                          </li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-xl text-[#003366] flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Key Responsibilities
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-[#003366] mb-2">1. Offer Accepted Stage</h4>
                          <ul className="text-sm text-gray-700 space-y-1">
                            <li>• Review and confirm your accepted offer details</li>
                            <li>• Communicate with your estate agent</li>
                            <li>• Prepare for the next steps</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-[#003366] mb-2">2. Proof of Funds</h4>
                          <ul className="text-sm text-gray-700 space-y-1">
                            <li>• <strong>Upload required documents</strong>:</li>
                            <li className="ml-4">- Bank statements (last 3 months)</li>
                            <li className="ml-4">- Mortgage agreement in principle</li>
                            <li className="ml-4">- Proof of deposit source</li>
                            <li>• Click "Upload Document" and select your files</li>
                            <li>• Add cover messages to explain documents</li>
                            <li>• Set priority levels for urgent items</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-[#003366] mb-2">3. Add Conveyancer</h4>
                          <ul className="text-sm text-gray-700 space-y-1">
                            <li>• Review the list of recommended conveyancers</li>
                            <li>• Select your chosen legal representative</li>
                            <li>• Confirm appointment and share contact details</li>
                            <li>• Your conveyancer will then have access to the platform</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-[#003366] mb-2">4. Monitoring Progress</h4>
                          <ul className="text-sm text-gray-700 space-y-1">
                            <li>• Check the progress bar regularly</li>
                            <li>• Review notifications for updates</li>
                            <li>• Download and review documents sent to you</li>
                            <li>• Respond to any requests promptly</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-xl text-[#003366] flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        Communication
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-gray-700">The platform provides different communication channels depending on your transaction stage:</p>
                        
                        <div>
                          <h4 className="font-semibold text-[#003366] mb-2">Early Stages</h4>
                          <div className="bg-blue-50 p-3 rounded-md">
                            <p className="text-sm text-gray-700">From <strong>Offer Accepted</strong> to <strong>Add Conveyancer</strong>, you'll have direct chat with your estate agent.</p>
                          </div>
                          <div className="mt-3 text-sm text-gray-700">
                            <p className="mb-2">Chatting with Your Estate Agent:</p>
                            <ul className="space-y-1 ml-4">
                              <li>• Look for the chat bubble in early stages</li>
                              <li>• Type your message and press Enter</li>
                              <li>• You'll see when they've read it</li>
                            </ul>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-[#003366] mb-2">Later Stages</h4>
                          <div className="bg-purple-50 p-3 rounded-md">
                            <p className="text-sm text-gray-700">After appointing a conveyancer, communication will be handled through your legal representative.</p>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 p-3 rounded-md">
                          <p className="text-sm text-gray-700 italic">All chats are saved and synchronized across your devices for your reference.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-xl text-[#003366] flex items-center gap-2">
                        <Lightbulb className="h-5 w-5" />
                        Best Practices
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="bg-green-100 p-2 rounded-full">
                            <Upload className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-800">Document Management</h4>
                            <p className="text-sm text-gray-700">Upload documents promptly to avoid delays in your transaction.</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <div className="bg-blue-100 p-2 rounded-full">
                            <Bell className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-800">Stay Informed</h4>
                            <p className="text-sm text-gray-700">Set email notifications for important updates to never miss critical information.</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <div className="bg-amber-100 p-2 rounded-full">
                            <FileText className="h-5 w-5 text-amber-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-800">Document Review</h4>
                            <p className="text-sm text-gray-700">Review all documents thoroughly before approving or signing them.</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <div className="bg-purple-100 p-2 rounded-full">
                            <HelpCircle className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-800">Ask Questions</h4>
                            <p className="text-sm text-gray-700">If anything is unclear, ask questions through the chat system immediately.</p>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 p-3 rounded-md mt-3">
                          <p className="text-sm text-gray-700 font-medium">Daily Habit Tip:</p>
                          <p className="text-sm text-gray-600">Log in for a quick 2-minute morning check to stay on top of your transaction.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Other tab contents would follow the same pattern */}
              <TabsContent value="estate-agent" className="space-y-6 animate-in fade-in-50 duration-500">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-[#003366] mb-4">🏢 Estate Agent Guide</h2>
                  <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                    Manage multiple transactions efficiently and professionally
                  </p>
                </div>
                
                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-xl text-[#003366] flex items-center gap-2">
                        <Building className="h-5 w-5" />
                        Your Dashboard
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 mb-4">Your estate agent dashboard shows:</p>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <strong>Portfolio Value:</strong> Total value of properties under management (£15.2M+)
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <strong>Active Transactions:</strong> Number of ongoing property sales
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <strong>Recent Offers:</strong> Latest offers received
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <strong>Viewings This Week:</strong> Scheduled property viewings
                        </li>
                      </ul>
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600 font-medium">Your First Day Checklist:</p>
                        <ul className="mt-2 space-y-1 text-sm">
                          <li className="flex items-center">
                            <div className="w-5 h-5 border border-green-300 rounded flex-shrink-0 mr-2"></div>
                            <span>Review your portfolio value</span>
                          </li>
                          <li className="flex items-center">
                            <div className="w-5 h-5 border border-green-300 rounded flex-shrink-0 mr-2"></div>
                            <span>Check all active transactions</span>
                          </li>
                          <li className="flex items-center">
                            <div className="w-5 h-5 border border-green-300 rounded flex-shrink-0 mr-2"></div>
                            <span>Respond to any buyer messages</span>
                          </li>
                          <li className="flex items-center">
                            <div className="w-5 h-5 border border-green-300 rounded flex-shrink-0 mr-2"></div>
                            <span>Navigate between different properties</span>
                          </li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-xl text-[#003366] flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Key Features
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-[#003366] mb-2">1. Transaction Management</h4>
                          <ul className="text-sm text-gray-700 space-y-1">
                            <li>• <strong>Overview:</strong> See all active transactions at a glance</li>
                            <li>• <strong>Stage Tracking:</strong> Monitor where each transaction stands</li>
                            <li>• <strong>Priority Alerts:</strong> Identify transactions needing attention</li>
                            <li>• <strong>Multi-property View:</strong> Manage multiple sales simultaneously</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-[#003366] mb-2">2. Offer Management</h4>
                          <ul className="text-sm text-gray-700 space-y-1">
                            <li>• Review and process new offers</li>
                            <li>• Coordinate offer acceptance</li>
                            <li>• Track offer progression</li>
                            <li>• Manage offer negotiations</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-[#003366] mb-2">3. Communication Hub</h4>
                          <ul className="text-sm text-gray-700 space-y-1">
                            <li>• <strong>Buyer Chat</strong> (Early stages)</li>
                            <li className="ml-4">- Available during Offer Accepted, Proof of Funds, and Add Conveyancer stages</li>
                            <li className="ml-4">- Answer buyer queries</li>
                            <li className="ml-4">- Provide guidance and support</li>
                            <li>• <strong>Professional Messenger</strong> (From Draft Contract onwards)</li>
                            <li className="ml-4">- Communicate with both conveyancers</li>
                            <li className="ml-4">- Coordinate between legal parties</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-xl text-[#003366] flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Document Coordination
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-gray-700">As an estate agent, you play a crucial role in document management:</p>
                        
                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700">Monitor document uploads from all parties</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700">Ensure timely submission of paperwork</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700">Flag missing or urgent documents</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700">Facilitate document sharing between parties</span>
                          </div>
                        </div>
                        
                        <div className="bg-green-50 p-3 rounded-md">
                          <p className="text-sm text-gray-700 font-medium">Managing Multiple Properties:</p>
                          <ul className="mt-2 space-y-1 text-sm text-gray-700">
                            <li>• Your dashboard shows all active sales</li>
                            <li>• Click on any property to dive in</li>
                            <li>• Use filters to find specific transactions</li>
                            <li>• Priority flags help you focus</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-xl text-[#003366] flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Workflow Management
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-[#003366] mb-2">Daily Tasks</h4>
                          <ol className="text-sm text-gray-700 space-y-3">
                            <li>
                              <p className="font-medium">1. Morning Review:</p>
                              <ul className="ml-5 space-y-1">
                                <li>• Check overnight updates</li>
                                <li>• Review priority notifications</li>
                                <li>• Plan day's activities</li>
                              </ul>
                            </li>
                            <li>
                              <p className="font-medium">2. Transaction Monitoring:</p>
                              <ul className="ml-5 space-y-1">
                                <li>• Check progress on all active sales</li>
                                <li>• Identify any blockers</li>
                                <li>• Coordinate with relevant parties</li>
                              </ul>
                            </li>
                            <li>
                              <p className="font-medium">3. Communication Management:</p>
                              <ul className="ml-5 space-y-1">
                                <li>• Respond to buyer queries</li>
                                <li>• Liaise with conveyancers</li>
                                <li>• Update all parties on progress</li>
                              </ul>
                            </li>
                          </ol>
                        </div>
                        
                        <div className="bg-gray-50 p-3 rounded-md">
                          <p className="text-sm text-gray-700 font-medium">Best Practices:</p>
                          <ul className="mt-2 space-y-1 text-sm text-gray-700">
                            <li className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-1" /> Maintain regular communication with all parties
                            </li>
                            <li className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-1" /> Use priority flags for urgent matters
                            </li>
                            <li className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-1" /> Document all important decisions
                            </li>
                            <li className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-1" /> Proactively identify and resolve issues
                            </li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="buyer-conveyancer" className="space-y-6 animate-in fade-in-50 duration-500">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-[#003366] mb-4">⚖️ Buyer Conveyancer Guide</h2>
                  <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                    Professional legal guidance for property purchase transactions
                  </p>
                </div>
                
                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-xl text-[#003366] flex items-center gap-2">
                        <Scale className="h-5 w-5" />
                        Your Dashboard
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 mb-4">Your buyer conveyancer dashboard provides:</p>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                          <strong>Case Overview:</strong> All active property purchase cases
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                          <strong>Legal Milestones:</strong> Key stages in the conveyancing process
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                          <strong>Document Repository:</strong> All legal documents for each transaction
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                          <strong>Communication Hub:</strong> Secure messaging with all parties
                        </li>
                      </ul>
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600 font-medium">Case Management Features:</p>
                        <ul className="mt-2 space-y-1 text-sm">
                          <li className="flex items-center">
                            <div className="w-5 h-5 border border-purple-300 rounded flex-shrink-0 mr-2"></div>
                            <span>Filter cases by status or priority</span>
                          </li>
                          <li className="flex items-center">
                            <div className="w-5 h-5 border border-purple-300 rounded flex-shrink-0 mr-2"></div>
                            <span>Set reminders for critical deadlines</span>
                          </li>
                          <li className="flex items-center">
                            <div className="w-5 h-5 border border-purple-300 rounded flex-shrink-0 mr-2"></div>
                            <span>Generate progress reports for clients</span>
                          </li>
                          <li className="flex items-center">
                            <div className="w-5 h-5 border border-purple-300 rounded flex-shrink-0 mr-2"></div>
                            <span>Track billable hours and activities</span>
                          </li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-xl text-[#003366] flex items-center gap-2">
                        <ClipboardCheck className="h-5 w-5" />
                        Key Responsibilities
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-[#003366] mb-2">1. Initial Case Setup</h4>
                          <ul className="text-sm text-gray-700 space-y-1">
                            <li>• Accept client invitation through the platform</li>
                            <li>• Review property details and purchase price</li>
                            <li>• Confirm client identity verification</li>
                            <li>• Set up anti-money laundering checks</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-[#003366] mb-2">2. Searches & Due Diligence</h4>
                          <ul className="text-sm text-gray-700 space-y-1">
                            <li>• <strong>Order and review searches</strong>:</li>
                            <li className="ml-4">- Local authority searches</li>
                            <li className="ml-4">- Environmental searches</li>
                            <li className="ml-4">- Water and drainage searches</li>
                            <li>• Upload search results to the platform</li>
                            <li>• Flag any issues requiring attention</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-[#003366] mb-2">3. Contract Review</h4>
                          <ul className="text-sm text-gray-700 space-y-1">
                            <li>• Review draft contract from seller's conveyancer</li>
                            <li>• Raise and track enquiries</li>
                            <li>• Negotiate contract terms as needed</li>
                            <li>• Prepare contract report for buyer</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-[#003366] mb-2">4. Exchange & Completion</h4>
                          <ul className="text-sm text-gray-700 space-y-1">
                            <li>• Prepare for exchange of contracts</li>
                            <li>• Confirm deposit funds are in place</li>
                            <li>• Arrange completion date with all parties</li>
                            <li>• Process completion and register title</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-xl text-[#003366] flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Document Management
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-gray-700">The platform streamlines document handling throughout the conveyancing process:</p>
                        
                        <div>
                          <h4 className="font-semibold text-[#003366] mb-2">Required Documents</h4>
                          <div className="bg-purple-50 p-3 rounded-md">
                            <ul className="space-y-1 text-sm text-gray-700">
                              <li className="flex items-center">
                                <CheckCircle className="h-4 w-4 text-purple-500 mr-2" />
                                <span>Draft contract and title documents</span>
                              </li>
                              <li className="flex items-center">
                                <CheckCircle className="h-4 w-4 text-purple-500 mr-2" />
                                <span>Property information forms</span>
                              </li>
                              <li className="flex items-center">
                                <CheckCircle className="h-4 w-4 text-purple-500 mr-2" />
                                <span>Fittings and contents form</span>
                              </li>
                              <li className="flex items-center">
                                <CheckCircle className="h-4 w-4 text-purple-500 mr-2" />
                                <span>Search results and reports</span>
                              </li>
                              <li className="flex items-center">
                                <CheckCircle className="h-4 w-4 text-purple-500 mr-2" />
                                <span>Mortgage offer and instructions</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-[#003366] mb-2">Document Features</h4>
                          <ul className="text-sm text-gray-700 space-y-1">
                            <li>• <strong>Version Control:</strong> Track document revisions</li>
                            <li>• <strong>Digital Signatures:</strong> Secure electronic signing</li>
                            <li>• <strong>Document Annotations:</strong> Add notes and comments</li>
                            <li>• <strong>Automated Notifications:</strong> Alert when documents need review</li>
                          </ul>
                        </div>
                        
                        <div className="bg-gray-50 p-3 rounded-md">
                          <p className="text-sm text-gray-700 italic">All documents are securely stored and accessible to authorized parties only.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-xl text-[#003366] flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        Professional Communication
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-[#003366] mb-2">Communication Tools</h4>
                          <ul className="text-sm text-gray-700 space-y-2">
                            <li className="flex items-start gap-2">
                              <MessageCircle className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                              <div>
                                <strong>Client Messaging:</strong>
                                <p className="text-xs">Direct, secure communication with your buyer client</p>
                              </div>
                            </li>
                            <li className="flex items-start gap-2">
                              <Users className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                              <div>
                                <strong>Professional Network:</strong>
                                <p className="text-xs">Communicate with seller's conveyancer and estate agent</p>
                              </div>
                            </li>
                            <li className="flex items-start gap-2">
                              <FileQuestion className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                              <div>
                                <strong>Enquiry Tracker:</strong>
                                <p className="text-xs">Raise, track and resolve legal enquiries</p>
                              </div>
                            </li>
                            <li className="flex items-start gap-2">
                              <Bell className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                              <div>
                                <strong>Notifications:</strong>
                                <p className="text-xs">Automatic alerts for critical updates</p>
                              </div>
                            </li>
                          </ul>
                        </div>
                        
                        <div className="bg-purple-50 p-3 rounded-md">
                          <p className="text-sm text-gray-700 font-medium">Best Practice Tips:</p>
                          <ul className="mt-2 space-y-1 text-sm text-gray-700">
                            <li>• Respond to enquiries within 48 hours</li>
                            <li>• Use the platform for all transaction communications</li>
                            <li>• Keep your client updated on progress weekly</li>
                            <li>• Document all advice and decisions for future reference</li>
                          </ul>
                        </div>
                        
                        <div className="bg-gray-50 p-3 rounded-md">
                          <p className="text-sm text-gray-700 font-medium">Professional Standards:</p>
                          <p className="text-sm text-gray-600">All communications are recorded and may be subject to regulatory review. Maintain professional standards at all times.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="seller-conveyancer" className="space-y-6 animate-in fade-in-50 duration-500">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-[#003366] mb-4">⚖️ Seller Conveyancer Guide</h2>
                  <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                    Professional legal guidance for property sale transactions
                  </p>
                </div>
                
                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-xl text-[#003366] flex items-center gap-2">
                        <Scale className="h-5 w-5" />
                        Your Dashboard
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 mb-4">Your seller conveyancer dashboard provides:</p>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                          <strong>Active Sales:</strong> All property sales you're handling
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                          <strong>Legal Milestones:</strong> Progress through conveyancing stages
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                          <strong>Document Repository:</strong> Centralized storage for all legal documents
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                          <strong>Enquiry Management:</strong> Track and respond to buyer enquiries
                        </li>
                      </ul>
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600 font-medium">Case Management Features:</p>
                        <ul className="mt-2 space-y-1 text-sm">
                          <li className="flex items-center">
                            <div className="w-5 h-5 border border-amber-300 rounded flex-shrink-0 mr-2"></div>
                            <span>Sort cases by completion date</span>
                          </li>
                          <li className="flex items-center">
                            <div className="w-5 h-5 border border-amber-300 rounded flex-shrink-0 mr-2"></div>
                            <span>Flag urgent matters requiring attention</span>
                          </li>
                          <li className="flex items-center">
                            <div className="w-5 h-5 border border-amber-300 rounded flex-shrink-0 mr-2"></div>
                            <span>Track billable hours per transaction</span>
                          </li>
                          <li className="flex items-center">
                            <div className="w-5 h-5 border border-amber-300 rounded flex-shrink-0 mr-2"></div>
                            <span>Generate client progress reports</span>
                          </li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-xl text-[#003366] flex items-center gap-2">
                        <ClipboardCheck className="h-5 w-5" />
                        Key Responsibilities
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-[#003366] mb-2">1. Initial Setup</h4>
                          <ul className="text-sm text-gray-700 space-y-1">
                            <li>• Accept client invitation through platform</li>
                            <li>• Review property details and sale price</li>
                            <li>• Complete client identity verification</li>
                            <li>• Prepare initial documentation</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-[#003366] mb-2">2. Title & Documentation</h4>
                          <ul className="text-sm text-gray-700 space-y-1">
                            <li>• <strong>Prepare and upload key documents</strong>:</li>
                            <li className="ml-4">- Title deeds and register</li>
                            <li className="ml-4">- Property information form</li>
                            <li className="ml-4">- Fittings and contents form</li>
                            <li>• Draft contract for sale</li>
                            <li>• Prepare leasehold information (if applicable)</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-[#003366] mb-2">3. Enquiry Management</h4>
                          <ul className="text-sm text-gray-700 space-y-1">
                            <li>• Respond to buyer's conveyancer enquiries</li>
                            <li>• Provide additional documentation as requested</li>
                            <li>• Resolve title issues or discrepancies</li>
                            <li>• Track all enquiries through the platform</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-[#003366] mb-2">4. Exchange & Completion</h4>
                          <ul className="text-sm text-gray-700 space-y-1">
                            <li>• Finalize contract terms</li>
                            <li>• Coordinate exchange of contracts</li>
                            <li>• Prepare completion statement</li>
                            <li>• Arrange transfer of funds and property</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-xl text-[#003366] flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Document Management
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-gray-700">The platform streamlines document handling throughout the sale process:</p>
                        
                        <div>
                          <h4 className="font-semibold text-[#003366] mb-2">Required Documents</h4>
                          <div className="bg-amber-50 p-3 rounded-md">
                            <ul className="space-y-1 text-sm text-gray-700">
                              <li className="flex items-center">
                                <CheckCircle className="h-4 w-4 text-amber-500 mr-2" />
                                <span>Title information and plan</span>
                              </li>
                              <li className="flex items-center">
                                <CheckCircle className="h-4 w-4 text-amber-500 mr-2" />
                                <span>Property information form (TA6)</span>
                              </li>
                              <li className="flex items-center">
                                <CheckCircle className="h-4 w-4 text-amber-500 mr-2" />
                                <span>Fittings and contents form (TA10)</span>
                              </li>
                              <li className="flex items-center">
                                <CheckCircle className="h-4 w-4 text-amber-500 mr-2" />
                                <span>Energy Performance Certificate</span>
                              </li>
                              <li className="flex items-center">
                                <CheckCircle className="h-4 w-4 text-amber-500 mr-2" />
                                <span>Planning permissions and building regulations</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-[#003366] mb-2">Document Features</h4>
                          <ul className="text-sm text-gray-700 space-y-1">
                            <li>• <strong>Secure Sharing:</strong> Controlled access to sensitive documents</li>
                            <li>• <strong>Audit Trail:</strong> Track document views and downloads</li>
                            <li>• <strong>Version Control:</strong> Maintain document history</li>
                            <li>• <strong>Template Library:</strong> Access standard legal templates</li>
                          </ul>
                        </div>
                        
                        <div className="bg-gray-50 p-3 rounded-md">
                          <p className="text-sm text-gray-700 italic">All documents are encrypted and comply with data protection regulations.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-xl text-[#003366] flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        Professional Communication
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-[#003366] mb-2">Communication Tools</h4>
                          <ul className="text-sm text-gray-700 space-y-2">
                            <li className="flex items-start gap-2">
                              <MessageCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                              <div>
                                <strong>Client Messaging:</strong>
                                <p className="text-xs">Direct communication with your seller client</p>
                              </div>
                            </li>
                            <li className="flex items-start gap-2">
                              <Users className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                              <div>
                                <strong>Professional Network:</strong>
                                <p className="text-xs">Secure channel with buyer's conveyancer and estate agent</p>
                              </div>
                            </li>
                            <li className="flex items-start gap-2">
                              <FileQuestion className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                              <div>
                                <strong>Enquiry Management:</strong>
                                <p className="text-xs">Organized system for tracking and responding to enquiries</p>
                              </div>
                            </li>
                            <li className="flex items-start gap-2">
                              <Bell className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                              <div>
                                <strong>Deadline Alerts:</strong>
                                <p className="text-xs">Reminders for important dates and actions</p>
                              </div>
                            </li>
                          </ul>
                        </div>
                        
                        <div className="bg-amber-50 p-3 rounded-md">
                          <p className="text-sm text-gray-700 font-medium">Best Practice Tips:</p>
                          <ul className="mt-2 space-y-1 text-sm text-gray-700">
                            <li>• Respond to all enquiries within 3 working days</li>
                            <li>• Keep communication professional and documented</li>
                            <li>• Update your client weekly on progress</li>
                            <li>• Flag any potential delays immediately</li>
                          </ul>
                        </div>
                        
                        <div className="bg-gray-50 p-3 rounded-md">
                          <p className="text-sm text-gray-700 font-medium">Legal Compliance:</p>
                          <p className="text-sm text-gray-600">All communications are recorded and may be subject to disclosure. Maintain professional standards and client confidentiality at all times.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="common-features" className="space-y-6 animate-in fade-in-50 duration-500">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-[#003366] mb-4">🔧 Common Features</h2>
                  <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                    Essential tools and features available to all platform users
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-xl text-[#003366] flex items-center gap-2">
                        <Upload className="h-5 w-5" />
                        Document System
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-[#003366] mb-2">Uploading Documents</h4>
                          <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                            <li>Click "Upload Document" button</li>
                            <li>Select file(s) from your device</li>
                            <li>Choose recipient role</li>
                            <li>Add cover message (optional but recommended)</li>
                            <li>Set priority level (Standard/Urgent/Critical)</li>
                            <li>Add deadline if applicable</li>
                            <li>Click "Send Document"</li>
                          </ol>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-xl text-[#003366] flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        Communication Tools
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-[#003366] mb-2">Features</h4>
                          <ul className="text-sm text-gray-700 space-y-1">
                            <li>• <strong>Real-time Messaging:</strong> Instant message delivery</li>
                            <li>• <strong>Status Indicators:</strong> See who's online</li>
                            <li>• <strong>Message History:</strong> Full conversation archive</li>
                            <li>• <strong>Cross-tab Sync:</strong> Same conversation on all devices</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  )
}