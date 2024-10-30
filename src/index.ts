import express from "express"

const app = express()
app.use(express.json())

const port = 4000

const people = [{
    "Jena": true,
    "Kristina": true,
    "Kukovic": false
}]

app.get("/api/content", (req, res)=>{
    res.send(people)
} )

app.listen(port, ()=>{
    console.log("listening on port 4000")
})