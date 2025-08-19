/**
 * Analytics-enabled Form Component
 * Automatically tracks form interactions, submissions, and conversions
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAnalytics, useInteractionTracking } from '../hooks/useAnalytics';

export interface AnalyticsFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  formName: string;
  trackFieldInteractions?: boolean;
  trackValidationErrors?: boolean;
  conversionValue?: number;
  onSubmitSuccess?: (data: FormData) => void;
  onSubmitError?: (error: Error) => void;
  children: React.ReactNode;
}

export interface AnalyticsInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fieldName: string;
}

export interface AnalyticsTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  fieldName: string;
}

export function AnalyticsForm({
  formName,
  trackFieldInteractions = true,
  trackValidationErrors = true,
  conversionValue,
  onSubmitSuccess,
  onSubmitError,
  onSubmit,
  children,
  className = '',
  ...props
}: AnalyticsFormProps) {
  const { trackFormSubmission, trackEvent } = useAnalytics({ 
    trackPageView: false, 
    trackScrollDepth: false 
  });
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStartTime] = useState(Date.now());

  // Track form view
  useEffect(() => {
    trackEvent({
      action: 'form_view',
      category: 'form_interaction',
      label: formName,
      customParameters: {
        form_name: formName,
        timestamp: Date.now(),
      },
    });
  }, [formName, trackEvent]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const formDuration = Date.now() - formStartTime;

    try {
      // Track form submission attempt
      trackEvent({
        action: 'form_submit_attempt',
        category: 'form_interaction',
        label: formName,
        customParameters: {
          form_name: formName,
          form_duration: formDuration,
          field_count: formData.entries().length,
        },
      });

      // Call original onSubmit handler if provided
      if (onSubmit) {
        await onSubmit(event);
      }

      // Track successful submission
      trackFormSubmission(formName, true, {
        form_duration: formDuration,
        field_count: Array.from(formData.entries()).length,
        conversion_value: conversionValue,
      });

      // Call success callback
      if (onSubmitSuccess) {
        onSubmitSuccess(formData);
      }

    } catch (error) {
      // Track failed submission
      trackFormSubmission(formName, false, {
        form_duration: formDuration,
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });

      // Track validation errors if enabled
      if (trackValidationErrors) {
        trackEvent({
          action: 'form_validation_error',
          category: 'form_interaction',
          label: formName,
          customParameters: {
            form_name: formName,
            error_message: error instanceof Error ? error.message : 'Unknown error',
          },
        });
      }

      // Call error callback
      if (onSubmitError) {
        onSubmitError(error instanceof Error ? error : new Error('Unknown error'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form
      ref={formRef}
      className={`space-y-6 ${className}`}
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      {...props}
    >
      <FormProvider 
        formName={formName} 
        trackFieldInteractions={trackFieldInteractions}
        trackValidationErrors={trackValidationErrors}
      >
        {children}
      </FormProvider>
      
      {isSubmitting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center py-4"
        >
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
          <span className="ml-2 text-gray-600">Submitting...</span>
        </motion.div>
      )}
    </motion.form>
  );
}

// Form context for field tracking
const FormContext = React.createContext<{
  formName: string;
  trackFieldInteractions: boolean;
  trackValidationErrors: boolean;
} | null>(null);

function FormProvider({ 
  children, 
  formName, 
  trackFieldInteractions, 
  trackValidationErrors 
}: {
  children: React.ReactNode;
  formName: string;
  trackFieldInteractions: boolean;
  trackValidationErrors: boolean;
}) {
  return (
    <FormContext.Provider value={{ formName, trackFieldInteractions, trackValidationErrors }}>
      {children}
    </FormContext.Provider>
  );
}

export function AnalyticsInput({
  label,
  error,
  fieldName,
  className = '',
  onFocus,
  onBlur,
  onChange,
  ...props
}: AnalyticsInputProps) {
  const context = React.useContext(FormContext);
  const { trackEvent } = useAnalytics({ trackPageView: false, trackScrollDepth: false });
  const { trackFocus } = useInteractionTracking();
  const [focusStartTime, setFocusStartTime] = useState<number | null>(null);

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    setFocusStartTime(Date.now());
    
    if (context?.trackFieldInteractions) {
      trackFocus(`${context.formName}_${fieldName}`);
      
      trackEvent({
        action: 'field_focus',
        category: 'form_interaction',
        label: `${context.formName}_${fieldName}`,
        customParameters: {
          form_name: context.formName,
          field_name: fieldName,
          field_type: props.type || 'text',
        },
      });
    }

    if (onFocus) {
      onFocus(event);
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (focusStartTime && context?.trackFieldInteractions) {
      const focusDuration = Date.now() - focusStartTime;
      
      trackEvent({
        action: 'field_blur',
        category: 'form_interaction',
        label: `${context.formName}_${fieldName}`,
        value: focusDuration,
        customParameters: {
          form_name: context.formName,
          field_name: fieldName,
          focus_duration: focusDuration,
          field_value_length: event.target.value.length,
        },
      });
    }

    if (onBlur) {
      onBlur(event);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (context?.trackFieldInteractions) {
      trackEvent({
        action: 'field_change',
        category: 'form_interaction',
        label: `${context.formName}_${fieldName}`,
        customParameters: {
          form_name: context.formName,
          field_name: fieldName,
          field_value_length: event.target.value.length,
        },
      });
    }

    if (onChange) {
      onChange(event);
    }
  };

  const baseInputStyles = 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200';
  const errorStyles = error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : '';

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        className={`${baseInputStyles} ${errorStyles} ${className}`}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        {...props}
      />
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-600"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}

export function AnalyticsTextarea({
  label,
  error,
  fieldName,
  className = '',
  onFocus,
  onBlur,
  onChange,
  ...props
}: AnalyticsTextareaProps) {
  const context = React.useContext(FormContext);
  const { trackEvent } = useAnalytics({ trackPageView: false, trackScrollDepth: false });
  const { trackFocus } = useInteractionTracking();
  const [focusStartTime, setFocusStartTime] = useState<number | null>(null);

  const handleFocus = (event: React.FocusEvent<HTMLTextAreaElement>) => {
    setFocusStartTime(Date.now());
    
    if (context?.trackFieldInteractions) {
      trackFocus(`${context.formName}_${fieldName}`);
      
      trackEvent({
        action: 'field_focus',
        category: 'form_interaction',
        label: `${context.formName}_${fieldName}`,
        customParameters: {
          form_name: context.formName,
          field_name: fieldName,
          field_type: 'textarea',
        },
      });
    }

    if (onFocus) {
      onFocus(event);
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLTextAreaElement>) => {
    if (focusStartTime && context?.trackFieldInteractions) {
      const focusDuration = Date.now() - focusStartTime;
      
      trackEvent({
        action: 'field_blur',
        category: 'form_interaction',
        label: `${context.formName}_${fieldName}`,
        value: focusDuration,
        customParameters: {
          form_name: context.formName,
          field_name: fieldName,
          focus_duration: focusDuration,
          field_value_length: event.target.value.length,
        },
      });
    }

    if (onBlur) {
      onBlur(event);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (context?.trackFieldInteractions) {
      trackEvent({
        action: 'field_change',
        category: 'form_interaction',
        label: `${context.formName}_${fieldName}`,
        customParameters: {
          form_name: context.formName,
          field_name: fieldName,
          field_value_length: event.target.value.length,
        },
      });
    }

    if (onChange) {
      onChange(event);
    }
  };

  const baseTextareaStyles = 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200 resize-vertical';
  const errorStyles = error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : '';

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <textarea
        className={`${baseTextareaStyles} ${errorStyles} ${className}`}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        {...props}
      />
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-600"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}