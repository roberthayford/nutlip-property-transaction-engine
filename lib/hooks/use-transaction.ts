"use client"

import { useRealTime } from "@/contexts/real-time-context"

/**
 *  Hook that exposes the real-time transaction utilities used
 *  throughout the conveyancing workflow.
 *
 *  It gracefully falls back to safe no-ops if the context
 *  isn’t mounted (e.g. during isolated component previews).
 */
export const useTransaction = useRealTime
