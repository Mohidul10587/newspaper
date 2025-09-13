import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { getTranslations } from "next-intl/server"
import { NewsContent } from "@/components/news-content"
import { SocialShare } from "@/components/social-share"
import { RelatedArticles } from "@/components/related-articles"
import { CommentSection } from "@/components/comment-section"
import { AdSlot } from "@/components/ad-slot"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Clock, Eye, User, Calendar } from "lucide-react"
import { mockNews } from "@/lib/mock-data"

interface NewsPageProps {
  params: {
    locale: string
    slug: string
  }
}

// Generate static params for ISR
export async function generateStaticParams() {
  // In production, this would fetch from your database
  return mockNews.map((news) => ({
    slug: news.slug,
  }))
}

// Generate metadata for SEO
export async function generateMetadata({ params }: NewsPageProps): Promise<Metadata> {
  const { locale, slug } = params

  // In production, fetch the actual news article
  const news = mockNews.find((n) => n.slug === slug)

  if (!news) {
    return {
      title: "Article Not Found",
    }
  }

  const title = news.title[locale as "en" | "bn"]
  const description = news.excerpt[locale as "en" | "bn"]

  return {
    title: `${title} | News Portal`,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: news.publishedAt,
      authors: ["News Portal"],
      images: [
        {
          url: news.coverImage || "/news-collage.png",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [news.coverImage || "/news-collage.png"],
    },
  }
}

export default async function NewsPage({ params }: NewsPageProps) {
  const { locale, slug } = params
  const t = await getTranslations()

  // In production, this would be a database query
  const news = mockNews.find((n) => n.slug === slug)

  if (!news) {
    notFound()
  }

  const currentLocale = locale as "en" | "bn"

  // Mock related articles
  const relatedArticles = mockNews
    .filter((n) => n._id !== news._id && n.category.slug === news.category.slug)
    .slice(0, 4)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(currentLocale === "bn" ? "bn-BD" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatViews = (views: number) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`
    }
    return views.toString()
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={`/${locale}`}>{t("navigation.home")}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/${locale}/category/${news.category.slug}`}>
                {news.category.name[currentLocale]}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="line-clamp-1">{news.title[currentLocale]}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <article className="lg:col-span-3">
            {/* Article Header */}
            <header className="mb-8">
              <div className="mb-4">
                <Badge variant="secondary" className="bg-primary text-primary-foreground">
                  {news.category.name[currentLocale]}
                </Badge>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">{news.title[currentLocale]}</h1>

              <p className="text-xl text-muted-foreground mb-6 leading-relaxed">{news.excerpt[currentLocale]}</p>

              {/* Article Meta */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{currentLocale === "bn" ? "সংবাদদাতা" : "Reporter"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={news.publishedAt}>{formatDate(news.publishedAt)}</time>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>
                    {formatViews(news.views)} {currentLocale === "bn" ? "বার দেখা হয়েছে" : "views"}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{currentLocale === "bn" ? "৫ মিনিট পড়ার সময়" : "5 min read"}</span>
                </div>
              </div>

              {/* Social Share */}
              <SocialShare title={news.title[currentLocale]} url={`/${locale}/news/${slug}`} />
            </header>

            {/* Featured Image */}
            {news.coverImage && (
              <div className="mb-8">
                <Image
                  src={news.coverImage || "/placeholder.svg"}
                  alt={news.title[currentLocale]}
                  width={800}
                  height={450}
                  className="w-full h-auto rounded-lg"
                  priority
                />
              </div>
            )}

            {/* Article Content */}
            <NewsContent content={news.content[currentLocale]} />

            {/* In-Article Ad */}
            <div className="my-8">
              <AdSlot slotKey="in_article_1" className="h-32" placeholder="In-Article Advertisement" />
            </div>

            {/* Article Tags */}
            <div className="mt-8 pt-6 border-t">
              <div className="flex flex-wrap gap-2">
                <span className="text-sm font-medium text-muted-foreground">
                  {currentLocale === "bn" ? "ট্যাগসমূহ:" : "Tags:"}
                </span>
                <Badge variant="outline">#{news.category.slug}</Badge>
                <Badge variant="outline">#news</Badge>
                <Badge variant="outline">#breaking</Badge>
              </div>
            </div>

            <Separator className="my-8" />

            {/* Comments Section */}
            <CommentSection newsId={news._id} />
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            {/* Sidebar Ad */}
            <AdSlot slotKey="article_sidebar_1" className="h-64" placeholder="Article Sidebar Ad" />

            {/* Related Articles */}
            <RelatedArticles articles={relatedArticles} />

            {/* Popular Articles */}
            <div className="bg-muted/30 rounded-lg p-4">
              <h3 className="font-semibold mb-4">{currentLocale === "bn" ? "জনপ্রিয় খবর" : "Popular News"}</h3>
              <div className="space-y-3">
                {mockNews.slice(0, 3).map((article, index) => (
                  <div key={article._id} className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <Link href={`/${locale}/news/${article.slug}`}>
                        <h4 className="font-medium text-sm hover:text-primary transition-colors line-clamp-2">
                          {article.title[currentLocale]}
                        </h4>
                      </Link>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatViews(article.views)} {currentLocale === "bn" ? "ভিউ" : "views"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Sidebar Ad */}
            <AdSlot slotKey="article_sidebar_2" className="h-48" placeholder="Bottom Sidebar Ad" />
          </aside>
        </div>
      </div>
    </div>
  )
}

// Enable ISR with revalidation
export const revalidate = 300 // Revalidate every 5 minutes
