import React, { useState, useEffect } from 'react';
import { updateUserPreferences } from '../api';
import '../styles/TranslationSettings.css';

const LANGUAGE_OPTIONS = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi' },
  { code: 'pa', name: 'Punjabi' },
  { code: 'ta', name: 'Tamil' },
  { code: 'te', name: 'Telugu' },
  { code: 'mr', name: 'Marathi' },
  { code: 'bn', name: 'Bengali' },
  { code: 'gu', name: 'Gujarati' },
  { code: 'kn', name: 'Kannada' },
  { code: 'ml', name: 'Malayalam' },
  { code: 'or', name: 'Odia' },
  { code: 'ur', name: 'Urdu' }
];

const TranslationSettings = ({ onClose, initialPreferences = {} }) => {
  const [preferences, setPreferences] = useState({
    preferredLanguage: 'en',
    translationEnabled: true,
    contextAwareTranslation: true,
    preserveFormatting: true,
    ...initialPreferences
  });

  const [saveStatus, setSaveStatus] = useState(null);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    // Load user preferences from localStorage if available
    const storedPrefs = localStorage.getItem('userPreferences');
    if (storedPrefs) {
      try {
        const parsedPrefs = JSON.parse(storedPrefs);
        setPreferences(prev => ({
          ...prev,
          ...parsedPrefs
        }));
      } catch (error) {
        console.error('Failed to parse stored preferences:', error);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPreferences({
      ...preferences,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    setSaveMessage('Saving preferences...');
    
    try {
      await updateUserPreferences(preferences);
      
      // Also update localStorage
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
      
      setSaveStatus('success');
      setSaveMessage('Preferences saved successfully!');
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setSaveStatus(null);
        setSaveMessage('');
      }, 3000);
    } catch (error) {
      console.error('Failed to save preferences:', error);
      setSaveStatus('error');
      setSaveMessage('Failed to save preferences. Please try again.');
    }
  };

  return (
    <div className="translation-settings">
      <h2>Translation Settings</h2>
      <div className="settings-group">
        <label htmlFor="preferredLanguage">Preferred Language:</label>
        <select
          id="preferredLanguage"
          name="preferredLanguage"
          value={preferences.preferredLanguage}
          onChange={handleChange}
        >
          {LANGUAGE_OPTIONS.map(lang => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>

      <div className="settings-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="translationEnabled"
            checked={preferences.translationEnabled}
            onChange={handleChange}
          />
          Enable Translation
        </label>
        <p className="setting-info">
          Automatically translate content to your preferred language
        </p>
      </div>

      <div className="settings-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="contextAwareTranslation"
            checked={preferences.contextAwareTranslation}
            onChange={handleChange}
            disabled={!preferences.translationEnabled}
          />
          Use Context-Aware Translation
        </label>
        <p className="setting-info">
          Improve translation quality by considering educational context and subject matter
        </p>
      </div>

      <div className="settings-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="preserveFormatting"
            checked={preferences.preserveFormatting}
            onChange={handleChange}
            disabled={!preferences.translationEnabled}
          />
          Preserve Formatting
        </label>
        <p className="setting-info">
          Keep mathematical formulas, code snippets, and technical terms intact during translation
        </p>
      </div>

      <div className="settings-actions">
        <button onClick={onClose} className="cancel-button">
          Cancel
        </button>
        <button onClick={handleSave} className="save-button">
          Save Preferences
        </button>
      </div>

      {saveStatus && (
        <div className={`save-message ${saveStatus}`}>
          {saveMessage}
        </div>
      )}
    </div>
  );
};

export default TranslationSettings;