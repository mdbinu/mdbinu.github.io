var URL = window.webkitURL || window.URL;
var ctx = null;
var ctx1 = null;
var ctx2 = null;
var img2 = new Image();
var img_thump = null;
var picReader_thump = null;
var stroke_w = 30;
var stroke_h = 30;
var top_img = true;
var prevx = 0;
var prevy = 0;
var renderableHeight, renderableWidth;
window.onload = function() {
    var input1 = document.getElementById('input1');
    input1.addEventListener('change', handleFiles, false);
}

function CalcResolution( docWidth, docHeight, img )
{

	//console.log(docWidth);
	//console.log(docHeight);
			//percentage based
	var elWidth = docWidth;
	var elHeight = docHeight*0.9;
	
	var imageAspectRatio = img.width / img.height;
	//console.log(imageAspectRatio);
	var canvasAspectRatio = elWidth / elHeight;
	//console.log("123");
	//console.log(canvasAspectRatio);
	var xStart, yStart;

	// If image's aspect ratio is less than canvas's we fit on height
	// and place the image centrally along width
	if(imageAspectRatio < canvasAspectRatio) {
		renderableHeight = elHeight;
		renderableWidth = img.width * (renderableHeight / img.height);
		xStart = (elWidth - renderableWidth) / 2;
		yStart = 0;
	}

	// If image's aspect ratio is greater than canvas's we fit on width
	// and place the image centrally along height
	else if(imageAspectRatio > canvasAspectRatio) {
		renderableWidth = elWidth;
		renderableHeight = img.height * (renderableWidth / img.width);
		xStart = 0;
		yStart = (elHeight - renderableHeight) / 2;
	}

	// Happy path - keep aspect ratio
	else {
		renderableHeight = elHeight;
		renderableWidth = elWidth;
		xStart = 0;
		yStart = 0;
	}
}

function clearleftpane()
{
	var myNode = document.getElementById("lef");
	var fc = myNode.firstChild;

	while( fc ) {
		myNode.removeChild( fc );
		fc = myNode.firstChild;
	}
}

function handleFiles(e) {
	
	clearleftpane();
    ctx = document.getElementById('canvas').getContext('2d');
	
    var reader  = new FileReader();
    var file = e.target.files[0];
	//console.log(file.name);
    // load to image to get it's width/height
    var img = new Image();
    img.onload = function() {

		var docWidth = document.getElementById('mid').offsetWidth;
		var docHeight = document.getElementById('mid').offsetHeight;
		CalcResolution(docWidth,docHeight,img);
        ctx.canvas.width = renderableWidth;
        ctx.canvas.height = renderableHeight;
        // draw image
        ctx.drawImage(img, 0, 0
            , ctx.canvas.width, ctx.canvas.height
        );
		
		//console.log(renderableWidth);
		//console.log(renderableHeight);
    }
    // this is to setup loading the image
    reader.onloadend = function () {
        img.src = reader.result;
    }
    // this is to read the file
   	reader.readAsDataURL(file);
	displaythumps( e );
}

function displaythumps( e )
{
	var files = e.target.files; //FileList object
	var output = document.getElementById("lef");
	
	
	for(var i = 0; i< files.length; i++)
	{
		var file = files[i];
		
		//Only pics
		if(!file.type.match('image'))
		  continue;
		
		var picReader = new FileReader();
		
		picReader.addEventListener("load",function(event){
			
			var picFile = event.target;
			
			var mimg = document.createElement("div");
			
			mimg.innerHTML = "<img onclick='clickthump(this)' class='img_thump' src='" + picFile.result + "'" +
					"title='" + picFile.name + "'/>";
			//console.log(picFile);
			//output.insertBefore(mimg,null);  
			output.appendChild(mimg);			
		
		});
		
		 //Read the image
		picReader.readAsDataURL(file);
		picReader.name = file.name;
	}                               
}





function myFunction(e) {
    var x = e.clientX;
    var y = e.clientY;
	
	if( prevx > (x - 1 )){
		//moving left
		aplyalpha(x,y,true);
	}
	else{
		//moving right
		aplyalpha(x,y,false);
	}
	
	prevx = x;
	prevy = y;
	e.preventDefault();
}

