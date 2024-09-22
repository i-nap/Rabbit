// app/verify-otp/page.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { useRouter } from 'next/navigation'; // For navigation

export default function VerifyOtpPage() {
  const [username, setUsername] = useState('');
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post('http://localhost:8080/api/otp/verify-otp', { username, otp });
      toast({
        title: 'Success!',
        description: 'Your account has been verified. You can now log in.',
      });
      router.push('/login'); // Redirect to the login page after successful OTP verification
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Invalid or expired OTP. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      await axios.post('http://localhost:8080/api/otp/resend-otp', { email: username });
      toast({
        title: 'OTP Resent!',
        description: 'A new OTP has been sent to your email.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to resend OTP. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md shadow-lg rounded-lg bg-white p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Verify OTP</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="otp">OTP</Label>
            <Input id="otp" value={otp} onChange={(e) => setOtp(e.target.value)} required />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Verifying...' : 'Verify OTP'}
          </Button>

          <Button variant="outline" className="w-full mt-4" onClick={handleResendOtp}>
            Resend OTP
          </Button>
        </form>
      </div>
    </div>
  );
}
