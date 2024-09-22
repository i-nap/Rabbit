'use client';

import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { FormField } from './formfield';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp';
import axios from 'axios';
import { PasswordInput } from '../ui/passwordinput';
import { useRouter } from 'next/navigation'; // Use from next/navigation in Next.js 13+
import { signIn, signOut,useSession } from 'next-auth/react'; // Import NextAuth signIn, signOut

export default function SignupForm() {
  const router = useRouter();
  const { data: session } = useSession(); // Get session data from NextAuth

  const handleLoginClick = () => {
    const url = `/?login=true`; // Construct URL for login redirection
    router.push(url); // Push the constructed URL
  };

  const [formData, setFormData] = useState({
    fName: '',
    lName: '',
    username: '',
    email: '',
    password: '',
    cpassword: '',
  });

  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [otpError, setOtpError] = useState<string | null>(null); // Track OTP-specific errors
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Track form submission state

  // Handle input field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
    setErrors({});
  };

  // Form validation function
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.fName) newErrors.fName = 'First name is required';
    if (!formData.lName) newErrors.lName = 'Last name is required';
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.cpassword) newErrors.cpassword = 'Passwords must match';

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission (registration)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true); // Start the submission process

    if (!validateForm()) return;

    if (!isOtpSent) {
      // Registration request
      try {
        const response = await axios.post('http://localhost:8080/api/auth/register', formData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log(response.data);
        setIsOtpSent(true); // OTP has been sent
        setIsSubmitting(false); // Stop the submission process

      } catch (error: any) {
        if (error.response?.data.includes('Username')) {
          setErrors({ username: 'Username is already taken.' });
        }
        if (error.response?.data.includes('Email')) {
          setErrors({ email: 'Email is already registered.' });
        }
        setIsSubmitting(false); // Stop the submission process on error

      }
    } else {
      // OTP verification request
      try {
        const response = await axios.post('http://localhost:8080/api/auth/verify-otp', {
          username: formData.username,
          otp: otp,
        });
        if (response.status === 200) {
          setIsOtpVerified(true);
          setTimeout(() => {
            alert('Signup successful! Please log in.');
            router.push('/');
          }, 1500); // Redirect with a short delay
        } else {
          setOtpError('Invalid or expired OTP. Please try again.');
        }
        setIsSubmitting(false); // Stop the submission process

      } catch (error) {
        setOtpError('Error verifying OTP. Please try again.');
        console.error('Error during OTP verification:', error);
      }
      setIsSubmitting(false); // Stop the submission process on error

    }
  };


  // Authenticate with the backend after Google login
  useEffect(() => {
    const authenticateWithBackend = async () => {
      if (session && session.accessToken && session.user) {
        try {
          // Prepare the data to send to the backend
          const userInfo = {
            idToken: session.accessToken, // Send the Google accessToken to the backend
            email: session.user?.email || '',
            name: session.user?.name || '',
            picture: session.user?.image || '',
          };

          // Post user information to the backend
          await axios.post('http://localhost:8080/api/auth/oauth/google', userInfo);
          await signOut({ redirect: false });

          // After backend authentication, redirect the user to the login page
          router.push('/');
          alert('Signup successful! Please log in.');
        } catch (error) {
          setError('Backend authentication failed');
        }
      }
    };

    authenticateWithBackend();
  }, [session, router]);

  // Trigger Google sign-in using NextAuth.js
  const handleGoogleSignIn = () => {
    signIn('google', { redirect: false }) // Prevent redirect
  };

  return (
    <>
      {!isOtpVerified ? (
        <form onSubmit={handleSubmit} className={!isOtpSent ? 'grid grid-cols-1 gap-6 md:grid-cols-2' : 'flex flex-col items-center justify-center w-full'}>
          {/* Registration Fields */}
          {!isOtpSent ? (
            <>
              <FormField
                id="fName"
                label="First Name"
                type="text"
                value={formData.fName}
                onChange={handleChange}
                className={`${errors.fName ? 'border-red-500' : 'border-gray-300'} border`}
              />

              <FormField
                id="lName"
                label="Last Name"
                type="text"
                value={formData.lName}
                onChange={handleChange}
                className={`${errors.lName ? 'border-red-500' : 'border-gray-300'} border`}
              />

              <FormField
                id="username"
                label="Username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                className={`${errors.username ? 'border-red-500' : 'border-gray-300'} border`}
              />

              <FormField
                id="email"
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`${errors.email ? 'border-red-500' : 'border-gray-300'} border`}
              />

              <PasswordInput
                id="password"
                label="Password"
                value={formData.password}
                onChange={handleChange}
                className={`${errors.password ? 'border-red-500' : 'border-gray-300'} border`}
              />

              <PasswordInput
                id="cpassword"
                label="Confirm Password"
                value={formData.cpassword}
                onChange={handleChange}
                className={`${errors.cpassword ? 'border-red-500' : 'border-gray-300'} border`}
              />

              <div className="col-span-1 md:col-span-2">
              <Button type="submit" className="w-full mb-[8px]" disabled={isSubmitting}>
                  {isSubmitting ? 'Processing...' : 'Create Account'}
                </Button>                <Button
                  onClick={handleGoogleSignIn}
                  variant="outline"
                  className="w-full flex items-center justify-center space-x-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="24px" height="24px">
                    <g id="Layer_1">
                      <rect x="15" y="13" width="10" height="4" />
                      <path d="M22.733,13C22.899,13.641,23,14.307,23,15c0,4.418-3.582,8-8,8s-8-3.582-8-8s3.582-8,8-8
                    c2.009,0,3.84,0.746,5.245,1.969l2.841-2.84C20.952,4.185,18.116,3,15.003,3C8.374,3,3,8.373,3,15s5.374,12,12.003,12
                    c10.01,0,12.266-9.293,11.327-14H22.733z"/>
                    </g>
                  </svg>
                  <span>Sign in with Google</span>
                </Button>
                <div className="flex ">
                  {errors.fName && <p className="text-red-500 text-sm mt-1">{errors.fName}</p>}
                  {errors.lName && <p className="text-red-500 text-sm mt-1">{errors.lName}</p>}
                  {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                  {errors.cpassword && <p className="text-red-500 text-sm mt-1">{errors.cpassword}</p>}
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <span className="font-lato text-[16px] text-gray-500 mb-[1rem] block">
                  Already have an account?&nbsp;
                  <a
                    href="#"
                    onClick={handleLoginClick}
                    className="hover:text-gray-500 transition-all duration-200 ease-in-out text-black"
                  >
                    Login
                  </a>
                </span>
              </div>
            </>
          ) : (
            <>
              {/* OTP Input Section */}
              <div className="space-y-2 flex flex-col w-full items-center">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(value) => setOtp(value)} // Handle OTP input change
                >
                  <InputOTPGroup>
                    {[...Array(6)].map((_, index) => (
                      <InputOTPSlot key={index} index={index} />
                    ))}
                  </InputOTPGroup>
                </InputOTP>

                {otpError && <p className="text-red-500 text-sm">{otpError}</p>}

                <div className="w-full max-w-xs">
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Processing...' : 'Verify OTP'}
                  </Button>                </div>
              </div>
            </>
          )}
        </form>
      ) : (
        <p className="text-center text-green-600">Signup successful! You can now log in.</p>
      )}
    </>
  );
}
