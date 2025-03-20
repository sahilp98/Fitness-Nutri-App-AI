import styled from 'styled-components';
import { neuBox, neuInset, neuButton } from '../mixins/neumorphism';

// Photo tracking components
export const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: ${props => props.theme.space.md};
  margin-top: ${props => props.theme.space.lg};
`;

export const PhotoThumbnail = styled.div`
  ${neuBox}
  aspect-ratio: 1;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  
  &:hover img {
    transform: scale(1.05);
  }
`;

export const PhotoDate = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: ${props => props.theme.space.xs};
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  font-size: 0.75rem;
  text-align: center;
`;

export const PhotoUploadBox = styled.div`
  ${neuBox}
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
  }
  
  &:active {
    box-shadow: ${props => props.theme.shadows.neuPressed};
    transform: translateY(0);
  }
`;

export const UploadIcon = styled.div`
  font-size: 2rem;
  margin-bottom: ${props => props.theme.space.sm};
  color: ${props => props.theme.colors.primary};
`;

export const UploadInput = styled.input`
  display: none;
`;

// Modal components
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  ${neuBox}
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow: auto;
  padding: ${props => props.theme.space.lg};
`;

export const ModalImage = styled.img`
  max-width: 100%;
  max-height: 70vh;
  display: block;
  margin: 0 auto;
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.space.md};
`;

export const ModalTitle = styled.h3`
  margin: 0;
`;

export const ModalClose = styled.button`
  ${neuButton}
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  padding: 0;
`;

// Achievement components
export const AchievementsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${props => props.theme.space.md};
  margin-top: ${props => props.theme.space.lg};
`;

export const AchievementCard = styled.div`
  ${neuBox}
  padding: ${props => props.theme.space.md};
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  opacity: ${props => props.unlocked ? 1 : 0.6};
`;

export const AchievementIcon = styled.div`
  font-size: 2rem;
  margin-bottom: ${props => props.theme.space.sm};
  color: ${props => props.theme.colors.primary};
`;

export const AchievementName = styled.h4`
  margin: 0 0 ${props => props.theme.space.xs};
`;

export const AchievementDescription = styled.p`
  font-size: 0.875rem;
  margin: 0;
`;

// Charts and stats components
export const ChartContainer = styled.div`
  ${neuBox}
  padding: ${props => props.theme.space.lg};
  margin: ${props => props.theme.space.lg} 0;
`;

export const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: ${props => props.theme.space.md};
  margin-top: ${props => props.theme.space.lg};
`;

export const StatItem = styled.div`
  ${neuBox}
  padding: ${props => props.theme.space.md};
  text-align: center;
`;

export const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: ${props => props.theme.space.xs};
  color: ${props => props.theme.colors.primary};
`;

export const StatLabel = styled.div`
  font-size: 0.875rem;
`;

// Comparison components
export const CompareContainer = styled.div`
  display: flex;
  gap: ${props => props.theme.space.md};
  margin-top: ${props => props.theme.space.lg};
`;

export const CompareColumn = styled.div`
  flex: 1;
  ${neuBox}
  padding: ${props => props.theme.space.md};
  text-align: center;
`;

export const CompareTitle = styled.h4`
  margin: 0 0 ${props => props.theme.space.md};
`;

export const CompareValue = styled.div`
  font-size: 1.25rem;
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
`;

// Form components
export const MeasurementField = styled.div`
  ${neuInset}
  padding: ${props => props.theme.space.sm};
  margin-bottom: ${props => props.theme.space.sm};
`;

export const FormRow = styled.div`
  display: flex;
  gap: ${props => props.theme.space.md};
  margin-bottom: ${props => props.theme.space.md};
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const TextHelpBlock = styled.div`
  font-size: 0.875rem;
  color: ${props => props.error ? 'red' : 'gray'};
  margin-top: ${props => props.theme.space.xs};
`;
