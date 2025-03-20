import styled from 'styled-components';
import Card from '../components/ui/Card';

export const ProgressContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  
  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    grid-template-columns: 1fr 1fr;
  }
`;

export const TabsContainer = styled.div`
  display: flex;
  margin-bottom: 1.5rem;
  border-radius: ${props => props.theme.radii.md};
  background: ${props => props.theme.colors.background};
  box-shadow: ${props => props.theme.shadows.neuInset};
  padding: 0.25rem;
  overflow-x: auto;
`;

export const Tab = styled.button`
  flex: 1;
  padding: 0.75rem;
  border: none;
  background: ${({ active, theme }) => active ? theme.colors.background : 'transparent'};
  box-shadow: ${({ active, theme }) => active ? theme.shadows.neuFlat : 'none'};
  border-radius: ${props => props.theme.radii.md};
  font-weight: ${({ active }) => active ? '600' : '400'};
  color: ${({ active, theme }) => active ? theme.colors.primary : theme.colors.text};
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  min-width: 100px;
`;

export const MeasurementForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const PhotoUploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

export const PhotoThumbnail = styled.div`
  position: relative;
  width: 100%;
  height: 150px;
  border-radius: ${props => props.theme.radii.md};
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.neuFlat};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.03);
    box-shadow: ${props => props.theme.shadows.neuFloating};
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const PhotoDate = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0.5rem;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  font-size: ${props => props.theme.fontSizes.xs};
  text-align: center;
`;

export const PhotoUploadBox = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px dashed ${props => props.theme.colors.muted};
  border-radius: ${props => props.theme.radii.md};
  padding: 2rem;
  cursor: pointer;
  text-align: center;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
  }
`;

export const UploadIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.muted};
`;

export const UploadInput = styled.input`
  display: none;
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
`;

export const ModalContent = styled.div`
  max-width: 90%;
  max-height: 90%;
  display: flex;
  flex-direction: column;
`;

export const ModalImage = styled.img`
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
  border-radius: ${props => props.theme.radii.md};
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  color: white;
`;

export const ModalTitle = styled.h3`
  margin: 0;
`;

export const ModalClose = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
`;

export const AchievementsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
`;

export const AchievementCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1.5rem 1rem;
  border-radius: ${props => props.theme.radii.md};
  background: ${props => props.theme.colors.background};
  box-shadow: ${props => props.unlocked ? props.theme.shadows.neuFloating : props.theme.shadows.neuInset};
  opacity: ${props => props.unlocked ? 1 : 0.6};
`;

export const AchievementIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
  color: ${props => props.unlocked ? props.theme.colors.warning : props.theme.colors.muted};
`;

export const AchievementName = styled.h3`
  margin: 0 0 0.5rem;
  font-size: ${props => props.theme.fontSizes.md};
`;

export const AchievementDescription = styled.p`
  margin: 0;
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.text + '99'};
`;

export const ChartContainer = styled.div`
  height: 300px;
  width: 100%;
  margin-bottom: 2rem;
`;

export const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

export const StatItem = styled.div`
  padding: 1rem;
  text-align: center;
  border-radius: ${props => props.theme.radii.md};
  background: ${props => props.theme.colors.background};
  box-shadow: ${props => props.theme.shadows.neuFlat};
`;

export const StatValue = styled.div`
  font-size: ${props => props.theme.fontSizes.xl};
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
`;

export const StatLabel = styled.div`
  font-size: ${props => props.theme.fontSizes.xs};
  color: rgba(45, 55, 72, 0.7);
  margin-top: 0.25rem;
`;

export const CompareContainer = styled.div`
  display: flex;
  margin-top: 1.5rem;
  gap: 1rem;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    flex-direction: column;
  }
`;

export const CompareColumn = styled.div`
  flex: 1;
  padding: 1rem;
  border-radius: ${props => props.theme.radii.md};
  background: ${props => props.theme.colors.background};
  box-shadow: ${props => props.theme.shadows.neuInset};
`;

export const CompareTitle = styled.h4`
  margin-top: 0;
  margin-bottom: 1rem;
  text-align: center;
`;

export const CompareValue = styled.div`
  font-size: ${props => props.theme.fontSizes.lg};
  text-align: center;
  margin-bottom: 0.5rem;
`;

export const MeasurementField = styled.div`
  margin-bottom: 1rem;
`;

export const FormRow = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  
  & > * {
    flex: 1;
    min-width: 150px;
  }
`;

export const TextHelpBlock = styled.p`
  font-size: ${props => props.theme.fontSizes.sm};
  color: rgba(45, 55, 72, 0.7);
  margin-top: 0.5rem;
`;
