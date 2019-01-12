var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');
 

var mouse = {x: 0, y: 0};

var mouseDown = 0;
var onPaint = function(e) 
{
	 e.preventDefault();
	ctx.lineTo(mouse.x, mouse.y);
	ctx.stroke();
};

canvas.addEventListener('mousemove', function(e) {
	 e.preventDefault();
	
  mouse.x = e.pageX - this.offsetLeft;
  mouse.y = e.pageY - this.offsetTop;
  
}, false);

canvas.addEventListener('touchmove', function(e) {
	 e.preventDefault();
  mouse.x = e.pageX - this.offsetLeft;
  mouse.y = e.pageY - this.offsetTop;
}, false);

ctx.lineWidth = 20;
ctx.lineJoin = 'round';
ctx.lineCap = 'round';
ctx.strokeStyle = "#000";
 
canvas.addEventListener('mousedown', function(e) {
	 e.preventDefault();
	mouseDown=1;
    ctx.beginPath();
    ctx.moveTo(mouse.x, mouse.y);
 
    canvas.addEventListener('mousemove', onPaint, false);
}, false);
 
window.addEventListener('mouseup', function() {
	
	if(mouseDown!=1)
		return;
	

	cPush();
	
	mouseDown=0;
    canvas.removeEventListener('mousemove', onPaint, false);
}, false);

canvas.addEventListener('touchstart', function(e) {
	 e.preventDefault();
	mouseDown=1;
    ctx.beginPath();
    ctx.moveTo(mouse.x, mouse.y);
 //e.preventDefault();
    canvas.addEventListener('touchmove', onPaint, false);
}, false);
 
window.addEventListener('touchend', function() {
	if(mouseDown!=1)
		return;
	 
	cPush();
		
	mouseDown=0;
    canvas.removeEventListener('touchmove', onPaint, false);
}, false);
 

var cPushArray = new Array();
var cStep = -1;


function cPush() 
{
	cStep++;
	if (cStep < cPushArray.length) 
	{
		cPushArray.length = cStep; 
	}
	cPushArray.push(canvas.toDataURL());
}

function undo()
{
	if (cStep > 0)
	{
		cStep--;
		var canvasPic = new Image();
		canvasPic.src = cPushArray[cStep];
		canvasPic.onload = function () 
		{ 
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.drawImage(canvasPic, 0, 0); 
		}
	}
}

function clearCanvas() 
{
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	cPushArray = new Array();
	cStep = -1;
	cPush();
}

function matrix( rows, cols, defaultValue)
{

  var arr = [];

  // Creates all lines:
  for(var i=0; i < rows; i++){

      // Creates an empty line
      arr.push([]);

      // Adds cols to the empty line:
      arr[i].push( new Array(cols));

      for(var j=0; j < cols; j++){
        // Initializes:
        arr[i][j] = defaultValue;
      }
  }

	return arr;
}
function emptyCanvas()
{
	if (cStep > 0)
		return false;
	return true;
}
clearCanvas();
