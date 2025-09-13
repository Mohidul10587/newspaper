import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import connectDB from "@/lib/db"
import News from "@/models/News"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status")
    const category = searchParams.get("category")
    const search = searchParams.get("search")

    const skip = (page - 1) * limit

    // Build query
    const query: any = {}
    if (status) query.status = status
    if (category) query.category = category
    if (search) {
      query.$or = [
        { "title.en": { $regex: search, $options: "i" } },
        { "title.bn": { $regex: search, $options: "i" } },
        { "excerpt.en": { $regex: search, $options: "i" } },
        { "excerpt.bn": { $regex: search, $options: "i" } },
      ]
    }

    const [news, total] = await Promise.all([
      News.find(query)
        .populate("category", "name slug")
        .populate("tags", "name slug")
        .populate("author", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      News.countDocuments(query),
    ])

    return NextResponse.json({
      news,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching news:", error)
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
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

    // Validate required fields
    if (!title?.en || !title?.bn || !excerpt?.en || !excerpt?.bn || !content?.en || !content?.bn) {
      return NextResponse.json({ error: "Missing required bilingual fields" }, { status: 400 })
    }

    // Check if slug already exists
    const existingNews = await News.findOne({ slug })
    if (existingNews) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 400 })
    }

    const news = await News.create({
      title,
      slug,
      excerpt,
      content,
      coverImage,
      gallery: gallery || [],
      category,
      tags: tags || [],
      author: session.user.id,
      status: status || "draft",
      publishedAt: status === "published" ? publishedAt || new Date() : publishedAt,
      isFeatured: isFeatured || false,
      priority: priority || 0,
    })

    const populatedNews = await News.findById(news._id)
      .populate("category", "name slug")
      .populate("tags", "name slug")
      .populate("author", "name email")

    return NextResponse.json(populatedNews, { status: 201 })
  } catch (error) {
    console.error("Error creating news:", error)
    return NextResponse.json({ error: "Failed to create news" }, { status: 500 })
  }
}
