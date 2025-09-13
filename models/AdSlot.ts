import mongoose, { type Document, Schema } from "mongoose"

export interface IAdSlot extends Document {
  key: string
  type: "html" | "image" | "script"
  payload: {
    html?: string
    imageUrl?: string
    linkUrl?: string
    script?: string
  }
  isActive: boolean
  targeting?: {
    pages?: string[]
    categories?: mongoose.Types.ObjectId[]
  }
  createdAt: Date
  updatedAt: Date
}

const AdSlotSchema = new Schema<IAdSlot>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["html", "image", "script"],
      required: true,
    },
    payload: {
      html: {
        type: String,
      },
      imageUrl: {
        type: String,
      },
      linkUrl: {
        type: String,
      },
      script: {
        type: String,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    targeting: {
      pages: [
        {
          type: String,
        },
      ],
      categories: [
        {
          type: Schema.Types.ObjectId,
          ref: "Category",
        },
      ],
    },
  },
  {
    timestamps: true,
  },
)

AdSlotSchema.index({ key: 1 })
AdSlotSchema.index({ isActive: 1 })

export default mongoose.models.AdSlot || mongoose.model<IAdSlot>("AdSlot", AdSlotSchema)
