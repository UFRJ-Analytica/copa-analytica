import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SelectChipProps {
  active: boolean
  label: string
  onClick: () => void
}

export function SelectChip({ active, label, onClick }: SelectChipProps) {
  return (
    <Button
      variant={active ? "default" : "outline"}
      size="sm"
      className={cn(
        "rounded-full px-3",
        !active && "bg-background/80 text-muted-foreground"
      )}
      onClick={onClick}
    >
      {label}
    </Button>
  )
}
