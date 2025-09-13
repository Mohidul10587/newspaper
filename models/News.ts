import mongoose, { type Document, Schema } from "mongoose"

export interface INews extends Document {
  title: {
    bn: string
    en: string
  }
  slug: string
  excerpt: {
    bn: string
    en: string
  }
  content: {
    bn: string
    en: string
  }
  coverImage?: string
  gallery?: string[]
  category: mongoose.Types.ObjectId
  tags: mongoose.Types.ObjectId[]
  author: mongoose.Types.ObjectId
  status: "draft" | "published" | "scheduled"
  publishedAt?: Date
  views: number
  isFeatured: boolean
  priority: number
  adsInBody: {
    position: number
    adSlot: mongoose.Types.ObjectId
  }[]
  createdAt: Date
  updatedAt: Date
}

const NewsSchema = new Schema<INews>(
  {
    title: {
      bn: {
        type: String,
        required: true,
        trim: true,
      },
      en: {
        type: String,
        required: true,
        trim: true,
      },
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    excerpt: {
      bn: {
        type: String,
        required: true,
        trim: true,
      },
      en: {
        type: String,
        required: true,
        trim: true,
      },
    },
    content: {
      bn: {
        type: String,
        required: true,
      },
      en: {
        type: String,
        required: true,
      },
    },
    coverImage: {
      type: String,
    },
    gallery: [
      {
        type: String,
      },
    ],
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "published", "scheduled"],
      default: "draft",
    },
    publishedAt: {
      type: Date,
    },
    views: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: Number,
      default: 0,
    },
    adsInBody: [
      {
        position: {
          type: Number,
          required: true,
        },
        adSlot: {
          type: Schema.Types.ObjectId,
          ref: "AdSlot",
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
)

NewsSchema.index({ slug: 1 })
NewsSchema.index({ status: 1, publishedAt: -1 })
NewsSchema.index({ category: 1, publishedAt: -1 })
NewsSchema.index({ tags: 1, publishedAt: -1 })
NewsSchema.index({ isFeatured: 1, publishedAt: -1 })

export default mongoose.models.News || mongoose.model<INews>("News", NewsSchema)
