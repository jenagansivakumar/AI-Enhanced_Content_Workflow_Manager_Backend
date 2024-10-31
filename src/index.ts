import express, { Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";
import  { connectDB } from "./database";

const cron = require("node-cron");


dotenv.config();

const app = express();
app.use(express.json());

connectDB();


const port = 4000;

interface ContentItem {
    id: number;
    title: string;
    body: string;
    status: "draft" | "review" | "published";
    tags?: string[];
    createdAt?: Date;
}

const contentList: ContentItem[] = [
    { id: 1, title: "Introduction to Testing", body: "Basics of testing", status: "draft", tags: ["testing", "basics"] },
    { id: 2, title: "Advanced Testing", body: "Deep dive into testing techniques", status: "review", tags: ["testing", "advanced"] },
    { id: 3, title: "JavaScript Essentials", body: "Introduction to JavaScript", status: "published", tags: ["javascript", "basics"] },
    { id: 4, title: "JavaScript Best Practices", body: "Improving JavaScript code quality", status: "draft", tags: ["javascript", "advanced"] },
    { id: 5, title: "React for Beginners", body: "Learn the basics of React", status: "review", tags: ["react", "basics"] },
    { id: 6, title: "React Advanced Patterns", body: "Higher-order components and hooks", status: "published", tags: ["react", "advanced"] },
    { id: 7, title: "Node.js Intro", body: "Server-side JavaScript basics", status: "draft", tags: ["nodejs", "basics", "javascript"] },
    { id: 8, title: "Node.js Performance", body: "Improving Node.js performance", status: "review", tags: ["nodejs", "advanced", "performance"] },
    { id: 9, title: "Testing Node.js APIs", body: "Guide to testing APIs with Node.js", status: "published", tags: ["nodejs", "testing"] },
    { id: 10, title: "Mastering TypeScript", body: "Advanced TypeScript techniques", status: "published", tags: ["typescript", "advanced"] }
];

app.get("/api/test-key", async (req: Request, res: Response) => {
    try {
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: "Hello, world!" }],
                max_tokens: 5,
            },
            {
                headers: {
                    "Authorization": `Bearer ${process.env.AI_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        res.status(200).json({
            success: true,
            data: response.data,
        });
    } catch (error) {
        if (axios.isAxiosError(error)) {
            res.status(500).json({
                success: false,
                message: "Failed to connect to AI API",
                error: error.response?.data || error.message,
            });
        } else {
            res.status(500).json({
                success: false,
                message: "An unexpected error occurred",
            });
        }
    }
});

app.get("/api/content", (req: Request, res: Response) => {
    res.send(contentList);
});

app.post("/api/content", (req: Request, res: Response) => {
    const { title, body, tags } = req.body;
    const newContent: ContentItem = {
        id: contentList.length + 1,
        title,
        body,
        status: "draft",
        tags,
        createdAt: new Date()
    };

    contentList.push(newContent);
    res.status(201).json({ message: "Successfully created content!", contentList });
});

app.put("/api/content/:id", (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const { title, body, tags } = req.body;

    const contentItem = contentList.find((item) => item.id === id);

    if (contentItem) {
        contentItem.title = title || contentItem.title;
        contentItem.body = body || contentItem.body;
        contentItem.tags = tags || contentItem.tags;

        if (contentItem.status === "draft" && body && body.length > 100) {
            contentItem.status = "review";
        }

        if (contentItem.status === "review" && body && body.includes("approved for publishing")) {
            contentItem.status = "published";
        }

        res.status(200).json({ message: "Content updated successfully", contentItem });
    } else {
        res.status(404).json({ message: "Content item not found" });
    }
});

cron.schedule("0 0 * * *", () => {
    const now = new Date().getTime();
    const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;

    contentList.forEach((content) => {
        if (content.createdAt) {
            const contentAge = now - new Date(content.createdAt).getTime();

            if (content.status === "draft" && contentAge > sevenDaysInMs) {
                content.status = "review";
                console.log(`Content ID ${content.id} moved to review due to age.`);
            }
        }
    });
});

const handleTagRoute = (req: Request, res: Response): void => {
    const { title, body } = req.body;

    if (!body) {
        res.status(400).json({ message: "Content body is required" });
        return;
    }

    const tags: string[] = [];

    if (title && title.toLowerCase().includes("javascript")) tags.push("javascript");
    if (title && title.toLowerCase().includes("react")) tags.push("react");
    if (body.toLowerCase().includes("testing")) tags.push("testing");
    if (body.toLowerCase().includes("performance")) tags.push("performance");
    if (body.toLowerCase().includes("advanced")) tags.push("advanced");

    res.status(200).json({ tags });
};

app.post("/api/generate-response", async (req: Request, res: Response) => {
    const { prompt } = req.body;
    
    if (!prompt) {
        res.status(400).json({ success: false, message: "Prompt is required" });
        return;
    }
    
    try {
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: prompt }],
                max_tokens: 100,
            },
            {
                headers: {
                    "Authorization": `Bearer ${process.env.AI_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        res.status(200).json({ success: true, message: response.data.choices[0].message.content });
    } catch (error) {
        if (axios.isAxiosError(error)) {
            res.status(500).json({
                success: false,
                message: "Failed to connect to AI API",
                error: error.response?.data || error.message,
            });
        } else {
            res.status(500).json({
                success: false,
                message: "An unexpected error occurred",
            });
        }
    }
});

app.post("/api/content/ai-tag", async (req: Request, res: Response): Promise<void> => {
    const { title, body } = req.body;

    if (!title && !body) {
        res.status(400).json({ success: false, message: "Title or body is required for AI tagging." });
        return;
    }

    try {
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "You are a helpful assistant that generates relevant tags for articles." },
                    { role: "user", content: `Generate tags for the following content:\nTitle: ${title}\nBody: ${body}` }
                ],
                max_tokens: 50,
            },
            {
                headers: {
                    "Authorization": `Bearer ${process.env.AI_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const aiResponse = response.data.choices[0].message.content;
        const tags = aiResponse.split(",").map((tag: string) => tag.trim());
        
        res.status(200).json({ success: true, tags });
    } catch (error) {
        const errorMessage = axios.isAxiosError(error) && error.response?.data 
            ? error.response.data 
            : "An unexpected error occurred";

        res.status(500).json({
            success: false,
            message: "Failed to connect to AI API",
            error: errorMessage,
        });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
