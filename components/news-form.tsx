"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useLocale } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"
import { Loader2, Save, Eye, X } from "lucide-react"

interface NewsFormProps {
  initialData?: any
  isEditing?: boolean
}

export function NewsForm({ initialData, isEditing = false }: NewsFormProps) {
  const router = useRouter()
  const locale = useLocale()

  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const [tags, setTags] = useState([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")

  const [formData, setFormData] = useState({
    title: { en: "", bn: "" },
    slug: "",
    excerpt: { en: "", bn: "" },
    content: { en: "", bn: "" },
    coverImage: "",
    category: "",
    status: "draft",
    isFeatured: false,
    priority: 0,
    publishedAt: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || { en: "", bn: "" },
        slug: initialData.slug || "",
        excerpt: initialData.excerpt || { en: "", bn: "" },
        content: initialData.content || { en: "", bn: "" },
        coverImage: initialData.coverImage || "",
        category: initialData.category?._id || "",
        status: initialData.status || "draft",
        isFeatured: initialData.isFeatured || false,
        priority: initialData.priority || 0,
        publishedAt: initialData.publishedAt ? new Date(initialData.publishedAt).toISOString().slice(0, 16) : "",
      })
      setSelectedTags(initialData.tags?.map((tag: any) => tag._id) || [])
    }
  }, [initialData])

  useEffect(() => {
    fetchCategories()
    fetchTags()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories")
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const fetchTags = async () => {
    try {
      const response = await fetch("/api/tags")
      const data = await response.json()
      setTags(data)
    } catch (error) {
      console.error("Error fetching tags:", error)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }

  const handleTitleChange = (lang: "en" | "bn", value: string) => {
    const newTitle = { ...formData.title, [lang]: value }
    setFormData({ ...formData, title: newTitle })

    // Auto-generate slug from English title
    if (lang === "en" && !isEditing) {
      setFormData((prev) => ({ ...prev, slug: generateSlug(value) }))
    }
  }

  const addTag = () => {
    if (newTag.trim() && !selectedTags.includes(newTag)) {
      setSelectedTags([...selectedTags, newTag])
      setNewTag("")
    }
  }

  const removeTag = (tagId: string) => {
    setSelectedTags(selectedTags.filter((id) => id !== tagId))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.en.trim()) newErrors.titleEn = "English title is required"
    if (!formData.title.bn.trim()) newErrors.titleBn = "Bengali title is required"
    if (!formData.slug.trim()) newErrors.slug = "Slug is required"
    if (!formData.excerpt.en.trim()) newErrors.excerptEn = "English excerpt is required"
    if (!formData.excerpt.bn.trim()) newErrors.excerptBn = "Bengali excerpt is required"
    if (!formData.content.en.trim()) newErrors.contentEn = "English content is required"
    if (!formData.content.bn.trim()) newErrors.contentBn = "Bengali content is required"
    if (!formData.category) newErrors.category = "Category is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (status: string) => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const submitData = {
        ...formData,
        tags: selectedTags,
        status,
        publishedAt: status === "published" ? formData.publishedAt || new Date().toISOString() : formData.publishedAt,
      }

      const url = isEditing ? `/api/news/${initialData._id}` : "/api/news"
      const method = isEditing ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to save news")
      }

      toast({
        title: "Success",
        description: `News ${isEditing ? "updated" : "created"} successfully`,
      })

      router.push(`/${locale}/admin/news`)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {isEditing ? (locale === "bn" ? "নিউজ এডিট করুন" : "Edit News") : locale === "bn" ? "নতুন নিউজ" : "Create News"}
        </h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            {locale === "bn" ? "বাতিল" : "Cancel"}
          </Button>
          <Button onClick={() => handleSubmit("draft")} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            {locale === "bn" ? "ড্রাফট সেভ" : "Save Draft"}
          </Button>
          <Button onClick={() => handleSubmit("published")} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Eye className="mr-2 h-4 w-4" />
            {locale === "bn" ? "প্রকাশ করুন" : "Publish"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{locale === "bn" ? "মূল তথ্য" : "Basic Information"}</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="en" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="en">English</TabsTrigger>
                  <TabsTrigger value="bn">বাংলা</TabsTrigger>
                </TabsList>

                <TabsContent value="en" className="space-y-4">
                  <div>
                    <Label htmlFor="title-en">Title (English) *</Label>
                    <Input
                      id="title-en"
                      value={formData.title.en}
                      onChange={(e) => handleTitleChange("en", e.target.value)}
                      placeholder="Enter English title"
                    />
                    {errors.titleEn && <p className="text-sm text-red-500 mt-1">{errors.titleEn}</p>}
                  </div>

                  <div>
                    <Label htmlFor="excerpt-en">Excerpt (English) *</Label>
                    <Textarea
                      id="excerpt-en"
                      value={formData.excerpt.en}
                      onChange={(e) =>
                        setFormData({ ...formData, excerpt: { ...formData.excerpt, en: e.target.value } })
                      }
                      placeholder="Enter English excerpt"
                      rows={3}
                    />
                    {errors.excerptEn && <p className="text-sm text-red-500 mt-1">{errors.excerptEn}</p>}
                  </div>

                  <div>
                    <Label htmlFor="content-en">Content (English) *</Label>
                    <Textarea
                      id="content-en"
                      value={formData.content.en}
                      onChange={(e) =>
                        setFormData({ ...formData, content: { ...formData.content, en: e.target.value } })
                      }
                      placeholder="Enter English content"
                      rows={10}
                    />
                    {errors.contentEn && <p className="text-sm text-red-500 mt-1">{errors.contentEn}</p>}
                  </div>
                </TabsContent>

                <TabsContent value="bn" className="space-y-4">
                  <div>
                    <Label htmlFor="title-bn">Title (বাংলা) *</Label>
                    <Input
                      id="title-bn"
                      value={formData.title.bn}
                      onChange={(e) => handleTitleChange("bn", e.target.value)}
                      placeholder="বাংলা শিরোনাম লিখুন"
                    />
                    {errors.titleBn && <p className="text-sm text-red-500 mt-1">{errors.titleBn}</p>}
                  </div>

                  <div>
                    <Label htmlFor="excerpt-bn">Excerpt (বাংলা) *</Label>
                    <Textarea
                      id="excerpt-bn"
                      value={formData.excerpt.bn}
                      onChange={(e) =>
                        setFormData({ ...formData, excerpt: { ...formData.excerpt, bn: e.target.value } })
                      }
                      placeholder="বাংলা সারসংক্ষেপ লিখুন"
                      rows={3}
                    />
                    {errors.excerptBn && <p className="text-sm text-red-500 mt-1">{errors.excerptBn}</p>}
                  </div>

                  <div>
                    <Label htmlFor="content-bn">Content (বাংলা) *</Label>
                    <Textarea
                      id="content-bn"
                      value={formData.content.bn}
                      onChange={(e) =>
                        setFormData({ ...formData, content: { ...formData.content, bn: e.target.value } })
                      }
                      placeholder="বাংলা কন্টেন্ট লিখুন"
                      rows={10}
                    />
                    {errors.contentBn && <p className="text-sm text-red-500 mt-1">{errors.contentBn}</p>}
                  </div>
                </TabsContent>
              </Tabs>

              <Separator className="my-4" />

              <div>
                <Label htmlFor="slug">URL Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="url-friendly-slug"
                />
                {errors.slug && <p className="text-sm text-red-500 mt-1">{errors.slug}</p>}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish Settings */}
          <Card>
            <CardHeader>
              <CardTitle>{locale === "bn" ? "প্রকাশনা সেটিংস" : "Publish Settings"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">{locale === "bn" ? "ড্রাফট" : "Draft"}</SelectItem>
                    <SelectItem value="published">{locale === "bn" ? "প্রকাশিত" : "Published"}</SelectItem>
                    <SelectItem value="scheduled">{locale === "bn" ? "শিডিউল" : "Scheduled"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.status === "scheduled" && (
                <div>
                  <Label htmlFor="publishedAt">Publish Date</Label>
                  <Input
                    id="publishedAt"
                    type="datetime-local"
                    value={formData.publishedAt}
                    onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <Label htmlFor="featured">Featured Article</Label>
                <Switch
                  id="featured"
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
                />
              </div>

              <div>
                <Label htmlFor="priority">Priority (0-10)</Label>
                <Input
                  id="priority"
                  type="number"
                  min="0"
                  max="10"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: Number.parseInt(e.target.value) || 0 })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Category & Tags */}
          <Card>
            <CardHeader>
              <CardTitle>{locale === "bn" ? "ক্যাটেগরি ও ট্যাগ" : "Category & Tags"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat: any) => (
                      <SelectItem key={cat._id} value={cat._id}>
                        {cat.name[locale as "en" | "bn"]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-sm text-red-500 mt-1">{errors.category}</p>}
              </div>

              <div>
                <Label>Tags</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add tag"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag} size="sm">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedTags.map((tagId) => {
                    const tag = tags.find((t: any) => t._id === tagId)
                    return (
                      <Badge key={tagId} variant="secondary" className="flex items-center gap-1">
                        {tag?.name[locale as "en" | "bn"] || tagId}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tagId)} />
                      </Badge>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Featured Image */}
          <Card>
            <CardHeader>
              <CardTitle>{locale === "bn" ? "ফিচার ইমেজ" : "Featured Image"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="coverImage">Image URL</Label>
                <Input
                  id="coverImage"
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              {formData.coverImage && (
                <div className="mt-2">
                  <img
                    src={formData.coverImage || "/placeholder.svg"}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
