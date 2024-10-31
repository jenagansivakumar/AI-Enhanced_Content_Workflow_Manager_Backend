import { Request, Response, RequestHandler } from 'express';
import express from "express";

const app = express();
app.use(express.json());

const port = 4000;

interface ContentItem {
    id: number;
    title: string;
    body: string;
    status: "draft" | "review" | "published";
    tags?: string[];
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


app.get("/api/content", (req, res) => {
    res.send(contentList);
});

app.post("/api/content", (req, res) => {
    const { title, body, tags } = req.body;
    const newContent: ContentItem = {
        id: contentList.length + 1,
        title,
        body,
        status: "draft",
        tags
    };

    contentList.push(newContent);
    res.status(201).json({ message: "Successfully created content!", contentList });
});

app.put("/api/content/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const { title, body, tags } = req.body;

    const contentItem = contentList.find((item) => item.id === id);

    if (contentItem) {
        contentItem.title = title || contentItem.title;
        contentItem.body = body || contentItem.body;
        contentItem.tags = tags || contentItem.tags;

        if (body && body.length > 100) {
            contentItem.status = "review";
        }

        if (body && body.includes("final approval")) {
            contentItem.status = "published";
        }

        res.status(200).json({ message: "Content updated successfully", contentItem });
    } else {
        res.status(404).json({ message: "Content item not found" });
    }
});

const recommendContentHandler: RequestHandler<{ id: string }> = (req, res) => {
    const id = parseInt(req.params.id);
    const contentItem = contentList.find((item) => item.id === id);

    if (!contentItem) {
        res.status(404).json({ message: 'Content not found' });
    } else {
        const recommendations = contentList.filter((item) =>
            item.id !== contentItem.id &&
            item.tags && contentItem.tags &&
            item.tags.some(tag => contentItem.tags!.includes(tag))
        );

        res.status(200).json({ contentItem, recommendations });
    }
};



app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
