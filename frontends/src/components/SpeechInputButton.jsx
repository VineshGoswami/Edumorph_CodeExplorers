import React, { useState, useEffect } from 'react';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import '../styles/SpeechInputButton.css';

/**
 * A button component that enables speech input functionality
 * @param {Object} props - Component props
 * @param {Function} props.onTranscriptChange - Callback when transcript changes
 * @param {Function} props.onTranscriptComplete - Callback when transcript is complete
 * @param {string} props.language - Language for speech recognition
 * @param {string} props.buttonText - Text to display on button when not listening
 * @param {string} props.listeningText - Text to display on button when listening
 * @param {string} props.className - Additional CSS class names
 */
const SpeechInputButton = ({
  onTranscriptChange,
  onTranscriptComplete,
  language = 'en-US',
  buttonText = 'Speak',
  listeningText = 'Listening...',
  className = '',
}) => {
  const {
    startListening,
    stopListening,
    resetTranscript,
    transcript,
    interimTranscript,
    isListening,
    supported,
    error
  } = useSpeechRecognition({ language, continuous: false, interimResults: true });

  const [combinedTranscript, setCombinedTranscript] = useState('');

  // Update combined transcript when either transcript or interim transcript changes
  useEffect(() => {
    const combined = transcript + (interimTranscript ? ' ' + interimTranscript : '');
    setCombinedTranscript(combined.trim());
    
    // Call the onTranscriptChange callback with the current transcript
    if (onTranscriptChange) {
      onTranscriptChange(combined.trim());
    }
  }, [transcript, interimTranscript, onTranscriptChange]);

  // Call onTranscriptComplete when listening stops and we have a transcript
  useEffect(() => {
    if (!isListening && transcript && onTranscriptComplete) {
      onTranscriptComplete(transcript.trim());
    }
  }, [isListening, transcript, onTranscriptComplete]);

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      startListening();
    }
  };

  if (!supported) {
    return (
      <button 
        className={`speech-input-button disabled ${className}`}
        disabled
        title="Speech recognition is not supported in your browser"
      >
        {buttonText}
      </button>
    );
  }

  return (
    <div className="speech-input-container">
      <button
        onClick={toggleListening}
        className={`speech-input-button ${isListening ? 'listening' : ''} ${className}`}
        title={error ? `Error: ${error}` : undefined}
      >
        <span className="button-icon">
          {isListening ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
              <path fill="none" d="M0 0h24v24H0z"/>
              <path d="M12 15c1.66 0 3-1.34 3-3V6c0-1.66-1.34-3-3-3S9 4.34 9 6v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V6z"/>
              <path d="M17 12c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-2.08c3.39-.49 6-3.39 6-6.92h-2z"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
              <path fill="none" d="M0 0h24v24H0z"/>
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5z"/>
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-2.08c3.39-.49 6-3.39 6-6.92h-2z"/>
            </svg>
          )}
        </span>
        <span className="button-text">
          {isListening ? listeningText : buttonText}
        </span>
      </button>
      
      {isListening && (
        <div className="speech-input-feedback">
          <div className="speech-input-indicator">
            <div className="speech-input-pulse"></div>
          </div>
          <div className="speech-input-transcript">
            {combinedTranscript || 'Speak now...'}
          </div>
        </div>
      )}
    </div>
  );
};

export default SpeechInputButton;