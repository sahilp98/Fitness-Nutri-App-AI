import styled from 'styled-components';
import { neuCard } from '../mixins/neumorphism';

const Card = styled.div`
  ${neuCard}
  display: flex;
  flex-direction: column;
  width: ${props => props.width || '100%'};
`;

export const CardHeader = styled.div`
  padding-bottom: ${props => props.theme.space.md};
  margin-bottom: ${props => props.theme.space.md};
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  font-weight: bold;
  font-size: 1.25rem;
`;

export const CardBody = styled.div`
  flex: 1;
`;

export const CardFooter = styled.div`
  padding-top: ${props => props.theme.space.md};
  margin-top: ${props => props.theme.space.md};
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: flex-end;
  gap: ${props => props.theme.space.md};
`;

export default Card;
