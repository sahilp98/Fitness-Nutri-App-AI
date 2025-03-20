import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useNotification } from '../context/NotificationContext';
import { useUser } from '../context/UserContext';
import { updateUserSettings } from '../store/slices/userSlice';
import { exportUserData, importUserData } from '../utils/dataTransfer';
import { clearAppData } from '../utils/localStorage';
import { useAI } from '../context/AIContext';

const SettingsContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const SettingSection = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: ${props => props.theme.fontSizes['2xl']};
  margin-bottom: 1rem;
`;

const SectionDescription = styled.p`
  margin-bottom: 1.5rem;
  color: rgba(45, 55, 72, 0.8);
`;

// const ButtonGroup = styled.div`
//   display: flex;
//   gap: 1rem;
//   flex-wrap: wrap;
// `;

const HiddenFileInput = styled.input`
  display: none;
`;

const SuccessMessage = styled.div`
  padding: 1rem;
  background-color: rgba(72, 187, 120, 0.1);
  color: ${props => props.theme.colors.success};
  border-radius: ${props => props.theme.radii.md};
  margin-bottom: 1rem;
`;

const ErrorMessage = styled.div`
  padding: 1rem;
  background-color: rgba(245, 101, 101, 0.1);
  color: ${props => props.theme.colors.error};
  border-radius: ${props => props.theme.radii.md};
  margin-bottom: 1rem;
`;

const WarningMessage = styled.div`
  padding: 1rem;
  background-color: rgba(237, 137, 54, 0.1);
  color: ${props => props.theme.colors.warning};
  border-radius: ${props => props.theme.radii.md};
  margin-bottom: 1rem;
`;

const SectionCard = styled(Card)`
  margin-bottom: 2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const ToggleSwitch = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const ToggleSlider = styled.div`
  position: relative;
  width: 48px;
  height: 24px;
  background: ${props => props.checked ? props.theme.colors.primary : props.theme.colors.muted};
  border-radius: 24px;
  margin-right: 1rem;
  transition: background-color 0.3s;
  
  &:before {
    content: '';
    position: absolute;
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background: white;
    border-radius: 50%;
    transition: transform 0.3s;
    transform: ${props => props.checked ? 'translateX(24px)' : 'translateX(0)'};
  }
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
`;

const ToggleLabel = styled.span``;

const NotificationPreview = styled.div`
  padding: 1rem;
  margin-top: 1rem;
  border-radius: ${props => props.theme.radii.md};
  background: ${props => props.theme.colors.background};
  box-shadow: ${props => props.theme.shadows.neuFlat};
  margin-bottom: 1rem;
`;

const SelectInput = styled.select`
  width: 100%;
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
  background-color: ${props => props.theme.colors.background};
  font-family: inherit;
  font-size: inherit;
`;

const SettingsDescription = styled.p`
  font-size: 0.9rem;
  color: grey;
  margin-top: 0.5rem;
`;

const SettingHeader = styled.h3`
  margin-top: 0;
  margin-bottom: 1rem;
`;

const SettingsSectionTitle = styled.h2`
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-size: 1.5rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    flex-direction: column;
  }
