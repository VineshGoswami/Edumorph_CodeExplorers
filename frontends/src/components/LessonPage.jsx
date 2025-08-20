import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLesson, trackProgress, adaptContentCultural, translateContentWithContext } from '../api';
import useSpeech from '../hooks/useSpeech';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import CulturalAdaptationSettings from './CulturalAdaptationSettings';
import TranslationSettings from './TranslationSettings';
import SpeechInputButton from './SpeechInputButton';

/**
 * LessonPage component for displaying and interacting with lesson content
 * @returns {JSX.Element} Lesson page UI
 */
const LessonPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentSection, setCurrentSection] = useState(0);
  const [progress, setProgress] = useState(0);
  const [adaptedContent, setAdaptedContent] = useState([]);
  const [userPreferences, setUserPreferences] = useState({
    adaptationLevel: 'medium',
    region: 'Punjab',
    useLocalExamples: true,
    preferredLanguage: 'en',
    translationEnabled: false,
    contextAwareTranslation: true,
    preserveFormatting: true
  });
  const [showSettings, setShowSettings] = useState(false);
  const [showTranslationSettings, setShowTranslationSettings] = useState(false);
  const [showSpeechInput, setShowSpeechInput] = useState(false);
  const [speechInputText, setSpeechInputText] = useState('');
  const { speak, stop, isSpeaking } = useSpeech();
  const { startListening, stopListening, transcript, isListening } = useSpeechRecognition({
    language: userPreferences.preferredLanguage === 'en' ? 'en-US' : userPreferences.preferredLanguage,
    continuous: false,
    interimResults: true
  });

  useEffect(() => {
    const fetchLesson = async () => {
      setIsLoading(true);
      try {
        const response = await getLesson(id);
        setLesson(response.data);
        
        // Set initial progress if available
        if (response.data.userProgress) {
          setProgress(response.data.userProgress.progress);
        }
        
        // Load user preferences from localStorage
        const savedPreferences = localStorage.getItem('userPreferences');
        if (savedPreferences) {
          const parsedPreferences = JSON.parse(savedPreferences);
          setUserPreferences(parsedPreferences);
        }
      } catch (err) {
        console.error('Error fetching lesson:', err);
        setError('Failed to load lesson. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLesson();
    
    // Cleanup speech on unmount
    const toggleTranslationSettings = () => {
    setShowTranslationSettings(!showTranslationSettings);
  };

  return () => {
      stop();
    };
  }, [id, stop]);

  // Update progress when section changes
  useEffect(() => {
    if (!lesson) return;
    
    // Calculate progress based on current section
    const sections = lesson.content.split('<section>');
    const newProgress = Math.round(((currentSection + 1) / sections.length) * 100);
    
    // Only update if progress has increased
    if (newProgress > progress) {
      setProgress(newProgress);
      
      // Send progress update to server if user is authenticated
      if (localStorage.getItem('token')) {
        trackProgress(lesson.id, newProgress).catch(err => {
          console.error('Error tracking progress:', err);
        });
      }
    }
  }, [currentSection, lesson, progress]);
  
  // Apply cultural adaptation and translation when lesson or preferences change
  useEffect(() => {
    const processContent = async () => {
      if (!lesson) return;
      
      const sections = lesson.content.split('<section>');
      const processedSections = [];
      
      // Create context object for adaptation and translation
      const context = {
        user: {
          grade: 5, // Default grade level
          preferred_language: userPreferences.preferredLanguage,
          region: userPreferences.region,
          local_examples: userPreferences.useLocalExamples
        },
        device: {
          is_mobile: window.innerWidth < 768
        },
        content: {
          subject: lesson.subject || 'General',
          adaptation_level: userPreferences.adaptationLevel
        }
      };
      
      // Process each section (adapt and translate)
      for (const section of sections) {
        if (!section.trim()) {
          processedSections.push('');
          continue;
        }
        
        try {
          // First apply cultural adaptation
          const adaptedResponse = await adaptContentCultural(section, context);
          let processedContent = adaptedResponse.data.adapted_text;
          
          // Then apply translation if enabled
          if (userPreferences.translationEnabled && 
              userPreferences.preferredLanguage !== 'en') {
            try {
              const translationMethod = userPreferences.contextAwareTranslation ? 
                translateContentWithContext : null;
              
              if (translationMethod) {
                const translatedResponse = await translationMethod(
                  processedContent, 
                  userPreferences.preferredLanguage, 
                  context, 
                  'en'
                );
                processedContent = translatedResponse.data.translated_text;
              }
            } catch (translationErr) {
              console.error('Translation error:', translationErr);
              // Continue with adapted but untranslated content
            }
          }
          
          processedSections.push(processedContent);
        } catch (err) {
          console.error('Error processing content:', err);
          processedSections.push(section); // Fallback to original content
        }
      }
      
      setAdaptedContent(processedSections);
    };
    
    processContent();
  }, [lesson, userPreferences]);

  const handleNextSection = () => {
    if (!lesson) return;
    
    const sections = lesson.content.split('<section>');
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
      window.scrollTo(0, 0);
      stop(); // Stop any ongoing speech
    }
  };

  const handlePrevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      window.scrollTo(0, 0);
      stop(); // Stop any ongoing speech
    }
  };

  const handleSpeakContent = () => {
    if (!lesson) return;
    
    const sections = lesson.content.split('<section>');
    const currentContent = sections[currentSection];
    
    // Remove HTML tags for speech
    const textContent = currentContent.replace(/<[^>]*>/g, '');
    
    if (isSpeaking) {
      stop();
    } else {
      speak(textContent);
    }
  };
  
  const handleToggleSpeechInput = () => {
    setShowSpeechInput(!showSpeechInput);
  };
  
  const toggleTranslationSettings = () => {
    setShowTranslationSettings(!showTranslationSettings);
  };
  
  const handleTranscriptChange = (text) => {
    setSpeechInputText(text);
  };
  
  const handleTranscriptComplete = (text) => {
    if (text.trim()) {
      // Here you could implement different actions based on the speech input
      // For example, navigate to next/previous section, toggle speech output, etc.
      
      // Simple command detection
      const lowerText = text.toLowerCase();
      
      if (lowerText.includes('next') || lowerText.includes('forward')) {
        handleNextSection();
      } else if (lowerText.includes('previous') || lowerText.includes('back')) {
        handlePrevSection();
      } else if (lowerText.includes('read') || lowerText.includes('speak')) {
        handleSpeakContent();
      } else if (lowerText.includes('finish') || lowerText.includes('complete')) {
        handleFinishLesson();
      }
      
      // Clear the speech input text after processing
      setSpeechInputText('');
    }
  };

  const handleFinishLesson = () => {
    // Mark lesson as 100% complete if user is authenticated
    if (localStorage.getItem('token')) {
      trackProgress(lesson.id, 100).catch(err => {
        console.error('Error completing lesson:', err);
      });
    }
    
    // Navigate back to dashboard
    navigate('/dashboard');
  };

  if (isLoading) {
    return <div className="loading">Loading lesson...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  if (!lesson) {
    return <div className="error-container">Lesson not found</div>;
  }

  // Split content into sections
  const sections = lesson.content.split('<section>');
  // Use adapted content if available, otherwise use original
  const currentContent = adaptedContent.length > currentSection ? adaptedContent[currentSection] : sections[currentSection];
  const isLastSection = currentSection === sections.length - 1;
  
  const handlePreferencesUpdated = (newPreferences) => {
    setUserPreferences(prev => {
      const updatedPreferences = { ...prev, ...newPreferences };
      localStorage.setItem('userPreferences', JSON.stringify(updatedPreferences));
      return updatedPreferences;
    });
  };

  return (
    <div className="lesson-page-container">
      <div className="lesson-header">
        <h1>{lesson.title}</h1>
        <div className="lesson-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span>{progress}% Complete</span>
        </div>
      </div>

      <div className="lesson-navigation">
        <button 
          onClick={handlePrevSection} 
          disabled={currentSection === 0}
          className="nav-button"
        >
          Previous
        </button>
        <span className="section-indicator">
          Section {currentSection + 1} of {sections.length}
        </span>
        {!isLastSection ? (
          <button 
            onClick={handleNextSection} 
            className="nav-button"
          >
            Next
          </button>
        ) : (
          <button 
            onClick={handleFinishLesson} 
            className="finish-button"
          >
            Finish Lesson
          </button>
        )}
      </div>

      <div className="lesson-content">
        <div className="content-actions">
          <button 
            onClick={handleSpeakContent}
            className={`speech-button ${isSpeaking ? 'speaking' : ''}`}
          >
            {isSpeaking ? 'Stop Reading' : 'Read Aloud'}
          </button>
          
          <button
            onClick={handleToggleSpeechInput}
            className={`speech-input-toggle ${showSpeechInput ? 'active' : ''}`}
          >
            {showSpeechInput ? 'Hide Voice Commands' : 'Voice Commands'}
          </button>
          
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="settings-button"
          >
            {showSettings ? 'Hide Settings' : 'Cultural Settings'}
          </button>
          
          <button
            onClick={toggleTranslationSettings}
            className="settings-button translation-button"
          >
            {showTranslationSettings ? 'Hide Translation' : 'Translation Settings'}
          </button>
        </div>
        
        {showSpeechInput && (
          <div className="speech-input-section">
            <SpeechInputButton
              onTranscriptChange={handleTranscriptChange}
              onTranscriptComplete={handleTranscriptComplete}
              language={userPreferences.preferredLanguage === 'en' ? 'en-US' : userPreferences.preferredLanguage}
              buttonText="Speak Command"
              listeningText="Listening for command..."
            />
            <div className="speech-commands-help">
              <h4>Available Voice Commands:</h4>
              <ul>
                <li>"Next" or "Forward" - Go to next section</li>
                <li>"Previous" or "Back" - Go to previous section</li>
                <li>"Read" or "Speak" - Read the current section aloud</li>
                <li>"Finish" or "Complete" - Finish the lesson</li>
              </ul>
            </div>
          </div>
        )}
        
        {showSettings && (
          <CulturalAdaptationSettings 
            userPreferences={userPreferences}
            onPreferencesUpdated={handlePreferencesUpdated}
          />
        )}
        
        {showTranslationSettings && (
          <TranslationSettings 
            initialPreferences={userPreferences}
            onClose={toggleTranslationSettings}
            onPreferencesUpdated={handlePreferencesUpdated}
          />
        )}
        
        <div 
          className="content-html"
          dangerouslySetInnerHTML={{ __html: currentContent }}
        />
      </div>

      {lesson.resources && lesson.resources.length > 0 && (
        <div className="lesson-resources">
          <h3>Additional Resources</h3>
          <ul>
            {lesson.resources.map(resource => (
              <li key={resource.id}>
                <a 
                  href={resource.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  {resource.title} ({resource.type})
                </a>
                <p>{resource.description}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {isLastSection && lesson.quizzes && lesson.quizzes.length > 0 && (
        <div className="lesson-quiz">
          <h3>Knowledge Check</h3>
          {lesson.quizzes.map(quiz => (
            <div key={quiz.id} className="quiz-item">
              <h4>{quiz.question}</h4>
              <div className="quiz-options">
                {quiz.options.map((option, index) => (
                  <label key={index} className="quiz-option">
                    <input 
                      type="radio" 
                      name={`quiz-${quiz.id}`} 
                      value={index} 
                    />
                    {option}
                  </label>
                ))}
              </div>
              <button className="check-answer-button">
                Check Answer
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="lesson-navigation bottom">
        <button 
          onClick={handlePrevSection} 
          disabled={currentSection === 0}
          className="nav-button"
        >
          Previous
        </button>
        {!isLastSection ? (
          <button 
            onClick={handleNextSection} 
            className="nav-button"
          >
            Next
          </button>
        ) : (
          <button 
            onClick={handleFinishLesson} 
            className="finish-button"
          >
            Finish Lesson
          </button>
        )}
      </div>
    </div>
  );
};

export default LessonPage;