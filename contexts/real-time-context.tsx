"use client"

/* ------------------------------------------------------------------
   LIGHTWEIGHT IN-BROWSER REAL-TIME LAYER
   • Keeps updates, documents, and stageStatuses in localStorage
   • Synchronises across tabs via the "storage" event
   • Provides helpers demanded by the rest of the code-base
------------------------------------------------------------------- */

import { createContext, useContext, useState, useEffect, useCallback, startTransition, type ReactNode } from "react"

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type Role = "buyer" | "buyer-conveyancer" | "seller-conveyancer" | "estate-agent"

export interface RealtimeUpdate {
  id: string
  type:
    | "document_uploaded"
    | "status_changed"
    | "stage_completed"
    | "completion_date_confirmed"
    | "completion_date_rejected"
    | "completion_date_proposed"
    | "contract_exchanged"
  stage: string
  role: Role | "system"
  title: string
  description: string
  createdAt: string
  data?: Record<string, unknown>
  /** whether this update has been seen in the current tab */
  read?: boolean
}

export interface RealtimeDocument {
  id: string
  name: string
  stage: string
  uploadedBy: Role
  deliveredTo: Role
  uploadedAt: Date
  size: number
  status: "delivered" | "downloaded" | "reviewed"
  priority?: "standard" | "urgent" | "critical"
  coverMessage?: string
  deadline?: string
  downloadCount: number
}

type StageStatus = "pending" | "in-progress" | "completed" | "blocked"

export interface TransactionState {
  currentStage: string
  stageStatuses: Record<string, StageStatus>
}

/* ------------------------------------------------------------------ */
/*  Persistent helpers                                                 */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = "pte-realtime"

interface PersistedState {
  updates: RealtimeUpdate[]
  documents: RealtimeDocument[]
  transactionState: TransactionState
}

const defaultStages: Record<string, StageStatus> = {
  "offer-accepted": "completed",
  "proof-of-funds": "in-progress",
  conveyancers: "pending",
  "draft-contract": "pending",
  "search-survey": "pending",
  enquiries: "pending",
  "mortgage-offer": "pending",
  "completion-date": "pending",
  "contract-exchange": "pending",
  "nutlip-transaction-fee": "pending",
  "replies-to-requisitions": "pending",
  transaction: "pending",
}

// ---------- helpers -------------------------------------------------
function mergeWithDefaults(raw: Partial<PersistedState> | null): PersistedState {
  return {
    updates: raw?.updates ?? [],
    documents: raw?.documents ?? [],
    transactionState: raw?.transactionState ?? {
      currentStage: "proof-of-funds",
      stageStatuses: { ...defaultStages },
    },
  }
}

function getInitial(): PersistedState {
  if (typeof window === "undefined") {
    return mergeWithDefaults(null)
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<PersistedState>
      // Convert uploadedAt strings back to Date objects
      if (parsed.documents) {
        parsed.documents = parsed.documents.map((doc) => ({
          ...doc,
          uploadedAt: new Date(doc.uploadedAt),
        }))
      }
      return mergeWithDefaults(parsed)
    }
  } catch {
    /* ignore corrupt JSON and fall through */
  }

  return mergeWithDefaults(null)
}

