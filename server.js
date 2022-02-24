const express = require("express");
const app = express();
const dotEnv = require("dotenv").config(); //required to use dotenv
const cors = require("cors");
const db = require("./models"); //This creates db variable to do database queries w/ sequelize
const encryptPassword = require("./encryption"); //This is for the bcryptjs we installed. Check out the encryption.js file to see the snippet of code to make this work
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());


/*
REMEMBER !!!!
    1) ON MIGRATION FILE(S) W/ PASSWORDS ADD--> const encryptPassword = require('../encryption');
   
    2) USE --> encryptPassword(req.body.password) when making requests below
 */

// My Heroku URL = https://vino-di-stella.herokuapp.com/


app.get('/api/test', (req, res) => {
    console.log('Testing GET 123');
    res.status(200).json({success: true});
})


//Just created a test user to see if it goes to my user table (no front-end setup yet)
//It worked!
app.post('/api/createProfile', (req, res) => {
    db.user.findAll({where: {email: req.body.email}})
    .then((users) => {
        if(users.length !== 0) {
            res.status(409).json({message: 'You already have an account'});
            return;
        }
        else {
            db.user.create({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: encryptPassword(req.body.password)
            })
            .then((user) => {
                console.log(user);
                res.status(201).json({message: 'Your account has been created!'})
            })
        }
    })
})



app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
})