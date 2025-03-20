import styled from 'styled-components';
import { neuBox } from '../mixins/neumorphism';

export const Container = styled.div`
  width: 100%;
  max-width: ${props => props.maxWidth || '1200px'};
  margin: 0 auto;
  padding: 0 ${props => props.theme.space.md};
`;

export const PageContainer = styled.div`
  padding: ${props => props.theme.space.xl};
  min-height: calc(100vh - 60px); /* Adjust based on header height */
`;

export const Section = styled.section`
  margin-bottom: ${props => props.theme.space.xl};
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(${props => props.columns || 12}, 1fr);
  gap: ${props => props.gap || props.theme.space.md};
`;

export const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 0 -${props => props.theme.space.sm};
`;

export const Column = styled.div`
  flex: ${props => props.size || 1};
  padding: 0 ${props => props.theme.space.sm};
`;

export const Panel = styled.div`
  ${neuBox}
  padding: ${props => props.theme.space.lg};
  margin-bottom: ${props => props.theme.space.md};
`;

export const Divider = styled.hr`
  border: 0;
  height: 1px;
  background: rgba(0, 0, 0, 0.1);
  margin: ${props => props.theme.space.md} 0;
`;
