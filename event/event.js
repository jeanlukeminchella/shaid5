$(document).ready(function() {
  
  var auth_token = Cookies.get('auth_token');

  
  $("#admin").click(function() {
    window.location.assign("/admin/admin.html?auth_token=" + auth_token);
  });

  $("#campaign").click(function() {
    window.location.assign("/campaign/campaign.html?auth_token=" + auth_token);
  });
  
  
  $(document).on('change', '.btn-file :file', function() {
		var input = $(this);
    var label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
		input.trigger('fileselect', [label]);
  });

  $('.btn-file :file').on('fileselect', function(event, label) {
    var input = $(this).parents('.input-group').find(':text');
    var log = label;
      
    if(input.length) {
      input.val(log);
    } else {
      if (log) {
        alert(log);
      }
    }
  });

  $("#imgInp").change(function(){
    if (this.files && this.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
        $('#img-upload').attr('src', e.target.result);
        $('#event-image').val(e.target.result);
        $('#event-image').attr('readonly', true);
      }
      reader.readAsDataURL(this.files[0]);
    }
  });
  
  $("#imgInp-edit").change(function(){
    if (this.files && this.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
        $('#img-upload-edit').attr('src', e.target.result);
        $('#event-image-edit').val(e.target.result);
        $('#event-image-edit').attr('readonly', true);
      }
      reader.readAsDataURL(this.files[0]);
    }
  });
  
  $("#imgInp-published").change(function(){
    if (this.files && this.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
        $('#img-upload-published').attr('src', e.target.result);
        $('#event-image-published').val(e.target.result);
        $('#event-image-published').attr('readonly', true);
      }
      reader.readAsDataURL(this.files[0]);
    }
  }); 
  
  
  $('#event-submit').click(function () {
    $.ajax({
      type: "POST",
      url: '/event/data',
      dataType: 'json',
      data: {
        'op': 'create',
        'data': {
          'ID': $('#event-id').val(),
          'byAdmin': false,
          'type': 'event',
          'title': $('#event-title').val(),
          'description': $('#event-description').val(),
          'summary': $('#event-summary').val(),
          'image': $('#event-image').val(),
          'dateCreated': $('#event-start').val(),
          'expired': $('#event-expired').val()
        }
      },
      success: function(data) {
        $('#eventModal').modal('toggle');
        alert('create successfully!');
        location.reload();
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        var data = XMLHttpRequest.responseJSON;
        alert(data.message);
      }
    });
  });
  
  $('#event-submit-edit').click(function () {
    $.ajax({
      type: "POST",
      url: '/event/data',
      dataType: 'json',
      data: {
        'op': 'edit',
        'data': {
          'ID': $('#event-id-edit').val(),
          'byAdmin': false,
          'type': 'event',
          'title': $('#event-title-edit').val(),
          'description': $('#event-description-edit').val(),
          'summary': $('#event-summary-edit').val(),
          'image': $('#event-image-edit').val(),
          'dateCreated': $('#event-start-edit').val(),
          'expired': $('#event-expired-edit').val()
        }
      },
      success: function(data) {
        $('#campaignModalEdit').modal('toggle');
        alert('edit successfully!');
        location.reload();
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        var data = XMLHttpRequest.responseJSON;
        alert(data.message);
      }
    });
  });
  
  $('#event-submit-published').click(function () {
    $.ajax({
      type: "POST",
      url: '/event/data',
      dataType: 'json',
      data: {
        'op': 'create',
        'data': {
          'ID': $('#event-id-published').val(),
          'byAdmin': true,
          'type': 'event',
          'title': $('#event-title-published').val(),
          'description': $('#event-description-published').val(),
          'summary': $('#event-summary-published').val(),
          'image': $('#event-image-published').val(),
          'dateCreated': $('#event-start-published').val(),
          'expired': $('#event-expired-published').val()
        }
      },
      success: function(data) {
        $('#campaignModalPublished').modal('toggle');
        alert('create successfully!');
        location.reload();
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        var data = XMLHttpRequest.responseJSON;
        alert(data.message);
      }
    });
  });
  
  function publishEvent(id) {
    $.ajax({
      type: "POST",
      url: '/event/data',
      dataType: 'json',
      data: {
        'op': 'publish',
        'data': {
          'ID': id
        }
      },
      success: function(data) {
        alert('publish successfully!');
        location.reload();
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        var data = XMLHttpRequest.responseJSON;
        alert(data.message);
      }
    });
  }
  
  function editEvent(id) {
    $('#event-id-edit').val(id);
    $.get('/event/data', function(data) {
      if (data[id]) {
        $('#event-title-edit').val(data[id].title);
        $('#event-description-edit').val(data[id].description);
        $('#event-summary-edit').val(data[id].summary);
        $('#event-image-edit').val(data[id].image);
        $('#event-start-edit').val(data[id].dateCreated);
        $('#event-expired-edit').val(data[id].expired);
      }
      $('#eventModalEdit').modal('toggle');
    });
  }
  
  function deleteEvent(id) {
    $.ajax({
      type: "POST",
      url: '/event/data',
      dataType: 'json',
      data: {
        'op': 'delete',
        'data': {
          'ID': id
        }
      },
      success: function(data) {
        alert('delete successfully!');
        location.reload();
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        var data = XMLHttpRequest.responseJSON;
        alert(data.message);
      }
    });
  }
  
  window.publishEvent = publishEvent;
  window.editEvent = editEvent;
  window.deleteEvent = deleteEvent;
  
  $.get('/event/data', function(data) {
    if (!Object.keys(data).length) {
      alert('No event found!');
    } else {
      var res1 = '';
      var res2 = '';
      for (var e in data) {
        if (data[e].byAdmin) {
          res1 += '<div class="media">' +
                   '<div class="media-left media-middle">' +
                      '<img src="' + data[e].image + '" class="media-object" style="width:150px">' +
                   '</div>' + 
                   '<div class="media-body">' +
                       '<h3 class="media-heading"> ' + data[e].type + ' ' + data[e].ID + ' <small><i>Posted on ' + data[e].dateCreated + '</i></small></h3>' +
                       '<p><b>Title: </b>' + data[e].title + '</p>' +
                       '<p><b>Summary: </b>' + data[e].summary + '</p>' +
                       '<p><b>Description: </b>' + data[e].description + '</p>' +
                       '<button onclick="deleteEvent(\'' + data[e].ID + '\')" type="button" class="btn btn-sm btn-danger">' +
                       '<span class="glyphicon glyphicon-trash" aria-hidden="true"></span>&nbsp;Delete</button>' +
                   '</div>' +
                 '</div>' +
                 '<hr>';
        } else {
          res2 += '<div class="media">' +
                   '<div class="media-left media-middle">' +
                      '<img src="' + data[e].image + '" class="media-object" style="width:150px">' +
                   '</div>' + 
                   '<div class="media-body">' +
                       '<h3 class="media-heading"> ' + data[e].type + ' ' + data[e].ID + ' <small><i>Posted on ' + data[e].dateCreated + '</i></small></h3>' +
                       '<p><b>Title: </b>' + data[e].title + '</p>' +
                       '<p><b>Summary: </b>' + data[e].summary + '</p>' +
                       '<p><b>Description: </b>' + data[e].description + '</p>' +
                       '<button onclick="publishEvent(\'' + data[e].ID + '\')" type="button" class="btn btn-sm btn-info">' +
                       '<span class="glyphicon glyphicon-upload" aria-hidden="true"></span>&nbsp;Publish</button>&nbsp;&nbsp;' +
                       '<button onclick="editEvent(\'' + data[e].ID + '\')" type="button" class="btn btn-sm btn-warning">' +
                       '<span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>&nbsp;Edit</button>&nbsp;&nbsp;' +
                       '<button onclick="deleteEvent(\'' + data[e].ID + '\')" type="button" class="btn btn-sm btn-danger">' +
                       '<span class="glyphicon glyphicon-trash" aria-hidden="true"></span>&nbsp;Delete</button>' +
                   '</div>' +
                 '</div>' +
                 '<hr>';
        }
      }
      $('#event-published').html(res1);
      $('#event-draft').html(res2);
    }
  });
  
  
}); 
