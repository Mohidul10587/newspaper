import mongoose, { type Document, Schema } from "mongoose"

export interface ICategory extends Document {
  name: {
    bn: string
    en: string
  }
  slug: string
  description?: {
    bn?: string
    en?: string
  }
  createdAt: Date
  updatedAt: Date
}

const CategorySchema = new Schema<ICategory>(
  {
    name: {
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
    description: {
      bn: {
        type: String,
        trim: true,
      },
      en: {
        type: String,
        trim: true,
      },
    },
  },
  {
    timestamps: true,
  },
)

CategorySchema.index({ slug: 1 })

export default mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema)
