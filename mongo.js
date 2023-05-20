const mongoose = require("mongoose");
mongoose.set('strictQuery',false);

const url = process.env.URL;

console.log(url);
const personsSchema = new mongoose.Schema({
    name:String,
    number: Number,
});

personsSchema.set('toObject', {transform:function (doc, ret, options){
    ret.id = ret._id.toString();
    delete ret.__v;
    delete ret._id;
    return ret;
}})

console.log("connecting to database");
mongoose.connect(url).then(res => {
    console.log("connected to database");
}).catch(error => {
    console.log(error);
})

module.exports= mongoose.model('Person', personsSchema);


