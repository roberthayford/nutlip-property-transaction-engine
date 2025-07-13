"use client"

import type React from "react"
import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MessageCircle, Send, X, Minimize2, Maximize2, Users, Check, CheckCheck, Menu } from "lucide-react"
import type { Role } from "@/contexts/real-time-context"
import { trackMessageEvent, trackFeatureUsage } from "@/utils/analytics"

interface Message {
  id: string
  sender: Role
  senderName: string
  recipient: Role
  recipientName: string
  content: string
  timestamp: string
  read: boolean
  type: "text" | "file" | "system"
}

interface MessengerChatProps {
  currentUserRole: Role
  currentUserName: string
}

// Only these roles can use the chat system
const CHAT_ENABLED_ROLES: Role[] = ["estate-agent", "buyer-conveyancer", "seller-conveyancer"]

// Available participants for each role
const CHAT_PARTICIPANTS: Record<
  Role,
  Array<{ role: Role; name: string; avatar: string; status: "online" | "offline" | "away" }>
> = {
  "estate-agent": [
    { role: "buyer-conveyancer", name: "Sarah Johnson", avatar: "SJ", status: "online" },
    { role: "seller-conveyancer", name: "Alex Mitchell", avatar: "AM", status: "away" },
  ],
  "buyer-conveyancer": [
    { role: "estate-agent", name: "Emma Roberts", avatar: "ER", status: "online" },
    { role: "seller-conveyancer", name: "Alex Mitchell", avatar: "AM", status: "away" },
  ],
  "seller-conveyancer": [
    { role: "estate-agent", name: "Emma Roberts", avatar: "ER", status: "online" },
    { role: "buyer-conveyancer", name: "Sarah Johnson", avatar: "SJ", status: "online" },
  ],
  buyer: [],
  seller: [],
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "online":
      return "bg-green-500"
    case "away":
      return "bg-yellow-500"
    case "offline":
      return "bg-grey-400"
    default:
      return "bg-grey-400"
  }
}

