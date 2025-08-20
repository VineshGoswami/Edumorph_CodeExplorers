import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Help.css';

const Help = () => {
  const helpCategories = [
    {
      id: 1,
      title: 'Getting Started',
      description: 'Learn the basics of using EduMorph',
      icon: '🚀',
      links: [
        { text: 'Creating an account', url: '#account' },
        { text: 'Navigating the dashboard', url: '#dashboard' },
        { text: 'Finding lessons', url: '#lessons' }
      ]
    },
    {
      id: 2,
      title: 'Accessibility Features',
      description: 'Make EduMorph work for your needs',
      icon: '⚙️',
      links: [
        { text: 'Text-to-speech options', url: '#tts' },
        { text: 'Speech recognition', url: '#speech' },
        { text: 'Display settings', url: '#display' }
      ]
    },
    {
      id: 3,
      title: 'Learning Tools',
      description: 'Get the most out of your learning experience',
      icon: '📚',
      links: [
        { text: 'Taking quizzes', url: '#quizzes' },
        { text: 'Tracking progress', url: '#progress' },
        { text: 'Using voice commands', url: '#voice' }
      ]
    },
    {
      id: 4,
      title: 'Troubleshooting',
      description: 'Solve common issues',
      icon: '🔧',
      links: [
        { text: 'Connection problems', url: '#connection' },
        { text: 'Content not loading', url: '#loading' },
        { text: 'Account issues', url: '#account-issues' }
      ]
    }
  ];

  const tutorials = [
    {
      id: 1,
      title: 'Complete Beginner\'s Guide to EduMorph',
      duration: '5 min',
      thumbnail: 'https://via.placeholder.com/300x200'
    },
    {
      id: 2,
      title: 'How to Use Accessibility Features',
      duration: '3 min',
      thumbnail: 'https://via.placeholder.com/300x200'
    },
    {
      id: 3,
      title: 'Maximizing Your Learning with EduMorph',
      duration: '4 min',
      thumbnail: 'https://via.placeholder.com/300x200'
    }
  ];

  return (
    <div className="help-container">
      <section className="help-header">
        <h1>Help Center</h1>
        <p>Find answers, tutorials, and support resources to help you get the most out of EduMorph.</p>
        
        <div className="help-search">
          <input 
            type="text" 
            placeholder="Search for help topics..."
            aria-label="Search for help topics"
          />
          <button className="search-button">Search</button>
        </div>
      </section>

      <section className="help-categories">
        <h2>Help Categories</h2>
        <div className="categories-grid">
          {helpCategories.map(category => (
            <div key={category.id} className="category-card">
              <div className="category-icon">{category.icon}</div>
              <h3>{category.title}</h3>
              <p>{category.description}</p>
              <ul className="category-links">
                {category.links.map((link, index) => (
                  <li key={index}>
                    <a href={link.url}>{link.text}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="video-tutorials">
        <h2>Video Tutorials</h2>
        <div className="tutorials-grid">
          {tutorials.map(tutorial => (
            <div key={tutorial.id} className="tutorial-card">
              <div className="tutorial-thumbnail">
                <img src={tutorial.thumbnail} alt={tutorial.title} />
                <span className="duration">{tutorial.duration}</span>
              </div>
              <h3>{tutorial.title}</h3>
            </div>
          ))}
        </div>
      </section>

      <section className="help-contact">
        <h2>Still Need Help?</h2>
        <p>Our support team is ready to assist you with any questions or issues you may have.</p>
        <div className="help-buttons">
          <Link to="/faq" className="help-button">View FAQs</Link>
          <Link to="/contact" className="help-button primary">Contact Support</Link>
        </div>
      </section>
    </div>
  );
};

export default Help;