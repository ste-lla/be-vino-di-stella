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

app.post('/api/login', (req, res) => {
    db.user.findAll({ where: {email: req.body.email}})
    .then((user) => {
        let theUser = user[0];
        //console.log(user[0].email);
        if(user.length == 0) {
            res.status(401).json({login: false, message: 'User Not Found. Please Try Again or Register an Account'})
            return;
        }
        else {
            if(encryptPassword(req.body.password) === theUser.password) {
                res.status(201).json({login: true, userId: theUser.id, userFName: theUser.firstName})
            }
            else {
                res.status(401).json({login: false, message: 'Wrong Password Entered. Please Try Again'})
                return;
            }
        }
    })
    .catch((err) => {
        console.log(err);
    })
})



app.post('/api/register', (req, res) => {
    db.user.findAll({where: {email: req.body.email}})
    .then((users) => {
        if(users.length !== 0) {
            res.status(409).json({message: 'This Email Is Already Registered'});
            return;
        }
        else {
            if(req.body.password !== req.body.confPassword) {
                res.status(401).json({message: 'Passwords Do Not Match'});
                return;
            }
            else {
                db.user.create({
                    firstName: req.body.fName,
                    lastName: req.body.lName,
                    email: req.body.email,
                    password: encryptPassword(req.body.password)
                })
                .then((user) => {
                    console.log(user);
                    res.status(201).json({created: true})
                })
            }
        }
    })
})



app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
})