const textToImage = require('text-to-image');


var exports=module.exports={};

exports.apiHost='my-wedding-backend.herokuapp.com';

exports.getFirstLetterOfWord=function(str) {
	var matches = str.match(/\b(\w)/g);
	return matches.join('');
};

exports.convertTextToImage=function(str) {
	return textToImage.generateSync(str, {
					  maxWidth: 100,
					  fontSize: 50,
					  fontFamily: 'Arial',
					  bgColor: "rgba(241, 78, 149, 1)",
					  textColor: "#ffffff",
					  textAlign: "center",
					});
};