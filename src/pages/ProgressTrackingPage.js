import React, { useState, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { format, subMonths, parseISO, differenceInDays } from 'date-fns';
import { FaPlus, FaImage, FaMedal, FaChartLine, FaCamera } from 'react-icons/fa';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend
} from 'chart.js';
import { useUser } from '../context/UserContext';
import { addBodyMeasurement, addProgressPhoto } from '../store/slices/userSlice';
import { useNotification } from '../context/NotificationContext';
import ProgressGallery from '../components/progress/ProgressGallery';

// Import styles
import {
  ProgressContainer,
  TabsContainer,
  Tab,
  MeasurementForm,
  PhotoUploadContainer,
  PhotoGrid,
  PhotoThumbnail,
  PhotoDate,
  PhotoUploadBox,
  UploadIcon,
  UploadInput,
  ModalOverlay,
  ModalContent,
  ModalImage,
  ModalHeader,
  ModalTitle,
  ModalClose,
  AchievementsContainer,
  AchievementCard,
  AchievementIcon,
  AchievementName,
  AchievementDescription,
  ChartContainer,
  StatsContainer,
  StatItem,
  StatValue,
  StatLabel,
  CompareContainer,
  CompareColumn,
  CompareTitle,
  CompareValue,
  MeasurementField,
  FormRow,
  TextHelpBlock
} from '../styles/ProgressTrackingStyles';

// Register Chart.js components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend
);

