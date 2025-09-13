"use client"

import { useLocale } from "next-intl"
import { StatsCard } from "@/components/stats-card"
import { RecentActivity } from "@/components/recent-activity"
import { QuickActions } from "@/components/quick-actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Users, MessageSquare, Eye, TrendingUp, Calendar, Clock, CheckCircle } from "lucide-react"

export default function AdminDashboard() {
  const locale = useLocale()

  // Mock data - in production, this would come from your API
  const stats = {
    totalArticles: 156,
    totalUsers: 1234,
    totalComments: 892,
    totalViews: 45678,
    articlesThisMonth: 23,
    newUsersThisMonth: 89,
    commentsThisMonth: 156,
    viewsThisMonth: 12345,
  }

  const pendingItems = {
    drafts: 8,
    pendingComments: 12,
    scheduledPosts: 3,
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold">{locale === "bn" ? "ড্যাশবোর্ডে স্বাগতম" : "Welcome to Dashboard"}</h1>
        <p className="text-muted-foreground">
          {locale === "bn"
            ? "আপনার নিউজ পোর্টালের সম্পূর্ণ ওভারভিউ এখানে দেখুন"
            : "Here's an overview of your news portal's performance"}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title={locale === "bn" ? "মোট আর্টিকেল" : "Total Articles"}
          value={stats.totalArticles}
          description={`+${stats.articlesThisMonth} ${locale === "bn" ? "এই মাসে" : "this month"}`}
          icon={FileText}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title={locale === "bn" ? "মোট ইউজার" : "Total Users"}
          value={stats.totalUsers.toLocaleString()}
          description={`+${stats.newUsersThisMonth} ${locale === "bn" ? "নতুন ইউজার" : "new users"}`}
          icon={Users}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title={locale === "bn" ? "মোট কমেন্ট" : "Total Comments"}
          value={stats.totalComments}
          description={`+${stats.commentsThisMonth} ${locale === "bn" ? "এই মাসে" : "this month"}`}
          icon={MessageSquare}
          trend={{ value: 15, isPositive: true }}
        />
        <StatsCard
          title={locale === "bn" ? "মোট ভিউ" : "Total Views"}
          value={stats.totalViews.toLocaleString()}
          description={`+${stats.viewsThisMonth.toLocaleString()} ${locale === "bn" ? "এই মাসে" : "this month"}`}
          icon={Eye}
          trend={{ value: 23, isPositive: true }}
        />
      </div>

      {/* Pending Items */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{locale === "bn" ? "ড্রাফট আর্টিকেল" : "Draft Articles"}</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingItems.drafts}</div>
            <p className="text-xs text-muted-foreground">
              {locale === "bn" ? "প্রকাশের অপেক্ষায়" : "Awaiting publication"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {locale === "bn" ? "অনুমোদনের অপেক্ষায়" : "Pending Comments"}
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingItems.pendingComments}</div>
            <p className="text-xs text-muted-foreground">{locale === "bn" ? "মডারেশন প্রয়োজন" : "Need moderation"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{locale === "bn" ? "শিডিউল পোস্ট" : "Scheduled Posts"}</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{pendingItems.scheduledPosts}</div>
            <p className="text-xs text-muted-foreground">{locale === "bn" ? "আগামী ২৪ ঘন্টায়" : "Next 24 hours"}</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity />

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle>{locale === "bn" ? "সিস্টেম স্ট্যাটাস" : "System Status"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">{locale === "bn" ? "ডাটাবেস" : "Database"}</span>
                </div>
                <span className="text-sm text-green-600">{locale === "bn" ? "সক্রিয়" : "Online"}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">{locale === "bn" ? "সার্ভার" : "Server"}</span>
                </div>
                <span className="text-sm text-green-600">{locale === "bn" ? "সক্রিয়" : "Online"}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">{locale === "bn" ? "ক্যাশ" : "Cache"}</span>
                </div>
                <span className="text-sm text-green-600">{locale === "bn" ? "সক্রিয়" : "Active"}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">{locale === "bn" ? "পারফরমেন্স" : "Performance"}</span>
                </div>
                <span className="text-sm text-blue-600">{locale === "bn" ? "চমৎকার" : "Excellent"}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
