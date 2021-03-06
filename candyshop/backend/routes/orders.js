const router = require('express').Router();
const client = require('./connection');
const auth = require('../middleware/auth');
var ObjectId = require('mongodb').ObjectId;


async function connectToDb(){
    await client.connect();
    console.log(client.isConnected());
}
connectToDb();


router.route('/pendingOrders/').get(async (req,res)=>{
    let cursor = await client.db("Orders").collection("Pending Orders").find({});
    let arr = new Array();
    await cursor.forEach(function  (doc) {arr.push(doc);});
    res.status(200).json(arr);

})


router.route('/confirmedOrders/').get(async (req,res)=>{
    let cursor = await client.db("Orders").collection("Confirmed Orders").find({});
    let arr = new Array();
    await cursor.forEach(function  (doc) {arr.push(doc);});
    res.status(200).json(arr);

})


router.route('/pendingOrders/confirm').post(async (req,res) => {
    let orderNumber = req.body.orderNumber;
    var o_id = new ObjectId(orderNumber);
    console.log(orderNumber)
    let found = await client.db("Orders").collection("Pending Orders").findOne({"_id" : o_id});
    console.log(found)
    let foundCustomer = await client.db("Users").collection("Customers").findOne({"name" : found.customerName});
    
    await client.db("Orders").collection("Confirmed Orders").insertOne(found);
    await client.db("Orders").collection("Pending Orders").deleteOne({"_id" : o_id});
    

    var nodeMailer = require('nodemailer');
    var transporter = nodeMailer.createTransport({
        service:'gmail',
        auth: {
            user: 'noreplycandyscape@gmail.com',
            pass: 'Group12-SE-Candyscape'
        }
    });

    var mailOptions = {
        from: 'noreplycandyscape@gmail.com',
        to : foundCustomer.email,
        subject: 'Candyscape Order Confirmation',
        text : 'Your order number ' + orderNumber + ' has been confirmed. The order will be delivered in 3-5 business days. Thankyou for shopping with Candyscape!'
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            res.status(400).json(error);
        }
        else{
            res.status(200).json('Success. Order confirmed and mail sent');
        }
    });


})


router.route('/pendingOrders/delete').post(async (req, res) => {
    let orderNumber = req.body.orderNumber;
    await client.db('Orders').collection('PendingOrders').deleteOne({'orderNumber' : orderNumber});
    res.status(200).json("Order deleted");
})


module.exports = router;