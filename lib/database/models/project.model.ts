import { Document, Schema, model, models } from 'mongoose'

export interface IProject extends Document {
  _id: string
  title: string
  purpose: string
  investment: string
  benifits: string
  isProbono: boolean
  imageUrl: string
  location: string
  createdAt: Date
  startDateTime: Date
  endDateTime: Date
  url: string
  category: { _id: string; name: string }
  projectManager: { _id: string; firstName: string; lastName: string }
}

const ProjectSchema = new Schema({
  title: { type: String, required: true },
  purpose: { type: String },
  investment: { type: String },
  benifits: { type: String },
  isProbono: { type: Boolean, default: false },
  imageUrl: { type: String, required: true },
  location: { type: String },
  createdAt: { type: Date, default: Date.now },
  startDateTime: { type: Date, default: Date.now },
  endDateTime: { type: Date, default: Date.now },
  url: { type: String },
  category: { type: Schema.Types.ObjectId, ref: 'Category' },
  projectManager: { type: Schema.Types.ObjectId, ref: 'User' },
})

const Project = models.Project || model('Project', ProjectSchema)

export default Project
