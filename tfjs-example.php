<?php
$title = "tfjs application";

include 'assets/templates/header.php';
?>
<link rel="stylesheet" type="text/css" href="tfjs_files/colorbuttons.css">
<link rel="stylesheet" type="text/css" href="tfjs_files/text-animation.css">
 <style>
   #myCanvas
	  {
		border:solid;
		float:left;
	  }
</style>

<h2 class="section-title"><span>My TensorFlow handwritten digit classifier</span></h2>

<p class="lead text-center text-muted">
	The rise of the machines is coming. They can now recongize what you write. Don't believe me? Then try it out... 
</p>
<h5 class="section-title"><span>Instructions:</span></h5>

<ul class="lead text-muted">
	<li>Step 1: draw a single digit (0-9)</li>
	<li>Step 2: press the green classify button.</li>
</ul>
	   
	   
<div class="btn-group1">
	<h2>&emsp;&emsp;&emsp;<b>Draw here</b>&#8595;</h2>
	<div class = "mybtn u">
        
		 <submit class="button redButton" onclick="clearCanvas()">Clear</submit>
		 <submit  class="button orangeButton" onclick="undo()">Undo</submit>
		 
		 <submit id ="classify" class="button greenButton" style="font-size: 14px;padding:10px 1px;margin-top:190px;" onclick="startPredictionProcess()">Classify</submit>
         
      </div> 
	<canvas  id="myCanvas" style="border: solid;" width="280" height="280" ></canvas>
	

   <div class="animcontainer">
		<div class="animate">
			<span>You drew: </span>
			<span class = "twister" id="ts-output" style ="visibility: hidden;">8</span>
     
      
		</div>
	</div>
</div>
<canvas  id="copyOf" style="border: solid;" width="28" height="28" ></canvas>
	
<h3 class="section-title"><span>How this works:</span></h3>
		
<p class="lead text-center text-muted">
	A python tensorflow (neural net) model was trained on the famous <a href="http://yann.lecun.com/exdb/mnist/">MNIST DATASET</a>. This model is a <a href="https://keras.io/keras">keras</a> linear stack of Layers which is comprised of these hidden layers in this order: <b>Flatten, Dense, Dropout, Dense. </b> After my sequential model was trained it's topology and different weights are exported to files. Using <a href="https://js.tensorflow.org/">TensorflowJS</a> this model is imported into this web application and used to determine what digit the user drew.
</p>
	  


<script src = "tfjs_files/paint.js"></script>
<script>
	
	function resizePixels( oldPixels, newDim  )
	{
		var threshold = 0.5;
		var shrunkPixels = matrix(newDim, newDim,0);
		
		var oldPixelDim = oldPixels.length;
		var ratio = oldPixelDim/newDim;
		var y;
		var x;
		var y1=0;
		var x1=0;
		for(y = 0; y < oldPixelDim; y+=ratio)
		{
			x1=0;
			for(x = 0; x < oldPixelDim; x+=ratio)
			{
				var blackPixels = 0;
				for(var gridY = y; gridY < y+ratio; gridY++)
				{
					for(var gridX = x; gridX < x+ratio; gridX++)
					{
						
						if(oldPixels[gridY][gridX] > 0)
							blackPixels+=oldPixels[gridY][gridX];
					}
				}
				var blackRatio = blackPixels/(ratio*ratio);
				
				shrunkPixels[y1][x1] = blackRatio;
				
				x1++;
			}
			y1++;
		}
		return shrunkPixels;
		
	}
	function canvasToPixelMatrix(sourceCanvas)
	{
		var imgPixels = ctx.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height);
				
		var imgData = matrix(sourceCanvas.width, sourceCanvas.height,0);
		
		var i = 0;
		var y;
		var x;
		for(y = 0; y < imgPixels.width; y++)
		{
			for(x = 0; x < imgPixels.height; x++)
			{
			  i = (y * 4) * imgPixels.width + x * 4;
			  var a = imgPixels.data[i+3];
		
			  sum = a/255;
				  
			  imgData[y][x]=sum;
			}
		}
		return imgData;
	}
	
	function plotPixelsToCanvas(canvas, pixels)
	{
		var destCanvasContext = canvas.getContext('2d');

		var newDim = pixels.length;
		var newImgData = ctx.createImageData(newDim, newDim);
		//console.log(newImgData.width);
		for(y = 0; y < newImgData.width; y++)
		{
			for(x = 0; x < newImgData.height; x++)
			{
				i = (y * 4) * newImgData.width + x * 4;
				//console.log("y is "+y+" , x is "+x);
				newImgData.data[i+3] = 255- 255*pixels[y][x];
			  
			}
		}
		
		destCanvasContext.putImageData(newImgData, 0, 0);
	}
	
	var output = document.getElementById('ts-output');

	function playAnimation(prediction)
	{
		output.innerHTML = ""+prediction;
		output.style.visibility = "visible";
		output.classList.remove('twister');
		setTimeout(function() 
		{
			output.classList.add('twister');
		}, 10);
		
	}
	
	function startPredictionProcess()
	{
		var sourceCanvas = document.getElementById("myCanvas");
		
		var originalPixelMatrix = canvasToPixelMatrix(sourceCanvas);
		
		 //dimension of nmist data
		var newDim = 28;
		

		var newShrunkPixels = resizePixels( originalPixelMatrix, newDim);
		
		//console.log(newShrunkPixels);
		var destCanvas = document.getElementById("copyOf");
		plotPixelsToCanvas(destCanvas, newShrunkPixels);
		
		predict(newShrunkPixels);
		
		//console.log("done!!");
	}
	
</script>
<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@0.13.5"> </script>
<script src="https://cdn.plot.ly/plotly-latest.min.js"></script> 
<script src="tfjs_files/mnist_data.js"></script>
<script src="tfjs_files/tf-stuff.js" id = "tf-script" model-location= "http://localhost/Initio/tfjs_files/model.json" canvasId = "myCanvas" buttonId ="classify" ></script>

<script>

</script>
 <?php
	include 'assets/templates/footer.php';
?>     