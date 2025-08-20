import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaBook, FaQuestionCircle, FaHeadset, FaUniversalAccess, FaChalkboardTeacher } from 'react-icons/fa';
import AccessibilitySettings from './AccessibilitySettings';
import '../styles/Dashboard.css';

// Mock data for lessons
const mockLessons = [
  {
    id: '1',
    title: 'Introduction to Programming',
    description: 'Learn the basics of programming concepts and logic.',
    difficulty: 'Beginner',
    estimatedTime: 30,
    userProgress: { progress: 75, completed: false },
    quiz: { questions: [{ id: 1 }, { id: 2 }] }
  },
  {
    id: '2',
    title: 'Web Development Fundamentals',
    description: 'Understand HTML, CSS, and JavaScript basics.',
    difficulty: 'Intermediate',
    estimatedTime: 45,
    userProgress: { progress: 100, completed: true },
    quiz: { questions: [{ id: 1 }, { id: 2 }, { id: 3 }] }
  },
  {
    id: '3',
    title: 'Data Structures and Algorithms',
    description: 'Master essential data structures and algorithms.',
    difficulty: 'Advanced',
    estimatedTime: 60,
    userProgress: { progress: 25, completed: false },
    quiz: { questions: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }] }
  },
  {
    id: '4',
    title: 'Mobile App Development',
    description: 'Create applications for iOS and Android platforms.',
    difficulty: 'Intermediate',
    estimatedTime: 50,
    userProgress: { progress: 0, completed: false },
    quiz: { questions: [{ id: 1 }, { id: 2 }] }
  },
  {
    id: '5',
    title: 'Machine Learning Basics',
    description: 'Introduction to machine learning concepts and applications.',
    difficulty: 'Advanced',
    estimatedTime: 75,
    userProgress: { progress: 10, completed: false },
    quiz: { questions: [{ id: 1 }, { id: 2 }, { id: 3 }] }
  }
];

// Mock user data
const mockUser = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'student',
  preferences: {
    theme: 'dark',
    textToSpeech: true,
    learningPace: 'medium',
    interests: ['web development', 'mobile apps']
  }
};

/**
 * Dashboard component showing user's lessons and progress
 * @returns {JSX.Element} Dashboard UI
 */
