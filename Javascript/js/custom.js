// check to make sure you're alive
console.log("hey, I'm working :) ")

// Grab elements, create settings, etc.
var video = document.getElementById('video');

// Get access to the camera!
if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  // Not adding `{ audio: true }` since we only want video now
  navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
    // video.src = window.URL.createObjectURL(stream);
    video.srcObject = stream;
    video.play();
  });
} 

/* Legacy code below: getUserMedia 
else if(navigator.getUserMedia) { // Standard
  navigator.getUserMedia({ video: true }, function(stream) {
    video.src = stream;
    video.play();
  }, errBack);
} else if(navigator.webkitGetUserMedia) { // WebKit-prefixed
  navigator.webkitGetUserMedia({ video: true }, function(stream){
    video.src = window.webkitURL.createObjectURL(stream);
    video.play();
  }, errBack);
} else if(navigator.mozGetUserMedia) { // Mozilla-prefixed
  navigator.mozGetUserMedia({ video: true }, function(stream){
    video.srcObject = stream;
    video.play();
  }, errBack);
}
*/

// Elements for taking the snapshot

const canvas = document.createElement('canvas');
const img = new Image();
img.crossOrigin = 'anonymous';

//var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var video = document.getElementById('video');

//var drawn = context.drawImage(video, 0, 0, 640, 480);

// Trigger photo take
document.getElementById("snap").addEventListener("click", function() {
    /*context.drawImage(video, 0, 0, 640, 480);
    data = canvas.toDataURL("image/png");
    data = data.replace("data:image/png;base64,", "");
    console.log(data);
    askLobe(data);*/
  canvas.width = img.width;
  canvas.height = img.height;
  canvas.getContext('2d').drawImage(img, 0, 0);
  const data = canvas.toDataURL('image/jpeg');
  fetchPredictionForImage(data);
});

//console.log(context.toDataURL());

// might need to add jQuery when() in order to only use drawn when the photo is snapped
/*
var photo = drawn.toDataURL();
var newstr = "";
var i;

for (i = 0; i < photo.length; i++) {
  if (newstr.includes("base64,")) {
      //console.log(newstr);
      photo = photo.substr(newstr.length);
      break;
  }
  else {
    newstr = newstr + photo[i];
    //console.log(newstr);
  }
}
*/

// now, moving on to my Lobe API
console.log("hey, moving on to the Lobe API")
/*
function askLobe(base64image) {
  var data = JSON.stringify({
    "inputs": {
      "Image": base64image
    }
  });

  var xhr = new XMLHttpRequest();
  xhr.withCredentials = false;

  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === this.DONE) {
      console.log(this.responseText);
      document.getElementById("changeme").innerHTML = this.responseText;
      var x = JSON.parse(this.responseText);
      console.log(x.outputs.Prediction);
      document.getElementById("changeme").innerHTML = x.outputs.Prediction;
    }
  });

  xhr.open("POST", "http://localhost:38101/v1/predict/02ac0c17-06a3-464b-bbb6-f3b34ccb4592");
  //xhr.open("POST", "http://localhost:38100/predict/02ac0c17-06a3-464b-bbb6-f3b34ccb4592");
  //xhr.open("POST", "http://192.168.100.130:5000/predict/02ac0c17-06a3-464b-bbb6-f3b34ccb4592");

  xhr.send(data);
}
*/

const fetchPredictionForImage = base64Img => {
  //fetch("http://localhost:38101/v1/predict/02ac0c17-06a3-464b-bbb6-f3b34ccb4592", {
  fetch("http://localhost:38100/predict/02ac0c17-06a3-464b-bbb6-f3b34ccb4592", {
    method: 'POST',
    body: JSON.stringify({
      image: base64Img,
    }),
    headers: {"Content-Type": "application/json"}
  })
    .then(response => response.json())
    .then(jsonResult => {
      // Find and print top result
      const {label, confidence} = jsonResult.predictions[0];
      console.log(
        `predicted label:\t${label}\nconfidence:\t\t\t${confidence}`,
      );
    });
};