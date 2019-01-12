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

//import * as tf from '@tensorflow/tfjs';

// This is a helper class for loading and managing MNIST data specifically.
// It is a useful example of how you could create your own data manager class
// for arbitrary data though. It's worth a look :)
//import {IMAGE_H, IMAGE_W, MnistData} from './data';

// This is a helper class for drawing loss graphs and MNIST images to the
// window. For the purposes of understanding the machine learning bits, you can
// largely ignore it

var modelLocation = document.getElementById("tf-script").getAttribute("model-location");

/**
 * Show predictions on a number of test examples.
 *
 * @param {tf.Model} model The model to be used for making the predictions.
 */
async function showPredictions(model) {
  const testExamples = 100;
  const examples = data.getTestData(testExamples);

  // Code wrapped in a tf.tidy() function callback will have their tensors freed
  // from GPU memory after execution without having to call dispose().
  // The tf.tidy callback runs synchronously.
  tf.tidy(() => {
	  //console.log("predicting");
	 console.log(examples.xs);
    const output = model.predict(examples.xs);
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
    const labels = Array.from(examples.labels.argMax(axis).dataSync());
    const predictions = Array.from(output.argMax(axis).dataSync());

    showTestResults(examples, predictions, labels);
  });
}



let data;
async function load()
 {
  data = new MnistData1();
  await data.load();
  logStatus('done');
}

// This is our main function. It loads the MNIST data, trains the model, and
// then shows what the model predicted on unseen test data.


 
setTrainButtonCallback(async () => {
	  await load();
	    logStatus('Loading MNIST data...');
  logStatus('Creating model...');
  const model = await tf.loadModel(modelLocation);
	model.compile({
		optimizer: 'rmsprop',
		loss: 'categoricalCrossentropy',
		metrics: ['accuracy'],
	  });
  console.log("hi");
  //model.summary();

  logStatus('Starting model training...');
  showPredictions(model);
  console.log("hi4");
  
  const testData = data.getTestData();
  console.log(data);
  console.log(data.testLabels);
  
  const testResult = model.evaluate(testData.xs, testData.labels);
  
  const testAccPercent = testResult[1].dataSync()[0] * 100;
  
  logStatus(
      
      `Final test accuracy: ${testAccPercent.toFixed(1)}%`);
	  
});
