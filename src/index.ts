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

const contentList: ContentItem [] = [
    {id: 1, title: "Test", body: "Test body", status: "draft", tags: ["test tag", "test tag2"]},
    {id: 2, title: "Test 2", body: "Test body 2 ", status: "draft", tags: ["test tag 2", "test tag 3"]}
]

app.get("/", (req,res)=> {
    res.send()
} )

app.listen(port, ()=>{
    console.log(`Server running on port ${port}`)
})