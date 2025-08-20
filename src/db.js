require('dotenv').config();
console.log("Loaded env:", process.env.CA);
const mysql=require('mysql2');
const fs=require('fs');
const path=require('path');

const db=mysql.createConnection({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME,
    ssl:{
        ca:fs.readFileSync(process.env.CA)
    }
});
db.connect(err=>{
    if(err){
        console.log("Error connecting to MYSQL: ",err);
        return;
    }
    console.log('Connected to MYSQL');
})
module.exports=db;