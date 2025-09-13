"use client"

import { useEffect, useState } from "react"
import { useTranslations, useLocale } from "next-intl"
import { Badge } from "@/components/ui/badge"
import { AlertCircle } from "lucide-react"

interface BreakingNewsProps {
  news: Array<{
    title: { bn: string; en: string }
    slug: string
  }>
}

export function BreakingNews({ news }: BreakingNewsProps) {
  const t = useTranslations()
  const locale = useLocale() as "en" | "bn"
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (news.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % news.length)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [news.length])

  if (!news.length) return null

  return (
    <div className="bg-destructive text-destructive-foreground py-2">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 flex-shrink-0">
            <AlertCircle className="h-4 w-4 animate-pulse" />
            <Badge variant="secondary" className="bg-destructive-foreground text-destructive">
              {locale === "bn" ? "জরুরি খবর" : "BREAKING"}
            </Badge>
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium animate-pulse">{news[currentIndex]?.title[locale]}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
