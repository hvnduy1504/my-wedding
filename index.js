const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// import the book recommendations module
const myWedding = require('./service/MyWedding.js');

app.set("view engine", "ejs");
// serve your css as static
// so we can load all the html,css and javacript files from the public folder
app.use(express.static(path.join(__dirname, "public")));


app.get('/', (req, res) => {
		var options = {
		host: myWedding.apiHost,
		// port: 8080,
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
		   	// console.log('whole response > ' + body); 
		 	var jsonObject = JSON.parse(body);
			jsonObject.content.forEach(e => {
				if (e.name) {
					e.avatar = myWedding.convertTextToImage(myWedding.getFirstLetterOfWord(e.name));
				}
			})
			res.render('index', {data:jsonObject.content}); 
		});
	}).end();
});

app.post('/guest', (request, response) => {
	if (!request.body.isPublishMessage) {
		request.body.isPublishMessage = false;
	}
	const postData = JSON.stringify(request.body);
	console.log(`REQUEST BODY: ${postData}`);
	
	var resBody = [];
	var options = {
		host: myWedding.apiHost,
	  //port: 8080,
		path: '/guest',
		method: 'POST',
		headers: {
		    'Content-Type': 'application/json',
		    'Content-Length': Buffer.byteLength(postData)
		}
    };
	var req = http.request(options, (res) => {
	console.log(`STATUS: ${res.statusCode}`);
	console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
	res.setEncoding('utf8');
	res.on('data', (chunk) => {
		// console.log(`BODY: ${chunk}`);
		// body = JSON.parse(chunk)
		resBody = chunk;
		// console.log(`BODY: ${chunk}`);
	});
	res.on('end', () => {
		console.log(`RESPONSE: ${resBody}`);
		response.send(resBody);
		});
	});

	req.on('error', (e) => {
		console.error(`problem with request: ${e.message}`);
	});

	// Write data to request body
	req.write(postData);
	req.end();
});  

app.listen(PORT, () => console.log(`Application started and Listening on port: ${PORT}`));