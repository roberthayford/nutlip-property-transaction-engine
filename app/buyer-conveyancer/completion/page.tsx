"use client"

import { useState, useEffect } from "react"
import TransactionLayout from "@/components/transaction-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useRealTime } from "@/contexts/real-time-context"
import {
  CheckCircle,
  Clock,
  PoundSterling,
  FileText,
  Download,
  Send,
  Building,
  Key,
  Users,
  Home,
  Shield,
  Calendar,
} from "lucide-react"

interface CompletionTask {
  id: string
  title: string
  completed: boolean
  timestamp?: string
  required: boolean
}

export default function BuyerConveyancerCompletionPage() {
  const { toast } = useToast()
  const { sendUpdate } = useRealTime()

  const [completionTasks, setCompletionTasks] = useState<CompletionTask[]>([
    {
      id: "funds-transfer",
      title: "Transfer completion funds to seller conveyancer",
      completed: true,
      timestamp: "09:30 AM",
      required: true,
    },
    {
      id: "mortgage-funds",
      title: "Confirm mortgage funds received",
      completed: true,
      timestamp: "09:15 AM",
      required: true,
    },
    {
      id: "final-searches",
      title: "Complete final pre-completion searches",
      completed: true,
      timestamp: "09:00 AM",
      required: true,
    },
    {
      id: "completion-statement",
      title: "Send completion statement to buyer",
      completed: false,
      required: true,
    },
    {
      id: "keys-arranged",
      title: "Arrange key collection with estate agent",
      completed: false,
      required: true,
    },
    {
      id: "land-registry",
      title: "Submit Land Registry application",
      completed: false,
      required: true,
    },
    {
      id: "stamp-duty",
      title: "Submit Stamp Duty Land Tax return",
      completed: false,
      required: true,
    },
  ])

  const [notes, setNotes] = useState("")
  const [completionTime] = useState("10:30 AM")
  const [completionDate] = useState("April 15, 2024")

  useEffect(() => {
    const savedTasks = localStorage.getItem("buyer-conveyancer-completion-tasks")
    const savedNotes = localStorage.getItem("buyer-conveyancer-completion-notes")

    if (savedTasks) {
      setCompletionTasks(JSON.parse(savedTasks))
    }
    if (savedNotes) {
      setNotes(savedNotes)
    }
  }, [])

  const toggleTask = (taskId: string) => {
    const updatedTasks = completionTasks.map((task) => {
      if (task.id === taskId) {
        const completed = !task.completed
        return {
          ...task,
          completed,
          timestamp: completed ? new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : undefined,
        }
      }
      return task
    })

    setCompletionTasks(updatedTasks)
    localStorage.setItem("buyer-conveyancer-completion-tasks", JSON.stringify(updatedTasks))

    const task = completionTasks.find((t) => t.id === taskId)

    if (task && !task.completed) {
      sendUpdate({
        type: "stage_completed",
        stage: "completion",
        role: "buyer-conveyancer",
        title: "Completion Task Completed",
        description: `${task.title} has been completed`,
        data: { taskId, taskTitle: task.title },
      })
    }

    toast({
      title: task?.completed ? "Task Incomplete" : "Task Completed",
      description: `${task?.title} ${task?.completed ? "marked as incomplete" : "completed successfully"}`,
    })
  }

  const saveNotes = () => {
    localStorage.setItem("buyer-conveyancer-completion-notes", notes)
    toast({
      title: "Notes Saved",
      description: "Completion notes have been saved successfully.",
    })
  }

  const sendCompletionStatement = () => {
    sendUpdate({
      type: "document_uploaded",
      stage: "completion",
      role: "buyer-conveyancer",
      title: "Completion Statement Sent",
      description: "Final completion statement sent to buyer client",
    })

    toast({
      title: "Statement Sent",
      description: "Completion statement has been sent to the buyer.",
    })
  }

  const completedTasks = completionTasks.filter((task) => task.completed).length
  const totalTasks = completionTasks.length
  const progressPercentage = Math.round((completedTasks / totalTasks) * 100)

  return (
    <TransactionLayout currentStage="completion" userRole="buyer-conveyancer">
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
          <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-green-800">Property Completion</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Managing completion process for your buyer client.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          <Card className="lg:col-span-2 xl:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                <span>Completion Checklist</span>
                <Badge variant="outline" className="ml-auto text-xs">
                  {completedTasks}/{totalTasks} Complete
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>

              <div className="space-y-2 sm:space-y-3">
                {completionTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start space-x-3 p-2 sm:p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`mt-0.5 h-4 w-4 sm:h-5 sm:w-5 rounded border-2 flex items-center justify-center transition-colors ${
                        task.completed
                          ? "bg-green-600 border-green-600 text-white"
                          : "border-gray-300 hover:border-green-600"
                      }`}
                    >
                      {task.completed && <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <span
                          className={`text-sm sm:text-base font-medium ${
                            task.completed ? "line-through text-muted-foreground" : ""
                          }`}
                        >
                          {task.title}
                        </span>
                        <div className="flex items-center space-x-2 mt-1 sm:mt-0">
                          {task.required && (
                            <Badge variant="secondary" className="text-xs">
                              Required
                            </Badge>
                          )}
                          {task.timestamp && (
                            <span className="text-xs text-muted-foreground flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {task.timestamp}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                <Home className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                <span>Property Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div>
                <h3 className="font-semibold text-base sm:text-lg">123 Example Street</h3>
                <p className="text-sm text-muted-foreground">London, SW1A 1AA</p>
              </div>
              <div className="flex flex-wrap gap-2">
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
              <div className="pt-3 border-t space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Purchase Price:</span>
                  <span className="font-semibold">£450,000</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Completion Date:</span>
                  <span className="font-semibold">{completionDate}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Completion Time:</span>
                  <span className="font-semibold">{completionTime}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                <PoundSterling className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                <span>Financial Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Purchase Price:</span>
                  <span className="font-semibold">£450,000.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Deposit Paid:</span>
                  <span className="font-semibold">£45,000.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mortgage Amount:</span>
                  <span className="font-semibold">£360,000.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Legal Fees:</span>
                  <span className="font-semibold">£1,200.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Stamp Duty:</span>
                  <span className="font-semibold">£11,250.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Search Fees:</span>
                  <span className="font-semibold">£350.00</span>
                </div>
                <div className="flex justify-between pt-2 border-t font-bold text-green-600">
                  <span>Total Completion Funds:</span>
                  <span>£417,800.00</span>
                </div>
              </div>

              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Funds Secured</span>
                </div>
                <p className="text-xs text-green-700 mt-1">All completion funds confirmed and transferred.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                <span>Key Parties</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="p-2 sm:p-3 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-medium text-sm">Buyer Client</span>
                      <p className="text-xs text-muted-foreground">John Smith</p>
                      <p className="text-xs text-muted-foreground">john.smith@email.com</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800 text-xs">Ready</Badge>
                  </div>
                </div>

                <div className="p-2 sm:p-3 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-medium text-sm">Seller Conveyancer</span>
                      <p className="text-xs text-muted-foreground">Johnson Legal</p>
                      <p className="text-xs text-muted-foreground">completion@johnsonlegal.co.uk</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800 text-xs">Confirmed</Badge>
                  </div>
                </div>

                <div className="p-2 sm:p-3 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-medium text-sm">Estate Agent</span>
                      <p className="text-xs text-muted-foreground">Prime Properties</p>
                      <p className="text-xs text-muted-foreground">keys@primeproperties.co.uk</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800 text-xs">Keys Ready</Badge>
                  </div>
                </div>

                <div className="p-2 sm:p-3 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-medium text-sm">Mortgage Lender</span>
                      <p className="text-xs text-muted-foreground">First National Bank</p>
                      <p className="text-xs text-muted-foreground">Funds transferred</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800 text-xs">Complete</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 xl:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                <Key className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                <span>Post-Completion Tasks</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
                <div className="p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Building className="h-4 w-4 text-blue-600" />
                    <h4 className="font-semibold text-blue-800 text-sm">Land Registry</h4>
                  </div>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• Submit AP1 application form</li>
                    <li>• Register new ownership</li>
                    <li>• Update title deeds</li>
                    <li>• Send title documents to client</li>
                  </ul>
                </div>

                <div className="p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="h-4 w-4 text-green-600" />
                    <h4 className="font-semibold text-green-800 text-sm">HMRC Submissions</h4>
                  </div>
                  <ul className="text-xs text-green-700 space-y-1">
                    <li>• Submit SDLT return</li>
                    <li>• Pay stamp duty liability</li>
                    <li>• Obtain SDLT certificate</li>
                    <li>• File with Land Registry</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="completion-notes" className="text-sm font-medium">
                  Completion Notes
                </Label>
                <Textarea
                  id="completion-notes"
                  placeholder="Add any notes about the completion process..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[80px] text-sm"
                />
                <Button onClick={saveNotes} variant="outline" size="sm" className="w-full sm:w-auto bg-transparent">
                  Save Notes
                </Button>
              </div>

              <div className="grid gap-2 sm:gap-3 grid-cols-1 sm:grid-cols-3">
                <Button onClick={sendCompletionStatement} className="w-full text-xs sm:text-sm">
                  <Send className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  Send Statement
                </Button>
                <Button variant="outline" className="w-full text-xs sm:text-sm bg-transparent">
                  <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  Download Pack
                </Button>
                <Button variant="outline" className="w-full text-xs sm:text-sm bg-transparent">
                  <FileText className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TransactionLayout>
  )
}
