import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import speechApi from '../api/speechApi';
import { FaVolumeUp, FaMicrophone, FaFont, FaAdjust, FaKeyboard, FaMousePointer } from 'react-icons/fa';
import '../styles/AccessibilitySettings.css';

const AccessibilitySettings = ({ onClose }) => {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    textToSpeech: true,
    speechToText: true,
    preferredVoice: 'alloy',
    speechRate: 1,
    autoReadContent: false,
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    keyboardNavigation: true,
    readingGuide: false,
    simplifiedInterface: false,
  });
  const [availableVoices, setAvailableVoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        // Get available settings from API
        const accessibilitySettings = await speechApi.getAccessibilitySettings();
        setAvailableVoices(accessibilitySettings.availableVoices || []);
        
        // If user has saved preferences, load them from API
        if (user) {
          try {
            const userPreferences = await speechApi.getUserAccessibilityPreferences(user.id);
            setSettings(prev => ({ ...prev, ...userPreferences }));
          } catch (prefError) {
            console.warn('Could not load user preferences, using defaults:', prefError);
            // Apply any settings from localStorage
            const localPrefs = localStorage.getItem('edumorph_accessibility');
            if (localPrefs) {
              try {
                const parsedPrefs = JSON.parse(localPrefs);
                setSettings(prev => ({ ...prev, ...parsedPrefs }));
              } catch (parseError) {
                console.error('Failed to parse local preferences:', parseError);
              }
            }
          }
        }
        
        // Apply current settings to the UI immediately
        Object.entries(settings).forEach(([key, value]) => {
          if (typeof value === 'boolean' && value === true) {
            switch (key) {
              case 'highContrast':
                document.body.classList.add('high-contrast');
                break;
              case 'largeText':
                document.body.classList.add('large-text');
                break;
              case 'reducedMotion':
                document.body.classList.add('reduced-motion');
                break;
              case 'simplifiedInterface':
                document.body.classList.add('simplified-ui');
                break;
              case 'keyboardNavigation':
                document.body.classList.add('keyboard-nav');
                break;
              case 'readingGuide':
                document.body.classList.add('reading-guide');
                break;
            }
          }
        });
      } catch (error) {
        console.error('Failed to load accessibility settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  /**
   * Toggle a class on the document body based on a setting value
   * @param {string} className - The CSS class to toggle
   * @param {boolean} isEnabled - Whether the setting is enabled
   */
  const toggleClassBasedOnSetting = (className, isEnabled) => {
    if (isEnabled) {
      document.body.classList.add(className);
    } else {
      document.body.classList.remove(className);
    }
  };

  const handleSave = async () => {
    if (!user) {
      setSaveStatus('Please log in to save preferences');
      return;
    }

    try {
      setSaveStatus('Saving...');
      const result = await speechApi.saveAccessibilityPreferences(settings, user?.id);
      
      // Apply settings to the app
      // Visual settings
      toggleClassBasedOnSetting('high-contrast', settings.highContrast);
      toggleClassBasedOnSetting('large-text', settings.largeText);
      toggleClassBasedOnSetting('reduced-motion', settings.reducedMotion);
      toggleClassBasedOnSetting('simplified-ui', settings.simplifiedInterface);
      
      // Navigation settings
      toggleClassBasedOnSetting('keyboard-nav', settings.keyboardNavigation);
      toggleClassBasedOnSetting('reading-guide', settings.readingGuide);
      
      // Store speech settings in localStorage for quick access
      localStorage.setItem('edumorph_accessibility', JSON.stringify({
        textToSpeech: settings.textToSpeech,
        speechToText: settings.speechToText,
        preferredVoice: settings.preferredVoice,
        speechRate: settings.speechRate,
        autoReadContent: settings.autoReadContent
      }));
      
      // Set success message based on where settings were saved
      if (result.message && result.message.includes('locally')) {
        setSaveStatus('Settings saved locally. Will sync when online.');
      } else {
        setSaveStatus('Settings saved successfully!');
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      console.error('Failed to save accessibility settings:', error);
      setSaveStatus('Failed to save settings. Please try again.');
    }
  };

  if (loading) {
    return <div className="accessibility-settings loading">Loading settings...</div>;
  }

  return (
    <div className="accessibility-settings">
      <div className="settings-header">
        <h2>Accessibility Settings</h2>
        <button className="close-button" onClick={onClose}>×</button>
      </div>

      <div className="settings-content">
        <div className="settings-section">
          <h3><FaVolumeUp /> Speech Settings</h3>
          
          <div className="setting-item">
            <label>
              <input 
                type="checkbox" 
                name="textToSpeech" 
                checked={settings.textToSpeech} 
                onChange={handleChange} 
              />
              Enable Text-to-Speech
            </label>
          </div>
          
          <div className="setting-item">
            <label>
              <input 
                type="checkbox" 
                name="speechToText" 
                checked={settings.speechToText} 
                onChange={handleChange} 
              />
              Enable Speech-to-Text
            </label>
          </div>
          
          <div className="setting-item">
            <label>
              <input 
                type="checkbox" 
                name="autoReadContent" 
                checked={settings.autoReadContent} 
                onChange={handleChange} 
              />
              Auto-read content when page loads
            </label>
          </div>
          
          <div className="setting-item">
            <label htmlFor="preferredVoice">Preferred Voice:</label>
            <select 
              id="preferredVoice" 
              name="preferredVoice" 
              value={settings.preferredVoice} 
              onChange={handleChange}
              disabled={!settings.textToSpeech}
            >
              {availableVoices.map(voice => (
                <option key={voice} value={voice}>{voice}</option>
              ))}
            </select>
          </div>
          
          <div className="setting-item">
            <label htmlFor="speechRate">Speech Rate:</label>
            <input 
              type="range" 
              id="speechRate" 
              name="speechRate" 
              min="0.5" 
              max="2" 
              step="0.1" 
              value={settings.speechRate} 
              onChange={handleChange}
              disabled={!settings.textToSpeech}
            />
            <span>{settings.speechRate}x</span>
          </div>
        </div>
        
        <div className="settings-section">
          <h3><FaAdjust /> Visual Settings</h3>
          
          <div className="setting-item">
            <label>
              <input 
                type="checkbox" 
                name="highContrast" 
                checked={settings.highContrast} 
                onChange={handleChange} 
              />
              High Contrast Mode
            </label>
          </div>
          
          <div className="setting-item">
            <label>
              <input 
                type="checkbox" 
                name="largeText" 
                checked={settings.largeText} 
                onChange={handleChange} 
              />
              Large Text
            </label>
          </div>
          
          <div className="setting-item">
            <label>
              <input 
                type="checkbox" 
                name="reducedMotion" 
                checked={settings.reducedMotion} 
                onChange={handleChange} 
              />
              Reduced Motion
            </label>
          </div>
          
          <div className="setting-item">
            <label>
              <input 
                type="checkbox" 
                name="simplifiedInterface" 
                checked={settings.simplifiedInterface} 
                onChange={handleChange} 
              />
              Simplified Interface
            </label>
          </div>
        </div>
        
        <div className="settings-section">
          <h3><FaKeyboard /> Navigation Settings</h3>
          
          <div className="setting-item">
            <label>
              <input 
                type="checkbox" 
                name="keyboardNavigation" 
                checked={settings.keyboardNavigation} 
                onChange={handleChange} 
              />
              Enhanced Keyboard Navigation
            </label>
          </div>
          
          <div className="setting-item">
            <label>
              <input 
                type="checkbox" 
                name="readingGuide" 
                checked={settings.readingGuide} 
                onChange={handleChange} 
              />
              Reading Guide
            </label>
          </div>
        </div>
      </div>

      <div className="settings-footer">
        {saveStatus && <div className="save-status">{saveStatus}</div>}
        <button className="save-button" onClick={handleSave}>Save Settings</button>
      </div>
    </div>
  );
};

export default AccessibilitySettings;