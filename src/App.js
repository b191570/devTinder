const express = require('express');
const dbPromise = require('./db'); 
const validator = require('validator');

const db = dbPromise;
const app = express();
const PORT = process.env.PORT || 4000;
app.use(express.json()); // to parse JSON bodies

app.post('/signup/',async(req,res)=>{
  try{
      let email = req.body.email.trim();
      if(!validator.isEmail(email)){
        res.json("Enter valid Email Id");
      }
      if(!validator.isStrongPassword(req.body.password)){
        res.json("Please enter strong Password");
      }
      //adding age and gender validations
      let age=req.body.age;
      let gender=req.body.gender.toUpperCase();
      if(age<18 || age>100){
        return res.status(404).json(`Invalid age\nAge should be between 18 and 100`);
      }
      if(!['F','M','O'].includes(gender)){
         return res.status(404).json(`Invalid gender\nGender should be F,M,O`);
      }
      const userQuery = `INSERT INTO user (firstName, lastName, email, password, age , gender, photoUrl, About) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
      const skillsQuery=`INSERT INTO skills (userId,skill) VALUES ?`;
      const userValues= [
      req.body.firstName,
      req.body.lastName,
      email,
      req.body.password,
      age,
      gender,
      req.body.photoUrl,
      req.body.About
      ];
      const [outputuser]=await db.query(userQuery,userValues);
      const userId = outputuser.insertId;
      if(req.body.skills && req.body.skills.length > 0) 
      {
          const skillsValues = req.body.skills.map(skill => [userId, skill]);
          await db.query(skillsQuery,[skillsValues]);
      }
      if(outputuser.effectedRows===0 && outputskills.effectedRows===0)
      {
        return res.status(404).json('user not added due to internal errors');
      }
      return res.status(200).json('User added successfully');
      }
  catch(err) {
    console.error("Error inserting user:", err);
   return  res.status(500).json(err.sqlMessage);
  }
});


//get user by email
app.get('/user',async(req,res)=>{
  try{
    const qry='select * from user where email=?';
    const exe=await db.query(qry,[req.body.email]);
    if(exe[0].length>0){
      res.json({message:'USER FOUND',user:exe[0]});
    }
    else{
      res.status(404).json("USER NOT FOUND");
    }
  }
  catch(err){
    console.error('Login error',err);
    res.json('Error while fetching data based on email');
  }
})

//checking the user email and password is valid or not
app.get('/login',async(req,res)=>{
        const qry='select * from user where email=? and password=?';
        const output=await db.query(qry,[req.body.email,req.body.password]);
        const qr='select * from user where email=?';
        const opt=await db.query(qr,[req.body.email]);
        if(output[0].length>0){
            res.status(200).json("login Successful");
        }
        if(opt[0].length>0){
            res.status(404).json(`{message:wrong password}`);
        }
        else{
          res.status(404).json("USER NOT FOUND");
        }
})
//delete user based on email
app.delete('/deleteuser',async(req,res)=>{
  try{
      const userQuery='delete from user where email=?';
      const [output1]=await db.query(userQuery,[req.body.email]);
      const id=output1.id;
      const skillQuery='delete from skills where userId=?'
      const [output2]=await db.query(skillQuery,[id])
      if(output1.affectedRows===0 && output2.affectedRows===0){
        return res.status(404).json('User not Found');
      }
      return res.status(200).json('User deleted successfully');
  }
    catch(err){
        console.error("❌ Error while deleting:", err);
    return res.status(500).json({ message: "DB error", error: err.message });
    } 
})
//update the data of a user 
app.patch("/update/:emailId",async(req,res)=>{
    try{
          if(req.params.emailId===null){
               return res.status(404).json({message:"email is required to update"});
          }
          const email=req.params.emailId.trim();
          const updates=req.body;
          let skills=[];
          if("skills" in updates){
              skills=req.body.skills;
              delete updates.skills;
          }
          const fields=Object.keys(req.body);
          const allowedFields=['firstName','lastName','password','age','gender','photoUrl','About'];
          const isValid = fields.every(field => allowedFields.includes(field));
          if(!isValid){
              return res.status(404).json({message:'Invaid field in update request'});
          }
          const setClause = fields.map(f => `${f} = ?`).join(", ");
          const values = fields.map(f => updates[f]);
          const sql = `UPDATE user SET ${setClause} WHERE email = ?`;
          const output=await db.query(sql,[...values,email]);
          
          if (skills.length!==0){
          const idqry='select id from user where email=?'
          const [userRows]=await db.query(idqry,email);
          const userId=userRows[0].id;
         //to be modified
            const query='delete from skills where userId=?'
            await db.query(query,[userId]);
            const skillqry='insert into skills(userId,skill) values ?'
            const skillsUpdation=skills.map(skill=>[userId,skill]);
            await db.query(skillqry,[skillsUpdation]);
          if (output.affectedRows!==0 && skillsUpdation.affectedRows!==0){
            return res.status(200).json('UPDATE SUCCESSFULL');
          }
    }}
    catch(err){
        console.error({err});
        return res.json(err.sqlMessage);
    }
})
//getting all users data for feed
app.get('/feed',async(req,res)=>{ 
  try{
    const sql='SELECT u.id,u.firstName,u.lastName,u.email,u.password,u.age,u.gender,u.photoUrl,u.About,COALESCE(JSON_ARRAYAGG(s.skill), JSON_ARRAY()) AS skills FROM user u LEFT JOIN skills s ON u.id = s.userId GROUP BY u.id,u.firstName,u.lastName,u.email,u.password,u.age,u.gender,u.photoUrl,u.About order by u.id;';
    const [rows]=await db.query(sql);
    res.status(200).json(rows);
  }
  catch(err){
     res.status(500).json("Error occured while fetching the data");
  }
})


app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
