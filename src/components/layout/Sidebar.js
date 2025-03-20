import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { 
  FaHome, 
  FaDumbbell, 
  FaUtensils, 
  FaChartLine, 
  FaUser, 
  FaCog 
} from 'react-icons/fa';

const SidebarContainer = styled.nav`
  height: 100%;
  background: ${props => props.theme.colors.background};
  box-shadow: ${props => props.theme.shadows.neuFlat};
  padding: 2rem 0;
  display: flex;
  flex-direction: column;
`;

const Logo = styled.div`
  font-size: ${props => props.theme.fontSizes['2xl']};
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  text-align: center;
  margin-bottom: 2rem;
  
  span {
    color: ${props => props.theme.colors.text};
  }
`;

const NavItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0 1rem;
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: ${props => props.theme.radii.md};
  text-decoration: none;
  color: ${props => props.theme.colors.text};
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
  
  &.active {
    background: ${props => props.theme.colors.primary};
    color: white;
    box-shadow: ${props => props.theme.shadows.neuFlat};
  }
  
  svg {
    margin-right: 1rem;
  }
`;

const Divider = styled.div`
  height: 1px;
  background: rgba(0, 0, 0, 0.1);
  margin: 1rem;
`;

const Sidebar = () => {
  return (
    <SidebarContainer>
      <Logo>
        Fit<span>&Nourish</span>
      </Logo>
      
      <NavItems>
        <NavItem to="/dashboard">
          <FaHome size={18} /> Dashboard
        </NavItem>
        <NavItem to="/workout-planner">
          <FaDumbbell size={18} /> Workout Planner
        </NavItem>
        <NavItem to="/nutrition-planner">
          <FaUtensils size={18} /> Nutrition Planner
        </NavItem>
        <NavItem to="/progress">
          <FaChartLine size={18} /> Progress
        </NavItem>
        
        <Divider />
        
        <NavItem to="/profile">
          <FaUser size={18} /> Profile
        </NavItem>
        <NavItem to="/settings">
          <FaCog size={18} /> Settings
        </NavItem>
      </NavItems>
    </SidebarContainer>
  );
};

export default Sidebar;
