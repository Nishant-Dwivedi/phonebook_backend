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
    if(result){
      res.json(result)
    }
    else{
      res.status(404).end();
    }
  }).catch(err =>{
    console.log(err);
    res.status(400).send({error: "malformed id"})
  })
});
// DELETE
app.delete("/api/persons/:name", (req, res) => {
  const name = req.params.name;
  
console.log(`request to delete: ${name}`);
  Person.deleteOne({name: name}).then(response => {
    console.log(response);
    res.status(204).end();
  }).catch(err => {
    console.log(err);
    res.status(500).end();
  })
  
});
// POST
app.post("/api/persons", (req, res, next) => {
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
    res.status(201).send(response);
   }).catch(err=>{
    console.log(err.message);
    next(err);
    // res.status(500).end()
  })
  }
});

// PUT
app.put("/api/persons/:id" , (req,res) => {
  console.log(req.body);
  if(typeof(req.body.number) != "string"){
    console.log("invalid number type provided");
    res.status(400).send({error: "provide a valid phone number"})
  }
  else{
    Person.updateOne({_id: req.body._id}, {number:req.body.number}).then(respose => {
      console.log(respose);
      res.status(200).send(respose);
    }).catch(err => {
      console.log(err);
      res.status(500).end();
    })
  }
})

// error handling
function errorHandler (err, req, res, next){
  if(err.name === 'ValidationError'){
    console.log(err.message);
    return res.status(500).json({error: err.message});
  }
  next(err);
}

app.use(errorHandler);