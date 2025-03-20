import React, { useState } from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import { FaArrowLeft, FaArrowRight, FaCalendarAlt } from 'react-icons/fa';

const GalleryContainer = styled.div`
  margin: 2rem 0;
`;

const GalleryTitle = styled.h3`
  margin-bottom: 1rem;
`;

const GalleryControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const GalleryDisplay = styled.div`
  display: flex;
  width: 100%;
  border-radius: ${props => props.theme.radii.lg};
  background: ${props => props.theme.colors.background};
  box-shadow: ${props => props.theme.shadows.neuInset};
  overflow: hidden;
  position: relative;
  height: 400px;
`;

const GalleryImage = styled.div`
  flex: 1;
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const ImageDate = styled.div`
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  padding: 0.5rem 1rem;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border-radius: ${props => props.theme.radii.md};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: ${props => props.theme.fontSizes.sm};
`;

const NavigationButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.theme.colors.background};
  box-shadow: ${props => props.disabled ? 'none' : props.theme.shadows.neuFlat};
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.5 : 1};
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    transform: scale(1.1);
    box-shadow: ${props => props.theme.shadows.neuFloating};
  }
`;

const EmptyState = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.muted};
`;

const Thumbnails = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 1rem;
  padding: 1rem 0;
`;

const Thumbnail = styled.div`
  width: 60px;
  height: 60px;
  border-radius: ${props => props.theme.radii.md};
  overflow: hidden;
  cursor: pointer;
  border: 3px solid ${props => props.active ? props.theme.colors.primary : 'transparent'};
  transition: all 0.2s ease;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  &:hover {
    transform: scale(1.1);
  }
`;

const ComparisonMode = styled.button`
  background: ${props => props.active ? props.theme.colors.primary : props.theme.colors.background};
  color: ${props => props.active ? 'white' : props.theme.colors.text};
  border: none;
  padding: 0.5rem 1rem;
  border-radius: ${props => props.theme.radii.md};
  box-shadow: ${props => props.theme.shadows.neuFlat};
  cursor: pointer;
  font-size: ${props => props.theme.fontSizes.sm};
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const BeforeAfterContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  height: 100%;
`;

const BeforeAfterPanel = styled.div`
  position: relative;
  height: 100%;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const BeforeAfterLabel = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  padding: 0.25rem 1rem;
  background: ${props => props.type === 'before' ? props.theme.colors.error : props.theme.colors.success};
  color: white;
  border-radius: ${props => props.theme.radii.md};
  font-weight: 600;
  font-size: ${props => props.theme.fontSizes.sm};
`;

const ProgressGallery = ({ photos }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [comparisonMode, setComparisonMode] = useState(false);
  
  if (!photos || photos.length === 0) {
    return (
      <GalleryContainer>
        <GalleryTitle>Progress Photos</GalleryTitle>
        <GalleryDisplay>
          <EmptyState>
            <div>📷</div>
            <p>No progress photos available</p>
          </EmptyState>
        </GalleryDisplay>
      </GalleryContainer>
    );
  }
  
  const sortedPhotos = [...photos].sort((a, b) => new Date(a.date) - new Date(b.date));
  const currentPhoto = sortedPhotos[currentIndex];
  const hasNext = currentIndex < sortedPhotos.length - 1;
  const hasPrev = currentIndex > 0;
  const firstPhoto = sortedPhotos[0];
  const lastPhoto = sortedPhotos[sortedPhotos.length - 1];
  
  const goNext = () => {
    if (hasNext) setCurrentIndex(currentIndex + 1);
  };
  
  const goPrev = () => {
    if (hasPrev) setCurrentIndex(currentIndex - 1);
  };
  
  const selectPhoto = (index) => {
    setCurrentIndex(index);
  };
  
  return (
    <GalleryContainer>
      <GalleryControls>
        <GalleryTitle>Progress Photos</GalleryTitle>
        
        {sortedPhotos.length >= 2 && (
          <ComparisonMode 
            active={comparisonMode}
            onClick={() => setComparisonMode(!comparisonMode)}
          >
            {comparisonMode ? 'Single View' : 'Before & After'}
          </ComparisonMode>
        )}
      </GalleryControls>
      
      <GalleryDisplay>
        {comparisonMode ? (
          <BeforeAfterContainer>
            <BeforeAfterPanel>
              <img src={firstPhoto.src} alt="Before" />
              <ImageDate>
                <FaCalendarAlt />
                {format(new Date(firstPhoto.date), 'MMM d, yyyy')}
              </ImageDate>
              <BeforeAfterLabel type="before">Before</BeforeAfterLabel>
            </BeforeAfterPanel>
            
            <BeforeAfterPanel>
              <img src={lastPhoto.src} alt="After" />
              <ImageDate>
                <FaCalendarAlt />
                {format(new Date(lastPhoto.date), 'MMM d, yyyy')}
              </ImageDate>
              <BeforeAfterLabel type="after">After</BeforeAfterLabel>
            </BeforeAfterPanel>
          </BeforeAfterContainer>
        ) : (
          <>
            <NavigationButton 
              onClick={goPrev} 
              disabled={!hasPrev}
              style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', zIndex: 1 }}
            >
              <FaArrowLeft />
            </NavigationButton>
            
            <GalleryImage>
              <img src={currentPhoto.src} alt={`Progress on ${currentPhoto.date}`} />
              <ImageDate>
                <FaCalendarAlt />
                {format(new Date(currentPhoto.date), 'MMM d, yyyy')}
              </ImageDate>
            </GalleryImage>
            
            <NavigationButton 
              onClick={goNext} 
              disabled={!hasNext}
              style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', zIndex: 1 }}
            >
              <FaArrowRight />
            </NavigationButton>
          </>
        )}
      </GalleryDisplay>
      
      <Thumbnails>
        {sortedPhotos.map((photo, index) => (
          <Thumbnail
            key={photo.id}
            active={index === currentIndex}
            onClick={() => selectPhoto(index)}
          >
            <img src={photo.src} alt={`Photo thumbnail ${index + 1}`} />
          </Thumbnail>
        ))}
      </Thumbnails>
    </GalleryContainer>
  );
};

export default ProgressGallery;
