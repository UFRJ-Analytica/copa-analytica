import { cn } from "@/lib/utils"

export function Separator({
  className,
  orientation = "horizontal",
}: {
  className?: string
  orientation?: "horizontal" | "vertical"
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        orientation === "horizontal"
          ? "h-px w-full bg-border/70"
          : "h-full w-px bg-border/70",
        className
      )}
    />
  )
}
