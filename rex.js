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
		"<button id='donate' onclick='donate("+event.ID+",'event') class='button'>Donate!</button></div></div>" + "<script src="+"'rex.js"+"'></script><link rel="+"'stylesheet"+"' href="+"'style.css"+"'>"
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
		alert("$('#donatedMoney').val() is "+$("#donatedMoney").val());
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


 