
$(document).ready(function(){
	var objectsToDisplay='{"newsItems":[]}';
	var headlines='{"newsItems":[]}';
	console.log("doc ready");

	$("#loginButton").click(function()
	{
		alert("login clicked");
		var cookie = document.cookie;
		var lastAuth_token = cookie.replace("auth_token=","");
		var lastAuth_tokenValid=false
		$.getJSON("/login/validate?auth_token="+lastAuth_token, function(data)
		{
			if (data.isValid)
			{
				goToWebPage(admin,lastAuth_token);
			}
		});
	});
	
	
	
	$("#submitLogin").click(function()
	{
		var loginURL = "/login/authenticate?username="+$("#username").val()+"&password="+$("#password").val()
		
		$.post(loginURL, function(data)
		{
			console.log("we tried to login this is what we got: "+JSON.stringify(data));
			var newAuthToken = data.auth_token;
			if(typeof(newAuthToken)!="undefined")
			{
				document.cookie="auth_token="+newAuthToken;
				window.location.assign("/admin/admin?auth_token="+newAuthToken);
			}
			else
			{
				alert("incorrecct username or password");
			}
		});
	}
	);
	
	$("#submitUser").click(function()
	{
		var loginURL = "/users/add?username="+$("#newUsername").val()+"&password="+$("#newPassword").val()
		
		$.post(loginURL, function(data)
		{
			console.log("we tried to create user");
			alert("User Created!");
			$("#newUsername").val()="";
			$("#newPassword").val()="";
		});
	}
	);
	
	

	
	
	$("#submitQuery").click(function()
	{
		var queryString = "/search?";
		
		if(dateAfter>dateBefore)
		{
			alert("Please enter a valid date range");
		}
		
		else
		{
			if ($("#dateAfter").val()!="")
			{
				queryString+="dateAfter="+$("#dateAfter").val()+"&";
			}
			if ($("#dateBefore").val()!="")
			{
				queryString+="dateBefore="+$("#dateBefore").val()+"&";
			}
			if ($("#keyword").val()!="")
			{
				queryString+="keyword="+$("#keyword").val()+"&";
			}
			
			var x = document.getElementById("includeBlogs");
			var includeBlogs = (x.checked);
			x = document.getElementById("includeEvents");
			var includeEvents = (x.checked);
			x = document.getElementById("includeCampaigns");
			var includeCampaigns = (x.checked);
			
			if (includeBlogs || includeCampaigns || includeEvents)
			{
				if (includeBlogs)
				{
					queryString+="includeBlogs="+includeBlogs+"&";
				}
				if (includeCampaigns)
				{
					queryString+="includeCampaigns="+includeCampaigns+"&";
				}
				if (includeEvents)
				{
					queryString+="includeEvents="+includeEvents+"&";
				}
			}
			
			queryString+="amount=20";
			
			
			
			console.log("sending GET Request "+queryString);
			
			
			$.getJSON(queryString, function(data)
			{
				console.log("we got "+JSON.stringify(data)+" from server");
				if(data.newsItems.length==0)
				{
					console.log("No such newsItems!");
				}
				else
				{
					setObjectsToDisplay('{"newsItems":'+JSON.stringify(data.newsItems)+"}");
					updateNewsfeed();
				}
			}
			);
		}
	}); 
	
	function setObjectsToDisplay(text)
	{
		console.log("setting evetns to display as: "+text);
		objectsToDisplay=text;
	}
	
	function setHeadlines(text)
	{
		console.log("setting evetns to display as: "+text);
		headlines=text;
	}
	

	
	/* // this must be in json form {"events":[]}
	function addobjectsToDisplay(text)
	{
		if (!(text=="" || typeof(text)=="undefined"))
		
		{
			var currentEvents=JSON.parse(objectsToDisplay);
			var newEvents=JSON.parse(text);
			var allEvents = currentEvents.events;
			for (i = 0; i < newEvents.length; i++)
			{
				allEvents.push(newEvents[i]);
			}
			objectsToDisplay = '{"events":'+allEvents+'}'
		} 
		
	} */
	
	function updateNewsfeed()
	{
		console.log("updatin news items: "+objectsToDisplay)
		var newsItemsAsArray = JSON.parse(objectsToDisplay).newsItems;
		var numberOfEvents = newsItemsAsArray.length;
		
		
		
		var newsAsHTML = "";
		
		for (var i = 0 ; i < numberOfEvents ; i++)
		{
			newsAsHTML += newsItemToHTML (newsItemsAsArray[i]);
		}
		
		$("#newsList").html(newsAsHTML);
	}
	
	function updateHeadlines()
	{
		console.log("updatin news items: "+headlines)
		var newsItemsAsArray = JSON.parse(headlines).newsItems;
		var numberOfEvents = newsItemsAsArray.length;
		
		
		
		var newsAsHTML = "";
		
		for (var i = 0 ; i < numberOfEvents ; i++)
		{
			newsAsHTML += newsItemToHTML (newsItemsAsArray[i]);
		}
		
		$("#headlines").html(newsAsHTML);
	}
	
	
	
	
	
	function newsItemToHTML(newsItem)
	{
		console.log("converting newsItem")
		html = '<div id="newsItem" class="row" style="padding:0px">'
		
		
		
		if (typeof(newsItem.image)!="undefined")
		{
			
			html+='<div class="col-sm-3" style="padding:0px"><img src="'+newsItem.image+'" width="100%" height="100%" ></div> \r\n';
			
		}
		html+="<div class='col-sm-9 box' id='caption'><b>"+newsItem.type+"</b> - ";

		if (typeof(newsItem.title)!="undefined")
		{
		html += newsItem.title +"\r\n <br>"
		}
		
		

		if (typeof(newsItem.summary)!="undefined")
		{
		html += "<summaryOfnewsItem>"+newsItem.summary+"</summaryOfnewsItem> <br>\r\n"
		}
		
		
		
		if (typeof(newsItem.date)!="undefined")
		{
		html += "<dateOfnewsItem>"+newsItem.date+"</dateOfnewsItem> <br>\r\n"
		}
		
		var curiousFunctionCall = "goTo";
		if(newsItem.type=="blog")
		{
			curiousFunctionCall+="BlogPage(";
		}
		else{if(newsItem.type=="campaign")
		{
			curiousFunctionCall+="CampaignPage(";
		}
		else{if(newsItem.type=="event")
		{
			curiousFunctionCall+="EventPage(";
		}}}
		curiousFunctionCall+=JSON.stringify(newsItem)+")";
		
		
		//html+='<button class="button" type="button" style="font-size:10px" ;"+curiousFunctionCall+"'>Find out more!</button><br>";
		
		
		html+="</div></div><br>\r\n";
		
		
		console.log("we just made this html: "+html)
		return (html);
		
	
	}


	
	
	$.getJSON("/search?amount=20", function(data)
	{
		console.log("we got "+JSON.stringify(data)+" from server");
		if(data.newsItems.length==0)
		{
			console.log("No such events!");
		}
		else
		{
			setObjectsToDisplay('{"newsItems":'+JSON.stringify(data.newsItems)+"}");
			updateNewsfeed();
		}
	});
	
	$.getJSON("/search?amount=3", function(data)
	{
		console.log("we got "+JSON.stringify(data)+" from server");
		if(data.newsItems.length==0)
		{
			console.log("No such events!");
		}
		else
		{
			setHeadlines('{"newsItems":'+JSON.stringify(data.newsItems)+"}");
			updateHeadlines();
		}
	});
	/*
	document.getElementById("homeButton").addEventListener("click", goToWebPage("home.html"));
	document.getElementById("servicesButton").addEventListener("click",goToWebPage("services.html"));
	document.getElementById("aboutButton").addEventListener("click",goToWebPage("about.html"));
	*/
	
	
	// rex bit
	
	/*  $(function() {
    $('#objectPage').dialog({
        autoOpen: false
    });
}); */

var prevNewsfeed = "";

/* function goToBlogPage(blog)
{
    $('#objectPage').dialog(
        'option',
        'title',
        'blog ' + blog.ID + ': ' + blog.title
    );
    $('#objectPage').html(
        '<p><b>summary: </b>' + blog.summary + '</p>' +
        '<p><b>text: </b>' + blog.text + '</p>' +
        '<br><p style="text-align:right">created by ' + blog.createdID + ' at ' + blog.dateCreated + '</p>'
    );
    $('#objectPage').dialog('open');
} */

function goToBlogPage(blog)
{
	console.log("loading blog "+JSON.stringify(blog));

    prevNewsfeed=document.getElementById("objectPage").innerHTML;
	document.getElementById("sectorOne").style.backgroundImage="none";
	document.getElementById("sectorOne").style.backgroundColor="rgb(224,244,242)";
	
    setObjectPage(
		"<div class='row object'><div class='col-sm-1'></div><div class='col-sm-10'>"+"<button onclick='location.reload()' class='button'>Back</button>"+
		"<h1>"+blog.title+"</h1><br>"+
        '<p><b>text: </b>' + blog.text + '</p>' +
        '<p><b>summary: </b>' + blog.summary + '</p>' +
        '<img src="' + blog.image + '" style="height:400px;width:400px">' + 
        '<br><p>created by ' + blog.creatorID + ' at ' + blog.dateCreated + '</p></div></div>'
    );
	
    
}
	
function goToEventPage(event)
{
	console.log("loading event "+JSON.stringify(event));

    prevNewsfeed=document.getElementById("objectPage").innerHTML;
	document.getElementById("sectorOne").style.backgroundImage="none";
	document.getElementById("sectorOne").style.backgroundColor="rgb(224,244,242)";
	
    setObjectPage(
		"<div class='row object'><div class='col-sm-1'></div><div class='col-sm-10'>"+"<button onclick='location.reload()' class='button'>Back</button>"+
		"<h1>"+event.title+"</h1><br>"+
        '<p><b>description: </b>' + event.description + '</p>' +
        '<p><b>summary: </b>' + event.summary + '</p>' +
        '<img src="' + event.image + '" style="height:400px;width:400px">' + 
        '<br><p>created by ' + event.creatorID + ' at ' + event.dateCreated + '</p><br><br>' + 
		"target, amount = "+event.target+" "+event.amountDonated+
		"<div class='progress' ><div class='progress-bar' role='progressbar' aria-valuenow='"+event.amountDonated+"'aria-valuemin='0' aria-valuemax='"+event.target+"' style='width:"+progressPercentage(event.amountDonated,event.target)+"%'></div></div>"+
		"<input type='number' id='donatedMoney'><span><br>"+
		"<button id='donate' style='margin:'onclick='donate("+event.ID+","+'"campaign")'+"'"+' class='+"'button'>Donate!</button></div></div>" + "<script src="+"'rex.js"+"'></script><link rel="+"'stylesheet"+"' href="+"'style.css"+"'>"
    );
}


	
function goToCampaignPage(campaign)
{
	console.log("loading campaign "+JSON.stringify(campaign));

    prevNewsfeed=document.getElementById("objectPage").innerHTML;
	document.getElementById("sectorOne").style.backgroundImage="none";
	document.getElementById("sectorOne").style.backgroundColor="rgb(224,244,242)";
	
    setObjectPage(
		"<div class='row object'><div class='col-sm-1'></div><div class='col-sm-10'>"+"<button onclick='location.reload()' class='button'>Back</button>"+
		"<h1>"+campaign.title+"</h1><br>"+
        '<p><b>description: </b>' + campaign.description + '</p>' +
        '<p><b>summary: </b>' + campaign.summary + '</p>' +
        '<img src="' + campaign.image + '" style="height:400px;width:400px">' + 
        '<br><p>created by ' + campaign.creatorID + ' at ' + campaign.dateCreated + '</p><br><br>' +
		"target, amount = "+campaign.target+" "+campaign.amountDonated+
		"<div class='progress' ><div class='progress-bar' role='progressbar' aria-valuenow='"+campaign.amountDonated+"'aria-valuemin='0' aria-valuemax='"+campaign.target+"' style='width:"+progressPercentage(campaign.amountDonated,campaign.target)+"%'></div></div><br>"+
		"<input type='number' id='donatedMoney'><span><br><br>"+
		"<button id='donate' style='margin:'onclick='donate("+campaign.ID+","+'"campaign")'+"'"+' class='+"'button'>Donate!</button></div></div>" + "<script src="+"'rex.js"+"'></script><link rel="+"'stylesheet"+"' href="+"'style.css"+"'>"
    );
}

function setObjectPage(htmlIn)
{
	console.log("setting object page as "+htmlIn)
	$("#objectPage").html(htmlIn);
}
	
/* function goToCampaignPage(campaign)
{
    $('#objectPage').dialog(
        'option',
        'title',
        'campaign ' + campaign.ID + ': ' + campaign.title
    );
    $('#objectPage').html(
        '<p><b>description: </b>' + campaign.description + '</p>' +
        '<p><b>summary: </b>' + campaign.summary + '</p>' +
        '<p><b>target: </b>' + campaign.target + '</p>' +
        '<img src="' + campaign.image + '">' + 
        '<p><b>expiry date: </b>' + campaign.expiryDate + '</p>' +
        '<br><p style="text-align:right">created by ' + campaign.createdID + ' at ' + campaign.dateCreated + '</p>'
    );
    $('#objectPage').dialog('open');
} */

function progressPercentage(donated, target)
{
	try
	{
		var donatedFloat = parseFloat(donated);
		var targetFloat = parseFloat(target);
		return (donatedFloat*100/targetFloat);
	}
	catch(err)
	{
		return 0;
	}
}

function donate(id,type)
	{
		// alert("$('#donatedMoney').val() is "+$("#donatedMoney").val());
		if(type=="event")
		{
			$.post("/events/donate?id="+id+"&amount="+$("#donatedMoney").val(), function(data)
			{
				alert("donated! Thanks")
			});
		}
		else
		{
			if(type=="campaign")
			{
				$.post("/campaigns/donate?id="+id+"&amount="+$("#donatedMoney").val(), function(data)
				{
					alert("donated! Thanks")
				});
			}
			else
			{
				alert("sorry were not sure what youre donating to");
			}
		}
	}






}); 

function goToWebPage(pageName)
	{
		window.location.assign("/"+pageName);
	}
	

 function goToWebPage(pageName, auth_token)
	{
		
			window.location.assign("/"+pageName+"?auth_token="+auth_token);
		
	}
