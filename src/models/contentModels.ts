import mongoose, { Schema, Document } from 'mongoose';

export interface ContentDocument extends Document {
    title: string;
    body: string;
    status: "draft" | "review" | "published";
    tags?: string[];
    createdAt?: Date;
}

const ContentSchema = new Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    status: { type: String, enum: ["draft", "review", "published"], default: "draft" },
    tags: [{ type: String }],
    createdAt: { type: Date, default: Date.now },
});

const Content = mongoose.models.Content || mongoose.model<ContentDocument>('Content', ContentSchema);

export default Content;
