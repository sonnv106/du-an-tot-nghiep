
module.exports.postCreate= (req,res,next)=>{
  var errors=[];
  
  if(!req.body.name){
    errors.push("Name is required")
  }
  if(!req.body.phone){
    errors.push("Phone is required")
  }
  if(req.body.name.trim().length>=30){
    errors.push("The name is too long")
  }
  if(errors.length){
    res.render("users",{
      errors: errors,
      values: req.body
    });
    return;
  }
  next();
}