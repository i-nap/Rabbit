import React from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  type = 'text',
}) => {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
      />
    </div>
  );
};
