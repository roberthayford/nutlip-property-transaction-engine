"use client"

import { createContext, useContext, useEffect, useRef, useState, type ReactNode, type MutableRefObject } from "react"

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

export type Role = "estate-agent" | "buyer-conveyancer" | "seller-conveyancer" | "buyer" | "seller"

export type StageId =
  | "offer-accepted"
  | "draft-contract"
  | "search-survey"
  | "replies-to-requisitions"
  | "completion-date"
  | "contract-exchange"
  | "completion"
  | "nutlip-transaction-fee"

export interface DocumentRecord {
  id: string
  name: string
  size: number
  stage: StageId
  recipientRole: Role
  uploadedBy: Role
  uploadedAt: Date
  priority?: "standard" | "urgent" | "high"
  status: "delivered" | "downloaded" | "reviewed"
  coverMessage?: string
  deadline?: string
}

export interface AmendmentRequest {
  id: string
  stage: StageId
  requestedBy: Role
  requestedTo: Role
  type: string
  priority: "low" | "medium" | "high"
  description: string
  proposedChange?: string
  deadline?: string
  affectedClauses: string[]
  status: "sent" | "acknowledged" | "replied"
  reply?: {
    decision: "accepted" | "rejected" | "counter-proposal"
    message: string
    counterProposal?: string
    repliedAt: Date
  }
}

export interface Update {
  id: string
  stage: StageId
  role: Role | "system"
  type: string
  title: string
  description?: string
  data?: unknown
  createdAt: Date
  read?: boolean
}

/* -------------------------------------------------------------------------- */
/*  Local-storage helpers                                                     */
/* -------------------------------------------------------------------------- */

const STORAGE_KEY = "pte-state-v3"

interface PersistedState {
  documents: DocumentRecord[]
  amendmentRequests: AmendmentRequest[]
  updates: Update[]
}

function reviveDates(raw: PersistedState): PersistedState {
  raw.documents.forEach((d) => (d.uploadedAt = new Date(d.uploadedAt)))
  raw.updates.forEach((u) => (u.createdAt = new Date(u.createdAt)))
  raw.amendmentRequests.forEach((r) => {
    if (r.reply) r.reply.repliedAt = new Date(r.reply.repliedAt)
  })
  return raw
}

function loadInitial(): PersistedState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return { documents: [], amendmentRequests: [], updates: [] }
    return reviveDates(JSON.parse(stored))
  } catch {
    return { documents: [], amendmentRequests: [], updates: [] }
  }
}

const deepEqual = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b)

/* -------------------------------------------------------------------------- */
/*  Context shape                                                             */
/* -------------------------------------------------------------------------- */

interface RealTimeCtx extends PersistedState {
  /* document helpers */
  getDocumentsForRole: (role: Role, stage: StageId) => DocumentRecord[]
  downloadDocument: (id: string, asRole: Role) => Promise<Blob | null>
  markDocumentAsReviewed: (id: string) => void

  /* amendment helpers */
  getAmendmentRequestsForRole: (role: Role, stage: StageId) => AmendmentRequest[]
  addAmendmentRequest: (req: Omit<AmendmentRequest, "id" | "status">) => void
  replyToAmendmentRequest: (id: string, reply: Omit<AmendmentRequest["reply"], "repliedAt">) => void

  /* update helpers */
  sendUpdate: (u: Omit<Update, "id" | "createdAt" | "read">) => void
  markAsRead: (id: string) => void
}

const RealTimeContext = createContext<RealTimeCtx | null>(null)

/* -------------------------------------------------------------------------- */
/*  Provider                                                                  */
/* -------------------------------------------------------------------------- */

