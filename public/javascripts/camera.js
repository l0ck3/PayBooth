var Camera = {

  element: null,

  params: {
    width: 640,
    height: 0
  },

  state: {
    streaming: false
  },

  init: function(elem) {
    this.element = document.getElementById(elem);
    var video = document.createElement('video');

    this.element.appendChild(video);
    this.video = video;

    navigator.webkitGetUserMedia({
        video: true,
        audio: false
      },

      function(localMediaStream) {
        video.src = window.URL.createObjectURL(localMediaStream);
        video.onloadedmetadata = function(e) {
          video.play();
          Camera.params.height = video.videoHeight / (video.videoWidth / Camera.params.width);
        };
      },

      function(error) {
        console.log('Something went wrong', error);
      }
    );
  },

  takeSnapshot: function() {
    console.log("Snapshot");
    var canvas = document.createElement('canvas');

    canvas.width = Camera.params.width;
    canvas.height = Camera.params.height;
    canvas.getContext('2d').drawImage(Camera.video, 0, 0, Camera.params.width, Camera.params.height);

    var data = canvas.toDataURL('image/png');
    return data;
  },

  hideStream: function() {
    this.video.style.display = 'none';
  },

  showStream: function() {
    this.video.style.display= 'inline';
  },

}