const Dashboard = ({ user }) => {
  const [lessons, setLessons] = useState(mockLessons);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [userProfile, setUserProfile] = useState(user || mockUser);
  const [activeTab, setActiveTab] = useState('home');
  const [showAccessibilitySettings, setShowAccessibilitySettings] = useState(false);

  // Simulate data loading with useEffect
  useEffect(() => {
    // Simulate a brief loading state for better UX
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Calculate overall progress
  const calculateOverallProgress = () => {
    if (!lessons.length) return 0;
    
    const completedLessons = lessons.filter(lesson => 
      lesson.userProgress && lesson.userProgress.completed
    ).length;
    
    return Math.round((completedLessons / lessons.length) * 100);
  };

  if (isLoading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  const renderTabContent = () => {
    switch(activeTab) {
      case 'home':
        return (
          <>
            <div className="dashboard-header">
              <h1>Welcome, {userProfile.name || 'Learner'}!</h1>
              <div className="overall-progress">
                <h3>Overall Progress</h3>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${calculateOverallProgress()}%` }}
                  ></div>
                </div>
                <span>{calculateOverallProgress()}% Complete</span>
              </div>
            </div>
            <section className="recommended-lessons">
              <h2>Recommended for You</h2>
              <div className="lessons-grid">
                {lessons
                  .filter(lesson => 
                    !lesson.userProgress || lesson.userProgress.progress < 100
                  )
                  .slice(0, 3)
                  .map(lesson => (
                    <div className="lesson-card" key={lesson.id}>
                      <h3>{lesson.title}</h3>
                      <p>{lesson.description}</p>
                      <div className="lesson-meta">
                        <span className="difficulty">{lesson.difficulty}</span>
                        <span className="duration">{lesson.estimatedTime} min</span>
                      </div>
                      <div className="lesson-progress">
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{ 
                              width: `${lesson.userProgress?.progress || 0}%` 
                            }}
                          ></div>
                        </div>
                        <span>{lesson.userProgress?.progress || 0}%</span>
                      </div>
                      <Link to={`/lessons/${lesson.id}`} className="lesson-button">
                        {lesson.userProgress?.progress ? 'Continue' : 'Start'}
                      </Link>
                    </div>
                  ))}
              </div>
            </section>
          </>
        );
      case 'courses':
        return (
          <section className="all-lessons">
            <h2>All Courses</h2>
            <div className="lessons-list">
              {lessons.length === 0 ? (
                <p>No courses available yet.</p>
              ) : (
                lessons.map(lesson => (
                  <div className="lesson-list-item" key={lesson.id}>
                    <div className="lesson-info">
                      <h3>{lesson.title}</h3>
                      <div className="lesson-meta">
                        <span className="difficulty">{lesson.difficulty}</span>
                        <span className="duration">{lesson.estimatedTime} min</span>
                      </div>
                    </div>
                    <div className="lesson-progress">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ 
                            width: `${lesson.userProgress?.progress || 0}%` 
                          }}
                        ></div>
                      </div>
                      <span>{lesson.userProgress?.progress || 0}%</span>
                    </div>
                    <Link to={`/lessons/${lesson.id}`} className="lesson-button">
                      {lesson.userProgress?.progress ? 'Continue' : 'Start'}
                    </Link>
                  </div>
                ))
              )}
            </div>
          </section>
        );
      case 'quizzes':
        return (
          <section className="quizzes">
            <h2>Available Quizzes</h2>
            <div className="quizzes-list">
              {lessons.length === 0 ? (
                <p>No quizzes available yet.</p>
              ) : (
                lessons
                  .filter(lesson => lesson.quiz && lesson.quiz.questions && lesson.quiz.questions.length > 0)
                  .map(lesson => (
                    <div className="quiz-list-item" key={lesson.id}>
                      <div className="quiz-info">
                        <h3>{lesson.title} Quiz</h3>
                        <p>{lesson.quiz?.questions?.length || 0} Questions</p>
                      </div>
                      <Link to={`/lessons/${lesson.id}?section=quiz`} className="quiz-button">
                        Take Quiz
                      </Link>
                    </div>
                  ))
              )}
            </div>
          </section>
        );
      case 'help':
        return (
          <section className="help-center">
            <h2>Get Help</h2>
            <div className="help-options">
              <div className="help-card">
                <h3>Frequently Asked Questions</h3>
                <p>Find answers to common questions about using the platform.</p>
                <button className="help-button">View FAQs</button>
              </div>
              <div className="help-card">
                <h3>Contact Support</h3>
                <p>Need personalized assistance? Our support team is here to help.</p>
                <button className="help-button">Contact Us</button>
              </div>
              <div className="help-card">
                <h3>Learning Resources</h3>
                <p>Access additional learning materials and resources.</p>
                <button className="help-button">Browse Resources</button>
              </div>
            </div>
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard">
        <div className="dashboard-tabs">
          <button 
            className={`tab-button ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
          >
            <FaHome /> Home
          </button>
          <button 
            className={`tab-button ${activeTab === 'courses' ? 'active' : ''}`}
            onClick={() => setActiveTab('courses')}
          >
            <FaBook /> Courses
          </button>
          <button 
            className={`tab-button ${activeTab === 'quizzes' ? 'active' : ''}`}
            onClick={() => setActiveTab('quizzes')}
          >
            <FaQuestionCircle /> Quizzes
          </button>
          <button 
            className={`tab-button ${activeTab === 'help' ? 'active' : ''}`}
            onClick={() => setActiveTab('help')}
          >
            <FaHeadset /> Help
          </button>
          <button 
            className={`tab-button accessibility-button`}
            onClick={() => setShowAccessibilitySettings(true)}
          >
            <FaUniversalAccess /> Accessibility
          </button>
          {userProfile.role === 'teacher' && (
            <Link to="/teacher-dashboard" className="tab-button teacher-button">
              <FaChalkboardTeacher /> Teacher Mode
            </Link>
          )}
        </div>
        
        {renderTabContent()}
        
        {showAccessibilitySettings && (
          <div className="modal-overlay">
            <div className="modal-container">
              <AccessibilitySettings 
                onClose={() => setShowAccessibilitySettings(false)} 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;