function savePersisted(state: PersistedState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

/* ------------------------------------------------------------------ */
/*  Context                                                            */
/* ------------------------------------------------------------------ */

interface RealTimeCtx {
  updates: RealtimeUpdate[]
  documents: RealtimeDocument[]
  transactionState: TransactionState

  /* helpers */
  sendUpdate: (u: Omit<RealtimeUpdate, "id" | "createdAt">) => void
  addDocument: (doc: Omit<RealtimeDocument, "id" | "uploadedAt" | "downloadCount" | "status">) => void
  getDocumentsForRole: (role: Role, stage: string) => RealtimeDocument[]
  downloadDocument: (id: string, role: Role) => Promise<Blob | null>
  markDocumentAsReviewed: (id: string) => void
  resetToDefault: () => void
  markAsRead: (id: string) => void
}

const RealTimeContext = createContext<RealTimeCtx | undefined>(undefined)

/* ------------------------------------------------------------------ */
/*  Provider                                                           */
/* ------------------------------------------------------------------ */

export function RealTimeProvider({ children }: { children: ReactNode }) {
  const initial = getInitial()
  const [updates, setUpdates] = useState<RealtimeUpdate[]>(initial.updates)
  const [documents, setDocuments] = useState<RealtimeDocument[]>(initial.documents)
  const [transactionState, setTransactionState] = useState<TransactionState>(initial.transactionState)

  /* ---------- persist whenever any slice changes ------------------ */
  useEffect(() => {
    savePersisted({ updates, documents, transactionState })
  }, [updates, documents, transactionState])

  /* ---------- cross-tab sync -------------------------------------- */
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY || !e.newValue) return
      const incoming: PersistedState = mergeWithDefaults(JSON.parse(e.newValue))

      // Convert uploadedAt strings back to Date objects
      if (incoming.documents) {
        incoming.documents = incoming.documents.map((doc) => ({
          ...doc,
          uploadedAt: new Date(doc.uploadedAt),
        }))
      }

      // defer state update → avoids "setState during render" warning
      setTimeout(() => {
        startTransition(() => {
          setUpdates(incoming.updates)
          setDocuments(incoming.documents)
          setTransactionState(incoming.transactionState)
        })
      }, 0)
    }

    window.addEventListener("storage", handler)
    return () => window.removeEventListener("storage", handler)
  }, [])

  /* ---------- helpers --------------------------------------------- */

  const sendUpdate = useCallback<RealTimeCtx["sendUpdate"]>(
    (partial) => {
      const full: RealtimeUpdate = {
        ...partial,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        read: false,
      }

      // 1. updates
      setUpdates((prev) => {
        const next = [full, ...prev.slice(0, 49)]
        return next
      })

      // 2. stage status bookkeeping
      if (full.type === "stage_completed") {
        setTransactionState((prev) => ({
          ...prev,
          stageStatuses: { ...(prev?.stageStatuses ?? defaultStages), [full.stage]: "completed" },
        }))
      } else if (full.type === "status_changed") {
        setTransactionState((prev) => ({
          ...prev,
          stageStatuses: { ...(prev?.stageStatuses ?? defaultStages), [full.stage]: "in-progress" },
        }))
      } else if (full.type === "completion_date_confirmed") {
        setTransactionState((prev) => ({
          ...prev,
          stageStatuses: { ...(prev?.stageStatuses ?? defaultStages), "completion-date": "completed" },
        }))
      } else if (full.type === "contract_exchanged") {
        setTransactionState((prev) => ({
          ...prev,
          stageStatuses: { ...(prev?.stageStatuses ?? defaultStages), "contract-exchange": "completed" },
        }))
      }

      // 3. persist (after state is scheduled)
      setTimeout(() => savePersisted({ updates, documents, transactionState }), 0)

      // 4. dispatch storage event for same-tab listeners
      setTimeout(() => {
        window.dispatchEvent(
          new StorageEvent("storage", {
            key: STORAGE_KEY,
            newValue: JSON.stringify({
              updates: [full, ...updates],
              documents,
              transactionState,
            }),
          }),
        )
      }, 0)
    },
    [updates, documents, transactionState],
  )

  const addDocument = useCallback<RealTimeCtx["addDocument"]>(
    (docData) => {
      const fullDocument: RealtimeDocument = {
        ...docData,
        id: crypto.randomUUID(),
        uploadedAt: new Date(),
        downloadCount: 0,
        status: "delivered",
      }

      setDocuments((prev) => {
        const next = [fullDocument, ...prev]
        return next
      })

      // Persist and trigger storage event
      setTimeout(() => {
        const newState = { updates, documents: [fullDocument, ...documents], transactionState }
        savePersisted(newState)
        window.dispatchEvent(
          new StorageEvent("storage", {
            key: STORAGE_KEY,
            newValue: JSON.stringify(newState),
          }),
        )
      }, 0)
    },
    [updates, documents, transactionState],
  )

  const getDocumentsForRole = useCallback<RealTimeCtx["getDocumentsForRole"]>(
    (role, stage) => documents.filter((d) => d.deliveredTo === role && d.stage === stage),
    [documents],
  )

  const downloadDocument = useCallback<RealTimeCtx["downloadDocument"]>(
    async (id, role) => {
      const doc = documents.find((d) => d.id === id)
      if (!doc) return null

      const blob = new Blob([`Dummy content for ${doc.name}`], {
        type: "application/pdf",
      })

      setDocuments((prev) => {
        const next = prev.map((d) =>
          d.id === id ? { ...d, status: "downloaded", downloadCount: d.downloadCount + 1 } : d,
        )
        return next
      })

      sendUpdate({
        type: "status_changed",
        stage: doc.stage,
        role,
        title: "Document Downloaded",
        description: `${doc.name} downloaded by ${role}`,
      })

      return blob
    },
    [documents, sendUpdate],
  )

  const markDocumentAsReviewed = useCallback<RealTimeCtx["markDocumentAsReviewed"]>((id) => {
    setDocuments((prev) => prev.map((d) => (d.id === id ? { ...d, status: "reviewed" } : d)))
  }, [])

  const resetToDefault = useCallback<RealTimeCtx["resetToDefault"]>(() => {
    // Reset all state to defaults
    const defaultState = mergeWithDefaults(null)

    setUpdates(defaultState.updates)
    setDocuments(defaultState.documents)
    setTransactionState(defaultState.transactionState)

    // Clear all localStorage keys - comprehensive list
    const keysToRemove = [
      STORAGE_KEY,
      "transaction_updates",
      "completion_proposals",
      "pte-demo-realtime-state",
      "contract_issues",
      "shared_documents",
      "transaction_state",
      "nutlip_updates",
      "stage_completions",
      "enquiry_responses",
      "mortgage_applications",
      "search_results",
      "survey_reports",
      "completion_dates",
      "exchange_contracts",
      "requisition_replies",
      "transaction_fees",
      "document_uploads",
      "buyer_notifications",
      "seller_notifications",
      "conveyancer_updates",
      "estate_agent_updates",
      "stage_statuses",
      "buyer-conveyancer-requisitions",
      "buyer-sent-requisitions",
      "seller-requisitions-data",
      "seller-incoming-requisitions",
      "seller-requisition-replies",
      "buyer-requisition-drafts",
      "completion-date-proposals",
      "contract-exchange-data",
      "mortgage-offer-data",
      "search-survey-data",
      "enquiry-data",
      "draft-contract-data",
      "conveyancer-data",
      "proof-of-funds-data",
      "offer-accepted-data",
      "nutlip-fee-data",
      "transaction-completion-data",
    ]

    // Clear localStorage
    keysToRemove.forEach((key) => {
      try {
        localStorage.removeItem(key)
      } catch (error) {
        console.error(`Error removing ${key} from localStorage:`, error)
      }
    })

    // Clear all localStorage items that start with common prefixes
    const prefixesToClear = ["pte-", "nutlip-", "transaction-", "buyer-", "seller-", "estate-agent-", "conveyancer-"]

    try {
      const allKeys = Object.keys(localStorage)
      allKeys.forEach((key) => {
        if (prefixesToClear.some((prefix) => key.startsWith(prefix))) {
          localStorage.removeItem(key)
        }
      })
    } catch (error) {
      console.error("Error clearing prefixed localStorage items:", error)
    }

    // Clear sessionStorage as well
    try {
      const sessionKeys = Object.keys(sessionStorage)
      sessionKeys.forEach((key) => {
        if (prefixesToClear.some((prefix) => key.startsWith(prefix))) {
          sessionStorage.removeItem(key)
        }
      })
    } catch (error) {
      console.error("Error clearing sessionStorage:", error)
    }

    // Clear browser cache if possible (limited by browser security)
    if ("caches" in window) {
      caches
        .keys()
        .then((cacheNames) => {
          cacheNames.forEach((cacheName) => {
            if (cacheName.includes("nutlip") || cacheName.includes("pte")) {
              caches.delete(cacheName)
            }
          })
        })
        .catch((error) => {
          console.error("Error clearing cache:", error)
        })
    }

    // Save the default state
    savePersisted(defaultState)

    // Trigger storage events to notify other tabs/components
    setTimeout(() => {
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: STORAGE_KEY,
          newValue: JSON.stringify(defaultState),
          oldValue: null,
        }),
      )
    }, 0)

    // Dispatch custom event for complete reset
    window.dispatchEvent(
      new CustomEvent("platform-reset", {
        detail: { timestamp: new Date().toISOString() },
      }),
    )
  }, [])

  const markAsRead = useCallback<RealTimeCtx["markAsRead"]>((id) => {
    setUpdates((prev) => prev.map((u) => (u.id === id ? { ...u, read: true } : u)))
  }, [])

  /* ---------- context value --------------------------------------- */
  const ctx: RealTimeCtx = {
    updates,
    documents,
    transactionState,
    sendUpdate,
    addDocument,
    getDocumentsForRole,
    downloadDocument,
    markDocumentAsReviewed,
    resetToDefault,
    markAsRead,
  }

  return <RealTimeContext.Provider value={ctx}>{children}</RealTimeContext.Provider>
}

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

export function useRealTime() {
  const ctx = useContext(RealTimeContext)
  if (!ctx) throw new Error("useRealTime must be used within RealTimeProvider")
  return ctx
}
