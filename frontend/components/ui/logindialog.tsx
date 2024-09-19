'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { loginSuccess } from '@/app/slices/userSlice'; // Import the loginSuccess action from Redux
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './dialog';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { signIn, signOut, useSession } from 'next-auth/react'; // Import NextAuth signIn, signOut, and useSession

export interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LoginDialog: React.FC<LoginDialogProps> = ({ open, onOpenChange }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession(); // Get session data from NextAuth
  const dispatch = useDispatch(); // Redux dispatch for handling login success
  const [backendToken, setBackendToken] = useState<string | null>(null); // Store JWT from the backend
  const [needsUsername, setNeedsUsername] = useState<boolean>(false); // Check if we need a username
  const [username, setUsername] = useState<string>(''); // Store the new username

  // Handle input changes for email/password login form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  // Handle form submission for email/password login
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        const { token, userId, username, email, profilePicture, firstName, lastName, createdAt, tokenExpiration } = response.data;
        const userInfo = { userId, username, email, profilePicture, firstName, lastName, createdAt };
        const expirationDate = new Date(tokenExpiration).getTime(); // Convert to timestamp if needed

        // Store JWT token in localStorage
        localStorage.setItem('jwt', token);
        localStorage.setItem('tokenExpiration', tokenExpiration); // Save expiration time
        localStorage.setItem('userInfo', JSON.stringify(userInfo));

        console.log('Received token:', token);
        console.log('Received userInfo:', userInfo);

        // Dispatch loginSuccess action to Redux
        dispatch(loginSuccess({ token, userInfo, tokenExpiration: expirationDate }));

        alert('Login successful!');
        onOpenChange(false); // Close the dialog
      }
    } catch (err) {
      setError('Invalid email or password. Please try again.');
      console.error('Error during login:', err);
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
            email: session.user?.email || '',  // Safely access user email with fallback
            name: session.user?.name || '',    // Safely access user name with fallback
            picture: session.user?.image || '', // Safely access user profile picture with fallback
          };

          // Post user information to the backend
          const response = await axios.post('http://localhost:8080/api/auth/oauth/google', userInfo);

          if (response.status === 200) {
            const { token, userId, username, email, profilePicture, firstName, lastName, createdAt, tokenExpiration } = response.data;
            const userInfo = { userId, username, email, profilePicture, firstName, lastName, createdAt };
            localStorage.setItem('jwt', token);
            localStorage.setItem('tokenExpiration', tokenExpiration); // Save expiration time
            localStorage.setItem('userInfo', JSON.stringify(userInfo));
            console.log('JWT from backend:', userInfo);
            dispatch(loginSuccess({ token, userInfo, tokenExpiration: tokenExpiration }));
          } else {
            setError('Failed to authenticate with the backend');
          }
        } catch (error) {
          setError('Backend authentication failed');
        }
      }
    };

    authenticateWithBackend();
  }, [session]);

  // Trigger Google sign-in using NextAuth.js
  const handleGoogleSignIn = () => {
    signIn('google');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        aria-describedby="dialog-description"
        className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto hide-scrollbar"
      >
        <h1 className="font-bold font-lato">Rabbit.</h1>
        <DialogHeader>
          <DialogTitle className="font-head text-2xl text-text mt-[1rem]">
            Login to Your Account
          </DialogTitle>
        </DialogHeader>
          <form onSubmit={handleSubmit}>
            {/* Email and password form */}
            <div className="grid gap-4 py-[1rem] w-full">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-left font-lato text-text">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className={`col-span-3 ${error ? 'border-red-500' : 'border-gray-300'} border`}
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4 font-lato text-text">
                <Label htmlFor="password" className="text-left">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className={`col-span-3 ${error ? 'border-red-500' : 'border-gray-300'} border`}
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Error message if login fails */}
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

            <DialogFooter className="space-y-4 mt-[8px]">
              <Button type="submit" className="w-full">
                Login
              </Button>

              {/* Google Login Button */}
              <Button onClick={handleGoogleSignIn} className="w-full">
                Sign in with Google
              </Button>
            </DialogFooter>
          </form>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
