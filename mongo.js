const mongoose = require("mongoose");
mongoose.set('strictQuery',false);
// get url from the hosting environment
const url = process.env.URL;
// create the schema and transform it as required
const personsSchema = new mongoose.Schema({
    name:{
        type: String,
        minLength: 3,
        required: true
    },
    number: Number,
});
personsSchema.set('toObject', {transform:function (doc, ret){
    ret.id = ret._id.toString();
    delete ret.__v;
    delete ret._id;
    return ret;
}})
// connect to database
console.log("connecting to database");
mongoose.connect(url).then(res => {
    console.log("connected to database");
}).catch(error => {
    console.log(error);
})
// export the model for creating instances of the schema and storing in db
module.exports= mongoose.model('Person', personsSchema);


