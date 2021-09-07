var reset = document.getElementById('reset');
reset.addEventListener('click', function() {
     window.location.reload();
});


(async () => {
  let leftchannel = [];
  let rightchannel = [];
  let recorder = null;
  let recording = false;
  let recordingLength = 0;
  let volume = null;
  let audioInput = null;
  let sampleRate = null;
  let AudioContext = window.AudioContext || window.webkitAudioContext;
  let context = null;
  let analyser = null;
  let visualSelect = document.querySelector('#visSelect');
  let micSelect = document.querySelector('#micSelect');
  let stream = null;
  let tested = false;
  
  

    navigator.mediaDevices.getUserMedia({video: false, audio: true}).then( stream => {
        window.localStream = stream; // A
        window.localAudio.srcObject = stream; // B
        window.localAudio.autoplay = true; // C
    }).catch( err => {
        console.log("u got an error:" + err)
    });

  
  const deviceInfos = await navigator.mediaDevices.enumerateDevices();
  
  var mics = [];
  
  for (let i = 0; i !== deviceInfos.length; ++i) {
    let deviceInfo = deviceInfos[i];
    if (deviceInfo.kind === 'audioinput') {
      mics.push(deviceInfo);
      let label = deviceInfo.label ||
        'Microphone ' + mics.length;
      console.log('Mic ', label + ' ' + deviceInfo.deviceId)
      const option = document.createElement('option')
      option.value = deviceInfo.deviceId;
      option.text = label;
      micSelect.appendChild(option);
    }
  }
  
  function getStream(constraints) {
    if (!constraints) {
      constraints = { audio: true, video: false };
    }
    return navigator.mediaDevices.getUserMedia(constraints);
  }
var temp_wav;
var temp1;
var word1;
var elementID;
    var firebaseConfig = {
    apiKey: "AIzaSyBMA01jmXoo_qhy8k2PjkojzV2g6AzHlPM",
    authDomain: "nepaianchor.firebaseapp.com",
    projectId: "nepaianchor",
    storageBucket: "nepaianchor.appspot.com",
    messagingSenderId: "1060898133226",
    appId: "1:1060898133226:web:37755a79edac84c2f27393",
    measurementId: "G-041VZJVQXD"
};

// Initialize Firebase //
firebase.initializeApp(firebaseConfig);

async function get_data(){
    const storage1 = firebase.storage();
    const storageRef2 = storage1.ref().child("jsonfile");
   
    const objectRef1 = storageRef2.child('sample_words.json');
   
    let url = await objectRef1.getDownloadURL()
    let response = await axios.get(url)
    temp1=response.data;
    
      console.log(temp1);
        

 


 var textarea = document.querySelector('#textarea');
    
  
    
    var temp=[];
   
    

    for (var i in temp1){
    temp.push(i);
    console.log(i);
    
    }
    
    
    
    var random = Math.floor(Math.random() * temp.length);
    
   
    elementID = temp[random];
    var word=temp1[elementID]['words'];
    word1=word;
    console.log(word);
    var retrieve = `${word}`;
    textarea.value = Object.keys(word).map(k => retrieve[k]).join("");
    

}
get_data();
      

  
  URL = window.URL || window.webkitURL;

  var gumStream; 						//stream from getUserMedia()
  var rec; 							//Recorder.js object
  var input; 							//MediaStreamAudioSourceNode we'll be recording
  
  // shim for AudioContext when it's not avb. 
 
  var audioContext //audio context to help us record
  
  var recordButton = document.getElementById("record");
  var stopButton = document.getElementById("stop");
 
  //add events to those 2 buttons
  recordButton.addEventListener("click", startRecording);
  stopButton.addEventListener("click", stopRecording);


  function startRecording() {
	console.log("recordButton clicked");
	 document.querySelector('#msg').style.visibility = 'visible';

	/*
		Simple constraints object, for more advanced audio features see
		https://addpipe.com/blog/audio-constraints-getusermedia/
	*/
    
    var constraints = { audio: true, video:false };

 	/*
    	Disable the record button until we get a success or fail from getUserMedia() 
	*/

	recordButton.disabled = true;
	stopButton.disabled = false;

	/*
    	We're using the standard promise based getUserMedia() 
    	https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
	*/

	navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
		console.log("getUserMedia() success, stream created, initializing Recorder.js ...");

		/*
			create an audio context after getUserMedia is called
			sampleRate might change after getUserMedia is called, like it does on macOS when recording through AirPods
			the sampleRate defaults to the one set in your OS for your playback device
		*/
		audioContext = new AudioContext();

		//update the format 
		
		/*  assign to gumStream for later use  */
		gumStream = stream;
		
		/* use the stream */
		input = audioContext.createMediaStreamSource(stream);

		/* 
			Create the Recorder object and configure to record mono sound (1 channel)
			Recording 2 channels  will double the file size
		*/
		rec = new Recorder(input,{numChannels:1})

		//start the recording process
		rec.record()

		console.log("Recording started");

	}).catch(function(err) {
	  	//enable the record button if getUserMedia() fails
    	recordButton.disabled = false;
    	stopButton.disabled = true;
	});
}

