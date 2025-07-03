"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { BadgeCheck } from "lucide-react"
import { cn } from "@/lib/utils"

type Conveyancer = {
  id: string
  name: string
  firm: string
  email: string
  phone: string
  fee: string
  responseTime: string
}

const recommended: Conveyancer[] = [
  {
    id: "c1",
    name: "Jane Adams",
    firm: "Adams & Co Legal",
    email: "jane.adams@adamslegal.co.uk",
    phone: "020 1234 5678",
    fee: "£950 + VAT",
    responseTime: "≈ 4 hrs",
  },
  {
    id: "c2",
    name: "Mark Thompson",
    firm: "Thompson Conveyancing",
    email: "mark@thompsonconveyancing.com",
    phone: "0161 987 6543",
    fee: "£1 050 + VAT",
    responseTime: "≈ 6 hrs",
  },
  {
    id: "c3",
    name: "Priya Patel",
    firm: "Patel Property Law",
    email: "p.patel@patelpropertylaw.co.uk",
    phone: "0115 222 3333",
    fee: "£900 + VAT",
    responseTime: "≈ 3 hrs",
  },
]

export default function EstateAgentConveyancersPage() {
  const [requestedId, setRequestedId] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: "",
    firm: "",
    email: "",
    phone: "",
    address: "",
    note: "",
  })

  /* ---------- helpers ---------- */
  const handleRequestRecommended = (c: Conveyancer) => {
    setRequestedId(c.id)
    toast({
      title: "Request sent",
      description: `An invitation was emailed to ${c.name} at ${c.firm}.`,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.firm || !form.email || !form.phone) {
      toast({ title: "Please fill in all required fields", variant: "destructive" })
      return
    }
    toast({
      title: "Invitation sent",
      description: `We emailed ${form.name} (${form.firm}).`,
    })
    setForm({ name: "", firm: "", email: "", phone: "", address: "", note: "" })
  }

  const updateField = (k: keyof typeof form, v: string) => setForm((p) => ({ ...p, [k]: v }))

  /* ---------- render ---------- */
  return (
    <main className="container py-8 space-y-10">
      <section className="max-w-3xl space-y-2">
        <h1 className="text-3xl font-bold">Appoint Seller’s Conveyancer</h1>
        <p className="text-muted-foreground">
          As the estate agent you act on behalf of the seller. Please invite their chosen legal representative or select
          one from our recommended panel.
        </p>
      </section>

      {/* Recommended list */}
      <section className="grid gap-6 md:grid-cols-3">
        {recommended.map((c) => {
          const requested = requestedId === c.id
          return (
            <Card key={c.id} className={cn(requested && "ring-2 ring-green-500")}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{c.name}</span>
                  {requested && <BadgeCheck className="h-4 w-4 text-green-600" />}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="font-medium">{c.firm}</p>
                <p>Email: {c.email}</p>
                <p>Phone: {c.phone}</p>
                <p>Fee: {c.fee}</p>
                <p>Avg. response: {c.responseTime}</p>
                <Button disabled={requested} onClick={() => handleRequestRecommended(c)} className="w-full mt-2">
                  {requested ? "Requested" : "Send Request"}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </section>

      {/* OR divider */}
      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-border" />
        <span className="text-sm text-muted-foreground">or invite a different conveyancer</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* Custom conveyancer form */}
      <section className="max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Invite a Conveyancer</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name *</Label>
                <Input id="name" value={form.name} onChange={(e) => updateField("name", e.target.value)} required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="firm">Firm *</Label>
                <Input id="firm" value={form.firm} onChange={(e) => updateField("firm", e.target.value)} required />
              </div>

              <div className="grid gap-2 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    type="email"
                    id="email"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  rows={2}
                  value={form.address}
                  onChange={(e) => updateField("address", e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="note">Optional note</Label>
                <Textarea
                  id="note"
                  rows={3}
                  placeholder="Anything the conveyancer should know?"
                  value={form.note}
                  onChange={(e) => updateField("note", e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full">
                Send Invitation
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
