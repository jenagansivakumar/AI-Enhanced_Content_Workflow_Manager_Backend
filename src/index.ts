import express from "express";

const app = express();
app.use(express.json());

const port = 4000;

app.get("/", (req,res)=> {

} )

app.listen(port, ()=>{
    console.log(`Server running on port ${port}`)
})