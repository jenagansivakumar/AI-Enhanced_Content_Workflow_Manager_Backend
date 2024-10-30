import express from "express";

const app = express();
app.use(express.json());

const port = 4000;

const people = [
    { name: "Jena", isPresent: true },
    { name: "Kristina", isPresent: true },
    { name: "Kukovic", isPresent: false }
];

app.get("/api/content", (req, res) => {
    res.send(people);
});

app.post("/api/content", (req, res) => {
    const newPerson = req.body;
    people.push(newPerson);
    res.status(201).send(newPerson);
});

app.put("/api/content/:name", (req, res) => {
    const name = req.params.name;
    const { isPresent } = req.body;

    const person = people.find((p) => p.name === name);

    if (person) {
        person.isPresent = isPresent;
        res.status(200).json(person);
    } else {
        res.status(404).json({ message: "Person not found" });
    }
});

app.listen(port, () => {
    console.log("listening on port 4000");
});
