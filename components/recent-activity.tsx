"use client"

import { useLocale } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"

interface Activity {
  id: string
  user: string
  action: string
  target: string
  timestamp: Date
  type: "create" | "update" | "delete" | "publish"
}

const mockActivities: Activity[] = [
  {
    id: "1",
    user: "John Doe",
    action: "published",
    target: "New Technology Innovation",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    type: "publish",
  },
  {
    id: "2",
    user: "Jane Smith",
    action: "created",
    target: "Sports Record Article",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    type: "create",
  },
  {
    id: "3",
    user: "Ahmed Rahman",
    action: "updated",
    target: "Economy Changes",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    type: "update",
  },
  {
    id: "4",
    user: "Sarah Wilson",
    action: "deleted",
    target: "Outdated News",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
    type: "delete",
  },
]

export function RecentActivity() {
  const locale = useLocale()

  const getActionColor = (type: Activity["type"]) => {
    switch (type) {
      case "create":
        return "bg-green-100 text-green-800"
      case "update":
        return "bg-blue-100 text-blue-800"
      case "publish":
        return "bg-purple-100 text-purple-800"
      case "delete":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{locale === "bn" ? "সাম্প্রতিক কার্যকলাপ" : "Recent Activity"}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockActivities.map((activity) => (
            <div key={activity.id} className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">
                  {activity.user
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{activity.user}</span>
                  <Badge variant="outline" className={getActionColor(activity.type)}>
                    {activity.action}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{activity.target}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
