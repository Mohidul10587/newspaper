import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import connectDB from "@/lib/db"
import News from "@/models/News"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const news = await News.findById(params.id)
      .populate("category", "name slug")
      .populate("tags", "name slug")
      .populate("author", "name email")

    if (!news) {
      return NextResponse.json({ error: "News not found" }, { status: 404 })
    }

    return NextResponse.json(news)
  } catch (error) {
    console.error("Error fetching news:", error)
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== "admin" && session.user.role !== "editor")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const data = await request.json()
    const {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      gallery,
      category,
      tags,
      status,
      publishedAt,
      isFeatured,
      priority,
    } = data

    // Check if slug already exists (excluding current article)
    if (slug) {
      const existingNews = await News.findOne({ slug, _id: { $ne: params.id } })
      if (existingNews) {
        return NextResponse.json({ error: "Slug already exists" }, { status: 400 })
      }
    }

    const updateData: any = {}
    if (title) updateData.title = title
    if (slug) updateData.slug = slug
    if (excerpt) updateData.excerpt = excerpt
    if (content) updateData.content = content
    if (coverImage !== undefined) updateData.coverImage = coverImage
    if (gallery !== undefined) updateData.gallery = gallery
    if (category) updateData.category = category
    if (tags !== undefined) updateData.tags = tags
    if (status) {
      updateData.status = status
      if (status === "published" && !publishedAt) {
        updateData.publishedAt = new Date()
      } else if (publishedAt) {
        updateData.publishedAt = publishedAt
      }
    }
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured
    if (priority !== undefined) updateData.priority = priority

    const news = await News.findByIdAndUpdate(params.id, updateData, { new: true })
      .populate("category", "name slug")
      .populate("tags", "name slug")
      .populate("author", "name email")

    if (!news) {
      return NextResponse.json({ error: "News not found" }, { status: 404 })
    }

    return NextResponse.json(news)
  } catch (error) {
    console.error("Error updating news:", error)
    return NextResponse.json({ error: "Failed to update news" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const news = await News.findByIdAndDelete(params.id)

    if (!news) {
      return NextResponse.json({ error: "News not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "News deleted successfully" })
  } catch (error) {
    console.error("Error deleting news:", error)
    return NextResponse.json({ error: "Failed to delete news" }, { status: 500 })
  }
}
