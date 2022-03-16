const APP_ID = '04ed096e84f34e40b870f9ab6ab271f0'
const CHANNEL = 'main'
const TOKEN = '00604ed096e84f34e40b870f9ab6ab271f0IAD4cTa8gGKX6SlJsPqmVBLeVlAl8yITGODrC3nKYljaVGTNKL8AAAAAEACNSCPiYm0yYgEAAQBibTJi'
let UID

const client = AgoraRTC.createClient({mode:'rtc', codec:'vp8'})

let localTracks = []
let remoteUsers = {}

let joinAndDisplayLocalStream = async () => {
  client.on('user-published', handleUserJoined)

  UID = await client.join(APP_ID, CHANNEL, TOKEN, null)

  localTracks = await AgoraRTC.createMicrophoneAndCameraTracks()

  let player = `<div class="video-container" id="user-container-${UID}">
                  <div class="username-wrapper"><span class="user-name">My Name</span></div>
                  <div class="video-player" id="user-${UID}"></div>
                </div>`

  document.getElementById('video-streams').insertAdjacentHTML('beforeend', player)

  localTracks[1].play(`user-${UID}`)

  await client.publish([localTracks[0], localTracks[1]])
}

let handleUserJoined = async (user, mediaType) => {
  remoteUsers[user.uid] = user
  await client.subscribe(user, mediaType)

  if(mediaType === 'video'){
    let player = document.getElementById(`user-container-${user.uid}`)
    if(player != null){
      player.remove()
    }

    player = `<div class="video-container" id="user-container-${user.uid}">
                  <div class="username-wrapper"><span class="user-name">My Name</span></div>
                  <div class="video-player" id="user-${user.uid}"></div>
                </div>`

    document.getElementById('video-streams').insertAdjacentHTML('beforeend', player)
    user.videoTrack.play(`user-${user.uid}`)
  }

  if(mediaType === 'audio'){
    user.audioTrack.play()
  }
}

joinAndDisplayLocalStream()
