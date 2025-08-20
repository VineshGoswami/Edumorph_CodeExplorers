import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLesson, trackProgress } from '../api';
import useSpeech from '../hooks/useSpeech';

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
  const { speak, stop, isSpeaking } = useSpeech();

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
      } catch (err) {
        console.error('Error fetching lesson:', err);
        setError('Failed to load lesson. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLesson();
    
    // Cleanup speech on unmount
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
  const currentContent = sections[currentSection];
  const isLastSection = currentSection === sections.length - 1;

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
        </div>
        
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