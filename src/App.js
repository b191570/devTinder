const express=require('express');
const app=express();

app.use("/test",(req,res)=>{
 res.send("Hello from server");
});

app.use('/test1',((req,res)=>{
    res.send("hello from check");
}))

app.use("/test2",((req,res)=>{
    res.send("hello from test");
}))


app.listen(3000,()=>{
    console.log("server is running sucessfully");
});