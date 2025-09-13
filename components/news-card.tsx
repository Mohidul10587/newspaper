"use client"

import Link from "next/link"
import Image from "next/image"
import { useLocale } from "next-intl"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Eye } from "lucide-react"

interface NewsCardProps {
  news: {
    _id: string
    title: { bn: string; en: string }
    excerpt: { bn: string; en: string }
    slug: string
    coverImage?: string
    category: {
      name: { bn: string; en: string }
      slug: string
    }
    publishedAt: string
    views: number
    isFeatured: boolean
  }
  variant?: "default" | "featured" | "compact"
  className?: string
}

export function NewsCard({ news, variant = "default", className = "" }: NewsCardProps) {
  const locale = useLocale() as "en" | "bn"

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(locale === "bn" ? "bn-BD" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatViews = (views: number) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`
    }
    return views.toString()
  }

  if (variant === "featured") {
    return (
      <Card className={`overflow-hidden hover:shadow-lg transition-shadow ${className}`}>
        <div className="relative">
          <Image
            src={news.coverImage || `/placeholder.svg?height=400&width=600&query=news`}
            alt={news.title[locale]}
            width={600}
            height={400}
            className="w-full h-64 md:h-80 object-cover"
          />
          <div className="absolute top-4 left-4">
            <Badge variant="secondary" className="bg-primary text-primary-foreground">
              {news.category.name[locale]}
            </Badge>
          </div>
        </div>
        <CardContent className="p-6">
          <Link href={`/${locale}/news/${news.slug}`}>
            <h2 className="text-2xl font-bold mb-3 hover:text-primary transition-colors line-clamp-2">
              {news.title[locale]}
            </h2>
          </Link>
          <p className="text-muted-foreground mb-4 line-clamp-3">{news.excerpt[locale]}</p>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {formatDate(news.publishedAt)}
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {formatViews(news.views)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (variant === "compact") {
    return (
      <Card className={`overflow-hidden hover:shadow-md transition-shadow ${className}`}>
        <div className="flex">
          <div className="flex-shrink-0">
            <Image
              src={news.coverImage || `/placeholder.svg?height=120&width=160&query=news`}
              alt={news.title[locale]}
              width={160}
              height={120}
              className="w-20 h-20 md:w-24 md:h-24 object-cover"
            />
          </div>
          <CardContent className="flex-1 p-4">
            <Badge variant="outline" className="text-xs mb-2">
              {news.category.name[locale]}
            </Badge>
            <Link href={`/${locale}/news/${news.slug}`}>
              <h3 className="font-semibold text-sm md:text-base mb-2 hover:text-primary transition-colors line-clamp-2">
                {news.title[locale]}
              </h3>
            </Link>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {formatDate(news.publishedAt)}
            </div>
          </CardContent>
        </div>
      </Card>
    )
  }

  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-shadow ${className}`}>
      <div className="relative">
        <Image
          src={news.coverImage || `/placeholder.svg?height=240&width=400&query=news`}
          alt={news.title[locale]}
          width={400}
          height={240}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="bg-primary text-primary-foreground text-xs">
            {news.category.name[locale]}
          </Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <Link href={`/${locale}/news/${news.slug}`}>
          <h3 className="font-semibold text-lg mb-2 hover:text-primary transition-colors line-clamp-2">
            {news.title[locale]}
          </h3>
        </Link>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{news.excerpt[locale]}</p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDate(news.publishedAt)}
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {formatViews(news.views)}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
