import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/FAQ.css';

const FAQ = () => {
  const faqs = [
    {
      id: 1,
      question: 'How do I reset my password?',
      answer: 'You can reset your password by clicking on the "Forgot Password" link on the login page. You will receive an email with instructions to reset your password.'
    },
    {
      id: 2,
      question: 'How can I track my progress?',
      answer: 'Your progress is automatically tracked in your Dashboard. You can see completed lessons, quiz scores, and overall course progress.'
    },
    {
      id: 3,
      question: 'Can I change my language preferences?',
      answer: 'Yes, you can change your language preferences in your Profile settings. Go to Profile > Translation Settings to update your preferred language.'
    },
    {
      id: 4,
      question: 'How do accessibility features work?',
      answer: 'EduMorph offers various accessibility features including text-to-speech, speech-to-text, high contrast mode, and text size adjustments. You can customize these in your Profile > Accessibility Settings.'
    },
    {
      id: 5,
      question: 'What should I do if a lesson doesn\'t load?',
      answer: 'If a lesson doesn\'t load, try refreshing the page. If the problem persists, check your internet connection or contact our support team for assistance.'
    },
    {
      id: 6,
      question: 'How do I contact support?',
      answer: 'You can contact our support team through the Contact page or by emailing support@edumorph.com.'
    }
  ];

  return (
    <div className="faq-container">
      <h1>Frequently Asked Questions</h1>
      
      <div className="faq-list">
        {faqs.map((faq) => (
          <div key={faq.id} className="faq-item">
            <h3 className="faq-question">{faq.question}</h3>
            <p className="faq-answer">{faq.answer}</p>
          </div>
        ))}
      </div>

      <div className="faq-footer">
        <p>Can't find what you're looking for?</p>
        <Link to="/contact" className="contact-link">Contact Support</Link>
      </div>
    </div>
  );
};

export default FAQ;