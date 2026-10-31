import './style.css'
import { FilesetResolver, PoseLandmarker } from "@mediapipe/tasks-vision"
import type { NormalizedLandmark } from "@mediapipe/tasks-vision"

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<h1>Curl Tracker</h1>
<p id="status"></p>

<div class="stage">
  <video id="camera_video" autoplay playsinline muted>
  </video>
  <canvas id ="overlay"></canvas>
</div>
`

const video = document.getElementById("camera_video") as HTMLVideoElement | null
const canvas = document.getElementById("overlay") as HTMLCanvasElement | null
const statusEl = document.getElementById("status")
if (!statusEl) throw new Error("No element with id status")
if (!video) throw new Error("No element with id camera_video")
if (!canvas) throw new Error("No element with id overlay")
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

  statusEl.textContent = message
  throw err
}

canvas.width = video.videoWidth
canvas.height = video.videoHeight
const ctx = canvas.getContext("2d")
if (!ctx) throw new Error("No canvas context")


statusEl.textContent = "Loading pose model..."
const vision = await FilesetResolver.forVisionTasks(
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.2.0/wasm"
)
const landmarker = await PoseLandmarker.createFromOptions(vision, {
  baseOptions: {
    modelAssetPath: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
    delegate: "CPU",
  },
  runningMode: "VIDEO",
  numPoses: 1,
})
statusEl.textContent = ""
let lastVideoTime = -1
const loop = () => {
  if (!(video.currentTime === lastVideoTime)) {
    lastVideoTime = video.currentTime
    const result = landmarker.detectForVideo(video, performance.now())
    const body = result.landmarks[0]
    if (!body) {
      statusEl.textContent = "Nobody in frame"
    }
    else {
      const elbow = body[13]
      statusEl.textContent = `x: ${elbow.x.toFixed(2)} y: ${elbow.y.toFixed(2)}`

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const shoulder = body[11]
      const wrist = body[15]
      const shoulderPixels = coordToPixels(shoulder, canvas)
      const elbowPixels = coordToPixels(elbow, canvas)
      const wristPixels = coordToPixels(wrist, canvas)

      ctx.lineWidth = 5
      ctx.strokeStyle = "red"
      ctx.beginPath()
      ctx.moveTo(shoulderPixels.x, shoulderPixels.y)
      ctx.lineTo(elbowPixels.x, elbowPixels.y)
      ctx.stroke()

      ctx.strokeStyle = "blue"
      ctx.beginPath()
      ctx.moveTo(elbowPixels.x, elbowPixels.y)
      ctx.lineTo(wristPixels.x, wristPixels.y)
      ctx.stroke()

      ctx.beginPath()
      ctx.arc(shoulderPixels.x, shoulderPixels.y, 10, 0, 2 * Math.PI)
      ctx.fill()

      ctx.beginPath()
      ctx.arc(elbowPixels.x, elbowPixels.y, 10, 0, 2 * Math.PI)
      ctx.fill()

      ctx.beginPath()
      ctx.arc(wristPixels.x, wristPixels.y, 10, 0, 2 * Math.PI)
      ctx.fill()

      const angle = angleAt(shoulderPixels, elbowPixels, wristPixels)
      statusEl.textContent += ` angle: ${angle.toFixed(1)}`
      
    }
  }
  


  requestAnimationFrame(loop)
}

requestAnimationFrame(loop)


function coordToPixels(point: NormalizedLandmark, canvas: HTMLCanvasElement) {
  return { x: point.x * canvas.width, y: point.y * canvas.height }
}

function angleAt(a, b, c) {
  const ab = { x: b.x - a.x, y: b.y - a.y }
  const cb = { x: b.x - c.x, y: b.y - c.y }
  
  const dot = (ab.x * cb.x + ab.y * cb.y)
  const magAB = Math.sqrt(ab.x * ab.x + ab.y * ab.y)
  const magCB = Math.sqrt(cb.x * cb.x + cb.y * cb.y)
  const cosAngle = dot / (magAB * magCB)
  const angle = Math.acos(Math.max(-1, Math.min(1, cosAngle)))
  return angle * 180 / Math.PI
}