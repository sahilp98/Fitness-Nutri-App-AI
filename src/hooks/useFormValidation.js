import { useState, useCallback } from 'react';

/**
 * Custom hook for form validation
 * @param {Object} initialValues - Initial form values
 * @param {Function} validateFn - Validation function
 * @returns {Object} Form state, errors, validation functions
 */
const useFormValidation = (initialValues, validateFn) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input changes
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    
    setValues(prev => ({
      ...prev,
      [name]: fieldValue
    }));
    
    // If field has been touched, validate on change
    if (touched[name]) {
      const fieldErrors = validateFn({ [name]: fieldValue });
      setErrors(prev => ({
        ...prev,
        [name]: fieldErrors[name] || ''
      }));
    }
  }, [touched, validateFn]);

  // Handle field blur for validation
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    const fieldErrors = validateFn({ [name]: values[name] });
    setErrors(prev => ({
      ...prev,
      [name]: fieldErrors[name] || ''
    }));
  }, [values, validateFn]);

  // Handle form submission
  const handleSubmit = useCallback((callback) => async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const formErrors = validateFn(values);
    setErrors(formErrors);
    
    // Mark all fields as touched
    const touchedFields = Object.keys(values).reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {});
    
    setTouched(touchedFields);
    
    // If no errors, submit the form
    if (Object.keys(formErrors).length === 0) {
      setIsSubmitting(true);
      try {
        await callback(values);
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [values, validateFn]);

  // Reset form state
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  // Set form values programmatically
  const setFormValues = useCallback((newValues) => {
    setValues(prev => ({
      ...prev,
      ...newValues
    }));
  }, []);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFormValues
  };
};

export default useFormValidation;
