"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Send, Minimize2, Maximize2, Phone, Video, X, Check, CheckCheck, User } from "lucide-react"

interface Message {
  id: string
  text: string
  sender: "buyer" | "estate-agent"
  timestamp: Date
  read: boolean
}

interface BuyerEstateAgentChatProps {
  currentUserRole: "buyer" | "estate-agent"
  currentUserName: string
  currentStage: string
}

// Stages where this chat is available
const AVAILABLE_STAGES = ["offer-accepted", "proof-of-funds", "add-conveyancer"]

// Auto-response logic based on stage and role
const getAutoResponse = (userRole: "buyer" | "estate-agent", stage: string, userMessage: string): string => {
  const lowerMessage = userMessage.toLowerCase()

  if (userRole === "buyer") {
    // Estate agent responses to buyer
    if (stage === "offer-accepted") {
      if (lowerMessage.includes("offer") || lowerMessage.includes("accept")) {
        return "Congratulations! Your offer has been accepted. I'll guide you through the next steps. We'll need to arrange proof of funds and get conveyancers involved."
      }
      if (lowerMessage.includes("next") || lowerMessage.includes("what")) {
        return "The next step is to provide proof of funds to show you can complete the purchase. I'll send you the requirements shortly."
      }
      return "Great to hear from you! I'm here to help with any questions about the accepted offer and next steps."
    }

    if (stage === "proof-of-funds") {
      if (lowerMessage.includes("funds") || lowerMessage.includes("proof")) {
        return "For proof of funds, you'll need bank statements, mortgage agreement in principle, or evidence of cash funds. I can help you prepare these documents."
      }
      if (lowerMessage.includes("document") || lowerMessage.includes("bank")) {
        return "Please provide recent bank statements (last 3 months) and your mortgage agreement in principle. Make sure all documents are clear and recent."
      }
      return "I'm here to help with your proof of funds requirements. Let me know what specific documents you need guidance on."
    }

    if (stage === "add-conveyancer") {
      if (lowerMessage.includes("conveyancer") || lowerMessage.includes("solicitor")) {
        return "I can recommend some excellent conveyancers who work efficiently. Would you like me to send you a list of recommended firms with their contact details?"
      }
      if (lowerMessage.includes("recommend") || lowerMessage.includes("suggest")) {
        return "I have a list of trusted conveyancers who are familiar with this area. They typically complete transactions within 8-12 weeks. Shall I share their details?"
      }
      return "Let me help you find the right conveyancer for your purchase. I work with several excellent firms that I can recommend."
    }
  } else {
    // Buyer responses to estate agent
    if (stage === "offer-accepted") {
      if (lowerMessage.includes("congratulations") || lowerMessage.includes("accepted")) {
        return "Thank you! I'm excited to move forward. What do I need to do next to keep things moving quickly?"
      }
      if (lowerMessage.includes("next") || lowerMessage.includes("step")) {
        return "I'm ready to proceed. Should I start gathering my financial documents now? How quickly can we move to the next stage?"
      }
      return "Thanks for your message! I'm eager to get started with the next steps. What should be my priority right now?"
    }

    if (stage === "proof-of-funds") {
      if (lowerMessage.includes("documents") || lowerMessage.includes("bank")) {
        return "I have my recent bank statements ready. Do you need the mortgage agreement in principle as well? When do you need these by?"
      }
      if (lowerMessage.includes("mortgage") || lowerMessage.includes("funds")) {
        return "My mortgage is pre-approved and I have the agreement in principle. I can send the documents today. Is there a preferred format?"
      }
      return "I'm working on gathering all the required documents. Can you confirm exactly what you need and the deadline?"
    }

    if (stage === "add-conveyancer") {
      if (lowerMessage.includes("recommend") || lowerMessage.includes("list")) {
        return "Yes, please send me the list of recommended conveyancers. I'd prefer someone who can work quickly and efficiently. Do you have their typical timescales?"
      }
      if (lowerMessage.includes("conveyancer") || lowerMessage.includes("solicitor")) {
        return "I'd appreciate your recommendations. What should I look for in a good conveyancer? Are there any questions I should ask them?"
      }
      return "I need to choose a conveyancer soon. Your recommendations would be very helpful. What's the typical cost range I should expect?"
    }
  }

  return "Thanks for your message. I'll get back to you shortly with more details."
}

const getStageDisplayName = (stage: string): string => {
  switch (stage) {
    case "offer-accepted":
      return "Offer Accepted"
    case "proof-of-funds":
      return "Proof of Funds"
    case "add-conveyancer":
      return "Add Conveyancer"
    default:
      return stage
  }
}

const getOtherParticipantName = (currentRole: "buyer" | "estate-agent"): string => {
  return currentRole === "buyer" ? "Emma R (Estate Agent)" : "John D (Buyer)"
}

