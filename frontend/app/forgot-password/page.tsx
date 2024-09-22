// app/forgot-password/page.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { useRouter } from 'next/navigation'; // For navigation

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter(); // For navigation after success

  // Handle request for OTP
  const handleSendOtp = async () => {
    setIsSubmitting(true);
    try {
      await axios.post('http://localhost:8080/api/auth/forgot-password', { email });
      toast({
        title: 'OTP Sent',
        description: 'An OTP has been sent to your email for password reset.',
      });
      setIsOtpSent(true);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send OTP. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle password reset with OTP
  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post('http://localhost:8080/api/auth/reset-password', {
        email,
        otp,
        newPassword,
      });
      toast({
        title: 'Password Reset Successful',
        description: 'Your password has been reset. Please log in with your new password.',
      });
      router.push('/?login=true'); // Redirect to login page
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reset password. Please check the OTP and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md shadow-lg rounded-lg bg-white p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isOtpSent ? 'Reset Password' : 'Forgot Password'}
        </h2>
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isOtpSent} // Disable email field after OTP is sent
            />
          </div>

          {isOtpSent && (
            <>
              <div>
                <Label htmlFor="otp">OTP</Label>
                <Input
                  id="otp"
                  placeholder="Enter the OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          <Button
            type={isOtpSent ? 'submit' : 'button'}
            className="w-full"
            onClick={!isOtpSent ? handleSendOtp : undefined}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : isOtpSent ? 'Reset Password' : 'Send OTP'}
          </Button>
        </form>
      </div>
    </div>
  );
}
