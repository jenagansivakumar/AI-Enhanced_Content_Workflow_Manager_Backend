import express  from "express";

const app = express()
const PORT = 4000

app.get("/api/content", (req,res)=>{
    const content = [
        {
            "Name": "Jena"
        }
    ]
    res.json(content)
})

app.listen(PORT, ()=> {
    console.log(`Server running on http://localhost:${PORT}`);
})