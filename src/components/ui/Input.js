import React, { forwardRef } from 'react';
import styled from 'styled-components';
import { FaInfoCircle } from 'react-icons/fa';
import Tooltip from './Tooltip';

const InputContainer = styled.div`
  margin-bottom: 1rem;
`;

const InputLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  display: flex;
  align-items: center;
`;

const LabelText = styled.span`
  margin-right: ${props => props.hasTooltip ? '0.5rem' : '0'};
`;

const InputField = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  background: ${props => props.theme.colors.background};
  box-shadow: ${props => 
    props.error 
      ? `inset 0 0 0 2px ${props.theme.colors.error}` 
      : props.theme.shadows.neuInset
  };
  border-radius: ${props => props.theme.radii.md};
  font-family: inherit;
  font-size: 1rem;
  transition: box-shadow 0.3s ease;
  
  &:focus {
    outline: none;
    box-shadow: ${props => 
      props.error
        ? `inset 0 0 0 2px ${props.theme.colors.error}, 0 0 0 3px rgba(245, 101, 101, 0.2)`
        : `inset 0 0 0 2px ${props.theme.colors.primary}, 0 0 0 3px rgba(77, 124, 255, 0.2)`
    };
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.error};
  font-size: ${props => props.theme.fontSizes.sm};
  margin-top: 0.25rem;
`;

const HelpText = styled.div`
  color: rgba(45, 55, 72, 0.7);
  font-size: ${props => props.theme.fontSizes.sm};
  margin-top: 0.25rem;
`;

const Input = forwardRef(({
  id,
  label,
  name,
  type = 'text',
  value,
  placeholder,
  onChange,
  onBlur,
  error,
  helpText,
  tooltip,
  disabled = false,
  required = false,
  ...rest
}, ref) => {
  // Generate a unique ID if none is provided
  const inputId = id || `input-${name}`;
  
  return (
    <InputContainer>
      {label && (
        <InputLabel htmlFor={inputId}>
          <LabelText hasTooltip={!!tooltip}>
            {label}
            {required && <span aria-hidden="true"> *</span>}
          </LabelText>
          
          {tooltip && (
            <Tooltip content={tooltip}>
              <span aria-hidden="true">
                <FaInfoCircle size={16} color="rgba(45, 55, 72, 0.6)" />
              </span>
            </Tooltip>
          )}
        </InputLabel>
      )}
      
      <InputField
        id={inputId}
        ref={ref}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        error={!!error}
        aria-invalid={!!error}
        aria-required={required}
        aria-describedby={
          `${error ? `${inputId}-error` : ''} ${helpText ? `${inputId}-help` : ''}`
            .trim() || undefined
        }
        {...rest}
      />
      
      {error && (
        <ErrorMessage id={`${inputId}-error`} role="alert">
          {error}
        </ErrorMessage>
      )}
      
      {helpText && !error && (
        <HelpText id={`${inputId}-help`}>
          {helpText}
        </HelpText>
      )}
    </InputContainer>
  );
});

Input.displayName = 'Input';

export default Input;
