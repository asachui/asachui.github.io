
// file upload from PC
function el(id){return document.getElementById(id);} // Get elem by ID

var canvas  = el("canvas");
var context = canvas.getContext("2d");

function readImage() {
	if ( this.files && this.files[0] ) {
		var FR= new FileReader();
		FR.onload = function(e) {
			var img = new Image();
			img.onload = function() {
				var hRatio = canvas.width / img.width    ;
				var vRatio = canvas.height / img.height  ;
				var ratio  = Math.min ( hRatio, vRatio );
				var centerShift_x = ( canvas.width - img.width*ratio ) / 2;
				var centerShift_y = ( canvas.height - img.height*ratio ) / 2;
				context.clearRect(0,0,canvas.width, canvas.height);
				context.drawImage(img, 0,0, img.width, img.height, centerShift_x,centerShift_y,img.width*ratio, img.height*ratio);
			};
			img.src = e.target.result;
		};
		FR.readAsDataURL( this.files[0] );
	}
}

el("fileUpload").addEventListener("change", readImage, false);

// get a reference to an element
//var stage = document.getElementById('stage');
var stage = el('stage');
var main = el('main');
$stage = jQuery(stage);

// create a manager for that element
var manager = new Hammer.Manager(main);

// create recognizers
var Pan = new Hammer.Pan();
var Rotate = new Hammer.Rotate();
var Pinch = new Hammer.Pinch();
var Tap = new Hammer.Tap({
  taps: 1
});
var DoubleTap = new Hammer.Tap({
  event: 'doubletap',
  taps: 2
});

// use them together
Rotate.recognizeWith([Pan]);
Pinch.recognizeWith([Rotate, Pan]);

DoubleTap.recognizeWith([Tap]);
Tap.requireFailure([DoubleTap]);

// add the recognizers
manager.add(Pan);
manager.add(Rotate);
manager.add(Pinch);
manager.add(DoubleTap);
manager.add(Tap);


// subscribe to events
var liveScale = 1;
var currentRotation = 0;
var startRotation = 0;
manager.on('rotatestart', function(e) {
  //console.log("e.Rotation " + e.rotation);
  startRotation = e.rotation;
  //console.log("e.Rotation " + e.rotation);
  //console.log("startRotation " + startRotation);
});
manager.on('rotatemove', function(e) {
    // do something cool
    //console.log("currentRotation " + currentRotation);
    //console.log("e.Rotation " + e.rotation);
    var rotation = currentRotation + Math.round(liveScale * (e.rotation - startRotation));
    rotation = rotation % 360;
    //console.log("rotation " + rotation);
    $.Velocity.hook($stage, 'rotateZ', rotation + 'deg');
});
manager.on('rotateend', function(e) {
    // cache the rotation
    currentRotation += Math.round(e.rotation);
    currentRotation = currentRotation % 360 - startRotation;
    //console.log("currentRotation after move " + currentRotation);
});

var deltaX = 0;
var deltaY = 0;
manager.on('panmove', function(e) {
  // do something cool
  var dX = deltaX + (e.deltaX);
  var dY = deltaY + (e.deltaY);
  $.Velocity.hook($stage, 'translateX', dX + 'px');
  $.Velocity.hook($stage, 'translateY', dY + 'px');
});
manager.on('panend', function(e) {
  deltaX = deltaX + e.deltaX;
  deltaY = deltaY + e.deltaY;
});


// subscribe to events
var currentScale = 1;
function getRelativeScale(scale) {
  return scale * currentScale;
}
manager.on('pinchmove', function(e) {
  // do something cool
  var scale = getRelativeScale(e.scale);
  $.Velocity.hook($stage, 'scale', scale);
});
manager.on('pinchend', function(e) {
  // cache the scale
  currentScale = getRelativeScale(e.scale);
  liveScale = currentScale;
});



var bgShowing = false;
manager.on('doubletap', function() {
    console.log('doubletapped');
    if (bgShowing) {
        el("bgImage").src = "blank.png";
    } else {
        el("bgImage").src = "pic1.png";

    }
    bgShowing = !bgShowing;
});


