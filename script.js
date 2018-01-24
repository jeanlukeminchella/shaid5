
$(document).ready(function(){
	var baseURL = ""
	var objectsToDisplay='{"newsItems":[]}';
	var headlines='{"newsItems":[]}';
	console.log("doc ready");

	$("#loginButton").click(function()
	{
		var cookie = document.cookie;
		var lastAuth_token = cookie.replace("auth_token=","");
		var lastAuth_tokenValid=false
		$.getJSON(baseURL+"/login/validate?auth_token="+lastAuth_token, function(data)
		{
			if (data.isValid)
			{
				window.location.assign(baseURL+"/admin?auth_token="+lastAuth_token);
			}
		});
	});
	
	$("#submitLogin").click(function()
	{
		var loginURL = "/login/authenticate?username="+$("#username").val()+"&password="+$("#password").val()
		
		$.post(baseURL+loginURL, function(data)
		{
			console.log("we tried to login this is what we got: "+JSON.stringify(data));
			var newAuthToken = data.auth_token;
			if(typeof(newAuthToken)!="undefined")
			{
				document.cookie="auth_token="+newAuthToken;
				window.location.assign(baseURL+"/admin?auth_token="+newAuthToken);
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
		
		$.post(baseURL+loginURL, function(data)
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
			
			
			$.getJSON(baseURL+queryString, function(data)
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
		
		
		html+='<button class="button" type="button" style="font-size:10px" onclick='+"'openPage("+'"Newsfeed"'+", this);hideSectorTwo();"+curiousFunctionCall+"'>Find out more!</button><br>";
		
		
		html+="</div></div><br>\r\n";
		
		
		console.log("we just made this html: "+html)
		return (html);
		
	
	}

	// Get the element with id="defaultOpen" and click on it
	document.getElementById("defaultOpen").click();
	
	
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
	
	
	
	document.getElementById("sectorOne").style.minHeight=screen.height+"px";
	document.getElementById("sectorTwo").style.minHeight=screen.height+"px";
	
	
	
	
}
); 
