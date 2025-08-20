/**
 * Custom hook for speech recognition (speech-to-text) functionality
 */
import { useState, useEffect, useCallback } from 'react';

/**
 * Hook for speech recognition functionality
 * @param {Object} options - Configuration options
 * @param {string} options.language - Language for speech recognition (e.g., 'en-US')
 * @param {boolean} options.continuous - Whether to continuously recognize speech
 * @param {boolean} options.interimResults - Whether to return interim results
 * @returns {Object} Speech recognition control methods and state
 */
const useSpeechRecognition = (options = {}) => {
  const {
    language = 'en-US',
    continuous = false,
    interimResults = true,
  } = options;

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);
  const [supported, setSupported] = useState(false);
  const [error, setError] = useState(null);

  // Initialize speech recognition
  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setSupported(true);
      
      // Create recognition instance
      const recognitionInstance = new SpeechRecognition();
      
      // Configure recognition
      recognitionInstance.lang = language;
      recognitionInstance.continuous = continuous;
      recognitionInstance.interimResults = interimResults;
      
      // Set up event handlers
      recognitionInstance.onstart = () => {
        setIsListening(true);
        setError(null);
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setError(event.error);
        setIsListening(false);
      };
      
      recognitionInstance.onresult = (event) => {
        let finalTranscript = '';
        let currentInterimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
          } else {
            currentInterimTranscript += result[0].transcript;
          }
        }
        
        if (finalTranscript) {
          setTranscript(prev => prev + ' ' + finalTranscript.trim());
        }
        
        setInterimTranscript(currentInterimTranscript);
      };
      
      setRecognition(recognitionInstance);
      
      return () => {
        if (recognitionInstance) {
          try {
            recognitionInstance.stop();
          } catch (e) {
            // Ignore errors when stopping
          }
        }
      };
    }
  }, [language, continuous, interimResults]);

  // Start listening
  const startListening = useCallback(() => {
    if (!supported || !recognition) return false;
    
    try {
      // Clear previous transcript if not in continuous mode
      if (!continuous) {
        setTranscript('');
      }
      setInterimTranscript('');
      recognition.start();
      return true;
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      setError('Failed to start speech recognition');
      return false;
    }
  }, [supported, recognition, continuous]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (!supported || !recognition || !isListening) return false;
    
    try {
      recognition.stop();
      return true;
    } catch (error) {
      console.error('Failed to stop speech recognition:', error);
      return false;
    }
  }, [supported, recognition, isListening]);

  // Reset transcript
  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
  }, []);

  return {
    startListening,
    stopListening,
    resetTranscript,
    transcript,
    interimTranscript,
    isListening,
    supported,
    error,
  };
};

export default useSpeechRecognition;