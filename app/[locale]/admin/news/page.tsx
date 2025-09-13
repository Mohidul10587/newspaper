"use client"

import { useState, useEffect } from "react"
import { useLocale } from "next-intl"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function NewsListPage() {
  const locale = useLocale()
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 })

  useEffect(() => {
    fetchNews()
  }, [search, statusFilter, pagination.page])

  const fetchNews = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      })
      if (search) params.append("search", search)
      if (statusFilter) params.append("status", statusFilter)

      const response = await fetch(`/api/news?${params}`)
      const data = await response.json()

      setNews(data.news)
      setPagination(data.pagination)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch news",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return

    try {
      const response = await fetch(`/api/news/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete")

      toast({
        title: "Success",
        description: "Article deleted successfully",
      })
      fetchNews()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete article",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      draft: "secondary",
      published: "default",
      scheduled: "outline",
    }
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale === "bn" ? "bn-BD" : "en-US")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{locale === "bn" ? "নিউজ ম্যানেজমেন্ট" : "News Management"}</h1>
        <Button asChild>
          <Link href={`/${locale}/admin/news/new`}>
            <Plus className="mr-2 h-4 w-4" />
            {locale === "bn" ? "নতুন নিউজ" : "Add News"}
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={locale === "bn" ? "নিউজ খুঁজুন..." : "Search news..."}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={locale === "bn" ? "স্ট্যাটাস ফিল্টার" : "Filter by status"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{locale === "bn" ? "সব স্ট্যাটাস" : "All Status"}</SelectItem>
                <SelectItem value="draft">{locale === "bn" ? "ড্রাফট" : "Draft"}</SelectItem>
                <SelectItem value="published">{locale === "bn" ? "প্রকাশিত" : "Published"}</SelectItem>
                <SelectItem value="scheduled">{locale === "bn" ? "শিডিউল" : "Scheduled"}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{locale === "bn" ? "শিরোনাম" : "Title"}</TableHead>
                <TableHead>{locale === "bn" ? "ক্যাটেগরি" : "Category"}</TableHead>
                <TableHead>{locale === "bn" ? "স্ট্যাটাস" : "Status"}</TableHead>
                <TableHead>{locale === "bn" ? "তারিখ" : "Date"}</TableHead>
                <TableHead>{locale === "bn" ? "ভিউ" : "Views"}</TableHead>
                <TableHead className="w-[100px]">{locale === "bn" ? "অ্যাকশন" : "Actions"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    {locale === "bn" ? "লোড হচ্ছে..." : "Loading..."}
                  </TableCell>
                </TableRow>
              ) : news.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    {locale === "bn" ? "কোনো নিউজ পাওয়া যায়নি" : "No news found"}
                  </TableCell>
                </TableRow>
              ) : (
                news.map((article: any) => (
                  <TableRow key={article._id}>
                    <TableCell>
                      <div>
                        <div className="font-medium line-clamp-1">{article.title[locale as "en" | "bn"]}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {article.excerpt[locale as "en" | "bn"]}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{article.category?.name[locale as "en" | "bn"]}</TableCell>
                    <TableCell>{getStatusBadge(article.status)}</TableCell>
                    <TableCell>{formatDate(article.createdAt)}</TableCell>
                    <TableCell>{article.views}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/${locale}/news/${article.slug}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              {locale === "bn" ? "দেখুন" : "View"}
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/${locale}/admin/news/${article._id}/edit`}>
                              <Edit className="mr-2 h-4 w-4" />
                              {locale === "bn" ? "এডিট" : "Edit"}
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(article._id)} className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            {locale === "bn" ? "ডিলিট" : "Delete"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                {locale === "bn" ? "মোট" : "Total"} {pagination.total} {locale === "bn" ? "টি আইটেম" : "items"}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                  disabled={pagination.page === 1}
                >
                  {locale === "bn" ? "পূর্ববর্তী" : "Previous"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                  disabled={pagination.page === pagination.pages}
                >
                  {locale === "bn" ? "পরবর্তী" : "Next"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
