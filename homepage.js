var http = require("http");
var port = 9000;

function get405(req,res){
    res.writeHead( 405, "Method not supported" ,{"Content-Type":"text/html"});
    res.write("<html><head><title>405</title></head><body><h3>Error code:405. Method not supported. Go to homepage</h3></body></html>");
    res.end();
}
fs = require('fs');
var data;
var json;
fs.readFile('./homepage.html', function (err,data) {
   if (err) {
        throw err; 
   }
	html = data;
});

fs.readFile('./projects.json', function (err, data) {
    if (err) {
        throw err; 
    }
	json = data;
});

http.createServer(function(req,res){
		switch(req.method){
			case "GET":
				if(req.url==="/"){
					res.writeHead( 200, {"Content-Type":"text/html"});
					res.write(html);
					res.end();
				}
				if(req.url==="/projects"){
					res.writeHead( 200, {"Content-Type":"application/json"});
					res.write(json);
					res.end();
				}
					
			break;
			case "POST" :
				get405(req,res);
			break;
			default:
				get405(req,res);
			break;
			}

	}).listen(port);