# Accessibility Tests

This directory contains tests for the enhanced accessibility features of the Edumorph platform.

## Test Files

- `accessibility_test.js`: Tests the speech-to-text and text-to-speech functionality with different voices and languages.

## Running Tests

To run the tests, you need to have Node.js installed and the required dependencies.

```bash
cd tests
node accessibility_test.js
```

## Test Audio

For speech-to-text tests, you need a test audio file named `test_audio.mp3` in this directory. This file should contain a clear spoken phrase in one of the supported languages.

If the test audio file is not present, the speech-to-text tests will be skipped.

## Expected Output

The tests will output the results of each test case, indicating success or failure. A successful test run should show checkmarks (✓) for each test case.