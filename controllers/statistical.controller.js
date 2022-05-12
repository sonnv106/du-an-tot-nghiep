var Product = require("../models/product.model");
var User = require("../models/user.model");
var Cart = require("../models/cart.model");
var Bill = require("../models/bill.model");
var History = require("../models/history.model")
var jwt = require("jsonwebtoken");
var moment = require("moment");

module.exports.index = async (req, res) => {
  var bills = await History.find({ bill_status: true });

  var doanhThu = 0;
  for (var bill of bills) {
    doanhThu += bill.total;
  }
  var listProduct = [];
  for (var i = 0; i < bills.length; i++) {
    for (var j = 0; j < bills[i].products.length; j++) {
      listProduct.push(bills[i].products[j]);
    }
  }

  // Doanh thu hôm nay
  var date = new Date();
  var today = date.toLocaleDateString();
  var billsOfToday = await Bill.find({ date: today });
  var billOfTodayComplete = [];
  for (var i of billsOfToday) {
    if (i.finish_at) {
      billOfTodayComplete.push(i);
    }
  }
  var doanhThuHomNay = 0;
  for (var i of billOfTodayComplete) {
    doanhThuHomNay += i.total;
  }
  res.render("statistical", {
    doanhThu: doanhThu,
    doanhThuHomNay: doanhThuHomNay,
  });
};
// top sản phẩm bán chạy
module.exports.top = async (req, res) => {
  var bills = await History.find({ bill_status: true });
  var listProduct = [];
  for (var i = 0; i < bills.length; i++) {
    for (var j = 0; j < bills[i].products.length; j++) {
      listProduct.push(bills[i].products[j]);
    }
  }
  function reduce(array) {
    for (i = 0; i < array.length - 1; i++) {
      for (j = i + 1; j < array.length; j++) {
        if (array[i].product_id === array[j].product_id) {
          array[i].amount += array[j].amount;
          array.splice(j, 1);
          reduce(array);
        }
      }
    }
    return array;
  }
  var result = reduce(listProduct);
  result.sort((a,b)=>{
    if(a.amount > b.amount){
      return -1;
    }if(a.amount < b.amount){
      return 1;
    }
    return 0;
  })
  res.render("statistical/top", {
    products: result,
  });
};
//khách hàng vàng
module.exports.topcustomer = async (req, res) => {
  var bills = await History.find({ payment_status: true });
  // thu gọn danh sách khách hàng
  function reduce(array) {
    for (var i = 0; i < array.length - 1; i++) {
      for (var j = i + 1; j < array.length; j++) {
        if (array[i].user_id === array[j].user_id) {
          array[i].total += array[j].total;
          array.splice(j, 1);
          reduce(array);
        }
      }
    }
    return array;
  }
  var customers = reduce(bills)
  //sắp xếp theo thứ tự giảm dần.
  customers.sort((a,b)=>{
    if(a.total > b.total){
      return -1;
    }if(a.total < b.total){
      return 1;
    }
    return 0;
  })
  res.render("statistical/topcustomer",{
    customers: customers
  } );
};
// hàng tồn kho
module.exports.inventory=async (req, res)=>{
  var products = await Product.find({})
  products.sort((a,b)=>{
      if(a.quantily > b.quantily){
      return -1;
    }if(a.quantily < b.quantily){
      return 1;
    }
    return 0;       
        })
  res.render('statistical/inventory',{
    products: products
  } )
}
