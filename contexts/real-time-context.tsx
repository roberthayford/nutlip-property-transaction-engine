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
    | "amendment_requested"
    | "amendment_replied"
    | "platform_reset"
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

export interface AmendmentRequest {
  id: string
  stage: string
  requestedBy: Role
  requestedTo: Role
  type: string
  priority: "low" | "medium" | "high"
  description: string
  proposedChange: string
  deadline?: string
  affectedClauses: string[]
  status: "pending" | "acknowledged" | "replied" | "resolved" | "rejected"
  createdAt: Date
  reply?: {
    message: string
    decision: "accepted" | "rejected" | "counter-proposal"
    counterProposal?: string
    repliedAt: Date
    repliedBy: Role
  }
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
  amendmentRequests: AmendmentRequest[]
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
    amendmentRequests: raw?.amendmentRequests ?? [],
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
      // Convert date strings back to Date objects
      if (parsed.documents) {
        parsed.documents = parsed.documents.map((doc) => ({
          ...doc,
          uploadedAt: new Date(doc.uploadedAt),
        }))
      }
      if (parsed.amendmentRequests) {
        parsed.amendmentRequests = parsed.amendmentRequests.map((req) => ({
          ...req,
          createdAt: new Date(req.createdAt),
          reply: req.reply
            ? {
                ...req.reply,
                repliedAt: new Date(req.reply.repliedAt),
              }
            : undefined,
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
  amendmentRequests: AmendmentRequest[]
  transactionState: TransactionState

  /* helpers */
  sendUpdate: (u: Omit<RealtimeUpdate, "id" | "createdAt">) => void
  addDocument: (doc: Omit<RealtimeDocument, "id" | "uploadedAt" | "downloadCount" | "status">) => void
  addAmendmentRequest: (req: Omit<AmendmentRequest, "id" | "createdAt" | "status">) => void
  replyToAmendmentRequest: (id: string, reply: Omit<AmendmentRequest["reply"], "repliedAt" | "repliedBy">) => void
  getDocumentsForRole: (role: Role, stage: string) => RealtimeDocument[]
  getAmendmentRequestsForRole: (role: Role, stage: string) => AmendmentRequest[]
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
  const [amendmentRequests, setAmendmentRequests] = useState<AmendmentRequest[]>(initial.amendmentRequests)
  const [transactionState, setTransactionState] = useState<TransactionState>(initial.transactionState)

  /* ---------- persist whenever any slice changes ------------------ */
  useEffect(() => {
    savePersisted({ updates, documents, amendmentRequests, transactionState })
  }, [updates, documents, amendmentRequests, transactionState])

  /* ---------- cross-tab sync -------------------------------------- */
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY || !e.newValue) return
      const incoming: PersistedState = mergeWithDefaults(JSON.parse(e.newValue))

      // Convert date strings back to Date objects
      if (incoming.documents) {
        incoming.documents = incoming.documents.map((doc) => ({
          ...doc,
          uploadedAt: new Date(doc.uploadedAt),
        }))
      }
      if (incoming.amendmentRequests) {
        incoming.amendmentRequests = incoming.amendmentRequests.map((req) => ({
          ...req,
          createdAt: new Date(req.createdAt),
          reply: req.reply
            ? {
                ...req.reply,
                repliedAt: new Date(req.reply.repliedAt),
              }
            : undefined,
        }))
      }

      // defer state update → avoids "setState during render" warning
      setTimeout(() => {
        startTransition(() => {
          setUpdates(incoming.updates)
          setDocuments(incoming.documents)
          setAmendmentRequests(incoming.amendmentRequests)
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

      // 3. persist and trigger storage event
      setTimeout(() => {
        const newState = { updates: [full, ...updates], documents, amendmentRequests, transactionState }
        savePersisted(newState)
        window.dispatchEvent(
          new StorageEvent("storage", {
            key: STORAGE_KEY,
            newValue: JSON.stringify(newState),
          }),
        )
      }, 0)
    },
    [updates, documents, amendmentRequests, transactionState],
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
        const newState = { updates, documents: [fullDocument, ...documents], amendmentRequests, transactionState }
        savePersisted(newState)
        window.dispatchEvent(
          new StorageEvent("storage", {
            key: STORAGE_KEY,
            newValue: JSON.stringify(newState),
          }),
        )
      }, 0)
    },
    [updates, documents, amendmentRequests, transactionState],
  )

  const addAmendmentRequest = useCallback<RealTimeCtx["addAmendmentRequest"]>(
    (reqData) => {
      const fullRequest: AmendmentRequest = {
        ...reqData,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        status: "pending",
      }

      setAmendmentRequests((prev) => {
        const next = [fullRequest, ...prev]
        return next
      })

      // Send real-time update
      sendUpdate({
        type: "amendment_requested",
        stage: reqData.stage,
        role: reqData.requestedBy,
        title: "Amendment Request Sent",
        description: `${reqData.type} amendment requested`,
        data: {
          amendmentId: fullRequest.id,
          amendmentType: reqData.type,
          priority: reqData.priority,
        },
      })

      // Persist and trigger storage event
      setTimeout(() => {
        const newState = {
          updates,
          documents,
          amendmentRequests: [fullRequest, ...amendmentRequests],
          transactionState,
        }
        savePersisted(newState)
        window.dispatchEvent(
          new StorageEvent("storage", {
            key: STORAGE_KEY,
            newValue: JSON.stringify(newState),
          }),
        )
      }, 0)
    },
    [updates, documents, amendmentRequests, transactionState, sendUpdate],
  )

  const replyToAmendmentRequest = useCallback<RealTimeCtx["replyToAmendmentRequest"]>(
    (id, replyData) => {
      setAmendmentRequests((prev) => {
        const updatedRequests = prev.map((req) => {
          if (req.id === id) {
            const updatedReq = {
              ...req,
              status: "replied" as const,
              reply: {
                ...replyData,
                repliedAt: new Date(),
                repliedBy: req.requestedTo,
              },
            }

            // Send real-time update
            sendUpdate({
              type: "amendment_replied",
              stage: req.stage,
              role: req.requestedTo,
              title: "Amendment Reply Sent",
              description: `Reply sent for ${req.type} amendment request`,
              data: {
                amendmentId: id,
                decision: replyData.decision,
                originalRequestBy: req.requestedBy,
              },
            })

            return updatedReq
          }
          return req
        })

        // Persist and trigger storage event immediately
        setTimeout(() => {
          const newState = { updates, documents, amendmentRequests: updatedRequests, transactionState }
          savePersisted(newState)
          window.dispatchEvent(
            new StorageEvent("storage", {
              key: STORAGE_KEY,
              newValue: JSON.stringify(newState),
            }),
          )
        }, 0)

        return updatedRequests
      })
    },
    [updates, documents, transactionState, sendUpdate],
  )

  const getDocumentsForRole = useCallback<RealTimeCtx["getDocumentsForRole"]>(
    (role, stage) => documents.filter((d) => d.deliveredTo === role && d.stage === stage),
    [documents],
  )

  const getAmendmentRequestsForRole = useCallback<RealTimeCtx["getAmendmentRequestsForRole"]>(
    (role, stage) => amendmentRequests.filter((req) => req.requestedTo === role && req.stage === stage),
    [amendmentRequests],
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
    console.log("🔄 Starting platform reset...")

    // Send platform reset update before clearing everything
    const resetUpdate: RealtimeUpdate = {
      id: crypto.randomUUID(),
      type: "platform_reset",
      stage: "system",
      role: "system",
      title: "Platform Reset",
      description: "Platform has been reset to default state",
      createdAt: new Date().toISOString(),
      read: false,
    }

    // Reset all state to defaults
    const defaultState = mergeWithDefaults(null)

    // Add the reset update to the default state
    defaultState.updates = [resetUpdate]

    setUpdates(defaultState.updates)
    setDocuments(defaultState.documents)
    setAmendmentRequests(defaultState.amendmentRequests)
    setTransactionState(defaultState.transactionState)

    // Comprehensive localStorage cleanup
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
      "amendment-requests",
      "document-cache",
      "user-preferences",
      "notification-settings",
      "activity-feed",
      "real-time-updates",
    ]

    // Clear specific localStorage keys
    keysToRemove.forEach((key) => {
      try {
        localStorage.removeItem(key)
        console.log(`✅ Removed localStorage key: ${key}`)
      } catch (error) {
        console.error(`❌ Error removing ${key} from localStorage:`, error)
      }
    })

    // Clear all localStorage items that start with common prefixes
    const prefixesToClear = [
      "pte-",
      "nutlip-",
      "transaction-",
      "buyer-",
      "seller-",
      "estate-agent-",
      "conveyancer-",
      "amendment-",
      "document-",
      "stage-",
      "completion-",
      "contract-",
      "mortgage-",
      "search-",
      "enquiry-",
      "requisition-",
    ]

    try {
      const allKeys = Object.keys(localStorage)
      let clearedCount = 0
      allKeys.forEach((key) => {
        if (prefixesToClear.some((prefix) => key.startsWith(prefix))) {
          localStorage.removeItem(key)
          clearedCount++
        }
      })
      console.log(`✅ Cleared ${clearedCount} prefixed localStorage items`)
    } catch (error) {
      console.error("❌ Error clearing prefixed localStorage items:", error)
    }

    // Clear sessionStorage as well
    try {
      const sessionKeys = Object.keys(sessionStorage)
      let sessionClearedCount = 0
      sessionKeys.forEach((key) => {
        if (prefixesToClear.some((prefix) => key.startsWith(prefix))) {
          sessionStorage.removeItem(key)
          sessionClearedCount++
        }
      })
      console.log(`✅ Cleared ${sessionClearedCount} sessionStorage items`)
    } catch (error) {
      console.error("❌ Error clearing sessionStorage:", error)
    }

    // Clear IndexedDB if available
    if ("indexedDB" in window) {
      try {
        const deleteDB = (dbName: string) => {
          const deleteReq = indexedDB.deleteDatabase(dbName)
          deleteReq.onsuccess = () => console.log(`✅ Deleted IndexedDB: ${dbName}`)
          deleteReq.onerror = () => console.error(`❌ Error deleting IndexedDB: ${dbName}`)
        }

        // Common database names that might be used
        const dbNames = ["nutlip-db", "pte-db", "transaction-db", "documents-db"]
        dbNames.forEach(deleteDB)
      } catch (error) {
        console.error("❌ Error clearing IndexedDB:", error)
      }
    }

    // Clear browser cache if possible (limited by browser security)
    if ("caches" in window) {
      caches
        .keys()
        .then((cacheNames) => {
          const promises = cacheNames
            .filter(
              (cacheName) =>
                cacheName.includes("nutlip") || cacheName.includes("pte") || cacheName.includes("transaction"),
            )
            .map((cacheName) => {
              console.log(`🗑️ Deleting cache: ${cacheName}`)
              return caches.delete(cacheName)
            })

          return Promise.all(promises)
        })
        .then((results) => {
          console.log(`✅ Cleared ${results.filter(Boolean).length} cache entries`)
        })
        .catch((error) => {
          console.error("❌ Error clearing cache:", error)
        })
    }

    // Clear any Web SQL databases (deprecated but might exist)
    if ("openDatabase" in window) {
      try {
        // This is deprecated and not widely supported, but included for completeness
        console.log("🗑️ Web SQL cleanup attempted (deprecated feature)")
      } catch (error) {
        console.error("❌ Error clearing Web SQL:", error)
      }
    }

    // Save the default state with reset notification
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

    // Dispatch custom events for complete reset
    window.dispatchEvent(
      new CustomEvent("platform-reset", {
        detail: {
          timestamp: new Date().toISOString(),
          resetId: crypto.randomUUID(),
        },
      }),
    )

    // Dispatch event to clear any component-level state
    window.dispatchEvent(
      new CustomEvent("clear-component-state", {
        detail: { timestamp: new Date().toISOString() },
      }),
    )

    console.log("🎉 Platform reset completed successfully!")
  }, [])

  const markAsRead = useCallback<RealTimeCtx["markAsRead"]>((id) => {
    setUpdates((prev) => prev.map((u) => (u.id === id ? { ...u, read: true } : u)))
  }, [])

  /* ---------- context value --------------------------------------- */
  const ctx: RealTimeCtx = {
    updates,
    documents,
    amendmentRequests,
    transactionState,
    sendUpdate,
    addDocument,
    addAmendmentRequest,
    replyToAmendmentRequest,
    getDocumentsForRole,
    getAmendmentRequestsForRole,
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
