var multer = require("multer");

module.exports = multer({
  storage: multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, "./public/uploads");
    },
    filename: function(req, file, cb) {
      cb(null, file.fieldname + "-" + Date.now());
    }
  })
});
