
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


/*
// gesture recognition test
var mc = new Hammer(canvas)
mc.on("panleft panright tap press", function(ev) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = "30px Arial";
    context.fillText(ev.type + " gesture detected",10,50);
});
*/

// get a reference to an element
var stage = document.getElementById('stage');
$stage = jQuery(stage);

// create a manager for that element
var manager = new Hammer.Manager(stage);

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
manager.on('rotatemove', function(e) {
    // do something cool
    var rotation = currentRotation + Math.round(liveScale * e.rotation);
    $.Velocity.hook($stage, 'rotateZ', rotation + 'deg');
});
manager.on('rotateend', function(e) {
    // cache the rotation
    currentRotation += Math.round(e.rotation);
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

var colors = [
  [20, 187, 95],
  [20, 95, 187],
  [187, 95, 20],
  [187, 20, 95],
  [95, 20, 187],
  [95, 187, 20]
];
function mult(a, b) {
  return Math.round(a * b);
}
function makeColor(rgb, adj) {
  adj = adj || 1;
  return 'rgb('+mult(rgb[0], adj)+','+mult(rgb[1], adj)+','+ mult(rgb[2], adj)+')';
}
var currentColorIndex = 0;
manager.on('tap', function(e) {
  currentColorIndex++;
  if (currentColorIndex >= colors.length) {
    currentColorIndex = 0;
  }
  stage.style.backgroundColor = makeColor(colors[currentColorIndex]);
  stage.style.borderColor = makeColor(colors[currentColorIndex], 0.85);
});

var isShrunken = false;
manager.on('doubletap', function() {
  console.log('doubletapped');
  var scale = $.Velocity.hook($stage, 'scale');
  if (isShrunken) {
    $.Velocity.hook($stage, 'scale', 2 * scale);
  } else {
    $.Velocity.hook($stage, 'scale', .5 * scale);
  }
  isShrunken = !isShrunken;
});




