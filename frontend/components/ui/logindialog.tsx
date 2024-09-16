'use client';

import * as React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";  // Import useDispatch
import axios from "axios";
import { loginSuccess } from "@/app/slices/userSlice";  // Import the loginSuccess action
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./dialog";
import { Button } from "./button";
import { Input } from "./input";
import { Checkbox } from "./checkbox";
import { Label } from "./label";

export interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LoginDialog: React.FC<LoginDialogProps> = ({ open, onOpenChange }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();  // Get the dispatch function from Redux

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  // Handle form submission for login
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post("http://localhost:8080/api/auth/login", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        const { token, username, email, profilePicture,firstName,lastName,createdAt,tokenExpiration } = response.data;
        const userInfo = { username, email, profilePicture, firstName, lastName, createdAt};
        const expirationDate = new Date(tokenExpiration).getTime();  // Convert to timestamp if needed

        // Store the JWT token in localStorage
        localStorage.setItem("jwt", token);
        localStorage.setItem("tokenExpiration", tokenExpiration); // Save expiration time in localStorage
        localStorage.setItem("userInfo", JSON.stringify(userInfo));

        console.log("Received token:", token);
        console.log("Received userInfo:", userInfo);
        // Dispatch loginSuccess action to Redux
        dispatch(loginSuccess({ token, userInfo, tokenExpiration: expirationDate }));

        alert("Login successful!");
        onOpenChange(false); // Close the dialog after successful login
      }
    } catch (err) {
      setError("Invalid email or password. Please try again.");
      console.error("Error during login:", err);
    }
  };

  const handleGoogleSignIn = () => {
    console.log("Google Sign-In clicked");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto hide-scrollbar">
        <h1 className="font-bold font-lato">Rabbit.</h1>
        <DialogHeader>
          <DialogTitle className="font-head text-2xl text-text mt-[1rem] ">Login to Your Account</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-[1rem] w-full">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-left font-lato text-text">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className={`col-span-3 ${error ? "border-red-500" : "border-gray-300"} border`}
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
                className={`col-span-3 ${error ? "border-red-500" : "border-gray-300"} border`} 
                required
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Display error message if login fails */}
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <div className="flex justify-between mt-[8px]">
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" />
              <label
                htmlFor="remember"
                className="text-[16px] font-lato peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remember me
              </label>
            </div>
            <a
              href="#"
              className="text-[16px] hover:text-gray-500 transition-all duration-200 ease-in-out"
            >
              Forgot Password?
            </a>
          </div>
          <DialogFooter className="space-y-4 mt-[8px]">
            <Button type="submit" className="w-full">
              Login
            </Button>
            <Button
              variant="outline"
              onClick={handleGoogleSignIn}
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
          </DialogFooter>
        </form>
        <span className="font-lato text-[16px] text-gray-500 mb-[1rem] block">
          Don&apos;t have an account?{" "}&nbsp;
          <a
            href="/signup"
            className="hover:text-gray-500 transition-all duration-200 ease-in-out text-black"
          >
            Signup
          </a>
        </span>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
