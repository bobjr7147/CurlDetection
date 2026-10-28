import './style.css'


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