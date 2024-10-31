import express, { Request, Response } from "express";
const cron = require("node-cron");

const app = express();
app.use(express.json());

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

app.post("/api/content/tag", handleTagRoute);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
