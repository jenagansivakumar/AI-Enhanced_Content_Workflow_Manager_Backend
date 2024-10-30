import express from "express"

const app = express()
app.use(express.json())

const port = 4000

const people = [
    { name: "Jena", isPresent: true },
    { name: "Kristina", isPresent: true },
    { name: "Kukovic", isPresent: false }
  ];

app.get("/api/content", (req, res)=>{
    res.send(people)
} )

app.post("/api/content", (req, res)=>{
    const newPerson = req.body
    console.log(req.body)
    people.push(newPerson)
    console.log("Current People Array:", people); 
    res.status(201).send(newPerson)
})

app.put("/api/content/:id", (req,res)=>{
    const id = req.params.id

})
app.listen(port, ()=>{
    console.log("listening on port 4000")
})