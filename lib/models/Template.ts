import mongoose, { Schema, Document } from 'mongoose';

export interface ITemplate extends Document {
  userId: string;
  name: string;
  description?: string;
  designJson: {
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      text: string;
      background: string;
    };
    fonts: {
      heading: string;
      body: string;
    };
    layout: string;
    customFields: Record<string, any>;
  };
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const templateSchema = new Schema<ITemplate>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: String,
    designJson: {
      type: Object,
      default: {
        colors: {
          primary: '#0066ff',
          secondary: '#f0f0f0',
          accent: '#ff6b6b',
          text: '#000000',
          background: '#ffffff',
        },
        fonts: {
          heading: 'Geist',
          body: 'Geist',
        },
        layout: 'standard',
        customFields: {},
      },
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Template = mongoose.models.Template || mongoose.model<ITemplate>('Template', templateSchema);
