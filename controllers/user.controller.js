var mongoose = require("mongoose");
var User = require("../models/user.model");
var bcrypt = require("bcrypt");
const saltRounds = 10;
var jwt = require('jsonwebtoken');
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports.signup = (req, res) => {
  res.render("user/create");
};

module.exports.postCreateUser = async (req, res, next) => {
  var email = req.body.email;
  var password = req.body.password;
  var rePassword = req.body.repassword
  var user = await User.findOne({ email:email });
  if(!(email && password && rePassword)){
    res.render("user/create", {
      errors: ["Tat ca phai duoc khai bao"],
      values: req.body,
    });
    return;
  }
  if (user) {
    res.render("user/create", {
      errors: ["user da ton tai"],
      values: req.body,
    });
    return;
  }
  
  if (password !== rePassword) {
    res.render("user/create", {
      errors: ["mat khau khong trung khop"],
      values: req.body,
    });
  } else {
    req.body.password = bcrypt.hashSync(req.body.password, saltRounds);
 
    var data = {
      email: req.body.email,
      password: req.body.password,
      isAdmin: false,
      active: false,
      name: '',
      phone: '',
      avatar: '',
      address: '',
      permission: 'KH',
      favorite: []
    };
    
    User.create(data);
    
    var hashEmail = bcrypt.hashSync(req.body.email, saltRounds);
    
    var link = "https://flying-blossom-cerise.glitch.me/users/verify/"+email;
    
    res.render("user/create", {
      errors: ["Thanh cong vui long kiem tra email de xac thuc"],
      values: req.body,
    });
    
   
    const msg = {
      to: req.body.email, // Change to your recipient
      from: "jackyson123456789@gmail.com", // Change to your verified sender
      subject: "Sending with SendGrid is Fun",
      text: "and easy to do anywhere, even with Node.js",
      html: "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>" ,
    };
    sgMail
      .send(msg)
      .then(() => {
        console.log("Email sent");
      })
      .catch((error) => {
        console.error(error);
      });
    
  }
};
module.exports.verifyEmail= async (req, res, next)=>{
  var email = req.params.email;
  await User.findOneAndUpdate({email: email},{active: true});
  res.redirect('/login')
}

module.exports.getLogin = (req, res, next) => {
  res.render("login");
};

module.exports.postLogin = async (req, res, next) => {
  var email = req.body.email;
  var password = req.body.password;
  var user = await User.findOne({ email: email });
  if (!user) {
    res.render("login", {
      errors: ["Nguoi dung khong ton tai"],
      values: req.body,
    });
    return;
  } else {
    bcrypt.compare(password, user.password, async (err, result) => {
      if (result) {
        const token = jwt.sign(
          { id: user._id, email: email},
            process.env.ACCESS_TOKEN_SECRET,
        );
        user.token = token;
        await user.save()
        res.redirect('/products')
      }
      res.render("login", {
        errors: ["Wrong password"],
        values: req.body,
      });
      return;
    });
  }
};