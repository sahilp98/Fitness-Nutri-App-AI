import React, { forwardRef, useState } from 'react';
import styled from 'styled-components';
import { FaChevronDown, FaInfoCircle } from 'react-icons/fa';
import Tooltip from './Tooltip';

const SelectContainer = styled.div`
  margin-bottom: 1rem;
`;

const SelectLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  display: flex;
  align-items: center;
`;

const LabelText = styled.span`
  margin-right: ${props => props.hasTooltip ? '0.5rem' : '0'};
`;

const SelectWrapper = styled.div`
  position: relative;
`;

const StyledSelect = styled.select`
  appearance: none;
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 1rem;
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
  cursor: pointer;
  
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

const SelectIcon = styled.div`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: rgba(45, 55, 72, 0.6);
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

const Select = forwardRef(({
  id,
  label,
  name,
  value,
  options = [],
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
  const selectId = id || `select-${name}`;
  
  return (
    <SelectContainer>
      {label && (
        <SelectLabel htmlFor={selectId}>
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
        </SelectLabel>
      )}
      
      <SelectWrapper>
        <StyledSelect
          id={selectId}
          ref={ref}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          error={!!error}
          aria-invalid={!!error}
          aria-required={required}
          aria-describedby={
            `${error ? `${selectId}-error` : ''} ${helpText ? `${selectId}-help` : ''}`
              .trim() || undefined
          }
          {...rest}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </StyledSelect>
        
        <SelectIcon>
          <FaChevronDown />
        </SelectIcon>
      </SelectWrapper>
      
      {error && (
        <ErrorMessage id={`${selectId}-error`} role="alert">
          {error}
        </ErrorMessage>
      )}
      
      {helpText && !error && (
        <HelpText id={`${selectId}-help`}>
          {helpText}
        </HelpText>
      )}
    </SelectContainer>
  );
});

Select.displayName = 'Select';

export default Select;
