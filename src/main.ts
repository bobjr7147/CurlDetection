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
if (!video) throw new Error("No element with id camera_video")

const stream = await navigator.mediaDevices.getUserMedia({ video: true })
video.srcObject = stream

