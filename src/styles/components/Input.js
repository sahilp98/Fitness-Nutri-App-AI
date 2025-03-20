import styled from 'styled-components';
import { neuInput, neuSelect } from '../mixins/neumorphism';

export const Input = styled.input`
  ${neuInput}
`;

export const TextArea = styled.textarea`
  ${neuInput}
  min-height: 100px;
  resize: ${props => props.resize || 'vertical'};
`;

export const Select = styled.select`
  ${neuSelect}
`;

export const FormGroup = styled.div`
  margin-bottom: ${props => props.theme.space.md};
  width: 100%;
`;

export const FormLabel = styled.label`
  display: block;
  margin-bottom: ${props => props.theme.space.xs};
  font-weight: 600;
`;

export const FormHelperText = styled.div`
  font-size: 0.875rem;
  color: ${props => props.error ? 'red' : 'gray'};
  margin-top: ${props => props.theme.space.xs};
`;