const ProgressTrackingPage = () => {
  const dispatch = useDispatch();
  const notify = useNotification();
  const { user, calculateBMI } = useUser();
  const fileInputRef = useRef(null);
  
  // Get measurement data from user state
  const bodyMeasurements = user.bodyMeasurements || [];
  const progressPhotos = user.progressPhotos || [];
  
  // Sort measurements by date
  const sortedMeasurements = useMemo(() => {
    return [...bodyMeasurements].sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );
  }, [bodyMeasurements]);
  
  // State for new measurement
  const [newMeasurement, setNewMeasurement] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    weight: '',
    bodyFat: '',
    chest: '',
    waist: '',
    hips: '',
    arms: '',
    thighs: ''
  });
  
  // State for progress photo viewing
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  
  // State for active tab
  const [activeTab, setActiveTab] = useState('weight');
  
  // Handle input change for new measurement
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMeasurement(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission for new measurement
  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log("Submitting measurement:", newMeasurement); // Debugging
    
    // Create measurement object with parsed numeric values
    const measurement = {
      id: `measurement_${Date.now()}`,
      date: newMeasurement.date,
      weight: newMeasurement.weight ? parseFloat(newMeasurement.weight) : null,
      bodyFat: newMeasurement.bodyFat ? parseFloat(newMeasurement.bodyFat) : null,
      chest: newMeasurement.chest ? parseFloat(newMeasurement.chest) : null,
      waist: newMeasurement.waist ? parseFloat(newMeasurement.waist) : null,
      hips: newMeasurement.hips ? parseFloat(newMeasurement.hips) : null,
      arms: newMeasurement.arms ? parseFloat(newMeasurement.arms) : null,
      thighs: newMeasurement.thighs ? parseFloat(newMeasurement.thighs) : null
    };
    
    // Dispatch the action with the measurement data
    dispatch(addBodyMeasurement(measurement));
    
    // Show success notification
    notify.success('Measurement saved successfully!');
    
    // Reset form to blank values except date
    setNewMeasurement({
      date: format(new Date(), 'yyyy-MM-dd'),
      weight: '',
      bodyFat: '',
      chest: '',
      waist: '',
      hips: '',
      arms: '',
      thighs: ''
    });
    
    // Check for achievements
    if (sortedMeasurements.length >= 4) {
      notify.success('Achievement Unlocked: Consistent Tracker', 'New Achievement', { duration: 0 });
    }
  };
  
  // Handle photo upload
  const handlePhotoUpload = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // Handle multiple files
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newPhoto = {
          id: `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // Ensure unique ID
          src: event.target.result,
          date: format(new Date(), 'yyyy-MM-dd'),
          type: 'progress'
        };
        
        // Dispatch the action to add the photo
        dispatch(addProgressPhoto(newPhoto));
        
        // Show success notification
        notify.success('Progress photo uploaded successfully!');
        
        // Check for achievements
        if (progressPhotos.length === 0) {
          notify.success('Achievement Unlocked: Visual Progress', 'New Achievement', { duration: 0 });
        }
      };
      reader.readAsDataURL(file);
    });
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Open photo modal
  const openPhotoModal = (photo) => {
    setSelectedPhoto(photo);
    setPhotoModalOpen(true);
  };
  
  // Calculate progress stats
  const progressStats = useMemo(() => {
    if (sortedMeasurements.length < 2) {
      return {
        weightChange: 0,
        weightChangePercent: 0,
        waistChange: 0,
        bodyFatChange: 0,
        startWeight: sortedMeasurements[0]?.weight || 0,
        currentWeight: sortedMeasurements[sortedMeasurements.length - 1]?.weight || 0,
        startBodyFat: sortedMeasurements[0]?.bodyFat || 0,
        currentBodyFat: sortedMeasurements[sortedMeasurements.length - 1]?.bodyFat || 0,
        trackingDays: 0
      };
    }
    
    const first = sortedMeasurements[0];
    const latest = sortedMeasurements[sortedMeasurements.length - 1];
    
    const weightChange = latest.weight - first.weight;
    const weightChangePercent = first.weight ? (weightChange / first.weight) * 100 : 0;
    const waistChange = latest.waist && first.waist ? latest.waist - first.waist : 0;
    const bodyFatChange = latest.bodyFat && first.bodyFat ? latest.bodyFat - first.bodyFat : 0;
    const trackingDays = differenceInDays(new Date(latest.date), new Date(first.date));
    
    return {
      weightChange,
      weightChangePercent,
      waistChange,
      bodyFatChange,
      startWeight: first.weight || 0,
      currentWeight: latest.weight || 0,
      startBodyFat: first.bodyFat || 0,
      currentBodyFat: latest.bodyFat || 0,
      trackingDays
    };
  }, [sortedMeasurements]);
  
  // Prepare chart data based on active tab
  const chartData = useMemo(() => {
    switch (activeTab) {
      case 'weight':
        return {
          labels: sortedMeasurements.map(m => format(new Date(m.date), 'MMM d')),
          datasets: [
            {
              label: 'Weight (kg)',
              data: sortedMeasurements.map(m => m.weight),
              borderColor: '#4d7cff',
              tension: 0.4,
              pointBackgroundColor: '#4d7cff'
            }
          ]
        };
      case 'bodyFat':
        return {
          labels: sortedMeasurements.map(m => format(new Date(m.date), 'MMM d')),
          datasets: [
            {
              label: 'Body Fat (%)',
              data: sortedMeasurements.map(m => m.bodyFat),
              borderColor: '#48bb78',
              tension: 0.4,
              pointBackgroundColor: '#48bb78'
            }
          ]
        };
      case 'measurements':
        return {
          labels: sortedMeasurements.map(m => format(new Date(m.date), 'MMM d')),
          datasets: [
            {
              label: 'Chest (cm)',
              data: sortedMeasurements.map(m => m.chest),
              borderColor: '#e84393',
              tension: 0.4,
              hidden: true
            },
            {
              label: 'Waist (cm)',
              data: sortedMeasurements.map(m => m.waist),
              borderColor: '#3498db',
              tension: 0.4
            },
            {
              label: 'Hips (cm)',
              data: sortedMeasurements.map(m => m.hips),
              borderColor: '#f39c12',
              tension: 0.4,
              hidden: true
            },
            {
              label: 'Arms (cm)',
              data: sortedMeasurements.map(m => m.arms),
              borderColor: '#9b59b6',
              tension: 0.4,
              hidden: true
            },
            {
              label: 'Thighs (cm)',
              data: sortedMeasurements.map(m => m.thighs),
              borderColor: '#1abc9c',
              tension: 0.4,
              hidden: true
            }
          ]
        };
      default:
        return { labels: [], datasets: [] };
    }
  }, [sortedMeasurements, activeTab]);
  
  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: false
      }
    }
  };
  
  // Define achievements
  const achievements = [
    {
      id: 'first_measurement',
      name: 'First Step',
      description: 'Record your first body measurement',
      icon: '🏁',
      unlocked: bodyMeasurements.length > 0
    },
    {
      id: 'consistent_tracker',
      name: 'Consistent Tracker',
      description: 'Record measurements for 5 different days',
      icon: '📊',
      unlocked: bodyMeasurements.length >= 5
    },
    {
      id: 'photo_progress',
      name: 'Visual Progress',
      description: 'Upload your first progress photo',
      icon: '📸',
      unlocked: progressPhotos.length > 0
    },
    {
      id: 'weight_loss_5',
      name: 'Weight Loss 5%',
      description: 'Lose 5% of your starting weight',
      icon: '⚖️',
      unlocked: progressStats.weightChangePercent <= -5
    },
    {
      id: 'one_month_streak',
      name: 'Monthly Dedication',
      description: 'Track your progress for 30 consecutive days',
      icon: '📅',
      unlocked: progressStats.trackingDays >= 30
    },
    {
      id: 'body_recomposition',
      name: 'Body Recomposition',
      description: 'Decrease body fat while maintaining weight',
      icon: '💪',
      unlocked: progressStats.bodyFatChange < -2 && Math.abs(progressStats.weightChange) < 1
    }
  ];

  return (
    <>
      <h1>Progress Tracking</h1>
      <p>Monitor your body measurements and see your progress over time.</p>
      
      <TabsContainer>
        <Tab 
          active={activeTab === 'weight'} 
          onClick={() => setActiveTab('weight')}
        >
          Weight
        </Tab>
        <Tab 
          active={activeTab === 'bodyFat'} 
          onClick={() => setActiveTab('bodyFat')}
        >
          Body Fat
        </Tab>
        <Tab 
          active={activeTab === 'measurements'} 
          onClick={() => setActiveTab('measurements')}
        >
          Measurements
        </Tab>
        <Tab 
          active={activeTab === 'photos'} 
          onClick={() => setActiveTab('photos')}
        >
          Progress Photos
        </Tab>
        <Tab 
          active={activeTab === 'achievements'} 
          onClick={() => setActiveTab('achievements')}
        >
          Achievements
        </Tab>
      </TabsContainer>
      
      <ProgressContainer>
        {/* Left column: Data visualization */}
        <div>
          {activeTab !== 'photos' && activeTab !== 'achievements' && (
            <Card>
              {sortedMeasurements.length > 0 ? (
                <>
                  <ChartContainer>
                    <Line data={chartData} options={chartOptions} />
                  </ChartContainer>
                  
                  {activeTab === 'weight' && (
                    <StatsContainer>
                      <StatItem>
                        <StatValue>
                          {progressStats.currentWeight || 0} kg
                        </StatValue>
                        <StatLabel>Current Weight</StatLabel>
                      </StatItem>
                      <StatItem>
                        <StatValue style={{ 
                          color: progressStats.weightChange < 0 ? 
                            '#48bb78' : progressStats.weightChange > 0 ? 
                            '#e53e3e' : '#718096' 
                        }}>
                          {progressStats.weightChange > 0 ? '+' : ''}
                          {progressStats.weightChange.toFixed(1)} kg
                        </StatValue>
                        <StatLabel>Total Change</StatLabel>
                      </StatItem>
                      <StatItem>
                        <StatValue>
                          {calculateBMI() || 0}
                        </StatValue>
                        <StatLabel>BMI</StatLabel>
                      </StatItem>
                      <StatItem>
                        <StatValue>
                          {progressStats.trackingDays}
                        </StatValue>
                        <StatLabel>Days Tracked</StatLabel>
                      </StatItem>
                    </StatsContainer>
                  )}
                  
                  {activeTab === 'bodyFat' && progressStats.currentBodyFat > 0 && (
                    <StatsContainer>
                      <StatItem>
                        <StatValue>
                          {progressStats.currentBodyFat || 0}%
                        </StatValue>
                        <StatLabel>Current BF%</StatLabel>
                      </StatItem>
                      <StatItem>
                        <StatValue style={{ 
                          color: progressStats.bodyFatChange < 0 ? 
                            '#48bb78' : progressStats.bodyFatChange > 0 ? 
                            '#e53e3e' : '#718096' 
                        }}>
                          {progressStats.bodyFatChange > 0 ? '+' : ''}
                          {progressStats.bodyFatChange.toFixed(1)}%
                        </StatValue>
                        <StatLabel>Total Change</StatLabel>
                      </StatItem>
                    </StatsContainer>
                  )}
                  
                  {activeTab === 'measurements' && (
                    <CompareContainer>
                      <CompareColumn>
                        <CompareTitle>First Measurement</CompareTitle>
                        <CompareValue>
                          Chest: {sortedMeasurements[0].chest || '-'} cm
                        </CompareValue>
                        <CompareValue>
                          Waist: {sortedMeasurements[0].waist || '-'} cm
                        </CompareValue>
                        <CompareValue>
                          Hips: {sortedMeasurements[0].hips || '-'} cm
                        </CompareValue>
                        <CompareValue>
                          Arms: {sortedMeasurements[0].arms || '-'} cm
                        </CompareValue>
                        <CompareValue>
                          Thighs: {sortedMeasurements[0].thighs || '-'} cm
                        </CompareValue>
                      </CompareColumn>
                      
                      <CompareColumn>
                        <CompareTitle>Latest Measurement</CompareTitle>
                        <CompareValue>
                          Chest: {sortedMeasurements[sortedMeasurements.length - 1].chest || '-'} cm
                        </CompareValue>
                        <CompareValue>
                          Waist: {sortedMeasurements[sortedMeasurements.length - 1].waist || '-'} cm
                        </CompareValue>
                        <CompareValue>
                          Hips: {sortedMeasurements[sortedMeasurements.length - 1].hips || '-'} cm
                        </CompareValue>
                        <CompareValue>
                          Arms: {sortedMeasurements[sortedMeasurements.length - 1].arms || '-'} cm
                        </CompareValue>
                        <CompareValue>
                          Thighs: {sortedMeasurements[sortedMeasurements.length - 1].thighs || '-'} cm
                        </CompareValue>
                      </CompareColumn>
                    </CompareContainer>
                  )}
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <p>No measurement data available. Start tracking your progress!</p>
                </div>
              )}
            </Card>
          )}
          
          {activeTab === 'photos' && (
            <Card title="Body Transformation">
              <ProgressGallery photos={progressPhotos} />
            </Card>
          )}
          
          {activeTab === 'achievements' && (
            <Card title="Your Achievements">
              <AchievementsContainer>
                {achievements.map((achievement) => (
                  <AchievementCard 
                    key={achievement.id}
                    unlocked={achievement.unlocked}
                  >
                    <AchievementIcon unlocked={achievement.unlocked}>
                      {achievement.icon}
                    </AchievementIcon>
                    <AchievementName>
                      {achievement.name}
                    </AchievementName>
                    <AchievementDescription>
                      {achievement.description}
                    </AchievementDescription>
                  </AchievementCard>
                ))}
              </AchievementsContainer>
            </Card>
          )}
        </div>
        
        {/* Right column: Input forms */}
        <div>
          {activeTab !== 'achievements' && (
            <Card title={activeTab === 'photos' ? 'Upload New Photos' : 'Log New Measurement'}>
              {activeTab === 'photos' ? (
                <PhotoUploadContainer>
                  <PhotoUploadBox htmlFor="photo-upload">
                    <UploadIcon>
                      <FaCamera />
                    </UploadIcon>
                    <div>Click or drop photos to upload</div>
                    <div style={{ fontSize: '0.85rem', color: 'grey' }}>
                      Take photos in consistent lighting and poses for best results
                    </div>
                    <UploadInput
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      multiple
                      ref={fileInputRef}
                      onChange={handlePhotoUpload}
                    />
                  </PhotoUploadBox>
                  
                  <TextHelpBlock>
                    We recommend taking progress photos from the front, side, and back.
                    Your photos are stored locally and never shared.
                  </TextHelpBlock>
                </PhotoUploadContainer>
              ) : (
                <MeasurementForm onSubmit={handleSubmit}>
                  <MeasurementField>
                    <Input
                      label="Date"
                      name="date"
                      type="date"
                      value={newMeasurement.date}
                      onChange={handleInputChange}
                      required
                    />
                  </MeasurementField>
                  
                  <FormRow>
                    <MeasurementField>
                      <Input
                        label="Weight (kg)"
                        name="weight"
                        type="number"
                        step="0.1"
                        min="0"
                        value={newMeasurement.weight}
                        onChange={handleInputChange}
                        placeholder="0.0"
                      />
                    </MeasurementField>
                    
                    <MeasurementField>
                      <Input
                        label="Body Fat %"
                        name="bodyFat"
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        value={newMeasurement.bodyFat}
                        onChange={handleInputChange}
                        placeholder="0.0"
                      />
                    </MeasurementField>
                  </FormRow>
                  
                  <h3>Circumference Measurements (cm)</h3>
                  
                  <FormRow>
                    <MeasurementField>
                      <Input
                        label="Chest"
                        name="chest"
                        type="number"
                        step="0.1"
                        min="0"
                        value={newMeasurement.chest}
                        onChange={handleInputChange}
                        placeholder="0.0"
                      />
                    </MeasurementField>
                    
                    <MeasurementField>
                      <Input
                        label="Waist"
                        name="waist"
                        type="number"
                        step="0.1"
                        min="0"
                        value={newMeasurement.waist}
                        onChange={handleInputChange}
                        placeholder="0.0"
                      />
                    </MeasurementField>
                  </FormRow>
                  
                  <FormRow>
                    <MeasurementField>
                      <Input
                        label="Hips"
                        name="hips"
                        type="number"
                        step="0.1"
                        min="0"
                        value={newMeasurement.hips}
                        onChange={handleInputChange}
                        placeholder="0.0"
                      />
                    </MeasurementField>
                    
                    <MeasurementField>
                      <Input
                        label="Arms (flexed)"
                        name="arms"
                        type="number"
                        step="0.1"
                        min="0"
                        value={newMeasurement.arms}
                        onChange={handleInputChange}
                        placeholder="0.0"
                      />
                    </MeasurementField>
                  </FormRow>
                  
                  <MeasurementField>
                    <Input
                      label="Thighs"
                      name="thighs"
                      type="number"
                      step="0.1"
                      min="0"
                      value={newMeasurement.thighs}
                      onChange={handleInputChange}
                      placeholder="0.0"
                    />
                  </MeasurementField>
                  
                  <Button type="submit" variant="primary" fullWidth>
                    Save Measurement
                  </Button>
                </MeasurementForm>
              )}
            </Card>
          )}
        </div>
      </ProgressContainer>
      
      {/* Photo modal */}
      <ModalOverlay isOpen={photoModalOpen} onClick={() => setPhotoModalOpen(false)}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <ModalHeader>
            <ModalTitle>
              Progress Photo - {selectedPhoto && format(new Date(selectedPhoto.date), 'MMMM d, yyyy')}
            </ModalTitle>
            <ModalClose onClick={() => setPhotoModalOpen(false)}>&times;</ModalClose>
          </ModalHeader>
          {selectedPhoto && <ModalImage src={selectedPhoto.src} alt="Progress" />}
        </ModalContent>
      </ModalOverlay>
    </>
  );
};

export default ProgressTrackingPage;
