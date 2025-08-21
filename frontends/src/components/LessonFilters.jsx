import React, { useState, useEffect } from 'react';
import '../styles/LessonFilters.css';

const LessonFilters = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    category: 'all',
    difficulty: 'all',
    searchTerm: '',
    sortBy: 'newest'
  });

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'programming', name: 'Programming' },
    { id: 'math', name: 'Mathematics' },
    { id: 'science', name: 'Science' },
    { id: 'language', name: 'Languages' },
    { id: 'art', name: 'Arts & Design' }
  ];

  const difficulties = [
    { id: 'all', name: 'All Levels' },
    { id: 'beginner', name: 'Beginner' },
    { id: 'intermediate', name: 'Intermediate' },
    { id: 'advanced', name: 'Advanced' }
  ];

  const sortOptions = [
    { id: 'newest', name: 'Newest First' },
    { id: 'oldest', name: 'Oldest First' },
    { id: 'progress', name: 'Progress' },
    { id: 'alphabetical', name: 'A-Z' }
  ];

  useEffect(() => {
    // Notify parent component when filters change
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterType]: value
    }));
  };

  const handleSearchChange = (e) => {
    const searchTerm = e.target.value;
    setFilters(prevFilters => ({
      ...prevFilters,
      searchTerm
    }));
  };

  const handleReset = () => {
    setFilters({
      category: 'all',
      difficulty: 'all',
      searchTerm: '',
      sortBy: 'newest'
    });
  };

  return (
    <div className="lesson-filters">
      <div className="filter-header">
        <h3>Filter Lessons</h3>
        <button className="reset-button" onClick={handleReset}>Reset</button>
      </div>
      
      <div className="search-container">
        <input
          type="text"
          placeholder="Search lessons..."
          value={filters.searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>
      
      <div className="filter-section">
        <label>Category:</label>
        <div className="filter-options">
          {categories.map(category => (
            <button
              key={category.id}
              className={`filter-option ${filters.category === category.id ? 'active' : ''}`}
              onClick={() => handleFilterChange('category', category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
      
      <div className="filter-section">
        <label>Difficulty:</label>
        <div className="filter-options">
          {difficulties.map(difficulty => (
            <button
              key={difficulty.id}
              className={`filter-option ${filters.difficulty === difficulty.id ? 'active' : ''}`}
              onClick={() => handleFilterChange('difficulty', difficulty.id)}
            >
              {difficulty.name}
            </button>
          ))}
        </div>
      </div>
      
      <div className="filter-section">
        <label>Sort By:</label>
        <select
          value={filters.sortBy}
          onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          className="sort-select"
        >
          {sortOptions.map(option => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default LessonFilters;