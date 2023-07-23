const cors = require("cors");
require("dotenv").config();
const express = require("express");
const app = express();
const Person = require("./mongo")
const PORT = process.env.PORT

// json parser middleware for parsing POST requests and populating the req object with the payload
app.use("/api/persons",express.json());
// cors and static frontend middlewares
app.use(cors(), express.static("build"));
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});

// GET routes
app.get("/api/persons", (req, res) => {
  Person.find({}).then(data => {
    res.json(data)
  }).catch(err => {
    next(err);
  })
});

app.get("/api/info", (req, res) => {
  let persons;
  Person.find({}).then(data =>{
    persons = data
    res.send(`Phonebook directory has info for ${persons.length} people <br> ${new Date()}`);
  }).catch(err => {
    next(err)
  })
});

app.get("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  Person.findById({_id : id}).then(result =>{
    if(result){
      res.json(result)
    }
    else{
      res.status(404).end();
    }
  }).catch(err =>{
    next(err);
  })
});

// DELETE route 
app.delete("/api/persons/:name", (req, res) => {
  const name = req.params.name;
  console.log(`request to delete: ${name}`);
  Person.deleteOne({name: name}).then(response => {
    console.log(response);
    res.status(204).end();
  }).catch(err => {
    console.log(err.name);
    res.status(500).end();
  })
});

// POST route
app.post("/api/persons", (req, res, next) => {
  console.log("POST request received");
  if (req.body.name == undefined || req.body.number == undefined) {
    console.log("invalid format used in request body.");
    res
      .status(400)
      .send("<p>Invalid format used in request body.</p>");
  } 
  else {
   const newPerson = new Person({
    name: req.body.name,
    number: req.body.number
   })
   newPerson.save()
   .then(response => {
    console.log("saved new entry to database", response);
    res.status(201).send(response);
   }).catch(err=>{
    next(err);
  })
  }
});
// PUT route
app.put("/api/persons/:id" , (req,res,next) => {
    console.log("PUT request received");
    Person.updateOne({_id: req.body._id}, {number:req.body.number}).then(respose => {
      console.log(respose);
      res.status(200).send(respose);
    }).catch(err => {
      next(err)
    })
})
// error handling
function errorHandler (err, req, res, next){
  // validation error
  if(err.name === 'ValidationError'){
    console.log(err.message);
    return res.status(500).json({error: err.message});
  }
  // cast error
  else if(err.name === "CastError"){
    console.log(err.message);
    res.status(400).json({error: err.message})
  }
  // other errors
    console.log(err.message);
    res.status(500).send({error: "internal server error"})
}

app.use(errorHandler);