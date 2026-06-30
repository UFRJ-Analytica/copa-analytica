import type { HTMLAttributes } from "react"

import { cn } from "@/lib/utils"

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border border-border/70 bg-secondary px-2 py-0.5 text-[11px] font-medium tracking-[0.06em] text-secondary-foreground",
        className
      )}
      {...props}
    />
  )
}
