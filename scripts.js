
// backgrounds defined as { id : [ filename, score ] }
var backgrounds = {
    "blank" : [ "blank.png", 0 ] ,
    "bg1" : [ "bg1.png", 0 ] ,
    "bg2" : [ "bg2.png", 0 ]
};
var currentBG = "bg1";
var currentBGfile = backgrounds[currentBG][0]


// helper function
function el(id){return document.getElementById(id);} // Get elem by ID

// file upload from PC
el("fileUpload").addEventListener("change", readImage, false);

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

// get a reference to an element
//var stage = document.getElementById('stage');
var stage = el('stage');
var main = el('main');
$stage = jQuery(stage);

// create a manager for that element
var manager = new Hammer.Manager(main);

// create recognizers
var Pan = new Hammer.Pan();
var Pinch = new Hammer.Pinch();

// use gestures together
//Pinch.recognizeWith([Pan]);

// add the recognizers
manager.add(Pan);
manager.add(Pinch);



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

// show background button pressed
el("showBackground").addEventListener("click", toggleBackground);

var bgShowing = false;
function toggleBackground() {
    if (bgShowing) {
        el("bgImage").src = backgrounds["blank"];
    } else {
        el("bgImage").src = currentBGfile;
    }
    bgShowing = !bgShowing;
}

// rotate button pressed
el("rotateLeft").addEventListener("click", rotateImageLeft);
el("rotateRight").addEventListener("click", rotateImageRight);

currentRotation = 0;
function rotateImageLeft() {
    currentRotation -= 90;
    $.Velocity.hook($stage, 'rotateZ', currentRotation + 'deg');
}
function rotateImageRight() {
    currentRotation += 90;
    $.Velocity.hook($stage, 'rotateZ', currentRotation + 'deg');
}


// background change
$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    currentBG = $(e.target).attr("id")
    currentBGfile = backgrounds[ currentBG ][0];
    el("bgImage").src = currentBGfile;
    bgShowing = true;
    updateColors();
});


// yes and no buttons
el("yes").addEventListener("click", chooseYes);
el("no").addEventListener("click", chooseNo);

function chooseYes() {
    if ( backgrounds[currentBG][1] == 1 ) {
      backgrounds[currentBG][1] = 0;
    } else {
      backgrounds[currentBG][1] = 1;
    }
    updateColors();
}
function chooseNo() {
    if ( backgrounds[currentBG][1] == -1 ) {
      backgrounds[currentBG][1] = 0;
    } else {
      backgrounds[currentBG][1] = -1;
    }
    updateColors();
}

function updateColors() {
    switch ( backgrounds[currentBG][1] ) {
      case 1:
          el("yesIcon").style.color = "#00FF00";
          el("noIcon").style.color = "#337ab7";
      break;
      case -1:
          el("noIcon").style.color = "#FF0000";
          el("yesIcon").style.color = "#337ab7";
      break;
      default:
          el("noIcon").style.color = "#337ab7";
          el("yesIcon").style.color = "#337ab7";
      break;
    }
}

// analyze results
el("analyze").addEventListener("click", analyzeResults);
function analyzeResults() {
    data = "?bg1=" + backgrounds["bg1"][1];
    data += "&bg2=" + backgrounds["bg2"][1];
    window.location.replace("results.html" + data);
}









