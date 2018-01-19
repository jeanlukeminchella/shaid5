	$(document).ready(function()
	{
		var baseURL = "";
		var auth_token=document.cookie.toString().substring(11);
		
		$("#reset").click(function()
		{
			
			$.get("/cleanAdmin.html");
			
		});

		$("#home").click(function()
		{
			window.location.assign(baseURL+"/");
			
		}); 		
		
		$("#showVenues").click(function()
		{
			$.get(baseURL+"/venues",function(data)
			
			{
				var newHtml = "";
				var venueIDs = Object.keys(data.venues);
				for (var i =0; i<venueIDs.length; i++)
				{
					var venue = data.venues[venueIDs[i]];
					var venueID = venueIDs[i];
					newHtml = newHtml + venueToHtml(venueID,venue);
				}
				$("#venuesDisplay").html(newHtml);
			}
			
			);
			
		});
		
		
		$("#submitCampaign").click(function()
		{
			console.log("submitign form");
			event.preventDefault();
			
			url = "/campaigns/add?"
				+ "ID=" + $("#CID").val() + "&"
				+ "title=" + $("#Ctitle").val() +  "&"
				+ "description="+ $("#Cdescription").val() + "&"
				+ "summary="+ $("#Csummary").val() + "&"
				+ "target="+ $("#Ctarget").val() + "&"
				+ "dateCreated="+ $("#CdateCreated").val()+ "&"
				+ "image="+ $("#Cimage").val()
				
			console.log("post url:"+url);
			$.post(baseURL+url, function(data)
			{
			if(data.status=="ok")
			{
				alert("submitted!");
			}	
			}
			);
		}); 
		
		$("#submitEvent").click(function()
		{
			console.log("submitign form2");
			event.preventDefault();
			var newEvent = {
				"auth_token":auth_token,
				"event_id":$("#Eevent_id").val(),
				"title":$("#Etitle").val(),
				"venue_id":$("#Evenue").val(),
				"date":$("#Edate").val(),
				"url":$("#Eurl").val(),
				"blurb":$("#Eblurb").val()		
			}
			
			url = "/events/add?" 
				+ "auth_token=" + auth_token +  "&"
				+ "event_id=" + newEvent.event_id + "&"
				+ "title="+ newEvent.title + "&"
				+ "venue_id="+ newEvent.venue_id + "&"
				+ "date="+ newEvent.date + "&"
				+ "url=" + newEvent.url + "&"
				+ "blurb="+ newEvent.blurb

			console.log("post url:"+url);
			$.post(baseURL+url,"", function(data) {
			if(data.status=="ok")
			{
				alert("submitted!");
			}			
			});
		});
		
		
		
		
	}); 
	
	
	