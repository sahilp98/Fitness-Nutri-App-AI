import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { neuBox } from '../../styles/neumorphism';

const FooterContainer = styled.footer`
  ${neuBox}
  padding: ${props => props.theme.space.lg};
  margin-top: auto;
  text-align: center;
`;

const FooterContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${props => props.theme.space.md};
  
  @media (min-width: ${props => props.theme.breakpoints.md}) {
    flex-direction: row;
    justify-content: space-between;
  }
`;

const Copyright = styled.p`
  margin: 0;
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.text};
`;

const FooterLinks = styled.div`
  display: flex;
  gap: ${props => props.theme.space.md};
`;

const FooterLink = styled(Link)`
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.fontSizes.sm};
  text-decoration: none;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
    text-decoration: underline;
  }
`;

const DisclaimerText = styled.p`
  margin: ${props => props.theme.space.md} 0 0;
  font-size: ${props => props.theme.fontSizes.xs};
  color: rgba(45, 55, 72, 0.7);
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <Copyright>© {new Date().getFullYear()} Fit&Nourish. All rights reserved.</Copyright>
        
        <FooterLinks>
          <FooterLink to="/terms">Terms</FooterLink>
          <FooterLink to="/privacy">Privacy</FooterLink>
          <FooterLink to="/contact">Contact</FooterLink>
        </FooterLinks>
      </FooterContent>
      
      <DisclaimerText>
        Disclaimer: This application provides general fitness and nutrition recommendations 
        and is not a substitute for professional medical or nutritional advice. 
        Consult with healthcare professionals before starting any new fitness or nutrition program.
      </DisclaimerText>
    </FooterContainer>
  );
};

export default Footer;
