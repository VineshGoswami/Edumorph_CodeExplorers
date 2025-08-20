/**
 * Accessibility Features Test Script
 * 
 * This script tests the enhanced speech input/output accessibility features
 * of the Edumorph platform.
 */

const { speechToText, textToSpeech } = require('../frontends/src/api/speechApi');
const fs = require('fs');
const path = require('path');

// Mock audio data for testing
const testAudioPath = path.join(__dirname, 'test_audio.mp3');
const testAudioExists = fs.existsSync(testAudioPath);

// Test configuration
const config = {
  testText: 'This is a test of the enhanced accessibility features.',
  testVoices: ['alloy', 'echo', 'nova', 'shimmer', 'onyx', 'fable'],
  testLanguages: ['en-US', 'es-ES', 'fr-FR', 'de-DE', 'ja-JP']
};

/**
 * Test text-to-speech functionality with different voices and languages
 */
async function testTextToSpeech() {
  console.log('\n===== TESTING TEXT-TO-SPEECH =====');
  
  for (const voice of config.testVoices) {
    try {
      console.log(`Testing TTS with voice: ${voice}`);
      const result = await textToSpeech(config.testText, voice, 'en-US');
      console.log(`✓ Successfully generated speech with voice: ${voice}`);
    } catch (error) {
      console.error(`✗ Failed to generate speech with voice ${voice}:`, error.message);
    }
  }
  
  // Test with different languages
  for (const language of config.testLanguages) {
    try {
      console.log(`Testing TTS with language: ${language}`);
      const result = await textToSpeech(config.testText, 'alloy', language);
      console.log(`✓ Successfully generated speech in language: ${language}`);
    } catch (error) {
      console.error(`✗ Failed to generate speech in language ${language}:`, error.message);
    }
  }
}

/**
 * Test speech-to-text functionality with different languages
 */
async function testSpeechToText() {
  console.log('\n===== TESTING SPEECH-TO-TEXT =====');
  
  if (!testAudioExists) {
    console.log('Test audio file not found. Skipping speech-to-text tests.');
    return;
  }
  
  const audioBuffer = fs.readFileSync(testAudioPath);
  const audioBase64 = audioBuffer.toString('base64');
  
  for (const language of config.testLanguages) {
    try {
      console.log(`Testing STT with language: ${language}`);
      const result = await speechToText(audioBase64, language);
      console.log(`✓ Successfully transcribed speech in ${language}: "${result.text}"`); 
    } catch (error) {
      console.error(`✗ Failed to transcribe speech in ${language}:`, error.message);
    }
  }
}

/**
 * Run all tests
 */
async function runTests() {
  console.log('Starting accessibility feature tests...');
  
  try {
    await testTextToSpeech();
    await testSpeechToText();
    console.log('\n✓ All tests completed!');
  } catch (error) {
    console.error('\n✗ Test suite failed:', error);
  }
}

runTests();