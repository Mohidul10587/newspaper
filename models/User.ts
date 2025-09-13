import mongoose, { type Document, Schema } from "mongoose"

export interface IUser extends Document {
  name: string
  email: string
  passwordHash: string
  role: "admin" | "editor" | "author"
  avatar?: string
  bio?: string
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "editor", "author"],
      default: "author",
    },
    avatar: {
      type: String,
    },
    bio: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
)

UserSchema.index({ email: 1 })

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema)
