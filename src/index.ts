import express  from "express";

const app = express()
const port = 4000

const contentList = [
    { id: 1, title: "First Content", body: "This is the first content item" },
    { id: 2, title: "Second Content", body: "This is the second content item" },
    { id: 3, title: "Third Content", body: "This is the third content item" }
  ];

app.get("/api/content/:id", (req, res) =>{
   const id = parseInt(req.params.id)
   const contentItem = contentList.find((item)=> item.id === id)

   if (contentItem){
    res.json(contentItem)
   }
   else {
    res.status(400).json({
        message: "Not found"
    })
   }
})

app.post("/api/content", (req, res)=> {
    const {title, body} = req.body
    const newContent = {
        id : contentList.length + 1,
        title,
        body
    }
    contentList.push(newContent)
    res.status(201).json(newContent)
})

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
})
