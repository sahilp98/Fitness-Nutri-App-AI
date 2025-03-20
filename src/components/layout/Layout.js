import React from 'react';
import styled from 'styled-components';
import Sidebar from './Sidebar';
import Header from './Header';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const SidebarWrapper = styled.div`
  width: 260px;
  flex-shrink: 0;
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    display: none;
  }
`;

const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
`;

const Layout = ({ children }) => {
  return (
    <LayoutContainer>
      <SidebarWrapper>
        <Sidebar />
      </SidebarWrapper>
      <ContentWrapper>
        <Header />
        <MainContent>{children}</MainContent>
      </ContentWrapper>
    </LayoutContainer>
  );
};

export default Layout;
