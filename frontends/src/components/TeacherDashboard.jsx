import React, { useState, useEffect } from 'react';
import { FaChalkboardTeacher, FaUserGraduate, FaChartLine, FaCog } from 'react-icons/fa';
import '../styles/TeacherDashboard.css';

// Mock data for students
const mockStudents = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    progress: {
      overallCompletion: 78,
      lessonsCompleted: 7,
      quizzesPassed: 5,
      lastActive: '2023-10-15T14:30:00Z'
    }
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob@example.com',
    progress: {
      overallCompletion: 45,
      lessonsCompleted: 4,
      quizzesPassed: 3,
      lastActive: '2023-10-14T09:15:00Z'
    }
  },
  {
    id: '3',
    name: 'Carol Davis',
    email: 'carol@example.com',
    progress: {
      overallCompletion: 92,
      lessonsCompleted: 9,
      quizzesPassed: 8,
      lastActive: '2023-10-15T16:45:00Z'
    }
  },
  {
    id: '4',
    name: 'David Wilson',
    email: 'david@example.com',
    progress: {
      overallCompletion: 23,
      lessonsCompleted: 2,
      quizzesPassed: 1,
      lastActive: '2023-10-10T11:20:00Z'
    }
  },
  {
    id: '5',
    name: 'Eva Martinez',
    email: 'eva@example.com',
    progress: {
      overallCompletion: 67,
      lessonsCompleted: 6,
      quizzesPassed: 4,
      lastActive: '2023-10-13T13:10:00Z'
    }
  }
];

// Mock data for class performance
const mockClassPerformance = {
  averageCompletion: 61,
  totalStudents: 5,
  activeStudents: 4,
  topPerformingLesson: 'Introduction to Programming',
  challengingLesson: 'Data Structures and Algorithms'
};

/**
 * TeacherDashboard component for tracking student progress
 * @returns {JSX.Element} TeacherDashboard UI
 */
