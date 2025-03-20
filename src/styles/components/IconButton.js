import styled from 'styled-components';
import { neuButton } from '../mixins/neumorphism';

const IconButton = styled.button`
  ${neuButton}
  width: ${props => props.size || '40px'};
  height: ${props => props.size || '40px'};
  border-radius: ${props => props.theme.radii.round};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  font-size: ${props => {
    switch(props.size) {
      case '30px': return '0.875rem';
      case '50px': return '1.5rem';
      default: return '1.25rem';
    }
  }};
  
  svg {
    width: 60%;
    height: 60%;
  }
`;

export default IconButton;
