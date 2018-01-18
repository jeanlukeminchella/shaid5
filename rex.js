 $(function() {
    $('#dialog').dialog({
        autoOpen: false
    });
});

function goToBlogPage(blog)
{
    $('#dialog').dialog(
        'option',
        'title',
        'blog ' + blog.ID + ': ' + blog.title
    );
    $('#dialog').html(
        '<p><b>summary: </b>' + blog.summary + '</p>' +
        '<p><b>text: </b>' + blog.text + '</p>' +
        '<br><p style="text-align:right">created by ' + blog.createdID + ' at ' + blog.dateCreated + '</p>'
    );
    $('#dialog').dialog('open');
}
	
function goToEventPage(event)
{
	alert("rex over to you");
    $('#dialog').dialog(
        'option',
        'title',
        'event ' + event.ID + ': ' + event.title
    );
    $('#dialog').html(
        '<p><b>description: </b>' + event.description + '</p>' +
        '<p><b>summary: </b>' + event.summary + '</p>' +
        '<img src="' + event.image + '">' + 
        '<br><p style="text-align:right">created by ' + event.createdID + ' at ' + event.dateCreated + '</p>'
    );
    $('#dialog').dialog('open');
}
	
function goToCampaignPage(campaign)
{
    $('#dialog').dialog(
        'option',
        'title',
        'campaign ' + campaign.ID + ': ' + campaign.title
    );
    $('#dialog').html(
        '<p><b>description: </b>' + campaign.description + '</p>' +
        '<p><b>summary: </b>' + campaign.summary + '</p>' +
        '<p><b>target: </b>' + campaign.target + '</p>' +
        '<img src="' + campaign.image + '">' + 
        '<p><b>expiry date: </b>' + campaign.expiryDate + '</p>' +
        '<br><p style="text-align:right">created by ' + campaign.createdID + ' at ' + campaign.dateCreated + '</p>'
    );
    $('#dialog').dialog('open');
}
 