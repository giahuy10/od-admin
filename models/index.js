var mongoose = require('mongoose');
var mlabURI = 'mongodb://localhost:27017/lotteod'
mongoose.Promise = global.Promise;
mongoose.connect(mlabURI, (error) => {
	if(error){
		console.log("Error " + error);
	}else{
		console.log("Connected successfully to server")
	}
});

module.exports = mongoose;