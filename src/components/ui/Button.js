import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const ButtonContainer = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${props => {
    switch (props.size) {
      case 'small': return '0.5rem 1rem';
      case 'large': return '1rem 2rem';
      default: return '0.75rem 1.5rem';
    }
  }};
  border: none;
  border-radius: ${props => props.theme.radii.md};
  font-family: inherit;
  font-weight: 600;
  font-size: ${props => {
    switch (props.size) {
      case 'small': return props.theme.fontSizes.sm;
      case 'large': return props.theme.fontSizes.lg;
      default: return props.theme.fontSizes.md;
    }
  }};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  margin: ${props => props.margin || '0'};
  
  ${props => {
    switch (props.variant) {
      case 'secondary':
        return `
          background: ${props.theme.colors.background};
          color: ${props.theme.colors.primary};
          box-shadow: ${props.theme.shadows.neuFlat};
          
          &:hover:not(:disabled) {
            box-shadow: ${props.theme.shadows.neuFloating};
            transform: translateY(-2px);
          }
          
          &:active:not(:disabled) {
            box-shadow: ${props.theme.shadows.neuPressed};
            transform: translateY(0);
          }
        `;
      case 'success':
        return `
          background: ${props.theme.colors.success};
          color: white;
          
          &:hover:not(:disabled) {
            background: ${props.theme.colors.successDark};
            transform: translateY(-2px);
          }
          
          &:active:not(:disabled) {
            transform: translateY(0);
          }
        `;
      case 'error':
        return `
          background: ${props.theme.colors.error};
          color: white;
          
          &:hover:not(:disabled) {
            background: ${props.theme.colors.errorDark};
            transform: translateY(-2px);
          }
          
          &:active:not(:disabled) {
            transform: translateY(0);
          }
        `;
      case 'warning':
        return `
          background: ${props.theme.colors.warning};
          color: white;
          
          &:hover:not(:disabled) {
            background: ${props.theme.colors.warningDark};
            transform: translateY(-2px);
          }
          
          &:active:not(:disabled) {
            transform: translateY(0);
          }
        `;
      case 'primary':
      default:
        return `
          background: ${props.theme.colors.primary};
          color: white;
          
          &:hover:not(:disabled) {
            background: ${props.theme.colors.primaryDark};
            transform: translateY(-2px);
          }
          
          &:active:not(:disabled) {
            transform: translateY(0);
          }
        `;
    }
  }}
  
  &:disabled {
    opacity: 0.6;
    box-shadow: ${props => {
      return props.variant === 'secondary' ? props.theme.shadows.neuFlat : 'none';
    }};
  }
  
  &:focus {
    outline: none;
    box-shadow: ${props => {
      return props.variant === 'secondary' 
        ? `${props.theme.shadows.neuFloating}, 0 0 0 3px rgba(77, 124, 255, 0.3)`
        : `0 0 0 3px rgba(77, 124, 255, 0.3)`;
    }};
  }
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: ${spin} 1s linear infinite;
  margin-right: ${props => props.hasChildren ? '0.5rem' : '0'};
`;

const ButtonContent = styled.div`
  opacity: ${props => props.isLoading ? 0.5 : 1};
`;

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  isLoading = false,
  margin,
  onClick,
  ...rest
}) => {
  return (
    <ButtonContainer
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled || isLoading}
      margin={margin}
      onClick={isLoading ? null : onClick}
      aria-busy={isLoading}
      {...rest}
    >
      {isLoading && <LoadingSpinner hasChildren={!!children} />}
      {children && <ButtonContent isLoading={isLoading}>{children}</ButtonContent>}
    </ButtonContainer>
  );
};

export default Button;
