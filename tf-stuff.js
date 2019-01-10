/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */


var modelLocation = document.getElementById("tf-script").getAttribute("model-location");
var buttonId = document.getElementById("tf-script").getAttribute("buttonId");
var predictionButton = document.getElementById(buttonId);

/**
 * Show predictions on a number of test examples.
 *
 * @param {tf.Model} model The model to be used for making the predictions.
 */
async function predict(pixels) {
 
  // Code wrapped in a tf.tidy() function callback will have their tensors freed
  // from GPU memory after execution without having to call dispose().
  // The tf.tidy callback runs synchronously.
  tf.tidy(() => {
	
	let img = tf.tensor3d([pixels]);
	
	img = tf.cast(img,'float32');
	const output = model.predict(img);
// console.log("after predict");
    // tf.argMax() returns the indices of the maximum values in the tensor along
    // a specific axis. Categorical classification tasks like this one often
    // represent classes as one-hot vectors. One-hot vectors are 1D vectors with
    // one element for each output class. All values in the vector are 0
    // except for one, which has a value of 1 (e.g. [0, 0, 0, 1, 0]). The
    // output from model.predict() will be a probability distribution, so we use
    // argMax to get the index of the vector element that has the highest
    // probability. This is our prediction.
    // (e.g. argmax([0.07, 0.1, 0.03, 0.75, 0.05]) == 3)
    // dataSync() synchronously downloads the tf.tensor values from the GPU so
    // that we can use them in our normal CPU JavaScript code
    // (for a non-blocking version of this function, use data()).
    const axis = 1;
	
	console.log("output is:");
	output.print();
	
    const prediction = Array.from(output.argMax(axis).dataSync());

	//console.log(prediction[0]);
    showResult(prediction[0]);
  });
}

function showResult(prediction)
{
	
	playAnimation(prediction);
}


let data;
var model;
async function load()
{
	data = new MnistData1();
	await data.load();
	
	model = await tf.loadModel(modelLocation);

	model.compile({
	optimizer: 'rmsprop',
	loss: 'categoricalCrossentropy',
	metrics: ['accuracy'],
	});
	predictionButton.disabled = false;
}


//loads the MNIST data, and loads the "already trained" model
load();
 