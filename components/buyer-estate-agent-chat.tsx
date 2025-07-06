"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MessageCircle, Send, X, Minimize2, Maximize2, Check, CheckCheck, Phone, Video } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  senderId: string
  senderName: string
  content: string
  timestamp: Date
  read: boolean
  type: "text" | "system"
}

interface BuyerEstateAgentChatProps {
  currentUserRole: "buyer" | "estate-agent"
  currentUserName: string
  currentStage: string
}

const ALLOWED_STAGES = ["offer-accepted", "proof-of-funds", "add-conveyancer"]

const STORAGE_KEY = "buyer-estate-agent-chat-messages"

export function BuyerEstateAgentChat({ currentUserRole, currentUserName, currentStage }: BuyerEstateAgentChatProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Check if chat should be available for current stage
  const isChatAvailable = ALLOWED_STAGES.includes(currentStage)

  // Get other participant info
  const otherParticipant = {
    id: currentUserRole === "buyer" ? "estate-agent" : "buyer",
    name: currentUserRole === "buyer" ? "Emma Roberts" : "John Davies",
    role: currentUserRole === "buyer" ? "Estate Agent" : "Buyer",
    avatar: currentUserRole === "buyer" ? "ER" : "JD",
    status: "online" as const,
  }

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Load messages from localStorage
  useEffect(() => {
    if (!isChatAvailable) return

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        const messagesWithDates = parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }))
        setMessages(messagesWithDates)

        // Count unread messages for current user
        const unread = messagesWithDates.filter((msg: Message) => msg.senderId !== currentUserRole && !msg.read).length
        setUnreadCount(unread)
      } else {
        // Initialize with welcome message
        const welcomeMessage: Message = {
          id: "welcome-1",
          senderId: "system",
          senderName: "System",
          content: `Welcome to the ${currentStage.replace("-", " ")} stage! You can now chat with your ${otherParticipant.role.toLowerCase()}.`,
          timestamp: new Date(),
          read: true,
          type: "system",
        }
        setMessages([welcomeMessage])
        localStorage.setItem(STORAGE_KEY, JSON.stringify([welcomeMessage]))
      }
    } catch (error) {
      console.error("Error loading chat messages:", error)
    }
  }, [isChatAvailable, currentStage, currentUserRole, otherParticipant.role])

  // Save messages to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
      } catch (error) {
        console.error("Error saving chat messages:", error)
      }
    }
  }, [messages])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen, isMinimized])

  // Mark messages as read when chat is opened
  useEffect(() => {
    if (isOpen && unreadCount > 0) {
      const updatedMessages = messages.map((msg) => (msg.senderId !== currentUserRole ? { ...msg, read: true } : msg))
      setMessages(updatedMessages)
      setUnreadCount(0)
    }
  }, [isOpen, unreadCount, messages, currentUserRole])

  const sendMessage = () => {
    if (!newMessage.trim()) return

    const message: Message = {
      id: crypto.randomUUID(),
      senderId: currentUserRole,
      senderName: currentUserName,
      content: newMessage.trim(),
      timestamp: new Date(),
      read: false,
      type: "text",
    }

    setMessages((prev) => [...prev, message])
    setNewMessage("")

    // Simulate typing indicator and response
    setIsTyping(true)
    setTimeout(
      () => {
        setIsTyping(false)

        // Simulate a response
        const response: Message = {
          id: crypto.randomUUID(),
          senderId: otherParticipant.id,
          senderName: otherParticipant.name,
          content: getAutoResponse(newMessage.trim(), currentStage, currentUserRole),
          timestamp: new Date(),
          read: false,
          type: "text",
        }
        setMessages((prev) => [...prev, response])
      },
      1000 + Math.random() * 2000,
    )
  }

  const getAutoResponse = (userMessage: string, stage: string, userRole: string): string => {
    const stageResponses = {
      "offer-accepted": {
        buyer: [
          "Congratulations on your accepted offer! I'll guide you through the next steps.",
          "Great news! Let's start preparing for the proof of funds stage.",
          "Excellent! I'll send you the list of documents we'll need for the next stage.",
          "Wonderful! The seller is excited to proceed with your offer.",
        ],
        "estate-agent": [
          "Thank you for your patience. I'm here to help with any questions about the process.",
          "I'll make sure everything moves smoothly to the next stage.",
          "Let me know if you need any clarification about the upcoming requirements.",
          "I'm coordinating with all parties to ensure a smooth transaction.",
        ],
      },
      "proof-of-funds": {
        buyer: [
          "I'll review your documents as soon as they're submitted.",
          "The proof of funds process typically takes 1-2 business days to review.",
          "Make sure all documents are clear and recent for faster processing.",
          "I'll notify you immediately once the documents are approved.",
        ],
        "estate-agent": [
          "I understand the importance of getting this approved quickly.",
          "I'll ensure all documentation meets the lender's requirements.",
          "Thank you for being proactive with your financial documentation.",
          "I'll keep the seller updated on the progress of your application.",
        ],
      },
      "add-conveyancer": {
        buyer: [
          "I can recommend some excellent conveyancers from our verified directory.",
          "Choosing the right conveyancer is crucial for a smooth transaction.",
          "I'll help coordinate between you and your chosen conveyancer.",
          "Let me know if you need help comparing different conveyancing options.",
        ],
        "estate-agent": [
          "I appreciate you taking the time to select a quality conveyancer.",
          "A good conveyancer will make the rest of the process much smoother.",
          "I'll facilitate communication between all legal representatives.",
          "Thank you for being thorough in your conveyancer selection.",
        ],
      },
    }

    const roleResponses =
      stageResponses[stage as keyof typeof stageResponses]?.[userRole as keyof (typeof stageResponses)[typeof stage]]
    if (roleResponses) {
      return roleResponses[Math.floor(Math.random() * roleResponses.length)]
    }

    // Fallback responses
    const fallbackResponses = [
      "Thanks for the message. I'll get back to you shortly.",
      "I'm here to help with any questions you might have.",
      "Let me look into that and provide you with an update.",
      "I appreciate you keeping me informed.",
    ]
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)]
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
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

  // Don't render if chat is not available for current stage
  if (!isChatAvailable) {
    return null
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 h-14 w-14 rounded-full bg-green-600 hover:bg-green-700 shadow-lg z-40"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center bg-red-500 text-white text-xs animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </Badge>
        )}
      </Button>
    )
  }

  return (
    <div
      className={`fixed bottom-4 right-4 w-80 bg-white border border-grey-200 rounded-lg shadow-xl z-40 flex flex-col transition-all duration-200 ${
        isMinimized ? "h-16" : "max-h-[600px]"
      }`}
      style={{ maxHeight: isMinimized ? "64px" : "calc(100vh - 2rem)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="relative">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-white/20 text-white font-medium">{otherParticipant.avatar}</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{otherParticipant.name}</p>
            <p className="text-sm opacity-90 truncate">{otherParticipant.role}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-white hover:bg-white/20">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-white hover:bg-white/20">
            <Video className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(!isMinimized)}
            className="h-8 w-8 p-0 text-white hover:bg-white/20"
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="h-8 w-8 p-0 text-white hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Chat Content */}
      {!isMinimized && (
        <>
          {/* Stage Indicator */}
          <div className="px-4 py-2 bg-green-50 border-b">
            <div className="flex items-center justify-center">
              <Badge className="bg-green-100 text-green-800 text-xs">
                {currentStage.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())} Stage
              </Badge>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="h-80 p-4">
            <div className="space-y-4">
              {messages.map((message, index) => {
                const isOwn = message.senderId === currentUserRole
                const isSystem = message.type === "system"
                const showDate =
                  index === 0 || formatDate(message.timestamp) !== formatDate(messages[index - 1].timestamp)

                return (
                  <div key={message.id}>
                    {showDate && (
                      <div className="flex justify-center my-4">
                        <span className="text-xs text-grey-500 bg-grey-100 px-3 py-1 rounded-full">
                          {formatDate(message.timestamp)}
                        </span>
                      </div>
                    )}

                    {isSystem ? (
                      <div className="flex justify-center">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 max-w-xs">
                          <p className="text-sm text-blue-800 text-center">{message.content}</p>
                        </div>
                      </div>
                    ) : (
                      <div className={cn("flex", isOwn ? "justify-end" : "justify-start")}>
                        <div className={cn("max-w-[75%]", isOwn ? "order-2" : "order-1")}>
                          <div
                            className={cn(
                              "rounded-2xl px-4 py-2 text-sm",
                              isOwn
                                ? "bg-green-600 text-white rounded-br-md"
                                : "bg-grey-100 text-grey-900 rounded-bl-md",
                            )}
                          >
                            <p className="break-words leading-relaxed">{message.content}</p>
                          </div>
                          <div
                            className={cn(
                              "flex items-center mt-1 space-x-1 text-xs",
                              isOwn ? "justify-end text-green-600" : "justify-start text-grey-500",
                            )}
                          >
                            <span>{formatTime(message.timestamp)}</span>
                            {isOwn && (
                              <div className="text-green-600">
                                {message.read ? <CheckCheck className="h-3 w-3" /> : <Check className="h-3 w-3" />}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-grey-100 rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-grey-400 rounded-full animate-bounce" />
                      <div
                        className="w-2 h-2 bg-grey-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      />
                      <div
                        className="w-2 h-2 bg-grey-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="p-4 border-t bg-grey-50 rounded-b-lg">
            <div className="flex space-x-3">
              <Input
                ref={inputRef}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Message ${otherParticipant.name}...`}
                className="flex-1 rounded-full border-grey-200 focus:border-green-500 focus:ring-green-500"
              />
              <Button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className="rounded-full bg-green-600 hover:bg-green-700 disabled:opacity-50"
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-2 text-xs text-grey-500 text-center">
              Available during: Offer Accepted, Proof of Funds & Add Conveyancer stages
            </div>
          </div>
        </>
      )}
    </div>
  )
}
