import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaBook, FaQuestionCircle, FaHeadset, FaUniversalAccess, FaChalkboardTeacher } from 'react-icons/fa';
import AccessibilitySettings from './AccessibilitySettings';
import { useTheme } from '../App';
import '../styles/Dashboard.css';
import '../styles/animations.css';
import ProgressAnimation from './ProgressAnimation';
import LessonFilters from './LessonFilters';

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
  const [filteredLessons, setFilteredLessons] = useState(mockLessons);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [userProfile, setUserProfile] = useState(user || mockUser);
  const [activeTab, setActiveTab] = useState('home');
  const [showAccessibilitySettings, setShowAccessibilitySettings] = useState(false);
  const [animatedElements, setAnimatedElements] = useState([]);
  const [filters, setFilters] = useState({
    category: 'all',
    difficulty: 'all',
    searchTerm: '',
    sortBy: 'newest'
  });
  const { theme } = useTheme();
  
  // Refs for animation elements
  const dashboardRef = useRef(null);
  const headerRef = useRef(null);
  const lessonsRef = useRef(null);

  // Simulate data loading with useEffect
  useEffect(() => {
    // Simulate a brief loading state for better UX
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      // Start animations after loading
      animateElements();
    }, 500);
    return () => clearTimeout(timer);
  }, []);
  
  // Animation observer setup
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in-animation');
          observer.unobserve(entry.target);
        }
      });
    }, options);
    
    // Get all animatable elements
    const elements = document.querySelectorAll('.animatable');
    elements.forEach(el => {
      observer.observe(el);
    });
    
    return () => {
      elements.forEach(el => {
        observer.unobserve(el);
      });
    };
  }, [isLoading]);
  
  // Function to trigger animations
  const animateElements = () => {
    if (headerRef.current) {
      headerRef.current.classList.add('slide-in-animation');
    }
    
    // Staggered animation for lesson cards
    const lessonCards = document.querySelectorAll('.lesson-card');
    lessonCards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('scale-in-animation');
      }, 100 * index);
    });
  };

  // Placeholder for backend data fetch (always call hooks at the top level)
  useEffect(() => {
    // TODO: Replace mockLessons with API call to backend
    // Example:
    // fetch('/api/lessons').then(res => res.json()).then(data => setLessons(data));
  }, []);
  
  // Apply filters when filter state changes
  useEffect(() => {
    if (lessons.length === 0) return;
    
    let result = [...lessons];
    
    // Apply category filter
    if (filters.category !== 'all') {
      result = result.filter(lesson => lesson.category === filters.category);
    }
    
    // Apply difficulty filter
    if (filters.difficulty !== 'all') {
      result = result.filter(lesson => lesson.difficulty === filters.difficulty);
    }
    
    // Apply search term
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      result = result.filter(lesson => 
        lesson.title.toLowerCase().includes(searchLower) || 
        lesson.description.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply sorting
    switch (filters.sortBy) {
      case 'newest':
        // Since we don't have createdAt in our mock data, we'll just use the current order
        break;
      case 'oldest':
        result = [...result].reverse();
        break;
      case 'progress':
        result.sort((a, b) => {
          const progressA = a.userProgress?.progress || 0;
          const progressB = b.userProgress?.progress || 0;
          return progressB - progressA;
        });
        break;
      case 'alphabetical':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }
    
    // Add animation class to filtered results
    const animatedResults = result.map(lesson => ({
      ...lesson,
      animationClass: 'filter-change-animation'
    }));
    
    setFilteredLessons(animatedResults);
    
    // Remove animation class after animation completes
    const timer = setTimeout(() => {
      setFilteredLessons(result);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [filters, lessons]);
  
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

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

  // Fallback: If no lessons, show a message
  if (!lessons || lessons.length === 0) {
    return <div className="dashboard-fallback">No lessons found. Please check your connection or contact support.</div>;
  }

  // Debug: Log lessons and user
  console.log('Dashboard lessons:', lessons);
  console.log('Dashboard user:', userProfile);

  const renderTabContent = () => {
    switch(activeTab) {
      case 'home':
        return (
          <>
            <div className="dashboard-header animatable" ref={headerRef}>
              <h1 className="welcome-title">Welcome, {userProfile.name || 'Learner'}!</h1>
              <div className="overall-progress">
                <div className="progress-header">
                  <h3>Overall Progress</h3>
                  <ProgressAnimation progress={calculateOverallProgress()} size={80} strokeWidth={6} />
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${calculateOverallProgress()}%` }}
                    data-progress={calculateOverallProgress()}
                  ></div>
                </div>
                <span className="progress-text">{calculateOverallProgress()}% Complete</span>
              </div>
            </div>
            <section className="recommended-lessons">
              <h2>Recommended for You</h2>
              <div className="lessons-grid" ref={lessonsRef}>
                {lessons
                  .filter(lesson => 
                    !lesson.userProgress || lesson.userProgress.progress < 100
                  )
                  .slice(0, 3)
                  .map(lesson => (
                    <div className="lesson-card animatable glow-animation" key={lesson.id}>
                      <h3 className="lesson-title">{lesson.title}</h3>
                      <p className="lesson-description">{lesson.description}</p>
                      <div className="lesson-meta">
                        <span className="difficulty">{lesson.difficulty}</span>
                        <span className="duration">{lesson.estimatedTime} min</span>
                      </div>
                      <div className="lesson-progress">
                        <div className="lesson-progress-animation">
                          <ProgressAnimation progress={lesson.userProgress?.progress || 0} size={60} strokeWidth={4} />
                        </div>
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{ 
                              width: `${lesson.userProgress?.progress || 0}%` 
                            }}
                            data-progress={lesson.userProgress?.progress || 0}
                          ></div>
                        </div>
                        <span className="progress-text">{lesson.userProgress?.progress || 0}%</span>
                      </div>
                      <Link to={`/lessons/${lesson.id}`} className={`lesson-button ${lesson.userProgress?.progress === 100 ? 'completed-animation' : 'pulse-animation'}`}>
                        {lesson.userProgress?.progress === 100 ? 'Completed' : lesson.userProgress?.progress ? 'Continue' : 'Start'}
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
            <LessonFilters onFilterChange={handleFilterChange} />
            <div className="lessons-list">
              {filteredLessons.length === 0 ? (
                <div className="no-results">
                  <p>No courses match your current filters. Try adjusting your search criteria.</p>
                  <button 
                    className="reset-filters-button"
                    onClick={() => handleFilterChange({
                      category: 'all',
                      difficulty: 'all',
                      searchTerm: '',
                      sortBy: 'newest'
                    })}
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                filteredLessons.map(lesson => (
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
    <div className={`dashboard-container ${theme}-theme`}>
      <div className="dashboard" ref={dashboardRef}>
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