function myFunction2(e) {
	
	var x = event.touches[0].clientX;
	var y = event.touches[0].clientY;
	
	
	if( prevx > (x-1)){
		//moving left
		//console.log("move Left");
		aplyalpha(x,y,true);
	}
	else{
		//moving right
		//console.log("move right");
		aplyalpha(x,y,false);
	}
	
	prevx = x;
	prevy = y;
	//console.log(prevx);
	e.preventDefault();
}

function mousedown(e) {
	
	//console.log(e.clientX);
	prevx = e.clientX;;
	prevy = e.clientY;
}

function touchdown(e) {
	
	prevx = event.touches[0].clientX;
	prevy = event.touches[0].clientY;
	e.preventDefault();
	//console.log(prevx);
}



function aplyalpha(inX,inY,left)
{
	mid = document.getElementById('mid');
	var rect = mid.getBoundingClientRect();
	var x = inX - rect.left;
	var y = inY - rect.top;
	//var coor = "Coordinates: (" + x + "," + y + ")";
    //document.getElementById("openseadragon1").innerHTML = coor;
	//console.log( coor );
//var canvas = viewer.canvas;
	//canvas.setOpacity( 0.5, x,y);
	

	
	if(left)
	{
		var imgd = ctx.getImageData(x-stroke_w/2, y-stroke_h/2, stroke_w, stroke_h);
		var imgd2 = ctx1.getImageData(x-stroke_w/2, y-stroke_h/2, stroke_w, stroke_h);
	}
	else
	{
		var imgd = ctx.getImageData(x-stroke_w/2, y-stroke_h/2, stroke_w, stroke_h);
		var imgd2 = ctx2.getImageData(x-stroke_w/2, y-stroke_h/2, stroke_w, stroke_h);
	}
	
	pix = imgd.data;
	pix2 = imgd2.data;
	
	for (var i = 0; i < stroke_h*stroke_w; i += 4)	{
		pix[i+0] = pix2[i+0];
		pix[i+1] = pix2[i+1];
		pix[i+2] = pix2[i+2];
		//pix[i+3] = 0;
	}
	ctx.putImageData(imgd, x-stroke_w/2, y-stroke_h/2);
}

function clickthump(imgin)
{
	var c= null;
	var ctxcurr = null;
	if( top_img )
	{
		c = document.getElementById("canvas2");
		ctx2 = c.getContext('2d');
		ctxcurr = ctx2;
	}
	else
	{
		c = document.getElementById("canvas");
		ctx = c.getContext('2d');
		ctxcurr = ctx;
		
		c1 = document.getElementById("canvas3");
		ctx1 = c1.getContext('2d');
	}
	
	ctxcurr.clearRect(0, 0, c.width, c.height);
	var img=new Image();
	img.onload = function(){
	var docWidth = document.getElementById('mid').offsetWidth;
	var docHeight = document.getElementById('mid').offsetHeight;
	CalcResolution(docWidth,docHeight,img);
    ctxcurr.canvas.width = renderableWidth;
    ctxcurr.canvas.height = renderableHeight;
        // draw image
    ctxcurr.drawImage(img, 0, 0
            , ctxcurr.canvas.width, ctxcurr.canvas.height
        );
	};
	
	if( !top_img )
	{
		ctx1.clearRect(0, 0, c.width, c.height);
		var img1=new Image();
		img1.onload = function(){
		ctx1.canvas.width = renderableWidth;
		ctx1.canvas.height = renderableHeight;
			// draw image
		ctx1.drawImage(img1, 0, 0
				, ctxcurr.canvas.width, ctxcurr.canvas.height
			);
		};
		img1.src=imgin.src;
	}
	
	img.src=imgin.src;
	update_selection( imgin);
	
}

function resetimages()
{
	var c = document.getElementById("canvas");
	var imgd2 = ctx1.getImageData(0,0, c.width, c.height);
	ctx.putImageData(imgd2, 0,0);
	console.log("reset");
}

function update_selection( img )
{
	 var fullPath = img.title;
     var filename = fullPath.replace(/^.*[\\\/]/, '');
	if( top_img )
	{
		document.getElementById("topimg").innerHTML = "Background Image : "+ filename;
		top_img = false;
	}
	else
	{
		document.getElementById("bottomimg").innerHTML = "Forground Image : "+  filename;
		top_img = true;
	}
}