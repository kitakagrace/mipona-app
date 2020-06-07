const express = require('express');
const app = express();
const port = 3000;
const mysql = require('mysql');
app.use(express.json());



let sqlConnection = mysql.createConnection({
    host: "localhost",
    user: "root",
    pasword: "",
    database: "mipona"
})

sqlConnection.connect((err) =>{
    if (err) {
        console.log('Couldnot connect to Database check database configuration');
        
    }else{
        console.log('Successfully connected');
        
        let createUserTable = `CREATE TABLE IF NOT EXISTS users(
            id int primary key auto_increment,
            firstname varchar(255)not null,
            lastname varchar(255)not null,
            sex varchar(10)not null,
            emailaddress varchar(255)not null,
            phonenumber varchar(15)not null,
            pin varchar(5)not null
        ) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;`;

        sqlConnection.query(createUserTable, (err,results,fields) =>{
            if(err){
                throw err;
            }else{
                console.log('USERS table created');
                
            }
        })
    }
})


app.get('/', (req,res) =>{
    res.send({
        message: "This the Mipona App API"
    })
})

//create a new user
app.post('/register', (req,res) =>{
    let data = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        sex: req.body.sex,
        emailaddress: req.body.emailaddress,
        phonenumber: req.body.phonenumber,
        pin: req.body.pin
    }

    let stmt = "INSERT INTO users SET ?";

    sqlConnection.query(stmt, data, (err,results,fields) =>{
        if (err) {
            throw err;
        }else{
            res.send({
                data: results,
                message: "User Succefully registered"
            })
        }
    })
})

// login user
app.post('/login', (req,res) =>{
    let data = {
        phonenumber: req.body.phonenumber,
        pin: req.body.pin
    }

    let stmt = "SELECT * FROM users WHERE phonenumber = ? AND pin = ?";

    sqlConnection.query(stmt, [data.phonenumber, data.pin], (err,results,fields) =>{
        if (err) {
            throw err;
        }
       if (results.length > 0) {
           res.send({
               message: "User found"
           })
       }else{
           res.send({
               message:" Username / PIN didnot match"
           })
       }
    })
})

//getting all users

app.get('/getuser', (req,res) =>{
    let stmt = "SELECT * FROM users";

    sqlConnection.query(stmt, (err,results) =>{
        if (err) {
            throw err;
        }else{
            res.send({
                data: results
            })
        }
    })
})
app.listen(process.env.port || port, () =>{
    console.log(`App running at port: ${port}` );
    
})