
/*
 * GET home page.
 */

 var fs = require('fs');

module.exports = function upload(req, res){

 var model = req.model = req.model || {};
 	model.name = req.files.uploadfile.name;
 	var data = fs.readFileSync(req.files.uploadfile.path);
  	var newPath = __dirname + "/../public/images/uploads/" + req.files.uploadfile.name;
  	fs.writeFileSync(newPath, data);
  	res.render('upload', {"model" : model});
};