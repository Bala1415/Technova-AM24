import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import io from 'socket.io-client';
import toast from 'react-hot-toast';

const StudentChatroom = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState({});
  
  const socketRef = useRef(null);
  const localVideoRef = useRef(null);
  const peerConnectionsRef = useRef({});
  const messagesEndRef = useRef(null);

  const userId = localStorage.getItem('userId') || 'student_' + Math.random().toString(36).substr(2, 9);
  const userName = localStorage.getItem('userName') || 'Anonymous Student';

  // Attach local stream to video element when it changes
  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    // Connect to Socket.io
    socketRef.current = io('http://localhost:5000');

    socketRef.current.emit('join-chatroom', { userId, userName, room: 'students' });

    socketRef.current.on('chatroom-message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    socketRef.current.on('online-users', (users) => {
      setOnlineUsers(users);
    });

    socketRef.current.on('video-offer', async ({ from, offer }) => {
      await handleVideoOffer(from, offer);
    });

    socketRef.current.on('video-answer', async ({ from, answer }) => {
      await handleVideoAnswer(from, answer);
    });

    socketRef.current.on('ice-candidate', async ({ from, candidate }) => {
      await handleIceCandidate(from, candidate);
    });

    socketRef.current.on('user-left-video', ({ userId }) => {
      if (peerConnectionsRef.current[userId]) {
        peerConnectionsRef.current[userId].close();
        delete peerConnectionsRef.current[userId];
      }
      setRemoteStreams(prev => {
        const updated = { ...prev };
        delete updated[userId];
        return updated;
      });
    });

    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      Object.values(peerConnectionsRef.current).forEach(pc => pc.close());
      socketRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const message = {
      userId,
      userName,
      text: inputMessage,
      timestamp: new Date(),
      room: 'students'
    };

    socketRef.current.emit('chatroom-message', message);
    setInputMessage('');
  };

  const startVideoCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }, 
        audio: true 
      });
      
      setLocalStream(stream);
      setIsVideoCall(true);
      
      socketRef.current.emit('join-video-call', { userId, userName, room: 'students' });
      toast.success('Video call started! Camera is on.');
    } catch (error) {
      console.error('Error accessing media devices:', error);
      if (error.name === 'NotAllowedError') {
        toast.error('Camera/microphone access denied. Please allow permissions in browser settings.');
      } else if (error.name === 'NotFoundError') {
        toast.error('No camera or microphone found.');
      } else {
        toast.error('Failed to access camera/microphone: ' + error.message);
      }
    }
  };

  const endVideoCall = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    
    Object.values(peerConnectionsRef.current).forEach(pc => pc.close());
    peerConnectionsRef.current = {};
    setRemoteStreams({});
    setIsVideoCall(false);
    
    socketRef.current.emit('leave-video-call', { userId, room: 'students' });
    toast.success('Video call ended');
  };

  const createPeerConnection = (targetUserId) => {
    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    };

    const peerConnection = new RTCPeerConnection(configuration);

    if (localStream) {
      localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
      });
    }

    peerConnection.ontrack = (event) => {
      console.log('Received remote stream from:', targetUserId);
      setRemoteStreams(prev => ({
        ...prev,
        [targetUserId]: event.streams[0]
      }));
    };

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current.emit('ice-candidate', {
          to: targetUserId,
          candidate: event.candidate,
          room: 'students'
        });
      }
    };

    peerConnectionsRef.current[targetUserId] = peerConnection;
    return peerConnection;
  };

  const handleVideoOffer = async (from, offer) => {
    if (!localStream) return;
    
    const peerConnection = createPeerConnection(from);
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    
    socketRef.current.emit('video-answer', {
      to: from,
      answer,
      room: 'students'
    });
  };

  const handleVideoAnswer = async (from, answer) => {
    const peerConnection = peerConnectionsRef.current[from];
    if (peerConnection) {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    }
  };

  const handleIceCandidate = async (from, candidate) => {
    const peerConnection = peerConnectionsRef.current[from];
    if (peerConnection) {
      await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            💬 Student Chatroom
          </h1>
          <p className="text-gray-600">Connect with fellow students • {onlineUsers.length} online</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Online Users Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                Online ({onlineUsers.length})
              </h2>
              <div className="space-y-3">
                {onlineUsers.map((user, index) => (
                  <div key={index} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                      {user.userName?.charAt(0) || 'S'}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{user.userName}</p>
                      <p className="text-xs text-green-600">● Online</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-3">
            {/* Video Call Area */}
            {isVideoCall && (
              <div className="bg-gray-900 rounded-2xl shadow-xl p-6 mb-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {/* Local Video */}
                  <div className="relative">
                    <video
                      ref={localVideoRef}
                      autoPlay
                      muted
                      playsInline
                      className="w-full h-48 bg-gray-800 rounded-lg object-cover mirror"
                    />
                    <div className="absolute bottom-2 left-2 bg-black/70 text-white px-3 py-1 rounded text-sm font-semibold">
                      You {localStream ? '(Live)' : '(Loading...)'}
                    </div>
                  </div>

                  {/* Remote Videos */}
                  {Object.entries(remoteStreams).map(([remoteUserId, stream]) => (
                    <div key={remoteUserId} className="relative">
                      <video
                        autoPlay
                        playsInline
                        ref={(video) => {
                          if (video && stream) {
                            video.srcObject = stream;
                          }
                        }}
                        className="w-full h-48 bg-gray-800 rounded-lg object-cover"
                      />
                      <div className="absolute bottom-2 left-2 bg-black/70 text-white px-3 py-1 rounded text-sm font-semibold">
                        Student
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={endVideoCall}
                  className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-all"
                >
                  🔴 End Video Call
                </button>
              </div>
            )}

            {/* Chat Messages */}
            <div className="bg-white rounded-2xl shadow-xl flex flex-col" style={{ height: '600px' }}>
              {/* Chat Header */}
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold">Group Chat</h2>
                {!isVideoCall && (
                  <button
                    onClick={startVideoCall}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
                  >
                    📹 Start Video Call
                  </button>
                )}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.userId === userId ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-md rounded-2xl px-4 py-3 ${
                        msg.userId === userId
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {msg.userId !== userId && (
                        <p className="text-xs font-semibold mb-1 opacity-70">{msg.userName}</p>
                      )}
                      <p>{msg.text}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={sendMessage} className="p-4 border-t">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                  />
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                  >
                    Send
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </motion.div>

      <style jsx>{`
        .mirror {
          transform: scaleX(-1);
        }
      `}</style>
    </div>
  );
};

export default StudentChatroom;
