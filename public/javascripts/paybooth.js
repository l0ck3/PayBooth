var uploadPicture = function(data, id) {
  var cloudname = $("#paybooth").data('cloudname'),
      preset = $("#paybooth").data('preset');

  $.post('https://api.cloudinary.com/v1_1/' + cloudname + '/image/upload', {
    file: data,
    upload_preset: preset,
    public_id: id
  }, function(event) {
    console.log(event);
  });
}

$(document).ready(function() {
  $("#button").on("token", function(event, token) {
    $.post('/payments', {
      token: token
    }, function(response) {
      var imageData = Camera.takeSnapshot();

      Camera.hideStream();
      $('.preview').show();
      $('.preview').attr('src', imageData);

      uploadPicture(imageData, response.transaction_id);

      setTimeout(function() {
        $('.preview').hide();
        Camera.showStream();
        $(".pay-button").attr('disabled', false);
      }, 5000);
    });
  });

  Camera.init("cam-zone");
});
