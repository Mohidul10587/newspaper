"use client"

import Link from "next/link"
import { useLocale } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, FileText, Users, Settings, ImageIcon, MessageSquare } from "lucide-react"

export function QuickActions() {
  const locale = useLocale()

  const actions = [
    {
      title: locale === "bn" ? "নতুন নিউজ" : "New Article",
      description: locale === "bn" ? "নতুন নিউজ আর্টিকেল তৈরি করুন" : "Create a new news article",
      href: `/${locale}/admin/news/new`,
      icon: Plus,
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      title: locale === "bn" ? "ড্রাফট দেখুন" : "View Drafts",
      description: locale === "bn" ? "অসমাপ্ত আর্টিকেল দেখুন" : "Review pending drafts",
      href: `/${locale}/admin/news/drafts`,
      icon: FileText,
      color: "bg-orange-500 hover:bg-orange-600",
    },
    {
      title: locale === "bn" ? "কমেন্ট মডারেট" : "Moderate Comments",
      description: locale === "bn" ? "নতুন কমেন্ট অনুমোদন করুন" : "Review pending comments",
      href: `/${locale}/admin/comments`,
      icon: MessageSquare,
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      title: locale === "bn" ? "ইউজার ম্যানেজ" : "Manage Users",
      description: locale === "bn" ? "ইউজার অ্যাকাউন্ট পরিচালনা করুন" : "Manage user accounts",
      href: `/${locale}/admin/users`,
      icon: Users,
      color: "bg-purple-500 hover:bg-purple-600",
    },
    {
      title: locale === "bn" ? "অ্যাড ম্যানেজ" : "Manage Ads",
      description: locale === "bn" ? "বিজ্ঞাপন স্লট পরিচালনা করুন" : "Configure ad slots",
      href: `/${locale}/admin/ads`,
      icon: ImageIcon,
      color: "bg-pink-500 hover:bg-pink-600",
    },
    {
      title: locale === "bn" ? "সেটিংস" : "Site Settings",
      description: locale === "bn" ? "সাইট কনফিগারেশন আপডেট করুন" : "Update site configuration",
      href: `/${locale}/admin/settings`,
      icon: Settings,
      color: "bg-gray-500 hover:bg-gray-600",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>{locale === "bn" ? "দ্রুত কার্যক্রম" : "Quick Actions"}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {actions.map((action) => (
            <Link key={action.href} href={action.href}>
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-start gap-2 hover:shadow-md transition-shadow bg-transparent"
              >
                <div className={`p-2 rounded-md text-white ${action.color}`}>
                  <action.icon className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-sm">{action.title}</div>
                  <div className="text-xs text-muted-foreground">{action.description}</div>
                </div>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
