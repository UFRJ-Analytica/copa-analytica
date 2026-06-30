import { ArrowClockwise } from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function AppError({
  message,
  onRetry,
}: {
  message: string
  onRetry: () => Promise<void>
}) {
  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6 lg:px-8">
      <Card>
        <CardHeader>
          <CardTitle>Falha ao carregar a plataforma</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm leading-6 text-muted-foreground">{message}</p>
          <Button onClick={() => void onRetry()}>
            <ArrowClockwise />
            Tentar novamente
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
