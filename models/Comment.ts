import mongoose, { type Document, Schema } from "mongoose"

export interface IComment extends Document {
  news: mongoose.Types.ObjectId
  user?: mongoose.Types.ObjectId
  guestName?: string
  guestEmail?: string
  parent?: mongoose.Types.ObjectId
  content: string
  status: "pending" | "approved" | "hidden"
  reports: number
  createdAt: Date
  updatedAt: Date
}

const CommentSchema = new Schema<IComment>(
  {
    news: {
      type: Schema.Types.ObjectId,
      ref: "News",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    guestName: {
      type: String,
      trim: true,
    },
    guestEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "hidden"],
      default: "pending",
    },
    reports: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
)

CommentSchema.index({ news: 1, status: 1, createdAt: -1 })
CommentSchema.index({ parent: 1, createdAt: 1 })

export default mongoose.models.Comment || mongoose.model<IComment>("Comment", CommentSchema)
