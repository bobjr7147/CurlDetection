import './style.css'
import { FilesetResolver, PoseLandmarker } from "@mediapipe/tasks-vision"

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<h1>Curl Tracker</h1>
<p id="status"></p>

<div class="stage">
  <video id="camera_video" autoplay playsinline muted>
  </video>
</div>
`

const video = document.getElementById("camera_video") as HTMLVideoElement | null
const statusEl = document.getElementById("status")
if (!statusEl) throw new Error("No element with id status")
if (!video) throw new Error("No element with id camera_video")
try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true })
    video.srcObject = stream
    await video.play()
}
catch(err) {
  console.error(err)
  let message = "Couldn't start the camera."
  if(err instanceof DOMException) {
    if(err.name === "NotAllowedError") {
      message = "You need to enable the camera"
    }
    else if(err.name === "NotFoundError") {
      message = "No camera on device"
    }
  }

  statusEl.textContent = message as string | null
}


statusEl.textContent = "Loading pose model..."
const vision = await FilesetResolver.forVisionTasks(
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.2.0/wasm"
)
const landmarker = await PoseLandmarker.createFromOptions(vision, {
  baseOptions: {
    modelAssetPath: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
    delegate: "GPU",
  },
  runningMode: "VIDEO",
  numPoses: 1,
})
statusEl.textContent = ""
const loop = () => {
  let result = landmarker.detectForVideo(video, performance.now())
  let body = result.landmarks[0]
  if (!body) {
    statusEl.textContent = "Nobody in frame"
  }
  else {
    const elbow = body[13]
    statusEl.textContent = "x: " + elbow.x.toFixed(2) + " y: " + elbow.y.toFixed(2)
  }
  requestAnimationFrame(loop)
}

requestAnimationFrame(loop)
