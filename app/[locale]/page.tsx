"use client";

import { useTranslations, useLocale } from "next-intl";
import { NewsCard } from "@/components/news-card";
import { AdSlot } from "@/components/ad-slot";
import { BreakingNews } from "@/components/breaking-news";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Clock, ArrowRight } from "lucide-react";
import { mockNews, mockBreakingNews, mockCategories } from "@/lib/mock-data";
import Link from "next/link";

export default function HomePage() {
  const t = useTranslations();
  const locale = useLocale() as "en" | "bn";

  const featuredNews = mockNews.filter((news) => news.isFeatured);
  const latestNews = mockNews.slice(0, 6);
  const trendingNews = mockNews.sort((a, b) => b.views - a.views).slice(0, 5);

  return (
    <div className="min-h-screen">
      {/* Breaking News */}
      <BreakingNews news={mockBreakingNews} />

      {/* Header Ad */}
      <div className="container mx-auto px-4 py-4">
        <AdSlot
          slotKey="header_top"
          className="h-24"
          placeholder="Header Advertisement"
        />
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Main Featured News */}
          <div className="lg:col-span-2">
            {featuredNews[0] && (
              <NewsCard news={featuredNews[0]} variant="featured" />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending News */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  {locale === "bn" ? "জনপ্রিয় খবর" : "Trending News"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {trendingNews.slice(0, 4).map((news, index) => (
                  <div
                    key={news._id}
                    className="flex items-start gap-3 pb-3 border-b last:border-b-0"
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <Link href={`/${locale}/news/${news.slug}`}>
                        <h4 className="font-medium text-sm hover:text-primary transition-colors line-clamp-2">
                          {news.title[locale]}
                        </h4>
                      </Link>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {new Date(news.publishedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Sidebar Ad */}
            <AdSlot
              slotKey="sidebar_1"
              className="h-64"
              placeholder="Sidebar Advertisement"
            />
          </div>
        </div>

        {/* Categories Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              {locale === "bn" ? "বিভাগসমূহ" : "Categories"}
            </h2>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/${locale}/categories`}>
                {locale === "bn" ? "সব দেখুন" : "View All"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {mockCategories.map((category) => (
              <Link
                key={category.slug}
                href={`/${locale}/category/${category.slug}`}
              >
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4 text-center">
                    <h3 className="font-semibold text-sm mb-1">
                      {category.name[locale]}
                    </h3>
                    <Badge variant="secondary" className="text-xs">
                      {category.count} {locale === "bn" ? "টি খবর" : "news"}
                    </Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* In-Feed Ad */}
        <div className="mb-12">
          <AdSlot
            slotKey="in_feed_1"
            className="h-32"
            placeholder="In-Feed Advertisement"
          />
        </div>

        {/* Latest News Grid */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              {locale === "bn" ? "সর্বশেষ খবর" : "Latest News"}
            </h2>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/${locale}/news`}>
                {locale === "bn" ? "আরও খবর" : "More News"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestNews.map((news) => (
              <NewsCard key={news._id} news={news} />
            ))}
          </div>
        </div>

        {/* Bottom Ad */}
        <div className="mb-8">
          <AdSlot
            slotKey="bottom_banner"
            className="h-24"
            placeholder="Bottom Banner Advertisement"
          />
        </div>

        {/* More News Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h3 className="text-xl font-bold mb-4">
              {locale === "bn" ? "আরও খবর" : "More News"}
            </h3>
            <div className="space-y-4">
              {mockNews.slice(6, 10).map((news) => (
                <NewsCard key={news._id} news={news} variant="compact" />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {/* Popular Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {locale === "bn" ? "জনপ্রিয় বিভাগ" : "Popular Categories"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {mockCategories.slice(0, 4).map((category) => (
                  <Link
                    key={category.slug}
                    href={`/${locale}/category/${category.slug}`}
                    className="flex items-center justify-between p-2 rounded hover:bg-muted transition-colors"
                  >
                    <span className="font-medium">{category.name[locale]}</span>
                    <Badge variant="outline">{category.count}</Badge>
                  </Link>
                ))}
              </CardContent>
            </Card>

            {/* Sidebar Ad 2 */}
            <AdSlot
              slotKey="sidebar_2"
              className="h-64"
              placeholder="Sidebar Advertisement 2"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
