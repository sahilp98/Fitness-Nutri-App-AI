import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: ${props => props.theme.colors.background};
  box-shadow: ${props => props.theme.shadows.neuFlat};
  z-index: 10;
`;

const Logo = styled(Link)`
  font-size: ${props => props.theme.fontSizes['2xl']};
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  display: flex;
  align-items: center;
  
  span {
    color: ${props => props.theme.colors.text};
  }
`;

const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.theme.colors.background};
  box-shadow: ${props => props.theme.shadows.neuFlat};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
`;

const UserName = styled(Link)`
  font-weight: 500;
  text-decoration: none;
  color: ${props => props.theme.colors.text};
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const Header = () => {
  const { user } = useUser();
  
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
    <HeaderContainer>
      <Logo to="/">
        Fit<span>&Nourish</span>
      </Logo>
      <UserMenu>
        <UserName to="/profile">{user?.personalInfo?.name || 'Your Profile'}</UserName>
        <Avatar>
          {user?.personalInfo?.name 
            ? getInitials(user.personalInfo.name) 
            : 'FE'}
        </Avatar>
      </UserMenu>
    </HeaderContainer>
  );
};

export default Header;
