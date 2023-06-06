const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const client = require("@mailchimp/mailchimp_marketing");
require('dotenv').config();
//console.log(process.env.API_KEY +" " +process.env.API_SERVER + " "+ process.env.LIST_ID);

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

//specify the static folder
app.use(express.static("assets"));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
  });

app.post("/", function(req, res){
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    client.setConfig({
        apiKey: process.env.API_KEY,
        server: process.env.API_SERVER,
       
    });

    const run = async () => {   
        const response = await client.lists.addListMember(process.env.LIST_ID, {
            email_address: email,
            status: "subscribed",
            merge_fields: {
                 FNAME: firstName,
                 LNAME: lastName
            }
        });
        console.log(response); 
    };

run().then((value) => {
    console.log("successful added!");
    res.sendFile(__dirname + "/success.html");
    }, (reason) => {
        console.log("Failure!");
        res.sendFile(__dirname + "/failure.html")
    });



    //change data to json formate
   // var jsonData = JSON.stringify(data)
    
    //http request to post data

    


    console.log("First Name is " +firstName + ", Last Name is " + lastName + ", Email is " +email);
})

app.post("/failure", function(req,res){
    res.redirect("/");
});

app.listen(3000, function(){
    console.log("Server started on port 3000");
});

