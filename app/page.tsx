import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, Building, Users, Scale } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-grey-900 mb-4">Nutlip Property Transaction Engine</h1>
          <p className="text-xl text-grey-600 max-w-2xl mx-auto">
            Streamlined property transaction management for all parties involved in the buying and selling process.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
          <Link href="/buyer">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-300">
              <CardHeader className="text-center">
                <User className="h-12 w-12 mx-auto text-blue-600 mb-4" />
                <CardTitle className="text-blue-800">Buyer Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-grey-600 text-center mb-4">
                  Track your property purchase journey from offer to completion.
                </p>
                <Button className="w-full">Access Dashboard</Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/estate-agent">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-green-300">
              <CardHeader className="text-center">
                <Building className="h-12 w-12 mx-auto text-green-600 mb-4" />
                <CardTitle className="text-green-800">Estate Agent Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-grey-600 text-center mb-4">
                  Manage property sales and coordinate between buyers and sellers.
                </p>
                <Button className="w-full bg-green-600 hover:bg-green-700">Access Dashboard</Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/buyer-conveyancer">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-purple-300">
              <CardHeader className="text-center">
                <Scale className="h-12 w-12 mx-auto text-purple-600 mb-4" />
                <CardTitle className="text-purple-800">Buyer Conveyancer</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-grey-600 text-center mb-4">
                  Handle legal aspects of property purchases for your clients.
                </p>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">Access Dashboard</Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/seller-conveyancer">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-orange-300">
              <CardHeader className="text-center">
                <Users className="h-12 w-12 mx-auto text-orange-600 mb-4" />
                <CardTitle className="text-orange-800">Seller Conveyancer</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-grey-600 text-center mb-4">
                  Manage legal requirements for property sales and transactions.
                </p>
                <Button className="w-full bg-orange-600 hover:bg-orange-700">Access Dashboard</Button>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="text-center mt-12">
          <p className="text-grey-600">
            Select your role to access your personalised dashboard and transaction management tools.
          </p>
        </div>
      </div>
    </div>
  )
}
