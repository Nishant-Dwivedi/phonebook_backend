const cors = require("cors")
const express = require("express");
const app = express();
const morgan = require("morgan")
// json parser
app.use(express.json());
app.use(cors())
app.use(morgan(function (tokens, req, res) {
  return `${tokens.method(req,res)} ${tokens.url(req, res)} ${tokens.req(req, res, "content-length")} ${tokens.status(req, res)} ${tokens["response-time"](req,res)}ms ${JSON.stringify(req.body)})}`
}))
let data = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];
app.listen(3001, () => {});
app.get("/", (req, res) => {
  res.send("<h1>Phonebook App</h1>");
});
app.get("/api/persons", (req, res) => {
    res.json(data)
})
app.get("/api/info", (req, res) => {
    const persons = data.length;
    res.send(`Phonebook has info for ${persons} people <br> ${new Date()}`)
})
app.get("/api/persons/:id", (req, res) => {
    const id = req.params.id;
    const person = data.find(person => person.id == id)
    if(person){
        res.json(person)
    }
    else{
        res.status(404).send("Note not found on the server!")
    }
})
app.delete("/api/persons/:id" ,(req, res) => {
    const id = Number(req.params.id);
    data = data.filter(person => person.id !== id);
    res.status(204).end();
})
// POST
app.post("/api/persons", (req, res) => {
    const name = req.body.name;
    console.log(req.body);
    if (name == undefined || req.body.number == undefined){
      res.status(400).send("<p>Invalid format used for state's representation.</p>")
    }
    else if (data.find(person => person.name == name)){
      res.status(400).send("<p>Name already exists!</p>")
    }
    else {
      const max = 10000;
      const id = Math.floor(Math.random() * (max-5) + 5);
      data.push({...req.body, id});
      res.json({...req.body, id})
    }
})
