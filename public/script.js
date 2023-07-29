// public/script.js
let peer = null;
let call = null;
let myId = null;
let myUsername = '';

const usernameInput = document.getElementById('username');
const createIdButton = document.getElementById('createId');
const destinationIdInput = document.getElementById('destinationId');
const startCallButton = document.getElementById('startCall');
const endCallButton = document.getElementById('endCall');

createIdButton.addEventListener('click', () => {
  const username = usernameInput.value.trim();

  if (!username) {
    alert('Please enter your username.');
    return;
  }

  // Generate a random unique ID for the client
  myId = generateRandomId();
  myUsername = username;

  // Display the unique ID on the page
  alert(`Your unique ID: ${myId}`);

  // Enable/disable buttons
  createIdButton.disabled = true;
  startCallButton.disabled = false;

  peer = new Peer(myId, {
    host: '/',
    port: 3000,
    path: '/peerjs',
    debug: 3,
  });

});

startCallButton.addEventListener('click', () => {
  const destinationId = destinationIdInput.value.trim();

  if (!destinationId) {
    alert('Please enter the destination user ID.');
    return;
  }

  // Initialize Peer.js with the generated unique ID
  

  // Get user media and start the call
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      call = peer.call(destinationId, stream);
      setupCallEventHandlers(call);
    })
    .catch(error => console.error('Error accessing user media:', error));

  // Enable/disable buttons
  startCallButton.disabled = true;
  endCallButton.disabled = false;
});

endCallButton.addEventListener('click', () => {
  if (call) {
    call.close();
    call = null;
  }
  if (peer) {
    peer.disconnect();
    peer.destroy();
    peer = null;
  }

  // Enable/disable buttons
  startCallButton.disabled = false;
  endCallButton.disabled = true;
});

function generateRandomId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomId = '';
  for (let i = 0; i < 8; i++) {
    randomId += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return randomId;
}

function setupCallEventHandlers(callInstance) {
  call = callInstance;
  call.on('stream', remoteStream => {
    // Handle the remote audio stream
    const audioElement = document.createElement('audio');
    audioElement.srcObject = remoteStream;
    audioElement.play();
    document.body.appendChild(audioElement);
  });

  call.on('close', () => {
    // Call ended, clean up resources
    if (call) {
      call.close();
      call = null;
    }
    if (peer) {
      peer.disconnect();
      peer.destroy();
      peer = null;
    }

    // Enable/disable buttons
    startCallButton.disabled = false;
    endCallButton.disabled = true;
  });
}