export function RealTimeProvider({ children }: { children: ReactNode }) {
  const initial = loadInitial()
  const [documents, setDocuments] = useState<DocumentRecord[]>(initial.documents)
  const [amendmentRequests, setAmendmentRequests] = useState<AmendmentRequest[]>(initial.amendmentRequests)
  const [updates, setUpdates] = useState<Update[]>(initial.updates)

  /* snapshot — prevents localStorage ↔ React infinite loops */
  const snapshot: MutableRefObject<string> = useRef(JSON.stringify(initial))

  /* -------- persist whenever state changes -------- */
  useEffect(() => {
    const next = JSON.stringify({ documents, amendmentRequests, updates })
    if (next !== snapshot.current) {
      snapshot.current = next
      localStorage.setItem(STORAGE_KEY, next)
    }
  }, [documents, amendmentRequests, updates])

  /* -------- cross-tab sync -------- */
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key !== STORAGE_KEY || !e.newValue || e.newValue === snapshot.current) return
      try {
        const parsed = reviveDates(JSON.parse(e.newValue) as PersistedState)
        if (!deepEqual(parsed.documents, documents)) setDocuments(parsed.documents)
        if (!deepEqual(parsed.amendmentRequests, amendmentRequests)) setAmendmentRequests(parsed.amendmentRequests)
        if (!deepEqual(parsed.updates, updates)) setUpdates(parsed.updates)
      } catch {
        /* ignore bad payload */
      }
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [documents, amendmentRequests, updates])

  /* ---------------------------------------------------------------------- */
  /*  Helper implementations                                                */
  /* ---------------------------------------------------------------------- */

  const getDocumentsForRole = (role: Role, stage: StageId) =>
    documents.filter((d) => d.recipientRole === role && d.stage === stage)

  const getAmendmentRequestsForRole = (role: Role, stage: StageId) =>
    amendmentRequests.filter((r) => r.requestedTo === role && r.stage === stage)

  const downloadDocument = async (id: string, asRole: Role) => {
    const doc = documents.find((d) => d.id === id)
    if (!doc) return null
    await new Promise((r) => setTimeout(r, 500))
    setDocuments((prev) => prev.map((d) => (d.id === id ? { ...d, status: "downloaded" as const } : d)))
    sendUpdate({
      stage: doc.stage,
      role: asRole,
      type: "document_downloaded",
      title: "Document downloaded",
      description: `${doc.name} downloaded by ${asRole}`,
    })
    return new Blob([`Dummy content of ${doc.name}`], { type: "application/pdf" })
  }

  const markDocumentAsReviewed = (id: string) =>
    setDocuments((prev) => prev.map((d) => (d.id === id ? { ...d, status: "reviewed" } : d)))

  const addAmendmentRequest = (req: Omit<AmendmentRequest, "id" | "status">) => {
    const newReq: AmendmentRequest = { ...req, id: crypto.randomUUID(), status: "sent" }
    setAmendmentRequests((prev) => [...prev, newReq])
    sendUpdate({
      stage: newReq.stage,
      role: newReq.requestedBy,
      type: "amendment_requested",
      title: "Amendment requested",
      description: `${newReq.type} amendment requested`,
      data: { priority: newReq.priority },
    })
  }

  const replyToAmendmentRequest: RealTimeCtx["replyToAmendmentRequest"] = (id, reply) => {
    let stage: StageId | undefined
    let responder: Role | undefined

    setAmendmentRequests((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r
        stage = r.stage
        responder = r.requestedTo
        return {
          ...r,
          status: "replied",
          reply: { ...reply, repliedAt: new Date() },
        }
      }),
    )

    if (stage && responder) {
      sendUpdate({
        stage,
        role: responder,
        type: "amendment_replied",
        title: "Amendment reply sent",
        description: "Reply sent for amendment request",
        data: { amendmentId: id, decision: reply.decision },
      })
    }
  }

  const sendUpdate = (partial: Omit<Update, "id" | "createdAt" | "read">) => {
    const full: Update = {
      ...partial,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      read: false,
    }
    setUpdates((prev) => [full, ...prev.slice(0, 199)])
  }

  const markAsRead = (id: string) => setUpdates((prev) => prev.map((u) => (u.id === id ? { ...u, read: true } : u)))

  /* ---------------------------------------------------------------------- */
  /*  Provider value                                                        */
  /* ---------------------------------------------------------------------- */

  const value: RealTimeCtx = {
    documents,
    amendmentRequests,
    updates,
    getDocumentsForRole,
    getAmendmentRequestsForRole,
    downloadDocument,
    markDocumentAsReviewed,
    addAmendmentRequest,
    replyToAmendmentRequest,
    sendUpdate,
    markAsRead,
  }

  return <RealTimeContext.Provider value={value}>{children}</RealTimeContext.Provider>
}

/* -------------------------------------------------------------------------- */
/*  Hook                                                                      */
/* -------------------------------------------------------------------------- */

export function useRealTime() {
  const ctx = useContext(RealTimeContext)
  if (!ctx) throw new Error("useRealTime must be used within RealTimeProvider")
  return ctx
}
