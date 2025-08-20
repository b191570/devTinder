const authAdmin=((req,res,next)=>{
    const token="Akhila";
    const isAuth=token==='Akhila';
    if(!isAuth){
        res.status(404).send("unauthorized Admin");
    }
    next();
});

const authUser=((req,res,next)=>{
    const usertk='abc';
    const isAuth=usertk==='abc';
    if(!isAuth){
        res.status(404).send("unAuthorized User");
    }
    next();
})
module.exports={
    authAdmin,
    authUser
}