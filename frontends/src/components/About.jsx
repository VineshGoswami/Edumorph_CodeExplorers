import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/About.css';

const About = () => {
  const teamMembers = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      role: 'Founder & CEO',
      bio: 'Dr. Johnson has over 15 years of experience in educational technology and curriculum development. She founded EduMorph with the vision of making education accessible and personalized for all learners.',
      image: 'https://via.placeholder.com/150'
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Chief Technology Officer',
      bio: 'Michael leads our engineering team with expertise in AI and machine learning. He is passionate about using technology to create adaptive learning experiences.',
      image: 'https://via.placeholder.com/150'
    },
    {
      id: 3,
      name: 'Priya Patel',
      role: 'Head of Curriculum',
      bio: 'Priya oversees our educational content development, ensuring it meets high standards of quality and cultural relevance across different regions and languages.',
      image: 'https://via.placeholder.com/150'
    }
  ];

  return (
    <div className="about-container">
      <section className="about-hero">
        <h1>About EduMorph</h1>
        <p className="tagline">Transforming education through personalization and accessibility</p>
      </section>

      <section className="about-mission">
        <h2>Our Mission</h2>
        <p>
          At EduMorph, we believe that every student deserves access to high-quality education 
          that adapts to their unique needs, learning style, and cultural background. Our mission 
          is to break down barriers to education by providing a platform that transforms standard 
          educational content into personalized learning experiences.
        </p>
      </section>

      <section className="about-values">
        <h2>Our Values</h2>
        <div className="values-grid">
          <div className="value-card">
            <h3>Accessibility</h3>
            <p>We are committed to making education accessible to all learners, regardless of ability, language, or background.</p>
          </div>
          <div className="value-card">
            <h3>Personalization</h3>
            <p>We believe that learning is most effective when it's tailored to individual needs and preferences.</p>
          </div>
          <div className="value-card">
            <h3>Cultural Relevance</h3>
            <p>We respect and celebrate diversity by ensuring our content is culturally appropriate and meaningful.</p>
          </div>
          <div className="value-card">
            <h3>Innovation</h3>
            <p>We continuously explore new technologies and methodologies to enhance the learning experience.</p>
          </div>
        </div>
      </section>

      <section className="about-team">
        <h2>Our Team</h2>
        <div className="team-grid">
          {teamMembers.map(member => (
            <div key={member.id} className="team-member">
              <img src={member.image} alt={member.name} className="member-image" />
              <h3>{member.name}</h3>
              <p className="member-role">{member.role}</p>
              <p className="member-bio">{member.bio}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="about-contact">
        <h2>Get in Touch</h2>
        <p>Have questions about EduMorph or interested in partnering with us?</p>
        <Link to="/contact" className="contact-button">Contact Us</Link>
      </section>
    </div>
  );
};

export default About;