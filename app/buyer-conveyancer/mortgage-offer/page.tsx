"use client"

import type React from "react"

/**
 * Buyer-Conveyancer ▸ Mortgage Offer
 * -------------------------------------------------
 * 1.  Uses TransactionLayout (keeps navigation / real-time widgets consistent)
 * 2.  Sends a single real-time "status_changed" update on successful submit
 * 3.  All icons come from lucide-react (already installed by default)
 * 4.  No dynamic import / no heavy third-party libs → avoids chunk-loading issues
 */

import { useState } from "react"
import Link from "next/link"
import { CreditCard, FileText, AlertTriangle, CheckCircle, Clock, Send, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

import TransactionLayout from "@/components/transaction-layout"
import { useRealTime } from "@/contexts/real-time-context"
import { toast } from "@/hooks/use-toast"

interface MortgageForm {
  lenderName: string
  lenderReference: string
  loanAmount: string
  interestRate: string
  rateType: string
  ratePeriod: string
  offerValidUntil: string
  monthlyPayment: string
  propertyValuation: string
  ltvRatio: string
  specialConditions: string
  buildingInsuranceRequired: boolean
  lifeInsuranceRequired: boolean
  additionalNotes: string
}

export default function BuyerConveyancerMortgageOfferPage() {
  const { sendUpdate } = useRealTime()

  const [form, setForm] = useState<MortgageForm>({
    lenderName: "",
    lenderReference: "",
    loanAmount: "",
    interestRate: "",
    rateType: "",
    ratePeriod: "",
    offerValidUntil: "",
    monthlyPayment: "",
    propertyValuation: "",
    ltvRatio: "",
    specialConditions: "",
    buildingInsuranceRequired: false,
    lifeInsuranceRequired: false,
    additionalNotes: "",
  })

  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [mortgageNotApplicable, setMortgageNotApplicable] = useState(false)
  const [processingNotApplicable, setProcessingNotApplicable] = useState(false)

  /* ------------------------------ helpers ----------------------------- */
  const change = (field: keyof MortgageForm, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      // Simulate server round-trip
      await new Promise((r) => setTimeout(r, 1500))

      // Send real-time update to estate agent and other parties
      sendUpdate({
        type: "stage_completed",
        stage: "mortgage-offer",
        role: "buyer-conveyancer",
        title: "Mortgage Offer Process Completed",
        description: `Mortgage offer from ${form.lenderName} for £${form.loanAmount} has been processed and submitted to seller conveyancer.`,
        data: {
          mortgageOffer: {
            ...form,
            submittedAt: new Date().toISOString(),
            status: "completed",
          },
        },
      })

      setSubmitted(true)
      toast({
        title: "Success",
        description: "Mortgage offer details sent to the seller-conveyancer and estate agent notified.",
      })
    } catch {
      toast({
        title: "Error",
        description: "Unable to submit mortgage offer. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleMortgageNotApplicable = async () => {
    setProcessingNotApplicable(true)

    try {
      // Simulate server round-trip
      await new Promise((r) => setTimeout(r, 1000))

      // Send real-time update to estate agent and other parties
      sendUpdate({
        type: "stage_completed",
        stage: "mortgage-offer",
        role: "buyer-conveyancer",
        title: "Mortgage Not Required",
        description: "Buyer is proceeding without a mortgage (cash purchase). No mortgage offer required.",
        data: {
          mortgageOffer: {
            status: "not_applicable",
            reason: "cash_purchase",
            submittedAt: new Date().toISOString(),
          },
        },
      })

      setMortgageNotApplicable(true)
      toast({
        title: "Confirmed",
        description: "All parties have been notified that no mortgage is required for this transaction.",
      })
    } catch {
      toast({
        title: "Error",
        description: "Unable to process request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setProcessingNotApplicable(false)
    }
  }

  /* ----------------------------- fallback for submitted ----------------------------- */
  if (submitted) {
    return (
      <TransactionLayout
        currentStage="mortgage-offer"
        userRole="buyer-conveyancer"
        title="Mortgage Offer Submitted"
        description="Details have been shared with the seller conveyancer."
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle className="h-5 w-5" />
              Submission confirmed
            </CardTitle>
            <CardDescription>You can proceed once the seller conveyancer acknowledges the offer.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Info label="Lender" value={form.lenderName} />
            <Info label="Loan Amount" value={`£${form.loanAmount}`} />
            <Info label="Interest Rate" value={`${form.interestRate}% (${form.rateType})`} />
            <Info label="Offer valid until" value={form.offerValidUntil} />
            <Info label="Monthly Payment" value={`£${form.monthlyPayment}`} />
          </CardContent>
        </Card>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/buyer-conveyancer/completion-date">Continue to Completion Date</Link>
          </Button>
          <Button variant="outline" onClick={() => setSubmitted(false)}>
            Edit details
          </Button>
        </div>
      </TransactionLayout>
    )
  }

  /* ----------------------------- fallback for not applicable ----------------------------- */
  if (mortgageNotApplicable) {
    return (
      <TransactionLayout
        currentStage="mortgage-offer"
        userRole="buyer-conveyancer"
        title="Mortgage Not Required"
        description="All parties have been notified that no mortgage is needed."
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <CheckCircle className="h-5 w-5" />
              Cash Purchase Confirmed
            </CardTitle>
            <CardDescription>
              The buyer is proceeding without a mortgage. All parties have been notified.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="font-medium">No Mortgage Required</div>
                  <div className="text-sm text-gray-600">
                    This is a cash purchase. The estate agent and seller conveyancer have been notified.
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/buyer-conveyancer/completion-date">Continue to Completion Date</Link>
          </Button>
          <Button variant="outline" onClick={() => setMortgageNotApplicable(false)}>
            Go back
          </Button>
        </div>
      </TransactionLayout>
    )
  }

  /* ------------------------------  form  ------------------------------ */
  return (
    <TransactionLayout
      currentStage="mortgage-offer"
      userRole="buyer-conveyancer"
      title="Submit Mortgage Offer"
      description="Provide the formal mortgage offer so the seller conveyancer can proceed."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ------ basic offer details ------ */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Mortgage details
            </CardTitle>
            <CardDescription>Information from the lender's offer letter</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field id="lenderName" label="Lender name *">
              <Input
                required
                placeholder="e.g. Halifax"
                value={form.lenderName}
                onChange={(e) => change("lenderName", e.target.value)}
              />
            </Field>

            <Field id="lenderReference" label="Lender reference">
              <Input
                placeholder="HX789456"
                value={form.lenderReference}
                onChange={(e) => change("lenderReference", e.target.value)}
              />
            </Field>

            <Field id="loanAmount" label="Loan amount (£) *">
              <Input
                type="number"
                required
                placeholder="320000"
                value={form.loanAmount}
                onChange={(e) => change("loanAmount", e.target.value)}
              />
            </Field>

            <Field id="propertyValuation" label="Property valuation (£) *">
              <Input
                type="number"
                required
                placeholder="400000"
                value={form.propertyValuation}
                onChange={(e) => change("propertyValuation", e.target.value)}
              />
            </Field>

            <Field id="interestRate" label="Interest rate (%) *">
              <Input
                type="number"
                step="0.01"
                required
                placeholder="4.25"
                value={form.interestRate}
                onChange={(e) => change("interestRate", e.target.value)}
              />
            </Field>

            <Field id="rateType" label="Rate type *">
              <Select value={form.rateType} onValueChange={(val) => change("rateType", val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose…" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Fixed</SelectItem>
                  <SelectItem value="variable">Variable</SelectItem>
                  <SelectItem value="tracker">Tracker</SelectItem>
                  <SelectItem value="discount">Discount</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field id="ratePeriod" label="Rate period">
              <Input
                placeholder="5 years"
                value={form.ratePeriod}
                onChange={(e) => change("ratePeriod", e.target.value)}
              />
            </Field>

            <Field id="monthlyPayment" label="Monthly payment (£) *">
              <Input
                type="number"
                required
                placeholder="1756"
                value={form.monthlyPayment}
                onChange={(e) => change("monthlyPayment", e.target.value)}
              />
            </Field>

            <Field id="ltvRatio" label="Loan-to-value ratio (%)">
              <Input
                type="number"
                placeholder="80"
                value={form.ltvRatio}
                onChange={(e) => change("ltvRatio", e.target.value)}
              />
            </Field>

            <Field id="offerValidUntil" label="Offer valid until *">
              <Input
                type="date"
                required
                value={form.offerValidUntil}
                onChange={(e) => change("offerValidUntil", e.target.value)}
              />
            </Field>
          </CardContent>
        </Card>

        {/* ------ special conditions ------ */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              Special conditions
            </CardTitle>
            <CardDescription>Tick any conditions included in the offer</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <CheckboxRow
                id="buildingInsurance"
                checked={form.buildingInsuranceRequired}
                onChange={(val) => change("buildingInsuranceRequired", val)}
                label="Building insurance required from completion"
              />

              <CheckboxRow
                id="lifeInsurance"
                checked={form.lifeInsuranceRequired}
                onChange={(val) => change("lifeInsuranceRequired", val)}
                label="Life insurance policy required"
              />
            </div>

            <Field id="specialConditions" label="Additional special conditions">
              <Textarea
                rows={3}
                placeholder="e.g. Retention of £5,000 until snagging complete…"
                value={form.specialConditions}
                onChange={(e) => change("specialConditions", e.target.value)}
              />
            </Field>
          </CardContent>
        </Card>

        {/* ------ extra notes ------ */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Additional notes
            </CardTitle>
            <CardDescription>Anything else the seller conveyancer should know</CardDescription>
          </CardHeader>
          <CardContent>
            <Field id="additionalNotes" label="Notes">
              <Textarea
                rows={4}
                placeholder="Optional comments…"
                value={form.additionalNotes}
                onChange={(e) => change("additionalNotes", e.target.value)}
              />
            </Field>
          </CardContent>
        </Card>

        {/* ------ submit buttons ------ */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
          <Button type="submit" disabled={submitting || processingNotApplicable} className="sm:flex-1">
            {submitting ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Submitting…
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Submit mortgage offer
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            disabled={submitting || processingNotApplicable}
            onClick={handleMortgageNotApplicable}
            className="sm:flex-1 bg-transparent"
          >
            {processingNotApplicable ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Processing…
              </>
            ) : (
              <>
                <X className="h-4 w-4 mr-2" />
                Mortgage not applicable
              </>
            )}
          </Button>
        </div>

        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
          <p className="font-medium mb-1">When to use "Mortgage not applicable":</p>
          <p>
            Click this button if the buyer is purchasing with cash and does not require a mortgage. All parties will be
            notified that no mortgage offer is needed for this transaction.
          </p>
        </div>
      </form>
    </TransactionLayout>
  )
}

/* --------------------------------------------------------------------- */
/*                          Re-usable helpers                            */
/* --------------------------------------------------------------------- */

function Field({
  id,
  label,
  children,
}: {
  id: string
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  )
}

function CheckboxRow({
  id,
  label,
  checked,
  onChange,
}: {
  id: string
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center gap-2">
      <Checkbox id={id} checked={checked} onCheckedChange={(v) => onChange(v as boolean)} />
      <Label htmlFor={id}>{label}</Label>
    </div>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  )
}
