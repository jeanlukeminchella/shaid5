var express = require('express');
var app = express();
var fs = require("fs");
var http = require("http");
var path = require ("path");
var crypto = require("crypto");

var passwd = "concertina";
var users={};
var sessions={};

var admin = {"username":"admin","password":"concertina"};
addUser(admin);

var events={"events":[]};


var baseURL = "";


function addUser(user)
{
	try
	{

		users[user.username]=user.password;
		console.log("user list now goes:"+JSON.stringify(users));
	}
	catch(err)
	{
		console.log(err);
		return (err);
	}
}



console.log('Server running at http://127.0.0.1:8080/');




app.get("/", function(req, resp){
	console.log("homepage sent" )
	resp.sendFile(path.join(__dirname + "/index.html"))
});

app.get(baseURL+"/index.html", function(req, resp){
	console.log("homepage sent" )
	resp.sendFile(path.join(__dirname + "/index.html"))
});

app.get(baseURL+'/login/validate', function(req, resp){
	
	console.log(req.ip);
	resp.json({"isValid":isAuthorised(req.ip,req.query.auth_token)});
});

/* app.get('/login', function(req, resp){
	console.log("login sent" )
	resp.sendFile(path.join(__dirname + "/login.html"))
}); */

app.post(baseURL+'/login/authenticate', function(req, resp){
	var username = req.query.username;
	console.log("authenticating user with username:"+username+" password:"+req.query.password )
	console.log("their password is secretly:" + users[username]);
	if (users[username]==req.query.password)
	{
		var id = crypto.randomBytes(20).toString('hex');
		resp.json({auth_token:id});
		authoriseToken(id,req.ip);
	}
	else
	{
		resp.json({"error": "not authorised, wrong password"});
	}
	
});

function authoriseToken(auth_token, ipAddress)
{
	sessions[ipAddress]=[auth_token,new Date()];
}


app.get("/objectPage.html", function(req, resp){
	console.log("objectPage sent" )
	resp.sendFile(path.join(__dirname + "/objectPage.html"))
});

app.get("/script.js", function(req, resp){
	console.log("objectPage sent" )
	resp.sendFile(path.join(__dirname + "/script.js"))
});

app.get("/rexjs", function(req, resp){
	console.log("objectPage sent" )
	resp.sendFile(path.join(__dirname + "/rex.js"))
});

app.get("/style.css", function(req, resp){
	console.log("objectPage sent" )
	resp.sendFile(path.join(__dirname + "/style.css"))
});



app.get(baseURL+'/admin', function(req, resp){
	if(isAuthorised(req.ip,req.query.auth_token))
	{
		console.log("admin sent" )
		resp.sendFile(path.join(__dirname + "/admin.html"))
	}
	else
	{
		resp.sendFile(path.join(__dirname + "/index.html"))
	}
});



app.get(baseURL+'/events/search', function(req, res){
	
	
	
	var content = events;
	var eventsArray = content.events;
	
	
	var paramDate = req.query.date;
	console.log(typeof(paramDate))
	var weHaveADate=false;
	if (!(typeof(paramDate)=="undefined" || paramDate=="" ||  paramDate=="undefined"))
	{
		weHaveADate=true;
	}
	console.log("weHaveADate is " + weHaveADate);
	
	var paramDateAfter = req.query.dateAfter;
	var paramDateBefore = req.query.dateBefore;
	var weHaveADateRange=false;
	if (!(typeof(paramDateBefore)=="undefined" || paramDateBefore=="" || paramDateBefore=="undefined"))
	{
		var beforeMsc = Date.parse(paramDateBefore);
		paramDateBefore = new Date(beforeMsc);
		paramDateBefore = new Date(beforeMsc);
		weHaveADateRange=true;
		if (typeof(paramDateAfter)=="undefined" || paramDateAfter=="")
		{
			paramDateAfter=new Date();
			console.log("no from date set so paramDateAfter="+paramDateAfter);
		}
		else
		{
			var afterMsc = Date.parse(paramDateAfter);
			paramDateAfter= new Date(afterMsc);
		}
	}
	
	
	
	var paramTitle = req.query.title;
	var weHaveATitle=false;
	if (!(typeof(paramTitle)=="undefined" || paramTitle=="" || paramTitle=="undefined"))
	{
		weHaveATitle=true;
	}
	
	console.log("just had a search for date:"+paramDate+" and title:"+paramTitle+" and date range "+paramDateAfter+" "+paramDateBefore);
	console.log ("so weHaveATitle="+weHaveATitle+" and weHaveADateRange="+weHaveADateRange+" and weHaveADate="+weHaveADate);
	
	
	// BEGIN THE SEARCH	
	
	var validEvents = [];
	
	//console.log("all the events are:"+JSON.stringify(content.events))
	
	for (var i = 0; i < content.events.length; i++) 
	{
		var evnt = content.events[i];
		console.log("current evvmt title :"+JSON.stringify(evnt.title))
		var eventMatchesSearch = true;
		if (weHaveATitle)
		{
			
			if(!evnt.title.includes(paramTitle))
			{
				eventMatchesSearch = false;
				console.log("	sorry wrong title");
			}
		}
		console.log("weHaveADate && eventMatchesSearch is "+(weHaveADate && eventMatchesSearch));
		if (weHaveADate && eventMatchesSearch)
		{
			console.log("	testing date");
			if(evnt.date!=paramDate)
			{
				console.log("	sorry wrong date");
				eventMatchesSearch = false;
			}
		}
		
		if (weHaveADateRange && eventMatchesSearch)
		{
			var evntMilisec = Date.parse(evnt.date);
			var eventDate = new Date(evntMilisec);
			console.log("	testing date range");
			console.log("			paramDateBefore="+paramDateBefore);
			console.log("			evnt.date="+eventDate);
			console.log("			paramDateAfter="+paramDateAfter);

			if(!(eventDate<paramDateBefore && eventDate>paramDateAfter))
			{
				console.log("	sorry not in date range, evnt.date<paramDateBefore s "+(eventDate<paramDateBefore)+ "and evnt.date>paramDateAfter is "+(eventDate>paramDateAfter));
				eventMatchesSearch = false;
			}
		}
		
		if(eventMatchesSearch)
		{
			console.log("we found a great event:"+JSON.stringify(evnt.title));
			console.log("formatting event, finding  venues.venues[evnt.venue_id] = " + JSON.stringify(venues.venues[evnt.venue_id]));
			
			
			finalEvent =
			{
				"ID":evnt.ID,
				"title":evnt.title,
				"description":evnt.description,
				"date":evnt.date,
				"url":evnt.url,
			}
			validEvents.push(evnt);
		}
	}
	
	
	var eventsListAsJSON = 
	{
		"events":validEvents
	}
	
	console.log("sending "+JSON.stringify(eventsListAsJSON))
	
	res.set('content-type', 'application/json');
	res.json(eventsListAsJSON);
	
});

