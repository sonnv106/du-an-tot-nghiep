var Product = require("../models/product.model");
var User = require("../models/user.model");
var Cart = require("../models/cart.model");
var Bill = require("../models/bill.model");
var History = require("../models/history.model");
var Variant = require("../models/variant.model");
var jwt = require("jsonwebtoken");
var moment = require("moment");

module.exports.index = async (req, res) => {
  var bills = await Bill.find({ bill_status: true });

  var doanhThu = 0;
  for (var bill of bills) {
    if (bill.payment_status == true) {
      doanhThu += bill.total;
    }
  }
  var listProduct = [];
  for (var i = 0; i < bills.length; i++) {
    for (var j = 0; j < bills[i].products.length; j++) {
      listProduct.push(bills[i].products[j]);
    }
  }

  // Doanh thu hôm nay
  var date = new Date().toLocaleString().substring(0, 9);
  var billsOfToday = await Bill.find({ date: date });
  console.log(billsOfToday);
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
  var bills = await Bill.find({ bill_status: true });
  var listProduct = [];
  for (var i = 0; i < bills.length; i++) {
    for (var j = 0; j < bills[i].products.length; j++) {
      listProduct.push(bills[i].products[j]);
    }
  }
  console.log(listProduct);
  function reduce(array) {
    for (i = 0; i < array.length - 1; i++) {
      for (j = i + 1; j < array.length; j++) {
        if (array[i].variant_id === array[j].variant_id) {
          array[i].amount += array[j].amount;
          array.splice(j, 1);
          reduce(array);
        }
      }
    }
    return array;
  }
  var result = reduce(listProduct);
  result.sort((a, b) => {
    if (a.amount > b.amount) {
      return -1;
    }
    if (a.amount < b.amount) {
      return 1;
    }
    return 0;
  });
  res.render("statistical/top", {
    products: result,
  });
};
module.exports.topMonth = async (req, res) => {
  var queryMonth = req.query.month;
  var month = moment(queryMonth).format('MM')
  console.log(month)
  var bills = await Bill.find({ date: month });
  console.log(bills)
  var listProduct = [];
  for (var i = 0; i < bills.length; i++) {
    for (var j = 0; j < bills[i].products.length; j++) {
      listProduct.push(bills[i].products[j]);
    }
  }
  
  function reduce(array) {
    for (i = 0; i < array.length - 1; i++) {
      for (j = i + 1; j < array.length; j++) {
        if (array[i].variant_id === array[j].variant_id) {
          array[i].amount += array[j].amount;
          array.splice(j, 1);
          reduce(array);
        }
      }
    }
    return array;
  }
  var result = reduce(listProduct);
  result.sort((a, b) => {
    if (a.amount > b.amount) {
      return -1;
    }
    if (a.amount < b.amount) {
      return 1;
    }
    return 0;
  });
  res.render("statistical/top", {
    products: result,
  });
};
//khách hàng vàng
module.exports.topcustomer = async (req, res) => {
  var bills = await Bill.find({ payment_status: true });
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
  var customers = reduce(bills);
  //sắp xếp theo thứ tự giảm dần.
  customers.sort((a, b) => {
    if (a.total > b.total) {
      return -1;
    }
    if (a.total < b.total) {
      return 1;
    }
    return 0;
  });
  res.render("statistical/topcustomer", {
    customers: customers,
  });
};
// hàng tồn kho
module.exports.inventory = async (req, res) => {
  var variants = await Variant.find({});
  var list = [];
  for (var variant of variants) {
    var product = await Product.findOne({ _id: variant.product_id });
    var data = {
      product_id: product.id,
      id: variant.id,
      name: product.name + " " + variant.size,
      amount: variant.amount,
      import_price: variant.import_price,
      exp: moment(variant.exp).format('DD/MM/YYYY'),
      measure: variant.mesure
    };
    list.push(data);
  }
  list.sort((a, b) => {
    if (a.amount > b.amount) {
      return -1;
    }
    if (a.amount < b.amount) {
      return 1;
    }
    return 0;
  });
  res.render("statistical/inventory", {
    products: list,
  });
};
module.exports.daymonth = async (req, res) => {
  var bills = await Bill.find();
  res.render("statistical/daymonth", bills);
};
module.exports.statisticalByMonth = async (req, res) => {
  var query = req.query.date;
  var month = parseInt(query.substring(5, 7));
  var bills = await Bill.find();
  var billQuery = bills.filter((item) => {
    console.log(item.date.substring(4, 6));
    return (
      item.date.substring(4, 6).toLowerCase().indexOf(month.toLowerCase()) !==
      -1
    );
  });
  res.render("bill/getall", { bills: billQuery });
};
module.exports.expired = async (req, res) => {
  const products = await Product.find({
    preserve: { $lte: moment(new Date()).format('YYYY-MM-DD') }
  })
  res.render('statistical/expired', { products })
}