export function MessengerChat({ currentUserRole, currentUserName }: MessengerChatProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [selectedParticipant, setSelectedParticipant] = useState<{
    role: Role
    name: string
    avatar: string
    status: string
  } | null>(null)
  const [showSidebar, setShowSidebar] = useState(false)
  const [totalUnreadCount, setTotalUnreadCount] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Check if current user can use chat
  const canUseChat = CHAT_ENABLED_ROLES.includes(currentUserRole)

  // Get available participants for current user
  const availableParticipants = CHAT_PARTICIPANTS[currentUserRole] || []

  const chatKey = "pte-messenger-messages-v3"

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, selectedParticipant])

  // Load messages from localStorage
  useEffect(() => {
    if (!canUseChat) return

    const savedMessages = localStorage.getItem(chatKey)
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages)
        setMessages(parsed)
        // Count total unread messages for current user
        const unread = parsed.filter(
          (msg: Message) => msg.recipient === currentUserRole && msg.sender !== currentUserRole && !msg.read,
        ).length
        setTotalUnreadCount(unread)
      } catch (error) {
        console.error("Error parsing saved messages:", error)
      }
    }
  }, [chatKey, currentUserRole, canUseChat])

  // Handle storage changes from other tabs/windows
  const handleStorageChange = useCallback(
    (e: StorageEvent) => {
      if (!canUseChat || e.key !== chatKey || !e.newValue) return

      try {
        const newMessages = JSON.parse(e.newValue)
        if (JSON.stringify(newMessages) !== JSON.stringify(messages)) {
          setMessages(newMessages)
          const unread = newMessages.filter(
            (msg: Message) => msg.recipient === currentUserRole && msg.sender !== currentUserRole && !msg.read,
          ).length
          setTotalUnreadCount(unread)
        }
      } catch (error) {
        console.error("Error parsing storage change:", error)
      }
    },
    [chatKey, currentUserRole, messages, canUseChat],
  )

  useEffect(() => {
    if (!canUseChat) return
    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [handleStorageChange, canUseChat])

  // Save messages to localStorage
  const saveMessages = (msgs: Message[]) => {
    localStorage.setItem(chatKey, JSON.stringify(msgs))
    setMessages(msgs)
  }

  // Get messages for current conversation
  const conversationMessages = selectedParticipant
    ? messages
        .filter(
          (msg) =>
            (msg.sender === currentUserRole && msg.recipient === selectedParticipant.role) ||
            (msg.sender === selectedParticipant.role && msg.recipient === currentUserRole),
        )
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    : []

  // Get unread count for each participant
  const getUnreadCount = (participantRole: Role) => {
    return messages.filter((msg) => msg.recipient === currentUserRole && msg.sender === participantRole && !msg.read)
      .length
  }

  // Send a new message
  const sendMessage = () => {
    if (!newMessage.trim() || !selectedParticipant) return

    const message: Message = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      sender: currentUserRole,
      senderName: currentUserName,
      recipient: selectedParticipant.role,
      recipientName: selectedParticipant.name,
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      read: false,
      type: "text",
    }

    const updatedMessages = [...messages, message]
    saveMessages(updatedMessages)
    setNewMessage("")

    // Track message sent event
    trackMessageEvent('conversation', 'sent')

    // Focus back to input
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  // Mark messages as read when conversation is opened
  const markConversationAsRead = (participantRole: Role) => {
    const updatedMessages = messages.map((msg) =>
      msg.recipient === currentUserRole && msg.sender === participantRole ? { ...msg, read: true } : msg,
    )
    if (JSON.stringify(updatedMessages) !== JSON.stringify(messages)) {
      saveMessages(updatedMessages)
      setTotalUnreadCount(
        (prev) =>
          prev -
          messages.filter((msg) => msg.recipient === currentUserRole && msg.sender === participantRole && !msg.read)
            .length,
      )
      
      // Track conversation read event
      trackMessageEvent('conversation', 'viewed')
    }
  }

  // Open chat
  const openChat = () => {
    setIsOpen(true)
    setIsMinimized(false)
    // Track chat opened event
    trackFeatureUsage('messenger', 'open')
    // Auto-select first participant if none selected
    if (!selectedParticipant && availableParticipants.length > 0) {
      setSelectedParticipant(availableParticipants[0])
      markConversationAsRead(availableParticipants[0].role)
    }
  }

  // Select participant
  const selectParticipant = (participant: (typeof availableParticipants)[0]) => {
    setSelectedParticipant(participant)
    setShowSidebar(false)
    markConversationAsRead(participant.role)
    // Track participant selection
    trackMessageEvent('participant_selection', 'selected')
  }

  // Format timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // Don't render if user can't use chat
  if (!canUseChat) {
    return null
  }

  return (
    <>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <div className="fixed bottom-4 right-4 z-50">
          <Button
            onClick={openChat}
            className="rounded-full h-12 w-12 shadow-lg hover:shadow-xl transition-all duration-200 bg-blue-600 hover:bg-blue-700"
          >
            <MessageCircle className="h-5 w-5" />
            {totalUnreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                {totalUnreadCount > 9 ? "9+" : totalUnreadCount}
              </Badge>
            )}
          </Button>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 z-50">
          <Card
            className={`shadow-2xl border-0 ${isMinimized ? "w-72 h-12" : "w-72 h-96"} transition-all duration-300`}
          >
            {/* Header */}
            <CardHeader className="p-3 bg-blue-600 text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSidebar(!showSidebar)}
                    className="h-7 w-7 p-0 text-white hover:bg-white/20"
                  >
                    <Menu className="h-4 w-4" />
                  </Button>
                  {selectedParticipant ? (
                    <div className="flex items-center space-x-2">
                      <div className="relative">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback className="bg-white/20 text-white text-xs font-semibold">
                            {selectedParticipant.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-white ${getStatusColor(selectedParticipant.status)}`}
                        />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{selectedParticipant.name}</p>
                        <p className="text-xs text-blue-100 capitalize">{selectedParticipant.status}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <MessageCircle className="h-5 w-5" />
                      <span className="font-medium text-sm">Professional Chat</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="h-6 w-6 p-0 text-white hover:bg-white/20"
                  >
                    {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="h-6 w-6 p-0 text-white hover:bg-white/20"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {!isMinimized && (
              <CardContent className="p-0 h-80 flex flex-col">
                {selectedParticipant ? (
                  <>
                    {/* Messages Area */}
                    <ScrollArea className="flex-1 p-3">
                      <div className="space-y-2">
                        {conversationMessages.length === 0 ? (
                          <div className="text-center py-6">
                            <div className="w-10 h-10 bg-grey-100 rounded-full flex items-center justify-center mx-auto mb-2">
                              <MessageCircle className="h-5 w-5 text-grey-400" />
                            </div>
                            <p className="text-grey-500 text-xs">No messages yet</p>
                            <p className="text-grey-400 text-xs">Start chatting with {selectedParticipant.name}</p>
                          </div>
                        ) : (
                          conversationMessages.map((message, index) => {
                            const isOwn = message.sender === currentUserRole
                            const showTime =
                              index === conversationMessages.length - 1 ||
                              conversationMessages[index + 1].sender !== message.sender ||
                              new Date(conversationMessages[index + 1].timestamp).getTime() -
                                new Date(message.timestamp).getTime() >
                                300000 // 5 minutes

                            return (
                              <div key={message.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                                <div className={`max-w-[80%] ${isOwn ? "text-right" : "text-left"}`}>
                                  <div
                                    className={`inline-block rounded-lg px-3 py-1.5 text-sm ${
                                      isOwn
                                        ? "bg-blue-600 text-white rounded-br-sm"
                                        : "bg-grey-100 text-grey-900 rounded-bl-sm"
                                    }`}
                                  >
                                    <p className="break-words">{message.content}</p>
                                  </div>
                                  {showTime && (
                                    <div
                                      className={`flex items-center mt-1 space-x-1 text-xs text-grey-400 ${
                                        isOwn ? "justify-end" : "justify-start"
                                      }`}
                                    >
                                      <span>{formatTime(message.timestamp)}</span>
                                      {isOwn &&
                                        (message.read ? (
                                          <CheckCheck className="h-3 w-3" />
                                        ) : (
                                          <Check className="h-3 w-3" />
                                        ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )
                          })
                        )}
                        <div ref={messagesEndRef} />
                      </div>
                    </ScrollArea>

                    {/* Message Input */}
                    <div className="p-3 border-t bg-grey-50">
                      <div className="flex items-center space-x-2">
                        <Input
                          ref={inputRef}
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Type a message..."
                          className="flex-1 h-8 text-sm rounded-full border-grey-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                        <Button
                          onClick={sendMessage}
                          disabled={!newMessage.trim()}
                          size="sm"
                          className="h-8 w-8 p-0 rounded-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                        >
                          <Send className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <Users className="h-8 w-8 text-grey-400 mx-auto mb-2" />
                      <p className="text-grey-500 text-sm font-medium">Select a contact</p>
                      <p className="text-grey-400 text-xs">Click the menu to choose someone to chat with</p>
                    </div>
                  </div>
                )}
              </CardContent>
            )}
          </Card>

          {/* Floating Sidebar */}
          {showSidebar && (
            <>
              {/* Backdrop */}
              <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setShowSidebar(false)} />

              {/* Sidebar */}
              <Card className="absolute bottom-0 right-72 w-56 h-96 shadow-xl border-0 z-50 animate-in slide-in-from-right-2 duration-200">
                <CardHeader className="p-3 bg-grey-50 border-b">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-sm text-grey-900">Contacts</h3>
                    <Button variant="ghost" size="sm" onClick={() => setShowSidebar(false)} className="h-6 w-6 p-0">
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-80">
                    <div className="p-2">
                      {availableParticipants.map((participant) => {
                        const unreadCount = getUnreadCount(participant.role)
                        const isSelected = selectedParticipant?.role === participant.role

                        return (
                          <div
                            key={participant.role}
                            onClick={() => selectParticipant(participant)}
                            className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer transition-colors ${
                              isSelected ? "bg-blue-100 border border-blue-200" : "hover:bg-grey-50"
                            }`}
                          >
                            <div className="relative">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-semibold">
                                  {participant.avatar}
                                </AvatarFallback>
                              </Avatar>
                              <div
                                className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-white ${getStatusColor(participant.status)}`}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="font-medium text-grey-900 text-sm truncate">{participant.name}</p>
                                {unreadCount > 0 && (
                                  <Badge className="bg-red-500 text-white h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs">
                                    {unreadCount}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-grey-500 capitalize truncate">
                                {participant.role.replace("-", " ")}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      )}
    </>
  )
}
