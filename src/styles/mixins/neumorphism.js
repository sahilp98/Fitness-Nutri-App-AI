import { css } from 'styled-components';

export const neuBox = css`
  background: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.radii.lg};
  box-shadow: ${props => props.theme.shadows.neuFlat};
  transition: all 0.3s ease;
`;

export const neuInset = css`
  background: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.radii.lg};
  box-shadow: ${props => props.theme.shadows.neuPressed};
`;

export const neuButton = css`
  ${neuBox};
  padding: 10px 20px;
  color: ${props => props.theme.colors.text};
  font-weight: 600;
  border: none;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  
  &:active {
    box-shadow: ${props => props.theme.shadows.neuPressed};
    transform: scale(0.98);
  }
  
  &:hover {
    background: ${props => `linear-gradient(145deg, #f0f5fc, #cacfd5)`};
  }
  
  &:focus {
    outline: none;
    box-shadow: ${props => props.theme.shadows.neuFlat}, 0 0 0 3px rgba(77, 124, 255, 0.3);
  }
`;

export const neuCard = css`
  ${neuBox};
  padding: ${props => props.theme.space.xl};
  margin: ${props => props.theme.space.lg} 0;
`;

export const neuInput = css`
  ${neuInset};
  padding: 12px 15px;
  border: none;
  color: ${props => props.theme.colors.text};
  width: 100%;
  
  &:focus {
    outline: none;
    box-shadow: ${props => props.theme.shadows.neuPressed}, 0 0 0 3px rgba(77, 124, 255, 0.3);
  }
`;

export const neuSelect = css`
  ${neuInput};
  appearance: none;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%232d3748" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>');
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1em;
`;

export const neuToggle = (isActive) => css`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
  
  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${isActive ? props => props.theme.colors.primary : props => props.theme.colors.background};
    box-shadow: ${isActive ? 'none' : props => props.theme.shadows.neuInset};
    transition: 0.4s;
    border-radius: 34px;
    
    &:before {
      position: absolute;
      content: "";
      height: 26px;
      width: 26px;
      left: ${isActive ? '30px' : '4px'};
      bottom: 4px;
      background-color: white;
      border-radius: 50%;
      box-shadow: ${props => props.theme.shadows.neuFlat};
      transition: 0.4s;
    }
  }
`;
