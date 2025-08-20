/**
 * Custom hook for text-to-speech functionality
 */
import { useState, useEffect, useCallback } from 'react';

/**
 * Hook for text-to-speech functionality
 * @param {Object} options - Configuration options
 * @param {string} options.defaultVoice - Default voice to use
 * @param {number} options.rate - Speech rate (0.1 to 10)
 * @param {number} options.pitch - Speech pitch (0 to 2)
 * @param {number} options.volume - Speech volume (0 to 1)
 * @returns {Object} Speech control methods and state
 */
const useSpeech = (options = {}) => {
  const {
    defaultVoice = '',
    rate = 1,
    pitch = 1,
    volume = 1,
  } = options;

  const [voices, setVoices] = useState([]);
  const [currentVoice, setCurrentVoice] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [utterance, setUtterance] = useState(null);
  const [supported, setSupported] = useState(false);

  // Check if speech synthesis is supported
  useEffect(() => {
    if ('speechSynthesis' in window) {
      setSupported(true);
      
      // Get available voices
      const synth = window.speechSynthesis;
      const updateVoices = () => {
        const availableVoices = synth.getVoices();
        setVoices(availableVoices);
        
        // Set default voice if specified
        if (defaultVoice) {
          const voice = availableVoices.find(v => 
            v.name === defaultVoice || v.lang === defaultVoice
          );
          if (voice) setCurrentVoice(voice);
        } else if (availableVoices.length > 0) {
          // Default to first available voice
          setCurrentVoice(availableVoices[0]);
        }
      };
      
      // Chrome loads voices asynchronously
      if (synth.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = updateVoices;
      }
      
      // Initial voice loading
      updateVoices();
      
      // Cleanup
      return () => {
        if (synth.speaking) {
          synth.cancel();
        }
      };
    }
  }, [defaultVoice]);

  // Speak text function
  const speak = useCallback((text) => {
    if (!supported) return false;
    
    const synth = window.speechSynthesis;
    
    // Cancel any ongoing speech
    if (synth.speaking) {
      synth.cancel();
    }
    
    // Create new utterance
    const newUtterance = new SpeechSynthesisUtterance(text);
    
    // Apply settings
    if (currentVoice) newUtterance.voice = currentVoice;
    newUtterance.rate = rate;
    newUtterance.pitch = pitch;
    newUtterance.volume = volume;
    
    // Set event handlers
    newUtterance.onstart = () => setIsSpeaking(true);
    newUtterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    newUtterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
      setIsPaused(false);
    };
    
    // Store utterance reference
    setUtterance(newUtterance);
    
    // Start speaking
    synth.speak(newUtterance);
    return true;
  }, [supported, currentVoice, rate, pitch, volume]);

  // Pause speech
  const pause = useCallback(() => {
    if (!supported || !isSpeaking) return false;
    
    const synth = window.speechSynthesis;
    synth.pause();
    setIsPaused(true);
    return true;
  }, [supported, isSpeaking]);

  // Resume speech
  const resume = useCallback(() => {
    if (!supported || !isPaused) return false;
    
    const synth = window.speechSynthesis;
    synth.resume();
    setIsPaused(false);
    return true;
  }, [supported, isPaused]);

  // Stop speech
  const stop = useCallback(() => {
    if (!supported || !isSpeaking) return false;
    
    const synth = window.speechSynthesis;
    synth.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
    return true;
  }, [supported, isSpeaking]);

  // Change voice
  const changeVoice = useCallback((voice) => {
    if (!supported) return false;
    
    const voiceObj = typeof voice === 'string'
      ? voices.find(v => v.name === voice || v.lang === voice)
      : voice;
      
    if (voiceObj) {
      setCurrentVoice(voiceObj);
      return true;
    }
    return false;
  }, [supported, voices]);

  return {
    speak,
    pause,
    resume,
    stop,
    changeVoice,
    isSpeaking,
    isPaused,
    voices,
    currentVoice,
    supported,
  };
};

export default useSpeech;