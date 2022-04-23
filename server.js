// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.''''
require("dotenv").config();
const express = require("express");
var bodyParser = require("body-parser");


const app = express();
var csurf = require("csurf");
const mongoose = require("mongoose");
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true
}).then(()=>console.log('successful'))
 .catch((err) => console.error('Not Connected'));;

app.set("view engine", "pug");
app.set("views", "./views");
var cookieParser = require("cookie-parser");
var cloudinary = require("cloudinary");

//Router
var productRouter = require("./routes/product.route");
var authRouter = require('./routes/auth.route');
var userRouter = require('./routes/user.route');
var cartRouter = require('./routes/cart.route');
var billRouter = require('./routes/bill.route');
var categoryRouter = require('./routes/category.route');
var statisticalRouter = require('./routes/statistical.route')


var apiUser = require("./api/routes/user.route");
var apiProduct = require("./api/routes/product.route");
var apiCategory = require("./api/routes/category.route")
var apiCart = require("./api/routes/cart.route");
var apiBill = require("./api/routes/bill.route")
// var authenToken = require("./api/middlewares/authenToken.middleware");
// app.use(authenToken)


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser(process.env.SESSION_SECRET));
// app.use(express.json()); // for parsing application/json
// app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(express.static("public"));



//api
app.use("/api/products", apiProduct);
app.use("/api/users", apiUser);
app.use("/api/categories",apiCategory);
app.use("/api/cart", apiCart);
app.use("/api/bills", apiBill);

// //routes
// app.use("/users", authMiddleware.requireAuth, userRouter);
// app.use("/books", authMiddleware.requireAuth,bookRouter);
// app.use("/transactions", authMiddleware.requireAuth, transactionRouter);
// app.use("/cart", cartRouter);
// app.use("/transfer", authMiddleware.requireAuth, transferRouter);
// app.use(csurf({ cookie: true }));
// app.use(function(req, res, next) {
//   res.locals.csrfToken = req.csrfToken();
//   next();
// });
app.use("/products", productRouter);
app.use('/', userRouter);
app.use('/cart', cartRouter)
app.use('/bills', billRouter)
app.use('/categories', categoryRouter)
app.use('/statistical',statisticalRouter )

//User
// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
