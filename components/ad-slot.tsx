"use client"

import { useEffect, useState } from "react"

interface AdSlotProps {
  slotKey: string
  className?: string
  placeholder?: string
}

export function AdSlot({ slotKey, className = "", placeholder }: AdSlotProps) {
  const [adContent, setAdContent] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // In a real implementation, this would fetch from the API
    // For now, we'll show placeholder content
    setTimeout(() => {
      setAdContent(null) // No ads loaded yet
      setIsLoading(false)
    }, 100)
  }, [slotKey])

  if (isLoading) {
    return (
      <div className={`bg-muted animate-pulse rounded-lg ${className}`}>
        <div className="flex items-center justify-center h-full text-muted-foreground text-sm">Loading ad...</div>
      </div>
    )
  }

  if (!adContent) {
    return (
      <div className={`bg-muted/30 border-2 border-dashed border-muted-foreground/20 rounded-lg ${className}`}>
        <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
          {placeholder || `Ad Slot: ${slotKey}`}
        </div>
      </div>
    )
  }

  return <div className={className} dangerouslySetInnerHTML={{ __html: adContent }} />
}
