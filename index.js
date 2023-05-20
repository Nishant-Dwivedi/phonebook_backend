const cors = require("cors");
require("dotenv").config();
const express = require("express");
const app = express();
const Person = require("./mongo")
const { default: mongoose } = require("mongoose");
const PORT = process.env.PORT || 3001;


// json parser for POST
app.use("/api/persons",express.json());
// cors, static frontend
app.use(cors(), express.static("build"));

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});

app.get("/api/persons", (req, res) => {
  Person.find({}).then(data => {
    res.json(data)
  })

});

app.get("/api/info", (req, res) => {
  let persons;
  Person.find({}).then(data =>{
    persons = data
    res.send(`Phonebook has info for ${persons.length} people <br> ${new Date()}`);
  })
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  Person.findById({_id : id}).then(result =>{
    res.json(result)
  }).catch(err => console.log(err.message))
});
// DELETE
app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  data = data.filter((person) => person.id !== id);
  console.log(data);
  res.status(204).end();
});
// POST
app.post("/api/persons", (req, res) => {
  console.log(req.body);
  if (req.body.name == undefined || req.body.number == undefined) {
    res
      .status(400)
      .send("<p>Invalid format used for state's representation.</p>");
  } 
  else {
   const newPerson = new Person({
    name: req.body.name,
    number: req.body.number
   })
   newPerson.save().then(response => {
    console.log(response);
   }).catch(err=>console.log(err.message))
  }
});
