"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Tags,
  MessageSquare,
  Users,
  Settings,
  BarChart3,
  ImageIcon,
  Shield,
  Home,
} from "lucide-react"

interface AdminSidebarProps {
  className?: string
}

export function AdminSidebar({ className }: AdminSidebarProps) {
  const pathname = usePathname()
  const locale = useLocale()
  const t = useTranslations()

  const navigation = [
    {
      title: locale === "bn" ? "ড্যাশবোর্ড" : "Dashboard",
      href: `/${locale}/admin`,
      icon: LayoutDashboard,
    },
    {
      title: locale === "bn" ? "নিউজ ম্যানেজমেন্ট" : "News Management",
      icon: FileText,
      items: [
        {
          title: locale === "bn" ? "সব নিউজ" : "All News",
          href: `/${locale}/admin/news`,
        },
        {
          title: locale === "bn" ? "নতুন নিউজ" : "Add News",
          href: `/${locale}/admin/news/new`,
        },
        {
          title: locale === "bn" ? "ড্রাফট" : "Drafts",
          href: `/${locale}/admin/news/drafts`,
        },
      ],
    },
    {
      title: locale === "bn" ? "ক্যাটেগরি" : "Categories",
      href: `/${locale}/admin/categories`,
      icon: FolderOpen,
    },
    {
      title: locale === "bn" ? "ট্যাগস" : "Tags",
      href: `/${locale}/admin/tags`,
      icon: Tags,
    },
    {
      title: locale === "bn" ? "কমেন্ট" : "Comments",
      href: `/${locale}/admin/comments`,
      icon: MessageSquare,
    },
    {
      title: locale === "bn" ? "ইউজার" : "Users",
      href: `/${locale}/admin/users`,
      icon: Users,
    },
    {
      title: locale === "bn" ? "অ্যাড ম্যানেজমেন্ট" : "Ad Management",
      href: `/${locale}/admin/ads`,
      icon: ImageIcon,
    },
    {
      title: locale === "bn" ? "অ্যানালিটিক্স" : "Analytics",
      href: `/${locale}/admin/analytics`,
      icon: BarChart3,
    },
    {
      title: locale === "bn" ? "সেটিংস" : "Settings",
      href: `/${locale}/admin/settings`,
      icon: Settings,
    },
  ]

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-6 w-6 text-primary" />
            <h2 className="text-lg font-semibold">{locale === "bn" ? "অ্যাডমিন প্যানেল" : "Admin Panel"}</h2>
          </div>

          <Button variant="outline" size="sm" asChild className="w-full mb-4 bg-transparent">
            <Link href={`/${locale}`}>
              <Home className="mr-2 h-4 w-4" />
              {locale === "bn" ? "সাইট দেখুন" : "View Site"}
            </Link>
          </Button>

          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="space-y-1">
              {navigation.map((item, index) => (
                <div key={index}>
                  {item.items ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground">
                        <item.icon className="h-4 w-4" />
                        {item.title}
                      </div>
                      {item.items.map((subItem) => (
                        <Link key={subItem.href} href={subItem.href}>
                          <Button
                            variant={pathname === subItem.href ? "secondary" : "ghost"}
                            className="w-full justify-start pl-8"
                            size="sm"
                          >
                            {subItem.title}
                          </Button>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <Link href={item.href}>
                      <Button
                        variant={pathname === item.href ? "secondary" : "ghost"}
                        className="w-full justify-start"
                        size="sm"
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.title}
                      </Button>
                    </Link>
                  )}
                  {index < navigation.length - 1 && item.items && <Separator className="my-2" />}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
