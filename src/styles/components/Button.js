import styled, { css } from 'styled-components';
import { neuButton } from '../mixins/neumorphism';

const buttonVariants = {
  primary: css`
    background: ${props => props.theme.colors.primary};
    color: white;
    
    &:hover {
      background: ${props => props.theme.colors.primary};
      opacity: 0.9;
    }
  `,
  secondary: css`
    background: transparent;
    border: 2px solid ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primary};
  `,
  danger: css`
    background: #e53e3e;
    color: white;
    
    &:hover {
      background: #c53030;
    }
  `
};

const buttonSizes = {
  sm: css`
    padding: 8px 16px;
    font-size: 0.875rem;
  `,
  md: css`
    padding: 10px 20px;
    font-size: 1rem;
  `,
  lg: css`
    padding: 12px 24px;
    font-size: 1.125rem;
  `
};

const Button = styled.button`
  ${neuButton}
  ${props => props.variant && buttonVariants[props.variant]}
  ${props => props.size && buttonSizes[props.size || 'md']}
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    &:hover {
      background: ${props => props.theme.colors.background};
    }
  }
`;

export default Button;
