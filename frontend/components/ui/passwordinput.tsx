'use client';
import { useState } from 'react';
import { Input } from './input';
import { Button } from './button';
import { Label } from './label';

interface PasswordInputProps {
    id: string;
    label: string;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({ id, label }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={showPassword ? 'text' : 'password'}
          className="pr-12 w-full"
        />
        <Button
          type="button"
          variant="ghost"
          className="absolute inset-y-0 right-0 flex items-center pr-3"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? '🙈' : '👁️'}
        </Button>
      </div>
    </div>
  );
};
