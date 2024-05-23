// src/CallComponent.js
import { useEffect, useRef, useState } from 'react';
import { useSocket } from '../src/context/SocketProvider';



const CallComponent = ({ roomId }) => {

    const socket = useSocket();
    const localStreamRef = useRef(null);
    const remoteStreamRef = useRef(null);
    const peerConnectionRef = useRef(null);
    const [isCallActive, setIsCallActive] = useState(false);

    useEffect(() => {
        if (!socket) return;

        socket.emit('join', roomId);

        socket.on('offer', async (data) => {
            if (!peerConnectionRef.current) {
                createPeerConnection();
            }

            await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.offer));
            const answer = await peerConnectionRef.current.createAnswer();
            await peerConnectionRef.current.setLocalDescription(answer);

            socket.emit('answer', { answer, to: data.from });
        });

        socket.on('answer', async (data) => {
            await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
        });

        socket.on('candidate', async (data) => {
            await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
        });

        return () => {
            socket.off('offer');
            socket.off('answer');
            socket.off('candidate');
        };
    }, [socket]);

    const createPeerConnection = () => {
        const peerConnection = new RTCPeerConnection({
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' }
            ]
        });

        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit('candidate', { candidate: event.candidate, to: roomId });
            }
        };

        peerConnection.ontrack = (event) => {
            remoteStreamRef.current.srcObject = event.streams[0];
        };

        peerConnectionRef.current = peerConnection;
    };

    const startCall = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        localStreamRef.current.srcObject = stream;

        createPeerConnection();

        stream.getTracks().forEach(track => {
            peerConnectionRef.current.addTrack(track, stream);
        });

        const offer = await peerConnectionRef.current.createOffer();
        await peerConnectionRef.current.setLocalDescription(new RTCSessionDescription(offer));
        socket.emit('offer', { offer, room: roomId });

        setIsCallActive(true);
    };
    function endCall() {
        setIsCallActive(false)
        if (peerConnectionRef.current) {
            peerConnectionRef.current.close()
            peerConnectionRef.current = null;
        }

        if (localStreamRef.current) {
            localStreamRef.current.srcObject.getTracks().forEach(track => {
                track.stop()
            })
            localStreamRef.current.srcObject = null
        }
        socket.disconnect()
    }
    return (
        <div className='flex flex-col justify-center items-center h-screen space-y-6 bg-gradient-to-tr from-cyan-900 to-black'>
            <h1 className='text-xl font-bold text-white'>WebRTC Video Calling </h1>
            <div className='flex items-center gap-4'>
                <button className='p-2 rounded-2xl bg-blue-600 text-white' onClick={startCall} disabled={isCallActive}>Start Call</button>
                <button className='p-2 rounded-2xl bg-red-700 text-white' onClick={endCall} disabled={!isCallActive}>end Call</button>
            </div>
            <div className='flex items-center justify-center w-full '>
                <video ref={localStreamRef} autoPlay playsInline></video>
                {/* <video playsInline ref={remoteStreamRef} autoPlay ></video> */}
            </div>
        </div>
    );
};

export default CallComponent;
