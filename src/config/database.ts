import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const ContentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    status: { type: String, enum: ["draft", "review", "published"], default: "draft" },
    tags: [{ type: String }],
    createdAt: { type: Date, default: Date.now },
});

const Content = mongoose.models.Content || mongoose.model('Content', ContentSchema);

export const connectDB = async () => {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
        console.error("MONGO_URI environment variable is not set.");
        process.exit(1);
    }

    if (!mongoose.connection.readyState) {
        try {
            await mongoose.connect(mongoUri);
            console.log("Connected to MongoDB successfully!");
        } catch (error) {
            console.error("Error connecting to MongoDB:", error);
            process.exit(1);
        }
    }
};

export const addSampleContent = async () => {
    await connectDB();

    const sampleData = new Content({
        title: "Sample Content",
        body: "This is a sample document for testing purposes.",
        status: "draft",
        tags: ["sample", "test"],
    });

    try {
        await sampleData.save();
        console.log("Sample content added to the database!");
    } catch (error) {
        console.error("Error adding sample content:", error);
    }
};

export default Content;