"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Send, MessageCircle, Minimize2 } from "lucide-react"
import { useRealTime, type Role } from "@/contexts/real-time-context"
import { cn } from "@/lib/utils"

interface ChatMessage {
  id: string
  senderId: Role
  senderName: string
  message: string
  timestamp: Date
  read: boolean
}

interface MessengerChatProps {
  currentUserRole: Role
  currentUserName: string
  otherParticipant: {
    role: Role
    name: string
  }
}

export function MessengerChat({ currentUserRole, currentUserName, otherParticipant }: MessengerChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isMinimized, setIsMinimized] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { sendUpdate } = useRealTime()

  // Load messages from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem("messenger-chat-messages")
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }))
        setMessages(parsed)
      } catch (error) {
        console.error("Error loading chat messages:", error)
      }
    }
  }, [])

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("messenger-chat-messages", JSON.stringify(messages))
    }
  }, [messages])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Simulate typing indicator
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage.senderId !== currentUserRole) {
        setIsTyping(true)
        const timer = setTimeout(() => setIsTyping(false), 2000)
        return () => clearTimeout(timer)
      }
    }
  }, [messages, currentUserRole])

  const sendMessage = () => {
    if (!newMessage.trim()) return

    const message: ChatMessage = {
      id: crypto.randomUUID(),
      senderId: currentUserRole,
      senderName: currentUserName,
      message: newMessage.trim(),
      timestamp: new Date(),
      read: false,
    }

    setMessages((prev) => [...prev, message])
    setNewMessage("")

    // Send real-time update
    sendUpdate({
      type: "status_changed",
      stage: "conveyancers",
      role: currentUserRole,
      title: "New Message",
      description: `${currentUserName} sent a message`,
      data: {
        messageId: message.id,
        recipient: otherParticipant.role,
      },
    })

    // Simulate response from other participant after a delay
    setTimeout(
      () => {
        const responses = [
          "Thanks for the update!",
          "I'll look into that right away.",
          "Perfect, let me know if you need anything else.",
          "Got it, I'll get back to you shortly.",
          "That sounds good to me.",
          "I'll coordinate with the relevant parties.",
          "Thanks for keeping me informed.",
          "I'll make sure everything is in order.",
        ]

        const randomResponse = responses[Math.floor(Math.random() * responses.length)]

        const responseMessage: ChatMessage = {
          id: crypto.randomUUID(),
          senderId: otherParticipant.role,
          senderName: otherParticipant.name,
          message: randomResponse,
          timestamp: new Date(),
          read: false,
        }

        setMessages((prev) => [...prev, responseMessage])
      },
      1500 + Math.random() * 2000,
    ) // Random delay between 1.5-3.5 seconds
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const getAvatarInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const unreadCount = messages.filter((msg) => !msg.read && msg.senderId !== currentUserRole).length

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsMinimized(false)}
          className="relative bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg"
        >
          <MessageCircle className="h-6 w-6" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-[20px] h-5 rounded-full flex items-center justify-center">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 h-96 bg-white border border-gray-200 rounded-lg shadow-xl">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-3 bg-blue-600 text-white rounded-t-lg">
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={`/placeholder.svg?height=32&width=32&text=${getAvatarInitials(otherParticipant.name)}`} />
            <AvatarFallback className="bg-blue-500 text-white text-xs">
              {getAvatarInitials(otherParticipant.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm">{otherParticipant.name}</p>
            <p className="text-xs opacity-90 capitalize">{otherParticipant.role.replace("-", " ")}</p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(true)}
            className="text-white hover:bg-blue-700 p-1 h-auto"
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 h-64 p-3">
        <div className="space-y-3">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 text-sm py-8">
              <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Start a conversation with {otherParticipant.name}</p>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className="space-y-1">
                {/* Show sender name for all messages */}
                <div
                  className={cn(
                    "text-xs text-gray-500 px-1",
                    message.senderId === currentUserRole ? "text-right" : "text-left",
                  )}
                >
                  {message.senderName}
                </div>
                <div className={cn("flex", message.senderId === currentUserRole ? "justify-end" : "justify-start")}>
                  <div
                    className={cn(
                      "max-w-[70%] rounded-2xl px-3 py-2 text-sm",
                      message.senderId === currentUserRole
                        ? "bg-blue-600 text-white rounded-br-md"
                        : "bg-gray-100 text-gray-900 rounded-bl-md",
                    )}
                  >
                    <p>{message.message}</p>
                    <p
                      className={cn(
                        "text-xs mt-1 opacity-70",
                        message.senderId === currentUserRole ? "text-blue-100" : "text-gray-500",
                      )}
                    >
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}

          {isTyping && (
            <div className="space-y-1">
              <div className="text-xs text-gray-500 px-1 text-left">{otherParticipant.name}</div>
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl rounded-bl-md px-3 py-2 text-sm">
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
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="p-3 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 rounded-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
          <Button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 h-auto"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
