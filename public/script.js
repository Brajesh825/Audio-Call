const localAudio = document.getElementById('localAudio');
const remoteAudio = document.getElementById('remoteAudio');
const startCallBtn = document.getElementById('startCall');
const endCallBtn = document.getElementById('endCall');
const userIdElement = document.getElementById('userId');
const userNameElement = document.getElementById('userName')

let userName;
userNameElement.onchange = (e) => {
    userName = e.target.value
}

let peer, localStream, remoteStream, connection;

// Function to generate a random ID for the user
function generateUserId() {
    const id = Math.random().toString(36).slice(2);
    userIdElement.innerText = id; // Update the element with the generated ID
    return id;
}

// Generate a random ID for the user
const userId = generateUserId();
userIdElement.innerText = userId

// Connect to the Peer server
const wsConfig = {
    host: "audiocall.onrender.com",
    path: "/peerjs"
}

const localConfig = {
    host: window.location.hostname,
    port: 9000,
    path: '/peerjs',
    secure : "false"
}


peer = new Peer(userId, wsConfig);

peer.on('open', (id) => {
    console.log('Connected with ID:', id);
});

peer.on('error', (err) => {
    console.error('PeerJS Error:', err);
    alert('An error occurred while connecting to the server.');
});


// Start a call
function startCall() {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
            localAudio.srcObject = stream;
            localStream = stream;

            // Call a peer with a given ID
            const remoteUserId = prompt('Enter the ID of the person you want to call:');
            if (!remoteUserId) return;

            const metadata = {
                callerUserName: userName,
                callerType: "audio"
            }




            connection = peer.call(remoteUserId, stream, { metadata });
            connection.on('stream', (remoteStream) => {
                remoteAudio.srcObject = remoteStream;
            });
        })
        .catch((error) => {
            console.error('Error accessing media devices:', error);
        });
}

// End the call
function endCall() {
    if (connection) {
        connection.close();
    }
    if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
    }
    remoteAudio.srcObject = null;
}

// Start call when the "Start Call" button is clicked
startCallBtn.addEventListener('click', () => {
    startCall();
});

// End call when the "End Call" button is clicked
endCallBtn.addEventListener('click', () => {
    endCall();
});

// Listen for incoming calls
peer.on('call', (call) => {
    console.log("Incoming Call");
    let peer = call.peer
    let callerName = call.metadata.callerUserName
    let answer = confirm("Incoming Call From " + callerName)
    if (answer) {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then((stream) => {
                localAudio.srcObject = stream;
                localStream = stream;

                call.answer(stream);
                call.on('stream', (remoteStream) => {
                    remoteAudio.srcObject = remoteStream;
                });
            })
            .catch((error) => {
                console.error('Error accessing media devices:', error);
            });
    }
});
