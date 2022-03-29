require("dotenv").config();
const bcrypt = require("bcrypt");
var cloudinary = require("../../cloudinary");
var jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
var User = require("../../models/user.model");
var Product = require("../../models/product.model");
const shortid = require("shortid");

//lay tat ca thong tin
module.exports.getAll = async (req, res, next) => {
  var users = await User.find({});
  res.json(users);
};

// tao tai khoan khach hang
module.exports.createUser = async (req, res, next) => {
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
      permission: "KH",
    };
    var user = await User.create(data);

    const token = jwt.sign(
      { id: user._id, email: email },
      process.env.ACCESS_TOKEN_SECRET
    );
    user.token = token;
    await user.save();

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
// tao tai khoan Admin
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
// dang nhap
module.exports.login = async (req, res, next) => {
  var email = req.body.email;
  var password = req.body.password;
  var user = await User.findOne({ email: email });

  if (!user) {
    res.json({ status: "Tai khoan khong ton tai" });
    return;
  }
  if (!user.active) {
    res.json({ status: "Tai khoan chua kich hoat" });
  } else {
    bcrypt.compare(password, user.password, async (err, result) => {
      if (result) {
        res.json({ token: user.token });
        next();
      } else {
        res.status(403).json("Sai mat khau");

        return;
      }
    });
  }
};

module.exports.changePassword = async (req, res) => {
  var decode = jwt.verify(req.body.token, process.env.ACCESS_TOKEN_SECRET);
  if (decode) {
    var email = decode.email;
    var user = await User.findOne({ email: email });

    var oldPassword = req.body.oldPassword;
    var newPassword = req.body.newPassword;

    bcrypt.compare(oldPassword, user.password, async (err, result) => {
      if (result) {
        user.password = bcrypt.hashSync(newPassword, 10);
        await user.save();
        res.json("Success");
      } else {
        res.status(403).json("Sai mat khau");
        return;
      }
    });
  }
};
module.exports.forgotPassword = async (req, res) => {
  var email = req.body.email;
  var user = await User.findOne({ email: email });
  if (user) {
    const newPassword = shortid.generate();

    const msg = {
      to: req.body.email, // Change to your recipient
      from: "jackyson123456789@gmail.com", // Change to your verified sender
      subject: "Sending with SendGrid is Fun",
      text: "and easy to do anywhere, even with Node.js",
      html: " Mat khau moi la <b> " + newPassword + "</b>",
    };
    sgMail
      .send(msg)
      .then(() => {
        console.log("Email sent");
      })
      .catch((error) => {
        console.error(error);
      });
    user.password = bcrypt.hashSync(newPassword, 10);
    await user.save();
    res.json(newPassword);
  } else {
    res.json("Tai khoan khong ton tai");
    return;
  }
};

// cap nhat thong tin
module.exports.updateInfo = async (req, res) => {
  var avatar = await cloudinary.uploader.upload(req.file.path);
  var decode = jwt.verify(req.body.token, process.env.ACCESS_TOKEN_SECRET);
  if (decode) {
    var user = await User.findOne({ email: decode.email });
    user.avatar = avatar.secure_url;
    user.address = req.body.address;
    user.name = req.body.name;
    user.phone = req.body.phone;
    await user.save();
    res.json(user);
    return;
  } else {
    res.json("errors");
  }
};
// lấy sản phẩm yêu thích
module.exports.getFavoriteProduct = async (req, res) => {
  if (!req.body.token) {
    res.json("Error, missed token");
  } else {
    var user_id = jwt.verify(
      req.body.token,
      process.env.ACCESS_TOKEN_SECRET
    ).id;
    var user = await User.findOne({ _id: user_id });
    var favoriteProducts = [];
    // chi tiet san pham
    for (let item of user.favorite) {
      var product = await Product.findOne({ _id: item });
      favoriteProducts.push(product);
      
    }
    res.json(favoriteProducts);
  }
};
//thêm sản phẩm yêu thích
module.exports.addFavoriteProduct = async (req, res) => {
  if (!(req.body.token && req.body.product_id)) {
    res.json("Error, missed token or product_id");
  } else {
    var user_id = jwt.verify(
      req.body.token,
      process.env.ACCESS_TOKEN_SECRET
    ).id;
    var user = await User.findOne({ _id: user_id });
    if (user.favorite.includes(req.body.product_id)) {
      res.json("Product already exists");
    } else {
      user.favorite.push(req.body.product_id);
      await user.save();
      res.json(user.favorite);
    }
  }
};
//xóa một sản phẩm yêu thích
module.exports.removeFavoriteProduct = async (req, res) => {
  if (!(req.body.token && req.body.product_id)) {
    res.json("Error, missed token or product_id");
  } else {
    var user_id = jwt.verify(
      req.body.token,
      process.env.ACCESS_TOKEN_SECRET
    ).id;
    var user = await User.findOne({ _id: user_id });
    var indexProduct = user.favorite.indexOf(req.body.product_id);
    user.favorite = user.favorite.splice(indexProduct, 1);
    await user.save();
    res.json(user.favorite);
  }
};
