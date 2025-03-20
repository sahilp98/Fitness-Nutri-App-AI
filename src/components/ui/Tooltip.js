import React, { useState } from 'react';
import styled from 'styled-components';

const TooltipWrapper = styled.div`
  position: relative;
  display: inline-block;
  cursor: help;
`;

const TooltipContent = styled.div`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(-10px);
  padding: 0.75rem 1rem;
  background: ${props => props.theme.colors.background};
  box-shadow: ${props => props.theme.shadows.neuFloating};
  border-radius: ${props => props.theme.radii.md};
  width: max-content;
  max-width: 250px;
  font-size: ${props => props.theme.fontSizes.sm};
  text-align: center;
  z-index: 100;
  opacity: ${props => props.visible ? 1 : 0};
  visibility: ${props => props.visible ? 'visible' : 'hidden'};
  transition: opacity 0.3s ease, transform 0.3s ease, visibility 0.3s;
  
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 6px;
    border-style: solid;
    border-color: ${props => props.theme.colors.background} transparent transparent transparent;
  }
`;

const Tooltip = ({ content, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  const handleMouseEnter = () => setIsVisible(true);
  const handleMouseLeave = () => setIsVisible(false);
  const handleFocus = () => setIsVisible(true);
  const handleBlur = () => setIsVisible(false);
  
  return (
    <TooltipWrapper 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      tabIndex={0}
      role="tooltip"
      aria-label={content}
    >
      {children}
      <TooltipContent visible={isVisible}>
        {content}
      </TooltipContent>
    </TooltipWrapper>
  );
};

export default Tooltip;
