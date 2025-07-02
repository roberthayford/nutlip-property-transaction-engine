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
  Home,
  Key,
  Users,
  Heart,
  Camera,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Gift,
  Star,
} from "lucide-react"

interface MovingTask {
  id: string
  title: string
  completed: boolean
  timestamp?: string
  category: "essential" | "helpful" | "optional"
}

export default function BuyerCompletionPage() {
  const { toast } = useToast()
  const { sendUpdate } = useRealTime()

  const [movingTasks, setMovingTasks] = useState<MovingTask[]>([
    {
      id: "keys-collected",
      title: "Collect keys from estate agent",
      completed: false,
      category: "essential",
    },
    {
      id: "utilities-check",
      title: "Check all utilities are working",
      completed: false,
      category: "essential",
    },
    {
      id: "security-check",
      title: "Test all locks and security systems",
      completed: false,
      category: "essential",
    },
    {
      id: "meter-readings",
      title: "Take meter readings (gas, electricity, water)",
      completed: false,
      category: "essential",
    },
    {
      id: "address-change",
      title: "Update address with bank and important services",
      completed: false,
      category: "helpful",
    },
    {
      id: "neighbors-meet",
      title: "Introduce yourself to neighbors",
      completed: false,
      category: "optional",
    },
    {
      id: "local-services",
      title: "Find local shops, GP, and services",
      completed: false,
      category: "helpful",
    },
    {
      id: "celebration",
      title: "Celebrate your new home! 🎉",
      completed: false,
      category: "optional",
    },
  ])

  const [memories, setMemories] = useState("")
  const [completionTime] = useState("2:30 PM")
  const [completionDate] = useState("April 15, 2024")

  useEffect(() => {
    const savedTasks = localStorage.getItem("buyer-completion-tasks")
    const savedMemories = localStorage.getItem("buyer-completion-memories")

    if (savedTasks) {
      setMovingTasks(JSON.parse(savedTasks))
    }
    if (savedMemories) {
      setMemories(savedMemories)
    }
  }, [])

  const toggleTask = (taskId: string) => {
    const updatedTasks = movingTasks.map((task) => {
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

    setMovingTasks(updatedTasks)
    localStorage.setItem("buyer-completion-tasks", JSON.stringify(updatedTasks))

    const task = movingTasks.find((t) => t.id === taskId)

    if (task && !task.completed) {
      sendUpdate({
        type: "stage_completed",
        stage: "completion",
        role: "buyer",
        title: "Moving Task Completed",
        description: `${task.title} has been completed`,
        data: { taskId, taskTitle: task.title },
      })
    }

    toast({
      title: task?.completed ? "Task Incomplete" : "Task Completed! 🎉",
      description: `${task?.title} ${task?.completed ? "marked as incomplete" : "completed successfully"}`,
    })
  }

  const saveMemories = () => {
    localStorage.setItem("buyer-completion-memories", memories)
    toast({
      title: "Memories Saved! 💝",
      description: "Your completion day memories have been saved.",
    })
  }

  const completedTasks = movingTasks.filter((task) => task.completed).length
  const totalTasks = movingTasks.length
  const progressPercentage = Math.round((completedTasks / totalTasks) * 100)

  const getCategoryBadge = (category: MovingTask["category"]) => {
    switch (category) {
      case "essential":
        return (
          <Badge variant="destructive" className="text-xs">
            Essential
          </Badge>
        )
      case "helpful":
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800 border-blue-200 text-xs">
            Helpful
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="text-xs">
            Optional
          </Badge>
        )
    }
  }

  return (
    <TransactionLayout currentStage="completion" userRole="buyer">
      <div className="space-y-4 sm:space-y-6">
        <div className="text-center space-y-2 sm:space-y-3 p-4 sm:p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
          <div className="flex justify-center">
            <div className="flex items-center space-x-2">
              <Home className="h-8 w-8 sm:h-10 sm:w-10 text-green-600" />
              <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-red-500" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-green-800">Congratulations! 🎉</h1>
          <p className="text-base sm:text-lg text-green-700 font-medium">
            You are now the proud owner of your new home!
          </p>
          <p className="text-sm sm:text-base text-muted-foreground">
            Completion completed on {completionDate} at {completionTime}
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          <Card className="lg:col-span-2 xl:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                <span>Moving Day Checklist</span>
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
                {movingTasks.map((task) => (
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
                          {getCategoryBadge(task.category)}
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
                <span>Your New Home</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div>
                <h3 className="font-semibold text-base sm:text-lg">123 Example Street</h3>
                <p className="text-sm text-muted-foreground flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  London, SW1A 1AA
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-xs">
                  3 Bedrooms
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  2 Bathrooms
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  Garden
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  Parking
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
                  <span className="text-muted-foreground">Keys Collected:</span>
                  <span className="font-semibold">{completionTime}</span>
                </div>
              </div>

              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Key className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Welcome Home! 🏠</span>
                </div>
                <p className="text-xs text-green-700 mt-1">Your keys are ready for collection.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                <span>Important Contacts</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="p-2 sm:p-3 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-medium text-sm">Estate Agent</span>
                      <p className="text-xs text-muted-foreground">Sarah Johnson</p>
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground mt-1">
                        <Phone className="h-3 w-3" />
                        <span>020 7123 4567</span>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800 text-xs">Keys Ready</Badge>
                  </div>
                </div>

                <div className="p-2 sm:p-3 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-medium text-sm">Your Conveyancer</span>
                      <p className="text-xs text-muted-foreground">Smith & Partners</p>
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground mt-1">
                        <Mail className="h-3 w-3" />
                        <span>info@smithpartners.co.uk</span>
                      </div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800 text-xs">Available</Badge>
                  </div>
                </div>

                <div className="p-2 sm:p-3 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-medium text-sm">Emergency Services</span>
                      <p className="text-xs text-muted-foreground">Gas, Electric, Water</p>
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground mt-1">
                        <Phone className="h-3 w-3" />
                        <span>Emergency: 999</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      24/7
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                <Gift className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                <span>First Day Tips</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <Star className="h-4 w-4 text-blue-600" />
                    <h4 className="font-semibold text-blue-800 text-sm">Safety First</h4>
                  </div>
                  <p className="text-xs text-blue-700">
                    Test smoke alarms, locate the main water shut-off, and check all door locks.
                  </p>
                </div>

                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <Calendar className="h-4 w-4 text-green-600" />
                    <h4 className="font-semibold text-green-800 text-sm">Utilities</h4>
                  </div>
                  <p className="text-xs text-green-700">
                    Take meter readings and contact suppliers to set up accounts in your name.
                  </p>
                </div>

                <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <Heart className="h-4 w-4 text-purple-600" />
                    <h4 className="font-semibold text-purple-800 text-sm">Settle In</h4>
                  </div>
                  <p className="text-xs text-purple-700">
                    Order takeaway, unpack essentials, and enjoy your first night in your new home!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 xl:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                <Camera className="h-4 w-4 sm:h-5 sm:w-5 text-pink-600" />
                <span>Completion Day Memories</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-lg">
                <h4 className="font-semibold text-pink-800 text-sm mb-2">📸 Capture This Moment</h4>
                <p className="text-xs text-pink-700 mb-3">
                  This is a special day! Take photos of your first moments in your new home and write down your
                  thoughts.
                </p>
                <div className="grid gap-2 grid-cols-2 sm:grid-cols-4 text-center">
                  <div className="p-2 bg-white rounded border">
                    <Key className="h-6 w-6 mx-auto text-yellow-600 mb-1" />
                    <p className="text-xs">First Keys</p>
                  </div>
                  <div className="p-2 bg-white rounded border">
                    <Home className="h-6 w-6 mx-auto text-blue-600 mb-1" />
                    <p className="text-xs">Front Door</p>
                  </div>
                  <div className="p-2 bg-white rounded border">
                    <Heart className="h-6 w-6 mx-auto text-red-600 mb-1" />
                    <p className="text-xs">Family Photo</p>
                  </div>
                  <div className="p-2 bg-white rounded border">
                    <Gift className="h-6 w-6 mx-auto text-purple-600 mb-1" />
                    <p className="text-xs">Celebration</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="completion-memories" className="text-sm font-medium">
                  Your Completion Day Thoughts 💭
                </Label>
                <Textarea
                  id="completion-memories"
                  placeholder="How are you feeling about your new home? What are you most excited about? Write down your thoughts to remember this special day..."
                  value={memories}
                  onChange={(e) => setMemories(e.target.value)}
                  className="min-h-[100px] text-sm"
                />
                <Button onClick={saveMemories} className="w-full sm:w-auto">
                  <Heart className="h-4 w-4 mr-2" />
                  Save My Memories
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TransactionLayout>
  )
}
