"use client"

import Link from "next/link"
import Image from "next/image"
import { useLocale, useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock } from "lucide-react"

interface RelatedArticlesProps {
  articles: Array<{
    _id: string
    title: { bn: string; en: string }
    slug: string
    coverImage?: string
    publishedAt: string
    views: number
  }>
}

export function RelatedArticles({ articles }: RelatedArticlesProps) {
  const locale = useLocale() as "en" | "bn"
  const t = useTranslations()

  if (!articles.length) return null

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(locale === "bn" ? "bn-BD" : "en-US", {
      month: "short",
      day: "numeric",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{locale === "bn" ? "সম্পর্কিত খবর" : "Related Articles"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {articles.map((article) => (
          <div key={article._id} className="flex gap-3">
            <div className="flex-shrink-0">
              <Image
                src={article.coverImage || `/placeholder.svg?height=60&width=80&query=news`}
                alt={article.title[locale]}
                width={80}
                height={60}
                className="w-16 h-12 object-cover rounded"
              />
            </div>
            <div className="flex-1">
              <Link href={`/${locale}/news/${article.slug}`}>
                <h4 className="font-medium text-sm hover:text-primary transition-colors line-clamp-2 mb-1">
                  {article.title[locale]}
                </h4>
              </Link>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {formatDate(article.publishedAt)}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
