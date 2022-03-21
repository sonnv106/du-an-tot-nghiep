var jwt = require('jsonwebtoken');

module.exports =  (req, res, next)=>{
  const authorizationHeader = req.headers['authorization'];
  console.log(authorizationHeader)
 
  if(!authorizationHeader){
    res.sendStatus(401);
    return;
  }
  var decode =  jwt.verify(authorizationHeader, process.env.ACCESS_TOKEN_SECRET)
  if(decode){
      console.log(decode)
      next();
    }else{
      return
    }
  
}