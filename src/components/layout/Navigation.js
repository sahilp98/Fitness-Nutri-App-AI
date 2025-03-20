import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FaHome, 
  FaChartLine, 
  FaDumbbell, 
  FaUtensils, 
  FaBookMedical,
  FaUser,
  FaCog,
  FaBookOpen,
  FaRunning,
  FaClipboardList
} from 'react-icons/fa';

const NavContainer = styled.nav`
  padding: 1rem 0;
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const NavItem = styled.li``;

const NavLinkStyled = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: 0.75rem 1.25rem;
  border-radius: ${props => props.theme.radii.md};
  color: ${props => props.theme.colors.text};
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  
  svg {
    margin-right: 1rem;
    font-size: 1.25rem;
  }
  
  &:hover {
    background: rgba(77, 124, 255, 0.1);
    color: ${props => props.theme.colors.primary};
  }
  
  &.active {
    background: ${props => props.theme.colors.primary};
    color: white;
    box-shadow: ${props => props.theme.shadows.neuFloating};
    
    &:hover {
      background: ${props => props.theme.colors.primaryDark};
    }
  }
`;

const NavSection = styled.div`
  margin-bottom: 1.5rem;
  
  &:not(:first-child) {
    border-top: 1px solid rgba(45, 55, 72, 0.1);
    padding-top: 1.5rem;
  }
`;

const NavHeader = styled.h3`
  font-size: ${props => props.theme.fontSizes.sm};
  color: rgba(45, 55, 72, 0.6);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0 1.25rem 0.75rem;
`;

const Navigation = () => {
  return (
    <NavContainer>
      <NavList>
        <NavItem>
          <NavLinkStyled to="/dashboard" end>
            <FaHome />
            Dashboard
          </NavLinkStyled>
        </NavItem>
        
        <NavSection>
          <NavHeader>Planning</NavHeader>
          <NavItem>
            <NavLinkStyled to="/workout-planner">
              <FaDumbbell />
              Workouts
            </NavLinkStyled>
          </NavItem>
          <NavItem>
            <NavLinkStyled to="/nutrition-planner">
              <FaUtensils />
              Nutrition
            </NavLinkStyled>
          </NavItem>
          <NavItem>
            <NavLinkStyled to="/recipes">
              <FaBookOpen />
              Recipe Browser
            </NavLinkStyled>
          </NavItem>
          <NavItem>
            <NavLinkStyled to="/exercise-library">
              <FaRunning />
              Exercise Library
            </NavLinkStyled>
          </NavItem>
        </NavSection>
        
        <NavSection>
          <NavHeader>Tracking</NavHeader>
          <NavItem>
            <NavLinkStyled to="/progress">
              <FaChartLine />
              Progress
            </NavLinkStyled>
          </NavItem>
          <NavItem>
            <NavLinkStyled to="/health-data">
              <FaBookMedical />
              Health Data
            </NavLinkStyled>
          </NavItem>
        </NavSection>
        
        <NavSection>
          <NavHeader>Account</NavHeader>
          <NavItem>
            <NavLinkStyled to="/profile">
              <FaUser />
              Profile
            </NavLinkStyled>
          </NavItem>
          <NavItem>
            <NavLinkStyled to="/settings">
              <FaCog />
              Settings
            </NavLinkStyled>
          </NavItem>
        </NavSection>
      </NavList>
    </NavContainer>
  );
};

export default Navigation;
