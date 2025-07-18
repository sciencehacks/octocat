const videoElement = document.querySelector('.input_video');
const canvasElement = document.querySelector('.output_canvas');
const gestureLabel = document.getElementById('gesture');
const canvasCtx = canvasElement.getContext('2d');

const hands = new Hands({
  locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
});

hands.setOptions({
  maxNumHands: 1,
  modelComplexity: 1,
  minDetectionConfidence: 0.8,
  minTrackingConfidence: 0.8
});

hands.onResults(results => {
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

  if (results.multiHandLandmarks.length > 0) {
    const landmarks = results.multiHandLandmarks[0];
    const thumbTip = landmarks[4];
    const indexTip = landmarks[8];

    if (thumbTip.y < indexTip.y) {
      gestureLabel.innerText = "Gesture: 👍 Thumbs Up";
    } else {
      gestureLabel.innerText = "Gesture: ✋ Open Hand";
    }

    drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {color: '#00FF00', lineWidth: 4});
    drawLandmarks(canvasCtx, landmarks, {color: '#FF0000', lineWidth: 2});
  }

  canvasCtx.restore();
});

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await hands.send({image: videoElement});
  },
  width: 640,
  height: 480
});
camera.start();
