import React from 'react';
import styled from 'styled-components';

const CardContainer = styled.div`
  background: ${props => props.theme.colors.background};
  box-shadow: ${props => props.theme.shadows.neuFlat};
  border-radius: ${props => props.theme.radii.lg};
  padding: 1.5rem;
  transition: all 0.3s ease;
  margin: ${props => props.margin || '0'};
  
  &:hover {
    box-shadow: ${props => props.hoverable ? props.theme.shadows.neuFloating : props.theme.shadows.neuFlat};
  }
`;

const CardHeader = styled.div`
  margin-bottom: 1.5rem;
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: ${props => props.theme.fontSizes.xl};
  color: ${props => props.theme.colors.text};
`;

const CardBody = styled.div``;

const CardFooter = styled.div`
  margin-top: 1.5rem;
  display: flex;
  justify-content: ${props => props.align || 'flex-end'};
  gap: 1rem;
`;

const CardDivider = styled.hr`
  border: 0;
  height: 1px;
  background: rgba(45, 55, 72, 0.1);
  margin: 1.5rem 0;
`;

const Card = ({
  title,
  children,
  footer,
  footerAlign,
  hoverable = false,
  margin,
  className,
  ...rest
}) => {
  return (
    <CardContainer 
      className={className}
      hoverable={hoverable} 
      margin={margin}
      role="region"
      aria-labelledby={title ? `card-title-${title.replace(/\s+/g, '-').toLowerCase()}` : undefined}
      {...rest}
    >
      {title && (
        <CardHeader>
          <CardTitle id={`card-title-${title.replace(/\s+/g, '-').toLowerCase()}`}>
            {title}
          </CardTitle>
          <CardDivider />
        </CardHeader>
      )}
      
      <CardBody>
        {children}
      </CardBody>
      
      {footer && (
        <>
          <CardDivider />
          <CardFooter align={footerAlign}>
            {footer}
          </CardFooter>
        </>
      )}
    </CardContainer>
  );
};

export default Card;
