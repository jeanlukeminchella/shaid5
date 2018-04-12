$(document).ready(function() {
  
  var auth_token = Cookies.get('auth_token');

  
  $("#admin").click(function() {
    window.location.assign("/admin/admin.html?auth_token=" + auth_token);
  });

  $("#event").click(function() {
    window.location.assign("/event/event.html?auth_token=" + auth_token);
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
        $('#campaign-image').val(e.target.result);
        $('#campaign-image').attr('readonly', true);
      }
      reader.readAsDataURL(this.files[0]);
    }
  });
  
  
  $('#campaign-submit').click(function () {
    $.ajax({
      type: "POST",
      url: '/campaign/data',
      dataType: 'json',
      data: {
        'op': 'create',
        'data': {
          'ID': $('#campaign-id').val(),
          'type': 'campaign',
          'title': $('#campaign-title').val(),
          'description': $('#campaign-description').val(),
          'summary': $('#campaign-summary').val(),
          'image': $('#campaign-image').val(),
          'dateCreated': $('#campaign-start').val(),
          'expired': $('#campaign-expired').val()
        }
      },
      success: function(data) {
        $('#campaignModal').modal('toggle');
        alert('create successfully!');
        location.reload();
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        var data = XMLHttpRequest.responseJSON;
        alert(data.message);
      }
    });
  });
  
  $('#campaign-submit-edit').click(function () {
    $.ajax({
      type: "POST",
      url: '/campaign/data',
      dataType: 'json',
      data: {
        'op': 'edit',
        'data': {
          'ID': $('#campaign-id-edit').val(),
          'type': 'campaign',
          'title': $('#campaign-title-edit').val(),
          'description': $('#campaign-description-edit').val(),
          'summary': $('#campaign-summary-edit').val(),
          'image': $('#campaign-image-edit').val(),
          'dateCreated': $('#campaign-start-edit').val(),
          'expired': $('#campaign-expired-edit').val()
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
  
  function editCampaign(id) {
    $('#campaign-id-edit').val(id);
    $.get('/campaign/data', function(data) {
      if (data[id]) {
        $('#campaign-title-edit').val(data[id].title);
        $('#campaign-description-edit').val(data[id].description);
        $('#campaign-summary-edit').val(data[id].summary);
        $('#campaign-image-edit').val(data[id].image);
        $('#campaign-start-edit').val(data[id].dateCreated);
        $('#campaign-expired-edit').val(data[id].expired);
      }
      $('#campaignModalEdit').modal('toggle');
    });
  }
  
  function deleteCampaign(id) {
    $.ajax({
      type: "POST",
      url: '/campaign/data',
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
  
  window.editCampaign = editCampaign;
  window.deleteCampaign = deleteCampaign;
  
  $.get('/campaign/data', function(data) {
    if (!Object.keys(data).length) {
      alert('No campaign found!');
    } else {
      var res = '';
      for (var e in data) {
        res += '<div class="media">' +
                 '<div class="media-left media-middle">' +
                    '<img src="' + data[e].image + '" class="media-object" style="width:150px">' +
                 '</div>' + 
                 '<div class="media-body">' +
                     '<h3 class="media-heading"> ' + data[e].type + ' ' + data[e].ID + ' <small><i>Posted on ' + data[e].dateCreated + '</i></small></h3>' +
                     '<p><b>Title: </b>' + data[e].title + '</p>' +
                     '<p><b>Summary: </b>' + data[e].summary + '</p>' +
                     '<p><b>Description: </b>' + data[e].description + '</p>' +
                     '<button onclick="editCampaign(\'' + data[e].ID + '\')" type="button" class="btn btn-sm btn-warning">' +
                     '<span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>&nbsp;Edit</button>&nbsp;&nbsp;' +
                     '<button onclick="deleteCampaign(\'' + data[e].ID + '\')" type="button" class="btn btn-sm btn-danger">' +
                     '<span class="glyphicon glyphicon-trash" aria-hidden="true"></span>&nbsp;Delete</button>' +
                 '</div>' +
               '</div>' +
               '<hr>';
      }
      $('#campaign').html(res);
    }
  });
  
  
}); 
