export type ReplyDecision = "accepted" | "rejected" | "counter-proposal"

/**
 * Returns the Tailwind classes for an amendment-reply badge.
 * Example: getReplyStatusColor("accepted") ➜ "bg-green-100 text-green-800 border-green-300"
 */
export function getReplyStatusColor(decision: ReplyDecision): string {
  switch (decision) {
    case "accepted":
      return "bg-green-100 text-green-800 border-green-300"
    case "rejected":
      return "bg-red-100 text-red-800 border-red-300"
    case "counter-proposal":
      return "bg-blue-100 text-blue-800 border-blue-300"
    default:
      return "bg-grey-100 text-grey-800 border-grey-300"
  }
}
