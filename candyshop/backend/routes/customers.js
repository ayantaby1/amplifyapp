const router = require('express').Router();
const Joi = require('joi');
var client = require('./connection');

async function connectToDb(){
    await client.connect();
    console.log(client.isConnected());
}
connectToDb();

const complexityOptions = {
    string: true,
    required: true,
    trim:true,
    min: 5,
    max: 30,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1, 
    requirementCount: 3,
  };

const passwordComplexity = require("joi-password-complexity"); 
const schema = Joi.object().keys({ //adjust this to how the body sends the data 
    firstName: Joi.string().trim().required().regex(/^[a-zA-Z]$/),
    lastName: Joi.string().trim().required().regex(/^[a-zA-Z]$/),
    name: Joi.string().required(),
    email: Joi.string().trim().email().required(),
    password: passwordComplexity(complexityOptions),
    repeat_password: Joi.ref('password'),
    phoneNumber: Joi.number().required().integer().min(999999999).max(999999999999) //this allows the number to be of 11 digits

});

router.route('/signup').post(async (req,res) => {
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    let repeat_password = req.body.repeat_password;
    let phoneNumber = req.body.phoneNumber;

    let data = req.body;
    schema.validate(data, (value,error) =>{
        console.log("Huh");
        if (error){
            console.log("why");
            res.status(400).json("Error: " + err);
            return;
        }
    })
    const validation = schema.validate(data);
    if(validation.error)
    {
        res.json('Error' + validation.error);
    }
    

    let found = await client.db("Users").collection("Customers").findOne({"email" : email});
    if(found !==null) {
        res.status(400).json("User with this email already exists");
        return;
    }
    found = await client.db("Users").collection("Customers").findOne({"name" : name});
    if(found !==null) {
        res.status(400).json("User with this username already exists");
        return;
    }
    const doc = {"name" : username, "email":email, "password":password, "phoneNumber":phoneNumber};
    await client.db("Users").collection("Customers").insertOne(doc);
    res.json("User Added");

})


router.route('/signin').post(async (req,res) => {
    let email = req.body.email;
    let password = req.body.password;
    if(typeof email === "undefined" || typeof password === "undefined"){
        res.error(400).json("Please fill all spaces");
        return;
    }
    let found = await client.db("Users").collection("Customers").findOne({"email":email, "password":password});
    if (found === null){
        res.error(400).json("Incorrect details");
        return;
    }
    res.json("Sucess. You are signed in");
})


router.route('/update').post(async (req, res) =>{
    let customerName = req.body.customerName;
    let whatToChange = req.body.whatToChange;
    let change = req.body.change;

    let found = await client.db("Users").collections("Customers").findOne({"name":customerName});
    let id = found._id;

    if(whatToChange == "username"){
        found.name = change;
    }
    else if(whatToChange == "firstName"){
        found.firstName = change;
    }
    else if(whatToChange == "lastName"){
        found.lastName = change;
    }
    else if (whatToChange == "email"){
        found.email = change;
    }
    else if (whatToChange == "password"){
        found.password = change;
    }
    else if (whatToChange == "phoneNumber"){
        found.phoneNumber = change;
    }

    await client.db("Product").collection("Candy").updateOne({"_id": id}, {$set : found});

})



module.exports = router;