app.get(baseURL+'/events/get/:ID', function(req, res){
	
	
	var content = events;
	var eventsList = content.events;
	res.setHeader('content-type', 'application/json');
	for (evnt in eventsList)
	{
		if (evnt.ID == ID)
		{
			res.json(evnt);
		}
	}
	res.json({"error": "no such event"});
});

app.post(baseURL+'/events/add', function(req, res){

	var content = events;
	var eventsArray = content.events;
	
	if(!isAuthorised(req.ip,req.query.auth_token))
	{
		res.status(400);
		res.json({"error": "not authorised, wrong token"});
	}
	else
	{

	
		var evnt = 
		{
			"ID":req.query.ID,
			"title":req.query.title,
			"date":req.query.date,
			"url":req.query.url,
			"description":req.query.description
		};
		
		
		if (typeof(evnt.title) == "undefined"||typeof(evnt.ID) == "undefined"||typeof(evnt.date) == "undefined")
		{
		res.status(400);
		res.setHeader('Content-Type', 'application/json');
		res.json({"error": "not authorised, you must enter name,ID,title"});
		}
		else
		{
			console.log("adding event"+JSON.stringify(evnt));
			eventsArray.push(evnt);
			content.events=eventsArray;
			console.log("eventss array is now: "+JSON.stringify(eventsArray));
			events=content;
			res.setHeader('Content-Type', 'application/json');
			res.json({'status' : 'ok'});
		}
	}


});



app.post(baseURL+'/resetEvents',function(req, res){
	resetEvents();
	res.setHeader('Content-Type', 'application/json');
	res.json({'status' : 'ok'});
});

function resetEvents()
{
	console.log("resetting Events")
	
	events = {"events":[
						{
						"ID":"1",
						"title":"Swaledale Squeeze 2018",
						"description":"The biggest and best concertina weekend in the world. Held each May in Grinton Lodge YHA, North Yorkshire",
						"summary":"The biggest and best concertina weekend in the world",
						"date":"2018-05-21T16:00:00Z",
						"url":"http://www.swaledalesqueeze.org.uk",
						"venue_id":"v_1" },
						
						
						]};
	
	// fs.writeFile('events.json', fs.readFileSync("eventsCopy.JSON"), 'utf8');
	
}



function isAuthorised(ip,auth_token)
{
	console.log("just had an authorisation method call on ip, auth:"+ip+auth_token);
	console.log("sessions currently:"+JSON.stringify(sessions));
	var lastLoginFromIP = sessions[ip]
	console.log("last login from ip "+ip+" was: "+JSON.stringify(lastLoginFromIP));
	var currentDate = new Date;
	if (typeof(lastLoginFromIP)=="undefined")
	{
		console.log("ip ("+ip+") not registered")
		return false
	}
	else
	{
		if (lastLoginFromIP[0]!=auth_token)
		{
			console.log("wrong auth_token")
			return false
		}
		else
		{
			if((currentDate-lastLoginFromIP[1])>7200000)
			{
				console.log("older than 2 hours")
				return false
			}
			else
			{
				
				return true;
			}
		}
		
	}
}

resetEvents();

var port = process.env.PORT || 8080;
app.listen(port,function()
{
	console.log("app running"+port);
});