export function BuyerEstateAgentChat({ currentUserRole, currentUserName, currentStage }: BuyerEstateAgentChatProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatKey = `buyer-estate-agent-chat-${currentStage}`

  // Load messages from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem(chatKey)
    if (savedMessages) {
      const parsed = JSON.parse(savedMessages).map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      }))
      setMessages(parsed)

      // Count unread messages
      const unread = parsed.filter((msg: Message) => !msg.read && msg.sender !== currentUserRole).length
      setUnreadCount(unread)
    } else {
      // Initialize with welcome message for the stage
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        text: getWelcomeMessage(currentStage, currentUserRole),
        sender: currentUserRole === "buyer" ? "estate-agent" : "buyer",
        timestamp: new Date(),
        read: false,
      }
      setMessages([welcomeMessage])
      setUnreadCount(1)
      localStorage.setItem(chatKey, JSON.stringify([welcomeMessage]))
    }
  }, [currentStage, currentUserRole, chatKey])

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(chatKey, JSON.stringify(messages))
    }
  }, [messages, chatKey])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Mark messages as read when chat is opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setMessages((prev) => prev.map((msg) => ({ ...msg, read: true })))
      setUnreadCount(0)
    }
  }, [isOpen, isMinimized])

  const getWelcomeMessage = (stage: string, userRole: "buyer" | "estate-agent"): string => {
    if (userRole === "buyer") {
      // Estate agent welcome messages
      switch (stage) {
        case "offer-accepted":
          return "Congratulations on your accepted offer! I'm here to help guide you through the next steps. Let me know if you have any questions."
        case "proof-of-funds":
          return "Hi! We need to arrange your proof of funds documentation. I'm here to help you understand what's required and make this process smooth."
        case "add-conveyancer":
          return "Time to get your conveyancer on board! I have some excellent recommendations and can help you choose the right one for your needs."
        default:
          return "Hi! I'm here to help with any questions you have about this stage of the transaction."
      }
    } else {
      // Buyer welcome messages
      switch (stage) {
        case "offer-accepted":
          return "Hi Emma! Thanks for all your help getting the offer accepted. What should I focus on next to keep things moving?"
        case "proof-of-funds":
          return "Hi! I'm ready to provide proof of funds. Can you guide me through exactly what documents I need to prepare?"
        case "add-conveyancer":
          return "Hi Emma! I need to choose a conveyancer now. Do you have any recommendations for someone reliable and efficient?"
        default:
          return "Hi! I have some questions about this stage. Can you help me understand what I need to do?"
      }
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: newMessage.trim(),
      sender: currentUserRole,
      timestamp: new Date(),
      read: true,
    }

    setMessages((prev) => [...prev, userMessage])
    setNewMessage("")

    // Show typing indicator
    setIsTyping(true)

    // Simulate response delay
    setTimeout(
      () => {
        setIsTyping(false)

        const otherRole = currentUserRole === "buyer" ? "estate-agent" : "buyer"
        const responseText = getAutoResponse(currentUserRole, currentStage, newMessage.trim())

        const responseMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: responseText,
          sender: otherRole,
          timestamp: new Date(),
          read: isOpen && !isMinimized,
        }

        setMessages((prev) => [...prev, responseMessage])

        if (!isOpen || isMinimized) {
          setUnreadCount((prev) => prev + 1)
        }
      },
      1000 + Math.random() * 2000,
    ) // 1-3 second delay
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatDate = (date: Date) => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString()
    }
  }

  // Group messages by date
  const groupedMessages = messages.reduce((groups: { [key: string]: Message[] }, message) => {
    const dateKey = formatDate(message.timestamp)
    if (!groups[dateKey]) {
      groups[dateKey] = []
    }
    groups[dateKey].push(message)
    return groups
  }, {})

  const isAvailable = AVAILABLE_STAGES.includes(currentStage)

  if (!isAvailable) {
    return null
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="relative bg-green-600 hover:bg-green-700 text-white rounded-full p-3 shadow-lg"
        >
          <MessageCircle className="h-6 w-6" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full animate-pulse">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div
        className={`bg-white border border-gray-200 rounded-lg shadow-xl transition-all duration-200 ${
          isMinimized ? "h-16" : "h-96"
        } w-80 max-h-[600px] max-height: calc(100vh - 2rem)`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 bg-green-600 text-white rounded-t-lg">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <User className="h-4 w-4" />
            </div>
            <div>
              <p className="font-medium text-sm">{getOtherParticipantName(currentUserRole)}</p>
              <p className="text-xs text-green-100">{getStageDisplayName(currentStage)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="sm" className="text-white hover:bg-green-700 p-1 h-8 w-8">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-green-700 p-1 h-8 w-8">
              <Video className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-white hover:bg-green-700 p-1 h-8 w-8"
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-green-700 p-1 h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <ScrollArea className="h-80 p-3">
              <div className="space-y-4">
                {Object.entries(groupedMessages).map(([date, dateMessages]) => (
                  <div key={date}>
                    <div className="flex justify-center mb-2">
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{date}</span>
                    </div>
                    {dateMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === currentUserRole ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] p-2 rounded-lg ${
                            message.sender === currentUserRole ? "bg-green-600 text-white" : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                          <div
                            className={`flex items-center justify-end space-x-1 mt-1 ${
                              message.sender === currentUserRole ? "text-green-100" : "text-gray-500"
                            }`}
                          >
                            <span className="text-xs">{formatTime(message.timestamp)}</span>
                            {message.sender === currentUserRole &&
                              (message.read ? <CheckCheck className="h-3 w-3" /> : <Check className="h-3 w-3" />)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-900 p-2 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-3 border-t">
              <div className="flex space-x-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
