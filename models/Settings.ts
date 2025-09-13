import mongoose, { type Document, Schema } from "mongoose"

export interface ISettings extends Document {
  siteName: {
    bn: string
    en: string
  }
  logo?: string
  favicon?: string
  primaryColor: string
  accentColor: string
  social: {
    facebook?: string
    youtube?: string
    twitter?: string
    instagram?: string
  }
  contact: {
    email?: string
    phone?: string
    address?: {
      bn?: string
      en?: string
    }
  }
  footerHtml?: {
    bn?: string
    en?: string
  }
  robotsTxt?: string
  sitemapEnabled: boolean
  revalidateInterval: number
  createdAt: Date
  updatedAt: Date
}

const SettingsSchema = new Schema<ISettings>(
  {
    siteName: {
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
    logo: {
      type: String,
    },
    favicon: {
      type: String,
    },
    primaryColor: {
      type: String,
      default: "#000000",
    },
    accentColor: {
      type: String,
      default: "#666666",
    },
    social: {
      facebook: {
        type: String,
      },
      youtube: {
        type: String,
      },
      twitter: {
        type: String,
      },
      instagram: {
        type: String,
      },
    },
    contact: {
      email: {
        type: String,
      },
      phone: {
        type: String,
      },
      address: {
        bn: {
          type: String,
        },
        en: {
          type: String,
        },
      },
    },
    footerHtml: {
      bn: {
        type: String,
      },
      en: {
        type: String,
      },
    },
    robotsTxt: {
      type: String,
    },
    sitemapEnabled: {
      type: Boolean,
      default: true,
    },
    revalidateInterval: {
      type: Number,
      default: 60,
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.Settings || mongoose.model<ISettings>("Settings", SettingsSchema)
