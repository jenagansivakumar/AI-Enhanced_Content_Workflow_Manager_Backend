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
    { id: 1, title: "Test", body: "Test body", status: "draft", tags: ["test tag", "test tag2"] },
    { id: 2, title: "Test 2", body: "Test body 2 ", status: "draft", tags: ["test tag 2", "test tag 3"] }
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
        res.status(200).json({ contentItem });
    }
};



app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
