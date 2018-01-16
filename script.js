<script>
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
		var queryString = "/events/search";
		
		if(dateAfter>dateBefore)
		{
			alert("Please enter a valid date range");
		}
		
		else
		{
			var startDate;
			if ($("#dateAfter").val()=="")
			{
				startDate = new Date();
			}
			else
			{
				startDate = $("#dateAfter").val();
			}
			console.log("startdate is "+startDate.toString());
			
			var endDate;
			endDate = $("#dateBefore").val();

			queryString+="?title="+$("#searchTitle").val()+"&dateAfter="+startDate+"&dateBefore="+endDate;
			
			$.getJSON(baseURL+queryString, function(data)
			{
				console.log("we got "+JSON.stringify(data)+" from server");
				if(data.events.length==0)
				{
					console.log("No such events!");
				}
				else
				{
					setObjectsToDisplay(JSON.stringify(data));
					updateEvents();
				}
			});
		}
	}); 
	
	function setObjectsToDisplay(text)
	{
		// console.log("setting evetns to display as: "+text);
		objectsToDisplay=text;
	}
	

	
	// this must be in json form {"events":[]}
	function addEventsToDisplay(text)
	{
		if (!(text=="" || typeof(text)=="undefined"))
		
		{
			var currentEvents=JSON.parse(eventsToDisplay);
			var newEvents=JSON.parse(text);
			var allEvents = currentEvents.events;
			for (i = 0; i < newEvents.length; i++) 
			{
	    		allEvents.push(newEvents[i]);
			};
			eventsToDisplay =
			{
				"events":allEvents
			}
		}
		
	}
	
	function updateEvents()
	{
		console.log("updatin events: "+eventsToDisplay)
		var eventsAsArray = JSON.parse(eventsToDisplay).events;
		var numberOfEvents = eventsAsArray.length;
		
		
		
		var eventsAsHTML = "";
		
		for (var i = 0 ; i < numberOfEvents ; i++)
		{
			eventsAsHTML += eventToHTML (eventsAsArray[i]);
		}
		
		$("#eventsList").html(eventsAsHTML);
	}
	
	var venues = {}
	$.get(baseURL+"/venues",function(data)
	{
		venues = data["venues"];
	});
	
	
	function getIcon(venue_id)
	{
		var venue=venues[venue_id]
		console.log("venue is "+ JSON.stringify(venue));
		console.log("venue.icon is "+venue.icon);
		return('<img src="'+venue.icon+'" class="img-responsive" style="width:50%" alt="Image">')
	}
	
	function eventToHTML(event)
	{
		console.log("converting event")
		html = '<div class="col-sm-6"> \r\n <div class="panel panel-primary"> \r\n  <div class="panel-heading">'
		
		if (typeof(event.title)!="undefined")
		{
		html += event.title
		}
		
		html += '</div> \r\n <div class="panel-body">'
		
		
		if (typeof(event.venue_id)!="undefined")
		{
			html+=getIcon(event.venue_id);
			
		}
		else
		{
			console.log("for event the venue is not defined")
		}
		
		html+='</div> \r\n <div class="panel-footer">'

		if (typeof(event.description)!="undefined")
		{
		html += "<descriptionOfEvent>"+event.description+"</descriptionOfEvent> <br>\r\n"
		}
		
		if (typeof(event.date)!="undefined")
		{
		html += "<dateOfEvent>"+event.date+"</dateOfEvent> <br>\r\n"
		}
		
		if (typeof(event.url)!="undefined")
		{
		html += '<a href="'+event.url.substring(0,25)+'">'+event.url.toString()+'...</a> <br>\r\n'
		}
		
		html+="</div>\r\n";
		html+="</div>\r\n";
		html+="</div>\r\n"
		
		
		console.log("we just made this html: "+html)
		return (html);
		
	
	}

	function externalEventToHTML(event)
	{
		console.log("converting event")
		html = '<div class="col-sm-6"> \r\n <div class="panel panel-primary"> \r\n  <div class="panel-heading">'
		
		if (event.title!="(error: xml property not found)")
		{
		html += event.title
		}
		
		html += '</div> \r\n <div class="panel-body">'
		
		if (event.img!="(error: xml property not found)")
		{
			html+='<img src="'+event.img+'" class="img-responsive" style="width:100%" alt="Image">'
		}
		html+='</div> \r\n <div class="panel-footer">'

		if (event.description!="(error: xml property not found)")
		{
		html += "<descriptionOfEvent>"+event.description.substring(0,25)+"</descriptionOfEvent> <br>\r\n"
		}
		
		if (event.date!="(error: xml property not found)")
		{
		html += "<dateOfEvent>"+event.date.substring(0,25)+"</dateOfEvent> <br>\r\n"
		}
		
		if (event.url!="(error: xml property not found)")
		{
		html += '<a href="'+event.url+'">'+event.url.toString().substring(0,25)+'</a> <br>\r\n'
		}
		
		html+="</div>\r\n";
		html+="</div>\r\n";
		html+="</div>\r\n";
		
		
		console.log("we just made this html: "+html)
		return (html);
		
	
	}
	
	function goToBlogPage(blog)
	{
		
	}
	
	function goToEventPage(event)
	{
	
	}
		
	function goToCampaignPage(campaign)
	{
	
	}
	
	// Get the element with id="defaultOpen" and click on it
	document.getElementById("defaultOpen").click();
	
}); 

</script>