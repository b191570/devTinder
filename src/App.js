const express=require('express');
const app=express();

app.post('/user',(req,res,next)=>{
    console.log('Handler 1');
    next();
    //res.send("Response 2")
},
(req,res,next)=>{
    console.log('Handler 2');
    //res.send('Response 2');
    next();
},
(req,res,next)=>{
    console.log('Handler 3');
    //res.send('Response 2');
    next();
},
(req,res,next)=>{
    console.log('Handler 4');
    //res.send('Response 4');
    next();
},
(req,res,next)=>{
    console.log('Handler 5');
    res.send('Response 5');
    next();
}
);

app.listen(3000,()=>{
    console.log("server is running sucessfully");
});