`;

const SettingsPage = () => {
  const dispatch = useDispatch();
  const notify = useNotification();
  const userState = useSelector(state => state.user);
  const { user } = useUser();
  const { currentProvider, changeProvider } = useAI();
  const fileInputRef = useRef(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  
  // Initialize with default settings
  const [settings, setSettings] = useState({
    notifications: {
      enabled: true,
      workoutReminders: true,
      progressUpdates: true,
      nutritionReminders: true,
      achievementAlerts: true
    },
    appSettings: {
      darkMode: false,
      aiProvider: currentProvider || 'gemini',
      measurementSystem: 'metric'
    },
    privacy: {
      shareWorkoutData: false,
      allowAnonymousDataCollection: true
    },
    sync: {
      autoSyncEnabled: true,
      syncFrequency: 'daily'
    }
  });

  // Initialize settings from user data if available
  useEffect(() => {
    if (user && user.settings) {
      setSettings(user.settings);
    }
  }, [user]);

  // Initialize settings from Redux state
  useEffect(() => {
    if (userState?.settings) {
      setSettings(prevSettings => ({
        ...prevSettings,
        ...userState.settings,
        // Ensure all keys exist
        notifications: {
          ...prevSettings.notifications,
          ...userState.settings.notifications
        },
        appSettings: {
          ...prevSettings.appSettings,
          ...userState.settings.appSettings
        },
        privacy: {
          ...prevSettings.privacy,
          ...userState.settings.privacy
        },
        sync: {
          ...prevSettings.sync,
          ...userState.settings.sync
        }
      }));
    }
  }, [userState]);

  const handleExport = () => {
    const success = exportUserData();
    
    if (success) {
      setMessage({ 
        type: 'success', 
        text: 'Data exported successfully! Check your downloads folder.' 
      });
    } else {
      setMessage({ 
        type: 'error', 
        text: 'Failed to export data. Please try again.' 
      });
    }
    
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };
  
  const handleImportClick = () => {
    fileInputRef.current.click();
  };
  
  const handleImportFile = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) return;
      
      await importUserData(file);
      
      setMessage({ 
        type: 'success', 
        text: 'Data imported successfully! Please refresh the page to see your data.' 
      });
      
      // Reset the file input so the same file can be selected again if needed
      event.target.value = null;
      
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: `Failed to import data: ${error.message}` 
      });
    }
  };
  
  const handleResetData = () => {
    if (showResetConfirm) {
      const success = clearAppData();
      
      if (success) {
        setMessage({ 
          type: 'success', 
          text: 'All app data has been reset. The page will refresh shortly.' 
        });
        
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setMessage({ 
          type: 'error', 
          text: 'Failed to reset app data. Please try again.' 
        });
      }
      
      setShowResetConfirm(false);
    } else {
      setShowResetConfirm(true);
    }
  };

  const handleToggleChange = (category, setting) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting]
      }
    }));
  };
  
  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    const [category, setting] = name.split('.');
    
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };
  
  const saveSettings = () => {
    // Dispatch action to update settings in Redux
    dispatch(updateUserSettings(settings));
    
    // Update AI provider if changed
    if (settings.appSettings.aiProvider !== currentProvider) {
      changeProvider(settings.appSettings.aiProvider);
    }
    
    // Show success notification
    notify.success(
      'Your settings have been updated successfully.',
      'Settings Saved'
    );
    
    // Show preview of notifications if enabled
    if (settings.notifications.enabled) {
      setTimeout(() => {
        notify.info(
          'This is an example of how notifications will appear.',
          'Notification Preview',
          { duration: 5000 }
        );
      }, 1000);
    }
  };

  const resetSettings = () => {
    // Reset to default settings
    setSettings({
      notifications: {
        enabled: true,
        workoutReminders: true,
        progressUpdates: true,
        nutritionReminders: true,
        achievementAlerts: true
      },
      appSettings: {
        darkMode: false,
        aiProvider: 'gemini',
        measurementSystem: 'metric'
      },
      privacy: {
        shareWorkoutData: false,
        allowAnonymousDataCollection: true
      },
      sync: {
        autoSyncEnabled: true,
        syncFrequency: 'daily'
      }
    });

    notify.info('Settings have been reset to defaults.', 'Reset Settings');
  };

  return (
    <>
      <h1>Settings</h1>
      <p>Customize your app experience and notification preferences.</p>
      
      {message.text && (
        <>
          {message.type === 'success' && <SuccessMessage>{message.text}</SuccessMessage>}
          {message.type === 'error' && <ErrorMessage>{message.text}</ErrorMessage>}
          {message.type === 'warning' && <WarningMessage>{message.text}</WarningMessage>}
        </>
      )}
      
      <SettingsContainer>
        <Card>
          <SettingSection>
            <SectionTitle>Data Management</SectionTitle>
            <SectionDescription>
              Export your data for backup or transfer to another device. 
              You can also import data from a previous export.
            </SectionDescription>
            
            <ButtonGroup>
              <Button variant="primary" onClick={handleExport}>
                Export Your Data
              </Button>
              
              <Button variant="secondary" onClick={handleImportClick}>
                Import Data
              </Button>
              
              <HiddenFileInput 
                type="file" 
                ref={fileInputRef} 
                accept=".json" 
                onChange={handleImportFile}
              />
            </ButtonGroup>
          </SettingSection>
          
          <SettingSection>
            <SectionTitle>Reset Application</SectionTitle>
            <SectionDescription>
              Reset all application data, including your profile, workout plans, nutrition plans, and progress.
              This action cannot be undone.
            </SectionDescription>
            
            {showResetConfirm ? (
              <>
                <WarningMessage>
                  Are you sure? This will delete all your data and cannot be undone.
                </WarningMessage>
                
                <ButtonGroup>
                  <Button variant="error" onClick={handleResetData}>
                    Yes, Reset Everything
                  </Button>
                  
                  <Button variant="secondary" onClick={() => setShowResetConfirm(false)}>
                    Cancel
                  </Button>
                </ButtonGroup>
              </>
            ) : (
              <Button variant="error" onClick={handleResetData}>
                Reset All Data
              </Button>
            )}
          </SettingSection>
        </Card>

        <SettingsSectionTitle>Notification Settings</SettingsSectionTitle>
        <SectionCard>
          <SettingHeader>Notification Preferences</SettingHeader>
          
          <FormGroup>
            <ToggleSwitch>
              <ToggleInput 
                type="checkbox" 
                checked={settings.notifications.enabled} 
                onChange={() => handleToggleChange('notifications', 'enabled')}
              />
              <ToggleSlider checked={settings.notifications.enabled} />
              <ToggleLabel>Enable Notifications</ToggleLabel>
            </ToggleSwitch>
            <SettingsDescription>
              Receive app notifications about your fitness journey
            </SettingsDescription>
          </FormGroup>
          
          {settings.notifications.enabled && (
            <>
              <FormGroup>
                <ToggleSwitch>
                  <ToggleInput 
                    type="checkbox" 
                    checked={settings.notifications.workoutReminders} 
                    onChange={() => handleToggleChange('notifications', 'workoutReminders')}
                  />
                  <ToggleSlider checked={settings.notifications.workoutReminders} />
                  <ToggleLabel>Workout Reminders</ToggleLabel>
                </ToggleSwitch>
                <SettingsDescription>
                  Get reminders about your scheduled workouts
                </SettingsDescription>
              </FormGroup>
              
              <FormGroup>
                <ToggleSwitch>
                  <ToggleInput 
                    type="checkbox" 
                    checked={settings.notifications.progressUpdates} 
                    onChange={() => handleToggleChange('notifications', 'progressUpdates')}
                  />
                  <ToggleSlider checked={settings.notifications.progressUpdates} />
                  <ToggleLabel>Progress Updates</ToggleLabel>
                </ToggleSwitch>
                <SettingsDescription>
                  Receive notifications about your fitness progress milestones
                </SettingsDescription>
              </FormGroup>
              
              <FormGroup>
                <ToggleSwitch>
                  <ToggleInput 
                    type="checkbox" 
                    checked={settings.notifications.nutritionReminders} 
                    onChange={() => handleToggleChange('notifications', 'nutritionReminders')}
                  />
                  <ToggleSlider checked={settings.notifications.nutritionReminders} />
                  <ToggleLabel>Nutrition Reminders</ToggleLabel>
                </ToggleSwitch>
                <SettingsDescription>
                  Get reminders about meal times and nutrition tracking
                </SettingsDescription>
              </FormGroup>
              
              <FormGroup>
                <ToggleSwitch>
                  <ToggleInput 
                    type="checkbox" 
                    checked={settings.notifications.achievementAlerts} 
                    onChange={() => handleToggleChange('notifications', 'achievementAlerts')}
                  />
                  <ToggleSlider checked={settings.notifications.achievementAlerts} />
                  <ToggleLabel>Achievement Alerts</ToggleLabel>
                </ToggleSwitch>
                <SettingsDescription>
                  Be notified when you earn achievements
                </SettingsDescription>
              </FormGroup>
              
              <NotificationPreview>
                <h4>Notification Preview</h4>
                <p>This is an example of how notifications will appear in the application.</p>
              </NotificationPreview>
            </>
          )}
        </SectionCard>
        
        <SettingsSectionTitle>Application Settings</SettingsSectionTitle>
        <SectionCard>
          <FormGroup>
            <ToggleSwitch>
              <ToggleInput 
                type="checkbox" 
                checked={settings.appSettings.darkMode} 
                onChange={() => handleToggleChange('appSettings', 'darkMode')}
              />
              <ToggleSlider checked={settings.appSettings.darkMode} />
              <ToggleLabel>Dark Mode</ToggleLabel>
            </ToggleSwitch>
            <SettingsDescription>
              Enable dark mode for a more comfortable experience in low light
            </SettingsDescription>
          </FormGroup>
          
          <FormGroup>
            <label>AI Provider</label>
            <SelectInput 
              name="appSettings.aiProvider"
              value={settings.appSettings.aiProvider}
              onChange={handleSelectChange}
            >
              <option value="gemini">Google Gemini</option>
              <option value="openai">OpenAI (GPT-4o-mini)</option>
            </SelectInput>
            <SettingsDescription>
              Select which AI service to use for generating workout and nutrition plans
            </SettingsDescription>
          </FormGroup>
          
          <FormGroup>
            <label>Measurement System</label>
            <SelectInput 
              name="appSettings.measurementSystem"
              value={settings.appSettings.measurementSystem}
              onChange={handleSelectChange}
            >
              <option value="metric">Metric (kg, cm)</option>
              <option value="imperial">Imperial (lb, in)</option>
            </SelectInput>
            <SettingsDescription>
              Choose your preferred measurement system for weight, height, and distances
            </SettingsDescription>
          </FormGroup>
        </SectionCard>
        
        <SettingsSectionTitle>Privacy Settings</SettingsSectionTitle>
        <SectionCard>
          <FormGroup>
            <ToggleSwitch>
              <ToggleInput 
                type="checkbox" 
                checked={settings.privacy.shareWorkoutData} 
                onChange={() => handleToggleChange('privacy', 'shareWorkoutData')}
              />
              <ToggleSlider checked={settings.privacy.shareWorkoutData} />
              <ToggleLabel>Share Workout Data</ToggleLabel>
            </ToggleSwitch>
            <SettingsDescription>
              Allow sharing your workout achievements on social media
            </SettingsDescription>
          </FormGroup>
          
          <FormGroup>
            <ToggleSwitch>
              <ToggleInput 
                type="checkbox" 
                checked={settings.privacy.allowAnonymousDataCollection} 
                onChange={() => handleToggleChange('privacy', 'allowAnonymousDataCollection')}
              />
              <ToggleSlider checked={settings.privacy.allowAnonymousDataCollection} />
              <ToggleLabel>Anonymous Data Collection</ToggleLabel>
            </ToggleSwitch>
            <SettingsDescription>
              Allow collection of anonymous usage data to improve app features
            </SettingsDescription>
          </FormGroup>
        </SectionCard>
        
        <SettingsSectionTitle>Sync Settings</SettingsSectionTitle>
        <SectionCard>
          <FormGroup>
            <ToggleSwitch>
              <ToggleInput 
                type="checkbox" 
                checked={settings.sync.autoSyncEnabled} 
                onChange={() => handleToggleChange('sync', 'autoSyncEnabled')}
              />
              <ToggleSlider checked={settings.sync.autoSyncEnabled} />
              <ToggleLabel>Auto-Sync Data</ToggleLabel>
            </ToggleSwitch>
            <SettingsDescription>
              Automatically sync your fitness data with cloud storage
            </SettingsDescription>
          </FormGroup>
          
          {settings.sync.autoSyncEnabled && (
            <FormGroup>
              <label>Sync Frequency</label>
              <SelectInput 
                name="sync.syncFrequency"
                value={settings.sync.syncFrequency}
                onChange={handleSelectChange}
              >
                <option value="realtime">Real-time</option>
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </SelectInput>
              <SettingsDescription>
                How often your data should be synchronized
              </SettingsDescription>
            </FormGroup>
          )}
        </SectionCard>
        
        <ButtonGroup>
          <Button variant="primary" onClick={saveSettings}>
            Save Settings
          </Button>
          <Button variant="secondary" onClick={resetSettings}>
            Reset to Defaults
          </Button>
        </ButtonGroup>
      </SettingsContainer>
    </>
  );
};

export default SettingsPage;
