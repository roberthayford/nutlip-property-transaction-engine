import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, Building, Users, Scale, BookOpen, X, CheckCircle2, MessageSquareWarning } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7F9FC] to-[#EDF2F7]">
      {/* Hero Section with Logo */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12 flex flex-col items-center">
          <div className="mb-6">
            <Image 
              src="/nutlip_logo.webp" 
              alt="Nutlip Logo" 
              width={200} 
              height={80} 
              priority
              className="h-auto"
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#003366] mb-4">Transform Property Transactions Forever</h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto">
            One Platform. All Stakeholders. Total Transparency.
          </p>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto mt-6">
            Nutlip brings together buyers, sellers, estate agents, and conveyancers in a single, powerful platform that transforms weeks of confusion into a smooth, transparent journey.
          </p>
        </div>

        {/* Pain Points Section */}
        <div className="max-w-5xl mx-auto mb-16 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[#003366] mb-6 text-center">The Current Reality</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <div className="rounded-full bg-[#E53E3E]/10 p-2 mr-4 flex-shrink-0">
                <X className="h-5 w-5 text-[#E53E3E]" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">Fragmented Communication</p>
                <p className="text-gray-600">Endless email chains and phone tag</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="rounded-full bg-[#E53E3E]/10 p-2 mr-4 flex-shrink-0">
                <X className="h-5 w-5 text-[#E53E3E]" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">Zero Visibility</p>
                <p className="text-gray-600">Buyers left in the dark about progress</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="rounded-full bg-[#E53E3E]/10 p-2 mr-4 flex-shrink-0">
                <X className="h-5 w-5 text-[#E53E3E]" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">Manual Processes</p>
                <p className="text-gray-600">Documents lost, delayed, or forgotten</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="rounded-full bg-[#E53E3E]/10 p-2 mr-4 flex-shrink-0">
                <X className="h-5 w-5 text-[#E53E3E]" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">Coordination Chaos</p>
                <p className="text-gray-600">Multiple parties working in isolation</p>
              </div>
            </div>
          </div>
        </div>

        {/* Solution Section */}
        <div className="max-w-6xl mx-auto mb-16 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[#003366] mb-6 text-center">The Nutlip Advantage</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <div className="rounded-full bg-[#10B981]/10 p-2 mr-4 flex-shrink-0">
                <CheckCircle2 className="h-5 w-5 text-[#10B981]" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">Unifies all stakeholders</p>
                <p className="text-gray-600">In a real-time environment</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="rounded-full bg-[#10B981]/10 p-2 mr-4 flex-shrink-0">
                <CheckCircle2 className="h-5 w-5 text-[#10B981]" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">Automates document workflows</p>
                <p className="text-gray-600">With intelligent routing</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="rounded-full bg-[#10B981]/10 p-2 mr-4 flex-shrink-0">
                <CheckCircle2 className="h-5 w-5 text-[#10B981]" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">Provides complete transparency</p>
                <p className="text-gray-600">Through visual progress tracking</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="rounded-full bg-[#10B981]/10 p-2 mr-4 flex-shrink-0">
                <CheckCircle2 className="h-5 w-5 text-[#10B981]" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">Enables secure communication</p>
                <p className="text-gray-600">Between all parties</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stakeholder Benefits */}
        <div className="max-w-8xl mx-auto mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-[#003366] mb-8 text-center">Choose Your Role</h2>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 container mx-auto">
            {/* Buyer Dashboard Card */}
            <Link href="/buyer" className="block">
              <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-gray-200 hover:border-[#4299E1] hover:translate-y-[-5px]">
                <CardHeader className="text-center pt-8 pb-4">
                  <div className="mx-auto rounded-full bg-[#4299E1]/10 p-4 mb-4 w-20 h-20 flex items-center justify-center">
                    <User className="h-12 w-12 text-[#4299E1]" />
                  </div>
                  <CardTitle className="text-2xl text-[#003366]">Buyer Dashboard</CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <p className="text-gray-700 text-center mb-6 text-base leading-relaxed">
                    Complete visibility of your transaction. Peace of mind through every step.
                  </p>
                  <Button className="w-full bg-[#E53E3E] hover:bg-[#DC2626] text-white border-2 border-transparent hover:border-[#4299E1]/30">
                    Access Dashboard
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* Estate Agent Dashboard Card */}
            <Link href="/estate-agent" className="block">
              <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-gray-200 hover:border-[#10B981] hover:translate-y-[-5px]">
                <CardHeader className="text-center pt-8 pb-4">
                  <div className="mx-auto rounded-full bg-[#10B981]/10 p-4 mb-4 w-20 h-20 flex items-center justify-center">
                    <Building className="h-12 w-12 text-[#10B981]" />
                  </div>
                  <CardTitle className="text-2xl text-[#003366]">Estate Agent Dashboard</CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <p className="text-gray-700 text-center mb-6 text-base leading-relaxed">
                    Manage £15M+ in property with ease. Handle 50+ sales simultaneously.
                  </p>
                  <Button className="w-full bg-[#E53E3E] hover:bg-[#DC2626] text-white border-2 border-transparent hover:border-[#10B981]/30">
                    Access Dashboard
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* Buyer Conveyancer Card */}
            <Link href="/buyer-conveyancer" className="block">
              <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-gray-200 hover:border-[#8B5CF6] hover:translate-y-[-5px]">
                <CardHeader className="text-center pt-8 pb-4">
                  <div className="mx-auto rounded-full bg-[#8B5CF6]/10 p-4 mb-4 w-20 h-20 flex items-center justify-center">
                    <Scale className="h-12 w-12 text-[#8B5CF6]" />
                  </div>
                  <CardTitle className="text-2xl text-[#003366]">Buyer Conveyancer</CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <p className="text-gray-700 text-center mb-6 text-base leading-relaxed">
                    Smart document management with priority handling. Never miss a deadline again.
                  </p>
                  <Button className="w-full bg-[#E53E3E] hover:bg-[#DC2626] text-white border-2 border-transparent hover:border-[#8B5CF6]/30">
                    Access Dashboard
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* Seller Conveyancer Card */}
            <Link href="/seller-conveyancer" className="block">
              <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-gray-200 hover:border-[#F59E0B] hover:translate-y-[-5px]">
                <CardHeader className="text-center pt-8 pb-4">
                  <div className="mx-auto rounded-full bg-[#F59E0B]/10 p-4 mb-4 w-20 h-20 flex items-center justify-center">
                    <Users className="h-12 w-12 text-[#F59E0B]" />
                  </div>
                  <CardTitle className="text-2xl text-[#003366]">Seller Conveyancer</CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <p className="text-gray-700 text-center mb-6 text-base leading-relaxed">
                    Smart document management with priority handling. Never miss a deadline again.
                  </p>
                  <Button className="w-full bg-[#E53E3E] hover:bg-[#DC2626] text-white border-2 border-transparent hover:border-[#F59E0B]/30">
                    Access Dashboard
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Closing Statement */}
        <div className="max-w-4xl mx-auto mb-12 text-center">
          <p className="text-xl text-gray-800 font-medium mb-3">
            Nutlip isn't just another PropTech platform. It's a complete reimagining of how property transactions should work.
          </p>
          <p className="text-lg text-[#003366] font-semibold">
            Where Property Transactions Just Work™️
          </p>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-8">
            Select your role to access your personalised dashboard and transaction management tools.
          </p>
          
          {/* Getting Started Button */}
          <div className="max-w-md mx-auto">
            <Link href="/guide">
              <Button className="w-full bg-[#003366] hover:bg-[#002244] text-white text-lg py-6 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-[#4299E1]/30">
                <BookOpen className="mr-3 h-6 w-6" />
                Getting Started Guide
              </Button>
            </Link>
            <p className="text-sm text-gray-500 mt-3">
              New to Nutlip? Learn how to use the platform effectively
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
