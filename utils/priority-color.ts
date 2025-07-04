export type Priority = "low" | "medium" | "high"

/**
 * Returns the Tailwind classes for a priority badge.
 * Example: getPriorityColor("high") ➜ "bg-red-100 text-red-800 border-red-300"
 */
export function getPriorityColor(priority: Priority): string {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800 border-red-300"
    case "medium":
      return "bg-amber-100 text-amber-800 border-amber-300"
    case "low":
      return "bg-green-100 text-green-800 border-green-300"
    default:
      return "bg-gray-100 text-gray-800 border-gray-300"
  }
}
