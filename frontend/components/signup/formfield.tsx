import React from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  className = '',
  placeholder, // Default to an empty string
  disabled = false
}) => {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        value={value}  
        onChange={onChange}
        className={className}
        placeholder={placeholder || ''} // Default to an empty string
      disabled={disabled}
      />
    </div>
  );
};
