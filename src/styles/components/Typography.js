import styled from 'styled-components';

export const Heading = styled.h1`
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: ${props => props.theme.space.md};
  color: ${props => props.theme.colors.text};
  font-size: ${props => {
    switch (props.as) {
      case 'h1': return '2.5rem';
      case 'h2': return '2rem';
      case 'h3': return '1.75rem';
      case 'h4': return '1.5rem';
      case 'h5': return '1.25rem';
      case 'h6': return '1rem';
      default: return '2.5rem';
    }
  }};
`;

export const Text = styled.p`
  margin-bottom: ${props => props.theme.space.md};
  line-height: 1.6;
  font-size: ${props => props.size || '1rem'};
  font-weight: ${props => props.weight || 'normal'};
  color: ${props => props.color || props.theme.colors.text};
  text-align: ${props => props.align || 'left'};
`;

export const Badge = styled.span`
  display: inline-block;
  padding: 0.25em 0.4em;
  font-size: 75%;
  font-weight: 700;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: ${props => props.theme.radii.sm};
  color: #fff;
  background-color: ${props => props.theme.colors.primary};
`;
