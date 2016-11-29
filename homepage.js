var http = require("http");
var mongodb = require('mongodb');
var urlModule = require("url");
var fs = require('fs');


var port = 9000;
var url = 'mongodb://heroku_kkpb1df9:j7dflcju7u8ogo61hs3kvgnm0k@ds111798.mlab.com:11798/heroku_kkpb1df9';
var data;
var json;

function get405(req,res){
    res.writeHead( 405, "Method not supported" ,{"Content-Type":"text/html"});
    res.write("<html><head><title>405</title></head><body><h3>Error code:405. Method not supported. Go to homepage</h3></body></html>");
    res.end();
}

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
				if(req.url==="/majorcodes"){
					res.writeHead( 200, {"content-type":"application/json"});
					mongodb.MongoClient.connect(url,function(e,db){
						if(e) throw e;
						var cnt=0;
						var out = [];
						var education = db.collection("education");
						var cursor = education.find({},{"Major Information.Major Code":1,_id:0});
						cursor.each(function(e, result) {
							if(e) throw e; 
							cnt +=1;
							if(cnt <= 100){
								out.push(result);
							}else{
								if(cnt == 101){
								    res.write(JSON.stringify(out));
								}
								res.end();
							}
						});
					})
				}
				if(req.url.includes("/majors")){
					var expectedUrl= urlModule.parse(req.url, true); // true to get query as object
					var qObject = expectedUrl.query;
					res.writeHead( 200, {"Content-Type":"application/json"});
					mongodb.MongoClient.connect(url,function(e,db){
						if(e) throw e;
						var education = db.collection("education");
						education.findOne({"Major Information.Major Code":parseInt(qObject.majorcode)},{"Major Information.Major":1, _id:0},function(e,r){
							if(e) throw e;
							res.write(JSON.stringify(r));
							res.end();
						});
					})
				}
			break;
			case "POST" :
				get405(req,res);
			break;
			default:
				get405(req,res);
			break;
			}

	}).listen(process.env.PORT || 8080, function() {
    console.log('server started');
});
