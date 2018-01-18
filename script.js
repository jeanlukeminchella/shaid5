
$(document).ready(function(){
	var baseURL = ""
	var objectsToDisplay='{"objects":[]}';
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

	
	
	$("#submitQuery").click(function()
	{
		var queryString = "/events/search?";
		
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
				if(data.events.length==0)
				{
					console.log("No such events!");
				}
				else
				{
					setObjectsToDisplay('{"objects":'+JSON.stringify(data.events)+"}");
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
		var newsItemsAsArray = JSON.parse(objectsToDisplay).objects;
		var numberOfEvents = newsItemsAsArray.length;
		
		
		
		var newsAsHTML = "";
		
		for (var i = 0 ; i < numberOfEvents ; i++)
		{
			newsAsHTML += newsItemToHTML (newsItemsAsArray[i]);
		}
		
		$("#newsList").html(newsAsHTML);
	}
	
	
	
	
	
	
	function newsItemToHTML(newsItem)
	{
		console.log("converting newsItem")
		html = '<newsItem class="row"> \r\n '
		
		if (typeof(newsItem.image)!="undefined")
		{
			
			html+='<div class="col-sm-3" ><img src="'+newsItem.image+'" width="150" height="150"></div> \r\n';
			
		}
		html+='<div class="col-sm-1" ></div><div class="col-sm-8" >'
		if (typeof(newsItem.title)!="undefined")
		{
		html += "<h1>"+newsItem.title +"</h1>\r\n "
		}
		
		html+='<button type="button" onclick="goToEventPage('+newsItem.ID+')">Find out more!</button>';

		if (typeof(newsItem.summary)!="undefined")
		{
		html += "<summaryOfnewsItem>"+newsItem.summary+"</summaryOfnewsItem> <br>\r\n"
		}
		
		if (typeof(newsItem.date)!="undefined")
		{
		html += "<dateOfnewsItem>"+newsItem.date+"</dateOfnewsItem> <br>\r\n"
		}
		
		
		html+="</div></newsItem>\r\n";
		
		
		console.log("we just made this html: "+html)
		return (html);
		
	
	}


	// Get the element with id="defaultOpen" and click on it
	document.getElementById("defaultOpen").click();
	
	$.getJSON("/search?amount=20", function(data)
	{
		console.log("we got "+JSON.stringify(data)+" from server");
		if(data.events.length==0)
		{
			console.log("No such events!");
		}
		else
		{
			setObjectsToDisplay('{"objects":'+JSON.stringify(data.events)+"}");
			updateNewsfeed();
		}
	}
	)
	
	
}
); 
