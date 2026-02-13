import React, { useState } from 'react';
import { useConversation } from '@elevenlabs/react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

export function VoiceAssistant() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [streamingText, setStreamingText] = useState('');
  const [showChat, setShowChat] = useState(false);

  const conversation = useConversation({
    onConnect: () => {
      setIsConnecting(false);
      console.log('Voice assistant connected');
    },
    onDisconnect: () => {
      setIsConnecting(false);
      console.log('Voice assistant disconnected');
    },
    onError: (error) => {
      setIsConnecting(false);
      console.error('Voice error:', error);
    },
    onMessage: (event) => {
      if (event.type === 'agent_chat_response_part') {
        setStreamingText(prev => prev + event.text);
      }

      if (event.type === 'agent_chat_response') {
        setChatMessages(prev => [
          ...prev,
          { role: 'agent', text: streamingText }
        ]);
        setStreamingText('');
      }
      
      if (event.type === 'user_transcript') {
        setChatMessages(prev => [
          ...prev,
          { role: 'user', text: event.text }
        ]);
      }
    }
  });

  const handleVoiceToggle = async () => {
    if (conversation.status === 'connected') {
      await conversation.endSession();
      return;
    }

    try {
      setIsConnecting(true);
      
      await navigator.mediaDevices.getUserMedia({ audio: true });

      await conversation.startSession({
        agentId: 'agent_7201khb436pyefbs29m7pjyd6xbj', 
        connectionType: 'webrtc'
      });

      setShowChat(true);
    } catch (error) {
      console.error('Failed to start voice:', error);
      setIsConnecting(false);
      alert('Microphone access denied or ElevenLabs agent not configured');
    }
  };

  const isActive = conversation.status === 'connected';
  const isListening = isActive;

  return (
    <>
      
      <div className="voice-assistant-container">
        <button
          onClick={handleVoiceToggle}
          disabled={isConnecting}
          className={`voice-button ${isListening ? 'voice-button-active' : ''}`}
          title={isListening ? 'Stop Voice Assistant' : 'Start Voice Assistant'}
        >
          {isConnecting ? (
            <div className="voice-loading">
              <div className="spinner" />
            </div>
          ) : isListening ? (
            <>
              <MicOff className="voice-icon" />
              <div className="mic-pulse" />
            </>
          ) : (
            <Mic className="voice-icon" />
          )}
        </button>
        
        {isListening && (
          <span className="voice-status">
            <Volume2 size={14} />
            Listening...
          </span>
        )}
      </div>

      
      {showChat && (
        <div className="voice-chat-modal">
          <div className="voice-chat-header">
            <div className="voice-chat-title">
              <Volume2 size={18} />
              <span>Voice Assistant</span>
              {isListening && <div className="recording-indicator" />}
            </div>
            <button
              onClick={() => setShowChat(false)}
              className="voice-chat-close"
            >
              ×
            </button>
          </div>

          <div className="voice-chat-messages">
            {chatMessages.length === 0 ? (
              <div className="voice-chat-empty">
                <Mic size={32} />
                <p>Start speaking to interact with the AI assistant</p>
              </div>
            ) : (
              chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`voice-message ${msg.role === 'user' ? 'voice-message-user' : 'voice-message-agent'}`}
                >
                  {msg.text}
                </div>
              ))
            )}
            
            {streamingText && (
              <div className="voice-message voice-message-agent voice-message-streaming">
                {streamingText}
                <span className="typing-indicator">▋</span>
              </div>
            )}
          </div>

          <div className="voice-chat-footer">
            <button
              onClick={handleVoiceToggle}
              className={`voice-control-button ${isListening ? 'voice-control-stop' : 'voice-control-start'}`}
            >
              {isListening ? (
                <>
                  <MicOff size={18} />
                  Stop
                </>
              ) : (
                <>
                  <Mic size={18} />
                  Start
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
