const express = require('express');
const dbPromise = require('./db'); 
const bcrypt=require('bcrypt');
const {validateSignUpData}=require("./utils/validations");
const validator = require('validator');

const db = dbPromise;
const app = express();
const PORT = process.env.PORT || 4000;
app.use(express.json()); // to parse JSON bodies

app.post('/signup/',async(req,res)=>{
  try{
      let email = req.body.email.trim();
      let request=req.body;
      validateSignUpData(req);
      const password=req.body.password;
      const hashedPassword=await bcrypt.hash(password,10);
      const userQuery = `INSERT INTO user (firstName, lastName, email, password, age , gender, photoUrl, About) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
      const skillsQuery=`INSERT INTO skills (userId,skill) VALUES ?`;
      const userValues= [
      req.body.firstName,
      req.body.lastName,
      email,
      hashedPassword,
      req.body.age,
      req.body.gender,
      req.body.photoUrl,
      req.body.About
      ];
      const [outputuser]=await db.query(userQuery,userValues);
      const userId = outputuser.insertId;
      if(request.skills && request.skills.length > 0) 
      {
          const skillsValues = req.body.skills.map(skill => [userId, skill]);
          await db.query(skillsQuery,[skillsValues]);
      }
      return res.status(200).json('User added successfully');
      }
  catch(err) {
    console.error("Error inserting user:", err);
   return  res.status(500).send({message: err.message});
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
app.post ('/login',async(req,res)=>{
        try{
            const email=req.body.email;
            const password=req.body.password;
            const query='select password from user where email=?';
            const [row]=await db.query(query,[email]);
            if(row.length===0){
              throw new Error("no user");
            }
            const hashedPassword=row[0].password.toString();
            const isValid=await bcrypt.compare(password,hashedPassword);
            if(isValid===false){
                throw new Error("Invalid Credentials");
            }
            return res.status(200).send('login Successful!!');
        }
        catch(err){
          return res.status(400).send({message: err.message})
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
