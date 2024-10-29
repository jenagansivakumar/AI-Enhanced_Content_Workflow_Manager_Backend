import express  from "express";

const app = express()
const port = 4000

app.get("/api/content", (req, res) =>{
    const personData = [{
        "ID": 34,
        "Title": "The Holy Babu",
        "Body": "bla bla bla "
    }]
    res.json(personData)
})


app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
})
