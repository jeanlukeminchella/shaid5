$(document).ready(function() {
  
  var auth_token = Cookies.get('auth_token');

  
  $("#event").click(function() {
    window.location.assign("/event/event.html?auth_token=" + auth_token);
  });

  $("#campaign").click(function() {
    window.location.assign("/campaign/campaign.html?auth_token=" + auth_token);
  });
  
  function backup(type) {
    if (type == 'event') {
      $.get('/event/data', function(data) {
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
        var backupElement = document.getElementById('backuplink');
        backupElement.setAttribute("href", dataStr);
        backupElement.setAttribute("download", "event.backup.json");
        backupElement.click();
      });
    } else if (type == 'campaign') {
      $.get('/campaign/data', function(data) {
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
        var backupElement = document.getElementById('backuplink');
        backupElement.setAttribute("href", dataStr);
        backupElement.setAttribute("download", "campaign.backup.json");
        backupElement.click();
      });
    } else if (type == 'all') {
      $.get('/event/data', function(data1) {
        $.get('/campaign/data', function(data2) {
          var data = {'event': data1, 'campaign': data2};
          var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
          var backupElement = document.getElementById('backuplink');
          backupElement.setAttribute("href", dataStr);
          backupElement.setAttribute("download", "database.backup.json");
          backupElement.click();
        });
      });
    } else {
      alert('Unkown type ' + type + '!');
    }
  }
  
  window.backup = backup;
  
}); 