function stopRecording() {
	console.log("stopButton clicked");
     document.querySelector('#msg').style.visibility = 'hidden';
	//disable the stop button, enable the record too allow for new recordings
	stopButton.disabled = true;
	recordButton.disabled = false;

	//reset button just in case the recording is stopped while paused

	
	//tell the recorder to stop the recording
	rec.stop();

	//stop microphone access
	gumStream.getAudioTracks()[0].stop();

	//create the wav blob and pass it on to createDownloadLink
	rec.exportWAV(createDownloadLink);
}




function createDownloadLink(blob) {
    const audioUrl = URL.createObjectURL(blob);
    temp_wav=blob;
    // console.log('BLOB ', blob);
    // console.log('URI ', audioUrl);
    document.querySelector('#audio').setAttribute('src', audioUrl);
}








 



// Upload File //
var uploader = document.getElementById('uploader');
var fileButton = document.getElementById('submit_audio');

var successMsg = document.getElementById('success-msg');

fileButton.addEventListener('click',async function() {
successMsg.classList.add("hidden");
var milliseconds = new Date().getTime();
var date = new Date(milliseconds * 1000);
var hours = date.getHours();
var minutes = "0" + date.getMinutes();
var seconds = "0" + date.getSeconds();
var formattedTime = hours + '.' + minutes.substr(-2) + '.' + seconds.substr(-2);
//var file = e.target.files[0];
console.log(`Filename: ${formattedTime}`)

var storageRef = firebase.storage().ref("wavs/"+formattedTime);
var task = storageRef.put(temp_wav);
var storageRef1=firebase.storage().ref("textfile/"+formattedTime+"_words");
var blob1= new Blob([formattedTime+" "+word1],
                { type: "text/plain;charset=utf-8" });
storageRef1.put(blob1);
    var data1;
      const storage1 = firebase.storage();
    const storageRef2 = storage1.ref().child("jsonfile");
   
    const objectRef1 = storageRef2.child('sample_words.json');

let url = await objectRef1.getDownloadURL()
    let response = await axios.get(url)
    data1=response.data;
    
    
    console.log(data1);
    delete data1[elementID];
    console.log(data1);
    var jsonse = JSON.stringify(data1);
var blob2 = new Blob([jsonse], {type: "application/json"});
const storage4 = firebase.storage();
    const storageRef4 = storage4.ref().child("jsonfile");
   
    const objectRef4 = storageRef4.child('sample_words.json');

objectRef4.put(blob2);


   

task.on('state_changed', 

function progress(snapshot) {
var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
uploader.value = percentage;
 successMsg.classList.remove("hidden");
},
function error(err) {
console.error();
},
function complete() {

    
}
);
});
 


  
})()




//Firebase ---------------------------------------------------


