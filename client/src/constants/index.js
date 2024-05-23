export const IceServers = {
    iceServers: [
        {
            urls: 'stun:stun.l.google.com:19302',
        },
    ],
};



export const localStream = navigator.mediaDevices.getUserMedia({ audio: true, video: false })