/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready

document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Cordova is now initialized. Have fun!

    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');

}

function scan() {
    console.log("start scan...");
    const success = (images) => {
        console.log("start complete... Result:");
        console.log(images);
        images.forEach((image) => {
            document.getElementById('link').value = image.thumbPath
            if ('text' in image){
              document.getElementById("text").value = image.text;
            }
        });
    };

    const failure = (error) => {
        console.log("start failed! Reason:");
        console.log(error);
    };
    window.VisionKit.scan(success, failure, getOptions());
}

const getPdf = () => {
    const success = (images) => {
        console.log("start complete... Result:");
        console.log(images);
        images.forEach((pdf) => {
            document.getElementById('link').value = pdf
        });
    };

    const failure = (error) => {
        console.log("start failed! Reason:");
        console.log(error);
    };
    window.VisionKit.generatePDFs(success, failure, [
        document.getElementById("link").value
    ]);
}

const getOptions = () => {
    let options = {languages: ['en-US'], isFastTextRecognition: false};
    let val = document.querySelector('input[name="recognition"]:checked').value;
    if (val == 'disabled') {
      options.languages = [];
    }
    if (val == 'fast'){
      options.isFastTextRecognition = true;
    }
    return options;
}
function download() {
    return new Promise(function (resolve, reject) {
      console.log("start download...");
      const success = (images) => {
        console.log("download complete...");

        images.forEach((path) => {
          document.getElementById("link").value = path.thumbPath;
          console.log(path);
        });
        resolve();
      };

      const failure = (error) => {
        console.log("download failed... Reason:");
        console.log(error);
        reject();
      };

      window.VisionKit.download(success, failure, [
        document.getElementById("remote-link").value
      ]);
    });
}

const sequentialDownload = async() => {
    window.downloadWorking = true;
    while(window.downloadWorking){
      await download();
    }
}

function stopSequentialDownload() {
    window.downloadWorking = false;
}

function setImage() {
    var src = window.WkWebView.convertFilePath(cordova.file.documentsDirectory + document.getElementById('link').value)
    //Get our img element by using document.getElementById
    var img = document.getElementById("img");

    //Set the src property of our element to the new image URL
    img.src = src;
}
