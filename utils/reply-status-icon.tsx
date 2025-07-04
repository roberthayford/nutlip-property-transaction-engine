import type { ReplyDecision } from "./reply-status-color"
import { CheckCircle2, XCircle, AlertOctagon, Clock } from "lucide-react"
import type { JSX } from "react"

/**
 * Returns a Lucide icon that represents an amendment reply decision.
 */
export function getReplyStatusIcon(decision: ReplyDecision): JSX.Element {
  switch (decision) {
    case "accepted":
      return <CheckCircle2 className="h-4 w-4" />
    case "rejected":
      return <XCircle className="h-4 w-4" />
    case "counter-proposal":
      return <AlertOctagon className="h-4 w-4" />
    default:
      return <Clock className="h-4 w-4" />
  }
}