const TeacherDashboard = ({ user }) => {
  const [students, setStudents] = useState(mockStudents);
  const [classPerformance, setClassPerformance] = useState(mockClassPerformance);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Simulate data loading with useEffect
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Filter students based on search term
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format date to readable string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Handle student selection for detailed view
  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    setActiveTab('studentDetail');
  };

  // Render overview tab content
  const renderOverview = () => (
    <div className="overview-container">
      <div className="stats-cards">
        <div className="stat-card">
          <h3>Students</h3>
          <div className="stat-value">{classPerformance.totalStudents}</div>
          <div className="stat-detail">
            <span>{classPerformance.activeStudents} active in last week</span>
          </div>
        </div>
        <div className="stat-card">
          <h3>Average Completion</h3>
          <div className="stat-value">{classPerformance.averageCompletion}%</div>
          <div className="stat-detail">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${classPerformance.averageCompletion}%` }}
              ></div>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <h3>Top Performing</h3>
          <div className="stat-value">{classPerformance.topPerformingLesson}</div>
          <div className="stat-detail">
            <span>Highest completion rate</span>
          </div>
        </div>
        <div className="stat-card">
          <h3>Challenging</h3>
          <div className="stat-value">{classPerformance.challengingLesson}</div>
          <div className="stat-detail">
            <span>Lowest completion rate</span>
          </div>
        </div>
      </div>

      <div className="recent-activity">
        <h2>Recent Student Activity</h2>
        <div className="activity-list">
          {students
            .sort((a, b) => new Date(b.progress.lastActive) - new Date(a.progress.lastActive))
            .slice(0, 3)
            .map(student => (
              <div className="activity-item" key={student.id}>
                <div className="activity-user">{student.name}</div>
                <div className="activity-detail">
                  Last active: {formatDate(student.progress.lastActive)}
                </div>
                <button 
                  className="view-button"
                  onClick={() => handleStudentSelect(student)}
                >
                  View Details
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );

  // Render students tab content
  const renderStudents = () => (
    <div className="students-container">
      <div className="search-bar">
        <input 
          type="text" 
          placeholder="Search students by name or email" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="students-table">
        <div className="table-header">
          <div className="header-cell">Name</div>
          <div className="header-cell">Email</div>
          <div className="header-cell">Progress</div>
          <div className="header-cell">Last Active</div>
          <div className="header-cell">Actions</div>
        </div>
        
        {filteredStudents.length === 0 ? (
          <div className="no-results">No students found</div>
        ) : (
          filteredStudents.map(student => (
            <div className="table-row" key={student.id}>
              <div className="cell">{student.name}</div>
              <div className="cell">{student.email}</div>
              <div className="cell">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${student.progress.overallCompletion}%` }}
                  ></div>
                </div>
                <span>{student.progress.overallCompletion}%</span>
              </div>
              <div className="cell">{formatDate(student.progress.lastActive)}</div>
              <div className="cell">
                <button 
                  className="view-button"
                  onClick={() => handleStudentSelect(student)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  // Render student detail tab content
  const renderStudentDetail = () => {
    if (!selectedStudent) return null;

    return (
      <div className="student-detail-container">
        <div className="detail-header">
          <button 
            className="back-button"
            onClick={() => setActiveTab('students')}
          >
            Back to Students
          </button>
          <h2>{selectedStudent.name}'s Progress</h2>
        </div>

        <div className="detail-stats">
          <div className="detail-stat-card">
            <h3>Overall Completion</h3>
            <div className="stat-value">{selectedStudent.progress.overallCompletion}%</div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${selectedStudent.progress.overallCompletion}%` }}
              ></div>
            </div>
          </div>
          <div className="detail-stat-card">
            <h3>Lessons Completed</h3>
            <div className="stat-value">{selectedStudent.progress.lessonsCompleted}</div>
          </div>
          <div className="detail-stat-card">
            <h3>Quizzes Passed</h3>
            <div className="stat-value">{selectedStudent.progress.quizzesPassed}</div>
          </div>
          <div className="detail-stat-card">
            <h3>Last Active</h3>
            <div className="stat-value">{formatDate(selectedStudent.progress.lastActive)}</div>
          </div>
        </div>

        <div className="action-buttons">
          <button className="action-button">Send Message</button>
          <button className="action-button">View Assignments</button>
          <button className="action-button">Generate Report</button>
        </div>

        {/* Placeholder for more detailed analytics */}
        <div className="analytics-placeholder">
          <h3>Detailed Analytics</h3>
          <p>More detailed analytics and visualizations would be displayed here.</p>
        </div>
      </div>
    );
  };

  // Render analytics tab content
  const renderAnalytics = () => (
    <div className="analytics-container">
      <h2>Class Analytics</h2>
      
      <div className="analytics-section">
        <h3>Completion Rates by Lesson</h3>
        <div className="chart-placeholder">
          <p>Bar chart showing completion rates for each lesson would be displayed here.</p>
        </div>
      </div>

      <div className="analytics-section">
        <h3>Student Engagement Over Time</h3>
        <div className="chart-placeholder">
          <p>Line chart showing student engagement metrics over time would be displayed here.</p>
        </div>
      </div>

      <div className="analytics-section">
        <h3>Quiz Performance</h3>
        <div className="chart-placeholder">
          <p>Visualization of quiz performance across different topics would be displayed here.</p>
        </div>
      </div>
    </div>
  );

  // Render settings tab content
  const renderSettings = () => (
    <div className="settings-container">
      <h2>Teacher Dashboard Settings</h2>
      
      <div className="settings-section">
        <h3>Notification Preferences</h3>
        <div className="setting-item">
          <label>
            <input type="checkbox" defaultChecked />
            Email notifications for low student activity
          </label>
        </div>
        <div className="setting-item">
          <label>
            <input type="checkbox" defaultChecked />
            Weekly progress report
          </label>
        </div>
        <div className="setting-item">
          <label>
            <input type="checkbox" />
            Real-time alerts for student achievements
          </label>
        </div>
      </div>

      <div className="settings-section">
        <h3>Dashboard Customization</h3>
        <div className="setting-item">
          <label>Default View</label>
          <select defaultValue="overview">
            <option value="overview">Overview</option>
            <option value="students">Students</option>
            <option value="analytics">Analytics</option>
          </select>
        </div>
        <div className="setting-item">
          <label>Data Refresh Rate</label>
          <select defaultValue="5">
            <option value="1">1 minute</option>
            <option value="5">5 minutes</option>
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
          </select>
        </div>
      </div>

      <button className="save-settings-button">Save Settings</button>
    </div>
  );

  // Render tab content based on active tab
  const renderTabContent = () => {
    switch(activeTab) {
      case 'overview':
        return renderOverview();
      case 'students':
        return renderStudents();
      case 'studentDetail':
        return renderStudentDetail();
      case 'analytics':
        return renderAnalytics();
      case 'settings':
        return renderSettings();
      default:
        return renderOverview();
    }
  };

  if (isLoading) {
    return <div className="loading">Loading teacher dashboard...</div>;
  }

  return (
    <div className="teacher-dashboard-container">
      <div className="dashboard-header">
        <h1>Teacher Dashboard</h1>
        <div className="teacher-info">
          <span>Welcome, {user?.name || 'Teacher'}</span>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <FaChalkboardTeacher /> Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'students' || activeTab === 'studentDetail' ? 'active' : ''}`}
          onClick={() => setActiveTab('students')}
        >
          <FaUserGraduate /> Students
        </button>
        <button 
          className={`tab-button ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          <FaChartLine /> Analytics
        </button>
        <button 
          className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <FaCog /> Settings
        </button>
      </div>

      <div className="dashboard-content">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default TeacherDashboard;