const video = document.getElementById("video");


const startVideo = ()=>{
    navigator.getUserMedia(
        {video:{}},
        stream =>{
            video.srcObject = stream;
        },
        err => console.error(err)
    )
}

//starting promises
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
    faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
    faceapi.nets.faceExpressionNet.loadFromUri("/models"),
    faceapi.nets.ageGenderNet.loadFromUri("/models")
]).then(startVideo);

video.addEventListener("playing",()=>{
    const canvas = faceapi.createCanvasFromMedia(video);
    document.body.append(canvas);
    const displaySize = { width: video.width, height: video.height }
    faceapi.matchDimensions(canvas,displaySize);
    setInterval(async()=>{
        const detection = await faceapi.detectAllFaces(video,new faceapi.TinyFaceDetectorOptions());
        const resizedDetections = faceapi.resizeResults(detection,displaySize);
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        faceapi.draw.drawDetections(canvas,resizedDetections);
    },1000)
})

