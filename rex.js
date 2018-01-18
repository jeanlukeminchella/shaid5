 $(function() {
    $('#objectPage').dialog({
        autoOpen: false
    });
});

function goToBlogPage(blog)
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
}
	
function goToEventPage(event)
{
	alert("rex over to you, event id="+event);
    $('#objectPage').dialog(
        'option',
        'title',
        'event ' + event.ID + ': ' + event.title
    );
    $('#objectPage').html(
        '<p><b>description: </b>' + event.description + '</p>' +
        '<p><b>summary: </b>' + event.summary + '</p>' +
        '<img src="' + event.image + '">' + 
        '<br><p style="text-align:right">created by ' + event.createdID + ' at ' + event.dateCreated + '</p>'
    );
    $('#objectPage').dialog('open');
}
	
function goToCampaignPage(campaign)
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
}
 