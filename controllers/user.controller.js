var mongoose = require("mongoose");
var User = require("../models/user.model");
var Cart = require("../models/cart.model");
var Bill = require("../models/bill.model");
var bcrypt = require("bcrypt");
var cloudinary = require("../cloudinary");
const saltRounds = 10;
var jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports.redirect = (req, res) => {
  res.redirect("/login");
};
module.exports.getLogin = (req, res, next) => {
  res.render("login");
};
module.exports.home = async (req, res) => {
  var users = await User.find();
  res.render("home", { users: users });
};

module.exports.postLogin = async (req, res, next) => {
  var email = req.body.email.toLowerCase();
  var password = req.body.password.toLowerCase();
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
        if (user.isAdmin) {
          if (!user.token) {
            const token = jwt.sign(
              { id: user._id, email: email },
              process.env.ACCESS_TOKEN_SECRET
            );
            user.token = token;
            await user.save();
            res.cookie("token", user.token);
            res.redirect("/home");
          } else {
            res.cookie("token", user.token);
            res.redirect("/home");
            return;
          }
        } else {
          res.render("login", {
            errors: ["Ban khong co quyen truy cap"],
          });
        }
      }
      res.render("login", {
        errors: ["Sai mat khau"],
        values: req.body,
      });
      return;
    });
  }
};

module.exports.signup = (req, res) => {
  res.render("user/create");
};

module.exports.postCreateUser = async (req, res, next) => {
  var email = req.body.email;
  var password = req.body.password;
  var rePassword = req.body.repassword;
  if (!(email && password && rePassword)) {
    res.render("user/create", {
      errors: ["Tat ca phai duoc khai bao"],
      values: req.body,
    });
    return;
  }
  var avatar = await cloudinary.uploader.upload(req.file.path);
  var user = await User.findOne({ email: email });
  
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
      name: req.body.name,
      phone: req.body.phone,
      avatar: avatar.secure_url,
      address: req.body.address,
      permission: "KH",
      favorite: [],
      
    };

    User.create(data);

    var hashEmail = bcrypt.hashSync(req.body.email, saltRounds);

    var link = "https://flying-blossom-cerise.glitch.me/users/verify/" + email;

    res.send("Vui long kiem tra email de kich hoat");

    const msg = {
      to: req.body.email, // Change to your recipient
      from: "jackyson123456789@gmail.com", // Change to your verified sender
      subject: "Sending with SendGrid is Fun",
      text: "and easy to do anywhere, even with Node.js",
      html:
        "Hello,<br> Please Click on the link to verify your email.<br><a href=" +
        link +
        ">Click here to verify</a>",
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
module.exports.verifyEmail = async (req, res, next) => {
  var email = req.params.email;
  await User.findOneAndUpdate({ email: email }, { active: true });
  res.send("Tài khoản của bạn đã được kích hoạt");
};

//tạo tài khoản Admin
module.exports.createAdmin = async (req, res, next) => {
  const { email, password, repassword } = req.body;
  if (!(email && password && repassword)) {
    res.status(400).send("Tat ca phai duoc khai bao");
  }
  const oldUser = await User.findOne({ email: email });
  if (oldUser) {
    return res.send("User da ton tai");
  }
  if (password !== repassword) {
    res.send("Hai mat khau khong khop");
  } else {
    //ma hoa mat khau
    var encryptedPassword = bcrypt.hashSync(req.body.password, 10);

    var data = {
      email: req.body.email,
      password: encryptedPassword,
      isAdmin: false,
      active: false,
      name: "",
      phone: "",
      avatar: "",
      address: "",
      permission: "QL",
      favorite: [],
    };
    var user = await User.create(data);

    var link = "https://flying-blossom-cerise.glitch.me/users/verify/" + email;

    const msg = {
      to: req.body.email, // Change to your recipient
      from: "jackyson123456789@gmail.com", // Change to your verified sender
      subject: "Sending with SendGrid is Fun",
      text: "and easy to do anywhere, even with Node.js",
      html:
        "Hello,<br> Please Click on the link to verify your email.<br><a href=" +
        link +
        ">Click here to verify</a>",
    };
    sgMail
      .send(msg)
      .then(() => {
        console.log("Email sent");
      })
      .catch((error) => {
        console.error(error);
      });

    res.status(201).json(user);
  }
};

module.exports.deleteAccount = async (req, res) => {
  var id = req.params.id;
  var user = await User.findOne({ _id: id });

  if (!user) {
    return;
  } else {
    await User.deleteOne({ _id: id });
    var users = await User.find({});
    res.redirect("/home");
    console.log("Delete success!");
  }
};

//render view cap nhat thong tin nguoi dung
module.exports.getUpdateInfoOfUser = async (req, res) => {
  var user_id = req.params.id;
  var user = await User.findOne({ _id: user_id });
  console.log(user);
  res.render("user/update-info", {
    user: user,
  });
};

// cap nhat thong tin nguoi dung
module.exports.updateInfoOfUser = async (req, res) => {
  var avatar = await cloudinary.uploader.upload(req.file.path);
  var id = req.params.id;
  var user = await User.findOne({ _id: id });
  if (user) {
    user.avatar = avatar.secure_url;
    user.address = req.body.address;
    user.name = req.body.name;
    user.phone = req.body.phone;
    await user.save();
    res.redirect("/home");
  } else {
    return;
  }
};
//
module.exports.detailBillUser = async (req, res) => {
  var user_id = req.params.id;
  var bills = await Bill.find({ user_id: user_id });
  res.render("bill/user-detail", {
    bills: bills,
  });
};
module.exports.search = async (req, res) => {
  var query = req.query.name.trim();
  var users = await User.find();
  var userQuery = users.filter((item) => {
    return item.name.toLowerCase().trim().indexOf(query.toLowerCase()) !== -1;
  });
  console.log(userQuery);
  res.render("home", { users: userQuery });
};
module.exports.logout = async (req, res) => {
  if (!req.cookies.token) {
    res.render("login");
  } else {
    var user_id = jwt.verify(
      req.cookies.token,
      process.env.ACCESS_TOKEN_SECRET
    ).id;
    var user = await User.findOne({ _id: user_id });
    if (user.isAdmin) {
      res.clearCookie("token");
      res.render("login");
    } else {
      return;
    }
  }
};
module.exports.searchEmail = async (req, res)=>{
  var query = req.query.email.trim();
  var users = await User.find();
  var userQuery = users.filter((item) => {
    return item.email.toLowerCase().trim().indexOf(query.toLowerCase()) !== -1;
  });
  console.log(userQuery);
  res.render("home", { users: userQuery });
}
