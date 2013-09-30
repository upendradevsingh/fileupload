
var fs = require('fs');

module.exports = function deleteFile(req, res){
	var path = __dirname + "/../public/images/uploads/" + req.body.filename,
		status = false;
	try{
		fs.unlinkSync(path);
		status =  true;
	}catch(err){
		console.log(err);
	}
	finally{
		res.send({'status' : status});
	}

}