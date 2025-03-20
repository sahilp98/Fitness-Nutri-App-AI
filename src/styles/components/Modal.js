import styled from 'styled-components';
import { neuBox } from '../mixins/neumorphism';

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${props => props.theme.space.md};
`;

export const ModalContainer = styled.div`
  ${neuBox}
  width: 100%;
  max-width: ${props => props.maxWidth || '500px'};
  max-height: 90vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding: 0;
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.space.md} ${props => props.theme.space.lg};
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`;

export const ModalTitle = styled.h3`
  margin: 0;
  font-weight: 600;
`;

export const ModalBody = styled.div`
  padding: ${props => props.theme.space.lg};
  flex: 1;
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${props => props.theme.space.md};
  padding: ${props => props.theme.space.md} ${props => props.theme.space.lg};
  border-top: 1px solid rgba(0, 0, 0, 0.1);
`;
