"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { NewsForm } from "@/components/news-form"
import { Loader2 } from "lucide-react"

export default function EditNewsPage() {
  const params = useParams()
  const [newsData, setNewsData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNews()
  }, [params.id])

  const fetchNews = async () => {
    try {
      const response = await fetch(`/api/news/${params.id}`)
      const data = await response.json()
      setNewsData(data)
    } catch (error) {
      console.error("Error fetching news:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!newsData) {
    return <div>News not found</div>
  }

  return <NewsForm initialData={newsData} isEditing />
}
