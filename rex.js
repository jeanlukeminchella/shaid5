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
	prevNewsfeed=document.getElementById("objectPage").className="box";
    setObjectPage(
		"<div class='row'><div class='col-sm-1'></div><div class='col-sm-10'>"+"<button onclick='location.reload()'>Back</button>"+
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
	prevNewsfeed=document.getElementById("objectPage").className="box";
	
    setObjectPage(
		"<div class='row'><div class='col-sm-3'></div><div class='col-sm-9'>"+"<button onclick='location.reload()'>Back</button>"+
		"<h1>"+event.title+"</h1><br>"+
        '<p><b>description: </b>' + event.description + '</p>' +
        '<p><b>summary: </b>' + event.summary + '</p>' +
        '<img src="' + event.image + '" style="height:400px;width:400px">' + 
        '<br><p>created by ' + event.creatorID + ' at ' + event.dateCreated + '</p></div></div>'
    );
}

function goToCampaignPage(campaign)
{
	console.log("loading campaign "+JSON.stringify(campaign));

    prevNewsfeed=document.getElementById("objectPage").innerHTML;
	prevNewsfeed=document.getElementById("objectPage").className="box";
	
    setObjectPage(
		"<div class='row'><div class='col-sm-3'></div><div class='col-sm-9'>"+"<button onclick='location.reload()'>Back</button>"+
		"<h1>"+campaign.title+"</h1><br>"+
        '<p><b>description: </b>' + campaign.description + '</p>' +
        '<p><b>summary: </b>' + campaign.summary + '</p>' +
        '<img src="' + campaign.image + '" style="height:400px;width:400px">' + 
        '<br><p>created by ' + campaign.creatorID + ' at ' + campaign.dateCreated + '</p></div></div><br><br>'
		+ "<input type='number' id='donatedMoney'><span><button id='donate' onclick='donate()'>Donate!</button>"
		+ '<iframe id="objectPage2" src= "objectPage.html"></iframe>'
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
 