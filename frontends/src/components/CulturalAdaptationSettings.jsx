import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateUserPreferences } from '../api';
import '../styles/CulturalAdaptationSettings.css';

const ADAPTATION_LEVELS = [
  { value: 'none', label: 'None - No cultural adaptation' },
  { value: 'low', label: 'Low - Minimal cultural references' },
  { value: 'medium', label: 'Medium - Moderate cultural adaptation' },
  { value: 'high', label: 'High - Strong cultural adaptation' }
];

const REGIONS = [
  'Punjab',
  'Tamil Nadu',
  'Maharashtra',
  'West Bengal',
  'Gujarat',
  'Karnataka',
  'Rajasthan',
  'Kerala',
  'Uttar Pradesh',
  'Andhra Pradesh'
];

const CulturalAdaptationSettings = ({ userPreferences, onPreferencesUpdated }) => {
  const [adaptationLevel, setAdaptationLevel] = useState(userPreferences?.adaptationLevel || 'medium');
  const [region, setRegion] = useState(userPreferences?.region || 'Punjab');
  const [useLocalExamples, setUseLocalExamples] = useState(
    userPreferences?.useLocalExamples !== undefined ? userPreferences.useLocalExamples : true
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Update state when userPreferences changes
    if (userPreferences) {
      setAdaptationLevel(userPreferences.adaptationLevel || 'medium');
      setRegion(userPreferences.region || 'Punjab');
      setUseLocalExamples(
        userPreferences.useLocalExamples !== undefined ? userPreferences.useLocalExamples : true
      );
    }
  }, [userPreferences]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');

    try {
      const updatedPreferences = {
        ...userPreferences,
        adaptationLevel,
        region,
        useLocalExamples
      };

      const response = await updateUserPreferences(updatedPreferences);
      
      if (response.data) {
        setSaveMessage('Preferences saved successfully' + 
          (response.data.offlineStored ? ' (stored offline)' : ''));
        
        if (onPreferencesUpdated) {
          onPreferencesUpdated(updatedPreferences);
        }
      }
    } catch (error) {
      console.error('Failed to save preferences:', error);
      setSaveMessage('Failed to save preferences. ' + (error.message || ''));
    } finally {
      setIsSaving(false);
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setSaveMessage('');
      }, 3000);
    }
  };

  return (
    <div className="cultural-settings-container">
      <h2>Cultural Adaptation Settings</h2>
      
      <div className="settings-group">
        <label htmlFor="region">Your Region:</label>
        <select 
          id="region" 
          value={region} 
          onChange={(e) => setRegion(e.target.value)}
          className="settings-select"
        >
          {REGIONS.map(r => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      <div className="settings-group">
        <label htmlFor="adaptationLevel">Adaptation Level:</label>
        <select 
          id="adaptationLevel" 
          value={adaptationLevel} 
          onChange={(e) => setAdaptationLevel(e.target.value)}
          className="settings-select"
        >
          {ADAPTATION_LEVELS.map(level => (
            <option key={level.value} value={level.value}>{level.label}</option>
          ))}
        </select>
      </div>

      <div className="settings-group checkbox-group">
        <label>
          <input 
            type="checkbox" 
            checked={useLocalExamples} 
            onChange={(e) => setUseLocalExamples(e.target.checked)}
            className="settings-checkbox"
          />
          Use local examples and references
        </label>
      </div>

      <div className="settings-info">
        <p>
          Cultural adaptation helps personalize your learning experience by using examples and 
          references that are relevant to your cultural background and region.
        </p>
      </div>

      <div className="settings-actions">
        <button 
          onClick={handleSave} 
          disabled={isSaving}
          className="save-button"
        >
          {isSaving ? 'Saving...' : 'Save Preferences'}
        </button>
        
        {saveMessage && (
          <div className="save-message">{saveMessage}</div>
        )}
      </div>
    </div>
  );
};

export default CulturalAdaptationSettings;