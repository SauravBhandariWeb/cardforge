import mongoose, { Schema, Document } from "mongoose"

export interface IIDCard extends Document {
  userId: string
  templateId?: string
  firstName: string
  lastName: string
  rollNumber: string
  email?: string
  phone?: string
  dateOfBirth?: string
  bloodGroup?: string
  department?: string
  collegeName?: string
  collegeAddress?: string
  collegePhone?: string
  collegeLogo?: string
  address?: string
  photo?: string
  validTill?: string
  cardColor?: string
  textColor?: string
  designJson: {
    colors: {
      primary: string
      secondary: string
      accent: string
      text: string
      background: string
    }
    fonts: {
      heading: string
      body: string
    }
    layout: string
    customFields: Record<string, any>
  }
  frontImageUrl?: string
  backImageUrl?: string
  barcodeData?: string
  createdAt: Date
  updatedAt: Date
}

const idCardSchema = new Schema<IIDCard>(
  {
    userId: { type: String, required: true, index: true },
    templateId: { type: String, default: null },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    rollNumber: { type: String, required: true, trim: true },
    dateOfBirth: { type: String, default: "" },
    bloodGroup: { type: String, default: "O+" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    department: { type: String, default: "" },
    collegeName: { type: String, default: "" },
    collegeAddress: { type: String, default: "" },
    collegePhone: { type: String, default: "" },
    collegeLogo: { type: String, default: "" },
    address: { type: String, default: "" },
    photo: { type: String, default: "" },
    validTill: { type: String, default: "2027" },
    cardColor: { type: String, default: "#2563EB", trim: true },
    textColor: { type: String, default: "#FFFFFF", trim: true },
    barcodeData: { type: String, default: "" },
    designJson: {
      type: Object,
      default: {
        colors: {
          primary: "#0066ff",
          secondary: "#f0f0f0",
          accent: "#ff6b6b",
          text: "#000000",
          background: "#ffffff",
        },
        fonts: { heading: "Geist", body: "Geist" },
        layout: "standard",
        customFields: {},
      },
    },
    frontImageUrl: { type: String, default: "" },
    backImageUrl: { type: String, default: "" },
  },
  { timestamps: true },
)

export const IDCard =
  mongoose.models.IDCard ||
  mongoose.model<IIDCard>("IDCard", idCardSchema)