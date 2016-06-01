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


// gesture recognition
var mc = new Hammer(canvas)
mc.on("panleft panright tap press", function(ev) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = "30px Arial";
    context.fillText(ev.type + " gesture detected",10,50);
});


