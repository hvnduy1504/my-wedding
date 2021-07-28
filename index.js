const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const http = require('http');
const path = require('path');
// import the book recommendations module
const myWedding = require('./service/MyWedding.js');

app.set("view engine", "ejs");
// serve your css as static
// so we can load all the html,css and javacript files from the public folder
app.use(express.static(path.join(__dirname, "public")));


app.get('/', (req, res) => {

	var options = {
	  host: 'my-wedding-backend.herokuapp.com',
	  //port: 8080,
	  path: '/guests/',
	  method: 'GET'
	};
	var body = [];
	http.request(options, function(restRes) {
		// console.log('STATUS: ' + restRes.statusCode);
		// console.log('HEADERS: ' + JSON.stringify(restRes.headers));
		restRes.setEncoding('utf8');
		restRes.on('data', function (chunk) {
			body = chunk; 
		});

		// This is called when the request is finished and response is returned
		// Hence, use the constructed body string to parse it to json and return
		restRes.on('end', function () {
		   console.log('whole response > ' + body); 
		 	var jsonObject = JSON.parse(body);
			jsonObject.content.forEach(e => {
				if (e.name) {
					e.avatar = myWedding.convertTextToImage(myWedding.getFirstLetterOfWord(e.name));
				}
			})
			res.render('index', {data:jsonObject.content}); 
		});
	}).end();
	
    //res.render('index', {data: body});
});

app.listen(PORT, () => console.log(`Application started and Listening on port: ${PORT}`));