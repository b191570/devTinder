const validator=require("validator");

const validateSignUpData=(req)=>{
    let {firstName,lastName,email,password,age,gender,photoUrl,About}=req.body;
    if(!firstName || !lastName){
        throw new Error("Name is not Valid");
    }
    else if(firstName.length<4 || firstName.length>50){
        throw new Error("Minimum length should be 4 and maximum length should be 50");
    }
    else if(!validator.isEmail(email.trim())){
        throw new Error("Enter valid Email Id");
    }
    else if(!validator.isStrongPassword(req.body.password)){
        throw new Error("Please  enter strong Password");
    }
    gender=req.body.gender.toUpperCase();
    if(age<18 || age>100){
        throw new Error(`Invalid age\nAge should be between 18 and 100`);
      }
      if(!['F','M','O'].includes(gender)){
        throw new Error(`Invalid gender\nGender should be F,M,O`);
      }
} ; 
module.exports={
    validateSignUpData,
};